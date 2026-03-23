// @/components/global/FullWidthPromoBanner.tsx

import Image from "next/image";

interface FullWidthPromoBannerProps {
    tagline?: string;
    title: string;
    titleHighlight?: string; // e.g. "5G" badge text
    subtitle?: string;       // e.g. "Starting from ₹18,999"
    sideText?: string;       // e.g. "GET. SET. TURBO" rotated text
    buttonText?: string;
    onButtonClick?: () => void;
    imageSrc: string;
    imageAlt: string;
    poweredByLogo?: string;  // optional bottom-right logo src
    poweredByText?: string;  // e.g. "Powered by"
    disclaimer?: string;     // e.g. "T&C Apply*"
    gradientFrom?: string;   // Tailwind gradient start color class e.g. "from-teal-200"
    gradientTo?: string;     // Tailwind gradient end color class e.g. "to-green-700"
}

export default function FullWidthPromoBanner({
    tagline,
    title,
    titleHighlight,
    subtitle,
    sideText,
    buttonText = "Shop Now",
    onButtonClick,
    imageSrc,
    imageAlt,
    poweredByLogo,
    poweredByText,
    disclaimer,
    gradientFrom = "from-teal-200",
    gradientTo = "to-green-700",
}: FullWidthPromoBannerProps) {
    return (
        <div className="w-full px-4 py-4 max-w-7xl mx-auto">
            <div
                className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-r ${gradientFrom} ${gradientTo} min-h-[160px] flex items-center`}
            >
                {/* Left: Text Content */}
                <div className="relative z-10 flex flex-col gap-1.5 px-8 py-6 max-w-[420px]">
                    {tagline && (
                        <p className="text-gray-700 text-sm font-medium">{tagline}</p>
                    )}

                    <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-black text-3xl text-gray-900 tracking-tight leading-none">
                            {title}
                        </h2>
                        {titleHighlight && (
                            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                                {titleHighlight}
                            </span>
                        )}
                    </div>

                    {subtitle && (
                        <p className="text-gray-800 font-semibold text-base">{subtitle}</p>
                    )}

                    <button
                        onClick={onButtonClick}
                        className="mt-2 w-fit bg-black text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-800 transition-colors duration-200"
                    >
                        {buttonText}
                    </button>
                </div>

                {/* Center/Right: Product Image */}
                <div className="absolute right-16 bottom-0 h-full w-[340px] hidden md:block">
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        fill
                        className="object-contain object-bottom"
                        sizes="340px"
                    />
                </div>

                {/* Side rotated text */}
                {sideText && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex">
                        <span
                            className="text-white/30 font-black text-2xl tracking-widest uppercase"
                            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                        >
                            {sideText}
                        </span>
                    </div>
                )}

                {/* Bottom right: Powered by logo */}
                {(poweredByLogo || poweredByText) && (
                    <div className="absolute bottom-4 right-6 flex flex-col items-end gap-0.5 z-10">
                        {poweredByText && (
                            <span className="text-gray-600 text-[10px]">{poweredByText}</span>
                        )}
                        {poweredByLogo ? (
                            <div className="relative w-24 h-6">
                                <Image
                                    src={poweredByLogo}
                                    alt="Powered by logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        ) : (
                            <span className="text-gray-800 font-bold text-sm">originOS</span>
                        )}
                        {disclaimer && (
                            <span className="text-gray-500 text-[9px]">{disclaimer}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}