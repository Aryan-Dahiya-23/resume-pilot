import { SignUp } from "@clerk/nextjs";
import { AuthContainer } from "@/components/layout/auth-container";

export default function SignUpPage() {
  const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in";
  const redirectUrl =
    process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL ?? "/dashboard";

  return (
    <AuthContainer>
      <SignUp signInUrl={signInUrl} forceRedirectUrl={redirectUrl} />
    </AuthContainer>
  );
}
