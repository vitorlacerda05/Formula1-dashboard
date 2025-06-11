export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface ErrorResponse {
  success: false
  error: string
}
