<template>
  <!-- 单选框组件 -->
  <el-radio-group v-model="radioValue" size="large" @change="changeRadio">
    <el-radio-button v-for="item in data" :label="item.label" :value="item.value" :class="{ 'is-active': item.isActive }" >
      <template #default>
        <div class="radio_text">
          <span>{{ item.label }}</span>
        </div>
      </template>
    </el-radio-button>
  </el-radio-group>
</template>
<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['update:modelValue', 'changeType']);
const props = defineProps({
  modelValue: {
    type: Number,
    default: null
  },
  data: {
    type: Array,
    default: []
  },
  radioType: {
    type: String,
    default: ''
  }
})

const radioValue = ref(null)

// 监听modelValue的变化，将值传递给父组件
watch(radioValue, newValue => {
  emit('update:modelValue', newValue)
})

// 单选变化时
const changeRadio = (val) => {
  let data = {
    type: props.radioType,
    value: val
  }
  emit('changeType', data)
}
</script>
<style scoped>
.radio_text {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
</style>