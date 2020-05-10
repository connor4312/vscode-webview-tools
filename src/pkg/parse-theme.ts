export const enum Theme {
  Light = 'vscode-light',
  Dark = 'vscode-dark',
  HighContrast = 'vscode-high-contrast',
}

/**
 * Gets the current general VS Code theme.
 */
export const getTheme = () => {
  if (document.body.classList.contains(Theme.Light)) {
    return Theme.Light;
  }

  if (document.body.classList.contains(Theme.HighContrast)) {
    return Theme.HighContrast;
  }

  return Theme.Dark;
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
export const observeTheme = (onChange: (theme: Theme) => void): (() => void) => {
  let prev = getTheme();
  onChange(prev);

  const observer = new MutationObserver(() => {
    const current = getTheme();
    if (current !== prev) {
      onChange(current);
      prev = current;
    }
  });

  observer.observe(document.documentElement, {
    attributeFilter: ['class'],
    childList: false,
    subtree: false,
  });

  return () => observer.disconnect();
};
