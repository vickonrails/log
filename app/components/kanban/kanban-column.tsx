import { Droppable } from 'react-beautiful-dnd';
import type { Task } from 'types';
import KanbanTask from './kanban-task';
import type { ColumnProps } from './tasks-kanban';
import { cn } from 'utils/cn';

export default function Column({ column, tasks }: { column: ColumnProps, tasks: Task[] }) {
    return (
        <div className='border p-2 bg-gray-50 rounded-sm'>
            <h3 className='mb-2 font-medium text-sm pl-3'>{column.title}</h3>
            <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                    <div
                        className={cn('flex flex-col gap-2 h-full', snapshot.isDraggingOver && 'bg-gray-200')}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {tasks.map((task, index) => {
                            return (
                                <KanbanTask key={task.id} task={task} index={index} />
                            )
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div >
    );
}
