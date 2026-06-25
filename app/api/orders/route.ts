import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type OrderItemPayload = {
  productId: number;
  quantity: number;
  price: number;
};

type OrderPayload = {
  userId: string;
  totalAmount: number;
  items: OrderItemPayload[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<OrderPayload>;

    if (!body.userId || typeof body.userId !== "string") {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    if (typeof body.totalAmount !== "number" || !Number.isFinite(body.totalAmount)) {
      return NextResponse.json({ error: "Invalid totalAmount" }, { status: 400 });
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    const items = body.items.filter(
      (item): item is OrderItemPayload =>
        typeof item.productId === "number" &&
        Number.isInteger(item.productId) &&
        typeof item.quantity === "number" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        typeof item.price === "number"
    );

    if (items.length !== body.items.length) {
      return NextResponse.json({ error: "Invalid items schema" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        userId: body.userId,
        totalAmount: body.totalAmount,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
