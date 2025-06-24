// src/components/ScoreBar.tsx
import React from 'react';

export function ScoreBar({ label, score }: { label: string; score: number }) {
  const pct = (score / 5) * 100;
  const barColor = score >= 4
    ? 'bg-green-500'
    : score >= 3
    ? 'bg-yellow-500'
    : 'bg-red-500';

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-800">{score}/5</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`${barColor} h-2.5 rounded-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
