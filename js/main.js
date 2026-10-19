/* =========================================================
   Bright Akwasi Kodua · Portfolio interactions
   ========================================================= */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SITE = window.SITE || {};

  const escapeHTML = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = (id) => `<svg class="icon" aria-hidden="true"><use href="#${id}"/></svg>`;

  /* ---------- Links from config ---------- */
  $$("[data-link]").forEach((el) => {
    const key = el.dataset.link;
    if (key === "email" && SITE.email) el.href = `mailto:${SITE.email}`;
    else if (SITE[key]) el.href = SITE[key];
  });
  $$('[data-text="email"]').forEach((el) => { if (SITE.email) el.textContent = SITE.email; });

  /* ---------- Year + Ghana time ---------- */
  const year = new Date().getFullYear();
  $("#year").textContent = year;
  $("#resume-updated").textContent = year;

  const ghTime = $("#gh-time");
  const tick = () => {
    ghTime.textContent = new Date().toLocaleTimeString("en-GB", { timeZone: "Africa/Accra", hour: "2-digit", minute: "2-digit" }) + " GMT";
  };
  tick();
  setInterval(tick, 30000);

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  const themeBtn = $("#theme-toggle");
  const metaTheme = $('meta[name="theme-color"]');
  const syncThemeUI = () => {
    const isLight = root.getAttribute("data-theme") === "light";
    themeBtn.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
    metaTheme.setAttribute("content", isLight ? "#f4f7fb" : "#060b18");
  };
  syncThemeUI();
  themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    syncThemeUI();
  });

  /* ---------- Mobile menu ---------- */
  const menuBtn = $("#menu-toggle");
  const navLinks = $("#nav-links");
  const setMenu = (open) => {
    navLinks.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  menuBtn.addEventListener("click", () => setMenu(!navLinks.classList.contains("is-open")));
  $$(".nav-link").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  document.addEventListener("click", (e) => {
    if (navLinks.classList.contains("is-open") && !e.target.closest(".nav")) setMenu(false);
  });

  /* ---------- Header state + back to top ---------- */
  const header = $(".site-header");
  const toTop = $("#back-to-top");
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 20);
    toTop.classList.toggle("is-visible", y > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  /* ---------- Render projects ---------- */
  const grid = $("#projects-grid");
  const projects = window.PROJECTS || [];
  grid.innerHTML = projects.map((p) => {
    const linkBtn = (url, label, iconId) => url
      ? `<a class="btn btn-ghost btn-sm" href="${escapeHTML(url)}" target="_blank" rel="noopener">${icon(iconId)} ${label}</a>`
      : `<span class="btn btn-ghost btn-sm" aria-disabled="true" title="Coming soon">${icon(iconId)} ${label}</span>`;
    return `
      <article class="project glass reveal" data-category="${escapeHTML(p.category)}">
        <div class="project-thumb">
          <img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.title)} preview" loading="lazy" decoding="async" width="800" height="500" />
          ${p.badge ? `<span class="project-badge${p.wip ? " wip" : ""}">${escapeHTML(p.badge)}</span>` : ""}
        </div>
        <div class="project-body">
          <h3>${escapeHTML(p.title)}</h3>
          <p class="project-problem"><strong>Problem:</strong> ${escapeHTML(p.problem)}</p>
          <p class="project-desc">${escapeHTML(p.description)}</p>
          <ul class="project-features" aria-label="Key features">
            ${(p.features || []).map((f) => `<li>${icon("i-check")}<span>${escapeHTML(f)}</span></li>`).join("")}
          </ul>
          <ul class="project-tech" aria-label="Technologies used">
            ${(p.tech || []).map((t) => `<li>${escapeHTML(t)}</li>`).join("")}
          </ul>
          <div class="project-links">
            ${linkBtn(p.github, "GitHub", "i-github")}
            ${linkBtn(p.demo, "Live Demo", "i-external")}
          </div>
        </div>
      </article>`;
  }).join("");

  /* ---------- Project filter ---------- */
  $$(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      $$(".filter-btn").forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      $$(".project", grid).forEach((card) => {
        const show = f === "all" || card.dataset.category.split(" ").includes(f);
        card.classList.toggle("is-hidden", !show);
        if (show) card.classList.add("is-visible");
      });
    });
  });

  /* ---------- Render certifications ---------- */
  const certs = window.CERTIFICATIONS || [];
  const statusClass = { Earned: "", Coursework: " course" };
  $("#certs-grid").innerHTML = certs.map((c) => {
    const meta = [["Year", c.year], ["Credential ID", c.credentialId]].filter(([, v]) => v);
    return `
    <article class="cert glass reveal">
      <div class="cert-top">
        <span class="cert-icon">${icon(c.icon || "i-award")}</span>
        <span class="cert-status${statusClass[c.status] ?? " progress"}">${escapeHTML(c.status || "")}</span>
      </div>
      <h3>${escapeHTML(c.name)}</h3>
      <p class="cert-org">${escapeHTML(c.issuer)}</p>
      ${c.detail ? `<p class="cert-detail">${escapeHTML(c.detail)}</p>` : ""}
      ${meta.length ? `<dl class="cert-meta">${meta.map(([k, v]) => `<dt>${k}</dt><dd>${escapeHTML(v)}</dd>`).join("")}</dl>` : ""}
      ${c.verifyUrl ? `<a class="cert-link" href="${escapeHTML(c.verifyUrl)}" target="_blank" rel="noopener">Verify credential ${icon("i-external")}</a>` : ""}
    </article>`;
  }).join("");

  /* ---------- Scroll reveal ---------- */
  const reveals = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // Stagger siblings in the same grid slightly
        const siblings = el.parentElement ? $$(":scope > .reveal", el.parentElement) : [];
        const i = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = `${Math.min(i % 4, 3) * 80}ms`;
        el.classList.add("is-visible");
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Active nav link ---------- */
  const sections = $$("main section[id]");
  const linkFor = (id) => $(`.nav-link[href="#${id}"]`);
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const link = linkFor(entry.target.id);
      if (!link) return; // e.g. Services has no nav item; keep previous highlight
      $$(".nav-link").forEach((a) => { a.classList.remove("is-active"); a.removeAttribute("aria-current"); });
      link.classList.add("is-active");
      link.setAttribute("aria-current", "true");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => navObserver.observe(s));

  /* ---------- Skill card cursor glow ---------- */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    $$(".skill-card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- Hero typed code ---------- */
  const codeEl = $("#typed-code");
  const lines = [
    ['<span class="c">// a quick profile</span>'],
    ['<span class="k">const</span> <span class="f">bright</span> = {'],
    ['  <span class="p">name</span>: <span class="s">"Bright Akwasi Kodua"</span>,'],
    ['  <span class="p">base</span>: <span class="s">"Accra, Ghana"</span>,'],
    ['  <span class="p">degree</span>: <span class="s">"BSc Computer Science, UCC"</span>,'],
    ['  <span class="p">focus</span>: [<span class="s">"software"</span>, <span class="s">"IT"</span>, <span class="s">"security"</span>],'],
    ['  <span class="p">openTo</span>: [<span class="s">"NSS"</span>, <span class="s">"internships"</span>, <span class="s">"remote"</span>],'],
    ['};'],
    [''],
    ['<span class="f">bright</span>.<span class="f">solve</span>(<span class="s">"real-world problems"</span>);']
  ].map((l) => l[0]);

  if (reduceMotion) {
    codeEl.innerHTML = lines.join("\n");
  } else {
    // Type character by character while keeping the syntax-highlight spans intact.
    const full = lines.join("\n");
    let i = 0;
    const step = () => {
      if (i >= full.length) return;
      if (full[i] === "<") i = full.indexOf(">", i) + 1;   // skip whole tag
      else if (full[i] === "&") i = full.indexOf(";", i) + 1;
      else i += full.codePointAt(i) > 0xffff ? 2 : 1;
      codeEl.innerHTML = full.slice(0, i);
      setTimeout(step, full[i - 1] === "\n" ? 140 : 22);
    };
    setTimeout(step, 600);
  }

  /* ---------- Resume download fallback ---------- */
  // If the PDF hasn't been added yet, open the printable resume page instead of a 404.
  $$('a[href$=".pdf"][download]').forEach((a) => {
    a.addEventListener("click", async (e) => {
      if (location.protocol === "file:") return;
      e.preventDefault();
      try {
        const res = await fetch(a.href, { method: "HEAD" });
        if (res.ok) {
          const tmp = document.createElement("a");
          tmp.href = a.href; tmp.download = ""; document.body.appendChild(tmp); tmp.click(); tmp.remove();
          return;
        }
      } catch (err) {}
      window.open("resume.html", "_blank", "noopener");
    });
  });

  /* ---------- Contact form ---------- */
  const form = $("#contact-form");
  const status = $("#form-status");
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const validators = {
    name: (v) => v.trim().length >= 2 || "Please enter your name.",
    email: (v) => emailRe.test(v.trim()) || "Please enter a valid email address.",
    subject: (v) => v.trim().length >= 3 || "Please add a short subject.",
    message: (v) => v.trim().length >= 10 || "Your message should be at least 10 characters."
  };

  const validateField = (input) => {
    const rule = validators[input.name];
    if (!rule) return true;
    const result = rule(input.value);
    const field = input.closest(".field");
    const err = $(".field-error", field);
    const ok = result === true;
    field.classList.toggle("has-error", !ok);
    input.setAttribute("aria-invalid", String(!ok));
    err.textContent = ok ? "" : result;
    return ok;
  };

  $$("input, textarea", form).forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (input.closest(".field")?.classList.contains("has-error")) validateField(input);
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.className = "form-status";
    status.textContent = "";

    const inputs = $$("input[name]:not(.hp), textarea[name]", form);
    const results = inputs.map(validateField);
    if (results.includes(false)) {
      const firstBad = inputs[results.indexOf(false)];
      firstBad.focus();
      status.classList.add("err");
      status.textContent = "Please fix the highlighted fields.";
      return;
    }
    if (form._gotcha.value) return; // bot

    const data = Object.fromEntries(new FormData(form));
    const btn = $('button[type="submit"]', form);

    if (SITE.apiUrl) {
      btn.disabled = true;
      status.textContent = "Sending…";
      // Free hosting sleeps when idle; the first request can take a while to wake it.
      const slowNote = setTimeout(() => { status.textContent = "Sending… (waking up the server, this can take up to a minute)"; }, 4000);
      try {
        const res = await fetch(`${SITE.apiUrl.replace(/\/$/, "")}/api/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
          signal: AbortSignal.timeout(70000)
        });
        const body = await res.json().catch(() => ({}));

        if (res.status === 400 && body.errors) {
          // Show the server's per-field errors next to the matching inputs.
          Object.entries(body.errors).forEach(([name, msg]) => {
            const input = form.elements[name];
            if (!input) return;
            input.closest(".field").classList.add("has-error");
            input.setAttribute("aria-invalid", "true");
            $(".field-error", input.closest(".field")).textContent = msg;
          });
          throw new Error("Please fix the highlighted fields.");
        }
        if (!res.ok) throw new Error(body.error || "Something went wrong.");

        form.reset();
        status.classList.add("ok");
        status.textContent = "Thanks! Your message has been sent. I'll reply soon.";
      } catch (err) {
        status.classList.add("err");
        const fallback = `Something went wrong. Please email me at ${SITE.email}.`;
        status.textContent = err.name === "TimeoutError" || err.name === "TypeError" ? fallback : err.message || fallback;
      } finally {
        clearTimeout(slowNote);
        btn.disabled = false;
      }
    } else {
      // No form backend configured: open the visitor's email client with the message pre-filled.
      const body = `${data.message}\n\n${data.name}\n${data.email}`;
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
      status.classList.add("ok");
      status.textContent = "Opening your email app to send the message…";
    }
  });
})();
