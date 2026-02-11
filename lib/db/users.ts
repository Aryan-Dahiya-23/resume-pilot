import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

type UpsertUserInput = {
  clerkId: string;
  email: string;
  name?: string | null;
};

export async function getCurrentDbUser() {
  const { userId } = await auth();
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { clerkId: userId },
  });
}

export async function upsertUserByClerkIdentity({
  clerkId,
  email,
  name,
}: UpsertUserInput) {
  const existingByClerkId = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (existingByClerkId) {
    return prisma.user.update({
      where: { id: existingByClerkId.id },
      data: {
        email,
        name: name ?? null,
      },
    });
  }

  const existingByEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingByEmail) {
    return prisma.user.update({
      where: { id: existingByEmail.id },
      data: {
        clerkId,
        name: name ?? null,
      },
    });
  }

  return prisma.user.create({
    data: {
      clerkId,
      email,
      name: name ?? null,
    },
  });
}

export async function deleteUserByClerkId(clerkId: string) {
  return prisma.user.deleteMany({
    where: { clerkId },
  });
}

export async function syncCurrentUserToDatabase() {
  const user = await currentUser();
  if (!user) return null;

  const primaryEmail =
    user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)
      ?.emailAddress ?? user.emailAddresses[0]?.emailAddress;

  if (!primaryEmail) return null;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();

  return upsertUserByClerkIdentity({
    clerkId: user.id,
    email: primaryEmail,
    name: fullName || null,
  });
}
