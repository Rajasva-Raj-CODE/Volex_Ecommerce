import CategorySlider from "@/components/global/CategorySlider";
import ExclusiveDealsSection from "@/components/global/ExclusiveDealsSection";
import FooterSection from "@/components/global/FooterSection";
import GreaterSavingsDealsSection from "@/components/global/GreaterSavingsDealsSection";
import HeroSection from "@/components/global/heroSection";
import OfferCards from "@/components/global/OfferCards";
import ProductShowcaseSection from "@/components/global/ProductShowcaseSection";
import Navbar from "@/components/global/navbar/navbarSection";
import BrandsSection from "@/components/global/BrandsSection";
import InfoCardsSection from "@/components/global/InfoCardsSection";
import StatsEcoFeaturesSection from "@/components/global/StatsEcoFeaturesSection";
import PromoBannerPair from "@/components/global/PromoBannerPair";
import FullWidthPromoBanner from "@/components/global/FullWidthPromoBanner";

export default function Home() {
  return (
    <div className="flex w-full max-w-full flex-1 flex-col items-center">
      <Navbar />
      <HeroSection />
      <OfferCards />
      <CategorySlider />
      <PromoBannerPair
        left={{
          title: "A revolution in healthy cooking",
          subtitle: "Air Fryers",
          buttonText: "Shop Now",
          imageSrc: "/images/air-fryer-banner.jpg",   // ← replace with your image
          imageAlt: "Air Fryers",
          dark: false,
        }}
        right={{
          title: "Make Every Moment Sound Better",
          buttonText: "Shop Now",
          imageSrc: "/images/soundbar-banner.jpg",     // ← replace with your image
          imageAlt: "Soundbar",
          dark: true,
        }}
      />
      <PromoBannerPair
        left={{
          title: "Flagship Performance Smartphones",
          buttonText: "Shop Now",
          imageSrc: "/images/flagship-phones.jpg",     // ← replace with your image
          imageAlt: "Flagship Smartphones",
          dark: true,
        }}
        right={{
          title: "Trending Smartphones",
          buttonText: "Shop Now",
          imageSrc: "/images/trending-phones.jpg",     // ← replace with your image
          imageAlt: "Trending Smartphones",
          dark: true,
        }}
      />
      <FullWidthPromoBanner
        tagline="Introducing"
        title="vivo X100 Pro"
        titleHighlight="5G"
        subtitle="Starting from ₹89,999"
        sideText="ZEISS"
        buttonText="Buy Now"
        imageSrc="/vivo-x100-pro.png"
        imageAlt="vivo X100 Pro"
        poweredByLogo="/vivo-logo.png"
        poweredByText="Powered by"
        disclaimer="T&C Apply*"
        gradientFrom="from-blue-100"
        gradientTo="to-purple-200"
      />
      <ProductShowcaseSection />
      <GreaterSavingsDealsSection />
      <ExclusiveDealsSection />
      <BrandsSection />
      <InfoCardsSection />
      <StatsEcoFeaturesSection />
      <FooterSection className="w-full self-stretch" />
    </div>
  );
}
