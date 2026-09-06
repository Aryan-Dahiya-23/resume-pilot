import Link from "next/link";
import { ArrowUpRight, Compass } from "lucide-react";
import { PublicPageLayout } from "@/components/layout/public-page-layout";
import { buttonStyles } from "@/components/ui/button";
export default function NotFound() {
  return (
    <PublicPageLayout
      eyebrow="A SMALL DETOUR · 404"
      title="Let’s get you back on track."
    >
      <Compass size={44} className="mb-6 text-[#91aa76]" strokeWidth={1.2} />
      <p>
        We couldn’t find this page. Your next step is still waiting in your
        workspace.
      </p>
      <Link href="/dashboard" className={buttonStyles()}>
        Go to my workspace
        <ArrowUpRight size={16} />
      </Link>
    </PublicPageLayout>
  );
}
