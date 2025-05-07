import * as readline from 'readline';
import { askQuestion } from '../helpers';

describe('askQuestion', () => {
  let mockRl: readline.Interface;

  beforeEach(() => {
    mockRl = {
      question: jest.fn(),
      close: jest.fn(),
    } as unknown as readline.Interface;
  });

  it('should resolve with the user input', async () => {
    const mockInput = 'Test input';
    (mockRl.question as jest.Mock).mockImplementation((query, callback) => {
      callback(mockInput);
    });

    const result = await askQuestion(mockRl, 'What is your name?');
    expect(result).toBe(mockInput);
    expect(mockRl.question).toHaveBeenCalledWith(
      'What is your name?',
      expect.any(Function)
    );
  });

  it('should handle multiple calls correctly', async () => {
    const mockInputs = ['First input', 'Second input'];
    let callIndex = 0;

    (mockRl.question as jest.Mock).mockImplementation((query, callback) => {
      callback(mockInputs[callIndex++]);
    });

    const firstResult = await askQuestion(mockRl, 'First question?');
    const secondResult = await askQuestion(mockRl, 'Second question?');

    expect(firstResult).toBe('First input');
    expect(secondResult).toBe('Second input');
    expect(mockRl.question).toHaveBeenCalledTimes(2);
    expect(mockRl.question).toHaveBeenCalledWith(
      'First question?',
      expect.any(Function)
    );
    expect(mockRl.question).toHaveBeenCalledWith(
      'Second question?',
      expect.any(Function)
    );
  });
});
