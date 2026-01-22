import { useState } from 'react';
import { Layout, Eye, EyeOff } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  isVisible: boolean;
}

interface LayoutControlProps {
  sections: Section[];
  onToggleVisibility: (id: string) => void;
  onResetLayout: () => void;
}

export function LayoutControl({
  sections,
  onToggleVisibility,
  onResetLayout,
}: LayoutControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Controle de Layout"
        title="Controlar visibilidade das seções"
      >
        <Layout className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-20 p-4">
            <h3 className="text-sm mb-3">Controle de Layout</h3>
            <div className="space-y-2 mb-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => onToggleVisibility(section.id)}
                  className="w-full flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm"
                >
                  <span>{section.title}</span>
                  {section.isVisible ? (
                    <Eye className="w-4 h-4 text-green-500" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                onResetLayout();
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors"
            >
              Resetar Layout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
