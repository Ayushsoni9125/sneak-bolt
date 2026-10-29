'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { RotateCw, RefreshCw, Compass, Info, Check } from 'lucide-react';

interface Sneaker3DViewerProps {
  autoRotate?: boolean;
  className?: string;
  shoeName?: string;
}

interface ColorwayData {
  name: string;
  colorwayLabel: string;
  frames: {
    src: string;
    label: string;
    angle: string;
  }[];
}

const COLORWAYS: ColorwayData[] = [
  {
    name: 'Chalk Bone',
    colorwayLabel: 'Chalk White / Bone Italian Leather',
    frames: [
      {
        src: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&q=85',
        label: 'Lateral Studio Profile',
        angle: '000°',
      },
      {
        src: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&q=85',
        label: 'Three-Quarter Beauty Angle',
        angle: '045°',
      },
      {
        src: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1200&q=85',
        label: 'Front Toe-Box & Lacing',
        angle: '090°',
      },
      {
        src: 'https://images.unsplash.com/photo-1512374382149-233c42b6683b?w=1200&q=85',
        label: 'Medial Architectural Arch',
        angle: '180°',
      },
    ],
  },
  {
    name: 'Triple Onyx',
    colorwayLabel: 'Pitch Black Nubuck & Carbon',
    frames: [
      {
        src: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200&q=85',
        label: 'Lateral Noir Profile',
        angle: '000°',
      },
      {
        src: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200&q=85',
        label: 'Quarter Archival Stance',
        angle: '045°',
      },
      {
        src: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=1200&q=85',
        label: 'Medial Counter View',
        angle: '180°',
      },
    ],
  },
  {
    name: 'Desert Silt',
    colorwayLabel: 'Layered English Suede / Gum',
    frames: [
      {
        src: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1200&q=85',
        label: 'Suede Lateral Stance',
        angle: '000°',
      },
      {
        src: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=1200&q=85',
        label: 'Quarter Lugged Stance',
        angle: '045°',
      },
      {
        src: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&q=85',
        label: 'Dynamic Speed Profile',
        angle: '180°',
      },
    ],
  },
  {
    name: 'Glacier White',
    colorwayLabel: 'Sculpted Spacer Mesh / Off-White',
    frames: [
      {
        src: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=1200&q=85',
        label: 'Glacier Lateral Runner',
        angle: '000°',
      },
      {
        src: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=1200&q=85',
        label: 'Air-Knit Quarter Profile',
        angle: '045°',
      },
      {
        src: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1200&q=85',
        label: 'Minimalist Toe-Box',
        angle: '090°',
      },
    ],
  },
];

const HOTSPOTS = [
  {
    id: 'leather',
    top: '38%',
    left: '42%',
    title: 'Tuscan Calfskin Upper',
    desc: '1.4mm full-grain leather, drum-dyed with vegetable extracts.',
  },
  {
    id: 'sole',
    top: '72%',
    left: '60%',
    title: 'Margom Vulcanized Sole',
    desc: 'Italian rubber poured in Civitanova Marche with custom herringbone tread.',
  },
  {
    id: 'laces',
    top: '28%',
    left: '52%',
    title: 'Waxed Cotton Eyestay',
    desc: 'Tonal double-twisted laces with debossed metal aglets.',
  },
];

export function Sneaker3DViewer({
  autoRotate = true,
  className = '',
}: Sneaker3DViewerProps) {
  const [selectedColorway, setSelectedColorway] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(autoRotate);
  const [showHotspots, setShowHotspots] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  // 3D Parallax Tilt state
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    currentFrame: 0,
  });

  const activeColorway = COLORWAYS[selectedColorway];
  const frames = activeColorway.frames;
  const currentFrame = frames[currentFrameIndex % frames.length];

  // Auto-spin interval
  useEffect(() => {
    if (!isAutoSpinning) return;

    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % frames.length);
    }, 2400);

    return () => clearInterval(interval);
  }, [isAutoSpinning, frames.length]);

  // Preload all frames for instant transitions
  useEffect(() => {
    frames.forEach((f) => {
      const img = new window.Image();
      img.src = f.src;
    });
  }, [frames]);

  // Mouse / Touch 360 Drag rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    dragRef.current.isDragging = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.currentFrame = currentFrameIndex;
    setIsAutoSpinning(false);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // Parallax 3D tilt calculation
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: x * 18, y: -y * 18 });
    }

    // Drag 360 scrubbing
    if (!dragRef.current.isDragging) return;
    const deltaX = e.clientX - dragRef.current.startX;
    const frameShift = Math.floor(deltaX / 75);
    const newIdx = (dragRef.current.currentFrame - frameShift + frames.length * 100) % frames.length;
    setCurrentFrameIndex(newIdx);
  }, [frames.length]);

  const handleMouseUp = () => {
    dragRef.current.isDragging = false;
  };

  // Touch drag support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      dragRef.current.isDragging = true;
      dragRef.current.startX = e.touches[0].clientX;
      dragRef.current.currentFrame = currentFrameIndex;
      setIsAutoSpinning(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragRef.current.isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragRef.current.startX;
    const frameShift = Math.floor(deltaX / 65);
    const newIdx = (dragRef.current.currentFrame - frameShift + frames.length * 100) % frames.length;
    setCurrentFrameIndex(newIdx);
  };

  const handleTouchEnd = () => {
    dragRef.current.isDragging = false;
  };

  const resetAngle = () => {
    setCurrentFrameIndex(0);
    setTilt({ x: 0, y: 0 });
    setIsAutoSpinning(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        handleMouseUp();
        setIsHovering(false);
        setTilt({ x: 0, y: 0 });
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full flex flex-col items-center justify-center select-none cursor-grab active:cursor-grabbing ${className}`}
      style={{ perspective: '1200px' }}
      title="Drag left/right to rotate sneaker 360°"
    >
      {/* 360° Studio Angle Indicator Top Tag */}
      <div className="absolute top-2 left-2 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 border border-zinc-200 text-[10px] font-mono tracking-widest uppercase text-zinc-900 shadow-xs pointer-events-none">
        <Compass className={`h-3.5 w-3.5 text-zinc-950 ${isAutoSpinning ? 'animate-spin' : ''}`} />
        <span>
          360° ATELIER // ANGLE {currentFrame.angle}
        </span>
      </div>

      {/* Frame Label Pill */}
      <div className="absolute top-2 right-2 z-20 hidden sm:flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 border border-zinc-200 text-[10px] font-mono text-zinc-500 uppercase tracking-widest pointer-events-none">
        <span>{currentFrame.label}</span>
      </div>

      {/* Main Photorealistic Sneaker Canvas with 3D Parallax Tilt */}
      <div
        className="relative w-full h-[340px] sm:h-[420px] lg:h-[450px] flex items-center justify-center transition-transform duration-150 ease-out"
        style={{
          transform: isHovering
            ? `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale(1.02)`
            : 'rotateY(0deg) rotateX(0deg) scale(1)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Sneaker Image Frame */}
        <div className="relative w-full h-full max-h-[400px]">
          <Image
            src={currentFrame.src}
            alt={`${activeColorway.name} — ${currentFrame.label}`}
            fill
            className="object-contain object-center drop-shadow-2xl transition-all duration-300"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Realistic Ambient Ground Shadow that responds to tilt */}
        <div
          className="absolute -bottom-2 w-[70%] h-10 bg-zinc-950/20 rounded-full blur-2xl pointer-events-none transition-all duration-200"
          style={{
            transform: `translate(${tilt.x * -0.5}px, ${tilt.y * -0.5}px) scale(${
              isHovering ? 1.08 : 1
            })`,
          }}
        />

        {/* Interactive Craftsmanship Hotspot Pins */}
        {showHotspots && (
          <div className="absolute inset-0 pointer-events-auto">
            {HOTSPOTS.map((spot) => (
              <div
                key={spot.id}
                style={{ top: spot.top, left: spot.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHotspot(activeHotspot === spot.id ? null : spot.id);
                  }}
                  className="relative group p-2"
                  aria-label={`View spec: ${spot.title}`}
                >
                  <span className="h-4 w-4 rounded-full bg-zinc-950 text-white flex items-center justify-center ring-4 ring-white/90 shadow-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  </span>
                </button>

                {/* Hotspot Popover Tooltip */}
                {activeHotspot === spot.id && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-white border border-zinc-950 shadow-xl z-40 text-left animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1">
                      <span>ATELIER SPEC</span>
                      <Check className="h-3 w-3 text-emerald-600" />
                    </div>
                    <p className="text-xs font-bold text-zinc-950 uppercase tracking-tight">
                      {spot.title}
                    </p>
                    <p className="text-[11px] text-zinc-600 mt-1 leading-relaxed font-sans">
                      {spot.desc}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Interactive Atelier Controls Bar */}
      <div
        className="w-full mt-3 z-20 flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-3 border border-zinc-200 text-xs font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Colorway Selection */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-zinc-400 uppercase tracking-widest hidden sm:inline mr-1">
            COLORWAY:
          </span>
          {COLORWAYS.map((cw, idx) => (
            <button
              key={cw.name}
              onClick={() => {
                setSelectedColorway(idx);
                setCurrentFrameIndex(0);
              }}
              className={`px-2.5 py-1 text-[10px] uppercase tracking-wider border transition-all ${
                selectedColorway === idx
                  ? 'bg-zinc-950 text-white border-zinc-950 font-bold shadow-xs'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:text-zinc-950'
              }`}
              title={`Switch to ${cw.colorwayLabel}`}
            >
              {cw.name}
            </button>
          ))}
        </div>

        {/* View Controls: Auto-spin, Hotspots, Reset */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={() => setShowHotspots((prev) => !prev)}
            className={`flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase tracking-wider border transition-colors ${
              showHotspots
                ? 'bg-zinc-950 text-white border-zinc-950 font-bold'
                : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
            }`}
            title="Toggle Atelier Material Hotspots"
          >
            <Info className="h-3 w-3" />
            <span className="hidden sm:inline">HOTSPOTS</span>
          </button>

          <button
            onClick={() => setIsAutoSpinning((prev) => !prev)}
            className={`flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase tracking-wider border transition-colors ${
              isAutoSpinning
                ? 'bg-zinc-950 text-white border-zinc-950 font-bold'
                : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
            }`}
            title="Toggle 360 Turntable Auto-Spin"
          >
            <RotateCw className={`h-3 w-3 ${isAutoSpinning ? 'animate-spin' : ''}`} />
            <span>360° SPIN</span>
          </button>

          <button
            onClick={resetAngle}
            className="p-1.5 bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:border-zinc-400 transition-colors"
            title="Reset to 000° Lateral View"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
