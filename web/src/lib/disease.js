/**
 * Disease risk analysis against ClinVar + "Exhaustive Disease Risk Report"
 * generator. Ported from scripts/run_full_analysis.py
 * (load_clinvar_and_analyze / generate_disease_risk_report) and enriched
 * with the carrier phenotype notes from scripts/disease_risk_analyzer.py.
 *
 * The shipped clinvar_snps.json has already had indels filtered out at
 * conversion time (23andMe genotypes cannot reliably represent indels), so
 * every entry here is a true single-nucleotide variant.
 */

export function analyzeDisease(genome, refdata) {
  const clinvar = refdata.clinvar;

  const findings = {
    pathogenic: [],
    likely_pathogenic: [],
    risk_factor: [],
    drug_response: [],
    protective: [],
    other_significant: [],
  };

  const stats = {
    total_clinvar_positions: Object.keys(clinvar).length,
    matched: 0,
    pathogenic_matched: 0,
    likely_pathogenic_matched: 0,
  };

  for (const [posKey, userData] of genome.byPosition) {
    const entries = clinvar[posKey];
    if (!entries) continue;
    stats.matched += 1;

    for (const row of entries) {
      const userGenotype = userData.genotype;
      const ref = row.ref;
      const alt = row.alt;
      const sig = row.sig.toLowerCase();

      const hasVariant = userGenotype.includes(alt);
      const isHomozygous = userGenotype === alt + alt;
      const isHeterozygous = hasVariant && !isHomozygous;
      const hasRefOnly = userGenotype === ref + ref;

      if (hasRefOnly || !hasVariant) continue;

      const [chrom, pos] = posKey.split(":");
      const finding = {
        chromosome: chrom,
        position: pos,
        rsid: userData.rsid,
        gene: row.gene,
        ref,
        alt,
        user_genotype: userGenotype,
        is_homozygous: isHomozygous,
        is_heterozygous: isHeterozygous,
        clinical_significance: row.sig,
        review_status: row.review,
        gold_stars: row.stars || 0,
        traits: row.traits,
        inheritance: row.inherit || "",
        hgvs_p: row.hgvs_p || "",
        hgvs_c: row.hgvs_c || "",
        molecular_consequence: row.mc || "",
        xrefs: row.xrefs || "",
        pmids: row.pmids || "",
      };

      if (sig.includes("pathogenic") && !sig.includes("likely") && !sig.includes("conflict")) {
        findings.pathogenic.push(finding);
        stats.pathogenic_matched += 1;
      } else if (sig.includes("likely pathogenic") || sig.includes("likely_pathogenic")) {
        findings.likely_pathogenic.push(finding);
        stats.likely_pathogenic_matched += 1;
      } else if (sig.includes("risk factor") || sig.includes("risk_factor")) {
        findings.risk_factor.push(finding);
      } else if (sig.includes("drug response") || sig.includes("drug_response")) {
        findings.drug_response.push(finding);
      } else if (sig.includes("protective")) {
        findings.protective.push(finding);
      } else if (sig.includes("association") || sig.includes("affects")) {
        findings.other_significant.push(finding);
      }
    }
  }

  return { findings, stats };
}

function classifyZygosity(finding) {
  const inheritance = (finding.inheritance || "").toLowerCase();
  if (finding.is_homozygous) return ["AFFECTED", "Homozygous for variant"];
  if (finding.is_heterozygous) {
    if (inheritance.includes("recessive")) return ["CARRIER", "Heterozygous carrier (recessive)"];
    if (inheritance.includes("dominant")) return ["AFFECTED", "Heterozygous (dominant)"];
    return ["HETEROZYGOUS", "Heterozygous (inheritance unclear)"];
  }
  return ["UNKNOWN", "Zygosity unclear"];
}

const CARRIER_NOTES = {
  CFTR: `**Cystic Fibrosis Carrier (CFTR)**:
- CF carriers may have ~10% reduced lung function (FEV1)
- Increased risk of pancreatitis (2-3x general population)
- Higher prevalence of chronic sinusitis
- Possible male fertility effects (CBAVD spectrum)
- **Recommendation**: Baseline pulmonary function test, avoid smoking, genetic counseling if planning pregnancy
`,
  HBB: `**Sickle Cell Trait Carrier (HBB)**:
- Generally asymptomatic under normal conditions
- Possible complications at extreme altitude or severe dehydration
- Malaria resistance (evolutionary advantage)
- **Recommendation**: Stay hydrated during intense exercise; inform physicians before surgery
`,
  GBA: `**Gaucher Disease Carrier (GBA)**:
- Carriers have increased Parkinson's disease risk (5-8x)
- No Gaucher disease symptoms
- **Recommendation**: Awareness of early Parkinson's symptoms; inform neurologist
`,
  SERPINA1: `**Alpha-1 Antitrypsin Carrier (SERPINA1)**:
- Carriers (MZ) have ~60% normal AAT levels
- Mildly increased risk of COPD, especially if smoking
- **Recommendation**: Absolutely avoid smoking; baseline liver function; consider AAT level testing
`,
  HFE: `**Hemochromatosis Carrier (HFE)**:
- Carriers may have mildly elevated iron absorption
- Usually clinically insignificant
- **Recommendation**: Periodic ferritin monitoring; avoid unnecessary iron supplements
`,
  HEXA: `**Tay-Sachs Carrier (HEXA)**:
- Carriers have no symptoms or health effects
- Purely reproductive implications
- **Recommendation**: Carrier testing for partner if planning pregnancy
`,
  SMN1: `**Spinal Muscular Atrophy Carrier (SMN1)**:
- Carriers have no symptoms
- ~1 in 50 people are carriers
- **Recommendation**: Carrier testing for partner if planning pregnancy
`,
  PAH: `**Phenylketonuria Carrier (PAH)**:
- Carriers have no symptoms
- Normal phenylalanine metabolism
- **Recommendation**: Carrier testing for partner if planning pregnancy
`,
};

export function carrierPhenotypeNotes(gene) {
  const key = (gene || "").toUpperCase();
  return (
    CARRIER_NOTES[key] ||
    `**Carrier Phenotype Notes:**
- Carrier status typically does not cause symptoms for recessive conditions
- Primary implication is reproductive risk if partner is also a carrier
- Some carriers may have subtle biochemical differences without clinical significance
- **Recommended:** Genetic counseling if planning pregnancy
`
  );
}

export function classifyPathogenic(findings) {
  const affected = [];
  const carriers = [];
  const hetUnknown = [];

  for (const f of [...findings.pathogenic, ...findings.likely_pathogenic]) {
    const [status, desc] = classifyZygosity(f);
    f.zygosity_status = status;
    f.zygosity_description = desc;
    if (status === "AFFECTED") affected.push(f);
    else if (status === "CARRIER") carriers.push(f);
    else hetUnknown.push(f);
  }

  const byConfidence = (a, b) => b.gold_stars - a.gold_stars || a.gene.localeCompare(b.gene);
  [affected, carriers, hetUnknown, findings.risk_factor, findings.drug_response, findings.protective].forEach((arr) =>
    arr.sort(byConfidence)
  );

  return { affected, carriers, hetUnknown };
}

export function generateDiseaseReport(analysis, genomeTotalSnps, subjectName) {
  const { findings, stats } = analysis;
  const now = new Date().toISOString().slice(0, 16).replace("T", " ");

  const { affected, carriers, hetUnknown } = classifyPathogenic(findings);

  const subjectLine = subjectName ? `\n**Subject:** ${subjectName}` : "";
  const stars = (n) => "⭐".repeat(n) + "☆".repeat(4 - n);
  const firstTrait = (f) => (f.traits ? f.traits.split(";")[0] : "Condition not specified");

  let report = `# Exhaustive Disease Risk Report
${subjectLine}
**Generated:** ${now}

---

## Executive Summary

### Genome Overview
- **Total SNPs in Raw Data:** ${genomeTotalSnps.toLocaleString()}
- **Your Positions Matched Against ClinVar:** ${stats.matched.toLocaleString()}

### Clinical Findings Summary

| Category | Count | Description |
|----------|-------|-------------|
| \u{1F534} **Pathogenic (Affected)** | ${affected.length} | Homozygous or dominant - clinical phenotype expected |
| \u{1F7E0} **Pathogenic (Carrier)** | ${carriers.length} | Heterozygous carrier for recessive conditions |
| \u{1F7E1} **Likely Pathogenic** | ${hetUnknown.length} | Heterozygous, inheritance unclear |
| \u{1F535} **Risk Factors** | ${findings.risk_factor.length} | Increased disease susceptibility |
| \u{1F48A} **Drug Response** | ${findings.drug_response.length} | Pharmacogenomic variants |
| \u{1F7E2} **Protective** | ${findings.protective.length} | Reduced disease risk |
| ⚪ **Other Associations** | ${findings.other_significant.length} | Other clinically noted variants |

### Confidence Levels (Gold Stars)
- ⭐⭐⭐⭐ (4): Practice guideline / Expert panel reviewed
- ⭐⭐⭐ (3): Multiple submitters, no conflicts
- ⭐⭐ (2): Multiple submitters with some conflicts, or single submitter with criteria
- ⭐ (1): Single submitter with criteria
- ☆ (0): No assertion criteria provided

---

`;

  if (affected.length) {
    report += `## \u{1F534} Pathogenic Variants — Affected Status

These variants are classified as pathogenic and your genotype suggests you may be affected.
**Consult a genetic counselor or physician for clinical interpretation.**

`;
    for (const f of affected) {
      report += `### ${f.gene} — ${firstTrait(f)}

| Field | Value |
|-------|-------|
| **Gene** | ${f.gene} |
| **Position** | chr${f.chromosome}:${f.position} |
| **RSID** | ${f.rsid} |
| **Your Genotype** | \`${f.user_genotype}\` |
| **Variant** | ${f.ref} → ${f.alt} |
| **Zygosity** | ${f.is_homozygous ? "Homozygous" : "Heterozygous"} |
| **Clinical Significance** | ${f.clinical_significance} |
| **Confidence** | ${stars(f.gold_stars)} (${f.gold_stars}/4) |
| **Review Status** | ${f.review_status} |
| **Inheritance** | ${f.inheritance || "Not specified"} |

**Condition(s):** ${f.traits || "Not specified"}

**Molecular Detail:** ${f.hgvs_p || f.hgvs_c || "Not available"}

**Consequence:** ${f.molecular_consequence || "Not specified"}

**Database References:** ${f.xrefs || "None"}

**Literature:** ${f.pmids || "None"}

---

`;
    }
  }

  if (carriers.length) {
    report += `## \u{1F7E0} Carrier Status — Recessive Conditions

You are a heterozygous carrier for these autosomal recessive conditions.
**Carriers typically do not show symptoms but may pass the variant to offspring.**

### Reproductive Implications
- If your partner is also a carrier for the same condition: **25% chance** of affected child
- If your partner is affected: **50% chance** of affected child
- Consider genetic counseling if planning pregnancy

`;
    for (const f of carriers) {
      report += `### ${f.gene} — ${firstTrait(f)}

| Field | Value |
|-------|-------|
| **Gene** | ${f.gene} |
| **Position** | chr${f.chromosome}:${f.position} |
| **RSID** | ${f.rsid} |
| **Your Genotype** | \`${f.user_genotype}\` (Carrier) |
| **Variant** | ${f.ref} → ${f.alt} |
| **Clinical Significance** | ${f.clinical_significance} |
| **Confidence** | ${stars(f.gold_stars)} (${f.gold_stars}/4) |
| **Inheritance** | Autosomal Recessive |

**Full Condition(s):** ${f.traits || "Not specified"}

**Molecular Detail:** ${f.hgvs_p || f.hgvs_c || "Not available"}

${carrierPhenotypeNotes(f.gene)}

**Database References:** ${f.xrefs || "None"}

---

`;
    }
  }

  if (hetUnknown.length) {
    report += `## \u{1F7E1} Pathogenic/Likely Pathogenic — Inheritance Unclear

You are heterozygous for these variants. The inheritance pattern is not clearly specified,
so clinical impact is uncertain. Some may be dominant (one copy = affected), others may be
carrier status only.

`;
    for (const f of hetUnknown) {
      report += `### ${f.gene} — ${firstTrait(f)}

| Field | Value |
|-------|-------|
| **Gene** | ${f.gene} |
| **Position** | chr${f.chromosome}:${f.position} |
| **RSID** | ${f.rsid} |
| **Your Genotype** | \`${f.user_genotype}\` |
| **Variant** | ${f.ref} → ${f.alt} |
| **Clinical Significance** | ${f.clinical_significance} |
| **Confidence** | ${stars(f.gold_stars)} (${f.gold_stars}/4) |
| **Inheritance** | ${f.inheritance || "Not specified"} |

**Condition(s):** ${f.traits || "Not specified"}

**Molecular Detail:** ${f.hgvs_p || f.hgvs_c || "Not available"}

---

`;
    }
  }

  const simpleSection = (title, intro, items) => {
    let s = `## ${title}\n\n${intro}\n\n`;
    for (const f of items) {
      s += `### ${f.gene} — ${firstTrait(f)}

| **RSID** | **Genotype** | **Significance** | **Confidence** |
|----------|--------------|------------------|----------------|
| ${f.rsid} | \`${f.user_genotype}\` | ${f.clinical_significance} | ${stars(f.gold_stars)} |

**Details:** ${f.traits || "Not specified"}

---

`;
    }
    return s;
  };

  if (findings.risk_factor.length) {
    report += simpleSection(
      "\u{1F535} Risk Factor Variants",
      "These variants are associated with increased susceptibility to certain conditions. They do not guarantee disease but indicate elevated risk.",
      findings.risk_factor
    );
  }
  if (findings.drug_response.length) {
    report += simpleSection(
      "\u{1F48A} Drug Response Variants",
      "These variants affect response to medications.",
      findings.drug_response
    );
  }
  if (findings.protective.length) {
    report += simpleSection(
      "\u{1F7E2} Protective Variants",
      "These variants are associated with reduced disease risk or protective effects.",
      findings.protective
    );
  }

  if (findings.other_significant.length) {
    report += `## ⚪ Other Clinically Noted Variants

These variants have clinical annotations that don't fit the above categories.

`;
    for (const f of findings.other_significant.slice(0, 50)) {
      report += `### ${f.gene} — ${f.rsid}

| **Genotype** | **Significance** | **Confidence** | **Traits** |
|--------------|------------------|----------------|------------|
| \`${f.user_genotype}\` | ${f.clinical_significance} | ${stars(f.gold_stars)} | ${(f.traits || "Not specified").slice(0, 100)}... |

---

`;
    }
  }

  report += `## \u{1F4CA} Analysis Statistics

| Metric | Value |
|--------|-------|
| Total SNPs in genome | ${genomeTotalSnps.toLocaleString()} |
| Genome positions matched against ClinVar | ${stats.matched.toLocaleString()} |
| Pathogenic variants found | ${stats.pathogenic_matched} |
| Likely pathogenic variants found | ${stats.likely_pathogenic_matched} |
| Risk factors found | ${findings.risk_factor.length} |
| Drug response variants | ${findings.drug_response.length} |
| Protective variants | ${findings.protective.length} |

---

## ⚠️ Important Disclaimer

This report is for **informational and educational purposes only**. It is NOT a clinical diagnosis.

### Key Points:
- Variant classifications are based on ClinVar submissions and may change over time
- Clinical significance depends on individual and family history
- Many variants have incomplete penetrance (not everyone with variant develops condition)
- Carrier status has reproductive implications but typically no personal health impact
- Variants with low gold stars have less evidence supporting their classification
- **Consult a genetic counselor or physician for clinical interpretation**

### How to Use This Report:
1. **Pathogenic/Affected**: Discuss with physician immediately
2. **Carrier Status**: Consider genetic counseling if planning pregnancy
3. **Risk Factors**: Inform preventive care decisions
4. **Drug Response**: Share with prescribing physicians

---

*Report generated entirely in your browser using a bundled ClinVar database snapshot. Your genetic data was never uploaded anywhere.*
`;

  return { report, affected, carriers, hetUnknown };
}
