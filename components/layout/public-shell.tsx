import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";

export function PublicShell({
  children,
  isSignedIn = false,
}: {
  children: React.ReactNode;
  isSignedIn?: boolean;
}) {
  return (
    <div className="paper-canvas min-h-screen bg-background">
      <LandingHeader isSignedIn={isSignedIn} />
      {children}
      <LandingFooter />
    </div>
  );
}
