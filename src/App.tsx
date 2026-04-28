import React from 'react';
import { Dashu } from './Dashu';
import { Lichun } from './Lichun';
import { Shuangjiang } from './Shuangjiang';
import { Dongzhi } from './Dongzhi';

export default function App() {
  return (
    <div id="scroll-container" className="w-screen h-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth">
      <Lichun />
      <Dashu />
      <Shuangjiang />
      <Dongzhi />
    </div>
  );
}

