export const SITE_DATA = {
  brandPre: "is",
  brandName: "noman",
  sheetTitle: "isnoman.vercel.app",
  sheetFile: "Flight_Stack_Rev4.PcbDoc",
  sheetRev: "4.2",

  prompts: [
    { q: "IS NOMAN DESIGNING MULTI-LAYER PCBS?", a: "Yes, in Altium & KiCad →", href: "#pipeline" },
    { q: "IS NOMAN MODELING 3D ASSEMBLIES?", a: "Yes, full .SLDASM & .STEP enclosures →", href: "#pipeline" },
    { q: "IS NOMAN WRITING BARE-METAL FIRMWARE?", a: "Yes, STM32 & ESP32 control loops →", href: "#pipeline" },
    { q: "IS NOMAN TAKING NEW HARDWARE PROJECTS?", a: "Yes. Start a project →", href: "#contact" }
  ],

  hero: {
    title: "Hardware prototypes, start to finish: circuits, firmware, mechanical design.",
    lead: "I'm Nurul Islam Noman, an embedded systems engineer and EEE student based in Dhaka, building custom multi-layer PCBs, bare-metal STM32/ESP firmware, and 3D mechanical CAD assemblies.",
    available: true,
    statusText: "Taking new projects"
  },

  // Real Sketchfab 3D Models mapped to TP1 (Firmware/Robotics), TP2 (PCB/Electronics), TP3 (3D CAD Systems)
  probes: {
    u1: {
      id: "u1",
      ref: "U1",
      tp: "TP1",
      marker: "dot",
      tabLabel: "TP1 Firmware",
      title: "Firmware",
      fileName: "Robot_Controller_Assy.PcbDoc + main.c",
      sketchfabUid: "7c9803334a7e4938aa2ca2d30c0f432f", // Real 91.4k-triangle 3D Robotics & Microcontroller Assembly
      color: "var(--tp1)",
      files: ["stm32_pid_isr.c", "dma_adc.h", "platformio.ini"],
      text: "I write bare-metal C/C++ for STM32 and ESP32, tune 3D printers with Marlin, and bring up new boards with deterministic PID control loops and DMA sensor acquisition.",
      filterCategory: "All",
      count: 4,
      scope: {
        ch: "CH1 SCK · CH2 MOSI",
        trig: "TRIG'D ↑CH1",
        decodePrefix: "SPI · ",
        decodeHex: "AC 53 00 00",
        decodeSuffix: " · Programming Enable",
        wave1: "M0,24 L10,24 L10,6 L20,6 L20,24 L30,24 L30,6 L40,6 L40,24 L50,24 L50,6 L60,6 L60,24 L70,24 L70,6 L80,6 L80,24 L90,24 L90,6 L100,6 L100,24 L110,24 L110,6 L120,6 L120,24 L130,24 L130,6 L140,6 L140,24 L150,24 L150,6 L160,6 L160,24 L170,24 L170,6 L180,6 L180,24 L190,24 L190,6 L200,6 L200,24",
        wave2: "M0,52 L20,52 L20,34 L50,34 L50,52 L70,52 L70,34 L90,34 L90,52 L120,52 L120,34 L160,34 L160,52 L180,52 L180,34 L200,34"
      }
    },
    u2: {
      id: "u2",
      ref: "U2",
      tp: "TP2",
      marker: "ring",
      tabLabel: "TP2 Electronics",
      title: "Electronics & 3D PCB",
      fileName: "High_Speed_Breakout.PcbDoc (310k Polygons)",
      sketchfabUid: "68bb06b16b1b444495a8ae1ee144ac35", // Real 310.8k-triangle Photorealistic 3D Microcontroller PCB
      color: "var(--tp2)",
      files: ["Mainboard_V4.PcbDoc", "Sensor_Mux.SchDoc", "Gerber_X2.OutJob"],
      text: "Multi-layer PCB design in Altium Designer and KiCad, high-speed multiplexed IR sensor arrays, Li-Ion BMS power rails, and DFM-verified fabrication packages.",
      filterCategory: "ECAD & PCB",
      count: 4,
      scope: {
        ch: "CH1 SCL · CH2 SDA",
        trig: "TRIG'D ↓CH2",
        decodePrefix: "I2C · ",
        decodeHex: "0x68 ACK",
        decodeSuffix: " · Sensor Array DMA Burst",
        wave1: "M0,6 L12,6 L12,24 L24,24 L24,6 L36,6 L36,24 L48,24 L48,6 L60,6 L60,24 L72,24 L72,6 L84,6 L84,24 L96,24 L96,6 L108,6 L108,24 L120,24 L120,6 L132,6 L132,24 L144,24 L144,6 L156,6 L156,24 L168,24 L168,6 L180,6 L180,24 L200,24",
        wave2: "M0,34 L8,34 L8,52 L48,52 L48,34 L84,34 L84,52 L120,52 L120,34 L156,34 L156,52 L200,52"
      }
    },
    u3: {
      id: "u3",
      ref: "U3",
      tp: "TP3",
      marker: "sq",
      tabLabel: "TP3 Custom systems",
      title: "Custom 3D CAD Systems",
      fileName: "Direct_Drive_Extruder.SLDASM",
      sketchfabUid: "ac4d1de3f3dc475e940a9f11a07a6b4c", // Real 3D Printer Extruder Mechanical CAD Assembly
      color: "var(--tp3)",
      files: ["Extruder_Assy.SLDASM", "UAV_Frame.SLDPRT", "Mecanum_Drive.STEP"],
      text: "Complete electromechanical prototypes modeled in SOLIDWORKS: CoreXY 3D printer kinematics, folding-wing VTOL mechanisms, and custom 3D-printed enclosures.",
      filterCategory: "3D CAD & Robotics",
      count: 4,
      scope: {
        ch: "CH1 STEP · CH2 DIR",
        trig: "TRIG'D ↑CH1",
        decodePrefix: "TMC2209 · ",
        decodeHex: "256 uSTEP",
        decodeSuffix: " · NEMA 17 Motion Lock",
        wave1: "M0,24 L6,24 L6,6 L12,6 L12,24 L22,24 L22,6 L28,6 L28,24 L38,24 L38,6 L44,6 L44,24 L54,24 L54,6 L60,6 L60,24 L70,24 L70,6 L76,6 L76,24 L86,24 L86,6 L92,6 L92,24 L102,24 L102,6 L108,6 L108,24 L118,24 L118,6 L124,6 L124,24 L134,24 L134,6 L140,6 L140,24 L150,24 L150,6 L156,6 L156,24 L166,24 L166,6 L172,6 L172,24 L200,24",
        wave2: "M0,52 L96,52 L96,34 L200,34"
      }
    }
  },

  // Quick-switch preset 3D models inside the Hero 3D Viewer
  hero3DModels: [
    { id: "pcb_esp", label: "3D PCB (.PcbDoc)", uid: "68bb06b16b1b444495a8ae1ee144ac35", probe: "u2" },
    { id: "robot_assy", label: "Robot Assy (.SchDoc/.PcbDoc)", uid: "7c9803334a7e4938aa2ca2d30c0f432f", probe: "u1" },
    { id: "extruder_cad", label: "Extruder CAD (.SLDASM)", uid: "ac4d1de3f3dc475e940a9f11a07a6b4c", probe: "u3" },
    { id: "uav_cad", label: "4-Axis UAV (.SLDASM)", uid: "8cbb6bf372794b38897c112f8420f2e7", probe: "u3" },
    { id: "mecanum_cad", label: "Mecanum CAD (.STEP)", uid: "730effbdf205439db75541ff458ed283", probe: "u3" }
  ],

  // 5-Stage Scroll-Driven Engineering Pipeline with Real 3D Models
  pipelineStages: [
    {
      id: "plan",
      num: "STAGE 01 / 05",
      file: "System_Architecture.PrjPcb",
      title: "Product Planning & Architecture",
      desc: "Defining system block diagrams, power budgets, mechanical envelope constraints, and multi-board interconnect topology before layout begins.",
      sketchfabUid: "8cbb6bf372794b38897c112f8420f2e7",
      files: ["System_Arch.PrjPcb", "Power_Budget.BomDoc", "Envelope.DWG"]
    },
    {
      id: "mcad",
      num: "STAGE 02 / 05",
      file: "Mechanical_Assembly.SLDASM",
      title: "3D CAD Modeling (Sketch & Assembly)",
      desc: "Parametric 2D sketching and 3D solid assembly modeling with concentric/coincident mates, bearing tolerances, and full collision checking.",
      sketchfabUid: "ac4d1de3f3dc475e940a9f11a07a6b4c",
      files: ["Toolhead_Assy.SLDASM", "Mount_Bracket.SLDPRT", "Housing.STEP"]
    },
    {
      id: "ecad",
      num: "STAGE 03 / 05",
      file: "Mainboard_Layout.PcbDoc",
      title: "Schematic Capture & 3D PCB Design",
      desc: "Multi-layer impedance-controlled PCB routing, polygon copper pours, thermal via stitching, and 3D STEP co-design inside the ECAD workspace.",
      sketchfabUid: "68bb06b16b1b444495a8ae1ee144ac35",
      files: ["Controller_V4.PcbDoc", "Avionics.SchDoc", "Gerber_X2.OutJob"]
    },
    {
      id: "firmware",
      num: "STAGE 04 / 05",
      file: "stm32_dma_isr.c",
      title: "Bare-Metal Firmware & CLI Bring-Up",
      desc: "Writing deterministic C/C++ timer interrupt handlers, DMA peripheral drivers, and testing hardware-in-the-loop telemetry over a split Linux terminal.",
      sketchfabUid: "7c9803334a7e4938aa2ca2d30c0f432f",
      files: ["main_isr.c", "pid_controller.cpp", "platformio.ini"]
    },
    {
      id: "ready",
      num: "STAGE 05 / 05",
      file: "PRODUCTION_RELEASE.STEP",
      title: "Final Assembly & Product Ready",
      desc: "All mechanical, PCB, and firmware subsystems lock into a field-tested product with complete Gerber, BOM, pick-and-place, and STEP deliverables.",
      sketchfabUid: "730effbdf205439db75541ff458ed283",
      files: ["Production_Gerbers.zip", "BOM_Validated.csv", "Final_Product.STEP"]
    }
  ],

  stats: [
    { n: "15+", l: "Custom PCBs routed & assembled" },
    { n: "4x", l: "National robotics podium finishes" },
    { n: "29th", l: "Global Rank · WRO Future Engineers" },
    { n: "3-in-1", l: "Altium ECAD · 3D MCAD · Firmware" }
  ],

  projects: [
    {
      id: "esp-breakout-pcb",
      badge: "310K POLY 3D PCB",
      ext: ".PcbDoc + .SchDoc",
      category: "ECAD & PCB",
      type: "High-Density Multi-Layer PCB",
      year: "2026",
      sketchfabUid: "68bb06b16b1b444495a8ae1ee144ac35",
      blueprintType: "rigidflex",
      title: "High-Speed Microcontroller & Sensor Mainboard",
      line: "Impedance-matched 4-layer stackup with isolated analog multiplexer, USB-C ESD protection, and buck converter.",
      summary: "Click into the interactive 3D viewer on the left to orbit the actual 3D PCB model, inspect SMD component placement, and review the complete Bill of Materials.",
      facts: {
        Files: "Mainboard.PcbDoc · Sensors.SchDoc · BOM.csv",
        Stackup: "4-Layer FR4 · ENIG · 5/5 mil Track/Space",
        ControlLoop: "4.0 kHz Hard Real-Time DMA ISR",
        Status: "DRC Verified · 100% Routed"
      },
      bom: [
        { ref: "U1", part: "STM32F405RGT6 / ESP32", pkg: "LQFP-64 / QFN", desc: "High-Speed Microcontroller Core", qty: 1 },
        { ref: "U2", part: "CD74HC4067SM96", pkg: "SSOP-24", desc: "16-Channel Analog Multiplexer", qty: 1 },
        { ref: "U3", part: "DRV8833PWP", pkg: "HTSSOP-16", desc: "Dual H-Bridge Motor Driver", qty: 2 }
      ]
    },
    {
      id: "direct-drive-extruder-cad",
      badge: "3D CAD ASSEMBLY",
      ext: ".SLDASM + .SLDPRT",
      category: "3D CAD & Robotics",
      type: "Mechatronics · Motion CAD",
      year: "2026",
      sketchfabUid: "ac4d1de3f3dc475e940a9f11a07a6b4c",
      blueprintType: "corexy",
      title: "CoreXY Direct-Drive Extruder & Hotend Assembly",
      line: "Parametric 3D CAD assembly with NEMA stepper stage, filament drive gears, and cooling shroud.",
      summary: "Complete mechanical CAD assembly modeled with concentric bearing mates, thermal break clearances, and 3D-printable fan duct geometry.",
      facts: {
        Files: "Extruder_Assy.SLDASM · Shroud.SLDPRT · Mount.STEP",
        Controller: "MKS Robin Nano V3.1 + TMC2209 UART",
        Kinematics: "CoreXY 310mm Bed + BLTouch Probe",
        Deliverable: "Full 3D STEP Assembly + Marlin Firmware"
      },
      bom: [
        { ref: "M1", part: "NEMA17-PANCAKE", pkg: "42x24mm", desc: " High-Torque Extruder Stepper", qty: 1 },
        { ref: "U3", part: "TMC2209-LA", pkg: "QFN-28", desc: "Silent Stepper Driver Stage", qty: 4 }
      ]
    },
    {
      id: "uav-vtol-airframe",
      badge: "UAV 3D CAD",
      ext: ".SLDASM + .cpp",
      category: "3D CAD & Robotics",
      type: "Aerospace · Flight Control",
      year: "2026",
      sketchfabUid: "8cbb6bf372794b38897c112f8420f2e7",
      blueprintType: "mcad",
      title: "SN-21 Multi-Axis UAV & Folding-Wing Airframe",
      line: "Carbon-fiber structural linkages, aerodynamic surfaces, and embedded flight transition control stack.",
      summary: "Engineered the structural airframe assembly in 3D CAD alongside the embedded flight controller and DSHOT600 ESC propulsion bus.",
      facts: {
        Files: "SN21_Airframe.SLDASM · Spar_Hinge.SLDPRT · flight_ctrl.cpp",
        Avionics: "F405 Flight Controller + 6-Axis IMU",
        Propulsion: "DSHOT600 Digital ESC Protocol",
        Role: "Project Lead · SN-21 VTOL UAV"
      },
      bom: [
        { ref: "FC1", part: "STM32F405-FC-STACK", pkg: "30.5x30.5mm", desc: "Flight Control Mainboard", qty: 1 },
        { ref: "M1..M4", part: "BLDC-2207-1950KV", pkg: "Stator-22mm", desc: "Brushless Propulsion Motor", qty: 4 }
      ]
    },
    {
      id: "autonomous-robot-platform",
      badge: "SHOWN AT WRO FINAL",
      ext: ".PcbDoc + .SLDASM",
      category: "ECAD & PCB",
      type: "Autonomous Robotics",
      year: "2025",
      sketchfabUid: "7c9803334a7e4938aa2ca2d30c0f432f",
      blueprintType: "lfr",
      title: "Autonomous Robotics & Sensor Fusion Platform",
      line: "Multi-channel reflectance & ultrasonic array, custom power distribution PCB, and closed-loop steering.",
      summary: "Built for national and international autonomous robotics competitions, combining custom circuit boards with 3D-printed mechanical mounts.",
      facts: {
        Files: "Robot_Main.PcbDoc · Chassis.SLDASM · pid_loop.c",
        Milestone: "Global Rank 29th · WRO International Final",
        Podiums: "1st at UIU LFR & CUET Hackathon · 2nd/3rd at BUET",
        Sensors: "16-Ch Multiplexed IR + Ultrasonic ToF"
      },
      bom: [
        { ref: "U1", part: "STM32F4 / ATmega328P", pkg: "TQFP / DIP", desc: "Primary Control Microcontroller", qty: 1 },
        { ref: "SENS1", part: "HC-SR04 / TCRT5000", pkg: "Array", desc: "Obstacle & Line Sensor Array", qty: 6 }
      ]
    }
  ],

  contact: {
    email: "noman@isnoman.vercel.app",
    location: "Dhaka, Bangladesh (UTC+6)",
    status: "D1 LIT · Taking new PCB, 3D CAD & Firmware projects"
  }
};
