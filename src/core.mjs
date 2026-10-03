/** دامنهٔ نمایشی ربات‌یار؛ همهٔ مبلغ‌ها «تومان» و همهٔ ساعت‌ها نفر-ساعت‌اند. */
export const DEMO_ASSUMPTIONS = {
  currency: 'تومان',
  workUnit: 'نفر-ساعت',
  timezone: 'Asia/Tehran',
  today: '2026-09-13',
  note: 'این داده‌ها کاملاً ساختگی‌اند؛ ارقام مالی، زمان‌ها و پاسخ‌های دانش، مبنای حسابداری یا ارزیابی افراد نیستند.'
};

const seed = {
  meta: { version: 1, lastSimulatedSync: '2026-09-13T08:30:00+03:30' },
  users: [
    { id: 'u1', name: 'مینا رستگار', role: 'team', title: 'مهندس مکانیک' },
    { id: 'u2', name: 'علی دادخواه', role: 'lead', title: 'رهبر فنی' },
    { id: 'u3', name: 'سارا حیدری', role: 'manager', title: 'مدیر پروژه' },
    { id: 'u4', name: 'حامد کریمی', role: 'finance', title: 'کارشناس مالی' },
    { id: 'u5', name: 'نرگس موسوی', role: 'executive', title: 'مدیرعامل' }
  ],
  customers: [
    { id: 'c1', name: 'صنایع آریا', sector: 'خودرو' }, { id: 'c2', name: 'پویش‌دارو', sector: 'داروسازی' },
    { id: 'c3', name: 'پارس‌پک', sector: 'بسته‌بندی' }, { id: 'c4', name: 'نوین‌مونتاژ', sector: 'لوازم خانگی' }
  ],
  contracts: [
    { id: 'ct1', customerId: 'c1', code: 'AR-1405-21', amount: 4200000000, invoiced: 2100000000, collected: 1680000000, acceptance: 'FAT موفق و تأیید نصب در سایت' },
    { id: 'ct2', customerId: 'c2', code: 'PD-1405-08', amount: 3100000000, invoiced: 930000000, collected: 620000000, acceptance: 'دقت تشخیص حداقل ۹۹٫۲٪ در FAT' },
    { id: 'ct3', customerId: 'c3', code: 'PP-1404-63', amount: 2700000000, invoiced: 1620000000, collected: 1080000000, acceptance: 'تحویل ایمن سلول و پذیرش مشتری' },
    { id: 'ct4', customerId: 'c4', code: 'NM-1404-19', amount: 1900000000, invoiced: 1900000000, collected: 1900000000, acceptance: 'پذیرش نهایی مشتری' }
  ],
  projects: [
    { id: 'p1', name: 'سلول مونتاژ آریا', code: 'PRJ-ARIA-21', customerId: 'c1', contractId: 'ct1', ownerId: 'u3', health: 'healthy', healthLabel: 'سالم', budget: 3450000000, progress: 52, forecastRate: 1650000, plannedDirect: 980000000, dueDate: '2026-11-20', internal: false, risk: 'تاخیر احتمالی تأمین سروو موتور' },
    { id: 'p2', name: 'بازرسی بینایی پویش‌دارو', code: 'PRJ-POOY-08', customerId: 'c2', contractId: 'ct2', ownerId: 'u3', health: 'risk', healthLabel: 'در معرض ریسک', budget: 2500000000, progress: 36, forecastRate: 1700000, plannedDirect: 720000000, dueDate: '2026-10-18', internal: false, risk: 'دیتاست لیبل‌گذاری‌شده هنوز کامل نیست' },
    { id: 'p3', name: 'پالتایزر پارس‌پک', code: 'PRJ-PARS-63', customerId: 'c3', contractId: 'ct3', ownerId: 'u3', health: 'over', healthLabel: 'بیش‌بودجه', budget: 2250000000, progress: 64, forecastRate: 1750000, plannedDirect: 790000000, dueDate: '2026-09-30', internal: false, risk: 'بازکاری ایمنی و تغییر چیدمان مشتری' },
    { id: 'p4', name: 'ایستگاه تست نوین‌مونتاژ', code: 'PRJ-NOV-19', customerId: 'c4', contractId: 'ct4', ownerId: 'u3', health: 'complete', healthLabel: 'تکمیل‌شده', budget: 1600000000, progress: 100, forecastRate: 1550000, plannedDirect: 420000000, dueDate: '2026-07-31', internal: false, risk: 'ریسک باز ندارد' },
    { id: 'p5', name: 'R&D گیرهٔ تطبیقی', code: 'RND-GRIP-01', customerId: null, contractId: null, ownerId: 'u2', health: 'healthy', healthLabel: 'داخلی', budget: 900000000, progress: 41, forecastRate: 1550000, plannedDirect: 190000000, dueDate: '2026-12-15', internal: true, risk: 'نیاز به تست چرخهٔ طولانی' }
  ],
  workPackages: [
    { id: 'w1', projectId: 'p1', name: 'طراحی مکانیکی و گیره', estimatedHours: 340 }, { id: 'w2', projectId: 'p1', name: 'PLC و ایمنی', estimatedHours: 260 }, { id: 'w3', projectId: 'p1', name: 'یکپارچه‌سازی و FAT', estimatedHours: 220 },
    { id: 'w4', projectId: 'p2', name: 'بینایی ماشین', estimatedHours: 430 }, { id: 'w5', projectId: 'p2', name: 'یکپارچه‌سازی خط', estimatedHours: 210 },
    { id: 'w6', projectId: 'p3', name: 'پالتایزر و ایمنی', estimatedHours: 480 }, { id: 'w7', projectId: 'p3', name: 'نصب و پذیرش', estimatedHours: 180 },
    { id: 'w8', projectId: 'p4', name: 'تست و تحویل', estimatedHours: 510 }, { id: 'w9', projectId: 'p5', name: 'نمونه‌سازی گیره', estimatedHours: 360 }
  ],
  tasks: [
    { id: 't1', projectId: 'p1', workPackageId: 'w1', title: 'طراحی فک‌های گیرهٔ قطعه A', assigneeIds: ['u1'], status: 'doing', dueDate: '2026-09-15', blocked: false, notes: ['بازبینی اولیه با رهبر فنی انجام شد.'] },
    { id: 't2', projectId: 'p1', workPackageId: 'w2', title: 'برنامه‌نویسی PLC و interlock ایمنی', assigneeIds: ['u2'], status: 'review', dueDate: '2026-09-17', blocked: false, notes: [] },
    { id: 't3', projectId: 'p1', workPackageId: 'w3', title: 'سناریوی FAT سلول مونتاژ', assigneeIds: ['u1','u2'], status: 'todo', dueDate: '2026-09-22', blocked: false, notes: [] },
    { id: 't4', projectId: 'p2', workPackageId: 'w4', title: 'تنظیم مدل تشخیص برچسب دارو', assigneeIds: ['u1'], status: 'doing', dueDate: '2026-09-14', blocked: true, blockReason: 'نمونه‌های برچسبِ تاییدشده کامل نیست.', notes: [] },
    { id: 't5', projectId: 'p2', workPackageId: 'w5', title: 'کالیبراسیون دوربین روی نوار نقاله', assigneeIds: ['u2'], status: 'todo', dueDate: '2026-09-21', blocked: false, notes: [] },
    { id: 't6', projectId: 'p3', workPackageId: 'w6', title: 'بازطراحی حفاظ ایمنی پالتایزر', assigneeIds: ['u1','u2'], status: 'doing', dueDate: '2026-09-16', blocked: false, notes: [] },
    { id: 't7', projectId: 'p3', workPackageId: 'w7', title: 'نصب و تحویل مقدماتی سایت', assigneeIds: ['u2'], status: 'review', dueDate: '2026-09-19', blocked: false, notes: ['ارسال کار، در انتظار پذیرش بازبین است.'] },
    { id: 't8', projectId: 'p4', workPackageId: 'w8', title: 'پذیرش نهایی مشتری', assigneeIds: ['u3'], status: 'done', accepted: true, dueDate: '2026-07-28', blocked: false, notes: ['پذیرش تحویل‌دادنی ثبت شد.'] },
    { id: 't9', projectId: 'p5', workPackageId: 'w9', title: 'تست چرخهٔ گیرهٔ تطبیقی', assigneeIds: ['u1'], status: 'todo', dueDate: '2026-09-25', blocked: false, notes: [] }
  ],
  timeEntries: [
    { id: 'te1', projectId: 'p1', workPackageId: 'w1', taskId: 't1', userId: 'u1', date: '2026-09-13', hours: 3.5, note: 'مدل‌سازی فک ثابت', laborCostRate: 1450000, approved: false },
    { id: 'te2', projectId: 'p1', workPackageId: 'w2', taskId: 't2', userId: 'u2', date: '2026-09-12', hours: 7, note: 'منطق ایمنی درب', laborCostRate: 1850000, approved: true },
    { id: 'te3', projectId: 'p1', workPackageId: 'w3', taskId: null, userId: 'u1', date: '2026-09-11', hours: 2, note: 'جلسهٔ فنی FAT', laborCostRate: 1450000, approved: true },
    { id: 'te4', projectId: 'p2', workPackageId: 'w4', taskId: 't4', userId: 'u1', date: '2026-09-12', hours: 34, note: 'بازبینی دادهٔ آموزشی', laborCostRate: 1450000, approved: true },
    { id: 'te5', projectId: 'p2', workPackageId: 'w4', taskId: 't4', userId: 'u2', date: '2026-09-10', hours: 28, note: 'تحلیل خطای مدل', laborCostRate: 1850000, approved: true },
    { id: 'te6', projectId: 'p3', workPackageId: 'w6', taskId: 't6', userId: 'u1', date: '2026-09-11', hours: 185, note: 'بازطراحی حفاظ', laborCostRate: 1450000, approved: true },
    { id: 'te7', projectId: 'p3', workPackageId: 'w6', taskId: 't6', userId: 'u2', date: '2026-09-11', hours: 170, note: 'بازبینی ایمنی', laborCostRate: 1850000, approved: true },
    { id: 'te8', projectId: 'p4', workPackageId: 'w8', taskId: 't8', userId: 'u3', date: '2026-07-27', hours: 510, note: 'مدیریت پذیرش و تحویل', laborCostRate: 1750000, approved: true },
    { id: 'te9', projectId: 'p5', workPackageId: 'w9', taskId: 't9', userId: 'u1', date: '2026-09-10', hours: 92, note: 'آزمون نمونهٔ اول', laborCostRate: 1450000, approved: true }
  ],
  directCosts: [
    { id: 'dc1', projectId: 'p1', name: 'مصرف سروو موتور', amount: 470000000, date: '2026-09-05', type: 'consumption' }, { id: 'dc2', projectId: 'p1', name: 'ساخت فک آلومینیومی', amount: 150000000, date: '2026-09-09', type: 'consumption' },
    { id: 'dc3', projectId: 'p2', name: 'دوربین صنعتی مصرف‌شده', amount: 470000000, date: '2026-09-06', type: 'consumption' }, { id: 'dc4', projectId: 'p3', name: 'حفاظ و سنسورهای ایمنی', amount: 980000000, date: '2026-09-08', type: 'consumption' },
    { id: 'dc5', projectId: 'p4', name: 'فیکسچر تست مصرف‌شده', amount: 420000000, date: '2026-07-18', type: 'consumption' }, { id: 'dc6', projectId: 'p5', name: 'نمونهٔ فنر و قطعات', amount: 65000000, date: '2026-09-08', type: 'consumption' }
  ],
  changeRequests: [
    { id: 'cr1', projectId: 'p3', title: 'جابجایی نوار نقاله و بازطراحی حفاظ', status: 'approved', hoursImpact: 110, costImpact: 285000000, revenueImpact: 340000000, dueDateImpact: 12, description: 'درخواست مشتری پس از بازدید سایت؛ در پیش‌بینی لحاظ شده است.' },
    { id: 'cr2', projectId: 'p2', title: 'افزودن تشخیص کد چاپی', status: 'pending', hoursImpact: 72, costImpact: 120000000, revenueImpact: 180000000, dueDateImpact: 7, description: 'تا تایید مشتری، در درآمد پیش‌بینی‌شده لحاظ نشده است.' }
  ],
  milestones: [
    { id: 'm1', projectId: 'p1', name: 'تایید طراحی', status: 'complete', weight: 25, dueDate: '2026-08-28' }, { id: 'm2', projectId: 'p1', name: 'FAT', status: 'planned', weight: 45, dueDate: '2026-10-28' },
    { id: 'm3', projectId: 'p2', name: 'تایید نمونهٔ بینایی', status: 'planned', weight: 35, dueDate: '2026-09-28' }, { id: 'm4', projectId: 'p3', name: 'پذیرش نصب', status: 'planned', weight: 40, dueDate: '2026-10-12' },
    { id: 'm5', projectId: 'p4', name: 'پذیرش نهایی', status: 'complete', weight: 100, dueDate: '2026-07-28' }
  ],
  attendance: [
    { id: 'a1', userId: 'u1', date: '2026-09-13', attendanceHours: 7.5, projectHours: 3.5, internalHours: 1.5 }, { id: 'a2', userId: 'u2', date: '2026-09-13', attendanceHours: 8, projectHours: 0, internalHours: 2 }, { id: 'a3', userId: 'u1', date: '2026-09-12', attendanceHours: 8, projectHours: 34, internalHours: 0 }
  ],
  accountingPreview: [
    { id: 'ac1', code: 'PRJ-ARIA-21', entry: 'مصرف سروو موتور', amount: 470000000, date: '2026-09-05', status: 'mapped' }, { id: 'ac2', code: 'PRJ-PARS-63', entry: 'حفاظ ایمنی', amount: 980000000, date: '2026-09-08', status: 'mapped' },
    { id: 'ac3', code: 'نامشخص', entry: 'فاکتور تامین‌کننده ۸۸۱', amount: 76000000, date: '2026-09-12', status: 'mismatch' }
  ],
  knowledgeDocuments: [
    { id: 'kd1', title: 'قرارداد ساخت سلول مونتاژ آریا', section: 'بند ۷-۲ معیارهای پذیرش', date: '2026-05-01', access: 'project', excerpt: 'پذیرش پس از FAT موفق و تأیید نصب در سایت مشتری انجام می‌شود.' },
    { id: 'kd2', title: 'گزارش درس‌آموخته پروژهٔ سپهر', section: '۳. مشکل لغزش گیره', date: '2025-11-19', access: 'project', excerpt: 'لغزش قطعه با افزایش سطح تماس فک و افزودن سنسور فشار برطرف شد.' },
    { id: 'kd3', title: 'گزارش پیش‌بینی مالی پارس‌پک', section: 'تحلیل تغییرات برآورد', date: '2026-09-13', access: 'finance', excerpt: 'افزایش هزینهٔ واقعی و درخواست تغییر تاییدشده، محرک اصلی کاهش حاشیه است.' }
  ]
};

export const seedData = () => structuredClone(seed);
export const byId = (items, id) => items.find(x => x.id === id);
export const sum = (items, fn) => items.reduce((total, item) => total + fn(item), 0);
export const formatMoney = value => new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 }).format(Math.round(value)) + ' تومان';
export const formatHours = value => new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 1 }).format(value) + ' نفر-ساعت';

export function projectEntries(data, projectId) { return data.timeEntries.filter(e => e.projectId === projectId); }
export function projectActualHours(data, projectId) { return sum(projectEntries(data, projectId), e => e.hours); }
export function workPackageActualHours(data, workPackageId) { return sum(data.timeEntries.filter(e => e.workPackageId === workPackageId), e => e.hours); }
export function projectLaborCost(data, projectId) { return sum(projectEntries(data, projectId), e => e.hours * e.laborCostRate); }
export function projectDirectCost(data, projectId) { return sum(data.directCosts.filter(c => c.projectId === projectId && c.type === 'consumption'), c => c.amount); }
export function approvedChanges(data, projectId) { return data.changeRequests.filter(c => c.projectId === projectId && c.status === 'approved'); }
export function projectFinancials(data, projectId) {
  const project = byId(data.projects, projectId);
  const packages = data.workPackages.filter(w => w.projectId === projectId);
  const plannedHours = sum(packages, w => w.estimatedHours) + sum(approvedChanges(data, projectId), c => c.hoursImpact);
  const actualHours = projectActualHours(data, projectId);
  const laborCost = projectLaborCost(data, projectId);
  const directCost = projectDirectCost(data, projectId);
  const actualCost = laborCost + directCost;
  const remainingHours = Math.max(0, plannedHours - actualHours);
  const remainingDirect = Math.max(0, project.plannedDirect - directCost);
  const estimatedRemainingCost = remainingHours * project.forecastRate + remainingDirect;
  const forecastFinalCost = actualCost + estimatedRemainingCost;
  const contract = project.contractId ? byId(data.contracts, project.contractId) : null;
  const forecastRevenue = (contract?.amount || 0) + sum(approvedChanges(data, projectId), c => c.revenueImpact);
  const forecastProfit = forecastRevenue - forecastFinalCost;
  return { plannedHours, actualHours, laborCost, directCost, actualCost, remainingHours, estimatedRemainingCost, forecastFinalCost, forecastRevenue, forecastProfit, forecastMargin: forecastRevenue ? forecastProfit / forecastRevenue * 100 : 0, budgetConsumption: project.budget ? actualCost / project.budget * 100 : 0 };
}

export function addTimeEntry(data, input) {
  const hours = Number(input.hours);
  if (!input.projectId || !input.workPackageId || !Number.isFinite(hours) || hours <= 0) throw new Error('پروژه، بستهٔ کاری و مدت معتبر را وارد کنید.');
  const task = input.taskId ? byId(data.tasks, input.taskId) : null;
  if (task && (task.projectId !== input.projectId || task.workPackageId !== input.workPackageId)) throw new Error('وظیفه با پروژه و بستهٔ کاری انتخاب‌شده هم‌خوان نیست.');
  data.timeEntries.unshift({ id: `te-${crypto.randomUUID()}`, projectId: input.projectId, workPackageId: input.workPackageId, taskId: input.taskId || null, userId: input.userId, date: DEMO_ASSUMPTIONS.today, hours, note: input.note?.trim() || 'ثبت سریع زمان', laborCostRate: input.laborCostRate || 1450000, approved: false });
  return data;
}

export function taskStatusLabel(status) { return ({ todo: 'آماده انجام', doing: 'در حال انجام', review: 'آماده بررسی', done: 'انجام‌شده' })[status]; }
export function healthClass(health) { return ({ healthy: 'good', risk: 'warn', over: 'bad', complete: 'neutral' })[health]; }
