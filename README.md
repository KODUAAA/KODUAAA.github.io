# Bright Akwasi Kodua · Portfolio

Personal portfolio of **Bright Akwasi Kodua**, a Computer Science graduate (University of Cape Coast) working across software development, IT and cybersecurity, based in Accra, Ghana.

**Live site:** https://koduaaa.github.io

## What's inside

| Path | What it is |
|---|---|
| `index.html`, `css/`, `js/` | The site: plain HTML, CSS and JavaScript, no framework and no build step |
| `js/data.js` | All editable content: links, projects, certifications |
| `resume.html` | Printable resume; `assets/resume/` holds the PDF version |
| `server/` | Contact-form API: Node.js, Express and PostgreSQL, with validation, rate limiting, a spam honeypot and email notifications ([details](server/README.md)) |
| `render.yaml` | One-click deploy blueprint for the API on Render |

## Features

- Responsive layout, light/dark mode, accessible markup and reduced-motion support
- Project filter, scroll reveal, active navigation and back-to-top
- Contact form with client- and server-side validation

## Run locally

```bash
python -m http.server 5500          # the site at http://localhost:5500
npm --prefix server install
npm --prefix server run dev         # the contact API at http://localhost:3000
npm --prefix server test            # API tests
```
