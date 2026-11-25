# Short AI-use reflection

**AI tool:** Claude (Anthropic), model Claude Opus 5.5 (`claude-opus-5-5`), used through the Claude app as an agent with access to my course folder.
Prompt used (adapted from the slide): *"Act as a software engineering assistant. Implement the Smart Campus availability contract
in a static HTML/JavaScript project and in Appsmith. Keep all six acceptance criteria unchanged. Use fictional data only. Separate
deterministic booking rules from presentation. Explain limitations and provide tests. Do not invent successful test results."*

**What the AI generated:** the shared requirement sheet, the pure rule module (`rules.js`), the UI, the 16 automated tests,
the Appsmith JS Object, the build guide and the first drafts of the matrix and security checklist.

**What was verified, and how:** every code-based result in the test table comes from a real run (`npm test` output and
screenshots from headless Chrome at desktop and mobile width). One AI mistake was caught by running it: the `npm test`
script pointed at a folder and failed; it was fixed and re-run. The Practice #11 baseline was re-run (29/29) and left untouched.

**Low-code:** I signed in to Appsmith myself; then the AI agent built the app in the built-in browser: it pasted the JS Object,
added and configured 9 widgets and ran T1–T8 in the deployed app (8/8, screenshots). Drag-and-drop did not work in the narrow browser
pane, so the agent added widgets through the editor's own "add widget" action — the result is a normal Appsmith app that I can open and
edit visually. The JS Object logic was additionally checked in Node (`simulate.js`, marked SIMULATED). Both "≈5–6 min" times are the
agent's time, not mine, so they are not fair human-effort numbers.

**Lesson:** AI made the code-based track very fast, but the evidence (tests, screenshots) is what makes the result trustworthy.
"Low-code" did not mean "no code" here — the main rule still had to be JavaScript — and it is not automatically more secure;
the security responsibilities just move partly to the vendor.
