import React from 'react';
import { Phone, Globe, User } from 'lucide-react';

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmé':
      return 'bg-green-100 text-green-800';
    case 'en-attente':
      return 'bg-yellow-100 text-yellow-800';
    case 'annulé':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getSourceIcon = (source: string) => {
  switch (source) {
    case 'Téléphone':
      return <Phone className="h-4 w-4" />;
    case 'Site-Satli':
    case 'Doctolib':
    case 'Autres sites':
      return <Globe className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
};