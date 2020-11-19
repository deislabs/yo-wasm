import * as path from 'path';
import mkdirp = require('mkdirp');

import { Language } from './language';
import { Errorable, failed } from '../utils/errorable';
import { Platform, shell } from '../utils/shell';

const WASI_SDK_MAJOR = 11;
const WASI_SDK_MINOR = 0;
const TOOLS_PATH = '.tools';

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
      '.gitignore.removeext',
      'LICENSE',
      'Makefile',
      'README.md',
      '.vscode/extensions.json',
      '.vscode/launch.json',
      '.vscode/tasks.json',
      'src/main.c'
    ];
  },

  async offerToInstallTools(): Promise<string | undefined> {
    const platform = shell.platform();
    if (platform === Platform.Linux || platform === Platform.MacOS) {
      return "WASI SDK";
    }
    return undefined;
  },

  async installTools(projectDir: string): Promise<Errorable<null>> {
    const toolsDir = path.join(projectDir, TOOLS_PATH);
    try {
      await mkdirp(toolsDir);
    } catch (e) {
      return { succeeded: false, error: [`${e}`] };
    }

    const platform = shell.platform();
    if (platform !== Platform.Linux && platform !== Platform.MacOS) {
      return { succeeded: false, error: ['WASI SDK is not available for your operating system'] };
    }

    // Need to run:
    // wget https://github.com/WebAssembly/wasi-sdk/releases/download/wasi-sdk-${major}/wasi-sdk-${major}.${minor}-${os}.tar.gz -O ${tarPath}
    // tar xvf ${tarPath} -C ${toolsDir}
    const os = platform === Platform.Linux ? 'linux' : 'macos';
    const tarPath = path.join(toolsDir, 'wasi-sdk.tar.gz');
    const wgetsr = await shell.exec(`wget https://github.com/WebAssembly/wasi-sdk/releases/download/wasi-sdk-${WASI_SDK_MAJOR}/wasi-sdk-${WASI_SDK_MAJOR}.${WASI_SDK_MINOR}-${os}.tar.gz -O ${tarPath}`);

    if (failed(wgetsr)) {
      return wgetsr;
    } else if (wgetsr.result.code !== 0) {
      return { succeeded: false, error: [`Error downloading WASI SDK: ${wgetsr.result.stderr}`] };
    }

    const tarsr = await shell.exec(`tar xvf ${tarPath} -C ${toolsDir}`);

    if (failed(tarsr)) {
      return tarsr;
    } else if (tarsr.result.code !== 0) {
      return { succeeded: false, error: [`Error downloading WASI SDK: ${wgetsr.result.stderr}`] };
    }

    return { succeeded: true, result: null };
  },

  augment(answers: any): any {
    const wasiSdkPath = answers.installTools ?
      path.join('.', TOOLS_PATH, `wasi-sdk-${WASI_SDK_MAJOR}.${WASI_SDK_MINOR}`) :
      '~/wasi-sdk/wasi-sdk-11.0';
    return Object.assign({}, answers, { wasiSdkPath });
  }
}
