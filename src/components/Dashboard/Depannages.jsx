import { useState, useEffect } from 'react';
import api from "../../constants/api/api";
import secureLocalStorage from 'react-secure-storage';

export function Depannages() {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Récupérer toutes les demandes de dépannage
  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/service-requests');
        setServiceRequests(response.data.data.serviceRequests || []);
      } catch (err) {
        setError("Erreur lors du chargement des demandes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRequests();
  }, []);

  // Récupérer les détails d'une demande spécifique
  const fetchRequestDetails = async (requestId) => {
    try {
      setDetailsLoading(true);
      const response = await api.get(`/admin/service-requests/${requestId}`);
      setSelectedRequest(response.data.data);
    } catch (err) {
      setError("Erreur lors du chargement des détails");
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const showDetailsModal = (request) => {
    fetchRequestDetails(request._id);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRequest(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        {error}
        <button 
          onClick={() => window.location.reload()} 
          className="ml-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Gestion des Demandes de Dépannage</h1>
      
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-orange-500">
            Demandes ({serviceRequests.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Garage</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {serviceRequests.length > 0 ? (
                serviceRequests.map(request => (
                  <tr key={request._id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                      {request.user?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                      {request.garage?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300 max-w-xs truncate">
                      {request.description || 'Aucune description'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        request.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {request.status === 'pending' ? 'En attente' : 
                         request.status === 'accepted' ? 'Accepté' : 'Terminé'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => showDetailsModal(request)}
                        className="text-orange-500 hover:text-orange-400 transition-colors"
                        title="Détails"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-4 text-center text-slate-400">
                    Aucune demande de dépannage trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modale pour les détails */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 p-6 rounded-xl max-w-2xl w-full border border-slate-700 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-white">
                Détails de la demande
              </h2>
              <button 
                onClick={closeModal}
                className="text-slate-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {detailsLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : selectedRequest ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations client */}
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-500 mb-4">Client</h3>
                  <div className="space-y-3">
                    <p><span className="text-slate-400">Nom:</span> <span className="text-white">{selectedRequest.clientId?.name || selectedRequest.clientName || 'N/A'}</span></p>
                    <p><span className="text-slate-400">Téléphone:</span> <span className="text-white">{selectedRequest.clientId?.phone || selectedRequest.clientPhone || 'N/A'}</span></p>
                    <p><span className="text-slate-400">Email:</span> <span className="text-white">{selectedRequest.clientId?.email || selectedRequest.clientEmail || 'N/A'}</span></p>
                    <p><span className="text-slate-400">Localisation:</span> <span className="text-white">{selectedRequest.location?.address || 'N/A'}</span></p>
                  </div>
                </div>

                {/* Informations garage */}
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-500 mb-4">Garage</h3>
                  <div className="space-y-3">
                    <p><span className="text-slate-400">Nom:</span> <span className="text-white">{selectedRequest.garageId?.name || selectedRequest.garageName || 'N/A'}</span></p>
                    <p><span className="text-slate-400">Téléphone:</span> <span className="text-white">{selectedRequest.garageId?.phone || 'N/A'}</span></p>
                    <p><span className="text-slate-400">Email:</span> <span className="text-white">{selectedRequest.garageId?.email || 'N/A'}</span></p>
                    <p><span className="text-slate-400">Adresse:</span> <span className="text-white">{selectedRequest.garageId?.address || 'N/A'}</span></p>
                  </div>
                </div>

                {/* Détails de la demande */}
                <div className="bg-slate-900/50 p-4 rounded-lg md:col-span-2">
                  <h3 className="text-lg font-semibold text-orange-500 mb-4">Demande</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><span className="text-slate-400">Statut:</span> 
                        <span className={`ml-2 ${
                          selectedRequest.status === 'pending' ? 'text-yellow-400' :
                          selectedRequest.status === 'accepted' ? 'text-green-400' :
                          'text-blue-400'
                        }`}>
                          {selectedRequest.status === 'pending' ? 'En attente' : 
                           selectedRequest.status === 'accepted' ? 'Accepté' : 'Terminé'}
                        </span>
                      </p>
                      <p><span className="text-slate-400">Date création:</span> 
                        <span className="text-white ml-2">
                          {new Date(selectedRequest.createdAt).toLocaleString()}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Description:</p>
                      <p className="text-white mt-1 bg-slate-800 p-3 rounded-lg">
                        {selectedRequest.description || 'Aucune description'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-slate-400 py-8">Impossible de charger les détails</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}