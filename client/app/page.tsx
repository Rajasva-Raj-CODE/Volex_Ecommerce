import CategorySlider from "@/components/global/CategorySlider";
import HeroSection from "@/components/global/heroSection";
import OfferCards from "@/components/global/OfferCards";
import Navbar from "@/components/global/navbar/navbarSection";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center ">
      <Navbar />
      <HeroSection />
      <OfferCards />
      <CategorySlider />
    </div>
  );
}
