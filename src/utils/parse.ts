// src/utils/parse.ts

import { Evaluation } from './types';

export function parseEvaluation(text: string): Evaluation {
  const lines = text.split('\n');
  const headerIdx = lines.findIndex(line => line.includes('**상세 평가**'));

  // Gracefully handle if the header isn't found
  if (headerIdx === -1) {
    console.error("Could not find '상세 평가' header in the text.");
    // Return a default or empty evaluation to avoid crashing
    return {
      totalScore: 0,
      relevancy: 0,
      elaboration: 0,
      syntax: 0,
      vocabulary: 0,
      naturalness: 0,
      grammar: 0,
      detailedFeedback: 'Error: Could not parse evaluation feedback.',
    };
  }

  // --- This part for parsing numeric scores remains the same ---
  const numericLines = lines.slice(0, headerIdx);
  const getScore = (label: string) => {
    const line = numericLines.find(l => l.includes(label));
    if (!line) return 0;
    // This regular expression finds the first number (integer or float) on the line.
    const scoreMatch = line.match(/\d+(\.\d+)?/);
    return scoreMatch ? parseFloat(scoreMatch[0]) : 0;
  };

  // --- NEW LOGIC FOR DETAILED FEEDBACK ---
  // 1. Take all lines *after* the header.
  // 2. Join them back into a single string block.
  // 3. Perform the non-breaking space fix on the entire block.
  const detailedFeedbackBlock = lines
    .slice(headerIdx + 1)
    .join('\n')
    .replace(/\u00a0/g, ' ');

  return {
    totalScore: getScore('**전체 평가 결과**'),
    relevancy: getScore('관련성'),
    elaboration: getScore('논리적 상세설명'),
    syntax: getScore('문장 구조의 다양성'),
    vocabulary: getScore('어휘의 적절성'),
    naturalness: getScore('표현의 자연스러움'),
    grammar: getScore('문법의 정확성'),
    // 4. Use the entire, cleaned block. Trim it to remove leading/trailing whitespace.
    detailedFeedback: detailedFeedbackBlock.trim(),
  };
}

// src/utils/parse.ts

export function parseRationaleMarkdown(fullText: string): string {
  // Look for the marker line, allowing optional spaces
  const markerRegex = /^\s*\*\*해설\s*\(Rationale\)\*\*\s*$/m;
  const match = fullText.match(markerRegex);
  if (!match || typeof match.index === 'undefined') {
    // console.warn('Rationale marker not found in text; returning all text.');
    // as a fallback, return the entire text and clean it
    return fullText.trim().replace(/\u00a0/g, ' ');
  }

  // match.index is the start of the line; find the end-of-line
  const markerEnd = fullText.indexOf('\n', match.index);
  if (markerEnd === -1) {
    // marker is on the last line—nothing follows
    return '';
  }

  // Extract the raw rationale text
  const rationaleText = fullText.slice(markerEnd + 1).trim();

  // Clean the text by fixing non-breaking spaces before returning
  return rationaleText.replace(/\u00a0/g, ' ');
}