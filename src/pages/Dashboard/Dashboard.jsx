import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ReactSecureStorage from 'react-secure-storage';
import images from "../../constants/images";

export function Dashboard({ contenu }) {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const location = useLocation();

    const handleLogout = () => {
        ReactSecureStorage.removeItem('token');
        navigate('/connexion');
        window.location.reload();
    };

    useEffect(() => {
        const token = ReactSecureStorage.getItem('token');
        if (!token) {
            navigate('/connexion');
        }
    }, [navigate]);

    const isActive = (path) => location.pathname === path
        ? 'bg-orange-500 text-white rounded-lg p-3 transition-all' 
        : 'text-slate-300 hover:text-orange-400 hover:bg-slate-800 rounded-lg p-3 transition-all';

    return (
        <div className="flex h-screen bg-slate-900 font-sans">
            {/* Barre latérale */}
            <aside className="w-64 bg-slate-900 border-r border-slate-700/50 flex flex-col p-5">
                {/* En-tête avec logo */}
                <Link to="/">
                    <div className="flex items-center gap-3 mb-8 px-2 py-3">
                        <img 
                            src={images.logo} 
                            className="h-10 w-10 object-contain"
                            alt="Logo MecaLink" 
                        />
                        <div>
                            <h1 className="text-white text-xl font-bold tracking-tight">Meca<span className="text-orange-500">Link</span></h1>
                            <p className="text-xs text-slate-400">Gestion automobile</p>
                        </div>
                    </div>
                </Link>

                {/* Navigation */}
                <nav className="flex-1">
                    <h2 className="text-xs uppercase tracking-wider text-slate-500 mb-4 px-3">Navigation</h2>
                    <ul className="space-y-2">
                        <li>
                            <Link 
                                to="/dashboard" 
                                className={`flex items-center gap-3 font-medium ${isActive('/dashboard')}`}
                            >
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span>Accueil</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/dashboard/utilisateurs" 
                                className={`flex items-center gap-3 font-medium ${isActive('/dashboard/utilisateurs')}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                </svg>
                                <span>Utilisateurs</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/dashboard/fiches/pre-demarrage" 
                                className={`flex items-center gap-3 font-medium ${isActive('/dashboard/fiches/pre-demarrage')}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
                                </svg>
                                <span>Pre-demarrages</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/dashboard/depannages" 
                                className={`flex items-center gap-3 font-medium ${isActive('/dashboard/depannages')}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                                </svg>
                                <span>Depannages</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/dashboard/avertissements" 
                                className={`flex items-center gap-3 font-medium ${isActive('/dashboard/avertissements')}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                                </svg>
                                <span>Publicités</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/dashboard/statistiques" 
                                className={`flex items-center gap-3 font-medium ${isActive('/dashboard/statistiques')}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                                </svg>
                                <span>Statistiques</span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Déconnexion */}
                <div className="mt-auto pt-4 border-t border-slate-700/50">
                    <button 
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-3 w-full text-left text-orange-500 hover:text-orange-400 font-medium rounded-lg p-3 hover:bg-slate-800/50 transition-all"
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Contenu principal */}
            <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-900 to-slate-800 text-slate-200">
                <div className="p-6 min-h-full">
                    {contenu}
                </div>
            </main>

            {/* Modal de déconnexion */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-slate-800 p-6 rounded-xl max-w-sm w-full border border-slate-700/50 shadow-xl">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="bg-orange-500/20 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-orange-500">Confirmer la déconnexion</h3>
                                <p className="text-sm text-slate-400 mt-1">Vous serez redirigé vers la page de connexion</p>
                            </div>
                        </div>
                        <p className="mb-6 text-slate-300 pl-11">Êtes-vous sûr de vouloir vous déconnecter ?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}