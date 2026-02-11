import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up";
  const redirectUrl =
    process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL ?? "/dashboard";

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12">
      <SignIn signUpUrl={signUpUrl} forceRedirectUrl={redirectUrl} />
    </div>
  );
}
