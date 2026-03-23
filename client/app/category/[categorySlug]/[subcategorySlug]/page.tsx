import React from 'react';

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
    <div className="container mx-auto px-4 py-8 mt-24 min-h-[60vh]">
      <div className="text-sm text-gray-500 mb-4 dark:text-gray-400">
        Home &gt; {categoryTitle} &gt; {subCategoryTitle}
      </div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">{subCategoryTitle}</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Products for {subCategoryTitle} under {categoryTitle} will be displayed here. (Design will be done later)
      </p>
    </div>
  );
}
