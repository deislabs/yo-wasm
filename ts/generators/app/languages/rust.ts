import { default as chalk } from 'chalk';

import { Errorable } from '../utils/errorable';
import { Language } from './language';

export const rust: Language = {
  instructions(): ReadonlyArray<string> {
    return [
      "If you don't have Rust installed, install it using `rustup` from",
      "https://www.rust-lang.org/tools/install.",
      '',
      'You will also need the wasm32-wasi target. You can install this using',
      `${chalk.yellow('rustup target add wasm32-wasi')}.`
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
