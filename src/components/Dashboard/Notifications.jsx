import { useState, useEffect } from 'react';
import api from "../../constants/api/api";
import { FiSend, FiUsers, FiUser, FiTool, FiSmartphone, FiX, FiList, FiCheck, FiArrowLeft } from 'react-icons/fi';

export function Notifications() {
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserSelectionModalOpen, setIsUserSelectionModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [response, setResponse] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    data: '',
    deviceToken: '',
    promoCode: '',
    expiryDate: ''
  });

  const notificationTypes = [
    { id: 'all', label: 'À tous', icon: <FiUsers size={20} />, description: 'Envoyer à tous les utilisateurs' },
    { id: 'clients', label: 'Clients', icon: <FiUser size={20} />, description: 'Envoyer aux clients uniquement' },
    { id: 'garages', label: 'Garagistes', icon: <FiTool size={20} />, description: 'Envoyer aux garagistes uniquement' },
    { id: 'device', label: 'Appareil', icon: <FiSmartphone size={20} />, description: 'Envoyer à un appareil spécifique' },
    { id: 'users', label: 'Utilisateurs ciblés', icon: <FiList size={20} />, description: 'Sélectionner des utilisateurs spécifiques' }
  ];

  useEffect(() => {
    if (response) {
      const timer = setTimeout(() => {
        setResponse(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [response]);

  const fetchUsersWithTokens = async () => {
    setIsLoadingUsers(true);
    try {
      const { data } = await api.get('/admin/users');
      // Filtrer uniquement les utilisateurs avec un deviceToken
      const usersWithTokens = data.data.users.filter(user => user.deviceToken);
      setUsers(usersWithTokens);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      setResponse({
        success: false,
        message: "Erreur lors de la récupération des utilisateurs"
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      body: '',
      data: '',
      deviceToken: '',
      promoCode: '',
      expiryDate: ''
    });
    setSelectedUsers([]);
  };

  const handleUserSelection = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      let endpoint = '';
      let payload = {};

      const basePayload = {
        title: formData.title,
        body: formData.body,
        data: formData.data
      };

      switch (activeTab) {
        case 'all':
          endpoint = '/admin/notifications/send-to-all';
          payload = basePayload;
          break;
        case 'clients':
          endpoint = '/admin/notifications/send-to-clients';
          payload = {
            ...basePayload,
            promoCode: formData.promoCode,
            expiryDate: formData.expiryDate
          };
          break;
        case 'garages':
          endpoint = '/admin/notifications/send-to-garages';
          payload = basePayload;
          break;
        case 'device':
          endpoint = '/admin/notifications/send-to-device';
          payload = {
            ...basePayload,
            deviceToken: formData.deviceToken
          };
          break;
        case 'users':
          endpoint = '/admin/notifications/send-to-device-tokens';
          const deviceTokens = users
            .filter(user => selectedUsers.includes(user._id))
            .map(user => user.deviceToken);
          payload = {
            ...basePayload,
            deviceTokens
          };
          break;
        default:
          break;
      }

      const { data } = await api.post(endpoint, payload);
      setIsModalOpen(false);
      setResponse({
        ...data,
        message: activeTab === 'users' 
          ? `Notification envoyée à ${selectedUsers.length} utilisateurs` 
          : data.message
      });
      resetForm();
    } catch (error) {
      console.error("Erreur lors de l'envoi de la notification:", error);
      setResponse({
        success: false,
        message: error.response?.data?.message || "Une erreur s'est produite lors de l'envoi de la notification"
      });
    } finally {
      setIsSending(false);
    }
  };

  const openModal = async (tab) => {
    setActiveTab(tab);
    setResponse(null);
    resetForm();
    
    if (tab === 'users') {
      setIsUserSelectionModalOpen(true);
      await fetchUsersWithTokens();
    } else {
      setIsModalOpen(true);
    }
  };

  const proceedToNotificationForm = () => {
    if (selectedUsers.length === 0) {
      setResponse({
        success: false,
        message: "Veuillez sélectionner au moins un utilisateur"
      });
      return;
    }
    setIsUserSelectionModalOpen(false);
    setIsModalOpen(true);
  };

  const getGridColumns = () => {
    const count = notificationTypes.length;
    if (count % 3 === 0) return 'md:grid-cols-3';
    if (count % 2 === 0) return 'md:grid-cols-2';
    if (count === 5) return 'md:grid-cols-3';
    return 'md:grid-cols-2';
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-8">Gestion des notifications</h1>

      <div className={`grid grid-cols-1 ${getGridColumns()} gap-4`}>
        {notificationTypes.map((type) => (
          <div 
            key={type.id}
            onClick={() => openModal(type.id)}
            className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50 hover:border-orange-500/30 transition-all cursor-pointer hover:shadow-lg hover:shadow-orange-500/10"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-orange-500/10 p-2 rounded-full">
                {type.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{type.label}</h3>
                <p className="text-sm text-slate-400">{type.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de sélection des utilisateurs */}
      {isUserSelectionModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl w-full max-w-2xl border border-slate-700/50">
            <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
              <h2 className="text-xl font-semibold text-white w-full">
                Sélectionner des utilisateurs
              </h2>
              <button 
                onClick={() => {
                  setIsUserSelectionModalOpen(false);
                  resetForm();
                }}
                className="text-slate-400 hover:text-white ml-4"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {isLoadingUsers ? (
                <div className="flex justify-center items-center h-40">
                  <svg className="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : users.length === 0 ? (
                <p className="text-slate-400 text-center py-8">Aucun utilisateur avec deviceToken trouvé</p>
              ) : (
                <div className="space-y-2">
                  {users.map(user => (
                    <div 
                      key={user._id}
                      onClick={() => handleUserSelection(user._id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedUsers.includes(user._id) ? 'bg-orange-500/10 border-orange-500/50' : 'bg-slate-700/50 border-slate-700/50 hover:border-orange-500/30'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-white">{user.name}</h3>
                          <p className="text-sm text-slate-400">{user.email}</p>
                        </div>
                        {selectedUsers.includes(user._id) && (
                          <div className="bg-orange-500 p-1 rounded-full">
                            <FiCheck size={16} className="text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-700/50 flex justify-between">
              <button
                onClick={() => {
                  setIsUserSelectionModalOpen(false);
                  resetForm();
                }}
                className="px-4 py-2 bg-slate-700/50 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Annuler
              </button>
              <div className="flex items-center space-x-4">
                <span className="text-slate-400">
                  {selectedUsers.length} utilisateur(s) sélectionné(s)
                </span>
                <button
                  onClick={proceedToNotificationForm}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
                  disabled={isLoadingUsers}
                >
                  <FiSend className="mr-2" />
                  Continuer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'envoi de notification */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl w-full max-w-md border border-slate-700/50">
            <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
              <button
                onClick={() => {
                  if (activeTab === 'users') {
                    setIsModalOpen(false);
                    setIsUserSelectionModalOpen(true);
                  } else {
                    setIsModalOpen(false);
                    resetForm();
                  }
                }}
                className="text-slate-400 hover:text-white"
              >
                <FiArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-semibold text-white w-full text-center">
                Envoyer une notification {activeTab !== 'all' && `aux ${notificationTypes.find(t => t.id === activeTab)?.label.toLowerCase()}`}
              </h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-slate-400 hover:text-white ml-4"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              <div className="space-y-4">
                {activeTab === 'users' && (
                  <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-700/50">
                    <p className="text-sm text-slate-400">
                      Notification sera envoyée à <span className="text-orange-500 font-medium">{selectedUsers.length}</span> utilisateur(s) sélectionné(s)
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Titre *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Message *</label>
                  <textarea
                    name="body"
                    value={formData.body}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-orange-500 focus:ring-orange-500"
                    rows={3}
                    required
                  />
                </div>

                {activeTab === 'device' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Token de l'appareil *</label>
                    <input
                      type="text"
                      name="deviceToken"
                      value={formData.deviceToken}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-orange-500 focus:ring-orange-500"
                      required
                    />
                  </div>
                )}

                {activeTab === 'clients' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Code promo</label>
                      <input
                        type="text"
                        name="promoCode"
                        value={formData.promoCode}
                        onChange={handleInputChange}
                        className="w-full bg-slate-700/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Date d'expiration</label>
                      <input
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className="w-full bg-slate-700/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Données supplémentaires</label>
                  <textarea
                    name="data"
                    value={formData.data}
                    onChange={handleInputChange}
                    placeholder='Entrez des données supplémentaires au format texte'
                    className="w-full bg-slate-700/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-orange-500 focus:ring-orange-500"
                    rows={3}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    if (activeTab === 'users') {
                      setIsUserSelectionModalOpen(true);
                    } else {
                      resetForm();
                    }
                  }}
                  className="px-4 py-2 bg-slate-700/50 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  disabled={isSending}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
                  disabled={isSending}
                >
                  {isSending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi...
                    </>
                  ) : (
                    <>
                      <FiSend className="mr-2" />
                      Envoyer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {response && (
        <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 ${response.success ? 'bg-orange-500' : 'bg-red-500'} text-white px-6 py-4 rounded-lg shadow-lg max-w-md w-full text-center`}>
          <p className="font-medium">{response.message}</p>
          <button 
            onClick={() => setResponse(null)}
            className="mt-3 px-3 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors text-sm"
          >
            Fermer
          </button>
        </div>
      )}
    </div>
  );
}