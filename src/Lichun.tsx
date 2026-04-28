import React, { useEffect, useRef, useState } from 'react';
import branchesImg from './assets/branches.png';
import iceImg from './assets/ice.png';
import blossomsImg from './assets/blossoms.png';

const COLORS = {
  black: "#1A1A1A", iceBlue: "#7AC2DB", pink: "#FFA8CE", magenta: "#D9427A", green: "#6FB056"
};

const LINES = [
  "M0,140 L170,150", "M110,0 L170,150", "M170,150 L280,80", "M280,80 L400,0",
  "M280,80 L460,140", "M460,140 L400,0", "M460,140 L600,110", "M0,320 L140,280",
  "M140,280 L170,150", "M140,280 L260,240", "M170,150 L260,240", "M260,240 L280,80",
  "M460,140 L410,290", "M410,290 L600,250", "M460,140 L600,250", "M260,240 L335,265",
  "M335,265 L410,290", "M335,265 L280,80", "M335,265 L290,400", "M140,280 L150,355",
  "M150,355 L160,430", "M150,355 L0,320", "M150,355 L0,480", "M150,355 L260,240",
  "M0,480 L160,430", "M160,430 L290,400", "M290,400 L260,240", "M410,290 L430,365",
  "M430,365 L450,440", "M430,365 L600,420", "M430,365 L290,400", "M450,440 L600,420",
  "M450,440 L520,530", "M160,430 L240,550", "M240,550 L100,600", "M240,550 L290,400",
  "M240,550 L420,600", "M420,600 L520,530", "M520,530 L600,580"
];

const ICE = [
  "0,0 110,0 170,150 0,140",
  "400,0 600,0 600,110 460,140",
  "600,250 600,420 430,365 410,290",
  "520,530 600,580 600,600 420,600",
  "0,480 160,430 240,550 100,600 0,600",
  "0,140 170,150 140,280 0,320",
  "0,320 150,355 0,480"
];

const DOTS = [
  // Pink Blossoms
  { type: 'pink', x: 260, y: 240, r: 20 },
  { type: 'pink', x: 290, y: 400, r: 18 },
  { type: 'pink', x: 410, y: 290, r: 24 },
  { type: 'pink', x: 170, y: 150, r: 16 },
  { type: 'pink', x: 240, y: 550, r: 18 },
  { type: 'pink', x: 460, y: 140, r: 22 },
  { type: 'pink', x: 150, y: 355, r: 20 },
  // Magenta Blossoms
  { type: 'magenta', x: 200, y: 260, r: 14 },
  { type: 'magenta', x: 370, y: 420, r: 12 },
  { type: 'magenta', x: 435, y: 215, r: 16 },
  { type: 'magenta', x: 225, y: 115, r: 14 },
  { type: 'magenta', x: 335, y: 265, r: 15 },
  { type: 'magenta', x: 160, y: 430, r: 13 },
  { type: 'magenta', x: 450, y: 440, r: 17 },
  // Green leaves/buds
  { type: 'green', x: 240, y: 220, r: 8 },
  { type: 'green', x: 280, y: 260, r: 10 },
  { type: 'green', x: 270, y: 420, r: 9 },
  { type: 'green', x: 310, y: 380, r: 8 },
  { type: 'green', x: 380, y: 280, r: 10 },
  { type: 'green', x: 430, y: 310, r: 9 },
  { type: 'green', x: 480, y: 160, r: 8 },
  { type: 'green', x: 140, y: 410, r: 9 },
  { type: 'green', x: 120, y: 260, r: 10 },
  { type: 'green', x: 290, y: 60, r: 11 },
  { type: 'green', x: 260, y: 90, r: 8 },
  { type: 'green', x: 300, y: 100, r: 7 },
  { type: 'green', x: 400, y: 270, r: 9 },
  { type: 'green', x: 250, y: 530, r: 10 },
  { type: 'green', x: 480, y: 450, r: 8 }
];

export const Lichun = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const stateRef = useRef({ mx: -1000, my: -1000, tx: -1000, ty: -1000, mr: 0, hover: false, r1: {x:0, y:0, r:0, active:false}, r2: {x:0, y:0, r:0, active:false} });

  useEffect(() => {
    let id: number;

    const handleMM = (e: MouseEvent) => {
      
      if (!svgRef.current) return;
      const r = svgRef.current.getBoundingClientRect();
      const newTx = ((e.clientX - r.left) / r.width) * 600;
      const newTy = ((e.clientY - r.top) / r.height) * 600;
      stateRef.current.tx = newTx;
      stateRef.current.ty = newTy;
      if (!stateRef.current.hover) {
        stateRef.current.mx = newTx;
        stateRef.current.my = newTy;
      }
      stateRef.current.hover = true;
    };
    const handleML = () => { stateRef.current.hover = false; };

    const el = containerRef.current;
    if (el) { el.addEventListener('mousemove', handleMM); el.addEventListener('mouseleave', handleML); }

    const animate = () => {
      const s = stateRef.current;
      s.mr += ((s.hover ? 160 : 0) - s.mr) * 0.08;
      
      if (s.hover) {
        s.mx += (s.tx - s.mx) * 0.15;
        s.my += (s.ty - s.my) * 0.15;
      }
      
      const updateR = (rObj: any) => {
        if (!s.hover) {
          if (!rObj.active && Math.random() < 0.005) {
            rObj.active = true; rObj.x = 50 + Math.random()*500; rObj.y = 50 + Math.random()*500; rObj.r = 0; rObj.l = 100 + Math.random()*100;
          } else if (rObj.active) {
            if (rObj.l-- > 0) rObj.r += (80 - rObj.r) * 0.05; else { rObj.r += -rObj.r * 0.05; if (rObj.r < 1) rObj.active = false; }
          }
        } else { rObj.r += -rObj.r * 0.05; if (rObj.r < 1) rObj.active = false; }
      };
      
      updateR(s.r1); updateR(s.r2);

      const updateMask = (prefix: string) => {
        const mouse = document.getElementById(`${prefix}-mouse`);
        if (mouse) { mouse.setAttribute('cx', String(s.mx)); mouse.setAttribute('cy', String(s.my)); mouse.setAttribute('r', String(s.mr)); }
        const mr1 = document.getElementById(`${prefix}-r1`);
        if (mr1) { mr1.setAttribute('cx', String(s.r1.x)); mr1.setAttribute('cy', String(s.r1.y)); mr1.setAttribute('r', String(s.r1.r)); }
        const mr2 = document.getElementById(`${prefix}-r2`);
        if (mr2) { mr2.setAttribute('cx', String(s.r2.x)); mr2.setAttribute('cy', String(s.r2.y)); mr2.setAttribute('r', String(s.r2.r)); }
      }

      updateMask('melt');
      updateMask('bloss');

      id = requestAnimationFrame(animate);
    };
    id = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(id); if (el) { el.removeEventListener('mousemove', handleMM); el.removeEventListener('mouseleave', handleML); } };
  }, []);

  return (
    <div className="app-container overflow-hidden snap-center" ref={containerRef}>
      <div className="absolute inset-0 p-12 select-none z-50 pointer-events-none flex flex-col justify-between">
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="calligraphy-text tracking-tighter">立春</div>
              <div className="mt-6 ml-6 py-2 px-[2px] text-[#7AC2DB] font-serif text-lg font-bold tracking-[0.5em] border border-[#7AC2DB]/30 rounded-sm bg-[#7AC2DB]/10 shadow-sm mix-blend-multiply" style={{ writingMode: 'vertical-rl' }}>冰消春生</div>
            </div>
            <div className="tracking-[0.4em] pl-1 text-xs uppercase text-[#88837A] font-bold font-sans">Start of Spring</div>
          </div>
          <div className="vertical-text text-xl text-[#2D2926] font-medium tracking-[0.6em] opacity-80 mix-blend-multiply pt-2">二 十 四 节 气</div>
        </div>

        <div className={`absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-3 text-[#5C564D]/60 text-[15px] font-serif tracking-widest pointer-events-none opacity-100`}>
          <svg className="w-6 h-6 opacity-70 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-5.407-1.59-1.59" />
          </svg>
          <span className="drop-shadow-sm">在画面上移动鼠标，看冰雪消融</span>
        </div>

        <div className="flex justify-between items-end pb-2 pointer-events-auto">
          <div className="max-w-xs text-[15px] leading-9 text-[#5C564D] font-serif tracking-widest pl-5 border-l border-[#5C564D]/20 opacity-90 mx-2">
            “东风解冻，蛰虫始振，鱼陟负冰。”<br />阳和起蛰，品物皆春。<br />春气至，则草木自生。
          </div>
          <div className="flex flex-col items-end space-y-6">
            <div className="text-[15px] text-[#7A7468] font-serif font-medium tracking-[0.3em]">二月四日</div>
            <div className="seal-box bg-[#6DA64F] hover:scale-105 transition-transform duration-500 ease-out cursor-default" style={{ boxShadow: '2px 4px 12px rgba(109, 166, 79, 0.25)', borderColor: 'rgba(255,255,255,0.3)' }}>立春</div>
          </div>
        </div>
      </div>

      <div className="cube-container z-10 flex items-center justify-center">
        <svg ref={svgRef} viewBox="0 0 600 600" className="w-[600px] h-[600px] bg-white filter drop-shadow-xl pointer-events-auto">
          <defs>
            <radialGradient id="meltGrad">
              <stop offset="20%" stopColor="black" stopOpacity="1" />
              <stop offset="100%" stopColor="black" stopOpacity="0" />
            </radialGradient>
            <mask id="iceMask">
              <rect width="600" height="600" fill="white" />
              <circle id="melt-mouse" cx="-1000" cy="-1000" r="0" fill="url(#meltGrad)" />
              <circle id="melt-r1" cx="-1000" cy="-1000" r="0" fill="url(#meltGrad)" />
              <circle id="melt-r2" cx="-1000" cy="-1000" r="0" fill="url(#meltGrad)" />
            </mask>

            <radialGradient id="blossomGrad">
              <stop offset="60%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="blossomMask">
              <rect width="600" height="600" fill="black" />
              <circle id="bloss-mouse" cx="-1000" cy="-1000" r="0" fill="url(#blossomGrad)" />
              <circle id="bloss-r1" cx="-1000" cy="-1000" r="0" fill="url(#blossomGrad)" />
              <circle id="bloss-r2" cx="-1000" cy="-1000" r="0" fill="url(#blossomGrad)" />
            </mask>
          </defs>

          <image href={branchesImg} width="600" height="600" />
          <image href={iceImg} width="600" height="600" mask="url(#iceMask)" className="transition-opacity duration-1000" />
          <image href={blossomsImg} width="600" height="600" mask="url(#blossomMask)" className="transition-opacity duration-1000" />
        </svg>
      </div>
    </div>
  );
}
