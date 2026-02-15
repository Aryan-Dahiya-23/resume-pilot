import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { deleteUserById, ensureCurrentDbUser } from "@/lib/db/users";

export async function DELETE() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await ensureCurrentDbUser();
  if (!dbUser) {
    return NextResponse.json(
      { error: "Could not create or load user record" },
      { status: 500 },
    );
  }

  await deleteUserById(dbUser.id);

  return NextResponse.json({ ok: true });
}
