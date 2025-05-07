import { Question } from '../../types';
import { askQuestion } from '../helpers';
import * as readline from 'readline';

export async function handleNumber(
  question: Question,
  rl: readline.Interface,
  allowBackNavigation: boolean,
  allowSkip: boolean,
  currentIndex: number
): Promise<number | 'back' | 'skip'> {
  let extraOptions = '';
  if (allowBackNavigation && currentIndex > 0) {
    extraOptions += ' (b: Go Back';
  }
  if (allowSkip) {
    extraOptions += `${extraOptions ? ', ' : ' ('}s: Skip`;
  }
  extraOptions += extraOptions ? ')' : '';

  const response = await askQuestion(
    rl,
    `${question.question}${extraOptions}: `
  );

  if (
    allowBackNavigation &&
    currentIndex > 0 &&
    response.toLowerCase() === 'b'
  ) {
    return 'back';
  }

  if (allowSkip && response.toLowerCase() === 's') {
    return 'skip';
  }

  const numberResponse = parseFloat(response);
  if (!isNaN(numberResponse)) {
    return numberResponse;
  }

  console.log('Invalid number. Please try again.');
  return await handleNumber(
    question,
    rl,
    allowBackNavigation,
    allowSkip,
    currentIndex
  );
}
