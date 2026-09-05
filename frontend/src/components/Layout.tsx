import { ReactNode, useEffect, useState } from "react";
import { Bell, Search } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

export default function Layout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    api.get(`/alertes/?statut=non_vu&abonne_id=${user.id}`).then(({ data }) => setNotificationCount(data.length)).catch(() => setNotificationCount(0));
  }, [user]);

  return (
    <div className="flex min-h-screen w-full bg-[#f6f7fb]">
      <AppSidebar />
      <div className="min-w-0 flex-1">
        <header className="flex h-20 items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="md:hidden" />
            <div><p className="text-xl font-semibold text-[#121826]">Bonjour {user?.prenom ?? "Ibrahim"}</p><p className="text-sm text-[#98a0b3]">Suivez votre consommation en temps réel</p></div>
          </div>
          <div className="flex items-center gap-3">
            <label className="hidden h-11 w-72 items-center gap-2 rounded-xl bg-white px-4 shadow-sm md:flex"><Search className="h-4 w-4 text-[#98a0b3]" /><input className="w-full bg-transparent text-sm outline-none placeholder:text-[#b7bdca]" placeholder="Rechercher" /></label>
            <button className="relative grid h-11 w-11 place-items-center rounded-xl bg-white text-[#60677a] shadow-sm" aria-label="Notifications"><Bell className="h-5 w-5" />{notificationCount > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />}</button>
          </div>
        </header>
        <main className="px-5 pb-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
