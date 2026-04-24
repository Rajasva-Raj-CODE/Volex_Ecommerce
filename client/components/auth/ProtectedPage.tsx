"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Wrap any page that requires authentication.
 * Waits for session bootstrap before prompting — avoids false modal opens.
 */
export default function ProtectedPage({ children }: { children: React.ReactNode }) {
    const { isLoggedIn, isReady, openLoginModal } = useAuth();

    useEffect(() => {
        if (isReady && !isLoggedIn) {
            openLoginModal();
        }
    }, [isReady, isLoggedIn, openLoginModal]);

    // Still bootstrapping — show nothing yet
    if (!isReady) {
        return (
            <div className="w-full flex-1 flex items-center justify-center px-4 py-24">
                <div className="w-6 h-6 rounded-full border-2 border-[#49A5A2]/30 border-t-[#49A5A2] animate-spin" />
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="w-full flex-1 flex items-center justify-center px-4 py-24">
                <div className="text-center space-y-3">
                    <p className="text-white/30 text-[14px]">
                        Please login to view this page.
                    </p>
                    <button
                        onClick={openLoginModal}
                        className="text-[#49A5A2] text-[13px] hover:underline cursor-pointer"
                    >
                        Click here to login
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
