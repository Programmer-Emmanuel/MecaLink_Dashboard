import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from "../../constants/api/api";

export function DashboardAccueil() {
  const [stats, setStats] = useState({
    loading: true,
    error: null,
    users: {},
    garages: {},
    serviceRequests: {},
    checklists: {}
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats({
          ...response.data.data,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        setStats(prev => ({ 
          ...prev, 
          loading: false,
          error: "Impossible de charger les données"
        }));
      }
    };

    fetchData();
  }, []);

  if (stats.error) {
    return (
      <div className="p-6 text-red-400">
        <p>Erreur: {stats.error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const StatCard = ({ title, value, icon, link, trend, description }) => (
    <Link 
      to={link} 
      className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 hover:border-orange-500/30 transition-all group hover:shadow-lg hover:shadow-orange-500/10"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">
            {stats.loading ? (
              <span className="inline-block h-8 w-20 bg-slate-700 rounded animate-pulse"></span>
            ) : (
              value.toLocaleString()
            )}
          </p>
          <div className="flex items-center mt-1">
            {trend && (
              <span className={`text-xs ${
                trend.value > 0 ? 'text-green-400' : 'text-red-400'
              } mr-2`}>
                {trend.value > 0 ? '↑' : '↓'} {Math.abs(trend.value)} {trend.label}
              </span>
            )}
            <p className="text-xs text-orange-400">{description}</p>
          </div>
        </div>
        <div className="bg-orange-500/10 p-3 rounded-full group-hover:bg-orange-500/20 transition-colors">
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
        <div className="flex items-center space-x-2 bg-slate-800/50 rounded-full px-4 py-2">
          <span className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-sm text-slate-300">Système actif</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Comptes" 
          value={stats.users?.clients + stats.users?.garageOwners || 0} 
          icon="👥"
          link="/dashboard/utilisateurs"
          description="Utilisateurs enregistrés"
        />

        <StatCard 
          title="Clients" 
          value={stats.users?.clients || 0} 
          icon="👤"
          link="/dashboard/utilisateurs"
          description="Clients particuliers"
        />

        <StatCard 
          title="Garagistes" 
          value={stats.users?.garageOwners || 0} 
          icon="🔧"
          link="/dashboard/utilisateurs"
          description="Propriétaires de garage"
        />

        <StatCard 
          title="Garages" 
          value={stats.garages?.total || 0} 
          icon="🏢"
          link="/dashboard/garages"
          trend={{ value: stats.garages?.newThisMonth || 0, label: 'ce mois' }}
          description="Garages enregistrés"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Demandes" 
          value={stats.serviceRequests?.total || 0} 
          icon="🛠️"
          link="/dashboard/depannages"
          trend={{ value: stats.serviceRequests?.newThisMonth || 0, label: 'ce mois' }}
          description="Demandes de dépannage"
        />

        <StatCard 
          title="En attente" 
          value={stats.serviceRequests?.pending || 0} 
          icon="⏳"
          link="/dashboard/depannages"
          description="Demandes en attente"
        />

        <StatCard 
          title="Checklists" 
          value={stats.checklists?.total || 0} 
          icon="✅"
          link="/dashboard/fiches/pre-demarrage"
          trend={{ value: stats.checklists?.newThisMonth || 0, label: 'ce mois' }}
          description="Checklists complétées"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section Rapports rapides */}
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">Rapports rapides</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
              <div>
                <p className="text-sm text-slate-300">Garages actifs</p>
                <p className="text-lg font-bold text-white">
                  {stats.garages?.active || 0} <span className="text-sm text-slate-400">/ {stats.garages?.total || 0}</span>
                </p>
              </div>
              <span className="text-orange-500">🏁</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
              <div>
                <p className="text-sm text-slate-300">Demandes acceptées</p>
                <p className="text-lg font-bold text-white">
                  {stats.serviceRequests?.accepted || 0} <span className="text-sm text-slate-400">/ {stats.serviceRequests?.total || 0}</span>
                </p>
              </div>
              <span className="text-green-500">✓</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
              <div>
                <p className="text-sm text-slate-300">Nouveaux utilisateurs</p>
                <p className="text-lg font-bold text-white">
                  +{stats.users?.newThisMonth || 0} <span className="text-sm text-slate-400">ce mois</span>
                </p>
              </div>
              <span className="text-blue-500">↑</span>
            </div>
          </div>
        </div>

        {/* Section Activité récente */}
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">Activité récente</h2>
          <div className="space-y-4">
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <p className="text-sm text-slate-300 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Système opérationnel
              </p>
              <p className="text-xs text-slate-400 mt-1">Dernière vérification: {new Date().toLocaleTimeString()}</p>
            </div>

            <div className="p-3 bg-slate-800/30 rounded-lg">
              <p className="text-sm text-slate-300">
                <span className="text-orange-400">{stats.serviceRequests?.newThisMonth || 0}</span> nouvelles demandes ce mois
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Dont <span className="text-white">{stats.serviceRequests?.pending || 0}</span> en attente
              </p>
            </div>

            <div className="p-3 bg-slate-800/30 rounded-lg">
              <p className="text-sm text-slate-300">
                <span className="text-blue-400">{stats.checklists?.newThisMonth || 0}</span> nouvelles checklists
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Total: <span className="text-white">{stats.checklists?.total || 0}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}