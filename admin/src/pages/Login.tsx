import { HugeiconsIcon } from "@hugeicons/react";
import { LockKeyIcon, Mail02Icon, EyeIcon, ShieldCheck } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-purple-500/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
            <HugeiconsIcon icon={ShieldCheck} size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your VolteX Admin account</p>
        </div>

        <div className="rounded-2xl border bg-card p-8 shadow-lg">
          <form className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <HugeiconsIcon 
                  icon={Mail02Icon} 
                  size={18} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@voltex.com"
                  className="pl-10 h-11 bg-muted/50" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <HugeiconsIcon 
                  icon={LockKeyIcon} 
                  size={18} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-11 bg-muted/50" 
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
                >
                  <HugeiconsIcon icon={EyeIcon} size={16} className="text-muted-foreground" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-input" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-primary hover:underline font-medium">Forgot password?</a>
            </div>

            <Button className="w-full h-11 text-base font-medium gap-2">
              <HugeiconsIcon icon={ShieldCheck} size={18} />
              Sign In
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Demo Credentials</span>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm space-y-1">
              <p className="flex items-center gap-2">
                <span className="text-muted-foreground">Email:</span>
                <code className="bg-muted px-2 py-0.5 rounded text-xs">admin@voltex.com</code>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-muted-foreground">Pass:</span>
                <code className="bg-muted px-2 py-0.5 rounded text-xs">admin123</code>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
