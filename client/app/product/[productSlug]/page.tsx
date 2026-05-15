import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/Footer";
import { getProductBySlug, getRelatedProducts, apiProductToDetail } from "@/lib/product-data";
import { getProduct } from "@/lib/catalog-api";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductSpecifications from "@/components/product/ProductSpecifications";
import RelatedProducts from "@/components/product/RelatedProducts";
import StickyBottomBar from "@/components/product/StickyBottomBar";
import ReviewSection from "@/components/product/ReviewSection";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import type { ProductDetail } from "@/lib/types";

interface ProductPageProps {
  params: Promise<{ productSlug: string }>;
}

async function resolveProduct(slug: string): Promise<ProductDetail | undefined> {
  try {
    return apiProductToDetail(await getProduct(slug));
  } catch {
    return getProductBySlug(slug);
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { productSlug } = await params;
  const product = await resolveProduct(productSlug);
  if (!product) return { title: "Product Not Found | VolteX" };
  return {
    title: `${product.title} | VolteX`,
    description: `Buy ${product.title} at best price. ${product.discount} off. ${product.warranty ?? ""}`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productSlug } = await params;
  const product = await resolveProduct(productSlug);
  if (!product) notFound();

  const relatedProducts = getRelatedProducts(product.relatedProductIds);

  return (
    <div className="flex w-full max-w-full flex-1 flex-col items-center bg-[#0f0f0f]">
      <Navbar />
      <div className="w-full">
        <div className="mx-auto max-w-[1400px] px-4 pb-28 pt-6 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild
                  className="text-white/50 hover:text-white/70"
                >
                  <Link href="/">{product.category}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/30" />
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild
                  className="text-white/50 hover:text-white/70"
                >
                  <Link href={`/category/${product.categorySlug}`}>
                    {product.subcategory ?? product.category}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/30" />
              <BreadcrumbItem>
                <BreadcrumbPage className="max-w-[200px] truncate text-xs font-normal text-white/50 sm:max-w-none">
                  {product.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Main: Image Gallery + Product Info */}
          <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:gap-12">
            <div className="lg:w-[50%]">
              <div className="lg:sticky lg:top-24">
                <ProductImageGallery
                  images={product.images}
                  title={product.title}
                />
              </div>
            </div>
            <div className="lg:w-[50%]">
              <ProductInfo product={product} />
            </div>
          </div>

          {/* Specifications & Overview */}
          <div className="mb-12">
            <ProductSpecifications
              specGroups={product.specGroups}
              overview={product.overview}
            />
          </div>

          {/* Ratings & Reviews — only for real API products (UUID ids) */}
          {product.id && product.id.length > 10 && (
            <ReviewSection productId={product.id} />
          )}

          {/* Related Products */}
          <RelatedProducts products={relatedProducts} />
        </div>
      </div>
      <Footer className="w-full self-stretch" />
      <StickyBottomBar product={product} />
    </div>
  );
}
