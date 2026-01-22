import { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddHabitSectionProps {
  onAddHabit: (name: string) => void;
}

export function AddHabitSection({ onAddHabit }: AddHabitSectionProps) {
  const [newHabitName, setNewHabitName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      onAddHabit(newHabitName.trim());
      setNewHabitName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
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
  );
}
