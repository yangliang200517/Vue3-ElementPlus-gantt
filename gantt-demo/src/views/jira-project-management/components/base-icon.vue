<template>
  <!-- 图标二次封装组件 -->
  <Icon :icon="isPriorityType?.priority" size="15px"></Icon>
</template>
<script setup>
import { computed } from "vue";
import Icon from '@/components/Icon/jiraIcon.vue'

const props = defineProps({
  priority: {
    type: String,
    default: ''
  },
  issuetype: {
    type: String,
    default: ''
  }
})

const isPriorityType = computed(() => {
  switch (props.priority || props.issuetype) {
    case '1':
      return { priority: 'highest', bgColor: 'red'}
      break;
    case '3':
      return { priority: 'medium', bgColor: 'red'}
      break;
    case '5':
      return { priority: 'lowest', bgColor: 'red'}
      break;
    case '10001':
      return { priority: 'demand' }
      break;
    case '10002':
      return { priority: 'task' }
      break;
    case '10004':
      return { priority: 'defect' }
      break;
  }
})
</script>