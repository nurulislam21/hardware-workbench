// src/components/Workspaces.jsx
import React, { useState } from "react";
import { WORKBENCH_DATA } from "../data/engineeringData";

/* ==========================================================================
   1. ALTIUM DESIGNER (.PcbDoc) INTERACTIVE VIEWPORT
   ========================================================================== */
export function AltiumWorkspace() {
  const { altium } = WORKBENCH_DATA;
  const [selectedNet, setSelectedNet] = useState(altium.nets[0]);
  const [coords, setCoords] = useState({ x: 2450, y: 1820 });
  const [layers, setLayers] = useState({
    top: true,
    gnd: true,
    bottom: true,
    silk: true
  });

  const toggleLayer = (id) =>
    setLayers((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 4000);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 2800);
    setCoords({ x, y });
  };

  return (
    <>
      <div className="cad-toolbar">
        <div className="cad-tool-group">
          <span>Grid: 10mil</span>
          <span>·</span>
          <span>Snap: Electrical</span>
          <span>·</span>
          <span style={{ color: "#ff3b30" }}>● Online DRC: ON</span>
        </div>
        <div className="cad-tool-group">
          <span>Active Net: <strong>{selectedNet.net}</strong></span>
        </div>
      </div>

      <div className="cad-body">
        {/* Left Panel: Altium PCB Panel (Nets & Components) */}
        <div className="cad-tree">
          <div className="cad-tree__head">PCB Panel · Nets & ICs</div>
          {altium.nets.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`cad-tree__item ${selectedNet.id === item.id ? "is-selected" : ""}`}
              onClick={() => setSelectedNet(item)}
            >
              <span style={{ color: "#f5c242" }}>▣</span>
              <span>{item.designator}</span>
            </button>
          ))}
          <div className="cad-tree__head" style={{ marginTop: "12px" }}>
            Design Rules (DRC)
          </div>
          <div style={{ color: "#2eb872", padding: "4px 6px" }}>✓ Clearance: 6mil Min</div>
          <div style={{ color: "#2eb872", padding: "4px 6px" }}>✓ Short-Circuit: 0</div>
          <div style={{ color: "#2eb872", padding: "4px 6px" }}>✓ Un-Routed Net: 0</div>
        </div>

        {/* Center Viewport: Multi-Layer PCB Layout */}
        <div className="cad-viewport" onMouseMove={handleMouseMove}>
          <svg className="cad-svg" viewBox="0 0 600 340">
            {/* Mechanical Board Outline */}
            <rect
              x="35"
              y="22"
              width="530"
              height="296"
              rx="10"
              fill="#0c0e14"
              stroke="#bf5af2"
              strokeWidth="2"
            />

            {/* L2 GND Copper Pour Hatching */}
            {layers.gnd && (
              <g opacity="0.18" stroke="#2eb872" strokeWidth="1">
                <rect x="48" y="34" width="504" height="272" fill="none" strokeDasharray="4 4" />
                <line x1="48" y1="100" x2="552" y2="100" />
                <line x1="48" y1="240" x2="552" y2="240" />
              </g>
            )}

            {/* L4 Bottom Layer Blue Tracks */}
            {layers.bottom && (
              <g
                stroke="#007aff"
                strokeWidth={selectedNet.id === "J1" ? "4" : "2.4"}
                fill="none"
                opacity={selectedNet.id === "J1" ? "1" : "0.75"}
              >
                <polyline points="95,250 170,250 215,205 265,205" />
                <polyline points="95,265 178,265 225,218 265,218" />
                <polyline points="95,280 186,280 235,230 265,230" />
                <polyline points="335,170 410,170 445,135 490,135" />
              </g>
            )}

            {/* L1 Top Layer Red Tracks */}
            {layers.top && (
              <g
                stroke="#ff3b30"
                strokeWidth={selectedNet.id === "U1" ? "3.5" : "2.4"}
                fill="none"
              >
                <polyline points="110,90 190,90 220,120 260,120" />
                <polyline points="110,108 182,108 212,138 260,138" />
                <polyline points="340,125 400,125 430,95 480,95" />
                <polyline points="340,145 410,145 440,115 480,115" />
                {/* High-Current Polygon Trace to U2 */}
                <polyline
                  points="340,195 435,195 465,225"
                  strokeWidth={selectedNet.id === "U2" ? "6" : "4"}
                />
              </g>
            )}

            {/* U1: STM32F405 LQFP-64 Footprint */}
            <g
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedNet(altium.nets[0])}
            >
              <rect
                x="260"
                y="105"
                width="80"
                height="80"
                fill="#151922"
                stroke={selectedNet.id === "U1" ? "#f5c242" : "#ff3b30"}
                strokeWidth="2"
              />
              {/* Gold SMD Pads around LQFP */}
              {[0, 14, 28, 42, 56].map((offset) => (
                <g key={offset} fill="#f5c242">
                  <rect x="252" y={115 + offset} width="8" height="5" />
                  <rect x="340" y={115 + offset} width="8" height="5" />
                  <rect x={270 + offset} y="97" width="5" height="8" />
                  <rect x={270 + offset} y="185" width="5" height="8" />
                </g>
              ))}
              <circle cx="272" cy="117" r="3" fill="#ff3b30" />
              {layers.silk && (
                <>
                  <text x="300" y="143" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="700">
                    U1 STM32F4
                  </text>
                  <text x="300" y="156" textAnchor="middle" fill="#f5c242" fontSize="7.5" fontFamily="monospace">
                    LQFP-64
                  </text>
                </>
              )}
            </g>

            {/* U2: Dual Motor H-Bridge Power Stage */}
            <g
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedNet(altium.nets[1])}
            >
              <rect
                x="455"
                y="195"
                width="72"
                height="58"
                fill="#151922"
                stroke={selectedNet.id === "U2" ? "#f5c242" : "#ff3b30"}
                strokeWidth="2"
              />
              <rect x="473" y="209" width="36" height="30" fill="#f5c242" opacity="0.85" />
              {/* Thermal Via Array */}
              <circle cx="483" cy="219" r="2.2" fill="#090a0d" />
              <circle cx="499" cy="219" r="2.2" fill="#090a0d" />
              <circle cx="483" cy="229" r="2.2" fill="#090a0d" />
              <circle cx="499" cy="229" r="2.2" fill="#090a0d" />
              {layers.silk && (
                <text x="491" y="188" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontFamily="monospace">
                  U2 DRV_STAGE
                </text>
              )}
            </g>

            {/* J1: 16-Channel IR Sensor Array Connector */}
            <g
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedNet(altium.nets[2])}
            >
              <rect
                x="68"
                y="232"
                width="28"
                height="62"
                fill="#151922"
                stroke={selectedNet.id === "J1" ? "#f5c242" : "#007aff"}
                strokeWidth="2"
              />
              <rect x="76" y="242" width="12" height="8" fill="#f5c242" />
              <rect x="76" y="258" width="12" height="8" fill="#f5c242" />
              <rect x="76" y="274" width="12" height="8" fill="#f5c242" />
              {layers.silk && (
                <text x="82" y="224" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontFamily="monospace">
                  J1 IR_MUX
                </text>
              )}
            </g>

            {/* Mounting Holes (Multi-Layer) */}
            {[[58, 45], [542, 45], [58, 295], [542, 295]].map(([cx, cy], idx) => (
              <g key={idx}>
                <circle cx={cx} cy={cy} r="10" fill="none" stroke="#f5c242" strokeWidth="3" />
                <circle cx={cx} cy={cy} r="5" fill="#090a0d" />
              </g>
            ))}
          </svg>

          {/* Altium Bottom Layer Tabs */}
          <div className="altium-layers">
            {altium.layers.map((l) => (
              <button
                key={l.id}
                type="button"
                className={`layer-tab ${layers[l.id] ? "is-visible" : ""}`}
                onClick={() => toggleLayer(l.id)}
              >
                <span className="layer-swatch" style={{ background: l.color }} />
                {l.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel: Altium Properties Inspector */}
        <div className="cad-inspector">
          <div className="cad-tree__head">Properties · Inspector</div>
          <div className="cad-prop-group">
            <span className="cad-prop-label">Designator</span>
            <span className="cad-prop-val">{selectedNet.designator}</span>
          </div>
          <div className="cad-prop-group">
            <span className="cad-prop-label">Net Name</span>
            <span className="cad-prop-val" style={{ color: "#f5c242" }}>
              {selectedNet.net}
            </span>
          </div>
          <div className="cad-prop-group">
            <span className="cad-prop-label">Footprint / Package</span>
            <span className="cad-prop-val">{selectedNet.package}</span>
          </div>
          <div className="cad-prop-group">
            <span className="cad-prop-label">Routing Geometry</span>
            <span className="cad-prop-val">{selectedNet.traceWidth}</span>
          </div>
          <p style={{ margin: 0, color: "var(--ink-soft)", lineHeight: 1.4 }}>
            {selectedNet.desc}
          </p>
        </div>
      </div>

      <div className="cad-statusbar">
        <span>
          X: {coords.x} mil · Y: {coords.y} mil · {altium.stackup}
        </span>
        <span>{altium.drcStatus}</span>
      </div>
    </>
  );
}

/* ==========================================================================
   2. SOLIDWORKS (.SLDASM) INTERACTIVE 3D CAD VIEWPORT
   ========================================================================== */
export function SolidworksWorkspace() {
  const { solidworks } = WORKBENCH_DATA;
  const [exploded, setExploded] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [selectedPart, setSelectedPart] = useState(solidworks.features[0]);

  return (
    <>
      {/* SOLIDWORKS Heads-Up View Toolbar */}
      <div className="cad-toolbar">
        <div className="cad-tool-group">
          <button
            type="button"
            className={`cad-tool-btn ${!wireframe ? "is-on" : ""}`}
            onClick={() => setWireframe(false)}
          >
            🧊 Shaded With Edges
          </button>
          <button
            type="button"
            className={`cad-tool-btn ${wireframe ? "is-on" : ""}`}
            onClick={() => setWireframe(true)}
          >
            📐 Wireframe (HLV)
          </button>
          <button
            type="button"
            className={`cad-tool-btn ${exploded ? "is-on" : ""}`}
            onClick={() => setExploded(!exploded)}
          >
            💥 {exploded ? "Collapse Assembly" : "Exploded View (Explode1)"}
          </button>
        </div>
        <div>View: <strong>Isometric (Trimetric)</strong></div>
      </div>

      <div className="cad-body">
        {/* Left Panel: SOLIDWORKS FeatureManager Design Tree */}
        <div className="cad-tree">
          <div className="cad-tree__head">FeatureManager Design Tree</div>
          <div style={{ fontWeight: 700, padding: "4px 0", color: "#ff9f1c" }}>
            📦 {solidworks.file}
          </div>
          {solidworks.features.map((feat) => (
            <button
              key={feat.id}
              type="button"
              className={`cad-tree__item ${selectedPart.id === feat.id ? "is-selected" : ""}`}
              onClick={() => setSelectedPart(feat)}
            >
              <span>├─ 🧩</span>
              <span>{feat.name}</span>
            </button>
          ))}
          <div className="cad-tree__head" style={{ marginTop: "10px" }}>
            Mates (3)
          </div>
          <div style={{ color: "var(--ink-soft)", padding: "2px 6px" }}>├─ Concentric1 (M3_Standoff)</div>
          <div style={{ color: "var(--ink-soft)", padding: "2px 6px" }}>├─ Coincident2 (Top_Canopy)</div>
          <div style={{ color: "var(--ink-soft)", padding: "2px 6px" }}>└─ ExplodeView1 ({exploded ? "Active" : "Suppressed"})</div>
        </div>

        {/* Center Viewport: Isometric CAD Assembly with Explode Animation */}
        <div className="cad-viewport">
          <svg className="cad-svg" viewBox="0 0 600 340">
            {/* Explode Guide Lines (Shown when Exploded View is active) */}
            {exploded && (
              <g stroke="#00ff88" strokeWidth="1.5" strokeDasharray="5 5">
                <line x1="200" y1="85" x2="200" y2="255" />
                <line x1="400" y1="85" x2="400" y2="255" />
                <line x1="300" y1="55" x2="300" y2="225" />
              </g>
            )}

            {/* PART 3 (Bottom): CNC Base Chassis */}
            <g
              style={{
                transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
                transform: exploded ? "translateY(52px)" : "translateY(0px)",
                cursor: "pointer"
              }}
              onClick={() => setSelectedPart(solidworks.features[2])}
            >
              <polygon
                points="300,150 450,205 300,260 150,205"
                fill={wireframe ? "none" : "#2c3e50"}
                stroke={selectedPart.id === "base_frame" ? "#ff9f1c" : "#00a8e8"}
                strokeWidth="2.2"
              />
              <polygon
                points="150,205 300,260 300,282 150,227"
                fill={wireframe ? "none" : "#1a252f"}
                stroke="#00a8e8"
                strokeWidth="1.8"
              />
              <polygon
                points="450,205 300,260 300,282 450,227"
                fill={wireframe ? "none" : "#243342"}
                stroke="#00a8e8"
                strokeWidth="1.8"
              />
              <text x="300" y="220" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="monospace">
                BASE CHASSIS (6061-T6 / CF)
              </text>
            </g>

            {/* PART 2 (Middle): Imported Altium STEP PCB Assembly */}
            <g
              style={{
                transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
                transform: exploded ? "translateY(0px)" : "translateY(8px)",
                cursor: "pointer"
              }}
              onClick={() => setSelectedPart(solidworks.features[1])}
            >
              <polygon
                points="300,122 425,168 300,214 175,168"
                fill={wireframe ? "none" : "#11693e"}
                stroke={selectedPart.id === "pcb_core" ? "#ff9f1c" : "#2ec4b6"}
                strokeWidth="2.2"
              />
              {/* 3D IC Block on STEP Board */}
              <polygon
                points="300,148 335,160 300,174 265,160"
                fill={wireframe ? "none" : "#1e272e"}
                stroke="#f5c242"
                strokeWidth="1.5"
              />
              <text x="300" y="196" textAnchor="middle" fill="#e2f1ff" fontSize="8.5" fontFamily="monospace">
                STEP: FC_MAINBOARD_V1
              </text>
            </g>

            {/* PART 1 (Top): Aerodynamic 3D-Printed Upper Shell */}
            <g
              style={{
                transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
                transform: exploded ? "translateY(-54px)" : "translateY(-12px)",
                cursor: "pointer"
              }}
              onClick={() => setSelectedPart(solidworks.features[0])}
            >
              <polygon
                points="300,82 435,132 300,182 165,132"
                fill={wireframe ? "none" : "rgba(58, 134, 255, 0.72)"}
                stroke={selectedPart.id === "top_shell" ? "#ff9f1c" : "#ffffff"}
                strokeWidth="2.2"
              />
              <text x="300" y="136" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="700">
                AERO SHELL CANOPY (1.6mm)
              </text>
            </g>

            {/* SOLIDWORKS Reference Triad Gizmo (Bottom Left) */}
            <g transform="translate(55, 290)" fontFamily="monospace" fontSize="9" fontWeight="700">
              <line x1="0" y1="0" x2="0" y2="-34" stroke="#2ecc71" strokeWidth="2.2" />
              <text x="-4" y="-38" fill="#2ecc71">Z</text>
              <line x1="0" y1="0" x2="32" y2="12" stroke="#e74c3c" strokeWidth="2.2" />
              <text x="36" y="16" fill="#e74c3c">X</text>
              <line x1="0" y1="0" x2="-28" y2="14" stroke="#3498db" strokeWidth="2.2" />
              <text x="-40" y="20" fill="#3498db">Y</text>
            </g>
          </svg>
        </div>

        {/* Right Panel: SOLIDWORKS Mass Properties & Mate Inspector */}
        <div className="cad-inspector">
          <div className="cad-tree__head">PropertyManager</div>
          <div className="cad-prop-group">
            <span className="cad-prop-label">Selected Component</span>
            <span className="cad-prop-val" style={{ color: "#ff9f1c" }}>
              {selectedPart.name}
            </span>
          </div>
          <div className="cad-prop-group">
            <span className="cad-prop-label">Feature Operation</span>
            <span className="cad-prop-val">{selectedPart.type}</span>
          </div>
          <div className="cad-prop-group">
            <span className="cad-prop-label">Assigned Material</span>
            <span className="cad-prop-val">{selectedPart.material}</span>
          </div>
          <div className="cad-prop-group">
            <span className="cad-prop-label">Assembly Mass</span>
            <span className="cad-prop-val">{solidworks.mass}</span>
          </div>
          <p style={{ margin: 0, color: "var(--ink-soft)", lineHeight: 1.4 }}>
            {selectedPart.desc}
          </p>
        </div>
      </div>

      <div className="cad-statusbar">
        <span>SOLIDWORKS 2026 · {solidworks.interference}</span>
        <span>Units: MMGS (millimeter, gram, second)</span>
      </div>
    </>
  );
}

/* ==========================================================================
   3. VS CODE + PLATFORMIO (.c / .ini) INTERACTIVE IDE VIEWPORT
   ========================================================================== */
export function VSCodeWorkspace() {
  const { vscode } = WORKBENCH_DATA;
  const [activeFile, setActiveFile] = useState("main.c");
  const [activeLine, setActiveLine] = useState(vscode.files["main.c"][4]);
  const [buildLog, setBuildLog] = useState(
    "SUCCESS: [====      ]  42.8% (used 224312 bytes from 524288 bytes) · ST-LINK Connected"
  );

  const triggerBuild = () => {
    setBuildLog("Compiling .pio/build/genericSTM32F405RG/src/main.o ...");
    setTimeout(() => {
      setBuildLog(
        "✓ [SUCCESS] Took 1.42 seconds · Streaming DMA PID telemetry @ 115200 baud"
      );
    }, 650);
  };

  return (
    <>
      <div className="cad-toolbar">
        <div className="cad-tool-group">
          {Object.keys(vscode.files).map((fname) => (
            <button
              key={fname}
              type="button"
              className={`cad-tool-btn ${activeFile === fname ? "is-on" : ""}`}
              onClick={() => {
                setActiveFile(fname);
                setActiveLine(vscode.files[fname][0]);
              }}
            >
              📄 {fname}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="cad-tool-btn is-on"
          onClick={triggerBuild}
        >
          ▶ PIO: Build & Monitor
        </button>
      </div>

      <div className="cad-body">
        {/* Left Panel: VS Code File Explorer & Symbols */}
        <div className="cad-tree">
          <div className="cad-tree__head">Explorer · {vscode.project}</div>
          <div style={{ color: "#f58220", padding: "3px 6px", fontWeight: 700 }}>
            ▾ src/
          </div>
          {Object.keys(vscode.files).map((fname) => (
            <button
              key={fname}
              type="button"
              className={`cad-tree__item ${activeFile === fname ? "is-selected" : ""}`}
              onClick={() => setActiveFile(fname)}
            >
              <span>C</span>
              <span>{fname}</span>
            </button>
          ))}
          <div className="cad-tree__head" style={{ marginTop: "12px" }}>
            Cortex-Debug Registers
          </div>
          <div style={{ color: "#4ec9b0", padding: "2px 6px" }}>TIM1-&gt;CCR1: 0x06A4</div>
          <div style={{ color: "#4ec9b0", padding: "2px 6px" }}>DMA2_Stream0: ACTIVE</div>
          <div style={{ color: "#dcdcaa", padding: "2px 6px" }}>PID_Kp: 1.85f · Kd: 0.42f</div>
        </div>

        {/* Center Viewport: Code Editor + Bottom Serial Oscilloscope */}
        <div className="cad-viewport" style={{ background: "#1e1e1e" }}>
          <div className="vsc-editor">
            {vscode.files[activeFile].map((row) => (
              <div
                key={row.ln}
                className={`vsc-line ${activeLine.ln === row.ln ? "is-active" : ""}`}
                onClick={() => setActiveLine(row)}
              >
                <span className="vsc-ln">{row.ln}</span>
                <span style={{ color: row.code.startsWith("#") ? "#c586c0" : "#9cdcfe" }}>
                  {row.code}
                </span>
              </div>
            ))}
          </div>

          {/* Integrated Terminal & Live Serial Plotter */}
          <div className="vsc-terminal">
            <div style={{ display: "flex", justifyContent: "space-between", color: "#858585", marginBottom: "4px" }}>
              <span>TERMINAL · PLATFORMIO SERIAL PLOTTER (4kHz PID Loop)</span>
              <span style={{ color: "#4ec9b0" }}>{buildLog}</span>
            </div>
            <svg width="100%" height="58" viewBox="0 0 500 55" preserveAspectRatio="none">
              {/* Setpoint Reference */}
              <line x1="0" y1="28" x2="500" y2="28" stroke="#444" strokeDasharray="4 4" />
              {/* PID Error Response Wave */}
              <path
                d="M0,48 Q25,5 50,38 T100,24 T150,30 T200,27 T250,28 T300,12 T350,35 T400,26 T450,28 L500,28"
                fill="none"
                stroke="#4ec9b0"
                strokeWidth="2"
              />
              {/* PWM Motor Output Wave */}
              <path
                d="M0,15 L30,15 L30,42 L70,42 L70,20 L130,20 L130,32 L210,32 L210,25 L310,25 L310,10 L360,10 L360,30 L500,30"
                fill="none"
                stroke="#f58220"
                strokeWidth="1.5"
                opacity="0.85"
              />
            </svg>
          </div>
        </div>

        {/* Right Panel: Firmware Symbol & Memory Inspector */}
        <div className="cad-inspector">
          <div className="cad-tree__head">IntelliSense · Memory</div>
          <div className="cad-prop-group">
            <span className="cad-prop-label">Target MCU</span>
            <span className="cad-prop-val">{vscode.mcu}</span>
          </div>
          <div className="cad-prop-group">
            <span className="cad-prop-label">Flash Utilization</span>
            <span className="cad-prop-val" style={{ color: "#4ec9b0" }}>
              {vscode.flashUsage}
            </span>
          </div>
          <div className="cad-prop-group">
            <span className="cad-prop-label">SRAM Utilization</span>
            <span className="cad-prop-val">{vscode.ramUsage}</span>
          </div>
          <div className="cad-prop-group">
            <span className="cad-prop-label">Line {activeLine.ln} Analysis</span>
            <span className="cad-prop-val" style={{ color: "#dcdcaa" }}>
              {activeLine.info || "Select a line of code to inspect register behavior."}
            </span>
          </div>
        </div>
      </div>

      <div className="cad-statusbar">
        <span>⎇ main* · PlatformIO · env:genericSTM32F405RG</span>
        <span>Ln {activeLine.ln}, Col 1 · C/C++ (GCC arm-none-eabi)</span>
      </div>
    </>
  );
}