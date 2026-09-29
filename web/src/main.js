import { marked } from "marked";
import { parseGenomeFile } from "./lib/genome.js";
import { loadRefData } from "./lib/refdata.js";
import { analyzeLifestyle, generateLifestyleReport } from "./lib/lifestyle.js";
import { analyzeDisease, generateDiseaseReport, classifyPathogenic } from "./lib/disease.js";
import { generateProtocol } from "./lib/protocol.js";
import { LLM_PROMPTS } from "./lib/llmPrompts.js";

const app = document.getElementById("app");

let selectedFile = null;

app.innerHTML = `
  <div class="header">
    <h1>Genetic Health Analysis</h1>
    <p>23andMe raw data → lifestyle, disease risk, and drug-interaction reports</p>
  </div>

  <div class="privacy-banner">
    <div class="icon">\u{1F512}</div>
    <div>
      <strong>Your genetic data never leaves this device.</strong>
      Everything runs locally in your browser — your genome file is never uploaded,
      transmitted, or stored on any server. Reference databases (ClinVar, PharmGKB) are
      loaded as static public files; only your genome stays on-device.
    </div>
  </div>

  <div class="panel" id="input-panel">
    <label class="field" for="subject-name">Subject name (optional, included in reports)</label>
    <input type="text" id="subject-name" placeholder="e.g. Jane Doe" />

    <label class="field">23andMe raw data file</label>
    <div class="dropzone" id="dropzone">
      <div>Drop your genome.txt file here, or click to choose</div>
      <div class="filename" id="filename"></div>
    </div>
    <input type="file" id="file-input" accept=".txt,.csv,.tsv" class="hidden" />

    <button class="btn-primary" id="analyze-btn" disabled>Analyze (locally, in-browser)</button>
    <div class="status-line" id="status-line"></div>
  </div>

  <div id="results" class="hidden"></div>

  <div class="footer-note">
    Informational only — not a clinical diagnosis. Consult a physician or genetic counselor.
  </div>
`;

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("file-input");
const filenameEl = document.getElementById("filename");
const analyzeBtn = document.getElementById("analyze-btn");
const statusLine = document.getElementById("status-line");
const resultsEl = document.getElementById("results");
const subjectNameInput = document.getElementById("subject-name");

dropzone.addEventListener("click", () => fileInput.click());
dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("dragover");
});
dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");
  if (e.dataTransfer.files.length) setFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener("change", () => {
  if (fileInput.files.length) setFile(fileInput.files[0]);
});

function setFile(file) {
  selectedFile = file;
  filenameEl.textContent = `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)`;
  analyzeBtn.disabled = false;
}

analyzeBtn.addEventListener("click", runAnalysis);

async function runAnalysis() {
  if (!selectedFile) return;
  analyzeBtn.disabled = true;
  resultsEl.classList.add("hidden");

  try {
    setStatus("Loading reference databases (ClinVar, PharmGKB, curated SNPs)…");
    const refdata = await loadRefData((key, done, total) => {
      setStatus(`Loading reference databases… (${done}/${total})`);
    });

    setStatus("Parsing your genome file locally in this browser…");
    const genome = await parseGenomeFile(selectedFile);

    setStatus("Matching lifestyle/health SNPs…");
    const healthResults = analyzeLifestyle(genome, refdata);

    setStatus("Matching against ClinVar for disease risk…");
    const diseaseAnalysis = analyzeDisease(genome, refdata);

    setStatus("Generating reports…");
    const subjectName = subjectNameInput.value.trim();

    const lifestyleReport = generateLifestyleReport(healthResults, refdata, subjectName);
    const { report: diseaseReport } = generateDiseaseReport(diseaseAnalysis, genome.totalSnps, subjectName);
    const classification = classifyPathogenic(diseaseAnalysis.findings);
    const protocolReport = generateProtocol(healthResults, diseaseAnalysis, classification, subjectName);

    renderResults({
      genome, healthResults, diseaseAnalysis, classification,
      reports: {
        "Actionable Protocol": protocolReport,
        "Lifestyle & Health": lifestyleReport,
        "Disease Risk": diseaseReport,
      },
      subjectName,
    });

    setStatus("Done. Nothing was uploaded — all processing happened in this tab.", false);
  } catch (err) {
    console.error(err);
    setStatus(`Error: ${err.message}`, false);
  } finally {
    analyzeBtn.disabled = false;
  }
}

function setStatus(text, spinning = true) {
  statusLine.innerHTML = spinning ? `<span class="spinner"></span>${text}` : text;
}

function renderResults({ genome, healthResults, diseaseAnalysis, classification, reports }) {
  resultsEl.classList.remove("hidden");

  const totalDisease =
    classification.affected.length + classification.carriers.length +
    diseaseAnalysis.findings.risk_factor.length;

  resultsEl.innerHTML = `
    <div class="panel">
      <div class="summary-grid">
        <div class="stat"><div class="num">${genome.totalSnps.toLocaleString()}</div><div class="label">SNPs read</div></div>
        <div class="stat"><div class="num">${healthResults.findings.length}</div><div class="label">Lifestyle findings</div></div>
        <div class="stat"><div class="num">${healthResults.pharmgkbFindings.length}</div><div class="label">Drug interactions</div></div>
        <div class="stat"><div class="num">${classification.affected.length}</div><div class="label">Pathogenic (affected)</div></div>
        <div class="stat"><div class="num">${classification.carriers.length}</div><div class="label">Carrier variants</div></div>
        <div class="stat"><div class="num">${diseaseAnalysis.findings.risk_factor.length}</div><div class="label">Risk factors</div></div>
      </div>
    </div>

    <div class="panel">
      <h3 class="llm-tip-heading">\u{1F4A1} Get an even simpler, actionable version</h3>
      <p class="llm-tip-body">
        These reports are thorough on purpose, which makes them dense. We recommend downloading
        a report below and uploading it to an LLM (ChatGPT, Claude, etc.) to get a plain-English
        summary and a concrete action plan. A few prompts to try, once you've uploaded the file:
      </p>
      <div class="llm-prompts" id="llm-prompts"></div>
      <p class="llm-tip-caveat">
        ⚠️ <strong>Privacy note:</strong> uploading a report to a cloud LLM sends that
        file to a third party — unlike your raw genome, which never leaves this tab. Only do
        this with a service you trust, and consider a locally-run model (e.g. Ollama, LM Studio)
        if you want the same on-device guarantee for this step too.
      </p>
    </div>

    <div class="panel">
      <div class="tabs" id="tabs"></div>
      <div class="report-toolbar">
        <button class="btn-secondary" id="download-btn">⬇ Download this report (.md)</button>
      </div>
      <div class="report-view" id="report-view"></div>
    </div>
  `;

  const tabsEl = document.getElementById("tabs");
  const reportView = document.getElementById("report-view");
  const downloadBtn = document.getElementById("download-btn");
  const names = Object.keys(reports);
  let active = names[0];

  function renderTab() {
    reportView.innerHTML = marked.parse(reports[active]);
    [...tabsEl.children].forEach((btn) => btn.classList.toggle("active", btn.dataset.name === active));
  }

  for (const name of names) {
    const btn = document.createElement("button");
    btn.className = "tab";
    btn.dataset.name = name;
    btn.textContent = name;
    btn.addEventListener("click", () => {
      active = name;
      renderTab();
    });
    tabsEl.appendChild(btn);
  }

  downloadBtn.addEventListener("click", () => {
    const blob = new Blob([reports[active]], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${active.replace(/[^a-z0-9]+/gi, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  });

  renderTab();

  const promptsEl = document.getElementById("llm-prompts");
  for (const { title, prompt } of LLM_PROMPTS) {
    const card = document.createElement("div");
    card.className = "llm-prompt-card";
    card.innerHTML = `
      <div class="llm-prompt-text">
        <div class="llm-prompt-title">${title}</div>
        <div class="llm-prompt-body">${prompt}</div>
      </div>
      <button class="btn-secondary llm-copy-btn">Copy</button>
    `;
    const copyBtn = card.querySelector(".llm-copy-btn");
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(prompt);
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
      } catch {
        copyBtn.textContent = "Select & copy manually";
      }
    });
    promptsEl.appendChild(card);
  }

  resultsEl.scrollIntoView({ behavior: "smooth" });
}
