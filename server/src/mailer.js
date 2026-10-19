// Email notification when a new message arrives.
// Uses Resend's HTTPS API (works on hosts that block SMTP ports). Falls back to console logging.

const formatBody = (msg, id) =>
  [
    `New message from your portfolio (#${id})`,
    "",
    `Name:    ${msg.name}`,
    `Email:   ${msg.email}`,
    `Subject: ${msg.subject}`,
    "",
    msg.message,
    "",
    "Reply directly to this email to answer them."
  ].join("\n");

export const createResendMailer = ({ apiKey, to, from }, fetchImpl = fetch) => ({
  kind: "resend",
  async notify(msg, id) {
    const res = await fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: msg.email,
        subject: `Portfolio: ${msg.subject}`.slice(0, 180),
        text: formatBody(msg, id) // plain text only, so nothing in the message can render as HTML
      }),
      signal: AbortSignal.timeout(10_000)
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
  }
});

export const createConsoleMailer = (log = console.log) => ({
  kind: "console",
  async notify(msg, id) {
    log(`\n--- [email notification, not sent: RESEND_API_KEY not set] ---\n${formatBody(msg, id)}\n---\n`);
  }
});

export const createMailer = (config) => {
  if (config.resendApiKey && config.notifyTo) {
    return createResendMailer({ apiKey: config.resendApiKey, to: config.notifyTo, from: config.notifyFrom });
  }
  return createConsoleMailer();
};
