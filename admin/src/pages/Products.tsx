import { useState } from "react";
import { Search, Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

const MOCK_PRODUCTS = [
  { id: "1", name: "Croma 80 cm HD Ready LED TV", category: "TV & Entertainment", price: 9990, stock: 45, status: "Active", image: "📺" },
  { id: "2", name: "Croma 5.1 Channel 340W Soundbar", category: "Audio", price: 10990, stock: 12, status: "Active", image: "🔊" },
  { id: "3", name: "Samsung Galaxy S24 Ultra 5G", category: "Mobiles", price: 69999, stock: 28, status: "Active", image: "📱" },
  { id: "4", name: "Apple MacBook Air M3 13 inch", category: "Laptops", price: 89990, stock: 8, status: "Low Stock", image: "💻" },
  { id: "5", name: "Sony WH-1000XM5 Headphones", category: "Audio", price: 22990, stock: 34, status: "Active", image: "🎧" },
  { id: "6", name: "Canon EOS R50 Mirrorless Camera", category: "Cameras", price: 62990, stock: 5, status: "Low Stock", image: "📷" },
  { id: "7", name: "Apple iPad Air 11 inch M2", category: "Tablets", price: 49900, stock: 19, status: "Active", image: "📱" },
  { id: "8", name: "JBL Flip 6 Bluetooth Speaker", category: "Audio", price: 8999, stock: 52, status: "Active", image: "🔊" },
  { id: "9", name: "Apple Watch Series 9 GPS 45mm", category: "Wearables", price: 36900, stock: 15, status: "Active", image: "⌚" },
  { id: "10", name: "Samsung 253L Frost Free Fridge", category: "Appliances", price: 24990, stock: 0, status: "Out of Stock", image: "🧊" },
];

const STATUS_COLORS: Record<string, string> = {
  Active: "bg-green-500/10 text-green-400",
  "Low Stock": "bg-yellow-500/10 text-yellow-400",
  "Out of Stock": "bg-red-500/10 text-red-400",
};

export default function Products() {
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = MOCK_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Products</h1>
          <p className="text-sm text-white/40">{MOCK_PRODUCTS.length} products total</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-[#49A5A2] px-4 py-2.5 text-sm font-bold text-black transition-colors hover:bg-[#3d8e8b]">
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 flex max-w-sm items-center gap-2 rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2">
        <Search size={16} className="text-white/40" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/10 bg-[#1a1a1a]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-white/40">Product</th>
                <th className="px-5 py-3 text-xs font-semibold text-white/40">Category</th>
                <th className="px-5 py-3 text-xs font-semibold text-white/40">Price</th>
                <th className="px-5 py-3 text-xs font-semibold text-white/40">Stock</th>
                <th className="px-5 py-3 text-xs font-semibold text-white/40">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-white/40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-white/5 last:border-none transition-colors hover:bg-white/[0.02]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-lg">
                        {product.image}
                      </span>
                      <span className="text-sm font-semibold text-white">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-white/50">{product.category}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-white">
                    ₹{product.price.toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-3 text-sm text-white/50">{product.stock}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[product.status]}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === product.id ? null : product.id)}
                        className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
                      >
                        <MoreHorizontal size={16} className="text-white/50" />
                      </button>
                      {openMenu === product.id && (
                        <div className="absolute right-0 top-8 z-10 w-36 rounded-lg border border-white/10 bg-[#252525] py-1 shadow-xl">
                          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5">
                            <Pencil size={14} /> Edit
                          </button>
                          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-white/5">
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
