import Image from "next/image";
import Link from "next/link";
import { LoadingLink } from "@/app/components/LoadingLink";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A1A3A] p-6">
      <div className="grid max-w-5xl grid-cols-1 items-center gap-10 md:grid-cols-2">
        <div className="text-white">
          <h3 className="text-blue-400 font-semibold">DS List Premium</h3>
          <h1 className="mt-2 text-4xl font-bold leading-snug">
            Suas coleções do <br /> jeito certo
          </h1>
          <p className="mt-4 text-gray-300">
            Organize sua coleção de games de um jeito prático e divertido. Na
            verdade você vai aprender a criar este aplicativo e elevar seus
            conhecimentos para o próximo nível! :)
          </p>

          <LoadingLink href="/lists">
            <button className="mt-6 rounded-lg bg-blue-500 px-6 py-3 text-lg font-medium text-white shadow-lg hover:bg-blue-600 transition">
              Iniciar
            </button>
          </LoadingLink>
        </div>

        <div className="flex justify-center">
          <Image
            src="/inicio.png"
            alt="Ilustração de login"
            width={400}
            height={400}
            priority
          />
        </div>
      </div>
    </main>
  );
}
