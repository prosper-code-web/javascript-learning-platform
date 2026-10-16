import React, { useEffect, useRef } from 'react';
import { LabScene } from '../three/LabScene';
import { StationId } from '../types';

interface ThreeCanvasProps {
  onStationSelect: (stationId: StationId) => void;
  sceneRef: React.MutableRefObject<LabScene | null>;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ onStationSelect, sceneRef }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new LabScene(mountRef.current, {
      onStationSelect: (stationId) => {
        onStationSelect(stationId);
      },
    });

    sceneRef.current = scene;

    return () => {
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950"
      style={{ touchAction: 'none' }}
    />
  );
};
