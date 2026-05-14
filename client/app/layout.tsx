import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/contexts/AuthContext";
import GlobalLoginModal from "@/components/auth/GlobalLoginModal";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    variable: "--font-roboto",
    display: "swap",
});

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
    title: "VolteX — Electronics & Appliances",
    description:
        "Shop the latest electronics, home appliances, smartphones, laptops, TVs and more at VolteX. Best deals, bank offers, and free delivery.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html
            lang="en"
            className={cn(
                "h-full antialiased font-sans",
                geistSans.variable,
                geistMono.variable,
                inter.variable,
                roboto.variable
            )}
        >
            <body className="min-h-full flex flex-col">
                <AuthProvider>
                    {children}
                    {/* Global login modal — opens from any page via useAuth().openLoginModal() */}
                    <GlobalLoginModal />
                    <Toaster position="top-right" />
                </AuthProvider>
            </body>
        </html>
    );
}
