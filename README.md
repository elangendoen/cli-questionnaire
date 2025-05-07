# CLI Questionnaire 🎯

A CLI tool built with TypeScript for creating interactive questionnaires.

## Table of Contents 📚

- [Installation](#installation)
- [Usage](#usage)
- [Build](#build)
- [Testing](#testing)
- [License](#license)

## Installation ⚙️

### From npm (once published)

You can install the package globally using npm:

```sh
npm install -g cli-questionnaire
```

Or use it directly with `npx`:

```sh
npx cli-questionnaire
```

### From Source 🛠️

1. Clone the repository:
   ```sh
   git clone https://github.com/elangendoen/cli-questionnaire.git
   cd cli-questionnaire
   ```
2. Install dependencies:

   ```sh
   npm install
   ```

3. Build the project:
   ```sh
   npm run build
   ```

## Usage 🚀

### Using the CLI

Once installed globally or via `npx`, you can run the CLI tool:

```sh
cli-questionnaire
```

### Programmatic Usage 🖥️

You can also use the `Prompt` function programmatically in your TypeScript or JavaScript projects:

```typescript
import { Prompt, Question } from 'cli-questionnaire';

const questions: Question[] = [
  {
    id: 'q1',
    type: 'multiple-choice',
    question: 'What is your favorite programming language?',
    options: ['JavaScript', 'TypeScript', 'Python'],
  },
  {
    id: 'q2',
    type: 'open',
    question: 'What is your name?',
    allowBackNavigation: true,
  },
  {
    id: 'q3',
    type: 'number',
    question: 'How many years of experience do you have in programming?',
    condition: (answers) => {
      const q1Answer = answers.find((a) => a.id === 'q1')?.answer;
      return q1Answer === 'TypeScript';
    },
  },
];

(async () => {
  const answers = await Prompt({
    questions,
    allowBackNavigation: true,
    allowSkip: true,
  });

  console.log('Your answers:', answers);
})();
```

#### Question Properties 📝

Each question in the `questions` array can have the following properties:

- **`id`** (required): A unique identifier for the question.
- **`type`** (required): The type of question. Can be one of:
  - `'multiple-choice'`: A question with predefined options.
  - `'open'`: A free-text question.
  - `'number'`: A question expecting a numeric answer.
- **`question`** (required): The text of the question to display to the user.
- **`options`** (required for `'multiple-choice'`): An array of strings representing the available options.
- **`allowBackNavigation`** (optional): A boolean indicating whether the user can navigate back to this question. Defaults to `false`.
- **`allowSkip`** (optional): A boolean indicating whether the user can skip this question. Defaults to `false`.
- **`condition`** (optional): A function that determines whether this question should be asked. The function receives the current `answers` array and should return `true` or `false`.

---

## Build 🏗️

To compile the TypeScript code to JavaScript, run:

```sh
npm run build
```

The compiled files will be output to the `dist` directory.

## Testing 🧪

Run the tests using Jest:

```sh
npm test
```

To generate a coverage report:

```sh
npm run coverage
```

## License 📜

This project is licensed under the ISC License.
