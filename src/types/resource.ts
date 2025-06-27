// 资源类型定义
export const ResourceTypes = {
  DOCUMENT: 'document',
  COURSEWARE: 'courseware',
  EXERCISE: 'exercise',
  VIDEO: 'video',
  AUDIO: 'audio',
} as const

export type ResourceType = (typeof ResourceTypes)[keyof typeof ResourceTypes]

// 资源类型标签映射
export const ResourceTypeLabels: Record<ResourceType, string> = {
  [ResourceTypes.DOCUMENT]: '文档',
  [ResourceTypes.COURSEWARE]: '课件',
  [ResourceTypes.EXERCISE]: '习题',
  [ResourceTypes.VIDEO]: '视频',
  [ResourceTypes.AUDIO]: '音频',
}

// 资源类型标签类型映射
export const ResourceTypeTagTypes: Record<ResourceType, string> = {
  [ResourceTypes.DOCUMENT]: '',
  [ResourceTypes.COURSEWARE]: 'success',
  [ResourceTypes.EXERCISE]: 'warning',
  [ResourceTypes.VIDEO]: 'danger',
  [ResourceTypes.AUDIO]: 'info',
}

// 资源状态定义 (根据后端要求，使用数字0/1)
export const ResourceStatus = {
  DRAFT: 0, // 草稿
  PUBLISHED: 1, // 已发布
} as const

export type ResourceStatusType = (typeof ResourceStatus)[keyof typeof ResourceStatus]

// 资源状态标签映射
export const ResourceStatusLabels: Record<ResourceStatusType, string> = {
  [ResourceStatus.DRAFT]: '草稿',
  [ResourceStatus.PUBLISHED]: '已发布',
}

// 资源状态标签类型映射
export const ResourceStatusTagTypes: Record<ResourceStatusType, string> = {
  [ResourceStatus.DRAFT]: 'info',
  [ResourceStatus.PUBLISHED]: 'success',
}

// 学科定义
export const Subjects = {
  MATH: 'math',
  CHINESE: 'chinese',
  ENGLISH: 'english',
  PHYSICS: 'physics',
  CHEMISTRY: 'chemistry',
  BIOLOGY: 'biology',
  HISTORY: 'history',
  GEOGRAPHY: 'geography',
  POLITICS: 'politics',
  OTHER: 'other',
} as const

export type Subject = (typeof Subjects)[keyof typeof Subjects]

// 学科标签映射
export const SubjectLabels: Record<Subject, string> = {
  [Subjects.MATH]: '数学',
  [Subjects.CHINESE]: '语文',
  [Subjects.ENGLISH]: '英语',
  [Subjects.PHYSICS]: '物理',
  [Subjects.CHEMISTRY]: '化学',
  [Subjects.BIOLOGY]: '生物',
  [Subjects.HISTORY]: '历史',
  [Subjects.GEOGRAPHY]: '地理',
  [Subjects.POLITICS]: '政治',
  [Subjects.OTHER]: '其他',
}
