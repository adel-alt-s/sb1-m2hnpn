import React, { useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import YearView from './YearView';
import MiniCalendar from './MiniCalendar';
import CustomRangeView from './CustomRangeView';
import { Appointment, DateRange } from './types';

interface CalendarProps {
  appointments: Appointment[];
  view: 'day' | 'week' | 'month' | 'year';
  onViewChange: (view: 'day' | 'week' | 'month' | 'year') => void;
  onAppointmentAdd?: (appointment: { date: Date; time: string }) => void;
  onAppointmentUpdate?: (appointment: Appointment) => void;
}

export default function Calendar({ 
  appointments, 
  view, 
  onViewChange,
  onAppointmentAdd,
  onAppointmentUpdate 
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectionRange, setSelectionRange] = useState<DateRange | null>(null);

  const handleDateSelect = (date: Date, isRangeSelection: boolean = false) => {
    setSelectedDate(date);
    setCurrentDate(date);
    if (!isRangeSelection) {
      setSelectionRange(null);
      onViewChange('day');
    }
  };

  const handleRangeSelect = (range: DateRange | null) => {
    setSelectionRange(range);
    if (range) {
      const daysDiff = Math.round(
        (range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysDiff === 0) {
        onViewChange('day');
      } else if (daysDiff <= 7) {
        onViewChange('week');
      } else {
        onViewChange('month');
      }
    }
  };

  const handleTimeSlotClick = (date: Date, time: string) => {
    if (onAppointmentAdd) {
      onAppointmentAdd({ date, time });
    }
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    if (onAppointmentUpdate) {
      onAppointmentUpdate(appointment);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold">
              {format(currentDate, 'MMMM yyyy', { locale: fr })}
            </h2>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="flex space-x-2">
            {['day', 'week', 'month', 'year'].map((v) => (
              <button
                key={v}
                onClick={() => onViewChange(v as any)}
                className={`px-3 py-1 rounded ${
                  view === v
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 overflow-x-auto">
        {selectionRange && view !== 'year' && view !== 'month' ? (
          <CustomRangeView
            selectionRange={selectionRange}
            appointments={appointments}
            onTimeSlotClick={handleTimeSlotClick}
            onAppointmentClick={handleAppointmentClick}
          />
        ) : (
          <>
            {view === 'day' && (
              <DayView
                selectedDate={selectedDate}
                appointments={appointments}
                onTimeSlotClick={handleTimeSlotClick}
                onAppointmentClick={handleAppointmentClick}
              />
            )}
            {view === 'week' && (
              <WeekView
                selectedDate={selectedDate}
                appointments={appointments}
                onTimeSlotClick={handleTimeSlotClick}
                onAppointmentClick={handleAppointmentClick}
              />
            )}
            {view === 'month' && (
              <MonthView
                currentDate={currentDate}
                appointments={appointments}
                onDateClick={handleDateSelect}
                onAppointmentClick={handleAppointmentClick}
                selectionRange={selectionRange}
                onSelectionChange={handleRangeSelect}
              />
            )}
            {view === 'year' && (
              <YearView
                currentDate={currentDate}
                appointments={appointments}
                onMonthClick={(date) => {
                  setCurrentDate(date);
                  onViewChange('month');
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}