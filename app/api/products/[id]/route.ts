import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ProductUpdatePayload = {
  name?: string;
  price?: number;
  description?: string;
  images?: string[];
  image?: string;
  stock?: number;
};

type RouteContext = {
  params: { id: string };
};

function parseProductId(id: string): number | null {
  const parsed = Number(id);
  if (!Number.isInteger(parsed)) return null;
  return parsed;
}

export async function GET(_request: Request, context: RouteContext) {
  const productId = parseProductId(context.params.id);

  if (!productId) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const productId = parseProductId(context.params.id);

  if (!productId) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  try {
    const body = (await request.json()) as ProductUpdatePayload;
    const data: ProductUpdatePayload = {};

    if (body.name !== undefined) {
      if (typeof body.name !== "string" || body.name.trim() === "") {
        return NextResponse.json({ error: "Invalid name" }, { status: 400 });
      }
      data.name = body.name;
    }

    if (body.price !== undefined) {
      if (typeof body.price !== "number" || !Number.isFinite(body.price)) {
        return NextResponse.json({ error: "Invalid price" }, { status: 400 });
      }
      data.price = body.price;
    }

    if (body.description !== undefined) {
      if (typeof body.description !== "string") {
        return NextResponse.json({ error: "Invalid description" }, { status: 400 });
      }
      data.description = body.description;
    }

    if (body.images !== undefined) {
      if (!Array.isArray(body.images)) {
        return NextResponse.json({ error: "Invalid images" }, { status: 400 });
      }
      const images = body.images.filter(
        (value): value is string => typeof value === "string" && value.trim() !== ""
      );
      if (images.length === 0) {
        return NextResponse.json({ error: "Invalid images" }, { status: 400 });
      }
      data.images = images;
    } else if (body.image !== undefined) {
      if (typeof body.image !== "string" || body.image.trim() === "") {
        return NextResponse.json({ error: "Invalid image" }, { status: 400 });
      }
      data.images = [body.image];
    }

    if (body.stock !== undefined) {
      if (typeof body.stock !== "number" || !Number.isInteger(body.stock)) {
        return NextResponse.json({ error: "Invalid stock" }, { status: 400 });
      }
      data.stock = body.stock;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    const existing = await prisma.product.findUnique({ where: { id: productId } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data,
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const productId = parseProductId(context.params.id);

  if (!productId) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  try {
    await prisma.product.delete({ where: { id: productId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
