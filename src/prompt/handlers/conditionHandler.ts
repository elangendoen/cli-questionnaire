import { Question, Answer } from '../../types';

export function handleCondition(
  question: Question,
  answers: Answer[]
): boolean {
  return question.condition ? question.condition(answers) : true;
}
