import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin-auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in — The Low Light Sessions",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  // Already signed in? No reason to show the form again.
  if (await getAdminUser()) redirect("/admin");

  return (
    <div className="min-h-screen bg-foreground lg:grid lg:grid-cols-[1.1fr_1fr]">
      {/* Cinematic panel — hidden on small screens where it would just push the form down. */}
      <aside className="relative hidden lg:block">
        <Image
          src="/images/photos/concert-02.jpg"
          alt=""
          fill
          priority
          sizes="55vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        <div className="absolute inset-0 vignette" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <span className="font-display text-xl uppercase tracking-tight">
            The Low Light Sessions
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Behind the scenes
            </p>
            <p className="mt-3 max-w-sm font-serif text-2xl italic leading-snug text-white/90">
              The lights go down, the booth lights up.
            </p>
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex min-h-screen flex-col justify-center bg-background px-6 py-16 paper-grain sm:px-12 lg:min-h-0">
        <div className="mx-auto w-full max-w-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Restricted access</p>
          <h1 className="mt-4 font-display text-4xl uppercase leading-[0.95] sm:text-5xl">
            Backstage
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-foreground/60">
            Sign in to manage sessions and incoming requests.
          </p>

          <LoginForm />

          <Link
            href="/"
            className="mt-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/40 transition-colors hover:text-foreground"
          >
            <span aria-hidden>←</span> Back to site
          </Link>
        </div>
      </main>
    </div>
  );
}
