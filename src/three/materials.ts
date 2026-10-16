import * as THREE from 'three';

/**
 * Procedural texture generators to ensure zero 404 dependencies.
 */

export function createGridFloorTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Deep tech background
  ctx.fillStyle = '#050813';
  ctx.fillRect(0, 0, size, size);

  // Sub-grid lines
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1;
  const step = 32;
  for (let x = 0; x <= size; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }
  for (let y = 0; y <= size; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  // Major grid lines
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  const majorStep = 128;
  for (let x = 0; x <= size; x += majorStep) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }
  for (let y = 0; y <= size; y += majorStep) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  // Neon glowing dots at intersections
  ctx.fillStyle = '#38bdf8';
  for (let x = 0; x <= size; x += majorStep) {
    for (let y = 0; y <= size; y += majorStep) {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createStationRingTexture(colorHex: string, label: string): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, size, size);

  const center = size / 2;
  const radius = center - 20;

  // Outer glowing ring
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Secondary dashed ring
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 2;
  ctx.setLineDash([12, 12]);
  ctx.beginPath();
  ctx.arc(center, center, radius - 24, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Inner solid thin ring
  ctx.beginPath();
  ctx.arc(center, center, radius - 48, 0, Math.PI * 2);
  ctx.stroke();

  // Crosshairs
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(center - 15, center);
  ctx.lineTo(center + 15, center);
  ctx.moveTo(center, center - 15);
  ctx.lineTo(center, center + 15);
  ctx.stroke();

  // Label text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px "Fira Code", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, center, center + radius - 70);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createDigitalDisplayTexture(title: string, value: string, color: string): THREE.CanvasTexture {
  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, width, height);

  // Border glow
  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Header banner
  ctx.fillStyle = color;
  ctx.fillRect(10, 10, width - 20, 48);

  ctx.fillStyle = '#020617';
  ctx.font = 'bold 22px "Fira Code", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(title.toUpperCase(), 24, 42);

  // Main readout
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px "Fira Code", monospace';
  ctx.fillText(value, 30, 125);

  // Sub code line
  ctx.fillStyle = color;
  ctx.font = '18px "Fira Code", monospace';
  ctx.fillText(`STATUS: ONLINE // VER 2026.1`, 30, 180);
  ctx.fillText(`JS.CORE.BUS: ACTIVE`, 30, 215);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
