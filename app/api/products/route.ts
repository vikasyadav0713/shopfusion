import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ProductPayload = {
  name: string;
  price: number;
  description: string;
  images: string[];
  stock: number;
};

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ProductPayload>;

    const images = Array.isArray(body.images)
      ? body.images.filter((value): value is string => typeof value === "string" && value.trim() !== "")
      : typeof body.image === "string"
        ? [body.image]
        : [];

    if (
      !body.name ||
      typeof body.name !== "string" ||
      typeof body.price !== "number" ||
      !Number.isFinite(body.price) ||
      !body.description ||
      typeof body.description !== "string" ||
      images.length === 0 ||
      typeof body.stock !== "number" ||
      !Number.isInteger(body.stock)
    ) {
      return NextResponse.json({ error: "Invalid product payload" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        price: body.price,
        description: body.description,
        images,
        stock: body.stock,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
