import { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import type { Task } from 'types';
import { v4 as uuid } from 'uuid';
import Column from './kanban-column';

enum TaskStatus {
    Planned,
    Next,
    InProgress,
    Done
}
export interface KanbanColumn {
    id: string,
    title: string,
    columnStatus: TaskStatus,
    tasks: TasksForKanban[]
}

const columns: KanbanColumn[] = [
    {
        id: uuid(),
        title: 'Planned',
        columnStatus: TaskStatus.Planned,
        tasks: [],
    },
    {
        id: uuid(),
        title: 'Next',
        columnStatus: TaskStatus.Next,
        tasks: []
    },
    {
        id: uuid(),
        title: 'In Progress',
        columnStatus: TaskStatus.InProgress,
        tasks: []
    },
    {
        id: uuid(),
        title: 'Done',
        columnStatus: TaskStatus.Done,
        tasks: []
    }
];

function transformTasks(tasks: TasksForKanban[]) {
    // console.log(tasks)
    const taskCols: KanbanColumn[] = columns.map(col => ({ ...col, tasks: [] }))
    tasks.forEach(task => {
        taskCols[task.status].tasks.push(task)
    })

    return taskCols
}

export type TasksForKanban = Pick<Task, 'id' | 'title' | 'description' | 'status'>

export default function TasksKanban({ tasks }: { tasks: TasksForKanban[] }) {
    const [kanbanColumns, setKanbanColumns] = useState(columns)

    useEffect(() => {
        setKanbanColumns(transformTasks(tasks))
    }, [tasks])

    const onDragEnd = (result: any) => {
        const { destination, source } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) return;

        const start = kanbanColumns.find(col => col.id === source.droppableId);
        const finish = kanbanColumns.find(col => col.id === destination.droppableId);

        if (start === finish) {
            const newTasks = Array.from(start!.tasks);
            const [removed] = newTasks.splice(source.index, 1);
            newTasks.splice(destination.index, 0, removed);

            const newColumn = {
                ...start!,
                tasks: newTasks
            }

            // This is an optimistic update
            setKanbanColumns(kanbanColumns.map(col => col.id === newColumn.id ? newColumn : col))
            // this is where I do the actual update
            // fallback if the update doesn't happen
            return;
        }

        const startTasks = Array.from(start!.tasks);
        const [removed] = startTasks.splice(source.index, 1);
        const newStart = {
            ...start!,
            tasks: startTasks
        }

        const finishTasks = Array.from(finish!.tasks);
        finishTasks.splice(destination.index, 0, removed);
        const newFinish = {
            ...finish!,
            tasks: finishTasks
        }

        // this is also an optimistic update
        setKanbanColumns(kanbanColumns.map(col => {
            if (col.id === newStart.id) return newStart
            if (col.id === newFinish.id) return newFinish
            return col
        }))

        // this is where I make the actual API call
        // fallback if the update doesn't happen
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className='flex gap-2 h-full'>
                {kanbanColumns.map(column => {
                    return <Column key={column.id} column={column} />;
                })}
            </div>
        </DragDropContext>
    );
}


