/**
 * "Actionable Health Protocol" generator — synthesizes lifestyle findings,
 * PharmGKB interactions, and ClinVar disease findings into one protocol.
 * Ported from scripts/run_full_analysis.py::generate_actionable_protocol.
 */
import { carrierPhenotypeNotes } from "./disease.js";

export function generateProtocol(healthResults, diseaseAnalysis, classification, subjectName) {
  const now = new Date().toISOString().slice(0, 16).replace("T", " ");
  const subjectLine = subjectName ? `\n**Subject:** ${subjectName}` : "";

  const findingsDict = {};
  for (const f of healthResults.findings) findingsDict[f.gene] = f;

  const { affected, carriers, hetUnknown } = classification;
  const diseaseFindings = diseaseAnalysis?.findings || {};

  const totalLifestyle = healthResults.findings.length;
  const totalPharmgkb = healthResults.pharmgkbFindings.length;
  const totalRiskFactors = diseaseFindings.risk_factor?.length || 0;
  const totalDrugResponse = diseaseFindings.drug_response?.length || 0;
  const totalProtective = diseaseFindings.protective?.length || 0;

  let report = `# Actionable Health Protocol (V3)
${subjectLine}
**Generated:** ${now}

This protocol synthesizes ALL genetic findings into concrete recommendations:
- Lifestyle/health genetics (${totalLifestyle} findings)
- PharmGKB drug interactions (${totalPharmgkb} interactions)
- Pathogenic/likely pathogenic variants (${affected.length} affected, ${carriers.length} carrier, ${hetUnknown.length} unclear)
- Risk factors (${totalRiskFactors} variants)
- ClinVar drug response (${totalDrugResponse} variants)
- Protective variants (${totalProtective} variants)

---

## Executive Summary

### High-Impact Lifestyle Findings (Magnitude >= 3)

`;

  const highImpact = healthResults.findings.filter((f) => f.magnitude >= 3);
  if (highImpact.length) {
    for (const f of highImpact) report += `- **${f.gene}** (${f.category}): ${f.description}\n`;
  } else {
    report += "None detected.\n";
  }

  report += "\n### Pathogenic/Likely Pathogenic Variants\n\n";

  const firstTrait = (f) => (f.traits ? f.traits.split(";")[0] : "Unknown condition");
  const confidenceStr = (stars) => (stars > 0 ? `(${stars}/4 stars)` : "(low confidence)");

  if (affected.length) {
    report += "**Affected Status:**\n";
    for (const f of affected) report += `- **${f.gene}**: ${firstTrait(f)} ${confidenceStr(f.gold_stars)}\n`;
    report += "\n";
  }
  if (carriers.length) {
    report += "**Carrier Status (Recessive):**\n";
    for (const f of carriers) report += `- **${f.gene}**: ${firstTrait(f)} ${confidenceStr(f.gold_stars)}\n`;
    report += "\n";
  }
  if (hetUnknown.length) {
    report += "**Heterozygous (Inheritance Unclear):**\n";
    for (const f of hetUnknown) report += `- **${f.gene}**: ${firstTrait(f)} ${confidenceStr(f.gold_stars)}\n`;
    report += "\n";
  }
  if (!affected.length && !carriers.length && !hetUnknown.length) {
    report += "None detected.\n\n";
  }

  report += "### Protective Variants\n\n";
  if (diseaseFindings.protective?.length) {
    for (const f of diseaseFindings.protective) report += `- **${f.gene}**: ${firstTrait(f)}\n`;
  } else {
    report += "None detected.\n";
  }

  report += `

---

## Supplement Recommendations

*Discuss with healthcare provider before starting any supplements*

`;

  const supplements = [];
  const has = (gene) => findingsDict[gene];
  const statusOf = (gene) => findingsDict[gene]?.status;

  if (has("MTHFR") && findingsDict.MTHFR.magnitude >= 2) {
    supplements.push({
      name: "Methylfolate (L-5-MTHF)", dose: "400-800mcg daily",
      reason: "MTHFR variant reduces folic acid conversion",
      notes: "Avoid synthetic folic acid. Start low if slow COMT.",
    });
    supplements.push({
      name: "Methylcobalamin (B12)", dose: "1000mcg sublingual",
      reason: "Supports methylation cycle",
      notes: "Prefer methylcobalamin over cyanocobalamin",
    });
  }
  if (has("MTRR") && findingsDict.MTRR.magnitude >= 2) {
    if (!supplements.some((s) => s.name.includes("B12"))) {
      supplements.push({
        name: "Methylcobalamin (B12)", dose: "1000-5000mcg sublingual",
        reason: "MTRR variant impairs B12 recycling",
        notes: "May need higher doses than typical",
      });
    }
  }
  if (statusOf("GC") === "low") {
    supplements.push({
      name: "Vitamin D3", dose: "2000-5000 IU daily",
      reason: "Genetically low vitamin D binding protein",
      notes: "Take with fat. Test 25-OH-D after 2-3 months. Target 40-60 ng/mL.",
    });
    supplements.push({
      name: "Vitamin K2 (MK-7)", dose: "100-200mcg daily",
      reason: "Synergistic with D3 for calcium metabolism",
      notes: "Optional but recommended with high-dose D3",
    });
  }
  if (statusOf("FADS1") === "low_conversion") {
    supplements.push({
      name: "Fish Oil or Algae Oil (EPA/DHA)", dose: "1-2g EPA+DHA daily",
      reason: "Poor conversion from plant omega-3s (ALA)",
      notes: "Direct marine source required. Flax/chia insufficient.",
    });
  }
  if (statusOf("COMT") === "slow") {
    supplements.push({
      name: "Magnesium Glycinate", dose: "300-400mg evening",
      reason: "Supports COMT function, calming effect",
      notes: "Glycinate form preferred for bioavailability and sleep",
    });
  }
  if (has("PEMT")) {
    supplements.push({
      name: "Choline (Phosphatidylcholine or CDP-Choline)", dose: "250-500mg daily",
      reason: "PEMT variant increases dietary choline requirement",
      notes: "Eggs are excellent food source (2 eggs = ~300mg)",
    });
  }
  if (statusOf("BCMO1") === "reduced") {
    supplements.push({
      name: "Preformed Vitamin A or Cod Liver Oil", dose: "2500-5000 IU (as retinol)",
      reason: "Poor conversion from beta-carotene",
      notes: "Get from food (liver, eggs) or supplement. Avoid excess.",
    });
  }
  if (statusOf("IL6") === "high") {
    supplements.push({
      name: "Omega-3 (EPA/DHA)", dose: "2-3g daily",
      reason: "Higher baseline inflammation (IL-6)",
      notes: "Anti-inflammatory. Consider curcumin as well.",
    });
  }

  if (supplements.length) {
    report += "| Supplement | Dose | Reason | Notes |\n|------------|------|--------|-------|\n";
    for (const s of supplements) report += `| ${s.name} | ${s.dose} | ${s.reason} | ${s.notes} |\n`;
  } else {
    report += "No specific supplements indicated by genetic profile.\n";
  }

  report += `

---

## Dietary Recommendations

`;

  const dietRecs = [];
  if (statusOf("APOA2") === "sensitive") {
    dietRecs.push("**Limit saturated fat (<7% calories)**: APOA2 variant links sat fat intake to weight gain. Minimize butter, fatty red meat, full-fat dairy, coconut oil. Prefer olive oil, nuts, avocado.");
  }
  if (has("MTHFR") && findingsDict.MTHFR.magnitude >= 2) {
    dietRecs.push("**Emphasize folate-rich foods**: Leafy greens, legumes, liver. Avoid folic acid-fortified processed foods when possible (UMFA accumulation risk).");
  }
  if (has("IL6")) {
    dietRecs.push("**Anti-inflammatory diet**: Omega-3 rich fish, colorful vegetables, minimize processed foods. Sleep deprivation spikes IL-6.");
  }
  if ((findingsDict["MCM6/LCT"]?.status || "").includes("intolerant")) {
    dietRecs.push("**Lactose intolerance**: May tolerate small amounts or fermented dairy (yogurt, aged cheese). Lactase supplements available. Ensure calcium from other sources.");
  }
  if (has("HLA-DQA1")) {
    dietRecs.push("**Celiac risk (HLA-DQ2.5)**: No preventive gluten-free diet needed. If GI symptoms arise, get celiac antibody testing (tTG-IgA) *while still eating gluten*.");
  }

  const caffeineIssues = [];
  if (["slow", "intermediate"].includes(statusOf("CYP1A2"))) caffeineIssues.push("slow metabolizer");
  if (statusOf("ADORA2A") === "anxiety_prone") caffeineIssues.push("anxiety-prone");
  if (statusOf("COMT") === "slow") caffeineIssues.push("slow COMT");
  if (caffeineIssues.length) {
    dietRecs.push(`**Caffeine caution** (${caffeineIssues.join(", ")}): Limit to morning only (before 10am). Consider lower doses, green tea (L-theanine), or alternatives.`);
  }
  if (has("HFE")) {
    dietRecs.push("**Iron awareness (HFE carrier)**: Don't supplement iron unless deficiency confirmed. Blood donation helps regulate if ferritin runs high.");
  }

  if (dietRecs.length) {
    for (const rec of dietRecs) report += `- ${rec}\n\n`;
  } else {
    report += "No specific dietary modifications beyond general healthy eating.\n";
  }

  report += `
---

## Lifestyle Recommendations

`;

  const lifestyleRecs = [];
  if (statusOf("COMT") === "slow") {
    lifestyleRecs.push("**Stress management is critical**: Slow COMT means catecholamines (dopamine, norepinephrine) build up under stress. Daily meditation, breathwork, adequate sleep. Avoid combining multiple stimulants.");
  }
  if (has("BDNF") && findingsDict.BDNF.magnitude >= 2) {
    lifestyleRecs.push("**Exercise is essential**: BDNF variant reduces activity-dependent brain growth factor. Physical activity is one of the strongest natural BDNF boosters.");
  }
  if (has("ACTN3")) {
    const status = statusOf("ACTN3");
    if (status === "endurance") {
      lifestyleRecs.push("**Training style (ACTN3 endurance)**: Genetics favor endurance/aerobic training. Can still build strength but may excel at higher volume, aerobic work.");
    } else if (status === "power") {
      lifestyleRecs.push("**Training style (ACTN3 power)**: Genetics favor explosive/strength training. May recover faster from power-based work.");
    } else {
      lifestyleRecs.push("**Training style (ACTN3 mixed)**: Versatile profile - respond well to both power and endurance training.");
    }
  }
  if (has("ARNTL")) {
    lifestyleRecs.push("**Circadian rhythm support (ARNTL)**: May have weaker internal clock. Strong morning light exposure, consistent sleep/wake times even weekends, blue light reduction in evening.");
  }
  const bpGenes = ["AGTR1", "ACE", "AGT", "GNB3"];
  if (bpGenes.filter((g) => has(g)).length >= 2) {
    lifestyleRecs.push("**Blood pressure focus**: Multiple BP-related variants. Regular monitoring, sodium restriction, DASH diet pattern, 150+ min/week aerobic exercise.");
  }
  if (has("MC1R")) {
    lifestyleRecs.push("**Sun protection (MC1R)**: Accelerated skin aging variant. Daily SPF 30+, topical retinoids, antioxidant serums. Avoid excessive sun exposure.");
  }

  if (lifestyleRecs.length) {
    for (const rec of lifestyleRecs) report += `- ${rec}\n\n`;
  } else {
    report += "Standard healthy lifestyle recommendations apply.\n";
  }

  report += `
---

## Monitoring Recommendations

`;

  const monitoring = [];
  if (has("MTHFR") && findingsDict.MTHFR.magnitude >= 2) {
    monitoring.push("**Homocysteine**: Annually. Target <10 µmol/L. MTHFR variant affects metabolism.");
  }
  if (has("MTRR") && findingsDict.MTRR.magnitude >= 2) {
    monitoring.push("**B12 + Methylmalonic acid (MMA)**: For functional B12 status. MTRR affects recycling.");
  }
  if (has("GC")) {
    monitoring.push("**25-OH Vitamin D**: After 2-3 months supplementation, then annually. Target 40-60 ng/mL.");
  }
  if (bpGenes.some((g) => has(g))) {
    monitoring.push("**Blood pressure**: Home monitoring recommended. Multiple BP-related variants.");
  }
  if (has("HFE")) {
    monitoring.push("**Ferritin/iron panel**: Every 1-2 years. HFE carrier status.");
  }
  if (has("TCF7L2") && findingsDict.TCF7L2.magnitude >= 2) {
    monitoring.push("**Fasting glucose or HbA1c**: Annually. TCF7L2 diabetes risk variant.");
  }

  if (diseaseFindings.risk_factor?.length) {
    const riskConditions = new Set();
    for (const f of diseaseFindings.risk_factor) {
      const traits = (f.traits || "").toLowerCase();
      if (traits.includes("macular degeneration")) riskConditions.add("macular_degeneration");
      if (traits.includes("diabetes")) riskConditions.add("diabetes");
      if (traits.includes("hypertension")) riskConditions.add("hypertension");
      if (traits.includes("thrombosis") || traits.includes("thromboembolism")) riskConditions.add("thrombosis");
    }
    if (riskConditions.has("macular_degeneration")) {
      monitoring.push("**Eye exams**: Regular ophthalmology. Multiple age-related macular degeneration risk variants (CFH, C3, ERCC6).");
    }
    if (riskConditions.has("diabetes") && !has("TCF7L2")) {
      monitoring.push("**Glucose monitoring**: Multiple diabetes susceptibility variants detected.");
    }
    if (riskConditions.has("thrombosis")) {
      monitoring.push("**Clotting awareness**: Risk variants for venous thrombosis (F13B, FGA). Stay hydrated, move on long flights, know DVT symptoms.");
    }
  }

  if (monitoring.length) {
    for (const m of monitoring) report += `- ${m}\n`;
  } else {
    report += "Standard health monitoring appropriate for age.\n";
  }

  report += `

---

## Drug-Gene Interactions

**Share this section with prescribing physicians.**

### PharmGKB Level 1 (Clinical Guidelines Exist)

`;

  const level1 = healthResults.pharmgkbFindings.filter((f) => ["1A", "1B"].includes(f.level));
  if (level1.length) {
    report += "| Gene | Level | Drugs | Your Genotype |\n|------|-------|-------|---------------|\n";
    for (const f of level1) {
      const drugs = f.drugs.length > 50 ? f.drugs.slice(0, 50) + "..." : f.drugs;
      report += `| ${f.gene} | ${f.level} | ${drugs} | \`${f.genotype}\` |\n`;
    }
  } else {
    report += "None detected.\n";
  }

  report += "\n### PharmGKB Level 2 (Moderate Evidence)\n\n";
  const level2 = healthResults.pharmgkbFindings.filter((f) => ["2A", "2B"].includes(f.level));
  if (level2.length) {
    report += "| Gene | Level | Drugs | Your Genotype |\n|------|-------|-------|---------------|\n";
    for (const f of level2.slice(0, 15)) {
      const drugs = f.drugs.length > 50 ? f.drugs.slice(0, 50) + "..." : f.drugs;
      report += `| ${f.gene} | ${f.level} | ${drugs} | \`${f.genotype}\` |\n`;
    }
    if (level2.length > 15) report += `\n*...and ${level2.length - 15} more Level 2 interactions*\n`;
  } else {
    report += "None detected.\n";
  }

  report += "\n### ClinVar Drug Response Variants\n\n";
  if (diseaseFindings.drug_response?.length) {
    report += "| Gene | RSID | Genotype | Drug/Response |\n|------|------|----------|---------------|\n";
    for (const f of diseaseFindings.drug_response.slice(0, 20)) {
      const traits = (f.traits || "").length > 60 ? f.traits.slice(0, 60) + "..." : f.traits;
      report += `| ${f.gene || "—"} | ${f.rsid} | \`${f.user_genotype}\` | ${traits} |\n`;
    }
    if (diseaseFindings.drug_response.length > 20) {
      report += `\n*...and ${diseaseFindings.drug_response.length - 20} more drug response variants*\n`;
    }
  } else {
    report += "None detected.\n";
  }

  report += `

---

## Carrier Status Notes

`;

  const allCarrierGenes = [...carriers, ...hetUnknown].map((f) => (f.gene || "").toUpperCase());
  let foundCarriers = false;
  for (const gene of ["CFTR", "HBB", "GBA", "SERPINA1"]) {
    if (allCarrierGenes.includes(gene)) {
      report += carrierPhenotypeNotes(gene) + "\n";
      foundCarriers = true;
    }
  }
  const cftrFinding = hetUnknown.find((f) => (f.gene || "").toUpperCase() === "CFTR");
  if (cftrFinding && !allCarrierGenes.includes("CFTR")) {
    report += carrierPhenotypeNotes("CFTR") + "\n";
    foundCarriers = true;
  }
  if (!foundCarriers) {
    if (carriers.length || hetUnknown.length) {
      report += "Carrier status detected but no specific phenotype notes available for these genes. General recommendation: genetic counseling if planning pregnancy.\n";
    } else {
      report += "No carrier status detected.\n";
    }
  }

  report += `

---

## Risk Factor Summary

*These variants indicate increased susceptibility, not certainty of disease.*

`;

  if (diseaseFindings.risk_factor?.length) {
    const conditions = {};
    const addTo = (name, gene) => {
      conditions[name] = conditions[name] || [];
      if (gene) conditions[name].push(gene);
    };
    for (const f of diseaseFindings.risk_factor) {
      const traits = (f.traits || "").toLowerCase();
      const gene = f.gene || "Unknown";
      if (traits.includes("hypertension")) addTo("Hypertension", gene);
      else if (traits.includes("diabetes")) addTo("Diabetes", gene);
      else if (traits.includes("macular degeneration")) addTo("Macular Degeneration", gene);
      else if (traits.includes("thrombosis") || traits.includes("thromboembolism")) addTo("Thrombosis/Clotting", gene);
      else if (traits.includes("obesity")) addTo("Obesity", gene);
      else if (traits.includes("cancer") || traits.includes("carcinoma")) addTo("Cancer Risk", gene);
      else if (traits.includes("inflammatory bowel") || traits.includes("crohn")) addTo("Inflammatory Bowel Disease", gene);
    }
    const names = Object.keys(conditions).sort();
    if (names.length) {
      report += "| Condition | Genes Involved |\n|-----------|----------------|\n";
      for (const name of names) {
        const uniqueGenes = [...new Set(conditions[name].filter(Boolean))].slice(0, 5);
        report += `| ${name} | ${uniqueGenes.join(", ")} |\n`;
      }
    } else {
      report += "Risk factors detected but not categorizable. See full disease risk report for details.\n";
    }
  } else {
    report += "No significant risk factors detected.\n";
  }

  report += `

---

## Disclaimer

This protocol synthesizes genetic findings from multiple sources for informational purposes.
It is NOT a clinical diagnosis or medical advice.

- Genetic associations are probabilistic, not deterministic
- Environmental factors, lifestyle, and other genes also influence outcomes
- Classifications evolve as research progresses
- Consult healthcare providers before making medical decisions

---

*Generated entirely in your browser — combining lifestyle genetics, PharmGKB, and ClinVar. Your genetic data was never uploaded anywhere.*
`;

  return report;
}
