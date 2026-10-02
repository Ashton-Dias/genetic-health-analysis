# Genetic Health Analysis — Web App

A client-side-only web version of the analysis pipeline in `../scripts`. It
reproduces the same three reports (lifestyle/health, disease risk, actionable
protocol) entirely in the browser.

**Your genome file never leaves your device.** It's read with the browser's
File API and processed in memory. The only network requests this app makes
are to fetch its own bundled static reference files (`public/refdata/*.json`
— ClinVar, PharmGKB, and the curated SNP database, all public reference data
with no user information). Fonts (Inter and Instrument Serif) are bundled
from npm via `@fontsource` packages and served from the same origin, so no
third-party font requests are made. You can verify this yourself: open devtools →
Network while running an analysis and confirm no request contains your
genome data.

## Develop

```bash
cd web
npm install
npm run dev
```

## Rebuild reference data

If the underlying databases in `../data` or the curated interpretations in
`../scripts` change, regenerate the static JSON assets before building:

```bash
python3 web/scripts/convert_data.py
```

This reads `../data/clinvar_alleles.tsv.gz`, `../data/clinical_annotations.tsv`,
`../data/clinical_ann_alleles.tsv`, and the Python databases in `../scripts`,
and writes compact JSON files to `web/public/refdata/`. None of these outputs
contain user genetic data.

**PharmGKB caveat**: `pharmgkb.json` is derived from PharmGKB's downloads,
which come with their own terms of use around redistribution. This repo
gitignores the raw PharmGKB TSVs (`data/clinical_*.tsv`, `pharmgkb_annotations.zip`)
and the derived `pharmgkb.json`, so a fresh clone / public deploy simply won't
have PharmGKB drug-interaction data (the app degrades gracefully, same as the
CLI pipeline does when those files are missing). If you've reviewed PharmGKB's
terms and are comfortable redistributing your own download, you can regenerate
`pharmgkb.json` locally and deploy it yourself — just don't commit it to a
public fork without checking those terms first.

## Build & deploy (free static hosting)

```bash
npm run build   # outputs to web/dist
```

`dist/` is a fully static site — no server, no environment variables, no
backend. Deploy it to any free static host:

- **Vercel**: `npx vercel --cwd web` (or connect the repo, set root directory
  to `web`, build command `npm run build`, output directory `dist`)
- **Netlify**: drag-and-drop `web/dist`, or connect the repo with base
  directory `web`, build command `npm run build`, publish directory `dist`
- **GitHub Pages**: push `web/dist` to a `gh-pages` branch (e.g. via
  `npx gh-pages -d dist` from inside `web/`)
- **Cloudflare Pages**: connect the repo, root directory `web`, build command
  `npm run build`, output directory `dist`

All of these serve gzip/brotli automatically, so the ~53MB `clinvar_snps.json`
asset transfers as roughly 3.6MB over the wire, cached by the browser after
first load.
