import React, { useEffect, useRef, useState } from 'react';

export const Dongzhi = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const dotsRef = useRef<{id: number, x: number, y: number, spawnTime: number, vx: number, vy: number, r: number}[]>([]);
  const dotIdRef = useRef(0);
  const mousePosRef = useRef({x: -1000, y: -1000});
  const isMouseInRef = useRef(false);
  const lastSpawnTimeRef = useRef(0);
  
  const requestRef = useRef<number>();

  useEffect(() => {
    const spawnDot = (x: number, y: number, time: number) => {
      const offsetX = (Math.random() - 0.5) * 40;
      const offsetY = (Math.random() - 0.5) * 40;

      dotsRef.current.push({
        id: ++dotIdRef.current,
        x: x + offsetX,
        y: y + offsetY,
        spawnTime: time,
        vx: (Math.random() - 0.5) * 120, // scatter horizontally
        vy: (Math.random() - 0.5) * 80 - 20, // slight upward or downward burst
        r: 4 + Math.random() * 6 // radius between 4 and 10
      });
      if (dotsRef.current.length > 6) {
        dotsRef.current.shift();
      }
      lastSpawnTimeRef.current = time;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 600;
      const y = ((e.clientY - rect.top) / rect.height) * 600;
      
      const dx = x - mousePosRef.current.x;
      const dy = y - mousePosRef.current.y;
      const dist = Math.hypot(dx, dy);
      
      mousePosRef.current = { x, y };

      if (dist >= 50) {
        spawnDot(x, y, performance.now());
      }
    };

    const handleMouseEnter = () => {
      isMouseInRef.current = true;
    };

    const handleMouseLeave = () => {
      isMouseInRef.current = false;
    };

    const el = svgRef.current;
    if (el) {
      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    }

    const animate = (time: number) => {
      if (isMouseInRef.current && time - lastSpawnTimeRef.current > 333) {
        spawnDot(mousePosRef.current.x, mousePosRef.current.y, time);
      }

      const g = document.getElementById('dongzhi-dots-group');
      if (g) {
        while (g.firstChild) {
          g.removeChild(g.firstChild);
        }
        
        const aliveDots = [];
        for (let i = 0; i < dotsRef.current.length; i++) {
          const dot = dotsRef.current[i];
          const ageSecs = (time - dot.spawnTime) / 1000;
          if (ageSecs < 2) {
            aliveDots.push(dot);
            
            // Apply velocity, gravity, and swaying flutter
            const currentX = dot.x + dot.vx * ageSecs + Math.sin(ageSecs * 6 + dot.id) * 15;
            const currentY = dot.y + dot.vy * ageSecs + 60 * ageSecs * ageSecs; // gravity pulling down
            
            // 100% to 0% linearly over 2 seconds
            const opacity = Math.max(0, 1 - (ageSecs / 2));
            
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', String(currentX));
            circle.setAttribute('cy', String(currentY));
            circle.setAttribute('r', String(dot.r));
            circle.setAttribute('fill', '#D83242');
            circle.setAttribute('opacity', String(opacity));
            g.appendChild(circle);
          }
        }
        dotsRef.current = aliveDots;
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (el) {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div className="app-container overflow-hidden snap-center cursor-crosshair" ref={containerRef}>
      <div className="absolute inset-0 p-12 select-none z-50 pointer-events-none flex flex-col justify-between">
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="calligraphy-text tracking-tighter" style={{ color: '#1B1E23' }}>冬至</div>
              <div className="mt-6 ml-6 py-2 px-[2px] font-serif text-lg font-bold tracking-[0.5em] border rounded-sm shadow-sm mix-blend-multiply" style={{ color: '#1B1E23', borderColor: 'rgba(27, 30, 35, 0.3)', backgroundColor: 'rgba(27, 30, 35, 0.05)', writingMode: 'vertical-rl' }}>寒枝落梅</div>
            </div>
            <div className="tracking-[0.4em] pl-1 text-xs uppercase font-bold font-sans" style={{ color: '#88837A' }}>Winter Solstice</div>
          </div>
          <div className="vertical-text text-xl font-medium tracking-[0.6em] opacity-80 mix-blend-multiply pt-2" style={{ color: '#1B1E23' }}>二 十 四 节 气</div>
        </div>

        <div className={`absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-3 text-[#5C564D]/60 text-[15px] font-serif tracking-widest pointer-events-none opacity-100`}>
          <svg className="w-6 h-6 opacity-70 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-5.407-1.59-1.59" />
          </svg>
          <span className="drop-shadow-sm">移动鼠标，看寒梅落雪</span>
        </div>

        <div className="flex justify-between items-end pb-2 pointer-events-auto">
          <div className="max-w-xs text-[15px] leading-9 text-[#5C564D] font-serif tracking-widest pl-5 border-l border-[#5C564D]/20 opacity-90 mx-2">
            “天时人事日相催，<br />冬至阳生春又来。”<br />
          </div>
          <div className="flex flex-col items-end space-y-6">
            <div className="text-[15px] text-[#5C564D] font-serif font-medium tracking-[0.3em]">十一月中</div>
            <div className="seal-box hover:scale-105 transition-transform duration-500 ease-out cursor-default" style={{ borderColor: '#D83242', color: '#D83242', backgroundColor: 'transparent', boxShadow: '2px 4px 12px rgba(216, 50, 66, 0.15)' }}>冬至</div>
          </div>
        </div>
      </div>

      <div className="cube-container z-10 flex items-center justify-center">
        <svg ref={svgRef} viewBox="0 0 600 600" className="w-[600px] h-[600px] bg-white filter drop-shadow-xl pointer-events-auto">
          {/* Background image placeholder */}
          <image href="/dongzhi-bg.png" x="0" y="0" width="600" height="600" preserveAspectRatio="xMidYMid slice" />
          
          {/* Dynamic Dots Group */}
          <g id="dongzhi-dots-group"></g>
        </svg>
      </div>
    </div>
  );
};
