import React, { useState, useEffect, useRef } from "react";
import { SITE_DATA } from "./data/projectData";
import PcbCadViewport3D from "./components/PcbCadViewport3D";
import EngineeringWorkstation from "./components/EngineeringWorkstation";
import "./styles/engineer.css";

function CardBlueprintCanvas({ type }) {
  return (
    <svg viewBox="0 0 400 250" style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <pattern id={`grid-${type}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="rgba(255,159,28,0.16)" />
        </pattern>
      </defs>
      <rect width="400" height="250" fill={`url(#grid-${type})`} />

      {type === "rigidflex" && (
        <g fontFamily="monospace">
          <path d="M55,125 C95,95 110,95 135,125" fill="none" stroke="#ff6a00" strokeWidth="16" opacity="0.85" />
          <path d="M265,125 C290,95 305,95 345,125" fill="none" stroke="#ff6a00" strokeWidth="16" opacity="0.85" />
          <rect x="125" y="60" width="150" height="130" rx="8" fill="#0c1018" stroke="#ff9f1c" strokeWidth="2" />
          <rect x="170" y="95" width="60" height="60" fill="#141c2b" stroke="#00e5ff" strokeWidth="1.8" />
          <text x="200" y="128" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">3D PCB VIEW</text>
        </g>
      )}

      {type === "mcad" && (
        <g fontFamily="monospace">
          <polygon points="200,45 315,95 200,145 85,95" fill="rgba(0,229,255,0.2)" stroke="#00e5ff" strokeWidth="2" />
          <polygon points="200,105 315,155 200,205 85,155" fill="rgba(255,159,28,0.18)" stroke="#ff9f1c" strokeWidth="2" />
          <text x="200" y="98" textAnchor="middle" fill="#fff" fontSize="9.5" fontWeight="700">3D UAV CAD (.SLDASM)</text>
        </g>
      )}

      {type === "lfr" && (
        <g fontFamily="monospace">
          <path d="M90,85 Q200,25 310,85 L290,110 Q200,60 110,110 Z" fill="#101520" stroke="#00e5ff" strokeWidth="2" />
          <rect x="135" y="115" width="130" height="95" rx="6" fill="#0b0e16" stroke="#ff6a00" strokeWidth="2" />
          <text x="200" y="165" textAnchor="middle" fill="#fff" fontSize="9.5" fontWeight="700">16-CH LFR 3D</text>
        </g>
      )}

      {type === "corexy" && (
        <g fontFamily="monospace">
          <rect x="85" y="45" width="230" height="160" fill="none" stroke="#10b981" strokeWidth="2" />
          <line x1="85" y1="125" x2="315" y2="125" stroke="#ff9f1c" strokeWidth="3" />
          <rect x="165" y="95" width="70" height="60" fill="#111722" stroke="#fff" strokeWidth="1.8" />
          <text x="200" y="128" textAnchor="middle" fill="#10b981" fontSize="8.5" fontWeight="700">3D EXTRUDER</text>
        </g>
      )}
    </svg>
  );
}

export default function App() {
  // Starts in 'obsidian' (Altium 3D Render Dark Theme)
  const [theme, setTheme] = useState("obsidian");
  const [promptIdx, setPromptIdx] = useState(0);
  const [typedQ, setTypedQ] = useState("");
  const [typedA, setTypedA] = useState("");
  const [typingStage, setTypingStage] = useState("q");

  const [activeProbe, setActiveProbe] = useState("u2");
  const [activeFilter, setActiveFilter] = useState("All");

  const [selectedProject, setSelectedProject] = useState(null);
  const [modalTab, setModalTab] = useState("overview");
  const [briefOpen, setBriefOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const qvRef = useRef(null);
  const briefRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const currentPrompt = SITE_DATA.prompts[promptIdx];

  useEffect(() => {
    let timer;
    if (typingStage === "q") {
      if (typedQ.length < currentPrompt.q.length) {
        timer = setTimeout(() => {
          setTypedQ(currentPrompt.q.slice(0, typedQ.length + 1));
        }, 34);
      } else {
        timer = setTimeout(() => setTypingStage("a"), 160);
      }
    } else if (typingStage === "a") {
      if (typedA.length < currentPrompt.a.length) {
        timer = setTimeout(() => {
          setTypedA(currentPrompt.a.slice(0, typedA.length + 1));
        }, 26);
      } else {
        setTypingStage("hold");
      }
    } else if (typingStage === "hold") {
      timer = setTimeout(() => {
        setTypedQ("");
        setTypedA("");
        setTypingStage("q");
        setPromptIdx((prev) => (prev + 1) % SITE_DATA.prompts.length);
      }, 3200);
    }
    return () => clearTimeout(timer);
  }, [typedQ, typedA, typingStage, currentPrompt]);

  const cycleNextPrompt = () => {
    setTypedQ("");
    setTypedA("");
    setTypingStage("q");
    setPromptIdx((prev) => (prev + 1) % SITE_DATA.prompts.length);
  };

  useEffect(() => {
    const dlg = qvRef.current;
    if (!dlg) return;
    if (selectedProject && !dlg.open) {
      setModalTab("overview");
      dlg.showModal();
    }
    if (!selectedProject && dlg.open) dlg.close();
  }, [selectedProject]);

  useEffect(() => {
    const dlg = briefRef.current;
    if (!dlg) return;
    if (briefOpen && !dlg.open) dlg.showModal();
    if (!briefOpen && dlg.open) dlg.close();
  }, [briefOpen]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2400);
  };

  const probe = SITE_DATA.probes[activeProbe];
  const categories = ["All", "ECAD & PCB", "3D CAD & Robotics"];
  const filteredProjects =
    activeFilter === "All"
      ? SITE_DATA.projects
      : SITE_DATA.projects.filter((p) => p.category === activeFilter);

  const copyEmail = () => {
    navigator.clipboard.writeText(SITE_DATA.contact.email);
    showToast(`Copied ${SITE_DATA.contact.email}`);
  };

  return (
    <>
      {/* ==================== STICKY HEADER WITH 4 PALETTE OPTIONS ==================== */}
      <header className="site-header">
        <div className="wrap hdr">
          <a href="#top" className="brand">
            <svg className="logo-mark" width="28" height="22" viewBox="0 0 28 22" aria-hidden="true">
              <rect className="lm-body" x="3" y="4" width="22" height="14" rx="1" />
              <rect className="lm-pin" x="6" y="1" width="2" height="3" />
              <rect className="lm-pin" x="13" y="1" width="2" height="3" />
              <rect className="lm-pin" x="20" y="1" width="2" height="3" />
              <rect className="lm-pin" x="6" y="18" width="2" height="3" />
              <rect className="lm-pin" x="13" y="18" width="2" height="3" />
              <rect className="lm-pin" x="20" y="18" width="2" height="3" />
              <circle className="lm-key" cx="7" cy="11" r="1.5" />
            </svg>
            <span>
              <span className="brand__isp">{SITE_DATA.brandPre}</span>
              {SITE_DATA.brandName}
            </span>
          </a>

          <nav className="nav" aria-label="Primary">
            <a href="#projects">Projects</a>
            <a href="#pipeline">3D Pipeline</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="hdr__tools">
            <div className="theme-switch" role="group" aria-label="Theme Switch">
              <button
                type="button"
                aria-pressed={theme === "obsidian"}
                onClick={() => setTheme("obsidian")}
                title="Obsidian & Glowing Amber Dark Theme"
              >
                OBSIDIAN
              </button>
              <button
                type="button"
                aria-pressed={theme === "cyber"}
                onClick={() => setTheme("cyber")}
                title="Cyber Carbon & Laser Cyan Dark Theme"
              >
                CYBER
              </button>
              <button
                type="button"
                aria-pressed={theme === "pcb"}
                onClick={() => setTheme("pcb")}
                title="Midnight Navy & Gold PCB Theme"
              >
                NAVY
              </button>
              <button
                type="button"
                aria-pressed={theme === "sch"}
                onClick={() => setTheme("sch")}
                title="Light CAD Studio Theme"
              >
                LIGHT
              </button>
            </div>

            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={() => setBriefOpen(true)}
            >
              Share a project idea
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        {/* ==================== HERO SECTION ==================== */}
        <section className="hero wrap">
          <div className="hero__grid">
            <div className="hero__left">
              <div className="hero__q-wrap">
                <button
                  type="button"
                  className="hero__q-btn"
                  onClick={cycleNextPrompt}
                >
                  <span>{typedQ}</span>
                  {typingStage === "q" && <span className="tw-cursor" />}
                  <span>↻</span>
                </button>
                <a href={currentPrompt.href} className="link mono">
                  <span>{typedA || "\u00A0"}</span>
                  {typingStage !== "q" && <span className="tw-cursor" />}
                </a>
              </div>

              <h1 className="hero__title">{SITE_DATA.hero.title}</h1>
              <p className="hero__lead">{SITE_DATA.hero.lead}</p>

              <div className="hero__cta">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => setBriefOpen(true)}
                >
                  Start a project
                </button>
                <a href="#projects" className="btn btn--ghost">
                  See projects
                </a>
              </div>

              <div className="status">
                <span className="led" aria-hidden="true" />
                <span>{SITE_DATA.hero.statusText}</span>
              </div>
            </div>

            {/* Right Column: Transparent Dark-Mode 3D Viewer + TP1/TP2/TP3 Tabs + Scope */}
            <div className="probe-col">
              <PcbCadViewport3D
                activeProbe={activeProbe}
                onSelectProbe={setActiveProbe}
              />

              <div className="tp-bar">
                <div className="tp-group" role="tablist">
                  {Object.values(SITE_DATA.probes).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={activeProbe === item.id}
                      className={`tp-btn ${activeProbe === item.id ? "is-active" : ""}`}
                      style={{ "--tp-color": item.color }}
                      onClick={() => setActiveProbe(item.id)}
                    >
                      <span className={`tp-marker--${item.marker}`} />
                      <span>{item.tabLabel}</span>
                    </button>
                  ))}
                </div>
                <span className="mono" style={{ fontSize: "0.71rem", color: "var(--field)" }}>
                  ACTIVE 3D SUBSYSTEM: {probe.ref} ({probe.tp})
                </span>
              </div>

              <div className="probe-deck">
                <div className="probe-card">
                  <div>
                    <h3>{probe.title}</h3>
                    <p>{probe.text}</p>
                  </div>
                  <div className="probe-card__bottom">
                    <div className="probe-file-pills">
                      {probe.files.map((f) => (
                        <span key={f} className="file-pill">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="scope-box" aria-label="Oscilloscope Signal View">
                  <div className="scope-box__top">
                    <span>{probe.scope.ch}</span>
                    <span className="scope-box__trig">{probe.scope.trig}</span>
                  </div>
                  <svg className="scope-box__svg" viewBox="0 0 200 60" preserveAspectRatio="none">
                    <path d={probe.scope.wave1} fill="none" stroke="var(--field)" strokeWidth="1.8" />
                    <path d={probe.scope.wave2} fill="none" stroke="#00e5ff" strokeWidth="1.8" />
                  </svg>
                  <div className="scope-box__bot">
                    <span>
                      {probe.scope.decodePrefix}
                      <strong style={{ color: "#00e5ff" }}>{probe.scope.decodeHex}</strong>
                      {probe.scope.decodeSuffix}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== PROJECTS GRID ==================== */}
        <section id="projects" className="sec wrap">
          <div className="sec__head">
            <h2 className="sec__title">Projects (Click to Inspect 3D Model &amp; BOM)</h2>
            <div className="filters">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className="chip"
                  aria-pressed={activeFilter === cat}
                  onClick={() => setActiveFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid">
            {filteredProjects.map((proj) => (
              <article
                key={proj.id}
                className="card"
                onClick={() => setSelectedProject(proj)}
              >
                <div className="card__cad-viewport">
                  <span className="card__badge">{proj.badge}</span>
                  <span className="card__ext">{proj.ext}</span>
                  <CardBlueprintCanvas type={proj.blueprintType} />
                </div>
                <div className="card__body">
                  <div className="card__meta">
                    <span>{proj.type}</span>
                    <span>{proj.year}</span>
                  </div>
                  <h3 className="card__title">{proj.title}</h3>
                  <p className="card__line">{proj.line}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="stats">
            {SITE_DATA.stats.map((st, i) => (
              <div key={i} className="stat">
                <span className="stat__n">{st.n}</span>
                <span className="stat__l">{st.l}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== SCROLL-DRIVEN 5-STAGE 3D ENGINEERING PIPELINE ==================== */}
        <section id="pipeline" className="sec wrap">
          <div className="sec__head">
            <div>
              <span className="mono" style={{ color: "var(--field)", fontSize: "0.75rem" }}>
                INTERACTIVE 3D HARDWARE LIFECYCLE
              </span>
              <h2 className="sec__title">
                Product Planning → 3D CAD Modeling → PCB Design → Firmware → Final Product
              </h2>
            </div>
          </div>

          <EngineeringWorkstation />
        </section>

        {/* ==================== SERVICES ==================== */}
        <section id="services" className="sec wrap">
          <div className="sec__head">
            <h2 className="sec__title sec__title--minor">Services</h2>
          </div>

          <div className="svc-grid">
            {Object.values(SITE_DATA.probes).map((s) => (
              <div key={s.id} className="svc">
                <span className="svc__ref">
                  {s.ref} · {s.tp}
                </span>
                <h3>{s.title}</h3>
                <p style={{ color: "var(--ink-soft)", fontSize: "0.9rem" }}>{s.text}</p>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => {
                    setActiveProbe(s.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Load {s.ref} 3D model in hero ↑
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== CONTACT (TITLE BLOCK) ==================== */}
        <section id="contact" className="sec wrap">
          <div className="tblock">
            <div className="tblock__main">
              <span className="mono" style={{ color: "var(--field)", fontSize: "0.76rem" }}>
                TITLE BLOCK · {SITE_DATA.sheetFile} · REV {SITE_DATA.sheetRev}
              </span>
              <h2>Have a hardware prototype that needs building?</h2>
              <p style={{ color: "var(--ink-soft)" }}>
                Send over your block diagram, rough 2D sketch, or circuit requirements.
              </p>
              <div>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => setBriefOpen(true)}
                >
                  Share a project idea
                </button>
              </div>
            </div>

            <div className="tblock__cells">
              <div className="tblock__cell">
                <span className="tblock__k">Direct Email</span>
                <div className="tblock__v">
                  <span>{SITE_DATA.contact.email}</span>
                  <button type="button" className="copy-btn" onClick={copyEmail}>
                    Copy
                  </button>
                </div>
              </div>
              <div className="tblock__cell">
                <span className="tblock__k">Location</span>
                <div className="tblock__v">{SITE_DATA.contact.location}</div>
              </div>
              <div className="tblock__cell">
                <span className="tblock__k">Status (D1)</span>
                <div className="tblock__v">{SITE_DATA.contact.status}</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="site-footer">
        <div className="wrap ftr">
          <a href="#top" className="brand">
            <span>
              <span className="brand__isp">{SITE_DATA.brandPre}</span>
              {SITE_DATA.brandName}
            </span>
          </a>
          <div className="ftr__links">
            <a href="#projects">Projects</a>
            <a href="#pipeline">3D Pipeline</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="ftr__silk">
            <span>3D ECAD &amp; MCAD PORTFOLIO · REV 2026</span>
            <span>REAL-TIME 3D PCB &amp; CAD MODELS</span>
          </div>
        </div>
      </footer>

      {/* ==================== QUICK VIEW MODAL WITH TRANSPARENT 3D MODEL + BOM ==================== */}
      <dialog ref={qvRef} className="dlg" onClose={() => setSelectedProject(null)}>
        {selectedProject && (
          <>
            <button
              type="button"
              className="dlg__close"
              onClick={() => setSelectedProject(null)}
            >
              ✕
            </button>
            <div className="qv">
              <div className="qv__media">
                <iframe
                  title={selectedProject.title}
                  src={`https://sketchfab.com/models/${selectedProject.sketchfabUid}/embed?autostart=1&transparent=1&ui_theme=dark&dnt=1&internal=1&tracking=0&ui_infos=0&ui_watermark=0`}
                  style={{ width: "100%", height: "100%", minHeight: "380px", border: 0, background: "transparent" }}
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                />
              </div>

              <div className="qv__info">
                <div className="mono" style={{ color: "var(--field)", fontSize: "0.75rem" }}>
                  {selectedProject.ext} · {selectedProject.year}
                </div>
                <h2>{selectedProject.title}</h2>
                <p style={{ color: "var(--ink-soft)", fontSize: "0.9rem" }}>
                  {selectedProject.summary}
                </p>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    className="chip"
                    aria-pressed={modalTab === "overview"}
                    onClick={() => setModalTab("overview")}
                  >
                    Specifications
                  </button>
                  <button
                    type="button"
                    className="chip"
                    aria-pressed={modalTab === "bom"}
                    onClick={() => setModalTab("bom")}
                  >
                    Bill of Materials ({selectedProject.bom?.length || 0})
                  </button>
                </div>

                {modalTab === "overview" ? (
                  <dl className="qv__facts">
                    {Object.entries(selectedProject.facts).map(([k, v]) => (
                      <React.Fragment key={k}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </React.Fragment>
                    ))}
                  </dl>
                ) : (
                  <table className="bom-table">
                    <thead>
                      <tr>
                        <th>RefDes</th>
                        <th>Part</th>
                        <th>Pkg</th>
                        <th>Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProject.bom.map((row) => (
                        <tr key={row.ref}>
                          <td>{row.ref}</td>
                          <td>{row.part}</td>
                          <td>{row.pkg}</td>
                          <td>{row.qty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </dialog>

      {/* ==================== BRIEF MODAL ==================== */}
      <dialog ref={briefRef} className="dlg dlg--brief" onClose={() => setBriefOpen(false)}>
        <button
          type="button"
          className="dlg__close"
          onClick={() => setBriefOpen(false)}
        >
          ✕
        </button>
        <form
          className="brief"
          onSubmit={(e) => {
            e.preventDefault();
            setBriefOpen(false);
            showToast("Project brief sent!");
          }}
        >
          <h2>Share a project idea</h2>
          <div className="brief__row">
            <div className="field">
              <label htmlFor="b-name">Name</label>
              <input id="b-name" type="text" required placeholder="Your name" />
            </div>
            <div className="field">
              <label htmlFor="b-email">Email</label>
              <input id="b-email" type="email" required placeholder="you@company.com" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="b-msg">Project Specs &amp; Timeline</label>
            <textarea
              id="b-msg"
              required
              placeholder="What are we building, target MCU/sensors, and timeline?"
            />
          </div>
          <button type="submit" className="btn btn--primary">
            Send project brief
          </button>
        </form>
      </dialog>

      {toastMsg && <div className="toast">{toastMsg}</div>}
    </>
  );
}
