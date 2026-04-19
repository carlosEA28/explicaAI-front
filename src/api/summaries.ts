import { apiClient } from "./client"
import type {
  SummaryDetailedOutput,
  SummaryListOutput,
  SummarySimpleOutput,
} from "./types"

export const uploadSummaryFile = async (
  file: File
): Promise<SummarySimpleOutput> => {
  const formData = new FormData()
  formData.append("file", file)

  const { data } = await apiClient.post<SummarySimpleOutput>("/upload", formData)

  return data
}

export const getSummaries = async (): Promise<SummaryListOutput> => {
  const { data } = await apiClient.get<{
    data: SummarySimpleOutput[] | null
  }>("/summaries")

  return {
    data: Array.isArray(data?.data) ? data.data : [],
  }
}

export const getSummaryByExternalId = async (
  externalId: string
): Promise<SummaryDetailedOutput> => {
  const { data } = await apiClient.get<SummaryDetailedOutput>(
    `/summaries/${externalId}`
  )
  return data
}
