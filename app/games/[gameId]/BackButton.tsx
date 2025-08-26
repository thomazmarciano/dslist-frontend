"use client";
import { useRouter } from "next/navigation";
import { LoadingLink } from "../../components/LoadingLink";
import { useLoading } from "../../components/LoadingProvider";

export default function BackButton() {
  const router = useRouter();
  const { setIsLoading } = useLoading();

  const handleBack = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/dsadasdasdas");
    }
  };

  return (
    <LoadingLink
      href="/"
      onClick={handleBack}
      className="text-white hover:text-blue-300 transition-colors flex items-center gap-2"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Voltar
    </LoadingLink>
  );
}
