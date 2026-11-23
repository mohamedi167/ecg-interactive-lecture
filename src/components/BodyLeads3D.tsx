import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { Eye, User, Scan } from 'lucide-react';
import { ELECTRODES, type LeadElectrode } from '../data/ecgData';
import { useLanguage } from '../context/LanguageContext';

interface BodyLeads3DProps {
  planeMode: 'all' | 'limb' | 'chest';
  selectedElectrodeId: string;
  onSelectElectrode: (id: string) => void;
  className?: string;
}

type CameraViewPreset = 'chest' | 'full' | 'posterior';

const CAMERA_PRESETS: Record<
  CameraViewPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  chest: { pos: [0.22, 1.32, 0.92], target: [0.02, 1.26, 0.04] },
  full: { pos: [0.0, 0.96, 2.38], target: [0.0, 0.88, 0.04] },
  posterior: { pos: [0.32, 1.3, -0.88], target: [0.04, 1.25, 0.0] },
};

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

function makeLabelTexture(
  text: string,
  colorHex: string,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 128, 64);

  ctx.fillStyle = 'rgba(5, 31, 40, 0.92)';
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(8, 8, 112, 48, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#EEF6F8';
  ctx.font = 'bold 28px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 64, 33);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export const BodyLeads3D: React.FC<BodyLeads3DProps> = ({
  planeMode,
  selectedElectrodeId,
  onSelectElectrode,
  className = '',
}) => {
  const { t } = useLanguage();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [showRibs, setShowRibs] = useState<boolean>(true);
  const [viewPreset, setViewPreset] = useState<CameraViewPreset>('chest');
  const [hoveredElectrode, setHoveredElectrode] = useState<LeadElectrode | null>(null);
  const [bodyLoaded, setBodyLoaded] = useState<boolean>(false);

  const propsRef = useRef({
    planeMode,
    selectedElectrodeId,
    onSelectElectrode,
    showRibs,
    viewPreset,
  });

  const transitionRef = useRef<{
    active: boolean;
    targetPos: THREE.Vector3;
    targetLook: THREE.Vector3;
  }>({
    active: false,
    targetPos: new THREE.Vector3(...CAMERA_PRESETS.chest.pos),
    targetLook: new THREE.Vector3(...CAMERA_PRESETS.chest.target),
  });

  useEffect(() => {
    propsRef.current = {
      planeMode,
      selectedElectrodeId,
      onSelectElectrode,
      showRibs,
      viewPreset,
    };
  }, [planeMode, selectedElectrodeId, onSelectElectrode, showRibs, viewPreset]);

  // Trigger camera preset when planeMode or viewPreset changes
  const applyPreset = (preset: CameraViewPreset) => {
    setViewPreset(preset);
    const cfg = CAMERA_PRESETS[preset];
    transitionRef.current.targetPos.set(...cfg.pos);
    transitionRef.current.targetLook.set(...cfg.target);
    transitionRef.current.active = true;
  };

  useEffect(() => {
    if (planeMode === 'limb') {
      applyPreset('full');
    } else if (planeMode === 'chest') {
      applyPreset('chest');
    }
  }, [planeMode]);

  useEffect(() => {
    if (['V7', 'V8', 'V9'].includes(selectedElectrodeId)) {
      applyPreset('posterior');
    } else if (['RA', 'LA', 'RL', 'LL'].includes(selectedElectrodeId)) {
      applyPreset('full');
    }
  }, [selectedElectrodeId]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const width = container.clientWidth || 420;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.05, 30);
    camera.position.set(...CAMERA_PRESETS.chest.pos);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.outline = 'none';
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envRT = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmremGenerator.dispose();

    const hemiLight = new THREE.HemisphereLight(0x9ce9f5, 0x061d26, 1.3);
    scene.add(hemiLight);
    const keyLight = new THREE.DirectionalLight(0xfff5ec, 2.0);
    keyLight.position.set(2.5, 3.5, 3.2);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x2dd4bf, 1.5);
    rimLight.position.set(-2.5, 2.2, -2.5);
    scene.add(rimLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.target.set(...CAMERA_PRESETS.chest.target);
    controls.minDistance = 0.45;
    controls.maxDistance = 4.0;
    controls.addEventListener('start', () => {
      transitionRef.current.active = false;
    });

    const disposables: Array<{ dispose: () => void }> = [];
    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    const bodyGroup = new THREE.Group();
    const ribGroup = new THREE.Group();
    const electrodesGroup = new THREE.Group();
    scene.add(bodyGroup, ribGroup, electrodesGroup);

    const skinMat = track(
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#326D7F'),
        emissive: new THREE.Color('#082B36'),
        emissiveIntensity: 0.35,
        roughness: 0.42,
        metalness: 0.06,
        clearcoat: 0.25,
        transparent: true,
        opacity: propsRef.current.showRibs ? 0.36 : 0.88,
        depthWrite: !propsRef.current.showRibs,
        side: THREE.DoubleSide,
      })
    );

    const boneMat = track(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#E5DEC9'),
        emissive: new THREE.Color('#3A3122'),
        emissiveIntensity: 0.2,
        roughness: 0.55,
        metalness: 0.05,
        side: THREE.DoubleSide,
      })
    );

    // Subtle procedural fallback human torso + limbs (hidden once real Z-Anatomy GLB loads)
    const fallbackTorsoGroup = new THREE.Group();
    const fallbackTorsoMesh = new THREE.Mesh(
      track(new THREE.CapsuleGeometry(0.16, 0.5, 16, 24)),
      skinMat
    );
    fallbackTorsoMesh.position.set(0, 1.2, 0.04);
    fallbackTorsoMesh.scale.set(1.15, 1.0, 0.7);
    fallbackTorsoGroup.add(fallbackTorsoMesh);
    bodyGroup.add(fallbackTorsoGroup);

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    const bodyMeshes: THREE.Mesh[] = [];
    const electrodeRigs: Array<{
      data: LeadElectrode;
      group: THREE.Group;
      padMesh: THREE.Mesh;
      ringMesh: THREE.Mesh;
      padMat: THREE.MeshStandardMaterial;
      ringMat: THREE.MeshBasicMaterial;
      sprite: THREE.Sprite;
    }> = [];

    const snapRaycaster = new THREE.Raycaster();
    const snapOrigin = new THREE.Vector3();
    const snapDir = new THREE.Vector3();

    const snapElectrodeToBody = () => {
      if (bodyMeshes.length === 0) return;
      electrodeRigs.forEach((rig) => {
        const [px, py, pz] = rig.data.pos3d;
        const [rx, ry, rz] = rig.data.rayDir3d;
        snapDir.set(-rx, -ry, -rz).normalize();
        snapOrigin.set(px + rx * 0.75, py + ry * 0.75, pz + rz * 0.75);
        snapRaycaster.set(snapOrigin, snapDir);
        const hits = snapRaycaster.intersectObjects(bodyMeshes, false);
        if (hits.length > 0) {
          // Slight 0.008m offset outward along normal so electrode sits on skin cleanly
          const hitPt = hits[0].point;
          rig.group.position.set(
            hitPt.x + rx * 0.006,
            hitPt.y + ry * 0.006,
            hitPt.z + rz * 0.006
          );
        }
      });
      updateEinthovenLines();
    };

    // Einthoven 3D triangle lines connecting RA - LA - LL
    const einthovenGeo = track(new THREE.BufferGeometry());
    const einthovenMat = track(
      new THREE.LineBasicMaterial({
        color: new THREE.Color('#F2A33A'),
        transparent: true,
        opacity: 0.72,
      })
    );
    const einthovenLine = new THREE.LineLoop(einthovenGeo, einthovenMat);
    electrodesGroup.add(einthovenLine);

    const updateEinthovenLines = () => {
      const ra = electrodeRigs.find((r) => r.data.id === 'RA')?.group.position;
      const la = electrodeRigs.find((r) => r.data.id === 'LA')?.group.position;
      const ll = electrodeRigs.find((r) => r.data.id === 'LL')?.group.position;
      if (ra && la && ll) {
        einthovenGeo.setFromPoints([ra.clone(), la.clone(), ll.clone()]);
      }
    };

    // Build all 14 Electrodes
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const padGeo = track(new THREE.SphereGeometry(0.014, 16, 16));
    const ringGeo = track(new THREE.RingGeometry(0.017, 0.023, 24));
    const clickablePads: THREE.Mesh[] = [];

    ELECTRODES.forEach((el) => {
      const eg = new THREE.Group();
      eg.position.set(...el.pos3d);

      const padMat = track(
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(el.color),
          emissive: new THREE.Color(el.color),
          emissiveIntensity: 0.65,
          roughness: 0.25,
        })
      );
      const padMesh = new THREE.Mesh(padGeo, padMat);
      padMesh.userData.electrode = el;
      clickablePads.push(padMesh);
      eg.add(padMesh);

      const ringMat = track(
        new THREE.MeshBasicMaterial({
          color: new THREE.Color('#F2A33A'),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.0,
        })
      );
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.lookAt(
        el.pos3d[0] + el.rayDir3d[0],
        el.pos3d[1] + el.rayDir3d[1],
        el.pos3d[2] + el.rayDir3d[2]
      );
      eg.add(ringMesh);

      const tex = track(makeLabelTexture(el.label, el.color, maxAniso));
      const spriteMat = track(
        new THREE.SpriteMaterial({
          map: tex,
          transparent: true,
          depthTest: false,
        })
      );
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(0.068, 0.034, 1);
      sprite.position.set(
        el.rayDir3d[0] * 0.036,
        el.rayDir3d[1] * 0.036 + 0.022,
        el.rayDir3d[2] * 0.036
      );
      sprite.renderOrder = 10;
      eg.add(sprite);

      electrodesGroup.add(eg);
      electrodeRigs.push({
        data: el,
        group: eg,
        padMesh,
        ringMesh,
        padMat,
        ringMat,
        sprite,
      });
    });

    updateEinthovenLines();

    // Load Z-Anatomy Human Body & Thoracic Skeleton
    loader.load(
`${import.meta.env.BASE_URL}models/human_body.glb`,
      (gltf) => {
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            m.material = skinMat;
            m.renderOrder = 2;
            bodyMeshes.push(m);
          }
        });
        bodyGroup.add(gltf.scene);
        fallbackTorsoGroup.visible = false;
        setBodyLoaded(true);
        // Update world matrices before snapping electrodes
        gltf.scene.updateMatrixWorld(true);
        snapElectrodeToBody();
      },
      undefined,
      () => {
        setBodyLoaded(false);
      }
    );

    loader.load(
      `${import.meta.env.BASE_URL}models/thoracic_skeleton.glb`,
      (gltf) => {
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            m.material = boneMat;
            m.renderOrder = 1;
          }
        });
        ribGroup.add(gltf.scene);
      },
      undefined,
      () => {
        // Optional ribcage overlay
      }
    );

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Raycasting for clicking/hovering electrodes
    const pointerRaycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downPos = { x: 0, y: 0 };
    let movedDist = 0;
    let lastHover = 0;

    const updatePointer = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (e: PointerEvent) => {
      downPos = { x: e.clientX, y: e.clientY };
      movedDist = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      movedDist += Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
      const now = performance.now();
      if (now - lastHover < 50) return;
      lastHover = now;

      updatePointer(e);
      pointerRaycaster.setFromCamera(pointer, camera);
      const hits = pointerRaycaster.intersectObjects(clickablePads, false);
      if (hits.length > 0 && hits[0].object.parent?.visible !== false) {
        const el = hits[0].object.userData.electrode as LeadElectrode;
        renderer.domElement.style.cursor = 'pointer';
        setHoveredElectrode((prev) => (prev?.id === el.id ? prev : el));
      } else {
        renderer.domElement.style.cursor = 'grab';
        setHoveredElectrode((prev) => (prev === null ? prev : null));
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (movedDist > 12) return;
      updatePointer(e);
      pointerRaycaster.setFromCamera(pointer, camera);
      const hits = pointerRaycaster.intersectObjects(clickablePads, false);
      if (hits.length > 0 && hits[0].object.parent?.visible !== false) {
        const el = hits[0].object.userData.electrode as LeadElectrode;
        propsRef.current.onSelectElectrode(el.id);
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
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

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
      const { planeMode: curPlane, selectedElectrodeId: curId, showRibs: curRibs } =
        propsRef.current;

      // Skin opacity vs ribcage visibility
      skinMat.opacity = curRibs ? 0.34 : 0.88;
      skinMat.depthWrite = !curRibs;
      ribGroup.visible = curRibs;

      // Filter visible electrodes according to planeMode
      einthovenLine.visible = curPlane !== 'chest';

      electrodeRigs.forEach((rig) => {
        const cat = rig.data.category;
        const visible =
          curPlane === 'all' ||
          (curPlane === 'limb' && cat === 'limb') ||
          (curPlane === 'chest' && (cat === 'chest' || cat === 'right' || cat === 'posterior'));

        rig.group.visible = visible;
        const isSelected = rig.data.id === curId;
        const pulse = isSelected ? 1.35 + Math.sin(elapsed * 5) * 0.15 : 1.0;
        rig.padMesh.scale.setScalar(pulse);
        rig.padMat.emissiveIntensity = isSelected ? 2.0 : 0.65;
        rig.ringMat.opacity = isSelected ? 0.9 : 0.0;
        rig.ringMesh.scale.setScalar(isSelected ? 1.25 + Math.sin(elapsed * 4) * 0.12 : 1.0);
      });

      // Smooth damped camera preset transitions
      if (transitionRef.current.active) {
        const k = 1 - Math.exp(-5.5 * delta);
        camera.position.lerp(transitionRef.current.targetPos, k);
        controls.target.lerp(transitionRef.current.targetLook, k);
        if (
          camera.position.distanceTo(transitionRef.current.targetPos) < 0.01 &&
          controls.target.distanceTo(transitionRef.current.targetLook) < 0.01
        ) {
          transitionRef.current.active = false;
        }
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
      ro.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      controls.dispose();
      envRT.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-full select-none ${className}`}>
      <div
        ref={mountRef}
        className="w-full h-full min-h-[380px]"
        aria-label={t(
          'مجسم جسم بشري ثلاثي الأبعاد لمواضع أقطاب تخطيط القلب',
          'Interactive 3D human body showing ECG electrode positions'
        )}
      />

      {/* Top HUD: Atlas badge & Ribcage X-Ray toggle */}
      <div className="absolute top-3 inset-x-3 flex flex-wrap items-center justify-between gap-2 z-10 pointer-events-none">
        <div className="webgl-hud-surface rounded-xl px-3 py-1.5 text-[10px] text-[#9CBAC4]" dir="ltr">
          {bodyLoaded ? '3D Atlas · Z-Anatomy / BodyParts3D' : '3D Human Body'}
        </div>

        <button
          type="button"
          onClick={() => setShowRibs((r) => !r)}
          className={`pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            showRibs
              ? 'bg-[#0E7C6B] text-white border border-[#2DD4BF]/50'
              : 'webgl-hud-surface text-[#EEF6F8] hover:bg-white/15'
          }`}
        >
          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t('القفص الصدري (X-Ray)', 'Ribcage X-Ray')}</span>
        </button>
      </div>

      {/* Bottom Camera Presets Dock */}
      <div className="absolute bottom-3 inset-x-3 webgl-hud-surface rounded-xl p-2 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => applyPreset('chest')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors ${
              viewPreset === 'chest'
                ? 'bg-[#E8552E] text-white'
                : 'bg-white/6 text-[#B8D0D8] hover:bg-white/14'
            }`}
          >
            <Scan className="w-3 h-3" aria-hidden="true" />
            <span>{t('الصدر (V1–V6)', 'Chest (V1–V6)')}</span>
          </button>
          <button
            type="button"
            onClick={() => applyPreset('full')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors ${
              viewPreset === 'full'
                ? 'bg-[#0E7C6B] text-white'
                : 'bg-white/6 text-[#B8D0D8] hover:bg-white/14'
            }`}
          >
            <User className="w-3 h-3" aria-hidden="true" />
            <span>{t('الجسم كامل (RA–LL)', 'Full Body (Limbs)')}</span>
          </button>
          <button
            type="button"
            onClick={() => applyPreset('posterior')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors ${
              viewPreset === 'posterior'
                ? 'bg-[#F2A33A] text-[#051F28]'
                : 'bg-white/6 text-[#B8D0D8] hover:bg-white/14'
            }`}
          >
            <span>{t('الظهر (V7–V9)', 'Back (V7–V9)')}</span>
          </button>
        </div>

        <span className="text-[10px] text-[#9CBAC4]">
          {t('اسحب للتدوير · اضغط على أي قطب', 'Drag to rotate · Click any electrode')}
        </span>
      </div>

      {/* Hover Tooltip */}
      {hoveredElectrode && (
        <div className="pointer-events-none absolute top-13 left-3 max-w-xs webgl-hud-surface rounded-xl px-3 py-2 z-10">
          <p className="text-xs font-bold font-mono-num text-[#F2A33A]" dir="ltr">
            {hoveredElectrode.label} · {hoveredElectrode.viewArea}
          </p>
          <p className="text-[11px] text-[#EEF6F8] mt-0.5">
            {t(hoveredElectrode.locationAr, hoveredElectrode.locationEn)}
          </p>
        </div>
      )}
    </div>
  );
};
