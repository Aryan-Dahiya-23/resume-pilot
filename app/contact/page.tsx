import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";

export default async function ContactPage() {
  const { userId } = await auth();

  return (
    <PublicShell isSignedIn={Boolean(userId)}>
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Contact
        </div>
        <h1 className="mt-2 font-heading text-4xl text-foreground">Let’s talk</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          This is a placeholder contact page. Add your email or contact form here.
        </p>
        <div className="mt-6">
          <Link href="/" className="text-sm font-medium text-primary hover:underline">
            Back to home
          </Link>
        </div>
      </main>
    </PublicShell>
  );
}
