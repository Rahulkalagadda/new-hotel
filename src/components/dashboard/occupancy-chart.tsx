import React from 'react'

const OccupancyChart: React.FC = () => {
  // Minimal placeholder chart using an SVG sparkline for a professional look.
  const points = '0,70 20,60 40,80 60,50 80,65 100,55 120,75 140,60 160,80 180,70 200,85'

  return (
    <div className="w-full h-44 bg-muted/5 rounded-md p-3 flex items-center">
      <svg viewBox="0 0 220 100" className="w-full h-full">
        <defs>
          <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fce7f3" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <polyline fill="url(#g)" stroke="#fb7185" strokeWidth="2" points={points} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export default OccupancyChart
