#!/usr/bin/env python3
"""
One-time data conversion: turns the Python reference databases and TSV
downloads in ../data into compact static JSON assets for the browser app.

These outputs contain NO user genetic data — only public reference
databases (curated SNP interpretations, ClinVar, PharmGKB) that are safe
to ship as static files served to every visitor.
"""
import csv
import gzip
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = REPO_ROOT / "data"
SCRIPTS_DIR = REPO_ROOT / "scripts"
OUT_DIR = Path(__file__).resolve().parents[1] / "public" / "refdata"
OUT_DIR.mkdir(parents=True, exist_ok=True)

sys.path.insert(0, str(SCRIPTS_DIR))


def convert_comprehensive_snps():
    from comprehensive_snp_database import COMPREHENSIVE_SNPS
    out = OUT_DIR / "comprehensive_snps.json"
    out.write_text(json.dumps(COMPREHENSIVE_SNPS, separators=(",", ":")))
    print(f"  comprehensive_snps.json: {len(COMPREHENSIVE_SNPS)} SNPs, {out.stat().st_size/1024:.0f} KB")


def convert_clinical_context():
    from generate_exhaustive_report import CLINICAL_CONTEXT, PATHWAYS
    # CLINICAL_CONTEXT keys are (gene, status) tuples -> encode as "gene|status"
    ctx = {f"{gene}|{status}": val for (gene, status), val in CLINICAL_CONTEXT.items()}
    out = OUT_DIR / "clinical_context.json"
    out.write_text(json.dumps(ctx, separators=(",", ":")))
    print(f"  clinical_context.json: {len(ctx)} entries, {out.stat().st_size/1024:.0f} KB")

    out2 = OUT_DIR / "pathways.json"
    out2.write_text(json.dumps(PATHWAYS, separators=(",", ":")))
    print(f"  pathways.json: {len(PATHWAYS)} pathways, {out2.stat().st_size/1024:.0f} KB")


def convert_clinvar():
    src = DATA_DIR / "clinvar_alleles.tsv.gz"
    out = OUT_DIR / "clinvar_snps.json"

    fields = [
        "ref", "alt", "symbol", "hgvs_c", "hgvs_p", "molecular_consequence",
        "clinical_significance", "review_status", "gold_stars",
        "all_traits", "inheritance_modes", "all_pmids", "xrefs",
        "age_of_onset", "prevalence",
    ]
    short = {
        "ref": "ref", "alt": "alt", "symbol": "gene", "hgvs_c": "hgvs_c",
        "hgvs_p": "hgvs_p", "molecular_consequence": "mc",
        "clinical_significance": "sig", "review_status": "review",
        "gold_stars": "stars", "all_traits": "traits",
        "inheritance_modes": "inherit", "all_pmids": "pmids", "xrefs": "xrefs",
        "age_of_onset": "onset", "prevalence": "prevalence",
    }

    by_pos = {}
    total = 0
    kept = 0
    with gzip.open(src, "rt", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter="\t")
        for row in reader:
            total += 1
            ref = row["ref"]
            alt = row["alt"]
            if len(ref) != 1 or len(alt) != 1:
                continue  # indels: 23andMe can't reliably represent these
            sig = row["clinical_significance"]
            if not sig:
                continue
            sig_l = sig.lower()
            # Only keep clinically actionable categories (matches the
            # pipeline's categorization buckets) to keep the payload small.
            if not any(k in sig_l for k in [
                "pathogenic", "risk factor", "risk_factor", "drug response",
                "drug_response", "protective", "association", "affects",
            ]):
                continue

            key = f"{row['chrom']}:{row['pos']}"
            entry = {short[k]: row.get(k, "") for k in fields}
            entry["stars"] = int(entry["stars"]) if entry["stars"] else 0
            by_pos.setdefault(key, []).append(entry)
            kept += 1

    out.write_text(json.dumps(by_pos, separators=(",", ":")))
    print(f"  clinvar_snps.json: scanned {total:,} rows, kept {kept:,} SNP entries "
          f"across {len(by_pos):,} positions, {out.stat().st_size/1024/1024:.1f} MB")


def convert_pharmgkb():
    ann_path = DATA_DIR / "clinical_annotations.tsv"
    alleles_path = DATA_DIR / "clinical_ann_alleles.tsv"
    out = OUT_DIR / "pharmgkb.json"

    annotations = {}
    with open(ann_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter="\t")
        for row in reader:
            variant = row.get("Variant/Haplotypes", "")
            if variant.startswith("rs"):
                annotations[row.get("Clinical Annotation ID", "")] = {
                    "rsid": variant,
                    "gene": row.get("Gene", ""),
                    "drugs": row.get("Drug(s)", ""),
                    "phenotype": row.get("Phenotype(s)", ""),
                    "level": row.get("Level of Evidence", ""),
                    "category": row.get("Phenotype Category", ""),
                }

    pharmgkb = {}
    with open(alleles_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter="\t")
        for row in reader:
            ann_id = row.get("Clinical Annotation ID", "")
            ann = annotations.get(ann_id)
            if not ann:
                continue
            # Only ship levels the app actually surfaces (1A/1B/2A/2B)
            if ann["level"] not in ("1A", "1B", "2A", "2B"):
                continue
            rsid = ann["rsid"]
            entry = pharmgkb.setdefault(rsid, {
                "gene": ann["gene"], "drugs": ann["drugs"],
                "phenotype": ann["phenotype"], "level": ann["level"],
                "category": ann["category"], "genotypes": {},
            })
            entry["genotypes"][row.get("Genotype/Allele", "")] = row.get("Annotation Text", "")

    out.write_text(json.dumps(pharmgkb, separators=(",", ":")))
    print(f"  pharmgkb.json: {len(pharmgkb):,} rsid entries, {out.stat().st_size/1024:.0f} KB")


if __name__ == "__main__":
    print("Converting reference data to static JSON assets...")
    convert_comprehensive_snps()
    convert_clinical_context()
    convert_clinvar()
    convert_pharmgkb()
    print("Done.")
