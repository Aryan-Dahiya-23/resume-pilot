import { SignUp } from "@clerk/nextjs";
import { AuthLayout } from "@/components/layout/auth-layout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create your workspace" };

export default function SignUpPage() {
  const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in";
  const redirectUrl =
    process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL ?? "/dashboard";

  return (
    <AuthLayout signUp>
      <SignUp signInUrl={signInUrl} forceRedirectUrl={redirectUrl} />
    </AuthLayout>
  );
}
