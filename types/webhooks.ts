export interface TebexLoginWebhookQuery {
  ign: string
  ip: string
  country: string
}

export interface TebexLoginSuccessResponse {
  verified: true
  message?: string
}

export interface TebexLoginErrorResponse {
  verified: false
  error: string
}

export type TebexLoginResponse = TebexLoginSuccessResponse | TebexLoginErrorResponse

