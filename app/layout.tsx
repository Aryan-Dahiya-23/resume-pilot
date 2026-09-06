import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/components/providers/query-provider";
import { ToastProvider } from "@/components/providers/toast-provider";

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
  title: {
    default: "ResumePilot — Your next chapter starts here",
    template: "%s · ResumePilot",
  },
  description:
    "Build a stronger resume and keep every opportunity moving. AI resume feedback and application tracking, in one thoughtful workspace.",
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
      appearance={{
        variables: {
          colorPrimary: "#19372c",
          colorText: "#1b2923",
          colorTextSecondary: "#727970",
          colorBackground: "#ffffff",
          borderRadius: "0.7rem",
          fontFamily: "var(--font-geist-sans), sans-serif",
        },
        elements: {
          cardBox: "shadow-none border border-[#e4e8df] rounded-2xl",
          formButtonPrimary: "shadow-none",
        },
      }}
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      signInFallbackRedirectUrl={signInFallbackRedirectUrl}
      signUpFallbackRedirectUrl={signUpFallbackRedirectUrl}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <NextTopLoader color="#789d55" height={2} showSpinner={false} />
          <QueryProvider>
            <ToastProvider>{children}</ToastProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
