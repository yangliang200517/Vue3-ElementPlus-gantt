<template>
  <!-- 成员右侧甘特图任务数显示组件 -->
  <div>
    <div>
      <p v-if="visible" @click="showDetails(workLogNumsItems, rowId)">{{ taskText }}</p>
      <p v-else>-</p>
    </div>
    <baseDialog
        v-if="dialogType"
        :dialogType="dialogType"
        :detailData="detailData"
        :detailNum="detailNum"
        @closed="closeDialog"
    ></baseDialog>
  </div>

</template>

<script setup>
import { ref, watch } from 'vue';
import dayjs from 'dayjs';
import baseDialog from './base-dialog.vue'

const props = defineProps({
  time: String,
  workLogNumsItems: Object,
  rowId: Number
});

const visible = ref(false)
const taskText = ref('')
const dialogType = ref(false)
const detailNum = ref(0)
const detailData = ref({
  time: '',
  id: null,
  pid: 0,
})

// 监听时间
watch(() => [props.time, props.workLogNumsItems], ([time, workLogNumsItems]) => {
  const dataTime = dayjs(workLogNumsItems.time).format('YYYY-MM-DD')
  visible.value = time === dataTime;

  if (visible.value) {
    taskText.value = `任务数: ${workLogNumsItems.num}`;
  } else {
    taskText.value = '';
  }
}, { immediate: true });

// 任务详情
const showDetails = (data, id) => {
  detailNum.value = data.num
  detailData.value.time = data.time
  detailData.value.id = id
  dialogType.value = true
}
// 关闭任务详情
const closeDialog = (type) => {
  dialogType.value = type
}
</script>