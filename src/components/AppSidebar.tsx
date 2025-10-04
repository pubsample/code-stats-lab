import { Home, Trophy, Target, BarChart3 } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Overview", url: "#overview", icon: Home },
  { title: "Rating Progress", url: "#rating", icon: BarChart3 },
  { title: "Contest History", url: "#contests", icon: Trophy },
  { title: "Problem Stats", url: "#problems", icon: Target },
];

export function AppSidebar() {
  const { open } = useSidebar();

  const scrollToSection = (url: string) => {
    const id = url.substring(1);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => scrollToSection(item.url)}
                    tooltip={item.title}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    {open && <span>{item.title}</span>}
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
