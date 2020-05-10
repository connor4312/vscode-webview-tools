import { Color } from './colors';

export type ColorMap = { [key in Color]: string };

/**
 * Parses the vscode CSS variables from the document, and returns them.
 */
export const parseColors = () => {
  const rawVars = String(document.documentElement.getAttribute('style'));
  const re = new RegExp('--vscode-(.*?):(.*?)(;|$)', 'g');
  const vars: Partial<ColorMap> = {};

  let match: string[] | null;
  while ((match = re.exec(rawVars)) !== null) {
    const [, key, value] = match;
    vars[key as Color] = value;
  }

  return vars as ColorMap;
};

/**
 * Watches the body and calls the callback function when the colors change.
 * This can very easily be wrapped into a react or preact hook, for example:
 *
 * ```
 * import { useState, useEffect } from 'preact/hooks';
 *
 * const useCssVariables = () => {
 *   const [vars, setVars] = useState<{ [key: string]: string }>({});
 *   useEffect(() => observeColors(setVars), []);
 *   return vars;
 * }
 * ```
 */
export const observeColors = (onChange: (colors: ColorMap) => void): (() => void) => {
  onChange(parseColors());

  const observer = new MutationObserver(() => {
    onChange(parseColors());
  });

  observer.observe(document.documentElement, {
    attributeFilter: ['style'],
    childList: false,
    subtree: false,
  });

  return () => observer.disconnect();
};
