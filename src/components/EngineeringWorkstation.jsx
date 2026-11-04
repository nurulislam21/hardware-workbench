import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SITE_DATA } from "../data/projectData";

// Procedural Blueprint Sheet Texture for Stage 01 (Matches tabletop drawings in image_7a1700.jpg)
function createBlueprintSheetTexture(title, code) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 384;
  const ctx = c.getContext("2d");

  ctx.fillStyle = "#e8eef5";
  ctx.fillRect(0, 0, 512, 384);
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 4;
  ctx.strokeRect(12, 12, 488, 360);

  // Technical orthographic projection circles & centerlines
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(160, 180, 75, 0, Math.PI * 2);
  ctx.arc(160, 180, 42, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeRect(280, 110, 175, 140);
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 20px monospace";
  ctx.fillText(title, 28, 46);
  ctx.fillStyle = "#0078d4";
  ctx.font = "16px monospace";
  ctx.fillText(code, 28, 350);

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

// Procedural Hologram HUD Texture for Stage 01 floating glass screens
function createHologramTexture(label, sub) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 320;
  const ctx = c.getContext("2d");

  ctx.fillStyle = "rgba(0, 28, 48, 0.55)";
  ctx.fillRect(0, 0, 512, 320);
  ctx.strokeStyle = "#00e5ff";
  ctx.lineWidth = 4;
  ctx.strokeRect(8, 8, 496, 304);

  // Holographic schematic / gear rings
  ctx.strokeStyle = "rgba(0, 229, 255, 0.8)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(140, 160, 72, 0, Math.PI * 2);
  ctx.arc(140, 160, 44, 0, Math.PI * 2);
  ctx.moveTo(240, 100);
  ctx.lineTo(460, 100);
  ctx.moveTo(240, 160);
  ctx.lineTo(440, 160);
  ctx.moveTo(240, 220);
  ctx.lineTo(420, 220);
  ctx.stroke();

  ctx.fillStyle = "#00e5ff";
  ctx.font = "bold 24px monospace";
  ctx.fillText(label, 240, 75);
  ctx.fillStyle = "#a5f3fc";
  ctx.font = "18px monospace";
  ctx.fillText(sub, 240, 138);

  return new THREE.CanvasTexture(c);
}

// Procedural HDI Black PCB Texture with Glowing Amber Traces for Stage 03, 04, 05
function createLifecyclePcbTextures() {
  const cCan = document.createElement("canvas");
  const eCan = document.createElement("canvas");
  cCan.width = eCan.width = 1024;
  cCan.height = eCan.height = 1024;
  const cCtx = cCan.getContext("2d");
  const eCtx = eCan.getContext("2d");

  cCtx.fillStyle = "#0a0d13";
  cCtx.fillRect(0, 0, 1024, 1024);
  eCtx.fillStyle = "#000000";
  eCtx.fillRect(0, 0, 1024, 1024);

  for (let i = 0; i < 180; i++) {
    const x = Math.random() * 940 + 30;
    const y = Math.random() * 940 + 30;
    const l1 = Math.random() * 130 + 25;
    const l2 = Math.random() * 80 + 20;
    const glow = i % 2 === 0;

    cCtx.strokeStyle = glow ? "#ff9f1c" : "#785224";
    cCtx.lineWidth = glow ? 2.5 : 1.5;
    cCtx.beginPath();
    cCtx.moveTo(x, y);
    cCtx.lineTo(x + l1, y);
    cCtx.lineTo(x + l1 + l2, y + l2);
    cCtx.stroke();

    if (glow) {
      eCtx.strokeStyle = i % 4 === 0 ? "#ff6a00" : "#ffaa2b";
      eCtx.lineWidth = 3;
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

export default function EngineeringWorkstation() {
  const [activeStage, setActiveStage] = useState(0); // 0:Plan, 1:MCAD, 2:ECAD, 3:FW, 4:Ready
  const [cadWireframe, setCadWireframe] = useState(false);
  const [cadSectionCut, setCadSectionCut] = useState(false);
  const [cadExplode, setCadExplode] = useState(true);
  const [pipExpanded, setPipExpanded] = useState(false);
  const [selectedNet, setSelectedNet] = useState("NET_SPI1_DMA");
  const [isrSpeed, setIsrSpeed] = useState(1.0);
  const [cliLogs, setCliLogs] = useState([
    "noman@ubuntu:~/hardware-workbench$ st-info --probe",
    "Found 1 stlink programmers · DEV_ID: 0x413 (STM32F405xx)",
    "noman@ubuntu:~/hardware-workbench$ pio run -t upload",
    "SUCCESS: [===       ] 28.4% Flash · Streaming 4.0kHz DMA Telemetry"
  ]);

  const stepRefs = useRef([]);
  const mountRef = useRef(null);
  const stateRef = useRef({
    stage: 0,
    cadWireframe: false,
    cadSectionCut: false,
    cadExplode: true,
    isrSpeed: 1.0,
    zoomDelta: 0
  });

  // Sync React controls into the 60fps Three.js loop
  useEffect(() => {
    stateRef.current.stage = activeStage;
    stateRef.current.cadWireframe = cadWireframe;
    stateRef.current.cadSectionCut = cadSectionCut;
    stateRef.current.cadExplode = cadExplode;
    stateRef.current.isrSpeed = isrSpeed;
  }, [activeStage, cadWireframe, cadSectionCut, cadExplode, isrSpeed]);

  // Scroll-Driven IntersectionObserver: Updates active stage automatically as user scrolls
  useEffect(() => {
    const observers = [];
    stepRefs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveStage(idx);
            }
          });
        },
        { threshold: 0.52 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Single Unified 60fps Three.js Lifecycle Scene (Never reloads or flickers on scroll)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 620;
    const height = container.clientHeight || 455;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 200);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.localClippingEnabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Dynamic Clipping Plane for Stage 02 CAD Section View
    const clipPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 100);

    // Studio & Amber Under-Glow Lights
    scene.add(new THREE.AmbientLight(0xdce6f7, 1.45));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(12, 22, 15);
    scene.add(keyLight);

    const amberUnderLight = new THREE.PointLight(0xff6a00, 5.5, 22);
    amberUnderLight.position.set(0, -1.5, 1.5);
    scene.add(amberUnderLight);

    const cyanHoloLight = new THREE.PointLight(0x00e5ff, 3.5, 20);
    cyanHoloLight.position.set(0, 3.2, -2.0);
    scene.add(cyanHoloLight);

    const root = new THREE.Group();
    scene.add(root);

    /* ----------------------------------------------------------------------
       GROUP A: STAGE 01 HOLOGRAPHIC SCREENS & TABLETOP DRAWINGS
       (Matches image_7a1700.jpg)
       ---------------------------------------------------------------------- */
    const planGroup = new THREE.Group();
    root.add(planGroup);

    // 4 Flat Technical Blueprint Sheets on the Workbench Table
    const sheetPositions = [
      [-4.2, -2.1, 2.2, -0.08],
      [0.2, -2.1, 2.6, 0.05],
      [4.5, -2.1, 2.1, -0.04],
      [-3.8, -2.1, -1.6, 0.12]
    ];
    sheetPositions.forEach(([sx, sy, sz, rot], idx) => {
      const sheetMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(3.4, 2.4),
        new THREE.MeshBasicMaterial({
          map: createBlueprintSheetTexture(`SHEET 0${idx + 1} · ORTHO`, `DWG-210${idx}.DWG`),
          side: THREE.DoubleSide
        })
      );
      sheetMesh.rotation.x = -Math.PI / 2;
      sheetMesh.rotation.z = rot;
      sheetMesh.position.set(sx, sy, sz);
      planGroup.add(sheetMesh);
    });

    // 3 Floating Translucent Cyan Holographic Projection Screens above the Model
    const holoSpecs = [
      [-3.8, 2.35, -1.8, 0.25, "SYS_BLOCK_01", "POWER & BUS TREE"],
      [0, 2.65, -2.2, 0, "CAD_ENVELOPE", "TOLERANCE ±0.05MM"],
      [3.8, 2.35, -1.8, -0.25, "BOM_VERIFIED", "42 ACTIVE PARTS"]
    ];
    holoSpecs.forEach(([hx, hy, hz, ry, t1, t2]) => {
      const hScreen = new THREE.Mesh(
        new THREE.PlaneGeometry(3.1, 1.9),
        new THREE.MeshBasicMaterial({
          map: createHologramTexture(t1, t2),
          transparent: true,
          opacity: 0.88,
          side: THREE.DoubleSide
        })
      );
      hScreen.position.set(hx, hy, hz);
      hScreen.rotation.y = ry;
      planGroup.add(hScreen);

      // Glowing Cyan Leader Line connecting Hologram to the 3D Hardware Core
      const leaderGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(hx, hy - 0.95, hz),
        new THREE.Vector3(hx * 0.35, 0.3, 0)
      ]);
      planGroup.add(
        new THREE.Line(leaderGeo, new THREE.LineBasicMaterial({ color: 0x00e5ff }))
      );
    });

    /* ----------------------------------------------------------------------
       GROUP B: 3D MECHANICAL CAD EXOSKELETON & RIBBED POLYCARBONATE HOUSING
       (Matches image_79bce3.jpg & image_5deedf.jpg)
       ---------------------------------------------------------------------- */
    const mcadBottomChassis = new THREE.Group();
    const mcadTopCanopy = new THREE.Group();
    root.add(mcadBottomChassis, mcadTopCanopy);

    const anodizedHullMat = new THREE.MeshStandardMaterial({
      color: 0x8f2424,
      roughness: 0.22,
      metalness: 0.68,
      clippingPlanes: [clipPlane]
    });
    const cncBaseMat = new THREE.MeshStandardMaterial({
      color: 0x1b222d,
      roughness: 0.35,
      metalness: 0.82,
      clippingPlanes: [clipPlane]
    });
    const clearRibbedMat = new THREE.MeshPhysicalMaterial({
      color: 0xffecd6,
      transparent: true,
      opacity: 0.32,
      roughness: 0.1,
      metalness: 0.05,
      transmission: 0.6,
      clippingPlanes: [clipPlane]
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf5c242,
      roughness: 0.18,
      metalness: 0.94,
      clippingPlanes: [clipPlane]
    });
    const silverMat = new THREE.MeshStandardMaterial({
      color: 0xd0d8e4,
      roughness: 0.22,
      metalness: 0.88,
      clippingPlanes: [clipPlane]
    });

    // Lower CNC Tray + Twin Front Optic/Thruster Barrels + Cooling Louvers
    const lowerTray = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.42, 6.2), cncBaseMat);
    lowerTray.position.y = -1.2;
    mcadBottomChassis.add(lowerTray);

    const barrelGeo = new THREE.CylinderGeometry(0.48, 0.48, 1.3, 24).rotateX(Math.PI / 2);
    const b1 = new THREE.Mesh(barrelGeo, silverMat);
    b1.position.set(-0.5, -0.8, 2.4);
    const b2 = b1.clone();
    b2.position.set(0.8, -0.8, 2.4);
    mcadBottomChassis.add(b1, b2);

    // Upper Ribbed Polycarbonate Shell + Structural Exoskeleton Side Fairings
    const clearTopCover = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.42, 5.4), clearRibbedMat);
    clearTopCover.position.y = 1.65;
    const coverEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(clearTopCover.geometry),
      new THREE.LineBasicMaterial({ color: 0xff9f1c, transparent: true, opacity: 0.7 })
    );
    clearTopCover.add(coverEdges);
    mcadTopCanopy.add(clearTopCover);

    // Internal Waffle Ribs on Top Cover
    for (let rx = -3.6; rx <= 3.6; rx += 0.8) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.38, 5.0), clearRibbedMat);
      rib.position.set(rx, 1.65, 0);
      mcadTopCanopy.add(rib);
    }

    // Side Anodized Structural Fairings (Matches crimson-bronze CAD exoskeleton in image_79bce3.jpg)
    const leftFairing = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.1, 5.6), anodizedHullMat);
    leftFairing.position.set(-4.1, 0.8, 0);
    const rightFairing = leftFairing.clone();
    rightFairing.position.set(4.1, 0.8, 0);
    const orangeHatch = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, 0.16, 24),
      new THREE.MeshStandardMaterial({ color: 0xff9f1c, roughness: 0.3 })
    );
    orangeHatch.position.set(0, 1.9, -0.8);
    mcadTopCanopy.add(leftFairing, rightFairing, orangeHatch);

    /* ----------------------------------------------------------------------
       GROUP C: 5-TIER RIGID-FLEX HDI PCB + GLOWING KAPTON WINGS + PULSES
       (Matches image_5deedf.jpg & image_5deba3.jpg)
       ---------------------------------------------------------------------- */
    const ecadMainPcb = new THREE.Group();
    const ecadMezzPcb = new THREE.Group();
    const ecadKaptonFlex = new THREE.Group();
    root.add(ecadMainPcb, ecadMezzPcb, ecadKaptonFlex);

    const pcbTex = createLifecyclePcbTextures();
    const hdiBoardMat = new THREE.MeshStandardMaterial({
      map: pcbTex.map,
      emissiveMap: pcbTex.emissiveMap,
      emissive: new THREE.Color(0xff8800),
      emissiveIntensity: 1.2,
      roughness: 0.28,
      metalness: 0.35,
      clippingPlanes: [clipPlane]
    });

    const kaptonFlexMat = new THREE.MeshPhysicalMaterial({
      color: 0xd95300,
      emissive: 0xff5500,
      emissiveIntensity: 0.65,
      roughness: 0.2,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      clippingPlanes: [clipPlane]
    });

    const mainBoard = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.18, 5.4), hdiBoardMat);
    ecadMainPcb.add(mainBoard);

    // BGA / QFP Silicon Chips & Dense SMD Passives on Main PCB
    const chipMat = new THREE.MeshStandardMaterial({ color: 0x181e29, roughness: 0.3, clippingPlanes: [clipPlane] });
    const u1Chip = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.22, 1.8), chipMat);
    u1Chip.position.set(0.5, 0.18, 0);
    const u2Chip = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.2, 1.3), chipMat);
    u2Chip.position.set(-1.8, 0.18, -0.8);
    ecadMainPcb.add(u1Chip, u2Chip);

    for (let i = 0; i < 140; i++) {
      const sx = (Math.random() - 0.5) * 7.6;
      const sz = (Math.random() - 0.5) * 4.6;
      if (Math.hypot(sx - 0.5, sz) < 1.2) continue;
      const smd = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.14, 0.16),
        i % 3 === 0 ? goldMat : chipMat
      );
      smd.position.set(sx, 0.15, sz);
      ecadMainPcb.add(smd);
    }

    // Upper Mezzanine Daughterboard
    const mezzBoard = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.16, 3.0), hdiBoardMat);
    mezzBoard.position.set(0.6, 0.95, -0.3);
    ecadMezzPcb.add(mezzBoard);

    // S-Curved Glowing Kapton Flexible Wings
    const flexCurves = [
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.8, 0.12, -0.6),
        new THREE.Vector3(-4.2, 0.38, -0.4),
        new THREE.Vector3(-5.5, -0.15, 0.2),
        new THREE.Vector3(-6.8, -0.18, 0.6)
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.5, 0.12, 2.0),
        new THREE.Vector3(0.5, -0.22, 2.9),
        new THREE.Vector3(1.1, -0.45, 3.8),
        new THREE.Vector3(1.8, -0.48, 4.6)
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(3.4, 0.12, -0.3),
        new THREE.Vector3(4.5, 0.55, -0.3),
        new THREE.Vector3(4.3, 0.95, -0.3),
        new THREE.Vector3(2.8, 0.95, -0.3)
      ])
    ];

    const currentPulses = [];
    const pulseGeo = new THREE.SphereGeometry(0.09, 10, 10);
    const amberDotMat = new THREE.MeshBasicMaterial({ color: 0xffe066 });
    const cyanDotMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    flexCurves.forEach((curve, idx) => {
      [-0.24, -0.08, 0.08, 0.24].forEach((off) => {
        const pts = curve.getPoints(28).map((p) => new THREE.Vector3(p.x, p.y, p.z + off));
        const sub = new THREE.CatmullRomCurve3(pts);
        ecadKaptonFlex.add(
          new THREE.Mesh(new THREE.TubeGeometry(sub, 30, 0.055, 8, false), kaptonFlexMat)
        );
      });

      for (let p = 0; p < 10; p++) {
        const dot = new THREE.Mesh(pulseGeo, idx === 1 ? cyanDotMat : amberDotMat);
        ecadKaptonFlex.add(dot);
        currentPulses.push({
          mesh: dot,
          curve,
          t: p / 10,
          baseSpeed: 0.004 + idx * 0.001
        });
      }
    });

    // Pointer Drag Orbit (Does NOT hijack normal page scrolling!)
    let isDragging = false;
    let px = 0;
    let py = 0;
    const sph = { radius: 17.5, theta: 0.58, phi: 1.08 };

    const updateCam = () => {
      camera.position.x = sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta);
      camera.position.y = sph.radius * Math.cos(sph.phi);
      camera.position.z = sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta);
      camera.lookAt(0, 0.1, 0);
    };
    updateCam();

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
    const onUp = () => {
      isDragging = false;
    };

    dom.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const st = stateRef.current;

      // Apply button zoom delta if clicked
      if (st.zoomDelta !== 0) {
        sph.radius = Math.max(9, Math.min(28, sph.radius + st.zoomDelta));
        st.zoomDelta = 0;
        updateCam();
      }

      // Section-Cut Clipping Plane in Stage 02
      clipPlane.constant = THREE.MathUtils.lerp(
        clipPlane.constant,
        st.cadSectionCut ? 0.4 : 100,
        0.1
      );

      // Wireframe toggle
      anodizedHullMat.wireframe = st.cadWireframe;
      cncBaseMat.wireframe = st.cadWireframe;

      // Stage-Driven 3D Visibility & Explode Morphing
      // 0: Planning, 1: 3D CAD, 2: 3D PCB, 3: Firmware, 4: Product Ready
      planGroup.visible = st.stage === 0;
      mcadBottomChassis.visible = st.stage !== 2;
      mcadTopCanopy.visible = st.stage === 0 || st.stage === 1 || st.stage === 4;

      // Target Z-Explode heights per stage:
      let targetCanopyY = 0;
      let targetMezzY = 0;
      let targetBaseY = 0;

      if (st.stage === 0) {
        targetCanopyY = 0.55;
        targetMezzY = 0.25;
        targetBaseY = -0.35;
      } else if (st.stage === 1) {
        targetCanopyY = st.cadExplode ? 0.95 : 0.0;
        targetMezzY = st.cadExplode ? 0.35 : 0.0;
        targetBaseY = st.cadExplode ? -0.65 : 0.0;
      } else if (st.stage === 2 || st.stage === 3) {
        targetCanopyY = 1.4;
        targetMezzY = 0.55;
        targetBaseY = -0.5;
      } else if (st.stage === 4) {
        // Stage 05 Product Ready: All tiers smoothly lock together!
        targetCanopyY = -0.55;
        targetMezzY = -0.25;
        targetBaseY = 0.45;
      }

      mcadTopCanopy.position.y = THREE.MathUtils.lerp(mcadTopCanopy.position.y, targetCanopyY, 0.07);
      ecadMezzPcb.position.y = THREE.MathUtils.lerp(ecadMezzPcb.position.y, targetMezzY, 0.07);
      mcadBottomChassis.position.y = THREE.MathUtils.lerp(mcadBottomChassis.position.y, targetBaseY, 0.07);

      // Animate Live Current Pulses (Speed scales with Firmware ISR clock in Stage 04!)
      currentPulses.forEach((p) => {
        p.t = (p.t + p.baseSpeed * st.isrSpeed) % 1;
        p.mesh.position.copy(p.curve.getPointAt(p.t));
      });

      if (!isDragging) {
        root.rotation.y += 0.0018;
      }
      renderer.render(scene, camera);
    };
    animate();

    const ro = new ResizeObserver(() => {
      if (!container) return;
      const nw = container.clientWidth || 620;
      const nh = container.clientHeight || 455;
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
      renderer.dispose();
    };
  }, []);

  const currentStage = SITE_DATA.pipelineStages[activeStage] || SITE_DATA.pipelineStages[0];

  const windowThemeClass =
    activeStage === 0
      ? "lc-window--plan"
      : activeStage === 1
      ? "lc-window--mcad"
      : activeStage === 2
      ? "lc-window--ecad"
      : activeStage === 3
      ? "lc-window--fw"
      : "lc-window--ready";

  const runCliCommand = (cmd, speed, logLine) => {
    setIsrSpeed(speed);
    setCliLogs((prev) => [...prev.slice(-4), `noman@ubuntu:~/hardware-workbench$ ${cmd}`, logLine]);
  };

  return (
    <div className="lc-wrapper">
      {/* ==================== LEFT COLUMN: 5 SCROLL-DRIVEN STAGES ==================== */}
      <div className="lc-rail">
        {SITE_DATA.pipelineStages.map((st, idx) => (
          <div
            key={st.id}
            ref={(el) => (stepRefs.current[idx] = el)}
            className={`lc-card ${activeStage === idx ? "is-active" : ""}`}
            onClick={() => setActiveStage(idx)}
          >
            <div className="lc-card__head">
              <span>{st.num}</span>
              <span>{st.file}</span>
            </div>
            <h3>{st.title}</h3>
            <p>{st.desc}</p>
            <div className="probe-file-pills">
              {st.files.map((f) => (
                <span key={f} className="file-pill">
                  {f}
                </span>
              ))}
            </div>
            <div className="lc-progress-bar">
              <div
                className="lc-progress-fill"
                style={{ width: activeStage >= idx ? "100%" : "18%" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ==================== RIGHT COLUMN: MORPHING 3D WORKSPACE WINDOW ==================== */}
      <div className={`lc-window ${windowThemeClass}`}>
        {/* 1. Dynamic Application Titlebar */}
        <div className="lc-titlebar">
          <span>
            {activeStage === 0 && "📐 Holographic Architecture Studio — "}
            {activeStage === 1 && "🧊 3D Mechanical CAD Connected — "}
            {activeStage === 2 && "▣ ECAD 3D Rigid-Flex Designer — "}
            {activeStage === 3 && "⟨/⟩ Firmware IDE + Ubuntu Bash — "}
            {activeStage === 4 && "✅ Production Release Sign-Off — "}
            <strong>{currentStage.file}</strong>
          </span>

          <div className="lc-stage-pills">
            {["01 Plan", "02 3D CAD", "03 PCB", "04 Firmware", "05 Ready"].map((lbl, idx) => (
              <button
                key={lbl}
                type="button"
                className={`lc-stage-pill ${activeStage === idx ? "is-on" : ""}`}
                onClick={() => setActiveStage(idx)}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Stage-Specific Command Ribbon */}
        <div className="lc-ribbon">
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {activeStage === 1 && (
              <>
                <button
                  type="button"
                  className={`lc-tool-btn ${cadExplode ? "is-active" : ""}`}
                  onClick={() => setCadExplode(!cadExplode)}
                >
                  💥 Exploded View
                </button>
                <button
                  type="button"
                  className={`lc-tool-btn ${cadSectionCut ? "is-active" : ""}`}
                  onClick={() => setCadSectionCut(!cadSectionCut)}
                >
                  🪚 Section View (X-Plane)
                </button>
                <button
                  type="button"
                  className={`lc-tool-btn ${cadWireframe ? "is-active" : ""}`}
                  onClick={() => setCadWireframe(!cadWireframe)}
                >
                  📐 Wireframe
                </button>
              </>
            )}

            {activeStage === 2 && (
              <>
                <button
                  type="button"
                  className={`lc-tool-btn ${!pipExpanded ? "is-active" : ""}`}
                  onClick={() => setPipExpanded(false)}
                >
                  🔥 3D Rigid-Flex Stack (Key: 3)
                </button>
                <button
                  type="button"
                  className={`lc-tool-btn ${pipExpanded ? "is-active" : ""}`}
                  onClick={() => setPipExpanded(!pipExpanded)}
                >
                  ⚡ {pipExpanded ? "Minimize .SchDoc" : "Expand Schematic (.SchDoc)"}
                </button>
              </>
            )}

            {activeStage === 3 && (
              <>
                <button
                  type="button"
                  className={`lc-tool-btn ${isrSpeed === 1.0 ? "is-active" : ""}`}
                  onClick={() =>
                    runCliCommand(
                      "pio run -t upload",
                      1.0,
                      "✓ [SUCCESS] 4.0kHz ISR flashed · Nominal current flow"
                    )
                  }
                >
                  ▶ Build &amp; Flash (4.0 kHz)
                </button>
                <button
                  type="button"
                  className={`lc-tool-btn ${isrSpeed > 1.5 ? "is-active" : ""}`}
                  onClick={() =>
                    runCliCommand(
                      "clock --overdrive 16khz",
                      2.6,
                      "⚡ [OVERDRIVE] DMA burst rate 2.6x · High-speed Kapton bus active"
                    )
                  }
                >
                  ⚡ 16.0 kHz DMA Overdrive
                </button>
              </>
            )}

            {(activeStage === 0 || activeStage === 4) && (
              <>
                <button
                  type="button"
                  className={`lc-tool-btn ${cadSectionCut ? "is-active" : ""}`}
                  onClick={() => setCadSectionCut(!cadSectionCut)}
                >
                  🪚 Inspect Internal Cross-Section
                </button>
              </>
            )}
          </div>

          <div style={{ display: "flex", gap: "4px" }}>
            <button
              type="button"
              className="lc-tool-btn"
              onClick={() => {
                stateRef.current.zoomDelta = -2.2;
              }}
              title="Zoom In 3D"
            >
              🔍 +
            </button>
            <button
              type="button"
              className="lc-tool-btn"
              onClick={() => {
                stateRef.current.zoomDelta = 2.2;
              }}
              title="Zoom Out 3D"
            >
              🔍 −
            </button>
          </div>
        </div>

        {/* 3. Main 3-Column Engineering Body */}
        <div className="lc-body">
          {/* Left Tree: FeatureManager (Stage 2) / ECAD Navigator (Stage 3) / Explorer (Stage 4) */}
          <div className="lc-left-tree">
            {activeStage === 1 ? (
              <>
                <strong style={{ color: "#0078d4", marginBottom: "4px" }}>
                  FeatureManager Tree
                </strong>
                <div className="lc-tree-row">├─ 📜 History</div>
                <div className="lc-tree-row">├─ 📡 Sensors</div>
                <div className="lc-tree-row">├─ 📐 Front Plane</div>
                <div className="lc-tree-row">├─ 📐 Top Plane</div>
                <div className="lc-tree-row">├─ 📐 Right Plane</div>
                <div className="lc-tree-row">├─ 🎯 Origin</div>
                <div className="lc-tree-row is-selected">├─ 🧩 (f) Ribbed_Canopy&lt;1&gt;</div>
                <div className="lc-tree-row">├─ 🧩 (-) Exostructure_Hull&lt;1&gt;</div>
                <div className="lc-tree-row">├─ 🧩 (-) RigidFlex_STEP&lt;1&gt;</div>
                <div className="lc-tree-row">├─ 🧩 (-) Dual_Optic_Barrels&lt;2&gt;</div>
                <div className="lc-tree-row" style={{ color: "#107c41" }}>
                  └─ 📎 Mates (48 Active · 0 Errors)
                </div>
              </>
            ) : activeStage === 2 ? (
              <>
                <strong style={{ color: "#ff9f1c", marginBottom: "4px" }}>
                  Projects · Navigator
                </strong>
                <div className="lc-tree-row">▾ RigidFlex_Avionics.PrjPcb</div>
                <div className="lc-tree-row">  ├─ Avionics_Core.SchDoc</div>
                <div className="lc-tree-row">  ├─ Power_BMS_24V.SchDoc</div>
                <div className="lc-tree-row is-selected">  ├─ HDI_RigidFlex.PcbDoc</div>
                <div style={{ margin: "8px 0 4px", opacity: 0.65 }}>ACTIVE NET CLASSES</div>
                {["NET_SPI1_DMA", "NET_KAPTON_I2C", "NET_24V_PWM"].map((net) => (
                  <div
                    key={net}
                    className={`lc-tree-row ${selectedNet === net ? "is-selected" : ""}`}
                    onClick={() => setSelectedNet(net)}
                  >
                    ⚡ {net}
                  </div>
                ))}
              </>
            ) : activeStage === 3 ? (
              <>
                <strong style={{ color: "#00e5ff", marginBottom: "4px" }}>
                  EXPLORER · CORTEX-M4
                </strong>
                <div className="lc-tree-row">▾ hardware-workbench/</div>
                <div className="lc-tree-row is-selected">  ├─ src/main_isr.c</div>
                <div className="lc-tree-row">  ├─ src/pid_biquad.cpp</div>
                <div className="lc-tree-row">  ├─ include/dma_mux.h</div>
                <div className="lc-tree-row">  └─ platformio.ini</div>
              </>
            ) : (
              <>
                <strong style={{ color: "#00e5ff", marginBottom: "4px" }}>
                  System Deliverables
                </strong>
                <div className="lc-tree-row is-selected">├─ 📄 System_Spec.DWG</div>
                <div className="lc-tree-row">├─ 🧊 Full_Assembly.SLDASM</div>
                <div className="lc-tree-row">├─ ▣ RigidFlex_Stack.PcbDoc</div>
                <div className="lc-tree-row">├─ ⟨/⟩ Firmware_v4.2.elf</div>
                <div className="lc-tree-row">└─ 📦 Gerber_X2_BOM.zip</div>
              </>
            )}
          </div>

          {/* Center Interactive 3D Viewport + Stage-Specific Overlays */}
          <div
            className="lc-viewport"
            style={{
              background:
                activeStage === 1
                  ? "linear-gradient(180deg, #cbd5e1 0%, #eff6ff 55%, #ffffff 100%)"
                  : "radial-gradient(circle at 50% 52%, rgba(255, 115, 0, 0.24) 0%, #090c14 60%, #040609 100%)"
            }}
          >
            {/* Stage 02 SOLIDWORKS Heads-Up View Toolbar */}
            {activeStage === 1 && (
              <div className="lc-hud-pillbar">
                <span>🔍 Zoom to Fit</span>
                <span>·</span>
                <span>🪚 Section: {cadSectionCut ? "ON" : "OFF"}</span>
                <span>·</span>
                <span>🧊 Shaded With Edges</span>
              </div>
            )}

            {/* Stage 03 Picture-in-Picture Interactive Schematic (.SchDoc) */}
            {activeStage === 2 && (
              <div className={`lc-pip-sch ${pipExpanded ? "is-expanded" : ""}`}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "4px 8px",
                    background: "#161c28",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.64rem",
                    color: "#ff9f1c"
                  }}
                >
                  <span>Avionics_Core.SchDoc ({selectedNet})</span>
                  <button
                    type="button"
                    style={{ background: "none", border: 0, color: "#fff", cursor: "pointer" }}
                    onClick={() => setPipExpanded(!pipExpanded)}
                  >
                    {pipExpanded ? "↙ Min" : "↗ Max"}
                  </button>
                </div>
                <svg viewBox="0 0 360 210" style={{ width: "100%", height: "auto", display: "block" }}>
                  <rect x="6" y="6" width="348" height="198" fill="none" stroke="#384860" strokeWidth="1" />
                  <rect x="24" y="45" width="85" height="90" fill="#121824" stroke="#00e5ff" strokeWidth="1.8" />
                  <text x="66" y="92" textAnchor="middle" fill="#fff" fontFamily="monospace" fontSize="9">
                    U2 KAPTON IMU
                  </text>
                  <rect x="145" y="35" width="95" height="115" fill="#121824" stroke="#ff9f1c" strokeWidth="2" />
                  <text x="192" y="92" textAnchor="middle" fill="#ff9f1c" fontFamily="monospace" fontSize="9.5" fontWeight="700">
                    U1 STM32F405
                  </text>
                  <rect x="270" y="45" width="70" height="90" fill="#121824" stroke="#10b981" strokeWidth="1.8" />
                  <text x="305" y="92" textAnchor="middle" fill="#10b981" fontFamily="monospace" fontSize="9">
                    U3 PMIC
                  </text>
                  <line x1="109" y1="80" x2="145" y2="80" stroke="#00e5ff" strokeWidth="2" />
                  <line x1="240" y1="80" x2="270" y2="80" stroke="#ff9f1c" strokeWidth="2" />
                </svg>
              </div>
            )}

            {/* Stage 04 Split VS Code + Ubuntu CLI Terminal Overlay */}
            {activeStage === 3 && (
              <div className="lc-ide-overlay">
                <div className="lc-ide-code">
                  <div style={{ color: "#6a9955" }}>// src/main_isr.c — 4.0kHz Hard Real-Time Control ISR</div>
                  <div>
                    <span style={{ color: "#c586c0" }}>void</span>{" "}
                    <span style={{ color: "#dcdcaa" }}>TIM1_UP_IRQHandler</span>(void) &#123;
                  </div>
                  <div style={{ paddingLeft: "12px", color: "#9cdcfe" }}>
                    DMA2_Stream0-&gt;CR |= DMA_SxCR_EN;
                  </div>
                  <div style={{ paddingLeft: "12px", color: "#9cdcfe" }}>
                    float err = compute_line_centroid(adc_buf);
                  </div>
                  <div style={{ paddingLeft: "12px", color: "#dcdcaa" }}>
                    TIM8-&gt;CCR1 = pid_biquad_step(&amp;ctrl, err);
                  </div>
                  <div>&#125;</div>
                </div>

                <div className="lc-ubuntu-term">
                  <div>
                    {cliLogs.map((ln, i) => (
                      <div
                        key={i}
                        style={{
                          color: ln.startsWith("noman@")
                            ? "#4ec9b0"
                            : ln.includes("OVERDRIVE")
                            ? "#ff9f1c"
                            : "#e2e8f0"
                        }}
                      >
                        {ln}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Continuous 60fps Three.js Mount */}
            <div ref={mountRef} style={{ width: "100%", height: "100%", cursor: "grab" }} />
          </div>

          {/* Right Inspector / DFM Verification Panel */}
          <div className="lc-right-insp">
            <strong>Inspector · Telemetry</strong>
            <div>
              <div style={{ opacity: 0.6 }}>STAGE ARTIFACT</div>
              <div style={{ fontWeight: 700, color: activeStage === 1 ? "#0078d4" : "#ff9f1c" }}>
                {currentStage.file}
              </div>
            </div>
            <div>
              <div style={{ opacity: 0.6 }}>RULE CHECK (DRC / MATES)</div>
              <div style={{ color: "#10b981", fontWeight: 700 }}>
                ✓ 0 Collisions · 0 Unrouted
              </div>
            </div>
            <div>
              <div style={{ opacity: 0.6 }}>STACKUP / MATERIAL</div>
              <div>4L Rigid FR4 + 2L Kapton FPC + Ribbed Polycarbonate</div>
            </div>
            <div style={{ marginTop: "auto", opacity: 0.75 }}>
              🖱️ Drag anywhere on the 3D model to orbit 360°. Page scrolling stays smooth and unlocked.
            </div>
          </div>
        </div>

        {/* 4. Bottom Layer Tabs / Status Bar */}
        <div className="wk-footer-bar">
          {activeStage === 1 ? (
            <>
              <span>SOLIDWORKS Connected · Editing Assembly</span>
              <span style={{ color: "#107c41", fontWeight: 700 }}>
                ● Fully Defined · MMGS (millimeter, gram, second)
              </span>
            </>
          ) : (
            <>
              <div className="layer-tabs">
                <span className="layer-tab">
                  <span className="layer-dot" style={{ background: "#ff3b30" }} /> L1 Top Copper
                </span>
                <span className="layer-tab">
                  <span className="layer-dot" style={{ background: "#10b981" }} /> L2 Solid GND
                </span>
                <span className="layer-tab">
                  <span className="layer-dot" style={{ background: "#ff9f1c" }} /> Flex1 Kapton FPC
                </span>
                <span className="layer-tab">
                  <span className="layer-dot" style={{ background: "#007aff" }} /> L4 Bot Copper
                </span>
              </div>
              <span>{currentStage.num} · LIVE 3D WEBGL</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
