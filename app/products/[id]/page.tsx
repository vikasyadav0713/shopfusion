import { prisma } from "@/lib/prisma";
import { getProductImage } from "@/lib/getProductImage";
import { AddToCartButton } from "@/components/CartItem";
import { notFound } from "next/navigation";
import ImageZoom from "@/components/ImageZoom";
import WishlistButton from "@/components/WishlistButton";
import ProductReviews from "@/components/ProductReviews";
import RatingStars from "@/components/RatingStars";
import RecentlyViewedTracker from "@/components/RecentlyViewedTracker";
import RecentlyViewed from "@/components/RecentlyViewed";

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
    <div className="p-6 max-w-5xl mx-auto transition-colors duration-300">
      <RecentlyViewedTracker product={{ ...product, image: resolvedImage }} />

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="w-full h-[400px] md:h-[500px] relative">
          <ImageZoom
            name={product.name}
            src={resolvedImage}
            alt={product.name}
            category={product.category}
            className="w-full h-full"
          />
        </div>

        {/* Product Details */}
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">{product.name}</h1>
              {product.reviewCount > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <RatingStars rating={product.averageRating} size={18} />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors">
                    {product.averageRating.toFixed(1)} ({product.reviewCount} Reviews)
                  </span>
                </div>
              )}
            </div>
            <WishlistButton
              productId={product.id}
              className="h-12 w-12 shrink-0 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
            />
          </div>

          <p className="text-slate-600 dark:text-slate-300 mt-6 leading-relaxed transition-colors">{product.description}</p>

          <p className="text-3xl font-bold mt-6 text-slate-900 dark:text-white transition-colors">
            ₹{product.price}
          </p>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 transition-colors">
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

      {/* Reviews Section */}
      <ProductReviews
        productId={product.id}
        averageRating={product.averageRating}
        reviewCount={product.reviewCount}
      />

      {/* Recently Viewed Section */}
      <RecentlyViewed />
    </div>
  );
}