import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import https from "node:https";

dotenv.config();

const prisma = new PrismaClient();

// ─── Config ──────────────────────────────────────────────────────────

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Free-tier Gemini caps image gen around 10–15 req/min; throttle to stay under.
const GEMINI_DELAY_MS = 4500;

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const SUPABASE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "product-images";

const FALLBACK_IMAGE_URL = "https://placehold.co/800x800/0f0f0f/49A5A2/png?text=VolteX";

// ─── Category tree ────────────────────────────────────────────────────

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
      "Tablets",
      "Smart Watch",
      "Power Bank",
      "Cases and Cover",
      "Charger",
    ],
  },
  {
    name: "Laptops & Accessories",
    slug: "laptops-accessories",
    imageUrl: "/assets/extracted/Laptops_pzewpv.png",
    children: ["Laptop", "MacBook", "Mouse", "Keyboards", "Hard Disk", "SSD"],
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

// ─── Product catalog (30 products, 3+ per category) ──────────────────

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  price: number;
  mrp: number;
  stock: number;
  brand: string;
  categorySlug: string;
  rating: number;
  ratingCount: number;
  imagePrompt: string;
};

const products: SeedProduct[] = [
  // Air Conditioners (3)
  {
    name: "VolteX 1.5 Ton 5 Star Inverter Split AC (White, Copper Condenser)",
    slug: "voltex-1-5-ton-inverter-split-ac",
    description: "Energy-efficient inverter split AC with copper condenser, turbo cooling mode, and stabilizer-free operation up to 175V.",
    price: 36990, mrp: 52990, stock: 18, brand: "VolteX", categorySlug: "air-conditioners",
    rating: 4.3, ratingCount: 142,
    imagePrompt: "modern white split air conditioner indoor unit, sleek minimal design, brand logo subtle, mounted on a plain studio wall",
  },
  {
    name: "LG 1 Ton 3 Star Window AC with Dual Inverter",
    slug: "lg-1-ton-window-ac",
    description: "Window AC with dual inverter compressor, anti-corrosion ocean black protection, and energy-saving sleep mode.",
    price: 27990, mrp: 39990, stock: 12, brand: "LG", categorySlug: "air-conditioners",
    rating: 4.1, ratingCount: 87,
    imagePrompt: "white window air conditioner unit, front view, modern design, plain studio background, product photography",
  },
  {
    name: "Daikin 2 Ton 5 Star Inverter Split AC (Premium Series)",
    slug: "daikin-2-ton-inverter-split-ac",
    description: "Premium 2-ton split AC with PM 2.5 filter, coanda airflow, and whisper-quiet operation.",
    price: 58990, mrp: 79990, stock: 8, brand: "Daikin", categorySlug: "air-conditioners",
    rating: 4.6, ratingCount: 64,
    imagePrompt: "premium white split AC indoor unit, slim modern design, soft studio lighting, plain wall background",
  },

  // Mobiles, Tablets & Accessories (4)
  {
    name: "Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB, Titanium Black)",
    slug: "samsung-galaxy-s24-ultra",
    description: "Flagship 5G smartphone with Dynamic AMOLED 2X display, Snapdragon 8 Gen 3, S Pen, and 200MP pro-grade camera.",
    price: 109999, mrp: 134999, stock: 22, brand: "Samsung", categorySlug: "mobiles-tablets-accessories",
    rating: 4.7, ratingCount: 312,
    imagePrompt: "Samsung Galaxy S24 Ultra titanium black smartphone, front and back view, floating on plain white background, premium product photography",
  },
  {
    name: "Apple iPad Air 11 inch M2 Chip (128GB, Wi-Fi, Space Grey)",
    slug: "apple-ipad-air-m2",
    description: "11-inch iPad Air powered by M2 chip with Liquid Retina display, Wi-Fi 6E, and Apple Pencil Pro support.",
    price: 59900, mrp: 69900, stock: 18, brand: "Apple", categorySlug: "mobiles-tablets-accessories",
    rating: 4.6, ratingCount: 198,
    imagePrompt: "Apple iPad Air space grey tablet, front view showing colorful wallpaper, clean white background, studio product photography",
  },
  {
    name: "OnePlus 12 5G (16GB RAM, 512GB, Flowy Emerald)",
    slug: "oneplus-12-5g",
    description: "Flagship OnePlus with Snapdragon 8 Gen 3, 120Hz ProXDR display, Hasselblad camera, and 100W SUPERVOOC charging.",
    price: 64999, mrp: 74999, stock: 15, brand: "OnePlus", categorySlug: "mobiles-tablets-accessories",
    rating: 4.5, ratingCount: 156,
    imagePrompt: "OnePlus 12 smartphone in emerald green color, back panel showing camera module, modern premium photography, plain background",
  },
  {
    name: "Apple Watch Series 9 GPS 45mm Aluminium Case (Midnight)",
    slug: "apple-watch-series-9",
    description: "Smartwatch with always-on Retina display, double-tap gesture, blood oxygen monitoring, and ECG support.",
    price: 41900, mrp: 49900, stock: 26, brand: "Apple", categorySlug: "mobiles-tablets-accessories",
    rating: 4.6, ratingCount: 245,
    imagePrompt: "Apple Watch Series 9 with midnight aluminium case and black sport band, front view showing watch face, plain white background, product photo",
  },

  // Laptops & Accessories (4)
  {
    name: "Apple MacBook Air 13 inch M3 Chip (8GB RAM, 256GB SSD, Midnight)",
    slug: "apple-macbook-air-m3",
    description: "Thin and light MacBook Air with M3 chip, 13.6-inch Liquid Retina display, MagSafe charging, and 18-hour battery life.",
    price: 99990, mrp: 114900, stock: 14, brand: "Apple", categorySlug: "laptops-accessories",
    rating: 4.8, ratingCount: 287,
    imagePrompt: "Apple MacBook Air 13 inch laptop in midnight blue color, open at 110 degrees, sleek modern design, plain white studio background",
  },
  {
    name: "Dell XPS 13 OLED Laptop (Intel Core Ultra 7, 16GB, 512GB SSD)",
    slug: "dell-xps-13-oled",
    description: "Ultra-portable XPS 13 with 13.4-inch OLED touch display, Intel Core Ultra 7, and InfinityEdge design.",
    price: 134990, mrp: 159990, stock: 9, brand: "Dell", categorySlug: "laptops-accessories",
    rating: 4.5, ratingCount: 124,
    imagePrompt: "Dell XPS 13 ultrabook laptop in silver with carbon palm rest, open at slight angle, edge-to-edge OLED screen showing abstract wallpaper, studio lit",
  },
  {
    name: "HP Pavilion 14 (Intel Core i5, 16GB RAM, 512GB SSD, Silver)",
    slug: "hp-pavilion-14",
    description: "14-inch HP Pavilion with Intel Core i5 13th Gen, 16GB DDR4, full HD IPS display, and backlit keyboard.",
    price: 64990, mrp: 79990, stock: 21, brand: "HP", categorySlug: "laptops-accessories",
    rating: 4.3, ratingCount: 178,
    imagePrompt: "HP Pavilion 14 silver laptop, open, front three-quarter view, clean keyboard visible, plain studio backdrop",
  },
  {
    name: "Logitech MX Master 3S Wireless Mouse (Graphite)",
    slug: "logitech-mx-master-3s",
    description: "Performance wireless mouse with quiet clicks, MagSpeed scrolling, 8K DPI sensor, and USB-C fast charging.",
    price: 8995, mrp: 11995, stock: 38, brand: "Logitech", categorySlug: "laptops-accessories",
    rating: 4.7, ratingCount: 412,
    imagePrompt: "Logitech MX Master 3S wireless mouse in graphite black color, side view showing ergonomic shape and thumb scroll wheel, plain white background",
  },

  // Home Appliances (4)
  {
    name: "LG 260 L Frost-Free Double Door Refrigerator (Shiny Steel)",
    slug: "lg-260l-frost-free-refrigerator",
    description: "Double-door fridge with smart inverter compressor, multi-air flow cooling, and toughened glass shelves.",
    price: 28990, mrp: 39990, stock: 11, brand: "LG", categorySlug: "home-appliances",
    rating: 4.4, ratingCount: 198,
    imagePrompt: "LG double door refrigerator in shiny stainless steel finish, both doors closed, front view, plain white studio background",
  },
  {
    name: "Bosch 8 kg Front Load Fully-Automatic Washing Machine",
    slug: "bosch-8kg-front-load-washing-machine",
    description: "Front-load washer with EcoSilence inverter motor, anti-vibration design, and 15 wash programs.",
    price: 39990, mrp: 51990, stock: 9, brand: "Bosch", categorySlug: "home-appliances",
    rating: 4.5, ratingCount: 142,
    imagePrompt: "Bosch front load washing machine in white, front view, glass round door visible, modern appliance product shot, studio lit",
  },
  {
    name: "Dyson V8 Cordless Vacuum Cleaner (Purple)",
    slug: "dyson-v8-cordless-vacuum",
    description: "Cordless stick vacuum with up to 40 mins runtime, hygienic bin emptying, and HEPA filtration.",
    price: 31900, mrp: 41900, stock: 14, brand: "Dyson", categorySlug: "home-appliances",
    rating: 4.6, ratingCount: 232,
    imagePrompt: "Dyson V8 cordless stick vacuum cleaner in purple and nickel color, full body shot standing upright, clean white background, premium product photography",
  },
  {
    name: "Havells 25 L Storage Water Geyser (White, Glasslined Tank)",
    slug: "havells-25l-storage-geyser",
    description: "25 L storage geyser with glass-lined tank, multifunction safety valve, and adjustable thermostat.",
    price: 9490, mrp: 14990, stock: 26, brand: "Havells", categorySlug: "home-appliances",
    rating: 4.2, ratingCount: 88,
    imagePrompt: "Havells vertical storage water geyser in white, front view, brand label visible, plain studio background",
  },

  // Kitchen Appliances (3)
  {
    name: "Philips 6.2 L Digital Twin TurboStar Air Fryer (Black)",
    slug: "philips-6-2l-digital-air-fryer",
    description: "Digital touchscreen air fryer with twin TurboStar tech, 7 preset menus, and dishwasher-safe basket.",
    price: 12990, mrp: 18995, stock: 22, brand: "Philips", categorySlug: "kitchen-appliances",
    rating: 4.5, ratingCount: 312,
    imagePrompt: "Philips digital air fryer in matte black, front three-quarter view, touch panel illuminated, plain white kitchen counter background",
  },
  {
    name: "Samsung 28 L Convection Microwave Oven (Black)",
    slug: "samsung-28l-convection-microwave",
    description: "Convection microwave with 200+ Indian auto cook menus, ceramic enamel cavity, and slim fry technology.",
    price: 14990, mrp: 21990, stock: 17, brand: "Samsung", categorySlug: "kitchen-appliances",
    rating: 4.4, ratingCount: 156,
    imagePrompt: "Samsung convection microwave oven in black, front view with closed door, digital display panel, plain studio background",
  },
  {
    name: "Prestige Induction Cooktop PIC 20 (1600W)",
    slug: "prestige-induction-cooktop-pic-20",
    description: "Indian-menu induction cooktop with 7 preset menus, automatic voltage regulator, and anti-magnetic wall.",
    price: 2799, mrp: 4495, stock: 48, brand: "Prestige", categorySlug: "kitchen-appliances",
    rating: 4.1, ratingCount: 524,
    imagePrompt: "Prestige induction cooktop in black, top-down view showing control panel and ceramic cooking surface, plain background",
  },

  // TV & Entertainment (3)
  {
    name: "Sony Bravia 55 inch 4K OLED Smart Google TV",
    slug: "sony-bravia-55-oled-tv",
    description: "55-inch 4K OLED TV with XR Triluminos Pro, Acoustic Surface Audio+, and Google TV.",
    price: 169990, mrp: 229990, stock: 6, brand: "Sony", categorySlug: "tv-entertainment",
    rating: 4.7, ratingCount: 87,
    imagePrompt: "Sony Bravia 55 inch OLED smart TV with ultra thin bezel, front view, bright colorful nature scene on screen, modern stand, studio backdrop",
  },
  {
    name: "Samsung 65 inch QLED 4K Smart TV (Q60D Series)",
    slug: "samsung-65-qled-4k-tv",
    description: "65-inch QLED 4K Smart TV with Quantum HDR, AirSlim design, and Tizen smart hub.",
    price: 89990, mrp: 124990, stock: 9, brand: "Samsung", categorySlug: "tv-entertainment",
    rating: 4.5, ratingCount: 132,
    imagePrompt: "Samsung 65 inch QLED smart TV, front view, slim bezel, vibrant landscape on screen, premium product photography, studio background",
  },
  {
    name: "VolteX 43 inch Full HD Smart LED TV (Android TV)",
    slug: "voltex-43-fhd-smart-led-tv",
    description: "43-inch Full HD smart LED TV with Android TV, HDR10, Dolby Audio, and built-in Chromecast.",
    price: 24990, mrp: 38990, stock: 19, brand: "VolteX", categorySlug: "tv-entertainment",
    rating: 4.2, ratingCount: 78,
    imagePrompt: "VolteX 43 inch smart LED TV, modern slim design, front view, colorful streaming app interface on screen, plain background",
  },

  // Personal Care (3)
  {
    name: "Philips OneBlade Hybrid Trimmer & Shaver (QP2525)",
    slug: "philips-oneblade-hybrid-trimmer",
    description: "Hybrid trimmer-shaver with dual-protection blade, rechargeable battery, and 3 stubble combs.",
    price: 2499, mrp: 3999, stock: 64, brand: "Philips", categorySlug: "personal-care",
    rating: 4.4, ratingCount: 1124,
    imagePrompt: "Philips OneBlade hybrid trimmer in green and black, side view, blade attached, clean studio background, premium product photo",
  },
  {
    name: "Braun Series 9 Pro Electric Shaver (9477cc)",
    slug: "braun-series-9-pro-shaver",
    description: "Premium electric shaver with 4+1 shaving elements, wet & dry use, and ProLift trimmer.",
    price: 29990, mrp: 44990, stock: 12, brand: "Braun", categorySlug: "personal-care",
    rating: 4.6, ratingCount: 198,
    imagePrompt: "Braun Series 9 electric shaver in chrome and black, front view showing shaving head, plain studio background, premium product photography",
  },
  {
    name: "Dyson Supersonic Hair Dryer (Iron/Fuchsia)",
    slug: "dyson-supersonic-hair-dryer",
    description: "Hair dryer with intelligent heat control, V9 digital motor, and 5 magnetic attachments.",
    price: 32900, mrp: 41900, stock: 11, brand: "Dyson", categorySlug: "personal-care",
    rating: 4.7, ratingCount: 256,
    imagePrompt: "Dyson Supersonic hair dryer in iron grey and fuchsia pink, side view showing distinctive design, plain white studio background",
  },

  // Headphones & Speakers (3)
  {
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones (Black)",
    slug: "sony-wh-1000xm5",
    description: "Industry-leading noise cancellation with auto NC optimizer, 30-hr battery, and crystal-clear hands-free calling.",
    price: 26990, mrp: 34990, stock: 19, brand: "Sony", categorySlug: "headphones-speakers",
    rating: 4.7, ratingCount: 412,
    imagePrompt: "Sony WH-1000XM5 over-ear wireless headphones in matte black, three-quarter angle view, plain white background, premium product photography",
  },
  {
    name: "JBL Flip 6 Portable Bluetooth Speaker (IP67 Waterproof)",
    slug: "jbl-flip-6",
    description: "Portable Bluetooth speaker with bold JBL Original Pro Sound, IP67 waterproof, and 12-hour playtime.",
    price: 9499, mrp: 14999, stock: 42, brand: "JBL", categorySlug: "headphones-speakers",
    rating: 4.4, ratingCount: 678,
    imagePrompt: "JBL Flip 6 cylindrical Bluetooth speaker in black color, side view showing JBL logo, plain studio background, vibrant product photography",
  },
  {
    name: "Bose QuietComfort Ultra Headphones (Black)",
    slug: "bose-quietcomfort-ultra",
    description: "Premium ANC headphones with immersive audio, CustomTune sound calibration, and 24-hour battery.",
    price: 36900, mrp: 44900, stock: 14, brand: "Bose", categorySlug: "headphones-speakers",
    rating: 4.6, ratingCount: 187,
    imagePrompt: "Bose QuietComfort Ultra over-ear headphones in black, front view, premium leather cushions visible, plain white studio background",
  },

  // Cameras (3)
  {
    name: "Canon EOS R50 Mirrorless Camera with RF-S 18-45mm Kit Lens",
    slug: "canon-eos-r50-kit",
    description: "24.2MP APS-C mirrorless camera with 4K UHD video, 15 fps burst, and Dual Pixel CMOS AF II.",
    price: 62990, mrp: 79995, stock: 13, brand: "Canon", categorySlug: "cameras",
    rating: 4.5, ratingCount: 142,
    imagePrompt: "Canon EOS R50 mirrorless camera with RF-S 18-45mm lens, three-quarter angle view, premium DSLR-style product shot, plain white studio background",
  },
  {
    name: "Sony Alpha A7 IV Full-Frame Mirrorless Body (Black)",
    slug: "sony-alpha-a7-iv-body",
    description: "33MP full-frame mirrorless camera with 4K 60p video, 10 fps shooting, and real-time tracking AF.",
    price: 219990, mrp: 264990, stock: 5, brand: "Sony", categorySlug: "cameras",
    rating: 4.8, ratingCount: 87,
    imagePrompt: "Sony Alpha A7 IV full frame mirrorless camera body in black, front view with lens mount visible, plain white studio background, premium product photo",
  },
  {
    name: "GoPro HERO 12 Black Action Camera",
    slug: "gopro-hero-12-black",
    description: "5.3K60 action camera with HyperSmooth 6.0, waterproof to 33ft, and Enduro battery for cold weather.",
    price: 41990, mrp: 51500, stock: 17, brand: "GoPro", categorySlug: "cameras",
    rating: 4.6, ratingCount: 234,
    imagePrompt: "GoPro HERO 12 Black action camera, front view showing lens and display, rugged compact design, plain white studio background",
  },
];

// ─── Gemini image generation ─────────────────────────────────────────

type GeminiResponse = {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
        inlineData?: { mimeType: string; data: string };
      }[];
    };
  }[];
  promptFeedback?: { blockReason?: string };
  error?: { message?: string };
};

function postJson(url: string, body: unknown): Promise<{ status: number; data: string }> {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const payload = Buffer.from(JSON.stringify(body));
    const req = https.request(
      {
        method: "POST",
        hostname: u.hostname,
        path: u.pathname + u.search,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": payload.byteLength,
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c: Buffer) => chunks.push(c));
        res.on("end", () => {
          resolve({
            status: res.statusCode ?? 0,
            data: Buffer.concat(chunks).toString("utf8"),
          });
        });
      }
    );
    req.on("error", reject);
    req.end(payload);
  });
}

async function generateProductImage(
  product: SeedProduct
): Promise<{ buffer: Buffer; mime: string } | null> {
  if (!GEMINI_API_KEY) {
    console.warn("⚠️   GEMINI_API_KEY not set — skipping image generation");
    return null;
  }

  const prompt = `Professional studio product photography of: ${product.imagePrompt}. ` +
    `Centered composition, clean white background, soft even studio lighting, ` +
    `high detail, e-commerce catalog style, no text overlays, no watermarks, no people, ` +
    `square 1:1 aspect ratio.`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ["IMAGE"],
    },
  };

  try {
    const { status, data } = await postJson(
      `${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`,
      body
    );
    if (status < 200 || status >= 300) {
      console.warn(`   ⚠️  Gemini ${status}: ${data.slice(0, 240)}`);
      return null;
    }
    const parsed = JSON.parse(data) as GeminiResponse;
    if (parsed.promptFeedback?.blockReason) {
      console.warn(`   ⚠️  Gemini blocked: ${parsed.promptFeedback.blockReason}`);
      return null;
    }
    const parts = parsed.candidates?.[0]?.content?.parts ?? [];
    const imgPart = parts.find((p) => p.inlineData?.data);
    if (!imgPart?.inlineData) {
      console.warn(`   ⚠️  Gemini response had no image. First 200 chars: ${data.slice(0, 200)}`);
      return null;
    }
    return {
      buffer: Buffer.from(imgPart.inlineData.data, "base64"),
      mime: imgPart.inlineData.mimeType || "image/png",
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`   ⚠️  Gemini error: ${msg}`);
    return null;
  }
}

// ─── Supabase upload ─────────────────────────────────────────────────

function uploadToSupabase(
  objectPath: string,
  mimeType: string,
  buffer: Buffer
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      reject(new Error("Supabase config missing"));
      return;
    }
    const baseUrl = new URL(SUPABASE_URL);
    const requestPath = `/storage/v1/object/${SUPABASE_BUCKET}/${objectPath}`;
    const req = https.request(
      {
        method: "POST",
        hostname: baseUrl.hostname,
        path: requestPath,
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          "Content-Type": mimeType,
          "Content-Length": buffer.byteLength,
          "x-upsert": "true",
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c: Buffer) => chunks.push(c));
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${objectPath}`;
            resolve(publicUrl);
          } else {
            reject(new Error(`Supabase ${res.statusCode}: ${Buffer.concat(chunks).toString("utf8").slice(0, 240)}`));
          }
        });
      }
    );
    req.on("error", reject);
    req.end(buffer);
  });
}

async function generateAndUpload(product: SeedProduct): Promise<string> {
  const result = await generateProductImage(product);
  if (!result) {
    return FALLBACK_IMAGE_URL;
  }
  try {
    const ext = result.mime === "image/jpeg" ? "jpg" : result.mime.split("/")[1] ?? "png";
    const objectPath = `products/${product.slug}-${Date.now()}.${ext}`;
    const url = await uploadToSupabase(objectPath, result.mime, result.buffer);
    return url;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`   ⚠️  Supabase upload failed for ${product.slug}: ${msg}`);
    return FALLBACK_IMAGE_URL;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────

function toChildSlug(parentSlug: string, name: string) {
  return `${parentSlug}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Main ─────────────────────────────────────────────────────────────

async function main() {
  // 1. Admin
  const adminEmail = process.env.ADMIN_SEED_EMAIL ?? "admin@voltex.com";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? "admin_change_me_123!";
  const adminName = process.env.ADMIN_SEED_NAME ?? "Admin";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: adminName },
    create: { email: adminEmail, name: adminName, passwordHash, role: "ADMIN", isActive: true },
  });
  console.log(`✅  Admin seeded: ${admin.email}`);

  // 2. Wipe orphan catalog (preserve products with order history; mark inactive)
  console.log("🗑   Cleaning existing catalog…");
  await prisma.review.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  const orphans = await prisma.product.findMany({
    where: { orderItems: { none: {} } },
    select: { id: true },
  });
  if (orphans.length > 0) {
    await prisma.product.deleteMany({ where: { id: { in: orphans.map((p) => p.id) } } });
    console.log(`   • Deleted ${orphans.length} orphan products (no order history)`);
  }
  const survivors = await prisma.product.updateMany({ data: { isActive: false } });
  if (survivors.count > 0) {
    console.log(`   • Marked ${survivors.count} products with order history as inactive`);
  }

  // 3. Categories
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

    const childList: readonly string[] =
      "children" in category && category.children ? category.children : [];
    for (const [childIndex, childName] of childList.entries()) {
      const childSlug = toChildSlug(category.slug, childName);
      const child = await prisma.category.upsert({
        where: { slug: childSlug },
        update: { name: childName, parentId: parent.id, sortOrder: childIndex, isActive: true },
        create: { name: childName, slug: childSlug, parentId: parent.id, sortOrder: childIndex, isActive: true },
        select: { id: true },
      });
      categoryBySlug.set(childSlug, child);
    }
  }
  console.log(`✅  Categories seeded: ${categoryTree.length} parents + sub-categories`);

  // 4. Products — generate images sequentially (rate-limited)
  console.log(`\n🖼   Generating images via Gemini (${GEMINI_MODEL}) for ${products.length} products`);
  console.log(`     Throttle: ${GEMINI_DELAY_MS}ms between calls\n`);

  let realImageCount = 0;
  let fallbackImageCount = 0;

  for (const [idx, product] of products.entries()) {
    const category = categoryBySlug.get(product.categorySlug);
    if (!category) {
      console.warn(`   ⚠️  Skipping ${product.slug}: missing category ${product.categorySlug}`);
      continue;
    }

    const label = `[${idx + 1}/${products.length}] ${product.name.slice(0, 60)}`;
    console.log(label);

    const imageUrl = await generateAndUpload(product);
    if (imageUrl === FALLBACK_IMAGE_URL) {
      fallbackImageCount += 1;
      console.log(`   ↳ using fallback placeholder`);
    } else {
      realImageCount += 1;
      console.log(`   ↳ ${imageUrl}`);
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        mrp: product.mrp,
        stock: product.stock,
        images: [imageUrl],
        brand: product.brand,
        categoryId: category.id,
        rating: product.rating,
        ratingCount: product.ratingCount,
        reviewCount: product.ratingCount,
        isActive: true,
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        mrp: product.mrp,
        stock: product.stock,
        images: [imageUrl],
        brand: product.brand,
        categoryId: category.id,
        rating: product.rating,
        ratingCount: product.ratingCount,
        reviewCount: product.ratingCount,
        isActive: true,
      },
    });

    if (idx < products.length - 1 && GEMINI_API_KEY) {
      await sleep(GEMINI_DELAY_MS);
    }
  }

  console.log(`\n✅  Products seeded: ${products.length}`);
  console.log(`     • ${realImageCount} with Gemini-generated images`);
  console.log(`     • ${fallbackImageCount} with placeholder fallback`);
}

main()
  .catch((e) => {
    console.error("❌  Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
