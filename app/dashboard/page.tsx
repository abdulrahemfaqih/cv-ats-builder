import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/ui/Navbar";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import type { CVDocument } from "@/types/cv";

import type { User } from "@supabase/supabase-js";

export default async function DashboardPage() {
  const supabase = await createClient();

  const isConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project.supabase.co") &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder.supabase.co")
  );

  let user = null;
  let cvDocuments: CVDocument[] = [];

  if (isConfigured) {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      redirect("/login?returnUrl=/dashboard");
    }
    user = data.user;

    // Fetch user's CV documents
    const { data: cvs } = await supabase
      .from("cv_documents")
      .select("*")
      .order("updated_at", { ascending: false });

    if (cvs) {
      cvDocuments = cvs as CVDocument[];
    }
  } else {
    // If Supabase not yet configured, create mock user session for dev exploration
    user = {
      id: "mock-user-dev",
      email: "guest.developer@cevio.app",
      app_metadata: {},
      user_metadata: { full_name: "Tamu Pengembang" },
      aud: "authenticated",
      created_at: new Date().toISOString(),
    } as unknown as User;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex flex-col">
      <Navbar currentSection="dashboard" />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <DashboardClient
          initialDocuments={cvDocuments}
          user={user}
          isConfigured={isConfigured}
        />
      </main>
    </div>
  );
}
