import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const productId = Number(params.id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const sort = searchParams.get("sort") || "recent"; // recent, highest, lowest, helpful
    const page = Number(searchParams.get("page")) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    let orderBy: any = { createdAt: "desc" };
    if (sort === "highest") orderBy = { rating: "desc" };
    if (sort === "lowest") orderBy = { rating: "asc" };
    if (sort === "helpful") orderBy = { helpfulCount: "desc" };

    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy,
      skip,
      take: limit,
      // For a real app with Clerk, you would fetch user metadata here or sync it to your DB.
      // Since we only have userId (string), the client will fetch/display it, or we can just return it.
    });

    const total = await prisma.review.count({ where: { productId } });

    return NextResponse.json({
      reviews,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const productId = Number(params.id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const body = await req.json();
    const { rating, title, text } = body;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }
    if (!text || text.length < 20 || text.length > 1000) {
      return NextResponse.json({ error: "Review text must be between 20 and 1000 characters" }, { status: 400 });
    }

    // Verify Purchase
    const hasPurchased = await prisma.order.findFirst({
      where: {
        userId,
        items: {
          some: { productId },
        },
      },
    });

    if (!hasPurchased) {
      return NextResponse.json({ error: "You must purchase this product to leave a review." }, { status: 403 });
    }

    // Create Review
    try {
      const review = await prisma.review.create({
        data: {
          userId,
          productId,
          rating,
          title,
          text,
          verifiedPurchase: true, // They passed the check
        },
      });

      // Update Product Averages
      const aggregations = await prisma.review.aggregate({
        where: { productId },
        _avg: { rating: true },
        _count: { id: true },
      });

      await prisma.product.update({
        where: { id: productId },
        data: {
          averageRating: aggregations._avg.rating || 0,
          reviewCount: aggregations._count.id || 0,
        },
      });

      return NextResponse.json(review, { status: 201 });
    } catch (dbError: any) {
      if (dbError.code === "P2002") {
        return NextResponse.json({ error: "You have already reviewed this product." }, { status: 409 });
      }
      throw dbError;
    }
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
