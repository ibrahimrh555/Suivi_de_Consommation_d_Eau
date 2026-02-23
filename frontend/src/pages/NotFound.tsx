
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Droplets } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-water-50 to-water-100">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-8">
          <div className="w-24 h-24 bg-water-gradient rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
            <Droplets className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-water-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-water-700 mb-4">Page introuvable</h2>
          <p className="text-water-600 mb-8 leading-relaxed">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link to="/">
            <Button className="bg-water-gradient hover:bg-water-700 text-white w-full py-3">
              <Home className="w-4 h-4 mr-2" />
               Page d'accueil
            </Button>
          </Link>         
        </div>
      </div>
    </div>
  );
};

export default NotFound;
