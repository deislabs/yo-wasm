export interface Registry {
  prompts(answers: any): any[];
  instructions(answers: any): ReadonlyArray<string>;
  releaseTemplate(): string;
}
