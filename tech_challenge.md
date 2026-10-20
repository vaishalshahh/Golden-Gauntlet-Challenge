# 🏆 The Golden Gauntlet: Tech Challenge Brief

## The mission

Northern Lumen Logistics is about to roll out **Lumi**, its new helpdesk chatbot, to 2,000 employees.
The demo went great. Product wants to ship on Monday.

You are the **eval author**. Before anyone ships anything, you build the **golden set** that decides
whether Lumi is actually ready: the questions, the correct answers and the scoring rules. Then you run
Lumi through it and report what you found.

In the real world, the golden set *is* the quality bar. A weak one lets a broken bot ship. A strong one
catches what the demo never showed.

---

## What you get

| Path | What it is |
|---|---|
| `bot/` | Lumi itself. Plain Node.js, no AI key needed, same answers for everyone. |
| `policies/` | The company policy documents Lumi answers from (English + French). |
| `SPEC.md` | The 10 rules Lumi must follow. **This is your contract.** |
| `harness/` | The gauntlet runner: feeds your golden set to Lumi and scores every answer. |
| `golden/example.golden.json` | A tiny 4-case example golden set (all of them pass). |
| `EVALS.example.md` | The template for your submission. |

Quick start: see [README.md](README.md). Requires **Node 18+** and nothing else.

---

## What you do

1. **Fork this repo** and run Lumi: `npm run ask -- "How long does my password need to be?"`
2. **Read `SPEC.md` and the policy documents.** Know what a correct answer looks like before you ask.
3. **Build your golden set** in `golden/`: questions, exact expected answers, and the checks that
   decide pass/fail. Use the built-in checks in `harness/checks.js`, or add your own.
4. **Run the gauntlet:** `npm run gauntlet -- golden/your.golden.json --out results.md`
5. **Write your `EVALS.md`** using `EVALS.example.md` as the template.
6. **Check the length:** `npm run wordcount -- EVALS.md`
7. **Upload your `EVALS.md`** to the challenge on the AI Hub Portal.

> ⚠️ **Don't fix Lumi.** You are testing the bot, not repairing it. Your golden set must run against the
> bot exactly as shipped in this repo.

---

## What to submit

One file: **`EVALS.md`**, **at most 2,500 words**, in three parts:

1. **Golden set.** For every case: ID, the spec rule(s) it checks, the question, and the exact expected
   result (key facts, source ID, or "must refuse").
2. **Scoring rules & coverage:** how an answer is marked right or wrong (including any custom checks
   you wrote), a coverage map from each spec rule to your case IDs, and what you deliberately left out
   and why.
3. **Results & findings:** Lumi's score overall and per category, every failure explained (what Lumi
   said, what it should have said, which rule it breaks), and your **ship / no-ship recommendation**.

> 🔍 **The judge only reads your `EVALS.md`.** It cannot run your code or open your fork. Put in
> everything that matters: your cases, your checks, your results.

> 📏 **2,500 words maximum. The portal rejects longer uploads.** The portal counts every
> whitespace-separated token, so each `|` and `---` in a markdown table counts as a word, and so does
> anything you type in the upload form's notes box. Summarise: **don't paste your raw golden-set JSON
> or the full `results.md` table.** Run `npm run wordcount -- EVALS.md` before uploading; it counts
> exactly the way the portal does.

---

## What great looks like

- **Coverage:** every spec rule is tested, not just the easy ones.
- **Precision:** expected answers are exact (figures, units, source IDs), not "something about hotels".
- **Adversarial thinking:** you test what Lumi must *not* do, not only what it should do.
- **Evidence:** every finding quotes what Lumi actually answered.
- **Judgement:** a clear ship / no-ship call, backed by your results.

The word limit is tight on purpose: a sharp golden set of 25 to 35 cases with clear
findings beats a long one. Choosing *what* to test, and what to leave out, is part of the skill.

## ✦ Sparks

- **7 ✦** for a passing submission
- **Bonus sparks** for going beyond what's asked

Good luck, and don't trust the demo. 🧪
