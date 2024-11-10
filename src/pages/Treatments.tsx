import React, { useState } from 'react';
import { FileText, Search, Plus, Printer, FileCheck, TestTube, ClipboardList, ChevronDown } from 'lucide-react';
import { generateDocument } from '../utils/documentGenerator';

export default function Treatments() {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const certificateTypes = [
    { id: 'medical', label: 'Certificat médical' },
    { id: 'absence', label: 'Certificat d\'absence' },
    { id: 'aptitude', label: 'Certificat d\'aptitude' },
    { id: 'presence', label: 'Certificat de présence' },
    { id: 'suivi', label: 'Certificat de suivi psychologique' }
  ];

  const prescriptionTypes = [
    { id: 'medication', label: 'Ordonnance médicaments' },
    { id: 'therapy', label: 'Prescription thérapie' },
    { id: 'analysis', label: 'Prescription analyses' },
    { id: 'specialist', label: 'Orientation spécialiste' }
  ];

  const testTypes = [
    { id: 'anxiety', label: 'Test d\'anxiété' },
    { id: 'depression', label: 'Échelle de dépression' },
    { id: 'personality', label: 'Test de personnalité' },
    { id: 'cognitive', label: 'Évaluation cognitive' },
    { id: 'memory', label: 'Test de mémoire' }
  ];

  const handleDocumentGeneration = async (type: string, subType: string, patientName: string) => {
    try {
      await generateDocument({
        type,
        subType,
        patientName,
        date: new Date().toLocaleDateString('fr-FR'),
        doctorName: 'Dr. Martin'
      });
      setOpenMenuId(null);
    } catch (error) {
      console.error('Erreur lors de la génération du document:', error);
      alert('Une erreur est survenue lors de la génération du document.');
    }
  };

  const renderDropdownMenu = (items: Array<{ id: string, label: string }>, type: string, patientName: string) => (
    <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
      <div className="py-1" role="menu">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleDocumentGeneration(type, item.id, patientName)}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            role="menuitem"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Traitements</h2>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          <Plus className="h-5 w-5 mr-2" />
          Nouveau traitement
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Rechercher un traitement..."
            />
          </div>
        </div>

        <div className="p-4">
          {[
            {
              id: '1',
              patient: 'Marie Durant',
              treatment: 'Thérapie Cognitive Comportementale',
              startDate: '01/03/2024',
              duration: '3 mois',
              nextSession: '22/03/2024',
            },
            {
              id: '2',
              patient: 'Pierre Martin',
              treatment: 'Suivi Psychologique',
              startDate: '15/02/2024',
              duration: '6 mois',
              nextSession: '24/03/2024',
            },
            {
              id: '3',
              patient: 'Sophie Bernard',
              treatment: 'Thérapie de Groupe',
              startDate: '10/03/2024',
              duration: '2 mois',
              nextSession: '26/03/2024',
            },
          ].map((treatment) => (
            <div
              key={treatment.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg mb-2 border border-gray-200"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 rounded-full p-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{treatment.patient}</p>
                  <p className="text-sm text-gray-500">{treatment.treatment}</p>
                  <p className="text-xs text-gray-400">
                    Début: {treatment.startDate} • Durée: {treatment.duration}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Bouton Certificats */}
                <div className="relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === `cert-${treatment.id}` ? null : `cert-${treatment.id}`)}
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <FileCheck className="h-4 w-4 mr-2" />
                    Certificats
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>
                  {openMenuId === `cert-${treatment.id}` && renderDropdownMenu(certificateTypes, 'certificat', treatment.patient)}
                </div>

                {/* Bouton Ordonnances */}
                <div className="relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === `presc-${treatment.id}` ? null : `presc-${treatment.id}`)}
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Ordonnances
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>
                  {openMenuId === `presc-${treatment.id}` && renderDropdownMenu(prescriptionTypes, 'ordonnance', treatment.patient)}
                </div>

                {/* Bouton Tests */}
                <div className="relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === `test-${treatment.id}` ? null : `test-${treatment.id}`)}
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    Tests
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>
                  {openMenuId === `test-${treatment.id}` && renderDropdownMenu(testTypes, 'test', treatment.patient)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}