import { Formatter } from '../formatter';
import { Errorable } from '../utils/errorable';
import { Language } from './language';

export const csharp: Language = {
  instructions(fmt: Formatter): ReadonlyArray<string> {
    return [
      "You'll need the following to build and run this project locally:",
      "* .NET 7 - Preview 4 or newer: `https://dotnet.microsoft.com/en-us/download/dotnet/7.0`",
      `* wasmtime: ${fmt.cmd('curl https://wasmtime.dev/install.sh -sSf | bash')}`,
      '',
      `Build using VS Code ${fmt.instr('build')} task or ${fmt.cmd('dotnet build')}.`,
      `Run using VS Code ${fmt.instr('run')} task or ${fmt.cmd('dotnet run')}.`,
    ];
  },

  templateFolder(): string {
    return 'csharp';
  },

  templateFiles(): string[] {
    return [
      '.gitignore.removeext',
      'HIPPOFACTS',
      'LICENSE',
      'README.md',
      '.devcontainer/library-scripts/common-debian.sh',
      '.devcontainer/library-scripts/meta.env',
      '.devcontainer/library-scripts/node-debian.sh',
      '.devcontainer/library-scripts/wasmtime.sh',
      '.devcontainer/devcontainer.json',
      '.devcontainer/Dockerfile',
      '.vscode/extensions.json',
      '.vscode/launch.json',
      '.vscode/settings.json',
      '.vscode/tasks.json',
      'Program.cs',
      'csharp-wasm.csproj'
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


