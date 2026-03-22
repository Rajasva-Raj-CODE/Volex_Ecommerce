"use client"

import * as React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

/** Matches reference lime CTA */
const LIME = "#DFFF3F"

function SocialIcon({
  children,
  label,
  href,
}: {
  children: React.ReactNode
  label: string
  href: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:bg-white/15"
    >
      {children}
    </a>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function GooglePlayBadge() {
  return (
    <a
      href="#"
      className="inline-flex min-h-[44px] min-w-[140px] items-center gap-2 rounded-full border border-white/30 bg-white px-3 py-2 text-black transition-opacity hover:opacity-90"
      aria-label="Get it on Google Play"
    >
      <svg className="size-7 shrink-0" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="#EA4335"
          d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92z"
        />
        <path
          fill="#FBBC04"
          d="M20.07 10.477l-4.47-2.598-4.966 4.576 5.02 5.018 4.424-2.575c1.334-.78 1.334-2.748 0-3.527l-.008-.004z"
        />
        <path
          fill="#4285F4"
          d="M3.61 1.814A1.001 1.001 0 0 0 3 2.734v18.532c0 .37.207.71.527.88l11.43-11.43L3.61 1.814z"
        />
        <path
          fill="#34A853"
          d="M15.602 12.428l4.47-2.598c1.334-.778 1.334-2.746 0-3.524l-9.44-5.47 4.97 11.592z"
        />
      </svg>
      <span className="flex flex-col items-start leading-none">
        <span className="text-[0.5rem] font-medium uppercase tracking-wide">
          GET IT ON
        </span>
        <span className="text-sm font-semibold">Google Play</span>
      </span>
    </a>
  )
}

function AppStoreBadge() {
  return (
    <a
      href="#"
      className="inline-flex min-h-[44px] min-w-[140px] items-center gap-2 rounded-full border border-white/30 bg-white px-3 py-2 text-black transition-opacity hover:opacity-90"
      aria-label="Download on the App Store"
    >
      <svg className="size-7 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
      <span className="flex flex-col items-start leading-none">
        <span className="text-[0.5rem] font-medium">Download on the</span>
        <span className="text-sm font-semibold">App Store</span>
      </span>
    </a>
  )
}

/** Muted column links — normal weight, gray */
const linkMuted =
  "text-left text-sm font-normal text-neutral-400 transition-colors hover:text-neutral-200"
/** Secondary row — bold white per reference */
const linkBoldWhite =
  "text-left text-sm font-bold text-white transition-colors hover:text-neutral-200"

export default function FooterSection({ className }: { className?: string }) {
  const [consent, setConsent] = React.useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer
      className={cn(
        "w-full bg-black font-sans text-white antialiased",
        className
      )}
      role="contentinfo"
    >
      <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,30%)_minmax(0,1fr)] lg:gap-x-10 xl:gap-x-14">
          {/* Newsletter — ~30% width on large screens */}
          <div className="w-full min-w-0 text-left">
            <p className="max-w-88 text-base font-bold leading-snug tracking-tight text-white lg:max-w-none">
              Stay in touch with us, get product updates, offers, discounts
              directly to your inbox
            </p>
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
              }}
            >
              <Input
                type="email"
                name="email"
                placeholder="Enter Email Address"
                autoComplete="email"
                className="h-11 rounded-[4px] border border-neutral-500 bg-transparent text-sm text-white placeholder:text-neutral-500 focus-visible:border-neutral-400 focus-visible:ring-1 focus-visible:ring-neutral-500/40"
              />
              <div className="flex gap-2.5">
                <Checkbox
                  id="footer-consent"
                  checked={consent}
                  onCheckedChange={(v) => setConsent(v === true)}
                  className="mt-0.5 size-4 rounded-[2px] border border-white bg-black data-checked:border-white data-checked:bg-white data-checked:text-black"
                />
                <Label
                  htmlFor="footer-consent"
                  className="cursor-pointer text-left text-[10px] leading-snug text-neutral-400 sm:text-[11px]"
                >
                  By selecting this option you agree with our{" "}
                  <Link
                    href="#"
                    className="text-neutral-300 underline-offset-2 hover:underline"
                  >
                    Privacy policy
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="#"
                    className="text-neutral-300 underline-offset-2 hover:underline"
                  >
                    Terms & Conditions
                  </Link>
                </Label>
              </div>
              <Button
                type="submit"
                className="h-11 w-full rounded-full border-0 text-sm font-bold text-black shadow-none hover:opacity-95"
                style={{ backgroundColor: LIME }}
              >
                Subscribe
              </Button>
            </form>
          </div>

          {/* Link grid — top row (headings + gray lists), large gap, bottom row (bold white / policy cols) */}
          <div className="relative min-w-0 text-left">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              <div>
                <h3 className="text-sm font-bold tracking-tight text-white">
                  Categories
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {[
                    "Television",
                    "Smartphone",
                    "Laptops",
                    "Washing Machines",
                    "Party Speakers",
                    "Gaming",
                  ].map((t) => (
                    <li key={t}>
                      <Link href="#" className={linkMuted}>
                        {t}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold tracking-tight text-white">
                  Services
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {[
                    "Cancellation and Return",
                    "Loyalty Program",
                    "VS Warranty",
                    "Enquiries/B2B Orders",
                  ].map((t) => (
                    <li key={t}>
                      <Link href="#" className={linkMuted}>
                        {t}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <h3 className="text-sm font-bold tracking-tight text-white">
                  Trending Products
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {[
                    "iPhone 17",
                    "iPhone 17 Pro",
                    "iPhone 17 Pro Max",
                    "iPhone 17e",
                    "AC",
                    "Air Cooler",
                    "TV",
                    "Smartphone",
                    "Washing Machine",
                  ].map((t) => (
                    <li key={t}>
                      <Link href="#" className={linkMuted}>
                        {t}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-8">
              <ul className="space-y-2.5">
                {[
                  "About us",
                  "Careers",
                  "e-Waste",
                  "Contact",
                  "Blogs",
                  "Order Status",
                ].map((t) => (
                  <li key={t}>
                    <Link href="#" className={linkBoldWhite}>
                      {t}
                    </Link>
                  </li>
                ))}
              </ul>

              <ul className="space-y-2.5">
                {["Help Center", "Shipping & Delivery", "My Account"].map(
                  (t) => (
                    <li key={t}>
                      <Link href="#" className={linkBoldWhite}>
                        {t}
                      </Link>
                    </li>
                  )
                )}
              </ul>

              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 sm:col-span-2 lg:col-span-1">
                <ul className="space-y-2.5">
                  {[
                    "Pricing and Payments",
                    "Store Locator",
                    "Bank Offers",
                  ].map((t) => (
                    <li key={t}>
                      <Link href="#" className={linkMuted}>
                        {t}
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-2.5">
                  {[
                    "Brand Stores",
                    "Terms of Use",
                    "Caution Notice",
                    "Privacy Policy",
                  ].map((t) => (
                    <li key={t}>
                      <Link href="#" className={linkMuted}>
                        {t}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 flex justify-end lg:mt-6">
              <button
                type="button"
                onClick={scrollToTop}
                className="text-lg leading-none text-neutral-500 transition-colors hover:text-neutral-400"
                aria-label="Back to top"
              >
                <span aria-hidden>↑</span>
              </button>
            </div>
          </div>
        </div>

        <div className="my-10 h-px w-full bg-neutral-700" role="separator" />

        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-8">
          <div>
            <p className="text-sm font-medium text-white">Follow us on Socials</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <SocialIcon label="WhatsApp" href="#">
                <WhatsAppIcon />
              </SocialIcon>
              <SocialIcon label="Facebook" href="#">
                <FacebookIcon />
              </SocialIcon>
              <SocialIcon label="X" href="#">
                <XIcon />
              </SocialIcon>
              <SocialIcon label="Instagram" href="#">
                <InstagramIcon />
              </SocialIcon>
              <SocialIcon label="YouTube" href="#">
                <YoutubeIcon />
              </SocialIcon>
              <SocialIcon label="LinkedIn" href="#">
                <LinkedInIcon />
              </SocialIcon>
            </div>
          </div>

          <div className="md:text-right">
            <p className="text-sm font-medium text-white md:mb-4">
              Download The Service App
            </p>
            <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-end">
              <GooglePlayBadge />
              <AppStoreBadge />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
