import { Link } from "react-router-dom";
import images from "../constants/images.js";

export function Footer() {
    return (
        <footer className="bg-slate-900 text-white pt-12 pb-6 border-t border-orange-500/20">
            <div className="container mx-auto px-4">
                {/* Grid principale */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    
                    {/* Colonne Logo + Description */}
                    <div className="md:col-span-1">
                        <Link className="flex items-center gap-2 mb-4">
                            <img 
                                src={images.logo} 
                                alt="Logo MecaLink" 
                                className="h-8"
                            />
                            <h2 className="text-orange-600 font-bold text-xl">Meca<span className="text-white">Link</span></h2>
                        </Link>
                        <p className="text-gray-400 text-sm">
                            Plateforme pour trouver des garages automobiles de manière flexible et rapidement.
                        </p>
                    </div>

                    {/* Colonne Liens rapides */}
                    <div>
                        <h3 className="text-orange-500 font-semibold text-lg mb-4">Liens rapides</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-400 hover:text-orange-500 transition-colors">Accueil</Link></li>
                            <li><Link to="/services" className="text-gray-400 hover:text-orange-500 transition-colors">Services</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-orange-500 transition-colors">À propos</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-orange-500 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Colonne Services */}
                    <div>
                        <h3 className="text-orange-500 font-semibold text-lg mb-4">Services</h3>
                        <ul className="space-y-2">
                            <li><Link to="/dashboard" className="text-gray-400 hover:text-orange-500 transition-colors">Dashboard</Link></li>
                            <li><Link to="/diagnostic" className="text-gray-400 hover:text-orange-500 transition-colors">Diagnostic</Link></li>
                            <li><Link to="/gestion" className="text-gray-400 hover:text-orange-500 transition-colors">Gestion clients</Link></li>
                            <li><Link to="/formations" className="text-gray-400 hover:text-orange-500 transition-colors">Formations</Link></li>
                        </ul>
                    </div>

                    {/* Colonne Contact */}
                    <div>
                        <h3 className="text-orange-500 font-semibold text-lg mb-4">Contactez-nous</h3>
                        <address className="text-gray-400 not-italic">
                            <p className="mb-2">Cocody Angré | Abidjan, Côte d’Ivoire</p>
                            <p className="mb-2">neuracomputing@gmail.com</p>
                            <p>+225 07 09 512 657</p>
                        </address>
                    </div>
                </div>

                {/* Ligne de séparation */}
                <div className="border-t border-gray-800 my-6"></div>

                {/* Bas de footer */}
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">
                        © {new Date().getFullYear()} MecaLink. Tous droits réservés.
                    </p>
                    
                    <div className="flex space-x-4">
                        <Link to="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                            <span className="sr-only">Facebook</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                            </svg>
                        </Link>
                        <Link to="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                            <span className="sr-only">Twitter</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                        </Link>
                        <Link to="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                            <span className="sr-only">Instagram</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}