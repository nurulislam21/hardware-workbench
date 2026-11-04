import React from "react";
import { SITE_DATA } from "../data/projectData";

export default function LifecycleWorkbench({ activeProbe, onSelectProbe, canvasView }) {
  return (
    <div className="sheet-frame">
      {/* ====================================================================
         MODE 1: EXACT ISPRITHUL.ME INTERACTIVE SCHEMATIC SHEET
         ==================================================================== */}
      {canvasView === "sch" && (
        <svg className="sch-svg" viewBox="0 0 680 390" role="img" aria-label="Interactive Hardware Schematic">
          {/* Outer & Inner Drawing Borders */}
          <rect x="4" y="4" width="672" height="382" fill="none" stroke="var(--sheet)" strokeWidth="1.4" />
          <rect x="14" y="14" width="652" height="362" fill="none" stroke="var(--sheet)" strokeWidth="1" />

          {/* Subtle Sheet Intersection Grid Dots */}
          <g fill="var(--grid-dot)">
            {[60, 120, 180, 240, 300, 360, 420, 480, 540, 600].map((gx) =>
              [60, 120, 180, 240, 300, 340].map((gy) => (
                <circle key={`${gx}-${gy}`} cx={gx} cy={gy} r="1" />
              ))
            )}
          </g>

          {/* Frame Coordinate Ticks & Labels */}
          <g fill="var(--sheet)" fontSize="7.5">
            <text x="95" y="11">1</text>
            <text x="255" y="11">2</text>
            <text x="425" y="11">3</text>
            <text x="585" y="11">4</text>
            <text x="95" y="384">1</text>
            <text x="255" y="384">2</text>
            <text x="425" y="384">3</text>
            <text x="585" y="384">4</text>
            <text x="7" y="110">A</text>
            <text x="7" y="285">B</text>
            <text x="668" y="110">A</text>
            <text x="668" y="285">B</text>
          </g>

          {/* J1: AVR-ISP-6 Input Connector */}
          <g transform="translate(38, 114)">
            <text x="0" y="-18" fill="var(--heading)" fontSize="8">↑ +5V</text>
            <line x1="12" y1="-14" x2="12" y2="0" stroke="var(--wire)" strokeWidth="1.4" />
            <text x="26" y="-6" fill="var(--field)" fontSize="8.5" fontWeight="700">J1</text>
            <rect x="0" y="0" width="60" height="102" fill="var(--ic-bg)" stroke="var(--sym)" strokeWidth="1.5" />
            <text x="6" y="15" fill="var(--field)" fontSize="7">VCC</text>
            <text x="34" y="24" fill="var(--field)" fontSize="7">MISO</text>
            <text x="38" y="44" fill="var(--field)" fontSize="7">SCK</text>
            <text x="34" y="64" fill="var(--field)" fontSize="7">MOSI</text>
            <text x="38" y="84" fill="var(--field)" fontSize="7">RST</text>
            <text x="12" y="96" fill="var(--field)" fontSize="7">GND</text>
            <line x1="20" y1="102" x2="20" y2="116" stroke="var(--wire)" strokeWidth="1.4" />
            <polygon points="14,116 26,116 20,123" fill="none" stroke="var(--wire)" strokeWidth="1.3" />
            <text x="0" y="138" fill="var(--field)" fontSize="7.5">AVR-ISP-6</text>
            <text x="0" y="152" fill="var(--field)" fontSize="7">+ your project plugs in here</text>
          </g>

          {/* ISP Bus + TP1 Test Points */}
          <g stroke="var(--tp1)" strokeWidth="1.6" fill="none">
            <text x="142" y="130" fill="var(--heading)" fontSize="7.5" stroke="none" fontWeight="700">ISP</text>
            <line x1="98" y1="136" x2="202" y2="136" />
            <line x1="98" y1="156" x2="202" y2="156" />
            <line x1="98" y1="176" x2="202" y2="176" />
            <line x1="98" y1="196" x2="202" y2="196" />
            <circle cx="152" cy="156" r="3" fill="var(--tp1)" />
            <circle cx="152" cy="176" r="3" fill="var(--tp1)" />
          </g>

          {/* U1: FIRMWARE MCU */}
          <g
            className={`sch-ic ${activeProbe === "u1" ? "is-active" : ""}`}
            transform="translate(202, 94)"
            onClick={() => onSelectProbe("u1")}
          >
            <text x="0" y="-8" fill="var(--field)" fontSize="9" fontWeight="700">U1</text>
            <text x="68" y="-18" textAnchor="middle" fill="var(--heading)" fontSize="8">↑ +3V3</text>
            <line x1="68" y1="-14" x2="68" y2="0" stroke="var(--wire)" strokeWidth="1.4" />
            <rect className="ic-box" x="0" y="0" width="142" height="146" fill="var(--ic-bg)" stroke="var(--sym)" strokeWidth="1.6" />
            <text x="68" y="14" textAnchor="middle" fill="var(--field)" fontSize="7">VCC</text>
            <text x="8" y="44" fill="var(--field)" fontSize="7">MISO</text>
            <text x="8" y="64" fill="var(--field)" fontSize="7">SCK</text>
            <text x="8" y="84" fill="var(--field)" fontSize="7">MOSI</text>
            <text x="8" y="104" fill="var(--field)" fontSize="7">RESET</text>
            <text x="116" y="34" fill="var(--field)" fontSize="7">SDA</text>
            <text x="116" y="54" fill="var(--field)" fontSize="7">SCL</text>
            <text x="112" y="102" fill="var(--field)" fontSize="7">STEP</text>
            <text x="116" y="122" fill="var(--field)" fontSize="7">DIR</text>
            <text x="42" y="140" fill="var(--field)" fontSize="7">PD6</text>
            <text x="95" y="140" fill="var(--field)" fontSize="7">GND</text>
            <text x="71" y="70" textAnchor="middle" fill="var(--field)" fontSize="9.5" fontWeight="700">FIRMWARE</text>
            <text x="71" y="84" textAnchor="middle" fill="var(--field)" fontSize="8">ATmega328P</text>
          </g>

          {/* D1 Status LED */}
          <g transform="translate(244, 240)">
            <line x1="0" y1="0" x2="0" y2="16" stroke="var(--wire)" strokeWidth="1.4" />
            <rect x="-4" y="16" width="8" height="16" fill="none" stroke="var(--sym)" strokeWidth="1.4" />
            <text x="8" y="26" fill="var(--field)" fontSize="7">R3</text>
            <line x1="0" y1="32" x2="0" y2="50" stroke="var(--wire)" strokeWidth="1.4" />
            <circle cx="0" cy="58" r="9" fill="var(--led)" opacity="0.26" />
            <polygon points="-6,52 6,52 0,64" fill="var(--led)" stroke="var(--led)" strokeWidth="1.2" />
            <line x1="-6" y1="64" x2="6" y2="64" stroke="var(--led)" strokeWidth="1.5" />
            <line x1="0" y1="64" x2="0" y2="78" stroke="var(--wire)" strokeWidth="1.4" />
            <polygon points="-6,78 6,78 0,84" fill="none" stroke="var(--wire)" strokeWidth="1.3" />
            <text x="-26" y="54" fill="var(--field)" fontSize="7.5">D1</text>
            <text x="-42" y="65" fill="var(--field)" fontSize="7">STATUS</text>
            <text x="18" y="70" fill="var(--field)" fontSize="7.5">lit = taking new projects</text>
          </g>

          {/* U1 GND Pin */}
          <g transform="translate(302, 240)">
            <line x1="0" y1="0" x2="0" y2="18" stroke="var(--wire)" strokeWidth="1.4" />
            <polygon points="-6,18 6,18 0,25" fill="none" stroke="var(--wire)" strokeWidth="1.3" />
          </g>

          {/* I2C Bus + Pull-Up Resistors R1/R2 + TP2 */}
          <g>
            <text x="418" y="26" textAnchor="middle" fill="var(--heading)" fontSize="8">↑ +3V3</text>
            <rect x="406" y="38" width="8" height="18" fill="none" stroke="var(--sym)" strokeWidth="1.3" />
            <rect x="422" y="38" width="8" height="18" fill="none" stroke="var(--sym)" strokeWidth="1.3" />
            <text x="388" y="45" fill="var(--field)" fontSize="7">R1 R2</text>
            <text x="386" y="54" fill="var(--field)" fontSize="6.5">4k7 4k7</text>
            <polyline points="344,126 410,126 410,68 475,68" fill="none" stroke="var(--tp2)" strokeWidth="1.5" />
            <polyline points="344,146 426,146 426,88 475,88" fill="none" stroke="var(--tp2)" strokeWidth="1.5" />
            <line x1="410" y1="56" x2="410" y2="68" stroke="var(--wire)" strokeWidth="1.3" />
            <line x1="426" y1="56" x2="426" y2="88" stroke="var(--wire)" strokeWidth="1.3" />
            <circle cx="410" cy="68" r="2.5" fill="var(--jn)" />
            <circle cx="426" cy="88" r="2.5" fill="var(--jn)" />
            <circle cx="445" cy="68" r="3" fill="none" stroke="var(--tp2)" strokeWidth="1.5" />
            <text x="366" y="120" fill="var(--heading)" fontSize="7.5">I2C</text>
          </g>

          {/* U2: ELECTRONICS / SENSORS + IO */}
          <g
            className={`sch-ic ${activeProbe === "u2" ? "is-active" : ""}`}
            transform="translate(475, 42)"
            onClick={() => onSelectProbe("u2")}
          >
            <text x="0" y="-6" fill="var(--field)" fontSize="9" fontWeight="700">U2</text>
            <rect className="ic-box" x="0" y="0" width="122" height="72" fill="var(--ic-bg)" stroke="var(--sym)" strokeWidth="1.6" />
            <text x="8" y="26" fill="var(--field)" fontSize="7">SDA</text>
            <text x="8" y="46" fill="var(--field)" fontSize="7">SCL</text>
            <text x="70" y="40" textAnchor="middle" fill="var(--field)" fontSize="8">SENSORS + IO</text>
            <text x="0" y="88" fill="var(--field)" fontSize="9" fontWeight="700">ELECTRONICS</text>
          </g>

          {/* STEP/DIR Motion Wires + TP3 */}
          <g stroke="var(--tp3)" strokeWidth="1.5" fill="none">
            <line x1="344" y1="194" x2="462" y2="194" />
            <line x1="344" y1="214" x2="462" y2="214" />
            <circle cx="404" cy="194" r="3" fill="var(--sheet-bg)" stroke="var(--tp3)" strokeWidth="1.5" />
            <circle cx="404" cy="214" r="3" fill="var(--sheet-bg)" stroke="var(--tp3)" strokeWidth="1.5" />
          </g>

          {/* U3: CUSTOM SYSTEMS / TMC2209 */}
          <g
            className={`sch-ic ${activeProbe === "u3" ? "is-active" : ""}`}
            transform="translate(462, 170)"
            onClick={() => onSelectProbe("u3")}
          >
            <text x="0" y="-6" fill="var(--field)" fontSize="9" fontWeight="700">U3</text>
            <rect className="ic-box" x="0" y="0" width="100" height="80" fill="var(--ic-bg)" stroke="var(--sym)" strokeWidth="1.6" />
            <text x="50" y="15" textAnchor="middle" fill="var(--field)" fontSize="7.5">TMC2209</text>
            <text x="8" y="26" fill="var(--field)" fontSize="7">STEP</text>
            <text x="8" y="44" fill="var(--field)" fontSize="7">DIR</text>
            <text x="80" y="22" fill="var(--field)" fontSize="6.5">A1</text>
            <text x="80" y="36" fill="var(--field)" fontSize="6.5">A2</text>
            <text x="80" y="50" fill="var(--field)" fontSize="6.5">B1</text>
            <text x="80" y="64" fill="var(--field)" fontSize="6.5">B2</text>
            <text x="0" y="95" fill="var(--field)" fontSize="9" fontWeight="700">CUSTOM SYSTEMS</text>
          </g>

          {/* M1: NEMA 17 Stepper Motor */}
          <g transform="translate(562, 186)">
            <line x1="0" y1="6" x2="32" y2="6" stroke="var(--wire)" strokeWidth="1.4" />
            <line x1="0" y1="20" x2="32" y2="20" stroke="var(--wire)" strokeWidth="1.4" />
            <line x1="0" y1="34" x2="32" y2="34" stroke="var(--wire)" strokeWidth="1.4" />
            <line x1="0" y1="48" x2="32" y2="48" stroke="var(--wire)" strokeWidth="1.4" />
            <text x="48" y="-4" textAnchor="middle" fill="var(--field)" fontSize="8" fontWeight="700">M1</text>
            <circle cx="52" cy="27" r="21" fill="var(--ic-bg)" stroke="var(--sym)" strokeWidth="1.6" />
            <circle cx="52" cy="27" r="14" fill="none" stroke="var(--field)" strokeWidth="1.2" />
            <text x="52" y="31" textAnchor="middle" fill="var(--heading)" fontSize="10.5" fontWeight="700">M</text>
            <text x="52" y="60" textAnchor="middle" fill="var(--field)" fontSize="7.5">NEMA 17</text>
          </g>

          {/* Bottom-Right KiCad Title Block */}
          <g transform="translate(450, 298)">
            <rect x="0" y="0" width="216" height="78" fill="var(--sheet-bg)" stroke="var(--sheet)" strokeWidth="1.2" />
            <line x1="0" y1="25" x2="216" y2="25" stroke="var(--sheet)" strokeWidth="1" />
            <line x1="0" y1="50" x2="216" y2="50" stroke="var(--sheet)" strokeWidth="1" />
            <line x1="72" y1="50" x2="72" y2="78" stroke="var(--sheet)" strokeWidth="1" />
            <line x1="144" y1="50" x2="144" y2="78" stroke="var(--sheet)" strokeWidth="1" />
            <text x="8" y="16" fill="var(--heading)" fontSize="8" fontWeight="700">Title: {SITE_DATA.sheetTitle}</text>
            <text x="8" y="41" fill="var(--ink-soft)" fontSize="7.5">File: {SITE_DATA.sheetFile}</text>
            <text x="8" y="68" fill="var(--ink-soft)" fontSize="7.5">Rev: {SITE_DATA.sheetRev}</text>
            <text x="80" y="68" fill="var(--ink-soft)" fontSize="7.5">Size: {SITE_DATA.sheetSize}</text>
            <text x="152" y="68" fill="var(--ink-soft)" fontSize="7.5">Id: 1/1</text>
          </g>
        </svg>
      )}

      {/* ====================================================================
         MODE 2: 4-LAYER IMPEDANCE-CONTROLLED PCB ROUTING VIEW
         ==================================================================== */}
      {canvasView === "pcb" && (
        <svg className="sch-svg" viewBox="0 0 680 390" role="img" aria-label="4-Layer PCB Layout">
          <rect x="4" y="4" width="672" height="382" fill="#060a10" stroke="var(--sheet)" strokeWidth="1.4" />
          <rect x="36" y="28" width="608" height="334" rx="14" fill="#09111c" stroke="#c56cf0" strokeWidth="2" />
          <rect x="50" y="42" width="580" height="306" fill="rgba(43,217,128,0.04)" stroke="#2bd980" strokeWidth="1" strokeDasharray="5 5" />

          {/* Mounting Holes */}
          {[[66, 58], [614, 58], [66, 332], [614, 332]].map(([cx, cy], idx) => (
            <g key={idx}>
              <circle cx={cx} cy={cy} r="11" fill="none" stroke="#ebc844" strokeWidth="3" />
              <circle cx={cx} cy={cy} r="5.5" fill="#060a10" />
            </g>
          ))}

          {/* L4 Bottom Blue Tracks */}
          <g stroke="#007aff" strokeWidth="2.6" fill="none">
            <polyline points="105,215 180,215 215,180 258,180" />
            <polyline points="105,232 188,232 225,195 258,195" />
            <polyline points="358,155 425,155 455,115 485,115" />
          </g>

          {/* L1 Top Red Tracks & Serpentine Length Tuning */}
          <g stroke="#ff3b30" strokeWidth="2.6" fill="none">
            <polyline points="105,125 185,125 215,155 258,155" />
            <path d="M358,128 L385,128 L385,110 L398,110 L398,144 L411,144 L411,110 L424,110 L424,128 L485,128" />
            <polyline points="358,205 435,205 468,238" strokeWidth="5.5" />
          </g>

          <g className="sch-ic" transform="translate(258, 118)" onClick={() => onSelectProbe("u1")}>
            <rect className="ic-box" x="0" y="0" width="100" height="100" fill="#101929" stroke="#ebc844" strokeWidth="2" />
            <text x="50" y="48" textAnchor="middle" fill="#fff" fontSize="9.5" fontWeight="700">U1 CORTEX-M4</text>
            <text x="50" y="62" textAnchor="middle" fill="#ff2e93" fontSize="8">TP1 · LQFP-64</text>
          </g>

          <g className="sch-ic" transform="translate(485, 76)" onClick={() => onSelectProbe("u2")}>
            <rect className="ic-box" x="0" y="0" width="115" height="76" fill="#101929" stroke="#38e0ff" strokeWidth="2" />
            <text x="57" y="36" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">U2 SENSOR AFE</text>
            <text x="57" y="50" textAnchor="middle" fill="#38e0ff" fontSize="8">TP2 · GUARD RING</text>
          </g>

          <g className="sch-ic" transform="translate(468, 200)" onClick={() => onSelectProbe("u3")}>
            <rect className="ic-box" x="0" y="0" width="128" height="84" fill="#101929" stroke="#2bd980" strokeWidth="2" />
            <rect x="34" y="16" width="60" height="44" fill="#ebc844" opacity="0.9" />
            <text x="64" y="75" textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="700">U3 TMC2209 STAGE</text>
          </g>
        </svg>
      )}

      {/* ====================================================================
         MODE 3: 2D PARAMETRIC SKETCH & 3D EXPLODED MECHANICAL CAD VIEW
         ==================================================================== */}
      {canvasView === "cad" && (
        <svg className="sch-svg" viewBox="0 0 680 390" role="img" aria-label="2D Sketch and 3D Mechanical Assembly">
          <rect x="4" y="4" width="672" height="382" fill="none" stroke="var(--sheet)" strokeWidth="1.4" />
          <line x1="340" y1="14" x2="340" y2="376" stroke="var(--sheet)" strokeWidth="1" strokeDasharray="4 4" />

          {/* Left: 2D Sketch */}
          <g onClick={() => onSelectProbe("u3")} style={{ cursor: "pointer" }}>
            <text x="175" y="34" textAnchor="middle" fill="var(--heading)" fontSize="9" fontWeight="700">
              2D PARAMETRIC SKETCH [FULLY DEFINED]
            </text>
            <line x1="35" y1="200" x2="315" y2="200" stroke="#ff9f1c" strokeWidth="1" strokeDasharray="8 3 2 3" />
            <line x1="175" y1="60" x2="175" y2="340" stroke="#ff9f1c" strokeWidth="1" strokeDasharray="8 3 2 3" />
            <rect x="65" y="100" width="220" height="200" rx="16" fill="rgba(56,224,255,0.08)" stroke="#38e0ff" strokeWidth="2.2" />
            <circle cx="175" cy="200" r="46" fill="none" stroke="#38e0ff" strokeWidth="2" />
            <text x="175" y="84" textAnchor="middle" fill="var(--heading)" fontSize="8.5">120.00 ±0.05 mm</text>
            <rect x="72" y="108" width="14" height="14" rx="2" fill="#2bd980" />
            <text x="79" y="118" textAnchor="middle" fill="#060a10" fontSize="9" fontWeight="700">⊥</text>
            <rect x="208" y="150" width="14" height="14" rx="2" fill="#2bd980" />
            <text x="215" y="160" textAnchor="middle" fill="#060a10" fontSize="9" fontWeight="700">⊙</text>
          </g>

          {/* Right: 3D Exploded Isometric Stack */}
          <g onClick={() => onSelectProbe("u3")} style={{ cursor: "pointer" }}>
            <text x="508" y="34" textAnchor="middle" fill="var(--heading)" fontSize="9" fontWeight="700">
              3D EXPLODED ASSEMBLY [STEP + ENCLOSURE]
            </text>
            <line x1="508" y1="80" x2="508" y2="320" stroke="var(--wire)" strokeWidth="1.2" strokeDasharray="4 4" />
            <polygon points="508,75 620,120 508,165 396,120" fill="rgba(56,224,255,0.28)" stroke="var(--field)" strokeWidth="2" />
            <text x="508" y="124" textAnchor="middle" fill="var(--heading)" fontSize="8.5" fontWeight="700">TOP SHELL (1.6mm)</text>
            <polygon points="508,155 608,195 508,235 408,195" fill="rgba(43,217,128,0.28)" stroke="var(--wire)" strokeWidth="2" />
            <text x="508" y="199" textAnchor="middle" fill="var(--heading)" fontSize="8.5" fontWeight="700">STEP PCB MAINBOARD</text>
            <polygon points="508,235 620,280 508,325 396,280" fill="rgba(235,200,68,0.22)" stroke="var(--hover)" strokeWidth="2" />
            <text x="508" y="284" textAnchor="middle" fill="var(--heading)" fontSize="8.5" fontWeight="700">CNC 6061-T6 BASE</text>
          </g>
        </svg>
      )}
    </div>
  );
}
