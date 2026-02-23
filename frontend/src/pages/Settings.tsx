
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Save, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { useEffect } from "react";


const API_BASE = "http://127.0.0.1:8000/core"; 

const Settings = () => {
  const { user } = useAuth();
  const abonneId = user?.id;
  const [settings, setSettings] = useState({
    dailyThreshold: "",
    weeklyThreshold: "",
    monthlyThreshold: "",
    email: "",
    nom: "",
    prenom: "",
    telephone: "",
    mot_de_passe: "",
  });

  // Charger les infos utilisateur et seuils
  useEffect(() => {
    if (!abonneId) return;

    axios.get(`${API_BASE}/settings/user/${abonneId}/`)
      .then(res => setSettings(prev => ({ ...prev, ...res.data })))
      .catch(() => toast.error("Erreur chargement utilisateur"));

    axios.get(`${API_BASE}/settings/objectifs/${abonneId}/`)
      .then(res => {
        const objMap = Object.fromEntries(res.data.map((o: any) => [o.type_objectif, o.volume_cible_L]));
        setSettings(prev => ({
          ...prev,
          dailyThreshold: objMap.jour || "",
          weeklyThreshold: objMap.semaine || "",
          monthlyThreshold: objMap.mois || "",
        }));
      })
      .catch(() => toast.error("Erreur chargement objectifs"));
  }, [abonneId]);

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Sauvegarder seuils
  const saveSeuilsSettings = async () => {
    try {
      await axios.put(`${API_BASE}/settings/objectifs/${abonneId}/`, [
        { type_objectif: "jour", volume_cible_L: settings.dailyThreshold },
        { type_objectif: "semaine", volume_cible_L: settings.weeklyThreshold },
        { type_objectif: "mois", volume_cible_L: settings.monthlyThreshold },
      ]);
      toast.success("Seuils mis à jour ");
    } catch {
      toast.error("Erreur mise à jour seuils");
    }
  };

  // Sauvegarder infos utilisateur
  const saveUtilisateurSettings = async () => {
    try {
      await axios.put(`${API_BASE}/settings/user/${abonneId}/`, {
        nom: settings.nom,
        prenom: settings.prenom,
        email: settings.email,
        telephone: settings.telephone,
        mot_de_passe: settings.mot_de_passe,
      });
      toast.success("Profil mis à jour ");
    } catch (err) {
      console.error(err);
      toast.error("Erreur mise à jour profil ");
    }
  };

  

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-water-500 mb-2">Paramètres</h1>
          <p className="text-water-600">Configuration de votre système AquaWatch</p>
        </div>
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seuils et Alertes */}
        <Card className="bg-white/80 backdrop-blur-sm border-water-200">
          <CardHeader>
            <CardTitle className="text-water-800 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-water-600" />
              Seuils et Alertes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="dailyThreshold" className="text-water-700">
                  Seuil de consommation journalière (Litres)
                </Label>
                <Input
                  id="dailyThreshold"
                  type="number"
                  value={settings.dailyThreshold}
                  onChange={(e) => updateSetting('dailyThreshold', Number(e.target.value))}
                  className="mt-1 border-water-300"
                />
              </div>

              <div>
                <Label htmlFor="monthlyThreshold" className="text-water-700">
                  Seuil de consommation hebdomadaire (Litres)
                </Label>
                <Input
                  id="weeklyThreshold"
                  type="number"
                  value={settings.weeklyThreshold}
                  onChange={(e) => updateSetting('weeklyThreshold', Number(e.target.value))}
                  className="mt-1 border-water-300"
                />
              </div>

              <div>
                <Label htmlFor="monthlyThreshold" className="text-water-700">
                  Seuil de consommation mensuelle (Litres)
                </Label>
                <Input
                  id="monthlyThreshold"
                  type="number"
                  value={settings.monthlyThreshold}
                  onChange={(e) => updateSetting('monthlyThreshold', Number(e.target.value))}
                  className="mt-1 border-water-300"
                />
              </div>
              
              <br /><br /><br />

              <div className="flex justify-end space-x-3">         
                <Button 
                  onClick={saveSeuilsSettings}
                  className="bg-water-gradient hover:bg-water-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
              
            </div>
            
          </CardContent>
        </Card>

        {/* Profil utilisateur */}
        <Card className="bg-white/80 backdrop-blur-sm border-water-200">
          <CardHeader>
            <CardTitle className="text-water-800 flex items-center">
              <User className="w-5 h-5 mr-2 text-water-600" />
              Profil Utilisateur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-water-700">
                  Nom 
                </Label>
                <Input
                  id="nom"
                  value={settings.nom}
                  onChange={(e) => updateSetting('nom', e.target.value)}
                  className="mt-1 border-water-300"
                />
              </div>
              <div>
                <Label htmlFor="name" className="text-water-700">
                  Prenom 
                </Label>
                <Input
                  id="prenom"
                  value={settings.prenom}
                  onChange={(e) => updateSetting('prenom', e.target.value)}
                  className="mt-1 border-water-300"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-water-700">
                  Numéro de téléphone
                </Label>
                <Input
                  id="phone"
                  type="number"
                  value={settings.telephone}
                  onChange={(e) => updateSetting('telephone', e.target.value)}
                  className="mt-1 border-water-300"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-water-700">
                  Adresse email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => updateSetting('email', e.target.value)}
                  className="mt-1 border-water-300"
                />
              </div>             
              <div>
                <Label htmlFor="annMotPasse" className="text-water-700">
                  Ancienne mot de passe
                </Label>
                <Input
                  id="annMotPasse"
                  type="password"
                  value={settings.mot_de_passe}
                  onChange={(e) => updateSetting('mot_de_passe', e.target.value)}
                  className="mt-1 border-water-300"
                />
              </div>             
              <div className="flex justify-end space-x-3">         
                <Button 
                  onClick={saveUtilisateurSettings}
                  className="bg-water-gradient hover:bg-water-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </div>
            
          </CardContent>
        </Card>       
      </div>
            
    </div>
  );
};

export default Settings;
