<template>
  <!-- 成员甘特图任务详情组件 -->
  <el-dialog
      :model-value="dialogType"
      title="工时及日报详情"
      width="800" @close="closeDialog"
      :destroy-on-close="true"
  >
    <div class="box">
      <div class="box_top">
        <div class="box_top_item">
          <div>项目主管</div>
          <div class="user">
            <div class="avater"><img :src="detailAvatar" alt=""></div>
            <div class="name">{{ detailName }}</div>
          </div>

        </div>
        <div class="box_top_item">
          <div>任务量</div>
          <div>{{ props.detailNum }}</div>
        </div>
        <div class="box_top_item">
          <div>时间</div>
          <div>{{ detailTime }}</div>
        </div>
      </div>
      <div class="box_table">
        <el-table :data="detailsWorkLogInfos" border :stripe="true">
          <el-table-column property="issuenum" label="编号" align="center" />
          <el-table-column property="summary" label="任务" width="200" align="center" :show-overflow-tooltip="true" />
          <el-table-column property="pname" label="所属项目" align="center" />
          <el-table-column property="issuestatus" label="状态" align="center">
            <template #default="{ row }">
              <div class="issuestatus_box" :style="{ backgroundColor: boxStyle(row.issuestatus)?.bgColor }">
                <div :style="{ color: boxStyle(row.issuestatus)?.textColor }">{{ boxStyle(row.issuestatus)?.text }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column property="timeworked" label="工时数/h" align="center">
            <template #default="{ row }">
              <div>{{ row.timeworked + 'h' }}</div>
            </template>
          </el-table-column>
          <el-table-column property="percentage" label="工时占比" align="center">
            <template #default="{ row }">
              <div>{{ (row.percentage * 100).toFixed(2) + '%' }}</div>
            </template>
          </el-table-column>
          <el-table-column property="worklogbody" label="详情" align="center" min-width="100" :show-overflow-tooltip="true">
            <template #default="{ row }">
              <div @click="goJira(row.url)">
                <el-button type="primary" link>{{ row.worklogbody }}</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-dialog>
</template>
<script setup>
import {onMounted, ref} from 'vue'

const emit = defineEmits(['closed'])
const props = defineProps({
  dialogType: {
    type: Boolean,
    default: false
  },
  detailData: {
    type: Object,
    default: {}
  },
  detailNum: {
    type: Number,
    default: 0
  }
})
const detailName = ref('')
const detailAvatar = ref('')
const detailTime = ref('')
const detailsWorkLogInfos = ref([])

// 将秒转换为小时
const secondsToHours = (seconds) => {
  return seconds / 3600;
}

// 获取详情
const getDetails = async (data) => {
  // const res = await getProjectWorkInfo(data)
  // if (res.code === '200') {
    detailAvatar.value = res.data?.avatar
    detailName.value = res.data.lowerDisplayName
    detailTime.value = res.data.time
    detailsWorkLogInfos.value = res.data.workLogInfos.map(row => ({
      ...row,
      timeworked: secondsToHours(row.timeworked)
    }));
  // }
  // console.log(res)
}

// 根据状态返回对应颜色和文本
const boxStyle = (row) => {
  console.log(row)
  switch (row) {
    case '1':
      return { bgColor: 'rgba(207, 210, 212, 0.80)', textColor: '#B3B3B3', text: '暂搁置' }
    case '3':
      return { bgColor: 'rgba(52, 112, 255, 0.50)', textColor: '#5083FF', text: '处理中' }
    case '10000':
      return { bgColor: 'rgba(251, 194, 61, 0.60)', textColor: '#FEB201', text: '代办' }
    case '10001':
      return { bgColor: 'rgba(165, 221, 197, 0.80)', textColor: '#3BBD8A', text: '已完成' }
  }
}

// 关闭弹窗
const closeDialog = () => {
  emit('closed', false)
}

// 跳转jira
const goJira = (row) => {
  window.open(row, '_blank')
}

onMounted(() => {
  getDetails(props.detailData)
})
</script>
<style scoped>
:deep(.el-dialog) {
  .el-dialog__header {
    .el-dialog__title {
      color: #7B8895 !important;
    }
  }
}

.box {
  box-shadow: 0px 0px 12px 0px rgba(189, 189, 189, 0.25);
  .box_top {
    display: flex;
    justify-content: start;
    gap: 60px;
    .box_top_item {
      display: flex;
      padding: 10px 0;
      color: #7B8895;
      font-size: 15px;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      .user {
        display: flex;
        align-items: center;
        gap: 5px;
        .avater {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #0F2566;
          overflow: hidden;
        }
        .name {
          color: #173E67;
        }
      }
    }
  }
}

.issuestatus_box {
  display: flex;
  padding: 0 10px;
  justify-content: center;
  border-radius: 3px;
}
</style>