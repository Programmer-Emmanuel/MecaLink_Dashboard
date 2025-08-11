import { useState, useEffect, useRef } from 'react';
import { usePDF } from 'react-to-pdf';
import api from "../../constants/api/api";

export function Fiches() {
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checklistDetails, setChecklistDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [modal, setModal] = useState({
    show: false,
    type: 'details',
    id: null
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  const { toPDF, targetRef } = usePDF({filename: 'fiche-predemarrage.pdf'});
  const modalRef = useRef(null);

  // Traductions des clés et valeurs
  const translations = {
    keys: {
      tires: 'Pneus',
      wheelNuts: 'Écrous de roue',
      body: 'Carrosserie',
      spareTire: 'Roue de secours',
      windshield: 'Pare-brise',
      wipers: 'Essuie-glaces',
      lights: 'Feux',
      indicators: 'Clignotants',
      oilLevel: 'Niveau d\'huile',
      coolant: 'Liquide de refroidissement',
      battery: 'Batterie',
      belt: 'Courroie',
      seatsBelts: 'Ceintures de sécurité',
      brakes: 'Freins',
      ac: 'Climatisation',
      fourByFour: 'Transmission 4x4',
      extinguisher: 'Extincteur',
      firstAid: 'Trousse de secours',
      triangle: 'Triangle',
      jackTools: 'Cric et outils'
    },
    values: {
      'Bon': 'Bon',
      'Oui': 'Oui',
      'Rayures': 'Rayures',
      'À revoir': 'À revoir',
      'Fissuré': 'Fissuré',
      'OK': 'OK',
      'Aucun': 'Aucun',
      'Faible': 'Faible',
      'Problème': 'Problème',
      'Incomplète': 'Incomplète',
      'Présent': 'Présent',
      'Incomplets': 'Incomplets'
    }
  };

  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/checklists?page=${pagination.page}&limit=${pagination.limit}`);
        
        setChecklists(response.data.data.checklists);
        setPagination({
          page: response.data.data.page,
          limit: response.data.data.limit,
          total: response.data.data.total,
          pages: response.data.data.pages
        });
      } catch (err) {
        setError(`Erreur lors du chargement: ${err.response?.data?.msg || err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChecklists();
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modal.show && modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modal.show]);

  const fetchChecklistDetails = async (checklistId) => {
    try {
      setDetailsLoading(true);
      const response = await api.get(`/admin/checklists/${checklistId}`);
      
      const translateData = (data) => {
        return Object.entries(data || {}).reduce((acc, [key, value]) => {
          const translatedKey = translations.keys[key] || key;
          const translatedValue = translations.values[value] || value;
          return { ...acc, [translatedKey]: translatedValue };
        }, {});
      };

      const formattedDetails = {
        ...response.data.data,
        user: response.data.data.user || {
          name: 'Non renseigné',
          email: 'Non renseigné',
          phone: 'Non renseigné'
        },
        exteriorChecks: translateData(response.data.data.exteriorChecks),
        mechanicalChecks: translateData(response.data.data.mechanicalChecks),
        interiorChecks: translateData(response.data.data.interiorChecks),
        observations: response.data.data.observations || 'Aucune observation',
        date: new Date(response.data.data.date).toLocaleDateString('fr-FR'),
        time: response.data.data.time
      };

      setChecklistDetails(formattedDetails);
    } catch (err) {
      setError(`Erreur lors du chargement des détails: ${err.response?.data?.msg || err.message}`);
      console.error("Erreur détails:", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const showDetailsModal = (checklistId) => {
    fetchChecklistDetails(checklistId);
    setModal({
      show: true,
      type: 'details',
      id: checklistId
    });
  };

  const closeModal = () => {
    setModal({
      show: false,
      type: null,
      id: null
    });
    setChecklistDetails(null);
    setError(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const downloadPDF = () => {
    toPDF();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold text-white mb-6">Fiches de pré-démarrage</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-900/50 text-red-300 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-4 px-3 py-1 bg-red-500/30 text-white rounded hover:bg-red-500/50"
          >
            ×
          </button>
        </div>
      )}
      
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-orange-500">
            Fiches ({pagination.total} au total)
          </h2>
          <button 
            onClick={() => window.location.reload()}
            className="p-2 text-slate-400 hover:text-orange-500 transition-colors"
            title="Actualiser"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="space-y-3 h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
            {checklists.length > 0 ? (
              checklists.map(checklist => (
                <div
                  key={checklist._id} 
                  className="bg-slate-800 p-3 rounded-lg flex justify-between items-center hover:bg-slate-700 transition-colors cursor-pointer"
                  onClick={() => showDetailsModal(checklist._id)}
                >
                  <div className="flex-1">
                    <p className="font-medium text-white">{checklist.user?.name || 'Non renseigné'}</p>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div>
                        <p className="text-sm text-slate-400">Date</p>
                        <p className="text-sm text-white">
                          {checklist.date ? new Date(checklist.date).toLocaleDateString('fr-FR') : 'Non renseigné'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Heure</p>
                        <p className="text-sm text-white">{checklist.time || 'Non renseigné'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      showDetailsModal(checklist._id);
                    }}
                    className="p-2 text-orange-500 hover:text-orange-400 transition-colors"
                    title="Voir détails"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col justify-center items-center">
                <p className="text-slate-400">Aucune fiche trouvée</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 px-4 py-2 bg-orange-500/20 text-orange-400 rounded hover:bg-orange-500/30"
                >
                  Actualiser
                </button>
              </div>
            )}
          </div>
        </div>

        {checklists.length > 0 && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-slate-700/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <span className="text-sm text-slate-400">
              Page {pagination.page} sur {pagination.pages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 bg-slate-700/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        )}
      </div>

      {modal.show && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            ref={modalRef}
            className="bg-white rounded-lg border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white z-10 p-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">
                Fiche de pré-démarrage
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={downloadPDF}
                  className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-1 text-sm"
                  title="Télécharger en PDF"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>PDF</span>
                </button>
                <button 
                  onClick={closeModal}
                  className="p-1 text-slate-900 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
                  aria-label="Fermer la modale"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              {detailsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              ) : checklistDetails ? (
                <div ref={targetRef} className="p-5">
                  <div className="space-y-5 text-sm">
                    <div className="text-center mb-7">
                      <h1 className="text-xl font-bold text-slate-900 mb-1">Fiche de Pré-Démarrage</h1>
                      <p className="text-slate-900">
                        {checklistDetails.date} à {checklistDetails.time}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-5 mb-5 p-3 bg-slate-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-orange-500 mb-2">Utilisateur</h3>
                        <p className='text-slate-800'><span className="text-slate-900 font-medium">Nom:</span> {checklistDetails.user.name}</p>
                        <p className='text-slate-800'><span className="text-slate-900 font-medium">Tél:</span> {checklistDetails.user.phone}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-orange-500 mb-2">Véhicule</h3>
                        <p className='text-slate-800'><span className="text-slate-900 font-medium">Immatriculation:</span> {checklistDetails.registration}</p>
                        <p className='text-slate-800'><span className="text-slate-900 font-medium">Kilométrage:</span> {checklistDetails.mileage} km</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <h3 className="font-semibold text-slate-900 mb-3 border-b pb-2">Vérifications Extérieures</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(checklistDetails.exteriorChecks).map(([key, value]) => (
                            <div key={key} className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                value === 'Bon' || value === 'Oui' || value === 'OK' ? 'bg-green-500' :
                                value === 'À revoir' || value === 'Faible' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}></div>
                              <span className="text-slate-900 font-medium">{key}:</span>
                              <span className="ml-2 text-slate-900">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg">
                        <h3 className="font-semibold text-slate-900 mb-3 border-b pb-2">Vérifications Mécaniques</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(checklistDetails.mechanicalChecks).map(([key, value]) => (
                            <div key={key} className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                value === 'OK' ? 'bg-green-500' :
                                value === 'Faible' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}></div>
                              <span className="text-slate-900 font-medium">{key}:</span>
                              <span className="ml-2 text-slate-900">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg">
                        <h3 className="font-semibold text-slate-900 mb-3 border-b pb-2">Vérifications Intérieures</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(checklistDetails.interiorChecks).map(([key, value]) => (
                            <div key={key} className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                value === 'OK' || value === 'Présent' ? 'bg-green-500' :
                                value === 'Incomplet' || value === 'Incomplète' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}></div>
                              <span className="text-slate-900 font-medium">{key}:</span>
                              <span className="ml-2 text-slate-900">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg">
                      <h3 className="font-semibold text-slate-900 mb-2 border-b pb-2">Observations</h3>
                      <p className="text-slate-900 whitespace-pre-line">{checklistDetails.observations}</p>
                    </div>

                    <div className="flex justify-between mt-6 pt-4">
                      <div className="w-1/2 pr-4">
                        <p className="text-slate-900 mb-2">Signature utilisateur</p>
                        <div className="h-10 border-b border-slate-300"></div>
                      </div>
                      <div className="w-1/2 pl-4">
                        <p className="text-slate-900 mb-2">Signature responsable</p>
                        <div className="h-10 border-b border-slate-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-5">
                  <p className="text-red-500 text-sm">Impossible de charger les détails</p>
                  <button
                    onClick={closeModal}
                    className="mt-3 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded text-sm"
                  >
                    Fermer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}