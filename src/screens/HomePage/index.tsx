import { useEffect, useMemo, useState, type CSSProperties } from "react"
import { Bell, Clock3, LucideFile, Sparkles, TrendingUp } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"

import { getApiErrorMessage, getSummaries, type SummarySimpleOutput } from "@/api"
import { AppSidebar } from "@/components/app-sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const formatRelativeDate = (isoDate: string): string => {
  const date = new Date(isoDate)
  const now = new Date()
  const oneDay = 24 * 60 * 60 * 1000
  const diffInDays = Math.floor(
    (new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() -
      new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()) /
      oneDay
  )

  if (diffInDays <= 0) {
    return "Today"
  }

  if (diffInDays === 1) {
    return "Yesterday"
  }

  return `${diffInDays} days ago`
}

const formatClockTime = (isoDate: string): string => {
  const date = new Date(isoDate)
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })
}

const metricCardGradient =
  "bg-[linear-gradient(140deg,#3444f8_0%,#4d31db_40%,#6544ff_100%)]"

const HomePage = () => {
  const [searchParams] = useSearchParams()
  const [summaries, setSummaries] = useState<SummarySimpleOutput[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const focusedSummaryId = searchParams.get("focus")

  useEffect(() => {
    const loadSummaries = async () => {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const response = await getSummaries()
        setSummaries(response.data)
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error))
      } finally {
        setIsLoading(false)
      }
    }

    void loadSummaries()
  }, [])

  const latestSummaries = useMemo(
    () =>
      [...summaries]
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .slice(0, 3),
    [summaries]
  )

  const processedSummaries = summaries.filter(
    (item) => item.status === "SUMMARIZED"
  )

  const metricGrowth = Math.max(
    0,
    Math.round((processedSummaries.length / Math.max(summaries.length, 1)) * 100)
  )

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "13.75rem",
          "--sidebar-width-mobile": "16rem",
        } as CSSProperties
      }
    >
      <AppSidebar activeItem="Dashboard" />

      <SidebarInset className="bg-[#fbfcff] p-6 md:p-10 lg:p-12">
        <div className="mb-6 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <span className="text-sm font-medium text-muted-foreground">Menu</span>
          </div>
          <button
            type="button"
            className="grid size-8 place-items-center rounded-full border border-[#dde0ea] bg-white text-[#596080]"
          >
            <Bell className="size-4" />
          </button>
        </div>

        <div className="hidden items-center justify-end gap-3 pb-4 md:flex">
          <button
            type="button"
            className="grid size-8 place-items-center rounded-full border border-[#dde0ea] bg-white text-[#596080]"
          >
            <Bell className="size-4" />
          </button>
          <div className="grid size-8 place-items-center rounded-full bg-[linear-gradient(145deg,#2033c4,#3051ea)] text-[0.62rem] font-semibold text-white">
            JD
          </div>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl leading-tight font-bold tracking-[-0.02em] text-[#1b1b24]">
            Recent Insights
          </h1>
          <p className="mt-1 text-base text-[#62667a]">
            Your latest curated AI meeting summaries.
          </p>
        </header>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-60 rounded-2xl bg-[#eceef7]" />
            <Skeleton className="h-60 rounded-2xl bg-[#eceef7]" />
            <Skeleton className="h-60 rounded-2xl bg-[#eceef7]" />
          </div>
        ) : errorMessage ? (
          <Card className="border border-[#f0d5d5] bg-[#fff7f7] shadow-none">
            <CardContent className="py-10 text-center">
              <p className="text-sm font-medium text-[#a43e3e]">{errorMessage}</p>
            </CardContent>
          </Card>
        ) : latestSummaries.length === 0 ? (
          <div className="mx-auto flex h-[56vh] max-w-xl flex-col items-center justify-center gap-3 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-[#eae7ee]">
              <LucideFile width={24} height={32} className="text-[#6f758f]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1B1B20]">No summaries yet</h2>
            <p className="text-base text-[#454655]">
              Your recent meetings will appear here after processing.
            </p>
            <Button
              asChild
              className="mt-2 h-12 rounded-full bg-gradient-to-r from-[#000EB6] to-[#2532D3] px-8 text-white shadow-[0_20px_36px_-24px_rgba(0,14,182,0.75)] hover:from-[#000EB6] hover:to-[#2532D3]"
            >
              <Link to="/record">New Recording</Link>
            </Button>
          </div>
        ) : (
          <section className="grid gap-4 lg:grid-cols-[1.25fr_1.1fr_0.75fr]">
            {latestSummaries.map((summary, index) => {
              const cardTitle = summary.title ?? "Untitled Summary"
              const cardDescription =
                summary.description ?? "No description generated yet."

              if (index === 1) {
                return (
                  <Card
                    key={summary.externalId}
                    className={`${metricCardGradient} border-0 text-white shadow-[0_28px_46px_-30px_rgba(56,58,208,0.8)]`}
                  >
                    <CardContent className="flex h-full min-h-[16rem] flex-col justify-between py-7">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-white/20 text-[0.58rem] tracking-[0.08em] text-white uppercase">
                          AI Efficiency
                        </Badge>
                        <Sparkles className="size-4 opacity-90" />
                      </div>

                      <div>
                        <p className="text-5xl leading-none font-semibold tracking-[-0.03em]">
                          {metricGrowth}%
                        </p>
                        <p className="mt-2 text-sm text-white/85">
                          of your summaries are fully processed.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <TrendingUp className="size-3.5" />
                        <span className="text-[0.62rem] font-medium tracking-[0.08em] text-white/85 uppercase">
                          +{Math.max(1, Math.round(metricGrowth / 10))}% from last sync
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )
              }

              const isFocused = focusedSummaryId === summary.externalId

              return (
                <Card
                  key={summary.externalId}
                  className={`border border-[#eceef6] bg-[#f8f8fd] shadow-none transition ${
                    isFocused
                      ? "ring-2 ring-[#3345f8]/35"
                      : "hover:-translate-y-0.5 hover:shadow-[0_24px_40px_-32px_rgba(21,31,80,0.45)]"
                  }`}
                >
                  <CardContent className="flex h-full min-h-[16rem] flex-col justify-between py-6">
                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className="border-[#d7dbec] bg-[#eff1fb] text-[0.56rem] text-[#5560a2] uppercase"
                        >
                          {summary.status.replaceAll("_", " ")}
                        </Badge>
                        <span className="inline-flex items-center gap-1 text-[0.62rem] font-medium tracking-[0.05em] text-[#8a90a7] uppercase">
                          <Clock3 className="size-3" />
                          {formatRelativeDate(summary.updatedAt)}, {formatClockTime(summary.updatedAt)}
                        </span>
                      </div>

                      <h2 className="text-[1.6rem] leading-[1.15] font-semibold tracking-[-0.02em] text-[#202330]">
                        {cardTitle}
                      </h2>
                      <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-[#666b80]">
                        {cardDescription}
                      </p>
                    </div>

                    <Button
                      variant="link"
                      className="mt-6 h-auto w-fit p-0 text-xs font-semibold text-[#2f43df] hover:text-[#2335c8]"
                    >
                      Review Transcript &gt;
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </section>
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}

export default HomePage
