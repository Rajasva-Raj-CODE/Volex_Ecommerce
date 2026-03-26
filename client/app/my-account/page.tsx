import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/Footer";
import MyAccountClient from "@/components/account/MyAccountClient";
import ProtectedPage from "@/components/auth/ProtectedPage";

export const metadata: Metadata = {
    title: "My Account — VolteX",
    description: "Manage your profile, orders, wishlist, addresses and account settings.",
};

export default function MyAccountPage() {
    return (
        <div className="flex w-full max-w-full flex-1 flex-col items-center bg-[#0f0f0f] min-h-screen">
            <Navbar />
            <ProtectedPage>
                <MyAccountClient />
            </ProtectedPage>
            <Footer className="w-full self-stretch" />
        </div>
    );
}
