import { default as chalk } from 'chalk';

import { Errorable } from '../utils/errorable';
import { Language } from './language';

// TODO:
// - Find more good Swift VSCode extensions
// - Validate that most Swift devs use `src/` for their source.
// - Are there other files that should be .gitignored?
// - Better GH Workflow

export const swift: Language = {
    instructions(): ReadonlyArray<string> {
        return [
            "You'll need the following to build and run this project locally:",
            `* Install the SwiftWasm compiler https://book.swiftwasm.org/getting-started/setup.html`,
            `* On macOS, you will need XCode. On Linux, the dependencies are documented at the link above.`,
            `* wasmtime: ${chalk.yellow('curl https://wasmtime.dev/install.sh -sSf | bash')}`,
            '',
            `Build using VS Code ${chalk.yellow('Build WASM')} task or ${chalk.yellow('make build')}.`,
            `Run using VS Code ${chalk.yellow('Debug WASM')} task or ${chalk.yellow('wasmtime')} CLI.`,
        ];
    },

    templateFolder(): string {
        return 'swift';
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
            'src/main.swift'
        ];
    },

    async offerToInstallTools(): Promise<string | undefined> {
        return undefined;
    },

    async installTools(_projectDir: string): Promise<Errorable<null>> {
        return { succeeded: true, result: null };
    },

    augment(answers: any): any {
        // The Swift-Wasm documentation only references a fixed path for this.
        // There probably should be a better way of doing this. On Linux, this is simply ignored.
        const wasiSdkPath = "/Library/Developer/Toolchains/swift-latest.xctoolchain/usr/bin"

        return Object.assign({}, answers, { wasiSdkPath });
    }
}
