import Generator = require('yeoman-generator');

export interface Moarable {
  readonly name: string;
  readonly moar?: {
    readonly askIf: (answer: any) => boolean;
    readonly moarQuestions: (Generator.Question<any> & Moarable)[];
  }
}

export async function ask(questions: (Generator.Question<any> & Moarable)[], askfn: (prompts: Generator.Questions<any>) => Promise<any>): Promise<any> {
  const answers: any = {};
  for (const question of questions) {
    const keyedAnswer = await askfn(question);
    Object.assign(answers, keyedAnswer);
    const answer = keyedAnswer[question.name];
    if (question.moar && question.moar.askIf(answer)) {
      const moarAnswers = await ask(question.moar.moarQuestions, askfn);
      Object.assign(answers, moarAnswers);
    }
  }
  return answers;
}
