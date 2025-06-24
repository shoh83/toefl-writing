// src/utils/parse.ts

import { Evaluation, RationaleItem } from './types';

export function parseEvaluation(text: string): Evaluation {
  const lines = text.split('\n');
  const headerEnd = lines.findIndex(line => line.trim() === '**상세 평가**');
  
  // Split numeric section / detailed section
  const numericLines = lines.slice(0, headerEnd);
  const detailLines = lines.slice(headerEnd + 1);

  // Parse numeric scores as before...
  const getScore = (label: string) => {
    const line = numericLines.find(l => l.includes(label));
    return line ? parseFloat(line.split(':')[1].trim()) : 0;
  };

  return {
    totalScore: getScore('**전체 평가 결과**'),
    relevancy:    getScore('관련성'),
    elaboration:  getScore('논리적 상세설명'),
    syntax:       getScore('문장 구조의 다양성'),
    vocabulary:   getScore('어휘의 적절성'),
    naturalness:  getScore('표현의 자연스러움'),
    grammar:      getScore('문법의 정확성'),
    detailedFeedback: detailLines.join('\n').trim(),
  };
}

export function parseRationale(text: string): RationaleItem[] {
  const marker = '**해설 (Rationale)**';
  if (!text.includes(marker)) return [];

  const parts = text.split(marker)[1]
    .split(/\n\s*\d+\.\s*/)
    .filter(p => p.trim());

  return parts.map(p => {
    const lines = p.trim().split('\n');
    const header = lines[0];
    const reason = lines.slice(1).join('\n').trim();

    const cat = header.match(/\*\*\[(.+?)\]\*\*/)?.[1] || '';
    const orig = header.match(/\(Original: (.+?)\)/)?.[1] || '';
    const rev = header.match(/Revised: (.+?)\)/)?.[1] || '';

    return { category: cat, original: orig, revised: rev, reason };
  });
}
