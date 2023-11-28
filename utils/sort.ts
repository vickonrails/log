import type { TasksForKanban } from "~/components/kanban/tasks-kanban";

export function sortFn(a: TasksForKanban, b: TasksForKanban) {
    if (a.column_order < b.column_order) return -1
    if (a.column_order > b.column_order) return 1

    return 0
}