'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

interface Sneaker3DViewerProps {
  autoRotate?: boolean;
  className?: string;
  shoeName?: string;
}

const COLORWAYS = [
  {
    name: 'Chalk Bone',
    colorwayLabel: 'Chalk White / Bone Italian Leather',
    frames: [
      {
        src: '/images/court-one-hero.jpg',
        label: 'Perspective View',
      },
      {
        src: '/images/court-one-quarter.jpg',
        label: 'Three-Quarter Angle',
      },
      {
        src: '/images/court-one-profile.jpg',
        label: 'Lateral Profile',
      },
    ],
  },
  {
    name: 'Obsidian Low',
    colorwayLabel: 'French Tumbled Calfskin / Natural Gum',
    frames: [
      {
        src: '/images/obsidian-low.jpg',
        label: 'Lateral Stance',
      },
      {
        src: '/images/court-one-hero.jpg',
        label: 'Front Stance',
      },
    ],
  },
  {
    name: 'Shadow High',
    colorwayLabel: 'Japanese Oiled Nubuck / Pitch Black',
    frames: [
      {
        src: '/images/shadow-high.jpg',
        label: 'High-Top Lateral Stance',
      },
      {
        src: '/images/court-one-profile.jpg',
        label: 'Medial Counter View',
      },
    ],
  },
];

export function Sneaker3DViewer({
  autoRotate = true,
  className = '',
}: Sneaker3DViewerProps) {
  const [selectedColorway, setSelectedColorway] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isAutoSpinning, setIsAutoSpinning] = useState(autoRotate);

  // Parallax Tilt state
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Drag rotation state
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const frameOnDragStartRef = useRef(0);

  const activeColorway = COLORWAYS[selectedColorway];
  const frames = activeColorway.frames;
  const currentFrame = frames[currentFrameIndex] || frames[0];

  // Auto-spin timer
  useEffect(() => {
    if (!isAutoSpinning || isHovering) return;

    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % frames.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isAutoSpinning, isHovering, frames.length]);

  // Parallax tilt calculation
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      setTilt({
        x: Math.round(x * 12),
        y: Math.round(-y * 10),
      });

      if (isDraggingRef.current) {
        const deltaX = e.clientX - dragStartXRef.current;
        const frameOffset = Math.floor(deltaX / 70);
        const nextIndex =
          (frameOnDragStartRef.current - frameOffset) % frames.length;
        setCurrentFrameIndex(
          nextIndex < 0 ? nextIndex + frames.length : nextIndex
        );
      }
    },
    [frames.length]
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    frameOnDragStartRef.current = currentFrameIndex;
    setIsAutoSpinning(false);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
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
      className={`relative w-full flex flex-col items-center justify-center select-none cursor-grab active:cursor-grabbing ${className}`}
      style={{ perspective: '1200px' }}
    >
      {/* Main Sneaker Canvas with 3D Parallax Tilt - NO grid boxes or text pills */}
      <div
        className="relative w-full h-[360px] sm:h-[440px] lg:h-[480px] flex items-center justify-center transition-transform duration-150 ease-out"
        style={{
          transform: isHovering
            ? `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale(1.03)`
            : 'rotateY(0deg) rotateX(0deg) scale(1)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="relative w-full h-full">
          <Image
            src={currentFrame.src}
            alt={activeColorway.name}
            fill
            className="object-contain object-center transition-all duration-300"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Soft Organic Ground Contact Shadow */}
        <div
          className="absolute -bottom-2 w-[70%] h-8 bg-zinc-950/15 rounded-full blur-xl pointer-events-none transition-all duration-200"
          style={{
            transform: `translate(${tilt.x * -0.4}px, ${tilt.y * -0.4}px) scale(${
              isHovering ? 1.05 : 1
            })`,
          }}
        />
      </div>

      {/* Clean Minimalist Colorway Selector */}
      <div
        className="mt-4 flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {COLORWAYS.map((cw, idx) => (
          <button
            key={cw.name}
            onClick={() => {
              setSelectedColorway(idx);
              setCurrentFrameIndex(0);
            }}
            className={`px-3 py-1.5 text-[10px] font-mono tracking-wider uppercase transition-all ${
              selectedColorway === idx
                ? 'bg-zinc-950 text-white font-bold'
                : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950'
            }`}
          >
            {cw.name}
          </button>
        ))}
      </div>
    </div>
  );
}
