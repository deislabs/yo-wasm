import { default as chalk } from 'chalk';

import { Errorable } from '../utils/errorable';
import { Language } from './language';

export const tinygo: Language = {
  instructions(): ReadonlyArray<string> {
    return [
      "You'll need the following to build and run this project locally:",
      "* TinyGo: https://tinygo.org/getting-started/install/",
      `* Go (v1.14+): https://golang.org/doc/install`,
      `* wasmtime: ${chalk.yellow('curl https://wasmtime.dev/install.sh -sSf | bash')}`,
      '',
      "Next steps:",
      `* Initialize your Go project using the VS Code ${chalk.yellow('TinyGo: Init')} task or via the Makefile ${chalk.yellow('make init')} target.`,
      `* Test using the VS Code ${chalk.yellow('TinyGo: Test')} task or via the Makefile ${chalk.yellow('make test')} target.`,
      `* Build using the VS Code ${chalk.yellow('TinyGo: Build WASM')} task or via the Makefile ${chalk.yellow('make build')} target.`,
      `* Run using the VS Code ${chalk.yellow('TinyGo: Debug WASM')} task or via the Makefile ${chalk.yellow('make run')} target.`,
    ];
  },

  templateFolder(): string {
    return 'tinygo';
  },

  templateFiles(): string[] {
    return [
      '.gitignore.removeext',
      'Makefile',
      'LICENSE',
      'README.md',
      '.vscode/extensions.json',
      '.vscode/launch.json',
      '.vscode/tasks.json',
      'src/main.go',
      'src/main_test.go'
    ];
  },

  async offerToInstallTools(): Promise<string | undefined> {
    return undefined;
  },

  async installTools(_projectDir: string): Promise<Errorable<null>> {
    return { succeeded: true, result: null };
  },

  augment(answers: any): any {
    return answers;
  }
}
