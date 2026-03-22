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
            type: "square-side"
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
            type: "wide-stack"
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
            type: "square-side"
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
