"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MarketingHeader from "@/features/marketing/marketing-header";
import FooterSection from "@/features/marketing/landing-page/FooterSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTheme } from "next-themes";
import {
  PiCheckCircleDuotone,
  PiShieldCheckDuotone,
  PiFilesDuotone,
  PiClockCountdownDuotone,
  PiCoinsDuotone,
  PiChartLineUpDuotone,
  PiQuestionDuotone,
  PiArrowRightDuotone,
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const badgeVariant = mounted && resolvedTheme === "dark" ? "outline" : "white";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative bg-accent/50">
      <MarketingHeader />
      <div className="w-full pt-32">
        <div className="w-full mt-10 mb-20 pointer-events-auto">
          <div className="max-w-6xl mx-auto mb-10 px-4">
            <Badge variant={badgeVariant} className="mb-8 z-60 dark:px-2 dark:py-0.5">
              <span className="font-medium">Pricing</span>
            </Badge>
            <div className="w-full flex flex-col md:flex-row items-start gap-4">
              <h1 className="text-4xl md:text-5xl font-medium">
                Pricing built for regulated teams
              </h1>
            </div>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
              Transparent, scalable pricing designed for medical device organizations. Start small,
              grow confidently, and keep compliance airtight at every stage.
            </p>
          </div>

          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="relative overflow-hidden border-border/70 shadow-sm hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">Startup</CardTitle>
                    <Badge variant="secondary">Most teams start here</Badge>
                  </div>
                  <CardDescription className="text-base">
                    Launch quickly with everything you need to ship compliant labels.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-semibold">$20</span>
                    <span className="text-muted-foreground">/ month / user</span>
                  </div>
                  <ul className="mt-6 space-y-3 text-sm">
                    {[
                      "Unlimited projects, products, and label components",
                      "Regulatory templates and symbol library access",
                      "Version control with audit-ready change history",
                      "CSV/PDF exports for downstream systems",
                      "Email support with 1 business day response",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <PiCheckCircleDuotone className="mt-0.5 h-5 w-5 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Button className="w-full">Start with Startup</Button>
                  </div>
                </CardContent>
              </Card>

              <Card
                id="enterprise"
                className="relative overflow-hidden border-border/70 bg-muted/40 shadow-sm hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">Enterprise</CardTitle>
                    <Badge variant="outline">Custom</Badge>
                  </div>
                  <CardDescription className="text-base">
                    Built for complex organizations with validation, security, and integrations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-semibold">Talk to Sales</span>
                  </div>
                  <ul className="mt-6 space-y-3 text-sm">
                    {[
                      "Dedicated success and compliance onboarding",
                      "Custom workflows, approvals, and RBAC",
                      "Priority support and SLA options",
                      "Security reviews, SSO, and audit support",
                      "Integrations tailored to your tech stack",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <PiCheckCircleDuotone className="mt-0.5 h-5 w-5 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Link href="mailto:contact@uprevit.com">
                      <Button variant="outline" className="w-full">
                        Talk to Sales
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 mt-16">
            <div className="rounded-2xl border bg-background/60 p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-medium">
                    Optimized for Medical Device Organizations
                  </h2>
                  <p className="text-muted-foreground mt-3 max-w-2xl">
                    Uprevit is built for regulated labeling workflows. Every feature is aligned to
                    reduce compliance risk, speed up approvals, and keep teams audit-ready.
                  </p>
                </div>
                <Link href="/resources">
                  <Button variant="secondary">Explore Resources</Button>
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Regulatory Assurance",
                    description:
                      "Maintain ISO 15223-1, FDA UDI, and EU MDR alignment with built-in guardrails.",
                    icon: PiShieldCheckDuotone,
                  },
                  {
                    title: "Label Data Governance",
                    description:
                      "Centralize label components, symbols, and specs with version control.",
                    icon: PiFilesDuotone,
                  },
                  {
                    title: "Faster Release Cycles",
                    description:
                      "Streamline review and approval stages with structured workflows.",
                    icon: PiClockCountdownDuotone,
                  },
                ].map((item) => (
                  <Card key={item.title} className="bg-muted/30 border-border/70">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <item.icon className="h-5 w-5 text-primary" />
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">
                        {item.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div id="faq" className="max-w-6xl mx-auto px-4 mt-20">
            <div className="flex flex-col items-center text-center mb-10">
              <Badge variant={badgeVariant} className="mb-6 z-60 dark:px-2 dark:py-0.5">
                <PiQuestionDuotone className="mr-1 text-foreground/50" />
                <span className="font-medium">FAQ</span>
              </Badge>
              <h2 className="text-3xl md:text-4xl font-medium">Pricing questions, answered</h2>
              <p className="text-muted-foreground mt-3 max-w-2xl">
                Clear, direct answers for regulated teams evaluating Uprevit pricing.
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

          <div className="max-w-6xl mx-auto px-4 mt-20">
            <div className="relative overflow-hidden rounded-2xl border bg-foreground text-background">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_60%)]" />
              <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="max-w-2xl">
                  <h2 className="text-3xl md:text-4xl font-semibold">
                    Align every label with global compliance in weeks, not months
                  </h2>
                  <p className="mt-3 text-background/70">
                    See how Uprevit compresses labeling timelines while keeping regulatory confidence
                    high across departments and geographies.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="secondary" className="text-foreground">
                    Book a demo
                    <PiArrowRightDuotone className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="border-background/40 text-background">
                    Get pricing help
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <PiCoinsDuotone className="h-4 w-4 text-primary" />
                <span>Start with Startup and upgrade anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <PiChartLineUpDuotone className="h-4 w-4 text-primary" />
                <span>Enterprise rollouts tailored to your org</span>
              </div>
              <div className="flex items-center gap-2">
                <PiShieldCheckDuotone className="h-4 w-4 text-primary" />
                <span>Security and audit support included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <FooterSection />
      </div>
    </div>
  );
}
