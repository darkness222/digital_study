import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 可以在这里添加token等认证信息
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    // 根据后端接口规范调整，这里假设后端返回的数据格式为 { code, data, message }
    if (res.code !== 200) {
      ElMessage({
        message: res.message || '请求失败',
        type: 'error',
        duration: 5 * 1000,
      })
      return Promise.reject(new Error(res.message || '请求失败'))
    } else {
      return res.data
    }
  },
  (error) => {
    console.error('响应错误:', error)
    ElMessage({
      message: error.message || '请求失败',
      type: 'error',
      duration: 5 * 1000,
    })
    return Promise.reject(error)
  },
)

// 定义通用的请求参数类型
export type RequestParams = Record<string, string | number | boolean | undefined | null>

// 封装GET请求
export function get<T>(url: string, params?: RequestParams): Promise<T> {
  return service.get(url, { params })
}

// 封装POST请求
export function post<T>(url: string, data?: Record<string, unknown>): Promise<T> {
  return service.post(url, data)
}

// 封装PUT请求
export function put<T>(url: string, data?: Record<string, unknown>): Promise<T> {
  return service.put(url, data)
}

// 封装DELETE请求
export function del<T>(url: string, params?: RequestParams): Promise<T> {
  return service.delete(url, { params })
}

export default service
