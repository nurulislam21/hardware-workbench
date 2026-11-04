import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

function makeChipTexture(name, sub, accent = "#ff8c24") {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#12151c";
  ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = "#2d3748";
  ctx.lineWidth = 10;
  ctx.strokeRect(18, 18, 476, 476);
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(64, 64, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 44px monospace";
  ctx.textAlign = "center";
  ctx.fillText(name, 256, 235);
  ctx.fillStyle = accent;
  ctx.font = "32px monospace";
  ctx.fillText(sub, 256, 295);
  ctx.fillStyle = "#8c9bb5";
  ctx.font = "22px monospace";
  ctx.fillText("LIVE TELEMETRY · OK", 256, 355);
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 4;
  return t;
}

export default function AliveRigidFlex3D({
  explodeFactor = 0.75,
  showEnclosure = true,
  currentSpeed = 1.8,
  camTargetPos = null,
  height = "440px",
  allowControls = true
}) {
  const mountRef = useRef(null);
  const [localExplode, setLocalExplode] = useState(explodeFactor);
  const [localShell, setLocalShell] = useState(showEnclosure);
  const [localSpeed, setLocalSpeed] = useState(currentSpeed);
  const [selectedPart, setSelectedPart] = useState({
    name: "U1 · CORTEX-M7 BGA CORE",
    net: "NET_MIPI_CSI2 & QSPI_BUS",
    metrics: "3.30V · 412 mA · 41.2°C (ACTIVE)"
  });
  const [customFileName, setCustomFileName] = useState("");

  const stateRef = useRef({
    explode: explodeFactor,
    shell: showEnclosure,
    speed: currentSpeed,
    camTarget: camTargetPos
  });

  useEffect(() => {
    setLocalExplode(explodeFactor);
    setLocalShell(showEnclosure);
    setLocalSpeed(currentSpeed);
    stateRef.current.explode = explodeFactor;
    stateRef.current.shell = showEnclosure;
    stateRef.current.speed = currentSpeed;
    stateRef.current.camTarget = camTargetPos;
  }, [explodeFactor, showEnclosure, currentSpeed, camTargetPos]);

  useEffect(() => {
    stateRef.current.explode = localExplode;
    stateRef.current.shell = localShell;
    stateRef.current.speed = localSpeed;
  }, [localExplode, localShell, localSpeed]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      36,
      container.clientWidth / container.clientHeight,
      0.1,
      200
    );
    camera.position.set(11.5, 8.8, 12.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxDistance = 30;
    controls.minDistance = 4.5;

    // Warm Amber Under-Glow + Crisp Studio Rim Lighting (like image_7a254a.jpg & image_78d3ee.jpg)
    scene.add(new THREE.AmbientLight(0xdbe6ff, 1.25));
    const topLight = new THREE.DirectionalLight(0xffffff, 2.2);
    topLight.position.set(10, 18, 12);
    scene.add(topLight);

    const amberUnderLight = new THREE.PointLight(0xff6a00, 3.8, 18);
    amberUnderLight.position.set(0, -3.2, 0);
    scene.add(amberUnderLight);

    const cyanRimLight = new THREE.DirectionalLight(0x38e0ff, 1.3);
    cyanRimLight.position.set(-12, 6, -10);
    scene.add(cyanRimLight);

    // Master Assembly Groups for Smooth Explode
    const root = new THREE.Group();
    scene.add(root);

    const bottomCaseGroup = new THREE.Group();
    const mainPcbGroup = new THREE.Group();
    const flexWingLeftGroup = new THREE.Group();
    const flexWingRightGroup = new THREE.Group();
    const daughterPcbGroup = new THREE.Group();
    const clearTopCoverGroup = new THREE.Group();
    const customModelGroup = new THREE.Group();
    root.add(
      bottomCaseGroup,
      mainPcbGroup,
      flexWingLeftGroup,
      flexWingRightGroup,
      daughterPcbGroup,
      clearTopCoverGroup,
      customModelGroup
    );

    const interactiveMeshes = [];

    // Materials
    const darkPcbMat = new THREE.MeshStandardMaterial({
      color: 0x11151e,
      roughness: 0.32,
      metalness: 0.25
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf5c242,
      roughness: 0.18,
      metalness: 0.94
    });
    const polyimideFlexMat = new THREE.MeshPhysicalMaterial({
      color: 0xff6a00,
      emissive: 0x4a1800,
      roughness: 0.25,
      metalness: 0.1,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide
    });
    const clearAcrylicMat = new THREE.MeshPhysicalMaterial({
      color: 0xd8ecff,
      transparent: true,
      opacity: 0.28,
      roughness: 0.1,
      metalness: 0.05,
      transmission: 0.65
    });
    const cncBaseMat = new THREE.MeshStandardMaterial({
      color: 0x161a22,
      roughness: 0.35,
      metalness: 0.82
    });

    // 1. BOTTOM MACHINED UNIBODY HOUSING (with amber edge accents)
    const baseTray = new THREE.Mesh(new THREE.BoxGeometry(10.6, 0.55, 6.8), cncBaseMat);
    baseTray.position.y = -1.4;
    baseTray.userData = {
      name: "MCAD · CNC 6061-T6 LOWER UNIBODY",
      net: "CHASSIS_GND & THERMAL SINK",
      metrics: "Mass: 168g · Tolerance: ±0.02mm"
    };
    const baseEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(baseTray.geometry),
      new THREE.LineBasicMaterial({ color: 0xff7b00, transparent: true, opacity: 0.6 })
    );
    baseTray.add(baseEdges);
    bottomCaseGroup.add(baseTray);
    interactiveMeshes.push(baseTray);

    // 2. MAIN HIGH-DENSITY MOTHER-PCB
    const mainBoard = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.2, 5.8), darkPcbMat);
    mainBoard.userData = {
      name: "PCB1 · 6-LAYER RIGID-FLEX MAINBOARD",
      net: "4L FR4 + 2L POLYIMIDE CORE",
      metrics: "Impedance: 50Ω SE / 90Ω Diff · ENIG"
    };
    mainPcbGroup.add(mainBoard);
    interactiveMeshes.push(mainBoard);

    // U1 Central BGA Processor on Mainboard
    const u1Chip = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.24, 2.1),
      new THREE.MeshStandardMaterial({
        map: makeChipTexture("U1 CORTEX-M7", "480MHz · BGA176", "#ff8c24"),
        roughness: 0.35
      })
    );
    u1Chip.position.set(0.2, 0.22, 0.1);
    u1Chip.userData = {
      name: "U1 · STM32H7 / CORTEX-M7 CORE",
      net: "NET_MIPI_CSI2 & DMA_BUS",
      metrics: "3.30V · 480 MHz · 41.2°C"
    };
    mainPcbGroup.add(u1Chip);
    interactiveMeshes.push(u1Chip);

    // U3 Power PMIC & Inductors on Mainboard
    const u3Chip = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.22, 1.4),
      new THREE.MeshStandardMaterial({
        map: makeChipTexture("U3 PMIC BUCK", "14.8V -> 3.3V", "#38e0ff"),
        roughness: 0.35
      })
    );
    u3Chip.position.set(-2.4, 0.21, 0.8);
    u3Chip.userData = {
      name: "U3 · MULTI-PHASE BUCK PMIC",
      net: "NET_VBAT_4S_BUCK",
      metrics: "Efficiency: 96.4% · Ripple < 8mV"
    };
    mainPcbGroup.add(u3Chip);
    interactiveMeshes.push(u3Chip);

    // Gold SMD Capacitor & Inductor Array on Mainboard
    for (let gx = -3.8; gx <= 3.8; gx += 0.65) {
      for (let gz = -2.2; gz <= 2.2; gz += 0.75) {
        if (Math.abs(gx - 0.2) < 1.4 && Math.abs(gz - 0.1) < 1.4) continue;
        const smd = new THREE.Mesh(
          new THREE.BoxGeometry(0.26, 0.12, 0.15),
           (gx + gz) % 2 === 0 ? goldMat : cncBaseMat
        );
        smd.position.set(gx, 0.16, gz);
        mainPcbGroup.add(smd);
      }
    }

    // 3. UPPER SENSOR DAUGHTERBOARD PCB + MEZZANINE STACK (like image_7a254a.jpg)
    const daughterBoard = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.16, 3.4), darkPcbMat);
    daughterBoard.position.set(-0.3, 0.95, -0.4);
    daughterBoard.userData = {
      name: "PCB2 · UPPER SENSOR & RF DAUGHTERBOARD",
      net: "HIGH-SPEED BOARD-TO-BOARD MEZZANINE",
      metrics: "16-Ch DMA ADC + 6-Axis Optical/IMU"
    };
    daughterPcbGroup.add(daughterBoard);
    interactiveMeshes.push(daughterBoard);

    const u2Sensor = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.2, 1.2),
      new THREE.MeshStandardMaterial({
        map: makeChipTexture("U2 SENSOR AFE", "400Hz · DMA", "#2bd980"),
        roughness: 0.35
      })
    );
    u2Sensor.position.set(-0.3, 1.13, -0.4);
    u2Sensor.userData = {
      name: "U2 · PRECISION ANALOG FRONT-END",
      net: "NET_SPI_DMA_BURST",
      metrics: "SNR: 108 dB · 4.0 kHz Sample Rate"
    };
    daughterPcbGroup.add(u2Sensor);
    interactiveMeshes.push(u2Sensor);

    // 4. ORANGE POLYIMIDE RIGID-FLEX RIBBONS & EXTENSION WINGS (like image_7929c2.jpg)
    const createFlexRibbon = (pts, width = 1.1) => {
      const curve = new THREE.CatmullRomCurve3(pts);
      const geom = new THREE.TubeGeometry(curve, 36, width * 0.18, 8, false);
      geom.scale(1, 0.18, 2.2);
      const mesh = new THREE.Mesh(geom, polyimideFlexMat);
      mesh.userData = {
        name: "FLEX1 · DYNAMIC POLYIMIDE FLEX RIBBON",
        net: "IMPEDANCE-MATCHED DIFFERENTIAL BUS",
        metrics: "Bend Radius: 1.5mm · Kapton 2-Layer"
      };
      interactiveMeshes.push(mesh);
      return { mesh, curve };
    };

    // Left Extended Flex Wing (like image_7929c2.jpg)
    const leftFlex = createFlexRibbon([
      new THREE.Vector3(-4.4, 0.05, -0.5),
      new THREE.Vector3(-5.8, 0.35, -0.5),
      new THREE.Vector3(-7.4, 0.15, -0.2),
      new THREE.Vector3(-8.8, 0.1, 0.4)
    ]);
    flexWingLeftGroup.add(leftFlex.mesh);

    // Right Inter-Board S-Bend Flex Ribbon (connecting Mainboard to Upper Daughterboard)
    const interBoardFlex = createFlexRibbon([
      new THREE.Vector3(3.8, 0.08, -0.4),
      new THREE.Vector3(4.9, 0.45, -0.4),
      new THREE.Vector3(4.2, 0.92, -0.4),
      new THREE.Vector3(2.6, 0.95, -0.4)
    ]);
    daughterPcbGroup.add(interBoardFlex.mesh);

    // Front Flex Sensor Tail
    const frontFlex = createFlexRibbon([
      new THREE.Vector3(1.2, 0.05, 2.6),
      new THREE.Vector3(1.5, -0.25, 4.1),
      new THREE.Vector3(2.8, -0.35, 5.2)
    ]);
    flexWingRightGroup.add(frontFlex.mesh);

    // 5. CLEAR MACHINED POLYCARBONATE TOP OPTIC ENCLOSURE (like image_7a254a.jpg)
    const topCover = new THREE.Mesh(new THREE.BoxGeometry(9.8, 0.55, 6.2), clearAcrylicMat);
    topCover.position.set(0, 1.95, 0);
    topCover.userData = {
      name: "MCAD · CLEAR CNC POLYCARBONATE SHELL",
      net: "OPTICAL / TRANSDUCER WINDOW",
      metrics: "Wall: 1.8mm · CNC Ribbed Internal Pockets"
    };
    const coverWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(topCover.geometry),
      new THREE.LineBasicMaterial({ color: 0xffa64d, transparent: true, opacity: 0.65 })
    );
    topCover.add(coverWire);

    // Internal CNC Ribs & Lens Rings on Clear Top Cover
    [-2.2, 0, 2.2].forEach((rx) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.55, 0.06, 12, 28),
        clearAcrylicMat
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.set(rx, 1.98, 0.8);
      clearTopCoverGroup.add(ring);
    });
    clearTopCoverGroup.add(topCover);
    interactiveMeshes.push(topCover);

    // 6. LIVE FLOWING CURRENT & SIGNAL PULSES (Makes the PCB & Flex Ribbons Alive!)
    const signalPaths = [
      leftFlex.curve,
      interBoardFlex.curve,
      frontFlex.curve,
      // Mainboard High-Speed Copper Trace Paths
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4.4, 0.14, -0.5),
        new THREE.Vector3(-2.4, 0.14, -0.5),
        new THREE.Vector3(-1.2, 0.14, 0.1),
        new THREE.Vector3(0.2, 0.14, 0.1)
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.2, 0.14, 0.1),
        new THREE.Vector3(1.8, 0.14, 0.1),
        new THREE.Vector3(2.6, 0.14, -0.4),
        new THREE.Vector3(3.8, 0.14, -0.4)
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.2, 0.14, 0.1),
        new THREE.Vector3(0.8, 0.14, 1.4),
        new THREE.Vector3(1.2, 0.14, 2.6)
      ]),
      // Daughterboard Trace Path
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(2.6, 1.06, -0.4),
        new THREE.Vector3(1.0, 1.06, -0.4),
        new THREE.Vector3(-0.3, 1.06, -0.4),
        new THREE.Vector3(-2.5, 1.06, -0.4)
      ])
    ];

    // Glowing trace lines along every signal path
    const traceMat = new THREE.MeshBasicMaterial({
      color: 0xff7b00,
      transparent: true,
      opacity: 0.55
    });
    signalPaths.forEach((curve, idx) => {
      const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, 0.025, 6, false), traceMat);
      if (idx === 6) daughterPcbGroup.add(tube);
      else mainPcbGroup.add(tube);
    });

    // 72 Animated Signal Pulse Spheres racing along the traces & flex ribbons
    const pulseParticles = [];
    const amberPulseMat = new THREE.MeshBasicMaterial({ color: 0xffae00 });
    const cyanPulseMat = new THREE.MeshBasicMaterial({ color: 0x38e0ff });
    const pulseGeom = new THREE.SphereGeometry(0.075, 10, 10);

    signalPaths.forEach((curve, pathIdx) => {
      for (let i = 0; i < 10; i++) {
        const mesh = new THREE.Mesh(
          pulseGeom,
          pathIdx % 2 === 0 ? amberPulseMat : cyanPulseMat
        );
        const parentGrp = pathIdx === 6 ? daughterPcbGroup : mainPcbGroup;
        parentGrp.add(mesh);
        pulseParticles.push({
          mesh,
          curve,
          offset: i / 10,
          speedMult: 0.22 + (pathIdx % 3) * 0.08
        });
      }
    });

    // Raycaster so user can touch/click any 3D PCB component
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const onPointerDown = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(interactiveMeshes, false);
      if (hits.length > 0 && hits[0].object.userData?.name) {
        setSelectedPart(hits[0].object.userData);
      }
    };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);

    stateRef.current.customModelGroup = customModelGroup;
    stateRef.current.defaultGroups = [
      bottomCaseGroup,
      mainPcbGroup,
      flexWingLeftGroup,
      flexWingRightGroup,
      daughterPcbGroup,
      clearTopCoverGroup
    ];

    // Animation Loop
    let reqId;
    const clock = new THREE.Clock();
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const { explode, shell, speed, camTarget } = stateRef.current;

      // Smoothly animate Exploded View Z-offsets
      bottomCaseGroup.position.y = THREE.MathUtils.lerp(
        bottomCaseGroup.position.y,
        -explode * 1.45,
        0.08
      );
      daughterPcbGroup.position.y = THREE.MathUtils.lerp(
        daughterPcbGroup.position.y,
        explode * 1.15,
        0.08
      );
      clearTopCoverGroup.position.y = THREE.MathUtils.lerp(
        clearTopCoverGroup.position.y,
        explode * 2.45,
        0.08
      );
      clearTopCoverGroup.visible = shell;

      // Smoothly move camera if driven by Scroll Pipeline
      if (camTarget) {
        camera.position.lerp(
          new THREE.Vector3(camTarget[0], camTarget[1], camTarget[2]),
          0.05
        );
      }

      // Advance glowing current/signal packets along PCB traces & flex cables
      pulseParticles.forEach((p) => {
        const t = (elapsed * p.speedMult * speed + p.offset) % 1;
        const pos = p.curve.getPointAt(t);
        p.mesh.position.copy(pos);
      });

      // Subtle floating motion
      root.rotation.y = Math.sin(elapsed * 0.25) * 0.08;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const ro = new ResizeObserver(() => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(reqId);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      ro.disconnect();
      renderer.dispose();
    };
  }, []);

  // Load user's real .STL or .OBJ CAD/PCB file directly into the 3D scene
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCustomFileName(file.name);
    const reader = new FileReader();
    const ext = file.name.split(".").pop().toLowerCase();

    reader.onload = (ev) => {
      const { customModelGroup, defaultGroups } = stateRef.current;
      if (!customModelGroup) return;
      customModelGroup.clear();

      if (ext === "stl") {
        const geom = new STLLoader().parse(ev.target.result);
        geom.center();
        geom.computeVertexNormals();
        const box = new THREE.Box3().setFromBufferAttribute(geom.attributes.position);
        const size = box.getSize(new THREE.Vector3()).length();
        const scale = 10 / (size || 1);
        const mesh = new THREE.Mesh(
          geom,
          new THREE.MeshStandardMaterial({ color: 0xff8c24, roughness: 0.3, metalness: 0.75 })
        );
        mesh.scale.setScalar(scale);
        customModelGroup.add(mesh);
        defaultGroups.forEach((g) => (g.visible = false));
      } else if (ext === "obj") {
        const text = new TextDecoder().decode(ev.target.result);
        const obj = new OBJLoader().parse(text);
        customModelGroup.add(obj);
        defaultGroups.forEach((g) => (g.visible = false));
      }
      setSelectedPart({
        name: `CUSTOM CAD · ${file.name}`,
        net: "NATIVE 3D GEOMETRY LOADED",
        metrics: `${(file.size / 1024).toFixed(1)} KB · Interactive 3D Mesh`
      });
    };
    reader.readAsArrayBuffer(file);
  };

  const resetDefaultModel = () => {
    const { customModelGroup, defaultGroups } = stateRef.current;
    if (!customModelGroup) return;
    customModelGroup.clear();
    defaultGroups.forEach((g) => (g.visible = true));
    setCustomFileName("");
  };

  return (
    <div className="rf-frame" style={{ height }}>
      {allowControls && (
        <div className="rf-hud-top">
          <div className="rf-bar">
            <button
              type="button"
              className={`rf-btn ${localExplode > 0.2 ? "is-active" : ""}`}
              onClick={() => setLocalExplode(localExplode > 0.2 ? 0.0 : 0.85)}
            >
              {localExplode > 0.2 ? "ASSEMBLE PRODUCT" : "EXPLODE RIGID-FLEX"}
            </button>
            <button
              type="button"
              className={`rf-btn ${localShell ? "is-active" : ""}`}
              onClick={() => setLocalShell(!localShell)}
            >
              CLEAR CNC SHELL
            </button>
            <button
              type="button"
              className={`rf-btn ${localSpeed > 1.5 ? "is-active" : ""}`}
              onClick={() => setLocalSpeed(localSpeed > 1.5 ? 0.4 : 2.6)}
            >
              ⚡ SIGNAL CURRENT: {localSpeed > 1.5 ? "HIGH (4kHz)" : "IDLE"}
            </button>
          </div>

          <div className="rf-bar">
            <label className="rf-file-label" title="Load your actual exported .STL or .OBJ CAD/PCB 3D file">
              📂 Load .STL / .OBJ
              <input
                type="file"
                accept=".stl,.obj"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
            </label>
            {customFileName && (
              <button type="button" className="rf-btn is-active" onClick={resetDefaultModel}>
                Reset Rigid-Flex
              </button>
            )}
          </div>
        </div>
      )}

      <div ref={mountRef} className="rf-canvas" />

      <div className="rf-hud-bot">
        <span className="rf-tag">
          🎯 <strong>{selectedPart.name}</strong> · {selectedPart.net}
        </span>
        <span className="rf-tag" style={{ color: "#ff9900" }}>
          ⚡ {selectedPart.metrics}
        </span>
      </div>
    </div>
  );
}
