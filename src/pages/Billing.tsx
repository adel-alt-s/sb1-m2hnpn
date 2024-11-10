import React, { useState } from 'react';
import { CreditCard, Search, Download, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { exportToExcel } from '../utils/excelExport';

export default function Billing() {
  const { hasPermission } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editMutuelle, setEditMutuelle] = useState('');
  const [searchPatient, setSearchPatient] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const [invoices, setInvoices] = useState([
    {
      id: '1',
      patient: 'Marie Durant',
      date: new Date().toLocaleDateString('fr-FR'),
      amount: '850,00',
      status: 'Payée',
      statusColor: 'bg-green-100 text-green-800',
      paymentType: 'Carte Bancaire',
      mutuelle: 'Oui',
      lastVisit: '10/03/2024'
    },
    {
      id: '2',
      patient: 'Pierre Martin',
      date: '15/03/2024',
      amount: '0',
      status: 'Gratuité',
      statusColor: 'bg-blue-100 text-blue-800',
      paymentType: '-',
      mutuelle: 'Non',
      lastVisit: '05/03/2024'
    }
  ]);

  const handleAmountChange = (id: string, value: string) => {
    setInvoices(invoices.map(invoice => {
      if (invoice.id === id) {
        const amount = value.trim();
        let status = 'Payée';
        let statusColor = 'bg-green-100 text-green-800';
        let paymentType = invoice.paymentType;
        
        if (amount === '0') {
          status = 'Gratuité';
          statusColor = 'bg-blue-100 text-blue-800';
          paymentType = '-';
        }

        return {
          ...invoice,
          amount,
          status,
          statusColor,
          paymentType
        };
      }
      return invoice;
    }));
    setEditingId(null);
    setEditAmount('');
  };

  const handleMutuelleChange = (id: string, value: string) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === id ? { ...invoice, mutuelle: value } : invoice
    ));
  };

  const isDateInRange = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    return date >= start && date <= end;
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.patient.toLowerCase().includes(searchPatient.toLowerCase());
    const matchesDate = isDateInRange(invoice.date);
    return matchesSearch && matchesDate;
  });

  const handleExport = () => {
    const columns = [
      { id: 'patient', label: 'Patient' },
      { id: 'date', label: 'Date' },
      { id: 'amount', label: 'Montant (Dhs)' },
      { id: 'status', label: 'Statut' },
      { id: 'paymentType', label: 'Type de paiement' },
      { id: 'mutuelle', label: 'Mutuelle' },
      { id: 'lastVisit', label: 'Dernière visite' }
    ];
    exportToExcel(filteredInvoices, `facturations_${dateRange.startDate}_${dateRange.endDate}`, columns);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Facturation du {new Date(dateRange.startDate).toLocaleDateString('fr-FR')} au {new Date(dateRange.endDate).toLocaleDateString('fr-FR')}
        </h2>
        {hasPermission('export_data') && (
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Download className="h-5 w-5 mr-2" />
            Exporter
          </button>
        )}
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchPatient}
                onChange={(e) => setSearchPatient(e.target.value)}
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
                  Montant (Dhs)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type de paiement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mutuelle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière visite
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.patient}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === invoice.id ? (
                      <input
                        type="text"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAmountChange(invoice.id, editAmount);
                          }
                        }}
                        className="block w-24 px-3 py-1 border border-gray-300 rounded-md text-sm"
                        placeholder="0,00"
                        autoFocus
                      />
                    ) : (
                      <div
                        className="text-sm text-gray-900 cursor-pointer"
                        onClick={() => {
                          setEditingId(invoice.id);
                          setEditAmount(invoice.amount);
                        }}
                      >
                        {invoice.amount}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${invoice.statusColor}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.amount === '0' ? '-' : (
                      <select
                        className="block w-full pl-3 pr-10 py-1 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={invoice.paymentType}
                        onChange={(e) => {
                          setInvoices(invoices.map(inv => 
                            inv.id === invoice.id ? { ...inv, paymentType: e.target.value } : inv
                          ));
                        }}
                      >
                        <option value="Carte Bancaire">Carte Bancaire</option>
                        <option value="Espèces">Espèces</option>
                        <option value="Virement">Virement</option>
                        <option value="Chèque">Chèque</option>
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      className="block w-full pl-3 pr-10 py-1 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      value={invoice.mutuelle}
                      onChange={(e) => handleMutuelleChange(invoice.id, e.target.value)}
                    >
                      <option value="Oui">Oui</option>
                      <option value="Non">Non</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.lastVisit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}