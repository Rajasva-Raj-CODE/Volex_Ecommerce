import { useAuth } from "@/lib/auth-context";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AdminHeader() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur-md">
      <div className="relative max-w-md flex-1">
        <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-8" />
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="relative">
          <Bell size={16} />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
            3
          </span>
        </Button>
        <div className="flex items-center gap-2 ">
          <Avatar>
            <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:block">
            {user?.name}
          </span>
        </div>
      </div>
    </header>
  );
}
