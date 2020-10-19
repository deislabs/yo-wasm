export interface Language {
  templateFolder(): string;
  templateFiles(): ReadonlyArray<string>;
}
