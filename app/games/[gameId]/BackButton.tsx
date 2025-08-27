"use client";
import { useRouter } from "next/navigation";
import { LoadingLink } from "../../components/LoadingLink";
import { useLoading } from "../../components/LoadingProvider";

export default function BackButton() {
  const router = useRouter();
  const { setIsLoading } = useLoading();

  return (
    <LoadingLink
      href="/lists"
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
