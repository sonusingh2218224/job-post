"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  loginUser,
  registerUser,
  RegisterPayload,
  LoginPayload,
} from "@/services/authService";
import { toast } from "react-toastify";
import { useRouter, usePathname } from "next/navigation";

interface User {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  company: string;
  job_title?: string;
  account_status: string;
  email_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  isInitialized: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("access");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setAccessToken(token);
        setUser(parsedUser);

        if (
          pathname === "/login" ||
          pathname === "/register" ||
          pathname === "/" ||
          pathname === "/regiser"
        ) {
          router.push("/dashboard");
        }
      } catch (error) {
        // If userData is corrupted, clear it
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
      }
    } else {
      if (pathname.startsWith("/dashboard")) {
        router.push("/login");
      }
    }

    setIsInitialized(true);
  }, [pathname, router]);

  const login = async (payload: LoginPayload) => {
    setLoading(true);
    try {
      const res = await loginUser(payload);
      setAccessToken(res.access);
      setUser(res.user);
      localStorage.setItem("access", res.access);
      localStorage.setItem("refresh", res.refresh);
      localStorage.setItem("user", JSON.stringify(res.user));
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    try {
      const res = await registerUser(payload);
      if (res.success) {
        const { tokens, ...userData } = res.data;
        setAccessToken(tokens.access);
        setUser({
          user_id: userData.user_id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          company: userData.company,
          account_status: userData.account_status,
          email_verified: userData.email_verified,
          job_title: payload.job_title,
        });

        localStorage.setItem("access", tokens.access);
        localStorage.setItem("refresh", tokens.refresh);
        localStorage.setItem("user", JSON.stringify(userData));
        toast.success(res.message);

        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.email[0]);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    // After logout, redirect to login
    router.push("/login");
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        isInitialized,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
