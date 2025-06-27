import { get, post, put, del, type RequestParams } from './http'

// 资源数据接口
export interface Resource {
  id?: number | string
  name: string
  type: string // 可以前端写死，不需要传到后端
  description: string
  content: string
  size: number
  createTime?: string
  updateTime?: string
  status: number // 使用数字 0/1 表示状态，由前端定义含义
  subject?: string // 学科
  // 以下字段不需要传递到后端
  // grade?: string
  // tags?: string[]
  // creatorId?: string
  // viewCount?: number // 浏览次数
  // downloadCount?: number // 下载次数
  // favoriteCount?: number // 收藏量
}

// 资源查询参数
export interface ResourceQuery {
  name?: string
  type?: string
  subject?: string
  startDate?: string
  endDate?: string
  status?: number
  pageNum?: number
  pageSize?: number
  [key: string]: string | number | boolean | undefined | null // 添加索引签名以兼容RequestParams
}

/**
 * 获取资源列表
 * @param params 查询参数
 */
export function getResourceList(params: ResourceQuery) {
  return get<{ list: Resource[]; total: number }>('/resources', params as unknown as RequestParams)
}

/**
 * 根据学科查询资源
 * @param subject 学科
 * @param params 其他查询参数
 */
export function getResourcesBySubject(subject: string, params?: Omit<ResourceQuery, 'subject'>) {
  return get<{ list: Resource[]; total: number }>(
    '/resources/subject/' + subject,
    params as unknown as RequestParams,
  )
}

/**
 * 获取资源详情
 * @param id 资源ID
 */
export function getResourceDetail(id: string | number) {
  return get<Resource>(`/resources/${id}`)
}

/**
 * 创建资源
 * @param data 资源数据
 */
export function createResource(data: Omit<Resource, 'id' | 'createTime' | 'updateTime'>) {
  return post<Resource>('/resources', data)
}

/**
 * 更新资源
 * @param id 资源ID
 * @param data 资源数据
 */
export function updateResource(id: string | number, data: Partial<Resource>) {
  return put<Resource>(`/resources/${id}`, data)
}

/**
 * 删除资源
 * @param id 资源ID
 */
export function deleteResource(id: string | number) {
  return del<void>(`/resources/${id}`)
}

/**
 * 上传资源文件
 * @param formData 表单数据
 */
export function uploadResourceFile(formData: FormData) {
  return post<{ url: string; size: number }>(
    '/upload/resource',
    formData as unknown as Record<string, unknown>,
  )
}
