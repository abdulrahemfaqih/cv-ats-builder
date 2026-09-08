import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Supabase Keep-Alive Cron Endpoint
 *
 * Mencegah Supabase Free Plan otomatis di-pause setelah 7 hari tidak aktif
 * dengan mengeksekusi query berkala ke PostgREST Supabase.
 */
export async function GET(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      {
        status: "error",
        message: "Supabase environment variables (URL/ANON_KEY) are missing",
      },
      { status: 500 }
    );
  }

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
    // Ping PostgREST Supabase untuk menjalankan query aktif ke PostgreSQL
    const res = await fetch(
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

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        {
          status: "warning",
          message: "Supabase query responded with non-200 status",
          statusCode: res.status,
          details: errorText,
          timestamp: new Date().toISOString(),
        },
        { status: res.status }
      );
    }

    return NextResponse.json({
      status: "ok",
      message: "Supabase keep-alive ping successful. Inactivity timer reset.",
      database: "active",
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
