import { useState, useEffect } from 'react';
import api from "../../constants/api/api";
import { FiEdit, FiSave, FiX, FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi';

export function Profil() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch admin profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/admin/auth/me');
        setProfile(data.data);
        setEditForm({
          name: data.data.name,
          email: data.data.email,
          phone: data.data.phone,
          password: '',
          confirmPassword: ''
        });
      } catch (err) {
        setError("Erreur lors du chargement du profil");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      setLoading(true);
      // Préparer les données à envoyer (ne pas envoyer les champs vides)
      const updateData = {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone
      };

      if (editForm.password) {
        updateData.password = editForm.password;
      }

      const { data } = await api.put('/admin/profile', updateData);
      
      setProfile(data.data.user);
      setSuccessMessage(data.msg);
      setIsEditing(false);
      
      // Reset error and success message after 5 seconds
      setTimeout(() => {
        setError(null);
        setSuccessMessage(null);
      }, 5000);
      
    } catch (err) {
      setError(err.response?.data?.msg || "Erreur lors de la mise à jour du profil");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error && !profile) {
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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Mon Profil Administrateur</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <FiEdit /> Modifier
          </button>
        )}
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30">
          {error}
        </div>
      )}

      {!isEditing ? (
        // Vue du profil
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400">Nom complet</p>
                <p className="text-lg text-white font-medium">{profile?.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Email</p>
                <p className="text-lg text-white font-medium">{profile?.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400">Téléphone</p>
                <p className="text-lg text-white font-medium">{profile?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Rôle</p>
                <p className="text-lg text-white font-medium capitalize">{profile?.role}</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <p className="text-sm text-slate-400">Compte créé le</p>
            <p className="text-white">
              {new Date(profile?.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
      ) : (
        // Formulaire d'édition
        <form onSubmit={handleSubmit} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Nom complet</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-slate-500" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="w-full pl-10 pr-3 py-2 bg-slate-700/50 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-slate-500" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className="w-full pl-10 pr-3 py-2 bg-slate-700/50 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Téléphone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-slate-500" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditChange}
                    className="w-full pl-10 pr-3 py-2 bg-slate-700/50 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Nouveau mot de passe (optionnel)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-slate-500" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={editForm.password}
                    onChange={handleEditChange}
                    className="w-full pl-10 pr-3 py-2 bg-slate-700/50 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:ring-orange-500"
                    placeholder="Laisser vide pour ne pas changer"
                  />
                </div>
              </div>
              {editForm.password && (
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Confirmer le mot de passe</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-slate-500" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={editForm.confirmPassword}
                      onChange={handleEditChange}
                      className="w-full pl-10 pr-3 py-2 bg-slate-700/50 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:ring-orange-500"
                      placeholder="Confirmez le nouveau mot de passe"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setError(null);
                // Reset form to original values
                setEditForm({
                  name: profile.name,
                  email: profile.email,
                  phone: profile.phone,
                  password: '',
                  confirmPassword: ''
                });
              }}
              className="px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors"
              disabled={loading}
            >
              <FiX className="inline mr-2" /> Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </>
              ) : (
                <>
                  <FiSave className="inline mr-2" /> Enregistrer
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}