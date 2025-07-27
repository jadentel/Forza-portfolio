import React, { useState, useEffect } from 'react';

const WaveSvg = ({ x, y }) => {
  return (
    <div>
      <svg
        style={{
          transform: `translate(${x}px, ${y}px)`,
          height: `calc(100vh + 300px)`,
          width: `calc(100vw + 300px)`,
        }}
        className="fixed z-10 w-full h-full" viewBox="0 0 1440 933" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M213.418 213.127C17.6651 243.307 -283.23 404.73 -337 471.245L-229.641 1316.08H163.826H1473.38L2208 1210.85C2111.9 1144.34 1783.58 -66.4344 1657.58 -54.9184C1500.09 -40.5234 1040.68 294.037 813.427 351.121C586.176 408.204 458.108 175.402 213.418 213.127Z" fill="url(#gradient-bg)" />
        <defs>
          <linearGradient id="gradient-bg" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" style={{ stopColor: "#EFF6E0", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "#AEC3B0", stopOpacity: 0.2 }} />
          </linearGradient>
        </defs>
      </svg>
      <div className="fixed w-full z-0 h-full bg-forza-10"></div>
    </div>
  )
}

function WaveBackground() {
  return (
    <div>
      <WaveSvg x={-30} y={-10} />
      <WaveSvg x={-90} y={-30} />
      <WaveSvg x={-150} y={-50} />
    </div>
  )
}


export default WaveBackground;
