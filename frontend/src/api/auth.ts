import request from './index'

// 登录请求参数
export interface LoginRequest {
  username: string
  password: string
}

// 注册请求参数
export interface RegisterRequest {
  username: string
  password: string
  email: string
}

// 认证响应
export interface AuthResponse {
  token: string
  userId: number
  username: string
  email: string
}

// 用户注册
export const register = (data: RegisterRequest) => {
  return request.post<any, AuthResponse>('/auth/register', data)
}

// 用户登录
export const login = (data: LoginRequest) => {
  return request.post<any, AuthResponse>('/auth/login', data)
}
