import Navbar from "@/components/layout/navbar/Navbar";
import HeroSection from "@/components/home/HeroSection";
import CategorySlider from "@/components/home/CategorySlider";
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

export default function Home() {
  return (
    <div className="flex w-full max-w-full flex-1 flex-col items-center bg-[#0f0f0f]">
      <Navbar />
      <HeroSection />
      <CategorySlider />
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
