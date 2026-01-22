import { Habit } from '../App';
import { HabitCard } from './HabitCard';

interface HabitTrackerProps {
  habits: Habit[];
  onDeleteHabit: (id: string) => void;
}

export function HabitTracker({ habits, onDeleteHabit }: HabitTrackerProps) {
  return (
    <>
      {habits.length === 0 ? (
        <div className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
          Nenhum hábito criado ainda
        </div>
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} onDelete={onDeleteHabit} />
          ))}
        </div>
      )}
    </>
  );
}