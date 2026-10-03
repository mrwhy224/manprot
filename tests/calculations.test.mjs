import test from 'node:test';
import assert from 'node:assert/strict';
import { addTimeEntry, projectFinancials, seedData, workPackageActualHours } from '../src/core.mjs';

test('هزینهٔ کار از نرخ تاریخی هر ثبت ساخته می‌شود', () => {
  const data = seedData();
  const before = projectFinancials(data, 'p1');
  assert.equal(before.laborCost, 20925000);
  assert.equal(before.directCost, 620000000);
});

test('ثبت زمان یک منبع حقیقت برای ساعت بسته و هزینهٔ پروژه است', () => {
  const data = seedData();
  const before = projectFinancials(data, 'p1');
  addTimeEntry(data, { projectId:'p1', workPackageId:'w1', taskId:'t1', userId:'u1', hours:2, note:'آزمون', laborCostRate:1450000 });
  const after = projectFinancials(data, 'p1');
  assert.equal(after.actualHours, before.actualHours + 2);
  assert.equal(after.laborCost, before.laborCost + 2900000);
  assert.equal(workPackageActualHours(data, 'w1'), 5.5);
  assert.equal(after.forecastFinalCost, before.forecastFinalCost - 400000);
});

test('درخواست تغییر تاییدشده فقط به برآورد همان پروژه وارد می‌شود', () => {
  const data = seedData();
  const p3 = projectFinancials(data, 'p3');
  const p2 = projectFinancials(data, 'p2');
  assert.equal(p3.plannedHours, 770);
  assert.equal(p2.plannedHours, 640);
  assert.equal(p3.forecastRevenue, 3040000000);
  assert.equal(p2.forecastRevenue, 3100000000);
});

test('مصرف مستقیم، هزینهٔ واقعی و مصرف بودجه را از همان دادهٔ مرکزی تغییر می‌دهد', () => {
  const data = seedData();
  const before = projectFinancials(data, 'p1');
  data.directCosts.push({ id:'test-consumption', projectId:'p1', name:'مصرف تست', amount:100000000, date:'2026-09-13', type:'consumption' });
  const after = projectFinancials(data, 'p1');
  assert.equal(after.directCost, before.directCost + 100000000);
  assert.equal(after.actualCost, before.actualCost + 100000000);
  assert.ok(after.budgetConsumption > before.budgetConsumption);
});
