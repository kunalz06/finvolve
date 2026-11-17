import { SUPPORT_EMAIL } from '../site-contact.js';

// Plain HTML, not a web app: inline fallbacks remain usable in limited clients.
export const EMAIL_LOGO_URL = 'https://devsoftwareai.live/dev-infinity-email-logo.png';
const MOTIF_URL = 'https://devsoftwareai.live/email-jaali-corner.png';
export const EMAIL_COLORS = Object.freeze({
  navy: '#101b3c', blue: '#214da0', red: '#ae1029', gold: '#b78b35',
  ink: '#222d46', muted: '#58627a', border: '#dce1ec', pale: '#f4f6fb',
});

export function escapeEmailHtml(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

export function emailText(value) {
  return escapeEmailHtml(value).replace(/\r\n?|\n/g, '<br />');
}

export function safeEmailUrl(value) {
  try {
    const url = new URL(String(value ?? ''));
    return ['https:', 'http:'].includes(url.protocol) ? String(value) : '';
  } catch { return ''; }
}

export function renderEmailBrandLogo({ width = 196, cloud = false } = {}) {
  const size = Math.min(320, Math.max(80, Number(width) || 196));
  return `<img class="email-logo" src="${EMAIL_LOGO_URL}" width="${size}" height="${Math.round(size / 4)}" alt="${cloud ? 'DEV Infinity Cloud' : 'DEV Infinity'}" style="display:block;width:${size}px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;" />`;
}

export function ensureEmailBrandLogo(html) {
  if (!html) return html;
  const source = String(html);
  if (/dev-infinity-email-logo\.(?:png|svg)/i.test(source)) return source;
  const brand = `<div style="padding:20px 24px;text-align:left;background:#ffffff;">${renderEmailBrandLogo()}</div>`;
  const bodyTag = source.match(/<body\b[^>]*>/i)?.[0];
  return bodyTag ? source.replace(bodyTag, `${bodyTag}${brand}`) : `${brand}${source}`;
}

export function formatEmailMoney(amount, currency = 'INR') {
  return `${currency} ${Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function emailParagraph(html) {
  return `<p class="email-copy" style="margin:0 0 20px;color:#222d46;font-size:16px;line-height:1.75;overflow-wrap:anywhere;word-break:break-word;">${html}</p>`;
}

// Values are text-only. Rich prose is explicitly composed through emailParagraph.
export function emailDetails(rows, { label = 'Details' } = {}) {
  return `<table class="email-details" aria-label="${escapeEmailHtml(label)}" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:8px 0 24px;table-layout:fixed;">
${rows.map(({ label: rowLabel, value, emphasis = false }) => `<tr>
<th class="email-muted email-rule" scope="row" width="42%" align="left" valign="top" style="width:42%;padding:14px 12px 14px 0;border-bottom:1px solid #dce1ec;color:#58627a;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;font-weight:400;text-align:left;overflow-wrap:anywhere;word-break:break-word;">${escapeEmailHtml(rowLabel)}</th>
<td class="email-ink email-rule" align="right" valign="top" style="padding:14px 0;border-bottom:1px solid #dce1ec;color:#101b3c;font-family:Arial,Helvetica,sans-serif;font-size:${emphasis ? 21 : 15}px;line-height:1.6;font-weight:${emphasis ? 700 : 600};text-align:right;overflow-wrap:anywhere;word-break:break-word;">${escapeEmailHtml(value)}</td>
</tr>`).join('')}
</table>`;
}

export function emailNotice({ title, text, tone = 'blue' }) {
  const color = tone === 'red' ? '#ae1029' : tone === 'gold' ? '#805c13' : '#214da0';
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;"><tr><td class="email-notice" style="padding:16px 18px;border-left:3px solid ${color};background:#f4f6fb;">
<p class="email-ink" style="margin:0 0 6px;color:#101b3c;font-size:14px;line-height:1.6;font-weight:700;">${escapeEmailHtml(title)}</p>
<p class="email-copy" style="margin:0;color:#222d46;font-size:14px;line-height:1.75;overflow-wrap:anywhere;word-break:break-word;">${emailText(text)}</p>
</td></tr></table>`;
}

export function emailAction({ label, url, fallback = true }) {
  const target = safeEmailUrl(url);
  if (!target) return '';
  const href = escapeEmailHtml(target);
  const text = escapeEmailHtml(label);
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 24px;"><tr><td align="left">
<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${href}" style="height:48px;v-text-anchor:middle;width:260px;" arcsize="15%" stroke="f" fillcolor="#ae1029"><w:anchorlock/><center style="color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${text}</center></v:roundrect><![endif]-->
<!--[if !mso]><!--><a class="email-button" href="${href}" style="display:inline-block;box-sizing:border-box;max-width:100%;padding:14px 24px;border:1px solid #ae1029;border-radius:8px;background-color:#ae1029;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:20px;font-weight:700;text-align:center;text-decoration:none;mso-hide:all;">${text}</a><!--<![endif]-->
${fallback ? `<p class="email-muted" style="margin:16px 0 0;color:#58627a;font-size:12px;line-height:1.75;">If the button does not open, copy this link into your browser:<br /><a class="email-link" href="${href}" style="color:#214da0;text-decoration:underline;overflow-wrap:anywhere;word-break:break-all;">${href}</a></p>` : ''}
</td></tr></table>`;
}

export function renderEmailLayout({ title, eyebrow = 'DEV Infinity', preheader, bodyHtml, cloud = false, footerHtml = '' }) {
  const safeTitle = escapeEmailHtml(title);
  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="color-scheme" content="light dark" /><meta name="supported-color-schemes" content="light dark" /><title>${safeTitle}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important}
@media screen and (max-width:600px){.email-gutter{padding:16px 10px!important}.email-pad{padding:24px 20px!important}.email-heading{font-size:28px!important}.email-logo{width:156px!important}.email-decoration-cell{width:56px!important}.email-decoration{width:48px!important}.email-details th,.email-details td{font-size:14px!important}.email-button{display:block!important;width:100%!important}}
@media (prefers-color-scheme:dark){.email-bg{background-color:#090f1e!important}.email-card,.email-header{background-color:#152037!important;border-color:#303d58!important}.email-ink,.email-heading{color:#f5f6fc!important}.email-copy{color:#dfe5f2!important}.email-muted{color:#b1bbd1!important}.email-rule{border-color:#303d58!important}.email-notice{background-color:#1b2944!important}.email-link{color:#a8c2ff!important}.email-eyebrow{color:#e8c374!important}.email-button{background-color:#ae1029!important;color:#ffffff!important}}
[data-ogsc] .email-bg{background-color:#090f1e!important}[data-ogsc] .email-card,[data-ogsc] .email-header{background-color:#152037!important}[data-ogsc] .email-ink,[data-ogsc] .email-heading{color:#f5f6fc!important}[data-ogsc] .email-copy{color:#dfe5f2!important}[data-ogsc] .email-muted{color:#b1bbd1!important}[data-ogsc] .email-notice{background-color:#1b2944!important}[data-ogsc] .email-link{color:#a8c2ff!important}
</style></head>
<body class="email-bg" style="margin:0;padding:0;width:100%;background-color:#f4f6fb;color:#222d46;font-family:Arial,Helvetica,sans-serif;">
<div class="email-preheader" style="display:none;font-size:1px;line-height:1px;color:#f4f6fb;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escapeEmailHtml(preheader || title)}</div>
<table role="presentation" class="email-bg" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f6fb" style="width:100%;background-color:#f4f6fb;"><tr><td class="email-gutter" align="center" style="padding:36px 16px;">
<!--[if mso]><table role="presentation" width="640" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
<table role="presentation" class="email-card" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="width:100%;max-width:640px;background-color:#ffffff;border:1px solid #dce1ec;border-radius:18px;">
<tr><td style="height:3px;background-color:#b78b35;border-radius:18px 18px 0 0;font-size:1px;line-height:3px;" height="3">&nbsp;</td></tr>
<tr><td class="email-header email-pad email-rule" style="padding:28px 32px 24px;border-bottom:1px solid #dce1ec;background-color:#ffffff;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td valign="middle"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td bgcolor="#ffffff" style="padding:8px;background-color:#ffffff;border-radius:8px;">${renderEmailBrandLogo({cloud,width:196})}</td></tr></table></td>
<td class="email-decoration-cell" align="right" valign="middle" width="72"><img class="email-decoration" src="${MOTIF_URL}" width="64" height="64" alt="" role="presentation" style="display:block;width:64px;height:auto;max-width:100%;" /></td>
</tr></table>
</td></tr>
<tr><td class="email-pad" style="padding:32px;">
<p class="email-eyebrow" style="margin:0 0 12px;color:#805c13;font-size:11px;font-weight:700;line-height:1.5;letter-spacing:1.5px;text-transform:uppercase;">${escapeEmailHtml(eyebrow)}</p>
<h1 class="email-heading" style="margin:0 0 24px;color:#101b3c;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.22;font-weight:400;letter-spacing:-.5px;overflow-wrap:anywhere;word-break:break-word;">${safeTitle}</h1>
${bodyHtml}
</td></tr>
<tr><td class="email-pad email-rule" style="padding:24px 32px;border-top:1px solid #dce1ec;">
<p class="email-ink" style="margin:0 0 8px;color:#101b3c;font-size:13px;line-height:1.7;font-weight:700;">DEV Infinity${cloud ? ' Cloud' : ''}</p>
<p class="email-muted" style="margin:0 0 10px;color:#58627a;font-size:13px;line-height:1.7;">Need a hand? <a class="email-link" href="mailto:${escapeEmailHtml(SUPPORT_EMAIL)}" style="color:#214da0;text-decoration:underline;">${escapeEmailHtml(SUPPORT_EMAIL)}</a></p>
${footerHtml}
</td></tr></table>
<!--[if mso]></td></tr></table><![endif]-->
<p class="email-muted" style="margin:20px 0 0;color:#58627a;font-size:11px;line-height:1.7;">Software, cloud &amp; thoughtful engineering.</p>
</td></tr></table></body></html>`;
}
