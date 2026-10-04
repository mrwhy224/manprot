import {
  DEMO_ASSUMPTIONS, addActivity, addTimeEntry, attendanceVariance, byId, createId, daysBetween,
  formatHours, formatMoney, healthClass, linkTaskToRepository, projectFinancials, projectHealth, projectInsights,
  projectProgress, projectRepositories, simulateGitWebhook, startTimer, stopTimer, taskActualHours, taskGitLink, taskStatusLabel, teamWorkload, workPackageActualHours
} from './core.mjs';
import { DemoRepository } from './repository.mjs';

const repository = new DemoRepository();
let data = repository.load();
let role = localStorage.getItem('robotyar-role') || 'manager';
let route = location.hash.slice(1) || 'portfolio';
let selectedProjectId = localStorage.getItem('robotyar-project') || 'p1';
let projectTab = new URLSearchParams(location.search).get('tab') || 'overview';
let boardAssignee = 'all';
let boardPriority = 'all';
let flash = '';
let timerTicker = null;
const app = document.querySelector('#app');

const roles = { team:'عضو تیم', lead:'رهبر فنی', manager:'مدیر پروژه', finance:'مالی', executive:'مدیر ارشد' };
const roleUsers = { team:'u1', lead:'u2', manager:'u3', finance:'u4', executive:'u5' };
const priorities = { low:'کم', medium:'متوسط', high:'زیاد', critical:'بحرانی' };
const statuses = ['todo','doing','review','done'];
const projectTabs = [
  ['overview','نمای کلی'], ['plan','برنامه و timeline'], ['tasks','وظایف'], ['team','تیم و زمان'],
  ['costs','هزینه‌ها'], ['risks','ریسک و تغییرات'], ['git','کد و مخازن'], ['documents','اسناد'], ['activity','تاریخچه']
];
const nav = [
  ['mine','کارهای من','◈',['team','lead','manager']],
  ['board','برد وظایف','▦',['team','lead','manager']],
  ['project','مرکز فرمان پروژه','◫',['lead','manager','finance','executive']],
  ['portfolio','پرتفوی و سودآوری','◌',['lead','manager','finance','executive']],
  ['resources','ظرفیت تیم','♙',['lead','manager','executive']],
  ['approvals','کارتابل تأییدها','✓',['lead','manager','finance','executive']],
  ['integrations','پیش‌نمایش اتصال‌ها','⌁',['lead','manager','finance']],
  ['knowledge','دستیار دانش پروژه','✦',['team','lead','manager','finance','executive']]
];

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[char]);
const user = () => byId(data.users, roleUsers[role]);
const project = id => byId(data.projects,id);
const customer = p => p.customerId ? byId(data.customers,p.customerId) : null;
const contract = p => p.contractId ? byId(data.contracts,p.contractId) : null;
const wp = id => byId(data.workPackages,id);
const save = () => { repository.save(data); render(); };
const percent = value => new Intl.NumberFormat('fa-IR',{maximumFractionDigits:0}).format(value) + '٪';
const number = value => new Intl.NumberFormat('fa-IR',{maximumFractionDigits:1}).format(value);
const dateFa = value => value ? new Intl.DateTimeFormat('fa-IR',{month:'short',day:'numeric'}).format(new Date(value + 'T12:00:00')) : '—';
const canManage = () => ['lead','manager'].includes(role);
const canApprove = kind => ({ time:['lead','manager'], cost:['manager','finance'], deliverable:['lead','manager'], change:['manager','executive'] })[kind]?.includes(role);
const currentTimer = () => (data.activeTimers || []).find(timer => timer.userId === user().id);
const currentLaborRate = () => role==='lead'?1850000:role==='manager'?1750000:1450000;

function elapsedText(startedAt) {
  const seconds=Math.max(0,Math.floor((Date.now()-new Date(startedAt).getTime())/1000));
  const hours=String(Math.floor(seconds/3600)).padStart(2,'0');
  const minutes=String(Math.floor(seconds%3600/60)).padStart(2,'0');
  const remainder=String(seconds%60).padStart(2,'0');
  return `${hours}:${minutes}:${remainder}`;
}
function timerTopbar() {
  const timer=currentTimer();
  if(!timer)return route==='mine'?'':`<button class="timer-start-small" data-action="start-timer">▶ شروع تایمر</button>`;
  return `<div class="active-timer"><span class="timer-pulse"></span><div><b data-timer-started="${timer.startedAt}">${elapsedText(timer.startedAt)}</b><small>${wp(timer.workPackageId)?.name} · ${esc(timer.note)}</small></div><button data-action="stop-timer" data-timer="${timer.id}">■ پایان</button></div>`;
}
function startTimerTicker() {
  clearInterval(timerTicker);
  const update=()=>document.querySelectorAll('[data-timer-started]').forEach(element=>{element.textContent=elapsedText(element.dataset.timerStarted);});
  update();
  if(currentTimer())timerTicker=setInterval(update,1000);
}

function render() {
  clearInterval(timerTicker);
  const allowed = nav.find(item => item[0] === route)?.[3].includes(role);
  if (!allowed) route = role === 'team' ? 'mine' : 'portfolio';
  const pages = { mine:pageMine, board:pageBoard, project:pageProject, portfolio:pagePortfolio, resources:pageResources, approvals:pageApprovals, integrations:pageIntegrations, knowledge:pageKnowledge };
  app.innerHTML = `<div class="shell">
    <aside class="sidebar">
      <a class="brand" href="#mine"><span class="brand-mark">ر</span><span>رُبات‌یار<small>مدیریت پروژه‌های مهندسی</small></span></a>
      <nav>${nav.filter(item=>item[3].includes(role)).map(([id,label,icon])=>`<a data-nav="${id}" class="nav-item ${route===id?'active':''}" href="#${id}"><b>${icon}</b>${label}${id==='approvals' && approvalCount() ? `<i>${number(approvalCount())}</i>` : ''}</a>`).join('')}</nav>
      <div class="sidebar-foot"><div class="demo-pill">● ${DEMO_ASSUMPTIONS.scenarioLabel}</div><button class="link-button" data-action="reset">بازنشانی داده‌های نمایشی</button></div>
    </aside>
    <main>
      <header class="topbar"><div class="mobile-brand">رُبات‌یار</div><div class="scenario-date">◷ ${DEMO_ASSUMPTIONS.scenarioLabel}</div>${['team','lead','manager'].includes(role)?timerTopbar():''}<div class="role-switch"><span>نمایش به‌عنوان</span><select id="role-select">${Object.entries(roles).map(([id,label])=>`<option value="${id}" ${role===id?'selected':''}>${label}</option>`).join('')}</select></div><div class="profile"><span class="avatar">${user().name.slice(0,1)}</span><span>${user().name}<small>${user().title}</small></span></div></header>
      <section class="page">${flash ? `<div class="flash">✓ ${esc(flash)}</div>` : ''}${pages[route]()}</section>
    </main>
  </div>`;
  flash = '';
  bind();
  startTimerTicker();
}

function pageHeader(eyebrow,title,subtitle,actions='') {
  return `<div class="page-header"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="muted">${subtitle}</p></div><div class="header-actions">${actions}</div></div>`;
}
function metric(label,value,hint='',tone='') { return `<div class="metric ${tone}"><span>${label}</span><strong>${value}</strong>${hint?`<small>${hint}</small>`:''}</div>`; }
function empty(text) { return `<div class="empty">◌<p>${text}</p></div>`; }
function statusBadge(status) { return `<span class="status ${status}">${taskStatusLabel(status)}</span>`; }
function priorityBadge(priority='medium') { return `<span class="priority ${priority}">${priorities[priority]}</span>`; }
function healthBadge(projectId) { const health=projectHealth(data,projectId); return `<span class="health ${healthClass(health.key)}">${health.label}</span>`; }
function personNames(ids) { return ids.map(id=>byId(data.users,id)?.name).filter(Boolean).join('، '); }
function taskCode(task) { return task.code || `TASK-${String(data.tasks.indexOf(task)+101).padStart(3,'0')}`; }
function recordActivity(projectId,type,text) { addActivity(data,{projectId,userId:user().id,type,text}); }

function pageMine() {
  const me=user();
  const myTasks=data.tasks.filter(t=>t.assigneeIds.includes(me.id)&&t.status!=='done');
  const today=data.timeEntries.filter(e=>e.userId===me.id&&e.date===DEMO_ASSUMPTIONS.today);
  const recent=[...data.timeEntries].filter(e=>e.userId===me.id).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,8);
  const blocked=myTasks.filter(t=>t.blocked);
  const running=currentTimer();
  const actions=`<button class="secondary" data-action="quick-time">＋ ثبت دستی</button>${running?`<button class="timer-stop" data-action="stop-timer" data-timer="${running.id}">■ پایان تایمر</button>`:'<button class="primary" data-action="start-timer">▶ شروع تایمر</button>'}`;
  return `${pageHeader('فضای شخصی','کارهای من',`${DEMO_ASSUMPTIONS.scenarioLabel}؛ زمان را دستی ثبت کنید یا هنگام کار تایمر را روشن بگذارید.`,actions)}
    <div class="metrics four">${metric('زمان ثبت‌شدهٔ امروز',formatHours(today.reduce((s,e)=>s+e.hours,0)),'ثبت‌های پایان‌یافته')}${metric('تایمر فعال',running?`<span class="metric-timer" data-timer-started="${running.startedAt}">${elapsedText(running.startedAt)}</span>`:'خاموش',running?running.note:'برای شروع کار تایمر را روشن کنید')}${metric('کارهای فعال',number(myTasks.length),blocked.length?`${number(blocked.length)} مورد مسدود`:'مانع ثبت‌نشده')}${metric('نزدیک‌ترین سررسید',myTasks.length?dateFa([...myTasks].sort((a,b)=>a.dueDate.localeCompare(b.dueDate))[0].dueDate):'—','بر اساس تاریخ سناریو')}</div>
    <div class="two-col"><section class="panel"><div class="section-title"><h2>اولویت امروز</h2><a data-nav="board" href="#board">مشاهدهٔ برد ←</a></div><div class="task-list">${myTasks.length?myTasks.map(taskRow).join(''):empty('کار فعالی برای شما نیست.')}</div></section>
    <section class="panel subtle"><div class="section-title"><h2>کارکردهای اخیر</h2><button class="text-button" data-action="quick-time">ثبت دستی</button></div>${recent.length?recent.map(timeRow).join(''):empty('هنوز زمانی ثبت نشده است.')}<div class="hint-box">هر ثبت تاریخ کار و روش ثبت دارد؛ زمان‌ها پس از پایان تایمر یا ثبت دستی وارد کارتابل تأیید می‌شوند.</div></section></div>`;
}
function timeRow(entry) {
  const source=entry.source==='timer'?'تایمر':'دستی';
  return `<div class="time-row"><span class="time-dot ${entry.source==='timer'?'timer':''}"></span><div><b>${wp(entry.workPackageId)?.name || 'فعالیت'}</b><small>${entry.date} · ${source} · ${esc(entry.note)} · ${entry.approved?'تأییدشده':'در انتظار تأیید'}</small></div><strong>${formatHours(entry.hours)}</strong></div>`;
}
function taskRow(task) {
  const p=project(task.projectId);
  return `<button class="task-row" data-action="open-task" data-task="${task.id}"><span class="task-check">${task.status==='done'?'✓':'○'}</span><span class="grow"><b>${esc(task.title)}</b><small>${p.name} · ${wp(task.workPackageId).name}${task.blocked?` · <em>مسدود: ${esc(task.blockReason)}</em>`:''}</small></span><span>${priorityBadge(task.priority)} ${statusBadge(task.status)}<small class="due">${dateFa(task.dueDate)}</small></span></button>`;
}

function filteredBoardTasks(projectId) {
  return data.tasks.filter(t=>t.projectId===projectId && (boardAssignee==='all'||t.assigneeIds.includes(boardAssignee)) && (boardPriority==='all'||t.priority===boardPriority));
}
function boardMarkup(projectId) {
  const tasks=filteredBoardTasks(projectId);
  return `<div class="board">${statuses.map(status=>{
    const column=tasks.filter(t=>t.status===status);
    return `<section class="board-col" data-drop-status="${status}"><header><h2>${taskStatusLabel(status)}</h2><span>${number(column.length)}</span></header>${column.length?column.map(boardCard).join(''):empty('کاری در این ستون نیست.')}</section>`;
  }).join('')}</div>`;
}
function boardCard(task) {
  const actual=taskActualHours(data,task.id);
  return `<article class="board-card ${task.blocked?'blocked':''}" draggable="true" data-drag-task="${task.id}"><div class="card-top">${priorityBadge(task.priority)}${task.blocked?'<span class="block">مسدود</span>':statusBadge(task.status)}</div><h3>${esc(task.title)}</h3><p>${wp(task.workPackageId).name}</p><div class="mini-progress"><i style="width:${Math.min(100,(actual/(task.estimatedHours||1))*100)}%"></i></div><small>${formatHours(actual)} از ${formatHours(task.estimatedHours||0)} · ${personNames(task.assigneeIds)}</small><footer><span>◷ ${dateFa(task.dueDate)}</span><button data-action="open-task" data-task="${task.id}">باز کردن</button></footer></article>`;
}
function boardFilters(projectId) {
  return `<div class="board-tools"><select id="board-assignee"><option value="all">همهٔ افراد</option>${data.users.filter(u=>['team','lead','manager'].includes(u.role)).map(u=>`<option value="${u.id}" ${boardAssignee===u.id?'selected':''}>${u.name}</option>`).join('')}</select><select id="board-priority"><option value="all">همهٔ اولویت‌ها</option>${Object.entries(priorities).map(([id,label])=>`<option value="${id}" ${boardPriority===id?'selected':''}>${label}</option>`).join('')}</select>${canManage()?`<button class="primary" data-action="new-task" data-project="${projectId}">＋ وظیفه جدید</button>`:''}</div>`;
}
function pageBoard() {
  const p=project(selectedProjectId) || data.projects[0];
  return `${pageHeader('عملیات پروژه','برد وظایف','کارت‌ها را جابه‌جا کنید؛ بازبینی، پذیرش تحویل و تأیید زمان مستقل‌اند.',`<select class="project-picker" id="board-project">${data.projects.map(x=>`<option value="${x.id}" ${x.id===p.id?'selected':''}>${x.name}</option>`).join('')}</select>`)}${boardFilters(p.id)}${boardMarkup(p.id)}`;
}

function pageProject() {
  const p=project(selectedProjectId) || data.projects[0];
  const health=projectHealth(data,p.id);
  const ct=contract(p);
  return `${pageHeader(p.code,p.name,`${customer(p)?.name||'فعالیت داخلی'} · مالک: ${byId(data.users,p.ownerId).name}`,`${healthBadge(p.id)}<select class="project-picker" id="detail-project">${data.projects.map(x=>`<option value="${x.id}" ${x.id===p.id?'selected':''}>${x.name}</option>`).join('')}</select>`)}
    <div class="context">${ct?`<span>مشتری <b>${customer(p).name}</b></span><span>قرارداد <b>${ct.code}</b></span><span>ارزش <b>${formatMoney(ct.amount)}</b></span><span>وصول <b>${formatMoney(ct.collected)}</b></span>`:'<span><b>تحقیق و توسعهٔ داخلی</b></span>'}<span>خط مبنا <b>${p.baselineDueDate}</b></span><span>پیش‌بینی پایان <b>${p.dueDate}</b></span></div>
    <div class="project-alert ${health.key}"><b>${health.label}</b><span>${health.reason}</span></div>
    <div class="tabs">${projectTabs.map(([id,label])=>`<button data-action="project-tab" data-tab="${id}" class="${projectTab===id?'active':''}">${label}</button>`).join('')}</div>
    <div class="tab-content">${projectTabContent(p)}</div>`;
}
function projectTabContent(p) {
  return ({overview:projectOverview,plan:projectPlan,tasks:projectTasks,team:projectTeam,costs:projectCosts,risks:projectRisks,git:projectGit,documents:projectDocuments,activity:projectActivity})[projectTab](p);
}
function projectOverview(p) {
  const insight=projectInsights(data,p.id), fin=projectFinancials(data,p.id);
  const openTasks=data.tasks.filter(t=>t.projectId===p.id&&t.status!=='done');
  const pending=projectApprovalItems(p.id);
  return `<div class="metrics four">${metric('پیشرفت پذیرفته‌شده',percent(insight.progress),'وزن milestoneهای تاییدشده')}${metric('انحراف زمان',`${number(insight.scheduleVariance)} روز`,'نسبت به خط مبنا',insight.scheduleVariance>5?'danger':'')}${metric('هزینهٔ نهایی',formatMoney(fin.forecastFinalCost),`بودجه ${formatMoney(p.budget)}`,fin.forecastBudgetVariance>0?'danger':'')}${metric('موارد نیازمند اقدام',number(insight.blockedCount+pending.length),`${number(openTasks.length)} کار باز`,insight.blockedCount?'danger':'')}</div>
    <div class="two-col"><section class="panel"><div class="section-title"><h2>مسیر تحویل پروژه</h2><span class="muted">پیشرفت از پذیرش milestone محاسبه می‌شود</span></div>${milestoneTimeline(p.id)}</section>
    <section class="panel action-panel"><h2>اقدام‌های پیشنهادی</h2>${insight.actions.length?insight.actions.map((item,i)=>`<div class="next-action"><b>${number(i+1)}</b><span>${item}</span></div>`).join(''):empty('اقدام فوری ثبت نشده است.')}${pending.length?`<button class="secondary wide" data-nav="approvals">${number(pending.length)} مورد در انتظار تأیید</button>`:''}</section></div>
    <div class="two-col"><section class="panel"><div class="section-title"><h2>کارهای بحرانی و مسدود</h2><button class="text-button" data-action="project-tab" data-tab="tasks">رفتن به وظایف</button></div>${openTasks.filter(t=>t.blocked||t.priority==='critical').map(taskRow).join('')||empty('کار بحرانی باز نیست.')}</section>
    <section class="panel"><h2>خلاصهٔ مالی</h2><div class="financial-lines"><span>هزینهٔ واقعی <b>${formatMoney(fin.actualCost)}</b></span><span>هزینهٔ باقی‌مانده <b>${formatMoney(fin.estimatedRemainingCost)}</b></span><span>سود پیش‌بینی‌شده <b class="${fin.forecastProfit<0?'red':''}">${formatMoney(fin.forecastProfit)}</b></span><span>حاشیهٔ پیش‌بینی <b>${percent(fin.forecastMargin)}</b></span></div></section></div>`;
}
function milestoneTimeline(projectId) {
  const items=data.milestones.filter(m=>m.projectId===projectId).sort((a,b)=>a.dueDate.localeCompare(b.dueDate));
  return `<div class="milestone-track">${items.map(m=>`<div class="milestone ${m.status}"><i></i><b>${esc(m.name)}</b><small>${dateFa(m.dueDate)} · وزن ${percent(m.weight)}</small><span>${m.status==='complete'?'پذیرفته‌شده':'برنامه‌ریزی‌شده'}</span></div>`).join('')}</div>`;
}
function projectPlan(p) {
  const packages=data.workPackages.filter(w=>w.projectId===p.id);
  const total=Math.max(1,daysBetween(p.startDate,p.dueDate));
  return `<section class="panel"><div class="section-title"><h2>ساختار شکست کار و timeline</h2><span class="muted">خط مبنا ${p.baselineDueDate} · پیش‌بینی ${p.dueDate}</span></div><div class="gantt-head"><span>بستهٔ کاری</span><span>شروع</span><span>پایان</span><span>برنامه</span></div>${packages.map(w=>{
    const left=Math.max(0,daysBetween(p.startDate,w.startDate)/total*100);
    const width=Math.max(4,daysBetween(w.startDate,w.dueDate)/total*100);
    const actual=workPackageActualHours(data,w.id);
    return `<div class="gantt-row"><div><b>${w.name}</b><small>مالک: ${byId(data.users,w.ownerId).name} · ${formatHours(actual)} / ${formatHours(w.estimatedHours)}</small></div><span>${dateFa(w.startDate)}</span><span>${dateFa(w.dueDate)}</span><div class="gantt-line"><i style="right:${left}%;width:${Math.min(width,100-left)}%"></i></div></div>`;
  }).join('')}</section><section class="panel"><div class="section-title"><h2>Milestoneهای تحویل</h2><span class="muted">مجموع وزن‌ها ۱۰۰٪</span></div>${milestoneTimeline(p.id)}</section>`;
}
function projectTasks(p) { return `${boardFilters(p.id)}${boardMarkup(p.id)}`; }
function workloadCards(items) {
  return `<div class="workload-grid">${items.map(item=>{
    const tone=item.utilization>100?'over':item.utilization>85?'busy':'available';
    return `<article class="workload-card ${tone}"><div><span class="avatar">${item.user.name.slice(0,1)}</span><div><b>${item.user.name}</b><small>${item.user.title}</small></div><strong>${percent(item.utilization)}</strong></div><div class="capacity-bar"><i style="width:${Math.min(item.utilization,100)}%"></i></div><p>${formatHours(item.remaining)} بار موردنیاز این هفته · ظرفیت ${formatHours(item.capacity)}</p><small>${item.tasks.length?item.tasks.map(t=>t.title).join('، '):'کار بازی تخصیص داده نشده است.'}</small></article>`;
  }).join('')}</div>`;
}
function projectTeam(p) {
  const attendance=data.attendance.filter(a=>data.timeEntries.some(e=>e.projectId===p.id&&e.userId===a.userId));
  return `<section class="panel"><div class="section-title"><h2>ظرفیت و بار تیم پروژه</h2><span class="muted">ساعت باقی‌مانده بین هفته‌های تا سررسید توزیع شده است</span></div>${workloadCards(teamWorkload(data,p.id))}</section><section class="panel"><h2>تطبیق حضور و ثبت پروژه</h2><div class="table-wrap"><table><thead><tr><th>همکار</th><th>روز</th><th>حضور</th><th>پروژه/داخلی</th><th>اختلاف</th></tr></thead><tbody>${attendance.map(a=>{const variance=attendanceVariance(a);return `<tr><td>${byId(data.users,a.userId).name}</td><td>${a.date}</td><td>${formatHours(a.attendanceHours)}</td><td>${formatHours(a.projectHours+a.internalHours)}</td><td class="${variance<0?'red':variance>0?'amber':''}">${variance<0?`${formatHours(Math.abs(variance))} بیش‌ثبت`:formatHours(variance)}</td></tr>`;}).join('')}</tbody></table></div></section>`;
}
function projectCosts(p) {
  const fin=projectFinancials(data,p.id), ct=contract(p), costs=data.directCosts.filter(c=>c.projectId===p.id), changes=data.changeRequests.filter(c=>c.projectId===p.id&&c.status==='approved');
  return `<div class="metrics four">${metric('هزینهٔ کار',formatMoney(fin.laborCost),formatHours(fin.actualHours))}${metric('مصرف مستقیم تاییدشده',formatMoney(fin.directCost),`${number(costs.filter(c=>c.approved===false).length)} مورد در انتظار`)}${metric('اثر هزینهٔ تغییرات',formatMoney(fin.approvedChangeCost),'تغییرات تاییدشده')}${metric('سود پیش‌بینی',formatMoney(fin.forecastProfit),`حاشیه ${percent(fin.forecastMargin)}`,fin.forecastProfit<0?'danger':'')}</div>
    <div class="two-col"><section class="panel"><div class="section-title"><h2>مصرف مستقیم</h2>${['manager','finance'].includes(role)?'<button class="secondary" data-action="direct-cost">＋ ثبت مصرف</button>':''}</div>${costs.map(c=>`<div class="approval-row"><div><b>${esc(c.name)}</b><small>${c.date} · ${c.approved===false?'در انتظار تأیید':'تأییدشده'}</small></div><strong>${formatMoney(c.amount)}</strong></div>`).join('')||empty('هزینه‌ای ثبت نشده است.')}</section>
    <section class="panel"><h2>پل پیش‌بینی</h2><div class="financial-lines"><span>درآمد قرارداد <b>${formatMoney(ct?.amount||0)}</b></span><span>درآمد تغییرات <b>${formatMoney(changes.reduce((s,c)=>s+c.revenueImpact,0))}</b></span><span>هزینهٔ واقعی <b>${formatMoney(fin.actualCost)}</b></span><span>هزینهٔ باقیمانده <b>${formatMoney(fin.estimatedRemainingCost)}</b></span><span>هزینهٔ نهایی <b>${formatMoney(fin.forecastFinalCost)}</b></span></div></section></div>`;
}
function riskScore(risk) { return risk.probability*risk.impact; }
function projectRisks(p) {
  const risks=(data.risks||[]).filter(r=>r.projectId===p.id), changes=data.changeRequests.filter(c=>c.projectId===p.id);
  return `<div class="two-col"><section class="panel"><div class="section-title"><h2>دفتر ریسک</h2><span class="muted">احتمال × اثر</span></div>${risks.map(r=>`<article class="risk-card ${riskScore(r)>=16?'severe':''}"><div><b>${esc(r.title)}</b><span>امتیاز ${number(riskScore(r))}</span></div><p>پاسخ: ${esc(r.response)}</p><small>مالک: ${byId(data.users,r.ownerId).name} · ${r.status==='closed'?'بسته':'باز/در حال کنترل'}</small></article>`).join('')||empty('ریسک بازی ثبت نشده است.')}</section>
    <section class="panel"><h2>درخواست‌های تغییر</h2>${changes.map(c=>`<article class="change"><div class="section-title"><b>${esc(c.title)}</b><span class="status ${c.status==='approved'?'done':'review'}">${c.status==='approved'?'تاییدشده':'در انتظار'}</span></div><p>${esc(c.description)}</p><small>${formatHours(c.hoursImpact)} · هزینه ${formatMoney(c.costImpact)} · درآمد ${formatMoney(c.revenueImpact)} · ${number(c.dueDateImpact)} روز</small>${c.status==='pending'&&['manager','executive'].includes(role)?`<button class="primary wide" data-action="approve-change" data-id="${c.id}">تأیید تغییر</button>`:''}</article>`).join('')||empty('درخواست تغییری ثبت نشده است.')}</section></div>`;
}
function projectGit(p) {
  const connection=data.gitConnections[0];
  const repositories=projectRepositories(data,p.id);
  const repositoryIds=repositories.map(item=>item.id);
  const tasks=data.tasks.filter(task=>task.projectId===p.id);
  const links=data.taskGitLinks.filter(link=>tasks.some(task=>task.id===link.taskId));
  const commits=data.gitCommits.filter(commit=>repositoryIds.includes(commit.repositoryId)).sort((a,b)=>b.committedAt.localeCompare(a.committedAt));
  const mergeRequests=data.mergeRequests.filter(item=>repositoryIds.includes(item.repositoryId));
  const failedPipelines=data.pipelines.filter(item=>repositoryIds.includes(item.repositoryId)&&item.status==='failed');
  return `<div class="git-connection"><div class="git-logo">G</div><div><b>${connection.name}</b><span>${connection.baseUrl} · اتصال ${connection.mode==='demo'?'نمایشی':'زنده'}</span></div><span class="connection-status">● متصل</span><small>آخرین webhook: ${connection.lastWebhookAt.replace('T',' ').slice(0,16)}</small></div>
    <div class="metrics four">${metric('مخازن متصل',number(repositories.length),'یک پروژه می‌تواند چند مخزن داشته باشد')}${metric('وظایف متصل',number(links.length),`از ${number(tasks.length)} وظیفه`)}${metric('Merge request باز',number(mergeRequests.filter(item=>item.status==='opened').length),'بازبینی فنی مستقل از پذیرش')}${metric('Pipeline ناموفق',number(failedPipelines.length),failedPipelines.length?'نیازمند اقدام فنی':'همه سالم',failedPipelines.length?'danger':'')}</div>
    <section class="panel"><div class="section-title"><div><h2>مخازن پروژه</h2><span class="muted">اطلاعات ساختگی برای نمایش اتصال Git داخلی</span></div><div class="header-actions"><button class="secondary" data-action="git-link">＋ اتصال وظیفه</button><button class="primary" data-action="git-webhook">⚡ شبیه‌سازی webhook</button></div></div><div class="repo-grid">${repositories.map(repository=>{
      const pipeline=data.pipelines.find(item=>item.repositoryId===repository.id);
      return `<article class="repo-card"><div><span class="repo-icon">⌘</span><div><b>${repository.name}</b><small>${repository.path}</small></div></div><dl><div><dt>شاخهٔ اصلی</dt><dd>${repository.defaultBranch}</dd></div><div><dt>فناوری</dt><dd>${repository.language}</dd></div><div><dt>آخرین commit</dt><dd>${repository.lastCommitAt.slice(0,16).replace('T',' ')}</dd></div><div><dt>Pipeline</dt><dd class="pipeline ${pipeline?.status||'none'}">${pipeline?.status==='passed'?'موفق':pipeline?.status==='failed'?'ناموفق':'ثبت نشده'}</dd></div></dl></article>`;
    }).join('')||empty('مخزنی به این پروژه متصل نیست.')}</div></section>
    <div class="two-col"><section class="panel"><div class="section-title"><h2>وظیفه، branch و merge request</h2><span class="muted">پیوند دستی مرحلهٔ اول</span></div>${tasks.map(task=>{
      const link=taskGitLink(data,task.id),repository=link?byId(data.repositories,link.repositoryId):null,mr=link?.mergeRequestIid?data.mergeRequests.find(item=>item.iid===link.mergeRequestIid&&item.repositoryId===link.repositoryId):null;
      return `<div class="git-task-row"><span class="code">${taskCode(task)}</span><div><b>${task.title}</b><small>${link?`${repository.name} · ${link.branch}`:'به Git متصل نیست'}</small></div>${mr?`<span class="mr-state">!${mr.iid} · ${mr.reviewStatus==='awaiting-review'?'در انتظار بازبینی':'نیازمند اصلاح'}</span>`:`<button class="text-button" data-action="git-link" data-task="${task.id}">${link?'ویرایش اتصال':'اتصال'}</button>`}</div>`;
    }).join('')}</section>
    <section class="panel"><div class="section-title"><h2>آخرین فعالیت Git</h2><span class="muted">دریافت‌شده از webhook نمایشی</span></div>${commits.slice(0,6).map(commit=>`<div class="commit-row"><code>${commit.sha}</code><div><b>${esc(commit.message)}</b><small>${byId(data.users,commit.authorUserId)?.name||'کاربر Git'} · ${commit.committedAt.slice(0,16).replace('T',' ')}${commit.taskId?'':' · بدون وظیفه'}</small></div></div>`).join('')||empty('Commit ثبت نشده است.')}${commits.some(commit=>!commit.taskId)?'<div class="warning-box">یک commit به هیچ وظیفه‌ای متصل نیست و نیازمند بررسی است.</div>':''}</section></div>`;
}
function projectDocuments(p) {
  const docs=data.knowledgeDocuments.filter((_,i)=>i<2 || (p.id==='p3'&&i===2));
  return `<section class="panel"><div class="section-title"><h2>اسناد پروژه</h2><span class="muted">نسخهٔ نمایشی؛ فایل‌ها ساختگی‌اند</span></div><div class="document-grid">${docs.map(d=>`<article class="document-card"><span>▤</span><div><b>${esc(d.title)}</b><p>${esc(d.section)}</p><small>${d.date} · سطح دسترسی ${d.access==='finance'?'مالی':'پروژه'}</small></div><button disabled>پیش‌نمایش</button></article>`).join('')}</div></section>`;
}
function projectActivity(p) {
  const items=(data.activity||[]).filter(e=>e.projectId===p.id).sort((a,b)=>b.date.localeCompare(a.date));
  return `<section class="panel"><div class="section-title"><h2>تاریخچهٔ قابل ردیابی</h2><span class="muted">چه کسی، چه کاری، چه زمانی</span></div><div class="activity-list">${items.map(e=>`<div class="activity-item"><i class="${e.type}"></i><div><b>${esc(e.text)}</b><small>${byId(data.users,e.userId)?.name||'سیستم'} · ${e.date.slice(0,16).replace('T',' ')}</small></div></div>`).join('')||empty('رویدادی ثبت نشده است.')}</div></section>`;
}

function projectCard(p) {
  const fin=projectFinancials(data,p.id), progress=projectProgress(data,p.id);
  return `<button class="portfolio-card" data-project="${p.id}"><div>${healthBadge(p.id)}<span class="code">${p.code}</span></div><h2>${p.name}</h2><p>${customer(p)?.name||'فعالیت داخلیِ بازاستفاده‌پذیر'}</p><div class="progress"><i style="width:${Math.min(progress,100)}%"></i></div><footer><span>پذیرش تحویل: ${percent(progress)}</span><b class="${fin.forecastProfit<0?'red':''}">${formatMoney(fin.forecastProfit)}</b></footer></button>`;
}
function pagePortfolio() {
  const clients=data.projects.filter(p=>!p.internal), internal=data.projects.filter(p=>p.internal);
  const total=clients.reduce((s,p)=>s+projectFinancials(data,p.id).forecastProfit,0);
  const risks=clients.filter(p=>['risk','over'].includes(projectHealth(data,p.id).key)).length;
  return `${pageHeader('مدیریت','پرتفوی و سودآوری','سلامت، پیشرفت و پیش‌بینی‌ها از داده‌های عملیاتی محاسبه می‌شوند.')}
    <div class="metrics">${metric('پروژه‌های مشتری',number(clients.length),`${number(risks)} پروژه نیازمند توجه`,risks?'danger':'')}${metric('سود پیش‌بینی پرتفوی',formatMoney(total),'پس از تغییرات تاییدشده')}${metric('تأییدهای باز',number(approvalCount()),'زمان، هزینه، تحویل و تغییر')}</div>
    <div class="portfolio-grid">${clients.map(projectCard).join('')}</div><section class="panel"><div class="section-title"><h2>تلاش مهندسی داخلی</h2><span class="tag">غیرقابل‌صورتحساب خودکار</span></div>${internal.map(projectCard).join('')}</section>`;
}

function pageResources() {
  const workload=teamWorkload(data);
  const overloaded=workload.filter(x=>x.utilization>100);
  return `${pageHeader('برنامه‌ریزی منابع','ظرفیت تیم',`بار کار باز در برابر ظرفیت هفتگی؛ ${number(overloaded.length)} نفر بیش‌تخصیص دارد.`)}
    <div class="metrics">${metric('ظرفیت هفتگی',formatHours(workload.reduce((s,x)=>s+x.capacity,0)),'اعضای فنی و مدیریت پروژه')}${metric('بار برنامه‌ریزی‌شدهٔ این هفته',formatHours(workload.reduce((s,x)=>s+x.remaining,0)),'باقی‌مانده متناسب با هفته‌های تا سررسید')}${metric('بیش‌تخصیص',number(overloaded.length),overloaded.map(x=>x.user.name).join('، ')||'موردی نیست',overloaded.length?'danger':'')}</div>
    <section class="panel">${workloadCards(workload)}</section>
    <section class="panel"><div class="section-title"><h2>ماتریس تخصیص</h2><span class="muted">تعداد کار باز هر نفر در هر پروژه</span></div><div class="table-wrap"><table><thead><tr><th>همکار</th>${data.projects.map(p=>`<th>${p.code.replace('PRJ-','')}</th>`).join('')}</tr></thead><tbody>${workload.map(item=>`<tr><td><b>${item.user.name}</b></td>${data.projects.map(p=>`<td>${number(data.tasks.filter(t=>t.projectId===p.id&&t.status!=='done'&&t.assigneeIds.includes(item.user.id)).length)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;
}

function projectApprovalItems(projectId) {
  const times=data.timeEntries.filter(e=>e.projectId===projectId&&e.approved===false).map(item=>({kind:'time',item}));
  const costs=data.directCosts.filter(e=>e.projectId===projectId&&e.approved===false).map(item=>({kind:'cost',item}));
  const deliverables=data.tasks.filter(e=>e.projectId===projectId&&e.status==='review'&&!e.accepted).map(item=>({kind:'deliverable',item}));
  const changes=data.changeRequests.filter(e=>e.projectId===projectId&&e.status==='pending').map(item=>({kind:'change',item}));
  return [...times,...costs,...deliverables,...changes];
}
function approvalCount() { return data.projects.reduce((sum,p)=>sum+projectApprovalItems(p.id).length,0); }
function pageApprovals() {
  const items=data.projects.flatMap(p=>projectApprovalItems(p.id).map(x=>({...x,project:p})));
  const groups={time:items.filter(x=>x.kind==='time'),cost:items.filter(x=>x.kind==='cost'),deliverable:items.filter(x=>x.kind==='deliverable'),change:items.filter(x=>x.kind==='change')};
  return `${pageHeader('کنترل و پاسخ‌گویی','کارتابل تأییدها','زمان، مصرف، تحویل‌دادنی و تغییرات تا تأیید نهایی از هم جدا می‌مانند.')}
    <div class="metrics four">${metric('ثبت زمان',number(groups.time.length),'در انتظار مدیر')}${metric('مصرف مستقیم',number(groups.cost.length),'در انتظار مالی/مدیر')}${metric('تحویل‌دادنی',number(groups.deliverable.length),'در انتظار بازبین')}${metric('درخواست تغییر',number(groups.change.length),'در انتظار تصمیم')}</div>
    <section class="panel approval-list">${items.length?items.map(approvalRow).join(''):empty('کارتابل خالی است.')}</section>`;
}
function approvalRow(entry) {
  const labels={time:'ثبت زمان',cost:'مصرف مستقیم',deliverable:'تحویل‌دادنی',change:'درخواست تغییر'};
  const item=entry.item;
  const title=entry.kind==='time'?`${byId(data.users,item.userId).name} · ${formatHours(item.hours)}`:entry.kind==='cost'?item.name:item.title;
  const detail=entry.kind==='time'?`${item.date} · ${item.source==='timer'?'تایمر':'دستی'} · ${item.note}`:entry.kind==='cost'?formatMoney(item.amount):entry.kind==='deliverable'?`بازبین: ${byId(data.users,item.reviewerId)?.name||'مدیر پروژه'}`:`هزینه ${formatMoney(item.costImpact)} · ${number(item.dueDateImpact)} روز`;
  return `<div class="approval-row"><span class="approval-kind ${entry.kind}">${labels[entry.kind]}</span><div><b>${esc(title)}</b><small>${entry.project.name} · ${esc(detail)}</small></div>${canApprove(entry.kind)?`<button class="primary" data-action="approve-item" data-kind="${entry.kind}" data-id="${item.id}">تأیید</button>`:'<span class="muted">فقط مشاهده</span>'}</div>`;
}

function pageIntegrations() {
  const mismatches=data.accountingPreview.filter(a=>a.status==='mismatch');
  return `${pageHeader('پیش‌نمایش‌های قابل‌تعویض','اتصال حضور و سپیدار','هیچ اتصال زنده یا سند مالی واقعی در این نمونه وجود ندارد.')}
    <div class="two-col"><section class="panel"><div class="integration-title"><span class="integration-icon">◴</span><div><h2>تطبیق حضور و ثبت زمان</h2><p>کم‌ثبت و بیش‌ثبت هر دو آشکار می‌شوند.</p></div></div><table><thead><tr><th>کاربر / روز</th><th>حضور</th><th>ثبت‌شده</th><th>اختلاف</th></tr></thead><tbody>${data.attendance.map(a=>{const variance=attendanceVariance(a);return `<tr><td>${byId(data.users,a.userId).name}<small>${a.date}</small></td><td>${a.attendanceHours}</td><td>${a.projectHours+a.internalHours}</td><td class="${variance!==0?'red':''}">${variance<0?`${Math.abs(variance)} بیش‌ثبت`:`${variance} ثبت‌نشده`}</td></tr>`;}).join('')}</tbody></table></section>
    <section class="panel"><div class="integration-title"><span class="integration-icon">₪</span><div><h2>شبیه‌سازی اتصال سپیدار</h2><p>آخرین همگام‌سازی: ${data.meta.lastSimulatedSync}</p></div></div><table><thead><tr><th>کد پروژه</th><th>شرح</th><th>مبلغ</th></tr></thead><tbody>${data.accountingPreview.map(a=>`<tr><td>${a.code}</td><td>${a.entry}${a.status==='mismatch'?'<small class="red">در صف مغایرت</small>':''}</td><td>${formatMoney(a.amount)}</td></tr>`).join('')}</tbody></table>${mismatches.length?`<div class="warning-box">${number(mismatches.length)} مورد نیازمند تعیین کد پروژه است.</div>`:''}</section></div>`;
}

function pageKnowledge() {
  const questions=[['acceptance','معیار پذیرش قرارداد آریا چیست؟'],['gripper','مشکل مشابهی برای گیره داشته‌ایم؟'],['profit','چرا سود پیش‌بینی پالتایزر افت کرده است؟']];
  return `${pageHeader('پیش‌نمایش موجود — خارج از دامنهٔ این مرحله','دستیار دانش پروژه','این بخش همان شبیه‌سازی قبلی است و در ارتقای فعلی توسعه داده نشده است.')}
    <div class="knowledge"><section class="panel prompt-panel"><span class="simulated">✦ پاسخ شبیه‌سازی‌شده</span><h2>چه چیزی می‌خواهید بدانید؟</h2><div class="question-list">${questions.map(([id,q])=>`<button data-action="knowledge" data-question="${id}">${q}<span>←</span></button>`).join('')}</div></section><section class="assistant-answer" id="assistant-answer"><div class="assistant-orb">✦</div><h2>یک پرسش نمونه را انتخاب کنید</h2><p>هر پاسخ منبع، بخش و تاریخ سند ساختگی را نشان می‌دهد.</p></section></div>`;
}
function knowledgeAnswer(kind) {
  const panel=document.querySelector('#assistant-answer'); if(!panel)return;
  const doc=id=>data.knowledgeDocuments.find(d=>d.id===id); let answer,source;
  if(kind==='acceptance'){source=doc('kd1');answer='پذیرش پس از FAT موفق و سپس تأیید نصب در سایت مشتری انجام می‌شود.';}
  if(kind==='gripper'){source=doc('kd2');answer='در پروژهٔ ساختگی سپهر، لغزش گیره با افزایش سطح تماس فک و افزودن سنسور فشار برطرف شد.';}
  if(kind==='profit'){source=doc('kd3');if(!['finance','executive'].includes(role)){panel.innerHTML='<div class="assistant-orb lock">⌁</div><span class="denied">دسترسی محدود</span><h2>نمایش داده نمی‌شود</h2><p>این پرسش شامل اطلاعات مالی حساس است.</p>';return;}const f=projectFinancials(data,'p3');answer=`هزینهٔ نهایی ${formatMoney(f.forecastFinalCost)} و سود پیش‌بینی ${formatMoney(f.forecastProfit)} است؛ تغییر تاییدشده نیز در هزینه و درآمد لحاظ شده است.`;}
  panel.innerHTML=`<div class="assistant-orb">✦</div><span class="simulated">پاسخ شبیه‌سازی‌شده</span><h2>پاسخ بر اساس سناریوی نمونه</h2><p>${answer}</p><div class="source"><b>منبع ساختگی</b><span>${source.title} · ${source.section} · ${source.date}</span></div>`;
}

function quickTime(prefill={}) {
  const selected=prefill.projectId||selectedProjectId;
  document.body.insertAdjacentHTML('beforeend',`<div class="modal-backdrop" id="modal"><form class="modal" id="time-form"><button type="button" class="close" data-action="close-modal">×</button><p class="eyebrow">ثبت دستی زمان</p><h2>کارکرد مربوط به کدام روز است؟</h2><p class="muted">تاریخ کار مستقل از زمان ثبت در سامانه نگهداری می‌شود.</p><div class="form-grid"><label>تاریخ کار<input id="time-date" type="date" max="${DEMO_ASSUMPTIONS.today}" value="${prefill.date||DEMO_ASSUMPTIONS.today}" required></label><label>مدت (ساعت)<input id="time-hours" type="number" min="0.25" step="0.25" value="1" required></label></div><label>پروژه<select id="time-project">${data.projects.map(p=>`<option value="${p.id}" ${selected===p.id?'selected':''}>${p.name}</option>`).join('')}</select></label><label>بستهٔ کاری<select id="time-wp"></select></label><label>وظیفه <span>اختیاری</span><select id="time-task"></select></label><label>یادداشت کوتاه<input id="time-note" maxlength="100" placeholder="مثلاً بازبینی نقشه"></label><div class="hint-box">این ثبت با منبع «دستی» و تاریخ انتخاب‌شده برای تأیید مدیر ارسال می‌شود.</div><button class="primary wide" type="submit">ثبت زمان</button></form></div>`);
  const pEl=document.querySelector('#time-project'),wpEl=document.querySelector('#time-wp'),taskEl=document.querySelector('#time-task');
  const populate=()=>{const list=data.workPackages.filter(x=>x.projectId===pEl.value);wpEl.innerHTML=list.map(x=>`<option value="${x.id}" ${(prefill.workPackageId||'')===x.id?'selected':''}>${x.name}</option>`).join('');const tasks=data.tasks.filter(x=>x.projectId===pEl.value&&x.workPackageId===wpEl.value);taskEl.innerHTML='<option value="">بدون وظیفه (جلسه/پشتیبانی)</option>'+tasks.map(x=>`<option value="${x.id}" ${(prefill.taskId||'')===x.id?'selected':''}>${x.title}</option>`).join('');};
  pEl.addEventListener('change',populate);wpEl.addEventListener('change',populate);populate();
  document.querySelector('#time-form').addEventListener('submit',event=>{event.preventDefault();try{addTimeEntry(data,{projectId:pEl.value,workPackageId:wpEl.value,taskId:taskEl.value,userId:user().id,date:document.querySelector('#time-date').value,hours:document.querySelector('#time-hours').value,note:document.querySelector('#time-note').value,laborCostRate:currentLaborRate(),source:'manual'});document.querySelector('#modal').remove();flash='زمان دستی با تاریخ انتخاب‌شده ثبت و برای تأیید ارسال شد.';save();}catch(error){alert(error.message);}});
}
function timerModal(prefill={}) {
  if(currentTimer()){alert('یک تایمر فعال دارید؛ ابتدا آن را پایان دهید.');return;}
  const selected=prefill.projectId||selectedProjectId;
  document.body.insertAdjacentHTML('beforeend',`<div class="modal-backdrop" id="modal"><form class="modal" id="timer-form"><button type="button" class="close" data-action="close-modal">×</button><p class="eyebrow">ثبت زندهٔ کار</p><h2>شروع تایمر</h2><p class="muted">تایمر پس از بستن یا تازه‌سازی صفحه نیز فعال می‌ماند.</p><label>پروژه<select id="timer-project">${data.projects.map(p=>`<option value="${p.id}" ${selected===p.id?'selected':''}>${p.name}</option>`).join('')}</select></label><label>بستهٔ کاری<select id="timer-wp"></select></label><label>وظیفه <span>اختیاری</span><select id="timer-task"></select></label><label>در حال انجام چه کاری هستید؟<input id="timer-note" maxlength="100" required placeholder="مثلاً اصلاح منطق interlock"></label><div class="hint-box">هر کاربر فقط یک تایمر فعال دارد. با پایان تایمر، مدت محاسبه و به تاریخ امروز «${DEMO_ASSUMPTIONS.today}» ثبت می‌شود.</div><button class="timer-start-wide" type="submit">▶ شروع شمارش زمان</button></form></div>`);
  const pEl=document.querySelector('#timer-project'),wpEl=document.querySelector('#timer-wp'),taskEl=document.querySelector('#timer-task');
  const populate=()=>{const packages=data.workPackages.filter(item=>item.projectId===pEl.value);wpEl.innerHTML=packages.map(item=>`<option value="${item.id}" ${(prefill.workPackageId||'')===item.id?'selected':''}>${item.name}</option>`).join('');const tasks=data.tasks.filter(item=>item.projectId===pEl.value&&item.workPackageId===wpEl.value&&item.status!=='done');taskEl.innerHTML='<option value="">بدون وظیفه (جلسه/پشتیبانی)</option>'+tasks.map(item=>`<option value="${item.id}" ${(prefill.taskId||'')===item.id?'selected':''}>${taskCode(item)} · ${item.title}</option>`).join('');};
  pEl.addEventListener('change',populate);wpEl.addEventListener('change',populate);populate();
  document.querySelector('#timer-form').addEventListener('submit',event=>{event.preventDefault();try{startTimer(data,{projectId:pEl.value,workPackageId:wpEl.value,taskId:taskEl.value,userId:user().id,note:document.querySelector('#timer-note').value});document.querySelector('#modal').remove();flash='تایمر شروع شد؛ می‌توانید در بخش‌های دیگر سامانه کار کنید.';save();}catch(error){alert(error.message);}});
}
function finishTimer(timerId) {
  try {
    const result=stopTimer(data,{timerId,userId:user().id,laborCostRate:currentLaborRate()});
    flash=`تایمر پایان یافت و ${formatHours(result.hours)} برای تاریخ ${result.timer.date} ثبت شد.`;
    save();
  } catch(error) { alert(error.message); }
}
function taskModal(id) {
  const task=byId(data.tasks,id),p=project(task.projectId),actual=taskActualHours(data,id);
  const dependencies=(task.dependencies||[]).map(dep=>byId(data.tasks,dep)?.title).filter(Boolean);
  const gitLink=taskGitLink(data,task.id),gitRepo=gitLink?byId(data.repositories,gitLink.repositoryId):null,gitMr=gitLink?.mergeRequestIid?data.mergeRequests.find(item=>item.repositoryId===gitLink.repositoryId&&item.iid===gitLink.mergeRequestIid):null;
  const gitCommits=data.gitCommits.filter(commit=>commit.taskId===task.id);
  document.body.insertAdjacentHTML('beforeend',`<div class="modal-backdrop" id="modal"><section class="modal task-modal"><button class="close" data-action="close-modal">×</button><p class="eyebrow">${taskCode(task)} · ${p.name} · ${wp(task.workPackageId).name}</p><div class="modal-title"><h2>${esc(task.title)}</h2>${priorityBadge(task.priority)}</div><p>${esc(task.description||'شرح تکمیلی ثبت نشده است.')}</p>${task.blocked?`<p><span class="block">مسدود: ${esc(task.blockReason)}</span></p>`:''}
    <div class="task-facts"><span>مسئول <b>${personNames(task.assigneeIds)}</b></span><span>بازبین <b>${byId(data.users,task.reviewerId)?.name||'—'}</b></span><span>زمان <b>${formatHours(actual)} / ${formatHours(task.estimatedHours||0)}</b></span><span>سررسید <b>${task.dueDate}</b></span></div>
    ${dependencies.length?`<div class="hint-box">وابسته به: ${dependencies.join('، ')}</div>`:''}
    <div class="checklist"><h3>چک‌لیست</h3>${(task.checklist||[]).map((item,index)=>`<button data-action="toggle-check" data-task="${task.id}" data-index="${index}" class="${item.done?'done':''}"><span>${item.done?'✓':'○'}</span>${esc(item.text)}</button>`).join('')||'<p class="muted">چک‌لیستی ندارد.</p>'}</div>
    <div class="attachments"><b>پیوست‌ها</b><span>${(task.attachments||[]).join('، ')||'بدون پیوست'}</span></div>
    <div class="task-git"><div class="section-title"><h3>اتصال Git</h3><button class="text-button" data-action="git-link" data-task="${task.id}">${gitLink?'ویرایش':'اتصال به مخزن'}</button></div>${gitLink?`<div class="git-branch"><code>${gitLink.branch}</code><small>${gitRepo.name} · ${gitLink.issueRef||'بدون issue'} · ${gitCommits.length} commit${gitMr?` · MR !${gitMr.iid} (${gitMr.pipelineStatus})`:''}</small></div>`:'<p class="muted">هنوز branch یا issue به این وظیفه متصل نشده است.</p>'}</div>
    <div class="status-controls">${statuses.map(s=>`<button data-action="set-status" data-task="${task.id}" data-status="${s}" class="${task.status===s?'selected':''}">${taskStatusLabel(s)}</button>`).join('')}</div>
    <div class="modal-actions"><button class="secondary" data-action="quick-task-time" data-task="${task.id}">＋ ثبت دستی</button>${currentTimer()?`<button class="timer-stop" data-action="stop-timer" data-timer="${currentTimer().id}">■ پایان تایمر فعال</button>`:`<button class="timer-start-small" data-action="start-task-timer" data-task="${task.id}">▶ شروع تایمر</button>`}${canManage()?`<button class="secondary" data-action="edit-task" data-task="${task.id}">ویرایش</button>`:''}<button class="secondary" data-action="toggle-block" data-task="${task.id}">${task.blocked?'رفع مسدودی':'مسدود کردن'}</button>${task.status==='review'&&['lead','manager'].includes(role)?`<button class="primary" data-action="accept-task" data-task="${task.id}">پذیرش تحویل</button>`:''}</div>
    <div class="notes"><h3>یادداشت‌ها</h3>${task.notes.length?task.notes.map(n=>`<p>• ${esc(n)}</p>`).join(''):'<p class="muted">یادداشتی ثبت نشده است.</p>'}<form id="note-form"><input id="task-note" placeholder="یادداشت برای تیم…" required><button class="primary" type="submit">افزودن</button></form></div></section></div>`);
  document.querySelector('#note-form').addEventListener('submit',event=>{event.preventDefault();task.notes.push(document.querySelector('#task-note').value.trim());recordActivity(task.projectId,'comment',`برای «${task.title}» یادداشت افزوده شد.`);document.querySelector('#modal').remove();flash='یادداشت افزوده شد.';save();});
}
function taskEditorModal(id=null,projectId=selectedProjectId) {
  const task=id?byId(data.tasks,id):null;
  const selectedProject=task?.projectId||projectId;
  const packages=data.workPackages.filter(w=>w.projectId===selectedProject);
  document.body.insertAdjacentHTML('beforeend',`<div class="modal-backdrop" id="modal"><form class="modal" id="task-form"><button type="button" class="close" data-action="close-modal">×</button><p class="eyebrow">${task?'ویرایش وظیفه':'وظیفهٔ جدید'}</p><h2>${task?esc(task.title):'ساخت کار قابل پیگیری'}</h2><label>عنوان<input id="edit-title" required maxlength="100" value="${esc(task?.title||'')}"></label><label>شرح<input id="edit-description" maxlength="180" value="${esc(task?.description||'')}"></label><div class="form-grid"><label>بستهٔ کاری<select id="edit-wp">${packages.map(w=>`<option value="${w.id}" ${task?.workPackageId===w.id?'selected':''}>${w.name}</option>`).join('')}</select></label><label>اولویت<select id="edit-priority">${Object.entries(priorities).map(([key,label])=>`<option value="${key}" ${(task?.priority||'medium')===key?'selected':''}>${label}</option>`).join('')}</select></label><label>مسئول<select id="edit-assignee">${data.users.filter(u=>['team','lead','manager'].includes(u.role)).map(u=>`<option value="${u.id}" ${task?.assigneeIds.includes(u.id)?'selected':''}>${u.name}</option>`).join('')}</select></label><label>بازبین<select id="edit-reviewer">${data.users.filter(u=>['lead','manager'].includes(u.role)).map(u=>`<option value="${u.id}" ${task?.reviewerId===u.id?'selected':''}>${u.name}</option>`).join('')}</select></label><label>برآورد ساعت<input id="edit-hours" type="number" min="1" value="${task?.estimatedHours||8}" required></label><label>سررسید<input id="edit-due" type="date" value="${task?.dueDate||DEMO_ASSUMPTIONS.today}" required></label></div><label>چک‌لیست <span>هر مورد در یک خط</span><textarea id="edit-checklist">${esc((task?.checklist||[]).map(x=>x.text).join('\n'))}</textarea></label><label>پیوست‌ها <span>نام فایل‌ها با ویرگول</span><input id="edit-attachments" value="${esc((task?.attachments||[]).join(', '))}"></label><button class="primary wide" type="submit">ذخیره وظیفه</button></form></div>`);
  document.querySelector('#task-form').addEventListener('submit',event=>{event.preventDefault();const values={title:document.querySelector('#edit-title').value.trim(),description:document.querySelector('#edit-description').value.trim(),workPackageId:document.querySelector('#edit-wp').value,priority:document.querySelector('#edit-priority').value,assigneeIds:[document.querySelector('#edit-assignee').value],reviewerId:document.querySelector('#edit-reviewer').value,estimatedHours:Number(document.querySelector('#edit-hours').value),dueDate:document.querySelector('#edit-due').value,checklist:document.querySelector('#edit-checklist').value.split('\n').map(x=>x.trim()).filter(Boolean).map(text=>({text,done:false})),attachments:document.querySelector('#edit-attachments').value.split(',').map(x=>x.trim()).filter(Boolean)};if(task){Object.assign(task,values);recordActivity(task.projectId,'task',`وظیفهٔ «${task.title}» ویرایش شد.`);}else{const nextCode=`TASK-${String(101+data.tasks.length).padStart(3,'0')}`;const created={id:`t-${createId()}`,code:nextCode,projectId:selectedProject,status:'todo',blocked:false,dependencies:[],notes:[],startDate:DEMO_ASSUMPTIONS.today,...values};data.tasks.unshift(created);recordActivity(selectedProject,'task',`وظیفهٔ «${created.title}» ایجاد شد.`);}document.querySelector('#modal').remove();flash='وظیفه ذخیره شد.';save();});
}
function gitLinkModal(taskId=null) {
  const requestedTask=byId(data.tasks,taskId);
  const targetProjectId=requestedTask?.projectId||selectedProjectId;
  const projectTasks=data.tasks.filter(task=>task.projectId===targetProjectId);
  const repositories=projectRepositories(data,targetProjectId);
  if(!projectTasks.length||!repositories.length){alert('برای این پروژه وظیفه یا مخزن نمایشی وجود ندارد.');return;}
  const selectedTask=requestedTask||projectTasks[0];
  document.body.insertAdjacentHTML('beforeend',`<div class="modal-backdrop" id="modal"><form class="modal" id="git-link-form"><button type="button" class="close" data-action="close-modal">×</button><p class="eyebrow">اتصال دستی — مرحلهٔ اول</p><h2>پیوند وظیفه به Git</h2><p class="muted">در نسخهٔ تولیدی مخازن از API سرور Git خوانده می‌شوند.</p><label>وظیفه<select id="git-task">${projectTasks.map(task=>`<option value="${task.id}" ${task.id===selectedTask.id?'selected':''}>${taskCode(task)} · ${task.title}</option>`).join('')}</select></label><label>مخزن<select id="git-repository">${repositories.map(repository=>`<option value="${repository.id}">${repository.path}</option>`).join('')}</select></label><label>Branch<input id="git-branch" required></label><label>Issue مرجع<input id="git-issue" placeholder="#101"></label><div class="hint-box">Git فقط فعالیت مهندسی را تامین می‌کند؛ زمان، هزینه و پذیرش همچنان در سامانهٔ مدیریت پروژه کنترل می‌شوند.</div><button class="primary wide" type="submit">ذخیره اتصال</button></form></div>`);
  const taskEl=document.querySelector('#git-task'),repoEl=document.querySelector('#git-repository'),branchEl=document.querySelector('#git-branch'),issueEl=document.querySelector('#git-issue');
  const populate=()=>{const task=byId(data.tasks,taskEl.value),link=taskGitLink(data,task.id);if(link){repoEl.value=link.repositoryId;branchEl.value=link.branch;issueEl.value=link.issueRef||'';}else{branchEl.value=`task/${taskCode(task)}`;issueEl.value=`#${taskCode(task).replace('TASK-','')}`;}};
  taskEl.addEventListener('change',populate);populate();
  document.querySelector('#git-link-form').addEventListener('submit',event=>{event.preventDefault();try{linkTaskToRepository(data,{taskId:taskEl.value,repositoryId:repoEl.value,branch:branchEl.value,issueRef:issueEl.value,userId:user().id});document.querySelector('#modal').remove();flash='اتصال Git وظیفه ذخیره شد.';save();}catch(error){alert(error.message);}});
}
function gitWebhookModal() {
  const repositories=projectRepositories(data,selectedProjectId);
  const tasks=data.tasks.filter(task=>task.projectId===selectedProjectId);
  if(!repositories.length){alert('برای این پروژه مخزن نمایشی وجود ندارد.');return;}
  document.body.insertAdjacentHTML('beforeend',`<div class="modal-backdrop" id="modal"><form class="modal" id="git-webhook-form"><button type="button" class="close" data-action="close-modal">×</button><p class="eyebrow">Webhook نمایشی — مرحلهٔ دوم</p><h2>شبیه‌سازی رویداد Git</h2><p class="muted">هیچ درخواست شبکه یا تغییر در مخزن واقعی انجام نمی‌شود.</p><label>رویداد<select id="webhook-type"><option value="push">Push / commit</option><option value="merge_request">Merge request باز شد</option><option value="pipeline">Pipeline نتیجه داد</option><option value="tag">Release tag ساخته شد</option></select></label><label>مخزن<select id="webhook-repo">${repositories.map(repository=>`<option value="${repository.id}">${repository.path}</option>`).join('')}</select></label><label>وظیفه <span>برای push اختیاری است</span><select id="webhook-task"><option value="">بدون وظیفه</option>${tasks.map(task=>`<option value="${task.id}">${taskCode(task)} · ${task.title}</option>`).join('')}</select></label><label>نتیجهٔ pipeline<select id="webhook-pipeline"><option value="failed">ناموفق</option><option value="passed">موفق</option></select></label><button class="primary wide" type="submit">ارسال webhook نمایشی</button></form></div>`);
  document.querySelector('#git-webhook-form').addEventListener('submit',event=>{event.preventDefault();try{simulateGitWebhook(data,{eventType:document.querySelector('#webhook-type').value,repositoryId:document.querySelector('#webhook-repo').value,taskId:document.querySelector('#webhook-task').value,userId:user().id,pipelineStatus:document.querySelector('#webhook-pipeline').value});document.querySelector('#modal').remove();flash='Webhook پردازش شد؛ Git و تاریخچهٔ پروژه به‌روزرسانی شدند.';save();}catch(error){alert(error.message);}});
}
function entryModal(workPackageId) {
  const entries=data.timeEntries.filter(e=>e.workPackageId===workPackageId);
  document.body.insertAdjacentHTML('beforeend',`<div class="modal-backdrop" id="modal"><section class="modal"><button class="close" data-action="close-modal">×</button><h2>ثبت‌های ${wp(workPackageId).name}</h2>${entries.map(timeRow).join('')||empty('ثبت زمانی ندارد.')}</section></div>`);
}
function directCostModal() {
  const p=project(selectedProjectId);
  document.body.insertAdjacentHTML('beforeend',`<div class="modal-backdrop" id="modal"><form class="modal" id="cost-form"><button type="button" class="close" data-action="close-modal">×</button><p class="eyebrow">مصرف واقعی پروژه</p><h2>ثبت هزینهٔ مستقیم</h2><p class="muted">ثبت جدید تا تأیید مالی/مدیر وارد هزینهٔ واقعی نمی‌شود.</p><label>شرح مصرف<input id="cost-name" required maxlength="80"></label><label>مبلغ (تومان)<input id="cost-amount" type="number" min="1" step="1000" required></label><button class="primary wide" type="submit">ارسال برای تأیید</button></form></div>`);
  document.querySelector('#cost-form').addEventListener('submit',event=>{event.preventDefault();const amount=Number(document.querySelector('#cost-amount').value);if(!Number.isFinite(amount)||amount<=0)return;const name=document.querySelector('#cost-name').value.trim();data.directCosts.unshift({id:`dc-${createId()}`,projectId:p.id,name,amount,date:DEMO_ASSUMPTIONS.today,type:'consumption',approved:false});recordActivity(p.id,'cost',`مصرف «${name}» برای تأیید ثبت شد.`);document.querySelector('#modal').remove();flash='مصرف ثبت شد و به کارتابل تأیید رفت.';save();});
}

function approve(kind,id) {
  let projectId,text;
  if(kind==='time'){const item=byId(data.timeEntries,id);item.approved=true;projectId=item.projectId;text=`ثبت زمان ${formatHours(item.hours)} تأیید شد.`;}
  if(kind==='cost'){const item=byId(data.directCosts,id);item.approved=true;projectId=item.projectId;text=`مصرف «${item.name}» تأیید شد.`;}
  if(kind==='deliverable'){const item=byId(data.tasks,id);item.accepted=true;item.status='done';projectId=item.projectId;text=`تحویل‌دادنی «${item.title}» پذیرفته شد.`;}
  if(kind==='change'){const item=byId(data.changeRequests,id);item.status='approved';projectId=item.projectId;const p=project(projectId);const next=new Date(p.dueDate+'T12:00:00');next.setDate(next.getDate()+item.dueDateImpact);p.dueDate=next.toISOString().slice(0,10);text=`درخواست تغییر «${item.title}» تأیید شد و پایان پروژه ${item.dueDateImpact} روز جابه‌جا شد.`;}
  recordActivity(projectId,'approval',text);flash='مورد انتخاب‌شده تأیید شد.';save();
}

function bind() {
  document.querySelector('#role-select')?.addEventListener('change',event=>{role=event.target.value;localStorage.setItem('robotyar-role',role);render();});
  document.querySelector('#board-project')?.addEventListener('change',event=>{selectedProjectId=event.target.value;localStorage.setItem('robotyar-project',selectedProjectId);render();});
  document.querySelector('#detail-project')?.addEventListener('change',event=>{selectedProjectId=event.target.value;localStorage.setItem('robotyar-project',selectedProjectId);projectTab='overview';render();});
  document.querySelector('#board-assignee')?.addEventListener('change',event=>{boardAssignee=event.target.value;render();});
  document.querySelector('#board-priority')?.addEventListener('change',event=>{boardPriority=event.target.value;render();});
  document.querySelectorAll('[data-nav]').forEach(el=>el.addEventListener('click',()=>{route=el.dataset.nav;location.hash=route;render();}));
  document.querySelectorAll('[data-project]').forEach(el=>el.addEventListener('click',()=>{selectedProjectId=el.dataset.project;localStorage.setItem('robotyar-project',selectedProjectId);projectTab='overview';route='project';location.hash='project';render();}));
  document.querySelectorAll('[data-drag-task]').forEach(card=>card.addEventListener('dragstart',event=>event.dataTransfer.setData('text/plain',card.dataset.dragTask)));
  document.querySelectorAll('[data-drop-status]').forEach(column=>{column.addEventListener('dragover',event=>event.preventDefault());column.addEventListener('drop',event=>{event.preventDefault();const task=byId(data.tasks,event.dataTransfer.getData('text/plain'));if(!task)return;const requested=column.dataset.dropStatus;task.status=requested==='done'&&!task.accepted?'review':requested;recordActivity(task.projectId,'status',`وضعیت «${task.title}» به «${taskStatusLabel(task.status)}» تغییر کرد.`);flash=requested==='done'&&!task.accepted?'کار برای پذیرش تحویل‌دادنی به بازبینی فرستاده شد.':'وضعیت وظیفه به‌روزرسانی شد.';save();});});
}
function handleAction(event) {
  const button=event.target.closest('[data-action]');if(!button)return;
  const action=button.dataset.action;
  if(action==='reset'&&confirm('همهٔ تغییرات محلی نمایشی بازنشانی شود؟')){data=repository.reset();flash='داده‌های نمایشی بازنشانی شد.';render();}
  if(action==='quick-time')quickTime();
  if(action==='quick-task-time'){const task=byId(data.tasks,button.dataset.task);document.querySelector('#modal')?.remove();quickTime({projectId:task.projectId,workPackageId:task.workPackageId,taskId:task.id});}
  if(action==='start-timer')timerModal();
  if(action==='start-task-timer'){const task=byId(data.tasks,button.dataset.task);document.querySelector('#modal')?.remove();timerModal({projectId:task.projectId,workPackageId:task.workPackageId,taskId:task.id});}
  if(action==='stop-timer'){document.querySelector('#modal')?.remove();finishTimer(button.dataset.timer);}
  if(action==='close-modal')document.querySelector('#modal')?.remove();
  if(action==='open-task')taskModal(button.dataset.task);
  if(action==='new-task')taskEditorModal(null,button.dataset.project);
  if(action==='edit-task'){const id=button.dataset.task;document.querySelector('#modal')?.remove();taskEditorModal(id);}
  if(action==='git-link'){const taskId=button.dataset.task||null;document.querySelector('#modal')?.remove();gitLinkModal(taskId);}
  if(action==='git-webhook')gitWebhookModal();
  if(action==='show-entries')entryModal(button.dataset.wp);
  if(action==='direct-cost')directCostModal();
  if(action==='project-tab'){projectTab=button.dataset.tab;render();}
  if(action==='set-status'){const task=byId(data.tasks,button.dataset.task);const requested=button.dataset.status;task.status=requested==='done'&&!task.accepted?'review':requested;recordActivity(task.projectId,'status',`وضعیت «${task.title}» به «${taskStatusLabel(task.status)}» تغییر کرد.`);document.querySelector('#modal')?.remove();flash=requested==='done'&&!task.accepted?'کار برای پذیرش تحویل‌دادنی به بازبینی فرستاده شد.':'وضعیت وظیفه تغییر کرد.';save();}
  if(action==='toggle-block'){const task=byId(data.tasks,button.dataset.task);if(task.blocked){task.blocked=false;delete task.blockReason;}else{const reason=prompt('دلیل مسدودی را وارد کنید:');if(!reason)return;task.blocked=true;task.blockReason=reason;}recordActivity(task.projectId,'blocker',`مانع وظیفهٔ «${task.title}» ${task.blocked?'ثبت':'رفع'} شد.`);document.querySelector('#modal')?.remove();flash='وضعیت مانع به‌روزرسانی شد.';save();}
  if(action==='toggle-check'){const task=byId(data.tasks,button.dataset.task);const item=task.checklist[Number(button.dataset.index)];item.done=!item.done;document.querySelector('#modal')?.remove();taskModal(task.id);repository.save(data);}
  if(action==='accept-task'){document.querySelector('#modal')?.remove();approve('deliverable',button.dataset.task);}
  if(action==='approve-item'&&canApprove(button.dataset.kind))approve(button.dataset.kind,button.dataset.id);
  if(action==='approve-change')approve('change',button.dataset.id);
  if(action==='knowledge')knowledgeAnswer(button.dataset.question);
}

window.addEventListener('hashchange',()=>{route=location.hash.slice(1)||'portfolio';render();});
document.addEventListener('click',handleAction);
render();
