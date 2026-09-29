/**
 * Loads the static reference databases (curated SNP interpretations,
 * ClinVar, PharmGKB). These are public reference data bundled with the
 * site — no user genetic data is ever sent anywhere to fetch them.
 */
let cached = null;

export async function loadRefData(onProgress) {
  if (cached) return cached;

  const base = import.meta.env.BASE_URL + "refdata/";
  // PharmGKB's redistribution terms are more restrictive than ClinVar's
  // (public domain), so pharmgkb.json is gitignored and won't exist in a
  // fresh clone/deploy unless someone regenerates it locally with their own
  // PharmGKB download. Missing drug-interaction data degrades gracefully,
  // same as the CLI pipeline does when PharmGKB files aren't present.
  const required = [
    ["comprehensiveSnps", "comprehensive_snps.json"],
    ["clinicalContext", "clinical_context.json"],
    ["pathways", "pathways.json"],
    ["clinvar", "clinvar_snps.json"],
  ];
  const optional = [["pharmgkb", "pharmgkb.json"]];

  const result = {};
  const files = [...required, ...optional];
  let done = 0;
  for (const [key, filename] of required) {
    onProgress?.(key, done, files.length);
    const res = await fetch(base + filename);
    if (!res.ok) throw new Error(`Failed to load reference data: ${filename}`);
    result[key] = await res.json();
    done += 1;
    onProgress?.(key, done, files.length);
  }
  for (const [key, filename] of optional) {
    onProgress?.(key, done, files.length);
    try {
      const res = await fetch(base + filename);
      result[key] = res.ok ? await res.json() : {};
    } catch {
      result[key] = {};
    }
    done += 1;
    onProgress?.(key, done, files.length);
  }

  cached = result;
  return result;
}
