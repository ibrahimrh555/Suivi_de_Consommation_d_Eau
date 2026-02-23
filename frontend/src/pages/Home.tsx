import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BarChart3, Bell, Shield, TrendingUp, Zap, CheckCircle, LogIn, Users, Eye, EyeOff, X, Menu } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [NumPolice, setPolice] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/core/login/", {
        numPolice: NumPolice,
        mot_de_passe: password,
      });

      const abonne = response.data.abonne;
      login({
        id: abonne.id,
        numPolice: abonne.numPolice,
        email: abonne.email,
        nom: abonne.nom,
        prenom: abonne.prenom,
        telephone: abonne.telephone,
        adresse: abonne.adresse,
        mot_de_passe: abonne.mot_de_passe,    
      });

      toast.success("Connexion réussie !");
      console.log("Abonné connecté :", abonne);

      navigate("/Dashboard");
    } catch (error: any) {
      console.log("Erreur backend :", error.response?.data);
      toast.error(
        error.response?.data?.mot_de_passe ||
        error.response?.data?.numPolice ||
        "Échec de la connexion"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: BarChart3,
      title: "Dashboard Temps Réel",
      description: "Visualisez votre consommation d'eau en temps réel avec des graphiques interactifs et des indicateurs dynamiques."
    },
    {
      icon: Bell,
      title: "Alertes Intelligentes",
      description: "Recevez des notifications instantanées en cas de fuite détectée ou de dépassement de seuil de consommation."
    },
    {
      icon: TrendingUp,
      title: "Analyse Avancée",
      description: "Analysez vos habitudes de consommation avec des rapports détaillés et des comparaisons historiques."
    },
    {
      icon: Shield,
      title: "Surveillance 24/7",
      description: "Votre capteur ESP32 surveille en continu votre installation pour détecter toute anomalie."
    }
  ];

  const stats = [
    { value: "15%", label: "Économies moyennes", icon: TrendingUp },
    { value: "24/7", label: "Surveillance continue", icon: Shield },
    { value: "< 1s", label: "Détection de fuites", icon: Zap },
    { value: "99.9%", label: "Fiabilité", icon: CheckCircle }
  ];

  const navigationItems = [
    { name: "Accueil", href: "#accueil" },
    { name: "Connexion", href: "#connexion" },
    { name: "Fonctionnalités", href: "#fonction" },
    { name: "Contact", href: "#contact" }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-water-200 via-background to-water-900 dark:from-water-900 dark:via-background dark:to-water-800">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/90 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/">
                <div className="w-10 h-10  rounded-3xl flex items-center justify-center animate-pulse-glow ">
                  <img
                    src="/public/logo - Copie.png"
                    alt="Mon image"
                    className="w-10 h-10 object-contain "
                  />
                </div>
              </Link>
              <div>
                <h1 className="text-xl font-bold bg-water-gradient bg-clip-text text-transparent ">
                  AquaWatch
                </h1>
                <p className="text-xs text-muted-foreground">Smart Water Monitoring</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-gray-900 font-bold dark:text-gray-100 hover:text-blue-800 dark:hover:text-blue-800 px-3 py-2 text-m  transition-colors"
                >
                  {item.name}
                </button>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      scrollToSection(item.href);
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium text-left transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  
                </div>
              </div>
            </div>
          )}
        </div>
        
      </nav>

      {/* Hero Section */}
      <section id="accueil" className="pt-32 pb-4 px-6">
        <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 items-center gap-16 mb-20">
          
          {/* Texte à gauche */}
          <div className="text-left animate-fade-in pl-4 md:pl-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-water-gradient bg-clip-text text-transparent leading-tight">
              Surveillez Votre<br />
              Consommation d'Eau
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
              AquaWatch transforme la gestion de votre consommation d'eau grâce à des capteurs IoT intelligents, 
              des alertes en temps réel et des analyses prédictives pour optimiser votre usage et détecter les fuites instantanément.
            </p>
          </div>

          {/* Image à droite */}
          <div className="flex justify-center md:justify-end animate-fade-in pr-4 md:pr-8">
            <img 
              src="public/1.png" 
              alt="Illustration surveillance d'eau" 
              className="w-full max-w-md rounded-2xl "
            />
          </div>
        </div>
        </div>
      </section>

      {/* Login Section */}
      <section id="connexion" className="py-20 px-6 bg-gradient-to-br from-water-700 to-water-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Connexion
            </h2>
          </div>

          <div className="flex justify-center">
            <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl animate-scale-in">
              <CardHeader className="space-y-1 pb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12  rounded-3xl flex items-center justify-center animate-pulse-glow ">
                  <img
                    src="/public/logo - Copie.png"
                    alt="Mon image"
                    className="w-12 h-12 object-contain "
                  />
                </div>
                </div>
                <CardTitle className="text-2xl text-center text-white">
                  Connexion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="policeNumber" className="text-white font-medium">
                      Numéro de Police
                    </Label>
                    <Input
                      id="policeNumber"
                      name="policeNumber"
                      type="number"
                      placeholder="Entrez votre numéro de police"
                      value={NumPolice}
                      onChange={(e) => setPolice(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white/20 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white font-medium">
                      Mot de Passe
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Entrez votre mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white/20 transition-all duration-200 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-white/10"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-white/60" />
                        ) : (
                          <Eye className="h-4 w-4 text-white/60" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white text-water-700 hover:bg-white/90 font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-water-700 border-t-transparent rounded-full animate-spin" />
                        <span>Connexion en cours...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <LogIn className="w-4 h-4" />
                        <span>Se Connecter</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fonction"  className="py-20 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-water-gradient bg-clip-text text-transparent">
              Fonctionnalités Avancées
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Découvrez comment AquaWatch révolutionne la gestion de l'eau avec des technologies de pointe
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 bg-water-gradient-light border-border hover:shadow-xl transition-all duration-300 transform hover:scale-102 animate-fade-in">
                <CardContent className="p-0">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-water-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="contact" className="py-20 px-6 bg-gradient-to-br from-water-50 to-water-100 dark:from-water-900 dark:to-water-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 bg-water-gradient bg-clip-text text-transparent">
            Interface Intuitive et Moderne
          </h2>
          <p className="text-xl mb-12 text-muted-foreground max-w-3xl mx-auto">
            Accédez à toutes vos données depuis un dashboard élégant et responsive, 
            optimisé pour tous vos appareils
          </p>
          
          <div className="bg-card/70 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto border border-border">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-6">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-water-600" />
                <h3 className="text-lg font-semibold mb-2 text-foreground">Graphiques Interactifs</h3>
                <p className="text-muted-foreground text-sm">Visualisations en temps réel de votre consommation</p>
              </div>
              <div className="p-6">
                <Bell className="w-12 h-12 mx-auto mb-4 text-water-600" />
                <h3 className="text-lg font-semibold mb-2 text-foreground">Alertes Intelligentes</h3>
                <p className="text-muted-foreground text-sm">Notifications instantanées et personnalisables</p>
              </div>
              <div className="p-6">
                <Users className="w-12 h-12 mx-auto mb-4 text-water-600" />
                <h3 className="text-lg font-semibold mb-2 text-foreground">Multi-utilisateurs</h3>
                <p className="text-muted-foreground text-sm">Gestion de plusieurs capteurs et comptes</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 bg-card">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6 bg-water-gradient bg-clip-text text-transparent">
            Prêt à Optimiser Votre Consommation d'Eau ?
          </h2>
          <p className="text-xl mb-8 text-muted-foreground">
            Rejoignez des milliers d'utilisateurs qui économisent l'eau et réduisent leurs factures avec AquaWatch
          </p>
          
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-8 bg-water-gradient-light border-border hover:shadow-xl transition-all duration-300 transform hover:scale-102 animate-fade-in">
                <CardContent className="p-0">
                <stat.icon className="w-10 h-10 text-water-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-700 font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

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
  );
};


export default Home;
