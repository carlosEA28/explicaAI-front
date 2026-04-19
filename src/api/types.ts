export type SummaryStatus =
  | "RECEIVED_FILE"
  | "TRANSCRIBED"
  | "TRANSCRIBED_FAILED"
  | "SUMMARIZED"
  | "SUMMARIZED_FAILED"

export type SummarySimpleOutput = {
  externalId: string
  status: SummaryStatus
  createdAt: string
  updatedAt: string
  progress: number
  title?: string
  description?: string
}

export type SummaryDetailedOutput = SummarySimpleOutput & {
  briefResume?: string
  mediumResume?: string
  fullText?: string
}

export type SummaryListOutput = {
  data: SummarySimpleOutput[]
}

export type ApiErrorResponse = {
  message?: string
}
