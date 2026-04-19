import {
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from "react"
import { CloudUpload, Mic } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { getApiErrorMessage, uploadSummaryFile } from "@/api"
import { AppSidebar } from "../../components/app-sidebar"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar"

const acceptedExtensions = [
  ".mp3",
  ".mp4",
  ".mpeg",
  ".mpga",
  ".m4a",
  ".wav",
  ".webm",
]

const Record = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(
    null
  )

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setSelectedFileName(file.name)
    setUploadErrorMessage(null)
    setIsUploading(true)

    try {
      const uploadedSummary = await uploadSummaryFile(file)
      navigate(`/loading?externalId=${uploadedSummary.externalId}`)
    } catch (error) {
      setUploadErrorMessage(getApiErrorMessage(error))
      setSelectedFileName(null)
    } finally {
      event.target.value = ""
      setIsUploading(false)
    }
  }

  const handleBrowseClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "13.75rem",
          "--sidebar-width-mobile": "16rem",
        } as CSSProperties
      }
    >
      <AppSidebar activeItem="Gravar" />

      <SidebarInset className="relative overflow-hidden bg-[#f8f8fc] p-6 md:p-12 lg:p-16">
        <div className="mb-6 flex items-center gap-3 md:hidden">
          <SidebarTrigger />
          <span className="text-sm font-medium text-muted-foreground">Menu</span>
        </div>

        <div className="pointer-events-none absolute top-[36%] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,146,255,0.2)_0%,rgba(139,146,255,0)_72%)]" />

        <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center">
          <header className="mb-10 max-w-xl text-center md:mb-14">
            <h1 className="text-4xl leading-tight font-semibold tracking-[-0.03em] text-[#1f1f28] md:text-5xl">
              Capturar Inteligencia
            </h1>
            <p className="mt-3 text-base text-[#62667b]">
              Envie uma gravacao existente ou inicie uma sessao ao vivo para o
              ExplicAI analisar e organizar.
            </p>
          </header>

          <section className="grid w-full gap-6 md:grid-cols-2">
            <Card className="border border-dashed border-[#d7d9e4] bg-white/75 shadow-none">
              <CardContent className="flex min-h-[20rem] flex-col items-center justify-center px-8 py-10 text-center">
                <div className="grid size-16 place-items-center rounded-full bg-[#eceef6] text-[#3d43a5]">
                  <CloudUpload className="size-6" />
                </div>

                <h2 className="mt-6 text-3xl leading-none font-semibold text-[#24252f]">
                  Enviar arquivo
                </h2>
                <p className="mt-3 max-w-[20rem] text-sm text-[#7a7f92]">
                  Arraste e solte seu arquivo de audio ou video aqui, ou clique
                  para selecionar.
                </p>

                <input
                  ref={fileInputRef}
                  id="record-file-upload"
                  type="file"
                  accept={acceptedExtensions.join(",")}
                  className="hidden"
                  onChange={handleFileChange}
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBrowseClick}
                  disabled={isUploading}
                  className="mt-5 h-9 rounded-full border-[#d5d9e7] bg-white px-5 text-xs font-medium text-[#51576e] hover:bg-[#f6f8ff]"
                >
                  {isUploading ? "Enviando..." : "Selecionar..."}
                </Button>

                {selectedFileName ? (
                  <p
                    className="mt-3 max-w-[20rem] truncate text-xs font-medium text-[#5d637c]"
                    title={selectedFileName}
                  >
                    {selectedFileName}
                  </p>
                ) : null}

                {uploadErrorMessage ? (
                  <p className="mt-2 max-w-[20rem] text-xs text-[#d04545]">
                    {uploadErrorMessage}
                  </p>
                ) : null}

                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {acceptedExtensions.map((extension) => (
                    <Badge
                      key={extension}
                      variant="outline"
                      className="rounded-full border-[#d6daea] bg-[#f7f8fd] px-3 text-[0.62rem] font-medium tracking-[0.07em] text-[#9ca2ba] uppercase"
                    >
                      {extension.replace(".", "")}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#ececf4] bg-white/75 shadow-none">
              <CardContent className="flex min-h-[20rem] flex-col items-center justify-center px-8 py-10 text-center">
                <div className="grid size-20 place-items-center rounded-full bg-gradient-to-r from-[#000EB6] to-[#2532D3] text-white shadow-[0_16px_32px_-14px_rgba(0,14,182,0.8)]">
                  <Mic className="size-8" />
                </div>

                <h2 className="mt-6 text-3xl leading-none font-semibold text-[#24252f]">
                  Gravacao ao vivo
                </h2>
                <p className="mt-3 max-w-[18rem] text-sm text-[#7a7f92]">
                  Inicie uma sessao de transcricao ao vivo. O ExplicAI vai
                  capturar e organizar em tempo real.
                </p>

                <Button
                  type="button"
                  onClick={() => navigate("/record/live")}
                  className="mt-6 h-10 rounded-full bg-gradient-to-r from-[#000EB6] to-[#2532D3] px-6 text-xs font-semibold text-white shadow-[0_18px_30px_-18px_rgba(0,14,182,0.8)] hover:from-[#000EB6] hover:to-[#2532D3]"
                >
                  Iniciar sessao ao vivo
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Record
