import React from 'react';
import ProductListingTemplate from "@/components/shared/ProductListingTemplate";
import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/Footer";

interface SubCategoryPageProps {
  params: Promise<{
    categorySlug: string;
    subcategorySlug: string;
  }>;
}

export default async function SubCategoryPage({ params }: SubCategoryPageProps) {
  const resolvedParams = await params;

  const formatSlug = (slug: string) => {
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const subCategoryTitle = formatSlug(resolvedParams.subcategorySlug);

  return (
    <div className="flex w-full max-w-full flex-1 flex-col items-center bg-[#0f0f0f]">
      <Navbar />
      <div className="w-full">
        <ProductListingTemplate categoryTitle={subCategoryTitle} />
      </div>
      <Footer className="w-full self-stretch" />
    </div>
  );
}
