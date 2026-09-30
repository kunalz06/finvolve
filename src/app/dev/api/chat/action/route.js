import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { getAdminDb } from "@/lib/firebase-admin";
import { checkRateLimit, getRequestIp } from "@/lib/server/rate-limit";
import { corsJson, corsPreflight } from "@/lib/server/cors";
import {
  renderProjectRequestAcknowledgementHtml,
  sendNewsletterMail,
} from "@/lib/server/newsletter";

const contactSchema = z.object({
  action: z.literal("contact_message"),
  payload: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(255),
    message: z.string().trim().min(8).max(3000),
  }),
});

const projectSchema = z.object({
  action: z.literal("project_request"),
  payload: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(255),
    projectType: z.string().trim().min(2).max(120),
    timeline: z.string().trim().min(1).max(80),
    budget: z.string().trim().min(1).max(80),
    description: z.string().trim().min(10).max(3000),
  }),
});

const schema = z.discriminatedUnion("action", [contactSchema, projectSchema]);

function timelineToWeeks(value) {
  const text = String(value || "").toLowerCase();
  const range = text.match(/(\d+)\s*[-–]\s*(\d+)\s*weeks?/);
  if (range) return Math.max(2, Math.min(24, Number(range[2])));
  const weeks = text.match(/(\d+)\s*weeks?/);
  if (weeks) return Math.max(2, Math.min(24, Number(weeks[1])));
  const months = text.match(/(\d+)\s*months?/);
  if (months) return Math.max(2, Math.min(24, Number(months[1]) * 4));
  return 8;
}

export function OPTIONS(request) {
  return corsPreflight(request);
}

export async function POST(request) {
  const ip = getRequestIp(request);
  const limit = checkRateLimit(`chat-action:${ip}`, {
    windowMs: 60_000,
    maxRequests: 8,
  });

  if (!limit.allowed) {
    return corsJson(request, { error: "Too many assistant actions. Please retry shortly." }, { status: 429 });
  }

  try {
    const json = await request.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return corsJson(
        request,
        { error: "The action details are incomplete.", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const db = getAdminDb();

    if (parsed.data.action === "contact_message") {
      const { name, email, message } = parsed.data.payload;
      const ref = await db.collection("contact_messages").add({
        name,
        email,
        subject: "Message via DEV Infinity Assistant",
        message,
        status: "unread",
        source: "chatbot_action",
        createdAt: FieldValue.serverTimestamp(),
      });

      return corsJson(request, {
        success: true,
        action: "contact_message",
        recordId: ref.id,
        message: "Your message was sent to the DEV Infinity team.",
      });
    }

    const data = parsed.data.payload;
    const requestData = {
      projectType: data.projectType,
      timeline: timelineToWeeks(data.timeline),
      budget: data.budget,
      name: data.name,
      email: data.email,
      description: data.description,
    };

    const requestRef = await db.collection("requests").add({
      ...requestData,
      createdAt: FieldValue.serverTimestamp(),
      status: "new",
      wizardSubmission: false,
      source: "chatbot_action",
      acknowledgementEmailSent: false,
    });

    let emailSent = false;
    try {
      await sendNewsletterMail({
        to: requestData.email,
        subject: "We received your DEV Infinity project request",
        text: `Hi ${requestData.name},\n\nWe received your project request and will review it carefully.\n\nProject type: ${requestData.projectType}\nTimespan: ${requestData.timeline} weeks\n\n${requestData.description}`,
        html: renderProjectRequestAcknowledgementHtml(requestData),
      });
      emailSent = true;
      await requestRef.update({
        acknowledgementEmailSent: true,
        acknowledgementEmailSentAt: FieldValue.serverTimestamp(),
      });
    } catch (mailError) {
      console.error("Chat project acknowledgement email failed:", mailError.message);
      await requestRef.update({
        acknowledgementEmailError: mailError.message || "Acknowledgement email failed.",
      });
    }

    return corsJson(request, {
      success: true,
      action: "project_request",
      recordId: requestRef.id,
      emailSent,
      message: emailSent
        ? "Your project request was submitted and an acknowledgement email was sent."
        : "Your project request was submitted. The acknowledgement email could not be sent.",
    });
  } catch (error) {
    console.error("Chat action failed:", error.message);
    return corsJson(request, { error: "Unable to complete that action right now." }, { status: 500 });
  }
}
