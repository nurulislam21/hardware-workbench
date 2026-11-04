import React, { useState, useEffect, useRef } from "react";
import { SITE_DATA } from "../data/projectData";
import AliveRigidFlex3D from "./AliveRigidFlex3D";

export default function ScrollPipeline3D() {
  const [activeIdx, setActiveIdx] = useState(0);
  const stepRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index);
            if (!Number.isNaN(idx)) setActiveIdx(idx);
          }
        });
      },
      { threshold: 0.55, rootMargin: "-10% 0px -25% 0px" }
    );

    stepRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const stage = SITE_DATA.pipelineStages[activeIdx];

  return (
    <div className="pipe-grid">
      {/* Left Scrolling Engineering Stages */}
      <div className="pipe-steps">
        {SITE_DATA.pipelineStages.map((st, idx) => (
          <div
            key={st.id}
            ref={(el) => (stepRefs.current[idx] = el)}
            data-index={idx}
            className={`pipe-card ${activeIdx === idx ? "is-active" : ""}`}
            onClick={() => setActiveIdx(idx)}
          >
            <div className="pipe-card__num">
              <span>{st.step}</span>
              <span>0{idx + 1} / 05</span>
            </div>
            <h3>{st.title}</h3>
            <p>{st.desc}</p>
            <div className="pipe-files">
              {st.files.map((f) => (
                <span key={f} className="pipe-file-pill">
                  📄 {f}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Right Sticky 3D + Authentic Software Workspace Shell */}
      <div className="ws-sticky">
        {/* ====================================================================
           STAGE 1: PRODUCT PLANNING (Holographic Blueprint Table)
           ==================================================================== */}
        {stage.id === "planning" && (
          <div className="env-planning">
            <div className="env-planning__top">
              <span>📐 BLUEPRINT TABLE · {stage.workspaceFile}</span>
              <span>HOLOGRAPHIC WIREFRAME PROJECTION</span>
            </div>
            <AliveRigidFlex3D
              explodeFactor={stage.explodeFactor}
              showEnclosure={stage.showEnclosure}
              currentSpeed={stage.currentSpeed}
              camTargetPos={stage.camPos}
              height="380px"
              allowControls={false}
            />
            <div className="env-planning__top" style={{ borderTop: "1px solid #1e3a5f", borderBottom: 0 }}>
              <span>{stage.telemetry}</span>
              <span>FILES: .DWG · .STEP · .PDF</span>
            </div>
          </div>
        )}

        {/* ====================================================================
           STAGE 2: 3D MODELING (SOLIDWORKS Light-Gray Interface Background)
           ==================================================================== */}
        {stage.id === "modeling" && (
          <div className="env-solidworks">
            <div className="sw-titlebar">
              <span>
                <strong className="sw-brand-red">3D MCAD Connected</strong> · {stage.workspaceFile}
              </span>
              <span>Fully Defined · MMGS</span>
            </div>
            <div className="sw-ribbon">
              <span><strong>Assembly</strong></span>
              <span>Layout</span>
              <span>Sketch</span>
              <span>Evaluate</span>
              <span>⚙️ Mate</span>
              <span>💥 Exploded View</span>
              <span>📏 Interference Detection</span>
            </div>
            <div className="sw-main">
              <div className="sw-tree">
                <div style={{ fontWeight: 700, marginBottom: "6px", borderBottom: "1px solid #ccc", paddingBottom: "4px" }}>
                  FeatureManager Tree
                </div>
                {stage.features.map((f, i) => (
                  <div key={i} className={`sw-tree-item ${i === 3 ? "is-sel" : ""}`}>
                    {f}
                  </div>
                ))}
              </div>
              <AliveRigidFlex3D
                explodeFactor={stage.explodeFactor}
                showEnclosure={stage.showEnclosure}
                currentSpeed={stage.currentSpeed}
                camTargetPos={stage.camPos}
                height="360px"
                allowControls={false}
              />
            </div>
            <div className="sw-titlebar" style={{ borderTop: "1px solid #c4c9d0", borderBottom: 0 }}>
              <span>{stage.telemetry}</span>
              <span>🖱️ Drag 3D Assembly in Viewport</span>
            </div>
          </div>
        )}

        {/* ====================================================================
           STAGE 3: SCHEMATIC & PCB DESIGNING (Altium Designer Dark Interface)
           ==================================================================== */}
        {stage.id === "pcb" && (
          <div className="env-altium">
            <div className="ad-menubar">
              <span>
                <span className="ad-gold">▣ ECAD PCB &amp; SCHEMATIC WORKSPACE</span> · {stage.workspaceFile}
              </span>
              <span style={{ color: "#2bd980" }}>● Online DRC: 0 Violations</span>
            </div>
            <div className="ad-main">
              <div className="ad-panel">
                <div style={{ color: "#e6b450", fontWeight: 700, marginBottom: "6px" }}>
                  Projects &amp; Nets
                </div>
                {stage.nets.map((n) => (
                  <div key={n.ref} style={{ padding: "5px 0", borderBottom: "1px solid #262936" }}>
                    <div style={{ color: "#fff", fontWeight: 700 }}>{n.ref}</div>
                    <div style={{ color: "#ff8c24" }}>{n.net}</div>
                  </div>
                ))}
              </div>

              <AliveRigidFlex3D
                explodeFactor={stage.explodeFactor}
                showEnclosure={stage.showEnclosure}
                currentSpeed={stage.currentSpeed}
                camTargetPos={stage.camPos}
                height="340px"
                allowControls={false}
              />

              <div className="ad-panel ad-panel--right">
                <div style={{ color: "#38e0ff", fontWeight: 700, marginBottom: "6px" }}>
                  Live Schematic &amp; DRC
                </div>
                <svg viewBox="0 0 160 120" style={{ width: "100%", border: "1px solid #2e3240", background: "#0d0f14", marginBottom: "8px" }}>
                  <rect x="12" y="20" width="52" height="75" fill="#161b26" stroke="#ff8c24" strokeWidth="1.5" />
                  <text x="38" y="55" textAnchor="middle" fill="#fff" fontSize="7">U1 MCU</text>
                  <line x1="64" y1="40" x2="98" y2="40" stroke="#2bd980" strokeWidth="1.5" />
                  <line x1="64" y1="65" x2="98" y2="65" stroke="#ff8c24" strokeWidth="1.5" />
                  <rect x="98" y="25" width="48" height="65" fill="#161b26" stroke="#38e0ff" strokeWidth="1.5" />
                  <text x="122" y="55" textAnchor="middle" fill="#fff" fontSize="7">U2 AFE</text>
                </svg>
                <div>Stack: 4L Rigid + 2L Flex</div>
                <div style={{ color: "#2bd980", marginTop: "4px" }}>Current Flow: ACTIVE</div>
              </div>
            </div>
            <div className="ad-layertabs">
              <span className="ad-ltab"><i style={{ background: "#ff3b30" }} /> L1 Top Signal</span>
              <span className="ad-ltab"><i style={{ background: "#2bd980" }} /> L2 GND Plane</span>
              <span className="ad-ltab"><i style={{ background: "#ff8c24" }} /> Flex Polyimide</span>
              <span className="ad-ltab"><i style={{ background: "#007aff" }} /> L4 Bot Signal</span>
            </div>
          </div>
        )}

        {/* ====================================================================
           STAGE 4: FIRMWARE (VS Code IDE + Ubuntu Terminal + Live 3D Board)
           ==================================================================== */}
        {stage.id === "firmware" && (
          <div className="env-vscode">
            <div className="vsc-top">
              <span>⟨/⟩ {stage.workspaceFile}</span>
              <span style={{ color: "#4ec9b0" }}>⎇ main* · STM32H7 + Ubuntu ROS2 Node</span>
            </div>
            <div className="vsc-split">
              <div className="vsc-code">
                <div style={{ color: "#6a9955" }}>// 4kHz Bare-Metal DMA Interrupt</div>
                <div><span style={{ color: "#c586c0" }}>void</span> <span style={{ color: "#dcdcaa" }}>TIM1_UP_IRQHandler</span>() &#123;</div>
                <div>  DMA2_Stream0-&gt;CR |= <span style={{ color: "#b5cea8" }}>0x01</span>;</div>
                <div>  <span style={{ color: "#569cd6" }}>float</span> err = centroid(adc_buf);</div>
                <div>  <span style={{ color: "#569cd6" }}>float</span> u = biquad_pid(&amp;pid, err);</div>
                <div>  publish_dma_frame(err, u);</div>
                <div>&#125;</div>
              </div>
              <div className="ubuntu-term">
                <div style={{ color: "#8ae234", fontWeight: 700 }}>noman@ubuntu-dev:~/ws$ pio run -t upload</div>
                <div>[SUCCESS] Flash: 34.2% · ST-LINK V3 OK</div>
                <div style={{ color: "#8ae234", fontWeight: 700 }}>noman@ubuntu-dev:~/ws$ ros2 topic hz /telemetry</div>
                <div>average rate: 400.02 Hz · min: 0.002s</div>
                <div style={{ color: "#ff9900" }}>⚡ Streaming live current pulses to 3D board ↓</div>
              </div>
            </div>
            <AliveRigidFlex3D
              explodeFactor={stage.explodeFactor}
              showEnclosure={stage.showEnclosure}
              currentSpeed={stage.currentSpeed}
              camTargetPos={stage.camPos}
              height="270px"
              allowControls={false}
            />
          </div>
        )}

        {/* ====================================================================
           STAGE 5: YOUR PRODUCT IS READY (Assembled Turnkey 3D Hardware)
           ==================================================================== */}
        {stage.id === "ready" && (
          <div className="env-planning">
            <div className="env-planning__top" style={{ background: "#0d261a", color: "#2bd980" }}>
              <span>✓ {stage.workspaceFile} · ALL 3D LAYERS MATED &amp; LOCKED</span>
              <span>CE / FCC / DFM READY</span>
            </div>
            <AliveRigidFlex3D
              explodeFactor={stage.explodeFactor}
              showEnclosure={stage.showEnclosure}
              currentSpeed={stage.currentSpeed}
              camTargetPos={stage.camPos}
              height="380px"
              allowControls={false}
            />
            <div className="env-planning__top" style={{ background: "#0d261a", borderTop: "1px solid #1b4d33", borderBottom: 0 }}>
              <span>{stage.telemetry}</span>
              <span style={{ color: "#ff9900" }}>READY FOR MASS MANUFACTURING</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
