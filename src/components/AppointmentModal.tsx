import React, { useState, useEffect } from 'react';
import { X, User, Phone } from 'lucide-react';
import PatientModal from './PatientModal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (appointment: any) => void;
  onPatientAdd?: (patient: any) => void;
  initialDate?: Date;
  initialTime?: string;
}

export default function AppointmentModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onPatientAdd,
  initialDate,
  initialTime 
}: AppointmentModalProps) {
  const [appointment, setAppointment] = useState({
    patient: '',
    contact: '',
    time: initialTime || '',
    type: 'Consultation',
    source: 'Téléphone',
    status: 'confirmé'
  });

  const [showPatientModal, setShowPatientModal] = useState(false);

  useEffect(() => {
    if (initialDate && initialTime) {
      setAppointment(prev => ({
        ...prev,
        time: `${format(initialDate, 'yyyy-MM-dd')} ${initialTime}`
      }));
    }
  }, [initialDate, initialTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(appointment);
    setAppointment({
      patient: '',
      contact: '',
      time: '',
      type: 'Consultation',
      source: 'Téléphone',
      status: 'confirmé'
    });
  };

  const handlePatientSubmit = (patientData: any) => {
    if (onPatientAdd) {
      onPatientAdd(patientData);
    }
    setAppointment({
      ...appointment,
      patient: `${patientData.nom} ${patientData.prenom}`,
      contact: patientData.telephone,
    });
    setShowPatientModal(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Nouveau rendez-vous</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Patient
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPatientModal(true)}
                    className="text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    Nouveau patient
                  </button>
                </div>
              </label>
              <input
                type="text"
                value={appointment.patient}
                onChange={(e) => setAppointment({...appointment, patient: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact
                </div>
              </label>
              <input
                type="tel"
                value={appointment.contact}
                onChange={(e) => setAppointment({...appointment, contact: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date et heure</label>
                <div className="mt-1 text-sm text-gray-900">
                  {initialDate && initialTime ? (
                    format(initialDate, "d MMMM yyyy 'à' HH:mm", { locale: fr })
                  ) : (
                    'Non sélectionné'
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Type de consultation</label>
              <select
                value={appointment.type}
                onChange={(e) => setAppointment({...appointment, type: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option>Consultation initiale</option>
                <option>Suivi</option>
                <option>Thérapie</option>
                <option>Urgence</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Source du rendez-vous</label>
              <select
                value={appointment.source}
                onChange={(e) => setAppointment({...appointment, source: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="Téléphone">Téléphone</option>
                <option value="Site-Satli">Site Satli</option>
                <option value="Doctolib">Doctolib</option>
                <option value="Visite directe">Visite directe</option>
                <option value="Autres sites">Autres sites</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Statut</label>
              <select
                value={appointment.status}
                onChange={(e) => setAppointment({...appointment, status: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="confirmé">Confirmé</option>
                <option value="en-attente">En attente</option>
                <option value="annulé">Annulé</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>

      <PatientModal
        isOpen={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        onSubmit={handlePatientSubmit}
      />
    </>
  );
}