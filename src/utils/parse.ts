// src/utils/parse.ts

import { Evaluation } from './types';

export function parseEvaluation(text: string): Evaluation {
  const lines = text.split('\n');
  const headerIdx = lines.findIndex(line => line.trim() === '**상세 평가**');
  
  // 1) numericLines holds everything up to the detailed‐feedback header
  const numericLines = lines.slice(0, headerIdx);

  // 2) detailLines contains the bullets (each line still starts with "-")
  const detailLines = lines
    .slice(headerIdx + 1)
    .filter(l => l.trim().startsWith('-'))
    .map(l => l.replace(/^\s*/, ''));  // remove *every* leading space

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
    detailedFeedback: detailLines.join('\n'),
  };
}

// src/utils/parse.ts

export function parseRationaleMarkdown(fullText: string): string {
  // Look for the marker line, allowing optional spaces
  const markerRegex = /^\s*\*\*해설\s*\(Rationale\)\*\*\s*$/m;
  const match = fullText.match(markerRegex);
  if (!match) {
    console.warn('Rationale marker not found in text; returning all text.');
    // as a fallback, return the entire text so you see something
    return fullText.trim();
  }

  // match.index is the start of the line; find the end-of-line
  const markerEnd = fullText.indexOf('\n', match.index!);
  if (markerEnd === -1) {
    // marker is on the last line—nothing follows
    return '';
  }

  // Return everything after that newline
  return fullText.slice(markerEnd + 1).trim();
}
