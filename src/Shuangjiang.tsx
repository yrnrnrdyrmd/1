import React, { useEffect, useRef, useState } from 'react';

const ROW_COLORS = [
  "#FCBA4B", // row 0 (highest)
  "#FAA333", // row 1
  "#F67420", // row 2
  "#F9A139", // row 3
  "#F5BF46", // row 4
  "#F8873C", // row 5
  "#EE5E21", // row 6
  "#F1B54E", // row 7
  "#EE5C1E", // row 8
  "#E04815", // row 9
  "#43332A", // row 10 (mounds at bottom)
];

const LEAVES: any[] = [];
const startY = 140;
for (let r = 0; r < 11; r++) {
  const y = startY + r * 46;
  const numLeaves = 6 + Math.floor(r/3);
  const offset = (r % 2) * 65 - 40;
  for (let c = -1; c <= numLeaves; c++) {
    LEAVES.push({
      x: c * 130 + offset + (r%3)*10,
      y: y,
      w: 160 + r * 3,
      h: 80 + r * 2,
      c: ROW_COLORS[r] || "#43332A",
      r: r
    });
  }
}

const getLeafPath = (w: number, h: number) => `M 0,${h/2} Q ${-w/2},${h/2} ${-w/2},${-h/2} C ${-w/3},${-h*1.2} ${w/3},${-h*1.2} ${w/2},${-h/2} Q ${w/2},${h/2} 0,${h/2} Z`;
const getVeinPath = (w: number, h: number) => `M 0,${h/2} Q ${-w*0.05},0 ${-w*0.15},${-h*0.75} M 0,${h/2} L 0,${-h*0.8} M 0,${h/2} Q ${w*0.05},0 ${w*0.15},${-h*0.75}`;

const Leaf = React.memo(({ l, isVisible, shouldSwing, i }: { l: any, isVisible: boolean, shouldSwing: boolean, i: number }) => (
  <g 
    style={{ 
      transformOrigin: `${l.x}px ${l.y + l.h/2}px`,
      transform: isVisible ? 'scale(1)' : 'scale(0.5)',
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
      willChange: 'opacity, transform'
    }}
  >
    <g 
      className={shouldSwing ? 'animate-swing-slow' : ''}
      style={{ 
        transformOrigin: `${l.x}px ${l.y + l.h/2}px`,
        animationDelay: `${(i % 5) * 0.4}s`
      }}
    >
      <g transform={`translate(${l.x}, ${l.y})`}>
        <path d={getLeafPath(l.w, l.h)} fill={l.c} />
        {l.r < 10 && <path d={getVeinPath(l.w, l.h)} stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none" strokeLinecap="round" />}
      </g>
    </g>
  </g>
));

export const Shuangjiang = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isDraggingState, setIsDraggingState] = useState(false);
  
  const progressRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startY = useRef(0);
  const startProgress = useRef(0);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // Only left click
      isDraggingRef.current = true;
      setIsDraggingState(true);
      startY.current = e.clientY;
      startProgress.current = progressRef.current;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaY = startY.current - e.clientY;
      // drag up means deltaY > 0
      const addProgress = deltaY / 400; // 400px of drag upwards to reach max
      const p = Math.max(0, Math.min(1, startProgress.current + addProgress));
      
      progressRef.current = p;
      setProgress(p);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      setIsDraggingState(false);
    };

    const handleMouseLeave = () => {
      isDraggingRef.current = false;
      setIsDraggingState(false);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousedown', handleMouseDown);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const allVisible = progress >= 0.9;

  return (
    <div className={`app-container overflow-hidden snap-center ${isDraggingState ? 'cursor-grabbing' : 'cursor-grab'}`} ref={containerRef}>
      <div className="absolute inset-0 p-12 select-none z-50 pointer-events-none flex flex-col justify-between">
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="calligraphy-text tracking-tighter" style={{ color: '#1A1A1A' }}>霜降</div>
              <div className="mt-6 ml-6 py-2 px-[2px] font-serif text-lg font-bold tracking-[0.5em] border rounded-sm shadow-sm mix-blend-multiply" style={{ color: '#1A1A1A', borderColor: 'rgba(26, 26, 26, 0.3)', backgroundColor: 'rgba(26, 26, 26, 0.05)', writingMode: 'vertical-rl' }}>层林尽染</div>
            </div>
            <div className="tracking-[0.4em] pl-1 text-xs uppercase font-bold font-sans" style={{ color: '#88837A' }}>Frost's Descent</div>
          </div>
          <div className="vertical-text text-xl font-medium tracking-[0.6em] opacity-80 mix-blend-multiply pt-2" style={{ color: '#1A1A1A' }}>二 十 四 节 气</div>
        </div>

        <div className={`absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-3 text-[#5C564D]/60 text-[15px] font-serif tracking-widest pointer-events-none opacity-100`}>
          <svg className="w-6 h-6 opacity-70 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 15l7-7 7 7" />
          </svg>
          <span className="drop-shadow-sm">按住左键向上拖动，看层林尽染</span>
        </div>

        <div className="flex justify-between items-end pb-2 pointer-events-auto">
          <div className="max-w-xs text-[15px] leading-9 text-[#5C564D] font-serif tracking-widest pl-5 border-l border-[#5C564D]/20 opacity-90 mx-2">
            “满地翻黄银杏叶，<br />
            千树扫作一番黄。”
          </div>
          <div className="flex flex-col items-end space-y-6">
            <div className="text-[15px] text-[#5C564D] font-serif font-medium tracking-[0.3em]">十月二十三</div>
            <div className="seal-box hover:scale-105 transition-transform duration-500 ease-out cursor-default" style={{ borderColor: '#1A1A1A', color: '#1A1A1A', backgroundColor: 'transparent', boxShadow: '2px 4px 12px rgba(26, 26, 26, 0.1)' }}>霜降</div>
          </div>
        </div>
      </div>

      <div className="cube-container z-10 flex items-center justify-center">
        <svg viewBox="0 0 600 600" className="w-[600px] h-[600px] bg-white filter drop-shadow-xl pointer-events-auto">
          {/* BACK LAYER: Sky and Mountain */}
          <rect width="600" height="600" fill="#8CE0E7" />
          <path d="M0,60 Q100,40 200,60 Q400,100 600,60 L600,600 L0,600 Z" fill="#69A2C2" />

          {/* COLORFUL LAYER REVEALED ON SCROLL */}
          {LEAVES.map((l, i) => {
            const triggerPoint = (l.r + 1) * 0.08;
            const isVisible = progress > triggerPoint;
            
            const shouldSwing = allVisible;

            return (
              <Leaf key={`l-${i}`} l={l} isVisible={isVisible} shouldSwing={shouldSwing} i={i} />
            );
          })}
        </svg>
      </div>
    </div>
  );
};


