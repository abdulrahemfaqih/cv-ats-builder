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
        if (
          error.message?.toLowerCase().includes("provider is not enabled") ||
          error.message?.toLowerCase().includes("unsupported provider")
        ) {
          setErrorMsg(
            "Google Login belum diaktifkan di dashboard Supabase Anda. Anda dapat masuk menggunakan email & password di bawah ini, atau aktifkan 'Google' di menu Authentication > Providers di dashboard Supabase Anda."
          );
        } else {
          setErrorMsg(error.message);
        }
        setLoading(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghubungkan ke Google.";
      if (
        msg.toLowerCase().includes("provider is not enabled") ||
        msg.toLowerCase().includes("unsupported provider")
      ) {
        setErrorMsg(
          "Google Login belum diaktifkan di dashboard Supabase Anda. Anda dapat masuk menggunakan email & password di bawah ini, atau aktifkan 'Google' di menu Authentication > Providers di dashboard Supabase Anda."
        );
      } else {
        setErrorMsg(msg);
      }
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white border border-[#E2E2DC] rounded-2xl shadow-sm">
      {/* Header */}
      <div className="border-b border-[#F0EFEA] pb-4 mb-6">
        <h2 className="text-xl font-bold text-[#111111] tracking-tight">
          Masuk ke Cevio
        </h2>
        <p className="text-xs text-[#666660] mt-1">
          Lanjutkan pembuatan CV Anda yang ATS-friendly
        </p>
      </div>

      {!supabaseConfigured && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
          <p className="font-semibold mb-1">
            Supabase Belum Dikonfigurasi
          </p>
          <p className="text-amber-700">
            Pastikan variabel <code className="text-[#111111] font-mono">NEXT_PUBLIC_SUPABASE_URL</code> dan{" "}
            <code className="text-[#111111] font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> sudah diisi di file{" "}
            <code className="text-[#111111] font-mono">.env.local</code>.
          </p>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 leading-relaxed">
          <p className="font-semibold mb-0.5">Pemberitahuan</p>
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-white text-[#111111] border border-[#E2E2DC] py-3 px-4 rounded-xl text-xs font-semibold hover:bg-[#F8F8F6] hover:border-[#CCCCCC] transition-all mb-6 disabled:opacity-50 shadow-xs"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Lanjutkan dengan Google</span>
      </button>

      {/* Divider */}
      <div className="relative mb-6 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#F0EFEA]"></div>
        </div>
        <span className="relative bg-white px-3 text-xs text-[#8E8C85]">
          atau gunakan email
        </span>
      </div>

      {/* Email / Password Form */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#111111] mb-1.5">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            className="app-input text-xs"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[#111111]">
              Password
            </label>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="app-input text-xs"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="app-btn w-full text-xs py-3 mt-2 disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Masuk ke Akun"}
        </button>
      </form>

      {/* Footer link */}
      <div className="mt-8 pt-4 border-t border-[#F0EFEA] text-center text-xs text-[#666660]">
        Belum punya akun?{" "}
        <Link
          href={`/register${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}`}
          className="text-[#111111] font-semibold hover:underline"
        >
          Daftar sekarang
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F8F8F6] flex flex-col">
      <Navbar currentSection="auth" />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <Suspense
          fallback={
            <div className="text-xs text-[#8E8C85]">
              Memuat form...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
