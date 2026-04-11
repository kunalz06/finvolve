import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const copyByStatus = {
  success: {
    title: "You are unsubscribed",
    copy: "You will no longer receive DEV♾️ newsletter emails. You can subscribe again anytime from the footer.",
  },
  invalid: {
    title: "This unsubscribe link is invalid",
    copy: "The link may have expired or already been replaced. If you still receive emails, reply to the message and we will help.",
  },
  error: {
    title: "We could not unsubscribe you",
    copy: "Something went wrong while updating your subscription. Please try again from the email link.",
  },
};

export default async function NewsletterUnsubscribePage({ searchParams }) {
  const params = await searchParams;
  const status = params?.status || "success";
  const copy = copyByStatus[status] || copyByStatus.success;

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="container max-w-2xl">
        <Card hover={false} className="glass-surface-strong p-8 text-center md:p-12">
          <p className="glass-chip-strong mb-5 inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            Newsletter
          </p>
          <h1 className="text-3xl font-bold text-slate-950 md:text-5xl">{copy.title}</h1>
          <p className="mx-auto mt-4 max-w-lg text-slate-600">{copy.copy}</p>
          <Button href="/dev" variant="primary" className="mt-8">
            Back to DEV♾️
          </Button>
        </Card>
      </div>
    </div>
  );
}
