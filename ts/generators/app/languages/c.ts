import * as path from 'path';
import mkdirp = require('mkdirp');

import { Language } from './language';
import { Errorable } from '../utils/errorable';

export const clang: Language = {
  // TODO: better still help with setup, instead of just giving a bald message
  instructions(): ReadonlyArray<string> {
    return [
      "If you don't have the WASI SDK, please install it from",
      "https://github.com/WebAssembly/wasi-sdk#install.",
      '',
      'If you already have the WASI SDK, or after you have installed it,',
      'please update the Makefile to refer to the location of the WASI SDK.'
    ];
  },

  templateFolder(): string {
    return 'c';
  },

  templateFiles(): string[] {
    return [
      '.gitignore',
      'LICENSE',
      'Makefile',
      'README.md',
      '.vscode/extensions.json',
      '.vscode/launch.json',
      '.vscode/tasks.json',
      'src/main.c'
    ];
  },

  async installTools(projectDir: string): Promise<Errorable<null>> {
    const toolsDir = path.join(projectDir, '.tools');
    try {
      await mkdirp(toolsDir);
    } catch (e) {
      return { succeeded: false, error: [`${e}`] };
    }

    const tarPath = path.join(toolsDir, 'wasi-sdk.tar.gz');
    // Need to run:
    // wget https://github.com/WebAssembly/wasi-sdk/releases/download/wasi-sdk-${major}/wasi-sdk-${major}.${minor}-${os}.tar.gz -O ${tarPath}
    // tar xvf ${tarPath} -C ${toolsDir}
    // TODO: there are also Mac packages
    // TODO: handle Windows gracefully
  }
}
