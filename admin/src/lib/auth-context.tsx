import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User, Role } from "./types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  hasRole: (allowed: Role[]) => boolean;
}

const MOCK_USERS: { email: string; password: string; user: User }[] = [
  {
    email: "admin@voltex.com",
    password: "admin123",
    user: {
      id: "1",
      name: "Rajesh Kumar",
      email: "admin@voltex.com",
      role: "super_admin",
    },
  },
  {
    email: "pm@voltex.com",
    password: "pm123",
    user: {
      id: "2",
      name: "Priya Sharma",
      email: "pm@voltex.com",
      role: "product_manager",
    },
  },
];

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("voltex_admin_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((email: string, password: string): boolean => {
    const match = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (match) {
      setUser(match.user);
      localStorage.setItem("voltex_admin_user", JSON.stringify(match.user));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("voltex_admin_user");
  }, []);

  const hasRole = useCallback(
    (allowed: Role[]): boolean => {
      if (!user) return false;
      return allowed.includes(user.role);
    },
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
