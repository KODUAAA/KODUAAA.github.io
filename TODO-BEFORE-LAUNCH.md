# Portfolio: to-do before sharing with recruiters

Your real details (UCC degree, Kent State deferral, projects, experience, Thrive Ghana certificate, Java/C++) are now on the site and in the resume. Here's what's still missing.

## 1. Links (`js/data.js`, `window.SITE` at the top)
- [ ] `linkedin`: your LinkedIn profile URL
- [ ] `github`: your GitHub profile URL
- [ ] `apiUrl`: after deploying the contact API (step 6), paste its Render URL here.
      Until then, the live contact form opens the visitor's email app, addressed to your Gmail.

## 2. Projects (`js/data.js`, `window.PROJECTS`)
- [ ] Add `github` and `demo` URLs for each project. Empty URLs show a greyed-out button.
      Recruiters for security roles will want to see the code for the scanner, sniffer, FIM and phishing detector.
- [ ] Optional: swap the drawn illustrations in `assets/img/projects/` for real screenshots (16:10, e.g. 1280×800).

**To add a project:** copy one `{ ... }` block in `PROJECTS`, paste it below and edit it.
`category` can hold several values, e.g. `"security data"`.

## 3. Certifications (`js/data.js`, `window.CERTIFICATIONS`)
- [ ] Thrive Ghana certificate: add the `year`, plus `credentialId` and `verifyUrl` if it has them.
- [ ] When you earn a new certificate, add it at the top with `status: "Earned"`.

## 4. Resume
- [ ] Add your LinkedIn and GitHub links in `resume.html` (the two highlighted lines), then regenerate the PDF:
      open `resume.html` in a browser, click **Save as PDF / Print**, set margins to *None*, and save over
      `assets/resume/Bright-Akwasi-Kodua-Resume.pdf`.
- [ ] Your phone number was left off on purpose, because this PDF is public. Add it if you're happy for anyone to see it.
- [ ] After the November 2026 ceremony, change "Completed · Ceremony Nov 2026" to your class and year
      (in `resume.html` and in the Experience section of `index.html`).

## 5. Before deploying
- [ ] In `index.html`, replace `https://example.com/` in `<link rel="canonical">` with your real domain.
- [ ] Optional: for LinkedIn and WhatsApp link previews, export `assets/img/og-image.svg` to a 1200×630 PNG and update the `og:image` tag.
- [ ] Optional: add a professional photo to the About section.
- [ ] After any CSS or JS change, bump `?v=2` → `?v=3` on the three asset links at the top and bottom of `index.html`, so visitors don't get old cached files.

## 6. Contact API (backend in `server/`)
- [ ] Create a free **Neon** database and a free **Resend** API key (sign up with your Gmail).
- [ ] Deploy on **Render** with the `render.yaml` blueprint and fill in `ALLOWED_ORIGINS`, `DATABASE_URL` and `RESEND_API_KEY`.
- [ ] Put the Render URL in `apiUrl` in `js/data.js`, then send yourself a test message from the live site.
Full steps are in `server/README.md`.

## Deploying the site (free)
- **GitHub Pages:** push this folder to a repo named `<username>.github.io`. `index.html` is the home page.
- **Netlify / Vercel:** drag and drop this folder. No build step is needed.
