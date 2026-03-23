// @/components/global/PromoBannerPair.tsx

import Image from "next/image";

interface PromoBannerPairProps {
    left: {
        title: string;
        subtitle?: string;
        buttonText?: string;
        onButtonClick?: () => void;
        imageSrc: string;
        imageAlt: string;
        dark?: boolean;
    };
    right: {
        title: string;
        subtitle?: string;
        buttonText?: string;
        onButtonClick?: () => void;
        imageSrc: string;
        imageAlt: string;
        dark?: boolean;
    };
}

function PromoCard({
    title,
    subtitle,
    buttonText = "Shop Now",
    onButtonClick,
    imageSrc,
    imageAlt,
    dark = false,
}: PromoBannerPairProps["left"]) {
    return (
        <div
            className={`relative flex-1 rounded-2xl overflow-hidden min-h-[220px] flex items-end ${dark ? "bg-gray-900" : "bg-gray-100"
                }`}
        >
            {/* Background Image */}
            <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Overlay for dark cards */}
            {dark && (
                <div className="absolute inset-0 bg-black/30" />
            )}

            {/* Content */}
            <div className="relative z-10 p-6 flex flex-col gap-2">
                {subtitle && (
                    <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>
                        {subtitle}
                    </p>
                )}
                <h3
                    className={`font-bold text-xl leading-snug max-w-[240px] ${dark ? "text-white" : "text-gray-900"
                        }`}
                >
                    {title}
                </h3>
                <button
                    onClick={onButtonClick}
                    className={`mt-2 w-fit px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${dark
                            ? "bg-white text-black hover:bg-gray-100"
                            : "bg-black text-white hover:bg-gray-800"
                        }`}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}

export default function PromoBannerPair({ left, right }: PromoBannerPairProps) {
    return (
        <div className="w-full px-4 py-4 flex flex-col md:flex-row gap-4 max-w-7xl mx-auto">
            <PromoCard {...left} />
            <PromoCard {...right} />
        </div>
    );
}