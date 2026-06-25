import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// DELETE /api/wishlist/[productId] - Remove a product from the wishlist
export async function DELETE(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const productId = Number(params.productId);

    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
    }

    // Attempt to delete the specific wishlist entry for this user and product
    try {
      await prisma.wishlist.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      return NextResponse.json({ success: true, message: "Removed from wishlist" }, { status: 200 });
    } catch (dbError: any) {
      // Prisma error P2025 means record to delete does not exist
      if (dbError.code === "P2025") {
        return NextResponse.json({ error: "Product not found in wishlist" }, { status: 404 });
      }
      throw dbError;
    }
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
