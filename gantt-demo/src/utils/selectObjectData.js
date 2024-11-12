// 项目管理 - jiar项目管理 - 筛选条件-任务状态
export const issuestatusTypeData = [
  {
      label: '暂搁置',
      value: 1,
  },
  {
      label: '处理中',
      value: 3,
  },
  {
      label: '已完成',
      value: 10001,
  },
  {
      label: '代办',
      value: 10000,
  }
]

// 项目管理 - jiar项目管理 - 筛选条件-优先级
export const priorityTypeData = [
  {
      label: '高',
      value: 1,
  },
  {
      label: '中等',
      value: 3,
  },
  {
      label: '底',
      value: 5,
  }
]

// 项目管理 - jiar项目管理 - 筛选条件-任务类型
export const issuetypeTypeData = [
  {
      label: '需求',
      value: 10001,
      icon: 'demand',
  },
  {
      label: '任务',
      value: 10002,
      icon: 'task',
  },
  {
      label: '缺陷',
      value: 10004,
      icon: 'defect',
  },
]

// 项目管理 - jiar项目管理 - 筛选条件-延期类型
export const postponeTypeData = [
  {
      label: '未延期',
      value: 0,
      // isActive: false
  },
  {
      label: '延期开始',
      value: 1,
      // isActive: false
  },
  {
      label: '延期结束',
      value: 2,
  },
]
