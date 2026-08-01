import Link from "next/link";

/** Shared chrome so every admin page reads as one system. */

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-10 flex flex-wrap items-end justify-between gap-5">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-accent">{eyebrow}</p>
        <h1 className="mt-3 font-display text-3xl uppercase leading-[0.95] sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-foreground/60">
            {description}
          </p>
        )}
      </div>
      {action}
    </header>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">{children}</main>;
}

/** Tables must scroll inside their own box rather than widening the page. */
export function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-foreground/10 bg-paper/30">
      <table className="w-full min-w-max border-collapse text-sm">{children}</table>
    </div>
  );
}

export function Th({
  children,
  align = "left",
}: {
  children?: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      scope="col"
      className={`whitespace-nowrap border-b border-foreground/10 px-4 py-3 text-[0.65rem] font-medium uppercase tracking-[0.15em] text-foreground/50 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  align = "left",
  muted = false,
}: {
  children?: React.ReactNode;
  align?: "left" | "right";
  muted?: boolean;
}) {
  return (
    <td
      className={`border-b border-foreground/5 px-4 py-3 align-top ${
        align === "right" ? "text-right" : "text-left"
      } ${muted ? "text-foreground/50" : ""}`}
    >
      {children}
    </td>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-foreground/15 px-5 py-10 text-center text-sm text-foreground/50">
      {children}
    </p>
  );
}

const BUTTON_BASE =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.15em] transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export const buttonPrimary = `${BUTTON_BASE} bg-foreground text-background hover:bg-accent`;
export const buttonGhost = `${BUTTON_BASE} border border-foreground/15 hover:border-foreground`;
export const buttonDanger = `${BUTTON_BASE} border border-accent/40 text-accent hover:bg-accent hover:text-white`;

export function LinkButton({
  href,
  children,
  variant = "ghost",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  return (
    <Link href={href} className={variant === "primary" ? buttonPrimary : buttonGhost}>
      {children}
    </Link>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-foreground/10 bg-paper/30 px-5 py-6">
      <p className="text-[0.65rem] uppercase tracking-[0.25em] text-foreground/45">{label}</p>
      <p className="mt-3 font-display text-4xl leading-none">{value}</p>
      {hint && <p className="mt-2 text-xs text-foreground/50">{hint}</p>}
    </div>
  );
}

/** Stable, locale-independent date rendering — avoids server/client mismatch. */
export function formatDate(date: Date | null | undefined): string {
  if (!date) return "—";
  return date.toISOString().slice(0, 10);
}

export function formatDateTime(date: Date): string {
  return date.toISOString().slice(0, 16).replace("T", " ");
}

export function formatMonth(key: string): string {
  const [year, month] = key.split("-");
  const names = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${names[Number(month) - 1] ?? month} ${year}`;
}
