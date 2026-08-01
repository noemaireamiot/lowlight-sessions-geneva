// Scripts run outside the Next.js runtime, so .env* files are not loaded for us.
// @next/env applies the same precedence Next.js uses (.env.local wins over .env).
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");
