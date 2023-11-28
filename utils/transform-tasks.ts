import type { KanbanColumn, TasksForKanban } from "~/components/kanban/tasks-kanban"
import { sortFn } from "./sort"

export function transformTasks(tasks: TasksForKanban[], columns: KanbanColumn[]) {
    const taskCols: KanbanColumn[] = columns.map(col => ({ ...col, tasks: [] }))
    tasks.sort(sortFn).forEach(task => {
        taskCols[task.status].tasks.push(task)
    })

    return taskCols
}