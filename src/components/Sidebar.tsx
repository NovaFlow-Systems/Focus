import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Todo, DailyNotes } from '../App';
import { TodoList } from './TodoList';
import { PomodoroTimer } from './PomodoroTimer';

interface SidebarProps {
  todos: Todo[];
  selectedDate: Date;
  dailyNotes: DailyNotes;
  onAddHabit: (name: string) => void;
  onAddTodo: (text: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onUpdateDailyNote: (date: string, content: string) => void;
}

export function Sidebar({
  todos,
  selectedDate,
  dailyNotes,
  onAddHabit,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onUpdateDailyNote,
}: SidebarProps) {
  const [newHabitName, setNewHabitName] = useState('');
  const [newTodoText, setNewTodoText] = useState('');

  // Get the note for the selected date
  const selectedDateString = selectedDate.toISOString().split('T')[0];
  const currentNote = dailyNotes[selectedDateString] || '';

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      onAddHabit(newHabitName.trim());
      setNewHabitName('');
    }
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      onAddTodo(newTodoText.trim());
      setNewTodoText('');
    }
  };

  const handleNoteChange = (content: string) => {
    onUpdateDailyNote(selectedDateString, content);
  };

  return (
    <div className="space-y-6">
      {/* Add Habit */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
        <h3 className="text-sm mb-3">Novo Hábito</h3>
        <form onSubmit={handleAddHabit} className="flex gap-2">
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="Nome do hábito..."
            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            aria-label="Adicionar hábito"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Todo List */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
        <h3 className="text-sm mb-3">Tarefas do Dia</h3>
        <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
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
        <TodoList
          todos={todos}
          onToggle={onToggleTodo}
          onDelete={onDeleteTodo}
        />
      </div>

      {/* Notes - Now per day */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
        <h3 className="text-sm mb-1">Anotações</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {selectedDate.toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short',
          })}
        </p>
        <textarea
          value={currentNote}
          onChange={(e) => handleNoteChange(e.target.value)}
          placeholder="Ex: motivo de não ter realizado um hábito..."
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
          rows={4}
        />
      </div>

      {/* Pomodoro */}
      <PomodoroTimer />
    </div>
  );
}