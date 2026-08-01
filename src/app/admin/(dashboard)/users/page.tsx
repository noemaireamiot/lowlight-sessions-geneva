import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import {
  EmptyState,
  PageHeader,
  Shell,
  TableWrap,
  Td,
  Th,
  formatDateTime,
} from "../ui";
import { UserDialog } from "./UserDialog";
import { DeleteUserButton } from "./DeleteUserButton";
import { createUser, updateUser } from "./actions";

export const metadata: Metadata = {
  title: "Admins — Backstage",
};

export default async function UsersPage() {
  const current = await requireAdmin();

  let users: { id: number; username: string; createdAt: Date; updatedAt: Date }[] = [];
  let unreachable = false;
  try {
    users = await prisma.user.findMany({
      orderBy: { username: "asc" },
      // Never select passwordHash — it has no reason to leave the database.
      select: { id: true, username: true, createdAt: true, updatedAt: true },
    });
  } catch (error) {
    console.error("Failed to load admin users:", error);
    unreachable = true;
  }

  const isLastAccount = users.length <= 1;

  return (
    <Shell>
      <PageHeader
        eyebrow="Admins"
        title="Accounts"
        description="Who can sign in to Backstage. Passwords are stored hashed and can only be replaced, never read back."
        action={
          <UserDialog
            action={createUser}
            trigger={{ label: "New admin", variant: "primary" }}
            heading="New admin"
            submitLabel="Create account"
            passwordRequired
            passwordHint="At least 12 characters."
          />
        }
      />

      {unreachable ? (
        <p className="rounded-xl border border-accent/30 bg-accent/5 px-5 py-4 text-sm text-accent">
          Could not reach the database.
        </p>
      ) : users.length === 0 ? (
        <EmptyState>
          No accounts. Create one with <code>npm run admin:create -- &lt;username&gt;</code>.
        </EmptyState>
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>Username</Th>
              <Th>Created (UTC)</Th>
              <Th>Last change (UTC)</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-paper/50">
                <Td>
                  <span className="whitespace-nowrap">{user.username}</span>
                  {user.id === current.id && (
                    <span className="ml-2 rounded-full bg-foreground/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.12em] text-foreground/60">
                      You
                    </span>
                  )}
                </Td>
                <Td muted>{formatDateTime(user.createdAt)}</Td>
                <Td muted>{formatDateTime(user.updatedAt)}</Td>
                <Td align="right">
                  <span className="inline-flex items-center gap-4">
                    <UserDialog
                      action={updateUser.bind(null, user.id)}
                      trigger={{ label: "Edit", variant: "link" }}
                      heading={`Edit ${user.username}`}
                      submitLabel="Save changes"
                      initialUsername={user.username}
                      passwordRequired={false}
                      passwordHint="Leave empty to keep the current password."
                    />
                    <DeleteUserButton
                      id={user.id}
                      username={user.username}
                      disabled={user.id === current.id || isLastAccount}
                      disabledReason={
                        user.id === current.id
                          ? "You cannot delete your own account"
                          : "The last admin account cannot be deleted"
                      }
                    />
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </Shell>
  );
}
