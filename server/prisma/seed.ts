import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const categoryTree = [
  {
    name: "Air Conditioners",
    slug: "air-conditioners",
    imageUrl: "/assets/extracted/Air_Conditioner_a4hg1z.png",
  },
  {
    name: "Mobiles, Tablets & Accessories",
    slug: "mobiles-tablets-accessories",
    imageUrl: "/assets/extracted/Mobile_sdtrdf.png",
    children: [
      "Smartphone",
      "iPhone",
      "Charger",
      "Smart Watch",
      "iPad",
      "Cable",
      "Tablet Accessories",
      "Power Bank",
      "Tablets",
      "Cases and Cover",
    ],
  },
  {
    name: "Laptops & Accessories",
    slug: "laptops-accessories",
    imageUrl: "/assets/extracted/Laptops_pzewpv.png",
    children: ["Laptop", "MacBook", "Printer", "Router", "Mouse", "Keyboards", "Hard Disk", "SSD"],
  },
  {
    name: "Home Appliances",
    slug: "home-appliances",
    imageUrl: "/assets/extracted/Washing_machines_izyrnd.png",
    children: [
      "Washing Machine",
      "Refrigerator",
      "Air Cooler",
      "Vacuum Cleaner",
      "Air Purifier",
      "Geyser",
      "Dishwasher",
    ],
  },
  {
    name: "Kitchen Appliances",
    slug: "kitchen-appliances",
    imageUrl: "/assets/extracted/Kitchen_Appliances_yhzevo.png",
  },
  {
    name: "TV & Entertainment",
    slug: "tv-entertainment",
    imageUrl: "/assets/extracted/TV_vdemgc.png",
  },
  {
    name: "Personal Care",
    slug: "personal-care",
    imageUrl: "/assets/extracted/Grooming_vvxudd.png",
  },
  {
    name: "Headphones & Speakers",
    slug: "headphones-speakers",
    imageUrl: "/assets/extracted/Head_set_xjj934.png",
  },
  {
    name: "Cameras",
    slug: "cameras",
    imageUrl: "/assets/extracted/Cameras_a6n2jy.png",
  },
] as const;

const products = [
  {
    name: "Croma 80 cm (32 inch) HD Ready LED TV with A+ Panel",
    slug: "croma-32-led-tv",
    description: "Compact HD Ready LED TV with slim bezels, Dolby Audio, HDMI, and USB connectivity.",
    price: 9990,
    mrp: 19000,
    stock: 25,
    brand: "Croma",
    categorySlug: "tv-entertainment",
    images: ["/assets/extracted/TV_vdemgc.png"],
  },
  {
    name: "Croma 5.1 Channel 340W Dolby Digital Soundbar with Subwoofer",
    slug: "croma-soundbar-340w",
    description: "340W home theatre soundbar with Dolby Digital, deep bass subwoofer, Bluetooth, HDMI ARC, and optical input.",
    price: 10990,
    mrp: 18000,
    stock: 18,
    brand: "Croma",
    categorySlug: "headphones-speakers",
    images: ["/assets/extracted/Home_theatres_kpwvft.png"],
  },
  {
    name: "Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB, Titanium Black)",
    slug: "samsung-galaxy-s24-ultra",
    description: "Premium 5G smartphone with Dynamic AMOLED display, flagship processor, S Pen, and pro-grade camera system.",
    price: 69999,
    mrp: 134999,
    stock: 14,
    brand: "Samsung",
    categorySlug: "mobiles-tablets-accessories",
    images: ["/assets/extracted/Mobile_sdtrdf.png"],
  },
  {
    name: "Apple MacBook Air 13 inch M3 Chip (8GB RAM, 256GB SSD, Midnight)",
    slug: "apple-macbook-air-m3",
    description: "Thin and light MacBook Air with M3 chip, Liquid Retina display, all-day battery life, and 256GB SSD.",
    price: 89990,
    mrp: 114900,
    stock: 12,
    brand: "Apple",
    categorySlug: "laptops-accessories",
    images: ["/assets/extracted/Laptops_pzewpv.png"],
  },
  {
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones (Black)",
    slug: "sony-wh-1000xm5",
    description: "Wireless ANC headphones with adaptive noise cancellation, clear calling, and long battery life.",
    price: 22990,
    mrp: 34990,
    stock: 22,
    brand: "Sony",
    categorySlug: "headphones-speakers",
    images: ["/assets/extracted/Head_set_xjj934.png"],
  },
  {
    name: "Canon EOS R50 Mirrorless Camera with RF-S 18-45mm Lens Kit",
    slug: "canon-eos-r50",
    description: "Compact mirrorless camera for creators with 24.2MP sensor, 4K video, and RF-S kit lens.",
    price: 62990,
    mrp: 79995,
    stock: 9,
    brand: "Canon",
    categorySlug: "cameras",
    images: ["/assets/extracted/Cameras_a6n2jy.png"],
  },
  {
    name: "Apple iPad Air 11 inch M2 Chip (128GB, Wi-Fi, Space Grey)",
    slug: "apple-ipad-air-m2",
    description: "11-inch iPad Air with M2 chip, Liquid Retina display, Wi-Fi, and 128GB storage.",
    price: 49900,
    mrp: 69900,
    stock: 16,
    brand: "Apple",
    categorySlug: "mobiles-tablets-accessories",
    images: ["/assets/extracted/Tablets_yzod4f.png"],
  },
  {
    name: "JBL Flip 6 Portable Bluetooth Speaker with IP67 Waterproof",
    slug: "jbl-flip-6",
    description: "Portable waterproof Bluetooth speaker with powerful JBL Original Pro Sound and long battery life.",
    price: 8999,
    mrp: 14999,
    stock: 30,
    brand: "JBL",
    categorySlug: "headphones-speakers",
    images: ["/assets/extracted/Speaker_g2mbgn.png"],
  },
  {
    name: "Apple Watch Series 9 GPS 45mm Aluminium Case (Midnight)",
    slug: "apple-watch-series-9",
    description: "Smart watch with bright Retina display, health tracking, GPS, workout modes, and safety features.",
    price: 36900,
    mrp: 49900,
    stock: 20,
    brand: "Apple",
    categorySlug: "mobiles-tablets-accessories",
    images: ["/assets/extracted/Wearables_iunu7h.png"],
  },
  {
    name: "VolteX 1.5 Ton 5 Star Inverter Split AC",
    slug: "voltex-1-5-ton-5-star-inverter-split-ac",
    description: "Energy-efficient inverter split AC with copper condenser, turbo cooling, and stabilizer-free operation.",
    price: 36990,
    mrp: 52990,
    stock: 11,
    brand: "VolteX",
    categorySlug: "air-conditioners",
    images: ["/assets/extracted/Air_Conditioner_a4hg1z.png"],
  },
  {
    name: "LG 260 L Frost Free Double Door Refrigerator",
    slug: "lg-260l-frost-free-refrigerator",
    description: "Double door refrigerator with smart inverter compressor, frost-free cooling, and toughened glass shelves.",
    price: 28990,
    mrp: 39990,
    stock: 13,
    brand: "LG",
    categorySlug: "home-appliances",
    images: ["/assets/extracted/Ref_biysg7.png"],
  },
  {
    name: "Bosch 8 kg Front Load Washing Machine",
    slug: "bosch-8kg-front-load-washing-machine",
    description: "Front load washing machine with inverter motor, quick wash programs, and anti-vibration design.",
    price: 33990,
    mrp: 46990,
    stock: 10,
    brand: "Bosch",
    categorySlug: "home-appliances",
    images: ["/assets/extracted/Washing_machines_izyrnd.png"],
  },
  {
    name: "Philips 6.2 L Digital Air Fryer",
    slug: "philips-6-2l-digital-air-fryer",
    description: "Large-capacity digital air fryer for low-oil cooking with preset menus and rapid air technology.",
    price: 8990,
    mrp: 14995,
    stock: 28,
    brand: "Philips",
    categorySlug: "kitchen-appliances",
    images: ["/assets/extracted/Kitchen_Appliances_yhzevo.png"],
  },
  {
    name: "Dyson V8 Cordless Vacuum Cleaner",
    slug: "dyson-v8-cordless-vacuum-cleaner",
    description: "Cordless vacuum cleaner with powerful suction, hygienic bin emptying, and multiple attachments.",
    price: 29900,
    mrp: 39900,
    stock: 8,
    brand: "Dyson",
    categorySlug: "home-appliances",
    images: ["/assets/extracted/Accessories_kefony.png"],
  },
  {
    name: "Havells 25 L Storage Water Geyser",
    slug: "havells-25l-storage-water-geyser",
    description: "25 litre storage geyser with glass-lined tank, multi-function safety valve, and adjustable thermostat.",
    price: 8490,
    mrp: 12990,
    stock: 19,
    brand: "Havells",
    categorySlug: "home-appliances",
    images: ["/assets/extracted/D_Geyser_i5frr1.png"],
  },
  {
    name: "Samsung 28 L Convection Microwave Oven",
    slug: "samsung-28l-convection-microwave-oven",
    description: "Convection microwave oven for baking, grilling, reheating, and Indian recipe presets.",
    price: 11990,
    mrp: 17990,
    stock: 15,
    brand: "Samsung",
    categorySlug: "kitchen-appliances",
    images: ["/assets/extracted/Microwaves_otd6qq.png"],
  },
  {
    name: "Mi 20000mAh Fast Charging Power Bank",
    slug: "mi-20000mah-fast-charging-power-bank",
    description: "High-capacity power bank with dual USB output, fast charging, and 12-layer circuit protection.",
    price: 1999,
    mrp: 3499,
    stock: 45,
    brand: "Mi",
    categorySlug: "mobiles-tablets-accessories",
    images: ["/assets/extracted/Accessories_kefony.png"],
  },
  {
    name: "Logitech MK345 Wireless Keyboard and Mouse Combo",
    slug: "logitech-mk345-wireless-keyboard-mouse-combo",
    description: "Wireless keyboard and mouse combo with comfortable typing, media keys, and reliable connectivity.",
    price: 2495,
    mrp: 3495,
    stock: 26,
    brand: "Logitech",
    categorySlug: "laptops-accessories",
    images: ["/assets/extracted/Accessories_kefony.png"],
  },
  {
    name: "Panasonic 55 inch 4K Ultra HD Smart LED TV",
    slug: "panasonic-55-inch-4k-smart-led-tv",
    description: "55-inch 4K smart TV with vivid picture processing, streaming apps, and immersive surround sound.",
    price: 38990,
    mrp: 64990,
    stock: 7,
    brand: "Panasonic",
    categorySlug: "tv-entertainment",
    images: ["/assets/extracted/HP_Rotating_TV_24March2026_KOcXJxvPV.jpg"],
  },
  {
    name: "Philips OneBlade Hybrid Trimmer",
    slug: "philips-oneblade-hybrid-trimmer",
    description: "Hybrid trimmer and shaver with rechargeable battery, skin-friendly blade, and precision combs.",
    price: 2499,
    mrp: 3999,
    stock: 32,
    brand: "Philips",
    categorySlug: "personal-care",
    images: ["/assets/extracted/Grooming_vvxudd.png"],
  },
] as const;

function toChildSlug(parentSlug: string, name: string) {
  return `${parentSlug}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`;
}

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL ?? "admin@voltex.com";
  const password = process.env.ADMIN_SEED_PASSWORD ?? "admin_change_me_123!";
  const name = process.env.ADMIN_SEED_NAME ?? "Admin";

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name },
    create: {
      email,
      name,
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log(`✅  Admin seeded: ${admin.email} (id: ${admin.id})`);

  const categoryBySlug = new Map<string, { id: string }>();

  for (const [index, category] of categoryTree.entries()) {
    const parent = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        imageUrl: category.imageUrl,
        parentId: null,
        sortOrder: index,
        isActive: true,
      },
      create: {
        name: category.name,
        slug: category.slug,
        imageUrl: category.imageUrl,
        sortOrder: index,
        isActive: true,
      },
      select: { id: true },
    });
    categoryBySlug.set(category.slug, parent);

    for (const [childIndex, childName] of (category.children ?? []).entries()) {
      const childSlug = toChildSlug(category.slug, childName);
      const child = await prisma.category.upsert({
        where: { slug: childSlug },
        update: {
          name: childName,
          parentId: parent.id,
          sortOrder: childIndex,
          isActive: true,
        },
        create: {
          name: childName,
          slug: childSlug,
          parentId: parent.id,
          sortOrder: childIndex,
          isActive: true,
        },
        select: { id: true },
      });
      categoryBySlug.set(childSlug, child);
    }
  }

  for (const product of products) {
    const category = categoryBySlug.get(product.categorySlug);
    if (!category) {
      throw new Error(`Missing category for product ${product.slug}: ${product.categorySlug}`);
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        mrp: product.mrp,
        stock: product.stock,
        images: [...product.images],
        brand: product.brand,
        categoryId: category.id,
        isActive: true,
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        mrp: product.mrp,
        stock: product.stock,
        images: [...product.images],
        brand: product.brand,
        categoryId: category.id,
        isActive: true,
      },
    });
  }

  console.log(`✅  Categories seeded: ${categoryTree.length} parent categories`);
  console.log(`✅  Products seeded: ${products.length} demo products`);
}

main()
  .catch((e) => {
    console.error("❌  Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
