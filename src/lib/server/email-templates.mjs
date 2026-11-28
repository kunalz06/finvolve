import { escapeEmailHtml as esc, emailText, emailParagraph, emailDetails, emailAction, renderEmailLayout, formatEmailMoney, safeEmailUrl } from './email-layout.mjs';

export function renderNewsletterHtml({ title, body, unsubscribeUrl }) {
  const target = safeEmailUrl(unsubscribeUrl);
  return renderEmailLayout({
    title, eyebrow: 'From the studio', preheader: String(body || '').replace(/\s+/g,' ').slice(0,150),
    bodyHtml: emailParagraph(emailText(body)),
    footerHtml: `<p class="email-muted" style="margin:12px 0 0;color:#58627a;font-size:12px;line-height:1.75;">You are receiving this because you subscribed to DEV Infinity updates.${target ? ` <a class="email-link" href="${esc(target)}" style="color:#214da0;text-decoration:underline;">Unsubscribe</a>` : ''}</p>`,
  });
}

export function renderProjectRequestAcknowledgementHtml({ name, projectType, timeline, description }) {
  const timelineLabel = typeof timeline === 'number' ? `${timeline} weeks` : (timeline || 'To be discussed');
  return renderEmailLayout({
    title: 'Your idea is in good hands.', eyebrow: 'Project request received',
    preheader: 'We have received your project request and will review it before getting back to you.',
    bodyHtml: emailParagraph(`Hi ${esc(name || 'there')}, thank you for sharing your idea. We have received your request and will review it carefully before getting back to you.`)
      + emailDetails([{label:'Project type',value:projectType || 'Your project'},{label:'Timespan',value:timelineLabel}],{label:'Your project request'})
      + `<h2 class="email-ink" style="margin:0 0 10px;color:#101b3c;font-size:16px;line-height:1.5;">Your brief</h2>`
      + emailParagraph(emailText(description))
      + emailParagraph('You do not need to do anything else right now. We will reply from this same email channel.'),
  });
}

export function renderPaymentLinkHtml({ clientName, amount, currency = 'INR', paymentUrl, expiresAt, notes }) {
  const expiry = expiresAt ? new Date(expiresAt).toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}) : 'Soon';
  return renderEmailLayout({
    title: 'Your payment link is ready.', eyebrow: 'Secure payment',
    preheader: `${formatEmailMoney(amount,currency)} · Your secure DEV Infinity payment link is ready.`,
    bodyHtml: emailParagraph(`Hi ${esc(clientName || 'there')}, please use the secure payment link below to complete your payment.`)
      + emailDetails([{label:'Amount due',value:formatEmailMoney(amount,currency),emphasis:true},{label:'Link expires (IST)',value:expiry}],{label:'Payment details'})
      + emailAction({label:'Open payment link',url:paymentUrl})
      + (notes ? `<h2 class="email-ink" style="margin:0 0 8px;color:#101b3c;font-size:16px;line-height:1.5;">Payment note</h2>${emailParagraph(emailText(notes))}` : ''),
  });
}
