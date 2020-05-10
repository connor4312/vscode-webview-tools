# vscode-webview-tools

[![](https://badgen.net/bundlephobia/minzip/vscode-webview-tools)](https://bundlephobia.com/result?p=vscode-webview-tools) ![Run Tests](https://github.com/connor4312/vscode-webview-tools/workflows/Run%20Tests/badge.svg) ![](https://img.shields.io/badge/dependencies-none-green)

Miscellaneous tools for building things in VS Code webviews.

```
npm install --save vscode-webview-tools
```

## Table of Contents

- [API](#api)
  - [`Colors`](#colors)
    - [`parseColors(): { [key in Color]: string }`](#parsecolors--key-in-color-string-)
    - [`observeColors(callback: (colors: { [key in Color]: string }) => void): () => void`](#observecolorscallback-colors--key-in-color-string---void---void)
  - [`Theme`](#theme)
    - [`getTheme(): Theme`](#gettheme-theme)
    - [`observeTheme(callback: (theme: Theme) => void): () => void`](#observethemecallback-theme-theme--void---void)

## API

### `Colors`

An enumeration of theme variables (colors, mostly) exposed by VS Code.

```ts
export const enum Colors {
  TabActiveBackground = 'tab-activeBackground',
  StatusBarBorder = 'statusBar-border',
  // 400 more, or so...
```

#### `parseColors(): { [key in Color]: string }`

Gets the map of colors variables to what they're set to in the webview. For example, you can make a custom input validation box-appearing thing:

```tsx
import { parseColors } from 'vscode-webview-tools';

const colors = parseColors();

const MyErrorMessage = () => (
  <div
    style={{
      background: colors[Color.InputValidationErrorBackground],
      border: `1px solid ${colors[Color.InputValidationErrorBorder]}`,
      color: colors[Color.InputValidationErrorForeground],
    }}
  >
    Your input is invalid!
  </div>
);
```

#### `observeColors(callback: (colors: { [key in Color]: string }) => void): () => void`

Watches for changes to the colors and fires a callback when initially invoked and whenever the colors change. It returns a function that can be used to stop listening for color changes.

```tsx
const stopListening = observeColors((colors) => {
  console.log('The editor text color is now', colors[Color.EditorForeground]);
});

setTimeout(stopListening, 5000);
```

You can easily wrap this into a React/Preact hook, for example:

```tsx
import { Color, useColors } from 'vscode-webview-tools';
import { useState, useEffect } from 'preact/hooks';

const useColors = () => {
  const [colors, setColors] = useState<{ [key: string]: string }>({});
  useEffect(() => observeColors(setColors), []);
  return colors;
};

const SomeText = () => {
  const colors = useColors();
  return (
    <span style={{ color: colors[Color.EditorForeground] }}>
      This will always appear the same color as what's in the editor
    </span>
  );
};
```

### `Theme`

The general VS Code theme type, exported as an enum.

```ts
export const enum Theme {
  Light = 'vscode-light',
  Dark = 'vscode-dark',
  HighContrast = 'vscode-high-contrast',
}
```

#### `getTheme(): Theme`

Gets the current theme.

```ts
import { getTheme, Theme } from 'vscode-webview-tools';

const SomeText = () => (
  <span style={{ color: getTheme() === Theme.Light ? 'white' : 'black' }}>Hi!</span>
);
```

#### `observeTheme(callback: (theme: Theme) => void): () => void`

Functions identically to `observeColors`, but for the theme. Can be wrapped in a hook the same way:

```tsx
import { Theme, useTheme } from 'vscode-webview-tools';
import { useState, useEffect } from 'preact/hooks';

const useTheme = () => {
  const [theme, setTheme] = useState<{ [key: string]: string }>({});
  useEffect(() => observeTheme(setTheme), []);
  return theme;
};

const SomeText = () => {
  const theme = useTheme();
  return <span style={{ color: getTheme() === Theme.Light ? 'white' : 'black' }}>Hi!</span>;
};
```
