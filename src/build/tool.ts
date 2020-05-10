import * as prettier from 'prettier';
import { resolve } from 'path';

export const packageDir = resolve(__dirname, '..', '..');

// eslint-disable-next-line
const { prettier: settings } = require(`${packageDir}/package.json`);

export const formatCode = (code: string) =>
  prettier.format(code, { ...settings, parser: 'typescript' });
