# 🏆 Golden Gauntlet Challenge

**AI Hub Challenge, Build track.** Northern Lumen Logistics is about to ship **Lumi**, its internal
helpdesk chatbot. Your job: build the golden set that decides whether it's ready.

👉 **Start with the brief: [tech_challenge.md](tech_challenge.md)**, then the contract: [SPEC.md](SPEC.md).

---

## Quick start

Requires **Node 18+**. No `npm install` needed: zero dependencies, no AI key, works offline.

```bash
git clone https://github.com/<your-username>/Golden-Gauntlet-Challenge.git
cd Golden-Gauntlet-Challenge

# Ask Lumi a question
npm run ask -- "How long does my password need to be?"
npm run ask -- "Combien de jours de vacances ai-je par année?"

# Chat with Lumi interactively (type "exit" to quit)
npm run ask

# Run the example golden set
npm test

# Run your own golden set and save a results table for your EVALS.md
npm run gauntlet -- golden/my.golden.json --out results.md

# Check your EVALS.md fits the 2,500-word limit (counts exactly like the portal)
npm run wordcount -- EVALS.md
```

Failing cases are normal; that's your golden set doing its job. Add `--strict` if you want a non-zero
exit code when any case fails (handy for CI).

**Windows / PowerShell:** the same commands work; keep the question in double quotes. If npm ever
swallows your options (for example `--out` doesn't write a file), call Node directly. It always works:

```powershell
node bot/cli.js "How long does my password need to be?"
node harness/run.js golden/my.golden.json --out results.md
node harness/wordcount.js EVALS.md
```

---

## Repository map

```
bot/                      Lumi, the system under test (don't modify it)
policies/                 Northern Lumen's policy documents, English + French
SPEC.md                   The 10 rules Lumi must follow
harness/run.js            The gauntlet runner
harness/checks.js         Built-in checks; add your own here
harness/wordcount.js      Word counter that matches the portal's 2,500-word limit
golden/example.golden.json  A 4-case example to copy from
EVALS.example.md          Template for your submission
tech_challenge.md         The challenge brief
```

---

## Golden set format

A golden set is a JSON array of cases:

```json
[
  {
    "id": "G-01",
    "category": "happy-path",
    "rule": "R1, R2, R6",
    "question": "How long does my password need to be?",
    "expect": {
      "mustInclude": ["14 characters"],
      "mustCite": ["IT-SEC-2026"],
      "language": "en"
    },
    "why": "Optional: why this case matters."
  }
]
```

`id`, `question` and `expect` are required. `category` groups results in the score table. `rule` and
`why` are for humans (and for your EVALS.md).

## Built-in checks

| Check | Value | Passes when… |
|---|---|---|
| `equals` | string | the answer is exactly this string |
| `mustInclude` | string or list | every snippet appears (case-insensitive, accent-sensitive) |
| `mustNotInclude` | string or list | no snippet appears |
| `mustCite` | ID or list | every ID is cited |
| `mustNotCite` | ID or list | none of the IDs is cited |
| `citesNothing` | `true` / `false` | the answer has no citation (`true`) or has one (`false`) |
| `refuse` | `true` / `false` | the answer is (or isn't) the "I don't have that information" reply |
| `language` | `"en"` / `"fr"` | the answer body is written in that language |
| `maxSentences` | number | the answer has at most that many sentences |
| `matches` / `notMatches` | regex string | the answer matches / doesn't match the pattern |

Need something else? Add a function to `CHECKS` in [`harness/checks.js`](harness/checks.js) and
describe it in your EVALS.md.

---

## Submitting

1. Fork this repo and build your golden set in `golden/`.
2. Run the gauntlet and capture the results.
3. Write `EVALS.md` (template: [EVALS.example.md](EVALS.example.md)), **max 2,500 words**.
   Check with `npm run wordcount -- EVALS.md`. Table `|` separators count as words, and the portal
   rejects longer uploads, so summarise rather than pasting raw JSON or the full results table.
4. Upload `EVALS.md` to the challenge on the **AI Hub Portal**.

---

*Northern Lumen Logistics, its people, policies, phone numbers and email addresses are fictional and
exist only for this challenge.*
