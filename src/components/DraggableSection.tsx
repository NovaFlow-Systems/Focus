import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Eye, EyeOff, Lock, Unlock, GripVertical } from 'lucide-react';

interface DraggableSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isVisible: boolean;
  isLocked: boolean;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
  onMove: (dragId: string, hoverId: string) => void;
  columnId: string;
}

interface DragItem {
  id: string;
  columnId: string;
}

export function DraggableSection({
  id,
  title,
  children,
  isVisible,
  isLocked,
  onToggleVisibility,
  onToggleLock,
  onMove,
  columnId,
}: DraggableSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'SECTION',
    item: { id, columnId },
    canDrag: !isLocked,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'SECTION',
    hover: (item: DragItem) => {
      if (item.id !== id) {
        onMove(item.id, id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Combine drag and drop refs
  if (!isLocked) {
    drag(drop(ref));
  } else {
    drop(ref);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={preview}
      className={`
        transition-all
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${isOver ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
      `}
    >
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              ref={ref}
              className={`cursor-${isLocked ? 'not-allowed' : 'move'} ${
                isLocked ? 'opacity-30' : 'opacity-100'
              }`}
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
            <h3 className="text-sm">{title}</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleLock}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              aria-label={isLocked ? 'Desbloquear' : 'Bloquear'}
              title={isLocked ? 'Desbloquear seção' : 'Bloquear seção'}
            >
              {isLocked ? (
                <Lock className="w-3.5 h-3.5 text-gray-500" />
              ) : (
                <Unlock className="w-3.5 h-3.5 text-gray-400" />
              )}
            </button>
            <button
              onClick={onToggleVisibility}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              aria-label="Esconder"
              title="Esconder seção"
            >
              <EyeOff className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
