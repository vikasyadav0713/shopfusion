import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET /api/wishlist - Get all wishlist items for the logged-in user
export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(wishlistItems);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/wishlist - Add a product to the wishlist
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId || typeof productId !== "number") {
      return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
    }

    // Check if the product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    try {
      const wishlistItem = await prisma.wishlist.create({
        data: {
          userId,
          productId,
        },
        include: {
          product: true,
        },
      });

      return NextResponse.json(wishlistItem, { status: 201 });
    } catch (dbError: any) {
      // Prisma error P2002 means unique constraint failed (already in wishlist)
      if (dbError.code === "P2002") {
        return NextResponse.json(
          { error: "Product is already in your wishlist" },
          { status: 409 } // 409 Conflict
        );
      }
      throw dbError;
    }
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
