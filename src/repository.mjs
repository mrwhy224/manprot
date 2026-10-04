import { seedData } from './core.mjs';

/** Adapter قابل‌جایگزینی: نسخهٔ تولیدی می‌تواند Laravel API/SQLite باشد. */
export class DemoRepository {
  constructor(key = 'robotyar-demo-v1') { this.key = key; }
  load() {
    try {
      const stored = JSON.parse(localStorage.getItem(this.key));
      return stored?.meta?.version === 6 ? stored : this.reset();
    } catch { return this.reset(); }
  }
  save(data) { localStorage.setItem(this.key, JSON.stringify(data)); return data; }
  reset() { const data = seedData(); this.save(data); return data; }
}
