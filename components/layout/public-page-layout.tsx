import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingFooter } from "@/components/landing/landing-footer";
export function PublicPageLayout({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="landing min-h-screen">
      <LandingHeader />
      <main className="public-page">
        <Link href="/" className="text-link mb-9">
          <ArrowLeft size={14} />
          Back to home
        </Link>
        <p className="eyebrow !mb-3">{eyebrow}</p>
        <h1>{title}</h1>
        {children}
      </main>
      <LandingFooter />
    </div>
  );
}
