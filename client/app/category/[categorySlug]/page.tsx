import React from 'react';
import ProductListingTemplate from "@/components/global/ProductListingTemplate";
import Navbar from "@/components/global/navbar/navbarSection";
import FooterSection from "@/components/global/FooterSection";

interface CategoryPageProps {
  params: Promise<{
    categorySlug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  
  // Format the slug back to a readable title (optional, you will probably fetch from DB later)
  const formatSlug = (slug: string) => {
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const title = formatSlug(resolvedParams.categorySlug);

  return (
    <div className="flex w-full max-w-full flex-1 flex-col items-center">
      <Navbar />
      <div className="w-full">
        <ProductListingTemplate categoryTitle={title} />
      </div>
      <FooterSection className="w-full self-stretch" />
    </div>
  );
}
