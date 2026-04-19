import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar"
import { cn } from "../lib/utils"
import { History, LayoutDashboard, Mic, Plus, Settings } from "lucide-react"
import { Link } from "react-router-dom"

const navigationItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    label: "Record",
    icon: Mic,
    href: "/record",
  },
  {
    label: "History",
    icon: History,
  },
  {
    label: "Settings",
    icon: Settings,
  },
]

type AppSidebarProps = {
  activeItem?: (typeof navigationItems)[number]["label"]
}

export function AppSidebar({ activeItem = "Dashboard" }: AppSidebarProps) {
  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r border-[#e8eaf3] [&_[data-sidebar=sidebar]]:bg-[#f4f5fb]"
    >
      <SidebarHeader className="gap-5 px-5 pt-7 pb-2">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-full bg-[#2f44d4] text-sm font-semibold text-white shadow-[0_14px_30px_-18px_rgba(47,68,212,0.85)]">
            E
          </div>

          <div className="space-y-0.5">
            <p className="text-[1.6rem] leading-none font-semibold tracking-[-0.02em] text-[#1432c8]">
              ExplicAI
            </p>
            <p className="text-[0.67rem] font-medium tracking-[0.16em] text-[#8d90a0] uppercase">
              The Digital Curator
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled
          className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#000EB6] to-[#2532D3] text-sm font-medium text-white shadow-[0_20px_36px_-24px_rgba(0,14,182,0.75)] disabled:opacity-100"
        >
          <Plus className="size-4" />
          <span>New Meeting</span>
        </button>
      </SidebarHeader>

      <SidebarContent className="px-3 pt-4">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.label} className="relative">
                  <SidebarMenuButton
                    asChild={Boolean(item.href)}
                    isActive={item.label === activeItem}
                    className={cn(
                      "h-11 rounded-xl px-3 text-base font-medium",
                      item.label === activeItem
                        ? "bg-white text-[#1b3ff2] shadow-[0_22px_24px_-28px_rgba(17,29,84,0.95)]"
                        : "text-[#666d80] hover:bg-white/70 hover:text-[#2f3545]"
                    )}
                  >
                    {item.href ? (
                      <Link to={item.href}>
                        <item.icon className="size-4" />
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <>
                        <item.icon className="size-4" />
                        <span>{item.label}</span>
                      </>
                    )}
                  </SidebarMenuButton>

                  {item.label === activeItem ? (
                    <span className="absolute top-1/2 -right-3 h-8 w-1 -translate-y-1/2 rounded-full bg-[#2348f5]" />
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-5 pb-7">
        <div className="flex items-center gap-3 rounded-xl bg-white/55 px-3 py-2 shadow-[0_24px_30px_-28px_rgba(25,33,68,0.9)]">
          <div className="grid size-8 place-items-center rounded-full bg-[#33495a] text-[0.625rem] font-semibold text-white">
            JD
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium text-[#1f2635]">John Doe</p>
            <p className="text-xs text-[#969cad]">Pro Plan</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
