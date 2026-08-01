"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/requests", label: "Requests" },
  { href: "/admin/users", label: "Admins" },
] as const;

export function Sidebar({ username, signOut }: { username: string; signOut: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile bar — the sidebar collapses behind a toggle below lg. */}
      <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-4 lg:hidden">
        <span className="font-display text-lg uppercase tracking-tight">Backstage</span>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="admin-nav"
          className="cursor-pointer rounded-full border border-foreground/15 px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors hover:border-foreground"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <nav
        id="admin-nav"
        className={`${open ? "block" : "hidden"} border-b border-foreground/10 lg:sticky lg:top-0 lg:block lg:h-screen lg:border-b-0 lg:border-r`}
      >
        <div className="flex h-full flex-col gap-8 px-5 py-6 lg:px-7 lg:py-8">
          <div className="hidden lg:block">
            <span className="font-display text-xl uppercase leading-none tracking-tight">
              Backstage
            </span>
            <p className="mt-2 text-[0.65rem] uppercase tracking-[0.25em] text-foreground/40">
              Low Light Sessions
            </p>
          </div>

          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => {
              // /admin must not light up for every nested route.
              const active =
                link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      active
                        ? "bg-foreground text-background"
                        : "text-foreground/70 hover:bg-paper hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto space-y-3 border-t border-foreground/10 pt-5">
            <p className="text-[0.65rem] uppercase tracking-[0.25em] text-foreground/40">
              {username}
            </p>
            {signOut}
            <Link
              href="/"
              className="block text-xs uppercase tracking-[0.15em] text-foreground/40 transition-colors hover:text-foreground"
            >
              ← View site
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
