import { useState, useEffect, useRef, useCallback } from 'react';
import api from "../../constants/api/api";
import { FiSearch, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export function Utilisateurs() {
  const [clients, setClients] = useState([]);
  const [garagistes, setGaragistes] = useState([]);
  const [garages, setGarages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
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
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // États pour la pagination
  const [pagination, setPagination] = useState({
    clients: { current: 1, pageSize: 10, total: 0 },
    garagistes: { current: 1, pageSize: 10, total: 0 },
    garages: { current: 1, pageSize: 10, total: 0 }
  });

  const commentsCarouselRef = useRef(null);
  const [currentCommentIndex, setCurrentCommentIndex] = useState(0);
  const scrollContainerRef = useRef([]);

  // Fetch all users data avec pagination
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Ne montrer le loading que lors du premier chargement
        if (initialLoad) {
          setLoading(true);
        }
        
        // Récupérer les clients avec pagination
        const clientsRes = await api.get(`/admin/users?role=client&page=${pagination.clients.current}&limit=${pagination.clients.pageSize}`);
        setClients(clientsRes.data.data.users || []);
        setPagination(prev => ({
          ...prev,
          clients: { ...prev.clients, total: clientsRes.data.data.total || 0 }
        }));
        
        // Récupérer les garagistes avec pagination
        const garagistesRes = await api.get(`/admin/users?role=garage&page=${pagination.garagistes.current}&limit=${pagination.garagistes.pageSize}`);
        setGaragistes(garagistesRes.data.data.users || []);
        setPagination(prev => ({
          ...prev,
          garagistes: { ...prev.garagistes, total: garagistesRes.data.data.total || 0 }
        }));
        
        // Récupérer les garages avec pagination
        const garagesRes = await api.get(`/admin/garages?page=${pagination.garages.current}&limit=${pagination.garages.pageSize}`);
        setGarages(garagesRes.data.data.garages || []);
        setPagination(prev => ({
          ...prev,
          garages: { ...prev.garages, total: garagesRes.data.data.total || 0 }
        }));
        
      } catch (err) {
        setError("Erreur lors du chargement des utilisateurs");
        console.error(err);
      } finally {
        if (initialLoad) {
          setLoading(false);
          setInitialLoad(false);
        }
      }
    };

    fetchUsers();
  }, [pagination.clients.current, pagination.garagistes.current, pagination.garages.current, initialLoad]);

  // Fetch all users for search (without pagination)
  useEffect(() => {
    const fetchAllUsersForSearch = async () => {
      try {
        // Récupérer tous les clients
        const clientsRes = await api.get('/admin/users?role=client&limit=1000');
        const allClients = clientsRes.data.data.users || [];
        
        // Récupérer tous les garagistes
        const garagistesRes = await api.get('/admin/users?role=garage&limit=1000');
        const allGaragistes = garagistesRes.data.data.users || [];
        
        // Récupérer tous les garages
        const garagesRes = await api.get('/admin/garages?limit=1000');
        const allGarages = garagesRes.data.data.garages || [];
        
        // Combiner tous les utilisateurs pour la recherche
        const combinedUsers = [
          ...allClients.map(user => ({ ...user, type: 'client' })),
          ...allGaragistes.map(user => ({ ...user, type: 'garagiste' })),
          ...allGarages.map(garage => ({ 
            ...garage, 
            name: garage.userId?.name || garage.name,
            type: 'garage'
          }))
        ];
        
        setAllUsers(combinedUsers);
      } catch (err) {
        console.error("Erreur lors du chargement de tous les utilisateurs pour la recherche:", err);
      }
    };

    fetchAllUsersForSearch();
  }, []);

  // Handle click outside search to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search function with debounce
  const handleSearch = useCallback((term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    const results = allUsers.filter(user => 
      user.name.toLowerCase().includes(term.toLowerCase())
    );

    setSearchResults(results);
  }, [allUsers]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm, handleSearch]);

  const fetchUserDetails = async (id, type) => {
    try {
      setDetailsLoading(true);
      const endpoint = type === 'client' 
        ? `/admin/users/${id}`
        : type === 'garagiste'
        ? `/admin/users/${id}`
        : `/admin/garages/${id}`;
      
      const response = await api.get(endpoint);
      setUserDetails(response.data.data);
      setSelectedUser({ id, type });
      setCurrentCommentIndex(0);
    } catch (err) {
      setError("Erreur lors du chargement des détails");
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Fonction pour changer de page sans recharger la page
  const handlePageChange = (section, page) => {
    // Mettre à jour seulement la pagination sans recharger les données
    setPagination(prev => ({
      ...prev,
      [section]: { ...prev[section], current: page }
    }));
    
    // Faire défiler vers le haut de la section
    const sectionElement = document.getElementById(section);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
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

  const handleScroll = (index, direction) => {
    const container = scrollContainerRef.current[index];
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
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
    setSearchTerm('');
    setSearchResults([]);
    setShowSuggestions(false);
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
      if (modal.userType === 'client' || modal.userType === 'garagiste') {
        await api.delete(`/admin/users/${modal.id}`);
        if (modal.userType === 'client') {
          setClients(clients.filter(client => client._id !== modal.id));
        } else {
          setGaragistes(garagistes.filter(garagiste => garagiste._id !== modal.id));
        }
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

  // Composant réutilisable pour les cartes utilisateur
  const UserCard = ({ user, type }) => (
    <div
      className="bg-slate-800 p-3 rounded-lg flex justify-between items-center hover:bg-slate-700 transition-colors cursor-pointer min-w-[280px] mx-2"
      onClick={() => showDetailsModal(user._id, type, user.name || user.userId?.name)}
    >
      <div>
        <p className="font-medium text-white">{user.name || user.userId?.name}</p>
        <p className="text-sm text-slate-400">{user.email || user.userId?.email}</p>
        <p className="text-sm text-slate-400">{user.phone || user.userId?.phone}</p>
        {user.location?.address && (
          <p className="text-xs text-orange-400 mt-1">{user.location.address}</p>
        )}
        {user.note && (
          <p className="text-xs text-orange-400 mt-1">Note: {user.note}</p>
        )}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          showDeleteModal(user._id, type, user.name || user.userId?.name);
        }}
        className="p-2 text-red-500 hover:text-red-400 transition-colors"
        title="Supprimer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );

  // Composant de pagination
  const Pagination = ({ section, data, paginationData }) => {
    const totalPages = Math.ceil(paginationData.total / paginationData.pageSize);
    
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          onClick={() => handlePageChange(section, paginationData.current - 1)}
          disabled={paginationData.current === 1}
          className={`p-2 rounded-md ${paginationData.current === 1 ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
        >
          <FiChevronLeft className="w-4 h-4" />
        </button>
        
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (paginationData.current <= 3) {
            pageNum = i + 1;
          } else if (paginationData.current >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = paginationData.current - 2 + i;
          }
          
          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(section, pageNum)}
              className={`px-3 py-1 rounded-md ${paginationData.current === pageNum ? 'bg-orange-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
            >
              {pageNum}
            </button>
          );
        })}
        
        {totalPages > 5 && paginationData.current < totalPages - 2 && (
          <span className="px-2 text-slate-400">...</span>
        )}
        
        {totalPages > 5 && paginationData.current < totalPages - 2 && (
          <button
            onClick={() => handlePageChange(section, totalPages)}
            className={`px-3 py-1 rounded-md ${paginationData.current === totalPages ? 'bg-orange-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
            >
            {totalPages}
          </button>
        )}
        
        <button
          onClick={() => handlePageChange(section, paginationData.current + 1)}
          disabled={paginationData.current === totalPages}
          className={`p-2 rounded-md ${paginationData.current === totalPages ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
        >
          <FiChevronRight className="w-4 h-4" />
        </button>
        
        <span className="text-sm text-slate-400 ml-2">
          {paginationData.total} éléments au total
        </span>
      </div>
    );
  };

  // Sections à afficher
  const sections = [
    { 
      title: "Clients", 
      data: clients, 
      type: "client",
      emptyMessage: "Aucun client trouvé",
      paginationKey: "clients"
    },
    { 
      title: "Garagistes", 
      data: garagistes, 
      type: "garagiste",
      emptyMessage: "Aucun garagiste trouvé",
      paginationKey: "garagistes"
    },
    { 
      title: "Garages", 
      data: garages, 
      type: "garage",
      emptyMessage: "Aucun garage trouvé",
      paginationKey: "garages"
    }
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-white">Gestion des Utilisateurs</h1>
        
        {/* Barre de recherche */}
        <div className="relative w-full md:w-96" ref={searchRef}>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              className="w-full pl-10 pr-8 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSearchResults([]);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <FiX />
              </button>
            )}
          </div>
          
          {/* Suggestions avec tous les résultats */}
          {showSuggestions && searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
              <div className="px-3 py-2 text-xs text-slate-400 border-b border-slate-700">
                {searchResults.length} résultat(s) trouvé(s)
              </div>
              {searchResults.map((result) => (
                <div
                  key={`${result._id}-${result.type}`}
                  className="px-4 py-2 hover:bg-slate-700 cursor-pointer flex justify-between items-center"
                  onClick={() => showDetailsModal(result._id, result.type, result.name)}
                >
                  <div className="flex flex-col">
                    <span className="text-white">{result.name}</span>
                    <span className="text-xs text-slate-400">
                      {result.email || result.userId?.email}
                    </span>
                  </div>
                  <span className="text-xs text-orange-400 capitalize">
                    {result.type === 'garagiste' ? 'garagiste' : result.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Sections dynamiques */}
      {sections.map((section, index) => (
        <div key={index} id={section.paginationKey} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 mb-6">
          <h2 className="text-xl font-semibold text-orange-500 mb-4">
            {section.title} ({pagination[section.paginationKey].total})
          </h2>
          
          <div className="relative">
            {section.data.length > 0 ? (
              <>
                <button 
                  onClick={() => handleScroll(index, 'left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-slate-700/80 hover:bg-slate-600 p-2 rounded-full"
                  disabled={section.data.length <= 3}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div 
                  ref={el => scrollContainerRef.current[index] = el}
                  className="flex overflow-x-auto space-x-3 py-2 scrollbar-hide"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {section.data.map(user => (
                    <UserCard key={user._id} user={user} type={section.type} />
                  ))}
                </div>
                
                <button 
                  onClick={() => handleScroll(index, 'right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-slate-700/80 hover:bg-slate-600 p-2 rounded-full"
                  disabled={section.data.length <= 3}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            ) : (
              <p className="text-slate-400 text-center py-4">{section.emptyMessage}</p>
            )}
          </div>
          
          {/* Pagination pour chaque section */}
          <Pagination 
            section={section.paginationKey} 
            data={section.data} 
            paginationData={pagination[section.paginationKey]} 
          />
        </div>
      ))}

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
                      Vous allez supprimer {modal.userType === 'client' ? 'le client' : 
                        modal.userType === 'garagiste' ? 'le garagiste' : 'le garage'} : 
                      <span className="font-medium text-white"> {modal.name}</span>
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
                    Détails {modal.userType === 'client' ? 'du client' : 
                    modal.userType === 'garagiste' ? 'du garagiste' : 'du garage'}
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
                        {modal.userType !== 'garage' && (
                          <>
                            <p><span className="text-slate-400">Role:</span> <span className="text-white capitalize">{userDetails.role}</span></p>
                            <p><span className="text-slate-400">Inscrit le:</span> <span className="text-white">
                              {new Date(userDetails.createdAt).toLocaleDateString()}
                            </span></p>
                          </>
                        )}
                        {(userDetails.location?.address || userDetails.address) && (
                          <p><span className="text-slate-400">Adresse:</span> <span className="text-white">{userDetails.location?.address || userDetails.address}</span></p>
                        )}
                        {userDetails.note && (
                          <p><span className="text-slate-400">Note moyenne:</span> <span className="text-white">{userDetails.note}</span></p>
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