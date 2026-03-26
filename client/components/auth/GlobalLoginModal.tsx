"use client";

import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "./LoginModal";

/**
 * Connects LoginModal to AuthContext.
 * Mount once in the root layout — modal opens/closes globally.
 */
export default function GlobalLoginModal() {
    const { loginModalOpen, closeLoginModal } = useAuth();
    return <LoginModal isOpen={loginModalOpen} onClose={closeLoginModal} />;
}
