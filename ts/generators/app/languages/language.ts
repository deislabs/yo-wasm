export interface Language {
  instructions(): ReadonlyArray<string>;
  templateFolder(): string;
  templateFiles(): ReadonlyArray<string>;
}
