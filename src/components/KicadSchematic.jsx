import React from "react";
import { SITE_DATA } from "../data/projectData";

export default function KicadSchematic({ activeProbe, onSelectProbe }) {
  return (
    <div className="sch-frame">
      <svg className="sch-svg" viewBox="0 0 680 390" role="img" aria-label="Interactive KiCad Schematic">
        {/* Outer & Inner Drawing Sheet Borders */}
        <rect x="4" y="4" width="672" height="382" fill="none" stroke="var(--sheet)" strokeWidth="1.4" />
        <rect x="14" y="14" width="652" height="362" fill="none" stroke="var(--sheet)" strokeWidth="1" />

        {/* Subtle Sheet Grid Dots */}
        <g fill="var(--grid-dot)">
          {[60, 120, 180, 240, 300, 360, 420, 480, 540, 600].map((gx) =>
            [60, 120, 180, 240, 300, 340].map((gy) => (
              <circle key={`${gx}-${gy}`} cx={gx} cy={gy} r="1" />
            ))
          )}
        </g>

        {/* Sheet Coordinate Labels (1 2 3 4 / A B C) */}
        <g fill="var(--sheet)" fontSize="7.5">
          <text x="95" y="11">1</text>
          <text x="255" y="11">2</text>
          <text x="425" y="11">3</text>
          <text x="585" y="11">4</text>
          <text x="95" y="384">1</text>
          <text x="255" y="384">2</text>
          <text x="425" y="384">3</text>
          <text x="585" y="384">4</text>
          <text x="7" y="95">A</text>
          <text x="7" y="210">B</text>
          <text x="7" y="325">C</text>
          <text x="668" y="95">A</text>
          <text x="668" y="210">B</text>
          <text x="668" y="325">C</text>
        </g>

        {/* J1: AVR-ISP-6 Input Connector */}
        <g transform="translate(38, 114)">
          <text x="0" y="-18" fill="var(--heading)" fontSize="8">↑ +3V3</text>
          <line x1="12" y1="-14" x2="12" y2="0" stroke="var(--wire)" strokeWidth="1.4" />
          <text x="26" y="-6" fill="var(--field)" fontSize="8.5" fontWeight="700">J1</text>
          <rect x="0" y="0" width="60" height="102" fill="var(--ic-bg)" stroke="var(--sym)" strokeWidth="1.5" />
          <text x="6" y="15" fill="var(--field)" fontSize="7">VCC</text>
          <text x="32" y="24" fill="var(--field)" fontSize="7">MISO</text>
          <text x="36" y="44" fill="var(--field)" fontSize="7">SCK</text>
          <text x="32" y="64" fill="var(--field)" fontSize="7">MOSI</text>
          <text x="36" y="84" fill="var(--field)" fontSize="7">RST</text>
          <text x="12" y="96" fill="var(--field)" fontSize="7">GND</text>
          {/* Red KiCad Pin Numbers (1 3 4 5 2 6) */}
          <g fill="var(--pinnum)" fontSize="6.5">
            <text x="63" y="20">1</text>
            <text x="63" y="40">3</text>
            <text x="63" y="60">4</text>
            <text x="63" y="80">5</text>
            <text x="16" y="-3">2</text>
            <text x="24" y="112">6</text>
          </g>
          <line x1="20" y1="102" x2="20" y2="116" stroke="var(--wire)" strokeWidth="1.4" />
          <polygon points="14,116 26,116 20,123" fill="none" stroke="var(--wire)" strokeWidth="1.3" />
          <text x="0" y="138" fill="var(--field)" fontSize="7.5">AVR-ISP-6</text>
          <text x="0" y="152" fill="var(--field)" fontSize="7">↑ your project plugs in here</text>
        </g>

        {/* ISP Bus (J1 -> U1) with TP1 Test Point */}
        <g stroke="var(--net-isp)" strokeWidth="1.6" fill="none">
          <text x="142" y="130" fill="var(--heading)" fontSize="7.5" stroke="none" fontWeight="700">ISP</text>
          <line className={activeProbe === "u1" ? "net-pulse" : ""} x1="98" y1="136" x2="202" y2="136" />
          <line className={activeProbe === "u1" ? "net-pulse" : ""} x1="98" y1="156" x2="202" y2="156" />
          <line className={activeProbe === "u1" ? "net-pulse" : ""} x1="98" y1="176" x2="202" y2="176" />
          <line className={activeProbe === "u1" ? "net-pulse" : ""} x1="98" y1="196" x2="202" y2="196" />
          <circle cx="152" cy="156" r="3.2" fill="var(--net-isp)" />
          <text x="143" y="149" fill="var(--heading)" fontSize="7" stroke="none">TP1</text>
        </g>

        {/* U1: FIRMWARE / ATmega328P */}
        <g
          className={`sch-ic ${activeProbe === "u1" ? "is-active" : ""}`}
          transform="translate(202, 94)"
          onClick={() => onSelectProbe("u1")}
        >
          <text x="0" y="-8" fill="var(--field)" fontSize="9" fontWeight="700">U1</text>
          <text x="68" y="-18" textAnchor="middle" fill="var(--heading)" fontSize="8">↑ +3V3</text>
          <line x1="68" y1="-14" x2="68" y2="0" stroke="var(--wire)" strokeWidth="1.4" />
          <rect
            className="ic-rect"
            x="0"
            y="0"
            width="142"
            height="146"
            fill="var(--ic-bg)"
            stroke="var(--sym)"
            strokeWidth="1.6"
          />
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

        {/* D1 Status LED + R3 1k */}
        <g transform="translate(244, 240)">
          <line x1="0" y1="0" x2="0" y2="16" stroke="var(--wire)" strokeWidth="1.4" />
          <rect x="-4" y="16" width="8" height="16" fill="none" stroke="var(--sym)" strokeWidth="1.4" />
          <text x="8" y="24" fill="var(--field)" fontSize="7">R3</text>
          <text x="8" y="32" fill="var(--field)" fontSize="6.5">1k</text>
          <line x1="0" y1="32" x2="0" y2="50" stroke="var(--wire)" strokeWidth="1.4" />
          <circle cx="0" cy="58" r="9.5" fill="var(--led)" opacity="0.28" />
          <polygon points="-6,52 6,52 0,64" fill="var(--led)" stroke="var(--led)" strokeWidth="1.2" />
          <line x1="-6" y1="64" x2="6" y2="64" stroke="var(--led)" strokeWidth="1.5" />
          <line x1="0" y1="64" x2="0" y2="78" stroke="var(--wire)" strokeWidth="1.4" />
          <polygon points="-6,78 6,78 0,84" fill="none" stroke="var(--wire)" strokeWidth="1.3" />
          <text x="-26" y="54" fill="var(--field)" fontSize="7.5">D1</text>
          <text x="-42" y="65" fill="var(--field)" fontSize="7">STATUS</text>
          <text x="18" y="70" fill="var(--field)" fontSize="7.5">lit = taking new projects</text>
        </g>

        {/* U1 GND Symbol */}
        <g transform="translate(302, 240)">
          <line x1="0" y1="0" x2="0" y2="18" stroke="var(--wire)" strokeWidth="1.4" />
          <polygon points="-6,18 6,18 0,25" fill="none" stroke="var(--wire)" strokeWidth="1.3" />
        </g>

        {/* I2C Bus + Pull-Up Resistors R1/R2 4k7 + TP2 */}
        <g>
          <text x="418" y="26" textAnchor="middle" fill="var(--heading)" fontSize="8">↑ +3V3</text>
          <rect x="406" y="38" width="8" height="18" fill="none" stroke="var(--sym)" strokeWidth="1.3" />
          <rect x="422" y="38" width="8" height="18" fill="none" stroke="var(--sym)" strokeWidth="1.3" />
          <text x="388" y="45" fill="var(--field)" fontSize="7">R1 R2</text>
          <text x="386" y="54" fill="var(--field)" fontSize="6.5">4k7 4k7</text>
          <polyline
            className={activeProbe === "u2" ? "net-pulse" : ""}
            points="344,126 410,126 410,68 475,68"
            fill="none"
            stroke="var(--net-i2c)"
            strokeWidth="1.5"
          />
          <polyline
            className={activeProbe === "u2" ? "net-pulse" : ""}
            points="344,146 426,146 426,88 475,88"
            fill="none"
            stroke="var(--net-i2c)"
            strokeWidth="1.5"
          />
          <line x1="410" y1="56" x2="410" y2="68" stroke="var(--wire)" strokeWidth="1.3" />
          <line x1="426" y1="56" x2="426" y2="88" stroke="var(--wire)" strokeWidth="1.3" />
          <circle cx="410" cy="68" r="2.5" fill="var(--jn)" />
          <circle cx="426" cy="88" r="2.5" fill="var(--jn)" />
          <circle cx="445" cy="68" r="3" fill="none" stroke="var(--net-i2c)" strokeWidth="1.5" />
          <text x="437" y="61" fill="var(--heading)" fontSize="7">TP2</text>
          <text x="366" y="120" fill="var(--heading)" fontSize="7.5">I2C</text>
        </g>

        {/* U2: ELECTRONICS / SENSORS + IO */}
        <g
          className={`sch-ic ${activeProbe === "u2" ? "is-active" : ""}`}
          transform="translate(475, 42)"
          onClick={() => onSelectProbe("u2")}
        >
          <text x="0" y="-6" fill="var(--field)" fontSize="9" fontWeight="700">U2</text>
          <rect
            className="ic-rect"
            x="0"
            y="0"
            width="122"
            height="72"
            fill="var(--ic-bg)"
            stroke="var(--sym)"
            strokeWidth="1.6"
          />
          <text x="8" y="26" fill="var(--field)" fontSize="7">SDA</text>
          <text x="8" y="46" fill="var(--field)" fontSize="7">SCL</text>
          <text x="70" y="40" textAnchor="middle" fill="var(--field)" fontSize="8">SENSORS + IO</text>
          <text x="0" y="88" fill="var(--field)" fontSize="9" fontWeight="700">ELECTRONICS</text>
        </g>

        {/* STEP/DIR Motion Wires + TP3 */}
        <g stroke="var(--net-motion)" strokeWidth="1.5" fill="none">
          <line className={activeProbe === "u3" ? "net-pulse" : ""} x1="344" y1="194" x2="462" y2="194" />
          <line className={activeProbe === "u3" ? "net-pulse" : ""} x1="344" y1="214" x2="462" y2="214" />
          <circle cx="404" cy="194" r="3" fill="var(--bg)" stroke="var(--net-motion)" strokeWidth="1.5" />
          <circle cx="404" cy="214" r="3" fill="var(--bg)" stroke="var(--net-motion)" strokeWidth="1.5" />
          <text x="396" y="187" fill="var(--heading)" fontSize="7" stroke="none">TP3</text>
        </g>

        {/* U3: CUSTOM SYSTEMS / TMC2209 */}
        <g
          className={`sch-ic ${activeProbe === "u3" ? "is-active" : ""}`}
          transform="translate(462, 170)"
          onClick={() => onSelectProbe("u3")}
        >
          <text x="0" y="-6" fill="var(--field)" fontSize="9" fontWeight="700">U3</text>
          <rect
            className="ic-rect"
            x="0"
            y="0"
            width="100"
            height="80"
            fill="var(--ic-bg)"
            stroke="var(--sym)"
            strokeWidth="1.6"
          />
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
          <rect x="0" y="0" width="216" height="78" fill="var(--bg)" stroke="var(--sheet)" strokeWidth="1.2" />
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
    </div>
  );
}
