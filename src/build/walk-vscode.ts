import { promises as fs } from 'fs';
import * as ts from 'typescript';
import { resolve, join } from 'path';

const readJson = async (filePath: string) => {
  const contents = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(contents);
};

const validatePath = async (vscodePath: string) => {
  let name: string;
  try {
    name = (await readJson(join(vscodePath, 'package.json'))).name;
  } catch (e) {
    throw new Error(`Invalid --vscode path provided (${e.message})`);
  }

  if (!name.includes('code')) {
    throw new Error(`Invalid --vscode path provided (package.json was ${name}, not "vscode")`);
  }
};

/**
 * Enumerates all context keys for the vscode installation in the given path.
 */
export const walkVscode = async (vscodePath: string, traverse: (file: ts.SourceFile) => void) => {
  vscodePath = vscodePath || '../vscode';
  await validatePath(vscodePath);

  const basePath = resolve(vscodePath, 'src', 'vs');
  const configPath = ts.findConfigFile(basePath, ts.sys.fileExists, 'tsconfig.json');

  if (!configPath) {
    throw new Error(`Could not find expected tsconfig.json file`);
  }

  const compiler = ts.createCompilerHost(await readJson(configPath), true);
  const queue: string[] = [basePath];
  while (queue.length) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const entry = queue.shift()!;
    if ((await fs.stat(entry)).isDirectory()) {
      const children = await fs.readdir(entry);
      queue.push(...children.map((c) => join(entry, c)));
    } else if (entry.endsWith('.ts')) {
      const file = compiler.getSourceFile(entry, ts.ScriptTarget.ES2020);
      if (file) {
        traverse(file);
      }
    }
  }
};
