import { default as chalk } from 'chalk';

export interface Formatter {
  ev(text: string): string;
  instr(text: string): string;
  cmd(text: string): string;
  emph(text: string): string;
}

class MarkdownFormatter implements Formatter {
  ev(text: string): string {
    return `**${text}**`;
  }
  instr(text: string): string {
    return `**${text}**`;
  }
  cmd(text: string): string {
    return '`' + text + '`';
  }
  emph(text: string): string {
    return `**${text}**`;
  }
}

class ChalkFormatter implements Formatter {
  ev(text: string): string {
    return chalk.cyan(text);
  }
  instr(text: string): string {
    return chalk.yellow(text);
  }
  cmd(text: string): string {
    return chalk.yellow(text);
  }
  emph(text: string): string {
    return chalk.yellow(text);
  }
}

export const FMT_MARKDOWN: Formatter = new MarkdownFormatter();
export const FMT_CHALK: Formatter = new ChalkFormatter();
