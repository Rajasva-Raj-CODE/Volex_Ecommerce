import { Search } from "lucide-react";

const MOCK_CUSTOMERS = [
  { id: "1", name: "Amit Patel", email: "amit@email.com", orders: 12, spent: 245000, joined: "Jan 2025", status: "Active" },
  { id: "2", name: "Sneha Reddy", email: "sneha@email.com", orders: 8, spent: 189000, joined: "Feb 2025", status: "Active" },
  { id: "3", name: "Rohit Singh", email: "rohit@email.com", orders: 15, spent: 312000, joined: "Nov 2024", status: "Active" },
  { id: "4", name: "Meera Iyer", email: "meera@email.com", orders: 3, spent: 92000, joined: "Mar 2026", status: "Active" },
  { id: "5", name: "Vikram Shah", email: "vikram@email.com", orders: 6, spent: 156000, joined: "Dec 2024", status: "Inactive" },
  { id: "6", name: "Kavita Nair", email: "kavita@email.com", orders: 9, spent: 201000, joined: "Jan 2025", status: "Active" },
];

export default function Customers() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Customers</h1>
        <p className="text-sm text-white/40">{MOCK_CUSTOMERS.length} customers</p>
      </div>

      <div className="mb-4 flex max-w-sm items-center gap-2 rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2">
        <Search size={16} className="text-white/40" />
        <input
          type="text"
          placeholder="Search customers..."
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-[#1a1a1a]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-white/40">Customer</th>
                <th className="px-5 py-3 text-xs font-semibold text-white/40">Joined</th>
                <th className="px-5 py-3 text-xs font-semibold text-white/40">Orders</th>
                <th className="px-5 py-3 text-xs font-semibold text-white/40">Total Spent</th>
                <th className="px-5 py-3 text-xs font-semibold text-white/40">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_CUSTOMERS.map((c) => (
                <tr key={c.id} className="border-b border-white/5 last:border-none transition-colors hover:bg-white/[0.02]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#49A5A2]/20 text-sm font-bold text-[#49A5A2]">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{c.name}</p>
                        <p className="text-xs text-white/40">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-white/50">{c.joined}</td>
                  <td className="px-5 py-3 text-sm text-white/50">{c.orders}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-white">₹{c.spent.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${c.status === "Active" ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/40"}`}>
                      {c.status}
                    </span>
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
