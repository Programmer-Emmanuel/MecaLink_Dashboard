import { Nav } from './../../components/Nav';
import images from "../../constants/images";
import { Link } from 'react-router-dom';
import { Savoir } from '../../components/Savoir';
import { Footer } from '../../components/Footer';
import secureLocalStorage from 'react-secure-storage';
import { Link as ScrollLink } from 'react-scroll';

export function Accueil() {

    const token = secureLocalStorage.getItem("token");
    return (
        <div className="min-h-screen flex flex-col">
            <Nav />
            
            {/* Hero Section */}
            <header className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src={images.voiture4} 
                        className="w-full h-full object-cover object-center"
                        alt="Voiture haut de gamme MecaLink - Tableau de bord professionnel" 
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-slate-900/30" />
                </div>
                
                <div className="container mx-auto px-4 sm:px-6 z-10 text-center">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight animate-fade-in-up">
                            L'excellence automobile <br />
                            <span className="text-orange-500 font-extrabold">réinventée</span>
                        </h1>
                        
                        <p className="text-lg md:text-xl text-orange-50/90 animate-fade-in-up animate-delay-100">
                            Votre tableau de bord MecaLink - Gestion et performance
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 animate-fade-in-up animate-delay-200">
                            <Link 
                                to={token ? "/dashboard" : "/connexion"} 
                                className="relative px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-orange-500/20 flex items-center justify-center gap-2 group"
                            >
                                <span className="relative z-10">Accéder au dashboard</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span className="absolute inset-0 rounded-lg bg-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                            </Link>
                            
                            <ScrollLink 
                                to="espace" 
                                smooth={true} 
                                duration={500} 
                                spy={true} 
                                offset={-80} 
                                activeClass="active-scroll" 
                                className="px-8 py-3 bg-white/5 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 hover:bg-white/10 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                Découvrir les services
                            </ScrollLink>

                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900 to-transparent z-10"></div>
            </header>

            {/* Banner Section */}
            <div className="bg-white py-6">
                <div className="container mx-auto px-6" id='espace'>
                    <h2 className="text-center text-orange-500 text-2xl md:text-3xl font-bold">
                        Espace <span className="text-slate-900">Administrateur</span>
                    </h2>
                    <div className="flex justify-center mt-4">
                        <div className="w-24 h-1 bg-orange-500 rounded-full" />
                    </div>
                </div>
            </div>

            <Savoir/>

            <Footer/>
        </div>
    )
}