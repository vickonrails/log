import { Draggable } from 'react-beautiful-dnd';
import { cn } from 'utils/cn';
import type { TasksForKanban } from './tasks-kanban';

export default function KanbanTask({ task, index }: { task: TasksForKanban, index: number }) {
    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    className={cn('border rounded-sm select-none p-4 py-3 bg-white text-sm', snapshot.isDragging && 'bg-gray-100')}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    {...provided.draggableProps.style}
                >
                    <h2 className='font-medium'>{task.title}</h2>
                </div>
            )}
        </Draggable>
    );

}
