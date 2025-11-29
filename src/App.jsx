import React from "react";

// Minimal academic portfolio (React + scoped CSS)
// Fix for crash: duplicate Headshot component identifier & prior TS-only syntax.
// - Kept a single <Headshot/> implementation
// - Cleaned DATA (no duplicate keys)
// - Kept nav labels to satisfy existing tests
// - Section id remains "publications" while heading reads "Research"

// =========================
// Reusable components
// =========================
function driveCandidates(url){
  const m = url && url.match(/\/d\/([^/]+)/);
  const id = m ? m[1] : null;
  return id ? [
    `https://lh3.googleusercontent.com/d/${id}=s800`,
    `https://drive.google.com/uc?export=download&id=${id}`,
    `https://drive.google.com/uc?export=view&id=${id}`,
  ] : [url];
}

function Headshot({ url, name }) {
  const candidates = driveCandidates(url);
  const [idx, setIdx] = React.useState(0);
  const [fallback, setFallback] = React.useState(false);
  const src = candidates[Math.min(idx, candidates.length - 1)];
  if (fallback) {
    return (
      <div className="headshot fallback" aria-label="Avatar fallback">
        {String(name || "").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
      </div>
    );
  }
  return (
    <img
      className="headshot"
      src={src}
      alt={`${name} headshot`}
      onError={() => {
        if (idx < candidates.length - 1) setIdx(idx + 1);
        else setFallback(true);
      }}
    />
  );
}

function ProjectThumb({ url, alt }){
  const candidates = driveCandidates(url);
  const [idx, setIdx] = React.useState(0);
  const src = candidates[Math.min(idx, candidates.length - 1)];
  return (
    <img
      className="proj-thumb"
      src={src}
      alt={alt || 'project thumbnail'}
      onError={() => { if (idx < candidates.length - 1) setIdx(idx + 1); }}
    />
  );
}

// Link behavior fix for sandboxed preview (ensure anchors actually navigate)
function enhanceLinkClicks(){
  if (typeof document === 'undefined') return;
  const handler = function(e){
    const t = e.target;
    // @ts-ignore - optional chaining for old environments
    const a = t && (t.closest ? t.closest('a') : null);
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;
    // In-page anchors: smooth scroll
    if (href.startsWith('#')){
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    // Mailto: allow default client
    if (href.startsWith('mailto:')) return;
    // External links: open explicitly (iframes often block default target behavior)
    e.preventDefault();
    try { window.open(href, '_blank', 'noopener,noreferrer'); } catch {}
  };
  // capture phase to intercept before iframe preview suppresses
  document.addEventListener('click', handler, { capture: true });
}

// =========================
// Editable content
// =========================
const DATA = {
  name: "Aman Arora",
  titleLine: "Research Assistant, TRAIL Lab, University at Buffalo",
  blurb: "",
  intro: [
    <>Currently, I am a <strong>Research Assistant</strong> at the University at Buffalo's <strong>TRAIL Lab</strong>, working under the guidance of <a href="https://www.buffalo.edu/cubs/members.host.html/content/shared/engineering/computer-science-engineering/profiles/faculty/ladder/ratha-nalini.html" target="_blank" rel="noreferrer">Dr. Nalini Ratha</a>. My work lies at the intersection of <em>deep learning, reinforcement learning, and cognitive science</em>, with a primary goal of advancing <em>robotics through causal reasoning and dynamical modeling</em>.</>,
    <>Prior to my current role, I obtained my M.S. from UB, where my thesis explored <em>robotic control for quadrupedal locomotion</em>. My technical background also includes industry experience at <strong>NVIDIA</strong>, where I contributed to the <strong>Ampere and Hopper architectures</strong>, following my B.Tech at <strong>NIT Bhopal</strong>.</>,
  ],
  // Use your Google Drive share link; <Headshot/> will derive a direct image URL
  headshot: "https://drive.google.com/file/d/16SVARaczokcH2TlzPPJ7i49I_fFIYK6_/view?usp=sharing",
  email: "amanaror@buffalo.edu",
  links: [
    { label: "CV", href: "https://drive.google.com/file/d/1HZoyqDhCq9mkB26fhfmxeORycNmmRPnY/view?usp=sharing" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/amanarora012/" },
    { label: "X/Twitter (@mn_roars)", href: "https://x.com/mn_roars" },
    { label: "Email", href: "mailto:amanaror@buffalo.edu" },
  ],
  publications: [
    {
      thumbnail: "https://drive.google.com/file/d/1Tr7DSxaGXjPye5tVuQ0cBOy0VBZNR2Uu/view?usp=sharing",
      title: "Dynamics Aware Quadrupedal Locomotion via Intrinsic Dynamics Head",
      authors: "Aman Arora, Nalini Ratha",
      venue: "ICRA 2026 (submitted)",
      year: 2026,
      abstract:
        "Jointly train an Intrinsic Dynamics (ID) head that models state-to-torque dynamics and use it to define a dynamics reward, yielding smoother, more predictable quadrupedal locomotion.",
      links: [
        { label: "PDF", href: "https://drive.google.com/file/d/1ilrEBdq0uFbdDfPfmxuh_NAE8xCnpokK/view?usp=sharing" },
        { label: "Video", href: "https://drive.google.com/file/d/1Pdmdwzdx3ISgZe7OwYl2m9N9O-oGgrsP/view?usp=sharing" },
      ],
    },
  ],
  // Terrain Interaction lives under Projects (per your request)
  projects: [
    {
      title: "Learning Robust Quadrupedal Locomotion Through Terrain Interaction via Deep Reinforcement Learning",
      thumbnail: "https://drive.google.com/file/d/1ttnWZUAJ2XYGaw-IehB2WCQjKn6lXdE8/view?usp=sharing",
      tags: "RL · Locomotion · Proprioception",
      summary:
        "Proprioception‑only controller that achieves robust locomotion on challenging terrains without predefined gaits, using gait‑agnostic rewards and terrain interaction.",
      links: [
        { label: "PDF", href: "https://drive.google.com/file/d/1_vNUZ2Omf5KVzhon8-uzLRPSu012eqQL/view?usp=sharing" },
        { label: "Video", href: "https://youtu.be/R3Vqfxzi2TE?si=k2mhCQy8lCzmenkW" },
      ],
    },
  ],
};

export default function AmanPortfolio() {
  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = `${DATA.name}`;
    }
    runSmokeTests();
    enhanceLinkClicks();
  }, []);

  const year = new Date().getFullYear();

  return (
    <div style={{ background: "#fff", color: "#111" }}>
      <style>{css}</style>

      <div className="wrap">
        {/* Header */}
        <header>
          <div className="top">
            <h1 id="top">{DATA.name}</h1>
            <nav>
              <a href="#publications">Research</a>
              <a href="#projects">Projects</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>
          <div className="intro">
            <div>
              <p>
                <strong>{DATA.titleLine.split(",")[0]}</strong>, {""}
                {DATA.titleLine.split(",").slice(1).join(",")}
              </p>
              {Array.isArray(DATA.intro) &&
                DATA.intro.map((node, i) => (
                  <p key={i}>{node}</p>
                ))}
              <div className="links">
                {DATA.links.map((l, i) => (
                  <a key={i} href={l.href} target="_blank" rel="noreferrer">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
            <Headshot url={DATA.headshot} name={DATA.name} />
          </div>
        </header>

        {/* Publications */}
        <section id="publications">
          <h2>Research</h2>
          <ul className="list">
            {DATA.publications.map((p, i) => (
              <li key={i}>
                <div style={{display:'grid', gridTemplateColumns:'120px 1fr', gap:8, alignItems:'start'}}>
                  {p.thumbnail ? (
                    <div style={{width:120}}>
                      <ProjectThumb url={p.thumbnail} alt={`${p.title} thumbnail`} />
                    </div>
                  ) : null}
                  <div>
      <div>
                      <strong>{p.title}</strong>
                    </div>
                    <div className="tags">
                      {p.authors} · {p.venue} · {p.year}
                    </div>
                    {p.abstract && (
                      <p className="para" style={{ marginTop: 6 }}>
                        {p.abstract}
                      </p>
                    )}
                    <div className="meta-links" style={{ marginTop: 6 }}>
                      {p.links?.map((l, j) => (
                        <a key={j} href={l.href} target="_blank" rel="noreferrer">
                          {l.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Projects */}
        <section id="projects">
          <h2>Projects</h2>
          <ul className="list">
            {(DATA.projects || []).map((p, i) => (
              <li key={i}>
                <div className="proj">
                  {p.thumbnail ? (
                    <div className="thumb-wrap grid-photo" aria-label="project photo">
                      <ProjectThumb url={p.thumbnail} alt={`${p.title} thumbnail`} />
                    </div>
                  ) : null}
                  <div className="proj-title" aria-label="project title">
                    <strong>{p.title}</strong>
                  </div>
                  <div className="proj-desc" aria-label="project description">
                    {p.tags ? <div className="tags" style={{ marginBottom: 4 }}>{p.tags}</div> : null}
                    {p.summary ? (
                      <p className="para" style={{ marginTop: 0 }}>
                        {p.summary}
                      </p>
                    ) : null}
                  </div>
                  <div className="proj-links" aria-label="project links">
                    {p.links?.length ? (
                      <div className="meta-links">
                        {p.links.map((l, j) => (
                          <a key={j} href={l.href} target="_blank" rel="noreferrer">
                            {l.label}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
      </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section id="contact">
          <h2>Contact</h2>
          <p className="para">
            I'm open to collaborations in <strong>RL theory</strong> and
            <strong> RL‑based learned control</strong>. Email works best.
          </p>
          <p>
            <a href={`mailto:${DATA.email}`}>{DATA.email}</a>
          </p>
        </section>

        {/* Footer */}
        <footer>
          <div>
            © {year} {DATA.name} • Minimal academic layout.
          </div>
        </footer>
      </div>
    </div>
  );
}

// =========================
// CSS (scoped to this component via a <style> tag)
// =========================
const css = `
:root{
  --fg:#111; --muted:#555; --line:#e5e5e5; --bg:#fff; --link:#0a58ca; --max:740px;
}
*{box-sizing:border-box}
.wrap{max-width:var(--max);margin:0 auto;padding:24px}
header{border-bottom:1px solid var(--line);padding-bottom:14px;margin-bottom:24px}
header .top{display:flex;align-items:center;justify-content:space-between;gap:24px}
header h1{font-size:26px;line-height:1.15;margin:0}
nav{font-size:14px;color:var(--muted)}
nav a{color:var(--link);margin-right:12px;text-decoration:none}
nav a:last-child{margin-right:0}
nav a:hover{text-decoration:underline}
.intro{display:grid;grid-template-columns:1fr 160px;gap:18px;align-items:start;margin:18px 0 6px}
.intro p{margin:6px 0}
.intro a{color:var(--link);text-decoration:none}
.intro a:hover{text-decoration:underline}
.links{display:flex;flex-wrap:wrap;gap:10px;font-size:14px;margin-top:6px}
.links a{color:var(--link);text-decoration:none}
.links a::after{content:"·";margin:0 8px;color:var(--muted)}
.links a:last-child::after{content:""}
.links a:hover{text-decoration:underline}
.headshot{width:160px;height:160px;border-radius:10px;object-fit:cover;object-position:50% 25%;border:1px solid rgba(0,0,0,.08);display:block}
.headshot.fallback{display:flex;align-items:center;justify-content:center;background:#f2f2f2;color:#555;font-weight:600;letter-spacing:1px}
h2{font-size:18px;margin:16px 0 8px}
section{padding:6px 0}
.list{list-style:none;padding:0;margin:0}
.list li{padding:8px 0;border-top:1px solid var(--line)}
.list li:first-child{border-top:none}
.tags{font-size:12px;color:var(--muted)}
.meta-links a{margin-right:12px;font-size:14px;color:var(--link)}
footer{border-top:1px solid var(--line);margin-top:26px;padding:12px 0;color:var(--muted);font-size:14px}
/* project layout */
.proj{display:grid;grid-template-columns:120px 1fr;grid-template-rows:auto auto auto;grid-template-areas:
  "photo title"
  "photo desc"
  "photo links";
  gap:8px;align-items:start}
.grid-photo{grid-area:photo}
.proj-title{grid-area:title}
.proj-desc{grid-area:desc}
.proj-links{grid-area:links}
.thumb-wrap{width:120px;height:90px}
.proj-thumb{width:120px;height:90px;object-fit:contain;border:1px solid rgba(0,0,0,.08);border-radius:6px;display:block;background:#fff}
@media (max-width:720px){
  /* Keep two-column layout on mobile */
  .intro{grid-template-columns:1fr 140px}
  .headshot{width:140px;height:140px}
  .proj{grid-template-columns:120px 1fr;grid-template-rows:auto auto auto;grid-template-areas:
    "photo title"
    "photo desc"
    "photo links";
  }
  .thumb-wrap{width:120px;height:90px}
  .proj-thumb{width:120px;height:90px;object-fit:contain}
}
  .thumb-wrap{width:100%;height:auto}
  .proj-thumb{width:100%;height:auto;max-height:none;object-fit:contain}
}
`;

// =========================
// Smoke tests (do NOT change existing checks; add more below)
// =========================
function runSmokeTests(){
  try{
    // existing checks
    const requiredIds = ["top","publications","projects","contact"];
    const missing = requiredIds.filter(id => typeof document !== 'undefined' && !document.getElementById(id));
    console.assert(missing.length === 0, `Missing section ids: ${missing.join(', ')}`);

    const navLinks = typeof document !== 'undefined' ? document.querySelectorAll('header nav a') : { length: 0 };
    console.assert(navLinks.length === 3, `Expected 3 nav links, found ${navLinks.length}`);

    const year = new Date().getFullYear();
    console.assert(year >= 2024, `Year seems off: ${year}`);

    // --- added tests ---
    const pubItems = document.querySelectorAll('#publications .list li').length;
    console.assert(pubItems === DATA.publications.length, `Publications mismatch DOM=${pubItems} vs DATA=${DATA.publications.length}`);

    const projItems = document.querySelectorAll('#projects .list li').length;
    console.assert(projItems === DATA.projects.length, `Projects mismatch DOM=${projItems} vs DATA=${DATA.projects.length}`);

    const headshot = document.querySelector('.headshot');
    console.assert(!!headshot, 'Headshot should render');

    const navText = Array.from(document.querySelectorAll('header nav a')).map(a=>a.textContent?.trim());
    console.assert(JSON.stringify(navText) === JSON.stringify(['Research','Projects','Contact']), `Unexpected nav order: ${navText?.join(', ')}`);

    // Ensure the PDF & Video links are present in Research section
    const pdfLink = Array.from(document.querySelectorAll('#publications a')).some(a => a.textContent?.trim() === 'PDF');
    console.assert(pdfLink, 'Expected a PDF link in Publications');
    const videoLink = Array.from(document.querySelectorAll('#publications a')).some(a => a.textContent?.trim() === 'Video');
    console.assert(videoLink, 'Expected a Video link in Publications');

    // If a research item has a thumbnail, ensure an image rendered
    const researchHasThumb = DATA.publications.some(p => p.thumbnail);
    if (researchHasThumb){
      const img = document.querySelector('#publications .proj-thumb');
      console.assert(!!img, 'Expected a research thumbnail image to render');
    }

    // mailto uses DATA.email
    const mailtoHref = document.querySelector('#contact a[href^="mailto:"]')?.getAttribute('href');
    console.assert(mailtoHref === `mailto:${DATA.email}`, `mailto mismatch: ${mailtoHref} vs mailto:${DATA.email}`);

    // LinkedIn link exists in intro links
    const hasLinkedIn = Array.from(document.querySelectorAll('.links a')).some(a => {
      try { return a.href.includes('linkedin.com/in/amanarora012'); } catch { return false; }
    });
    console.assert(hasLinkedIn, 'Expected LinkedIn link to be present');

    // Authors include both Aman Arora and Nalini Ratha
    const pubText = (document.querySelector('#publications .list li .tags') || {}).textContent || '';
    console.assert(pubText.includes('Aman Arora') && pubText.includes('Nalini Ratha'), 'Authors line should include both Aman Arora and Nalini Ratha');

    // Extra test: if a project has a thumbnail, the image should exist
    const projHasThumb = DATA.projects.some(p => p.thumbnail);
    if (projHasThumb){
      const thumb = document.querySelector('.proj-thumb');
      console.assert(!!thumb, 'Expected a project thumbnail image to render');
    }

    // Extra test: heading text is "Research" while nav still shows "Publications"
    const heading = document.querySelector('#publications h2')?.textContent?.trim();
    console.assert(heading === 'Research', `Expected heading Research, got ${heading}`);

    console.log('[Portfolio Tests] render OK ✅');
  }catch(err){
    console.error('[Portfolio Tests] failed ❌', err);
  }
}