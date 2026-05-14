import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/Footer";
import ProtectedPage from "@/components/auth/ProtectedPage";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const metadata = {
  title: "Checkout — VolteX",
  description: "Complete your order at VolteX.",
};

export default function CheckoutPage() {
  return (
    <div className="flex w-full max-w-full flex-1 flex-col items-center bg-[#f5f5f5] min-h-screen">
      <Navbar />
      <ProtectedPage>
        <main className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">
            CHECKOUT
          </h1>
          <CheckoutClient />
        </main>
      </ProtectedPage>
      <Footer className="w-full self-stretch mt-auto" />
    </div>
  );
}
