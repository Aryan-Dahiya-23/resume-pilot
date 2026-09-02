import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/components/providers/query-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResumePilot • AI Resume Reviewer & Job Tracker",
  description:
    "Accelerate your career velocity with intelligent AI resume audits, ATS compatibility scoring, and unified application pipeline tracking.",
  icons: {
    icon: "/icon",
    shortcut: "/icon",
    apple: "/icon",
  },
};

const clerkAppearance = {
  variables: {
    colorPrimary: "#059669",
    colorBackground: "#ffffff",
    colorText: "#0f172a",
    colorTextSecondary: "#64748b",
    colorInputBackground: "#ffffff",
    colorInputText: "#0f172a",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-geist-sans), sans-serif",
  },
  elements: {
    card: "border border-slate-200/80 shadow-xl rounded-2xl",
    formButtonPrimary:
      "bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-xs shadow-emerald-600/20 transition-all",
    footerActionLink: "text-emerald-600 hover:text-emerald-700 font-medium",
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
      appearance={clerkAppearance}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        >
          <NextTopLoader color="#059669" showSpinner={false} />
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
