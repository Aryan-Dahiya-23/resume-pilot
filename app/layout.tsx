import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/components/providers/query-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";

export const metadata: Metadata = {
  title: "ResumePilot",
  description: "AI Resume Reviewer + Job Tracker",
  icons: {
    icon: "/icon",
    shortcut: "/icon",
    apple: "/icon",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in";
  const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up";
  const signInFallbackRedirectUrl =
    process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL ?? "/dashboard";
  const signUpFallbackRedirectUrl =
    process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL ?? "/dashboard";

  return (
    <ClerkProvider
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      signInFallbackRedirectUrl={signInFallbackRedirectUrl}
      signUpFallbackRedirectUrl={signUpFallbackRedirectUrl}
    >
      <html lang="en">
        <body className="antialiased">
          <NextTopLoader showSpinner={false} />
          <QueryProvider>
            <TooltipProvider>
              <ToastProvider>{children}</ToastProvider>
            </TooltipProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
