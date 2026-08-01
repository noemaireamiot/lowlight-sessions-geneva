import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import { logout } from "@/app/admin/actions";
import { Sidebar } from "./Sidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Renders the shell. Layouts do not re-run on client-side navigation, so each
  // page and action calls requireAdmin() again for the real check.
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-background text-foreground paper-grain lg:grid lg:grid-cols-[15rem_1fr]">
      <Sidebar
        username={user.username}
        signOut={
          <form action={logout}>
            <button
              type="submit"
              className="cursor-pointer text-xs uppercase tracking-[0.15em] text-foreground/60 transition-colors hover:text-accent"
            >
              Sign out
            </button>
          </form>
        }
      />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
