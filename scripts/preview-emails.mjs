import { mkdir, writeFile, copyFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { createServer } from 'node:http';
import { renderNewsletterHtml, renderPaymentLinkHtml, renderProjectRequestAcknowledgementHtml } from '../src/lib/server/email-templates.mjs';
import { renderRentalActivatedHtml, renderRentalBillHtml, renderRentalBillPaidHtml } from '../src/lib/server/rental-email-templates.mjs';
import { renderSubscriptionHtml } from '../src/lib/server/subscription-email-templates.mjs';
import { escapeEmailHtml } from '../src/lib/server/email-layout.mjs';

const root=dirname(dirname(fileURLToPath(import.meta.url)));
const out=join(root,'docs/email-previews');
const base={name:'Aarohan Studio',rentalId:'rent_preview_17',subscriptionId:'sub_preview_17',days:3,hoursUsed:1.25,planName:'Starter',newPlanName:'Pro',amount:200};
const paymentUrl='https://example.test/dev/payments?token=preview-only&reference=17';
const samples=[
 ['Newsletter',renderNewsletterHtml({title:'A little clarity. A lot of possibility.',body:'Welcome to this month’s studio notes.\n\nWe are refining the tools that help your team build, launch and stay in control. From clearer billing to a calmer cloud dashboard, every detail has a purpose.\n\nThank you for building with DEV Infinity.',unsubscribeUrl:'https://example.test/unsubscribe?token=preview-only'})],
 ['Newsletter welcome',renderNewsletterHtml({title:'Welcome to the studio.',body:'Thanks for subscribing, Aarohan.\n\nYou will now receive product, software and DEV Infinity updates from us.',unsubscribeUrl:'https://example.test/unsubscribe?token=preview-only'})],
 ['Payment link',renderPaymentLinkHtml({clientName:base.name,amount:12500.5,paymentUrl,expiresAt:'2026-11-20T09:00:00Z',notes:'Customer portal · Phase one\nThank you for choosing DEV Infinity.'})],
 ['Project acknowledgement',renderProjectRequestAcknowledgementHtml({name:base.name,projectType:'Web Platform',timeline:4,description:'A customer portal with a clear view of projects, invoices and team activity.'})],
 ['Rental activation',renderRentalActivatedHtml({...base,expiresAt:'2026-11-20T09:00:00Z'})],
 ['Rental usage bill',renderRentalBillHtml({...base,paymentUrl})],
 ['Rental zero usage',renderRentalBillHtml({...base,hoursUsed:0,paymentUrl})],
 ['Rental receipt',renderRentalBillPaidHtml({...base,totalPaid:12.5})],
 ...['activated','charged','paused','resumed','cancelled','tier_change'].map(action=>[`Subscription ${action}`,renderSubscriptionHtml({...base,action})]),
 ['Long content',renderPaymentLinkHtml({clientName:'Aarohan Research and Product Engineering Studio',amount:1234567.89,paymentUrl:`https://example.test/dev/payments?token=${'a'.repeat(180)}`,expiresAt:'2026-11-20T09:00:00Z',notes:'LongUnbrokenProjectReference'.repeat(8)})],
];
await mkdir(join(out,'assets'),{recursive:true});
for(const file of ['dev-infinity-email-logo.png','email-jaali-corner.png']) await copyFile(join(root,'public',file),join(out,'assets',file));
const local=samples.map(([name,html])=>({name,html:html.replaceAll('https://devsoftwareai.live/dev-infinity-email-logo.png','assets/dev-infinity-email-logo.png').replaceAll('https://devsoftwareai.live/email-jaali-corner.png','assets/email-jaali-corner.png')}));
for(let i=0;i<local.length;i++) await writeFile(join(out,`${i+1}.html`),local[i].html);
const payload=JSON.stringify(local).replaceAll('<','\\u003c');
await writeFile(join(out,'index.html'),`<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DEV Infinity email design review</title><style>body{margin:0;background:#e8edf5;color:#101b3c;font:16px Arial,sans-serif}header{padding:24px;position:sticky;top:0;background:#fff;z-index:1;border-bottom:1px solid #dce1ec}h1{margin:0 0 16px;font:28px Georgia,serif}select,button{padding:12px;border:1px solid #8795ad;border-radius:6px;background:#fff;color:#101b3c;font:16px Arial}button{margin-left:12px}main{padding:20px;display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap}iframe{display:block;border:1px solid #b9c4d6;height:1500px;background:#fff}p{color:#58627a;font-size:13px}label{font-size:14px}section{max-width:100%;overflow:auto}</style></head><body><header><h1>Email design review</h1><label for="template">Template </label><select id="template">${local.map((x,i)=>`<option value="${i}">${escapeEmailHtml(x.name)}</option>`).join('')}</select><button id="theme" type="button">Show dark preview</button><p>Fictional data only. Browser previews; not a Gmail or Outlook rendering certification. No email is sent.</p></header><main><section><h2>Desktop · 680px</h2><iframe title="Desktop email preview" id="desktop" width="680" sandbox=""></iframe></section><section><h2>Mobile · 320px</h2><iframe title="Mobile email preview" id="mobile" width="320" sandbox=""></iframe></section></main><script>const samples=${payload};let dark=false;const select=document.getElementById('template');function show(){let html=samples[Number(select.value)].html;html=html.replace('@media (prefers-color-scheme:dark)',dark?'@media all':'@media not all');document.getElementById('desktop').srcdoc=html;document.getElementById('mobile').srcdoc=html;}select.addEventListener('change',show);document.getElementById('theme').addEventListener('click',()=>{dark=!dark;document.getElementById('theme').textContent=dark?'Show light preview':'Show dark preview';show();});show();</script></body></html>`);
console.log(`Rendered ${samples.length} fictional email examples at ${out}`);

if(process.argv.includes('--serve')) {
 const args=process.argv.slice(2);const port=Number(args[args.indexOf('--port')+1])||4173;
 const server=createServer(async(req,res)=>{
   try {
     const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
     const key=pathname==='/'?'index.html':pathname.slice(1);
     if(!/^(?:index\.html|\d+\.html|assets\/(?:dev-infinity-email-logo|email-jaali-corner)\.png)$/.test(key)){res.writeHead(404);res.end('Not found');return;}
     const data=await readFile(join(out,key));res.setHeader('Content-Type',key.endsWith('.png')?'image/png':'text/html; charset=utf-8');res.end(data);
   }catch{res.writeHead(404);res.end('Not found');}
 });server.listen(port,'0.0.0.0',()=>console.log(`Email preview listening on ${port}`));
}
