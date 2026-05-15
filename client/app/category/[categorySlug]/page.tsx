import React from 'react';
import ProductListingTemplate from "@/components/shared/ProductListingTemplate";
import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/Footer";

interface CategoryPageProps {
  params: Promise<{
    categorySlug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;

  const formatSlug = (slug: string) => {
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const title = formatSlug(resolvedParams.categorySlug);

  return (
    <div className="flex w-full max-w-full flex-1 flex-col items-center bg-[#0f0f0f]">
      <Navbar />
      <div className="w-full">
        <ProductListingTemplate categoryTitle={title} categorySlug={resolvedParams.categorySlug} />
      </div>
      <Footer className="w-full self-stretch" />
    </div>
  );
}
