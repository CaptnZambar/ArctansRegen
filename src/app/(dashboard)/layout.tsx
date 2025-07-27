"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import FullLogo from "@/components/FullLogo";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  const router = useRouter();

  return (
    <div className="flex h-screen">
      <aside className="w-64 text-white flex flex-col justify-between">
        <Link href="/" className="p-6 mb-8">
          <FullLogo />
        </Link>

        <nav className="flex-1 px-4 space-y-2">
          <Link
            href="/news"
            className="block py-2 px-3 rounded hover:bg-custom-yellow-300 transition"
          >
            Actualités
          </Link>
          <Link
            href="/chat"
            className="block py-2 px-3 rounded hover:bg-custom-yellow-300 transition"
          >
            Chat
          </Link>
          <Link
            href="/feed"
            className="block py-2 px-3 rounded hover:bg-custom-yellow-300 transition"
          >
            Trades
          </Link>
          <Link
            href="/wallet"
            className="block py-2 px-3 rounded hover:bg-custom-yellow-300 transition"
          >
            Portefeuille
          </Link>
        </nav>

        <div className="p-6">
          <button
            onClick={() => authClient.signOut({
                fetchOptions: { 
                    onSuccess: () => router.push("/sign-in")} 
                })
            }
            className="w-full text-left py-2 px-3 rounded hover:bg-custom-yellow-300 transition cursor-pointer"
          >
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6 bg-custom-black">{children}</main>
    </div>
  );
};

export default Layout;
