import { SignUp } from "@clerk/nextjs";
import { AuthShell, clerkAppearance } from "@/components/auth/auth-shell";

export default function SignUpPage() {
  const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in";
  const redirectUrl =
    process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL ?? "/dashboard";

  return (
    <AuthShell>
      <SignUp
        signInUrl={signInUrl}
        forceRedirectUrl={redirectUrl}
        appearance={clerkAppearance}
      />
    </AuthShell>
  );
}
