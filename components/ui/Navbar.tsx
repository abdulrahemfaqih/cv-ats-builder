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
    <header className="w-full bg-[#F4F4F0] border-b border-[#0A0A0A] z-40 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none"
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
          <span className="font-sans text-2xl font-bold tracking-tight text-[#0A0A0A] lowercase first-letter:uppercase">
            Cevio
          </span>
          <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-wider text-[#5C5A54] border border-[#0A0A0A] px-1.5 py-0.5 bg-[#EAE8E3]">
            ATS Engine
          </span>
        </Link>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/builder"
            className={`font-mono text-xs font-semibold tracking-wider uppercase px-3 py-2 border border-[#0A0A0A] transition-colors ${
              currentSection === "builder"
                ? "bg-[#0A0A0A] text-[#F4F4F0]"
                : "bg-transparent text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#F4F4F0]"
            }`}
          >
            [ BUAT CV ]
          </Link>

          {!loading && (
            <>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className={`font-mono text-xs font-semibold tracking-wider uppercase px-3 py-2 border border-[#0A0A0A] transition-colors ${
                      currentSection === "dashboard"
                        ? "bg-[#0A0A0A] text-[#F4F4F0]"
                        : "bg-transparent text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#F4F4F0]"
                    }`}
                  >
                    DASHBOARD
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="font-mono text-xs font-semibold tracking-wider uppercase px-3 py-2 border border-[#0A0A0A] text-[#5C5A54] hover:text-[#E61919] hover:border-[#E61919] transition-colors"
                  >
                    KELUAR
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className={`font-mono text-xs font-semibold tracking-wider uppercase px-3 py-2 border border-[#0A0A0A] transition-colors ${
                    currentSection === "auth"
                      ? "bg-[#0A0A0A] text-[#F4F4F0]"
                      : "bg-[#EAE8E3] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#F4F4F0]"
                  }`}
                >
                  LOGIN
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
