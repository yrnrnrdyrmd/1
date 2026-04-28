import React, { useEffect, useRef, useState } from 'react';

// Exact color mapping from the original artwork
const COLORS = {
  teal: "#26A8AC",
  sunYellow: "#F4EA3A",
  sunOrange: "#F37C2C",
  sunRed: "#DF2B3E",
  darkGreen: "#1E612C",
  midGreen: "#52A63D",
  mintGreen: "#60BC8A",
  limeYellow: "#D8F22A",
  pink: "#FF6DB0",
  deepRed: "#E72348",
  black: "#1E1A1B"
};

const LAYERS = [
  { id: 1, z: -180, content: (
    <svg viewBox="0 0 600 600" width="100%" height="100%">
       <circle cx="580" cy="-10" r="160" fill={COLORS.sunYellow} />
       <circle cx="580" cy="-10" r="115" fill={COLORS.sunOrange} />
       <circle cx="580" cy="-10" r="75" fill={COLORS.sunRed} />
       <path d="M -10 130 A 370 370 0 0 1 170 -10" fill="none" stroke={COLORS.teal} strokeWidth="8" />
       
       <circle cx="440" cy="80" r="45" fill={COLORS.midGreen} />
       <circle cx="520" cy="95" r="28" fill={COLORS.mintGreen} />
       <circle cx="540" cy="170" r="40" fill={COLORS.midGreen} />

       <circle cx="0" cy="180" r="20" fill={COLORS.limeYellow} />
       <circle cx="120" cy="160" r="10" fill={COLORS.pink} />
    </svg>
  )},
  { id: 2, z: -120, content: (
    <svg viewBox="0 0 600 600" width="100%" height="100%">
       <circle cx="310" cy="320" r="215" fill="none" stroke={COLORS.teal} strokeWidth="8" />
       
       <circle cx="400" cy="110" r="26" fill={COLORS.darkGreen} />
       <circle cx="495" cy="135" r="38" fill={COLORS.darkGreen} />
       <circle cx="575" cy="230" r="26" fill={COLORS.darkGreen} />
       <circle cx="510" cy="50" r="15" fill={COLORS.limeYellow} />
       <circle cx="590" cy="130" r="18" fill={COLORS.pink} />

       <circle cx="300" cy="80" r="35" fill={COLORS.midGreen} />
       <circle cx="280" cy="20" r="15" fill={COLORS.midGreen} />
    </svg>
  )},
  { id: 3, z: -70, content: (
    <svg viewBox="0 0 600 600" width="100%" height="100%">
       <circle cx="330" cy="310" r="110" fill="none" stroke={COLORS.teal} strokeWidth="8" />
       
       <circle cx="440" cy="120" r="18" fill={COLORS.pink} />
       <circle cx="530" cy="110" r="20" fill={COLORS.pink} />
       <circle cx="470" cy="180" r="32" fill={COLORS.mintGreen} />
       <circle cx="520" cy="200" r="24" fill={COLORS.mintGreen} />

       <circle cx="370" cy="165" r="32" fill={COLORS.darkGreen} />
       <circle cx="40" cy="350" r="24" fill={COLORS.midGreen} />
       <circle cx="250" cy="425" r="42" fill={COLORS.midGreen} />
    </svg>
  )},
  { id: 4, z: -30, content: (
    <svg viewBox="0 0 600 600" width="100%" height="100%">
       <circle cx="360" cy="305" r="40" fill="none" stroke={COLORS.teal} strokeWidth="8" />
       
       <circle cx="410" cy="140" r="14" fill={COLORS.limeYellow} />
       <circle cx="460" cy="155" r="20" fill={COLORS.limeYellow} />
       <circle cx="485" cy="230" r="24" fill={COLORS.darkGreen} />
       <circle cx="540" cy="260" r="15" fill={COLORS.pink} />
       <circle cx="550" cy="210" r="14" fill={COLORS.mintGreen} />

       <circle cx="365" cy="120" r="16" fill={COLORS.pink} />
       <circle cx="435" cy="245" r="6" fill={COLORS.deepRed} />
       <circle cx="80" cy="440" r="14" fill={COLORS.pink} />
       <circle cx="420" cy="345" r="18" fill={COLORS.midGreen} />
    </svg>
  )},
  { id: 5, z: 20, content: (
    <svg viewBox="0 0 600 600" width="100%" height="100%">
       <circle cx="465" cy="130" r="10" fill={COLORS.darkGreen} />
       <circle cx="505" cy="170" r="12" fill={COLORS.limeYellow} />
       <circle cx="560" cy="190" r="14" fill={COLORS.limeYellow} />
       <circle cx="460" cy="255" r="26" fill={COLORS.midGreen} />
       <circle cx="510" cy="255" r="14" fill={COLORS.darkGreen} />
       <circle cx="490" cy="285" r="18" fill={COLORS.pink} />

       <circle cx="60" cy="85" r="22" fill={COLORS.limeYellow} />
       <circle cx="355" cy="255" r="14" fill={COLORS.midGreen} />
       <circle cx="195" cy="305" r="7" fill={COLORS.deepRed} />
       <circle cx="440" cy="190" r="20" fill={COLORS.pink} />
       <circle cx="475" cy="275" r="15" fill={COLORS.mintGreen} />
       <circle cx="495" cy="325" r="22" fill={COLORS.limeYellow} />
    </svg>
  )},
  { id: 6, z: 70, content: (
    <svg viewBox="0 0 600 600" width="100%" height="100%">
       <polyline points="60,520 230,270 355,305" fill="none" stroke={COLORS.black} strokeWidth="3" strokeLinejoin="miter" />
       <circle cx="375" cy="340" r="8" fill={COLORS.pink} />
       <circle cx="290" cy="260" r="10" fill={COLORS.midGreen} />
       <circle cx="150" cy="580" r="12" fill={COLORS.pink} />
       <circle cx="430" cy="495" r="14" fill={COLORS.darkGreen} />
       <circle cx="530" cy="350" r="15" fill={COLORS.pink} />
    </svg>
  )},
  { id: 7, z: 120, content: (
    <svg viewBox="0 0 600 600" width="100%" height="100%">
       <circle cx="405" cy="465" r="10" fill={COLORS.limeYellow} />
       <circle cx="310" cy="580" r="6" fill={COLORS.deepRed} />
       <circle cx="415" cy="580" r="10" fill={COLORS.pink} />
       <circle cx="575" cy="500" r="28" fill={COLORS.midGreen} />
       <circle cx="310" cy="120" r="10" fill={COLORS.limeYellow} />
    </svg>
  )},
  { id: 8, z: 180, content: (
    <svg viewBox="0 0 600 600" width="100%" height="100%">
       <circle cx="-10" cy="580" r="90" fill={COLORS.black} />
       <circle cx="520" cy="590" r="12" fill={COLORS.pink} />
    </svg>
  )}
];

export const Dashu = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  
  const rotX = useRef(0);
  const rotY = useRef(0);
  const targetRotX = useRef(0);
  const targetRotY = useRef(0);
  const autoRotY = useRef(0);
  const isDraggingRef = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const [isDraggingState, setIsDraggingState] = useState(false);
  const damping = 0.92;

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // Only left click
      isDraggingRef.current = true;
      setIsDraggingState(true);
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      
      const deltaX = e.clientX - prevMousePos.current.x;
      const deltaY = e.clientY - prevMousePos.current.y;
      
      prevMousePos.current = { x: e.clientX, y: e.clientY };

      targetRotY.current += deltaX * 0.3;  
      targetRotX.current -= deltaY * 0.3; 
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

    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      let deltaMs = time - lastTime;
      if (deltaMs > 100) deltaMs = 16; // Clamp large delta on tab switch
      lastTime = time;

      autoRotY.current += (2 / 1000) * deltaMs; // Reduced auto rotation speed
      const currentTargetY = targetRotY.current + autoRotY.current;

      const lerp = 1 - Math.pow(damping, deltaMs / 16);
      rotX.current += (targetRotX.current - rotX.current) * lerp;
      rotY.current += (currentTargetY - rotY.current) * lerp;

      const finalX = Math.max(-35, Math.min(35, rotX.current));
      const finalZ = Math.sin(time / 3000) * 3;

      if (cubeRef.current) {
        cubeRef.current.style.transform = `rotateX(${finalX}deg) rotateY(${rotY.current}deg) rotateZ(${finalZ}deg)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (container) {
        container.removeEventListener('mousedown', handleMouseDown);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      className={`app-container overflow-hidden snap-center ${isDraggingState ? 'cursor-grabbing' : 'cursor-grab'}`} 
      ref={containerRef}
    >
      {/* UI Elements overlay */}
      <div className="absolute inset-0 p-12 select-none z-50 pointer-events-none flex flex-col justify-between">
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="calligraphy-text tracking-tighter">大暑</div>
              <div 
                className="mt-6 ml-6 py-2 px-[2px] text-[#C1272D] font-serif text-lg font-bold tracking-[0.5em] border border-[#C1272D]/20 rounded-sm bg-[#C1272D]/5 shadow-sm mix-blend-multiply"
                style={{ writingMode: 'vertical-rl' }}
              >
                倒影
              </div>
            </div>
            <div className="tracking-[0.4em] pl-1 text-xs uppercase text-[#88837A] font-bold font-sans">The Great Heat</div>
          </div>
          <div className="vertical-text text-xl text-[#2D2926] font-medium tracking-[0.6em] opacity-80 mix-blend-multiply pt-2">
            二 十 四 节 气
          </div>
        </div>
        
        {/* Drag Hint */}
        <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center space-x-2 text-[#7A7468]/80 text-[15px] font-sans tracking-widest pointer-events-none opacity-100`}>
          <svg className="w-6 h-6 opacity-70 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          <span className="drop-shadow-sm font-serif">按住左键拖动，看万物绽放</span>
        </div>

        <div className="flex justify-between items-end pb-2 pointer-events-auto">
          <div className="max-w-xs text-[15px] leading-9 text-[#5C564D] font-serif tracking-widest pl-5 border-l border-[#5C564D]/20 opacity-90 mx-2">
            “大暑至，万物荣华。”<br />
            日影长，蝉鸣深，此时节气最是火热蒸腾。<br />
            清风不至，温风沐人。
          </div>
          <div className="flex flex-col items-end space-y-6">
            <button 
              onClick={() => {
                // Ensure rotY and autoRotY are kept within 360 to prevent long rewinds
                const currentModY = rotY.current % 360;
                const normalize = (val: number) => {
                  let v = val % 360;
                  if (v > 180) v -= 360;
                  if (v < -180) v += 360;
                  return v;
                };
                
                rotY.current = normalize(rotY.current);
                autoRotY.current = 0;
                targetRotX.current = 0;
                targetRotY.current = 0;
              }}
              className="text-xs text-[#7A7468]/60 hover:text-[#7A7468] border border-[#5C564D]/20 hover:border-[#5C564D]/40 px-3 py-1 rounded-sm hover:bg-[#5C564D]/5 transition-all outline-none"
              style={{ pointerEvents: 'auto' }}
            >
              复位
            </button>
            <div className="text-[15px] text-[#7A7468] font-serif font-medium tracking-[0.3em]">七月二十二</div>
            <div className="seal-box hover:scale-105 transition-transform duration-500 ease-out cursor-default">大暑</div>
          </div>
        </div>
      </div>

      <div ref={cubeRef} className="cube-container">
        {LAYERS.map((layer) => {
          const scaleCorrection = (1200 - layer.z) / 1200;
          return (
            <div 
              key={layer.id} 
              className="canvas-layer"
              style={{ 
                transform: `translateZ(${layer.z}px) scale(${scaleCorrection})`,
                transformOrigin: 'center center'
              }}
            >
              {layer.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};
