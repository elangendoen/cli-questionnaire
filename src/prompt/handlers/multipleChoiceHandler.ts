import { Answer, MultipleChoiceQuestion } from '../../types';
import { askQuestion } from '../helpers';
import * as readline from 'readline';

export async function handleMultipleChoice(
  question: MultipleChoiceQuestion,
  answers: Answer[],
  rl: readline.Interface,
  allowBackNavigation: boolean,
  allowSkip: boolean,
  currentIndex: number
): Promise<string | number | 'back' | 'skip'> {
  console.log(`\n${question.question}`);
  question.options.forEach((option, index) => {
    console.log(`${index + 1}. ${option}`);
  });

  // Add "Go Back" and "Skip" options if applicable
  const extraOptions: string[] = [];
  if (allowBackNavigation && currentIndex > 0) {
    extraOptions.push('b. Go Back');
  }
  if (allowSkip) {
    extraOptions.push('s. Skip');
  }

  if (extraOptions.length > 0) {
    console.log('\nAdditional Options:');
    extraOptions.forEach((option) => {
      console.log(option);
    });
  }

  const choice = await askQuestion(rl, 'Choose an option (number or letter): ');
  const index = parseInt(choice, 10) - 1;

  if (allowBackNavigation && currentIndex > 0 && choice.toLowerCase() === 'b') {
    return 'back';
  }

  if (allowSkip && choice.toLowerCase() === 's') {
    return 'skip';
  }

  if (index >= 0 && index < question.options.length) {
    return question.options![index];
  }

  console.log('Invalid choice. Please try again.');
  return await handleMultipleChoice(
    question,
    answers,
    rl,
    allowBackNavigation,
    allowSkip,
    currentIndex
  );
}
