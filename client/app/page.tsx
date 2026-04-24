import Navbar from "@/components/layout/navbar/Navbar";
import HeroSection from "@/components/home/HeroSection";
import CategorySlider, { type CategorySliderItem } from "@/components/home/CategorySlider";
import BankOffers from "@/components/home/BankOffers";
import ProductShowcase from "@/components/home/ProductShowcase";
import WhatsHot from "@/components/home/WhatsHot";
import DealsOfDay from "@/components/home/DealsOfDay";
import FromVolteX from "@/components/home/FromVolteX";
import WarrantyBanner from "@/components/home/WarrantyBanner";
import UnboxedBlog from "@/components/home/UnboxedBlog";
import TataNeu from "@/components/home/TataNeu";
import CuratedSection from "@/components/home/CuratedSection";
import WhyVolteX from "@/components/home/WhyVolteX";
import BrandsCarousel from "@/components/home/BrandsCarousel";
import Footer from "@/components/layout/Footer";
import { listCategories } from "@/lib/catalog-api";

export default async function Home() {
  // Fetch top-level categories for the slider; fall back to defaults on error
  let categoryItems: CategorySliderItem[] | undefined;
  try {
    const categories = await listCategories();
    const topLevel = categories.filter((c) => !c.parentId && c.isActive);
    if (topLevel.length > 0) {
      categoryItems = topLevel.map((c) => ({
        id: c.slug,
        label: c.name,
        image: c.imageUrl ?? undefined,
      }));
    }
  } catch {
    // fall back to default items in CategorySlider
  }

  return (
    <div className="flex w-full max-w-full flex-1 flex-col items-center bg-[#0f0f0f]">
      <Navbar />
      <HeroSection />
      <CategorySlider items={categoryItems} />
      <BankOffers />
      <ProductShowcase />
      <WhatsHot />
      <DealsOfDay />
      <FromVolteX />
      <WarrantyBanner />
      <UnboxedBlog />
      <TataNeu />
      <CuratedSection />
      <WhyVolteX />
      <BrandsCarousel />
      <Footer className="w-full self-stretch" />
    </div>
  );
}
