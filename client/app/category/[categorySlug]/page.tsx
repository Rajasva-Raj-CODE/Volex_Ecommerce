import React from 'react';

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
    <div className="container mx-auto px-4 py-8 mt-24 min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">{title}</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Products for {title} will be displayed here. (Design will be done later)
      </p>
    </div>
  );
}
