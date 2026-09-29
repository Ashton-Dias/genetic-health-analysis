/**
 * Parses a 23andMe raw-data export entirely in memory. The File object is
 * read via FileReader — its contents never leave this tab (no fetch/XHR/
 * form submission is performed on it anywhere in this codebase).
 */
export async function parseGenomeFile(file) {
  const text = await file.text();

  const byRsid = new Map();
  const byPosition = new Map();

  const lines = text.split("\n");
  for (const line of lines) {
    if (!line || line[0] === "#") continue;
    const parts = line.split("\t");
    if (parts.length < 4) continue;

    const rsid = parts[0].trim();
    const chrom = parts[1].trim();
    const pos = parts[2].trim();
    const genotype = parts[3].trim();

    if (!genotype || genotype === "--") continue;

    byRsid.set(rsid, { chromosome: chrom, position: pos, genotype });
    byPosition.set(`${chrom}:${pos}`, { rsid, genotype });
  }

  return { byRsid, byPosition, totalSnps: byRsid.size };
}
