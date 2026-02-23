import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // Assurez-vous que le chemin est correct

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Si pas d'utilisateur, on redirige vers /login
    // "replace" empêche de revenir en arrière avec le bouton Précédent
    // "state" permet de rediriger l'utilisateur vers la page qu'il voulait voir après connexion (optionnel)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;