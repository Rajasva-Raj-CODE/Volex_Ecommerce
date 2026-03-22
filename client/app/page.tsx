import CategorySlider from "@/components/global/CategorySlider";
import ExclusiveDealsSection from "@/components/global/ExclusiveDealsSection";
import FooterSection from "@/components/global/FooterSection";
import GreaterSavingsDealsSection from "@/components/global/GreaterSavingsDealsSection";
import HeroSection from "@/components/global/heroSection";
import OfferCards from "@/components/global/OfferCards";
import ProductShowcaseSection from "@/components/global/ProductShowcaseSection";
import Navbar from "@/components/global/navbar/navbarSection";

export default function Home() {
  return (
    <div className="flex w-full max-w-full flex-1 flex-col items-center">
      <Navbar />
      <HeroSection />
      <OfferCards />
      <CategorySlider />
      <ProductShowcaseSection />
      <GreaterSavingsDealsSection />
      <ExclusiveDealsSection />
      <FooterSection className="w-full self-stretch" />
    </div>
  );
}
