import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { productId } = body;

    if (!productId) return new NextResponse("Product ID required", { status: 400 });

    // Upsert the recently viewed record
    await prisma.recentlyViewed.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {
        viewedAt: new Date(),
      },
      create: {
        userId,
        productId,
      },
    });

    // Keep only the 12 most recent for this user
    const recent = await prisma.recentlyViewed.findMany({
      where: { userId },
      orderBy: { viewedAt: "desc" },
    });

    if (recent.length > 12) {
      const toDelete = recent.slice(12).map((r) => r.id);
      await prisma.recentlyViewed.deleteMany({
        where: { id: { in: toDelete } },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("RECENTLY_VIEWED_POST_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const recent = await prisma.recentlyViewed.findMany({
      where: { userId },
      orderBy: { viewedAt: "desc" },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            category: true,
            averageRating: true,
            reviewCount: true,
          },
        },
      },
    });

    const formatted = recent.map((r) => ({
      ...r.product,
      viewedAt: r.viewedAt.getTime(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("RECENTLY_VIEWED_GET_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
