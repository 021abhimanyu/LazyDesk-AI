# LazyDesk AI 🦥

**A small local-first AI helper for people who want to do less, not optimize every minute.** Built for the Hacktoberfest “Slow and Steady” challenge.

Live demo can be hosted with GitHub Pages. The app turns a messy brain dump into a tiny plan or drafts a short message using an open-weight model in the browser.

## What it does

- **Brain dump → tiny plan:** prioritizes a few tasks, breaks one down into a 5-minute start, and identifies what can wait.
- **Message draft:** turns rough notes into a low-pressure message.
- **Local-first inference:** uses `onnx-community/Qwen2.5-0.5B-Instruct` through Hugging Face Transformers.js.
- **No app backend or AI API key:** prompts are sent to the model running in the browser, not to a hosted inference endpoint.
- **Responsive, accessible interface:** works on desktop and mobile layouts.

## Open-source AI at the core

LazyDesk uses the open-weight Qwen2.5 0.5B Instruct model, served in ONNX format, with [Transformers.js](https://github.com/huggingface/transformers.js). The model is loaded in the browser and inference is run with the WebAssembly backend. The app's planning behavior is controlled by prompts in `app.js`, so developers can change the instructions or swap the model without redesigning the product.

### Why open innovation matters

- **Privacy:** the app does not send a user's brain dump to an application server or third-party inference API. Model files are downloaded from the model host on first use; user prompts are processed locally.
- **Control:** the prompt, task policy, and model choice are visible and editable in the repository.
- **Cost:** there is no paid API key or per-request inference bill. The user's device does the work.
- **Adaptability:** contributors can change the tone, priorities, model, or output format and submit improvements openly.

### Honest limitations

- The first launch requires internet access to download the JavaScript library and model files.
- Browser caching may allow later use without internet, but this depends on the browser and whether every required asset is cached. This starter does **not** promise guaranteed offline operation.
- A 0.5B model is small and can produce imperfect, repetitive, or inaccurate results. Review generated messages and plans before acting on them.
- Local inference uses device memory and CPU; older devices may be slow.
- The model is downloaded from Hugging Face. Check the model card and license before redistributing or deploying a modified version.

## Run locally

Because this uses JavaScript modules, serve the folder through a local web server instead of opening `index.html` directly.

### Python
```bash
python -m http.server 8000
```
Then open <http://localhost:8000>.

### VS Code
Install the Live Server extension, right-click `index.html`, and choose **Open with Live Server**.

## Deploy to GitHub Pages

1. Create a GitHub repository and upload these files to its root.
2. Open **Settings → Pages**.
3. Under build and deployment, choose **Deploy from a branch**.
4. Select your default branch and `/ (root)`, then save.
5. Wait for GitHub Pages to publish the site.

No environment variables or API keys are required.

## Project structure

```text
lazydesk-ai/
├── index.html
├── styles.css
├── app.js
├── manifest.json
└── README.md
```

## Suggested next contributions

- Add an optional “low-energy mode” that limits plans to one task.
- Add unit tests for prompt construction and output handling.
- Add a service worker and explicit asset/model caching for more reliable offline support.
- Add a model selector with clearly documented memory requirements.
- Add an accessible “reduce motion” preference.

## Credits

- [Transformers.js](https://github.com/huggingface/transformers.js)
- [Qwen2.5 0.5B Instruct ONNX model](https://huggingface.co/onnx-community/Qwen2.5-0.5B-Instruct)

Built with a sloth-sized ambition: make one thing easier, then go rest.
