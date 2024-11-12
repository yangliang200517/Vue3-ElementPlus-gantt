<template>
  <!-- 成员/进度模块头部搜索组件 -->
  <div class="member_header member_box">
    <div class="member_header_left">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <div class="search-box">
            <el-dropdown>
              <el-button>标题</el-button>
            </el-dropdown>
            <div class="form-box">
              <div>
                <el-input v-model="formInline.summary" placeholder="请输入" @keyup.enter="searchLabel" @clear="clearData" size="small" clearable />
              </div>
              <div @click="searchLabel">
                <el-button :icon="Search" />
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="search-box">
            <el-dropdown>
              <el-button>姓名</el-button>
            </el-dropdown>
            <div class="form-box">
              <div>
                <el-input v-model="formInline.lowerDisplayName" placeholder="请输入" @keyup.enter="searchLabel" @clear="clearData" clearable />
              </div>
              <div @click="searchLabel">
                <el-button :icon="Search" />
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <baseSearch :typeData="type" @searchData="searchData"></baseSearch>
        </el-form-item>
      </el-form>
    </div>
    <div class="member_header_right">
        <el-date-picker
            v-model="tableTimeDatas"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :shortcuts="shortcuts"
            @change="changeDate"
        />
    </div>
  </div>
</template>
<script setup>
import {onMounted, ref, watch} from 'vue'
import dayjs from "dayjs"
import baseSearch from './base-search.vue'
import { Search } from '@element-plus/icons-vue'

const emit = defineEmits(['search', 'searchTime', 'clearData'])
const props = defineProps({
  type: {
    type: Number,
    default: null
  },
  tableTimeDataAndroid: {
    type: Array,
    default: []
  }
})

const tableTimeDatas = ref([])
const formInline = ref({
  summary: '',
  lowerDisplayName: '',
  issuestatus: null,
  priority: null,
  issuetype: null,
  postponeType: null
})
const shortcuts = [
  {
    text: '本周',
    value: () => {
      const startOfWeek = dayjs().startOf('week');
      const endOfWeek = dayjs().endOf('week');
      return [startOfWeek, endOfWeek];
    },
  },
  {
    text: '本月',
    value: () => {
      const startOfMonth = dayjs().startOf('month');
      const endOfMonth = dayjs().endOf('month');
      return [startOfMonth, endOfMonth];
    },
  }
]

// 标签/负责人 搜索
const searchLabel = () => {
  emit('search', formInline.value)
}

// 清除数据
const clearData = () => {
  emit('clearData', formInline.value)
}

// 日期选择
const changeDate = (val) => {
  emit('searchTime', val)
}

// 数据筛选
const searchData = (data) => {
  formInline.value.issuestatus = data.issuestatus
  formInline.value.priority = data.priority
  formInline.value.issuetype = data.issuetype
  formInline.value.postponeType = data.postponeType
  emit('search', formInline.value)
}

// 监听父组件传值
watch(() => props.tableTimeDataAndroid, (newValue) => {
  tableTimeDatas.value = [...newValue]
})

onMounted(() => {
  tableTimeDatas.value = [props.tableTimeDataAndroid[0], props.tableTimeDataAndroid[1]]
})

</script>
<style scoped>
.member_header {
  display: flex;
  justify-content: space-between;
  padding: 16px 24px 16px 0;
  margin-bottom: 10px;
  .member_header_right {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    .el-button {
      color: #ffffff;
    }
  }
}
.el-form--inline .el-form-item {
  margin-bottom: 0;
}

.search-box {
  display: flex;
  width: 200px;
  border: 1px solid #CCC;
  border-radius: 5px;
  .el-dropdown {
    .el-button {
      background-color: transparent;
      border-color: transparent;
      color: #173E67;
    }
    .el-button:focus-visible {
      outline: none;
    }
    .el-button:hover {
      background-color: transparent;
      border-color: transparent;
      color: #173E67;
    }
  }
  .form-box {
    display: flex;
    align-items: center;
    :deep(.el-input) {
      .el-input__wrapper {
        background-color: transparent;
        box-shadow: none;
        .el-input__prefix {
          display: none;
        }
        .el-input__inner {
          &::placeholder {
            font-size: 14px;
          }
        }
      }
    }
    .el-button {
      background-color: transparent;
      border-color: transparent;
      color: #6F6F6F;
    }
    .el-button:focus-visible {
      outline: none;
    }
    .el-button:hover {
      background-color: transparent;
      border-color: transparent;
      color: #6F6F6F;
    }
    &::before {
      content: '';
      display: block;
      width: 1px;
      height: 20px;
      background-color: #CCC;
    }
  }
}
</style>