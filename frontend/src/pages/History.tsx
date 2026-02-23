
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";


const History = () => {
  const { user } = useAuth();
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const abonneId = user?.id;
  const [comparisons, setComparisons] = useState([]);


  useEffect(() => {
    // Charger comparaisons
    axios.get(`http://127.0.0.1:8000/core/stats/comparisons/${abonneId}/`)
      .then(res => setComparisons(res.data))
      .catch(err => console.error("Erreur chargement comparaisons:", err));

    // Charger stats mensuelles
    axios.get(`http://127.0.0.1:8000/core/stats/?abonne_id=${abonneId}`)
      .then(res => {
        const formatted = res.data       
          .map(stat => ({
            month: new Date(stat.periode_date).toLocaleString("fr-FR", { month: "short" }),
            consumption: stat.volume_total_L,
          }))
          .reverse();
        setMonthlyData(formatted);
      });

    // Charger objectifs (ex: semaine)
    axios.get(`http://127.0.0.1:8000/core/objectifs/?abonne_id=${abonneId}`)
      .then(res => {
        const objectifJour = res.data.find(o => o.type_objectif === "jour");

        // Charger stats semaine
        axios.get(`http://127.0.0.1:8000/core/stats/weekly/${abonneId}/`)
          .then(res2 => {
            const formatted = res2.data.map(stat => ({
              day: new Date(stat.periode_date).toLocaleDateString("fr-FR", { weekday: "short" }),
              consumption: stat.volume_total_L,
              target: objectifJour?.volume_cible_L || 150
            }));
            setWeeklyData(formatted);
          });
      })
      .catch(err => console.error(err));

    // Charger mesures journalières
    axios.get(`http://127.0.0.1:8000/core/stats/journalier/?abonne_id=${abonneId}`)
      .then((res) => {
        const formatted = res.data
          .map((stat) => ({
            day: new Date(stat.periode_date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
            consumption: stat.volume_total_L,
          }))
          .reverse(); // remettre en ordre chronologique
        setDailyData(formatted);
      })
      .catch((err) => console.error(err));
    
  }, [abonneId]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-water-500 mb-2">Historique</h1>
          <p className="text-water-600">Analyse détaillée de votre consommation d'eau</p>
        </div>        
      </div>
      
      {/* Comparaisons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {comparisons.map((comp, index) => (
          <Card key={index} className="bg-white/80 backdrop-blur-sm border-water-200 hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-water-600">{comp.period}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-water-600">Actuel</span>
                  <span className="font-semibold text-water-800">{comp.current.toLocaleString()}L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-water-600">Précédent</span>
                  <span className="font-semibold text-water-800">{comp.previous.toLocaleString()}L</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-water-200">
                  <div className="flex items-center">
                    {comp.percentage >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${comp.percentage >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {comp.percentage >= 0 ? '+' : ''}{comp.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${comp.difference >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {comp.difference >= 0 ? '+' : ''}{comp.difference}L
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Graphiques historiques */}
      <div >
        <Card className="bg-white/80 backdrop-blur-sm border-water-200">
          <CardHeader>
            <CardTitle className="text-water-800 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-water-600" />
              Consommation Mensuelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#bae6fd" />
                <XAxis dataKey="month" stroke="#0369a1" />
                <YAxis stroke="#0369a1" />
                <Tooltip 
                  contentStyle={{  
                    backgroundColor: 'rgb(7, 38, 56)', 
                    color: '#ffffff',
                    border: '1px solid #bae6fd',
                    borderRadius: '8px'
                  }} 
                />
                <Bar 
                  dataKey="consumption" 
                  fill="#0ea5e9" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        
      </div>

      {/* Consommation hebdomadaire */}
      <Card className="bg-white/80 backdrop-blur-sm border-water-200">
        <CardHeader>
          <CardTitle className="text-water-800 flex items-center">
            <BarChart className="w-5 h-5 mr-2 text-water-600" />
            Consommation Hebdomadaire vs Objectifs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#bae6fd" />
              <XAxis dataKey="day" stroke="#0369a1" />
              <YAxis stroke="#0369a1" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgb(7, 38, 56)', 
                  color: '#ffffff',
                  border: '1px solid #bae6fd',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="target" fill="#e0f2fe" name="Objectif" />
              <Bar dataKey="consumption" fill="#0ea5e9" name="Consommation" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Consommation journalière détaillée */}
      <Card className="bg-white/80 backdrop-blur-sm border-water-200">
      <CardHeader>
        <CardTitle className="text-water-800">Consommation Journalière (30 derniers jours)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#bae6fd" />
            <XAxis dataKey="day" stroke="#0369a1" />
            <YAxis stroke="#0369a1" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgb(7, 38, 56)",
                color: "#ffffff",
                border: "1px solid #bae6fd",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="consumption"
              stroke="#0ea5e9"
              strokeWidth={2}
              name="Consommation (L)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    </div>
  );
};

export default History;
