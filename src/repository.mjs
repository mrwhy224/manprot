import { seedData } from './core.mjs';

/** Adapter قابل‌جایگزینی: نسخهٔ تولیدی می‌تواند Laravel API/SQLite باشد. */
export class DemoRepository {
  constructor(key = 'robotyar-demo-v1') { this.key = key; }
  load() { try { return JSON.parse(localStorage.getItem(this.key)) || seedData(); } catch { return seedData(); } }
  save(data) { localStorage.setItem(this.key, JSON.stringify(data)); return data; }
  reset() { const data = seedData(); this.save(data); return data; }
}
