export { Prompt } from './prompt';
export type { Question, Answer } from './types';

// import { Prompt } from './prompt';
// import { Question } from './types';

// (async () => {
//   const questions: Question[] = [
//     {
//       id: 'q1',
//       type: 'multiple-choice',
//       question: 'What is your favorite programming language?',
//       options: ['JavaScript', 'TypeScript', 'Python', 'Java'],
//     },
//     {
//       id: 'q2',
//       type: 'open',
//       question: 'What is your name?',
//       allowBackNavigation: true,
//     },
//     {
//       id: 'q3',
//       type: 'number',
//       question: 'How many years of experience do you have in programming?',
//       condition: (answers) => {
//         // Only ask this question if the user selected "TypeScript" in q1
//         const q1Answer = answers.find((a) => a.id === 'q1')?.answer;
//         return q1Answer === 'TypeScript';
//       },
//     },
//     {
//       id: 'q4',
//       type: 'open',
//       question: 'What is your last name?',
//       allowBackNavigation: true,
//     },
//   ];

//   const answers = await Prompt({
//     questions,
//     allowBackNavigation: true,
//     allowSkip: true,
//   });
//   console.log('\nYour answers:', answers);
// })();
