// @/components/global/StatsEcoFeaturesSection.tsx

const stats = [
    {
        number: "160+",
        description: "Discover 160+ Showrooms at Prime Locations Near You.",
    },
    {
        number: "10M+",
        description: "Happy Customers",
    },
    {
        number: "1000+",
        description: "Delivering to 1000+ cities across",
    },
];

const ecoSteps = [
    {
        step: "1",
        title: "Collect e-Waste",
        description: "Gather electronic waste for eco-friendly disposal and recycling.",
    },
    {
        step: "2",
        title: "Drop-off",
        description:
            "Drop off your e-waste at designated centers for responsible recycling.",
    },
    {
        step: "3",
        title: "Contribute to Change",
        description:
            "Join us to make a difference and shape a better future together",
    },
];

const features = [
    {
        icon: (
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
        title: "Extended Warranty",
        description: "Got a question? Look no further calls us.",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
        ),
        title: "Free Delivery",
        description: "Available on all our products.",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
        ),
        title: "Trusted Tech Delivered Fast",
        description: "Now in 90 Minutes",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
        ),
        title: "Easy Installment",
        description: "Pay for your purchase in easy EMIs.",
    },
];

export default function StatsEcoFeaturesSection() {
    return (
        <section className="w-full bg-white">
            {/* Stats Row */}
            <div className="flex flex-col md:flex-row items-start justify-around px-8 py-10 border-b border-gray-100 max-w-7xl mx-auto gap-8">
                {stats.map((stat, i) => (
                    <div key={i} className="flex items-start gap-4">
                        <span className="text-6xl md:text-7xl font-black text-gray-900 leading-none">
                            {stat.number}
                        </span>
                        <p className="text-gray-500 text-sm max-w-[130px] mt-2 leading-snug">
                            {stat.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Eco Section */}
            <div className="flex flex-col md:flex-row w-full">
                {/* Dark Green Left */}
                <div className="bg-[#1a5c3a] flex-1 p-10 flex flex-col justify-between min-h-[220px]">
                    <h3 className="text-white font-bold text-2xl leading-snug max-w-xs">
                        Sustainable Electronics,
                        <br />
                        Responsible Disposal
                    </h3>
                    <button className="bg-black text-white font-semibold text-sm px-6 py-2.5 rounded-full w-fit hover:bg-gray-900 transition-colors mt-6">
                        Know More
                    </button>
                </div>

                {/* Globe Image placeholder */}
                <div className="bg-[#1a5c3a] flex items-center justify-center p-6">
                    <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-green-300 to-green-600 flex items-center justify-center shadow-lg">
                        {/* Placeholder for globe image */}
                        <svg viewBox="0 0 64 64" className="w-24 h-24 text-green-900" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="32" cy="32" r="28" />
                            <ellipse cx="32" cy="32" rx="12" ry="28" />
                            <line x1="4" y1="32" x2="60" y2="32" />
                            <line x1="8" y1="20" x2="56" y2="20" />
                            <line x1="8" y1="44" x2="56" y2="44" />
                        </svg>
                    </div>
                </div>

                {/* Lime Green Right - Steps */}
                <div className="bg-[#c8e600] flex-1 p-10 flex items-center">
                    <div className="flex flex-col md:flex-row gap-8">
                        {ecoSteps.map((step) => (
                            <div key={step.step} className="flex-1">
                                <div className="text-gray-700 text-xs font-semibold mb-1">
                                    {step.step}
                                </div>
                                <h4 className="font-bold text-gray-900 text-sm mb-1">
                                    {step.title}
                                </h4>
                                <p className="text-gray-700 text-xs leading-snug">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Row */}
            <div className="flex flex-col md:flex-row justify-around px-8 py-10 max-w-7xl mx-auto gap-8 border-t border-gray-100">
                {features.map((feature, i) => (
                    <div key={i} className="flex flex-col items-start gap-2 flex-1">
                        <div className="text-gray-700">{feature.icon}</div>
                        <h4 className="font-bold text-gray-900 text-sm">{feature.title}</h4>
                        <p className="text-gray-500 text-xs leading-snug">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}