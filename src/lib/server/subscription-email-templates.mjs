import { SUBSCRIPTION_TIERS } from './subscription-plans.js';
import { getCanonicalSiteUrl } from './site-url.js';
import { escapeEmailHtml as esc, emailParagraph, emailDetails, emailNotice, emailAction, renderEmailLayout, formatEmailMoney } from './email-layout.mjs';

export const tierNames = {base:'Starter Plan',medium:'Pro Plan',highest:'Enterprise Plan'};
const config = {
  activated:{title:'Welcome to your cloud workspace.',label:'Subscription active'},
  charged:{title:'Your payment is confirmed.',label:'Billing receipt'},
  paused:{title:'Your subscription is paused.',label:'Subscription paused'},
  resumed:{title:'Welcome back to the cloud.',label:'Subscription resumed'},
  cancelled:{title:'Cancellation confirmed.',label:'Subscription cancelled'},
  tier_change:{title:'Your plan update is scheduled.',label:'Plan change'},
};

function getPlanDetails(name) {
  const key = Object.keys(SUBSCRIPTION_TIERS).find(key =>
    [key,SUBSCRIPTION_TIERS[key].name,tierNames[key]].some(value => value.toLowerCase()===String(name).toLowerCase()));
  return key ? SUBSCRIPTION_TIERS[key] : null;
}

export function renderSubscriptionHtml({name,action,planName,subscriptionId,amount,newPlanName}) {
  const plan = getPlanDetails(planName);
  const details=[{label:'Plan',value:planName || 'Cloud'},{label:'Subscription ID',value:subscriptionId || 'N/A'}];
  const selected=config[action] || {title:'Your subscription has been updated.',label:'Subscription update'};
  const site = getCanonicalSiteUrl() || 'https://devsoftware.vercel.app';
  const dashboardUrl=`${site.replace(/\/$/,'')}/dev/cloud/dashboard`;
  const cloudUrl=`${site.replace(/\/$/,'')}/dev/cloud`;
  const hello=`Hi ${esc(name || 'Subscriber')}, `;
  const safePlan=esc(planName || 'Cloud');
  let intro=''; let note='';
  switch(action) {
    case 'activated': {
      intro=`${hello}your ${safePlan} subscription is now active. Your dedicated compute resources and AI model API access are ready for use.`;
      if(plan) {
        details.push({label:'Compute allocation',value:`${plan.computeHours.total} hours / month`});
        const api=plan.apiAccess;
        details.push({label:'AI model APIs',value:[api.freeLLMs?'Free LLMs':'',api.gpt?`GPT (${api.gptHours}h)`:'',api.gemini?`Gemini (${api.geminiHours}h)`:'',api.claude?'Claude':''].filter(Boolean).join(', ')});
      }
      note=emailNotice({title:'Your next step',text:'Open your Cloud Dashboard using your email address to monitor compute usage, review AI API limits and manage your subscription.'});
      break;
    }
    case 'charged':
      intro=`${hello}your renewal payment for ${safePlan} has been successfully processed.`;
      details.unshift({label:'Amount paid',value:amount ? formatEmailMoney(amount) : 'Paid',emphasis:true});
      note=emailNotice({title:'Billing cycle renewed',text:'Your plan benefits have been renewed for the applicable billing cycle. You can track your usage in the Cloud Dashboard.'});
      break;
    case 'paused':
      intro=`${hello}your ${safePlan} subscription has been paused.`;
      details.push({label:'Status',value:'Paused · Billing on hold'});
      note=emailNotice({title:'Your workspace is preserved',text:'Recurring billing is on hold and compute/API usage is frozen. Your account data and workspace configuration are preserved. Resume your subscription from the dashboard when you are ready.',tone:'gold'});
      break;
    case 'resumed':
      intro=`${hello}your ${safePlan} subscription is active again. Your compute and API access have been restored.`;
      details.push({label:'Status',value:'Active · Access restored'});
      note=emailNotice({title:'Access restored',text:'Your compute resources and AI model endpoints are available again. Review the dashboard for your current usage and plan limits.'});
      break;
    case 'cancelled':
      intro=`${hello}your ${safePlan} subscription has been cancelled.`;
      details.push({label:'Future billing',value:'No further recurring charges'});
      note=emailNotice({title:'What happens next',text:'Access continues until the end of your current paid billing cycle. No additional recurring renewal payments will be charged. You can subscribe again from our Cloud page.',tone:'red'});
      break;
    case 'tier_change':
      intro=`${hello}your plan change from ${safePlan} to ${esc(newPlanName || 'Updated Plan')} has been scheduled.`;
      details[0]={label:'Current plan',value:planName || 'Cloud'};
      details.push({label:'New plan',value:newPlanName || 'Updated Plan'},{label:'Effective date',value:'Next billing cycle'});
      note=emailNotice({title:'Your current benefits continue',text:`Your current ${planName || 'Cloud'} benefits remain available through this billing period. The ${newPlanName || 'updated plan'} pricing and resource limits apply from the next billing cycle.`});
      break;
    default: intro=`${hello}your ${safePlan} subscription has been updated.`;
  }
  return renderEmailLayout({title:selected.title,eyebrow:`Cloud services · ${selected.label}`,cloud:true,preheader:`${selected.label} · ${planName || 'Cloud'} · ${subscriptionId || ''}`,
    bodyHtml:emailParagraph(intro)+emailDetails(details,{label:'Subscription details'})+note+emailAction({label:action==='cancelled'?'Explore cloud plans':action==='paused'?'Manage your subscription':'Open cloud dashboard',url:action==='cancelled'?cloudUrl:dashboardUrl}),
  });
}
