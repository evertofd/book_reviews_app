export interface User {
  id: string
  email: string
  alias: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  alias: string
}

export interface AuthResponse {
  token: string
  user: User
}