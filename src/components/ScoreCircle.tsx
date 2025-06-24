// src/components/ScoreCircle.tsx
import React from 'react';

export function ScoreCircle({ score }: { score: number }) {
  const getColor = (s: number) =>
    s >= 4 ? 'bg-green-100 text-green-800 border-green-400'
    : s >= 3 ? 'bg-yellow-100 text-yellow-800 border-yellow-400'
    : 'bg-red-100 text-red-800 border-red-400';

  return (
    <div className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 ${getColor(score)} shadow-lg`}>
      <span className="text-sm font-medium">Overall</span>
      <span className="text-3xl font-bold">{score.toFixed(1)}</span>
    </div>
  );
}
