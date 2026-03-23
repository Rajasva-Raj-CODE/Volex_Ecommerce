

const primarys = [
    {
        name: "Vise",
        logo: (
            <span className="font-serif italic text-red-700 text-xl font-bold tracking-tight">
                vi<span className="text-primary/90">/</span>se
            </span>
        ),
    },
    {
        name: "Apple",
        logo: (
            <svg viewBox="0 0 24 24" className="w-9 h-9 fill-black" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
        ),
    },
    {
        name: "LG",
        logo: (
            <span className="text-primary font-bold text-2xl flex items-center gap-0.5">
                <span className="text-primary/90 text-3xl">⊕</span>LG
            </span>
        ),
    },
    {
        name: "Samsung",
        logo: (
            <span className="font-bold text-gray-800 text-lg tracking-widest uppercase">
                SAMSUNG
            </span>
        ),
    },
    {
        name: "Sony",
        logo: (
            <span className="font-bold text-gray-800 text-2xl tracking-widest uppercase">
                SONY
            </span>
        ),
    },
    {
        name: "Whirlpool",
        logo: (
            <span className="font-semibold text-gray-800 text-xl">
                Whirl<span className="text-yellow-500">p</span>ool
            </span>
        ),
    },
    {
        name: "OnePlus",
        logo: (
            <span className="bg-primary text-white font-bold text-sm px-2 py-1 rounded flex items-center gap-1">
                <span className="text-xs">1+</span> ONEPLUS
            </span>
        ),
    },
    {
        name: "Mi",
        logo: (
            <span className="bg-orange-500 text-white font-bold text-xl w-10 h-10 rounded-xl flex items-center justify-center">
                mi
            </span>
        ),
    },
];

export default function BrandsSection() {
    return (
        <section className="w-full py-14 px-4 bg-white">
            {/* Heading */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Discover Leading Brands
                </h2>
                <p className="text-gray-500 text-sm">
                    Explore a curated selection of leading primarys, where innovation meets
                    quality, only at Vijay Sales.
                </p>
            </div>

            {/* Brand Circles */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
                {primarys.map((primary) => (
                    <div
                        key={primary.name}
                        className="w-[130px] h-[130px] rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow duration-200"
                    >
                        {primary.logo}
                    </div>
                ))}
            </div>

            {/* CTA Button */}
            <div className="flex justify-center">
                <button className="bg-black text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors duration-200">
                    Shop Top Brands
                </button>
            </div>
        </section>
    );
}