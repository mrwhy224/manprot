/** دامنهٔ نمایشی ربات‌یار؛ همهٔ مبلغ‌ها «تومان» و همهٔ ساعت‌ها نفر-ساعت‌اند. */
export const DEMO_ASSUMPTIONS = {
  currency: 'تومان',
  workUnit: 'نفر-ساعت',
  timezone: 'Asia/Tehran',
  today: '2026-10-04',
  scenarioLabel: 'سناریوی ارائه — ۱۲ مهر ۱۴۰۵',
  note: 'این داده‌ها کاملاً ساختگی‌اند؛ ارقام مالی، زمان‌ها و پاسخ‌های دانش، مبنای حسابداری یا ارزیابی افراد نیستند.'
};

const seed = {
  meta: { version: 6, lastSimulatedSync: '2026-10-04T08:30:00+03:30', lastGitWebhook: '2026-10-04T09:18:00+03:30' },
  users: [
    { id: 'u1', name: 'مینا رستگار', role: 'team', title: 'مهندس مکانیک', weeklyCapacity: 40, skills: ['طراحی مکانیکی','ساخت'] },
    { id: 'u2', name: 'علی دادخواه', role: 'lead', title: 'رهبر فنی', weeklyCapacity: 36, skills: ['PLC','ایمنی','بازبینی فنی'] },
    { id: 'u3', name: 'سارا حیدری', role: 'manager', title: 'مدیر پروژه', weeklyCapacity: 32, skills: ['برنامه‌ریزی','کنترل پروژه'] },
    { id: 'u4', name: 'حامد کریمی', role: 'finance', title: 'کارشناس مالی', weeklyCapacity: 40, skills: ['مالی','قرارداد'] },
    { id: 'u5', name: 'نرگس موسوی', role: 'executive', title: 'مدیرعامل', weeklyCapacity: 20, skills: ['راهبری'] },
    { id: 'u6', name: 'رضا اکبری', role: 'team', title: 'مهندس اتوماسیون', weeklyCapacity: 40, skills: ['PLC','کنترل حرکت','FAT'] },
    { id: 'u7', name: 'زهرا کاظمی', role: 'team', title: 'مهندس بینایی و R&D', weeklyCapacity: 40, skills: ['بینایی ماشین','پردازش تصویر','تست محصول'] },
    { id: 'u8', name: 'امیر صالحی', role: 'team', title: 'مهندس راه‌اندازی سایت', weeklyCapacity: 48, skills: ['نصب','راه‌اندازی','SAT'] }
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
    { id: 'p1', name: 'سلول مونتاژ آریا', code: 'PRJ-ARIA-21', customerId: 'c1', contractId: 'ct1', ownerId: 'u3', budget: 3450000000, forecastRate: 1650000, plannedDirect: 980000000, startDate: '2026-05-10', baselineDueDate: '2026-11-12', dueDate: '2026-11-20', internal: false, risk: 'تاخیر احتمالی تأمین سروو موتور' },
    { id: 'p2', name: 'بازرسی بینایی پویش‌دارو', code: 'PRJ-POOY-08', customerId: 'c2', contractId: 'ct2', ownerId: 'u3', budget: 2500000000, forecastRate: 1700000, plannedDirect: 720000000, startDate: '2026-06-01', baselineDueDate: '2026-10-11', dueDate: '2026-10-18', internal: false, risk: 'دیتاست لیبل‌گذاری‌شده هنوز کامل نیست' },
    { id: 'p3', name: 'پالتایزر پارس‌پک', code: 'PRJ-PARS-63', customerId: 'c3', contractId: 'ct3', ownerId: 'u3', budget: 2250000000, forecastRate: 1750000, plannedDirect: 790000000, startDate: '2026-03-15', baselineDueDate: '2026-09-18', dueDate: '2026-09-30', internal: false, risk: 'بازکاری ایمنی و تغییر چیدمان مشتری' },
    { id: 'p4', name: 'ایستگاه تست نوین‌مونتاژ', code: 'PRJ-NOV-19', customerId: 'c4', contractId: 'ct4', ownerId: 'u3', budget: 1600000000, forecastRate: 1550000, plannedDirect: 420000000, startDate: '2026-02-01', baselineDueDate: '2026-07-31', dueDate: '2026-07-31', internal: false, risk: 'ریسک باز ندارد' },
    { id: 'p5', name: 'R&D گیرهٔ تطبیقی', code: 'RND-GRIP-01', customerId: null, contractId: null, ownerId: 'u2', budget: 900000000, forecastRate: 1550000, plannedDirect: 190000000, startDate: '2026-07-01', baselineDueDate: '2026-12-15', dueDate: '2026-12-15', internal: true, risk: 'نیاز به تست چرخهٔ طولانی' }
  ],
  workPackages: [
    { id: 'w1', projectId: 'p1', name: 'طراحی مکانیکی و گیره', estimatedHours: 340, ownerId:'u1', startDate:'2026-05-10', dueDate:'2026-10-10' }, { id: 'w2', projectId: 'p1', name: 'PLC و ایمنی', estimatedHours: 260, ownerId:'u2', startDate:'2026-07-15', dueDate:'2026-10-15' }, { id: 'w3', projectId: 'p1', name: 'یکپارچه‌سازی و FAT', estimatedHours: 220, ownerId:'u2', startDate:'2026-09-01', dueDate:'2026-11-20' },
    { id: 'w4', projectId: 'p2', name: 'بینایی ماشین', estimatedHours: 430, ownerId:'u1', startDate:'2026-06-01', dueDate:'2026-10-15' }, { id: 'w5', projectId: 'p2', name: 'یکپارچه‌سازی خط', estimatedHours: 210, ownerId:'u2', startDate:'2026-08-20', dueDate:'2026-10-18' },
    { id: 'w6', projectId: 'p3', name: 'پالتایزر و ایمنی', estimatedHours: 480, ownerId:'u2', startDate:'2026-03-15', dueDate:'2026-09-16' }, { id: 'w7', projectId: 'p3', name: 'نصب و پذیرش', estimatedHours: 180, ownerId:'u2', startDate:'2026-09-10', dueDate:'2026-09-30' },
    { id: 'w8', projectId: 'p4', name: 'تست و تحویل', estimatedHours: 510, ownerId:'u3', startDate:'2026-02-01', dueDate:'2026-07-31' }, { id: 'w9', projectId: 'p5', name: 'نمونه‌سازی گیره', estimatedHours: 360, ownerId:'u1', startDate:'2026-07-01', dueDate:'2026-12-15' }
  ],
  tasks: [
    { id: 't1', code:'TASK-101', projectId: 'p1', workPackageId: 'w1', title: 'طراحی فک‌های گیرهٔ قطعه A', description:'طراحی نهایی فک و آماده‌سازی نقشهٔ ساخت.', assigneeIds: ['u1'], reviewerId:'u2', status: 'doing', priority:'high', estimatedHours:24, startDate:'2026-10-01', dueDate: '2026-10-06', blocked: false, dependencies:[], checklist:[{text:'بازبینی ابعادی',done:true},{text:'خروجی نقشهٔ ساخت',done:false}], attachments:['drawing-A-v2.pdf'], notes: ['بازبینی اولیه با رهبر فنی انجام شد.'] },
    { id: 't2', code:'TASK-102', projectId: 'p1', workPackageId: 'w2', title: 'برنامه‌نویسی PLC و interlock ایمنی', description:'پیاده‌سازی منطق ایمنی و تست سناریوهای خطا.', assigneeIds: ['u2','u6'], reviewerId:'u3', status: 'review', priority:'critical', estimatedHours:32, startDate:'2026-09-28', dueDate: '2026-10-07', blocked: false, dependencies:[], checklist:[{text:'تست E-Stop',done:true},{text:'ثبت نتیجهٔ بازبینی',done:false}], attachments:['safety-matrix.xlsx'], notes: [] },
    { id: 't3', code:'TASK-103', projectId: 'p1', workPackageId: 'w3', title: 'سناریوی FAT سلول مونتاژ', description:'تهیهٔ سناریوی آزمون پذیرش کارخانه با معیارهای قرارداد.', assigneeIds: ['u6'], reviewerId:'u3', status: 'todo', priority:'high', estimatedHours:18, startDate:'2026-10-08', dueDate: '2026-10-12', blocked: false, dependencies:['t1','t2'], checklist:[{text:'تطبیق با بند قرارداد',done:false}], attachments:[], notes: [] },
    { id: 't4', code:'TASK-201', projectId: 'p2', workPackageId: 'w4', title: 'تنظیم مدل تشخیص برچسب دارو', description:'بهینه‌سازی مدل تا رسیدن به دقت پذیرش FAT.', assigneeIds: ['u1','u7'], reviewerId:'u2', status: 'doing', priority:'critical', estimatedHours:80, startDate:'2026-09-20', dueDate: '2026-10-06', blocked: true, blockReason: 'نمونه‌های برچسبِ تاییدشده کامل نیست.', dependencies:[], checklist:[{text:'دریافت دیتاست تاییدشده',done:false},{text:'گزارش دقت مدل',done:false}], attachments:['accuracy-report-v1.pdf'], notes: [] },
    { id: 't5', code:'TASK-202', projectId: 'p2', workPackageId: 'w5', title: 'کالیبراسیون دوربین روی نوار نقاله', description:'تنظیم نور و کالیبراسیون در سرعت واقعی خط.', assigneeIds: ['u7'], reviewerId:'u3', status: 'todo', priority:'medium', estimatedHours:20, startDate:'2026-10-07', dueDate: '2026-10-12', blocked: false, dependencies:['t4'], checklist:[], attachments:[], notes: [] },
    { id: 't6', code:'TASK-301', projectId: 'p3', workPackageId: 'w6', title: 'بازطراحی حفاظ ایمنی پالتایزر', description:'اصلاح حفاظ بر مبنای چیدمان جدید مشتری.', assigneeIds: ['u2','u6','u7'], reviewerId:'u3', status: 'doing', priority:'critical', estimatedHours:390, startDate:'2026-08-10', dueDate: '2026-09-25', blocked: false, dependencies:[], checklist:[{text:'تایید نقشه',done:true},{text:'تست فاصلهٔ ایمنی',done:false}], attachments:['guard-redesign.pdf'], notes: [] },
    { id: 't7', code:'TASK-302', projectId: 'p3', workPackageId: 'w7', title: 'نصب و تحویل مقدماتی سایت', description:'نصب مکانیکی، راه‌اندازی و صورت‌جلسهٔ تحویل مقدماتی.', assigneeIds: ['u8'], reviewerId:'u3', status: 'review', priority:'high', estimatedHours:46, startDate:'2026-09-20', dueDate: '2026-09-29', blocked: false, dependencies:['t6'], checklist:[{text:'صورت‌جلسهٔ نصب',done:true},{text:'پذیرش مدیر پروژه',done:false}], attachments:['site-minutes.pdf'], notes: ['ارسال کار، در انتظار پذیرش بازبین است.'] },
    { id: 't8', code:'TASK-401', projectId: 'p4', workPackageId: 'w8', title: 'پذیرش نهایی مشتری', description:'ثبت پذیرش نهایی و بستن پروژه.', assigneeIds: ['u3'], reviewerId:'u5', status: 'done', priority:'high', estimatedHours:510, accepted: true, dueDate: '2026-07-28', blocked: false, dependencies:[], checklist:[{text:'امضای مشتری',done:true}], attachments:['final-acceptance.pdf'], notes: ['پذیرش تحویل‌دادنی ثبت شد.'] },
    { id: 't9', code:'TASK-501', projectId: 'p5', workPackageId: 'w9', title: 'تست چرخهٔ گیرهٔ تطبیقی', description:'اجرای تست دوام و ثبت نرخ خرابی.', assigneeIds: ['u1','u7'], reviewerId:'u2', status: 'todo', priority:'medium', estimatedHours:120, startDate:'2026-10-05', dueDate: '2026-10-15', blocked: false, dependencies:[], checklist:[], attachments:[], notes: [] }
  ],
  timeEntries: [
    { id: 'te1', projectId: 'p1', workPackageId: 'w1', taskId: 't1', userId: 'u1', date: '2026-10-04', hours: 3.5, note: 'مدل‌سازی فک ثابت', laborCostRate: 1450000, approved: false },
    { id: 'te2', projectId: 'p1', workPackageId: 'w2', taskId: 't2', userId: 'u2', date: '2026-09-12', hours: 7, note: 'منطق ایمنی درب', laborCostRate: 1850000, approved: true },
    { id: 'te3', projectId: 'p1', workPackageId: 'w3', taskId: null, userId: 'u1', date: '2026-09-11', hours: 2, note: 'جلسهٔ فنی FAT', laborCostRate: 1450000, approved: true },
    { id: 'te4', projectId: 'p2', workPackageId: 'w4', taskId: 't4', userId: 'u1', date: '2026-09-12', hours: 34, note: 'بازبینی دادهٔ آموزشی', laborCostRate: 1450000, approved: true },
    { id: 'te5', projectId: 'p2', workPackageId: 'w4', taskId: 't4', userId: 'u2', date: '2026-09-10', hours: 28, note: 'تحلیل خطای مدل', laborCostRate: 1850000, approved: true },
    { id: 'te6', projectId: 'p3', workPackageId: 'w6', taskId: 't6', userId: 'u1', date: '2026-09-08', hours: 185, note: 'تجمیع بازطراحی حفاظ تا این تاریخ', laborCostRate: 1450000, approved: true },
    { id: 'te7', projectId: 'p3', workPackageId: 'w6', taskId: 't6', userId: 'u2', date: '2026-09-08', hours: 170, note: 'تجمیع بازبینی ایمنی تا این تاریخ', laborCostRate: 1850000, approved: true },
    { id: 'te8', projectId: 'p4', workPackageId: 'w8', taskId: 't8', userId: 'u3', date: '2026-07-27', hours: 510, note: 'مدیریت پذیرش و تحویل', laborCostRate: 1750000, approved: true },
    { id: 'te9', projectId: 'p5', workPackageId: 'w9', taskId: 't9', userId: 'u1', date: '2026-09-10', hours: 92, note: 'آزمون نمونهٔ اول', laborCostRate: 1450000, approved: true }
  ],
  activeTimers: [],
  directCosts: [
    { id: 'dc1', projectId: 'p1', name: 'مصرف سروو موتور', amount: 470000000, date: '2026-09-05', type: 'consumption', approved:true }, { id: 'dc2', projectId: 'p1', name: 'ساخت فک آلومینیومی', amount: 150000000, date: '2026-09-09', type: 'consumption', approved:true },
    { id: 'dc3', projectId: 'p2', name: 'دوربین صنعتی مصرف‌شده', amount: 470000000, date: '2026-09-06', type: 'consumption', approved:true }, { id: 'dc4', projectId: 'p3', name: 'حفاظ و سنسورهای ایمنی', amount: 980000000, date: '2026-09-08', type: 'consumption', approved:true },
    { id: 'dc5', projectId: 'p4', name: 'فیکسچر تست مصرف‌شده', amount: 420000000, date: '2026-07-18', type: 'consumption', approved:true }, { id: 'dc6', projectId: 'p5', name: 'نمونهٔ فنر و قطعات', amount: 65000000, date: '2026-09-08', type: 'consumption', approved:true }
  ],
  changeRequests: [
    { id: 'cr1', projectId: 'p3', title: 'جابجایی نوار نقاله و بازطراحی حفاظ', status: 'approved', requestedBy:'مشتری', approverId:'u3', hoursImpact: 110, costImpact: 285000000, revenueImpact: 340000000, dueDateImpact: 12, description: 'درخواست مشتری پس از بازدید سایت؛ در پیش‌بینی لحاظ شده است.' },
    { id: 'cr2', projectId: 'p2', title: 'افزودن تشخیص کد چاپی', status: 'pending', requestedBy:'مشتری', approverId:'u3', hoursImpact: 72, costImpact: 120000000, revenueImpact: 180000000, dueDateImpact: 7, description: 'تا تایید مشتری، در درآمد پیش‌بینی‌شده لحاظ نشده است.' }
  ],
  milestones: [
    { id: 'm1', projectId: 'p1', name: 'تایید طراحی', status: 'complete', weight: 25, dueDate: '2026-09-28', acceptedBy:'مشتری' }, { id: 'm2', projectId: 'p1', name: 'FAT', status: 'planned', weight: 45, dueDate: '2026-10-28' }, { id:'m6',projectId:'p1',name:'SAT و تحویل',status:'planned',weight:30,dueDate:'2026-11-20' },
    { id:'m7',projectId:'p2',name:'تایید طراحی راهکار',status:'complete',weight:20,dueDate:'2026-09-15',acceptedBy:'مشتری' }, { id: 'm3', projectId: 'p2', name: 'تایید نمونهٔ بینایی', status: 'planned', weight: 35, dueDate: '2026-10-15' }, { id:'m8',projectId:'p2',name:'FAT و تحویل',status:'planned',weight:45,dueDate:'2026-10-18' },
    { id:'m9',projectId:'p3',name:'تایید طراحی',status:'complete',weight:25,dueDate:'2026-05-30',acceptedBy:'مشتری' }, { id:'m10',projectId:'p3',name:'ساخت و مونتاژ',status:'complete',weight:35,dueDate:'2026-08-30',acceptedBy:'مدیر پروژه' }, { id: 'm4', projectId: 'p3', name: 'پذیرش نصب', status: 'planned', weight: 40, dueDate: '2026-09-30' },
    { id: 'm5', projectId: 'p4', name: 'پذیرش نهایی', status: 'complete', weight: 100, dueDate: '2026-07-28', acceptedBy:'مشتری' },
    { id:'m11',projectId:'p5',name:'نمونهٔ اولیه',status:'complete',weight:30,dueDate:'2026-08-25',acceptedBy:'رهبر فنی' }, { id:'m12',projectId:'p5',name:'تست دوام',status:'planned',weight:40,dueDate:'2026-10-10' }, { id:'m13',projectId:'p5',name:'اعتبارسنجی نهایی',status:'planned',weight:30,dueDate:'2026-12-15' }
  ],
  attendance: [
    { id: 'a1', userId: 'u1', date: '2026-10-04', attendanceHours: 7.5, projectHours: 3.5, internalHours: 1.5 }, { id: 'a2', userId: 'u2', date: '2026-10-04', attendanceHours: 8, projectHours: 0, internalHours: 2 }, { id: 'a3', userId: 'u1', date: '2026-09-10', attendanceHours: 8, projectHours: 34, internalHours: 0 }
  ],
  risks: [
    {id:'r1',projectId:'p1',title:'تاخیر تامین سروو موتور',probability:3,impact:4,ownerId:'u2',status:'open',response:'پیگیری تامین‌کنندهٔ جایگزین تا ۱۵ مهر'},
    {id:'r2',projectId:'p2',title:'ناقص بودن دیتاست تاییدشده',probability:4,impact:5,ownerId:'u3',status:'open',response:'جلسهٔ روزانه با نمایندهٔ مشتری و تحویل مرحله‌ای داده'},
    {id:'r3',projectId:'p3',title:'بازکاری حفاظ ایمنی',probability:4,impact:4,ownerId:'u2',status:'mitigating',response:'تست فاصلهٔ ایمنی پیش از اعزام سایت'},
    {id:'r4',projectId:'p4',title:'ریسک‌های تحویل',probability:1,impact:1,ownerId:'u3',status:'closed',response:'پروژه تحویل و بسته شده است'}
  ],
  activity: [
    {id:'ev-git1',projectId:'p1',date:'2026-10-04T09:18:00+03:30',userId:'u2',type:'git',text:'Webhook: merge request !42 برای TASK-102 باز شد.'},
    {id:'ev-git2',projectId:'p1',date:'2026-10-04T09:02:00+03:30',userId:'u1',type:'git',text:'Webhook: commit a91c2e4 به TASK-101 متصل شد.'},
    {id:'ev1',projectId:'p3',date:'2026-10-04T08:40:00+03:30',userId:'u3',type:'change',text:'درخواست تغییر جابجایی نوار نقاله تایید شد.'},
    {id:'ev2',projectId:'p2',date:'2026-10-04T08:25:00+03:30',userId:'u1',type:'blocker',text:'وظیفهٔ تنظیم مدل به دلیل نبود دیتاست تاییدشده مسدود شد.'},
    {id:'ev3',projectId:'p1',date:'2026-10-04T08:00:00+03:30',userId:'u1',type:'time',text:'۳٫۵ ساعت برای طراحی فک‌های گیره ثبت شد.'},
    {id:'ev4',projectId:'p1',date:'2026-10-03T16:20:00+03:30',userId:'u2',type:'review',text:'منطق ایمنی PLC برای بازبینی ارسال شد.'}
  ],
  gitConnections: [
    {id:'gc1',provider:'gitlab',name:'Git شرکت (نمایشی)',baseUrl:'https://git.company.local',status:'connected',mode:'demo',lastWebhookAt:'2026-10-04T09:18:00+03:30'}
  ],
  repositories: [
    {id:'repo1',connectionId:'gc1',projectId:'p1',name:'aria-cell-control',path:'automation/aria-cell-control',defaultBranch:'main',language:'Structured Text',visibility:'private',lastCommitAt:'2026-10-04T09:02:00+03:30'},
    {id:'repo2',connectionId:'gc1',projectId:'p1',name:'aria-mechanical-docs',path:'mechanical/aria-cell',defaultBranch:'main',language:'CAD / Documents',visibility:'private',lastCommitAt:'2026-10-04T08:48:00+03:30'},
    {id:'repo3',connectionId:'gc1',projectId:'p2',name:'pooyesh-vision',path:'vision/pooyesh-label-inspection',defaultBranch:'main',language:'Python',visibility:'private',lastCommitAt:'2026-10-03T17:20:00+03:30'},
    {id:'repo4',connectionId:'gc1',projectId:'p3',name:'pars-palletizer',path:'automation/pars-palletizer',defaultBranch:'main',language:'PLC / HMI',visibility:'private',lastCommitAt:'2026-10-02T14:10:00+03:30'},
    {id:'repo5',connectionId:'gc1',projectId:'p5',name:'adaptive-gripper-rnd',path:'rnd/adaptive-gripper',defaultBranch:'main',language:'C++',visibility:'private',lastCommitAt:'2026-10-01T11:30:00+03:30'}
  ],
  userGitIdentities: [
    {userId:'u1',username:'mina.r',email:'mina.r@company.local'}, {userId:'u2',username:'ali.d',email:'ali.d@company.local'}, {userId:'u3',username:'sara.h',email:'sara.h@company.local'},
    {userId:'u6',username:'reza.a',email:'reza.a@company.local'}, {userId:'u7',username:'zahra.k',email:'zahra.k@company.local'}, {userId:'u8',username:'amir.s',email:'amir.s@company.local'}
  ],
  taskGitLinks: [
    {id:'gl1',taskId:'t1',repositoryId:'repo2',branch:'task/TASK-101-gripper-jaw',issueRef:'#101'},
    {id:'gl2',taskId:'t2',repositoryId:'repo1',branch:'task/TASK-102-safety-interlock',issueRef:'#102',mergeRequestIid:42},
    {id:'gl3',taskId:'t4',repositoryId:'repo3',branch:'task/TASK-201-label-model',issueRef:'#201'},
    {id:'gl4',taskId:'t6',repositoryId:'repo4',branch:'task/TASK-301-safety-guard',issueRef:'#301'}
  ],
  gitCommits: [
    {id:'gcm1',repositoryId:'repo2',taskId:'t1',sha:'a91c2e4',message:'TASK-101 Update jaw manufacturing drawing',authorUserId:'u1',committedAt:'2026-10-04T09:02:00+03:30'},
    {id:'gcm2',repositoryId:'repo1',taskId:'t2',sha:'7fd13b8',message:'TASK-102 Add E-Stop validation',authorUserId:'u2',committedAt:'2026-10-04T08:44:00+03:30'},
    {id:'gcm3',repositoryId:'repo1',taskId:null,sha:'34bc107',message:'Update controller diagnostics',authorUserId:'u2',committedAt:'2026-10-03T16:12:00+03:30'},
    {id:'gcm4',repositoryId:'repo3',taskId:'t4',sha:'c81aa50',message:'TASK-201 Tune augmentation pipeline',authorUserId:'u1',committedAt:'2026-10-03T15:45:00+03:30'}
  ],
  mergeRequests: [
    {id:'mr1',repositoryId:'repo1',taskId:'t2',iid:42,title:'TASK-102 Safety interlock',status:'opened',reviewStatus:'awaiting-review',sourceBranch:'task/TASK-102-safety-interlock',targetBranch:'main',authorUserId:'u2',pipelineStatus:'passed',updatedAt:'2026-10-04T09:18:00+03:30'},
    {id:'mr2',repositoryId:'repo4',taskId:'t6',iid:18,title:'TASK-301 Safety guard logic',status:'opened',reviewStatus:'changes-requested',sourceBranch:'task/TASK-301-safety-guard',targetBranch:'main',authorUserId:'u2',pipelineStatus:'failed',updatedAt:'2026-10-03T14:20:00+03:30'}
  ],
  pipelines: [
    {id:'gp1',repositoryId:'repo1',ref:'task/TASK-102-safety-interlock',status:'passed',sha:'7fd13b8',updatedAt:'2026-10-04T09:12:00+03:30'},
    {id:'gp2',repositoryId:'repo4',ref:'task/TASK-301-safety-guard',status:'failed',sha:'59bc1d0',updatedAt:'2026-10-03T14:15:00+03:30'}
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
export const createId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
export const formatMoney = value => new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 }).format(Math.round(value)) + ' تومان';
export const formatHours = value => new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 1 }).format(value) + ' نفر-ساعت';

export function projectEntries(data, projectId) { return data.timeEntries.filter(e => e.projectId === projectId); }
export function projectActualHours(data, projectId) { return sum(projectEntries(data, projectId), e => e.hours); }
export function workPackageActualHours(data, workPackageId) { return sum(data.timeEntries.filter(e => e.workPackageId === workPackageId), e => e.hours); }
export function taskActualHours(data, taskId) { return sum(data.timeEntries.filter(e => e.taskId === taskId), e => e.hours); }
export function projectLaborCost(data, projectId) { return sum(projectEntries(data, projectId), e => e.hours * e.laborCostRate); }
export function projectDirectCost(data, projectId) { return sum(data.directCosts.filter(c => c.projectId === projectId && c.type === 'consumption' && c.approved !== false), c => c.amount); }
export function approvedChanges(data, projectId) { return data.changeRequests.filter(c => c.projectId === projectId && c.status === 'approved'); }
export function projectProgress(data, projectId) {
  const milestones = data.milestones.filter(m => m.projectId === projectId);
  const totalWeight = sum(milestones, m => m.weight);
  return totalWeight ? sum(milestones.filter(m => m.status === 'complete'), m => m.weight) / totalWeight * 100 : 0;
}
export function daysBetween(from, to) { return Math.round((new Date(`${to}T12:00:00`) - new Date(`${from}T12:00:00`)) / 86400000); }
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
  const approvedChangeCost = sum(approvedChanges(data, projectId), c => c.costImpact || 0);
  const estimatedRemainingCost = remainingHours * project.forecastRate + remainingDirect + approvedChangeCost;
  const forecastFinalCost = actualCost + estimatedRemainingCost;
  const contract = project.contractId ? byId(data.contracts, project.contractId) : null;
  const forecastRevenue = (contract?.amount || 0) + sum(approvedChanges(data, projectId), c => c.revenueImpact);
  const forecastProfit = forecastRevenue - forecastFinalCost;
  return { plannedHours, actualHours, laborCost, directCost, actualCost, remainingHours, remainingDirect, approvedChangeCost, estimatedRemainingCost, forecastFinalCost, forecastRevenue, forecastProfit, forecastMargin: forecastRevenue ? forecastProfit / forecastRevenue * 100 : 0, budgetConsumption: project.budget ? actualCost / project.budget * 100 : 0, forecastBudgetVariance: forecastFinalCost - project.budget };
}

export function projectHealth(data, projectId) {
  const project = byId(data.projects, projectId);
  const progress = projectProgress(data, projectId);
  if (progress >= 100) return { key:'complete', label:'تکمیل‌شده', reason:'همهٔ milestoneهای تحویل پذیرفته شده‌اند.' };
  const financials = projectFinancials(data, projectId);
  if (financials.forecastFinalCost > project.budget) return { key:'over', label:'بیش‌بودجه', reason:`هزینهٔ نهایی پیش‌بینی‌شده ${Math.round(financials.forecastBudgetVariance / 1000000)} میلیون تومان بیشتر از بودجه است.` };
  const blockedCritical = data.tasks.filter(t => t.projectId === projectId && t.blocked && ['high','critical'].includes(t.priority));
  const overdue = data.tasks.filter(t => t.projectId === projectId && t.status !== 'done' && t.dueDate < DEMO_ASSUMPTIONS.today);
  const lateMilestones = data.milestones.filter(m => m.projectId === projectId && m.status !== 'complete' && m.dueDate < DEMO_ASSUMPTIONS.today);
  if (blockedCritical.length || overdue.length || lateMilestones.length || daysBetween(project.baselineDueDate, project.dueDate) > 5) {
    const reason = blockedCritical.length ? `${blockedCritical.length} کار مهم مسدود است.` : overdue.length ? `${overdue.length} کار از سررسید گذشته است.` : lateMilestones.length ? `${lateMilestones.length} milestone عقب‌افتاده است.` : `پایان پروژه ${daysBetween(project.baselineDueDate, project.dueDate)} روز از خط مبنا عقب‌تر است.`;
    return { key:'risk', label:'در معرض ریسک', reason };
  }
  return { key:'healthy', label:'سالم', reason:'مانع بحرانی یا انحراف جدی ثبت نشده است.' };
}

export function projectInsights(data, projectId) {
  const project = byId(data.projects, projectId);
  const health = projectHealth(data, projectId);
  const blocked = data.tasks.filter(t => t.projectId === projectId && t.blocked);
  const upcoming = data.milestones.filter(m => m.projectId === projectId && m.status !== 'complete').sort((a,b)=>a.dueDate.localeCompare(b.dueDate))[0];
  return {
    health,
    progress: projectProgress(data, projectId),
    scheduleVariance: daysBetween(project.baselineDueDate, project.dueDate),
    blockedCount: blocked.length,
    nextMilestone: upcoming || null,
    actions: [blocked.length ? `رفع ${blocked.length} مانع باز` : null, upcoming ? `آماده‌سازی ${upcoming.name} تا ${upcoming.dueDate}` : null, projectFinancials(data,projectId).forecastBudgetVariance > 0 ? 'بازبینی پیش‌بینی هزینه و تغییرات' : null].filter(Boolean)
  };
}

export function teamWorkload(data, projectId = null) {
  return data.users.filter(u => ['team','lead','manager'].includes(u.role)).map(user => {
    const tasks = data.tasks.filter(t => t.status !== 'done' && t.assigneeIds.includes(user.id) && (!projectId || t.projectId === projectId));
    const remainingTotal = sum(tasks, t => Math.max(0, (t.estimatedHours || 0) - taskActualHours(data,t.id)) / Math.max(1,t.assigneeIds.length));
    const remaining = sum(tasks, t => {
      const total = Math.max(0,(t.estimatedHours || 0) - taskActualHours(data,t.id));
      const daysAvailable = Math.max(1,daysBetween(DEMO_ASSUMPTIONS.today,t.dueDate) + 1);
      const weeksAvailable = t.dueDate < DEMO_ASSUMPTIONS.today ? 1 : Math.max(1,Math.ceil(daysAvailable / 7));
      return total / weeksAvailable / Math.max(1,t.assigneeIds.length);
    });
    const capacity = user.weeklyCapacity || 40;
    return { user, tasks, remaining, remainingTotal, capacity, utilization: remaining / capacity * 100 };
  });
}

export function attendanceVariance(record) { return record.attendanceHours - record.projectHours - record.internalHours; }

export function projectRepositories(data, projectId) { return (data.repositories || []).filter(repository => repository.projectId === projectId); }
export function taskGitLink(data, taskId) { return (data.taskGitLinks || []).find(link => link.taskId === taskId); }

export function linkTaskToRepository(data, input) {
  const task = byId(data.tasks,input.taskId);
  const repository = byId(data.repositories,input.repositoryId);
  if (!task || !repository || task.projectId !== repository.projectId) throw new Error('وظیفه و مخزن باید متعلق به یک پروژه باشند.');
  const existing = taskGitLink(data,task.id);
  const values = { taskId:task.id, repositoryId:repository.id, branch:input.branch.trim(), issueRef:input.issueRef?.trim() || null };
  if (!values.branch) throw new Error('نام branch الزامی است.');
  if (existing) Object.assign(existing,values); else data.taskGitLinks.push({id:`gl-${createId()}`,...values});
  addActivity(data,{projectId:task.projectId,userId:input.userId,type:'git',text:`${task.code} به branch «${values.branch}» در مخزن ${repository.name} متصل شد.`});
  return existing || data.taskGitLinks.at(-1);
}

export function simulateGitWebhook(data, input) {
  const repository = byId(data.repositories,input.repositoryId);
  const task = input.taskId ? byId(data.tasks,input.taskId) : null;
  if (!repository) throw new Error('مخزن معتبر انتخاب کنید.');
  const actorId = input.userId || 'u2';
  const stamp = `${DEMO_ASSUMPTIONS.today}T10:30:00+03:30`;
  if (input.eventType === 'push') {
    const sha = createId().replaceAll('-','').slice(0,7);
    data.gitCommits.unshift({id:`gcm-${createId()}`,repositoryId:repository.id,taskId:task?.id||null,sha,message:task?`${task.code} Simulated code update`:'Simulated repository update',authorUserId:actorId,committedAt:stamp});
    repository.lastCommitAt=stamp;
    if (task?.status === 'todo') task.status='doing';
    addActivity(data,{projectId:repository.projectId,userId:actorId,type:'git',text:`Webhook push: commit ${sha}${task?` به ${task.code}`:''} متصل شد.`});
  }
  if (input.eventType === 'merge_request') {
    if (!task) throw new Error('برای merge request یک وظیفه انتخاب کنید.');
    const link = taskGitLink(data,task.id);
    if (!link) throw new Error('ابتدا وظیفه را به branch متصل کنید.');
    const iid = Math.max(0,...data.mergeRequests.map(item=>item.iid)) + 1;
    data.mergeRequests.unshift({id:`mr-${createId()}`,repositoryId:repository.id,taskId:task.id,iid,title:`${task.code} ${task.title}`,status:'opened',reviewStatus:'awaiting-review',sourceBranch:link.branch,targetBranch:repository.defaultBranch,authorUserId:actorId,pipelineStatus:'pending',updatedAt:stamp});
    link.mergeRequestIid=iid;
    task.status='review';
    addActivity(data,{projectId:repository.projectId,userId:actorId,type:'git',text:`Webhook: merge request !${iid} برای ${task.code} باز شد و کار به بازبینی رفت.`});
  }
  if (input.eventType === 'pipeline') {
    const link = task ? taskGitLink(data,task.id) : null;
    const status = input.pipelineStatus || 'failed';
    data.pipelines.unshift({id:`gp-${createId()}`,repositoryId:repository.id,ref:link?.branch||repository.defaultBranch,status,sha:'demo-sha',updatedAt:stamp});
    addActivity(data,{projectId:repository.projectId,userId:actorId,type:'git',text:`Webhook: pipeline شاخهٔ ${link?.branch||repository.defaultBranch} ${status==='passed'?'موفق':'ناموفق'} شد.`});
  }
  if (input.eventType === 'tag') {
    data.releases ||= [];
    const tag = `v1.0-demo-${data.releases.length+1}`;
    data.releases.unshift({id:`rel-${createId()}`,repositoryId:repository.id,tag,createdAt:stamp,authorUserId:actorId});
    addActivity(data,{projectId:repository.projectId,userId:actorId,type:'git',text:`Webhook: release نمایشی ${tag} ثبت شد.`});
  }
  data.meta.lastGitWebhook=stamp;
  return data;
}

export function addActivity(data, { projectId, userId, type, text }) {
  data.activity ||= [];
  data.activity.unshift({ id:`ev-${createId()}`, projectId, userId, type, text, date:`${DEMO_ASSUMPTIONS.today}T12:00:00+03:30` });
}

export function addTimeEntry(data, input) {
  const hours = Number(input.hours);
  const date = input.date || DEMO_ASSUMPTIONS.today;
  if (!input.projectId || !input.workPackageId || !Number.isFinite(hours) || hours <= 0) throw new Error('پروژه، بستهٔ کاری و مدت معتبر را وارد کنید.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(new Date(`${date}T12:00:00`).getTime())) throw new Error('تاریخ کار معتبر نیست.');
  if (date > DEMO_ASSUMPTIONS.today) throw new Error('ثبت زمان برای روز آینده مجاز نیست.');
  const workPackage = byId(data.workPackages,input.workPackageId);
  if (!workPackage || workPackage.projectId !== input.projectId) throw new Error('بستهٔ کاری با پروژهٔ انتخاب‌شده هم‌خوان نیست.');
  const task = input.taskId ? byId(data.tasks, input.taskId) : null;
  if (task && (task.projectId !== input.projectId || task.workPackageId !== input.workPackageId)) throw new Error('وظیفه با پروژه و بستهٔ کاری انتخاب‌شده هم‌خوان نیست.');
  data.timeEntries.unshift({ id: `te-${createId()}`, projectId: input.projectId, workPackageId: input.workPackageId, taskId: input.taskId || null, userId: input.userId, date, hours, note: input.note?.trim() || 'ثبت سریع زمان', laborCostRate: input.laborCostRate || 1450000, approved: false, source:input.source || 'manual', startedAt:input.startedAt || null, endedAt:input.endedAt || null });
  addActivity(data,{projectId:input.projectId,userId:input.userId,type:'time',text:`${hours} ساعت زمان برای ${input.note?.trim() || 'فعالیت پروژه'} در تاریخ ${date} ثبت شد.`});
  return data;
}

export function startTimer(data, input, startedAt = new Date().toISOString()) {
  data.activeTimers ||= [];
  if (data.activeTimers.some(timer => timer.userId === input.userId)) throw new Error('برای این کاربر یک تایمر فعال وجود دارد؛ ابتدا آن را متوقف کنید.');
  const workPackage = byId(data.workPackages,input.workPackageId);
  const task = input.taskId ? byId(data.tasks,input.taskId) : null;
  if (!input.projectId || !workPackage || workPackage.projectId !== input.projectId) throw new Error('پروژه و بستهٔ کاری معتبر انتخاب کنید.');
  if (task && (task.projectId !== input.projectId || task.workPackageId !== input.workPackageId)) throw new Error('وظیفه با پروژه و بستهٔ کاری انتخاب‌شده هم‌خوان نیست.');
  const timer = { id:`timer-${createId()}`, userId:input.userId, projectId:input.projectId, workPackageId:input.workPackageId, taskId:input.taskId || null, note:input.note?.trim() || 'کار با تایمر', date:DEMO_ASSUMPTIONS.today, startedAt };
  data.activeTimers.push(timer);
  addActivity(data,{projectId:timer.projectId,userId:timer.userId,type:'timer',text:`تایمر «${timer.note}» شروع شد.`});
  return timer;
}

export function timerElapsedHours(timer, endedAt = new Date().toISOString()) {
  const elapsedMs = new Date(endedAt).getTime() - new Date(timer.startedAt).getTime();
  if (!Number.isFinite(elapsedMs) || elapsedMs < 0) throw new Error('زمان شروع یا پایان تایمر معتبر نیست.');
  return Math.max(0.01,Math.round(elapsedMs / 36000) / 100);
}

export function stopTimer(data, input, endedAt = new Date().toISOString()) {
  data.activeTimers ||= [];
  const index = data.activeTimers.findIndex(timer => timer.id === input.timerId && timer.userId === input.userId);
  if (index < 0) throw new Error('تایمر فعال پیدا نشد.');
  const timer = data.activeTimers[index];
  const hours = timerElapsedHours(timer,endedAt);
  data.activeTimers.splice(index,1);
  addTimeEntry(data,{...timer,hours,laborCostRate:input.laborCostRate,source:'timer',startedAt:timer.startedAt,endedAt});
  return { timer, hours };
}

export function taskStatusLabel(status) { return ({ todo: 'آماده انجام', doing: 'در حال انجام', review: 'آماده بررسی', done: 'انجام‌شده' })[status]; }
export function healthClass(health) { return ({ healthy: 'good', risk: 'warn', over: 'bad', complete: 'neutral' })[health]; }
