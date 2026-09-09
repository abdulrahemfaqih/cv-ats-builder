"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { GripVertical } from "lucide-react";

interface ResizablePanelsProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultLeftPercent?: number;
  minLeftPercent?: number;
  maxLeftPercent?: number;
}

export function ResizablePanels({
  left,
  right,
  defaultLeftPercent = 42,
  minLeftPercent = 25,
  maxLeftPercent = 70,
}: ResizablePanelsProps) {
  const [leftPercent, setLeftPercent] = useState(defaultLeftPercent);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    isDragging.current = true;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setLeftPercent(Math.min(maxLeftPercent, Math.max(minLeftPercent, pct)));
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
      setLeftPercent(Math.min(maxLeftPercent, Math.max(minLeftPercent, pct)));
    };

    const stopDragging = () => {
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopDragging);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", stopDragging);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopDragging);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", stopDragging);
    };
  }, [minLeftPercent, maxLeftPercent]);

  return (
    <div ref={containerRef} className="flex w-full h-full gap-0">
      {/* Left Panel */}
      <div
        style={{ width: `${leftPercent}%` }}
        className="flex-shrink-0 min-w-0 h-full overflow-y-auto"
      >
        {left}
      </div>

      {/* Drag Handle */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="group flex-shrink-0 w-3 cursor-col-resize flex items-center justify-center relative z-10"
        title="Geser untuk mengatur lebar"
      >
        {/* Track line */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-[#E2E2DC] group-hover:bg-[#111111]/20 transition-colors duration-150" />
        {/* Handle pill */}
        <div className="relative z-10 flex items-center justify-center w-4 h-8 rounded-full bg-white border border-[#E2E2DC] shadow-sm group-hover:border-[#AAAAA4] group-hover:shadow-md transition-all duration-150">
          <GripVertical className="w-2.5 h-2.5 text-[#AAAAA4] group-hover:text-[#555550] transition-colors duration-150" />
        </div>
      </div>

      {/* Right Panel */}
      <div
        style={{ width: `${100 - leftPercent}%` }}
        className="flex-shrink-0 min-w-0 flex flex-col h-full overflow-hidden"
      >
        {right}
      </div>
    </div>
  );
}
