"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@uprevit/ui/components/ui/accordion";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@uprevit/ui/components/ui/card";
import { DottedVerticalLines } from "@/features/marketing/landing-page/DottedVerticalLines";
import FooterSection from "@/features/marketing/landing-page/FooterSection";
import MarketingHeader from "@/features/marketing/marketing-header";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  PiArrowRightDuotone,
  PiCheckCircleDuotone,
  PiClockCountdownDuotone,
  PiCoinsDuotone,
  PiFilesDuotone,
  PiQuestionDuotone,
  PiShieldCheckDuotone,
  PiStackDuotone,
} from "react-icons/pi";

const pricingFAQs = [
  {
    question: "Is pricing per user or per workspace?",
    answer:
      "Startup pricing is billed per active user per month. Enterprise plans are customized based on deployment scope, compliance needs, and integrations.",
  },
  {
    question: "Do you offer annual billing?",
    answer:
      "Yes. Annual billing is available for both Startup and Enterprise plans and includes a discounted rate.",
  },
  {
    question: "What happens when we add or remove users?",
    answer:
      "Your monthly bill scales with active users. Add or remove users any time to match project demand and budget.",
  },
  {
    question: "Do you support validation and audit readiness?",
    answer:
      "Yes. Uprevit is optimized for regulated teams with traceability, version control, and audit-ready artifacts.",
  },
];

export default function PricingPage() {
  const { resolvedTheme } = useTheme();

  const badgeVariant = resolvedTheme === "dark" ? "outline" : "white";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative bg-accent/50">
      <MarketingHeader />
      <div className="relative w-full">
        <DottedVerticalLines />
        <div className="relative z-10 w-full pt-24">
          <div className="relative w-full mt-10 mb-20 pointer-events-auto">
            <div className="absolute top-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
            <div className="max-w-6xl mx-auto mb-10">
              <Badge
                variant={badgeVariant}
                className="mb-8 z-60 dark:px-2 dark:py-0.5"
              >
                <PiCoinsDuotone />
                <span className="font-medium">Pricing</span>
              </Badge>
              <div className="w-full flex flex-col md:flex-row items-start gap-4">
                <h1 className="text-4xl md:text-5xl font-medium">
                  Pricing built for regulated teams
                </h1>
              </div>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
                Transparent, scalable pricing designed for medical device
                organizations. Start small, grow confidently, and keep
                compliance airtight at every stage.
              </p>
            </div>

            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
              <div className="absolute bottom-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="hidden md:flex w-12 lg:w-20 xl:w-30 self-stretch items-stretch justify-center gap-2 border-r border-dashed border-border relative overflow-hidden">
                    <div className="pointer-events-none absolute inset-y-3 left-0 right-0 flex flex-col justify-between">
                      {Array.from({ length: 60 }).map((_, index) => (
                        <span
                          key={index}
                          className="w-full border-t border-dashed border-border"
                        />
                      ))}
                    </div>
                    {Array.from({ length: 11 }).map((_, index) => (
                      <span
                        key={index}
                        className="relative z-10 h-full w-px border-l border-dashed border-border"
                      />
                    ))}
                  </div>
                  <Card className="relative overflow-hidden rounded-2xl max-w-90 border-border/70 bg-background shadow-[0_28px_55px_-45px_rgba(15,15,15,0.45)]">
                    <CardHeader className="pb-8">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl">Startup</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end gap-3">
                        <span className="text-5xl font-semibold">$20</span>
                        <span className="text-muted-foreground pb-1">
                          per user / month
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">
                        Includes everything needed to standardize label data and
                        ship faster.
                      </p>
                      <Button className="mt-6 h-12 w-full rounded-xl text-base">
                        Start with Startup
                        <PiArrowRightDuotone className="ml-2 h-4 w-4" />
                      </Button>
                      <ul className="mt-6 space-y-3 border-t border-border/70 pt-6 text-[15px]">
                        {[
                          "Unlimited projects, products, and label components",
                          "Regulatory templates and symbol library access",
                          "Version control with audit-ready change history",
                          "CSV/PDF exports for downstream systems",
                          "Email support with 1 business day response",
                        ].map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <PiCheckCircleDuotone className="mt-0.5 h-5 w-5 text-foreground" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <div className="hidden md:flex w-12 lg:w-20 xl:w-30 self-stretch items-stretch justify-center gap-2 border-x border-dashed border-border relative overflow-hidden">
                    <div className="pointer-events-none absolute inset-y-3 left-0 right-0 flex flex-col justify-between">
                      {Array.from({ length: 60 }).map((_, index) => (
                        <span
                          key={index}
                          className="w-full border-t border-dashed border-border"
                        />
                      ))}
                    </div>
                    {Array.from({ length: 11 }).map((_, index) => (
                      <span
                        key={index}
                        className="relative z-10 h-full w-px border-l border-dashed border-border"
                      />
                    ))}
                  </div>
                  <Card
                    id="enterprise"
                    className="relative overflow-hidden rounded-2xl max-w-90 border-border/70 bg-background/80 shadow-[0_24px_50px_-42px_rgba(15,15,15,0.35)]"
                  >
                    <CardHeader className="pb-8">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl">Enterprise</CardTitle>
                        {/* <Badge variant="outline">Custom</Badge> */}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end gap-3 h-12">
                        <span className="text-4xl font-semibold">Custom</span>
                        <span className="text-muted-foreground pb-1">
                          tailored pricing
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">
                        Engage our team for compliance validation, security
                        reviews, and integration scope.
                      </p>
                      <Button
                        asChild
                        variant="secondary"
                        className="mt-6 h-12 w-full rounded-xl text-base"
                      >
                        <Link href="mailto:contact@uprevit.com">
                          Talk to Sales
                          <PiArrowRightDuotone className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <ul className="mt-6 space-y-3 border-t border-border/70 pt-6 text-[15px]">
                        {[
                          "Dedicated success and compliance onboarding",
                          "Custom workflows, approvals, and RBAC",
                          "Priority support and SLA options",
                          "Security reviews, SSO, and audit support",
                          "Integrations tailored to your tech stack",
                        ].map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <PiCheckCircleDuotone className="mt-0.5 h-5 w-5 text-foreground" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <div className="hidden md:flex w-12 lg:w-20 xl:w-30 self-stretch items-stretch justify-center gap-2 border-l border-dashed border-border relative overflow-hidden">
                    <div className="pointer-events-none absolute inset-y-3 left-0 right-0 flex flex-col justify-between">
                      {Array.from({ length: 60 }).map((_, index) => (
                        <span
                          key={index}
                          className="w-full border-t border-dashed border-border"
                        />
                      ))}
                    </div>
                    {Array.from({ length: 11 }).map((_, index) => (
                      <span
                        key={index}
                        className="relative z-10 h-full w-px border-l border-dashed border-border"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
              <div className="absolute bottom-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
              <div className="max-w-6xl mx-auto mt-16">
                <div className="rounded-2xl border bg-background/80 p-8 md:p-12">
                  <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 items-stretch">
                    <div className="flex flex-col">
                      <Badge
                        variant="outline"
                        className="w-fit border-border/60 bg-background/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
                      >
                        For medical device teams
                      </Badge>
                      <h2 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight leading-tightest">
                        Optimized for medical device organizations
                      </h2>
                      <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-xl leading-tight">
                        Use Uprevit to unify label data, approvals, and
                        compliance evidence in one controlled workspace. Reduce
                        regulatory risk while accelerating release cycles.
                      </p>
                      <div className="mt-4 h-px w-full bg-border/70" />
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <PiShieldCheckDuotone className="h-4 w-4 text-primary" />
                          ISO 15223-1
                        </div>
                        <div className="flex items-center gap-2">
                          <PiFilesDuotone className="h-4 w-4 text-primary" />
                          FDA UDI
                        </div>
                        <div className="flex items-center gap-2">
                          <PiClockCountdownDuotone className="h-4 w-4 text-primary" />
                          EU MDR
                        </div>
                        <div className="flex items-center gap-2">
                          <PiShieldCheckDuotone className="h-4 w-4 text-primary" />
                          ISO 13485
                        </div>
                        <div className="flex items-center gap-2">
                          <PiFilesDuotone className="h-4 w-4 text-primary" />
                          Health Canada
                        </div>
                        <div className="flex items-center gap-2">
                          <PiClockCountdownDuotone className="h-4 w-4 text-primary" />
                          UKCA
                        </div>
                      </div>
                      <div className="mt-8 flex flex-wrap items-center gap-2">
                        <Button asChild size="lg" variant="outline">
                          <Link href="/resources/templates">
                            <PiFilesDuotone />
                            View Templates
                          </Link>
                        </Button>
                        <Button asChild size="lg">
                          <Link href="/resources">
                            <PiStackDuotone />
                            Explore Resources
                          </Link>
                        </Button>
                      </div>
                      <p className="mt-3 text-xs text-muted-foreground">
                        Built for FDA UDI, EU MDR, and global labeling rollouts.
                      </p>
                    </div>

                    <div className="relative">
                      <div className="h-full rounded-3xl border bg-muted/20 p-2">
                        <div className="rounded-2xl border bg-background p-8 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="text-base font-semibold">
                              Regulatory Workspaces
                            </div>
                            <Badge variant="secondary" className="text-[11px]">
                              Live
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Assemble label evidence, approvals, and audit trails
                            in one workspace.
                          </p>
                          <div className="mt-5 space-y-3">
                            {[
                              {
                                title: "UDI Label Pack",
                                subtitle: "EU MDR · FDA UDI",
                                status: "Approved",
                                icon: PiFilesDuotone,
                                tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
                              },
                              {
                                title: "Symbols Library",
                                subtitle: "ISO 15223-1",
                                status: "Active",
                                icon: PiShieldCheckDuotone,
                                tone: "border-border/60 bg-background text-muted-foreground",
                              },
                              {
                                title: "Change Review",
                                subtitle: "Audit trail · QMS",
                                status: "In Review",
                                icon: PiClockCountdownDuotone,
                                tone: "border-amber-200 bg-amber-50 text-amber-700",
                              },
                            ].map((item) => (
                              <div
                                key={item.title}
                                className="flex items-center justify-between rounded-xl border bg-muted/30 px-3 py-2"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                    <item.icon className="h-4 w-4 text-primary" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">
                                      {item.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {item.subtitle}
                                    </p>
                                  </div>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={`text-[11px] ${item.tone}`}
                                >
                                  {item.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                        <p className="ml-4 mt-2 text-sm text-muted-foreground">
                          Incorporate Uprevit in your QMS for audit-ready
                          labeling documentation and traceability.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
              <div className="absolute bottom-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
              <div id="faq" className="max-w-6xl mx-auto mt-20">
                <div className="flex flex-col items-center text-center mb-10">
                  <Badge
                    variant={badgeVariant}
                    className="mb-6 z-60 dark:px-2 dark:py-0.5"
                  >
                    <PiQuestionDuotone className="mr-1 text-foreground/50" />
                    <span className="font-medium">FAQ</span>
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-medium">
                    Pricing questions, answered
                  </h2>
                  <p className="text-muted-foreground mt-3 max-w-2xl">
                    Clear, direct answers for regulated teams evaluating Uprevit
                    pricing.
                  </p>
                </div>
                <div className="max-w-3xl mx-auto">
                  <Accordion type="single" collapsible defaultValue="item-0">
                    {pricingFAQs.map((faq, index) => (
                      <AccordionItem key={faq.question} value={`item-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
              <div className="absolute bottom-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
              <div className="max-w-6xl mx-auto mt-20">
                <div className="relative overflow-hidden rounded-2xl border bg-foreground text-background flex items-center h-80">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_60%)]" />
                  <div className="relative w-full p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div className="max-w-2xl">
                      <h2 className="text-3xl md:text-4xl font-semibold">
                        Align every label with global compliance in weeks, not
                        months
                      </h2>
                      <p className="mt-3 text-background/70">
                        See how Uprevit compresses labeling timelines while
                        keeping regulatory confidence high across departments
                        and geographies.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="secondary" className="text-foreground">
                        Book a demo
                        <PiArrowRightDuotone />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-35 w-full">
          <FooterSection />
        </div>
      </div>
    </div>
  );
}
