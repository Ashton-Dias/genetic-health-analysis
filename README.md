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

## 🔒 Privacy

The web app reads your genome file with the browser's File API and never sends it anywhere — the only network requests it makes are for its own bundled, public reference data (ClinVar, curated SNP interpretations). You can verify this yourself in your browser's Network tab while running an analysis.

## Data sources

- **ClinVar** ([NCBI](https://ftp.ncbi.nlm.nih.gov/pub/clinvar/), public domain) — bundled in this repo
- **PharmGKB** ([pharmgkb.org](https://www.pharmgkb.org/downloads), CC-BY-SA with redistribution conditions) — *not* bundled; download your own copy to `data/` if you want drug-interaction findings (see [`web/README.md`](web/README.md))

## ⚠️ Disclaimer

Informational and educational only — **not a clinical diagnosis**. Genetic associations are probabilistic, not deterministic. Consult a physician or genetic counselor before making health decisions based on these reports.
