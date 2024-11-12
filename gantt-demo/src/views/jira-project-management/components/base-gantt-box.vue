<template>
  <!-- 甘特图进度条组件 -->
  <div
    v-if="visible"
    class="box"
    :style="{ width: width + 'px!important', backgroundColor: boxStyle.bgColor }"
  >
    <div class="box_title">{{ summary }}</div>
    <div class="box_text" :style="{ color: boxStyle.textColor }">{{ boxStyle.text }}</div>
  </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue';
import dayjs from 'dayjs';

const props = defineProps({
  time: String,
  row: Object,
  labelWidth: Number,
  minDate: String,
  maxDate: String
});

const visible = ref(false)
const width = ref(0);
const summary = ref('')
const boxStyle = ref({})

// 计算日期差
const calculateDateDifference = (startDateStr, endDateStr, minDateStr, maxDateStr) => {
  if (startDateStr === undefined || endDateStr === undefined) {
    return undefined;
  }
  const startDate = dayjs(startDateStr);
  const endDate = dayjs(endDateStr);
  const minDate = dayjs(minDateStr);
  const maxDate = dayjs(maxDateStr);

  // 如果开始日期早于筛选的最小日期，则从最小日期开始
  const adjustedStartDate = startDate.isBefore(minDate) ? minDate : startDate;

  // 如果结束日期晚于筛选的最大日期，则结束于最大日期
  const adjustedEndDate = endDate.isAfter(maxDate) ? maxDate : endDate;

  // 计算毫秒差异
  const timeDiff = adjustedEndDate.diff(adjustedStartDate, 'day');

  // 将天数差异转换为像素宽度
  return (timeDiff + 1) * props.labelWidth;
}

// 根据状态获取颜色
const getBoxStyle = (row) => {
  switch (row.issuestatus) {
    case '1':
      return { bgColor: 'rgba(207, 210, 212, 0.80)', textColor: '#B3B3B3', text: '暂搁置' };
    case '3':
      return { bgColor: 'rgba(52, 112, 255, 0.50)', textColor: '#5083FF', text: '处理中' };
    case '10000':
      return { bgColor: 'rgba(251, 194, 61, 0.60)', textColor: '#FEB201', text: '代办' };
    case '10001':
      return { bgColor: 'rgba(165, 221, 197, 0.80)', textColor: '#3BBD8A', text: '已完成' };
    default:
      return { bgColor: '', textColor: '', text: '' };
  }
}

// 监听时间变化
watch(() => [props.time, props.row], ([time, row]) => {  
  if (row.estimatedStartTime !== undefined) {
    const startTime = dayjs(row.estimatedStartTime).format('YYYY-MM-DD')
    visible.value = startTime === time;
  } else {
    visible.value = false;
  }

  if (visible.value) {
    width.value = calculateDateDifference(row.estimatedStartTime, row.estimatedEndTime, props.minDate, props.maxDate);
    summary.value = row.summary;
    boxStyle.value = getBoxStyle(row);
  }
}, { immediate: true });
</script>

<style scoped>
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
    white-space: nowrap;
    writing-mode: horizontal-tb;
  }
}
</style>