import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/Footer";
import CartClient from "@/components/cart/CartClient";

export const metadata = {
  title: "Your Cart — VolteX",
  description: "Review items in your cart and proceed to checkout.",
};

export default function CartPage() {
  return (
    <div className="flex w-full max-w-full flex-1 flex-col items-center bg-[#f5f5f5] min-h-screen">
      <Navbar />
      <main className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">
          YOUR CART
        </h1>
        <CartClient />
      </main>
      <Footer className="w-full self-stretch mt-auto" />
    </div>
  );
}
