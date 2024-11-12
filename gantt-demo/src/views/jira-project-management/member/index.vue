<!--
成员模块代码思路分析：
1.成员模块分为三大部分，头部搜索组件(baseTitleSearch.vue), 左侧为成员列表(baseUserListTable.vue), 右侧为甘特图(baseGanttChart.vue)
2.头部搜索组件通过自定义事件传递到父组件，然后再传递给兄弟组件
-->

<template>
  <!-- 成员模块 -->
  <div id="member">
    <!-- 成员头部搜索 -->
    <baseTitleSearch
      v-if="tableTimeData.length > 0"
      :tableTimeDataAndroid="tableTimeData"
      :type="0"
      @search="searchData"
      @searchTime="changeDate"
      @clearData="clearData"
    ></baseTitleSearch>
    <div class="member_content member_box">
      <div class="member_content_left" ref="memberContentLeft">
        <!-- pId是项目id -->
        <baseUserListTable
            :tableData="tableData || []"
            :pId="0" 
            :tableTimeData="tableTimeData || []"
            :leftSearchData="leftSearchData"
            @update-expanded-rows="updateExpandedRows"
            @scrollData="scrollData"
        ></baseUserListTable>
      </div>
      <div class="member_content_right">
        <baseGanttChart
            v-if="tableTimeData.length > 0"
            ref="baseGanttChartRef"
            :tableTimeData="tableTimeData || []"
            :TimeDataModel="TimeDataModel"
            :tableData="tableData || []"
            :dataModel="dataModel"
            :tableScrollTop="tableScrollTop"
        ></baseGanttChart>
      </div>
    </div>
    <div class="page">
      <el-pagination
          v-model:current-page="formInline.pageIndex"
          v-model:page-size="formInline.pageSize"
          :page-sizes="[15, 20]"
          layout="total, sizes, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script setup>
import {ref, onMounted} from 'vue'
import dayjs from 'dayjs'
import baseUserListTable from  '../components/base-user-listTable.vue'
import baseGanttChart from '../components/base-gantt-chart.vue'
import baseTitleSearch from '../components/base-title-search.vue'
import { makeResizable } from '../resizer/draggable-resizer'
import { getProjectUserData, filterNonEmptyValues } from '@/utils/myUtilsFunc.js'

const baseGanttChartRef = ref(null)   // 实例化
const memberContentLeft = ref(null)   // 实例化
const tableData = ref([])             // 接口数据
const dataModel = ref({})             // 接口原始数据
const tableScrollTop = ref(0)         // 滚动条高度
const leftSearchData = ref({})        // 头部筛选条件
const total = ref(0)                  // 页码总数
const tableTimeData = ref([])         // 接口时间范围
const TimeDataModel = ref([])         // 接口时间范围原始数据
const formInline = ref({              // 接口数据
  pid: null,
  summary: '',
  lowerDisplayName: '',
  issuestatus: null,
  priority: null,
  issuetype: null
})

// 获取人员数据
const getProjectData = () => {
  const data = filterNonEmptyValues(formInline.value)
  const res = getProjectUserData(data)

  try {
      // 检查 res.data 是否存在以及是否包含 startDate 和 endDate
      if (res.data && res.data.startDate && res.data.endDate) {
        tableTimeData.value[0] = dayjs(res.data.startDate).format('YYYY-MM-DD')
        tableTimeData.value[1] = dayjs(res.data.endDate).format('YYYY-MM-DD')
        TimeDataModel.value[0] = dayjs(res.data.startDate).format('YYYY-MM-DD')
        TimeDataModel.value[1] = dayjs(res.data.endDate).format('YYYY-MM-DD')
      }

      // 检查 userPageResult 是否存在及其 items 属性
      if (res.data && res.data.userPageResult && Array.isArray(res.data.userPageResult.items)) {
        tableData.value = res.data.userPageResult.items;
        total.value = res.data.userPageResult.total;
      } else {
        tableData.value = [];
        total.value = 0;
      }

      // 设置数据模型
      dataModel.value = res.data || {};
  } catch (error) {
    console.error("错误:", error);
  }
}

// 日期选择
const changeDate = (val) => {
  console.log(val);
  
  if (val !== null) {
    tableTimeData.value = val
    
    dataModel.value.userPageResult.items.forEach(item => {
        item.children = []
    })
  } else {
    tableTimeData.value = []
    tableTimeData.value[0] = dataModel.value.startDate
    tableTimeData.value[1] = dataModel.value.endDate
  }

  syncExpandedRows()
}

// 重置
const clearData = (val) => {
  const pid = formInline.value.pid
  formInline.value = { ...val, pid }
  getProjectData()
  syncExpandedRows()
}

// 触发展开行
const updateExpandedRows = (expandedRows) => {
  if (baseGanttChartRef.value) {
    baseGanttChartRef.value.updateExpandedRows(expandedRows)
  }
}

// 触发滚动
const scrollData = (scrollTop) => {
  tableScrollTop.value = scrollTop
}

// 分页选择
const handleCurrentChange = (val) => {
  formInline.value.pageIndex = val
  getProjectData()
}
const handleSizeChange = (val) => {
  formInline.value.pageSize = val
  getProjectData()
}

// 标签/负责人 搜索
const searchLabel = () => {
  getProjectData()
}

// 筛选
const searchData = (data) => {
  const pid = formInline.value.pid
  formInline.value = { ...data, pid }
  leftSearchData.value = data
  getProjectData()
}

// 同步展开行状态
const syncExpandedRows = () => {
  if (baseGanttChartRef.value) {
    baseGanttChartRef.value.updateExpandedRows([])
  }
}

onMounted(() => {
  getProjectData()

  if (memberContentLeft.value) {
    makeResizable(memberContentLeft.value)
  }
})
</script>
<style scoped>
:deep(.el-table tr.highlight-row) {
  td {
    border: 2px solid red;
    &:nth-child(1) {
      border-bottom-left-radius: 10px;
      border-right: none;
    }
    &:nth-child(2) {
      border-bottom-right-radius: 10px;
      border-left: none;
    }
  }
}
#member {
  padding: 15px;
  background-color: #ffffff;
  .member_box {
    &:nth-child(2) {
      border-radius: 8px;
      background-color: #f5f7f8;
    }
  }
  .member_content {
    display: flex;
    padding: 14px 24px 14px 14px;
    .member_content_left {
      width: 350px;
      padding-bottom: 2px;
      transition: width 0.3s ease;
      overflow: hidden;
    }
    .member_content_right {
      width: 75%;
      background-color: #FFFFFF;
      margin-left: 10px;
      transition: width 0.3s ease;
      flex-grow: 1;
    }
  }
  .el-form--inline .el-form-item {
    margin-bottom: 0;
  }
}
.page {
  display:flex;
  justify-content:end;
  margin-top:15px;
  :deep(.btn-prev, .btn-next){
    background-color: #fff !important;
    border-radius: 4px;
    border: 1px solid #D4D6D9;
  }
  :deep(.btn-next){
    background-color: #fff !important;
    border-radius: 4px;
    border: 1px solid #D4D6D9;
  }
  :deep(.number){
    background-color: #fff !important;
    margin: 0 4px;
    border-radius: 4px;
    border: 1px solid #D4D6D9;
  }
  :deep(.is-active){
    border: 1px solid #2F51FF;
    color: #173E67;
  }
}
</style>