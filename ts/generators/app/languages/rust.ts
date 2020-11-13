import { default as chalk } from 'chalk';

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
  }
}
