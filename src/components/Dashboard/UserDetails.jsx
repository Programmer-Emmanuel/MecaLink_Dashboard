import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../../constants/api/api";

export function UserDetails() {
  const { userId, type } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const endpoint = type === 'client' 
          ? `/admin/users/${userId}`
          : `/admin/garages/${userId}`;
        
        const response = await api.get(endpoint);
        setUserData(response.data.data);
      } catch (err) {
        setError("Erreur lors du chargement des données utilisateur");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, type]);

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
          onClick={() => navigate(-1)} 
          className="ml-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Retour
        </button>
      </div>
    );
  }

  if (!userData) {
    return <div className="p-4 text-center text-slate-400">Aucune donnée disponible</div>;
  }

  return (
    <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-orange-500 hover:text-orange-400"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour
      </button>

      <h2 className="text-2xl font-bold text-white mb-6">
        Détails {type === 'client' ? 'du client' : 'du garagiste'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informations de base */}
        <div className="bg-slate-900/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-500 mb-4">Informations</h3>
          <div className="space-y-3">
            <p><span className="text-slate-400">Nom:</span> <span className="text-white">{userData.name || userData.userId?.name}</span></p>
            <p><span className="text-slate-400">Email:</span> <span className="text-white">{userData.email || userData.userId?.email}</span></p>
            <p><span className="text-slate-400">Téléphone:</span> <span className="text-white">{userData.phone || userData.userId?.phone}</span></p>
            {type === 'client' ? (
              <>
                <p><span className="text-slate-400">Role:</span> <span className="text-white">{userData.role}</span></p>
                <p><span className="text-slate-400">Inscrit le:</span> <span className="text-white">
                  {new Date(userData.createdAt).toLocaleDateString()}
                </span></p>
              </>
            ) : (
              <>
                <p><span className="text-slate-400">Adresse:</span> <span className="text-white">{userData.address}</span></p>
                <p><span className="text-slate-400">Note moyenne:</span> <span className="text-white">{userData.note || 'Aucune'}</span></p>
                <p><span className="text-slate-400">Horaires:</span> <span className="text-white">{userData.openingHours}</span></p>
              </>
            )}
          </div>
        </div>

        {/* Section spécifique */}
        <div className="bg-slate-900/50 p-4 rounded-lg">
          {type === 'garage' ? (
            <>
              <h3 className="text-lg font-semibold text-orange-500 mb-4">Compétences & Services</h3>
              <div className="space-y-3">
                {userData.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userData.skills.map((skill, index) => (
                      <span key={index} className="bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">Aucune compétence renseignée</p>
                )}
              </div>

              <h3 className="text-lg font-semibold text-orange-500 mt-6 mb-4">Commentaires ({userData.comments?.length || 0})</h3>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {userData.comments?.length > 0 ? (
                  userData.comments.map(comment => (
                    <div key={comment._id} className="bg-slate-800 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-white">{comment.user.name}</p>
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
                      <p className="text-sm text-slate-300 mt-1">{comment.commentaire}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
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
                  <span className={`ml-2 ${userData.isActive ? 'text-green-400' : 'text-red-400'}`}>
                    {userData.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </p>
                <p><span className="text-slate-400">Dernière mise à jour:</span> 
                  <span className="text-white ml-2">
                    {new Date(userData.updatedAt).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}