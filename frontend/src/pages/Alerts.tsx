import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, TrendingUp, TrendingDown, AlertTriangle, Activity, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getLastMeasure, getTodayMeasures, getYesterdayTotal, getAlerts } from "@/lib/api";


const Alerts = () => {
  const { user } = useAuth();
  const [currentConsumption, setCurrentConsumption] = useState(0);
  const [hourlyData, setHourlyData] = useState([]);
  const [yesterdayTotal, setYesterdayTotal] = useState(0);
  const [alerts, setAlerts] = useState([]);

  // Simulation temps réel
  useEffect(() => {
    if (!user) return; 

    getTodayMeasures(user.id).then((data) => {
      const hourly = data.map((m: any) => {
        const date = new Date(m.date_heure);
        const hour = date.getHours().toString().padStart(2, "0") + ":00";
        return {
          hour,
          consumption: m.volume_L,
          flow: m.debit_L_min,
        };
      });
      setHourlyData(hourly);
    });
  }, [user]);
  
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      getLastMeasure(user.id).then((data) => {
        if (data.debit_L_min !== undefined) {
          setCurrentConsumption(data.debit_L_min);
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    getYesterdayTotal(user.id)
      .then((total) => {
        setYesterdayTotal(total);
      })
      .catch((err) => {
        console.error("Erreur récupération yesterdayTotal:", err);
      });
  }, [user]);

  const todayTotal = parseFloat(
    hourlyData.reduce((sum, item) => sum + item.consumption, 0).toFixed(2)
  );
  const variation =
    yesterdayTotal > 0
      ? ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100
      : 0;

  useEffect(() => {
    if (!user) return;
    getAlerts(user.id).then((data) => setAlerts(data));
  }, [user]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-water-500 mb-2">Alerts</h1>
          <p className="text-water-600">Monitoring en temps réel de votre consommation d'eau</p>
        </div>
       
      </div>
   
      {/* Indicateurs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-water-200 hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-water-600 flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Débit Instantané
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-water-800">
                  {currentConsumption}
                  <span className="text-lg text-water-600 ml-1">L/min</span>
                </div>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm text-green-600 font-medium">En temps réel</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-water-gradient rounded-full flex items-center justify-center animate-pulse-glow">
                <Droplets className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-water-200 hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-water-600 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Consommation Aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-water-800">
                  {todayTotal}
                  <span className="text-lg text-water-600 ml-1">L</span>
                </div>
                <div className="flex items-center mt-2">
                  {variation >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${variation >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {Math.abs(variation).toFixed(1)}% vs hier
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-water-gradient rounded-full flex items-center justify-center animate-pulse-glow">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-water-200 hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-water-600">
              Statut du Capteur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-green-600 mb-2">
                  Connecté
                </div>
                <div className="text-sm text-water-600">
                  Dernière mise à jour: maintenant
                </div>
                <div className="text-sm text-water-600">
                  Signal: 98%
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                  ESP32 Online
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
 
      {/* Alertes */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${
              alert.type_alerte === 'fuite' 
                ? 'bg-orange-50 border-orange-400 text-orange-800' 
                : 'bg-blue-50 border-blue-400 text-blue-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">{alert.message}</span>
                </div>
                <span className="text-sm opacity-75">{new Date((alert.date_alerte)).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Alerts;
