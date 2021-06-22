import { Formatter } from '../formatter';
import { Errorable, failed } from '../utils/errorable';
import { shell } from '../utils/shell';
import { Language } from './language';

export const rust: Language = {
  instructions(fmt: Formatter): ReadonlyArray<string> {
    return [
      "You'll need the following to build and run this project locally:",
      "* Rust: https://www.rust-lang.org/tools/install",
      `* WASM target: ${fmt.cmd('rustup target add wasm32-wasi')}.`,
      `* wasmtime: ${fmt.cmd('curl https://wasmtime.dev/install.sh -sSf | bash')}`,
      '',
      `Build using VS Code ${fmt.instr('Build WASM')} task or ${fmt.cmd('cargo build-wasm')}.`,
      `Run using VS Code ${fmt.instr('Debug WASM')} task or ${fmt.cmd('wasmtime')} CLI.`,
    ];
  },

  templateFolder(): string {
    return 'rust';
  },

  templateFiles(): string[] {
    return [
      '.gitignore.removeext',
      'Cargo.toml',
      'HIPPOFACTS',
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
    if (await isRustWASIInstalled()) {
      return undefined;
    }
    return "Rust WASI target";
  },

  async installTools(_projectDir: string): Promise<Errorable<null>> {
    const sr = await shell.exec('rustup target add wasm32-wasi');
    if (failed(sr)) {
      return sr;
    } else if (sr.result.code !== 0) {
      return { succeeded: false, error: [`Error installing WASI target: ${sr.result.stderr}`] };
    }
    return { succeeded: true, result: null };
  },

  augment(answers: any): any {
    return answers;
  }
}

async function isRustWASIInstalled(): Promise<boolean> {
  const sr = await shell.exec('rustup target list --installed');
  if (failed(sr) || sr.result.code !== 0) {
    return false;
  }
  return sr.result.stdout.includes('wasm32-wasi');
}
