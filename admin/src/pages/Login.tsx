import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const success = login(email, password);
    if (success) {
      navigate("/", { replace: true });
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black tracking-tight text-white">
            Volte<span className="text-[#49A5A2]">X</span>
          </h1>
          <p className="mt-1 text-sm text-white/40">Admin Panel</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-6"
        >
          <h2 className="mb-6 text-lg font-bold text-white">Sign in</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-white/60">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@voltex.com"
              required
              className="w-full rounded-lg border border-white/10 bg-[#0f0f0f] px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#49A5A2]"
            />
          </div>

          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-white/60">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-lg border border-white/10 bg-[#0f0f0f] px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#49A5A2]"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#49A5A2] py-2.5 text-sm font-bold text-black transition-colors hover:bg-[#3d8e8b]"
          >
            Sign In
          </button>

          {/* Demo credentials */}
          <div className="mt-6 rounded-lg border border-white/5 bg-white/[0.02] p-4">
            <p className="mb-2 text-xs font-semibold text-white/40">
              Demo Credentials
            </p>
            <div className="flex flex-col gap-1.5 text-xs text-white/50">
              <p>
                <span className="font-semibold text-[#49A5A2]">Super Admin:</span>{" "}
                admin@voltex.com / admin123
              </p>
              <p>
                <span className="font-semibold text-[#49A5A2]">Product Mgr:</span>{" "}
                pm@voltex.com / pm123
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
