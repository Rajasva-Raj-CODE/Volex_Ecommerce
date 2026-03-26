import { Plus, MoreHorizontal } from "lucide-react";

const MOCK_TEAM = [
  { id: "1", name: "Rajesh Kumar", email: "admin@voltex.com", role: "Super Admin", status: "Active", lastActive: "Just now" },
  { id: "2", name: "Priya Sharma", email: "pm@voltex.com", role: "Product Manager", status: "Active", lastActive: "2 hours ago" },
  { id: "3", name: "Ankit Verma", email: "ankit@voltex.com", role: "Product Manager", status: "Active", lastActive: "1 day ago" },
  { id: "4", name: "Divya Menon", email: "divya@voltex.com", role: "Super Admin", status: "Invited", lastActive: "—" },
];

const ROLE_COLORS: Record<string, string> = {
  "Super Admin": "bg-purple-500/10 text-purple-400",
  "Product Manager": "bg-blue-500/10 text-blue-400",
};

export default function Team() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Team</h1>
          <p className="text-sm text-white/40">Manage admin users and roles</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-[#49A5A2] px-4 py-2.5 text-sm font-bold text-black transition-colors hover:bg-[#3d8e8b]">
          <Plus size={16} />
          Invite Member
        </button>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#1a1a1a]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-white/40">Member</th>
                <th className="px-5 py-3 text-xs font-semibold text-white/40">Role</th>
                <th className="px-5 py-3 text-xs font-semibold text-white/40">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-white/40">Last Active</th>
                <th className="px-5 py-3 text-xs font-semibold text-white/40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TEAM.map((member) => (
                <tr key={member.id} className="border-b border-white/5 last:border-none transition-colors hover:bg-white/[0.02]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#49A5A2]/20 text-sm font-bold text-[#49A5A2]">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{member.name}</p>
                        <p className="text-xs text-white/40">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ROLE_COLORS[member.role]}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${member.status === "Active" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-white/50">{member.lastActive}</td>
                  <td className="px-5 py-3">
                    <button className="rounded-lg p-1.5 transition-colors hover:bg-white/10">
                      <MoreHorizontal size={16} className="text-white/50" />
                    </button>
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
