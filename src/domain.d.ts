/** قرارداد دادهٔ مشترک نمونه؛ هنگام انتقال به React/Inertia مستقیماً قابل import است. */
export type Role = 'team' | 'lead' | 'manager' | 'finance' | 'executive';
export type TaskStatus = 'todo' | 'doing' | 'review' | 'done';
export interface Project { id:string; name:string; code:string; customerId:string|null; contractId:string|null; ownerId:string; health:string; healthLabel:string; budget:number; progress:number; forecastRate:number; plannedDirect:number; dueDate:string; internal:boolean; risk:string }
export interface WorkPackage { id:string; projectId:string; name:string; estimatedHours:number }
export interface Task { id:string; projectId:string; workPackageId:string; title:string; assigneeIds:string[]; status:TaskStatus; dueDate:string; blocked:boolean; blockReason?:string; accepted?:boolean; notes:string[] }
/** laborCostRate در لحظهٔ ثبت نگهداری می‌شود تا تغییر نرخ امروز، تاریخچه را تغییر ندهد. */
export interface TimeEntry { id:string; projectId:string; workPackageId:string; taskId:string|null; userId:string; date:string; hours:number; note:string; laborCostRate:number; approved:boolean }
export interface DirectCost { id:string; projectId:string; name:string; amount:number; date:string; type:'consumption' }
export interface DemoData { projects:Project[]; workPackages:WorkPackage[]; tasks:Task[]; timeEntries:TimeEntry[]; directCosts:DirectCost[]; [key:string]:unknown }
export interface DemoRepositoryContract { load():DemoData; save(data:DemoData):DemoData; reset():DemoData }
