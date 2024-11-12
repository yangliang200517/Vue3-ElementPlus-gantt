<template>
  <div>
    <!-- 成员右侧甘特图组件 -->
    <el-table
        :data="data"
        ref="tableRef"
        class="my-table"
        height="calc(100vh - 310px)"
        border
        row-key="id"
        :lazy="true"
        :header-cell-class-name="headerStyle"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
      <el-table-column
          v-for="(time, timeIndex) in formattedData"
          :key="timeIndex"
          :label="time.date"
          class-name="dayClass"
          :width="labelWidth"
          :resizable="false"
          align="center">
        <template #header>
          <div>{{ time.dayOfWeek }}</div>
          <div>{{ formatDateYYYYMMDD(time.date, 'MM-DD') }}</div>
        </template>
        <template #default="{ row }">
          <div v-for="(workLogNumsItems, index) in row?.workLogNums" :key="index">
            <baseGanttMums
                :time="time.date"
                :workLogNumsItems="workLogNumsItems"
                :rowId="row.id"
            />
          </div>
          <keep-alive>
            <baseGanttBox
                :time="time.date"
                :row="row"
                :labelWidth="labelWidth"
                :minDate="formattedData[0].date"
                :maxDate="formattedData[formattedData.length - 1].date"
            />
          </keep-alive>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup>
import {computed, nextTick, onMounted, ref, watch, onBeforeUnmount} from 'vue'
import dayjs from 'dayjs'
import { formatDateYYYYMMDD } from '@/utils/myUtilsFunc.js'
import baseGanttBox from './base-gantt-box.vue'
import baseGanttMums from './base-gantt-workNums.vue'

const props = defineProps({
  tableTimeData: {
    type: Array,
    default: []
  },
  tableData: {
    type: Array,
    default: []
  },
  TimeDataModel: {
    type: Array,
    default: []
  },
  dataModel: {
    type: Object,
    default: {}
  },
  tableScrollTop: {
    type: Number,
    default: 0
  }
})

const formattedData = ref([])
const dataMap = ref(new Map())
const data = ref([])
const tableRef = ref(null)
const labelWidth = ref(100)

// 生成时间轴数据
const generateFormattedData = () => {
  let startDate = dayjs((props.tableTimeData && props.tableTimeData[0]) || props.TimeDataModel[0])
  let endDate = dayjs((props.tableTimeData && props.tableTimeData[1]) || props.TimeDataModel[1])
  let formattedData = []

  while (!startDate.isAfter(endDate)) {
    let dayOfWeek = startDate.format('dddd'); // 获取星期几

    let chineseDayOfWeek = convertToChinese(dayOfWeek);
    formattedData.push({
      date: startDate.format('YYYY-MM-DD'),
      dayOfWeek: chineseDayOfWeek
    })
    startDate = startDate.add(1, 'day');
  }
  return formattedData;
}

// 星期几转换为中文
const convertToChinese = (dayOfWeek) => {
  const dayMap = {
    Sunday: '周日',
    Monday: '周一',
    Tuesday: '周二',
    Wednesday: '周三',
    Thursday: '周四',
    Friday: '周五',
    Saturday: '周六'
  };
  return dayMap[dayOfWeek];
}

// 展开/折叠左右联动
const updateExpandedRows = (newExpandedRowKeys) => {
  if (tableRef.value) {
    nextTick(() => {
      const row = findObjectById(newExpandedRowKeys[0]);
      if (row) {
        tableRef.value.toggleRowExpansion(row);
      }
    });
  }
}

// 初始化数据映射
const initializeDataMap = (data) => {
  dataMap.value.clear();
  data.forEach(item => {
    dataMap.value.set(item.id, item);
  });
}

// 根据ID查找对象
const findObjectById = (idToFind) => {
  return dataMap.value.get(idToFind)
}

// 表头样式
const headerStyle = ({ row, column, rowIndex, columnIndex }) => {
  return 'header_style'
}

// 监听数据变化
watch(() => props.tableData, (newTableData) => {
  data.value = newTableData;
  initializeDataMap(data.value);
}, { immediate: true });

// 监听时间数据变化
watch(() => props.tableTimeData, (newData) => {
  if (newData === null) {
    formattedData.value = generateFormattedData()
    data.value = props.dataModel.userPageResult.items
  } else {
    formattedData.value = generateFormattedData()
  }
}, { immediate: true })



// 监听滚动条位置
watch(() => props.tableScrollTop, (newScrollTop) => {
  tableRef.value.setScrollTop(newScrollTop);
})

// 暴露方法
defineExpose({
  updateExpandedRows
})

onMounted(() => {
  data.value = props.tableData
  initializeDataMap(props.tableData)

  // 阻止表格垂直滚动行为
  const bodyWrapper = tableRef.value?.$el.querySelector('.el-table__body-wrapper')
  if (bodyWrapper) {
    bodyWrapper.addEventListener('wheel', handleWheel, { passive: false })
  }
})

// 移除滚动事件
onBeforeUnmount(() => {
  const bodyWrapper = tableRef.value?.$el.querySelector('.el-table__body-wrapper');
  if (bodyWrapper) {
    bodyWrapper.removeEventListener('wheel', handleWheel);
  }
})

// 处理滚动事件的方法
const handleWheel = (event) => {
  event.preventDefault() // 阻止默认滚动行为
}
</script>
<style scoped>
:deep(.my-table) {
  .header_style {
    background-color: rgba(243, 243, 243, 0.93) !important;
    color: #5F7081;
    font-style: normal;
    font-weight: 400;
  }
  .el-table__body-wrapper {
    .is-vertical {
      display: none;
    }
  }
}

:global(.my-table .el-table__expand-icon) {
  display: none !important;
}

:global(.my-table .el-table__body tbody tr.el-table__row--level-0 td) {
  height: 56px;
  border-top: 1px solid #EDEEF0 !important;
}
:global(.my-table .el-table__body tbody tr.el-table__row--level-1 td) {
  padding: 15px 0;
}

:global(.my-table .el-table__body tbody tr.el-table__row--level-0:nth-child(1) td) {
  border-top: none !important;
}

:global(.my-table td.el-table__cell) {
  z-index: unset !important;
  border-bottom: none;
}
:global(.el-table td.dayClass) {
  background-color: transparent !important;
}

.box {
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: auto;
  color: #FFFFFF;
  top: 0;
  left: 0;
  z-index: 2;
  padding: 6px;
  border-radius: 2px;
  box-shadow: 0px 0px 6px 0px rgba(138, 147, 152, 0.25);
  .box_title {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .box_text {
    border-radius: 2px;
    opacity: 0.8;
    padding: 0 6px;
    background: #FFFFFF;
    box-shadow: 0px 0px 15px 0px rgba(73, 111, 132, 0.25);
    text-align: center;
    font-family: "Microsoft YaHei UI";
    font-size: 13px;
    font-weight: 400;
    white-space: nowrap; /* 确保文本在同一行内显示 */
    writing-mode: horizontal-tb; /* 确保文本水平显示 */
  }
}
</style>