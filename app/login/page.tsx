"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Navbar } from "@/components/ui/Navbar";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabaseConfigured = isSupabaseConfigured();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        router.push(returnUrl);
        router.refresh();
      }
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Terjadi kesalahan saat masuk."
      );
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const redirectOrigin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${redirectOrigin}/auth/callback?next=${encodeURIComponent(
            returnUrl
          )}`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
      }
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menghubungkan ke Google."
      );
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-[#EAE8E3] border-2 border-[#0A0A0A]">
      {/* Header Label */}
      <div className="border-b border-[#0A0A0A] pb-4 mb-6 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wider text-[#5C5A54]">
          [ AUTH // 01 ]
        </span>
        <span className="font-mono text-xs uppercase tracking-wider text-[#0A0A0A] font-bold">
          MASUK KE CEVIO
        </span>
      </div>

      {!supabaseConfigured && (
        <div className="mb-6 p-4 bg-[#F4F4F0] border-l-4 border-[#E61919] text-xs font-mono text-[#0A0A0A]">
          <p className="font-bold text-[#E61919] uppercase mb-1">
            [ PERHATIAN: SUPABASE BELUM DIKONFIGURASI ]
          </p>
          <p className="text-[#5C5A54]">
            Pastikan variabel <code className="text-[#0A0A0A]">NEXT_PUBLIC_SUPABASE_URL</code> dan{" "}
            <code className="text-[#0A0A0A]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> sudah diisi di file{" "}
            <code className="text-[#0A0A0A]">.env.local</code>.
          </p>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 bg-[#F4F4F0] border border-[#E61919] text-xs font-mono text-[#E61919]">
          <p className="font-bold uppercase">[ ERROR ]</p>
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-white text-[#0A0A0A] border border-[#0A0A0A] py-3 px-4 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#0A0A0A] hover:text-white transition-colors mb-6 disabled:opacity-50"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Lanjutkan dengan Google</span>
      </button>

      {/* Divider */}
      <div className="relative mb-6 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#0A0A0A]"></div>
        </div>
        <span className="relative bg-[#EAE8E3] px-3 font-mono text-xs uppercase text-[#5C5A54]">
          ATAU EMAIL
        </span>
      </div>

      {/* Email / Password Form */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label className="block font-mono text-xs uppercase text-[#0A0A0A] font-bold mb-1.5">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            className="w-full bg-white border border-[#0A0A0A] p-3 font-sans text-sm outline-none focus:border-2 focus:border-[#0A0A0A]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-mono text-xs uppercase text-[#0A0A0A] font-bold">
              Password
            </label>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-white border border-[#0A0A0A] p-3 font-sans text-sm outline-none focus:border-2 focus:border-[#0A0A0A]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0A0A0A] text-[#F4F4F0] border border-[#0A0A0A] py-3.5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-[#0A0A0A] transition-colors disabled:opacity-50 mt-2"
        >
          {loading ? "MEMPROSES..." : "MASUK KE AKUN"}
        </button>
      </form>

      {/* Footer link */}
      <div className="mt-8 pt-4 border-t border-[#0A0A0A] text-center font-mono text-xs text-[#5C5A54]">
        Belum punya akun?{" "}
        <Link
          href={`/register${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}`}
          className="text-[#0A0A0A] font-bold underline hover:text-[#E61919]"
        >
          DAFTAR SEKARANG →
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <Navbar currentSection="auth" />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <Suspense
          fallback={
            <div className="font-mono text-xs uppercase text-[#5C5A54]">
              MEMUAT FORM...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
