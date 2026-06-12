import { createContext, useContext, useState, ReactNode } from "react";
import { AuthModal } from "./AuthModal";

interface AuthContextType {
  openAuth: (mode?: "login" | "register", role?: string) => void;
  closeAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultMode, setDefaultMode] = useState<"login" | "register">("login");
  const [defaultRole, setDefaultRole] = useState<string>("student");

  const openAuth = (mode: "login" | "register" = "login", role = "student") => {
    setDefaultMode(mode);
    setDefaultRole(role);
    setIsOpen(true);
  };

  const closeAuth = () => setIsOpen(false);

  return (
    <AuthContext.Provider value={{ openAuth, closeAuth }}>
      {children}
      <AuthModal isOpen={isOpen} onClose={closeAuth} initialMode={defaultMode} initialRole={defaultRole} />
    </AuthContext.Provider>
  );
}

export const useAuthModal = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthProvider");
  return ctx;
};
