import { SignIn } from "@clerk/nextjs";
import { BrandLockup } from "@/components/brand/logo";

export default function SignInPage() {
  const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up";
  const redirectUrl =
    process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL ?? "/dashboard";

  return (
    <div className="paper-canvas flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mb-8">
        <BrandLockup />
      </div>
      <SignIn signUpUrl={signUpUrl} forceRedirectUrl={redirectUrl} />
    </div>
  );
}
