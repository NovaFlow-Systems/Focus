import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

interface PomodoroSettings {
  pomodoro: number; // in minutes
  shortBreak: number;
  longBreak: number;
  cyclesBeforeLongBreak: number; // Number of pomodoro cycles before long break
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  cyclesBeforeLongBreak: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
};

const loadSettings = (): PomodoroSettings => {
  try {
    const saved = localStorage.getItem('pomodoroSettings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const saveSettings = (settings: PomodoroSettings) => {
  try {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

// Sound generation functions
const playSound = (frequency: number, duration: number) => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

const playFocusCompleteSound = () => {
  // Triumphant sound for completing focus
  playSound(523.25, 0.2); // C
  setTimeout(() => playSound(659.25, 0.2), 150); // E
  setTimeout(() => playSound(783.99, 0.3), 300); // G
};

const playBreakCompleteSound = () => {
  // Gentle sound for break completion
  playSound(440, 0.2); // A
  setTimeout(() => playSound(523.25, 0.3), 150); // C
};

export function PomodoroTimer() {
  const [settings, setSettings] = useState<PomodoroSettings>(loadSettings);
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(settings.pomodoro * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Temporary settings for the modal
  const [tempSettings, setTempSettings] = useState(settings);

  const getTimeForMode = (mode: TimerMode) => {
    switch (mode) {
      case 'pomodoro':
        return settings.pomodoro * 60;
      case 'shortBreak':
        return settings.shortBreak * 60;
      case 'longBreak':
        return settings.longBreak * 60;
    }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    if (mode === 'pomodoro') {
      // Focus cycle completed
      playFocusCompleteSound();
      const newCompletedCycles = completedCycles + 1;
      setCompletedCycles(newCompletedCycles);
      
      // Decide next mode
      const nextMode = newCompletedCycles % settings.cyclesBeforeLongBreak === 0 
        ? 'longBreak' 
        : 'shortBreak';
      
      setMode(nextMode);
      setTimeLeft(getTimeForMode(nextMode));
      
      // Auto-start break if enabled
      if (settings.autoStartBreaks) {
        setIsRunning(true);
      }
    } else {
      // Break completed
      playBreakCompleteSound();
      setMode('pomodoro');
      setTimeLeft(getTimeForMode('pomodoro'));
      
      // Auto-start pomodoro if enabled
      if (settings.autoStartPomodoros) {
        setIsRunning(true);
      }
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getTimeForMode(mode));
  };

  const changeMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(getTimeForMode(newMode));
  };

  const resetCycles = () => {
    setCompletedCycles(0);
    setMode('pomodoro');
    setIsRunning(false);
    setTimeLeft(getTimeForMode('pomodoro'));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handleSaveSettings = () => {
    setSettings(tempSettings);
    saveSettings(tempSettings);
    setShowSettings(false);
    // Reset current timer with new settings
    setIsRunning(false);
    const newTime =
      tempSettings[mode === 'pomodoro' ? 'pomodoro' : mode === 'shortBreak' ? 'shortBreak' : 'longBreak'] * 60;
    setTimeLeft(newTime);
  };

  const handleCancelSettings = () => {
    setTempSettings(settings);
    setShowSettings(false);
  };

  const progress = (timeLeft / getTimeForMode(mode)) * 100;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Ciclo {completedCycles % settings.cyclesBeforeLongBreak + 1}/{settings.cyclesBeforeLongBreak}
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Configurações"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {showSettings ? (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              Foco (minutos)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={tempSettings.pomodoro}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  pomodoro: parseInt(e.target.value) || 1,
                })
              }
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              Pausa Curta (minutos)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={tempSettings.shortBreak}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  shortBreak: parseInt(e.target.value) || 1,
                })
              }
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              Pausa Longa (minutos)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={tempSettings.longBreak}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  longBreak: parseInt(e.target.value) || 1,
                })
              }
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              Ciclos antes da pausa longa
            </label>
            <input
              type="number"
              min="2"
              max="10"
              value={tempSettings.cyclesBeforeLongBreak}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  cyclesBeforeLongBreak: parseInt(e.target.value) || 4,
                })
              }
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={tempSettings.autoStartBreaks}
                onChange={(e) =>
                  setTempSettings({
                    ...tempSettings,
                    autoStartBreaks: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-700"
              />
              <span className="text-xs text-gray-700 dark:text-gray-300">
                Iniciar pausas automaticamente
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={tempSettings.autoStartPomodoros}
                onChange={(e) =>
                  setTempSettings({
                    ...tempSettings,
                    autoStartPomodoros: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-700"
              />
              <span className="text-xs text-gray-700 dark:text-gray-300">
                Iniciar foco automaticamente
              </span>
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveSettings}
              className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
            >
              Salvar
            </button>
            <button
              onClick={handleCancelSettings}
              className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Mode Selector */}
          <div className="flex gap-1 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => changeMode('pomodoro')}
              className={`flex-1 px-3 py-1.5 text-xs rounded transition-colors ${
                mode === 'pomodoro'
                  ? 'bg-white dark:bg-gray-700'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Foco
            </button>
            <button
              onClick={() => changeMode('shortBreak')}
              className={`flex-1 px-3 py-1.5 text-xs rounded transition-colors ${
                mode === 'shortBreak'
                  ? 'bg-white dark:bg-gray-700'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Pausa
            </button>
            <button
              onClick={() => changeMode('longBreak')}
              className={`flex-1 px-3 py-1.5 text-xs rounded transition-colors ${
                mode === 'longBreak'
                  ? 'bg-white dark:bg-gray-700'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Pausa Longa
            </button>
          </div>

          {/* Timer Display */}
          <div className="relative mb-4">
            {/* Progress Circle */}
            <div className="relative w-40 h-40 mx-auto">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-gray-200 dark:text-gray-800"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className={`transition-all duration-1000 ${
                    mode === 'pomodoro' 
                      ? 'text-blue-500 dark:text-blue-400'
                      : mode === 'longBreak'
                      ? 'text-purple-500 dark:text-purple-400'
                      : 'text-green-500 dark:text-green-400'
                  }`}
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 70 * (1 - progress / 100)
                  }`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-3xl tabular-nums">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2 justify-center">
            <button
              onClick={toggleTimer}
              className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              aria-label={isRunning ? 'Pausar' : 'Iniciar'}
            >
              {isRunning ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={resetTimer}
              className="p-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Resetar"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
          
          {/* Reset Cycles Button */}
          {completedCycles > 0 && (
            <button
              onClick={resetCycles}
              className="w-full mt-3 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-xs transition-colors"
            >
              Resetar Ciclos ({completedCycles} completos)
            </button>
          )}
        </>
      )}
    </>
  );
}