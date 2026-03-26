export default function Settings() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Settings</h1>
        <p className="text-sm text-white/40">Manage store configuration</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Store Info */}
        <div className="rounded-xl border border-white/10 bg-[#1a1a1a] p-6">
          <h2 className="mb-4 text-base font-bold text-white">Store Information</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/60">Store Name</label>
              <input
                type="text"
                defaultValue="VolteX Electronics"
                className="w-full rounded-lg border border-white/10 bg-[#0f0f0f] px-4 py-2.5 text-sm text-white outline-none focus:border-[#49A5A2]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/60">Support Email</label>
              <input
                type="email"
                defaultValue="support@voltex.com"
                className="w-full rounded-lg border border-white/10 bg-[#0f0f0f] px-4 py-2.5 text-sm text-white outline-none focus:border-[#49A5A2]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/60">Phone</label>
              <input
                type="tel"
                defaultValue="+91 1800-572-7662"
                className="w-full rounded-lg border border-white/10 bg-[#0f0f0f] px-4 py-2.5 text-sm text-white outline-none focus:border-[#49A5A2]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/60">Currency</label>
              <input
                type="text"
                defaultValue="INR (₹)"
                disabled
                className="w-full rounded-lg border border-white/10 bg-[#0f0f0f] px-4 py-2.5 text-sm text-white/50 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-xl border border-white/10 bg-[#1a1a1a] p-6">
          <h2 className="mb-4 text-base font-bold text-white">Notifications</h2>
          <div className="flex flex-col gap-4">
            {[
              { label: "New order alerts", desc: "Get notified for every new order", on: true },
              { label: "Low stock alerts", desc: "Alert when product stock falls below 10", on: true },
              { label: "Customer sign-up alerts", desc: "Notify when new customers register", on: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs text-white/40">{item.desc}</p>
                </div>
                <button
                  className={`h-6 w-11 rounded-full transition-colors ${item.on ? "bg-[#49A5A2]" : "bg-white/10"}`}
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${item.on ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button className="rounded-lg bg-[#49A5A2] px-6 py-2.5 text-sm font-bold text-black transition-colors hover:bg-[#3d8e8b]">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
