import { Errorable } from "../utils/errorable";

export interface Language {
  instructions(): ReadonlyArray<string>;
  templateFolder(): string;
  templateFiles(): ReadonlyArray<string>;
  offerToInstallTools(): Promise<string | undefined>;
  installTools(projectDir: string): Promise<Errorable<null>>;
  augment(answers: any): any;
}
