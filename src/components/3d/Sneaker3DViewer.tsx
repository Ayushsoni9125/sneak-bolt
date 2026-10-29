'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RotateCw, Compass, RefreshCw } from 'lucide-react';

interface Sneaker3DViewerProps {
  initialColor?: string;
  autoRotate?: boolean;
  className?: string;
  shoeName?: string;
}

const COLORWAYS = [
  { name: 'Chalk Bone', upper: 0xf5f5f4, sole: 0xe7e5e4, accents: 0x1c1917, laces: 0xd6d3d1 },
  { name: 'Triple Onyx', upper: 0x18181b, sole: 0x27272a, accents: 0x3f3f46, laces: 0x09090b },
  { name: 'Raw Vachetta', upper: 0xd97706, sole: 0xfafaf9, accents: 0x92400e, laces: 0xfef3c7 },
  { name: 'Royal Heritage', upper: 0x2563eb, sole: 0xffffff, accents: 0x1e3a8a, laces: 0xffffff },
];

export function Sneaker3DViewer({
  autoRotate = true,
  className = '',
}: Sneaker3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(autoRotate);
  const [selectedColorway, setSelectedColorway] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sneakerGroupRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<{
    upper: THREE.MeshStandardMaterial;
    sole: THREE.MeshStandardMaterial;
    accents: THREE.MeshStandardMaterial;
    laces: THREE.MeshStandardMaterial;
  } | null>(null);

  // Interaction tracking
  const mouseState = useRef({
    isDown: false,
    prevX: 0,
    prevY: 0,
    velX: 0,
    velY: 0,
  });

  const updateColors = useCallback((cwIndex: number) => {
    setSelectedColorway(cwIndex);
    const cw = COLORWAYS[cwIndex];
    if (materialsRef.current) {
      materialsRef.current.upper.color.setHex(cw.upper);
      materialsRef.current.sole.color.setHex(cw.sole);
      materialsRef.current.accents.color.setHex(cw.accents);
      materialsRef.current.laces.color.setHex(cw.laces);
    }
  }, []);

  const resetView = () => {
    if (sneakerGroupRef.current) {
      sneakerGroupRef.current.rotation.set(0.15, -0.65, 0);
      mouseState.current.velX = 0;
      mouseState.current.velY = 0;
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 3.8);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing and transparent background
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xdbeafe, 1.6);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xffedd5, 1.0);
    fillLight.position.set(0, -3, 3);
    scene.add(fillLight);

    // 5. Build Procedural Luxury Sneaker Geometry
    const sneakerGroup = new THREE.Group();
    sneakerGroupRef.current = sneakerGroup;

    // Materials
    const initialCw = COLORWAYS[0];
    const upperMat = new THREE.MeshStandardMaterial({
      color: initialCw.upper,
      roughness: 0.35,
      metalness: 0.05,
    });
    const soleMat = new THREE.MeshStandardMaterial({
      color: initialCw.sole,
      roughness: 0.7,
      metalness: 0.02,
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: initialCw.accents,
      roughness: 0.25,
      metalness: 0.1,
    });
    const lacesMat = new THREE.MeshStandardMaterial({
      color: initialCw.laces,
      roughness: 0.8,
      metalness: 0.0,
    });

    materialsRef.current = { upper: upperMat, sole: soleMat, accents: accentMat, laces: lacesMat };

    // --- Sole (Outsole & Midsole) ---
    // Curved base geometry representing the sculpted Italian Margom sole
    const soleShape = new THREE.Shape();
    soleShape.moveTo(-1.25, -0.3);
    soleShape.lineTo(-1.2, 0.3);
    soleShape.bezierCurveTo(-1.0, 0.42, -0.2, 0.52, 0.6, 0.5);
    soleShape.bezierCurveTo(1.2, 0.48, 1.45, 0.38, 1.55, 0.1);
    soleShape.bezierCurveTo(1.6, -0.15, 1.35, -0.38, 0.6, -0.42);
    soleShape.bezierCurveTo(-0.2, -0.45, -1.0, -0.38, -1.25, -0.3);

    const extrudeSettings = {
      steps: 2,
      depth: 0.22,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.03,
      bevelSegments: 4,
    };
    const soleGeo = new THREE.ExtrudeGeometry(soleShape, extrudeSettings);
    soleGeo.rotateX(Math.PI / 2);
    soleGeo.center();
    const soleMesh = new THREE.Mesh(soleGeo, soleMat);
    soleMesh.position.y = -0.32;
    soleMesh.castShadow = true;
    soleMesh.receiveShadow = true;
    sneakerGroup.add(soleMesh);

    // Tread lines under sole
    for (let i = -1.0; i <= 1.2; i += 0.25) {
      const treadGeo = new THREE.BoxGeometry(0.08, 0.02, 0.6);
      const treadMesh = new THREE.Mesh(treadGeo, soleMat);
      treadMesh.position.set(i, -0.43, 0);
      sneakerGroup.add(treadMesh);
    }

    // --- Main Shoe Upper Body ---
    const upperGeo = new THREE.CylinderGeometry(0.38, 0.46, 1.8, 24, 8);
    upperGeo.rotateZ(Math.PI / 2);
    upperGeo.scale(1.2, 0.68, 0.85);
    const upperMesh = new THREE.Mesh(upperGeo, upperMat);
    upperMesh.position.set(0.05, -0.04, 0);
    upperMesh.castShadow = true;
    sneakerGroup.add(upperMesh);

    // --- Toe Box Curve ---
    const toeGeo = new THREE.SphereGeometry(0.36, 24, 16);
    toeGeo.scale(1.25, 0.62, 0.95);
    const toeMesh = new THREE.Mesh(toeGeo, upperMat);
    toeMesh.position.set(0.85, -0.12, 0);
    toeMesh.castShadow = true;
    sneakerGroup.add(toeMesh);

    // --- Heel Counter & Collar ---
    const heelGeo = new THREE.CylinderGeometry(0.32, 0.36, 0.65, 20);
    heelGeo.scale(0.9, 1.0, 0.85);
    const heelMesh = new THREE.Mesh(heelGeo, upperMat);
    heelMesh.position.set(-0.75, 0.16, 0);
    heelMesh.castShadow = true;
    sneakerGroup.add(heelMesh);

    // Padded Collar Opening Ring
    const collarGeo = new THREE.TorusGeometry(0.28, 0.07, 12, 24);
    collarGeo.rotateX(Math.PI / 2);
    collarGeo.scale(1.0, 1.2, 1.0);
    const collarMesh = new THREE.Mesh(collarGeo, accentMat);
    collarMesh.position.set(-0.62, 0.46, 0);
    sneakerGroup.add(collarMesh);

    // --- Tongue ---
    const tongueGeo = new THREE.BoxGeometry(0.85, 0.12, 0.32);
    tongueGeo.rotateZ(0.4);
    const tongueMesh = new THREE.Mesh(tongueGeo, accentMat);
    tongueMesh.position.set(-0.15, 0.28, 0);
    tongueMesh.castShadow = true;
    sneakerGroup.add(tongueMesh);

    // Tongue Label Badge (Atelier SD Tag)
    const tagGeo = new THREE.BoxGeometry(0.18, 0.02, 0.22);
    tagGeo.rotateZ(0.4);
    const tagMesh = new THREE.Mesh(tagGeo, upperMat);
    tagMesh.position.set(-0.06, 0.44, 0);
    sneakerGroup.add(tagMesh);

    // --- Crossed Laces Eyestay ---
    for (let l = 0; l < 4; l++) {
      const lx = 0.08 - l * 0.18;
      const ly = 0.12 + l * 0.08;
      const laceGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.38, 8);
      laceGeo.rotateX(Math.PI / 2);
      laceGeo.rotateZ(l % 2 === 0 ? 0.25 : -0.25);
      const laceMesh = new THREE.Mesh(laceGeo, lacesMat);
      laceMesh.position.set(lx, ly, 0);
      laceMesh.castShadow = true;
      sneakerGroup.add(laceMesh);
    }

    // --- Lateral & Medial Wave Accent Overlays ---
    const lateralSwoopGeo = new THREE.TorusGeometry(0.65, 0.04, 8, 20, Math.PI * 0.65);
    lateralSwoopGeo.rotateZ(-0.4);
    const lateralMesh = new THREE.Mesh(lateralSwoopGeo, accentMat);
    lateralMesh.position.set(-0.05, 0.02, 0.34);
    lateralMesh.scale.set(0.9, 0.45, 0.9);
    sneakerGroup.add(lateralMesh);

    const medialMesh = lateralMesh.clone();
    medialMesh.position.z = -0.34;
    medialMesh.scale.z = -0.9;
    sneakerGroup.add(medialMesh);

    // --- Soft Radial Ground Shadow Plane ---
    const shadowGeo = new THREE.PlaneGeometry(3.6, 2.2);
    shadowGeo.rotateX(-Math.PI / 2);

    // Dynamic procedural shadow canvas
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const shadowCtx = shadowCanvas.getContext('2d');
    if (shadowCtx) {
      const gradient = shadowCtx.createRadialGradient(128, 128, 15, 128, 128, 120);
      gradient.addColorStop(0, 'rgba(15, 15, 18, 0.45)');
      gradient.addColorStop(0.3, 'rgba(15, 15, 18, 0.25)');
      gradient.addColorStop(0.7, 'rgba(15, 15, 18, 0.06)');
      gradient.addColorStop(1, 'rgba(15, 15, 18, 0)');
      shadowCtx.fillStyle = gradient;
      shadowCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.y = -0.58;
    scene.add(shadowMesh);

    // Initial beauty angle (facing 3/4 front profile)
    sneakerGroup.rotation.set(0.15, -0.65, 0);
    sneakerGroup.position.y = 0.08;
    scene.add(sneakerGroup);

    // 6. Animation Loop with Inertia
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (sneakerGroupRef.current) {
        // If auto-rotate is active and not interacting, gently turn
        if (isRotating && !mouseState.current.isDown) {
          sneakerGroupRef.current.rotation.y += 0.008;
        }

        // Apply friction to rotational velocity
        if (!mouseState.current.isDown) {
          sneakerGroupRef.current.rotation.y += mouseState.current.velX;
          sneakerGroupRef.current.rotation.x += mouseState.current.velY;
          mouseState.current.velX *= 0.92;
          mouseState.current.velY *= 0.92;

          // Limit vertical tilt
          sneakerGroupRef.current.rotation.x = Math.max(-0.4, Math.min(0.5, sneakerGroupRef.current.rotation.x));
        }

        // Subtle floating bounce animation
        sneakerGroupRef.current.position.y = 0.08 + Math.sin(Date.now() * 0.002) * 0.03;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 7. Mouse & Touch Interaction Handlers
    const onMouseDown = (e: MouseEvent) => {
      mouseState.current.isDown = true;
      mouseState.current.prevX = e.clientX;
      mouseState.current.prevY = e.clientY;
      setIsInteracting(true);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!mouseState.current.isDown || !sneakerGroupRef.current) return;
      const deltaX = (e.clientX - mouseState.current.prevX) * 0.008;
      const deltaY = (e.clientY - mouseState.current.prevY) * 0.008;

      sneakerGroupRef.current.rotation.y += deltaX;
      sneakerGroupRef.current.rotation.x += deltaY;

      mouseState.current.velX = deltaX;
      mouseState.current.velY = deltaY;

      mouseState.current.prevX = e.clientX;
      mouseState.current.prevY = e.clientY;
    };

    const onMouseUp = () => {
      mouseState.current.isDown = false;
      setIsInteracting(false);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      cameraRef.current.position.z += e.deltaY * 0.002;
      cameraRef.current.position.z = Math.max(2.6, Math.min(5.2, cameraRef.current.position.z));
    };

    // Touch events for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        mouseState.current.isDown = true;
        mouseState.current.prevX = e.touches[0].clientX;
        mouseState.current.prevY = e.touches[0].clientY;
        setIsInteracting(true);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!mouseState.current.isDown || !sneakerGroupRef.current || e.touches.length !== 1) return;
      const deltaX = (e.touches[0].clientX - mouseState.current.prevX) * 0.01;
      const deltaY = (e.touches[0].clientY - mouseState.current.prevY) * 0.01;

      sneakerGroupRef.current.rotation.y += deltaX;
      sneakerGroupRef.current.rotation.x += deltaY;

      mouseState.current.velX = deltaX;
      mouseState.current.velY = deltaY;

      mouseState.current.prevX = e.touches[0].clientX;
      mouseState.current.prevY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      mouseState.current.isDown = false;
      setIsInteracting(false);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // 8. Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('wheel', onWheel);

      domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isRotating]);

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* 3D Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-[360px] sm:h-[420px] lg:h-[460px] cursor-grab active:cursor-grabbing relative z-10"
        title="Click and drag to rotate sneaker in 3D"
      />

      {/* Floating 360 Interaction Prompt */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 border border-zinc-200 text-[10px] font-mono tracking-widest uppercase text-zinc-900 shadow-sm pointer-events-none">
        <Compass className={`h-3.5 w-3.5 text-zinc-950 ${isInteracting ? 'animate-spin' : ''}`} />
        <span>3D ATELIER // DRAG TO ROTATE 360°</span>
      </div>

      {/* Interactive Controls Overlay */}
      <div className="absolute bottom-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-md p-2.5 border border-zinc-200 text-xs font-mono">
        {/* Colorway Switcher */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-zinc-400 uppercase tracking-widest hidden sm:inline mr-1">
            COLORWAY:
          </span>
          {COLORWAYS.map((cw, idx) => (
            <button
              key={cw.name}
              onClick={() => updateColors(idx)}
              className={`px-2 py-1 text-[10px] uppercase tracking-wider border transition-all ${
                selectedColorway === idx
                  ? 'bg-zinc-950 text-white border-zinc-950 font-bold'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
              }`}
              title={`Switch to ${cw.name}`}
            >
              {cw.name}
            </button>
          ))}
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={() => setIsRotating((prev) => !prev)}
            className={`flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase tracking-wider border transition-colors ${
              isRotating
                ? 'bg-zinc-950 text-white border-zinc-950 font-bold'
                : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
            }`}
            title="Toggle 360 Auto-Rotation"
          >
            <RotateCw className={`h-3 w-3 ${isRotating ? 'animate-spin' : ''}`} />
            <span>AUTO-SPIN</span>
          </button>

          <button
            onClick={resetView}
            className="p-1.5 bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:border-zinc-400 transition-colors"
            title="Reset Camera Angle"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
