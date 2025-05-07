import * as readline from 'readline';

export const askQuestion = (
  rl: readline.Interface,
  query: string
): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};
