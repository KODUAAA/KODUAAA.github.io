# Portfolio Contact API

A small Node.js + Express backend for the contact form on my portfolio. It validates each message on the server, blocks spam, stores the message in PostgreSQL and emails me a notification.

## How it works

```
Browser form ──POST /api/contact──▶ Express
                                     ├─ helmet (security headers), CORS allow-list, 10 KB body limit
                                     ├─ rate limit: 5 messages / 15 min per IP
                                     ├─ honeypot check (bots get a fake "success")
                                     ├─ server-side validation (never trusts the browser)
                                     ├─ INSERT into PostgreSQL (parameterised query)
                                     └─ email notification via Resend (plain text, reply-to = sender)
```

If the email provider is down, the message is still saved and the visitor still sees success. Nothing is lost.

| Endpoint | Purpose |
|---|---|
| `POST /api/contact` | `{ name, email, subject, message }` → `201 { ok, id }`, or `400 { ok:false, errors:{field:msg} }`, or `429` |
| `GET /api/health` | Health check for the host; also reports which store and mailer are active |

## Run locally

```bash
cd server
npm install
npm run dev
```

With no `.env`, messages are saved to `data/messages.jsonl` and notifications are printed to the terminal, so you can test without any accounts. The portfolio, served on `localhost:5500`, sends to `localhost:3000` automatically.

```bash
npm test
```

The 11 tests cover validation, the honeypot, malformed and oversized input, rate limiting, CORS, and the case where email fails after the message is saved.

## Deploy (free)

1. **Database: [Neon](https://neon.tech).** Create a project and copy the connection string. The table is created automatically on first start.
2. **Email: [Resend](https://resend.com).** Sign up with `brightkoduaakwasi@gmail.com` and create an API key. Without a custom domain, Resend can only send to your own address, and that's all this API needs.
3. **Host: [Render](https://render.com).** Click New → Blueprint, choose the repo, and Render reads `render.yaml`. Fill in:
   - `ALLOWED_ORIGINS`: your live portfolio URL, e.g. `https://yourname.netlify.app`
   - `DATABASE_URL`: from Neon
   - `RESEND_API_KEY`: from Resend
4. Put the Render URL into `apiUrl` in `js/data.js` (the second value), then redeploy the site.

Render's free tier sleeps after 15 minutes idle, so the first message after a quiet period can take about 30–60 seconds. The form tells the visitor it's "waking up the server".

## Reading messages

Open the Neon dashboard → SQL Editor:

```sql
SELECT id, created_at, name, email, subject, message
FROM contact_messages
WHERE NOT handled
ORDER BY created_at DESC;

UPDATE contact_messages SET handled = TRUE WHERE id = 1;  -- after replying
```
