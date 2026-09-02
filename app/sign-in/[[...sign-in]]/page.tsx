import { SignIn } from "@clerk/nextjs";
import { AuthShell, clerkAppearance } from "@/components/auth/auth-shell";

export default function SignInPage() {
  const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up";
  const redirectUrl =
    process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL ?? "/dashboard";

  return (
    <AuthShell>
      <SignIn
        signUpUrl={signUpUrl}
        forceRedirectUrl={redirectUrl}
        appearance={clerkAppearance}
      />
    </AuthShell>
  );
}
