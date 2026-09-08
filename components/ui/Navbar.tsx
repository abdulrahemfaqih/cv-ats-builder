"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface NavbarProps {
  currentSection?: "landing" | "builder" | "dashboard" | "auth";
}

export function Navbar({ currentSection }: NavbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="w-full bg-[#F8F8F6]/90 backdrop-blur-md border-b border-[#E2E2DC] z-40 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image
              src="/cevio-logo.png"
              alt="Cevio Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-sans text-xl font-bold tracking-tight text-[#111111]">
            Cevio
          </span>
        </Link>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-3">
          <Link
            href="/builder"
            className={`text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors ${
              currentSection === "builder"
                ? "bg-[#111111] text-white"
                : "bg-white border border-[#E2E2DC] text-[#111111] hover:bg-[#F2F2EE]"
            }`}
          >
            Buat CV
          </Link>

          {!loading && (
            <>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className={`text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors ${
                      currentSection === "dashboard"
                        ? "bg-[#111111] text-white"
                        : "text-[#666660] hover:text-[#111111]"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-medium px-3 py-2 text-[#666660] hover:text-[#E61919] transition-colors"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className={`text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors ${
                    currentSection === "auth"
                      ? "bg-[#111111] text-white"
                      : "text-[#111111] hover:text-[#666660]"
                  }`}
                >
                  Masuk
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
