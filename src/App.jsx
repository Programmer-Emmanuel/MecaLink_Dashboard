import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Accueil } from "./pages/Accueil/Accueil";
import { Connexion } from "./components/Connexion";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { DashboardAccueil } from "./components/Dashboard/DashboardAccueil";
import { Utilisateurs } from "./components/Dashboard/Utilisateurs";
import { Fiches } from "./components/Dashboard/Fiches";
import { Depannages } from "./components/Dashboard/Depannages";
import { Statistiques } from "./components/Dashboard/Statistiques";
import { Avertissements } from "./components/Dashboard/Avertissements";
import { Notifications } from "./components/Dashboard/Notifications";
import { Profil } from "./components/Dashboard/Profil";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/dashboard" element={<Dashboard contenu={<DashboardAccueil />} />} />
        <Route path="/dashboard/utilisateurs" element={<Dashboard contenu={<Utilisateurs />} />} />
        <Route path="/dashboard/fiches/pre-demarrage" element={<Dashboard contenu={<Fiches />} />} />
        <Route path="/dashboard/depannages" element={<Dashboard contenu={<Depannages />} />} />
        <Route path="/dashboard/statistiques" element={<Dashboard contenu={<Statistiques />} />} />
        <Route path="/dashboard/avertissements" element={<Dashboard contenu={<Avertissements />} />} />
        <Route path="/dashboard/notifications" element={<Dashboard contenu={<Notifications />} />} />
        <Route path="/dashboard/profil" element={<Dashboard contenu={<Profil />} />} />
      </Routes>
    </Router>
  );
}
