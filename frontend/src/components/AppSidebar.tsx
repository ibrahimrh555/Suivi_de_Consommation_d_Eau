
import { BarChart3, History, Settings, Bell } from "lucide-react";
import { NavLink, useLocation,Link } from "react-router-dom";

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
  { title: "Historique", url: "/history", icon: History },
  { title: "Alerts", url: "/alerts", icon: Bell },
  { title: "Paramètres", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-water-gradient text-white font-medium hover:bg-water-600" 
      : "hover:bg-water-100 text-water-700";

  return (
    <Sidebar className="border-r border-blue-200/50 bg-white/80 backdrop-blur">
      <SidebarContent className="p-4">
        <div className="mb-8 flex items-center space-x-3">
          <Link to="/">
            <div className="w-10 h-10  rounded-3xl flex items-center justify-center animate-pulse-glow ">
              <img
                src="/public/logo - Copie.png"
                alt="Mon image"
                className="w-10 h-10 object-contain "
              />
            </div>
          </Link>
          {!collapsed && (
            <div>
              <h2 className="text-xl font-bold bg-water-gradient bg-clip-text text-transparent">
                AquaWatch
              </h2>
              <p className="text-xs text-water-600">Monitoring System</p>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-water-600 font-medium">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`${getNavCls({ isActive: isActive(item.url) })} 
                        rounded-lg p-3 transition-all duration-200 flex items-center space-x-3
                        ${collapsed ? 'justify-center' : ''}`}
                    >
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  );
}
