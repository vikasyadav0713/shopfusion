import { prisma } from "@/lib/prisma";
import { getProductImage } from "@/lib/getProductImage";
import { AddToCartButton } from "@/components/CartItem";
import { notFound } from "next/navigation";
import ProductImage from "@/components/ProductImage";

type Props = {
  params: { id: string };
};

export default async function ProductPage({ params }: Props) {
  const productId = Number(params.id);

  if (!Number.isInteger(productId)) {
    return notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) return notFound();

  // Resolve the correct local image path server-side
  const resolvedImage = getProductImage(product.name);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="w-full h-[400px] relative">
          <ProductImage
            name={product.name}
            src={resolvedImage}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover rounded-lg"
            priority
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p className="text-gray-600 mt-4">{product.description}</p>

          <p className="text-2xl font-semibold mt-4">
            ₹{product.price}
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Stock: {product.stock}
          </p>

          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: resolvedImage,
            }}
          />
        </div>
      </div>
    </div>
  );
}