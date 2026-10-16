import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Play, RotateCcw, Plus, Trash2, ArrowRightLeft, Sparkles, Box, Zap, Radio, Terminal, Cpu } from 'lucide-react';
import { playClick, playDataPulse, playSuccess, playWarp } from '../sound';

interface Compact3DVisualizerProps {
  visualType: 'array' | 'variable' | 'logic' | 'function' | 'object' | 'async' | 'dom';
  lessonTitle: string;
}

export const Compact3DVisualizer: React.FC<Compact3DVisualizerProps> = ({ visualType, lessonTitle }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Dynamic Array Visualizer state
  const [arrayItems, setArrayItems] = useState<string[]>(['"Alpha"', '42', 'true', '"Delta"']);
  const [operationLog, setOperationLog] = useState<string>('Visualizer ready for simulation.');

  // Visual type state
  const [varState, setVarState] = useState<{ type: 'let' | 'const'; val: number }>({ type: 'let', val: 50 });
  const [objState, setObjState] = useState<{ color: string; battery: number }>({ color: '#38bdf8', battery: 85 });

  // Meshes group
  const itemsGroupRef = useRef<THREE.Group | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 260;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030712');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 5, 8.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Environment map
    try {
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      pmrem.dispose();
    } catch {}

    // Lighting
    const hemi = new THREE.HemisphereLight('#38bdf8', '#090d16', 0.9);
    scene.add(hemi);

    const dirLight = new THREE.DirectionalLight('#ffffff', 1.8);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Tech Grid Floor
    const gridHelper = new THREE.GridHelper(16, 16, '#0284c7', '#1e293b');
    gridHelper.position.y = -0.5;
    scene.add(gridHelper);

    // Container for dynamic 3D elements
    const itemsGroup = new THREE.Group();
    scene.add(itemsGroup);
    itemsGroupRef.current = itemsGroup;

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (itemsGroupRef.current) {
        itemsGroupRef.current.children.forEach((child, idx) => {
          child.position.y = Math.sin(elapsed * 2 + idx * 0.8) * 0.08 + 0.4;
          child.rotation.y += 0.4 * delta;
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 260;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      if (mountRef.current && renderer.domElement.parentElement === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update 3D elements based on visualType or arrayItems
  useEffect(() => {
    if (!itemsGroupRef.current || !sceneRef.current) return;
    const group = itemsGroupRef.current;

    // Clear old children
    while (group.children.length > 0) {
      const child = group.children[0] as THREE.Mesh;
      group.remove(child);
      child.geometry?.dispose();
      if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
      else child.material?.dispose();
    }

    if (visualType === 'array') {
      const count = arrayItems.length;
      const spacing = 1.35;
      const startX = -((count - 1) * spacing) / 2;

      arrayItems.forEach((val, idx) => {
        const boxGeo = new THREE.BoxGeometry(1.0, 0.8, 0.8);
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d')!;

        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, 256, 256);

        ctx.strokeStyle = idx % 2 === 0 ? '#38bdf8' : '#34d399';
        ctx.lineWidth = 10;
        ctx.strokeRect(5, 5, 246, 246);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 36px "Fira Code", monospace';
        ctx.fillText(`[${idx}]`, 20, 50);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 34px "Fira Code", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(val, 128, 140);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;

        const boxMat = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.2,
          metalness: 0.8,
        });

        const box = new THREE.Mesh(boxGeo, boxMat);
        box.position.set(startX + idx * spacing, 0.4, 0);
        group.add(box);
      });
    } else if (visualType === 'object') {
      // 3D Object Drone Mesh
      const bodyGeo = new THREE.SphereGeometry(0.8, 16, 16);
      bodyGeo.scale(1.2, 0.6, 1.2);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: objState.color,
        emissive: objState.color,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8,
      });
      const drone = new THREE.Mesh(bodyGeo, bodyMat);
      drone.position.set(0, 0.4, 0);
      group.add(drone);
    } else if (visualType === 'async') {
      // Gyro Rings
      const ring1Geo = new THREE.TorusGeometry(1.2, 0.08, 16, 32);
      const ring1Mat = new THREE.MeshStandardMaterial({ color: '#a855f7', emissive: '#a855f7', emissiveIntensity: 0.8 });
      const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
      group.add(ring1);

      const sphereGeo = new THREE.SphereGeometry(0.4, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({ color: '#38bdf8', emissive: '#38bdf8', emissiveIntensity: 1.0 });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(sphere);
    } else {
      // Default: Variable Vault Cylinders
      const tubeGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.2, 16);
      const tubeMat = new THREE.MeshPhysicalMaterial({
        color: varState.type === 'let' ? '#38bdf8' : '#f59e0b',
        emissive: varState.type === 'let' ? '#0284c7' : '#d97706',
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.5,
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      tube.position.set(0, 0.4, 0);
      group.add(tube);
    }
  }, [arrayItems, visualType, varState, objState]);

  // Array Interactive Operations
  const handlePush = () => {
    playClick();
    const newItems = ['"Laser"', '99', '"Omega"', 'false', '"Sensor"'];
    const randomItem = newItems[Math.floor(Math.random() * newItems.length)];
    if (arrayItems.length >= 6) {
      setOperationLog('Maximum visual slots (6) reached. Pop an item first!');
      return;
    }
    setArrayItems((prev) => [...prev, randomItem]);
    setOperationLog(`array.push(${randomItem}) -> Added to end! New length: ${arrayItems.length + 1}`);
    playDataPulse();
  };

  const handlePop = () => {
    playClick();
    if (arrayItems.length === 0) {
      setOperationLog('Array is empty! Cannot pop().');
      return;
    }
    const popped = arrayItems[arrayItems.length - 1];
    setArrayItems((prev) => prev.slice(0, -1));
    setOperationLog(`array.pop() -> Removed ${popped} from the end. Length: ${arrayItems.length - 1}`);
    playDataPulse();
  };

  const handleShift = () => {
    playClick();
    if (arrayItems.length === 0) {
      setOperationLog('Array is empty! Cannot shift().');
      return;
    }
    const shifted = arrayItems[0];
    setArrayItems((prev) => prev.slice(1));
    setOperationLog(`array.shift() -> Removed ${shifted} from index [0]. Remaining shifted left.`);
    playDataPulse();
  };

  const handleUnshift = () => {
    playClick();
    if (arrayItems.length >= 6) {
      setOperationLog('Maximum visual slots (6) reached.');
      return;
    }
    const newItem = '"Apex"';
    setArrayItems((prev) => [newItem, ...prev]);
    setOperationLog(`array.unshift(${newItem}) -> Inserted at [0]! Existing items shifted right.`);
    playDataPulse();
  };

  const handleReverse = () => {
    playClick();
    setArrayItems((prev) => [...prev].reverse());
    setOperationLog('array.reverse() -> Reordered elements in-place!');
    playSuccess();
  };

  const handleReset = () => {
    playClick();
    setArrayItems(['"Alpha"', '42', 'true', '"Delta"']);
    setOperationLog('Memory reset to initial state.');
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl mb-6">
      {/* Visualizer Header */}
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Interactive 3D Visual Laboratory Simulation</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
            {lessonTitle}
          </span>
        </div>

        <button
          onClick={handleReset}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          title="Reset 3D Visualizer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset 3D</span>
        </button>
      </div>

      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-48 sm:h-56 relative bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="absolute top-2 left-3 pointer-events-none">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            3D WebGL Companion // {visualType.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800 space-y-2">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-[11px] font-bold text-slate-400 mr-1">3D Controls:</span>

          {visualType === 'array' ? (
            <>
              <button
                onClick={handlePush}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-3 h-3" />
                <span>.push()</span>
              </button>
              <button
                onClick={handlePop}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-all cursor-pointer border border-slate-700"
              >
                <Trash2 className="w-3 h-3 text-rose-400" />
                <span>.pop()</span>
              </button>
              <button
                onClick={handleUnshift}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-all cursor-pointer border border-slate-700"
              >
                <span>.unshift()</span>
              </button>
              <button
                onClick={handleShift}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-all cursor-pointer border border-slate-700"
              >
                <span>.shift()</span>
              </button>
              <button
                onClick={handleReverse}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-semibold rounded-lg transition-all cursor-pointer border border-purple-700/60"
              >
                <ArrowRightLeft className="w-3 h-3" />
                <span>.reverse()</span>
              </button>
            </>
          ) : visualType === 'object' ? (
            <>
              <button
                onClick={() => {
                  playClick();
                  const colors = ['#38bdf8', '#ec4899', '#10b981', '#f59e0b'];
                  const nextColor = colors[(colors.indexOf(objState.color) + 1) % colors.length];
                  setObjState((p) => ({ ...p, color: nextColor }));
                  setOperationLog(`drone.color = "${nextColor}" -> Mutated property in 3D!`);
                  playDataPulse();
                }}
                className="px-2.5 py-1.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                drone.color = newColor
              </button>
              <button
                onClick={() => {
                  playClick();
                  setObjState((p) => ({ ...p, battery: Math.min(100, p.battery + 10) }));
                  setOperationLog(`drone.recharge() -> Battery at ${Math.min(100, objState.battery + 10)}%`);
                  playSuccess();
                }}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg cursor-pointer border border-slate-700"
              >
                drone.recharge()
              </button>
            </>
          ) : visualType === 'async' ? (
            <>
              <button
                onClick={() => {
                  playClick();
                  setOperationLog('⏱️ setTimeout queued in Task Queue... Waiting 600ms');
                  setTimeout(() => {
                    setOperationLog('⚡ Callback executed from Event Loop! Promise settled.');
                    playWarp();
                  }, 600);
                }}
                className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Trigger async setTimeout(600ms)
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  playClick();
                  setVarState((p) => ({ ...p, type: p.type === 'let' ? 'const' : 'let' }));
                  setOperationLog(`Switched declaration to "${varState.type === 'let' ? 'const' : 'let'}"`);
                  playDataPulse();
                }}
                className="px-2.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer"
              >
                Toggle {varState.type === 'let' ? 'const' : 'let'}
              </button>
              <button
                onClick={() => {
                  playClick();
                  if (varState.type === 'const') {
                    setOperationLog('❌ TypeError: Assignment to constant variable! const cannot be reassigned.');
                    return;
                  }
                  const newVal = varState.val + 10;
                  setVarState((p) => ({ ...p, val: newVal }));
                  setOperationLog(`powerLevel += 10 -> Reassigned to ${newVal}% in memory!`);
                  playSuccess();
                }}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg cursor-pointer border border-slate-700"
              >
                Reassign (+10)
              </button>
            </>
          )}
        </div>

        {/* Dynamic status log */}
        <div className="px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-sky-300 flex items-center gap-2">
          <span className="text-slate-500">Log:</span>
          <span>{operationLog}</span>
        </div>
      </div>
    </div>
  );
};
