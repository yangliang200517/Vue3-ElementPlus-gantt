<template>
  <!-- 成员左侧，人员任务状态组件 -->
  <div class="tag" :style="{ color: isSuestatusType.color, backgroundColor: isSuestatusType.bgColor }" >
    {{ isSuestatusType.name }}
  </div>
</template>
<script setup>
import {computed} from "vue";

const props = defineProps({
  issuestatus: {
    type: String,
    default: ''
  }
})

// 状态类型
const isSuestatusType = computed(() => {
  switch (props.issuestatus) {
    case '1':
      return { name: '暂搁置', color: '#BBB', bgColor: '#F2F2F2' }
      break;
    case '3':
      return { name: '处理中', color: '#5083FF', bgColor: '#E2EAFF' }
      break;
    case '10000':
      return { name: '代办', color: '#FEB201', bgColor: '#FEECC4' }
      break;
    case '10001':
      return { name: '已完成', color: '#3BBD8A', bgColor: '#D6F3E7' }
      break;
  }
})
</script>
<style scoped>
.tag {
  width: 60px;
  height: 23px;
  text-align: center;
  align-content: center;
  font-size: 13px;
}
</style>