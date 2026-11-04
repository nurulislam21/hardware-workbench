import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SITE_DATA } from "../data/projectData";

/* ==========================================================================
   PROCEDURAL 2048px HDI BLACK PCB & KAPTON FLEX TEXTURES
   ========================================================================== */
function createHdiTextures() {
  const cCan = document.createElement("canvas");
  const eCan = document.createElement("canvas");
  cCan.width = eCan.width = 1024;
  cCan.height = eCan.height = 1024;
  const cCtx = cCan.getContext("2d");
  const eCtx = eCan.getContext("2d");

  cCtx.fillStyle = "#070a10";
  cCtx.fillRect(0, 0, 1024, 1024);
  eCtx.fillStyle = "#000000";
  eCtx.fillRect(0, 0, 1024, 1024);

  // Dense routed traces matching image_5deba3.jpg
  for (let i = 0; i < 240; i++) {
    const x = Math.random() * 960 + 32;
    const y = Math.random() * 960 + 32;
    const l1 = Math.random() * 150 + 30;
    const l2 = Math.random() * 90 + 20;
    const glow = i % 2 === 0;

    cCtx.strokeStyle = glow ? "#ff9f1c" : "#78481a";
    cCtx.lineWidth = glow ? 2.8 : 1.4;
    cCtx.beginPath();
    cCtx.moveTo(x, y);
    cCtx.lineTo(x + l1, y);
    cCtx.lineTo(x + l1 + l2, y + l2);
    cCtx.stroke();

    if (glow) {
      eCtx.strokeStyle = i % 4 === 0 ? "#ff5500" : "#ffaa2b";
      eCtx.lineWidth = 3.4;
      eCtx.beginPath();
      eCtx.moveTo(x, y);
      eCtx.lineTo(x + l1, y);
      eCtx.lineTo(x + l1 + l2, y + l2);
      eCtx.stroke();
    }
  }
  return {
    map: new THREE.CanvasTexture(cCan),
    emissiveMap: new THREE.CanvasTexture(eCan)
  };
}

function createChipTex(ref, name, sub) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#0d1118";
  ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = "#2e3b52";
  ctx.lineWidth = 10;
  ctx.strokeRect(18, 18, 476, 476);
  ctx.fillStyle = "#ff9f1c";
  ctx.beginPath();
  ctx.arc(68, 68, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 52px monospace";
  ctx.textAlign = "center";
  ctx.fillText(ref, 256, 210);
  ctx.fillStyle = "#ff9f1c";
  ctx.font = "bold 36px monospace";
  ctx.fillText(name, 256, 275);
  ctx.fillStyle = "#8fa3c4";
  ctx.font = "28px monospace";
  ctx.fillText(sub, 256, 335);
  return new THREE.CanvasTexture(c);
}

export default function PcbCadViewport3D({ activeProbe, onSelectProbe }) {
  const [exploded, setExploded] = useState(true);
  const [liveCurrent, setLiveCurrent] = useState(true);
  const [showClearShell, setShowClearShell] = useState(true);
  const mountRef = useRef(null);
  const stateRef = useRef({ exploded: true, liveCurrent: true });

  useEffect(() => {
    stateRef.current.exploded = exploded;
    stateRef.current.liveCurrent = liveCurrent;
  }, [exploded, liveCurrent]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 680;
    const height = container.clientHeight || 415;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 200);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xdce6f7, 1.4));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(14, 22, 16);
    scene.add(keyLight);

    const amberGlow = new THREE.PointLight(0xff6a00, 6.5, 24);
    amberGlow.position.set(0, -1.2, 1.5);
    scene.add(amberGlow);

    const cyanRim = new THREE.DirectionalLight(0x00e5ff, 1.4);
    cyanRim.position.set(-15, 10, -12);
    scene.add(cyanRim);

    const pcbTex = createHdiTextures();
    const hdiMat = new THREE.MeshStandardMaterial({
      map: pcbTex.map,
      emissiveMap: pcbTex.emissiveMap,
      emissive: new THREE.Color(0xff7a00),
      emissiveIntensity: 1.3,
      roughness: 0.28,
      metalness: 0.35
    });

    const kaptonMat = new THREE.MeshPhysicalMaterial({
      color: 0xd95300,
      emissive: 0xff5500,
      emissiveIntensity: 0.75,
      roughness: 0.2,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });

    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf5c242, roughness: 0.16, metalness: 0.95 });
    const silverMat = new THREE.MeshStandardMaterial({ color: 0xd0d8e4, roughness: 0.22, metalness: 0.9 });
    const clearShellMat = new THREE.MeshPhysicalMaterial({
      color: 0xffe8d6,
      transparent: true,
      opacity: 0.28,
      roughness: 0.08,
      transmission: 0.65
    });

    const root = new THREE.Group();
    root.rotation.y = -0.35;
    scene.add(root);

    const tier0Base = new THREE.Group();
    const tier1MainPcb = new THREE.Group();
    const tier2Flex = new THREE.Group();
    const tier3Mezz = new THREE.Group();
    const tier4Shell = new THREE.Group();
    root.add(tier0Base, tier1MainPcb, tier2Flex, tier3Mezz, tier4Shell);

    // Tier 1 (Bottom): CNC Chassis + Twin Optic Barrels (Matches bottom of image_5deedf.jpg)
    const baseTray = new THREE.Mesh(
      new THREE.BoxGeometry(11.2, 0.42, 7.4),
      new THREE.MeshStandardMaterial({ color: 0x12161f, roughness: 0.35, metalness: 0.8 })
    );
    baseTray.position.y = -1.4;
    tier0Base.add(baseTray);

    const barrelGeo = new THREE.CylinderGeometry(0.48, 0.48, 1.3, 24).rotateX(Math.PI / 2);
    const b1 = new THREE.Mesh(barrelGeo, silverMat);
    b1.position.set(-0.4, -0.9, 2.5);
    const b2 = b1.clone();
    b2.position.set(0.9, -0.9, 2.5);
    tier0Base.add(b1, b2);

    // Tier 2 (Main Board): Stepped HDI Rigid PCB + Silicon Chips + 200 SMD Parts (Matches image_5deba3.jpg)
    const mainBoard = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.22, 6.6), hdiMat);
    tier1MainPcb.add(mainBoard);

    const chipMat = new THREE.MeshStandardMaterial({ color: 0x141822, roughness: 0.3 });
    const u1Core = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.28, 2.0),
      new THREE.MeshStandardMaterial({ map: createChipTex("U1", "STM32F405", "CORTEX-M4") })
    );
    u1Core.position.set(0.6, 0.18, 0.1);
    u1Core.userData = { probeId: "u1" };
    tier1MainPcb.add(u1Core);

    for (let i = 0; i < 160; i++) {
      const rx = (Math.random() - 0.5) * 9.0;
      const rz = (Math.random() - 0.5) * 5.6;
      if (Math.hypot(rx - 0.6, rz - 0.1) < 1.4) continue;
      const smd = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.14, 0.16),
        i % 3 === 0 ? goldMat : chipMat
      );
      smd.position.set(rx, 0.15, rz);
      tier1MainPcb.add(smd);
    }

    // Tier 3 (Flex): S-Curved Kapton Flexible Wings + Glowing Current Pulses (Matches image_5deba3.jpg)
    const flexCurves = [
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.4, 0.15, 0.2),
        new THREE.Vector3(-2.8, 0.4, 0.2),
        new THREE.Vector3(-3.6, 0.95, 0.2),
        new THREE.Vector3(-4.8, 0.95, 0.2)
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(3.2, 0.15, -0.4),
        new THREE.Vector3(4.6, 0.5, -0.4),
        new THREE.Vector3(4.4, 1.15, -0.4),
        new THREE.Vector3(2.8, 1.15, -0.4)
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4.5, 0.15, -1.8),
        new THREE.Vector3(-6.2, -0.15, -0.6),
        new THREE.Vector3(-7.8, -0.2, 0.4)
      ])
    ];

    const pulses = [];
    const pulseGeo = new THREE.SphereGeometry(0.09, 12, 12);
    const amberPulse = new THREE.MeshBasicMaterial({ color: 0xffd166 });
    const cyanPulse = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    flexCurves.forEach((curve, idx) => {
      [-0.24, -0.08, 0.08, 0.24].forEach((off) => {
        const pts = curve.getPoints(30).map((p) => new THREE.Vector3(p.x, p.y, p.z + off));
        const sub = new THREE.CatmullRomCurve3(pts);
        tier2Flex.add(new THREE.Mesh(new THREE.TubeGeometry(sub, 32, 0.06, 8, false), kaptonMat));
      });
      for (let p = 0; p < 8; p++) {
        const dot = new THREE.Mesh(pulseGeo, idx === 1 ? cyanPulse : amberPulse);
        tier2Flex.add(dot);
        pulses.push({ mesh: dot, curve, t: p / 8, speed: 0.0045 + idx * 0.001 });
      }
    });

    // Tier 4 (Mezzanines): Upper Split Daughterboards (Matches image_5deedf.jpg)
    const mezzBoard = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.18, 3.2), hdiMat);
    mezzBoard.position.set(0.8, 1.15, -0.4);
    mezzBoard.userData = { probeId: "u2" };
    const u2Sensor = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.22, 1.4),
      new THREE.MeshStandardMaterial({ map: createChipTex("U2", "MEMS-IMU", "3D SENSOR") })
    );
    u2Sensor.position.set(0.8, 1.32, -0.4);
    u2Sensor.userData = { probeId: "u2" };
    tier3Mezz.add(mezzBoard, u2Sensor);

    // Tier 5 (Top Shell): Translucent Ribbed Polycarbonate Cover (Matches image_5deedf.jpg)
    const topCanopy = new THREE.Mesh(new THREE.BoxGeometry(10.4, 0.5, 6.8), clearShellMat);
    topCanopy.position.set(0.5, 2.0, -0.2);
    const canopyWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(topCanopy.geometry),
      new THREE.LineBasicMaterial({ color: 0xff9f1c, transparent: true, opacity: 0.65 })
    );
    topCanopy.add(canopyWire);
    tier4Shell.add(topCanopy);

    for (let rx = -4.2; rx <= 4.2; rx += 0.9) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.42, 6.2), clearShellMat);
      rib.position.set(rx, 2.0, -0.2);
      tier4Shell.add(rib);
    }

    // Orbit Drag Controls
    let isDragging = false;
    let px = 0;
    let py = 0;
    const sph = { radius: 19.5, theta: 0.68, phi: 1.05 };

    const updateCam = () => {
      camera.position.x = sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta);
      camera.position.y = sph.radius * Math.cos(sph.phi);
      camera.position.z = sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta);
      camera.lookAt(0, 0.2, 0);
    };
    updateCam();

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const dom = renderer.domElement;
    const onDown = (e) => {
      isDragging = true;
      px = e.clientX;
      py = e.clientY;
    };
    const onMove = (e) => {
      if (!isDragging) return;
      sph.theta -= (e.clientX - px) * 0.007;
      sph.phi = Math.max(0.25, Math.min(Math.PI - 0.25, sph.phi - (e.clientY - py) * 0.007));
      px = e.clientX;
      py = e.clientY;
      updateCam();
    };
    const onUp = (e) => {
      isDragging = false;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects([u1Core, u2Sensor, mezzBoard], true);
      if (hits.length > 0 && hits[0].object.userData?.probeId) {
        onSelectProbe(hits[0].object.userData.probeId);
      }
    };
    const onWheel = (e) => {
      e.preventDefault();
      sph.radius = Math.max(9.5, Math.min(28, sph.radius + e.deltaY * 0.012));
      updateCam();
    };

    dom.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    dom.addEventListener("wheel", onWheel, { passive: false });

    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const st = stateRef.current;
      const exp = st.exploded ? 1 : 0.12;

      tier0Base.position.y = THREE.MathUtils.lerp(tier0Base.position.y, exp * -1.0, 0.08);
      tier2Flex.position.y = THREE.MathUtils.lerp(tier2Flex.position.y, exp * 0.4, 0.08);
      tier3Mezz.position.y = THREE.MathUtils.lerp(tier3Mezz.position.y, exp * 0.9, 0.08);
      tier4Shell.position.y = THREE.MathUtils.lerp(tier4Shell.position.y, exp * 1.4, 0.08);

      pulses.forEach((p) => {
        p.mesh.visible = st.liveCurrent;
        if (st.liveCurrent) {
          p.t = (p.t + p.speed) % 1;
          p.mesh.position.copy(p.curve.getPointAt(p.t));
        }
      });

      if (!isDragging) root.rotation.y += 0.0016;
      renderer.render(scene, camera);
    };
    animate();

    const ro = new ResizeObserver(() => {
      if (!container) return;
      const nw = container.clientWidth || 680;
      const nh = container.clientHeight || 415;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(reqId);
      ro.disconnect();
      dom.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      dom.removeEventListener("wheel", onWheel);
      renderer.dispose();
    };
  }, [onSelectProbe]);

  return (
    <div className="cad-frame">
      <div className="cad-frame__bar">
        <div className="cad-model-pills">
          <button
            type="button"
            className="cad-pill is-active"
            onClick={() => setExploded(!exploded)}
          >
            {exploded ? "💥 5-TIER EXPLODED STACK" : "🧊 5-TIER MATED STACK"}
          </button>
          <button
            type="button"
            className={`cad-pill ${liveCurrent ? "is-active" : ""}`}
            onClick={() => setLiveCurrent(!liveCurrent)}
          >
            ⚡ {liveCurrent ? "CURRENT: LIVE" : "CURRENT: PAUSED"}
          </button>
          <button
            type="button"
            className={`cad-pill ${showClearShell ? "is-active" : ""}`}
            onClick={() => setShowClearShell(!showClearShell)}
          >
            🛡️ RIBBED SHELL
          </button>
        </div>
      </div>

      <div ref={mountRef} className="cad-stage" style={{ height: "415px", cursor: "grab" }} />

      {/* Live Signal Trace Overlay matching image_5deba3.jpg */}
      <svg className="signal-hud-overlay" viewBox="0 0 680 415" preserveAspectRatio="none">
        <path d="M 14,34 L 14,14 L 34,14" fill="none" stroke="var(--field)" strokeWidth="1.5" opacity="0.7" />
        <path d="M 666,34 L 666,14 L 646,14" fill="none" stroke="var(--field)" strokeWidth="1.5" opacity="0.7" />
        <path d="M 14,381 L 14,401 L 34,401" fill="none" stroke="var(--field)" strokeWidth="1.5" opacity="0.7" />
        <path d="M 666,381 L 666,401 L 646,401" fill="none" stroke="var(--field)" strokeWidth="1.5" opacity="0.7" />

        <g fill="none" strokeWidth="2.2" opacity="0.85">
          <polyline className="signal-path" points="24,340 115,340 155,295 235,295" stroke="#ff9f1c" />
          <polyline className="signal-path" points="656,65 565,65 525,105 450,105" stroke="#00e5ff" />
          <polyline className="signal-path" points="656,340 555,340 515,295 445,295" stroke="#10b981" />
        </g>

        <g fontFamily="monospace" fontSize="9" fontWeight="700">
          <circle cx="235" cy="295" r="4" fill="#ff9f1c" />
          <text x="165" y="286" fill="#ff9f1c">TP1 · +3V3_CORE_ISP</text>
          <circle cx="450" cy="105" r="4" fill="#00e5ff" />
          <text x="460" y="98" fill="#00e5ff">TP2 · I2C_KAPTON_FPC</text>
          <circle cx="445" cy="295" r="4" fill="#10b981" />
          <text x="455" y="286" fill="#10b981">TP3 · 24V_PWM_STAGE</text>
        </g>
      </svg>

      <div className="cad-frame__foot">
        <span>
          RIGID-FLEX STACKUP: <strong style={{ color: "#fff" }}>5-TIER EXPLODED HDI PCB + KAPTON WINGS + RIBBED SHELL</strong>
        </span>
        <span style={{ color: "var(--wire)" }}>
          ● CLICK IC TO PROBE · DRAG TO ORBIT 360° · SCROLL TO ZOOM
        </span>
      </div>
    </div>
  );
}
