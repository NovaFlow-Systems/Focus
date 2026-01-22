import { Habit } from '../App';
import { ProgressBar } from './ProgressBar';
import { Trash2 } from 'lucide-react';

interface HabitCardProps {
  habit: Habit;
  onDelete: (id: string) => void;
}

export function HabitCard({ habit, onDelete }: HabitCardProps) {
  // Calculate weekly progress (last 7 days)
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  });

  const completedInWeek = last7Days.filter((date) =>
    habit.completedDates.includes(date)
  ).length;

  const progress = (completedInWeek / 7) * 100;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-3 group relative">
      <div className="flex items-center justify-between">
        <h3 className="text-sm">{habit.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {Math.round(progress)}%
          </span>
          <button
            onClick={() => onDelete(habit.id)}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-all"
            aria-label="Deletar hábito"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
          </button>
        </div>
      </div>
      <ProgressBar progress={progress} color={habit.color} />
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {completedInWeek} de 7 dias
      </div>
    </div>
  );
}