// Server-side validation for contact messages.
// Mirrors the browser checks in js/main.js, but never trusts them.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const RULES = {
  name: { min: 2, max: 100, label: "Name" },
  email: { min: 6, max: 254, label: "Email" },
  subject: { min: 3, max: 150, label: "Subject" },
  message: { min: 10, max: 5000, label: "Message" }
};

// Strip control characters (keeps \n and \t in the message body) and trim.
const clean = (value, allowNewlines) => {
  const str = typeof value === "string" ? value : "";
  const pattern = allowNewlines ? /[\u0000-\u0008\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g;
  return str.replace(pattern, allowNewlines ? "" : " ").trim();
};

/**
 * @returns {{ ok: true, data: {name,email,subject,message} } | { ok: false, errors: Record<string,string> }}
 */
export const validateContact = (body) => {
  const input = body && typeof body === "object" ? body : {};
  const data = {
    name: clean(input.name, false),
    email: clean(input.email, false).toLowerCase(),
    subject: clean(input.subject, false),
    message: clean(input.message, true)
  };

  const errors = {};
  for (const [field, rule] of Object.entries(RULES)) {
    const value = data[field];
    if (value.length < rule.min) errors[field] = `${rule.label} must be at least ${rule.min} characters.`;
    else if (value.length > rule.max) errors[field] = `${rule.label} must be at most ${rule.max} characters.`;
  }
  if (!errors.email && !EMAIL_RE.test(data.email)) errors.email = "Please enter a valid email address.";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
};

// Bots fill every field, including the hidden one humans never see.
export const isHoneypotTripped = (body) =>
  Boolean(body && typeof body._gotcha === "string" && body._gotcha.trim() !== "");
