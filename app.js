import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.2";

// The model is open-weight and inference happens in the user's browser.
// First launch downloads model files from Hugging Face; the browser may cache them.
env.allowLocalModels = false;
env.useBrowserCache = true;

const MODEL_ID = "onnx-community/Qwen2.5-0.5B-Instruct";
const $ = (id) => document.getElementById(id);
const input = $("brainDump");
const output = $("output");
const status = $("modelStatus");
const statusDot = $("statusDot");
const planBtn = $("planBtn");
const draftBtn = $("draftBtn");
let generator = null;
let busy = false;

function setStatus(message, state = "") {
  status.textContent = message;
  statusDot.className = "status-dot " + state;
}
function setBusy(value) {
  busy = value;
  planBtn.disabled = value;
  draftBtn.disabled = value;
  planBtn.style.opacity = value ? ".65" : "1";
  draftBtn.style.opacity = value ? ".65" : "1";
}
function showOutput(text) {
  output.className = "output";
  output.innerHTML = "";
  const content = document.createElement("div");
  content.className = "result-content";
  content.textContent = text;
  output.appendChild(content);
  $("copyBtn").disabled = false;
}
async function getModel() {
  if (generator) return generator;
  setStatus("Waking up the local model… first run may take a little while.", "busy");
  generator = await pipeline("text-generation", MODEL_ID, {
    dtype: "q4",
    device: "wasm"
  });
  return generator;
}
async function runAI(mode) {
  const taskText = input.value.trim();
  if (!taskText) {
    input.focus();
    setStatus("Add a few thoughts first — even a messy list is fine.");
    return;
  }
  if (busy) return;
  setBusy(true);
  try {
    const model = await getModel();
    const prompt = mode === "draft"
      ? `You are LazyDesk, a gentle writing helper. Draft one short, warm, low-pressure message based on the user's notes. If recipient or context is unclear, create a flexible draft with placeholders. Do not invent facts.\nNotes: ${taskText}\nMessage draft:`
      : `You are LazyDesk, a calm practical assistant. Turn these notes into a gentle, realistic plan. Use plain text with these headings: "The tiny plan", "Start here (5 minutes)", "Can wait", and "A kind reminder". Choose at most 3 priority tasks, split tasks into tiny steps, avoid guilt or hustle language, and do not invent deadlines. If the notes are vague, make reasonable suggestions and label them as suggestions.\nNotes: ${taskText}\nPlan:`;
    setStatus("Thinking gently… your text stays in this browser.", "busy");
    const result = await model(prompt, {
      max_new_tokens: mode === "draft" ? 180 : 300,
      temperature: 0.6,
      do_sample: true,
      return_full_text: false
    });
    let answer = result?.[0]?.generated_text?.trim() || "";
    if (!answer) answer = "I couldn't make a plan from that just yet. Try a shorter list or different wording.";
    showOutput(answer);
    setStatus("Done. One small step is enough.", "ready");
  } catch (error) {
    console.error(error);
    generator = null;
    setStatus("The model couldn't load. Check your connection and try again.", "");
    showOutput("I couldn't start the local model. The first run needs internet to download the model files. Try again, or check the browser console for details. No API key is required.");
  } finally {
    setBusy(false);
  }
}
input.addEventListener("input", () => $("charCount").textContent = `${input.value.length} characters`);
$("focusInput").addEventListener("click", () => { input.focus(); input.scrollIntoView({behavior:"smooth",block:"center"}); });
$("exampleBtn").addEventListener("click", () => {
  input.value = "Reply to Sam about Saturday (I don't know what to say yet)\nMake something easy for dinner\nClean up my downloads folder\nRemember to stretch or go for a short walk\nI keep putting off booking a dentist appointment";
  input.dispatchEvent(new Event("input"));
});
planBtn.addEventListener("click", () => runAI("plan"));
draftBtn.addEventListener("click", () => runAI("draft"));
$("copyBtn").addEventListener("click", async () => {
  const text = output.innerText.trim();
  try {
    await navigator.clipboard.writeText(text);
    $("copyBtn").textContent = "Copied ✓";
    setTimeout(() => $("copyBtn").textContent = "Copy plan", 1400);
  } catch {
    setStatus("Clipboard access is blocked by this browser. Select and copy the text manually.");
  }
});
$("clearBtn").addEventListener("click", () => {
  output.className = "output empty";
  output.innerHTML = '<div class="empty-art">☁️</div><h3>Nothing to solve all at once.</h3><p>Your plan will appear here, in small steps. Start with one thing. Or take a break first.</p>';
  $("copyBtn").disabled = true;
  setStatus(generator ? "Local model is ready when you are." : "AI is resting. Ready when you are.");
});
