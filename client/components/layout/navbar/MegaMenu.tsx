import Image from "next/image";
import { NavCategory } from "./nav-data";
import Link from "next/link";

export function MegaDropdown({ category }: { category: NavCategory }) {
    if (!category.subcategories || !category.banners) return null;

    const images = category.banners.images ?? [];

    return (
        <div
            className="absolute left-0 right-0 top-full z-50 border-t border-white/10 bg-white shadow-xl"
            style={{ animation: "slideDown 0.15s ease" }}
        >
            <div className="mx-auto flex w-full max-w-[1400px]">
                {/* Left side: Subcategory list */}
                <div className="w-[260px] shrink-0 border-r border-gray-200 py-5 bg-white overflow-y-auto max-h-[480px]">
                    <div className="flex flex-col gap-0.5 px-4">
                        {category.subcategories.map((sub) => (
                            <Link
                                key={sub.label}
                                href={`/category/${category.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/${sub.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                className="block w-full px-4 py-2.5 text-[14px] text-gray-600 hover:text-[#49A5A2] hover:font-semibold transition-all rounded-md hover:bg-gray-50"
                            >
                                {sub.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right side: Image Banners — always stacked vertically */}
                <div className="flex-1 p-6 bg-gray-50 overflow-y-auto max-h-[480px]">
                    <div className="flex flex-col gap-4">
                        {images.map((src, i) => (
                            <div
                                key={i}
                                className="relative w-full overflow-hidden rounded-xl aspect-[21/9]"
                            >
                                <Image
                                    src={src}
                                    alt={`${category.label} promo ${i + 1}`}
                                    fill
                                    sizes="(max-width: 1400px) 70vw, 900px"
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
