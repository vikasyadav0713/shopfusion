"use client";

import ProductImage from "@/components/ProductImage";
import { CartItem as CartItemType, useCartStore } from "@/store/useCartStore";

type CartItemProps = {
	item: CartItemType;
};

export function AddToCartButton({
	product,
	className,
}: {
	product: Omit<CartItemType, "quantity">;
	className?: string;
}) {
	const addToCart = useCartStore((state) => state.addToCart);

	return (
		<button
			type="button"
			onClick={() => addToCart(product)}
			className={
				className ??
				"mt-6 inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 text-white transition hover:bg-gray-800"
			}
		>
			Add to Cart
		</button>
	);
}

export default function CartItem({ item }: CartItemProps) {
	const removeFromCart = useCartStore((state) => state.removeFromCart);
	const increaseQuantity = useCartStore((state) => state.increaseQuantity);
	const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

	return (
		<div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
			<div className="relative h-24 w-full overflow-hidden rounded-xl bg-slate-100 sm:h-24 sm:w-32">
				<ProductImage name={item.name} src={item.image} alt={item.name} fill className="object-cover" />
			</div>

			<div className="flex flex-1 flex-col gap-2">
				<div className="flex items-start justify-between">
					<div>
						<h3 className="text-base font-semibold text-slate-900">{item.name}</h3>
						<p className="text-sm text-slate-500">${item.price.toFixed(2)}</p>
					</div>
					<button
						type="button"
						onClick={() => removeFromCart(item.id)}
						className="text-sm font-semibold text-rose-600 hover:text-rose-700"
					>
						Remove
					</button>
				</div>

				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={() => decreaseQuantity(item.id)}
						className="h-8 w-8 rounded-lg border border-slate-200 text-lg font-semibold text-slate-700 hover:bg-slate-50"
					>
						-
					</button>
					<span className="min-w-[2rem] text-center text-sm font-semibold text-slate-900">
						{item.quantity}
					</span>
					<button
						type="button"
						onClick={() => increaseQuantity(item.id)}
						className="h-8 w-8 rounded-lg border border-slate-200 text-lg font-semibold text-slate-700 hover:bg-slate-50"
					>
						+
					</button>
				</div>
			</div>
		</div>
	);
}
