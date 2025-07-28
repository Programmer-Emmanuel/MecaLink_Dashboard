import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Nav } from "./Nav";
import images from "../constants/images";
import api from "../constants/api/api";
import secureLocalStorage from 'react-secure-storage';

export function Connexion() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', {
                email: formData.email,
                password: formData.password
            });

            if (response.data.success) {
                // Stockage sécurisé des informations
                secureLocalStorage.setItem('token', response.data.data.token);
                secureLocalStorage.setItem('user', response.data.data.user);

                // Redirection selon le rôle
                if (response.data.data.user.role === 'admin') {
                    navigate('/dashboard');
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Email ou mot de passe incorrect');
            console.error('Erreur de connexion:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800">
            <Nav />
            
            <div className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white/5 backdrop-blur-md p-10 rounded-xl shadow-2xl border border-white/10">
                    <div className="text-center">
                        <img 
                            src={images.logo} 
                            alt="Logo MecaLink" 
                            className="mx-auto h-12 w-auto"
                        />
                        <h2 className="mt-6 text-3xl font-extrabold text-white">
                            Connexion à votre compte
                        </h2>
                        {error && (
                            <div className="mt-4 p-3 text-sm text-red-300 bg-red-900/30 rounded-lg">
                                {error}
                            </div>
                        )}
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-orange-100 mb-1">
                                    Adresse email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none relative block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    placeholder="email@gmail.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center">
                                    <label htmlFor="password" className="block text-sm font-medium text-orange-100 mb-1">
                                        Mot de passe
                                    </label>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none relative block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:scale-[1.02] shadow-lg hover:shadow-orange-500/20'}`}
                            >
                                {isLoading ? (
                                    <span>Connexion en cours...</span>
                                ) : (
                                    <>
                                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                            <svg className="h-5 w-5 text-orange-300 group-hover:text-orange-200 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                        Se connecter
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}