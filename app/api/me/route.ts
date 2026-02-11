import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/db/users";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await getCurrentDbUser();
  return NextResponse.json({ user });
}
