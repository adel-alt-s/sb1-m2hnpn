import React, { useState } from 'react';
import { X, User, Phone, Mail, MapPin, Calendar, CreditCard } from 'lucide-react';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (patient: any) => void;
  initialData?: any;
}

interface PatientData {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  ville: string;
  cin: string;
  dateNaissance: string;
  mutuelle: boolean;
  antecedents: string[];
  newAntecedent: string;
}

export default function PatientModal({ isOpen, onClose, onSubmit, initialData }: PatientModalProps) {
  const [patient, setPatient] = useState<PatientData>({
    nom: initialData?.nom || '',
    prenom: initialData?.prenom || '',
    telephone: initialData?.telephone || '',
    email: initialData?.email || '',
    ville: initialData?.ville || '',
    cin: initialData?.cin || '',
    dateNaissance: initialData?.dateNaissance || '',
    mutuelle: initialData?.mutuelle || false,
    antecedents: initialData?.antecedents || [],
    newAntecedent: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...patient,
      antecedents: patient.antecedents,
      age: calculateAge(patient.dateNaissance),
    });
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age.toString();
  };

  const addAntecedent = () => {
    if (patient.newAntecedent.trim()) {
      setPatient({
        ...patient,
        antecedents: [...patient.antecedents, patient.newAntecedent.trim()],
        newAntecedent: '',
      });
    }
  };

  const removeAntecedent = (index: number) => {
    setPatient({
      ...patient,
      antecedents: patient.antecedents.filter((_, i) => i !== index),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {initialData ? 'Modifier le patient' : 'Nouveau patient'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Nom
                </div>
              </label>
              <input
                type="text"
                value={patient.nom}
                onChange={(e) => setPatient({...patient, nom: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                type="text"
                value={patient.prenom}
                onChange={(e) => setPatient({...patient, prenom: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Téléphone
                </div>
              </label>
              <input
                type="tel"
                value={patient.telephone}
                onChange={(e) => setPatient({...patient, telephone: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </div>
              </label>
              <input
                type="email"
                value={patient.email}
                onChange={(e) => setPatient({...patient, email: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Ville
                </div>
              </label>
              <input
                type="text"
                value={patient.ville}
                onChange={(e) => setPatient({...patient, ville: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  CIN
                </div>
              </label>
              <input
                type="text"
                value={patient.cin}
                onChange={(e) => setPatient({...patient, cin: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date de naissance
                </div>
              </label>
              <input
                type="date"
                value={patient.dateNaissance}
                onChange={(e) => setPatient({...patient, dateNaissance: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={patient.mutuelle}
                  onChange={(e) => setPatient({...patient, mutuelle: e.target.checked})}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Mutuelle</span>
              </label>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Maladies Antécédents</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={patient.newAntecedent}
                  onChange={(e) => setPatient({...patient, newAntecedent: e.target.value})}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Ajouter une maladie antécédente"
                />
                <button
                  type="button"
                  onClick={addAntecedent}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Ajouter
                </button>
              </div>
              <div className="space-y-2">
                {patient.antecedents.map((antecedent: string, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span>{antecedent}</span>
                    <button
                      type="button"
                      onClick={() => removeAntecedent(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
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
              {initialData ? 'Modifier' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}