# 🧬 Genetic Health Analysis

Turn a raw 23andMe export into a clear, actionable health report — drug metabolism, methylation, nutrition, fitness, cardiovascular risk, and clinically significant ClinVar/PharmGKB findings.

Two ways to run it:

| | |
|---|---|
| 🌐 **Web app** | Runs entirely in your browser. Your genome file is **never uploaded** — parsing and analysis happen client-side. |
| 🖥️ **CLI (Python)** | Local script pipeline, same analysis, markdown reports on disk. |

---

## Reports you get

- **Exhaustive Genetic Report** — lifestyle & health genetics: drug metabolism, methylation, nutrition, fitness, sleep, cardiovascular, plus PharmGKB drug-gene interactions
- **Exhaustive Disease Risk Report** — ClinVar pathogenic variants, carrier status, risk factors, protective variants
- **Actionable Health Protocol** — everything above synthesized into supplement, diet, exercise, and monitoring recommendations

## Quick start

### Web app

```bash
cd web
npm install
npm run dev
```

Drop in a `genome.txt` file and get all three reports in the browser. See [`web/README.md`](web/README.md) for building and deploying to free static hosting (Vercel, Netlify, GitHub Pages, Cloudflare Pages).

### CLI

```bash
python scripts/run_full_analysis.py                 # uses data/genome.txt
python scripts/run_full_analysis.py path/to/genome.txt --name "Jane Doe"
```

Reports are written to `reports/`. See [`CLAUDE.md`](CLAUDE.md) for the full pipeline reference.

## 💡 Get more out of your report

These reports are thorough on purpose, which makes them dense. **We highly recommend uploading
the downloaded `.md` report to an LLM** (ChatGPT, Claude, etc.) and asking it to simplify the
results into something you can actually act on. A few high-ROI prompts to try:

- **Simplify it**: "Read this genetic health report and rewrite it in plain English. Group
  findings into three buckets: 'no action needed,' 'worth discussing with my doctor,' and 'safe
  to act on now.' Skip repeating the disclaimers — I've already read them."
- **30-day action plan**: "Based on this report, build a prioritized 30-day action plan. Pick the
  3-5 changes (supplements, diet, exercise, monitoring) that will have the biggest impact, order
  them by how soon I should start each one, and explain why each one made the cut."
- **Doctor visit prep**: "I'm bringing this report to my next doctor's appointment. Turn it into
  a short list of specific questions to ask and tests to request, ordered by how urgent each one is."
- **One-week meal plan**: "Turn the dietary recommendations in this report into a realistic
  one-week meal plan with a grocery list, sized for one person."
- **Supplement safety check**: "List every supplement this report recommends, with dose and
  reason. Flag any that commonly interact with each other or with common medications, so I know
  exactly what to double-check with a pharmacist."
- **Explain the science**: "Pick the 3 highest-impact findings in this report and explain the
  underlying biology for each one like I'm smart but have no medical background."

*(The web app surfaces these same prompts with one-click copy buttons once your reports are generated.)*

> ⚠️ **Privacy tradeoff**: uploading a report to a cloud LLM sends that file to a third party —
> unlike your raw genome, which never leaves your device in this project. Only do this with a
> service you trust, or use a locally-run model (e.g. Ollama, LM Studio) if you want the same
> on-device guarantee for this step too.

## 🔒 Privacy

The web app reads your genome file with the browser's File API and never sends it anywhere — the only network requests it makes are for its own bundled, public reference data (ClinVar, curated SNP interpretations). You can verify this yourself in your browser's Network tab while running an analysis.

## Data sources

- **ClinVar** ([NCBI](https://ftp.ncbi.nlm.nih.gov/pub/clinvar/), public domain) — bundled in this repo
- **PharmGKB** ([pharmgkb.org](https://www.pharmgkb.org/downloads), CC-BY-SA with redistribution conditions) — *not* bundled; download your own copy to `data/` if you want drug-interaction findings (see [`web/README.md`](web/README.md))

## ⚠️ Disclaimer

Informational and educational only — **not a clinical diagnosis**. Genetic associations are probabilistic, not deterministic. Consult a physician or genetic counselor before making health decisions based on these reports.
