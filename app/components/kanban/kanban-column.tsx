import { Droppable } from 'react-beautiful-dnd';
import { cn } from 'utils/cn';
import KanbanTask from './kanban-task';
import type { KanbanColumn } from './tasks-kanban';

export default function Column({ column, readonly }: { column: KanbanColumn, readonly: boolean }) {
    return (
        <div className='border p-2 bg-gray-50 rounded-sm flex-1'>
            <h3 className='mb-2 font-medium text-sm pl-3'>{column.title}</h3>
            <Droppable droppableId={column.id} isDropDisabled={readonly}>
                {(provided, snapshot) => (
                    <div
                        className={cn('flex flex-col gap-2 min-h-[100px] transition-colors duration-0', snapshot.isDraggingOver && 'bg-gray-200')}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {column.tasks.map((task, index) => {
                            return (
                                <KanbanTask key={task.id} task={task} index={index} readonly={readonly} />
                            )
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div >
    );
}
