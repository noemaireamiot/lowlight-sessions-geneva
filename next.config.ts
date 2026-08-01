import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The MariaDB driver relies on Node.js internals — keep it out of the
  // Server Components bundle and let Node require it natively.
  serverExternalPackages: ["@prisma/adapter-mariadb", "mariadb"],
};

export default nextConfig;
