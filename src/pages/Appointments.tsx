import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Calendar from '../components/calendar/Calendar';
import AppointmentModal from '../components/AppointmentModal';
import MiniCalendar from '../components/calendar/MiniCalendar';
import { Appointment } from '../components/calendar/types';
import { sharedAppointments } from '../data/appointments';

export default function Appointments() {
  const [view, setView] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);

  // Convertir les rendez-vous partagés en format compatible avec le calendrier
  const [appointments, setAppointments] = useState<Appointment[]>(
    sharedAppointments.map(apt => ({
      id: apt.id,
      patient: apt.patient,
      time: apt.time,
      duration: apt.duration,
      type: apt.type,
      source: apt.source,
      status: apt.status as 'confirmé' | 'en-attente' | 'annulé',
      contact: apt.contact
    }))
  );

  const handleSubmit = (appointmentData: any) => {
    const newAppointment: Appointment = {
      id: (appointments.length + 1).toString().padStart(4, '0'),
      ...appointmentData,
      duration: '30 min',
      status: 'confirmé'
    };
    setAppointments([...appointments, newAppointment]);
    setIsModalOpen(false);
  };

  const handleAppointmentAdd = (appointment: any) => {
    const { date, time } = appointment;
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleDateSelect = (date: Date, isRangeSelection: boolean = false) => {
    setSelectedDate(date);
    if (!isRangeSelection) {
      setDateRange(null);
      setView('day');
    }
  };

  const handleRangeSelect = (range: { start: Date; end: Date } | null) => {
    setDateRange(range);
    if (range) {
      const daysDiff = Math.round(
        (range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysDiff === 0) {
        setView('day');
      } else if (daysDiff <= 7) {
        setView('week');
      } else {
        setView('month');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Agenda</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouveau rendez-vous
        </button>
      </div>

      <div className="flex space-x-4">
        <div className="w-64 flex-shrink-0">
          <MiniCalendar
            currentDate={selectedDate}
            selectedDate={selectedDate}
            selectionRange={dateRange}
            onDateSelect={handleDateSelect}
            onRangeSelect={handleRangeSelect}
          />
        </div>
        <div className="flex-1">
          <Calendar
            appointments={appointments}
            view={view}
            onViewChange={setView}
            onAppointmentAdd={handleAppointmentAdd}
          />
        </div>
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onSubmit={handleSubmit}
        initialDate={selectedDate}
      />
    </div>
  );
}