// src/data/engineeringData.js
export const WORKBENCH_DATA = {
  engineer: {
    name: "Nurul Islam Noman",
    handle: "isnoman",
    role: "Embedded Systems & Mechatronics Engineer",
    location: "Dhaka, Bangladesh",
    email: "noman@isnoman.vercel.app"
  },

  // 1. ALTIUM DESIGNER (.PcbDoc) WORKSPACE DATA
  altium: {
    file: "TRANSIENT_RESPONSE_V1.PcbDoc",
    stackup: "4-Layer FR4 · ENIG · 1oz Cu",
    drcStatus: "0 Rule Violations (100% Routed)",
    layers: [
      { id: "top", name: "L1 Top Layer", color: "#ff3b30" },
      { id: "gnd", name: "L2 GND Plane", color: "#2eb872" },
      { id: "bottom", name: "L4 Bottom Layer", color: "#007aff" },
      { id: "silk", name: "Top Overlay", color: "#f2f2f7" }
    ],
    nets: [
      {
        id: "U1",
        designator: "U1 · STM32F405RGT6",
        net: "NET_SPI1_BUS",
        package: "LQFP-64 (10x10mm)",
        traceWidth: "8 mil / 50Ω Diff",
        layer: "L1 Top Layer",
        desc: "168MHz ARM Cortex-M4F core executing 4kHz PID loop and DMA ADC sensor multiplexing."
      },
      {
        id: "U2",
        designator: "U2 · DRV8833 / MOSFET H-Bridge",
        net: "NET_PWM_MOTOR",
        package: "HTSSOP-16 Thermal Pad",
        traceWidth: "40 mil Polygon Pour",
        layer: "L1 Top + L4 Bottom Stitched",
        desc: "High-current dual H-bridge driver stage with thermal via array stitched to L2 GND plane."
      },
      {
        id: "J1",
        designator: "J1 · 16-CH IR Mux Header",
        net: "NET_ADC_MUX",
        package: "FPC-20P 0.5mm Pitch",
        traceWidth: "6 mil Guarded",
        layer: "L4 Bottom Layer",
        desc: "Analog multiplexer bus shielded by L2 solid ground reference plane to prevent motor EMI."
      }
    ]
  },

  // 2. SOLIDWORKS (.SLDASM) WORKSPACE DATA
  solidworks: {
    file: "SN21_Transwing_Chassis.SLDASM",
    mass: "412.6 g",
    material: "3K Carbon Fiber + 6061-T6 Al + PETG",
    interference: "0 Interferences Detected",
    features: [
      {
        id: "top_shell",
        name: "Aero_Canopy_Shell1.SLDPRT",
        type: "Surface-Loft1 + Shell (1.6mm)",
        material: "LW-PLA / PETG",
        mate: "Concentric1 + Coincident2",
        desc: "Aerodynamic upper housing protecting flight controller stack and GPS/telemetry module."
      },
      {
        id: "pcb_core",
        name: "FC_Mainboard_STEP.SLDPRT",
        type: "Imported STEP (Altium Co-Design)",
        material: "FR-4 Epoxy Glass",
        mate: "4x M3 Vibration Standoffs",
        desc: "3D STEP model exported directly from Altium Designer to verify connector and mounting clearances."
      },
      {
        id: "base_frame",
        name: "Folding_Wing_Hub.SLDPRT",
        type: "Boss-Extrude1 + Fillet3 + Mirror1",
        material: "CNC 6061-T6 Aluminum & Carbon",
        mate: "Fixed Ground Component",
        desc: "Structural load-bearing frame housing the Transwing tilt-rotor servo linkages and battery bay."
      }
    ]
  },

  // 3. VS CODE + PLATFORMIO WORKSPACE DATA
  vscode: {
    project: "FIRMWARE_STM32F4_CORE",
    mcu: "STM32F405RG (168 MHz)",
    flashUsage: "42.8% (224 KB / 512 KB)",
    ramUsage: "18.4% (24 KB / 128 KB)",
    files: {
      "main.c": [
        { ln: 1, code: "#include \"stm32f4xx_hal.h\"", info: "CMSIS & HAL Hardware Abstraction Layer" },
        { ln: 2, code: "#include \"pid_controller.h\"", info: "Custom fixed-point/float PID control loop" },
        { ln: 3, code: "", info: "" },
        { ln: 4, code: "void TIM1_UP_TIM10_IRQHandler(void) {", info: "Deterministic 4kHz hardware timer interrupt" },
        { ln: 5, code: "  HAL_ADC_Start_DMA(&hadc1, (uint32_t*)ir_buf, 16);", info: "Zero-CPU-overhead 16-channel DMA sensor read" },
        { ln: 6, code: "  float pos_err = compute_weighted_line(ir_buf);", info: "Interpolates sub-millimeter track error" },
        { ln: 7, code: "  float u = pid_step(&lfr_pid, pos_err, 0.00025f);", info: "Computes PD + derivative low-pass filter output" },
        { ln: 8, code: "  motor_set_dshot600(BASE_SPEED - u, BASE_SPEED + u);", info: "Updates motor ESC/H-bridge duty cycles" },
        { ln: 9, code: "}", info: "End of real-time control ISR" }
      ],
      "platformio.ini": [
        { ln: 1, code: "[env:genericSTM32F405RG]", info: "Target board environment definition" },
        { ln: 2, code: "platform = ststm32", info: "ST STM32 development platform" },
        { ln: 3, code: "board = genericSTM32F405RG", info: "168MHz Cortex-M4F MCU" },
        { ln: 4, code: "framework = stm32cube", info: "Bare-metal + STM32Cube HAL" },
        { ln: 5, code: "upload_protocol = stlink", info: "SWD hardware debugging via ST-Link V2" },
        { ln: 6, code: "build_flags = -O3 -mfpu=fpv4-sp-d16 -mfloat-abi=hard", info: "Hardware FPU acceleration enabled" }
      ]
    }
  },

  // 4. MULTI-DISCIPLINARY PROJECTS
  projects: [
    {
      id: "transient-response-v1",
      ext: ".PcbDoc + .c",
      category: "ECAD & Firmware",
      year: "2026",
      title: "TRANSIENT RESPONSE V1 High-Speed LFR",
      desc: "Custom STM32F4 mainboard with 16-channel multiplexed IR array, high-frequency PID control loop, and low-inductance motor driver layout.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      tags: ["Altium 4-Layer", "STM32F4", "DMA ADC", "BUET Podium"],
      ecadSpec: "4-Layer FR4, isolated analog/digital grounds, 0402/0603 SMD passives.",
      mcadSpec: "Low-center-of-gravity carbon fiber chassis with custom 3D-printed sensor shroud.",
      fwSpec: "Bare-metal C/C++ with hardware timer ISR, DMA sensor capture, and flash telemetry logging."
    },
    {
      id: "sn21-vtol-uav",
      ext: ".SLDASM + .cpp",
      category: "MCAD & Avionics",
      year: "2026",
      title: "SN-21 Folding-Wing Transwing VTOL UAV",
      desc: "Variable-geometry unmanned aerial vehicle transitioning between quadrotor hover and fixed-wing cruise using custom folding-wing kinematics.",
      image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80",
      tags: ["SOLIDWORKS", "Aerodynamics", "Flight Control", "VTOL"],
      ecadSpec: "Custom power distribution & servo bus routing with redundant BEC rails.",
      mcadSpec: "Full SOLIDWORKS assembly with stress-tested folding-wing spar hinges and CFD airflow validation.",
      fwSpec: "Transition attitude mixing, IMU sensor fusion, and DSHOT600 ESC telemetry."
    },
    {
      id: "abhash-haptic-cane",
      ext: ".SLDPRT + .PcbDoc",
      category: "Full Product Prototype",
      year: "2024",
      title: "ABHASH Intelligent Haptic White Cane",
      desc: "Assistive navigation module with multi-angle ultrasonic obstacle array, custom PCB, and ergonomic 3D-printed enclosure for visually impaired users.",
      image: "/assets/photos/abhash-01-768x576.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      tags: ["Altium Designer", "SOLIDWORKS", "Ultrasonic Array", "Assistive Tech"],
      ecadSpec: "Compact multi-sensor carrier board with localized haptic driver stages and Li-Ion BMS.",
      mcadSpec: "Curved multi-axis ultrasonic transducer housing modeled in SOLIDWORKS for cane shaft mounting.",
      fwSpec: "Time-of-flight distance filtering and spatially mapped vibration pulse modulation."
    },
    {
      id: "corexy-ender-conversion",
      ext: ".SLDASM + Marlin",
      category: "MCAD & Mechatronics",
      year: "2026",
      title: "High-Speed CoreXY 3D Printer Architecture",
      desc: "Complete mechanical and electrical conversion featuring MKS Robin Nano V3.1, TMC2209 silent UART drivers, BIQU H2 direct drive, and 310mm bed.",
      image: "/assets/photos/binder-jet-01-768x576.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80",
      tags: ["CoreXY CAD", "MKS Robin Nano", "TMC2209", "Marlin 2.x"],
      ecadSpec: "Custom wire harness routing, 24V power distribution, and UART stepper current control.",
      mcadSpec: "Rigid CoreXY belt path geometry, custom gantry mounts, and BLTouch probe offset bracket.",
      fwSpec: "Customized Marlin firmware with input shaping, linear advance, and bilinear bed leveling."
    }
  ]
};