import { Draggable } from 'react-beautiful-dnd';
import type { Task } from 'types';
import { cn } from 'utils/cn';

export default function KanbanTask({ task, index }: { task: Task, index: number }) {
    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    className={cn('border rounded-sm select-none p-4 py-3 bg-white text-sm rotate-0 transition-all', snapshot.isDragging && 'bg-gray-100 rotate-12')}
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
