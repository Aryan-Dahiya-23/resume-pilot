import { auth } from "@clerk/nextjs/server";
import { FeaturesSection } from "@/components/landing/features-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";

export default async function HomePage() {
  const { userId } = await auth();
  const isSignedIn = Boolean(userId);

  return (
    <div className="landing min-h-screen">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <LandingHeader isSignedIn={isSignedIn} />
      <main id="main-content">
        <HeroSection isSignedIn={isSignedIn} />
        <FeaturesSection />
        <HowItWorksSection />
        <FinalCtaSection isSignedIn={isSignedIn} />
      </main>
      <LandingFooter />
    </div>
  );
}
