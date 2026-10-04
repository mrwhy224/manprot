import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_ASSUMPTIONS, addTimeEntry, attendanceVariance, linkTaskToRepository, projectFinancials, projectHealth, projectProgress, seedData, simulateGitWebhook, startTimer, stopTimer, taskGitLink, teamWorkload, timerElapsedHours, workPackageActualHours } from '../src/core.mjs';

test('labor cost uses each entry historical rate', () => {
  const data = seedData();
  const before = projectFinancials(data, 'p1');
  assert.equal(before.laborCost, 20925000);
  assert.equal(before.directCost, 620000000);
});

test('time entry updates work-package hours and project cost', () => {
  const data = seedData();
  const before = projectFinancials(data, 'p1');
  addTimeEntry(data, { projectId:'p1', workPackageId:'w1', taskId:'t1', userId:'u1', hours:2, note:'آزمون', laborCostRate:1450000 });
  const after = projectFinancials(data, 'p1');
  assert.equal(after.actualHours, before.actualHours + 2);
  assert.equal(after.laborCost, before.laborCost + 2900000);
  assert.equal(workPackageActualHours(data, 'w1'), 5.5);
  assert.equal(after.forecastFinalCost, before.forecastFinalCost - 400000);
});

test('approved change affects only its own project forecast', () => {
  const data = seedData();
  const p3 = projectFinancials(data, 'p3');
  const p2 = projectFinancials(data, 'p2');
  assert.equal(p3.plannedHours, 770);
  assert.equal(p2.plannedHours, 640);
  assert.equal(p3.forecastRevenue, 3040000000);
  assert.equal(p2.forecastRevenue, 3100000000);
});

test('direct consumption updates actual cost and budget usage', () => {
  const data = seedData();
  const before = projectFinancials(data, 'p1');
  data.directCosts.push({ id:'test-consumption', projectId:'p1', name:'مصرف تست', amount:100000000, date:'2026-09-13', type:'consumption' });
  const after = projectFinancials(data, 'p1');
  assert.equal(after.directCost, before.directCost + 100000000);
  assert.equal(after.actualCost, before.actualCost + 100000000);
  assert.ok(after.budgetConsumption > before.budgetConsumption);
});

test('accepted milestones are the source of project progress', () => {
  const data = seedData();
  assert.equal(projectProgress(data, 'p1'), 25);
  assert.equal(projectProgress(data, 'p3'), 60);
  assert.equal(projectProgress(data, 'p4'), 100);
});

test('project health is computed from delivery and forecast data', () => {
  const data = seedData();
  assert.equal(projectHealth(data, 'p1').key, 'risk');
  assert.equal(projectHealth(data, 'p3').key, 'over');
  assert.equal(projectHealth(data, 'p4').key, 'complete');
});

test('pending direct cost is excluded until approval', () => {
  const data = seedData();
  const before = projectFinancials(data, 'p1').directCost;
  data.directCosts.push({ id:'pending', projectId:'p1', name:'pending item', amount:100000000, date:'2026-09-11', type:'consumption', approved:false });
  assert.equal(projectFinancials(data, 'p1').directCost, before);
});

test('attendance variance exposes over-reported project time', () => {
  const data = seedData();
  assert.equal(attendanceVariance(data.attendance.find(item => item.id === 'a3')), -26);
});

test('proposal scenario uses the October 4 presentation date', () => {
  assert.equal(DEMO_ASSUMPTIONS.today, '2026-10-04');
});

test('task can be manually linked to a repository in the same project', () => {
  const data = seedData();
  linkTaskToRepository(data, { taskId:'t3', repositoryId:'repo1', branch:'task/TASK-103', issueRef:'#103', userId:'u3' });
  assert.equal(taskGitLink(data,'t3').branch, 'task/TASK-103');
  assert.match(data.activity[0].text, /TASK-103/);
  assert.throws(() => linkTaskToRepository(data, { taskId:'t3', repositoryId:'repo3', branch:'invalid', userId:'u3' }));
});

test('simulated Git webhooks update engineering activity and task workflow', () => {
  const data = seedData();
  linkTaskToRepository(data, { taskId:'t3', repositoryId:'repo1', branch:'task/TASK-103', issueRef:'#103', userId:'u3' });
  const commitCount = data.gitCommits.length;
  simulateGitWebhook(data, { eventType:'push', repositoryId:'repo1', taskId:'t3', userId:'u2' });
  assert.equal(data.gitCommits.length, commitCount + 1);
  assert.equal(data.tasks.find(task => task.id === 't3').status, 'doing');
  simulateGitWebhook(data, { eventType:'merge_request', repositoryId:'repo1', taskId:'t3', userId:'u2' });
  assert.equal(data.tasks.find(task => task.id === 't3').status, 'review');
  assert.ok(data.mergeRequests.some(item => item.taskId === 't3'));
});

test('weekly team capacity is balanced for the presentation scenario', () => {
  const workload = teamWorkload(seedData());
  assert.ok(workload.every(item => item.utilization <= 100));
  assert.equal(workload.find(item => item.user.id === 'u8').utilization, 46 / 48 * 100);
});

test('manual time entry preserves the selected work date', () => {
  const data = seedData();
  addTimeEntry(data, { projectId:'p1', workPackageId:'w1', taskId:'t1', userId:'u1', date:'2026-10-03', hours:1.25, note:'dated work', source:'manual' });
  assert.equal(data.timeEntries[0].date, '2026-10-03');
  assert.equal(data.timeEntries[0].source, 'manual');
  assert.throws(() => addTimeEntry(data, { projectId:'p1', workPackageId:'w1', userId:'u1', date:'2026-10-05', hours:1 }));
});

test('persistent timer prevents overlap and creates a dated time entry when stopped', () => {
  const data = seedData();
  const timer = startTimer(data, { projectId:'p1', workPackageId:'w1', taskId:'t1', userId:'u1', note:'timed work' }, '2026-10-04T08:00:00.000Z');
  assert.equal(data.activeTimers.length, 1);
  assert.throws(() => startTimer(data, { projectId:'p1', workPackageId:'w1', userId:'u1' }, '2026-10-04T08:10:00.000Z'));
  assert.equal(timerElapsedHours(timer,'2026-10-04T09:30:00.000Z'), 1.5);
  const result = stopTimer(data, { timerId:timer.id, userId:'u1', laborCostRate:1450000 }, '2026-10-04T09:30:00.000Z');
  assert.equal(result.hours, 1.5);
  assert.equal(data.activeTimers.length, 0);
  assert.equal(data.timeEntries[0].source, 'timer');
  assert.equal(data.timeEntries[0].date, '2026-10-04');
});
