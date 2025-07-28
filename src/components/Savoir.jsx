import { Link } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

export function Savoir() {
    const token = secureLocalStorage.getItem("token");
    return (
        <div className="max-w-6xl mx-auto px-4 py-5">            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Carte 1 - Liste des utilisateurs */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    <div className="bg-orange-600 p-4 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <h3 className="text-xl font-semibold mt-2">Gestion des Utilisateurs</h3>
                    </div>
                    <div className="p-6">
                        <p className="text-gray-600 mb-4">Visualisez et gérez l'ensemble des utilisateurs inscrits sur la plateforme.</p>
                        <Link
                            to={token ? "/dashboard" : "/connexion"} 
                            className="py-2 px-6 bg-orange-100 text-orange-600 rounded-lg font-medium hover:bg-orange-200 transition-colors">
                            Accéder à la liste
                        </Link>
                    </div>
                </div>

                {/* Carte 2 - Bannière publicitaire */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    <div className="bg-blue-900 p-4 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <h3 className="text-xl font-semibold mt-2">Bannières Publicitaires</h3>
                    </div>
                    <div className="p-6">
                        <p className="text-gray-600 mb-4">Configurez et publiez des bannières promotionnelles sur l'ensemble du site.</p>
                        <Link
                            to={token ? "/dashboard" : "/connexion"} 
                            className="py-2 px-6 bg-blue-100 text-blue-600 rounded-lg font-medium hover:bg-blue-200 transition-colors">
                            Gérer les bannières
                        </Link>
                    </div>
                </div>

                {/* Carte 3 - Messagerie */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    <div className="bg-orange-600 p-4 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <h3 className="text-xl font-semibold mt-2">Messagerie Admin</h3>
                    </div>
                    <div className="p-6">
                        <p className="text-gray-600 mb-4">Envoyez des messages aux utilisateurs ou à des groupes ciblés.</p>
                        <Link
                            to={token ? "/dashboard" : "/connexion"} 
                            className="py-2 px-6 bg-orange-100 text-orange-600 rounded-lg font-medium hover:bg-orange-200 transition-colors">
                            Nouveau message
                        </Link>
                    </div>
                </div>

                {/* Carte 4 - Fiches pré-démarrage */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    <div className="bg-blue-900 p-4 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="text-xl font-semibold mt-2">Fiches Clients</h3>
                    </div>
                    <div className="p-6">
                        <p className="text-gray-600 mb-4">Accédez à toutes les fiches de pré-démarrage complétées par les clients.</p>
                        <Link
                            to={token ? "/dashboard" : "/connexion"} 
                            className="py-2 px-6 bg-blue-100 text-blue-600 rounded-lg font-medium hover:bg-blue-200 transition-colors">
                            Voir les fiches
                        </Link>
                    </div>
                </div>
            </div>
            <div className="p-5">
                <h1 className="text-center text-2xl text-slate-950 font-bold">Bien d’autres...</h1>
            </div>
        </div>
    )
}