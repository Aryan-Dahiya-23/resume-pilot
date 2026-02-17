import { auth } from "@clerk/nextjs/server";
import { FeaturesSection } from "@/components/landing/features-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { ProductPreviewSection } from "@/components/landing/product-preview-section";
import { SocialProofSection } from "@/components/landing/social-proof-section";

export default async function HomePage() {
  const { userId } = await auth();
  const isSignedIn = Boolean(userId);

  return (
    <div className="min-h-screen bg-zinc-50">
      <LandingHeader isSignedIn={isSignedIn} />
      <HeroSection isSignedIn={isSignedIn} />
      <SocialProofSection />
      <FeaturesSection />
      <ProductPreviewSection isSignedIn={isSignedIn} />
      <HowItWorksSection />
      <FinalCtaSection isSignedIn={isSignedIn} />
      <LandingFooter />
    </div>
  );
}
