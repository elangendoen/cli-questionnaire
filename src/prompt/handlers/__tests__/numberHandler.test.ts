import { handleNumber } from '../numberHandler';
import { Question } from '../../../types';
import * as helpers from '../../helpers';
import * as readline from 'readline';

jest.mock('../../helpers', () => ({
  askQuestion: jest.fn(),
}));

describe('handleNumber', () => {
  const mockAskQuestion = helpers.askQuestion as jest.Mock;

  const question: Question = {
    id: 'q3',
    type: 'number',
    question: 'How old are you?',
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

  it('should return the parsed number', async () => {
    mockAskQuestion.mockResolvedValueOnce('25');
    const result = await handleNumber(question, rl, false, false, 0);
    expect(result).toBe(25);
  });

  it('should return "back" if user types b and back navigation is allowed', async () => {
    mockAskQuestion.mockResolvedValueOnce('b');
    const result = await handleNumber(question, rl, true, false, 1);
    expect(result).toBe('back');
  });

  it('should return "skip" if user types s and skipping is allowed', async () => {
    mockAskQuestion.mockResolvedValueOnce('s');
    const result = await handleNumber(question, rl, false, true, 0);
    expect(result).toBe('skip');
  });

  it('should prompt again if the user provides an invalid number', async () => {
    mockAskQuestion
      .mockResolvedValueOnce('invalid')
      .mockResolvedValueOnce('30');
    const result = await handleNumber(question, rl, false, false, 0);
    expect(result).toBe(30);
  });

  it('should handle invalid numeric input and prompt again', async () => {
    // Simulate invalid numeric input followed by valid numeric input
    mockAskQuestion
      .mockResolvedValueOnce('invalid')
      .mockResolvedValueOnce('42');
    const result = await handleNumber(question, rl, false, false, 0);
    expect(result).toBe(42); // Valid input after retry
    expect(mockAskQuestion).toHaveBeenCalledTimes(2); // Prompted twice
  });

  it('should handle invalid input when back and skip are allowed', async () => {
    // Simulate invalid input followed by "skip"
    mockAskQuestion.mockResolvedValueOnce('invalid').mockResolvedValueOnce('s');
    const result = await handleNumber(question, rl, true, true, 1);
    expect(result).toBe('skip'); // Skip after retry
    expect(mockAskQuestion).toHaveBeenCalledTimes(2); // Prompted twice
  });
});
