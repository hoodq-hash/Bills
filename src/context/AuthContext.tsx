"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { AuthContextValue, User } from "@/types";
import {
  ensureDevAdminSession,
  isDevAuthBypass,
} from "@/utils/devAuth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser) as User;
        if (parsedUser && typeof parsedUser === "object") {
          setUser(parsedUser);
          return;
        }
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }

      if (isDevAuthBypass) {
        const devUser = ensureDevAdminSession();
        if (devUser) {
          setUser(devUser);
        }
      }
    } catch (error) {
      console.error("Error parsing stored user:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      if (isDevAuthBypass) {
        const devUser = ensureDevAdminSession();
        if (devUser) {
          setUser(devUser);
        }
      }
    }
  }, []);

  const login = (userData: User, token: string) => {
    if (userData && typeof userData === "object") {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
