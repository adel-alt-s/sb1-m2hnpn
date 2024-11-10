import React, { useState } from 'react';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DateRange } from './types';

interface MiniCalendarProps {
  currentDate: Date;
  selectedDate: Date;
  selectionRange: DateRange | null;
  onDateSelect: (date: Date, isRangeSelection?: boolean) => void;
  onRangeSelect: (range: DateRange | null) => void;
}

export default function MiniCalendar({ 
  currentDate, 
  selectedDate, 
  selectionRange,
  onDateSelect,
  onRangeSelect 
}: MiniCalendarProps) {
  const [selectionStart, setSelectionStart] = useState<Date | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { locale: fr });
  const days = eachDayOfInterval({ start: startDate, end: monthEnd });

  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1);
    onDateSelect(newDate, false);
  };

  const handleMouseDown = (date: Date) => {
    setSelectionStart(date);
    setIsSelecting(true);
    onRangeSelect(null);
  };

  const handleMouseMove = (date: Date) => {
    if (isSelecting && selectionStart) {
      const start = selectionStart < date ? selectionStart : date;
      const end = selectionStart < date ? date : selectionStart;
      onRangeSelect({ start, end });
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setSelectionStart(null);
    if (selectionRange) {
      onDateSelect(selectionRange.start, true);
    }
  };

  const isDateInRange = (date: Date) => {
    if (!selectionRange) return false;
    return isWithinInterval(date, selectionRange);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="text-sm font-medium">
          {format(currentDate, 'MMMM yyyy', { locale: fr })}
        </h3>
        <button
          onClick={() => navigateMonth('next')}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs">
        {weekDays.map((day, index) => (
          <div key={`header-${index}`} className="text-center font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
        {days.map((day, dayIndex) => (
          <button
            key={`day-${dayIndex}`}
            onMouseDown={() => handleMouseDown(day)}
            onMouseMove={() => handleMouseMove(day)}
            onMouseUp={handleMouseUp}
            onClick={() => !isSelecting && onDateSelect(day, false)}
            className={`
              aspect-square p-1 text-sm relative
              ${!isSameMonth(day, currentDate) ? 'text-gray-400' : 'text-gray-900'}
              ${isSameDay(day, selectedDate) ? 'bg-indigo-600 text-white font-semibold rounded-full' : ''}
              ${isDateInRange(day) ? 'bg-indigo-100' : ''}
              ${isDateInRange(day) && !isSameDay(day, selectedDate) ? 'hover:bg-indigo-200' : 'hover:bg-gray-100'}
              rounded-full
              transition-colors
            `}
          >
            {format(day, 'd')}
          </button>
        ))}
      </div>

      <div className="mt-2 text-xs text-gray-500 text-center">
        Glissez pour sélectionner plusieurs jours
      </div>
    </div>
  );
}