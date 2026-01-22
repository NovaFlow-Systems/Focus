import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Habit } from '../App';

interface CalendarProps {
  habits: Habit[];
  selectedDate: Date;
  currentMonth: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  onToggleHabit: (habitId: string, date: string) => void;
}

export function Calendar({
  habits,
  selectedDate,
  currentMonth,
  onDateSelect,
  onMonthChange,
  onToggleHabit,
}: CalendarProps) {
  const [showHabits, setShowHabits] = useState(false);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthName = currentMonth.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const previousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  const getDateString = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return date.toISOString().split('T')[0];
  };

  const getHabitsForDay = (day: number) => {
    const dateString = getDateString(day);
    return habits.filter((habit) => habit.completedDates.includes(dateString));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base capitalize">{monthName}</h2>
        <div className="flex gap-2">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div
            key={day}
            className="text-xs text-center py-2 text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}

        {/* Empty cells before first day */}
        {emptyDays.map((i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Days */}
        {days.map((day) => {
          const completedHabits = getHabitsForDay(day);
          const totalHabits = habits.length;
          const completionRate =
            totalHabits > 0 ? completedHabits.length / totalHabits : 0;

          return (
            <button
              key={day}
              onClick={() => {
                const date = new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth(),
                  day
                );
                onDateSelect(date);
              }}
              className={`
                aspect-square rounded-lg p-2 text-sm relative
                transition-all duration-200
                ${
                  isToday(day)
                    ? 'ring-2 ring-blue-500 dark:ring-blue-400'
                    : ''
                }
                ${
                  isSelected(day)
                    ? 'bg-blue-100 dark:bg-blue-900/30'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className="mb-1">{day}</span>
                
                {/* Habit dots */}
                {completedHabits.length > 0 && (
                  <div className="flex gap-0.5 flex-wrap justify-center">
                    {completedHabits.slice(0, 3).map((habit) => (
                      <div
                        key={habit.id}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: habit.color }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Completion indicator */}
              {completionRate > 0 && (
                <div className="absolute bottom-1 left-1 right-1 h-0.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${completionRate * 100}%` }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Detail - Collapsible */}
      {selectedDate && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setShowHabits(!showHabits)}
            className="w-full flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <h3 className="text-sm">
              {selectedDate.toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </h3>
            {showHabits ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          
          {showHabits && (
            <div className="space-y-2 mt-4">
              {habits.map((habit) => {
                const dateString = selectedDate.toISOString().split('T')[0];
                const isCompleted = habit.completedDates.includes(dateString);

                return (
                  <label
                    key={habit.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() => onToggleHabit(habit.id, dateString)}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-700"
                      style={{
                        accentColor: habit.color,
                      }}
                    />
                    <span className="text-sm">{habit.name}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}