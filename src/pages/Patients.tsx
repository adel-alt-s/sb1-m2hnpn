import React, { useState } from 'react';
import { Search, Plus, UserCircle, Phone, Mail, MapPin, Heart, History, Calendar } from 'lucide-react';
import PatientModal from '../components/PatientModal';

export default function Patients() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [patients, setPatients] = useState([
    {
      id: '1',
      nom: 'Durant',
      prenom: 'Marie',
      telephone: '06 12 34 56 78',
      email: 'marie.durant@email.com',
      ville: 'Paris',
      cin: 'AB123456',
      dateNaissance: '1985-05-15',
      age: '38',
      mutuelle: true,
      antecedents: ['Diabète', 'Hypertension'],
      derniereVisite: '15/03/2024',
      prochainRdv: '22/03/2024',
      nombreVisites: 15,
      montantDerniereVisite: '850,00'
    }
  ]);

  const handleSubmit = (patientData: any) => {
    const newPatient = {
      id: (patients.length + 1).toString(),
      ...patientData,
      derniereVisite: '-',
      prochainRdv: '-',
      nombreVisites: 0,
      montantDerniereVisite: '0'
    };
    setPatients([...patients, newPatient]);
    setIsModalOpen(false);
  };

  const isDateInRange = (dateStr: string) => {
    if (!dateStr || dateStr === '-') return false;
    const [day, month, year] = dateStr.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    return date >= start && date <= end;
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.prenom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = isDateInRange(patient.derniereVisite);
    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Patients</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouveau patient
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Rechercher un patient..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
                <span className="text-gray-500">à</span>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ville
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CIN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de naissance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Âge
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mutuelle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Maladies Antécédents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre de visites
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière visite
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant dernière visite (Dhs)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prochain RDV
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserCircle className="h-10 w-10 text-gray-400" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {patient.nom} {patient.prenom}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.telephone}</div>
                    <div className="text-sm text-gray-500">{patient.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      {patient.ville}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.cin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(patient.dateNaissance).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.age} ans
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      patient.mutuelle 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {patient.mutuelle ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      {patient.antecedents.map((antecedent, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Heart className="h-3 w-3 mr-1" />
                          {antecedent}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      <History className="h-3 w-3 mr-1" />
                      {patient.nombreVisites} visites
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.derniereVisite}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.montantDerniereVisite} Dhs
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {patient.prochainRdv}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}