export type LoginType = {
  role: 'teacher' | 'admin',
  username: string,
  password: string
}

export type LoginResponse = {
  access_token: string
  refresh_token: string
  token_type: string
}