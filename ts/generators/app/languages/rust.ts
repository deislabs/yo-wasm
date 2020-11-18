import { default as chalk } from 'chalk';

import { Errorable } from '../utils/errorable';
import { Language } from './language';

export const rust: Language = {
  instructions(): ReadonlyArray<string> {
    return [
      "You'll need the following to build and run this project locally:",
      "* Rust: https://www.rust-lang.org/tools/install",
      `* WASM target: ${chalk.yellow('rustup target add wasm32-wasi')}.`,
      `* wasmtime: ${chalk.yellow('curl https://wasmtime.dev/install.sh -sSf | bash')}`,
      '',
      `Build using VS Code ${chalk.yellow('Build WASM')} task or ${chalk.yellow('cargo build-wasm')}.`,
      `Run using VS Code ${chalk.yellow('Debug WASM')} task or ${chalk.yellow('wasmtime')} CLI.`,
    ];
  },

  templateFolder(): string {
    return 'rust';
  },

  templateFiles(): string[] {
    return [
      '.gitignore',
      'Cargo.toml',
      'LICENSE',
      'README.md',
      '.cargo/config.toml',
      '.vscode/extensions.json',
      '.vscode/launch.json',
      '.vscode/settings.json',
      '.vscode/tasks.json',
      'src/main.rs'
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
