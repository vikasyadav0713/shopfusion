import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reviewId = Number(params.id);
    if (isNaN(reviewId)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
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

    // Update the review
    const updatedReview = await prisma.review.updateMany({
      where: {
        id: reviewId,
        userId, // Ensures they can only edit their own review
      },
      data: {
        rating,
        title,
        text,
      },
    });

    if (updatedReview.count === 0) {
      return NextResponse.json({ error: "Review not found or unauthorized" }, { status: 404 });
    }

    // We need the productId to recalculate averages
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (review) {
      const aggregations = await prisma.review.aggregate({
        where: { productId: review.productId },
        _avg: { rating: true },
      });

      await prisma.product.update({
        where: { id: review.productId },
        data: { averageRating: aggregations._avg.rating || 0 },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reviewId = Number(params.id);
    if (isNaN(reviewId)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }

    // Get the review to find productId
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review || review.userId !== userId) {
      return NextResponse.json({ error: "Review not found or unauthorized" }, { status: 404 });
    }

    // Delete review
    await prisma.review.delete({
      where: { id: reviewId },
    });

    // Recalculate averages
    const aggregations = await prisma.review.aggregate({
      where: { productId: review.productId },
      _avg: { rating: true },
      _count: { id: true },
    });

    await prisma.product.update({
      where: { id: review.productId },
      data: {
        averageRating: aggregations._avg.rating || 0,
        reviewCount: aggregations._count.id || 0,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
