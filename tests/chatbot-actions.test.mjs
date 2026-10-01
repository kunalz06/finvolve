import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function loadChatActions() {
  const source = read("src/lib/chat/chat-actions.js")
    .replace(/\bexport\s+/g, "");
  const context = { globalThis: {} };
  vm.runInNewContext(
    source + "\n;globalThis.__exports = { detectNavigationCommand, detectSubscriptionHelpCommand, buildContactAction, buildProjectAction, actionMissingPrompt };",
    context,
  );
  return context.globalThis.__exports;
}

test("navigation prefers the most specific matching destination", () => {
  const { detectNavigationCommand } = loadChatActions();

  assert.equal(
    detectNavigationCommand("take me to the cloud dashboard").href,
    "/dev/cloud/dashboard#manage-subscription",
  );
  assert.equal(
    detectNavigationCommand("show me the cloud plans").href,
    "/dev/cloud#plans",
  );
  assert.equal(
    detectNavigationCommand("show me rent services").href,
    "/dev/cloud#rent-services",
  );
  assert.equal(
    detectNavigationCommand("take me to the subscription terms").href,
    "/dev/terms#subscriptions",
  );
  assert.equal(
    detectNavigationCommand("go to the project request form").href,
    "/dev/request#project-wizard",
  );
  assert.equal(
    detectNavigationCommand("show me the contact form").href,
    "/dev/contact#contact-form",
  );
});

test("cloud subscription requests route to the exact dashboard help area", () => {
  const { detectSubscriptionHelpCommand } = loadChatActions();

  const manage = detectSubscriptionHelpCommand("manage my subscription");
  assert.equal(manage.mode, "manage");
  assert.equal(manage.href, "/dev/cloud/dashboard#manage-subscription");

  const pause = detectSubscriptionHelpCommand("pause my subscription");
  assert.equal(pause.mode, "pause");
  assert.equal(pause.href, "/dev/cloud/dashboard#manage-subscription");

  const plan = detectSubscriptionHelpCommand("change my cloud plan");
  assert.equal(plan.mode, "change_plan");
  assert.equal(plan.href, "/dev/cloud/dashboard#manage-subscription");

  const usage = detectSubscriptionHelpCommand("how much compute have I used");
  assert.equal(usage.mode, "usage");
  assert.equal(usage.href, "/dev/cloud/dashboard#usage");

  const pricing = detectSubscriptionHelpCommand("compare cloud subscription pricing");
  assert.equal(pricing.mode, "plans");
  assert.equal(pricing.href, "/dev/cloud#plans");
});

test("action collection prompts one concrete missing field at a time", () => {
  const { buildProjectAction, buildContactAction, actionMissingPrompt } = loadChatActions();

  assert.match(actionMissingPrompt(buildContactAction({})), /name/i);
  assert.doesNotMatch(actionMissingPrompt(buildContactAction({})), /email, message/i);

  const project = buildProjectAction({
    name: "Kunal",
    email: "kunal@example.com",
    projectType: "Web Platform",
  });
  assert.match(actionMissingPrompt(project), /timeline/i);
  assert.doesNotMatch(actionMissingPrompt(project), /budget, project description/i);
});

test("chat destinations expose stable anchors in the UI", () => {
  assert.match(read("src/app/dev/request/page.js"), /id="project-wizard"/);
  assert.match(read("src/app/dev/contact/page.js"), /id="contact-form"/);
  assert.match(read("src/app/dev/cloud/page.js"), /id="rent-services"/);
  assert.match(read("src/app/dev/cloud/page.js"), /id="cloud-faq"/);
  assert.match(read("src/app/dev/cloud/dashboard/page.js"), /id="usage"/);
  const dashboard = read("src/app/dev/cloud/dashboard/page.js");
  assert.match(dashboard, /id="manage-subscription"/);
  assert.match(dashboard, /window\.location\.hash/);
  assert.match(dashboard, /scrollIntoView/);
});

test("chat UI uses action-oriented copy instead of generic assistant filler", () => {
  const windowSource = read("src/components/chat/ChatWindow.js");
  const repliesSource = read("src/components/chat/QuickReplies.js");
  const actionCardSource = read("src/components/chat/ChatActionCard.js");

  assert.match(windowSource, /Manage my subscription/);
  assert.match(windowSource, /Submit a project brief/);
  assert.match(windowSource, /Message the team/);
  assert.doesNotMatch(windowSource, /Ask a question or give an instruction/);
  assert.doesNotMatch(repliesSource, />Suggested</);
  assert.match(repliesSource, /Popular actions/);
  assert.match(actionCardSource, /confirmLabel/);
});
