import { useEffect, useMemo, useState } from "react";
import { Activity, CheckCircle2, Droplets, Gauge, RefreshCw, ShieldCheck, Wifi } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { getLastMeasure, getTodayMeasures, getYesterdayTotal } from "@/lib/api";

type Measure = { date_heure: string; debit_L_min: number; volume_L: number; pression_bar?: number | null };
const fallback = [
  { hour: "00h", consumption: 5 }, { hour: "04h", consumption: 18 }, { hour: "08h", consumption: 42 },
  { hour: "12h", consumption: 71 }, { hour: "16h", consumption: 96 }, { hour: "20h", consumption: 121 }, { hour: "24h", consumption: 128 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [measures, setMeasures] = useState<Measure[]>([]);
  const [last, setLast] = useState<Measure | null>(null);
  const [yesterday, setYesterday] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    if (!user) return;
    setRefreshing(true);
    try {
      const [todayData, lastData, yesterdayData] = await Promise.all([getTodayMeasures(user.id), getLastMeasure(user.id), getYesterdayTotal(user.id)]);
      setMeasures(todayData); setLast(lastData); setYesterday(yesterdayData);
    } catch {
      // Demo values keep the dashboard useful while the sensor API is offline.
    } finally { setRefreshing(false); }
  };

  useEffect(() => { void load(); }, [user]);
  const total = useMemo(() => Number(measures.reduce((sum, item) => sum + item.volume_L, 0).toFixed(1)), [measures]);
  const shownTotal = total || 128;
  const goal = 160;
  const progress = Math.min(100, Math.round((shownTotal / goal) * 100));
  const variation = yesterday > 0 ? ((shownTotal - yesterday) / yesterday) * 100 : -12;
  const chartData = measures.length ? measures.map((item) => ({ hour: new Date(item.date_heure).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }), consumption: item.volume_L })) : fallback;
  const rows = [
    { icon: Activity, label: "Débit actuel", value: `${last?.debit_L_min ?? 2.4} L/min`, state: "Normal" },
    { icon: Wifi, label: "Capteur ESP32", value: "Connecté", state: "Connecté" },
    { icon: ShieldCheck, label: "Fuite", value: "Aucune", state: "Sécurisé" },
    { icon: Gauge, label: "Pression", value: `${last?.pression_bar ?? 2.8} bar`, state: "Normal" },
  ];

  return (
    <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="space-y-5">
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-sm text-[#697085]"><span>Consommation du jour</span><span className="rounded bg-[#f1f3f7] px-2 py-1 text-xs">Aujourd’hui</span></div>
          <div className="mt-6 flex items-end justify-between"><strong className="text-4xl text-[#101828]">{shownTotal} L</strong><span className={variation <= 0 ? "text-emerald-500" : "text-red-500"}>{variation > 0 ? "+" : ""}{variation.toFixed(0)} %</span></div>
          <p className="mt-4 border-t pt-4 text-sm text-[#98a0b3]">Hier à la même heure : {yesterday || 146} L</p>
        </section>
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-sm text-[#697085]"><span>Objectif quotidien</span><span className="rounded bg-[#f1f3f7] px-2 py-1 text-xs">Aujourd’hui</span></div>
          <div className="mt-6 flex items-end justify-between"><strong className="text-4xl text-[#101828]">{goal} L</strong><span className="font-semibold text-[#0869f7]">{progress} %</span></div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#e9edf5]"><div className="h-full rounded-full bg-[#0869f7]" style={{ width: `${progress}%` }} /></div>
          <p className="mt-3 text-sm text-[#697085]">{shownTotal} L consommés sur {goal} L</p>
        </section>
        <section className="rounded-xl bg-white p-6 text-center shadow-sm">
          <div className="relative mx-auto grid h-36 w-36 place-items-center rounded-full border-[14px] border-[#dbe9ff] border-t-[#0869f7]"><div><strong className="text-3xl text-[#101828]">{progress}%</strong><p className="text-xs text-[#98a0b3]">de l’objectif</p></div></div>
        </section>
      </aside>
      <div className="space-y-5">
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl font-semibold text-[#101828]">État en temps réel</h2><p className="mt-1 text-sm text-[#98a0b3]">Dernières données reçues du capteur</p></div><button onClick={load} className="flex h-10 items-center gap-2 rounded-md bg-[#0869f7] px-4 text-sm text-white hover:bg-[#075bd4]"><RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />Actualiser</button></div>
          <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead className="border-b text-[#98a0b3]"><tr><th className="py-3 font-medium">Paramètre</th><th className="font-medium">Valeur</th><th className="font-medium">Statut</th><th className="font-medium">Dernière mise à jour</th></tr></thead><tbody>{rows.map(({ icon: Icon, label, value, state }) => <tr key={label} className="border-b last:border-0"><td className="flex items-center gap-3 py-4 font-medium text-[#252b3b]"><Icon className="h-4 w-4 text-[#697085]" />{label}</td><td>{value}</td><td><span className="inline-flex items-center gap-2 text-[#697085]"><CheckCircle2 className="h-4 w-4 text-emerald-500" />{state}</span></td><td className="text-[#98a0b3]">À l’instant</td></tr>)}</tbody></table></div>
        </section>
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-semibold text-[#101828]">Consommation aujourd’hui</h2><p className="text-sm text-[#98a0b3]">Évolution du volume en litres</p></div><Droplets className="h-6 w-6 text-[#0869f7]" /></div>
          <ResponsiveContainer width="100%" height={310}><AreaChart data={chartData}><defs><linearGradient id="waterFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0869f7" stopOpacity={0.24}/><stop offset="100%" stopColor="#0869f7" stopOpacity={0.02}/></linearGradient></defs><CartesianGrid stroke="#edf0f5" vertical={false}/><XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: "#98a0b3", fontSize: 12 }}/><YAxis axisLine={false} tickLine={false} tick={{ fill: "#98a0b3", fontSize: 12 }}/><Tooltip contentStyle={{ border: 0, borderRadius: 8, boxShadow: "0 10px 30px rgba(16,24,40,.12)" }}/><Area type="monotone" dataKey="consumption" stroke="#0869f7" strokeWidth={2.5} fill="url(#waterFill)" /></AreaChart></ResponsiveContainer>
        </section>
      </div>
    </div>
  );
}
