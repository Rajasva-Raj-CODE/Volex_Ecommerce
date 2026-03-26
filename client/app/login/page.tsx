import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/Footer";
import LoginClient from "@/components/auth/LoginClient";

export const metadata: Metadata = {
    title: "Login — VolteX",
    description: "Sign in to your VolteX account using your phone number.",
};

export default function LoginPage() {
    return (
        <div className="flex w-full max-w-full flex-1 flex-col items-center bg-[#0f0f0f] min-h-screen">
            <Navbar />
            <LoginClient />
            <Footer className="w-full self-stretch" />
        </div>
    );
}
