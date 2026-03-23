
"use client";

import { useState } from "react";

export default function InfoCardsSection() {
    const [mobile, setMobile] = useState("");

    return (
        <section className="w-full bg-white">
            {/* Top Banner */}
            <div className="w-full bg-black text-white flex items-center justify-center gap-4 py-3 px-4">
                <div className="bg-yellow-400 text-black font-bold text-xs px-3 py-1.5 rounded leading-tight text-center">
                    <div className="text-[10px]">UPTO</div>
                    <div className="text-sm">₹7,500</div>
                </div>
                <p className="text-sm text-gray-200">
                    Instant Discount on selected banks.{" "}
                    <span className="text-white font-semibold underline cursor-pointer">
                        See Products
                    </span>
                </p>
            </div>

            {/* Cards Row */}
            <div className="flex flex-col md:flex-row gap-4 px-6 py-8 max-w-7xl mx-auto">
                {/* Card 1 - Black - Your Reliable Partners */}
                <div className="flex-[1.6] bg-black rounded-2xl p-8 flex flex-col justify-between min-h-[300px] relative overflow-hidden">
                    {/* Wavy background lines */}
                    <div className="absolute inset-0 opacity-10">
                        <svg
                            viewBox="0 0 600 300"
                            className="w-full h-full"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {[0, 30, 60, 90, 120, 150, 180].map((offset, i) => (
                                <path
                                    key={i}
                                    d={`M-100,${100 + offset} Q150,${50 + offset} 300,${100 + offset} T700,${100 + offset}`}
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="1"
                                />
                            ))}
                        </svg>
                    </div>

                    {/* Badge */}
                    <div className="w-20 h-20 rounded-full border-2 border-gray-500 flex flex-col items-center justify-center text-white text-center z-10">
                        <div className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase">
                            Trusted
                        </div>
                        <div className="text-white font-bold text-lg leading-none">VS</div>
                        <div className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase">
                            Advisors
                        </div>
                    </div>

                    {/* Text */}
                    <div className="z-10">
                        <h3 className="text-white font-bold text-2xl mb-2">
                            Your Reliable Partners
                        </h3>
                        <p className="text-gray-400 text-sm mb-6">
                            Directing your choices with expertise every step of the way.
                        </p>
                        <button className="bg-white text-black font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors">
                            Explore Our story
                        </button>
                    </div>
                </div>

                {/* Card 2 - Red - Loyalty Points */}
                <div className="flex-1 bg-primary rounded-2xl p-7 flex flex-col justify-between min-h-[300px]">
                    {/* Circular badge */}
                    <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center relative">
                        <svg viewBox="0 0 40 40" className="w-8 h-8 fill-white">
                            <circle cx="20" cy="16" r="7" fillOpacity="0.9" />
                            <path d="M20 24 L14 36 L20 32 L26 36 Z" />
                        </svg>
                        {/* Circular text */}
                        <svg
                            viewBox="0 0 80 80"
                            className="absolute inset-0 w-full h-full"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                id="circle-text"
                                d="M 40,40 m -28,0 a 28,28 0 1,1 56,0 a 28,28 0 1,1 -56,0"
                                fill="none"
                            />
                            <text fontSize="7" fill="white" opacity="0.6">
                                <textPath href="#circle-text">
                                    Shop. Earn. Redeem. • Shop. Earn. Redeem. •
                                </textPath>
                            </text>
                        </svg>
                    </div>

                    <div>
                        <h3 className="text-white font-bold text-2xl mb-4 leading-snug">
                            Unlock perks—your gateway to exclusive loyalty points
                        </h3>
                        <input
                            type="tel"
                            placeholder="Mobile Number"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            className="w-full border border-white/60 bg-transparent text-white placeholder-white/70 rounded-lg px-4 py-3 mb-3 text-sm outline-none focus:border-white"
                        />
                        <button className="bg-black text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-gray-900 transition-colors w-full">
                            Verify Number
                        </button>
                    </div>
                </div>

                {/* Card 3 - White - VS+ Warranty */}
                <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-7 flex flex-col justify-between min-h-[300px] shadow-sm">
                    {/* VS+ Logo */}
                    <div>
                        <span className="text-primary font-bold text-2xl">vs</span>
                        <span className="text-primary/90 font-bold text-2xl">+</span>
                    </div>

                    <div>
                        <h3 className="text-gray-900 font-bold text-xl leading-snug mb-3">
                            Do not forget to include the VS+ Extended Warranty with your
                            purchase
                        </h3>
                        <p className="text-gray-500 text-sm">
                            Protect your electronics and appliances beyond the standard
                            coverage
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}