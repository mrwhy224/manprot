import { DEMO_ASSUMPTIONS, addTimeEntry, byId, formatHours, formatMoney, healthClass, projectActualHours, projectFinancials, projectLaborCost, taskStatusLabel, workPackageActualHours } from './core.mjs';
import { DemoRepository } from './repository.mjs';

const repository = new DemoRepository();
let data = repository.load();
let role = localStorage.getItem('robotyar-role') || 'team';
let route = location.hash.slice(1) || 'mine';
let selectedProjectId = localStorage.getItem('robotyar-project') || 'p1';
let flash = '';
const app = document.querySelector('#app');

const roles = { team: 'عضو تیم', lead: 'رهبر فنی', manager: 'مدیر پروژه', finance: 'مالی', executive: 'مدیر ارشد' };
const roleUsers = { team: 'u1', lead: 'u2', manager: 'u3', finance: 'u4', executive: 'u5' };
const nav = [
  ['mine', 'کارهای من', '◈', ['team','lead','manager']], ['board', 'برد وظایف', '▦', ['team','lead','manager']], ['project', 'نمای پروژه', '◫', ['lead','manager','finance','executive']],
  ['portfolio', 'پرتفوی و سودآوری', '◌', ['lead','manager','finance','executive']], ['integrations', 'پیش‌نمایش اتصال‌ها', '⌁', ['lead','manager','finance']], ['knowledge', 'دستیار دانش پروژه', '✦', ['team','lead','manager','finance','executive']]
];
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#039;' })[char]);
const user = () => byId(data.users, roleUsers[role]);
const project = id => byId(data.projects, id);
const customer = p => p.customerId ? byId(data.customers, p.customerId) : null;
const contract = p => p.contractId ? byId(data.contracts, p.contractId) : null;
const wp = id => byId(data.workPackages, id);
const save = () => { repository.save(data); render(); };
const percent = x => new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 }).format(x) + '٪';
const statuses = ['todo','doing','review','done'];

function render() {
  if (!nav.find(item => item[0] === route)?.[3].includes(role)) route = role === 'team' ? 'mine' : 'portfolio';
  const content = ({ mine: pageMine, board: pageBoard, project: pageProject, portfolio: pagePortfolio, integrations: pageIntegrations, knowledge: pageKnowledge })[route]();
  app.innerHTML = `<div class="shell">
    <aside class="sidebar"><a class="brand" href="#mine"><span class="brand-mark">ر</span><span>رُبات‌یار<small>مدیریت پروژه‌های مهندسی</small></span></a>
      <nav>${nav.filter(item => item[3].includes(role)).map(([id,label,icon]) => `<a data-nav="${id}" class="nav-item ${route===id?'active':''}" href="#${id}"><b>${icon}</b>${label}</a>`).join('')}</nav>
      <div class="sidebar-foot"><div class="demo-pill">● داده‌های نمایشی</div><button class="link-button" data-action="reset">بازنشانی داده‌های نمایشی</button></div>
    </aside>
    <main><header class="topbar"><div class="mobile-brand">رُبات‌یار</div><div class="role-switch"><span>نمایش به‌عنوان</span><select id="role-select">${Object.entries(roles).map(([id,label])=>`<option value="${id}" ${role===id?'selected':''}>${label}</option>`).join('')}</select></div><div class="profile"><span class="avatar">${user().name.slice(0,1)}</span><span>${user().name}<small>${user().title}</small></span></div></header>
    <section class="page">${flash ? `<div class="flash">✓ ${esc(flash)}</div>` : ''}${content}</section></main></div>`;
  bind();
}

function pageHeader(eyebrow, title, subtitle, actions='') { return `<div class="page-header"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="muted">${subtitle}</p></div><div class="header-actions">${actions}</div></div>`; }
function metric(label, value, hint='', tone='') { return `<div class="metric ${tone}"><span>${label}</span><strong>${value}</strong>${hint?`<small>${hint}</small>`:''}</div>`; }
function empty(text) { return `<div class="empty">◌<p>${text}</p></div>`; }
function statusBadge(status) { return `<span class="status ${status}">${taskStatusLabel(status)}</span>`; }

function pageMine() {
  const me = user(); const myTasks = data.tasks.filter(t => t.assigneeIds.includes(me.id) && t.status !== 'done');
  const today = data.timeEntries.filter(e => e.userId === me.id && e.date === DEMO_ASSUMPTIONS.today);
  const blocked = myTasks.filter(t => t.blocked);
  return `${pageHeader('فضای شخصی', 'کارهای من', `خوش آمدی ${me.name}؛ امروز ${new Intl.DateTimeFormat('fa-IR', {dateStyle:'full'}).format(new Date('2026-09-13'))} است.`, `<button class="primary" data-action="quick-time">＋ ثبت سریع زمان</button>`)}
    <div class="metrics">${metric('زمان ثبت‌شدهٔ امروز', formatHours(today.reduce((s,e)=>s+e.hours,0)), 'از همان ورودی پروژه به‌روزرسانی می‌شود')} ${metric('کارهای فعال', new Intl.NumberFormat('fa-IR').format(myTasks.length), blocked.length ? `${new Intl.NumberFormat('fa-IR').format(blocked.length)} مورد مسدود است` : 'مانع ثبت‌نشده')} ${metric('نزدیک‌ترین سررسید', myTasks.length ? myTasks.sort((a,b)=>a.dueDate.localeCompare(b.dueDate))[0].dueDate : '—', 'تاریخ نمایشی')}</div>
    <div class="two-col"><section class="panel"><div class="section-title"><h2>اولویت امروز</h2><a data-nav="board" href="#board">مشاهدهٔ برد ←</a></div><div class="task-list">${myTasks.length ? myTasks.map(taskRow).join('') : empty('کار فعالی برای شما نیست.')}</div></section>
      <section class="panel subtle"><div class="section-title"><h2>ثبت‌های امروز</h2><button class="text-button" data-action="quick-time">ثبت جدید</button></div>${today.length ? today.map(e => `<div class="time-row"><span class="time-dot"></span><div><b>${wp(e.workPackageId).name}</b><small>${esc(e.note)}</small></div><strong>${formatHours(e.hours)}</strong></div>`).join('') : empty('هنوز زمانی امروز ثبت نشده است.')}
      <div class="hint-box">ثبت زمان بدون وظیفه برای جلسه یا پشتیبانی مجاز است؛ اما باید به پروژه یا فعالیت داخلی متصل بماند.</div></section></div>`;
}
function taskRow(t) { const p = project(t.projectId); return `<button class="task-row" data-action="open-task" data-task="${t.id}"><span class="task-check">${t.status==='done'?'✓':'○'}</span><span class="grow"><b>${esc(t.title)}</b><small>${p.name} · ${wp(t.workPackageId).name}${t.blocked ? ` · <em>مسدود: ${esc(t.blockReason)}</em>`:''}</small></span><span>${statusBadge(t.status)}<small class="due">${t.dueDate}</small></span></button>`; }

function pageBoard() {
  const p = project(selectedProjectId); const candidates = data.projects.filter(x => !x.internal);
  return `${pageHeader('عملیات پروژه', 'برد وظایف', 'ارسال کار برای بازبینی با پذیرش تحویل‌دادنی یا تأیید زمان یکی نیست.', `<select class="project-picker" id="board-project">${candidates.map(x=>`<option value="${x.id}" ${x.id===p.id?'selected':''}>${x.name}</option>`).join('')}</select>`)}
  <div class="board">${statuses.map(status => { const tasks=data.tasks.filter(t=>t.projectId===p.id&&t.status===status); return `<section class="board-col"><header><h2>${taskStatusLabel(status)}</h2><span>${new Intl.NumberFormat('fa-IR').format(tasks.length)}</span></header>${tasks.length ? tasks.map(t=>`<article class="board-card ${t.blocked?'blocked':''}"><div class="card-top">${t.blocked?'<span class="block">مسدود</span>':''}${statusBadge(t.status)}</div><h3>${esc(t.title)}</h3><p>${wp(t.workPackageId).name}</p><footer><span>◷ ${t.dueDate}</span><button data-action="open-task" data-task="${t.id}">باز کردن</button></footer></article>`).join('') : empty('کاری در این ستون نیست.')}</section>`; }).join('')}</div>`;
}

function pageProject() {
  const p = project(selectedProjectId); const fin = projectFinancials(data, p.id); const ct = contract(p); const packages = data.workPackages.filter(w => w.projectId === p.id); const changes=data.changeRequests.filter(c=>c.projectId===p.id);
  return `${pageHeader(p.code, p.name, `${customer(p)?.name || 'فعالیت داخلی'} · مالک: ${byId(data.users,p.ownerId).name}`, `${['manager','finance'].includes(role) ? '<button class="secondary" data-action="direct-cost">＋ ثبت مصرف مستقیم</button>' : ''}<select class="project-picker" id="detail-project">${data.projects.map(x=>`<option value="${x.id}" ${x.id===p.id?'selected':''}>${x.name}</option>`).join('')}</select>`)}
  ${ct ? `<div class="context"><span>مشتری <b>${customer(p).name}</b></span><span>قرارداد <b>${ct.code}</b></span><span>ارزش قرارداد <b>${formatMoney(ct.amount)}</b></span><span>صورتحساب <b>${formatMoney(ct.invoiced)}</b></span><span>وصول <b>${formatMoney(ct.collected)}</b></span></div>` : `<div class="context"><span>نوع <b>تحقیق و توسعهٔ داخلی</b></span><span>این تلاش قابل‌انتساب خودکار به مشتری نیست.</span></div>`}
  <div class="metrics four">${metric('پیشرفت تحویل‌دادنی', percent(p.progress), 'بر پایهٔ پذیرش milestone، نه ساعت یا تعداد وظیفه')} ${metric('ساعت واقعی', formatHours(fin.actualHours), `برآورد کل ${formatHours(fin.plannedHours)}`)} ${metric('هزینهٔ واقعی', formatMoney(fin.actualCost), `کار ${formatMoney(fin.laborCost)} + مستقیم ${formatMoney(fin.directCost)}`)} ${metric('پیش‌بینی سود', formatMoney(fin.forecastProfit), `حاشیه ${percent(fin.forecastMargin)}`, fin.forecastProfit<0?'danger':'')}</div>
  <div class="two-col"><section class="panel"><div class="section-title"><h2>بسته‌های کاری و ساعت‌های مشارکت</h2><span class="muted">مبنای drill-down: ثبت‌های زمان</span></div><div class="table-wrap"><table><thead><tr><th>بسته</th><th>برآورد</th><th>واقعی</th><th>جزئیات</th></tr></thead><tbody>${packages.map(w=>`<tr><td><b>${w.name}</b></td><td>${formatHours(w.estimatedHours)}</td><td>${formatHours(workPackageActualHours(data,w.id))}</td><td><button class="text-button" data-action="show-entries" data-wp="${w.id}">ثبت‌ها</button></td></tr>`).join('')}</tbody></table></div></section>
  <section class="panel"><h2>ریسک، milestone و تغییرات</h2><div class="risk"><b>ریسک کلیدی</b><p>${p.risk}</p></div>${data.milestones.filter(m=>m.projectId===p.id).map(m=>`<div class="line"><span>${m.status==='complete'?'●':'○'} ${m.name}</span><span>${m.dueDate}</span></div>`).join('') || '<p class="muted">milestone ثبت نشده است.</p>'}${changes.map(c=>`<div class="change"><b>${c.title}</b><small>${c.status==='approved'?'تاییدشده':'در انتظار تایید'} · ${formatHours(c.hoursImpact)} · ${formatMoney(c.costImpact)} · ${new Intl.NumberFormat('fa-IR').format(c.dueDateImpact)} روز</small></div>`).join('')}</section></div>`;
}

function projectCard(p) { const f=projectFinancials(data,p.id); return `<button class="portfolio-card" data-project="${p.id}"><div><span class="health ${healthClass(p.health)}">${p.healthLabel}</span><span class="code">${p.code}</span></div><h2>${p.name}</h2><p>${customer(p)?.name || 'فعالیت داخلیِ بازاستفاده‌پذیر'}</p><div class="progress"><i style="width:${Math.min(p.progress,100)}%"></i></div><footer><span>پیشرفت تحویل: ${percent(p.progress)}</span><b class="${f.forecastProfit<0?'red':''}">${formatMoney(f.forecastProfit)}</b></footer></button>`; }
function pagePortfolio() {
  const clients=data.projects.filter(p=>!p.internal), internal=data.projects.filter(p=>p.internal); const total=clients.reduce((s,p)=>s+projectFinancials(data,p.id).forecastProfit,0);
  return `${pageHeader('مدیریت', 'پرتفوی و سودآوری', 'همهٔ محاسبات از زمان، نرخ تاریخی کار و مصرف مستقیمِ همین دادهٔ نمایشی ساخته می‌شوند.')}
  <div class="portfolio-grid">${clients.map(projectCard).join('')}</div><div class="two-col"><section class="panel"><div class="section-title"><h2>روند هزینهٔ واقعی</h2><span class="muted">دادهٔ زمان و مصرف ثبت‌شده</span></div>${trendChart(clients)}<div class="legend">هزینهٔ کار شامل نرخ همان ثبت تاریخی است؛ پیش‌نمایش سپیدار دوباره به آن اضافه نمی‌شود.</div></section>
  <section class="panel"><h2>پیش‌بینی در یک نگاه</h2>${metric('سود پیش‌بینی‌شدهٔ پرتفوی مشتری',formatMoney(total),'فروش پیش‌بینی‌شده منهای هزینهٔ نهایی پیش‌بینی‌شده')}<div class="formula">هزینهٔ نهایی = هزینهٔ واقعی + هزینهٔ باقی‌مانده<br>سود پیش‌بینی = درآمد پیش‌بینی − هزینهٔ نهایی</div><p class="hint-box">درصد پیشرفت، ساعت صرف‌شده و مصرف بودجه سه شاخص متفاوت‌اند.</p></section></div>
  <section class="panel"><div class="section-title"><h2>تلاش مهندسی داخلی</h2><span class="tag">غیرقابل‌صورتحساب خودکار</span></div>${internal.map(projectCard).join('')}</section>`;
}
function trendChart(projects) { const values=projects.map(p=>projectFinancials(data,p.id).actualCost); const max=Math.max(...values,1); return `<div class="trend">${projects.map((p,i)=>`<div><span style="height:${Math.max(12,values[i]/max*150)}px"></span><b>${p.code.replace('PRJ-','')}</b><small>${formatMoney(values[i]).replace(' تومان','')}</small></div>`).join('')}</div>`; }

function pageIntegrations() {
  const attendance = data.attendance.map(a=>({...a, unmatched: Math.max(0,a.attendanceHours-a.projectHours-a.internalHours)})); const mismatches=data.accountingPreview.filter(a=>a.status==='mismatch');
  return `${pageHeader('پیش‌نمایش‌های قابل‌تعویض', 'اتصال حضور و سپیدار', 'هیچ اتصال زنده، اعتبارنامه، اثرانگشت یا سند مالی واقعی در این نمونه وجود ندارد.')}
  <div class="two-col"><section class="panel"><div class="integration-title"><span class="integration-icon">◴</span><div><h2>پیش‌نمایش حضور و غیاب</h2><p>ساعتِ بدون تطبیق خودکار به پروژهٔ مشتری تخصیص داده نمی‌شود.</p></div></div><table><thead><tr><th>کاربر / روز</th><th>حضور</th><th>پروژه</th><th>داخلی</th><th>بدون تطبیق</th></tr></thead><tbody>${attendance.map(a=>`<tr><td>${byId(data.users,a.userId).name}<small>${a.date}</small></td><td>${a.attendanceHours}</td><td>${a.projectHours}</td><td>${a.internalHours}</td><td class="${a.unmatched?'red':''}">${a.unmatched}</td></tr>`).join('')}</tbody></table></section>
  <section class="panel"><div class="integration-title"><span class="integration-icon">₪</span><div><h2>شبیه‌سازی اتصال سپیدار</h2><p>آخرین همگام‌سازی شبیه‌سازی‌شده: ${data.meta.lastSimulatedSync}</p></div></div><table><thead><tr><th>کد پروژه</th><th>شرح</th><th>مبلغ</th></tr></thead><tbody>${data.accountingPreview.map(a=>`<tr><td>${a.code}</td><td>${a.entry}${a.status==='mismatch'?'<small class="red">در صف مغایرت</small>':''}</td><td>${formatMoney(a.amount)}</td></tr>`).join('')}</tbody></table>${mismatches.length?`<div class="warning-box">${new Intl.NumberFormat('fa-IR').format(mismatches.length)} مورد نیازمند تعیین کد پروژه است؛ تا تعیین، در هزینهٔ پروژه شمرده نمی‌شود.</div>`:''}</section></div>`;
}

function pageKnowledge() {
  const questions=[['acceptance','معیار پذیرش قرارداد آریا چیست؟'],['gripper','مشکل مشابهی برای گیره داشته‌ایم؟'],['profit','چرا سود پیش‌بینی پالتایزر افت کرده است؟']];
  return `${pageHeader('پیش‌نمایش بازیابی دانش', 'دستیار دانش پروژه', 'پاسخ‌ها سناریوهای ازپیش‌تنظیم‌شده‌اند؛ هیچ LLM، embedding یا جست‌وجوی واقعی اجرا نمی‌شود.')}
  <div class="knowledge"><section class="panel prompt-panel"><span class="simulated">✦ پاسخ شبیه‌سازی‌شده</span><h2>چه چیزی می‌خواهید بدانید؟</h2><div class="question-list">${questions.map(([id,q])=>`<button data-action="knowledge" data-question="${id}">${q}<span>←</span></button>`).join('')}</div><p class="muted">دامنهٔ دسترسی نمونه: اطلاعات مالی حساس فقط برای نقش مالی نمایش داده می‌شود.</p></section><section class="assistant-answer" id="assistant-answer"><div class="assistant-orb">✦</div><h2>یک پرسش نمونه را انتخاب کنید</h2><p>هر پاسخ منبع، بخش و تاریخ سند ساختگی را نشان می‌دهد.</p></section></div>`;
}
function knowledgeAnswer(kind) {
  const panel=document.querySelector('#assistant-answer'); if (!panel) return;
  const doc = id => data.knowledgeDocuments.find(d=>d.id===id); let answer, source;
  if(kind==='acceptance') { source=doc('kd1'); answer='برای پروژهٔ آریا، پذیرش پس از FAT موفق و سپس تأیید نصب در سایت مشتری انجام می‌شود. این معیار، پذیرش تحویل‌دادنی است و با تکمیل تعداد وظایف یا تأیید ساعات یکی نیست.'; }
  if(kind==='gripper') { source=doc('kd2'); answer='در پروژهٔ ساختگی سپهر، لغزش گیره با افزایش سطح تماس فک و افزودن سنسور فشار برطرف شد. این یک درس‌آموخته است، نه دستور طراحی قطعی برای پروژهٔ فعلی.'; }
  if(kind==='profit') { source=doc('kd3'); if(role!=='finance') { panel.innerHTML=`<div class="assistant-orb lock">⌁</div><span class="denied">دسترسی محدود</span><h2>نمایش داده نمی‌شود</h2><p>این پرسش شامل پیش‌بینی مالی حساس است و در این سناریوی نمایشی فقط نقش «مالی» اجازهٔ دیدن آن را دارد.</p>`; return; } const f=projectFinancials(data,'p3'), c=data.changeRequests.find(x=>x.id==='cr1'); answer=`هزینهٔ واقعی پالتایزر اکنون ${formatMoney(f.actualCost)} است و هزینهٔ باقی‌مانده ${formatMoney(f.estimatedRemainingCost)} برآورد می‌شود؛ بنابراین هزینهٔ نهایی پیش‌بینی‌شده ${formatMoney(f.forecastFinalCost)} و سود پیش‌بینی ${formatMoney(f.forecastProfit)} است. درخواست تغییر تاییدشدهٔ «${c.title}» ${formatHours(c.hoursImpact)} و ${formatMoney(c.costImpact)} اثر هزینه دارد و فقط ${formatMoney(c.revenueImpact)} درآمد اضافه می‌کند.`; }
  panel.innerHTML=`<div class="assistant-orb">✦</div><span class="simulated">پاسخ شبیه‌سازی‌شده</span><h2>پاسخ بر اساس سناریوی نمونه</h2><p>${answer}</p><div class="source"><b>منبع ساختگی</b><span>${source.title} · ${source.section} · ${source.date}</span></div>`;
}

function quickTime(prefill={}) {
  const selected = prefill.projectId || selectedProjectId; document.body.insertAdjacentHTML('beforeend', `<div class="modal-backdrop" id="modal"><form class="modal" id="time-form"><button type="button" class="close" data-action="close-modal">×</button><p class="eyebrow">ثبت سریع و مشترک</p><h2>ثبت زمان</h2><p class="muted">این ثبت هم در وظیفه و هم در هزینه و ساعت پروژه اثر می‌گذارد.</p><label>پروژه<select id="time-project">${data.projects.map(p=>`<option value="${p.id}" ${selected===p.id?'selected':''}>${p.name}</option>`).join('')}</select></label><label>بستهٔ کاری<select id="time-wp"></select></label><label>وظیفه <span>اختیاری</span><select id="time-task"></select></label><div class="form-grid"><label>مدت (ساعت)<input id="time-hours" type="number" min="0.25" step="0.25" value="1" required></label><label>یادداشت کوتاه<input id="time-note" maxlength="100" placeholder="مثلاً بازبینی نقشه"></label></div><div class="hint-box">نرخ هزینه از نرخ تاریخی نقش شما در این سناریو ثبت می‌شود؛ این ثبت هنوز تایید زمان نیست.</div><button class="primary wide" type="submit">ثبت زمان</button></form></div>`);
  const pEl=document.querySelector('#time-project'), wpEl=document.querySelector('#time-wp'), taskEl=document.querySelector('#time-task');
  const populate=()=>{ const list=data.workPackages.filter(x=>x.projectId===pEl.value); wpEl.innerHTML=list.map(x=>`<option value="${x.id}" ${(prefill.workPackageId||'')===x.id?'selected':''}>${x.name}</option>`).join(''); const tasks=data.tasks.filter(x=>x.projectId===pEl.value&&x.workPackageId===wpEl.value); taskEl.innerHTML=`<option value="">بدون وظیفه (جلسه/پشتیبانی)</option>`+tasks.map(x=>`<option value="${x.id}" ${(prefill.taskId||'')===x.id?'selected':''}>${x.title}</option>`).join(''); };
  pEl.addEventListener('change',populate); wpEl.addEventListener('change',populate); populate();
  document.querySelector('#time-form').addEventListener('submit', e=>{e.preventDefault(); try { addTimeEntry(data,{projectId:pEl.value,workPackageId:wpEl.value,taskId:taskEl.value,userId:user().id,hours:document.querySelector('#time-hours').value,note:document.querySelector('#time-note').value,laborCostRate: role==='lead'?1850000:role==='manager'?1750000:1450000}); document.querySelector('#modal').remove(); flash='زمان ثبت شد؛ مجموع روز و پروژه به‌روزرسانی شد.'; save(); } catch(err) { alert(err.message); }});
}
function taskModal(id) { const t=byId(data.tasks,id); const p=project(t.projectId); document.body.insertAdjacentHTML('beforeend', `<div class="modal-backdrop" id="modal"><section class="modal task-modal"><button class="close" data-action="close-modal">×</button><p class="eyebrow">${p.name} · ${wp(t.workPackageId).name}</p><h2>${esc(t.title)}</h2><p>${t.blocked?`<span class="block">مسدود: ${esc(t.blockReason)}</span>`:'بدون مانع ثبت‌شده'}</p><div class="status-controls">${statuses.map(s=>`<button data-action="set-status" data-task="${t.id}" data-status="${s}" class="${t.status===s?'selected':''}">${taskStatusLabel(s)}</button>`).join('')}</div><div class="modal-actions"><button class="secondary" data-action="quick-task-time" data-task="${t.id}">＋ ثبت زمان</button><button class="secondary" data-action="toggle-block" data-task="${t.id}">${t.blocked?'رفع مسدودی':'مسدود کردن'}</button></div><div class="notes"><h3>یادداشت‌ها</h3>${t.notes.length?t.notes.map(n=>`<p>• ${esc(n)}</p>`).join(''):'<p class="muted">یادداشتی ثبت نشده است.</p>'}<form id="note-form"><input id="task-note" placeholder="یادداشت برای تیم…" required><button class="primary" type="submit">افزودن</button></form></div><p class="hint-box">«آماده بررسی» یعنی کار ارسال شده؛ پذیرش تحویل‌دادنی و تایید زمان مراحل جداگانه‌اند.</p></section></div>`); document.querySelector('#note-form').addEventListener('submit',e=>{e.preventDefault(); t.notes.push(document.querySelector('#task-note').value); document.querySelector('#modal').remove(); flash='یادداشت به وظیفه افزوده شد.'; save();}); }
function entryModal(workPackageId) { const entries=data.timeEntries.filter(e=>e.workPackageId===workPackageId); document.body.insertAdjacentHTML('beforeend',`<div class="modal-backdrop" id="modal"><section class="modal"><button class="close" data-action="close-modal">×</button><h2>ثبت‌های ${wp(workPackageId).name}</h2>${entries.map(e=>`<div class="time-row"><div><b>${byId(data.users,e.userId).name}</b><small>${e.date} · ${esc(e.note)} ${e.approved?'· تایید زمان':''}</small></div><strong>${formatHours(e.hours)}</strong></div>`).join('')||empty('ثبت زمانی ندارد.')}</section></div>`); }
function directCostModal() { const p=project(selectedProjectId); document.body.insertAdjacentHTML('beforeend',`<div class="modal-backdrop" id="modal"><form class="modal" id="cost-form"><button type="button" class="close" data-action="close-modal">×</button><p class="eyebrow">مصرف واقعی پروژه</p><h2>ثبت هزینهٔ مستقیم</h2><p class="muted">خرید قطعه و مصرف آن جدا هستند؛ فقط مصرف واقعی در هزینهٔ پروژه وارد می‌شود.</p><label>شرح مصرف<input id="cost-name" required maxlength="80" placeholder="مثلاً مصرف سنسور ایمنی"></label><label>مبلغ (تومان)<input id="cost-amount" type="number" min="1" step="1000" required placeholder="۰"></label><div class="hint-box">این ثبت هزینهٔ واقعی و پیش‌بینی سود «${p.name}» را به‌روزرسانی می‌کند. در شبیه‌سازی سپیدار دوباره جمع نخواهد شد.</div><button class="primary wide" type="submit">ثبت مصرف</button></form></div>`); document.querySelector('#cost-form').addEventListener('submit',e=>{e.preventDefault();const amount=Number(document.querySelector('#cost-amount').value);if(!Number.isFinite(amount)||amount<=0){alert('مبلغ معتبر وارد کنید.');return;}data.directCosts.unshift({id:`dc-${crypto.randomUUID()}`,projectId:p.id,name:document.querySelector('#cost-name').value.trim(),amount,date:DEMO_ASSUMPTIONS.today,type:'consumption'});document.querySelector('#modal').remove();flash='مصرف مستقیم ثبت شد؛ هزینه و پیش‌بینی پروژه به‌روزرسانی شد.';save();}); }

function bind() {
  document.querySelector('#role-select')?.addEventListener('change',e=>{role=e.target.value; localStorage.setItem('robotyar-role',role); render();});
  document.querySelector('#board-project')?.addEventListener('change',e=>{selectedProjectId=e.target.value;localStorage.setItem('robotyar-project',selectedProjectId);render();});
  document.querySelector('#detail-project')?.addEventListener('change',e=>{selectedProjectId=e.target.value;localStorage.setItem('robotyar-project',selectedProjectId);render();});
  document.querySelectorAll('[data-nav]').forEach(el=>el.addEventListener('click',()=>{route=el.dataset.nav;location.hash=route;}));
  document.querySelectorAll('[data-project]').forEach(el=>el.addEventListener('click',()=>{selectedProjectId=el.dataset.project;localStorage.setItem('robotyar-project',selectedProjectId);route='project';location.hash='project';render();}));
}
function handleAction(e) { const button=e.target.closest('[data-action]'); if(!button) return; const action=button.dataset.action;
  if(action==='reset') { if(confirm('همهٔ تغییرات محلی نمایشی بازنشانی شود؟')) {data=repository.reset();flash='داده‌های نمایشی به وضعیت اولیه بازگشت.';render();} }
  if(action==='quick-time') quickTime(); if(action==='quick-task-time'){const t=byId(data.tasks,button.dataset.task);document.querySelector('#modal')?.remove();quickTime({projectId:t.projectId,workPackageId:t.workPackageId,taskId:t.id});}
  if(action==='close-modal') document.querySelector('#modal')?.remove(); if(action==='open-task') taskModal(button.dataset.task); if(action==='show-entries') entryModal(button.dataset.wp);
  if(action==='direct-cost') directCostModal();
  if(action==='set-status'){const t=byId(data.tasks,button.dataset.task);t.status=button.dataset.status;document.querySelector('#modal')?.remove();flash=`وضعیت وظیفه به «${taskStatusLabel(t.status)}» تغییر کرد.`;save();}
  if(action==='toggle-block'){const t=byId(data.tasks,button.dataset.task); if(t.blocked){t.blocked=false;delete t.blockReason;}else{const reason=prompt('دلیل مسدودی را وارد کنید:');if(!reason)return;t.blocked=true;t.blockReason=reason;}document.querySelector('#modal')?.remove();flash='وضعیت مانع وظیفه به‌روزرسانی شد.';save();}
  if(action==='knowledge') knowledgeAnswer(button.dataset.question);
}
window.addEventListener('hashchange',()=>{route=location.hash.slice(1)||'mine';render();});
document.addEventListener('click', handleAction);
render();
