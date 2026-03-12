import { createContext, useContext, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export type UserRole = "vendor" | "finance";

interface AuthUser {
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = sessionStorage.getItem("ez_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email: string, password: string, role: UserRole): boolean => {
    const validCredentials: Record<UserRole, { email: string; password: string }> = {
      vendor: { email: "vendorinvoice@gmail.com", password: "1234" },
      finance: { email: "financeinvoice@gmail.com", password: "1234" },
    };

    const creds = validCredentials[role];
    if (email === creds.email && password === creds.password) {
      const authUser = { email, role };
      setUser(authUser);
      sessionStorage.setItem("ez_user", JSON.stringify(authUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("ez_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
