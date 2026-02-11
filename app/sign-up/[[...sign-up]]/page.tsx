import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in";
  const redirectUrl =
    process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL ?? "/dashboard";

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12">
      <SignUp signInUrl={signInUrl} forceRedirectUrl={redirectUrl} />
    </div>
  );
}
