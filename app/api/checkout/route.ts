import { NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";

type CheckoutItem = {
  id: number;
  quantity: number;
};

type CheckoutPayload = {
  items: CheckoutItem[];
  totalAmount: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CheckoutPayload>;

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    if (typeof body.totalAmount !== "number" || !Number.isFinite(body.totalAmount)) {
      return NextResponse.json({ error: "Invalid total amount" }, { status: 400 });
    }

    const amountInPaise = Math.round(body.totalAmount * 100);

    if (amountInPaise <= 0) {
      return NextResponse.json({ error: "Amount must be greater than 0" }, { status: 400 });
    }

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `shopfusion_${Date.now()}`,
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("Missing Razorpay environment variables")) {
      return NextResponse.json(
        {
          error:
            "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "Failed to create checkout order" }, { status: 500 });
  }
}
