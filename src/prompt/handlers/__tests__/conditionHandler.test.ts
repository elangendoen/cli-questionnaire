import { handleCondition } from '../conditionHandler';
import { Question, Answer } from '../../../types';

describe('handleCondition', () => {
  it('should return true if no condition is provided', () => {
    const question: Question = {
      id: 'q1',
      type: 'open',
      question: 'What is your name?',
    };
    const answers: Answer[] = [];
    expect(handleCondition(question, answers)).toBe(true);
  });

  it('should return true if the condition evaluates to true', () => {
    const question: Question = {
      id: 'q2',
      type: 'number',
      question: 'How old are you?',
      condition: (answers) =>
        answers.some((a) => a.id === 'q1' && a.answer === 'yes'),
    };
    const answers: Answer[] = [{ id: 'q1', answer: 'yes' }];
    expect(handleCondition(question, answers)).toBe(true);
  });

  it('should return false if the condition evaluates to false', () => {
    const question: Question = {
      id: 'q3',
      type: 'number',
      question: 'How many years of experience do you have?',
      condition: (answers) =>
        answers.some((a) => a.id === 'q1' && a.answer === 'no'),
    };
    const answers: Answer[] = [{ id: 'q1', answer: 'yes' }];
    expect(handleCondition(question, answers)).toBe(false);
  });
});
