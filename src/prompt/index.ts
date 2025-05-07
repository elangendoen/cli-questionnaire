import * as readline from 'readline';
import { Question, Answer } from '../types';
import { handleMultipleChoice } from './handlers/multipleChoiceHandler';
import { handleOpen } from './handlers/openHandler';
import { handleNumber } from './handlers/numberHandler';
import { handleCondition } from './handlers/conditionHandler';

interface PromptParams {
  questions: Question[];
  allowBackNavigation?: boolean;
  allowSkip?: boolean;
}

export async function Prompt({
  questions,
  allowBackNavigation = false,
  allowSkip = false,
}: PromptParams): Promise<Answer[]> {
  const answers: Answer[] = [];
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let currentIndex = 0;

  try {
    while (currentIndex < questions.length) {
      const question = questions[currentIndex];

      // Check the condition function, if it exists
      if (!handleCondition(question, [...answers])) {
        // Skip the question if the condition returns false
        answers.push({ id: question.id, answer: undefined });
        currentIndex++;
        continue;
      }

      const backNavigationAllowed =
        question.allowBackNavigation ?? allowBackNavigation;
      const skipAllowed = question.allowSkip ?? allowSkip;

      let userAnswer: string | number | undefined = undefined;

      // Delegate to the appropriate handler based on question type
      switch (question.type) {
        case 'multiple-choice':
          userAnswer = await handleMultipleChoice(
            question,
            [...answers], // Pass a copy of the current answers
            rl,
            backNavigationAllowed,
            skipAllowed,
            currentIndex
          );
          break;
        case 'open':
          userAnswer = await handleOpen(
            question,
            rl,
            backNavigationAllowed,
            skipAllowed,
            currentIndex
          );
          break;
        case 'number':
          userAnswer = await handleNumber(
            question,
            rl,
            backNavigationAllowed,
            skipAllowed,
            currentIndex
          );
          break;
        default:
          console.log('Unknown question type. Skipping question.');
          userAnswer = undefined;
      }

      // Handle navigation
      if (userAnswer === 'back') {
        if (currentIndex > 0) {
          currentIndex--;
          answers.pop(); // Remove the last answer
        } else {
          console.log('You are already at the first question. Cannot go back.');
        }
        continue;
      } else if (userAnswer === 'skip') {
        answers.push({ id: question.id, answer: undefined });
      } else {
        answers.push({ id: question.id, answer: userAnswer });
      }

      currentIndex++;
    }
  } finally {
    // Ensure the readline interface is always closed
    rl.close();
  }

  return answers;
}
