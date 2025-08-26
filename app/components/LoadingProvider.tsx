"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};

const LoadingOverlay = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-[#0A1A3A]/90 backdrop-blur-md
                 transition-all duration-500"
      style={{
        background:
          "radial-gradient(circle at center, rgba(10, 26, 58, 0.95) 0%, rgba(10, 26, 58, 0.85) 100%)",
      }}
    >
      <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="relative z-10 flex flex-col items-center space-y-6">
          {/* Spinner */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-white border-r-white rounded-full animate-spin"></div>
            <div className="absolute top-2 left-2 w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-pulse opacity-60"></div>
            <div className="absolute top-6 left-6 w-4 h-4 bg-white rounded-full animate-bounce opacity-80"></div>
          </div>
          {/* Texto */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent animate-pulse">
              Carregando
            </h3>
            <div className="flex space-x-1 justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce opacity-60"></div>
              <div
                className="w-2 h-2 bg-white rounded-full animate-bounce opacity-60"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-white rounded-full animate-bounce opacity-60"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      <LoadingOverlay isLoading={isLoading} />
    </LoadingContext.Provider>
  );
}
