import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cevio.id";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/builder", "/login", "/register"],
        disallow: ["/dashboard", "/auth/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
