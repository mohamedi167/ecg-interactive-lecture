import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Eye, Layers, RotateCcw } from 'lucide-react';
import { HEART_PARTS_INFO, type HeartPartInfo, type CoronaryTerritory } from '../data/ecgData';
import { useLanguage } from '../context/LanguageContext';

interface Heart3DProps {
  mode?: 'hero' | 'circulation' | 'territory';
  circulationStep?: number;
  activeTerritory?: CoronaryTerritory['id'] | null;
  selectedPart?: HeartPartInfo['id'] | null;
  onSelectPart?: (partId: HeartPartInfo['id']) => void;
  bpm?: number;
  className?: string;
}

const _vec3 = new THREE.Vector3();
const _nextVec = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _mat4 = new THREE.Matrix4();
const _quat = new THREE.Quaternion();
const _scale = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);

function detectSoftwareWebGL(): boolean {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export const Heart3D: React.FC<Heart3DProps> = ({
  mode = 'hero',
  circulationStep = 1,
  activeTerritory = null,
  selectedPart = null,
  onSelectPart,
  bpm = 72,
  className = '',
}) => {
  const { t, isAr } = useLanguage();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hoveredPart, setHoveredPart] = useState<HeartPartInfo['id'] | null>(null);
  const [contextLost, setContextLost] = useState(false);
  const [atlasLoaded, setAtlasLoaded] = useState(false);
  const [xrayMode, setXrayMode] = useState<boolean>(mode === 'circulation' || mode === 'hero');
  const [showFlow, setShowFlow] = useState<boolean>(true);
  const [showConduction, setShowConduction] = useState<boolean>(true);
  const [phaseLabel, setPhaseLabel] = useState<string>('Atrial Systole (P Wave)');

  const propsRef = useRef({
    mode,
    circulationStep,
    activeTerritory,
    selectedPart,
    bpm,
    onSelectPart,
    xrayMode,
    showFlow,
    showConduction,
  });

  useEffect(() => {
    propsRef.current = {
      mode,
      circulationStep,
      activeTerritory,
      selectedPart,
      bpm,
      onSelectPart,
      xrayMode,
      showFlow,
      showConduction,
    };
  }, [
    mode,
    circulationStep,
    activeTerritory,
    selectedPart,
    bpm,
    onSelectPart,
    xrayMode,
    showFlow,
    showConduction,
  ]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 460;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 60);
    camera.position.set(0.15, 0.35, 4.95);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.16;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = false;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.outline = 'none';

    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const handleContextRestored = () => {
      setContextLost(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envRT = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmremGenerator.dispose();

    // 3-point medical studio lighting rig
    const hemiLight = new THREE.HemisphereLight(0x9ce9f5, 0x061d26, 1.25);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4ea, 2.2);
    keyLight.position.set(3.8, 4.6, 4.2);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x2dd4bf, 1.55);
    rimLight.position.set(-4.0, 1.4, -3.5);
    scene.add(rimLight);

    const warmBounce = new THREE.PointLight(0xe8552e, 1.15, 10);
    warmBounce.position.set(1.6, -2.4, 2.4);
    scene.add(warmBounce);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 2.9;
    controls.maxDistance = 7.8;
    controls.autoRotate = !isSoftwareGl;
    controls.autoRotateSpeed = 0.42;

    const heartRoot = new THREE.Group();
    scene.add(heartRoot);

    const disposables: Array<{ dispose: () => void }> = [];
    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    const clickableMeshes: THREE.Mesh[] = [];
    const registerClickable = (mesh: THREE.Mesh, partId: HeartPartInfo['id']) => {
      mesh.userData.partId = partId;
      clickableMeshes.push(mesh);
    };

    // =========================================================================
    // 1. REAL OPEN-SOURCE ATLAS ANATOMICAL HEART SHELL (human-organ3d heart.glb)
    // =========================================================================
    const atlasGroup = new THREE.Group();
    heartRoot.add(atlasGroup);
    const atlasMaterials: THREE.MeshStandardMaterial[] = [];

    // Procedural sculpted fallback shell (visible until GLB loads or if offline)
    const fallbackGroup = new THREE.Group();
    heartRoot.add(fallbackGroup);
    const fallbackMat = track(
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#B8332A'),
        roughness: 0.36,
        metalness: 0.04,
        clearcoat: 0.55,
        transparent: true,
        opacity: 0.34,
        depthWrite: false,
      })
    );
    const fallbackGeo = track(
      new THREE.LatheGeometry(
        [
          new THREE.Vector2(0.02, -1.3),
          new THREE.Vector2(0.42, -0.9),
          new THREE.Vector2(0.84, -0.2),
          new THREE.Vector2(0.92, 0.35),
          new THREE.Vector2(0.65, 0.78),
          new THREE.Vector2(0.05, 0.9),
        ],
        32
      )
    );
    fallbackGeo.scale(0.96, 1.0, 0.82);
    const fallbackMesh = new THREE.Mesh(fallbackGeo, fallbackMat);
    fallbackMesh.rotation.z = 0.14;
    fallbackGroup.add(fallbackMesh);

    const loader = new GLTFLoader();
    loader.load(
      `${import.meta.env.BASE_URL}models/heart.glb`,
      (gltf) => {
        const model = gltf.scene;
        // Center and normalize to ~2.85 world height
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const normScale = 2.85 / maxDim;
        model.scale.setScalar(normScale);
        model.position.set(
          -center.x * normScale,
          -center.y * normScale,
          -center.z * normScale
        );

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            const origMat = m.material as THREE.MeshStandardMaterial;
            if (origMat) {
              origMat.transparent = true;
              origMat.roughness = Math.min(origMat.roughness ?? 0.45, 0.48);
              origMat.metalness = 0.05;
              origMat.side = THREE.DoubleSide;
              origMat.opacity = propsRef.current.xrayMode ? 0.28 : 1.0;
              origMat.depthWrite = !propsRef.current.xrayMode;
              atlasMaterials.push(origMat);
            }
            m.renderOrder = 3;
          }
        });

        atlasGroup.add(model);
        fallbackGroup.visible = false;
        setAtlasLoaded(true);
      },
      undefined,
      () => {
        // Keep clean procedural anatomical shell if GLB fails to load
        setAtlasLoaded(false);
      }
    );

    // =========================================================================
    // 2. INTERNAL ANATOMICAL CHAMBERS & 4 ANIMATED VALVES (Aligned to Atlas GLB)
    // =========================================================================
    const internalGroup = new THREE.Group();
    heartRoot.add(internalGroup);

    const makeChamberMat = (hex: string, emissiveHex: string) =>
      track(
        new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(hex),
          emissive: new THREE.Color(emissiveHex),
          emissiveIntensity: 0.3,
          roughness: 0.35,
          metalness: 0.05,
          transparent: true,
          opacity: 0.48,
          depthWrite: false,
        })
      );

    const raMat = makeChamberMat('#2563EB', '#1D4ED8');
    const rvMat = makeChamberMat('#0284C7', '#0369A1');
    const laMat = makeChamberMat('#E8552E', '#991B1B');
    const lvMat = makeChamberMat('#DC2626', '#991B1B');

    // Right Atrium cavity (-X, +Y)
    const raChamber = new THREE.Mesh(track(new THREE.SphereGeometry(0.32, 24, 20)), raMat);
    raChamber.scale.set(0.95, 1.1, 0.9);
    raChamber.position.set(-0.46, 0.38, 0.04);
    raChamber.renderOrder = 1;
    registerClickable(raChamber, 'ra_tv');
    internalGroup.add(raChamber);

    // Right Ventricle cavity (-X/+center, -Y, anterior)
    const rvChamber = new THREE.Mesh(track(new THREE.SphereGeometry(0.35, 24, 20)), rvMat);
    rvChamber.scale.set(0.85, 1.35, 0.78);
    rvChamber.position.set(-0.24, -0.34, 0.2);
    rvChamber.rotation.z = 0.18;
    rvChamber.renderOrder = 1;
    registerClickable(rvChamber, 'rv_pv');
    internalGroup.add(rvChamber);

    // Left Atrium cavity (+X, +Y, slightly posterior)
    const laChamber = new THREE.Mesh(track(new THREE.SphereGeometry(0.3, 24, 20)), laMat);
    laChamber.scale.set(1.05, 0.95, 0.85);
    laChamber.position.set(0.32, 0.44, -0.14);
    laChamber.renderOrder = 1;
    registerClickable(laChamber, 'la_mv');
    internalGroup.add(laChamber);

    // Left Ventricle cavity (+X, -Y, thick apex)
    const lvChamber = new THREE.Mesh(track(new THREE.SphereGeometry(0.36, 24, 20)), lvMat);
    lvChamber.scale.set(0.82, 1.48, 0.85);
    lvChamber.position.set(0.24, -0.38, 0.04);
    lvChamber.rotation.z = 0.24;
    lvChamber.renderOrder = 1;
    registerClickable(lvChamber, 'lv_av');
    internalGroup.add(lvChamber);

    // Great Vessels Hitbox Targets (Top of Heart: Aortic Arch, PA, SVC)
    const vesselHitMat = track(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#F2A33A'),
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
      })
    );
    const vesselHitbox = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.55, 0.45, 0.75, 16)),
      vesselHitMat
    );
    vesselHitbox.position.set(-0.04, 1.02, -0.02);
    registerClickable(vesselHitbox, 'vessels');
    internalGroup.add(vesselHitbox);

    // 4 Animated Heart Valves (Ring + 2/3 Hinged Leaflets)
    const valveRingMat = track(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#EEF6F8'),
        emissive: new THREE.Color('#9CBAC4'),
        emissiveIntensity: 0.25,
        roughness: 0.3,
      })
    );
    const leafletMat = track(
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#FDE68A'),
        emissive: new THREE.Color('#F2A33A'),
        emissiveIntensity: 0.25,
        roughness: 0.25,
        side: THREE.DoubleSide,
      })
    );

    interface ValveRig {
      group: THREE.Group;
      leaflets: THREE.Mesh[];
      type: 'av' | 'semilunar';
    }
    const valves: ValveRig[] = [];

    const createValve = (
      pos: [number, number, number],
      rot: [number, number, number],
      type: 'av' | 'semilunar',
      partId: HeartPartInfo['id']
    ) => {
      const vg = new THREE.Group();
      vg.position.set(...pos);
      vg.rotation.set(...rot);
      const ring = new THREE.Mesh(track(new THREE.TorusGeometry(0.11, 0.018, 10, 24)), valveRingMat);
      ring.rotation.x = Math.PI / 2;
      vg.add(ring);

      const leafletCount = type === 'av' ? 2 : 3;
      const leaflets: THREE.Mesh[] = [];
      const lGeo = track(new THREE.CircleGeometry(0.095, 12, 0, Math.PI));
      for (let i = 0; i < leafletCount; i++) {
        const pivot = new THREE.Group();
        const angle = (i / leafletCount) * Math.PI * 2;
        pivot.rotation.y = angle;
        const leaf = new THREE.Mesh(lGeo, leafletMat);
        leaf.rotation.x = Math.PI / 2;
        leaf.position.set(0, 0, 0.02);
        registerClickable(leaf, partId);
        pivot.add(leaf);
        vg.add(pivot);
        leaflets.push(leaf);
      }
      internalGroup.add(vg);
      valves.push({ group: vg, leaflets, type });
    };

    // Tricuspid Valve (RA -> RV)
    createValve([-0.36, 0.08, 0.14], [0.25, 0, -0.35], 'av', 'ra_tv');
    // Mitral Valve (LA -> LV)
    createValve([0.28, 0.12, -0.05], [0.2, 0, 0.25], 'av', 'la_mv');
    // Pulmonary Valve (RV -> Pulmonary Trunk)
    createValve([-0.14, 0.35, 0.28], [-0.4, 0, -0.15], 'semilunar', 'rv_pv');
    // Aortic Valve (LV -> Ascending Aorta)
    createValve([0.08, 0.34, 0.04], [-0.2, 0, 0.12], 'semilunar', 'lv_av');

    // =========================================================================
    // 3. FULL 3D CONDUCTION SYSTEM (Nodes, Pathways & Traveling Golden Impulse)
    // =========================================================================
    const conductionGroup = new THREE.Group();
    heartRoot.add(conductionGroup);

    const nodeMatSA = track(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#F2A33A'),
        emissive: new THREE.Color('#F2A33A'),
        emissiveIntensity: 1.6,
        roughness: 0.2,
      })
    );
    const nodeMatAV = track(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2DD4BF'),
        emissive: new THREE.Color('#0E7C6B'),
        emissiveIntensity: 1.5,
        roughness: 0.2,
      })
    );
    const nodeMatHis = track(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#FBBF24'),
        emissive: new THREE.Color('#D97706'),
        emissiveIntensity: 1.1,
        roughness: 0.25,
      })
    );

    const fiberGoldMat = track(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#F2A33A'),
        emissive: new THREE.Color('#F59E0B'),
        emissiveIntensity: 0.95,
        roughness: 0.25,
        transparent: true,
        opacity: 0.92,
      })
    );

    // SA Node (Upper Right Atrium near SVC)
    const saNodePos = new THREE.Vector3(-0.56, 0.66, 0.16);
    const saNodeMesh = new THREE.Mesh(track(new THREE.SphereGeometry(0.085, 20, 20)), nodeMatSA);
    saNodeMesh.position.copy(saNodePos);
    registerClickable(saNodeMesh, 'sa_node');
    conductionGroup.add(saNodeMesh);

    // AV Node (Lower interatrial septum)
    const avNodePos = new THREE.Vector3(-0.16, 0.14, 0.08);
    const avNodeMesh = new THREE.Mesh(track(new THREE.SphereGeometry(0.08, 20, 20)), nodeMatAV);
    avNodeMesh.position.copy(avNodePos);
    registerClickable(avNodeMesh, 'av_node');
    conductionGroup.add(avNodeMesh);

    // Internodal Tracts (SA -> AV, 3 pathways)
    const internodalCurves = [
      new THREE.CatmullRomCurve3([
        saNodePos,
        new THREE.Vector3(-0.36, 0.45, 0.24),
        avNodePos,
      ]),
      new THREE.CatmullRomCurve3([
        saNodePos,
        new THREE.Vector3(-0.44, 0.36, 0.12),
        avNodePos,
      ]),
      new THREE.CatmullRomCurve3([
        saNodePos,
        new THREE.Vector3(-0.48, 0.42, -0.04),
        avNodePos,
      ]),
    ];
    internodalCurves.forEach((c) => {
      const mesh = new THREE.Mesh(track(new THREE.TubeGeometry(c, 22, 0.013, 8, false)), fiberGoldMat);
      registerClickable(mesh, 'bachmann');
      conductionGroup.add(mesh);
    });

    // Bachmann's Bundle (SA -> Left Atrium)
    const bachmannCurve = new THREE.CatmullRomCurve3([
      saNodePos,
      new THREE.Vector3(-0.18, 0.64, 0.06),
      new THREE.Vector3(0.22, 0.56, -0.1),
      new THREE.Vector3(0.45, 0.46, -0.15),
    ]);
    const bachmannMesh = new THREE.Mesh(
      track(new THREE.TubeGeometry(bachmannCurve, 26, 0.017, 10, false)),
      fiberGoldMat
    );
    registerClickable(bachmannMesh, 'bachmann');
    conductionGroup.add(bachmannMesh);

    // Bundle of His (AV Node -> Interventricular Septum)
    const hisCurve = new THREE.CatmullRomCurve3([
      avNodePos,
      new THREE.Vector3(-0.04, 0.02, 0.1),
      new THREE.Vector3(0.02, -0.16, 0.12),
    ]);
    const hisMesh = new THREE.Mesh(
      track(new THREE.TubeGeometry(hisCurve, 16, 0.024, 10, false)),
      nodeMatHis
    );
    registerClickable(hisMesh, 'his_bundle');
    conductionGroup.add(hisMesh);

    // Right Bundle Branch -> Right Purkinje Fibers
    const rbbCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.02, -0.16, 0.12),
      new THREE.Vector3(-0.08, -0.48, 0.18),
      new THREE.Vector3(-0.12, -0.78, 0.18),
      new THREE.Vector3(-0.34, -0.58, 0.25),
      new THREE.Vector3(-0.46, -0.22, 0.22),
    ]);
    const rbbMesh = new THREE.Mesh(
      track(new THREE.TubeGeometry(rbbCurve, 34, 0.016, 8, false)),
      fiberGoldMat
    );
    registerClickable(rbbMesh, 'purkinje');
    conductionGroup.add(rbbMesh);

    // Left Bundle Branch + Anterior & Posterior Fascicles -> Left Purkinje Fibers
    const lbbAntCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.02, -0.16, 0.12),
      new THREE.Vector3(0.14, -0.45, 0.14),
      new THREE.Vector3(0.24, -0.92, 0.12),
      new THREE.Vector3(0.48, -0.62, 0.16),
      new THREE.Vector3(0.56, -0.22, 0.12),
    ]);
    const lbbAntMesh = new THREE.Mesh(
      track(new THREE.TubeGeometry(lbbAntCurve, 36, 0.017, 8, false)),
      fiberGoldMat
    );
    registerClickable(lbbAntMesh, 'purkinje');
    conductionGroup.add(lbbAntMesh);

    const lbbPostCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.06, -0.22, 0.08),
      new THREE.Vector3(0.22, -0.54, -0.06),
      new THREE.Vector3(0.32, -0.84, -0.04),
      new THREE.Vector3(0.52, -0.48, -0.12),
    ]);
    const lbbPostMesh = new THREE.Mesh(
      track(new THREE.TubeGeometry(lbbPostCurve, 28, 0.015, 8, false)),
      fiberGoldMat
    );
    registerClickable(lbbPostMesh, 'his_bundle');
    conductionGroup.add(lbbPostMesh);

    // Traveling Electrical Impulse Sparks (3 simultaneous waves along Atria, RBB, LBB)
    const sparkGeo = track(new THREE.SphereGeometry(0.046, 12, 12));
    const sparkMat = track(
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#FFFBEB'),
      })
    );
    const impulseSparkA = new THREE.Mesh(sparkGeo, sparkMat);
    const impulseSparkB = new THREE.Mesh(sparkGeo, sparkMat);
    const impulseSparkC = new THREE.Mesh(sparkGeo, sparkMat);
    conductionGroup.add(impulseSparkA, impulseSparkB, impulseSparkC);

    // =========================================================================
    // 4. REALISTIC CONTINUOUS BLOOD FLOW (InstancedMesh Biconcave RBC Streams)
    // =========================================================================
    // Deoxygenated Stream: SVC/IVC -> RA -> Tricuspid -> RV -> Pulmonary Valve -> Pulmonary Artery
    const deoxPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.56, 1.25, -0.06),
      new THREE.Vector3(-0.5, 0.65, 0.02),
      new THREE.Vector3(-0.46, 0.36, 0.06),
      new THREE.Vector3(-0.34, 0.04, 0.16),
      new THREE.Vector3(-0.26, -0.45, 0.22),
      new THREE.Vector3(-0.18, -0.05, 0.28),
      new THREE.Vector3(-0.12, 0.42, 0.28),
      new THREE.Vector3(0.02, 0.85, 0.14),
      new THREE.Vector3(0.45, 0.92, -0.08),
    ]);

    // Oxygenated Stream: Pulmonary Veins -> LA -> Mitral -> LV -> Aortic Valve -> Aortic Arch
    const oxPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.78, 0.56, -0.18),
      new THREE.Vector3(0.34, 0.44, -0.14),
      new THREE.Vector3(0.28, 0.1, -0.04),
      new THREE.Vector3(0.26, -0.42, 0.06),
      new THREE.Vector3(0.22, -0.82, 0.08),
      new THREE.Vector3(0.14, -0.22, 0.06),
      new THREE.Vector3(0.08, 0.38, 0.04),
      new THREE.Vector3(0.12, 0.98, 0.08),
      new THREE.Vector3(-0.08, 1.26, -0.14),
      new THREE.Vector3(-0.26, 0.85, -0.34),
    ]);

    // Biconcave Blood Cell Geometry (squashed sphere for realistic RBC silhouette)
    const rbcGeo = track(new THREE.SphereGeometry(0.042, 12, 10));
    rbcGeo.scale(1.15, 0.52, 1.15);

    const DEOX_COUNT = 34;
    const OX_COUNT = 34;

    const deoxInstanced = new THREE.InstancedMesh(
      rbcGeo,
      track(
        new THREE.MeshStandardMaterial({
          color: new THREE.Color('#38BDF8'),
          emissive: new THREE.Color('#0284C7'),
          emissiveIntensity: 1.0,
          roughness: 0.22,
        })
      ),
      DEOX_COUNT
    );
    deoxInstanced.frustumCulled = false;

    const oxInstanced = new THREE.InstancedMesh(
      rbcGeo,
      track(
        new THREE.MeshStandardMaterial({
          color: new THREE.Color('#FB7185'),
          emissive: new THREE.Color('#E8552E'),
          emissiveIntensity: 1.15,
          roughness: 0.22,
        })
      ),
      OX_COUNT
    );
    oxInstanced.frustumCulled = false;

    heartRoot.add(deoxInstanced, oxInstanced);

    // Subtle glowing streamline tubes
    const deoxTubeMat = track(
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#38BDF8'),
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
      })
    );
    const oxTubeMat = track(
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#FB7185'),
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
      })
    );
    const deoxTube = new THREE.Mesh(
      track(new THREE.TubeGeometry(deoxPath, 48, 0.022, 8, false)),
      deoxTubeMat
    );
    const oxTube = new THREE.Mesh(
      track(new THREE.TubeGeometry(oxPath, 48, 0.022, 8, false)),
      oxTubeMat
    );
    heartRoot.add(deoxTube, oxTube);

    // =========================================================================
    // 5. CORONARY TERRITORY HIGHLIGHTER (for Section 4 STEMI localization)
    // =========================================================================
    const territoryOverlayMat = track(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#F2A33A'),
        emissive: new THREE.Color('#F2A33A'),
        emissiveIntensity: 1.35,
        transparent: true,
        opacity: 0.0,
        depthWrite: false,
      })
    );
    const territoryOverlay = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.52, 24, 24)),
      territoryOverlayMat
    );
    territoryOverlay.renderOrder = 4;
    heartRoot.add(territoryOverlay);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // =========================================================================
    // 6. RAYCASTING (HOVER & CLICK ON CHAMBERS & CONDUCTION NODES)
    // =========================================================================
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerMovedDistance = 0;
    let pointerDownPos = { x: 0, y: 0 };
    let lastHoverCheck = 0;

    const updatePointer = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
      pointerMovedDistance = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      pointerMovedDistance += Math.hypot(
        e.clientX - pointerDownPos.x,
        e.clientY - pointerDownPos.y
      );
      const now = performance.now();
      if (now - lastHoverCheck < 50) return;
      lastHoverCheck = now;

      updatePointer(e);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, false);
      if (hits.length > 0) {
        const partId = hits[0].object.userData.partId as HeartPartInfo['id'];
        renderer.domElement.style.cursor = 'pointer';
        setHoveredPart((prev) => (prev === partId ? prev : partId));
      } else {
        renderer.domElement.style.cursor = 'grab';
        setHoveredPart((prev) => (prev === null ? prev : null));
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (pointerMovedDistance > 12) return;
      updatePointer(e);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, false);
      if (hits.length > 0) {
        const partId = hits[0].object.userData.partId as HeartPartInfo['id'];
        propsRef.current.onSelectPart?.(partId);
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // =========================================================================
    // 7. ANIMATION LOOP (Heartbeat, Valves, Conduction Pulse, Realistic Blood Flow)
    // =========================================================================
    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();
    let cyclePhase = 0;
    let flowClock = 0;
    let lastPhaseBucket = '';

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const {
        mode: curMode,
        circulationStep: curStep,
        activeTerritory: curTerritory,
        selectedPart: curSelected,
        bpm: curBpm,
        xrayMode: curXray,
        showFlow: curFlow,
        showConduction: curCond,
      } = propsRef.current;

      const beatsPerSec = curBpm / 60;
      cyclePhase = (cyclePhase + delta * beatsPerSec) % 1;

      // Update cardiac cycle phase label cleanly without spamming state
      let nextBucket = 'Diastole · Ventricular Filling';
      if (cyclePhase < 0.16) nextBucket = 'P Wave · Atrial Contraction';
      else if (cyclePhase < 0.26) nextBucket = 'PR Delay · AV Node Pause';
      else if (cyclePhase < 0.42) nextBucket = 'QRS · Ventricular Systole';
      else if (cyclePhase < 0.62) nextBucket = 'ST / T Wave · Repolarization';

      if (nextBucket !== lastPhaseBucket) {
        lastPhaseBucket = nextBucket;
        setPhaseLabel(nextBucket);
      }

      // 1. Synchronized Heartbeat Squeeze (P-wave atrial kick + QRS ventricular systole)
      const atrialBeat = Math.exp(-Math.pow((cyclePhase - 0.12) / 0.045, 2));
      const ventricularBeat = Math.exp(-Math.pow((cyclePhase - 0.32) / 0.055, 2));

      const wholeScaleX = 1 - ventricularBeat * 0.045 + atrialBeat * 0.012;
      const wholeScaleY = 1 + ventricularBeat * 0.025;
      heartRoot.scale.set(wholeScaleX, wholeScaleY, wholeScaleX);
      heartRoot.position.y = Math.sin(elapsed * 1.3) * 0.04;

      raChamber.scale.set(0.95 - atrialBeat * 0.12, 1.1, 0.9 - atrialBeat * 0.1);
      laChamber.scale.set(1.05 - atrialBeat * 0.12, 0.95, 0.85 - atrialBeat * 0.1);
      rvChamber.scale.set(0.85 - ventricularBeat * 0.14, 1.35, 0.78 - ventricularBeat * 0.12);
      lvChamber.scale.set(0.82 - ventricularBeat * 0.16, 1.48, 0.85 - ventricularBeat * 0.14);

      // 2. X-Ray vs Solid Atlas Material Transparency
      const effectiveXray = curXray || curMode === 'circulation';
      atlasMaterials.forEach((mat) => {
        mat.opacity = effectiveXray ? 0.25 : 1.0;
        mat.depthWrite = !effectiveXray;
      });
      fallbackMat.opacity = effectiveXray ? 0.25 : 0.92;
      internalGroup.visible = effectiveXray;

      // Highlight selected anatomical chamber
      raMat.opacity = curSelected === 'ra_tv' ? 0.78 : 0.44;
      rvMat.opacity = curSelected === 'rv_pv' ? 0.78 : 0.44;
      laMat.opacity = curSelected === 'la_mv' ? 0.78 : 0.44;
      lvMat.opacity = curSelected === 'lv_av' ? 0.78 : 0.44;
      vesselHitMat.opacity = curSelected === 'vessels' ? 0.42 : 0.12;

      // 3. Animated 4 Heart Valves (AV open in diastole, Semilunar open in systole)
      const semilunarOpen = THREE.MathUtils.clamp(ventricularBeat * 1.25, 0, 1);
      const avOpen = 1 - semilunarOpen * 0.92;
      valves.forEach((v) => {
        const openness = v.type === 'av' ? avOpen : semilunarOpen;
        const tiltAngle = Math.PI / 2 - openness * 0.85;
        v.leaflets.forEach((leaf) => {
          leaf.rotation.x = tiltAngle;
        });
      });

      // 4. Conduction System Visibility & Traveling Electrical Impulse
      conductionGroup.visible = curCond && effectiveXray;
      nodeMatSA.emissiveIntensity =
        (curSelected === 'sa_node' ? 2.8 : 1.3) +
        Math.exp(-Math.pow((cyclePhase - 0.05) / 0.04, 2)) * 2.5;
      nodeMatAV.emissiveIntensity =
        (curSelected === 'av_node' ? 2.8 : 1.2) +
        Math.exp(-Math.pow((cyclePhase - 0.2) / 0.05, 2)) * 2.6;
      nodeMatHis.emissiveIntensity =
        (curSelected === 'his_bundle' ? 2.4 : 1.0) +
        Math.exp(-Math.pow((cyclePhase - 0.28) / 0.04, 2)) * 2.2;

      if (conductionGroup.visible) {
        if (cyclePhase < 0.18) {
          // Spread from SA -> AV & Bachmann's Bundle
          const t = cyclePhase / 0.18;
          internodalCurves[0].getPointAt(t, _vec3);
          impulseSparkA.position.copy(_vec3);
          bachmannCurve.getPointAt(t, _vec3);
          impulseSparkB.position.copy(_vec3);
          impulseSparkC.visible = false;
          impulseSparkA.visible = true;
          impulseSparkB.visible = true;
        } else if (cyclePhase < 0.26) {
          // AV Node Physiological Delay
          impulseSparkA.position.copy(avNodePos);
          impulseSparkA.visible = true;
          impulseSparkB.visible = false;
          impulseSparkC.visible = false;
        } else if (cyclePhase < 0.44) {
          // His -> Right & Left Bundle Branches -> Purkinje Fibers
          const t = (cyclePhase - 0.26) / 0.18;
          if (t < 0.28) {
            hisCurve.getPointAt(t / 0.28, _vec3);
            impulseSparkA.position.copy(_vec3);
            impulseSparkA.visible = true;
            impulseSparkB.visible = false;
            impulseSparkC.visible = false;
          } else {
            const bt = (t - 0.28) / 0.72;
            rbbCurve.getPointAt(bt, _vec3);
            impulseSparkA.position.copy(_vec3);
            lbbAntCurve.getPointAt(bt, _vec3);
            impulseSparkB.position.copy(_vec3);
            lbbPostCurve.getPointAt(bt, _vec3);
            impulseSparkC.position.copy(_vec3);
            impulseSparkA.visible = true;
            impulseSparkB.visible = true;
            impulseSparkC.visible = true;
          }
        } else {
          impulseSparkA.visible = false;
          impulseSparkB.visible = false;
          impulseSparkC.visible = false;
        }
      }

      // 5. Realistic Pulsatile Blood Flow Streams (InstancedMesh RBCs)
      const flowVisible = curFlow && effectiveXray;
      deoxInstanced.visible = flowVisible;
      oxInstanced.visible = flowVisible;
      deoxTube.visible = flowVisible;
      oxTube.visible = flowVisible;

      if (flowVisible) {
        // Pulsatile velocity boosts during atrial/ventricular ejection
        const pulseSpeed = 0.18 + ventricularBeat * 0.45 + atrialBeat * 0.2;
        flowClock = (flowClock + delta * pulseSpeed) % 100;

        const isDeoxHighlight = curMode === 'circulation' && curStep <= 3;
        const isOxHighlight = curMode === 'circulation' && curStep >= 4;

        for (let i = 0; i < DEOX_COUNT; i++) {
          const t = (flowClock * 0.35 + i / DEOX_COUNT) % 1;
          const tNext = (t + 0.01) % 1;
          deoxPath.getPointAt(t, _vec3);
          deoxPath.getPointAt(tNext, _nextVec);
          _dir.subVectors(_nextVec, _vec3).normalize();
          _quat.setFromUnitVectors(_up, _dir);

          const s = isDeoxHighlight ? 1.25 : 0.92;
          _scale.set(s, s, s);
          _mat4.compose(_vec3, _quat, _scale);
          deoxInstanced.setMatrixAt(i, _mat4);
        }
        deoxInstanced.instanceMatrix.needsUpdate = true;

        for (let i = 0; i < OX_COUNT; i++) {
          const t = (flowClock * 0.38 + i / OX_COUNT) % 1;
          const tNext = (t + 0.01) % 1;
          oxPath.getPointAt(t, _vec3);
          oxPath.getPointAt(tNext, _nextVec);
          _dir.subVectors(_nextVec, _vec3).normalize();
          _quat.setFromUnitVectors(_up, _dir);

          const s = isOxHighlight ? 1.25 : 0.92;
          _scale.set(s, s, s);
          _mat4.compose(_vec3, _quat, _scale);
          oxInstanced.setMatrixAt(i, _mat4);
        }
        oxInstanced.instanceMatrix.needsUpdate = true;
      }

      // 6. Coronary Territory Highlighting (Section 4)
      if (curTerritory) {
        territoryOverlayMat.opacity = 0.44 + Math.sin(elapsed * 4) * 0.1;
        if (curTerritory === 'inferior') {
          territoryOverlay.position.set(0.0, -0.78, -0.08);
          territoryOverlay.scale.set(0.95, 0.72, 0.85);
          territoryOverlayMat.color.set('#F2A33A');
          territoryOverlayMat.emissive.set('#F2A33A');
        } else if (curTerritory === 'septal') {
          territoryOverlay.position.set(0.0, -0.18, 0.2);
          territoryOverlay.scale.set(0.48, 0.98, 0.65);
          territoryOverlayMat.color.set('#E8552E');
          territoryOverlayMat.emissive.set('#E8552E');
        } else if (curTerritory === 'anterior') {
          territoryOverlay.position.set(0.2, -0.22, 0.34);
          territoryOverlay.scale.set(0.82, 0.92, 0.62);
          territoryOverlayMat.color.set('#FB7185');
          territoryOverlayMat.emissive.set('#FB7185');
        } else if (curTerritory === 'lateral') {
          territoryOverlay.position.set(0.56, -0.14, 0.02);
          territoryOverlay.scale.set(0.58, 0.95, 0.82);
          territoryOverlayMat.color.set('#2DD4BF');
          territoryOverlayMat.emissive.set('#2DD4BF');
        }
      } else {
        territoryOverlayMat.opacity = 0;
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    if (isSoftwareGl) {
      frameId = window.setTimeout(tick, 16);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      controls.dispose();
      envRT.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const activeHoverInfo = hoveredPart ? HEART_PARTS_INFO[hoveredPart] : null;

  return (
    <div className={`relative w-full h-full select-none ${className}`}>
      {/* Isolated empty mount container for WebGL */}
      <div
        ref={mountRef}
        className="w-full h-full min-h-[360px]"
        aria-label="مجسم قلب أطلس ثلاثي الأبعاد تفاعلي"
      />

      {/* Top HUD: Live Cardiac Cycle Phase + Atlas Attribution */}
      <div className="pointer-events-none absolute top-3 inset-x-3 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="webgl-hud-surface rounded-xl px-3 py-1.5 text-[11px] font-mono-num text-[#F2A33A]" dir="ltr">
          {phaseLabel}
        </div>
        <div className="webgl-hud-surface rounded-xl px-3 py-1.5 text-[10px] text-[#9CBAC4]" dir="ltr">
          {atlasLoaded ? 'Open-Source 3D Atlas · Human-Organ3D (MIT)' : '3D Anatomical Heart'}
        </div>
      </div>

      {/* Bottom-Left Compact Overlay Controls (Solid dark alpha surface, no backdrop-filter over WebGL) */}
      <div className="absolute top-13 right-3 flex flex-col gap-1.5 z-10">
        <button
          type="button"
          onClick={() => setXrayMode((v) => !v)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            xrayMode
              ? 'bg-[#0E7C6B] text-white border border-[#2DD4BF]/50'
              : 'webgl-hud-surface text-[#EEF6F8] hover:bg-white/15'
          }`}
        >
          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{xrayMode ? t('تشريح شفاف (داخلي)', 'X-Ray Cutaway') : t('مجسم خارجي', 'External Atlas')}</span>
        </button>

        {xrayMode && (
          <>
            <button
              type="button"
              onClick={() => setShowFlow((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer ${
                showFlow
                  ? 'bg-[#E8552E] text-white'
                  : 'webgl-hud-surface text-[#B8D0D8]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{showFlow ? t('حركة الدم: مفعلة', 'Blood Flow: On') : t('حركة الدم: مخفية', 'Blood Flow: Off')}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowConduction((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer ${
                showConduction
                  ? 'bg-[#F2A33A] text-[#051F28]'
                  : 'webgl-hud-surface text-[#B8D0D8]'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{showConduction ? t('العقد الكهربائية: مفعلة', 'Conduction: On') : t('العقد الكهربائية: مخفية', 'Conduction: Off')}</span>
            </button>
          </>
        )}
      </div>

      {contextLost && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#06242E]/90 rounded-2xl text-center p-6 z-20">
          <p className="text-sm text-[#9CBAC4]">
            {t(
              'جاري استعادة العرض ثلاثي الأبعاد... يرجى تحديث الصفحة إذا استمر التوقف.',
              'Restoring 3D viewport... Please refresh if the pause persists.'
            )}
          </p>
        </div>
      )}

      {/* Hover Inspector Toast */}
      {activeHoverInfo && (
        <div className={`pointer-events-none absolute top-13 left-3 max-w-xs webgl-hud-surface rounded-xl px-3.5 py-2.5 ${isAr ? 'text-right' : 'text-left'} z-10`}>
          <p className="text-xs font-semibold text-[#F2A33A]" dir="ltr">
            {activeHoverInfo.titleEn}
          </p>
          {isAr && (
            <p className="text-xs text-[#EEF6F8] mt-0.5">{activeHoverInfo.titleAr}</p>
          )}
        </div>
      )}
    </div>
  );
};
