import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PiImageDuotone } from "react-icons/pi";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const faqs = [
  {
    question: "How do I get started with Uprevit?",
    answer:
      "Sign-up with us & set up a workspace with your organization. Invite your team to start collaborating on your projects, products & departments",
  },
  {
    question: "How does Uprevit assists in label compliance?",
    answer:
      "Uprevit provides a documentation template in compliance with global standards (including EU MDR, FDA UDI, Health Canada, ISO 15223-1 symbols, etc.). , ensuring no label can be finalized or printed until all regional requirements are met, minimizing regulatory feedback cycles",
  },
  {
    question: "How does Uprevit handle version control and change tracking ?",
    answer:
      "We eliminate manual redlining completely. Uprevit provides Perfect Version Control and a comprehensive product phase tracking. Every change event is logged with a time-stamp. Our Automated Redlining feature instantly generates comparison copies against the master version, providing instant, irrefutable proof of compliance",
  },
  {
    question:
      "Can Uprevit integrate with our existing ERP, PLM, or MES systems",
    answer:
      "Currently, Uprevit is designed for seamless data governance & data exports to .pdf and .xls only which allow users to update in their respective ERP, PLM and MES systems. Customer specific integrations are subjective to Client requirements",
  },
  {
    question:
      "Is the system accessible across different devices and locations?",
    answer:
      "As a modern cloud-based SaaS application, Uprevit is entirely browser-based and designed to be fully responsive. Your teams can securely access the platform, collaborate, and manage label documentation from any location ensuring continuity for your global and remote teams",
  },
  {
    question:
      "What level of user access control and collaboration does the platform offer?",
    answer:
      "Uprevit is built for seamless collaboration with robust control. We offer role-based access control (RBAC), allowing you to define precise permissions for every user, team, and department. This ensures only authorized personnel can create, review, or approve specific label actions, maintaining tight security and audit control over the workflow.",
  },
];

export default function FAQSection() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const badgeVariant =
    mounted && resolvedTheme === "dark" ? "outline" : "white";

  return (
    <div className="relative w-full pt-20 mt-40 pb-20 mb-20 pointer-events-auto">
      <div className="max-w-6xl flex flex-col items-center mx-auto mb-8">
        <Badge
          variant={badgeVariant}
          className="mb-8 z-60 dark:px-2 dark:py-0.5"
        >
          <PiImageDuotone className="mr-1 text-foreground/50" />
          <span className="font-medium">FAQ</span>
        </Badge>
        <div className="w-full flex flex-col gap-4 items-center justify-center text-2xl">
          <h2 className="text-5xl font-medium">Frequently Asked Questions</h2>
          <p className="font-semibold text-muted-foreground/60 w-1/3 text-center tracking-tighter leading-tight">
            Find answers to common questions about our product
          </p>
        </div>
      </div>
      <div className="relative w-full max-w-4xl mx-auto">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-0"
        >
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent className="text-balance text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div className="absolute top-0 left-0 w-full h-px bg-border/60" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-border/60" />
      <div className="absolute top-0 left-0 right-0 mx-auto w-full max-w-6xl aspect-2/1 rounded-t-full border border-b-0 border-dashed border-border bg-none pointer-events-none" />
    </div>
  );
}
