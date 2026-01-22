import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { HabitTracker } from './components/HabitTracker';
import { Calendar } from './components/Calendar';
import { PomodoroTimer } from './components/PomodoroTimer';
import { DraggableSection } from './components/DraggableSection';
import { LayoutControl } from './components/LayoutControl';
import { AddHabitSection } from './components/sections/AddHabitSection';
import { TodoSection } from './components/sections/TodoSection';
import { NotesSection } from './components/sections/NotesSection';
import { Moon, Sun } from 'lucide-react';

export interface Habit {
  id: string;
  name: string;
  completedDates: string[]; // formato: 'YYYY-MM-DD'
  color: string;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export interface DailyNotes {
  [date: string]: string; // date format: 'YYYY-MM-DD'
}

interface SectionConfig {
  id: string;
  title: string;
  columnId: string;
  isVisible: boolean;
  isLocked: boolean;
  order: number;
}

interface LayoutConfig {
  sections: SectionConfig[];
}

const DEFAULT_LAYOUT: LayoutConfig = {
  sections: [
    { id: 'habits', title: 'Hábitos', columnId: 'left', isVisible: true, isLocked: false, order: 0 },
    { id: 'calendar', title: 'Calendário', columnId: 'center', isVisible: true, isLocked: false, order: 0 },
    { id: 'addHabit', title: 'Novo Hábito', columnId: 'right', isVisible: true, isLocked: false, order: 0 },
    { id: 'todos', title: 'Tarefas do Dia', columnId: 'right', isVisible: true, isLocked: false, order: 1 },
    { id: 'notes', title: 'Anotações', columnId: 'right', isVisible: true, isLocked: false, order: 2 },
    { id: 'pomodoro', title: 'Pomodoro', columnId: 'right', isVisible: true, isLocked: false, order: 3 },
  ],
};

// Helper functions for localStorage
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export default function App() {
  const [darkMode, setDarkMode] = useState(() => 
    loadFromStorage('darkMode', true)
  );
  
  const [habits, setHabits] = useState<Habit[]>(() =>
    loadFromStorage('habits', [
      {
        id: '1',
        name: 'Exercício',
        completedDates: ['2026-01-20', '2026-01-19', '2026-01-18', '2026-01-16'],
        color: '#10b981',
      },
      {
        id: '2',
        name: 'Leitura',
        completedDates: ['2026-01-20', '2026-01-19', '2026-01-17'],
        color: '#3b82f6',
      },
      {
        id: '3',
        name: 'Meditação',
        completedDates: ['2026-01-20', '2026-01-18', '2026-01-17', '2026-01-15'],
        color: '#8b5cf6',
      },
    ])
  );

  const [todos, setTodos] = useState<Todo[]>(() =>
    loadFromStorage('todos', [
      { id: '1', text: 'Revisar projeto', completed: false },
      { id: '2', text: 'Comprar mantimentos', completed: true },
    ])
  );

  const [dailyNotes, setDailyNotes] = useState<DailyNotes>(() =>
    loadFromStorage('dailyNotes', {})
  );

  const [layout, setLayout] = useState<LayoutConfig>(() =>
    loadFromStorage('layout', DEFAULT_LAYOUT)
  );

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToStorage('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    saveToStorage('habits', habits);
  }, [habits]);

  useEffect(() => {
    saveToStorage('todos', todos);
  }, [todos]);

  useEffect(() => {
    saveToStorage('dailyNotes', dailyNotes);
  }, [dailyNotes]);

  useEffect(() => {
    saveToStorage('layout', layout);
  }, [layout]);

  const toggleHabitCompletion = (habitId: string, date: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === habitId) {
          const isCompleted = habit.completedDates.includes(date);
          return {
            ...habit,
            completedDates: isCompleted
              ? habit.completedDates.filter((d) => d !== date)
              : [...habit.completedDates, date],
          };
        }
        return habit;
      })
    );
  };

  const addHabit = (name: string) => {
    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      completedDates: [],
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
  };

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const updateDailyNote = (date: string, content: string) => {
    setDailyNotes((prev) => ({
      ...prev,
      [date]: content,
    }));
  };

  const toggleSectionVisibility = (id: string) => {
    setLayout((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === id ? { ...s, isVisible: !s.isVisible } : s
      ),
    }));
  };

  const toggleSectionLock = (id: string) => {
    setLayout((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === id ? { ...s, isLocked: !s.isLocked } : s
      ),
    }));
  };

  const moveSection = (dragId: string, hoverId: string) => {
    setLayout((prev) => {
      const sections = [...prev.sections];
      const dragSection = sections.find((s) => s.id === dragId);
      const hoverSection = sections.find((s) => s.id === hoverId);

      if (!dragSection || !hoverSection) return prev;

      // If moving to different column
      if (dragSection.columnId !== hoverSection.columnId) {
        dragSection.columnId = hoverSection.columnId;
      }

      // Reorder within column
      const columnSections = sections
        .filter((s) => s.columnId === dragSection.columnId && s.id !== dragId)
        .sort((a, b) => a.order - b.order);

      const hoverIndex = columnSections.findIndex((s) => s.id === hoverId);
      
      columnSections.splice(hoverIndex, 0, dragSection);
      
      // Update orders
      columnSections.forEach((s, idx) => {
        s.order = idx;
      });

      return { sections };
    });
  };

  const resetLayout = () => {
    setLayout(DEFAULT_LAYOUT);
  };

  const getSectionsByColumn = (columnId: string) => {
    return layout.sections
      .filter((s) => s.columnId === columnId)
      .sort((a, b) => a.order - b.order);
  };

  const selectedDateString = selectedDate.toISOString().split('T')[0];
  const currentNote = dailyNotes[selectedDateString] || '';

  const renderSection = (section: SectionConfig) => {
    const content = (() => {
      switch (section.id) {
        case 'habits':
          return <HabitTracker habits={habits} onDeleteHabit={deleteHabit} />;
        case 'calendar':
          return (
            <Calendar
              habits={habits}
              selectedDate={selectedDate}
              currentMonth={currentMonth}
              onDateSelect={setSelectedDate}
              onMonthChange={setCurrentMonth}
              onToggleHabit={toggleHabitCompletion}
            />
          );
        case 'addHabit':
          return <AddHabitSection onAddHabit={addHabit} />;
        case 'todos':
          return (
            <TodoSection
              todos={todos}
              onAddTodo={addTodo}
              onToggleTodo={toggleTodo}
              onDeleteTodo={deleteTodo}
            />
          );
        case 'notes':
          return (
            <NotesSection
              selectedDate={selectedDate}
              note={currentNote}
              onNoteChange={(content) => updateDailyNote(selectedDateString, content)}
            />
          );
        case 'pomodoro':
          return <PomodoroTimer />;
        default:
          return null;
      }
    })();

    return (
      <DraggableSection
        key={section.id}
        id={section.id}
        title={section.title}
        columnId={section.columnId}
        isVisible={section.isVisible}
        isLocked={section.isLocked}
        onToggleVisibility={() => toggleSectionVisibility(section.id)}
        onToggleLock={() => toggleSectionLock(section.id)}
        onMove={moveSection}
      >
        {content}
      </DraggableSection>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
          {/* Header */}
          <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="max-w-[1800px] mx-auto px-8 py-6 flex items-center justify-between">
              <h1 className="text-2xl tracking-tight">Hub de Organização</h1>
              <div className="flex items-center gap-2">
                <LayoutControl
                  sections={layout.sections.map((s) => ({
                    id: s.id,
                    title: s.title,
                    isVisible: s.isVisible,
                  }))}
                  onToggleVisibility={toggleSectionVisibility}
                  onResetLayout={resetLayout}
                />
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Toggle theme"
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </header>

          {/* Main Content - 3 Columns */}
          <main className="max-w-[1800px] mx-auto px-8 py-8">
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column */}
              <div className="col-span-3">
                {getSectionsByColumn('left').map(renderSection)}
              </div>

              {/* Center Column */}
              <div className="col-span-6">
                {getSectionsByColumn('center').map(renderSection)}
              </div>

              {/* Right Column */}
              <div className="col-span-3">
                {getSectionsByColumn('right').map(renderSection)}
              </div>
            </div>
          </main>
        </div>
      </div>
    </DndProvider>
  );
}