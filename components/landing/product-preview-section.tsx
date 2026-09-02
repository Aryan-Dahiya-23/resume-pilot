"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  FileText,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Progress } from "@/components/ui/progress";

export function ProductPreviewSection({ isSignedIn = false }: { isSignedIn?: boolean }) {
  return (
    <section id="preview" className="mx-auto max-w-7xl px-4 py-12 sm:py-20 lg:py-24 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>Interactive Preview</span>
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Experience the Workspace
            </h2>
          </div>

          <Button asChild size="sm" className="self-start sm:self-auto shadow-xs shadow-emerald-600/20">
            <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
              {isSignedIn ? "Open Dashboard" : "Launch Your Workspace"}
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="resume" className="mt-8">
          <TabsList className="mb-6">
            <TabsTrigger value="resume" className="gap-2">
              <FileText className="size-4 text-emerald-600" />
              Resume Audit View
            </TabsTrigger>
            <TabsTrigger value="pipeline" className="gap-2">
              <BarChart3 className="size-4 text-teal-600" />
              Pipeline Tracking View
            </TabsTrigger>
          </TabsList>

          {/* Resume Tab Content */}
          <TabsContent value="resume" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Score Card */}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 flex flex-col items-center text-center justify-center">
                <ProgressRing value={88} size={110} strokeWidth={10} />
                <div className="mt-3">
                  <Badge variant="success" withDot>
                    ATS Score: 88 • Ready
                  </Badge>
                  <p className="mt-2 text-xs text-slate-500 max-w-[200px]">
                    Scored against Senior Fullstack Engineer roles.
                  </p>
                </div>
              </div>

              {/* Optimization Cards */}
              <div className="lg:col-span-2 space-y-3">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      High-Impact Rewrite Sample
                    </span>
                    <Badge variant="brand">Impact Score +24%</Badge>
                  </div>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="rounded-lg bg-rose-50/60 p-2.5 text-slate-600 font-mono">
                      <span className="font-bold text-rose-700 block text-[10px]">ORIGINAL:</span>
                      Built authentication and API endpoints for our app.
                    </div>
                    <div className="rounded-lg bg-emerald-50/60 p-2.5 text-slate-900 font-mono font-medium">
                      <span className="font-bold text-emerald-700 block text-[10px]">AI SUGGESTION:</span>
                      Engineered OAuth2 session management with Redis token revocation, cutting latency by 35% for 450k active sessions.
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
                  <span className="text-xs font-bold text-slate-700 block mb-2">
                    Identified Keyword Opportunities
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="neutral">+ Distributed Systems</Badge>
                    <Badge variant="neutral">+ Kubernetes</Badge>
                    <Badge variant="neutral">+ CI/CD Automation</Badge>
                    <Badge variant="neutral">+ gRPC Services</Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Pipeline Tab Content */}
          <TabsContent value="pipeline" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Velocity Widget */}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <TrendingUp className="size-4 text-emerald-600" />
                    Weekly Velocity
                  </span>
                  <Badge variant="brand">70% Target</Badge>
                </div>
                <div className="text-3xl font-extrabold text-slate-900">
                  7 <span className="text-sm font-normal text-slate-400">/ 10 jobs applied</span>
                </div>
                <Progress value={70} className="h-2" />
                <p className="text-xs text-slate-500">
                  You are 3 applications away from reaching your peak callback threshold.
                </p>
              </div>

              {/* Sample Board Rows */}
              <div className="lg:col-span-2 space-y-2">
                {[
                  { company: "Vercel", role: "Design Engineer", status: "Interview" as const, when: "2d ago" },
                  { company: "Linear", role: "Fullstack Engineer", status: "Applied" as const, when: "3d ago" },
                  { company: "Stripe", role: "Software Engineer", status: "Offer" as const, when: "5d ago" },
                ].map((item) => (
                  <div
                    key={item.company}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 font-bold text-xs text-emerald-800">
                        {item.company.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900 truncate">{item.company}</div>
                        <div className="text-xs text-slate-500 truncate">{item.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 pl-11 sm:pl-0">
                      <span className="text-xs text-slate-400">{item.when}</span>
                      <Badge
                        variant={item.status === "Offer" ? "success" : item.status === "Interview" ? "info" : "neutral"}
                        withDot
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
