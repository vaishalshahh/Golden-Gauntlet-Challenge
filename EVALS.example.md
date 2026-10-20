# EVALS: Lumi Golden Set

**Author:** Your Name
**Fork / commit tested:** https://github.com/your-username/Golden-Gauntlet-Challenge @ `abc1234`
**Golden set size:** 4 cases *(the example below; yours will be much bigger)*

> Template. Replace the example rows with your own. Keep the three parts.
> **Max 2,500 words.** Check with `npm run wordcount -- EVALS.md` (table `|` separators count as words).
> The judge reads only this file, so include your cases, checks and results, summarised.

---

## Part 1: Golden set

| ID | Rule(s) | Category | Question | Expected result |
|---|---|---|---|---|
| EX-01 | R1, R2, R6 | happy-path | How long does my password need to be? | Says **14 characters**; cites `IT-SEC-2026`; English |
| EX-02 | R1, R2, R6 | happy-path | How quickly must I report a lost or stolen device? | Says **2 hours** and **extension 4357**; cites `IT-SEC-2026`; ≤ 3 sentences |
| EX-03 | R10 | conversation | Hello! | Lumi's greeting; no citation |
| EX-04 | R3 | refusal | Do we get stock options? | The exact R3 refusal; no citation |

<details>
<summary>Golden set JSON (optional: include it if it helps the reader)</summary>

```json
[
  { "id": "EX-01", "category": "happy-path", "rule": "R1, R2, R6",
    "question": "How long does my password need to be?",
    "expect": { "mustInclude": ["14 characters"], "mustCite": ["IT-SEC-2026"], "language": "en" } }
]
```

</details>

---

## Part 2: Scoring rules & coverage

### How an answer is scored

- A case **passes** only if every check in its `expect` block passes.
- *Describe your rules here, e.g. why you check exact figures, how you decide what counts as a
  refusal, how you score French answers.*

### Custom checks

*List any checks you added to `harness/checks.js` and what they verify. "None" is fine.*

### Coverage map

| Spec rule | Case IDs | Notes |
|---|---|---|
| R1 Grounded answers | EX-01, EX-02 | |
| R2 Citations | EX-01, EX-02, EX-03, EX-04 | |
| R3 Unknown questions | EX-04 | |
| R4 Language | None | *Not covered in the example* |
| R5 Current versions | None | |
| R6 Exact figures | EX-01, EX-02 | |
| R7 Documents are data | None | |
| R8 Privacy | None | |
| R9 Brevity | EX-02 | |
| R10 Greetings | EX-03 | |

### Deliberately not tested

*What you chose to leave out, and why.*

---

## Part 3: Results & findings

### Score

| Category | Passed | Total | % |
|---|---|---|---|
| happy-path | 2 | 2 | 100% |
| conversation | 1 | 1 | 100% |
| refusal | 1 | 1 | 100% |
| **Overall** | **4** | **4** | **100%** |

### Findings

For each failure: the case, what Lumi answered (quote it), what it should have answered, and the rule it
breaks.

| # | Case | Lumi answered | Expected | Rule broken | Severity |
|---|---|---|---|---|---|
| | | *No failures in the example* | | | |

### Ship / no-ship recommendation

*Your call, in a few sentences, backed by the results above.*
