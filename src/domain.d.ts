/** قرارداد دادهٔ مشترک نمونه؛ هنگام انتقال به React/Inertia مستقیماً قابل import است. */
export type Role = 'team' | 'lead' | 'manager' | 'finance' | 'executive';
export type TaskStatus = 'todo' | 'doing' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export interface Project { id:string; name:string; code:string; customerId:string|null; contractId:string|null; ownerId:string; budget:number; forecastRate:number; plannedDirect:number; startDate:string; baselineDueDate:string; dueDate:string; internal:boolean; risk:string }
export interface WorkPackage { id:string; projectId:string; name:string; estimatedHours:number; ownerId:string; startDate:string; dueDate:string }
export interface ChecklistItem { text:string; done:boolean }
export interface Task { id:string; code:string; projectId:string; workPackageId:string; title:string; description?:string; assigneeIds:string[]; reviewerId?:string; status:TaskStatus; priority:Priority; estimatedHours:number; startDate?:string; dueDate:string; blocked:boolean; blockReason?:string; accepted?:boolean; dependencies:string[]; checklist:ChecklistItem[]; attachments:string[]; notes:string[] }
/** laborCostRate در لحظهٔ ثبت نگهداری می‌شود تا تغییر نرخ امروز، تاریخچه را تغییر ندهد. */
export interface TimeEntry { id:string; projectId:string; workPackageId:string; taskId:string|null; userId:string; date:string; hours:number; note:string; laborCostRate:number; approved:boolean; source:'manual'|'timer'; startedAt:string|null; endedAt:string|null }
export interface ActiveTimer { id:string; userId:string; projectId:string; workPackageId:string; taskId:string|null; note:string; date:string; startedAt:string }
export interface DirectCost { id:string; projectId:string; name:string; amount:number; date:string; type:'consumption'; approved:boolean }
export interface Activity { id:string; projectId:string; userId:string; type:string; text:string; date:string }
export interface GitConnection { id:string; provider:string; name:string; baseUrl:string; status:'connected'|'disconnected'; mode:'demo'|'live'; lastWebhookAt:string }
export interface ProjectRepository { id:string; connectionId:string; projectId:string; name:string; path:string; defaultBranch:string; language:string; visibility:'private'|'internal'|'public'; lastCommitAt:string }
export interface TaskGitLink { id:string; taskId:string; repositoryId:string; branch:string; issueRef:string|null; mergeRequestIid?:number }
export interface GitCommit { id:string; repositoryId:string; taskId:string|null; sha:string; message:string; authorUserId:string; committedAt:string }
export interface MergeRequest { id:string; repositoryId:string; taskId:string; iid:number; title:string; status:string; reviewStatus:string; sourceBranch:string; targetBranch:string; authorUserId:string; pipelineStatus:string; updatedAt:string }
export interface DemoData { projects:Project[]; workPackages:WorkPackage[]; tasks:Task[]; timeEntries:TimeEntry[]; activeTimers:ActiveTimer[]; directCosts:DirectCost[]; activity:Activity[]; gitConnections:GitConnection[]; repositories:ProjectRepository[]; taskGitLinks:TaskGitLink[]; gitCommits:GitCommit[]; mergeRequests:MergeRequest[]; [key:string]:unknown }
export interface DemoRepositoryContract { load():DemoData; save(data:DemoData):DemoData; reset():DemoData }
