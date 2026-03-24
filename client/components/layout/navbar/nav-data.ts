export interface SubCategory {
    label: string;
}

export interface NavCategory {
    label: string;
    subcategories?: SubCategory[];
    banners?: {
        type: 'wide-stack' | 'square-side';
        images?: string[]; // We will map these later
    };
}

export const NAV_CATEGORIES: NavCategory[] = [
    { label: "Air Conditioners" },
    {
        label: "Mobiles, Tablets & Accessories",
        subcategories: [
            { label: "Smartphone" },
            { label: "iPhone" },
            { label: "Charger" },
            { label: "Smart Watch" },
            { label: "iPad" },
            { label: "Cable" },
            { label: "Tablet Accessories" },
            { label: "Power Bank" },
            { label: "Tablets" },
            { label: "Cases and Cover" },
            { label: "Graphic Tablet" },
            { label: "Basic Phone" },
        ],
        banners: {
            type: "square-side",
            images: [
                "/assets/extracted/HP_SOH_2Split_Nothing4a_13March2026_J-9KTC9JE.png",
                "/assets/extracted/HP_SOH_2Split_Pixel_9March2026_4bx8PoMrL.png",
            ],
        }
    },
    {
        label: "Laptops & Accessories",
        subcategories: [
            { label: "Laptop" },
            { label: "MacBook" },
            { label: "Printer" },
            { label: "Router" },
            { label: "Mouse" },
            { label: "Keyboards" },
            { label: "Computer Accessories" },
            { label: "Hard Disk" },
            { label: "Pendrives" },
            { label: "SSD" },
        ],
        banners: {
            type: "wide-stack",
            images: [
                "/assets/extracted/HP_Rotating_Apple_MBneo_11March2026_XtdRqQHdE.jpg",
                "/assets/extracted/HP_SOH_singleSplit_Asus_18March2026_aF2wq5I_c.png",
            ],
        }
    },
    {
        label: "Home Appliances",
        subcategories: [
            { label: "Air Conditioner" },
            { label: "Washing Machine" },
            { label: "Refrigerator" },
            { label: "Air Cooler" },
            { label: "Vacuum Cleaner" },
            { label: "Air Purifier" },
            { label: "Geyser" },
            { label: "Iron" },
            { label: "Deep Freezer" },
            { label: "Dishwasher" },
        ],
        banners: {
            type: "square-side",
            images: [
                "/assets/extracted/HP_CC_3Split_ACs_01March2026_f34B2BN6n.png",
                "/assets/extracted/HP_CC_3Split_TV_28Jan26_PGRpzp01L.png",
            ],
        }
    },
    { label: "Kitchen Appliances" },
    { label: "TV & Entertainment" },
    { label: "Personal Care" },
    { label: "Headphones & Speakers" },
    { label: "Brand Stores" },
    { label: "Loyalty Hub" },
];

export const TRENDING_SEARCHES = [
    "Air Conditioners", "Air Coolers", "MacBooks", "iPhone 17", "Televisions",
    "Refrigerators", "Nothing 4A", "AirTags", "Air Fryers", "Printer"
];
