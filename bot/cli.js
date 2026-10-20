#!/usr/bin/env node
// Ask Lumi a question from the terminal.
//   npm run ask -- "How long does my password need to be?"
//   npm run ask -- --json "Combien de jours de vacances ai-je?"
//   npm run ask                      (interactive chat; type "exit" to quit)

import { createInterface } from 'node:readline';
import { ask } from './index.js';

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const question = args.filter((a) => a !== '--json').join(' ').trim();

function print(result) {
  if (asJson) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`\nLumi: ${result.answer}\n`);
  }
}

if (question) {
  print(ask(question));
} else {
  const rl = createInterface({ input: process.stdin, output: process.stdout, prompt: 'You: ' });
  console.log("Lumi, Northern Lumen's policy assistant. Type a question, or \"exit\" to quit.\n");
  rl.prompt();
  rl.on('line', (line) => {
    const text = line.trim();
    if (text === 'exit' || text === 'quit') return rl.close();
    if (text) print(ask(text));
    rl.prompt();
  });
}
