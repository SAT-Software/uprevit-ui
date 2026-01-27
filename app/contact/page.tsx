"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MarketingHeader from "@/features/marketing/marketing-header";
import FooterSection from "@/features/marketing/landing-page/FooterSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTheme } from "next-themes";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import {
  PiEnvelopeSimpleDuotone,
  PiClockClockwiseDuotone,
  PiMapPinDuotone,
  PiQuestionDuotone,
  PiChatTextDuotone,
  PiArrowRightDuotone,
} from "react-icons/pi";

const contactFAQs = [
  {
    question: "How quickly will we hear back?",
    answer:
      "We respond within 1 business day. Enterprise and urgent requests are prioritized based on scope.",
  },
  {
    question: "Can you help with compliance assessments?",
    answer:
      "Yes. We can review your current labeling workflow and recommend a path to compliance readiness.",
  },
  {
    question: "Do you support global labeling teams?",
    answer:
      "Absolutely. Uprevit is designed for distributed teams managing multiple regions and standards.",
  },
  {
    question: "Where can I access product documentation?",
    answer:
      "Visit the Resources hub for templates, standards, and regulatory updates.",
  },
];

export default function ContactPage() {
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
              <span className="font-medium">Contact</span>
            </Badge>
            <div className="w-full flex flex-col md:flex-row items-start gap-4">
              <h1 className="text-4xl md:text-5xl font-medium">
                Let&apos;s connect your labeling team with clarity
              </h1>
            </div>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
              Whether you&apos;re evaluating Uprevit or need help with an ongoing compliance program,
              our team is ready to help.
            </p>
          </div>

          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col gap-6">
                <Card className="border-border/70 bg-muted/40">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <PiEnvelopeSimpleDuotone className="h-5 w-5 text-primary" />
                      Email us directly
                    </CardTitle>
                    <CardDescription>
                      We&apos;ll route your request to the right compliance specialist.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href="mailto:contact@uprevit.com"
                      className="text-base font-medium text-foreground hover:underline"
                    >
                      contact@uprevit.com
                    </Link>
                    <p className="text-sm text-muted-foreground mt-3">
                      Typical response time: within 1 business day.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/70">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <PiChatTextDuotone className="h-5 w-5 text-primary" />
                      Follow our updates
                    </CardTitle>
                    <CardDescription>
                      Product updates, regulatory insights, and compliance news.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      <Link
                        href="https://x.com/uprevit"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <FaXTwitter className="h-5 w-5" />
                        <span>x.com/uprevit</span>
                      </Link>
                      <Link
                        href="https://linkedin.com/company/uprevit"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <FaLinkedin className="h-5 w-5" />
                        <span>linkedin.com/company/uprevit</span>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/70 bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <PiClockClockwiseDuotone className="h-5 w-5 text-primary" />
                      Support hours
                    </CardTitle>
                    <CardDescription>Mon - Fri, 9:00am - 6:00pm IST</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <PiMapPinDuotone className="h-4 w-4 mt-0.5" />
                      <span>Serving medical device teams across North America, EU, and APAC.</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-border/70 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Send a message</CardTitle>
                  <CardDescription>
                    Tell us about your organization, project scope, and timeline.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="contact-name">Name</Label>
                        <Input id="contact-name" placeholder="Your full name" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="contact-nation">Nation</Label>
                        <Input id="contact-nation" placeholder="Country or region" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-email">Email ID</Label>
                      <Input id="contact-email" type="email" placeholder="you@company.com" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-subject">Subject</Label>
                      <Input id="contact-subject" placeholder="Compliance, pricing, integrations" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-message">Message</Label>
                      <Textarea
                        id="contact-message"
                        rows={6}
                        className="resize-none"
                        placeholder="Share goals, timelines, and any constraints you want us to know."
                      />
                    </div>
                    <Button className="w-full" type="submit">
                      Send message
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      By submitting, you agree to receive replies about your request.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 mt-20">
            <div className="flex flex-col items-center text-center mb-10">
              <Badge variant={badgeVariant} className="mb-6 z-60 dark:px-2 dark:py-0.5">
                <PiQuestionDuotone className="mr-1 text-foreground/50" />
                <span className="font-medium">FAQ</span>
              </Badge>
              <h2 className="text-3xl md:text-4xl font-medium">Contact FAQ</h2>
              <p className="text-muted-foreground mt-3 max-w-2xl">
                Quick answers before you reach out.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible defaultValue="item-0">
                {contactFAQs.map((faq, index) => (
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
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_60%)]" />
              <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="max-w-2xl">
                  <h2 className="text-3xl md:text-4xl font-semibold">
                    Ready to talk compliance and labeling?
                  </h2>
                  <p className="mt-3 text-background/70">
                    Book a demo to see how Uprevit streamlines labeling governance for regulated teams.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="secondary" className="text-foreground">
                    Book a demo
                    <PiArrowRightDuotone className="ml-2 h-4 w-4" />
                  </Button>
                  <Link href="/pricing">
                    <Button variant="outline" className="border-background/40 text-background">
                      View pricing
                    </Button>
                  </Link>
                </div>
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
