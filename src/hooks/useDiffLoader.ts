// src/hooks/useDiffLoader.ts
import { useState, useEffect } from 'react';

export function useDiffLoader(
  original: string,
  revised: string,
  show: boolean
): string {
  const [diffHtml, setDiffHtml] = useState('');

  useEffect(() => {
    if (!show) {
      setDiffHtml('');
      return;
    }

    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://cdn.jsdelivr.net/npm/diff2html@3.4.47/bundles/css/diff2html.min.css';
    document.head.appendChild(cssLink);

    const loadScript = (src: string) =>
      new Promise<void>(res => {
        const s = document.createElement('script');
        s.src = src; s.async = true;
        s.onload = () => res();
        document.body.appendChild(s);
      });

    Promise.all([
      loadScript('https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js'),
      loadScript('https://cdn.jsdelivr.net/npm/diff2html@3.4.47/bundles/js/diff2html.min.js'),
    ]).then(() => {
      // @ts-expect-error: using Diff from CDN-loaded script
      const diffStr = Diff.createPatch('answer.txt', original, revised);
      // @ts-expect-error: using Diff2Html from CDN-loaded script
      const html = Diff2Html.getPrettyHtml(diffStr, {
        inputFormat: 'diff',
        showFiles: false,
        matching: 'lines',
        outputFormat: 'side-by-side',
      });
      setDiffHtml(html);
    });

    return () => {
      document.head.removeChild(cssLink);
      // (scripts cleanup omitted for brevity)
    };
  }, [original, revised, show]);

  return diffHtml;
}
