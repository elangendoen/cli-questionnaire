import { handleOpen } from '../openHandler';
import { Question } from '../../../types';
import * as helpers from '../../helpers';
import * as readline from 'readline';

jest.mock('../../helpers', () => ({
  askQuestion: jest.fn(),
}));

describe('handleOpen', () => {
  const mockAskQuestion = helpers.askQuestion as jest.Mock;

  const question: Question = {
    id: 'q2',
    type: 'open',
    question: 'What is your name?',
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

  it('should return the user input', async () => {
    mockAskQuestion.mockResolvedValueOnce('John Doe');
    const result = await handleOpen(question, rl, false, false, 0);
    expect(result).toBe('John Doe');
  });

  it('should return "back" if user types b and back navigation is allowed', async () => {
    mockAskQuestion.mockResolvedValueOnce('b');
    const result = await handleOpen(question, rl, true, false, 1);
    expect(result).toBe('back');
  });

  it('should return "skip" if user types s and skipping is allowed', async () => {
    mockAskQuestion.mockResolvedValueOnce('s');
    const result = await handleOpen(question, rl, false, true, 0);
    expect(result).toBe('skip');
  });

  it('should return "skip" if user types s and skipping and back is allowed', async () => {
    mockAskQuestion.mockResolvedValueOnce('s');
    const result = await handleOpen(question, rl, true, true, 1);
    expect(result).toBe('skip');
  });
});
