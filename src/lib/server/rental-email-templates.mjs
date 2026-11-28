import { RENTAL_CONFIG, getBillBreakdown } from './rental-plans.js';
import { escapeEmailHtml as esc, emailParagraph, emailDetails, emailNotice, emailAction, renderEmailLayout, formatEmailMoney } from './email-layout.mjs';

export function renderRentalActivatedHtml({ name, rentalId, days, expiresAt }) {
  const expires = expiresAt ? new Date(expiresAt).toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}) : 'Not available';
  return renderEmailLayout({
    title:'Your cloud rental is live.', eyebrow:'Cloud rental · Active', cloud:true,
    preheader:`Your ${days}-day cloud rental is active. Usage is billed from actual recorded compute time.`,
    bodyHtml:emailParagraph(`Hi ${esc(name || 'there')}, your compute rental is active. You have ${esc(days)} days of cloud compute access.`)
      + emailDetails([
        {label:'Rental ID',value:rentalId || ''},{label:'Duration',value:`${days} days`},
        {label:'Access expires (IST)',value:expires},{label:'Upfront fee paid',value:formatEmailMoney(RENTAL_CONFIG.upfrontFeeINR)},
        {label:'Usage rate',value:`${formatEmailMoney(RENTAL_CONFIG.hourlyRateINR)} / hour`},
      ],{label:'Rental summary'})
      + emailNotice({title:'Billed from actual usage',text:`After your ${days}-day period ends, your actual compute usage is calculated at INR ${RENTAL_CONFIG.hourlyRateINR}/hour. INR ${RENTAL_CONFIG.computeRateINR} per ${RENTAL_CONFIG.computeHoursPerUnit} hours is a reference rate, not a minimum or billing slab. A detailed bill with a secure payment portal link will be emailed to you.`})
      + emailAction({label:'Explore cloud services',url:'https://devsoftwareai.live/dev/cloud',fallback:false}),
  });
}

export function renderRentalBillHtml({ name, rentalId, days, hoursUsed, billBreakdown, paymentUrl }) {
  const bd = billBreakdown || getBillBreakdown(hoursUsed || 0);
  return renderEmailLayout({
    title:'Your usage bill, clearly laid out.', eyebrow:'Cloud rental · Usage bill', cloud:true,
    preheader:`${formatEmailMoney(bd.totalINR)} due for ${bd.hoursUsed} hours of actual compute usage.`,
    bodyHtml:emailParagraph(`Hi ${esc(name || 'there')}, your ${esc(days)}-day cloud rental has ended. Here is the bill for your actual recorded compute usage.`)
      + emailDetails([
        {label:'Rental ID',value:rentalId || ''},{label:'Rental duration',value:`${days} days`},
        {label:'Compute hours used',value:`${bd.hoursUsed} hours`},
        {label:'Reference rate',value:`${formatEmailMoney(bd.baseRateINR ?? RENTAL_CONFIG.computeRateINR)} / ${bd.baseHours ?? RENTAL_CONFIG.computeHoursPerUnit} hours`},
        {label:'Actual usage rate',value:`${formatEmailMoney(bd.hourlyRateINR ?? RENTAL_CONFIG.hourlyRateINR)} / hour`},
        {label:'Total due',value:formatEmailMoney(bd.totalINR),emphasis:true},
      ],{label:'Compute usage bill'})
      + emailParagraph('The reference rate is not a minimum or billing slab. Your bill is based on actual usage, with only the final amount rounded to the nearest paisa.')
      + (bd.totalINR > 0
        ? emailAction({label:`Pay ${formatEmailMoney(bd.totalINR)}`,url:paymentUrl})
        : emailNotice({title:'No additional charges',text:'No compute usage was recorded during your rental period. You have no additional charges.'})),
  });
}

export function renderRentalBillPaidHtml({ name, rentalId, hoursUsed, totalPaid }) {
  return renderEmailLayout({
    title:'Payment received. All settled.', eyebrow:'Cloud rental · Payment confirmed', cloud:true,
    preheader:`Payment of ${formatEmailMoney(totalPaid)} received for rental ${rentalId || ''}.`,
    bodyHtml:emailParagraph(`Hi ${esc(name || 'there')}, we received your payment for cloud rental ${esc(rentalId || '')}. Your account is fully settled.`)
      + emailDetails([{label:'Rental ID',value:rentalId || ''},{label:'Compute hours used',value:`${hoursUsed || 0} hours`},{label:'Amount paid',value:formatEmailMoney(totalPaid),emphasis:true}],{label:'Payment receipt'})
      + emailParagraph('Thank you for using DEV Infinity Cloud. You can rent again whenever you need compute resources.')
      + emailAction({label:'Explore cloud services',url:'https://devsoftwareai.live/dev/cloud',fallback:false}),
  });
}
