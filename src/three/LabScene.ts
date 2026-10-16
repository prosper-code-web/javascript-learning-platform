import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createGridFloorTexture, createStationRingTexture, createDigitalDisplayTexture } from './materials';
import { STATIONS } from '../data/curriculum';
import { StationId } from '../types';

// Pre-allocated reusable math vectors (Zero-GC in animation loop)
const _vec3A = new THREE.Vector3();
const _vec3B = new THREE.Vector3();

export interface LabCallbacks {
  onStationSelect: (stationId: StationId) => void;
  onHoverStation?: (stationId: StationId | null) => void;
}

export class LabScene {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animFrameId: number | null = null;
  private clock: THREE.Clock;

  // Camera damping state
  private targetCameraPos = new THREE.Vector3(0, 18, 22);
  private targetLookAt = new THREE.Vector3(0, 1, 0);
  private currentLookAt = new THREE.Vector3(0, 1, 0);

  // Interaction & Raycasting
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2(-999, -999);
  private stationClickTargets: { mesh: THREE.Object3D; stationId: StationId }[] = [];
  private hoveredStationId: StationId | null = null;
  private callbacks: LabCallbacks;

  // Dynamic Station Meshes for animations & code reactions
  private centralCoreMesh!: THREE.Mesh;
  private centralRing1!: THREE.Mesh;
  private centralRing2!: THREE.Mesh;
  private vaultCylinders: THREE.Mesh[] = [];
  private switchGates: { leftGate: THREE.Mesh; rightGate: THREE.Mesh; beam: THREE.Mesh } | null = null;
  private turbineRotor: THREE.Mesh | null = null;
  private conveyorBoxes: THREE.Mesh[] = [];
  private droneGroup: THREE.Group | null = null;
  private droneEye: THREE.Mesh | null = null;
  private laserBeam: THREE.Mesh | null = null;
  private portalRings: THREE.Mesh[] = [];
  private reactorCore: THREE.Mesh | null = null;
  private floatingSymbols: THREE.Group[] = [];

  // Runtime dynamic params controllable via JS Sandbox
  public coreSpeed = 1.0;
  public coreColor = new THREE.Color('#38bdf8');
  public isShieldActive = true;

  constructor(container: HTMLElement, callbacks: LabCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.clock = new THREE.Clock();

    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#030712');
    this.scene.fog = new THREE.FogExp2('#030712', 0.018);

    // 2. Camera setup
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(48, aspect, 0.1, 200);
    this.camera.position.set(0, 18, 22);
    this.camera.lookAt(this.currentLookAt);

    // 3. Renderer setup
    const isHeadless = typeof navigator !== 'undefined' && (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));
    this.renderer = new THREE.WebGLRenderer({
      antialias: !isHeadless,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = !isHeadless;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // 4. Studio Environment Reflection
    try {
      const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch {
      // Fallback if WebGL context creation limits
    }

    // 5. Lighting rig
    this.setupLighting();

    // 6. Build the 3D Lab architecture
    this.buildLabEnvironment();

    // 7. Event listeners
    this.bindEvents();

    // 8. Pre-compile shaders
    this.renderer.compile(this.scene, this.camera);

    // 9. Start game/render loop
    this.animate();
  }

  private setupLighting() {
    // Balanced 3-point studio lighting + cool/warm contrast
    const hemiLight = new THREE.HemisphereLight('#38bdf8', '#0f172a', 0.8);
    this.scene.add(hemiLight);

    // Warm Key Light with shadows
    const keyLight = new THREE.DirectionalLight('#ffffff', 1.8);
    keyLight.position.set(15, 25, 12);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 60;
    keyLight.shadow.camera.left = -25;
    keyLight.shadow.camera.right = 25;
    keyLight.shadow.camera.top = 25;
    keyLight.shadow.camera.bottom = -25;
    this.scene.add(keyLight);

    // Cool Rim light
    const rimLight = new THREE.DirectionalLight('#6366f1', 1.2);
    rimLight.position.set(-18, 15, -15);
    this.scene.add(rimLight);

    // Center Core point light
    const corePointLight = new THREE.PointLight('#38bdf8', 2.5, 20, 1.2);
    corePointLight.position.set(0, 3, 0);
    this.scene.add(corePointLight);
  }

  private buildLabEnvironment() {
    // --- Ground Floor with procedural tech grid ---
    const floorGeo = new THREE.PlaneGeometry(80, 80);
    const floorMat = new THREE.MeshStandardMaterial({
      map: createGridFloorTexture(),
      roughness: 0.35,
      metalness: 0.7,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // --- Laboratory Perimeter Wall Ring ---
    const wallGeo = new THREE.CylinderGeometry(28, 28, 6, 64, 1, true);
    const wallMat = new THREE.MeshStandardMaterial({
      color: '#090d16',
      roughness: 0.8,
      metalness: 0.3,
      side: THREE.BackSide,
    });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.y = 3;
    this.scene.add(wall);

    // Accent glowing ring on top of the wall
    const wallRingGeo = new THREE.TorusGeometry(28, 0.15, 16, 64);
    const wallRingMat = new THREE.MeshBasicMaterial({ color: '#1e293b' });
    const wallRing = new THREE.Mesh(wallRingGeo, wallRingMat);
    wallRing.rotation.x = Math.PI / 2;
    wallRing.position.y = 6;
    this.scene.add(wallRing);

    // --- Central Holographic JS Quantum Core ---
    this.buildCentralCore();

    // --- Ambient Floating JS Syntax Badges ---
    this.buildFloatingSymbols();

    // --- Build 8 Specialized Interactive Stations ---
    STATIONS.forEach((station) => {
      this.buildStationApparatus(station);
    });
  }

  private buildCentralCore() {
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 0, 0);

    // Tiered Circular Base Pedestal (3 parts)
    const baseBottomGeo = new THREE.CylinderGeometry(3.6, 4.0, 0.4, 32);
    const baseBottomMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.2, metalness: 0.9 });
    const baseBottom = new THREE.Mesh(baseBottomGeo, baseBottomMat);
    baseBottom.position.y = 0.2;
    baseBottom.receiveShadow = true;
    coreGroup.add(baseBottom);

    const baseMidGeo = new THREE.CylinderGeometry(3.0, 3.4, 0.3, 32);
    const baseMidMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.4, metalness: 0.8 });
    const baseMid = new THREE.Mesh(baseMidGeo, baseMidMat);
    baseMid.position.y = 0.55;
    coreGroup.add(baseMid);

    // Glowing Core Reactor Floor Plate
    const floorPlateGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.05, 32);
    const floorPlateMat = new THREE.MeshStandardMaterial({
      color: '#0284c7',
      emissive: '#0369a1',
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.9,
    });
    const floorPlate = new THREE.Mesh(floorPlateGeo, floorPlateMat);
    floorPlate.position.y = 0.72;
    coreGroup.add(floorPlate);

    // Floating Geodesic Crystal (JavaScript Core)
    const crystalGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: '#38bdf8',
      emissive: '#0284c7',
      emissiveIntensity: 0.7,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.8,
      thickness: 1.2,
      wireframe: false,
    });
    this.centralCoreMesh = new THREE.Mesh(crystalGeo, crystalMat);
    this.centralCoreMesh.position.y = 2.6;
    this.centralCoreMesh.castShadow = true;
    coreGroup.add(this.centralCoreMesh);

    // Gyroscope Energy Rings
    const ringGeo1 = new THREE.TorusGeometry(2.0, 0.04, 16, 64);
    const ringMat1 = new THREE.MeshStandardMaterial({ color: '#38bdf8', emissive: '#38bdf8', emissiveIntensity: 0.8, roughness: 0.2, metalness: 0.8 });
    this.centralRing1 = new THREE.Mesh(ringGeo1, ringMat1);
    this.centralRing1.position.y = 2.6;
    coreGroup.add(this.centralRing1);

    const ringGeo2 = new THREE.TorusGeometry(2.3, 0.03, 16, 64);
    const ringMat2 = new THREE.MeshStandardMaterial({ color: '#a855f7', emissive: '#a855f7', emissiveIntensity: 0.8, roughness: 0.2, metalness: 0.8 });
    this.centralRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    this.centralRing2.position.y = 2.6;
    coreGroup.add(this.centralRing2);

    this.scene.add(coreGroup);
  }

  private buildFloatingSymbols() {
    const symbols = ['{ }', '=>', '[ ]', '===', 'async', 'let', 'const', '.map()'];
    const radius = 9.5;

    symbols.forEach((sym, idx) => {
      const angle = (idx / symbols.length) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 44px "Fira Code", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sym, 128, 64);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;

      const planeGeo = new THREE.PlaneGeometry(1.6, 0.8);
      const planeMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(planeGeo, planeMat);
      mesh.position.set(x, 2.5 + Math.sin(idx) * 0.4, z);
      mesh.lookAt(0, 2.5, 0);

      const group = new THREE.Group();
      group.add(mesh);
      group.userData = { initialY: mesh.position.y, phase: idx * 0.8 };
      this.floatingSymbols.push(group);
      this.scene.add(group);
    });
  }

  private buildStationApparatus(station: (typeof STATIONS)[0]) {
    const group = new THREE.Group();
    group.position.set(...station.stationPos);

    // 1. Station Base Platform (Composite 3 parts)
    const baseGeo = new THREE.CylinderGeometry(2.4, 2.7, 0.35, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: '#090d16',
      roughness: 0.3,
      metalness: 0.8,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 0.175;
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    // Floor Decal Ring with procedural station texture
    const decalRingGeo = new THREE.PlaneGeometry(4.4, 4.4);
    const decalRingMat = new THREE.MeshBasicMaterial({
      map: createStationRingTexture(station.accentColor, `0${station.id}`),
      transparent: true,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const decalRing = new THREE.Mesh(decalRingGeo, decalRingMat);
    decalRing.rotation.x = -Math.PI / 2;
    decalRing.position.y = 0.36;
    group.add(decalRing);

    // Hit-testing proxy cylinder for easy clicking
    const hitBoxGeo = new THREE.CylinderGeometry(2.5, 2.5, 3.5, 16);
    const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
    hitBox.position.y = 1.75;
    group.add(hitBox);
    this.stationClickTargets.push({ mesh: hitBox, stationId: station.id });

    // Station Terminal Display Stand
    const terminalPillarGeo = new THREE.BoxGeometry(0.2, 1.2, 0.2);
    const terminalPillarMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.4, metalness: 0.8 });
    const terminalPillar = new THREE.Mesh(terminalPillarGeo, terminalPillarMat);
    terminalPillar.position.set(0, 0.9, 1.3);
    group.add(terminalPillar);

    const screenGeo = new THREE.PlaneGeometry(1.2, 0.6);
    const screenMat = new THREE.MeshBasicMaterial({
      map: createDigitalDisplayTexture(`STATION 0${station.id}`, station.shortTitle, station.accentColor),
      side: THREE.DoubleSide,
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 1.6, 1.3);
    screen.rotation.x = -0.3;
    group.add(screen);

    // 2. Station-Specific Unique Physical Apparatus:
    switch (station.id) {
      case 1: // The Variable Vault
        this.buildVaultApparatus(group, station.accentColor);
        break;
      case 2: // The Logic Switchboard
        this.buildSwitchboardApparatus(group, station.accentColor);
        break;
      case 3: // The Function Transformer
        this.buildFunctionApparatus(group, station.accentColor);
        break;
      case 4: // The Loop Conveyor
        this.buildConveyorApparatus(group, station.accentColor);
        break;
      case 5: // The Holo-Drone Workbench
        this.buildDroneApparatus(group, station.accentColor);
        break;
      case 6: // The Event Horizon Chamber
        this.buildEventApparatus(group, station.accentColor);
        break;
      case 7: // The Quantum Async Portal
        this.buildPortalApparatus(group, station.accentColor);
        break;
      case 8: // The JS Core Reactor
        this.buildReactorApparatus(group, station.accentColor);
        break;
    }

    this.scene.add(group);
  }

  // --- Specialized Station 1: Variable Vault ---
  private buildVaultApparatus(parent: THREE.Group, accentColor: string) {
    const tubePositions = [-0.9, 0, 0.9];
    const labels = ['let', 'const', 'var'];

    tubePositions.forEach((posX, i) => {
      // Cylinder Base & Top caps
      const capGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.1, 16);
      const capMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.2, metalness: 0.9 });
      const capBottom = new THREE.Mesh(capGeo, capMat);
      capBottom.position.set(posX, 0.45, -0.2);
      parent.add(capBottom);

      const capTop = new THREE.Mesh(capGeo, capMat);
      capTop.position.set(posX, 1.75, -0.2);
      parent.add(capTop);

      // Glass Tube
      const glassGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.2, 16);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: '#ffffff',
        transmission: 0.9,
        roughness: 0.05,
        thickness: 0.4,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
      });
      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.position.set(posX, 1.1, -0.2);
      parent.add(glass);

      // Glowing Data Core inside tube
      const coreGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
      const coreMat = new THREE.MeshStandardMaterial({
        color: accentColor,
        emissive: accentColor,
        emissiveIntensity: 0.9,
        roughness: 0.2,
      });
      const dataCube = new THREE.Mesh(coreGeo, coreMat);
      dataCube.position.set(posX, 1.1, -0.2);
      dataCube.userData = { initialY: 1.1, speed: 1.5 + i * 0.5 };
      parent.add(dataCube);
      this.vaultCylinders.push(dataCube);
    });
  }

  // --- Specialized Station 2: Logic Switchboard ---
  private buildSwitchboardApparatus(parent: THREE.Group, accentColor: string) {
    // Emitter prism
    const prismGeo = new THREE.ConeGeometry(0.4, 0.8, 4);
    const prismMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.2, metalness: 0.9 });
    const prism = new THREE.Mesh(prismGeo, prismMat);
    prism.position.set(0, 0.75, 0.3);
    prism.rotation.y = Math.PI / 4;
    parent.add(prism);

    // Left Gate (True path)
    const gateGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16);
    const trueMat = new THREE.MeshStandardMaterial({ color: '#10b981', emissive: '#10b981', emissiveIntensity: 0.8 });
    const leftGate = new THREE.Mesh(gateGeo, trueMat);
    leftGate.position.set(-0.8, 0.8, -0.6);
    parent.add(leftGate);

    // Right Gate (False path)
    const falseMat = new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#ef4444', emissiveIntensity: 0.4 });
    const rightGate = new THREE.Mesh(gateGeo, falseMat);
    rightGate.position.set(0.8, 0.8, -0.6);
    parent.add(rightGate);

    // Energy Conduit Beam
    const beamGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8);
    const beamMat = new THREE.MeshBasicMaterial({ color: accentColor });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(-0.4, 0.75, -0.15);
    beam.rotation.z = Math.PI / 3;
    parent.add(beam);

    this.switchGates = { leftGate, rightGate, beam };
  }

  // --- Specialized Station 3: Function Transformer ---
  private buildFunctionApparatus(parent: THREE.Group, accentColor: string) {
    // Transformer Chamber Body
    const chamberGeo = new THREE.CylinderGeometry(0.8, 1.0, 1.4, 24);
    const chamberMat = new THREE.MeshStandardMaterial({ color: '#1e1b4b', roughness: 0.3, metalness: 0.8 });
    const chamber = new THREE.Mesh(chamberGeo, chamberMat);
    chamber.position.set(0, 1.05, -0.2);
    parent.add(chamber);

    // Rotating Turbine Rotor on top
    const rotorGeo = new THREE.TorusGeometry(0.5, 0.08, 16, 24);
    const rotorMat = new THREE.MeshStandardMaterial({ color: accentColor, emissive: accentColor, emissiveIntensity: 0.8 });
    this.turbineRotor = new THREE.Mesh(rotorGeo, rotorMat);
    this.turbineRotor.position.set(0, 1.8, -0.2);
    this.turbineRotor.rotation.x = Math.PI / 2;
    parent.add(this.turbineRotor);
  }

  // --- Specialized Station 4: Loop Conveyor ---
  private buildConveyorApparatus(parent: THREE.Group, accentColor: string) {
    // Conveyor track
    const trackGeo = new THREE.BoxGeometry(2.2, 0.15, 0.8);
    const trackMat = new THREE.MeshStandardMaterial({ color: '#1f2937', roughness: 0.4, metalness: 0.9 });
    const track = new THREE.Mesh(trackGeo, trackMat);
    track.position.set(0, 0.6, -0.2);
    parent.add(track);

    // Scanner Arch
    const archGeo = new THREE.TorusGeometry(0.5, 0.05, 12, 16, Math.PI);
    const archMat = new THREE.MeshStandardMaterial({ color: accentColor, emissive: accentColor, emissiveIntensity: 0.8 });
    const arch = new THREE.Mesh(archGeo, archMat);
    arch.position.set(0, 0.68, -0.2);
    parent.add(arch);

    // 3 Cargo Boxes moving along track
    const boxGeo = new THREE.BoxGeometry(0.28, 0.28, 0.28);
    for (let i = 0; i < 3; i++) {
      const boxMat = new THREE.MeshStandardMaterial({
        color: i === 1 ? '#10b981' : '#f59e0b',
        roughness: 0.3,
        metalness: 0.6,
      });
      const box = new THREE.Mesh(boxGeo, boxMat);
      box.position.set(-0.8 + i * 0.8, 0.82, -0.2);
      box.userData = { initialX: -0.8 + i * 0.8, offset: i };
      parent.add(box);
      this.conveyorBoxes.push(box);
    }
  }

  // --- Specialized Station 5: Holo-Drone Workbench ---
  private buildDroneApparatus(parent: THREE.Group, accentColor: string) {
    // Workbench table
    const tableGeo = new THREE.CylinderGeometry(1.2, 1.3, 0.3, 24);
    const tableMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.3, metalness: 0.8 });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(0, 0.5, -0.2);
    parent.add(table);

    // Procedural 3D Drone (Group of 6 parts)
    this.droneGroup = new THREE.Group();
    this.droneGroup.position.set(0, 1.4, -0.2);

    // 1. Drone central fuselage
    const fuselageGeo = new THREE.SphereGeometry(0.35, 16, 16);
    fuselageGeo.scale(1.2, 0.6, 1.2);
    const fuselageMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.2, metalness: 0.9 });
    const fuselage = new THREE.Mesh(fuselageGeo, fuselageMat);
    this.droneGroup.add(fuselage);

    // 2. Glowing sensor eye
    const eyeGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const eyeMat = new THREE.MeshStandardMaterial({ color: accentColor, emissive: accentColor, emissiveIntensity: 1.2 });
    this.droneEye = new THREE.Mesh(eyeGeo, eyeMat);
    this.droneEye.position.set(0, 0.05, 0.32);
    this.droneGroup.add(this.droneEye);

    // 3. 4 Quad-rotors/stabilizer pylons
    const pylonGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8);
    const pylonMat = new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.3, metalness: 0.8 });

    const angles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
    angles.forEach((ang) => {
      const pylon = new THREE.Mesh(pylonGeo, pylonMat);
      pylon.rotation.z = Math.PI / 2;
      pylon.rotation.y = ang;
      pylon.position.set(Math.cos(ang) * 0.35, 0, Math.sin(ang) * 0.35);
      this.droneGroup!.add(pylon);

      // Micro thruster ring
      const thrusterGeo = new THREE.TorusGeometry(0.12, 0.02, 8, 16);
      const thrusterMat = new THREE.MeshBasicMaterial({ color: accentColor });
      const thruster = new THREE.Mesh(thrusterGeo, thrusterMat);
      thruster.rotation.x = Math.PI / 2;
      thruster.position.set(Math.cos(ang) * 0.65, 0, Math.sin(ang) * 0.65);
      this.droneGroup!.add(thruster);
    });

    parent.add(this.droneGroup);
  }

  // --- Specialized Station 6: Event Horizon Chamber ---
  private buildEventApparatus(parent: THREE.Group, accentColor: string) {
    // Pressure Sensor Pad
    const padGeo = new THREE.CylinderGeometry(0.9, 1.0, 0.1, 24);
    const padMat = new THREE.MeshStandardMaterial({ color: '#0891b2', emissive: '#0891b2', emissiveIntensity: 0.5 });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.position.set(0, 0.42, 0.1);
    parent.add(pad);

    // Laser emitter columns
    const colGeo = new THREE.CylinderGeometry(0.1, 0.12, 1.6, 12);
    const colMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.3, metalness: 0.8 });
    const leftCol = new THREE.Mesh(colGeo, colMat);
    leftCol.position.set(-0.8, 1.15, -0.4);
    parent.add(leftCol);

    const rightCol = new THREE.Mesh(colGeo, colMat);
    rightCol.position.set(0.8, 1.15, -0.4);
    parent.add(rightCol);

    // Interactive Laser Tripwire Beam
    const laserGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.6, 8);
    const laserMat = new THREE.MeshBasicMaterial({ color: accentColor });
    this.laserBeam = new THREE.Mesh(laserGeo, laserMat);
    this.laserBeam.rotation.z = Math.PI / 2;
    this.laserBeam.position.set(0, 1.2, -0.4);
    parent.add(this.laserBeam);
  }

  // --- Specialized Station 7: Quantum Async Portal ---
  private buildPortalApparatus(parent: THREE.Group, accentColor: string) {
    // Portal Base arch
    const basePillarGeo = new THREE.BoxGeometry(0.3, 1.8, 0.3);
    const pillarMat = new THREE.MeshStandardMaterial({ color: '#1e1b4b', roughness: 0.3, metalness: 0.8 });
    const leftPillar = new THREE.Mesh(basePillarGeo, pillarMat);
    leftPillar.position.set(-0.8, 1.2, -0.2);
    parent.add(leftPillar);

    const rightPillar = new THREE.Mesh(basePillarGeo, pillarMat);
    rightPillar.position.set(0.8, 1.2, -0.2);
    parent.add(rightPillar);

    // 2 Concentric Gyro Rings
    const ring1Geo = new THREE.TorusGeometry(0.7, 0.04, 16, 32);
    const ring1Mat = new THREE.MeshStandardMaterial({ color: accentColor, emissive: accentColor, emissiveIntensity: 0.9 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.position.set(0, 1.2, -0.2);
    parent.add(ring1);
    this.portalRings.push(ring1);

    const ring2Geo = new THREE.TorusGeometry(0.5, 0.03, 16, 32);
    const ring2Mat = new THREE.MeshStandardMaterial({ color: '#ec4899', emissive: '#ec4899', emissiveIntensity: 0.9 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.position.set(0, 1.2, -0.2);
    parent.add(ring2);
    this.portalRings.push(ring2);
  }

  // --- Specialized Station 8: Master Lab Reactor ---
  private buildReactorApparatus(parent: THREE.Group, accentColor: string) {
    // Reactor Core Struts
    const strutGeo = new THREE.CylinderGeometry(0.08, 0.1, 1.8, 12);
    const strutMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.2, metalness: 0.9 });

    for (let i = 0; i < 4; i++) {
      const ang = (i / 4) * Math.PI * 2;
      const strut = new THREE.Mesh(strutGeo, strutMat);
      strut.position.set(Math.cos(ang) * 0.7, 1.2, Math.sin(ang) * 0.7 - 0.2);
      parent.add(strut);
    }

    // Floating Plasma Sphere
    const plasmaGeo = new THREE.SphereGeometry(0.4, 24, 24);
    const plasmaMat = new THREE.MeshPhysicalMaterial({
      color: accentColor,
      emissive: accentColor,
      emissiveIntensity: 1.5,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.7,
      thickness: 1.0,
    });
    this.reactorCore = new THREE.Mesh(plasmaGeo, plasmaMat);
    this.reactorCore.position.set(0, 1.2, -0.2);
    parent.add(this.reactorCore);
  }

  // --- Interaction & Events ---
  private bindEvents() {
    window.addEventListener('resize', this.onResize);
    this.container.addEventListener('pointermove', this.onPointerMove);
    this.container.addEventListener('pointerdown', this.onPointerDown);
  }

  private onResize = () => {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private onPointerMove = (e: MouseEvent) => {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hitObjects = this.stationClickTargets.map((t) => t.mesh);
    const intersects = this.raycaster.intersectObjects(hitObjects, false);

    if (intersects.length > 0) {
      const hit = this.stationClickTargets.find((t) => t.mesh === intersects[0].object);
      if (hit && hit.stationId !== this.hoveredStationId) {
        this.hoveredStationId = hit.stationId;
        this.container.style.cursor = 'pointer';
        this.callbacks.onHoverStation?.(hit.stationId);
      }
    } else if (this.hoveredStationId !== null) {
      this.hoveredStationId = null;
      this.container.style.cursor = 'default';
      this.callbacks.onHoverStation?.(null);
    }
  };

  private onPointerDown = () => {
    if (this.hoveredStationId !== null) {
      this.callbacks.onStationSelect(this.hoveredStationId);
    }
  };

  // --- Public Control APIs for React & JavaScript Sandbox ---
  public focusStation(stationId: StationId) {
    const station = STATIONS.find((s) => s.id === stationId);
    if (!station) return;
    this.targetCameraPos.set(...station.cameraPos);
    this.targetLookAt.set(...station.cameraTarget);
  }

  public resetToOverview() {
    this.targetCameraPos.set(0, 18, 22);
    this.targetLookAt.set(0, 1, 0);
  }

  public focusCenterCore() {
    this.targetCameraPos.set(0, 4.5, 7);
    this.targetLookAt.set(0, 2.5, 0);
  }

  public triggerVisualAction(actionName: string) {
    if (actionName === 'vault-charge') {
      this.vaultCylinders.forEach((cube) => {
        cube.scale.set(1.4, 1.4, 1.4);
        setTimeout(() => cube.scale.set(1, 1, 1), 600);
      });
    } else if (actionName === 'switch-activate' && this.switchGates) {
      this.switchGates.beam.scale.set(1.5, 1.5, 1.5);
      setTimeout(() => this.switchGates?.beam.scale.set(1, 1, 1), 600);
    } else if (actionName === 'turbine-spin') {
      if (this.turbineRotor) {
        this.turbineRotor.scale.set(1.3, 1.3, 1.3);
        setTimeout(() => this.turbineRotor?.scale.set(1, 1, 1), 700);
      }
    } else if (actionName === 'drone-hover' && this.droneGroup) {
      this.droneGroup.position.y += 0.4;
      setTimeout(() => {
        if (this.droneGroup) this.droneGroup.position.y -= 0.4;
      }, 800);
    } else if (actionName === 'reactor-overdrive') {
      this.coreSpeed = 3.5;
      if (this.reactorCore) {
        this.reactorCore.scale.set(1.8, 1.8, 1.8);
        setTimeout(() => {
          this.reactorCore?.scale.set(1, 1, 1);
          this.coreSpeed = 1.0;
        }, 1500);
      }
    }
  }

  public setDroneEyeColor(colorHex: string) {
    if (this.droneEye) {
      (this.droneEye.material as THREE.MeshStandardMaterial).color.set(colorHex);
      (this.droneEye.material as THREE.MeshStandardMaterial).emissive.set(colorHex);
    }
  }

  // --- Animation Loop ---
  private animate = () => {
    this.animFrameId = requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.1);
    const elapsed = this.clock.getElapsedTime();

    // 1. Silky-Smooth Exponential Damping for Camera position & lookAt
    this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, this.targetCameraPos.x, 3.5, delta);
    this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, this.targetCameraPos.y, 3.5, delta);
    this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, this.targetCameraPos.z, 3.5, delta);

    this.currentLookAt.x = THREE.MathUtils.damp(this.currentLookAt.x, this.targetLookAt.x, 3.5, delta);
    this.currentLookAt.y = THREE.MathUtils.damp(this.currentLookAt.y, this.targetLookAt.y, 3.5, delta);
    this.currentLookAt.z = THREE.MathUtils.damp(this.currentLookAt.z, this.targetLookAt.z, 3.5, delta);
    this.camera.lookAt(this.currentLookAt);

    // 2. Animate Central Holographic Core
    if (this.centralCoreMesh) {
      this.centralCoreMesh.rotation.y += 0.8 * this.coreSpeed * delta;
      this.centralCoreMesh.rotation.x += 0.4 * this.coreSpeed * delta;
      this.centralCoreMesh.position.y = 2.6 + Math.sin(elapsed * 2) * 0.15;
    }
    if (this.centralRing1) {
      this.centralRing1.rotation.z += 1.2 * this.coreSpeed * delta;
      this.centralRing1.rotation.x = Math.sin(elapsed * 0.8) * 0.4;
    }
    if (this.centralRing2) {
      this.centralRing2.rotation.y += 0.9 * this.coreSpeed * delta;
      this.centralRing2.rotation.z = Math.cos(elapsed * 0.9) * 0.5;
    }

    // 3. Animate Floating JS Syntax Badges
    this.floatingSymbols.forEach((grp) => {
      const initY = grp.userData.initialY || 2.5;
      const phase = grp.userData.phase || 0;
      grp.position.y = Math.sin(elapsed * 1.5 + phase) * 0.25;
      grp.rotation.y += 0.3 * delta;
    });

    // 4. Animate Vault floating cubes
    this.vaultCylinders.forEach((cube) => {
      const initY = cube.userData.initialY || 1.1;
      const speed = cube.userData.speed || 1.5;
      cube.position.y = initY + Math.sin(elapsed * speed) * 0.12;
      cube.rotation.y += 1.2 * delta;
    });

    // 5. Animate Function Transformer Turbine
    if (this.turbineRotor) {
      this.turbineRotor.rotation.z += 3.0 * delta;
    }

    // 6. Animate Loop Conveyor Boxes
    this.conveyorBoxes.forEach((box) => {
      const speed = 0.5;
      const totalWidth = 2.0;
      let x = box.position.x + speed * delta;
      if (x > 0.9) x = -0.9;
      box.position.x = x;
    });

    // 7. Animate Holo-Drone hover motion
    if (this.droneGroup) {
      this.droneGroup.position.y = 1.4 + Math.sin(elapsed * 2.5) * 0.08;
      this.droneGroup.rotation.y = Math.sin(elapsed * 0.8) * 0.2;
    }

    // 8. Animate Portal Gyro Rings
    this.portalRings.forEach((ring, i) => {
      ring.rotation.z += (i === 0 ? 2.0 : -2.5) * delta;
      ring.rotation.x = Math.sin(elapsed * 1.5 + i) * 0.3;
    });

    // 9. Animate Reactor Core Plasma
    if (this.reactorCore) {
      this.reactorCore.rotation.y += 1.5 * delta;
      const pulse = 1.0 + Math.sin(elapsed * 4) * 0.08;
      this.reactorCore.scale.set(pulse, pulse, pulse);
    }

    this.renderer.render(this.scene, this.camera);
  };

  // --- Clean Disposal ---
  public dispose() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    window.removeEventListener('resize', this.onResize);
    this.container.removeEventListener('pointermove', this.onPointerMove);
    this.container.removeEventListener('pointerdown', this.onPointerDown);

    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry?.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material?.dispose();
        }
      }
    });

    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
