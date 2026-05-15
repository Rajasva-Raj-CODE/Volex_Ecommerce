import type { ProductDetail } from "./types";

export function generateProductSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const MOCK_PRODUCT_DETAILS: ProductDetail[] = [
  {
    id: "1",
    title: "Croma 80 cm (32 inch) HD Ready LED TV with A+ Panel",
    slug: "croma-32-led-tv",
    category: "TV & Entertainment",
    categorySlug: "tv-entertainment",
    brand: "Croma",
    images: [
      { id: "front", src: "/assets/extracted/TV_vdemgc.png", alt: "Croma 32 inch LED TV Front View" },
      { id: "angle", src: "/assets/extracted/TV_vdemgc.png", alt: "Croma 32 inch LED TV Angle View" },
      { id: "back", src: "/assets/extracted/TV_vdemgc.png", alt: "Croma 32 inch LED TV Back View" },
      { id: "remote", src: "/assets/extracted/TV_vdemgc.png", alt: "Croma 32 inch LED TV Remote" },
    ],
    price: 9990,
    originalPrice: 19000,
    discount: "47% Off",
    savings: "₹9,010",
    rating: "4.3",
    reviews: "22",
    deliveryDate: "Tomorrow",
    deliveryFee: "FREE",
    inStock: true,
    bankOffers: [
      { id: "1", bank: "HSBC", description: "Get 10% Instant Discount up to Rs.1,500 on HSBC Credit Card EMI transactions" },
      { id: "2", bank: "HDFC", description: "Get 10% Instant Discount up to Rs.1,000 on HDFC Bank Credit Card EMI" },
      { id: "3", bank: "SBI", description: "Get 7.5% Instant Discount up to Rs.750 on SBI Credit Card EMI transactions" },
    ],
    highlights: [
      { text: "HD Ready (1366 x 768) Resolution for crisp visuals" },
      { text: "A+ Grade Panel with 178° Wide Viewing Angle" },
      { text: "20W Speakers with Dolby Audio support" },
      { text: "3 HDMI & 2 USB Ports for connectivity" },
      { text: "Slim bezel design fits any room décor" },
      { text: "Energy efficient with BEE 3-Star Rating" },
    ],
    specGroups: [
      {
        groupName: "General",
        specs: [
          { label: "Brand", value: "Croma" },
          { label: "Model", value: "CREL7384N" },
          { label: "Screen Size", value: "80 cm (32 inches)" },
          { label: "Color", value: "Black" },
          { label: "Launch Year", value: "2024" },
        ],
      },
      {
        groupName: "Display",
        specs: [
          { label: "Display Type", value: "LED" },
          { label: "Resolution", value: "1366 x 768 (HD Ready)" },
          { label: "Refresh Rate", value: "60Hz" },
          { label: "Viewing Angle", value: "178°" },
          { label: "Brightness", value: "250 nits" },
        ],
      },
      {
        groupName: "Audio",
        specs: [
          { label: "Speaker Output", value: "20W" },
          { label: "Audio Technology", value: "Dolby Audio" },
          { label: "Number of Speakers", value: "2" },
        ],
      },
      {
        groupName: "Connectivity",
        specs: [
          { label: "HDMI Ports", value: "3" },
          { label: "USB Ports", value: "2" },
          { label: "Wi-Fi", value: "Yes (802.11 b/g/n)" },
          { label: "Bluetooth", value: "Yes (v5.0)" },
        ],
      },
    ],
    variants: [
      { name: "Screen Size", options: [{ label: "32 inch", selected: true }, { label: "43 inch" }, { label: "55 inch" }] },
    ],
    overview: [
      { heading: "Crystal Clear Visuals", description: "The Croma 32-inch HD Ready LED TV delivers sharp visuals with its A+ Grade Panel, offering a 1366 x 768 resolution ideal for everyday viewing. Whether you're watching your favourite shows or streaming content, every scene comes to life with vivid colours." },
      { heading: "Immersive Audio", description: "Built-in 20W speakers with Dolby Audio support deliver room-filling sound. Enjoy clear dialogue, rich bass, and an immersive audio experience without the need for external speakers." },
    ],
    relatedProductIds: ["2", "7", "5"],
    emiStartsAt: "₹833/month",
    noCostEmi: true,
    warranty: "1 Year Croma Manufacturer Warranty",
  },
  {
    id: "2",
    title: "Croma 5.1 Channel 340W Dolby Digital Soundbar with Subwoofer",
    slug: "croma-soundbar-340w",
    category: "Headphones & Speakers",
    categorySlug: "headphones-speakers",
    brand: "Croma",
    images: [
      { id: "front", src: "/assets/extracted/Home_theatres_kpwvft.png", alt: "Croma 5.1 Soundbar Front View" },
      { id: "angle", src: "/assets/extracted/Home_theatres_kpwvft.png", alt: "Croma 5.1 Soundbar Angle View" },
      { id: "sub", src: "/assets/extracted/Home_theatres_kpwvft.png", alt: "Croma 5.1 Soundbar Subwoofer" },
      { id: "remote", src: "/assets/extracted/Home_theatres_kpwvft.png", alt: "Croma 5.1 Soundbar Remote" },
    ],
    price: 10990,
    originalPrice: 18000,
    discount: "39% Off",
    savings: "₹7,010",
    rating: "4.1",
    reviews: "16",
    deliveryDate: "Thur, 27th Mar",
    deliveryFee: "FREE",
    inStock: true,
    extraDiscount: "Extra discount of Rs. 2000",
    bankOffers: [
      { id: "1", bank: "HSBC", description: "Get 10% Instant Discount up to Rs.1,500 on HSBC Credit Card EMI transactions" },
      { id: "2", bank: "ICICI", description: "Get 10% Instant Discount up to Rs.1,250 on ICICI Bank Credit Card EMI" },
      { id: "3", bank: "HDFC", description: "Get 7.5% Instant Discount up to Rs.1,000 on HDFC Bank Credit Card transactions" },
    ],
    highlights: [
      { text: "340W Total Output with Deep Bass Subwoofer" },
      { text: "5.1 Channel Surround Sound for immersive audio" },
      { text: "Dolby Digital & DTS decoding support" },
      { text: "Bluetooth 5.0, HDMI ARC, Optical & AUX connectivity" },
      { text: "Wall-mountable slim design" },
      { text: "LED display with touch controls" },
    ],
    specGroups: [
      {
        groupName: "General",
        specs: [
          { label: "Brand", value: "Croma" },
          { label: "Model", value: "CRES5140" },
          { label: "Total Output", value: "340W" },
          { label: "Channels", value: "5.1" },
          { label: "Color", value: "Black" },
        ],
      },
      {
        groupName: "Audio",
        specs: [
          { label: "Soundbar Output", value: "200W" },
          { label: "Subwoofer Output", value: "140W" },
          { label: "Audio Format", value: "Dolby Digital, DTS" },
          { label: "Equalizer Modes", value: "Movie, Music, News, 3D" },
        ],
      },
      {
        groupName: "Connectivity",
        specs: [
          { label: "Bluetooth", value: "v5.0" },
          { label: "HDMI ARC", value: "Yes" },
          { label: "Optical Input", value: "Yes" },
          { label: "AUX", value: "3.5mm" },
          { label: "USB", value: "Yes" },
        ],
      },
    ],
    relatedProductIds: ["1", "5", "8"],
    emiStartsAt: "₹916/month",
    noCostEmi: true,
    warranty: "1 Year Croma Manufacturer Warranty",
  },
  {
    id: "3",
    title: "Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB, Titanium Black)",
    slug: "samsung-galaxy-s24-ultra",
    category: "Mobiles, Tablets & Accessories",
    categorySlug: "mobiles-tablets-accessories",
    brand: "Samsung",
    images: [
      { id: "front", src: "/assets/extracted/Mobile_sdtrdf.png", alt: "Samsung Galaxy S24 Ultra Front View" },
      { id: "back", src: "/assets/extracted/Mobile_sdtrdf.png", alt: "Samsung Galaxy S24 Ultra Back View" },
      { id: "side", src: "/assets/extracted/Mobile_sdtrdf.png", alt: "Samsung Galaxy S24 Ultra Side View" },
      { id: "camera", src: "/assets/extracted/Mobile_sdtrdf.png", alt: "Samsung Galaxy S24 Ultra Camera" },
    ],
    price: 69999,
    originalPrice: 134999,
    discount: "48% Off",
    savings: "₹65,000",
    rating: "4.6",
    reviews: "38",
    deliveryDate: "Fri, 28th Mar",
    deliveryFee: "FREE",
    inStock: true,
    bankOffers: [
      { id: "1", bank: "HSBC", description: "Get 10% Instant Discount up to Rs.7,500 on HSBC Credit Card EMI transactions" },
      { id: "2", bank: "HDFC", description: "Get 10% Instant Discount up to Rs.3,000 on HDFC Bank Credit Card EMI" },
      { id: "3", bank: "SBI", description: "Get 7.5% Instant Discount up to Rs.3,000 on SBI Credit Card EMI transactions" },
    ],
    highlights: [
      { text: "200MP Wide-angle Camera with AI features" },
      { text: "6.8 inch QHD+ Dynamic AMOLED 2X Display" },
      { text: "Snapdragon 8 Gen 3 for Galaxy Processor" },
      { text: "5000mAh Battery with 45W Fast Charging" },
      { text: "Built-in S Pen with Air Actions" },
      { text: "IP68 Water & Dust Resistance" },
    ],
    specGroups: [
      {
        groupName: "General",
        specs: [
          { label: "Brand", value: "Samsung" },
          { label: "Model", value: "Galaxy S24 Ultra" },
          { label: "Color", value: "Titanium Black" },
          { label: "SIM Type", value: "Dual SIM (Nano + eSIM)" },
          { label: "Operating System", value: "Android 14, One UI 6.1" },
        ],
      },
      {
        groupName: "Display",
        specs: [
          { label: "Display Size", value: "6.8 inches" },
          { label: "Resolution", value: "3120 x 1440 (QHD+)" },
          { label: "Display Type", value: "Dynamic AMOLED 2X" },
          { label: "Refresh Rate", value: "120Hz Adaptive" },
          { label: "Peak Brightness", value: "2600 nits" },
        ],
      },
      {
        groupName: "Performance",
        specs: [
          { label: "Processor", value: "Snapdragon 8 Gen 3 for Galaxy" },
          { label: "RAM", value: "12 GB" },
          { label: "Storage", value: "256 GB" },
          { label: "GPU", value: "Adreno 750" },
        ],
      },
      {
        groupName: "Camera",
        specs: [
          { label: "Rear Camera", value: "200MP + 50MP + 12MP + 10MP" },
          { label: "Front Camera", value: "12MP" },
          { label: "Video Recording", value: "8K@30fps, 4K@60fps" },
          { label: "OIS", value: "Yes" },
        ],
      },
      {
        groupName: "Battery",
        specs: [
          { label: "Battery Capacity", value: "5000 mAh" },
          { label: "Fast Charging", value: "45W Wired, 15W Wireless" },
          { label: "Reverse Wireless", value: "4.5W" },
        ],
      },
    ],
    variants: [
      { name: "Brand Color", options: [{ label: "Titanium Black", selected: true }, { label: "Titanium Gray" }, { label: "Titanium Violet" }] },
      { name: "RAM", options: [{ label: "12GB", selected: true }] },
      { name: "Internal Storage", options: [{ label: "256GB", selected: true }, { label: "512GB" }, { label: "1TB" }] },
    ],
    overview: [
      { heading: "Galaxy AI-Powered Experience", description: "The Samsung Galaxy S24 Ultra is the pinnacle of smartphone innovation, powered by the Snapdragon 8 Gen 3 for Galaxy processor. With Galaxy AI features like Circle to Search, Live Translate during calls, and AI-generated photo edits, this phone redefines what's possible." },
      { heading: "200MP Pro Camera System", description: "Capture stunning detail with the 200MP wide-angle camera. Whether it's nightography, 8K video recording, or 100x Space Zoom, every shot is a masterpiece. The AI-enhanced processing ensures vibrant colours and sharp detail in any lighting condition." },
      { heading: "Titanium Build Quality", description: "Crafted with a titanium frame and Corning Gorilla Armor, the Galaxy S24 Ultra offers premium durability with IP68 water and dust resistance. The flat display and refined design make it both elegant and tough." },
    ],
    relatedProductIds: ["7", "5", "9"],
    emiStartsAt: "₹2,917/month",
    noCostEmi: true,
    warranty: "1 Year Samsung India Manufacturer Warranty",
  },
  {
    id: "4",
    title: "Apple MacBook Air 13 inch M3 Chip (8GB RAM, 256GB SSD, Midnight)",
    slug: "apple-macbook-air-m3",
    category: "Laptops & Accessories",
    categorySlug: "laptops-accessories",
    brand: "Apple",
    images: [
      { id: "open", src: "/assets/extracted/Laptops_pzewpv.png", alt: "MacBook Air M3 Open View" },
      { id: "closed", src: "/assets/extracted/Laptops_pzewpv.png", alt: "MacBook Air M3 Closed View" },
      { id: "side", src: "/assets/extracted/Laptops_pzewpv.png", alt: "MacBook Air M3 Side View" },
      { id: "keyboard", src: "/assets/extracted/Laptops_pzewpv.png", alt: "MacBook Air M3 Keyboard" },
    ],
    price: 89990,
    originalPrice: 114900,
    discount: "22% Off",
    savings: "₹24,910",
    rating: "4.8",
    reviews: "29",
    deliveryDate: "Tue, 25th Mar",
    deliveryFee: "FREE",
    inStock: true,
    extraDiscount: "Extra discount of Rs. 5000",
    bankOffers: [
      { id: "1", bank: "HSBC", description: "Get 10% Instant Discount up to Rs.9,000 on HSBC Credit Card EMI transactions" },
      { id: "2", bank: "HDFC", description: "Get 10% Instant Discount up to Rs.5,000 on HDFC Bank Credit Card EMI" },
      { id: "3", bank: "ICICI", description: "Get 10% Instant Discount up to Rs.5,000 on ICICI Bank Credit Card transactions" },
    ],
    highlights: [
      { text: "Apple M3 chip with 8-core CPU and 10-core GPU" },
      { text: "13.6-inch Liquid Retina Display with True Tone" },
      { text: "Up to 18 hours of battery life" },
      { text: "Fanless design — completely silent operation" },
      { text: "MagSafe charging + 2x Thunderbolt/USB 4 ports" },
      { text: "1080p FaceTime HD camera with advanced ISP" },
    ],
    specGroups: [
      {
        groupName: "General",
        specs: [
          { label: "Brand", value: "Apple" },
          { label: "Model", value: "MacBook Air M3 2024" },
          { label: "Color", value: "Midnight" },
          { label: "Operating System", value: "macOS Sonoma" },
          { label: "Weight", value: "1.24 kg" },
        ],
      },
      {
        groupName: "Display",
        specs: [
          { label: "Display Size", value: "13.6 inches" },
          { label: "Resolution", value: "2560 x 1664" },
          { label: "Display Type", value: "Liquid Retina (IPS)" },
          { label: "Brightness", value: "500 nits" },
          { label: "Color Gamut", value: "P3 Wide Color" },
        ],
      },
      {
        groupName: "Performance",
        specs: [
          { label: "Processor", value: "Apple M3 (8-core CPU)" },
          { label: "GPU", value: "10-core Apple GPU" },
          { label: "RAM", value: "8 GB Unified Memory" },
          { label: "Storage", value: "256 GB SSD" },
        ],
      },
      {
        groupName: "Battery",
        specs: [
          { label: "Battery Life", value: "Up to 18 hours" },
          { label: "Charging", value: "MagSafe, USB-C" },
          { label: "Adapter", value: "35W Dual USB-C" },
        ],
      },
    ],
    variants: [
      { name: "Color", options: [{ label: "Midnight", selected: true }, { label: "Starlight" }, { label: "Space Gray" }] },
      { name: "RAM", options: [{ label: "8GB", selected: true }, { label: "16GB" }] },
      { name: "Storage", options: [{ label: "256GB", selected: true }, { label: "512GB" }, { label: "1TB" }] },
    ],
    overview: [
      { heading: "Supercharged by M3", description: "The Apple M3 chip brings incredible performance to the MacBook Air with an 8-core CPU and 10-core GPU. Edit photos, compile code, and multitask with ease — all while staying cool with a fanless, completely silent design." },
      { heading: "All-Day Battery Life", description: "With up to 18 hours of battery life, the MacBook Air M3 keeps up with your longest days. MagSafe charging means you can power up quickly, and two Thunderbolt/USB 4 ports connect all your peripherals." },
    ],
    relatedProductIds: ["7", "3", "6"],
    emiStartsAt: "₹7,499/month",
    noCostEmi: true,
    warranty: "1 Year Apple India Warranty",
  },
  {
    id: "5",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones (Black)",
    slug: "sony-wh-1000xm5",
    category: "Headphones & Speakers",
    categorySlug: "headphones-speakers",
    brand: "Sony",
    images: [
      { id: "front", src: "/assets/extracted/Head_set_xjj934.png", alt: "Sony WH-1000XM5 Front View" },
      { id: "folded", src: "/assets/extracted/Head_set_xjj934.png", alt: "Sony WH-1000XM5 Folded" },
      { id: "side", src: "/assets/extracted/Head_set_xjj934.png", alt: "Sony WH-1000XM5 Side View" },
      { id: "case", src: "/assets/extracted/Head_set_xjj934.png", alt: "Sony WH-1000XM5 with Case" },
    ],
    price: 22990,
    originalPrice: 34990,
    discount: "34% Off",
    savings: "₹12,000",
    rating: "4.5",
    reviews: "64",
    deliveryDate: "Wed, 26th Mar",
    deliveryFee: "FREE",
    inStock: true,
    bankOffers: [
      { id: "1", bank: "HSBC", description: "Get 10% Instant Discount up to Rs.2,500 on HSBC Credit Card EMI transactions" },
      { id: "2", bank: "HDFC", description: "Get 10% Instant Discount up to Rs.2,000 on HDFC Bank Credit Card EMI" },
      { id: "3", bank: "SBI", description: "Get 7.5% Instant Discount up to Rs.1,500 on SBI Credit Card transactions" },
    ],
    highlights: [
      { text: "Industry-leading noise cancellation with 8 microphones" },
      { text: "30 hours of battery life with quick charge" },
      { text: "Hi-Res Audio with LDAC codec support" },
      { text: "Speak-to-Chat pauses music automatically" },
      { text: "Multipoint connection — 2 devices simultaneously" },
      { text: "Ultra-lightweight 250g carbon fiber design" },
    ],
    specGroups: [
      {
        groupName: "General",
        specs: [
          { label: "Brand", value: "Sony" },
          { label: "Model", value: "WH-1000XM5" },
          { label: "Color", value: "Black" },
          { label: "Type", value: "Over-ear, Closed-back" },
          { label: "Weight", value: "250g" },
        ],
      },
      {
        groupName: "Audio",
        specs: [
          { label: "Driver Size", value: "30mm" },
          { label: "Frequency Response", value: "4Hz - 40,000Hz" },
          { label: "Impedance", value: "48 ohms" },
          { label: "Codec Support", value: "SBC, AAC, LDAC" },
          { label: "ANC", value: "Yes (Adaptive)" },
        ],
      },
      {
        groupName: "Battery",
        specs: [
          { label: "Battery Life (ANC On)", value: "30 hours" },
          { label: "Battery Life (ANC Off)", value: "40 hours" },
          { label: "Quick Charge", value: "3 min = 3 hours" },
          { label: "Charging", value: "USB-C" },
        ],
      },
      {
        groupName: "Connectivity",
        specs: [
          { label: "Bluetooth", value: "v5.2" },
          { label: "Multipoint", value: "Yes (2 devices)" },
          { label: "NFC", value: "Yes" },
          { label: "Wired Option", value: "3.5mm (included)" },
        ],
      },
    ],
    variants: [
      { name: "Color", options: [{ label: "Black", selected: true }, { label: "Silver" }, { label: "Midnight Blue" }] },
    ],
    overview: [
      { heading: "Industry-Leading Noise Cancellation", description: "The WH-1000XM5 features Sony's most advanced noise cancellation ever, using 8 microphones and two processors to block out the world. Whether on a plane, in the office, or on a busy street, enjoy pure, uninterrupted sound." },
      { heading: "Premium Sound Quality", description: "With 30mm drivers and LDAC Hi-Res Audio codec support, every note comes alive with stunning clarity and detail. The auto-optimizing equalizer adapts to your environment for the perfect listening experience." },
    ],
    relatedProductIds: ["8", "2", "9"],
    emiStartsAt: "₹1,916/month",
    noCostEmi: true,
    warranty: "1 Year Sony India Manufacturer Warranty",
  },
  {
    id: "6",
    title: "Canon EOS R50 Mirrorless Camera with RF-S 18-45mm Lens Kit",
    slug: "canon-eos-r50",
    category: "Cameras",
    categorySlug: "cameras",
    brand: "Canon",
    images: [
      { id: "front", src: "/assets/extracted/Cameras_a6n2jy.png", alt: "Canon EOS R50 Front View" },
      { id: "back", src: "/assets/extracted/Cameras_a6n2jy.png", alt: "Canon EOS R50 Back View" },
      { id: "top", src: "/assets/extracted/Cameras_a6n2jy.png", alt: "Canon EOS R50 Top View" },
      { id: "lens", src: "/assets/extracted/Cameras_a6n2jy.png", alt: "Canon EOS R50 with Lens" },
    ],
    price: 62990,
    originalPrice: 79995,
    discount: "21% Off",
    savings: "₹17,005",
    rating: "4.7",
    reviews: "12",
    deliveryDate: "Fri, 28th Mar",
    deliveryFee: "FREE",
    inStock: true,
    bankOffers: [
      { id: "1", bank: "HSBC", description: "Get 10% Instant Discount up to Rs.6,000 on HSBC Credit Card EMI transactions" },
      { id: "2", bank: "HDFC", description: "Get 10% Instant Discount up to Rs.3,000 on HDFC Bank Credit Card EMI" },
      { id: "3", bank: "SBI", description: "Get 7.5% Instant Discount up to Rs.2,500 on SBI Credit Card EMI transactions" },
    ],
    highlights: [
      { text: "24.2MP APS-C CMOS Sensor with DIGIC X processor" },
      { text: "4K UHD video recording at 30fps" },
      { text: "Dual Pixel CMOS AF II with Eye Detection" },
      { text: "Vari-angle touchscreen LCD" },
      { text: "Built-in Wi-Fi & Bluetooth for instant sharing" },
      { text: "Subject detection for people, animals & vehicles" },
    ],
    specGroups: [
      {
        groupName: "General",
        specs: [
          { label: "Brand", value: "Canon" },
          { label: "Model", value: "EOS R50" },
          { label: "Type", value: "Mirrorless" },
          { label: "Color", value: "Black" },
          { label: "Weight", value: "375g (body only)" },
        ],
      },
      {
        groupName: "Sensor",
        specs: [
          { label: "Sensor Type", value: "APS-C CMOS" },
          { label: "Megapixels", value: "24.2 MP" },
          { label: "Image Processor", value: "DIGIC X" },
          { label: "ISO Range", value: "100 - 32,000 (expandable to 51,200)" },
        ],
      },
      {
        groupName: "Video",
        specs: [
          { label: "Max Resolution", value: "4K UHD (3840 x 2160)" },
          { label: "Frame Rate", value: "30fps (4K), 60fps (Full HD)" },
          { label: "Video Format", value: "MP4, MOV" },
          { label: "Slow Motion", value: "120fps (Full HD)" },
        ],
      },
      {
        groupName: "Lens",
        specs: [
          { label: "Included Lens", value: "RF-S 18-45mm f/4.5-6.3 IS STM" },
          { label: "Lens Mount", value: "Canon RF" },
          { label: "Image Stabilization", value: "Yes (Lens-based)" },
        ],
      },
    ],
    relatedProductIds: ["3", "4", "7"],
    emiStartsAt: "₹5,249/month",
    noCostEmi: true,
    warranty: "2 Year Canon India Warranty",
  },
  {
    id: "7",
    title: "Apple iPad Air 11 inch M2 Chip (128GB, Wi-Fi, Space Grey)",
    slug: "apple-ipad-air-m2",
    category: "Mobiles, Tablets & Accessories",
    categorySlug: "mobiles-tablets-accessories",
    brand: "Apple",
    images: [
      { id: "front", src: "/assets/extracted/Tablets_yzod4f.png", alt: "iPad Air M2 Front View" },
      { id: "back", src: "/assets/extracted/Tablets_yzod4f.png", alt: "iPad Air M2 Back View" },
      { id: "pencil", src: "/assets/extracted/Tablets_yzod4f.png", alt: "iPad Air M2 with Apple Pencil" },
      { id: "keyboard", src: "/assets/extracted/Tablets_yzod4f.png", alt: "iPad Air M2 with Keyboard" },
    ],
    price: 49900,
    originalPrice: 69900,
    discount: "29% Off",
    savings: "₹20,000",
    rating: "4.4",
    reviews: "19",
    deliveryDate: "Mon, 31st Mar",
    deliveryFee: "FREE",
    inStock: true,
    bankOffers: [
      { id: "1", bank: "HSBC", description: "Get 10% Instant Discount up to Rs.5,000 on HSBC Credit Card EMI transactions" },
      { id: "2", bank: "HDFC", description: "Get 10% Instant Discount up to Rs.3,000 on HDFC Bank Credit Card EMI" },
      { id: "3", bank: "ICICI", description: "Get 10% Instant Discount up to Rs.3,000 on ICICI Bank Credit Card transactions" },
    ],
    highlights: [
      { text: "Apple M2 chip with 8-core CPU and 10-core GPU" },
      { text: "11-inch Liquid Retina Display with P3 Wide Color" },
      { text: "12MP Wide camera + 12MP Ultra Wide front camera" },
      { text: "Apple Pencil Pro & Magic Keyboard compatible" },
      { text: "All-day battery life up to 10 hours" },
      { text: "Wi-Fi 6E for faster wireless connectivity" },
    ],
    specGroups: [
      {
        groupName: "General",
        specs: [
          { label: "Brand", value: "Apple" },
          { label: "Model", value: "iPad Air (M2, 2024)" },
          { label: "Color", value: "Space Grey" },
          { label: "Operating System", value: "iPadOS 17" },
          { label: "Weight", value: "462g" },
        ],
      },
      {
        groupName: "Display",
        specs: [
          { label: "Display Size", value: "11 inches" },
          { label: "Resolution", value: "2360 x 1640" },
          { label: "Display Type", value: "Liquid Retina (IPS)" },
          { label: "Brightness", value: "500 nits" },
          { label: "True Tone", value: "Yes" },
        ],
      },
      {
        groupName: "Performance",
        specs: [
          { label: "Chip", value: "Apple M2" },
          { label: "CPU Cores", value: "8" },
          { label: "GPU Cores", value: "10" },
          { label: "Storage", value: "128 GB" },
        ],
      },
      {
        groupName: "Camera",
        specs: [
          { label: "Rear Camera", value: "12MP Wide" },
          { label: "Front Camera", value: "12MP Ultra Wide" },
          { label: "Video Recording", value: "4K@60fps" },
        ],
      },
    ],
    relatedProductIds: ["3", "4", "9"],
    emiStartsAt: "₹4,158/month",
    noCostEmi: true,
    warranty: "1 Year Apple India Warranty",
  },
  {
    id: "8",
    title: "JBL Flip 6 Portable Bluetooth Speaker with IP67 Waterproof",
    slug: "jbl-flip-6",
    category: "Headphones & Speakers",
    categorySlug: "headphones-speakers",
    brand: "JBL",
    images: [
      { id: "front", src: "/assets/extracted/Speaker_g2mbgn.png", alt: "JBL Flip 6 Front View" },
      { id: "side", src: "/assets/extracted/Speaker_g2mbgn.png", alt: "JBL Flip 6 Side View" },
      { id: "bottom", src: "/assets/extracted/Speaker_g2mbgn.png", alt: "JBL Flip 6 Bottom View" },
      { id: "outdoor", src: "/assets/extracted/Speaker_g2mbgn.png", alt: "JBL Flip 6 Outdoor Use" },
    ],
    price: 8999,
    originalPrice: 14999,
    discount: "40% Off",
    savings: "₹6,000",
    rating: "4.3",
    reviews: "45",
    deliveryDate: "Tomorrow",
    deliveryFee: "FREE",
    inStock: true,
    extraDiscount: "Extra discount of Rs. 1000",
    bankOffers: [
      { id: "1", bank: "HSBC", description: "Get 10% Instant Discount up to Rs.1,000 on HSBC Credit Card EMI transactions" },
      { id: "2", bank: "HDFC", description: "Get 10% Instant Discount up to Rs.750 on HDFC Bank Credit Card EMI" },
      { id: "3", bank: "SBI", description: "Get 7.5% Instant Discount up to Rs.500 on SBI Credit Card transactions" },
    ],
    highlights: [
      { text: "JBL Pro Sound with powerful bass radiator" },
      { text: "IP67 Waterproof & Dustproof — pool and beach ready" },
      { text: "12 hours of playtime on a single charge" },
      { text: "PartyBoost — pair 2 speakers for stereo sound" },
      { text: "USB-C charging for universal compatibility" },
      { text: "Bold design with durable fabric and rubber housing" },
    ],
    specGroups: [
      {
        groupName: "General",
        specs: [
          { label: "Brand", value: "JBL" },
          { label: "Model", value: "Flip 6" },
          { label: "Color", value: "Black" },
          { label: "Type", value: "Portable Bluetooth Speaker" },
          { label: "Weight", value: "550g" },
        ],
      },
      {
        groupName: "Audio",
        specs: [
          { label: "Driver Size", value: "Racetrack-shaped driver" },
          { label: "Output Power", value: "30W" },
          { label: "Frequency Response", value: "63Hz - 20kHz" },
          { label: "Bass Technology", value: "Dual passive radiators" },
        ],
      },
      {
        groupName: "Battery",
        specs: [
          { label: "Battery Life", value: "12 hours" },
          { label: "Charging Time", value: "2.5 hours" },
          { label: "Charging", value: "USB-C" },
        ],
      },
      {
        groupName: "Connectivity",
        specs: [
          { label: "Bluetooth", value: "v5.1" },
          { label: "PartyBoost", value: "Yes" },
          { label: "Water Resistance", value: "IP67" },
        ],
      },
    ],
    relatedProductIds: ["5", "2", "9"],
    emiStartsAt: "₹750/month",
    noCostEmi: true,
    warranty: "1 Year JBL India Warranty",
  },
  {
    id: "9",
    title: "Apple Watch Series 9 GPS 45mm Aluminium Case (Midnight)",
    slug: "apple-watch-series-9",
    category: "Mobiles, Tablets & Accessories",
    categorySlug: "mobiles-tablets-accessories",
    brand: "Apple",
    images: [
      { id: "front", src: "/assets/extracted/Wearables_iunu7h.png", alt: "Apple Watch Series 9 Front View" },
      { id: "side", src: "/assets/extracted/Wearables_iunu7h.png", alt: "Apple Watch Series 9 Side View" },
      { id: "band", src: "/assets/extracted/Wearables_iunu7h.png", alt: "Apple Watch Series 9 Band" },
      { id: "fitness", src: "/assets/extracted/Wearables_iunu7h.png", alt: "Apple Watch Series 9 Fitness" },
    ],
    price: 36900,
    originalPrice: 49900,
    discount: "26% Off",
    savings: "₹13,000",
    rating: "4.6",
    reviews: "33",
    deliveryDate: "Thur, 27th Mar",
    deliveryFee: "FREE",
    inStock: true,
    bankOffers: [
      { id: "1", bank: "HSBC", description: "Get 10% Instant Discount up to Rs.4,000 on HSBC Credit Card EMI transactions" },
      { id: "2", bank: "HDFC", description: "Get 10% Instant Discount up to Rs.2,500 on HDFC Bank Credit Card EMI" },
      { id: "3", bank: "SBI", description: "Get 7.5% Instant Discount up to Rs.2,000 on SBI Credit Card EMI transactions" },
    ],
    highlights: [
      { text: "Apple S9 SiP with 4-core Neural Engine" },
      { text: "Always-On Retina Display (2000 nits peak)" },
      { text: "Double Tap gesture for hands-free control" },
      { text: "Advanced health sensors — Heart Rate, Blood Oxygen, ECG" },
      { text: "Crash Detection and Fall Detection" },
      { text: "50m Water Resistance (WR50)" },
    ],
    specGroups: [
      {
        groupName: "General",
        specs: [
          { label: "Brand", value: "Apple" },
          { label: "Model", value: "Watch Series 9" },
          { label: "Case Size", value: "45mm" },
          { label: "Case Material", value: "Aluminium" },
          { label: "Color", value: "Midnight" },
          { label: "Operating System", value: "watchOS 10" },
        ],
      },
      {
        groupName: "Display",
        specs: [
          { label: "Display Type", value: "LTPO OLED (Always-On)" },
          { label: "Resolution", value: "396 x 484" },
          { label: "Peak Brightness", value: "2000 nits" },
        ],
      },
      {
        groupName: "Health",
        specs: [
          { label: "Heart Rate", value: "Optical heart rate sensor" },
          { label: "Blood Oxygen", value: "SpO2 sensor" },
          { label: "ECG", value: "Yes (electrical heart sensor)" },
          { label: "Temperature", value: "Wrist temperature sensing" },
        ],
      },
      {
        groupName: "Connectivity",
        specs: [
          { label: "Connectivity", value: "GPS" },
          { label: "Bluetooth", value: "v5.3" },
          { label: "Wi-Fi", value: "802.11 b/g/n" },
          { label: "NFC", value: "Yes (Apple Pay)" },
          { label: "Water Resistance", value: "50m (WR50)" },
        ],
      },
    ],
    relatedProductIds: ["3", "5", "7"],
    emiStartsAt: "₹3,075/month",
    noCostEmi: true,
    warranty: "1 Year Apple India Warranty",
  },
];

const LEGACY_PRODUCT_SLUG_TO_ID: Record<string, string> = {
  [generateProductSlug("Croma 80 cm (32 inch) HD Ready LED TV with A+ Panel")]: "1",
  [generateProductSlug("Croma 5.1 Channel 340W Dolby Digital Soundbar with Subwoofer")]: "2",
  [generateProductSlug("Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB, Titanium Black)")]: "3",
  [generateProductSlug("Apple MacBook Air 13 inch M3 Chip (8GB RAM, 256GB SSD, Midnight)")]: "4",
  [generateProductSlug("Sony WH-1000XM5 Wireless Noise Cancelling Headphones (Black)")]: "5",
  [generateProductSlug("Canon EOS R50 Mirrorless Camera with RF-S 18-45mm Lens Kit")]: "6",
  [generateProductSlug("Apple iPad Air 11 inch M2 Chip (128GB, Wi-Fi, Space Grey)")]: "7",
  [generateProductSlug("JBL Flip 6 Portable Bluetooth Speaker with IP67 Waterproof")]: "8",
  [generateProductSlug("Apple Watch Series 9 GPS 45mm Aluminium Case (Midnight)")]: "9",
};

export function getProductBySlug(slug: string): ProductDetail | undefined {
  const product = MOCK_PRODUCT_DETAILS.find((p) => p.slug === slug);
  if (product) return product;

  const legacyProductId = LEGACY_PRODUCT_SLUG_TO_ID[slug];
  return MOCK_PRODUCT_DETAILS.find((p) => p.id === legacyProductId);
}

export function getRelatedProducts(ids: string[]): ProductDetail[] {
  return MOCK_PRODUCT_DETAILS.filter((p) => ids.includes(p.id));
}

export function apiProductToDetail(
  p: import("./catalog-api").ApiProduct
): ProductDetail {
  const price = Number(p.price);
  const mrp = p.mrp ? Number(p.mrp) : price;
  const discountPct = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const savings = mrp > price ? `₹${(mrp - price).toLocaleString("en-IN")}` : "";

  return {
    id: p.id,
    title: p.name,
    slug: p.slug,
    category: p.category?.name ?? "Products",
    categorySlug: p.category?.slug ?? "products",
    brand: p.brand ?? "VolteX",
    images: p.images.length > 0
      ? p.images.map((src, i) => ({ id: String(i), src, alt: `${p.name} image ${i + 1}` }))
      : [{ id: "placeholder", src: "/assets/extracted/Mobile_sdtrdf.png", alt: p.name }],
    price,
    originalPrice: mrp,
    discount: discountPct > 0 ? `${discountPct}% Off` : "",
    savings,
    rating: p.rating ? String(p.rating) : "4.0",
    reviews: String(p.reviewCount ?? 0),
    ratingCount: String(p.ratingCount ?? p.reviewCount ?? 0),
    deliveryDate: p.deliveryDate ?? "3-5 business days",
    deliveryFee: p.deliveryFee ?? "FREE",
    inStock: p.stock > 0,
    bankOffers: p.bankOffers ?? [],
    highlights: p.highlights && p.highlights.length > 0
      ? p.highlights
      : p.description
      ? [{ text: p.description }]
      : [],
    specGroups: p.specGroups ?? [],
    overview: p.overview ?? [],
    variants: p.variants ?? [],
    relatedProductIds: p.relatedProductIds ?? [],
    warranty: p.warranty ?? undefined,
  };
}

export { MOCK_PRODUCT_DETAILS };
