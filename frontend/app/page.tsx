"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona diretamente para o login
    router.push("/login");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-500">Redirecionando...</p>
      </div>
    </div>
  );
}
