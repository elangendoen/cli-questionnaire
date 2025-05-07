export type QuestionType = 'multiple-choice' | 'open' | 'number';

export interface MultipleChoiceQuestion {
  id: string;
  type: 'multiple-choice';
  question: string;
  options: string[]; // Required for multiple-choice questions
  allowBackNavigation?: boolean;
  allowSkip?: boolean;
  condition?: (answers: Answer[]) => boolean;
}

export interface OpenOrNumberQuestion {
  id: string;
  type: 'open' | 'number';
  question: string;
  options?: undefined; // Explicitly undefined for non-multiple-choice questions
  allowBackNavigation?: boolean;
  allowSkip?: boolean;
  condition?: (answers: Answer[]) => boolean;
}

export type Question = MultipleChoiceQuestion | OpenOrNumberQuestion;

export type Answer = { id: string; answer: string | number | undefined };
