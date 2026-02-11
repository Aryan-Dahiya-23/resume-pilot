import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { deleteUserByClerkId, upsertUserByClerkIdentity } from "@/lib/db/users";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const data = evt.data;
      const clerkId = data.id;
      const email = data.email_addresses?.[0]?.email_address ?? null;
      const first = data.first_name ?? "";
      const last = data.last_name ?? "";
      const name = `${first} ${last}`.trim() || null;

      if (!email) {
        return new Response("Missing email", { status: 400 });
      }

      await upsertUserByClerkIdentity({
        clerkId,
        email,
        name,
      });
    }

    if (evt.type === "user.deleted") {
      const clerkId = evt.data.id;
      if (clerkId) {
        await deleteUserByClerkId(clerkId);
      }
    }

    return new Response("ok", { status: 200 });
  } catch {
    return new Response("Webhook verification failed", { status: 400 });
  }
}
