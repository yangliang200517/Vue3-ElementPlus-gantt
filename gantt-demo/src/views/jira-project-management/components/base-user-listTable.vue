<template>
  <div>
    <!-- 成员左侧表格组件 -->
    <div class="left_title">成员-任务</div>
    <el-table ref="tableRef"
              class="left_table"
              :data="tableData"
              height="calc(100vh - 370px)"
              :show-header="false"
              :row-class-name="rowClassName"
              @row-click="handleRowClick"
              row-key="id"
              :lazy="true"
              :load="load"
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
              @expand-change="onExpandChange"
    >
      <el-table-column type="expand">
        <template #default="{ row }">
          <div class="title_content_box" v-for="item in row.children" :key="item.id">
            <div><baseTag :issuestatus="item.issuestatus"></baseTag></div>
            <div class="content_icon">{{ item.priority === '1' ? '高' : (item.priority === '3' ? '中' : '底') }}</div>
            <div class="content_icon">{{ item.issuetype === '10001' ? '需求' : (item.issuetype === '10002' ? '任务' : '缺陷') }}</div>
            <div class="content_text" :title="item.summary">{{ item.summary }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="lowerDisplayName">
        <template #default="{ row }">
          <div class="table_header">
            <div class="table_header_user">
              <div class="table_header_avatar"><img :src="row.avatarUrl" alt=""></div>
              <div>{{ row.lowerDisplayName}}</div>
            </div>
            <div class="header_progress"><el-progress :percentage="(row.proportion * 100).toFixed(2)" color="linear-gradient(90deg, #89E297 0%, #5CD26F 100%);" /></div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup>
import {nextTick, ref, onMounted, watch} from 'vue'
import baseTag from './base-tag.vue'
import { getUserProjectList, filterNonEmptyValues } from '@/utils/myUtilsFunc.js'

const emit = defineEmits(['update-expanded-rows', 'scrollData'])
const props = defineProps({
  tableData: {
    type: Array,
    default: []
  },
  pId: {
    type: Number,
    default: 0
  },
  leftSearchData: {
    type: Object,
    default: {}
  },
  tableTimeData: {
    type: Array,
    default: []
  }
})

const tableRef = ref(null)
const expandedRows = ref([])
const expandedRowKeys = ref([])

// 行高亮
const rowClassName = ({ row }) => {
  return expandedRows.value.includes(row?.id) ? 'highlight-row' : '';
}

// 点击行
const handleRowClick = (row) => {
  updateExpandedRowKeys(row)
  nextTick(() => {
    tableRef.value.toggleRowExpansion(row)
  })
}

// 展开行
const onExpandChange = (row, expanded) => {
  const index = expandedRows.value.indexOf(row.id)

  if (expanded && row.children.length === 0) {
    load(row, null, () => {});
  }
  if (index === -1) {
    expandedRows.value.push(row.id)
  } else {
    expandedRows.value.splice(index, 1);
  }
  updateExpandedRowKeys(row)

  // 通知父组件更新展开状态
  emit('update-expanded-rows', expandedRowKeys.value)
}

// 更新展开行键
const updateExpandedRowKeys = (row) => {
  const index = expandedRowKeys.value.indexOf(row.id)
  const existingKey = expandedRowKeys.value[index]
  if (existingKey !== row.id) {
    expandedRowKeys.value.splice(index, 1)
    expandedRowKeys.value.push(row.id)
  }
}

// 加载子节点 - 懒加载
const load = async (row, treeNode, resolve) => {
  let datas = filterNonEmptyValues(props.leftSearchData)
  const res = await getUserProjectList(datas)
    const data = res.data
    row.children = [...data]; // 更新 row.children
    resolve(data)
}


// 滚动事件处理函数
const handleScroll = (event) => {
  const scrollTop = event.target.scrollTop
  emit('scrollData', scrollTop)
}

// 关闭展开行
const colsedExpand = () => {
  // 暂存展开行的 ID
  const currentExpandedRows = [...expandedRows.value]

  // 收起所有已展开的行
  currentExpandedRows.forEach(rowId => {
    const row = tableRef.value.store.states.expandRows.value.find(r => r.id === rowId);
    if (row) {
      tableRef.value.toggleRowExpansion(row, false);
    }
  });

  expandedRows.value = []
  expandedRowKeys.value = []
  emit('update-expanded-rows', [])
}

// 监听搜索条件变化, 如果不监听就会有一个bug(当点击展开行后再筛选条件,展开行会继续显示,但是没有数据),所以要监听搜索数据变化关闭所有行的展开
watch(() => props.leftSearchData, (newVal, oldVal) => {
  colsedExpand()
}, { deep: true })

watch(() => props.tableTimeData, (newVal,oldVal) => {
  colsedExpand()
}, { deep: true })


onMounted(() => {
  nextTick(() => {
    const bodyWrapper = tableRef.value?.$el.querySelector('.el-scrollbar__wrap');
    if (bodyWrapper) {
      bodyWrapper.addEventListener('scroll', handleScroll);
    }
  })
})
</script>
<style scoped>
.left_title {
  background-color: #ffffff;
  padding: 15px;
  margin-bottom: 10px;
}
:deep(.el-table--fit) {
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  overflow: hidden;
}
.left_table {
  --el-table-bg-color: transparent;
}
:deep(.el-table) {
  --el-table-row-hover-bg-color: none;
  .el-table__inner-wrapper {
    &:before {
      width: auto;
    }
  }
  tbody {
    display: flex;
    flex-direction: column;
    width: inherit;
    background-color: #F3F7FD;
    tr {
      position: relative;
      margin-right: 10px;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      filter: drop-shadow(0px 2px 6px rgba(183, 183, 183, 0.25));
      &:last-child::after {
        content: none;
      }
    }
    tr:where(:not(.el-table__row)) {
      td {
        display: flex;
        flex-direction: column;
        gap: 30px;
        flex: 1;
        padding: 15px 30px 15px 40px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
      }
    }
    tr.el-table__row {
      background-color: #ffffff;
      margin-top: 10px;
      &:nth-child(1) {
        margin-top: 0;
      }
      td {
        border: 1px solid #CEDDEC;
        padding: 10px 0;
        &:nth-child(1) {
          border-bottom-left-radius: 4px;
          border-top-left-radius: 4px;
          border-right: none;
        }
        &:nth-child(2) {
          width: 100%;
          border-bottom-right-radius: 4px;
          border-top-right-radius: 4px;
          border-left: none;
          .cell {
            padding: 0 12px 0 0 !important;
          }
        }
      }
    }
    tr.highlight-row {
      td {
        border: 1px solid #89C6FF;
        box-shadow: 0px 0px 8px rgba(223, 225, 229, 0.80);
      }
    }
  }
}
:deep(.el-table--enable-row-transition .el-table__body) {
  background-color: #F3F7FD;
}
:deep(.el-table--enable-row-transition .el-table__body td.el-table__cell) {
  .title_content_box {
    display: flex;
    max-width: 100%;
    color: #173E67;
    align-items: center;
    gap: 5px;
    .content_icon {
      display: flex;
      align-items: center;
    }
    .content_text {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}

.table_header {
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  white-space: nowrap;
  gap: 10px;
  .table_header_user {
    display: flex;
    color: #173E67;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .header_progress ::v-deep {
    display: flex;
    align-items: center;
    width: 140px;
     .el-progress {
      width: 100% !important;
      .el-progress-bar {
        .el-progress-bar__outer {
          height: 10px !important;
          background-color: #E4ECE4;
          .el-progress-bar__inner {
            background-image: linear-gradient(to right, #89E297, #5CD26F);
          }
        }
      }
    }
  }
  .table_header_avatar {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #0F2566;
  }
}

:deep(.el-table__placeholder) {
  display: none;
}
</style>