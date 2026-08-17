import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The MariaDB driver relies on Node.js internals — keep it out of the
  // Server Components bundle and let Node require it natively.
  serverExternalPackages: ["@prisma/adapter-mariadb", "mariadb"],

  // The locale lives in client state, not in the URL. Legacy /fr links land on
  // the same pages as the canonical ones.
  async redirects() {
    return [
      { source: "/fr", destination: "/", permanent: true },
      { source: "/fr/:path*", destination: "/:path*", permanent: true },
    ];
  },

  images: {
    // Allow-list the only two local sources: images committed under public/, and
    // uploads served by the /api/media route. Anything else gets a 400 from the
    // optimizer instead of being fetched.
    localPatterns: [
      { pathname: "/images/**", search: "" },
      { pathname: "/api/media/**", search: "" },
    ],
  },
};

export default nextConfig;
