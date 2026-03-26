import { Plus, Pencil, Trash2 } from "lucide-react";

const MOCK_CATEGORIES = [
  { id: "1", name: "Mobiles, Tablets & Accessories", slug: "mobiles-tablets-accessories", products: 124, status: "Active" },
  { id: "2", name: "Laptops & Accessories", slug: "laptops-accessories", products: 89, status: "Active" },
  { id: "3", name: "TV & Entertainment", slug: "tv-entertainment", products: 67, status: "Active" },
  { id: "4", name: "Home Appliances", slug: "home-appliances", products: 145, status: "Active" },
  { id: "5", name: "Kitchen Appliances", slug: "kitchen-appliances", products: 98, status: "Active" },
  { id: "6", name: "Headphones & Speakers", slug: "headphones-speakers", products: 56, status: "Active" },
  { id: "7", name: "Cameras", slug: "cameras", products: 34, status: "Active" },
  { id: "8", name: "Personal Care", slug: "personal-care", products: 42, status: "Inactive" },
];

export default function Categories() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Categories</h1>
          <p className="text-sm text-white/40">{MOCK_CATEGORIES.length} categories</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-[#49A5A2] px-4 py-2.5 text-sm font-bold text-black transition-colors hover:bg-[#3d8e8b]">
          <Plus size={16} />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="group rounded-xl border border-white/10 bg-[#1a1a1a] p-5 transition-colors hover:border-[#49A5A2]/30"
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{cat.name}</h3>
                <p className="mt-0.5 text-xs text-white/40">/{cat.slug}</p>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  cat.status === "Active"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-white/5 text-white/40"
                }`}
              >
                {cat.status}
              </span>
            </div>
            <p className="mb-4 text-sm text-white/50">
              {cat.products} products
            </p>
            <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <button className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:bg-white/5">
                <Pencil size={12} /> Edit
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-white/5">
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
