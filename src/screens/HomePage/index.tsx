import type { CSSProperties } from "react"
import { AppSidebar } from "../../components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar"
import {LucideFile} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

const HomePage = () => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "13.75rem",
          "--sidebar-width-mobile": "16rem",
        } as CSSProperties
      }
    >
      <AppSidebar />

      <SidebarInset className="bg-[#fbfcff] p-16 " >
        <div className="mb-6 flex items-center gap-3 md:hidden">
          <SidebarTrigger />
          <span className="text-sm font-medium text-muted-foreground">Menu</span>
        </div>

        <h1 className="text-4xl font-bold text-[#1B1B20]">Recent Insights</h1>
        <h3 className="text-muted-foreground text-lg text-[#454655]">Your last curated AI meeting summaries</h3>

      <div className="mx-auto w-4xl h-165 flex items-center justify-center flex-col gap-3" >
        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-[#EAE7EE]">
          <LucideFile width={28} height={38} />
        </div>

        <h1 className="text-2xl font-bold text-[#1B1B20]">Nenhum resumo ainda</h1>
        <p className="text-lg text-[#454655]">Suas reuniões recentes aparecerão aqui após
          serem processadas.</p>

        <Button className="h-12 w-46.25 rounded-full bg-gradient-to-r cursor-pointer from-[#000EB6] to-[#2532D3] p-3 text-white shadow-[0_20px_36px_-24px_rgba(0,14,182,0.75)] hover:from-[#000EB6] hover:to-[#2532D3]">New Recording</Button>
      </div>
      </SidebarInset>

    </SidebarProvider>
  )
}

export default HomePage
