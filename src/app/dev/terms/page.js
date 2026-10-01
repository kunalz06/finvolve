import {
  ChevronLeft,
  Cloud,
  CreditCard,
  FileText,
  Mail,
  Scale,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { SUPPORT_EMAIL, SUPPORT_EMAIL_HREF } from "@/lib/site-contact";

const sections = [
  { id: "introduction", label: "Introduction" },
  { id: "services", label: "Services" },
  { id: "payments", label: "Quick Start & Payments" },
  { id: "subscriptions", label: "Cloud Subscriptions" },
  { id: "rent-services", label: "Cloud Rent Services" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "liability", label: "Liability" },
  { id: "contact", label: "Contact" },
];

function TermsSection({ id, title, icon: Icon, children }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-[var(--border-soft)] pt-8 first:border-0 first:pt-0">
      <div className="mb-4 flex items-start gap-3">
        <span className="glass-icon-plate flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
          <Icon size={19} className="text-primary" aria-hidden="true" />
        </span>
        <div>
          <p className="font-code-brand text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
            Terms
          </p>
          <h2 className="mt-1 text-xl font-black tracking-[-0.025em] text-[var(--heading)] sm:text-2xl">
            {title}
          </h2>
        </div>
      </div>
      <div className="space-y-4 text-[var(--foreground)]">{children}</div>
    </section>
  );
}

function PolicyPanel({ children }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-5 sm:p-6">
      {children}
    </div>
  );
}

export default function Terms() {
  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <div className="container mx-auto max-w-6xl">
        <Link
          href="/dev"
          className="mb-6 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-[var(--muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--heading)] sm:mb-8"
        >
          <ChevronLeft size={17} aria-hidden="true" />
          Back to Home
        </Link>

        <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:items-start">
          <aside className="lg:sticky lg:top-28">
            <nav
              aria-label="Terms sections"
              className="glass-surface-strong rounded-2xl border border-[var(--border-soft)] p-3 shadow-[var(--shadow-soft)]"
            >
              <p className="px-3 pb-2 pt-1 text-xs font-black uppercase tracking-[0.14em] text-[var(--muted)]">
                On this page
              </p>
              <div className="grid grid-cols-2 gap-1 sm:grid-cols-4 lg:grid-cols-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="rounded-lg px-3 py-2.5 text-sm font-semibold leading-5 text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--heading)] focus-visible:bg-[var(--surface-muted)]"
                  >
                    {section.label}
                  </a>
                ))}
              </div>
            </nav>
          </aside>

          <main className="glass-surface-strong overflow-hidden rounded-[24px] border border-[var(--border-soft)] shadow-[var(--shadow-soft)]">
            <header className="border-b border-[var(--border-soft)] bg-[var(--surface-muted)] px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="glass-icon-plate flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl">
                  <FileText className="text-primary" size={27} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="font-code-brand text-xs font-black uppercase tracking-[0.16em] text-primary">
                    Legal
                  </p>
                  <h1 className="mt-1 text-3xl font-black tracking-[-0.04em] text-[var(--heading)] sm:text-4xl">
                    Terms of Service
                  </h1>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Last updated: October 1, 2026
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 text-sm leading-6 text-[var(--foreground)]">
                <strong className="text-[var(--heading)]">Rental billing at a glance:</strong>{" "}
                Cloud Rent is billed from actual recorded compute usage at ₹10 per hour. The
                ₹200 / 20-hour figure is a reference rate only, not a minimum charge or billing
                block.
              </div>
            </header>

            <div className="space-y-10 px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
              <TermsSection id="introduction" title="1. Introduction" icon={Scale}>
                <p className="leading-7">
                  Welcome to DEV Infinity. By accessing our website or using our services, you
                  agree to these Terms and Conditions. These terms apply to visitors, users,
                  customers, and others who access or use the Service.
                </p>
              </TermsSection>

              <TermsSection id="services" title="2. Services" icon={ShieldCheck}>
                <p className="leading-7">
                  DEV Infinity provides software development services, including web development,
                  mobile application development, and custom software solutions.
                </p>
                <p className="leading-7">
                  DEV Infinity Cloud provides compute resources and AI model APIs. Cloud services
                  are available through subscription plans and pay-per-use rentals, subject to
                  availability, plan-specific limits, and the additional terms below.
                </p>
              </TermsSection>

              <TermsSection id="payments" title="3. Quick Start & Payments" icon={CreditCard}>
                <PolicyPanel>
                  <p className="leading-7">
                    The <strong className="text-[var(--heading)]">Quick Start</strong> option is a
                    paid service for expedited project initiation. Payments are non-refundable
                    once the consultation or development process has commenced.
                  </p>
                  <p className="mt-3 text-sm font-bold text-[var(--heading)]">
                    Refund policy: no refund after the paid service has commenced.
                  </p>
                </PolicyPanel>
              </TermsSection>

              <TermsSection id="subscriptions" title="3A. Cloud Subscription Terms" icon={Cloud}>
                <PolicyPanel>
                  <p className="leading-7">
                    DEV Infinity Cloud subscriptions are billed through the supported payment
                    provider and run for the stated plan cycle. Starter is billed every 15 days;
                    Pro and Enterprise are billed monthly.
                  </p>
                  <ul className="mt-4 list-disc space-y-3 pl-5 leading-7 marker:text-primary">
                    <li>
                      <strong className="text-[var(--heading)]">Usage limits:</strong> Each plan
                      has defined compute-hour and AI model API limits. Usage resets according to
                      the plan billing cycle.
                    </li>
                    <li>
                      <strong className="text-[var(--heading)]">Billing:</strong> Recurring plan
                      fees and applicable one-time setup fees are non-refundable after the service
                      is activated.
                    </li>
                    <li>
                      <strong className="text-[var(--heading)]">Plan changes:</strong> Upgrades or
                      downgrades take effect at the next billing cycle unless stated otherwise.
                    </li>
                    <li>
                      <strong className="text-[var(--heading)]">Pause & resume:</strong> Pausing
                      freezes eligible billing and usage until the subscription is resumed, subject
                      to the subscription duration rules.
                    </li>
                    <li>
                      <strong className="text-[var(--heading)]">Cancellation:</strong> You may
                      cancel according to the plan controls. Access continues through the paid
                      billing period; partial-period refunds are not provided.
                    </li>
                    <li>
                      <strong className="text-[var(--heading)]">Acceptable use:</strong> Cloud
                      resources may not be used for illegal activity, cryptocurrency mining, or
                      resale of API access.
                    </li>
                  </ul>
                </PolicyPanel>
              </TermsSection>

              <TermsSection id="rent-services" title="3B. Cloud Rent Services Terms" icon={Cloud}>
                <PolicyPanel>
                  <p className="leading-7">
                    Cloud Rent provides short-term compute on a pay-per-use basis without creating
                    a recurring subscription.
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                        Actual rate
                      </p>
                      <p className="mt-2 text-lg font-black text-[var(--heading)]">₹10 / hour</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">Based on recorded usage</p>
                    </div>
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                        Reference rate
                      </p>
                      <p className="mt-2 text-lg font-black text-[var(--heading)]">₹200 / 20 hours</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">Not a minimum or billing block</p>
                    </div>
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                        Currency precision
                      </p>
                      <p className="mt-2 text-lg font-black text-[var(--heading)]">Nearest paisa</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">Only the final amount is rounded</p>
                    </div>
                  </div>

                  <ul className="mt-5 list-disc space-y-3 pl-5 leading-7 marker:text-primary">
                    <li>
                      <strong className="text-[var(--heading)]">Upfront fee:</strong> A one-time
                      ₹1 fee is charged before the rental begins and is non-refundable after
                      activation.
                    </li>
                    <li>
                      <strong className="text-[var(--heading)]">Actual-usage billing:</strong>{" "}
                      Your bill equals actual recorded compute hours × ₹10/hour. The 20-hour
                      reference is not a minimum and is not a billing block. Usage is not rounded
                      up to 20 hours, a full hour, or a half-hour increment. Only the resulting INR
                      total is rounded to the nearest paisa.
                    </li>
                    <li>
                      <strong className="text-[var(--heading)]">Examples:</strong> 1.25 hours costs
                      ₹12.50, 5 hours costs ₹50, and 12.5 hours costs ₹125.
                    </li>
                    <li>
                      <strong className="text-[var(--heading)]">Usage bill:</strong> The usage bill
                      is generated after the rental period based on the recorded compute time.
                      Zero recorded usage produces no additional usage charge.
                    </li>
                    <li>
                      <strong className="text-[var(--heading)]">Payment link:</strong> When an
                      amount is due, a detailed bill with a secure DEV Infinity payment portal link
                      is sent to your registered email. The portal link normally expires after 72
                      hours. If an unpaid link is missing or has expired, a fresh link may be issued
                      for the same outstanding bill. A Razorpay SMS link may also be sent as a
                      secondary payment option; the bill only needs to be paid once.
                    </li>
                    <li>
                      <strong className="text-[var(--heading)]">Rental duration:</strong> Available
                      rental periods are 1, 3, 7, 15, or 30 days. A rental expires automatically at
                      the end of the selected duration, and only one active rental is permitted per
                      email address at a time.
                    </li>
                    <li>
                      <strong className="text-[var(--heading)]">No subscription:</strong> Each
                      rental is a standalone engagement with separate activation and usage billing.
                    </li>
                    <li>
                      <strong className="text-[var(--heading)]">Acceptable use:</strong> The same
                      acceptable-use restrictions that apply to Cloud subscriptions also apply to
                      rentals.
                    </li>
                  </ul>
                </PolicyPanel>
              </TermsSection>

              <TermsSection id="intellectual-property" title="4. Intellectual Property" icon={FileText}>
                <p className="leading-7">
                  Unless otherwise agreed in writing, intellectual property rights for custom
                  software developed for a client are transferred upon full payment. DEV Infinity
                  may showcase completed work in its portfolio unless a non-disclosure agreement or
                  other written restriction applies.
                </p>
              </TermsSection>

              <TermsSection id="liability" title="5. Limitation of Liability" icon={ShieldCheck}>
                <p className="leading-7">
                  To the extent permitted by applicable law, DEV Infinity is not liable for
                  indirect, incidental, special, consequential, or punitive damages, including
                  loss of profits, data, use, goodwill, or other intangible losses arising from
                  use of the services.
                </p>
              </TermsSection>

              <TermsSection id="contact" title="6. Contact Us" icon={Mail}>
                <p className="leading-7">
                  Questions about these Terms can be sent to{" "}
                  <a
                    href={SUPPORT_EMAIL_HREF}
                    className="font-bold text-primary underline decoration-current/40 underline-offset-4 hover:decoration-current"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                  .
                </p>
              </TermsSection>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
