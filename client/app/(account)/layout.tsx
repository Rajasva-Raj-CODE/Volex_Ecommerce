import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/Footer";
import AccountSidebar from "@/components/account/AccountSidebar";
import ProtectedPage from "@/components/auth/ProtectedPage";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex w-full max-w-full flex-1 flex-col items-center bg-[#0f0f0f] min-h-screen">
            <Navbar />
            <ProtectedPage>
                <div className="w-full max-w-7xl mx-auto px-4 py-8 lg:py-12 flex-1">
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
                        <aside className="hidden lg:block w-[260px] shrink-0">
                            <AccountSidebar />
                        </aside>
                        <main className="flex-1 min-w-0">
                            {children}
                        </main>
                    </div>
                </div>
            </ProtectedPage>
            <Footer className="w-full self-stretch" />
        </div>
    );
}
