/**
 * Lifestyle/health SNP analysis + "Exhaustive Genetic Report" generator.
 * Ported from scripts/run_full_analysis.py::analyze_lifestyle_health and
 * scripts/generate_exhaustive_report.py.
 */
import { formatLocalTimestamp } from "./time.js";

function reversed(genotype) {
  return genotype.length === 2 ? genotype.split("").reverse().join("") : genotype;
}

export function analyzeLifestyle(genome, refdata) {
  const { comprehensiveSnps, pharmgkb } = refdata;

  const findings = [];
  const pharmgkbFindings = [];
  const summary = {
    total_snps: genome.totalSnps,
    analyzed_snps: 0,
    high_impact: 0,
    moderate_impact: 0,
    low_impact: 0,
  };

  for (const [rsid, info] of Object.entries(comprehensiveSnps)) {
    const userSnp = genome.byRsid.get(rsid);
    if (!userSnp) continue;

    const genotype = userSnp.genotype;
    const variantInfo = info.variants[genotype] || info.variants[reversed(genotype)];
    if (!variantInfo) continue;

    findings.push({
      rsid,
      gene: info.gene,
      category: info.category,
      genotype,
      status: variantInfo.status,
      description: variantInfo.desc,
      magnitude: variantInfo.magnitude,
      note: info.note || "",
    });
    summary.analyzed_snps += 1;
    if (variantInfo.magnitude >= 3) summary.high_impact += 1;
    else if (variantInfo.magnitude >= 2) summary.moderate_impact += 1;
    else if (variantInfo.magnitude >= 1) summary.low_impact += 1;
  }

  for (const [rsid, info] of Object.entries(pharmgkb)) {
    const userSnp = genome.byRsid.get(rsid);
    if (!userSnp) continue;
    const genotype = userSnp.genotype;
    const annotation = info.genotypes[genotype] || info.genotypes[reversed(genotype)];
    if (!annotation) continue;
    if (!["1A", "1B", "2A", "2B"].includes(info.level)) continue;

    pharmgkbFindings.push({
      rsid,
      gene: info.gene,
      drugs: info.drugs,
      genotype,
      annotation,
      level: info.level,
      category: info.category,
    });
  }

  findings.sort((a, b) => b.magnitude - a.magnitude);
  pharmgkbFindings.sort((a, b) => a.level.localeCompare(b.level));

  return { findings, pharmgkbFindings, summary };
}

// ---------------------------------------------------------------------------
// Report generation (mirrors generate_exhaustive_report.py)
// ---------------------------------------------------------------------------

function titleCase(s) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatMagnitude(mag) {
  if (mag >= 3) return `\u{1F534} HIGH (${mag}/6)`;
  if (mag === 2) return `\u{1F7E1} MODERATE (${mag}/6)`;
  if (mag === 1) return `\u{1F7E2} LOW (${mag}/6)`;
  return `⚪ NEUTRAL (${mag}/6)`;
}

function formatEvidenceLevel(level) {
  if (level === "1A" || level === "1B") return `\u{1F535} ${level} - Clinical guideline annotation`;
  if (level === "2A" || level === "2B") return `\u{1F7E3} ${level} - Variant has moderate evidence`;
  return `⚫ ${level}`;
}

function getClinicalContext(clinicalContext, gene, status) {
  return clinicalContext[`${gene}|${status}`] || null;
}

function getRelatedPathways(pathways, gene) {
  return Object.entries(pathways)
    .filter(([, genes]) => genes.includes(gene))
    .map(([name]) => name);
}

function generateFindingSection(finding, index, clinicalContext, pathways) {
  const lines = [];
  lines.push(`### ${index}. ${finding.gene} (${finding.rsid})`, "");
  lines.push(`**Category:** ${finding.category}  `);
  lines.push(`**Your Genotype:** \`${finding.genotype}\`  `);
  lines.push(`**Status:** ${titleCase(finding.status)}  `);
  lines.push(`**Impact:** ${formatMagnitude(finding.magnitude)}`, "");
  lines.push(`**Description:** ${finding.description}`);

  if (finding.note) {
    lines.push("", `**Note:** ${finding.note}`);
  }

  const related = getRelatedPathways(pathways, finding.gene);
  if (related.length) {
    lines.push("", `**Related Pathways:** ${related.join(", ")}`);
  }

  const context = getClinicalContext(clinicalContext, finding.gene, finding.status);
  if (context) {
    lines.push("", "#### Mechanism", context.mechanism);
    if (context.implications?.length) {
      lines.push("", "#### Implications");
      for (const imp of context.implications) lines.push(`- ${imp}`);
    }
    if (context.actions?.length) {
      lines.push("", "#### Recommended Actions");
      for (const action of context.actions) lines.push(`- ${action}`);
    }
    if (context.interactions?.length) {
      lines.push("", "#### Gene Interactions");
      for (const i of context.interactions) lines.push(`- ${i}`);
    }
  }

  lines.push("", "---", "");
  return lines.join("\n");
}

function generatePharmgkbSection(finding, index) {
  const lines = [];
  lines.push(`### ${index}. ${finding.gene} - ${finding.rsid}`, "");
  lines.push(`**Evidence Level:** ${formatEvidenceLevel(finding.level)}  `);
  lines.push(`**Category:** ${finding.category}  `);
  lines.push(`**Your Genotype:** \`${finding.genotype}\`  `);
  lines.push(`**Affected Drugs:** ${finding.drugs}`, "");
  lines.push("#### Clinical Annotation", finding.annotation, "");

  if (["1A", "1B"].includes(finding.level)) {
    lines.push(
      "#### Clinical Significance",
      "This is a high-evidence drug-gene interaction with clinical guideline support. Discuss with prescribing physicians before starting these medications."
    );
  }
  lines.push("---", "");
  return lines.join("\n");
}

function generateExecutiveSummary(data) {
  const { findings, pharmgkbFindings, summary } = data;
  const high = findings.filter((f) => f.magnitude >= 3);
  const mod = findings.filter((f) => f.magnitude === 2);
  const low = findings.filter((f) => f.magnitude === 1);
  const level1 = pharmgkbFindings.filter((f) => f.level.startsWith("1"));
  const level2 = pharmgkbFindings.filter((f) => f.level.startsWith("2"));
  const categories = [...new Set(findings.map((f) => f.category))].sort();

  const lines = [];
  lines.push("# Exhaustive Genetic Health Report", "");
  lines.push(`**Generated:** ${formatLocalTimestamp()}`, "");
  lines.push("---", "", "## Executive Summary", "");
  lines.push("### Genome Overview");
  lines.push(`- **Total SNPs in Raw Data:** ${summary.total_snps.toLocaleString()}`);
  lines.push(`- **Clinically Relevant SNPs Analyzed:** ${findings.length}`);
  lines.push(`- **PharmGKB Drug Interactions:** ${pharmgkbFindings.length}`, "");
  lines.push("### Impact Distribution");
  lines.push(`- \u{1F534} **High Impact (magnitude ≥3):** ${high.length}`);
  lines.push(`- \u{1F7E1} **Moderate Impact (magnitude 2):** ${mod.length}`);
  lines.push(`- \u{1F7E2} **Low Impact (magnitude 1):** ${low.length}`);
  lines.push(`- ⚪ **Informational (magnitude 0):** ${findings.length - high.length - mod.length - low.length}`, "");
  lines.push("### Pharmacogenomics");
  lines.push(`- \u{1F535} **Level 1 (Clinical Guidelines):** ${level1.length}`);
  lines.push(`- \u{1F7E3} **Level 2 (Moderate Evidence):** ${level2.length}`, "");
  lines.push("### Categories Covered");
  for (const cat of categories) {
    const count = findings.filter((f) => f.category === cat).length;
    lines.push(`- ${cat}: ${count} findings`);
  }
  lines.push("", "---", "");
  return lines.join("\n");
}

function generatePriorityFindings(findings, clinicalContext, pathways) {
  const high = findings.filter((f) => f.magnitude >= 3);
  const mod = findings.filter((f) => f.magnitude === 2);

  const lines = [];
  lines.push("## \u{1F534} Priority Findings (High Impact)", "");
  lines.push("These findings have the most significant implications for your health decisions.", "");
  high.forEach((f, i) => lines.push(generateFindingSection(f, i + 1, clinicalContext, pathways)));

  if (mod.length) {
    lines.push("## \u{1F7E1} Moderate Impact Findings", "");
    lines.push("These findings warrant attention and may influence health decisions.", "");
    mod.forEach((f, i) => lines.push(generateFindingSection(f, i + 1, clinicalContext, pathways)));
  }
  return lines.join("\n");
}

function generatePathwayAnalysis(findings, pathways) {
  const lines = [];
  lines.push("## \u{1F517} Pathway Analysis", "");
  lines.push("Your genes grouped by biological pathway, showing how multiple variants may interact.", "");

  for (const [pathwayName, genes] of Object.entries(pathways)) {
    const pathwayFindings = findings.filter((f) => genes.includes(f.gene));
    if (!pathwayFindings.length) continue;

    lines.push(`### ${pathwayName}`, "");
    for (const f of pathwayFindings) {
      const icon = f.magnitude >= 3 ? "\u{1F534}" : f.magnitude === 2 ? "\u{1F7E1}" : f.magnitude === 1 ? "\u{1F7E2}" : "⚪";
      lines.push(`- ${icon} **${f.gene}:** ${titleCase(f.status)}`);
    }
    lines.push("");

    if (pathwayName === "Methylation Cycle") {
      const mthfr = pathwayFindings.find((f) => f.gene === "MTHFR" && f.magnitude >= 2);
      const mtrr = pathwayFindings.find((f) => f.gene === "MTRR" && f.magnitude >= 2);
      if (mthfr && mtrr) {
        lines.push(
          "⚠️ **Pathway Impact:** Multiple methylation cycle variants detected. Consider comprehensive methylation support (methylfolate + methylcobalamin + B2).",
          ""
        );
      }
    } else if (pathwayName === "Blood Pressure") {
      const bp = pathwayFindings.filter((f) => f.magnitude >= 1);
      if (bp.length >= 2) {
        lines.push(
          "⚠️ **Pathway Impact:** Multiple blood pressure-related variants. Recommend regular monitoring and lifestyle optimization.",
          ""
        );
      }
    }
    lines.push("---", "");
  }
  return lines.join("\n");
}

function generateFullFindings(findings, clinicalContext) {
  const categories = [...new Set(findings.map((f) => f.category || "Other"))].sort();
  const lines = [];
  lines.push("## Complete Findings by Category", "");
  lines.push("Every genetic finding analyzed, organized by category.", "");

  for (const category of categories) {
    const catFindings = findings.filter((f) => f.category === category);
    if (!catFindings.length) continue;
    lines.push(`### \u{1F4C2} ${category}`, "");
    catFindings.sort((a, b) => b.magnitude - a.magnitude);

    catFindings.forEach((f, i) => {
      const status = titleCase(f.status);
      const magIcon = f.magnitude >= 3 ? "\u{1F534}" : f.magnitude === 2 ? "\u{1F7E1}" : f.magnitude === 1 ? "\u{1F7E2}" : "⚪";
      lines.push(`#### ${i + 1}. ${f.gene} (${f.rsid}) ${magIcon}`);
      lines.push(`- **Genotype:** \`${f.genotype}\` | **Status:** ${status} | **Impact:** ${f.magnitude}/6`);
      lines.push(`- ${f.description}`);

      const context = getClinicalContext(clinicalContext, f.gene, f.status);
      if (context) {
        lines.push(`- **Mechanism:** ${context.mechanism.slice(0, 200)}...`);
        if (context.actions?.length) lines.push(`- **Key Action:** ${context.actions[0]}`);
      }
      lines.push("");
    });
    lines.push("---", "");
  }
  return lines.join("\n");
}

function generatePharmgkbReport(pharmgkbFindings) {
  const lines = [];
  lines.push("## \u{1F48A} Pharmacogenomics - Complete Drug-Gene Interactions", "");
  lines.push(
    "This section contains all drug-gene interactions from PharmGKB with clinical annotations.",
    "Share this information with prescribing physicians before starting new medications.",
    ""
  );

  const byLevel = (level) => pharmgkbFindings.filter((f) => f.level === level);
  const sections = [
    ["1A", "Level 1A - Highest Evidence (Clinical Guideline Annotations)"],
    ["1B", "Level 1B - High Evidence (Clinical Guideline Annotations)"],
    ["2A", "Level 2A - Moderate Evidence"],
    ["2B", "Level 2B - Moderate Evidence"],
  ];
  for (const [level, heading] of sections) {
    const items = byLevel(level);
    if (!items.length) continue;
    lines.push(`### ${heading}`, "");
    items.forEach((f, i) => lines.push(generatePharmgkbSection(f, i + 1)));
  }
  return lines.join("\n");
}

function generateActionSummary(findings, clinicalContext) {
  const lines = [];
  lines.push("## \u{1F4CB} Comprehensive Action Summary", "");

  const buckets = { supplement: [], diet: [], lifestyle: [], monitoring: [], medical: [] };
  const has = (s, words) => words.some((w) => s.includes(w));

  for (const finding of findings) {
    const context = getClinicalContext(clinicalContext, finding.gene, finding.status);
    if (!context?.actions) continue;
    for (const action of context.actions) {
      const a = action.toLowerCase();
      const line = `- ${action} *(from ${finding.gene})*`;
      if (has(a, ["supplement", "vitamin", "mg", "mcg", "iu", "dose"])) buckets.supplement.push(line);
      else if (has(a, ["diet", "eat", "food", "limit", "avoid", "meal"])) buckets.diet.push(line);
      else if (has(a, ["exercise", "sleep", "stress", "meditation"])) buckets.lifestyle.push(line);
      else if (has(a, ["test", "monitor", "check", "measure"])) buckets.monitoring.push(line);
      else if (has(a, ["doctor", "physician", "medical", "prescrib"])) buckets.medical.push(line);
    }
  }

  const dedupe = (arr) => [...new Set(arr)];

  if (buckets.supplement.length) {
    lines.push("### \u{1F48A} Supplement Considerations", "*Discuss with healthcare provider before starting*", "");
    lines.push(...dedupe(buckets.supplement).slice(0, 15), "");
  }
  if (buckets.diet.length) {
    lines.push("### \u{1F957} Dietary Recommendations", "");
    lines.push(...dedupe(buckets.diet).slice(0, 10), "");
  }
  if (buckets.lifestyle.length) {
    lines.push("### \u{1F3C3} Lifestyle Actions", "");
    lines.push(...dedupe(buckets.lifestyle).slice(0, 10), "");
  }
  if (buckets.monitoring.length) {
    lines.push("### \u{1F4CA} Monitoring Recommendations", "");
    lines.push(...dedupe(buckets.monitoring).slice(0, 10), "");
  }
  if (buckets.medical.length) {
    lines.push("### \u{1F3E5} Medical Considerations", "");
    lines.push(...dedupe(buckets.medical).slice(0, 10), "");
  }
  lines.push("---", "");
  return lines.join("\n");
}

function generateDisclaimer() {
  return `## ⚠️ Important Disclaimer

This report is for **informational and educational purposes only**. It is NOT medical advice.

### Key Points:
- Genetic associations are probabilistic, not deterministic
- Your genes are just one factor - environment, lifestyle, and other genes matter
- "Risk" variants don't guarantee outcomes; "protective" variants don't guarantee safety
- Consult healthcare providers before making medical decisions
- Some findings may have different implications in different populations
- Genetic science evolves - recommendations may change as research advances

### How to Use This Report:
1. **Share with providers** - Especially the pharmacogenomics section before new medications
2. **Focus on actionable items** - Prioritize evidence-based interventions
3. **Don't over-interpret** - One gene doesn't define your health destiny
4. **Combine with testing** - Many recommendations include follow-up lab tests

---

*Report generated entirely in your browser. Your genetic data was never uploaded anywhere.*
`;
}

export function generateLifestyleReport(results, refdata, subjectName) {
  const { clinicalContext, pathways } = refdata;
  const parts = [
    generateExecutiveSummary(results),
    generatePriorityFindings(results.findings, clinicalContext, pathways),
    generatePathwayAnalysis(results.findings, pathways),
    generateFullFindings(results.findings, clinicalContext),
    generatePharmgkbReport(results.pharmgkbFindings),
    generateActionSummary(results.findings, clinicalContext),
    generateDisclaimer(),
  ];
  let report = parts.join("\n");
  if (subjectName) {
    report = report.replace(
      "# Exhaustive Genetic Health Report",
      `# Exhaustive Genetic Health Report\n\n**Subject:** ${subjectName}`
    );
  }
  return report;
}
