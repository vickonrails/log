import { useOutletContext } from '@remix-run/react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { LucideLoader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import type { Task } from 'types';
import { cn } from 'utils/cn';
import { transformTasks } from 'utils/transform-tasks';
import { v4 as uuid } from 'uuid';
import { Button } from '../ui/button';
import CreateTaskDialog from './create-task-dialog';
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

export type TasksForKanban = Pick<Task, 'id' | 'title' | 'description' | 'status' | 'updated_at' | 'column_order'>

export default function TasksKanban({ tasks, readonly = false }: { tasks: TasksForKanban[], readonly?: boolean }) {
    const { supabase } = useOutletContext<{ supabase: SupabaseClient }>()
    const [kanbanColumns, setKanbanColumns] = useState(columns)
    const [syncing, setSyncing] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const hidden = !readonly

    useEffect(() => {
        setKanbanColumns(transformTasks(tasks, columns))
    }, [tasks])

    const onDragEnd = (result: any) => {
        const prevCols = [...kanbanColumns];
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

            setKanbanColumns(kanbanColumns.map(col => col.id === newColumn.id ? newColumn : col))
            setSyncing(true)
            const promises = newColumn.tasks.map(task => {
                const index = newColumn.tasks.findIndex(x => x.id === task.id)
                return supabase
                    .from('tasks')
                    .update({ column_order: index })
                    .eq('id', task.id)
                    .then(response => {
                        if (response.error) throw response.error
                        return response
                    })
            })
            // TODO: more robust error handling here for when the update fails for any reason
            Promise.all(promises)
                .then(() => console.log('done'))
                .catch(err => {
                    alert('An error occurred')
                    setKanbanColumns(prevCols)
                })
                .finally(() => setSyncing(false))

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

        setSyncing(true)
        const promises = newFinish.tasks.map(task => {
            const index = newFinish.tasks.findIndex(x => x.id === task.id)
            return supabase
                .from('tasks')
                .update({ column_order: index, status: finish?.columnStatus })
                .eq('id', task.id)
                .then(response => {
                    if (response.error) throw response.error

                    return response
                })
        })

        Promise.all(promises)
            .then(() => console.log('done'))
            .catch((err) => {
                alert('An error just occurred')
                setKanbanColumns(prevCols)
            })
            .finally(() => setSyncing(false))
    }

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                {hidden && (
                    <div className={cn('flex justify-between items-center')}>
                        <LucideLoader size={18} className={cn('transition-opacity ', syncing ? 'opacity-100 animate-spin' : 'opacity-0')} />
                        <Button size='sm' onClick={() => setModalOpen(true)}>New Task</Button>
                    </div>
                )}
                <div className='flex gap-2 h-full'>
                    {kanbanColumns.map(column => {
                        return <Column key={column.id} column={column} readonly={readonly} />;
                    })}
                </div>
            </DragDropContext>
            <CreateTaskDialog open={modalOpen} onOpenChange={setModalOpen} />
        </>
    );
}


