"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Wrap any page that requires authentication.
 * If the user is not logged in, the login modal is opened immediately
 * and a blurred placeholder is shown instead of the page content.
 */
export default function ProtectedPage({ children }: { children: React.ReactNode }) {
    const { isLoggedIn, openLoginModal } = useAuth();

    useEffect(() => {
        if (!isLoggedIn) {
            openLoginModal();
        }
    }, [isLoggedIn, openLoginModal]);

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
