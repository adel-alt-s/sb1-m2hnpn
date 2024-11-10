import React from 'react';
import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, MapPin, Video } from 'lucide-react';
import { getSourceIcon, getStatusColor } from './utils';
import { Appointment } from './types';

interface DayViewProps {
  selectedDate: Date;
  appointments: Appointment[];
  onTimeSlotClick: (date: Date, time: string) => void;
  onAppointmentClick: (appointment: Appointment) => void;
}

export default function DayView({ selectedDate, appointments, onTimeSlotClick, onAppointmentClick }: DayViewProps) {
  const timeSlots = Array.from({ length: 20 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minutes = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  });

  const renderTimeSlot = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const isLunchBreak = hours === 14 && minutes === 0;
    const isEveningBreak = (hours === 17 && minutes === 30) || hours === 18;
    const isPauseSlot = isLunchBreak || isEveningBreak;

    const slotAppointments = appointments.filter(
      (apt) => apt.time.includes(time) && isSameDay(new Date(apt.time), selectedDate)
    );

    return (
      <div 
        key={time}
        className={`flex border-b border-gray-100 py-1 ${
          isPauseSlot ? 'bg-stripes-gray' : ''
        } ${isEveningBreak ? 'bg-stripes-gray-light' : ''}`}
        onClick={() => !isPauseSlot && onTimeSlotClick(selectedDate, time)}
      >
        <div className="w-20 text-right pr-4 text-gray-500 text-sm">{time}</div>
        <div className="flex-1 relative">
          {slotAppointments.map((apt, i) => (
            <div
              key={i}
              className={`mb-1 p-2 rounded ${getStatusColor(apt.status)} cursor-pointer hover:shadow-md transition-shadow`}
              onClick={(e) => {
                e.stopPropagation();
                onAppointmentClick(apt);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getSourceIcon(apt.source)}
                  <span className="font-medium">{apt.patient}</span>
                </div>
                {apt.videoLink && <Video className="h-4 w-4 text-blue-500" />}
              </div>
              <div className="text-xs flex items-center space-x-2">
                <span>{apt.type}</span>
                {apt.location && (
                  <span className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {apt.location}
                  </span>
                )}
              </div>
            </div>
          ))}
          {!isPauseSlot && (
            <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-indigo-50 bg-opacity-50 flex items-center justify-center">
              <Plus className="h-6 w-6 text-indigo-600" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-1">
      {timeSlots.map(renderTimeSlot)}
    </div>
  );
}