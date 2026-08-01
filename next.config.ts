import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The MariaDB driver relies on Node.js internals — keep it out of the
  // Server Components bundle and let Node require it natively.
  serverExternalPackages: ["@prisma/adapter-mariadb", "mariadb"],

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
