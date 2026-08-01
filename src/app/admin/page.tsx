import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: "Backstage — The Low Light Sessions",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-background text-foreground paper-grain">
      <header className="border-b border-foreground/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 sm:px-10">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-lg uppercase tracking-tight">Backstage</span>
            <span className="text-xs uppercase tracking-[0.2em] text-foreground/40">
              {user.username}
            </span>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="cursor-pointer rounded-full border border-foreground/15 px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors hover:border-foreground"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">Dashboard</p>
        <h1 className="mt-4 font-display text-4xl uppercase leading-[0.95] sm:text-5xl">
          Good evening, {user.username}.
        </h1>
        <p className="mt-5 max-w-xl font-serif text-lg leading-relaxed text-foreground/70">
          Authentication is in place. The rest of the booth comes next.
        </p>

        <Link
          href="/"
          className="mt-12 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/40 transition-colors hover:text-foreground"
        >
          <span aria-hidden>←</span> View site
        </Link>
      </main>
    </div>
  );
}
