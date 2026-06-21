"use client";

import Link from "next/link";
import MarketingHeader from "@/features/marketing/marketing-header";
import FooterSection from "@/features/marketing/landing-page/FooterSection";
import { DottedVerticalLines } from "@/features/marketing/landing-page/DottedVerticalLines";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@uprevit/ui/components/ui/card";
// import { Input } from "@uprevit/ui/components/ui/input";
// import { Textarea } from "@uprevit/ui/components/ui/textarea";
// import { Label } from "@uprevit/ui/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@uprevit/ui/components/ui/accordion";
import { useTheme } from "next-themes";
import { FaLinkedin } from "react-icons/fa6";
import {
  PiEnvelopeSimpleDuotone,
  PiClockClockwiseDuotone,
  PiMapPinDuotone,
  PiQuestionDuotone,
  PiChatTextDuotone,
  PiArrowRightDuotone,
  PiEnvelopeOpenDuotone,
} from "react-icons/pi";

const contactFAQs = [
  {
    question: "How quickly will we hear back?",
    answer:
      "We respond within 72 hours. Enterprise and urgent requests are prioritized based on scope.",
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
  const badgeVariant = resolvedTheme === "dark" ? "outline" : "white";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative bg-accent/50">
      <MarketingHeader />
      <div className="relative w-full">
        <DottedVerticalLines />
        <div className="relative z-10 w-full pt-20 md:pt-24">
          <div className="w-full mt-10 mb-20 pointer-events-auto relative">
            <div className="absolute top-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
            <div className="absolute bottom-0 left-0 w-full h-0 border-b border-dashed border-border/80" />

            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
              <div className="max-w-6xl mx-auto mb-10 px-2 md:px-2 lg:px-0">
                <Badge
                  variant={badgeVariant}
                  className="mb-8 z-60 dark:px-2 dark:py-0.5"
                >
                  <PiEnvelopeOpenDuotone />
                  <span className="font-medium">Contact</span>
                </Badge>
                <div className="w-full flex flex-col md:flex-row items-start gap-4">
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-medium">
                    Let&apos;s connect your labeling team with clarity
                  </h1>
                </div>
                <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed">
                  Whether you&apos;re evaluating Uprevit or need help with an
                  ongoing compliance program, our team is ready to help.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
              <div className="absolute bottom-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
              <div className="max-w-6xl mx-auto px-2 md:px-2 lg:px-0">
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 md:gap-4 md:items-stretch">
                    <Card className="flex h-full flex-col border-border/70">
                      <CardHeader className="p-4 pb-3 md:p-5 md:pb-3">
                        <div className="flex flex-row items-start gap-2.5">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-foreground text-background md:size-11 md:rounded-xl">
                            <PiEnvelopeSimpleDuotone className="h-4 w-4 md:h-5 md:w-5" />
                          </div>
                          <div className="flex flex-col">
                            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                              Email us directly
                            </CardTitle>
                            <CardDescription className="text-xs md:text-sm leading-relaxed">
                              We&apos;ll route your request to the right
                              compliance specialist.
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="mt-auto px-4 pb-4 pt-0 md:px-5 md:pb-5">
                        <Link
                          href="mailto:contact@uprevit.com"
                          className="text-sm font-medium text-foreground hover:underline"
                        >
                          contact@uprevit.com
                        </Link>
                        <p className="mt-3 text-xs text-muted-foreground">
                          Typical response time: within 72 hours.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="flex h-full flex-col border-border/70">
                      <CardHeader className="p-4 pb-3 md:p-5 md:pb-3">
                        <div className="flex flex-row items-start gap-2.5">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-foreground text-background md:size-11 md:rounded-xl">
                            <PiChatTextDuotone className="h-4 w-4 md:h-5 md:w-5" />
                          </div>
                          <div className="flex flex-col">
                            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                              Follow our updates
                            </CardTitle>
                            <CardDescription className="text-xs md:text-sm leading-relaxed">
                              Product updates, regulatory insights, and
                              compliance news.
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="mt-auto px-4 pb-4 pt-0 md:px-5 md:pb-5">
                        <Link
                          href="https://linkedin.com/company/uprevit"
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <FaLinkedin className="h-4 w-4 shrink-0" />
                          <span>linkedin.com/company/uprevit</span>
                        </Link>
                      </CardContent>
                    </Card>

                    <Card className="flex h-full flex-col border-border/70">
                      <CardHeader className="p-4 pb-3 md:p-5 md:pb-3">
                        <div className="flex flex-row items-start gap-2.5">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-foreground text-background md:size-11 md:rounded-xl">
                            <PiClockClockwiseDuotone className="h-4 w-4 md:h-5 md:w-5" />
                          </div>
                          <div className="flex flex-col">
                            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                              Support hours
                            </CardTitle>
                            <CardDescription className="text-xs md:text-sm leading-relaxed">
                              Mon - Fri, 9:00am - 6:00pm IST
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="mt-auto px-4 pb-4 pt-0 md:px-5 md:pb-5">
                        <div className="flex items-start gap-2 text-xs text-muted-foreground">
                          <PiMapPinDuotone className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          <span>
                            Serving medical device teams across North America,
                            EU, and APAC.
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  {/* Contact form temporarily disabled until backend integration is ready.
                  <div className="hidden md:block border-dashed border-r border-border" />
                  <Card className="w-full border-border/70 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-2xl">Send a message</CardTitle>
                      <CardDescription>
                        Tell us about your organization, project scope, and
                        timeline.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4" noValidate>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="contact-name">Name</Label>
                            <Input
                              id="contact-name"
                              placeholder="Your full name"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="contact-location">Location</Label>
                            <Input
                              id="contact-location"
                              placeholder="Country or region"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="contact-email">Email ID</Label>
                          <Input
                            id="contact-email"
                            type="email"
                            placeholder="you@company.com"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="contact-subject">Subject</Label>
                          <Input
                            id="contact-subject"
                            placeholder="Compliance, pricing, integrations"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="contact-message">Message</Label>
                          <Textarea
                            id="contact-message"
                            className="resize-none h-24"
                            placeholder="Share goals, timelines, and any constraints you want us to know."
                          />
                        </div>
                        <Button className="w-full" type="submit">
                          Send message
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          By submitting, you agree to receive replies about your
                          request.
                        </p>
                      </form>
                    </CardContent>
                  </Card>
                  */}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
              <div className="absolute bottom-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
              <div className="max-w-6xl mx-auto mt-20 px-2 md:px-2 lg:px-0">
                <div className="flex flex-col items-center text-center mb-10">
                  <Badge
                    variant={badgeVariant}
                    className="mb-6 z-60 dark:px-2 dark:py-0.5"
                  >
                    <PiQuestionDuotone className="mr-1 text-foreground/50" />
                    <span className="font-medium">FAQ</span>
                  </Badge>
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium">
                    Contact FAQ
                  </h2>
                  <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl">
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
            </div>

            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
              <div className="absolute bottom-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
              <div className="max-w-6xl mx-auto mt-20 px-2 md:px-2 lg:px-0">
                <div className="relative overflow-hidden rounded-2xl border bg-foreground dark:bg-background dark:text-foreground text-background">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_60%)]" />
                  <div className="relative p-6 md:p-8 lg:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 h-80">
                    <div className="max-w-2xl">
                      <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold">
                        Ready to talk compliance and labeling?
                      </h2>
                      <p className="mt-3 text-base md:text-lg dark:text-foreground/70 text-background/70">
                        Book a demo to see how Uprevit streamlines labeling
                        governance for regulated teams.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="secondary" className="text-foreground">
                        Book a demo
                        <PiArrowRightDuotone className="ml-2 h-4 w-4" />
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
