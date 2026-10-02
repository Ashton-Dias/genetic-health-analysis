import "@fontsource-variable/inter";
import "@fontsource/instrument-serif/400-italic.css";
import "./style.css";
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
  <header class="topbar on-dark">
    <a class="brand" href="#top" aria-label="Genetic Health Analysis">
      <span class="brand-mark">gh</span>
      <span class="brand-sub">Genetic<br />Health</span>
    </a>
    <nav class="nav" aria-label="Sections">
      <a href="#privacy">Privacy</a>
      <a href="#analyze">Analyze</a>
      <a href="#disclaimer">Disclaimer</a>
    </nav>
  </header>

  <section class="hero on-dark" id="top">
    <div class="hero-meta">
      <span class="mono">23andMe raw data<br />Reports in seconds</span>
      <span class="mono hero-meta-right">Private<br />In-browser. Nothing uploaded.</span>
    </div>
    <svg class="hero-figure" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <circle cx="200" cy="200" r="180" />
      <circle cx="200" cy="200" r="120" />
      <ellipse cx="200" cy="200" rx="150" ry="60" transform="rotate(35 200 200)" />
      <ellipse cx="200" cy="200" rx="150" ry="60" transform="rotate(-35 200 200)" />
      <ellipse cx="200" cy="200" rx="150" ry="60" transform="rotate(90 200 200)" />
      <path class="cross" d="M200 8v24M200 368v24M8 200h24M368 200h24" />
    </svg>
    <div class="hero-copy">
      <p class="eyebrow mono"><span class="rule"></span>Genetic Health Analysis</p>
      <h1 class="hero-title">Your genome.<br />On your device.</h1>
      <p class="hero-italic" aria-hidden="true">Private.</p>
      <p class="hero-lede">
        Drop in your 23andMe data and get back lifestyle, disease-risk and drug-interaction reports.
      </p>
      <a class="link-cta mono" href="#analyze">Start the analysis <span aria-hidden="true">\u2198</span></a>
    </div>
  </section>

  <section class="section on-dark" id="privacy">
    <div class="wrap">
      <p class="marker mono">01 / Privacy</p>
      <h2 class="section-title">Your genetic data <em>isn't going anywhere.</em></h2>
      <p class="prose-lg">
        This all runs locally, right here in your browser. Your genome file never gets
        uploaded, sent anywhere, or stored on some server somewhere. The reference data
        (ClinVar, PharmGKB) just loads as static files; your actual genome stays on your machine.
      </p>
    </div>
  </section>

  <section class="section" id="analyze">
    <div class="wrap">
      <p class="marker mono">02 / Analyze</p>
      <h2 class="section-title">Bring your <em>file.</em></h2>

      <div class="panel" id="input-panel">
        <label class="field mono" for="subject-name">Your name (optional, shows up in the reports)</label>
        <input type="text" id="subject-name" placeholder="e.g. Jane Doe" />

        <label class="field mono" for="file-input">23andMe raw data file</label>
        <div class="dropzone" id="dropzone" role="button" tabindex="0">
          <div class="dropzone-label mono">Drop your genome.txt here, or click to choose <span aria-hidden="true">\u2197</span></div>
          <div class="filename mono" id="filename"></div>
        </div>
        <input type="file" id="file-input" accept=".txt,.csv,.tsv" class="hidden" />

        <button class="btn-primary mono" id="analyze-btn" disabled>Analyze (locally, in-browser) <span aria-hidden="true">\u2198</span></button>
        <div class="status-line mono" id="status-line" role="status" aria-live="polite"></div>
      </div>

      <div id="results" class="hidden"></div>
    </div>
  </section>

  <footer class="footer on-dark" id="disclaimer">
    <div class="wrap">
      <p class="marker mono">03 / Disclaimer</p>
      <p class="disclaimer">
        Just informational, not a diagnosis. Go talk to a real doctor or genetic counselor.
      </p>
    </div>
  </footer>
`;

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("file-input");
const filenameEl = document.getElementById("filename");
const analyzeBtn = document.getElementById("analyze-btn");
const statusLine = document.getElementById("status-line");
const resultsEl = document.getElementById("results");
const subjectNameInput = document.getElementById("subject-name");

dropzone.addEventListener("click", () => fileInput.click());
dropzone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fileInput.click();
  }
});
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
      <p class="marker mono">Next step</p>
      <h3 class="llm-tip-heading">Do this next, <em>seriously.</em></h3>
      <p class="llm-tip-body">
        This report is dense because it's trying to be thorough, not because it's trying to be
        useful on its own. Grab it below and paste it into an LLM (ChatGPT, Claude, whatever) and
        talk to it like it's your own personal doctor who's actually read your DNA — ask it what
        <em>you</em> specifically should do about <em>your</em> specific genome. That's the real
        payoff here. Some prompts worth stealing, once you've uploaded the file:
      </p>
      <div class="llm-prompts" id="llm-prompts"></div>
      <p class="llm-tip-caveat">
        <strong>One catch:</strong> a cloud LLM actually gets a copy of this file —
        unlike your raw genome, which never left this tab. Only do this with a service you
        actually trust, or run a local model (Ollama, LM Studio) if you want that same
        on-device guarantee for this part too.
      </p>
    </div>

    <div class="panel">
      <div class="tabs" id="tabs"></div>
      <div class="report-toolbar">
        <button class="btn-secondary mono" id="download-btn">Download this report (.md) <span aria-hidden="true">\u2197</span></button>
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
    btn.className = "tab mono";
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
      <button class="btn-secondary mono llm-copy-btn">Copy</button>
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
