/* =========================================================
   CONTENT FILE: edit this to update the site.
   No HTML knowledge needed: change the values, save, refresh.
   ========================================================= */

/* ---------- Your links (used everywhere on the page) ---------- */
window.SITE = {
  linkedin: "https://www.linkedin.com/in/your-profile",   // TODO: [INSERT LINK]
  github: "https://github.com/KODUAAA",
  email: "brightkoduaakwasi@gmail.com",

  // Contact form backend (the Node.js API in /server).
  // Locally it uses the API on port 3000. TODO: after deploying to Render, put its URL in the second value,
  // e.g. "https://bright-portfolio-api.onrender.com". Empty = fall back to opening the visitor's email app.
  apiUrl: ["localhost", "127.0.0.1"].includes(location.hostname) ? "http://localhost:3000" : ""
};

/* ---------- Projects ----------
   To add a project, copy one object below and edit it.
   category: one or more of "web" | "security" | "network" | "data", separated by spaces
             (used by the filter buttons; "network" covers IT, networking and hardware)
   github / demo: leave as "" to show a disabled button.
   badge: optional label on the image. wip: true makes the badge amber.
*/
window.PROJECTS = [
  {
    title: "FEXIWALT: Ecommerce & Classifieds Marketplace",
    category: "web",
    image: "assets/img/projects/marketplace.svg",
    badge: "Live · fexiwalt.com",
    problem: "Buyers and sellers in Ghana need one simple, trustworthy place to trade online, and it has to work well on phones and slow connections.",
    description: "A live ecommerce and classifieds marketplace for Ghana, where people buy and sell phones, vehicles, property, fashion and more. I built and deployed it myself.",
    features: [
      "Category browsing, deal listings and search",
      "WhatsApp-based contact between buyers and sellers",
      "Mobile-first, installable web app with offline support"
    ],
    tech: ["JavaScript", "HTML", "CSS", "Firebase", "PWA"],
    github: "https://github.com/KODUAAA/fexiwalt",
    demo: "https://fexiwalt.com"
  },
  {
    title: "Agoloso Motors: Car Dealership Platform",
    category: "web",
    image: "assets/img/projects/car-dealership.svg",
    badge: "Full-stack",
    problem: "A car dealership needs to show its stock online, and to manage the test drives, enquiries and finance applications that come in, without juggling spreadsheets.",
    description: "A complete full-stack platform built and deployed end to end: a public website where customers browse cars, book test drives and apply for finance, and an admin dashboard for staff.",
    features: [
      "Car search with filters, sorting and shareable URLs, plus a live finance calculator",
      "Admin dashboard: inventory, enquiry inbox and finance applications, with staff and admin roles",
      "Secured with bcrypt passwords, JWT sessions, rate limiting, row-level security and API tests"
    ],
    tech: ["Node.js", "Express", "PostgreSQL", "Supabase", "JavaScript", "JWT"],
    github: "https://github.com/KODUAAA/agoloso-motors",
    demo: ""
  },
  {
    title: "Phishing URL Detection System",
    category: "security data",
    image: "assets/img/projects/phishing-detector.svg",
    badge: "Dissertation · In progress",
    wip: true,
    problem: "Phishing links are the most common way attackers steal passwords, and many users can't tell a fake URL from a real one.",
    description: "My dissertation project: a system that uses machine learning to detect phishing URLs in real time, combining web development with applied security.",
    features: [
      "Extracts features from a URL's structure and domain",
      "Machine-learning model trained to separate phishing from legitimate links",
      "Flask web interface that returns a verdict in real time"
    ],
    tech: ["Python", "Flask", "Machine Learning"],
    github: "",
    demo: ""
  },
  {
    title: "SmartPay Solutions: Network Infrastructure Design",
    category: "network security",
    image: "assets/img/projects/network-design.svg",
    badge: "Class project",
    problem: "A growing fintech company needs a network that keeps payment data separated, encrypted and recoverable after an incident.",
    description: "A complete network security architecture designed for a fintech scenario, covering segmentation, secure connectivity, wireless security and incident response planning.",
    features: [
      "VLAN segmentation with VLSM subnetting",
      "IPsec VPN for secure site-to-site connectivity",
      "WPA3 wireless security and an incident response plan"
    ],
    tech: ["VLANs", "VLSM", "IPsec VPN", "WPA3", "Incident Response"],
    github: "",
    demo: ""
  },
  {
    title: "Security Tools: Network Port Scanner",
    category: "security network",
    image: "assets/img/projects/port-scanner.svg",
    badge: "Built from scratch",
    problem: "To secure a network, you first need to see what's exposed on it.",
    description: "A Python tool written from scratch that scans hosts on a network for open ports and potential vulnerabilities.",
    features: [
      "Scans hosts for open ports and the services behind them",
      "Flags risky exposed services for follow-up",
      "Written without relying on ready-made scanning tools"
    ],
    tech: ["Python", "Sockets", "TCP/IP"],
    github: "",
    demo: ""
  },
  {
    title: "Security Tools: File Integrity Monitor",
    category: "security",
    image: "assets/img/projects/file-integrity.svg",
    badge: "Blue team",
    problem: "Attackers often change system files quietly, and the change can go unnoticed for weeks.",
    description: "A Python tool written from scratch that detects unauthorised changes to files by comparing them against a trusted baseline.",
    features: [
      "Hash-based baseline of the files you want to protect",
      "Flags modified, added and deleted files",
      "Simple report of what changed and when"
    ],
    tech: ["Python", "Hashing", "Monitoring"],
    github: "",
    demo: ""
  },
  {
    title: "Hardware Diagnostics & Repair: HP EliteBook 745 G5",
    category: "network",
    image: "assets/img/projects/laptop-repair.svg",
    badge: "Hands-on IT",
    problem: "A laptop's display stopped working, and replacing the whole machine would have been expensive and unnecessary.",
    description: "Diagnosed a faulty display on an HP EliteBook 745 G5, traced it to the display cable and repaired it, so the laptop returned to full working order.",
    features: [
      "Systematic fault isolation: software, screen panel or connection",
      "Safe disassembly and reassembly",
      "Identified and resolved the display cable fault"
    ],
    tech: ["Hardware Diagnostics", "Troubleshooting", "Repair"],
    github: "",
    demo: ""
  },
  {
    title: "Dream Villa VR",
    category: "web",
    image: "assets/img/projects/dream-villa-vr.svg",
    badge: "WebVR",
    problem: "Clients find it hard to picture a house from flat 2D floor plans.",
    description: "An interactive virtual-reality walkthrough of a modern villa that runs directly in the browser, on desktop, mobile or a VR headset.",
    features: [
      "Furnished villa and compound with a gate, car and a pool with animated water",
      "Animated characters: walking security guards and a dog",
      "Walk around with keyboard and mouse, on a phone, or in a VR headset; nothing to install"
    ],
    tech: ["A-Frame", "WebXR", "JavaScript", "HTML"],
    github: "https://github.com/KODUAAA/Exams",
    demo: "https://pscsc220024.vercel.app"
  },
  {
    title: "A-Frame Solar System",
    category: "web",
    image: "assets/img/projects/dream-villa-vr.svg",
    badge: "WebVR",
    problem: "Planet sizes, orbits and spin are hard to grasp from a flat textbook diagram.",
    description: "An animated 3D solar system in the browser: the Sun, all eight planets and the Moon, each orbiting and spinning at its own speed.",
    features: [
      "Realistic 2K textures for every planet, plus Saturn's transparent ring",
      "Nested orbits: the Moon circles Earth while Earth circles the Sun",
      "Milky Way sky with a slowly rotating star layer"
    ],
    tech: ["A-Frame", "WebXR", "JavaScript", "HTML"],
    github: "https://github.com/KODUAAA/Practical-Quiz-2",
    demo: "https://ps-csc-22-0024-practical-quiz-2.vercel.app"
  },
  {
    title: "Financial Monitor",
    category: "web data",
    image: "assets/img/projects/financial-monitor.svg",
    badge: "Personal finance",
    problem: "It's easy to lose track of where money goes each month.",
    description: "A web app for recording income and expenses, grouping spending by category and seeing a clear summary of personal finances.",
    features: [
      "Log income and expenses by category",
      "Monthly totals and spending breakdown",
      "Clear summaries of personal financial activity"
    ],
    tech: ["JavaScript", "HTML", "CSS"],
    github: "",
    demo: ""
  }
];

/* ---------- Certifications & training ----------
   status: "Earned" | "In progress" | "Coursework" | "Planned"
   Any field left as "" is simply not shown.
*/
window.CERTIFICATIONS = [
  {
    name: "Cybersecurity Internship Certificate",
    issuer: "Thrive Ghana",
    year: "",           // TODO: add year
    credentialId: "",
    verifyUrl: "",
    status: "Earned",
    icon: "i-award"
  },
  {
    name: "Microsoft Office Course",
    issuer: "Alison",
    year: "",           // TODO: add year
    credentialId: "",
    verifyUrl: "",
    status: "Earned",
    icon: "i-layout"
  },
  {
    name: "DIVE+ Programme: From National Service to Career-Ready",
    issuer: "British Council",
    year: "",
    credentialId: "",
    verifyUrl: "",
    status: "In progress",
    icon: "i-briefcase"
  },
  {
    name: "Cryptography & Network Security",
    issuer: "University of Cape Coast · BSc coursework",
    detail: "Classical and modern ciphers, secure communication protocols",
    status: "Coursework",
    icon: "i-shield"
  },
  {
    name: "Networking & Systems Administration",
    issuer: "University of Cape Coast · BSc coursework",
    detail: "VLSM, VLANs, IPsec VPN, WPA3, BCP/DRP, backups, Unix user management",
    status: "Coursework",
    icon: "i-server"
  },
  {
    name: "Software Engineering & Databases",
    issuer: "University of Cape Coast · BSc coursework",
    detail: "Development lifecycle, system design, relational databases and SQL",
    status: "Coursework",
    icon: "i-code"
  }
];
