import React, { useMemo } from 'react';
import { CreditCard, Clock, Users, UserPlus, History, TrendingUp, TrendingDown } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import ConsultationTable from '../components/dashboard/ConsultationTable';
import { useAuth } from '../contexts/AuthContext';
import { todayVisits } from '../data/visits';

export default function Dashboard() {
  const { user } = useAuth();

  // Calculs des statistiques
  const stats = useMemo(() => {
    const totalVisits = todayVisits.filter(v => !v.isCanceled).length;
    const delegueVisits = todayVisits.filter(v => v.isDelegue).length;
    const newPatients = todayVisits.filter(v => v.isNewPatient && !v.isCanceled).length;
    const regularPatients = todayVisits.filter(v => !v.isNewPatient && !v.isDelegue && !v.isCanceled && !v.isGratuite).length;
    const gratuiteVisits = todayVisits.filter(v => v.isGratuite && !v.isDelegue && !v.isCanceled).length;
    const canceledVisits = todayVisits.filter(v => v.isCanceled).length;

    const todayRevenue = todayVisits
      .filter(v => !v.isCanceled)
      .reduce((sum, visit) => sum + parseFloat(visit.amount.replace(',', '.')), 0);
    const yesterdayRevenue = 350;
    const revenueChange = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;

    const paidConsultations = todayVisits.filter(v => 
      !v.isCanceled && !v.isDelegue && !v.isGratuite && parseFloat(v.amount.replace(',', '.')) > 0
    ).length;

    return {
      visits: {
        total: totalVisits,
        newPatients,
        regularPatients,
        delegueVisits,
        gratuiteVisits,
        canceledVisits
      },
      revenue: {
        total: todayRevenue.toFixed(2).replace('.', ','),
        change: revenueChange.toFixed(1),
        lastVisit: todayVisits[todayVisits.length - 1]?.amount || '0,00'
      },
      consultations: {
        paid: paidConsultations,
        trend: '+5%'
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<CreditCard className="h-6 w-6 text-white" />}
          iconBgColor="bg-green-500"
          title="Facturation du jour"
        >
          <p className="mt-1 text-xl font-semibold text-gray-900">{stats.revenue.total} Dhs</p>
          <p className="mt-1 text-sm text-gray-600">
            Dernière consultation: {stats.revenue.lastVisit} Dhs
          </p>
          <div className="flex items-center mt-1">
            {parseFloat(stats.revenue.change) > 0 ? (
              <>
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <p className="text-sm text-green-600">+{stats.revenue.change}%</p>
              </>
            ) : (
              <>
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                <p className="text-sm text-red-600">{stats.revenue.change}%</p>
              </>
            )}
          </div>
        </StatCard>

        <StatCard
          icon={<Clock className="h-6 w-6 text-white" />}
          iconBgColor="bg-blue-500"
          title="Consultations payantes"
        >
          <p className="mt-1 text-xl font-semibold text-gray-900">{stats.consultations.paid}</p>
          <p className="mt-1 text-sm text-blue-600">{stats.consultations.trend}</p>
        </StatCard>

        <StatCard
          icon={<Users className="h-6 w-6 text-white" />}
          iconBgColor="bg-purple-500"
          title="Statistiques de Consultation"
        >
          <p className="mt-1 text-xl font-semibold text-gray-900">Total: {stats.visits.total}</p>
          <div className="mt-1 space-y-1">
            <div className="flex items-center text-sm text-gray-500">
              <UserPlus className="h-4 w-4 mr-1" />
              {stats.visits.newPatients} nouveaux patients
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <History className="h-4 w-4 mr-1" />
              {stats.visits.regularPatients} anciens patients
            </div>
            <hr className="my-1" />
            <p className="text-sm text-gray-500">dont {stats.visits.delegueVisits} délégués</p>
            <p className="text-sm text-gray-500">dont {stats.visits.gratuiteVisits} gratuités</p>
            <p className="text-sm text-gray-500">{stats.visits.canceledVisits} rendez-vous annulés</p>
          </div>
        </StatCard>
      </div>

      <ConsultationTable visits={todayVisits} />
    </div>
  );
}