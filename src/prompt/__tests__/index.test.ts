import { Prompt } from '../index';
import * as readline from 'readline';
import { Question, QuestionType } from '../../types';
import * as multipleChoiceHandler from '../handlers/multipleChoiceHandler';
import * as openHandler from '../handlers/openHandler';
import * as numberHandler from '../handlers/numberHandler';
import * as conditionHandler from '../handlers/conditionHandler';

jest.mock('readline', () => ({
  createInterface: jest.fn(),
}));

jest.mock('../handlers/multipleChoiceHandler');
jest.mock('../handlers/openHandler');
jest.mock('../handlers/numberHandler');
jest.mock('../handlers/conditionHandler');

describe('Prompt', () => {
  const mockCreateInterface = readline.createInterface as jest.Mock;
  const mockHandleMultipleChoice =
    multipleChoiceHandler.handleMultipleChoice as jest.Mock;
  const mockHandleOpen = openHandler.handleOpen as jest.Mock;
  const mockHandleNumber = numberHandler.handleNumber as jest.Mock;
  const mockHandleCondition = conditionHandler.handleCondition as jest.Mock;

  let mockRl: readline.Interface;

  beforeEach(() => {
    mockRl = {
      question: jest.fn(),
      close: jest.fn(),
    } as unknown as readline.Interface;

    mockCreateInterface.mockReturnValue(mockRl); // Mock readline interface
    mockHandleMultipleChoice.mockReset();
    mockHandleOpen.mockReset();
    mockHandleNumber.mockReset();
    mockHandleCondition.mockReset();
  });

  afterEach(() => {
    mockRl.close(); // Ensure readline interface is closed after each test
  });

  it('should handle a multiple-choice question', async () => {
    const questions: Question[] = [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What is your favorite programming language?',
        options: ['JavaScript', 'TypeScript', 'Python'],
      },
    ];

    mockHandleCondition.mockReturnValue(true);
    mockHandleMultipleChoice.mockResolvedValue('TypeScript');

    const answers = await Prompt({ questions });

    expect(mockHandleCondition).toHaveBeenCalledWith(questions[0], []);
    expect(mockHandleMultipleChoice).toHaveBeenCalledWith(
      questions[0],
      [],
      mockRl, // readline.Interface
      false,
      false,
      0
    );
    expect(answers).toEqual([{ id: 'q1', answer: 'TypeScript' }]);
  });

  it('should handle an open question', async () => {
    const questions: Question[] = [
      {
        id: 'q2',
        type: 'open',
        question: 'What is your name?',
      },
    ];

    mockHandleCondition.mockReturnValue(true);
    mockHandleOpen.mockResolvedValue('John Doe');

    const answers = await Prompt({ questions });

    expect(mockHandleCondition).toHaveBeenCalledWith(questions[0], []);
    expect(mockHandleOpen).toHaveBeenCalledWith(
      questions[0],
      mockRl, // readline.Interface
      false,
      false,
      0
    );
    expect(answers).toEqual([{ id: 'q2', answer: 'John Doe' }]);
  });

  it('should handle a number question', async () => {
    const questions: Question[] = [
      {
        id: 'q3',
        type: 'number',
        question: 'How old are you?',
      },
    ];

    mockHandleCondition.mockReturnValue(true);
    mockHandleNumber.mockResolvedValue(25);

    const answers = await Prompt({ questions });

    expect(mockHandleCondition).toHaveBeenCalledWith(questions[0], []);
    expect(mockHandleNumber).toHaveBeenCalledWith(
      questions[0],
      expect.any(Object), // readline.Interface
      false,
      false,
      0
    );
    expect(answers).toEqual([{ id: 'q3', answer: 25 }]);
  });

  it('should skip a question if the condition is false', async () => {
    const questions: Question[] = [
      {
        id: 'q4',
        type: 'open',
        question: 'What is your favorite color?',
        condition: jest.fn(),
      },
    ];

    mockHandleCondition.mockReturnValue(false);

    const answers = await Prompt({ questions });

    expect(mockHandleCondition).toHaveBeenCalledWith(questions[0], []);
    expect(answers).toEqual([{ id: 'q4', answer: undefined }]);
  });

  it('should handle back navigation from the second question', async () => {
    const questions: Question[] = [
      {
        id: 'q5',
        type: 'open',
        question: 'What is your name?',
      },
      {
        id: 'q6',
        type: 'number',
        question: 'How old are you?',
      },
    ];

    mockHandleCondition.mockReturnValue(true);
    mockHandleOpen.mockResolvedValueOnce('John Doe'); // Answer for the first question
    mockHandleNumber.mockResolvedValueOnce('back'); // User navigates back from the second question
    mockHandleOpen.mockResolvedValueOnce('Jane Doe'); // User updates the answer for the first question
    mockHandleNumber.mockResolvedValueOnce(30); // User answers the second question

    const answers = await Prompt({ questions, allowBackNavigation: true });

    expect(mockHandleCondition).toHaveBeenCalledWith(questions[0], []);
    expect(mockHandleCondition).toHaveBeenCalledWith(questions[1], [
      { id: 'q5', answer: 'John Doe' },
    ]);

    expect(mockHandleOpen).toHaveBeenCalledWith(
      questions[0],
      mockRl, // readline.Interface
      true,
      false,
      0
    );
    expect(mockHandleNumber).toHaveBeenCalledWith(
      questions[1],
      mockRl, // readline.Interface
      true,
      false,
      1
    );

    expect(answers).toEqual([
      { id: 'q5', answer: 'Jane Doe' },
      { id: 'q6', answer: 30 },
    ]);
  });

  it('should handle back navigation from the second question if question property allowBackNavigation is set', async () => {
    const questions: Question[] = [
      {
        id: 'q5',
        type: 'open',
        question: 'What is your name?',
      },
      {
        id: 'q6',
        type: 'number',
        question: 'How old are you?',
        allowBackNavigation: true, // Allow back navigation for this question
      },
    ];

    mockHandleCondition.mockReturnValue(true);
    mockHandleOpen.mockResolvedValueOnce('John Doe'); // Answer for the first question
    mockHandleNumber.mockResolvedValueOnce('back'); // User navigates back from the second question
    mockHandleOpen.mockResolvedValueOnce('Jane Doe'); // User updates the answer for the first question
    mockHandleNumber.mockResolvedValueOnce(30); // User answers the second question

    const answers = await Prompt({ questions });

    expect(mockHandleCondition).toHaveBeenCalledWith(questions[0], []);
    expect(mockHandleCondition).toHaveBeenCalledWith(questions[1], [
      { id: 'q5', answer: 'John Doe' },
    ]);

    expect(mockHandleOpen).toHaveBeenCalledWith(
      questions[0],
      mockRl, // readline.Interface
      false,
      false,
      0
    );
    expect(mockHandleNumber).toHaveBeenCalledWith(
      questions[1],
      mockRl, // readline.Interface
      true,
      false,
      1
    );

    expect(answers).toEqual([
      { id: 'q5', answer: 'Jane Doe' },
      { id: 'q6', answer: 30 },
    ]);
  });

  it('should handle skipping a question', async () => {
    const questions: Question[] = [
      {
        id: 'q7',
        type: 'open',
        question: 'What is your favorite hobby?',
      },
    ];

    mockHandleCondition.mockReturnValue(true);
    mockHandleOpen.mockResolvedValue('skip');

    const answers = await Prompt({ questions, allowSkip: true });

    expect(mockHandleOpen).toHaveBeenCalledWith(
      questions[0],
      mockRl, // readline.Interface
      false,
      true,
      0
    );
    expect(answers).toEqual([{ id: 'q7', answer: undefined }]);
  });

  it('should handle skipping a question if allowSkip property is set on question', async () => {
    const questions: Question[] = [
      {
        id: 'q7',
        type: 'open',
        question: 'What is your favorite hobby?',
        allowSkip: true, // Allow skipping for this question
      },
    ];

    mockHandleCondition.mockReturnValue(true);
    mockHandleOpen.mockResolvedValue('skip');

    const answers = await Prompt({ questions });

    expect(mockHandleOpen).toHaveBeenCalledWith(
      questions[0],
      mockRl, // readline.Interface
      false,
      true,
      0
    );
    expect(answers).toEqual([{ id: 'q7', answer: undefined }]);
  });

  it('should handle an unknown question type gracefully', async () => {
    const questions: Question[] = [
      {
        id: 'q8',
        type: 'unknown-type' as unknown as QuestionType, // Explicitly define as a string literal type
        question: 'This is an unknown question type.',
      } as Question,
    ];

    mockHandleCondition.mockReturnValue(true);

    const answers = await Prompt({ questions });

    expect(mockHandleCondition).toHaveBeenCalledWith(questions[0], []);
    expect(answers).toEqual([{ id: 'q8', answer: undefined }]); // Answer should be undefined for unknown types
  });

  it('should not allow back navigation from the first question', async () => {
    const questions: Question[] = [
      {
        id: 'q1',
        type: 'open',
        question: 'What is your name?',
      },
    ];

    mockHandleCondition.mockReturnValue(true);
    mockHandleOpen.mockResolvedValueOnce('back'); // User attempts to go back from the first question

    const answers = await Prompt({ questions, allowBackNavigation: true }); // Enable back navigation globally

    expect(mockHandleCondition).toHaveBeenCalledWith(questions[0], []);
    expect(mockHandleOpen).toHaveBeenCalledWith(
      questions[0],
      mockRl, // readline.Interface
      true,
      false,
      0
    );
    expect(answers).toEqual([{ id: 'q1', answer: undefined }]); // No answer since the user attempted to go back
  });
});
