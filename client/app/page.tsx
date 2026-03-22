import CategorySlider from "@/components/global/CategorySlider";
import HeroSection from "@/components/global/heroSection";
import OfferCards from "@/components/global/OfferCards";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center ">
      <HeroSection />
      <OfferCards />
      <CategorySlider />
    </div>
  );
}
