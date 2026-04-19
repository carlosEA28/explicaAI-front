import { Check, LoaderCircle, Mic, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import {
  getApiErrorMessage,
  getSummaryByExternalId,
  type SummaryStatus,
} from "@/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ProcessingStepStatus = "completed" | "active" | "pending" | "failed"

type ProcessingStep = {
  title: string
  description: string
  status: ProcessingStepStatus
}

const stepIconClassByStatus: Record<ProcessingStepStatus, string> = {
  completed:
    "border-[#0c7f66] bg-[radial-gradient(circle_at_30%_30%,#16ad8a_0%,#0c7f66_70%)] text-white",
  active:
    "border-[#3f4fff] bg-[radial-gradient(circle_at_30%_30%,#6570ff_0%,#3444fb_70%)] text-white",
  failed:
    "border-[#d94a4a] bg-[radial-gradient(circle_at_30%_30%,#ec7676_0%,#d94a4a_70%)] text-white",
  pending: "border-[#e2e4f2] bg-[#f8f9fd] text-[#c5c8d7]",
}

const stepTitleClassByStatus: Record<ProcessingStepStatus, string> = {
  completed: "text-[#2a2f40]",
  active: "text-[#2d3ad9]",
  failed: "text-[#b33838]",
  pending: "text-[#8e93a8]",
}

const stepDescriptionClassByStatus: Record<ProcessingStepStatus, string> = {
  completed: "text-[#7d8296]",
  active: "text-[#7982b5]",
  failed: "text-[#bc7171]",
  pending: "text-[#b2b6c8]",
}

const Loading = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const hasNavigatedRef = useRef(false)

  const externalId = searchParams.get("externalId")
  const [summaryStatus, setSummaryStatus] = useState<SummaryStatus | null>(
    externalId ? "RECEIVED_FILE" : null
  )
  const [requestErrorMessage, setRequestErrorMessage] = useState<string | null>(
    null
  )

  const processingSteps = useMemo<ProcessingStep[]>(() => {
    const hasExternalId = Boolean(externalId)

    const transcribingStatus: ProcessingStepStatus = (() => {
      if (!hasExternalId || !summaryStatus) {
        return "pending"
      }

      if (summaryStatus === "TRANSCRIBED_FAILED") {
        return "failed"
      }

      if (summaryStatus === "RECEIVED_FILE") {
        return "active"
      }

      return "completed"
    })()

    const summaryStepStatus: ProcessingStepStatus = (() => {
      if (!hasExternalId || !summaryStatus) {
        return "pending"
      }

      if (summaryStatus === "SUMMARIZED") {
        return "completed"
      }

      if (summaryStatus === "SUMMARIZED_FAILED") {
        return "failed"
      }

      if (summaryStatus === "TRANSCRIBED") {
        return "active"
      }

      return "pending"
    })()

    return [
      {
        title: "Enviando arquivo",
        description: hasExternalId
          ? "Arquivo recebido e adicionado na fila de processamento."
          : "Preparando seu arquivo para envio.",
        status: hasExternalId ? "completed" : "active",
      },
      {
        title: "Transcrevendo audio",
        description:
          transcribingStatus === "failed"
            ? "A transcricao falhou durante o processamento deste arquivo."
            : "Convertendo fala da reuniao em texto estruturado.",
        status: transcribingStatus,
      },
      {
        title: "Gerando resumo",
        description:
          summaryStepStatus === "failed"
            ? "A geracao do resumo falhou no servidor."
            : "Identificando topicos-chave e itens de acao.",
        status: summaryStepStatus,
      },
    ]
  }, [externalId, summaryStatus])

  useEffect(() => {
    if (!externalId) {
      return
    }

    let isCancelled = false

    const navigateToDashboard = () => {
      if (hasNavigatedRef.current) {
        return
      }

      hasNavigatedRef.current = true
      window.setTimeout(() => {
        navigate(`/?focus=${externalId}`)
      }, 900)
    }

    const fetchSummaryStatus = async () => {
      try {
        const summary = await getSummaryByExternalId(externalId)

        if (isCancelled) {
          return
        }

        setSummaryStatus(summary.status)
        setRequestErrorMessage(null)

        if (
          summary.status === "SUMMARIZED" ||
          summary.status === "SUMMARIZED_FAILED" ||
          summary.status === "TRANSCRIBED_FAILED"
        ) {
          navigateToDashboard()
        }
      } catch (error) {
        if (isCancelled) {
          return
        }

        setRequestErrorMessage(getApiErrorMessage(error))
      }
    }

    void fetchSummaryStatus()

    const intervalId = window.setInterval(() => {
      void fetchSummaryStatus()
    }, 2500)

    return () => {
      isCancelled = true
      window.clearInterval(intervalId)
    }
  }, [externalId, navigate])

  const handleCancel = () => {
    navigate("/record")
  }

  return (
    <main className="min-h-screen bg-[#1f2025] px-4 py-8 md:px-7 md:py-10">
      <div className="mx-auto w-full max-w-[78rem]">
        <p className="text-sm font-medium text-[#5e606a]">Processando - ExplicAI</p>

        <section className="mt-3 rounded-[2px] bg-[#f2f3f7] px-6 py-14 md:px-12 md:py-18">
          <div className="mx-auto flex w-full max-w-[28rem] flex-col items-center">
            <div className="text-center">
              <p className="text-lg leading-none font-semibold text-[#1530cf]">ExplicAI</p>
              <p className="mt-1 text-[0.58rem] font-medium tracking-[0.2em] text-[#9ea3bb] uppercase">
                CURADORIA DIGITAL
              </p>
            </div>

            <div className="relative mt-11 grid size-28 place-items-center">
              {[56, 74, 92].map((size, index) => (
                <span
                  key={size}
                  className="absolute rounded-full border border-[#d5d8ee] animate-pulse"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    animationDuration: "2.5s",
                    animationDelay: `${index * 220}ms`,
                  }}
                />
              ))}

              <span className="absolute top-4 right-3 size-1 rounded-full bg-[#53b4ff]" />
              <span className="absolute bottom-5 left-4 size-0.5 rounded-full bg-[#3f68ff]" />

              <div className="relative grid size-12 place-items-center rounded-full bg-gradient-to-r from-[#000EB6] to-[#2532D3] text-white shadow-[0_18px_30px_-18px_rgba(0,14,182,0.8)]">
                <Mic className="size-5" />
              </div>
            </div>

            <Card className="mt-12 w-full border border-[#e3e5f3] bg-[#edeef8] shadow-[0_28px_46px_-36px_rgba(30,37,75,0.75)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-[1.85rem] font-semibold text-[#242736]">
                  Organizando insights...
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {processingSteps.map((step) => (
                  <div key={step.title} className="flex items-start gap-3">
                    <span
                      className={cn(
                        "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border",
                        stepIconClassByStatus[step.status]
                      )}
                    >
                      {step.status === "completed" ? (
                        <Check className="size-2.5" />
                      ) : step.status === "failed" ? (
                        <X className="size-2.5" />
                      ) : step.status === "active" ? (
                        <LoaderCircle className="size-2.5 animate-spin" />
                      ) : null}
                    </span>

                    <div>
                      <p
                        className={cn(
                          "text-[0.8rem] leading-tight font-semibold",
                          stepTitleClassByStatus[step.status]
                        )}
                      >
                        {step.title}
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-[0.62rem]",
                          stepDescriptionClassByStatus[step.status]
                        )}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}

                {requestErrorMessage ? (
                  <p className="rounded-md border border-[#efc9c9] bg-[#fff5f5] px-3 py-2 text-[0.65rem] text-[#b03d3d]">
                    {requestErrorMessage}
                  </p>
                ) : null}

                <div className="pt-2 text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleCancel}
                    className="h-auto p-0 text-xs font-semibold text-[#3f4fe3] hover:text-[#2a3ad5]"
                  >
                    <X className="size-3.5" />
                    Cancelar processo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Loading
