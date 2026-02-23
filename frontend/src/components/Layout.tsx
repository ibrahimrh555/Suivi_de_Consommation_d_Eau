
import { ReactNode, useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, User, LogOut, Settings, UserCircle, Droplets } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { useEffect } from "react";
interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user , logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const handleLogout = () => {
    toast.success("Déconnexion réussie");
    logout(); // Appel de la fonction logout du contexte
    navigate("/", { replace: true });
  
  };

  useEffect(() => {
    if (user?.id) {
      axios.get(`http://127.0.0.1:8000/core/alertes/?statut=non_vu&abonne_id=${user.id}`)
        .then(res => setNotifications(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);

  useEffect(() => {
    if (!isMenuOpen && notifications.length > 0) {
      axios
        .post(`http://127.0.0.1:8000/core/alertes/marquer_vues/${user.id}/`)
        .then(() => setNotifications([])) // vider après mise à jour
        .catch((err) => console.error(err));
    }
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-water-50 to-water-100 dark:from-water-900 dark:to-water-800">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-between border-b bg-background/80 backdrop-blur-sm px-6">
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="mr-4" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-water-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AW</span>
              </div>
              <h1 className="text-xl font-bold bg-water-gradient bg-clip-text text-transparent">
                AquaWatch
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <DropdownMenu onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                      {notifications.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-80 bg-background border-border">
                <div className="p-3 border-b border-border">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                </div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    Aucune notification
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <DropdownMenuItem
                      key={notif.id}
                      className="p-3 hover:bg-accent cursor-pointer"
                    >
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm text-foreground">{notif.message}</p>
                        <p className="text-xs text-muted-foreground">{notif.date_alerte}</p>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <UserCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.nom} {user.prenom}</p>
                      <p className="text-xs text-blue-500  dark:text-gray-300">{user.email}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/alerts')}>
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        <main className="flex-1 p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2  rounded-xl">
                    <img
                    src="/public/logo - Copie.png"
                    alt="Mon image"
                    className="w-10 h-10 object-contain "
                  />
                  </div>
                  <span className="text-xl font-bold">AquaWatch</span>
                </div>
                <p className="text-gray-400 mb-4 max-w-md">
                  Solution complète de surveillance intelligente pour optimiser votre consommation d'eau 
                  et détecter les anomalies en temps réel.
                </p>
              </div>           
              <div>
                <h3 className="text-lg font-semibold mb-4">Fonctionnalités</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Surveillance temps réel</li>
                  <li>Alertes intelligentes</li>
                  <li>Historique détaillé</li>
                </ul>
              </div>            
              <div>
                <h3 className="text-lg font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Documentation</li>
                  <li>Contact support</li>
                  <li>FAQ</li>
                  <li>Tutoriels</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 AquaWatch. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
