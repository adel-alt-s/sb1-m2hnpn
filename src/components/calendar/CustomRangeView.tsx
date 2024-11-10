import React from 'react';
import { format, isSameDay, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, Video, MapPin } from 'lucide-react';
import { getSourceIcon, getStatusColor } from './utils';
import { Appointment, DateRange } from './types';

interface CustomRangeViewProps {
  selectionRange: DateRange;
  appointments: Appointment[];
  onTimeSlotClick: (date: Date, time: string) => void;
  onAppointmentClick: (appointment: Appointment) => void;
}

export default function CustomRangeView({
  selectionRange,
  appointments,
  onTimeSlotClick,
  onAppointmentClick
}: CustomRangeViewProps) {
  const days = eachDayOfInterval(selectionRange);
  const timeSlots = Array.from({ length: 20 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minutes = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  });

  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(${days.length}, 1fr)` }}>
      <div className="col-start-2 col-span-full grid" style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}>
        {days.map((day) => (
          <div key={day.toString()} className="text-center p-2 font-medium">
            {format(day, 'EEE d', { locale: fr })}
          </div>
        ))}
      </div>
      
      {timeSlots.map((time) => {
        const [hours, minutes] = time.split(':').map(Number);
        const isLunchBreak = hours === 14 && minutes === 0;
        const isEveningBreak = (hours === 17 && minutes === 30) || hours === 18;
        const isPauseSlot = isLunchBreak || isEveningBreak;

        return (
          <React.Fragment key={time}>
            <div className="text-right pr-4 text-gray-500 text-sm">{time}</div>
            {days.map((day) => {
              const dayAppointments = appointments.filter(
                (apt) => apt.time.includes(time) && isSameDay(new Date(apt.time), day)
              );

              return (
                <div
                  key={day.toString()}
                  className={`border border-gray-100 p-1 min-h-[40px] relative ${
                    isPauseSlot ? 'bg-stripes-gray' : ''
                  } ${isEveningBreak ? 'bg-stripes-gray-light' : ''}`}
                  onClick={() => !isPauseSlot && onTimeSlotClick(day, time)}
                >
                  {dayAppointments.map((apt, i) => (
                    <div
                      key={i}
                      className={`p-1 rounded text-xs ${getStatusColor(apt.status)} cursor-pointer hover:shadow-md transition-shadow`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAppointmentClick(apt);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {getSourceIcon(apt.source)}
                          <span className="font-medium truncate">{apt.patient}</span>
                        </div>
                        {apt.videoLink && <Video className="h-3 w-3 text-blue-500" />}
                      </div>
                      {apt.location && (
                        <div className="flex items-center text-xs mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate">{apt.location}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {!isPauseSlot && (
                    <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-indigo-50 bg-opacity-50 flex items-center justify-center">
                      <Plus className="h-4 w-4 text-indigo-600" />
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}