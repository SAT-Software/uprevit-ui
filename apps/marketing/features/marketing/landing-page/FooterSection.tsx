"use client";

import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@uprevit/ui/components/common/ThemeToggle";

export default function FooterSection() {
  return (
    <footer className="w-full bg-black text-background px-6 md:px-20 mt-20 pointer-events-auto z-45">
      <div className="relative max-w-6xl mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-medium text-gray-300 mb-0">
                The unified cloud-based platform
              </h3>
              <h3 className="text-xl font-medium text-gray-500 mb-12">
                for total labeling governance
              </h3>
            </div>

            <Link
              href="/"
              className="flex items-center gap-4 p-1 rounded hover:bg-white/10 transition-colors"
            >
              <div className="relative flex aspect-square mb-1 size-8 items-center justify-center">
                <Image
                  src="/log-no-bg-white.svg"
                  alt="Uprevit logo"
                  fill
                  className=""
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-lg text-white font-black">
                  UPREVIT
                </span>
              </div>
            </Link>
          </div>

          {/* Product / Company Column */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-medium text-gray-400 mb-6">
              Product / Company
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us Column */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-medium text-gray-400 mb-6">
              Follow Us
            </h4>
            <ul className="space-y-4 mb-8">
              <li>
                <Link
                  href="https://x.com/uprevit"
                  target="_blank"
                  className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
                >
                  <FaXTwitter className="w-4 h-4" />
                  <span>x.com</span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://linkedin.com/company/uprevit"
                  target="_blank"
                  className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
                >
                  <FaLinkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </Link>
              </li>
            </ul>
            <ThemeToggle background="dark" />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-gray-600">
          <p>© 2025 Uprevit. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            <Link
              href="/cookies"
              className="hover:text-gray-400 transition-colors"
            >
              Cookie Settings
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-gray-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="hover:text-gray-400 transition-colors"
            >
              Terms of Services
            </Link>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-px bottom-0 bg-black z-30" />
        <div className="absolute top-0 right-0 w-px bottom-0 bg-black z-30" />
      </div>
    </footer>
  );
}
