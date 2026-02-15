import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ensureCurrentDbUser, updateUserNameById } from "@/lib/db/users";

export async function PATCH(request: Request) {
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

  const body = (await request.json()) as { name?: unknown };
  const name = typeof body.name === "string" ? body.name.trim() : "";

  const updated = await updateUserNameById({
    userId: dbUser.id,
    name: name || null,
  });

  return NextResponse.json({ user: updated });
}
