import { Search } from "lucide-react";

const MOCK_ORDERS = [
  { id: "ORD-1284", customer: "Amit Patel", email: "amit@email.com", items: 2, total: 69999, status: "Processing", date: "26 Mar 2026", payment: "Credit Card" },
  { id: "ORD-1283", customer: "Sneha Reddy", email: "sneha@email.com", items: 1, total: 22990, status: "Shipped", date: "25 Mar 2026", payment: "UPI" },
  { id: "ORD-1282", customer: "Rohit Singh", email: "rohit@email.com", items: 3, total: 9990, status: "Delivered", date: "25 Mar 2026", payment: "Debit Card" },
  { id: "ORD-1281", customer: "Meera Iyer", email: "meera@email.com", items: 1, total: 89990, status: "Pending", date: "24 Mar 2026", payment: "Credit Card" },
  { id: "ORD-1280", customer: "Vikram Shah", email: "vikram@email.com", items: 2, total: 36900, status: "Delivered", date: "24 Mar 2026", payment: "UPI" },
  { id: "ORD-1279", customer: "Kavita Nair", email: "kavita@email.com", items: 1, total: 49900, status: "Processing", date: "23 Mar 2026", payment: "EMI" },
  { id: "ORD-1278", customer: "Arjun Das", email: "arjun@email.com", items: 4, total: 8999, status: "Cancelled", date: "23 Mar 2026", payment: "UPI" },
  { id: "ORD-1277", customer: "Pooja Gupta", email: "pooja@email.com", items: 1, total: 62990, status: "Shipped", date: "22 Mar 2026", payment: "Credit Card" },
];

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-500/10 text-yellow-400",
  Processing: "bg-blue-500/10 text-blue-400",
  Shipped: "bg-purple-500/10 text-purple-400",
  Delivered: "bg-green-500/10 text-green-400",
  Cancelled: "bg-red-500/10 text-red-400",
};

export default function Orders() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Orders</h1>
        <p className="text-sm text-white/40">{MOCK_ORDERS.length} orders</p>
      </div>

      <div className="mb-4 flex max-w-sm items-center gap-2 rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2">
        <Search size={16} className="text-white/40" />
        <input
          type="text"
          placeholder="Search orders..."
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-[#1a1a1a]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-white/40">Order ID</th>
                <th className="px-5 py-3 text-xs font-semibold text-white/40">Customer</th>
                <th className="px-5 py-3 text-xs font-semibold text-white/40">Date</th>
                <th className="px-5 py-3 text-xs font-semibold text-white/40">Items</th>
                <th className="px-5 py-3 text-xs font-semibold text-white/40">Total</th>
                <th className="px-5 py-3 text-xs font-semibold text-white/40">Payment</th>
                <th className="px-5 py-3 text-xs font-semibold text-white/40">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ORDERS.map((order) => (
                <tr key={order.id} className="border-b border-white/5 last:border-none transition-colors hover:bg-white/[0.02]">
                  <td className="px-5 py-3 text-sm font-semibold text-[#49A5A2]">{order.id}</td>
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-white">{order.customer}</p>
                    <p className="text-xs text-white/40">{order.email}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-white/50">{order.date}</td>
                  <td className="px-5 py-3 text-sm text-white/50">{order.items}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-white">₹{order.total.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3 text-sm text-white/50">{order.payment}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                      {order.status}
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
