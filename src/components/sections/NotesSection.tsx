interface NotesSectionProps {
  selectedDate: Date;
  note: string;
  onNoteChange: (content: string) => void;
}

export function NotesSection({
  selectedDate,
  note,
  onNoteChange,
}: NotesSectionProps) {
  return (
    <>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        {selectedDate.toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'short',
        })}
      </p>
      <textarea
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        placeholder="Ex: motivo de não ter realizado um hábito..."
        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
        rows={4}
      />
    </>
  );
}
