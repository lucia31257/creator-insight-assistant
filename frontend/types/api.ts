/**
 * API 类型定义
 */

export interface GenerateRequest {
  topic: string
}

export interface Script {
  title: string
  hook: string
  narrative: string[]
  cta: string
}

export interface Trends {
  hashtags: string[]
  music_styles: string[]
}

export interface GenerateResponse {
  topic: string
  scripts: Script[]
  trends: Trends
}

export type ErrorCode = 'BAD_REQUEST' | 'LLM_TIMEOUT' | 'LLM_BAD_OUTPUT' | 'INTERNAL_ERROR'

export interface ErrorDetail {
  code: ErrorCode
  message: string
}

export interface ErrorResponse {
  error: ErrorDetail
}

export type UIState = 'idle' | 'loading' | 'success' | 'error'
