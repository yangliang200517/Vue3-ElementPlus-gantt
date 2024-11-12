<template>
  <!-- 筛选组件 -->
  <el-popover
      placement="bottom-end"
      :visible="visible"
      :width="310"
  >
    <template #reference>
      <el-button class="show_btn" @click="visible = !visible">
        <span class="show_btn_text">筛选条件</span>
      </el-button>
    </template>
    <template #default>
      <el-form :model="formInline" label-position="top">
        <el-form-item label="任务状态">
          <baseRadio v-if="visible" v-model="formInline.issuestatus" :data="issuestatus" radioType="issuestatus" @changeType="changeType"></baseRadio>
        </el-form-item>
        <el-form-item label="优先级">
          <baseRadio v-if="visible" v-model="formInline.priority" :data="priority" radioType="priority" @changeType="changeType"></baseRadio>
        </el-form-item>
        <el-form-item label="任务类型">
          <baseRadio v-if="visible" v-model="formInline.issuetype" :data="issuetype" radioType="issuetype" @changeType="changeType"></baseRadio>
        </el-form-item>
        <el-form-item v-if="typeData === 1" label="延期类型">
          <baseRadio v-if="visible" v-model="formInline.postponeType" :data="postpone" radioType="postponeType" @changeType="changeType"></baseRadio>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="search">筛选</el-button>
      <el-button @click="result">重置</el-button>
    </template>
  </el-popover>
</template>
<script setup>
import { ref, onBeforeUnmount } from 'vue'
import baseRadio from './base-radio.vue'
import { issuestatusTypeData, priorityTypeData, issuetypeTypeData, postponeTypeData } from '@/utils/selectObjectData.js'

const emit = defineEmits(['searchData'])
const props = defineProps({
  typeData: {
    type: Number,
    default: null
  }
})

const visible = ref(false)
const formInline = ref({
  issuestatus: null,
  priority: null,
  issuetype: null,
  postponeType: null,
})

const issuestatus = ref([...issuestatusTypeData])
const priority = ref([...priorityTypeData])
const issuetype = ref([...issuetypeTypeData])
const postpone = ref([...postponeTypeData])

// 更新 isActive 状态的通用函数
const updateActiveStatus = (dataSource, selectedValue) => {
  dataSource.forEach(item => {
    item.isActive = (item.value === selectedValue)
  })
}

// 筛选
const search = () => {
  emit('searchData', formInline.value)
  visible.value = false
}

// 重置
const result = () => {
  formInline.value = {
    issuestatus: null,
    priority: null,
    issuetype: null,
    postponeType: null,
  }
  updateActiveStatus(issuestatus.value, null)
  updateActiveStatus(priority.value, null)
  updateActiveStatus(issuetype.value, null)
  updateActiveStatus(postpone.value, null)
  emit('searchData', formInline.value)
  visible.value = false
}

// 选中状态
const changeType = (data) => {
  const { type, value } = data
  switch (type) {
    case 'issuestatus':
      updateActiveStatus(issuestatus.value, value)
      break
    case 'priority':
      updateActiveStatus(priority.value, value)
      break
    case 'issuetype':
      updateActiveStatus(issuetype.value, value)
      break
    case 'postponeType':
      updateActiveStatus(postpone.value, value)
      break
  }
}

onBeforeUnmount(() => {
  updateActiveStatus(issuestatus.value, null)
  updateActiveStatus(priority.value, null)
  updateActiveStatus(issuetype.value, null)
  updateActiveStatus(postpone.value, null)
})
</script>
<style scoped>
.el-radio-group {
  gap: 10px;
  :deep(.el-radio-button .el-radio-button__inner) {
    border: 1px solid transparent;
    background-color: #F5F5F5;
    color: #565656;
    border-radius: 2px;
  }
  :deep(.el-radio-button--large .el-radio-button__inner) {
    width: 88px;
    padding: 8px 15px;
  }
  :deep(.el-radio-button.is-active .el-radio-button__original-radio:not(:disabled)+.el-radio-button__inner) {
    border: 1px solid #3A82EE;
    background-color: #F1F5FA;
    color: #565656;
    border-radius: 2px;
    box-shadow: none;
  }

}
</style>