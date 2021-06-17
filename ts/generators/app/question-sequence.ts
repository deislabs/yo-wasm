import Generator = require('yeoman-generator');

export interface Moarable {
  readonly name: string;
  readonly moar?: {
    readonly askIf: (answer: any) => boolean;
    readonly moarQuestions: (answers: any) => (Generator.Question<any> & Moarable)[];
  }
}

export async function ask(questions: (Generator.Question<any> & Moarable)[], askfn: (prompts: Generator.Questions<any>) => Promise<any>, answersAccumulator?: any): Promise<any> {
  const answers = answersAccumulator || {};
  for (const question of questions) {
    const keyedAnswer = await askfn(question);
    Object.assign(answers, keyedAnswer);
    const answer = keyedAnswer[question.name];
    if (question.moar && question.moar.askIf(answer)) {
      const moarAnswers = await ask(question.moar.moarQuestions(answers), askfn, answers);
      Object.assign(answers, moarAnswers);
    }
  }
  return answers;
}
