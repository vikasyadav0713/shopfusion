import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reviewId = Number(params.id);
    if (isNaN(reviewId)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }

    // Check if the user already voted for this review
    const existingVote = await prisma.helpfulVote.findUnique({
      where: {
        userId_reviewId: {
          userId,
          reviewId,
        },
      },
    });

    if (existingVote) {
      // If already voted, remove vote (toggle behavior)
      await prisma.$transaction([
        prisma.helpfulVote.delete({ where: { id: existingVote.id } }),
        prisma.review.update({
          where: { id: reviewId },
          data: { helpfulCount: { decrement: 1 } },
        }),
      ]);
      return NextResponse.json({ action: "removed" }, { status: 200 });
    }

    // Otherwise, add a vote
    await prisma.$transaction([
      prisma.helpfulVote.create({
        data: {
          userId,
          reviewId,
        },
      }),
      prisma.review.update({
        where: { id: reviewId },
        data: { helpfulCount: { increment: 1 } },
      }),
    ]);
    
    return NextResponse.json({ action: "added" }, { status: 200 });
  } catch (error) {
    console.error("Error toggling helpful vote:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
