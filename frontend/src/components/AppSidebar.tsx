import { BarChart3, Bell, History, LogOut, Settings } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

const items = [
  { title: "Tableau de bord", url: "/dashboard", icon: BarChart3 },
  { title: "Historique", url: "/history", icon: History },
  { title: "Alertes", url: "/alerts", icon: Bell },
  { title: "Paramètres", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const collapsed = state === "collapsed";

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <Sidebar className="border-0 bg-[#17181a] text-white">
      <SidebarContent className="bg-[#17181a] px-4 py-7">
        <div className="mb-12 flex items-center gap-3 px-2">
          <img src="/logo - Copie.png" alt="AquaWatch" className="h-10 w-10 object-contain" />
          {!collapsed && <span className="text-xl font-bold tracking-tight">AquaWatch</span>}
        </div>
        <SidebarMenu className="gap-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild>
                <NavLink to={item.url} className={({ isActive }) =>
                  `flex h-12 items-center gap-3 rounded-md px-4 text-sm transition-colors ${isActive ? "bg-[#0869f7] text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"} ${collapsed ? "justify-center" : ""}`
                }>
                  <item.icon className="h-5 w-5" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="bg-[#17181a] p-5">
        <button onClick={handleLogout} className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-white/10 text-sm text-zinc-200 transition hover:bg-white/15">
          <LogOut className="h-4 w-4" />{!collapsed && "Déconnexion"}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
