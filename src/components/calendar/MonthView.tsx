import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getSourceIcon, getStatusColor } from './utils';
import { Appointment, DateRange } from './types';

interface MonthViewProps {
  currentDate: Date;
  appointments: Appointment[];
  onDateClick: (date: Date) => void;
  onAppointmentClick: (appointment: Appointment) => void;
  selectionRange: DateRange | null;
  onSelectionChange: (range: DateRange | null) => void;
}

export default function MonthView({
  currentDate,
  appointments,
  onDateClick,
  onAppointmentClick,
  selectionRange,
  onSelectionChange
}: MonthViewProps) {
  const [selectionStart, setSelectionStart] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { locale: fr });
  const days = eachDayOfInterval({ start: startDate, end: monthEnd });

  const handleMouseDown = (date: Date) => {
    setSelectionStart(date);
    onSelectionChange(null);
  };

  const handleMouseMove = (date: Date) => {
    if (selectionStart) {
      const start = selectionStart < date ? selectionStart : date;
      const end = selectionStart < date ? date : selectionStart;
      onSelectionChange({ start, end });
    }
  };

  const handleMouseUp = () => {
    setSelectionStart(null);
  };

  const isDateInRange = (date: Date) => {
    if (!selectionRange) return false;
    return isWithinInterval(date, selectionRange);
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
        <div key={day} className="p-2 text-center font-semibold text-gray-600">
          {day}
        </div>
      ))}
      {days.map((day, idx) => {
        const dayAppointments = appointments.filter(
          (apt) => isSameDay(new Date(apt.time), day)
        );

        return (
          <div
            key={idx}
            className={`min-h-[120px] p-2 border ${
              isSameMonth(day, currentDate)
                ? 'bg-white'
                : 'bg-gray-50'
            } ${
              isSameDay(day, new Date())
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200'
            } ${
              isDateInRange(day)
                ? 'bg-indigo-50 border-indigo-200'
                : ''
            } cursor-pointer transition-colors hover:bg-gray-50`}
            onClick={() => onDateClick(day)}
            onMouseDown={() => handleMouseDown(day)}
            onMouseMove={() => handleMouseMove(day)}
            onMouseUp={handleMouseUp}
          >
            <div className="font-medium text-sm mb-1">
              {format(day, 'd')}
            </div>
            <div className="space-y-1">
              {dayAppointments.slice(0, 3).map((apt, i) => (
                <div
                  key={i}
                  className={`text-xs p-1 rounded ${getStatusColor(apt.status)} cursor-pointer hover:shadow-md transition-shadow`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAppointmentClick(apt);
                  }}
                >
                  <div className="flex items-center space-x-1">
                    {getSourceIcon(apt.source)}
                    <span className="truncate">{apt.patient}</span>
                  </div>
                </div>
              ))}
              {dayAppointments.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{dayAppointments.length - 3} autres
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}