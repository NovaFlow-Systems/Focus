import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Todo } from '../../App';
import { TodoList } from '../TodoList';

interface TodoSectionProps {
  todos: Todo[];
  onAddTodo: (text: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

export function TodoSection({
  todos,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
}: TodoSectionProps) {
  const [newTodoText, setNewTodoText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      onAddTodo(newTodoText.trim());
      setNewTodoText('');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Nova tarefa..."
          className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          aria-label="Adicionar tarefa"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>
      <TodoList todos={todos} onToggle={onToggleTodo} onDelete={onDeleteTodo} />
    </>
  );
}
