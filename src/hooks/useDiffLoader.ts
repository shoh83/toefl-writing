// src/hooks/useDiffLoader.ts

import { useState, useEffect } from 'react';
// We only need the `diffWords` function from the 'diff' package
import { diffWords } from 'diff';

export function useDiffLoader(
  original: string,
  revised: string,
  show: boolean
): string {
  const [diffHtml, setDiffHtml] = useState('');

  useEffect(() => {
    // If we're not showing the diff, clear the HTML and do nothing.
    if (!show) {
      setDiffHtml('');
      return;
    }

    // 1. Calculate the word-by-word differences using the `diff` library.
    const differences = diffWords(original, revised);

    // 2. Build an HTML string from the array of differences.
    const resultHtml = differences
      .map(part => {
        const text = part.value;

        if (part.added) {
          // Wrap added text in an <ins> tag (for "inserted").
          return `<ins>${text}</ins>`;
        }
        if (part.removed) {
          // Wrap removed text in a <del> tag (for "deleted").
          return `<del>${text}</del>`;
        }
        // Unchanged text is returned as-is, without any wrapper tag.
        return text;
      })
      .join('');

    setDiffHtml(resultHtml);

    // No cleanup is needed since we aren't adding links or scripts anymore.
  }, [original, revised, show]);

  return diffHtml;
}