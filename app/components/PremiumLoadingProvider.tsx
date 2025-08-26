"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setIsLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

const PremiumLoadingOverlay = ({ isLoading }: { isLoading: boolean }) => {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setShow(true);
      setProgress(0);

      const progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 100);

      return () => clearInterval(progressTimer);
    } else {
      setProgress(100);
      const hideTimer = setTimeout(() => {
        setShow(false);
        setProgress(0);
      }, 500);
      return () => clearTimeout(hideTimer);
    }
  }, [isLoading]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className={`absolute inset-0 transition-all duration-700 ${
          isLoading ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 0, 255, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 150, 255, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 0, 150, 0.2) 0%, transparent 50%),
            linear-gradient(135deg, rgba(10, 26, 58, 0.95) 0%, rgba(15, 35, 70, 0.95) 100%)
          `,
        }}
      />

      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`transition-all duration-700 ${
            isLoading
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-110 opacity-0 translate-y-4"
          }`}
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-20 blur-xl animate-pulse" />

            <div className="relative bg-white bg-opacity-10 backdrop-blur-2xl rounded-2xl p-10 border border-white border-opacity-20 shadow-2xl">
              <div className="flex flex-col items-center space-y-8">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-white border-opacity-20 rounded-full" />

                  <div className="absolute inset-0 border-4 border-transparent border-t-blue-400 border-r-blue-400 rounded-full animate-spin" />

                  <div
                    className="absolute inset-2 border-4 border-transparent border-b-purple-400 border-l-purple-400 rounded-full"
                    style={{
                      animation: "spin 1.5s linear infinite reverse",
                    }}
                  />

                  <div
                    className="absolute inset-4 border-4 border-transparent border-t-pink-400 border-r-pink-400 rounded-full animate-spin"
                    style={{
                      animationDuration: "2s",
                    }}
                  />

                  <div className="absolute inset-6 bg-gradient-to-br from-white to-blue-200 rounded-full animate-pulse opacity-80" />
                </div>

                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                    Carregando
                  </h3>

                  <div className="flex space-x-2 justify-center">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse"
                        style={{
                          animationDelay: `${i * 200}ms`,
                          animationDuration: "1s",
                        }}
                      />
                    ))}
                  </div>

                  <div className="w-48 h-1 bg-white bg-opacity-20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 rounded-full transition-all duration-300 ease-out"
                      style={{
                        width: `${progress}%`,
                        boxShadow: "0 0 10px rgba(139, 92, 246, 0.6)",
                      }}
                    />
                  </div>

                  <p className="text-white text-opacity-60 text-sm font-light">
                    {progress < 30
                      ? "Iniciando..."
                      : progress < 70
                      ? "Carregando dados..."
                      : progress < 90
                      ? "Quase pronto..."
                      : "Finalizando..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(180deg);
          }
        }
      `}</style>
    </div>
  );
};

export default function PremiumLoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      <PremiumLoadingOverlay isLoading={isLoading} />
    </LoadingContext.Provider>
  );
}
