import { SignIn } from "@clerk/nextjs";
import { AuthLayout } from "@/components/layout/auth-layout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Welcome back" };

export default function SignInPage() {
  const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up";
  const redirectUrl =
    process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL ?? "/dashboard";

  return (
    <AuthLayout>
      <SignIn signUpUrl={signUpUrl} forceRedirectUrl={redirectUrl} />
    </AuthLayout>
  );
}
