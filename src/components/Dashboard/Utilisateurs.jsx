import { useState, useEffect, useRef } from 'react';
import api from "../../constants/api/api";

export function Utilisateurs() {
  const [clients, setClients] = useState([]);
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [modal, setModal] = useState({
    show: false,
    type: null,
    id: null,
    name: '',
    userType: null
  });

  const commentsCarouselRef = useRef(null);
  const [currentCommentIndex, setCurrentCommentIndex] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        const clientsRes = await api.get('/admin/users?role=client');
        setClients(clientsRes.data.data.users || []);
        
        const garagesRes = await api.get('/admin/garages');
        setGarages(garagesRes.data.data.garages || []);
        
      } catch (err) {
        setError("Erreur lors du chargement des utilisateurs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const fetchUserDetails = async (id, type) => {
    try {
      setDetailsLoading(true);
      const endpoint = type === 'client' 
        ? `/admin/users/${id}`
        : `/admin/garages/${id}`;
      
      const response = await api.get(endpoint);
      setUserDetails(response.data.data);
      setSelectedUser({ id, type });
      setCurrentCommentIndex(0); // Reset carousel index
    } catch (err) {
      setError("Erreur lors du chargement des détails");
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const scrollComments = (direction) => {
    const comments = userDetails?.comments || [];
    if (comments.length <= 1) return;

    let newIndex;
    if (direction === 'prev') {
      newIndex = currentCommentIndex === 0 ? comments.length - 1 : currentCommentIndex - 1;
    } else {
      newIndex = currentCommentIndex === comments.length - 1 ? 0 : currentCommentIndex + 1;
    }

    setCurrentCommentIndex(newIndex);
    if (commentsCarouselRef.current) {
      const commentWidth = commentsCarouselRef.current.offsetWidth;
      commentsCarouselRef.current.scrollTo({
        left: newIndex * commentWidth,
        behavior: 'smooth'
      });
    }
  };

  const showDetailsModal = (id, type, name) => {
    fetchUserDetails(id, type);
    setModal({
      show: true,
      type: 'details',
      id,
      name,
      userType: type
    });
  };

  const showDeleteModal = (id, type, name) => {
    setModal({
      show: true,
      type: 'delete',
      id,
      name,
      userType: type
    });
  };

  const closeModal = () => {
    setModal({
      show: false,
      type: null,
      id: null,
      name: '',
      userType: null
    });
    setUserDetails(null);
    setCurrentCommentIndex(0);
  };

  const confirmDelete = async () => {
    try {
      if (modal.userType === 'client') {
        await api.delete(`/admin/users/${modal.id}`);
        setClients(clients.filter(client => client._id !== modal.id));
      } else {
        await api.delete(`/admin/garages/${modal.id}`);
        setGarages(garages.filter(garage => garage._id !== modal.id));
      }
      closeModal();
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert("Échec de la suppression");
    }
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
      <h1 className="text-2xl font-bold text-white mb-6">Gestion des Utilisateurs</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colonne Clients */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h2 className="text-xl font-semibold text-orange-500 mb-4">Clients ({clients.length})</h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {clients.length > 0 ? (
              clients.map(client => (
                <div
                  key={client._id} 
                  className="bg-slate-800 p-3 rounded-lg flex justify-between items-center hover:bg-slate-700 transition-colors cursor-pointer"
                  onClick={() => showDetailsModal(client._id, 'client', client.name)}
                >
                  <div>
                    <p className="font-medium text-white">{client.name}</p>
                    <p className="text-sm text-slate-400">{client.email}</p>
                    <p className="text-sm text-slate-400">{client.phone}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      showDeleteModal(client._id, 'client', client.name);
                    }}
                    className="p-2 text-red-500 hover:text-red-400 transition-colors"
                    title="Supprimer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">Aucun client trouvé</p>
            )}
          </div>
        </div>

        {/* Colonne Garages */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h2 className="text-xl font-semibold text-orange-500 mb-4">Garagistes ({garages.length})</h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {garages.length > 0 ? (
              garages.map(garage => (
                <div
                  key={garage._id} 
                  className="bg-slate-800 p-3 rounded-lg flex justify-between items-center hover:bg-slate-700 transition-colors cursor-pointer"
                  onClick={() => showDetailsModal(garage._id, 'garage', garage.userId?.name || garage.name)}
                >
                  <div>
                    <p className="font-medium text-white">{garage.userId?.name || garage.name}</p>
                    <p className="text-sm text-slate-400">{garage.userId?.email || garage.email}</p>
                    <p className="text-sm text-slate-400">{garage.userId?.phone || garage.phone}</p>
                    <p className="text-xs text-orange-400 mt-1">
                      Note: {garage.note || 'Aucune'}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      showDeleteModal(garage._id, 'garage', garage.userId?.name || garage.name);
                    }}
                    className="p-2 text-red-500 hover:text-red-400 transition-colors"
                    title="Supprimer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">Aucun garagiste trouvé</p>
            )}
          </div>
        </div>
      </div>

      {/* Modale commune pour détails et suppression */}
      {modal.show && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 p-6 rounded-xl max-w-2xl w-full border border-slate-700 shadow-xl max-h-[90vh] overflow-y-auto">
            {modal.type === 'delete' ? (
              <>
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-red-500/20 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-500">Confirmer la suppression</h3>
                    <p className="text-sm text-slate-400 mt-1">
                      Vous allez supprimer {modal.userType === 'client' ? 'le client' : 'le garagiste'} : <span className="font-medium text-white">{modal.name}</span>
                    </p>
                  </div>
                </div>
                <p className="mb-6 text-slate-300 pl-11">Cette action est irréversible. Souhaitez-vous continuer ?</p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Confirmer
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Détails {modal.userType === 'client' ? 'du client' : 'du garagiste'}
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
                ) : userDetails ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Informations de base */}
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-orange-500 mb-4">Informations</h3>
                      <div className="space-y-3">
                        <p><span className="text-slate-400">Nom:</span> <span className="text-white">{userDetails.name || userDetails.userId?.name}</span></p>
                        <p><span className="text-slate-400">Email:</span> <span className="text-white">{userDetails.email || userDetails.userId?.email}</span></p>
                        <p><span className="text-slate-400">Téléphone:</span> <span className="text-white">{userDetails.phone || userDetails.userId?.phone}</span></p>
                        {modal.userType === 'client' ? (
                          <>
                            <p><span className="text-slate-400">Role:</span> <span className="text-white">{userDetails.role}</span></p>
                            <p><span className="text-slate-400">Inscrit le:</span> <span className="text-white">
                              {new Date(userDetails.createdAt).toLocaleDateString()}
                            </span></p>
                          </>
                        ) : (
                          <>
                            <p><span className="text-slate-400">Adresse:</span> <span className="text-white">{userDetails.address}</span></p>
                            <p><span className="text-slate-400">Note moyenne:</span> <span className="text-white">{userDetails.note || 'Aucune'}</span></p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Section spécifique */}
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                      {modal.userType === 'garage' ? (
                        <>
                          <h3 className="text-lg font-semibold text-orange-500 mb-4">Compétences & Services</h3>
                          <div className="space-y-3">
                            {userDetails.skills?.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {userDetails.skills.map((skill, index) => (
                                  <span key={index} className="bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full text-sm">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-slate-400">Aucune compétence renseignée</p>
                            )}
                          </div>

                          <h3 className="text-lg font-semibold text-orange-500 mt-6 mb-4">Commentaires ({userDetails.comments?.length || 0})</h3>
                          <div className="relative">
                            {userDetails.comments?.length > 0 ? (
                              <>
                                <div 
                                  ref={commentsCarouselRef}
                                  className="flex overflow-hidden"
                                  style={{ scrollBehavior: 'smooth' }}
                                >
                                  {userDetails.comments.map((comment, index) => (
                                    <div 
                                      key={comment._id} 
                                      className="bg-slate-800 p-4 rounded-lg min-w-full"
                                      style={{ display: index === currentCommentIndex ? 'block' : 'none' }}
                                    >
                                      <div className="flex justify-between items-start">
                                        <p className="font-medium text-white">{comment.user?.name || 'Anonyme'}</p>
                                        <div className="flex items-center">
                                          {[...Array(5)].map((_, i) => (
                                            <svg
                                              key={i}
                                              className={`w-4 h-4 ${i < comment.note ? 'text-yellow-400' : 'text-slate-600'}`}
                                              fill="currentColor"
                                              viewBox="0 0 20 20"
                                            >
                                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                          ))}
                                        </div>
                                      </div>
                                      <p className="text-sm text-slate-300 mt-2">{comment.commentaire}</p>
                                      <p className="text-xs text-slate-500 mt-3">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                                
                                {userDetails.comments.length > 1 && (
                                  <div className="flex justify-between mt-4">
                                    <button
                                      onClick={() => scrollComments('prev')}
                                      className="p-2 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors"
                                      aria-label="Commentaire précédent"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                      </svg>
                                    </button>
                                    
                                    <div className="flex items-center space-x-2">
                                      {userDetails.comments.map((_, index) => (
                                        <button
                                          key={index}
                                          onClick={() => setCurrentCommentIndex(index)}
                                          className={`w-2 h-2 rounded-full ${index === currentCommentIndex ? 'bg-orange-500' : 'bg-slate-600'}`}
                                          aria-label={`Aller au commentaire ${index + 1}`}
                                        />
                                      ))}
                                    </div>
                                    
                                    <button
                                      onClick={() => scrollComments('next')}
                                      className="p-2 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors"
                                      aria-label="Commentaire suivant"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </button>
                                  </div>
                                )}
                              </>
                            ) : (
                              <p className="text-slate-400">Aucun commentaire</p>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <h3 className="text-lg font-semibold text-orange-500 mb-4">Statut du compte</h3>
                          <div className="space-y-3">
                            <p>
                              <span className="text-slate-400">Statut:</span> 
                              <span className={`ml-2 ${userDetails.isActive ? 'text-green-400' : 'text-red-400'}`}>
                                {userDetails.isActive ? 'Actif' : 'Inactif'}
                              </span>
                            </p>
                            <p><span className="text-slate-400">Dernière mise à jour:</span> 
                              <span className="text-white ml-2">
                                {new Date(userDetails.updatedAt).toLocaleDateString()}
                              </span>
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-slate-400 py-8">Impossible de charger les détails</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}