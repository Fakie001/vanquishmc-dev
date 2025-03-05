export interface ApiError {
  type: string
  title: string
  status: number
  detail: string
  instance?: string
}

export class TebexError extends Error {
  type: string
  status: number
  instance?: string

  constructor(error: ApiError) {
    super(error.title)
    this.name = "TebexError"
    this.type = error.type
    this.status = error.status
    this.message = error.detail
    this.instance = error.instance
  }

  static async fromResponse(response: Response): Promise<TebexError> {
    try {
      const error = await response.json()
      return new TebexError(error)
    } catch {
      return new TebexError({
        type: "Unknown Error",
        title: "An unknown error occurred",
        status: response.status,
        detail: response.statusText,
      })
    }
  }
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw await TebexError.fromResponse(response)
  }

  return response.json()
}

