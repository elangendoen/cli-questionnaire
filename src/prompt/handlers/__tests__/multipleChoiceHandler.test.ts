import { handleMultipleChoice } from '../multipleChoiceHandler';
import { Question, Answer } from '../../../types';
import * as helpers from '../../helpers';
import * as readline from 'readline';

jest.mock('../../helpers', () => ({
  askQuestion: jest.fn(),
}));

describe('handleMultipleChoice', () => {
  const mockAskQuestion = helpers.askQuestion as jest.Mock;

  const question: Question = {
    id: 'q1',
    type: 'multiple-choice',
    question: 'What is your favorite programming language?',
    options: ['JavaScript', 'TypeScript', 'Python'],
  };

  let rl: readline.Interface;

  beforeEach(() => {
    mockAskQuestion.mockReset();
    rl = {
      question: jest.fn((query, callback) => callback('')),
      close: jest.fn(),
    } as unknown as readline.Interface; // Mock readline interface
  });

  afterEach(() => {
    rl.close(); // Ensure readline interface is closed after each test
  });
  const answers: Answer[] = [];

  it('should return the selected option', async () => {
    mockAskQuestion.mockResolvedValueOnce('2'); // User selects TypeScript
    const result = await handleMultipleChoice(
      question,
      answers,
      rl,
      false,
      false,
      0
    );
    expect(result).toBe('TypeScript');
  });

  it('should return "back" if user selects b and back navigation is allowed', async () => {
    mockAskQuestion.mockResolvedValueOnce('b');
    const result = await handleMultipleChoice(
      question,
      answers,
      rl,
      true,
      false,
      1
    );
    expect(result).toBe('back');
  });

  it('should return "skip" if user selects s and skipping is allowed', async () => {
    mockAskQuestion.mockResolvedValueOnce('s');
    const result = await handleMultipleChoice(
      question,
      answers,
      rl,
      false,
      true,
      0
    );
    expect(result).toBe('skip');
  });

  it('should prompt again if the user provides an invalid input', async () => {
    mockAskQuestion.mockResolvedValueOnce('invalid').mockResolvedValueOnce('1');
    const result = await handleMultipleChoice(
      question,
      answers,
      rl,
      false,
      false,
      0
    );
    expect(result).toBe('JavaScript');
  });
});
