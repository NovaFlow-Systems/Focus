import { Trash2 } from 'lucide-react';
import { Todo } from '../App';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">
        Nenhuma tarefa adicionada
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 group transition-colors"
        >
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 accent-blue-500"
          />
          <span
            className={`flex-1 text-sm ${
              todo.completed
                ? 'line-through text-gray-400 dark:text-gray-500'
                : ''
            }`}
          >
            {todo.text}
          </span>
          <button
            onClick={() => onDelete(todo.id)}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all"
            aria-label="Deletar tarefa"
          >
            <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
          </button>
        </div>
      ))}
    </div>
  );
}
