import { NavCategory } from "./nav-data";

export function MegaDropdown({ category }: { category: NavCategory }) {
    if (!category.subcategories || !category.banners) return null;

    const isWideStack = category.banners.type === 'wide-stack';

    return (
        <div
            className="absolute left-0 right-0 top-full z-50 border-t border-gray-200 bg-white shadow-xl"
            style={{ animation: "slideDown 0.15s ease" }}
        >
            <div className="mx-auto flex w-full max-w-[1400px]">
                {/* Left side: Subcategory list */}
                <div className="w-[300px] shrink-0 border-r border-gray-200 py-6 pr-6 bg-white overflow-y-auto max-h-[500px]">
                    <div className="flex flex-col gap-0.5 ml-4">
                        {category.subcategories.map((sub) => (
                            <button
                                key={sub.label}
                                className="text-left w-full px-4 py-2.5 text-[14px] text-gray-700 hover:text-black hover:font-semibold transition-all"
                            >
                                {sub.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right side: Image Banners */}
                <div className="flex-1 p-8 bg-[#f9f9f9]">
                    {isWideStack ? (
                        /* Stacked Wide Banners (e.g. Laptops & Accessories) */
                        <div className="flex flex-col gap-6 max-w-4xl max-h-[450px]">
                            {/* Banner 1: Savings Up To 55% Off */}
                            <div className="h-[200px] w-full bg-gradient-to-r from-[#111111] to-[#fde047] rounded-xl flex items-center p-8 overflow-hidden relative group">
                                <div className="z-10 bg-[#111111] absolute left-0 top-0 bottom-0 w-[40%] skew-x-12 -translate-x-12 border-r-[8px] border-white group-hover:w-[45%] transition-all duration-500"></div>
                                <div className="z-20 relative flex flex-col items-center justify-center transform -translate-x-4">
                                    <div className="text-white font-black text-2xl italic">OPEN BOX</div>
                                    <div className="text-white font-black text-4xl italic">STOCK</div>
                                    <div className="text-white font-black text-2xl italic">CLEARANCE</div>
                                </div>
                                <div className="z-10 ml-auto flex flex-col items-center justify-center pr-12">
                                    <div className="text-black font-semibold text-sm">DISPLAY • LAST PIECE</div>
                                    <div className="text-black font-black text-6xl tracking-tight leading-none mt-1">55<span className="text-4xl">%</span></div>
                                    <div className="text-black font-black text-3xl leading-none">OFF</div>
                                    <div className="text-black font-bold text-xs mt-2 bg-white px-2 py-0.5">HURRY! LIMITED STOCK</div>
                                </div>
                            </div>
                            
                            {/* Banner 2: Refurbished Laptops */}
                            <div className="h-[200px] w-full bg-[#d0d6de] rounded-xl flex items-center p-8 relative overflow-hidden group">
                                <div className="z-10 relative max-w-sm">
                                    <h3 className="text-black font-bold text-3xl leading-tight">Discover Great Deals on Refurbished Laptops.</h3>
                                </div>
                                <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-end opacity-90 group-hover:scale-105 transition-transform duration-500">
                                    {/* Placeholder laptop */}
                                    <div className="w-[180px] h-[120px] bg-slate-800 rounded-lg shadow-xl border-4 border-slate-700 relative">
                                        <div className="absolute inset-x-2 bottom-2 h-0.5 bg-blue-500"></div>
                                    </div>
                                    <div className="w-[200px] h-[15px] bg-slate-300 rounded-b-md -ml-3 z-20 shadow-lg"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Side-by-Side Square Banners (e.g. Home Appliances) */
                        <div className="flex gap-6 max-h-[450px]">
                            {/* Banner 1: Washing Machines */}
                            <div className="w-[300px] h-[340px] bg-gradient-to-br from-[#caced0] to-[#b0b3b8] rounded-2xl p-6 relative flex flex-col justify-end overflow-hidden group">
                                <div className="absolute top-8 right-8 w-32 h-40 bg-white rounded-xl shadow-2xl flex flex-col items-center justify-center border-4 border-gray-100 group-hover:-translate-y-2 transition-transform duration-500">
                                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center border-8 border-blue-50">
                                        <div className="w-16 h-16 bg-blue-900 rounded-full opacity-20"></div>
                                    </div>
                                </div>
                                <div className="z-10 mt-auto">
                                    <h3 className="text-[#1a202c] font-black text-2xl uppercase leading-none mb-1">Washing Machines</h3>
                                    <p className="text-[#2d3748] font-semibold">Starting From ₹8,990</p>
                                </div>
                            </div>

                            {/* Banner 2: Refrigerators */}
                            <div className="w-[300px] h-[340px] bg-[#221f1e] rounded-2xl p-6 relative flex flex-col justify-end overflow-hidden group">
                                <div className="absolute top-6 right-6 w-36 h-56 bg-[#111111] rounded-lg shadow-2xl border-l-[3px] border-t-[3px] border-gray-700 group-hover:-translate-y-2 transition-transform duration-500">
                                    <div className="absolute top-1/4 right-3 w-10 h-16 bg-gray-800 rounded border border-gray-600"></div>
                                </div>
                                <div className="z-10 mt-auto">
                                    <div className="text-white text-xs italic font-medium">✨ Power Cool</div>
                                    <h3 className="text-white font-black text-2xl uppercase leading-none mb-1 mt-1">Refrigerator</h3>
                                    <p className="text-gray-300 font-medium text-sm">Starting From ₹8,790</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
