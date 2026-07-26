"use client";

import { Linkedin02Icon, NewTwitterIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@uprevit/ui/components/common/ThemeToggle";

export default function FooterSection() {
  return (
    <footer className="w-full bg-foreground text-background mt-20 pointer-events-auto z-45">
      <div className="relative max-w-6xl mx-auto py-16 px-2 md:px-2 lg:px-0">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg md:text-xl font-medium text-background/70 mb-0">
                The unified cloud-based platform
              </h3>
              <h3 className="text-lg md:text-xl font-medium text-background/50 mb-12">
                for total labeling governance
              </h3>
            </div>

            <Link
              href="/"
              className="flex items-center gap-4 p-1 rounded hover:bg-background/10 transition-colors"
            >
              <div className="relative flex aspect-square mb-1 size-8 items-center justify-center">
                <Image
                  src="/uprevit-logo-white.svg"
                  alt="Uprevit logo"
                  fill
                  className=""
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-lg text-background font-black">
                  UPREVIT
                </span>
              </div>
            </Link>
          </div>

          {/* Product / Company Column */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-medium text-background/60 mb-6">
              Product / Company
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="text-background/50 hover:text-background transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-background/50 hover:text-background transition-colors"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-background/50 hover:text-background transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-background/50 hover:text-background transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us Column */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-medium text-background/60 mb-6">
              Follow Us
            </h4>
            <ul className="space-y-4 mb-8">
              <li>
                <Link
                  href="https://x.com/uprevit"
                  target="_blank"
                  className="flex items-center gap-2 text-background/50 hover:text-background transition-colors"
                >
                  <Icon icon={NewTwitterIcon} size={16} strokeWidth={2} />
                  <span>x.com</span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://linkedin.com/company/uprevit"
                  target="_blank"
                  className="flex items-center gap-2 text-background/50 hover:text-background transition-colors"
                >
                  <Icon icon={Linkedin02Icon} size={16} strokeWidth={2} />
                  <span>LinkedIn</span>
                </Link>
              </li>
            </ul>
            <ThemeToggle background="dark" />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-background/40">
          <p>© 2025 Uprevit. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            <Link
              href="/cookies"
              className="hover:text-background/60 transition-colors"
            >
              Cookie Settings
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-background/60 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="hover:text-background/60 transition-colors"
            >
              Terms of Services
            </Link>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-px bottom-0 bg-foreground z-30" />
        <div className="absolute top-0 right-0 w-px bottom-0 bg-foreground z-30" />
      </div>
    </footer>
  );
}
