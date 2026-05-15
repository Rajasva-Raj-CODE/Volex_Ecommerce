import ProductListingTemplate from "@/components/shared/ProductListingTemplate";
import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Search — VolteX",
  description: "Search for electronics, appliances, and more at VolteX.",
};

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolved = await searchParams;
  const query = typeof resolved.q === "string"
    ? resolved.q
    : Array.isArray(resolved.q)
      ? resolved.q[0] ?? ""
      : "";

  const title = query ? `Search results for "${query}"` : "Search";

  return (
    <div className="flex w-full max-w-full flex-1 flex-col items-center bg-[#0f0f0f]">
      <Navbar />
      <div className="w-full">
        <ProductListingTemplate categoryTitle={title} searchQuery={query} />
      </div>
      <Footer className="w-full self-stretch" />
    </div>
  );
}
