import { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import type { Task } from 'types';
import Column from './kanban-column';

export type ColumnProps = { id: string, title: string, taskIds: string[] }

interface Column<T> {
    columns: {
        [key: string]: ColumnProps
    },
    tasks: {
        [key: string]: T
    },
    columnOrder: string[]
}

const initialData: Column<Task> = {
    tasks: {
        'task-1': { id: 'task-1', title: 'Get out the trash', description: 'Take out the garbage', project_id: '1', created_at: '2021-08-01T00:00:00.000Z', updated_at: '2021-08-01T00:00:00.000Z', creator_id: '' },
        'task-2': { id: 'task-2', title: 'Do something more', description: 'Take out the garbage', project_id: '1', created_at: '2021-08-01T00:00:00.000Z', updated_at: '2021-08-01T00:00:00.000Z', creator_id: '' },
        'task-3': { id: 'task-3', title: 'Not sure anymore how I can do this', description: 'Take out the garbage', project_id: '1', created_at: '2021-08-01T00:00:00.000Z', updated_at: '2021-08-01T00:00:00.000Z', creator_id: '' },
        'task-4': { id: 'task-4', title: 'Not sure anymore how I can do this', description: 'Take out the garbage', project_id: '1', created_at: '2021-08-01T00:00:00.000Z', updated_at: '2021-08-01T00:00:00.000Z', creator_id: '' },
        'task-5': { id: 'task-5', title: 'Not sure anymore how I can do this', description: 'Take out the garbage', project_id: '1', created_at: '2021-08-01T00:00:00.000Z', updated_at: '2021-08-01T00:00:00.000Z', creator_id: '' },
    },
    columns: {
        'column-1': {
            id: 'column-1',
            title: 'Planned',
            taskIds: ['task-1', 'task-2'],
        },
        'column-2': {
            id: 'column-2',
            title: 'Next',
            taskIds: ['task-3']
        },
        'column-3': {
            id: 'column-3',
            title: 'In Progress',
            taskIds: ['task-4']
        },
        'column-4': {
            id: 'column-4',
            title: 'Done',
            taskIds: ['task-5']
        },
    },
    columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
};


export default function TasksKanban() {
    const [kanbanData, setKanbanData] = useState(initialData)

    const onDragEnd = (result: any) => {
        // alert something wrong
        console.log(`Drag has ended`)
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className='flex gap-2 h-full'>
                {kanbanData.columnOrder.map(columnId => {
                    const column = kanbanData.columns[columnId];
                    const tasks = column.taskIds.map(taskId => kanbanData.tasks[taskId]);

                    return <Column key={column.id} column={column} tasks={tasks} />;
                })}
            </div>
        </DragDropContext>
    );
}


