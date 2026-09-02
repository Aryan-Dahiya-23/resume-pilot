import { SignIn } from "@clerk/nextjs";
import { AuthContainer } from "@/components/layout/auth-container";

export default function SignInPage() {
  const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up";
  const redirectUrl =
    process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL ?? "/dashboard";

  return (
    <AuthContainer>
      <SignIn signUpUrl={signUpUrl} forceRedirectUrl={redirectUrl} />
    </AuthContainer>
  );
}
