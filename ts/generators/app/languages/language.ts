import { Formatter } from "../formatter";
import { Errorable } from "../utils/errorable";

export interface Language {
  instructions(formatter: Formatter): ReadonlyArray<string>;
  templateFolder(): string;
  templateFiles(): ReadonlyArray<string>;
  offerToInstallTools(): Promise<string | undefined>;
  installTools(projectDir: string): Promise<Errorable<null>>;
  augment(answers: any): any;
}
