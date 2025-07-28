import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import images from "../constants/images.js";
import secureLocalStorage from "react-secure-storage";

export function Nav() {
    const token = secureLocalStorage.getItem("token");
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        secureLocalStorage.removeItem("token");
        secureLocalStorage.removeItem("user");
        navigate("/");
        setShowLogoutModal(false);
    };

    return (
        <>
            <nav className="bg-slate-900 backdrop-blur-md p-2 shadow-xl sticky bottom-0 w-full z-50">
                <div className="container mx-auto">
                    <ul className="flex flex-wrap items-center justify-between gap-4 text-white">
                        <li className="hidden md:block">
                            <Link 
                                to="/"
                                className="flex items-center gap-2"
                            >
                                <img 
                                    src={images.logo} 
                                    alt="Logo MecaLink" 
                                    className="h-7"
                                />
                                <h1 className="text-orange-600 font-bold text-xl">Meca<span className="text-white">Link</span></h1>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to={token ? "/dashboard" : "/connexion"} 
                                className="relative px-3 py-2 group flex flex-col items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                <span className="text-xs md:text-sm">Dashboard</span>
                                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-3/4"></span>
                            </Link>
                        </li>
                        
                        <li>
                            <Link 
                                to="/"
                                className="relative px-3 py-2 group flex flex-col items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs md:text-sm">En savoir plus</span>
                                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-3/4"></span>
                            </Link>
                        </li>

                        <li>
                            <Link 
                                to="/"
                                className="relative px-3 py-2 group flex flex-col items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs md:text-sm">Aide</span>
                                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-3/4"></span>
                            </Link>
                        </li>
                        
                        {token ? (
                            <li>
                                <button
                                    onClick={() => setShowLogoutModal(true)}
                                    className="relative px-3 py-2 group flex flex-col items-center text-red-400 hover:text-red-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span className="text-xs md:text-sm">Déconnexion</span>
                                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-3/4"></span>
                                </button>
                            </li>
                        ) : (
                            <li>
                                <Link 
                                    to="/connexion"
                                    className="relative px-3 py-2 group flex flex-col items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    <span className="text-xs md:text-sm">Connexion</span>
                                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-3/4"></span>
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>

            {/* Modal de déconnexion */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 p-6 rounded-xl max-w-sm w-full border border-slate-700/50 shadow-xl animate-fade-in">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="bg-red-500/20 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-orange-600">Déconnexion</h3>
                                <p className="text-sm text-slate-400 mt-1">Vous allez être déconnecté</p>
                            </div>
                        </div>
                        <p className="mb-6 text-slate-300 pl-11">Êtes-vous sûr de vouloir vous déconnecter ?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}