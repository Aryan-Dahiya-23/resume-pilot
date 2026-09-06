"use client";

import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  CheckCheck,
  FileText,
} from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Badge } from "@/components/ui/badge";

export function HeroSection({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <section
      className="landing-container landing-hero"
      aria-labelledby="hero-title"
    >
      <div>
        <div className="hero-label">
          <span /> A clearer path to your next role
        </div>
        <h1 id="hero-title">
          Big ambitions.
          <br />
          <span className="editorial">
            Better
            <br className="hidden min-[1150px]:block" /> applications.
          </span>
        </h1>
        <p className="hero-description">
          You bring the experience. We help you tell the story. Refine your
          resume and keep every opportunity moving, all in one place.
        </p>
        <div className="hero-actions">
          <Link
            href={isSignedIn ? "/dashboard" : "/sign-up"}
            className={buttonStyles("primary", "button-lg")}
          >
            {isSignedIn ? "Open my workspace" : "Build my next chapter"}
            <ArrowUpRight size={18} />
          </Link>
          <a
            href="#how-it-works"
            className={buttonStyles("ghost", "button-lg")}
          >
            See how it works
            <ArrowDown size={16} />
          </a>
        </div>
        <div className="hero-assurances">
          <span>
            <Check size={13} /> Actionable AI feedback
          </span>
          <span>
            <Check size={13} /> Your search, organized
          </span>
        </div>
      </div>
      <div className="hero-art">
        <div className="product-window">
          <div className="window-top">
            <i />
            <i />
            <i />
            <span>your next chapter / workspace</span>
          </div>
          <Tabs defaultValue="resume" className="gap-0">
            <TabsList className="preview-tabs" aria-label="Explore the toolkit">
              <TabsTrigger value="resume">Resume review</TabsTrigger>
              <TabsTrigger value="jobs">Application tracker</TabsTrigger>
            </TabsList>
            <TabsContent value="resume" className="preview-content">
              <div className="preview-file">
                <span className="icon-tile">
                  <FileText size={18} />
                </span>
                <div>
                  <strong>Alex_Morgan_Resume.pdf</strong>
                  <small>Product Designer · Version 03</small>
                </div>
                <span className="ml-auto">
                  <Badge variant="success">Reviewed</Badge>
                </span>
              </div>
              <div className="preview-score">
                <div>
                  <span className="eyebrow !text-[9px]">
                    A stronger first impression
                  </span>
                  <strong className="mt-2">Looking good, Alex.</strong>
                  <p>Your experience is coming through.</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[11px] text-[#628443]">
                    <ArrowUpRight size={13} /> 12 points above your last version
                  </span>
                </div>
                <ProgressRing value={86} size={94} />
              </div>
              <div className="preview-feedback">
                <div>
                  <Check size={12} /> MAKE YOUR IMPACT VISIBLE
                </div>
                <p>
                  “Redesigned the onboarding flow, helping 28% more users
                  complete their first project.”
                </p>
              </div>
            </TabsContent>
            <TabsContent value="jobs" className="preview-content">
              <div className="flex items-center justify-between pb-5">
                <div>
                  <strong className="text-sm font-medium">
                    Good things in motion.
                  </strong>
                  <p className="mt-1 text-xs text-zinc-500">
                    Every opportunity, one clear view.
                  </p>
                </div>
                <span className="icon-tile">
                  <ArrowUpRight size={18} />
                </span>
              </div>
              {[
                {
                  company: "Linear",
                  role: "Product Designer",
                  status: "Interview",
                  variant: "info",
                },
                {
                  company: "Notion",
                  role: "Brand Designer",
                  status: "Applied",
                  variant: "neutral",
                },
                {
                  company: "Figma",
                  role: "Visual Designer",
                  status: "Saved",
                  variant: "warning",
                },
              ].map((job) => (
                <div
                  key={job.company}
                  className="flex items-center gap-3 border-t border-zinc-100 py-4"
                >
                  <div className="company-avatar">{job.company[0]}</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium">{job.company}</div>
                    <div className="mt-1 text-[11px] text-zinc-500">
                      {job.role}
                    </div>
                  </div>
                  <Badge
                    variant={job.variant as "info" | "neutral" | "warning"}
                  >
                    {job.status}
                  </Badge>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
        <div className="floating-label">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#d5ed9a] text-[#19372c]">
            <CheckCheck size={18} />
          </span>
          <div>
            <strong>A little more ready.</strong>
            <p>A lot more confident.</p>
          </div>
        </div>
        <span className="preview-caption">
          An illustrative look inside ResumePilot
        </span>
      </div>
    </section>
  );
}
