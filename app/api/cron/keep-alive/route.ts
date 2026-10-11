import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Supabase Keep-Alive Cron Endpoint
 *
 * Mencegah Supabase Free Plan otomatis di-pause setelah 7 hari tidak aktif
 * dengan mengeksekusi query berkala ke PostgREST dan Auth API Supabase.
 */
export async function GET(request: Request) {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://uwmkjksnqoqmyozakxxw.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3bWtqa3NucW9xbXlvemFreHh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NTc2NTgsImV4cCI6MjEwNDQzMzY1OH0.g8A-774omkuzusSzmZ6TF9zqLz74obGyMBDLrBMYGao";

  // Opsional: Proteksi Bearer Token jika CRON_SECRET disetel di env
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { status: "error", message: "Unauthorized: Invalid CRON_SECRET" },
      { status: 401 }
    );
  }

  try {
    // 1. Ping PostgREST Supabase untuk menjalankan query aktif ke PostgreSQL
    const postgrestRes = await fetch(
      `${supabaseUrl}/rest/v1/cv_documents?select=id&limit=1`,
      {
        method: "GET",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        cache: "no-store",
      }
    );

    // 2. Ping Auth Health Service Supabase
    const authRes = await fetch(`${supabaseUrl}/auth/v1/health`, {
      method: "GET",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      cache: "no-store",
    });

    const isDbActive = postgrestRes.ok || postgrestRes.status === 206;
    const isAuthActive = authRes.ok;

    return NextResponse.json({
      status: isDbActive || isAuthActive ? "ok" : "warning",
      message: "Supabase keep-alive ping successful. Inactivity timer reset.",
      database: isDbActive ? "active" : `status ${postgrestRes.status}`,
      auth: isAuthActive ? "active" : `status ${authRes.status}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Failed to connect to Supabase",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
