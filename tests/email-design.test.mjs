import test from 'node:test';
import assert from 'node:assert/strict';
import { renderNewsletterHtml, renderPaymentLinkHtml, renderProjectRequestAcknowledgementHtml } from '../src/lib/server/email-templates.mjs';
import { renderRentalActivatedHtml, renderRentalBillHtml, renderRentalBillPaidHtml } from '../src/lib/server/rental-email-templates.mjs';
import { renderSubscriptionHtml } from '../src/lib/server/subscription-email-templates.mjs';
import { emailAction, ensureEmailBrandLogo, EMAIL_LOGO_URL } from '../src/lib/server/email-layout.mjs';

const paymentUrl = 'https://payments.example.test/dev/payments?token=a%2Bb&ref=INV-17';
const unsafe = '<img src=x onerror="alert(1)">';
const base = {name:'Aarohan Studio',rentalId:'rent_17',days:3,hoursUsed:1.25,subscriptionId:'sub_17',planName:'Starter',newPlanName:'Pro',amount:200};
const variants = () => [
  renderNewsletterHtml({title:'Studio notes',body:'A useful update.\nNext line.',unsubscribeUrl:'https://example.test/unsubscribe?token=abc%2Bdef'}),
  renderProjectRequestAcknowledgementHtml({name:base.name,projectType:'Web Platform',timeline:4,description:'A customer portal.'}),
  renderPaymentLinkHtml({clientName:base.name,amount:12500.50,paymentUrl,expiresAt:'2026-11-20T09:00:00Z'}),
  renderRentalActivatedHtml({...base,expiresAt:'2026-11-20T09:00:00Z'}),
  renderRentalBillHtml({...base,paymentUrl}), renderRentalBillPaidHtml({...base,totalPaid:12.50}),
  ...['activated','charged','paused','resumed','cancelled','tier_change'].map(action=>renderSubscriptionHtml({...base,action})),
];

test('all twelve email variants share a complete accessible, email-safe document', () => {
  for (const html of variants()) {
    assert.match(html, /^<!doctype html>/i);
    assert.match(html, /<html lang="en"/);
    assert.equal((html.match(/<h1\b/g)||[]).length,1);
    assert.match(html, /role="presentation"/);
    assert.match(html, /email-preheader/);
    assert.match(html, /dev-infinity-email-logo\.png/);
    assert.doesNotMatch(html, /backdrop-filter|<script|<iframe|@import|animation:/i);
    assert.doesNotMatch(html, /#(?:047857|10b981|ecfdf5|059669|5b5cf0|7c5cff)\b/i);
    assert.ok(Buffer.byteLength(html)<60000, 'avoid clipping a normal message');
  }
});

test('newsletter preserves unsubscribe tokens, newlines and escaped content', () => {
  const html=renderNewsletterHtml({title:unsafe,body:'First <b>line</b>\nSecond & final',unsubscribeUrl:paymentUrl});
  assert.ok(html.includes('&lt;img'));
  assert.ok(html.includes('&lt;b&gt;line&lt;/b&gt;'));
  assert.match(html, /First[\s\S]*<br\s*\/?>(?:\s*)Second/);
  assert.ok(html.includes('token=a%2Bb&amp;ref=INV-17'));
  assert.match(html, />Unsubscribe<\/a>/);
  assert.doesNotMatch(html, /<img src=x/);
});

test('payment link preserves amount, token query and India expiry without injecting notes', () => {
  const html=renderPaymentLinkHtml({clientName:unsafe,amount:12500.50,paymentUrl,expiresAt:'2026-11-20T09:00:00Z',notes:unsafe});
  assert.ok(html.includes('12,500.50'));
  assert.ok(html.includes('href="https://payments.example.test/dev/payments?token=a%2Bb&amp;ref=INV-17"'));
  assert.match(html, /20\/11\/2026|20 Nov 2026/);
  assert.ok(html.includes('&lt;img'));
  assert.doesNotMatch(html, /<img src=x/);
});

test('actions reject executable URLs but retain ordinary payment URLs', () => {
  assert.doesNotMatch(emailAction({label:'Pay',url:'javascript:alert(1)'}), /href=/);
  assert.doesNotMatch(emailAction({label:'Pay',url:'data:text/html,evil'}), /href=/);
  assert.match(emailAction({label:'Pay',url:paymentUrl}), /token=a%2Bb&amp;ref=INV-17/);
});

test('rental billing preserves exact fractional usage and only offers payment for positive usage', () => {
  const billed=renderRentalBillHtml({...base,paymentUrl});
  assert.match(billed,/1\.25 hours/);
  assert.match(billed,/12\.50/);
  assert.match(billed,/not a minimum|not a billing block|not a billing slab/i);
  const zero=renderRentalBillHtml({...base,hoursUsed:0,paymentUrl});
  assert.match(zero,/no additional charges/i);
  assert.doesNotMatch(zero,/href="https:\/\/payments\.example/);
});

test('every subscription lifecycle event retains the correct status and destination', () => {
  const content={activated:/now active/,charged:/payment|receipt/i,paused:/paused/i,resumed:/restored|active again/i,cancelled:/cancelled/i,tier_change:/scheduled/i};
  for(const [action,match] of Object.entries(content)) {
    const html=renderSubscriptionHtml({...base,action});
    assert.match(html,match);
    assert.ok(html.includes('sub_17'));
    assert.match(html,action==='cancelled'?/href="https:[^"]*\/dev\/cloud"/:/href="https:[^"]*\/dev\/cloud\/dashboard"/);
    assert.doesNotMatch(html,/next 30 days|current 30-day|monthly renewal/i,'do not misstate Starter billing cycle');
  }
  assert.match(renderSubscriptionHtml({...base,action:'tier_change'}),/Pro/);
});

test('dynamic receipt and project fields are escaped including rental identifiers and usage', () => {
  for(const html of [renderRentalBillPaidHtml({...base,rentalId:unsafe,hoursUsed:unsafe,totalPaid:12.5}),renderProjectRequestAcknowledgementHtml({name:unsafe,projectType:unsafe,timeline:unsafe,description:unsafe}),renderSubscriptionHtml({...base,name:unsafe,subscriptionId:unsafe,action:'activated'})]) {
    assert.doesNotMatch(html,/<img src=x/);
    assert.ok(html.includes('&lt;img'));
  }
});

test('logo fallback is idempotent and recognizes existing branded messages', () => {
  const once=ensureEmailBrandLogo('<html><body><p>Text</p></body></html>');
  assert.ok(once.includes(EMAIL_LOGO_URL));
  assert.equal(ensureEmailBrandLogo(once),once);
  assert.equal(ensureEmailBrandLogo(''), '');
});

test('PNG brand assets have valid dimensions and remain optional to message content', async () => {
  const {readFileSync}=await import('node:fs');
  const logo=readFileSync(new URL('../public/dev-infinity-email-logo.png',import.meta.url));
  assert.equal(logo.subarray(1,4).toString(),'PNG');
  assert.equal(logo.readUInt32BE(16),448);
  assert.equal(logo.readUInt32BE(20),112);
  const html=renderPaymentLinkHtml({clientName:'Aarohan',amount:12.5,paymentUrl}).replace(/<img\b[^>]*>/g,'');
  assert.match(html,/DEV Infinity/);
  assert.match(html,/12\.50/);
  assert.match(html,/Open payment link/);
});

test('delivery retains SMTP envelope and plain-text unsubscribe fallback without a network send', async () => {
  const {readFileSync}=await import('node:fs');
  const {runInNewContext}=await import('node:vm');
  const source=readFileSync(new URL('../src/lib/server/newsletter.js',import.meta.url),'utf8')
    .replace(/^import .*;\n/gm,'').replace(/^export \{.*\} from .*;\n/gm,'').replace(/\bexport\s+/g,'');
  let envelope, config;
  const context={
    process:{env:{NEWSLETTER_SMTP_HOST:'smtp.example.test',NEWSLETTER_SMTP_USER:'sender@example.test',NEWSLETTER_SMTP_PASS:'fixture-not-a-real-password',NEWSLETTER_FROM_EMAIL:'updates@example.test',NEWSLETTER_FROM_NAME:'DEV Infinity',NEWSLETTER_REPLY_TO:'reply@example.test'}},
    nodemailer:{createTransport(value){config=value;return {sendMail(message){envelope=message;return Promise.resolve({messageId:'fixture-only'});}};}},
    SUPPORT_EMAIL:'devsoftwarestudios@gmail.com',ensureEmailBrandLogo,
  };
  runInNewContext(source+'\n globalThis.sendFixture=sendNewsletterMail;',context);
  const result=await context.sendFixture({to:'recipient@example.test',subject:'Keep this subject',text:'Original plain text',html:renderNewsletterHtml({title:'Update',body:'Content',unsubscribeUrl:paymentUrl}),unsubscribeUrl:paymentUrl});
  assert.equal(result.messageId,'fixture-only');
  assert.equal(config.host,'smtp.example.test');
  assert.equal(config.port,465);
  assert.equal(config.secure,true);
  assert.equal(envelope.to,'recipient@example.test');
  assert.equal(envelope.replyTo,'reply@example.test');
  assert.equal(envelope.subject,'Keep this subject');
  assert.equal(envelope.text,`Original plain text\n\nUnsubscribe: ${paymentUrl}`);
  assert.match(envelope.html,/dev-infinity-email-logo\.png/);
});
