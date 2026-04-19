import axios, { AxiosError } from "axios"

import type { ApiErrorResponse } from "./types"

const DEFAULT_API_BASE_URL = "http://localhost:8080"

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  timeout: 120000,
})

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>
    return (
      axiosError.response?.data?.message ?? axiosError.message ?? "Request failed"
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Unknown error"
}
