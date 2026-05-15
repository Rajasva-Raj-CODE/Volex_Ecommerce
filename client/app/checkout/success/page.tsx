import { Suspense } from "react";
import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/Footer";
import ProtectedPage from "@/components/auth/ProtectedPage";
import OrderSuccessClient from "@/components/checkout/OrderSuccessClient";

export const metadata = {
  title: "Order Confirmed — VolteX",
  description: "Your order has been placed successfully.",
};

export default function OrderSuccessPage() {
  return (
    <div className="flex w-full max-w-full flex-1 flex-col items-center bg-[#f5f5f5] min-h-screen">
      <Navbar />
      <ProtectedPage>
        <main className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Suspense
            fallback={
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 border-t-[#49A5A2] animate-spin" />
              </div>
            }
          >
            <OrderSuccessClient />
          </Suspense>
        </main>
      </ProtectedPage>
      <Footer className="w-full self-stretch mt-auto" />
    </div>
  );
}
