import React from 'react';
import ProductListingTemplate from "@/components/global/ProductListingTemplate";
import Navbar from "@/components/global/navbar/navbarSection";
import FooterSection from "@/components/global/FooterSection";

interface SubCategoryPageProps {
  params: Promise<{
    categorySlug: string;
    subcategorySlug: string;
  }>;
}

export default async function SubCategoryPage({ params }: SubCategoryPageProps) {
  const resolvedParams = await params;
  
  // Format the slug back to a readable title
  const formatSlug = (slug: string) => {
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const categoryTitle = formatSlug(resolvedParams.categorySlug);
  const subCategoryTitle = formatSlug(resolvedParams.subcategorySlug);

  return (
    <div className="flex w-full max-w-full flex-1 flex-col items-center">
      <Navbar />
      <div className="w-full">
        {/* Pass the subcategory as the title */}
        <ProductListingTemplate categoryTitle={subCategoryTitle} />
      </div>
      <FooterSection className="w-full self-stretch" />
    </div>
  );
}
