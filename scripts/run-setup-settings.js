import { setupSettings } from "./setup-settings.js";
import { ensureGlobalRules } from "../src/ensureGlobalRules.js";

setupSettings();
const gr = ensureGlobalRules();
if (gr.ok) console.log(`[agy-auto] global rule → ${gr.path}${gr.updated ? " (updated)" : ""}`);
else console.warn(`[agy-auto] global rule install skipped: ${gr.error}`);
