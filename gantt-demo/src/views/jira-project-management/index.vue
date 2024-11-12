<template>
  <div class="oversTabs">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="成员" name="member">
        <memberView v-if="activeName === 'member'"></memberView>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import memberView from './member/index.vue'

const activeName = ref('member')

</script>
<style scoped>
.oversTabs {
  position: relative;
  .go_back {
    display: flex;
    position: absolute;
    height: 40px;
    color: #173E67;
    font-size: 16px;
    font-family: "Microsoft YaHei UI";
    top: 0;
    right: 20px;
    align-items: center;
    gap: 5px;
    cursor: pointer;
  }
}

:deep(.el-tabs--border-card) {
  background-color: transparent;
  border: none;
}

:deep(.el-tabs) {
  .el-tabs__nav {
    z-index: 0;
  }
  .el-tabs__header {
    background-color: transparent;
    border-bottom: none;
  }
  .el-tabs__content {
    background-color: transparent;
    padding: 0;
    box-shadow: 0 0 15px 0 rgba(87, 120, 139, 0.25);
    z-index: 1;
  }
}

:deep(.el-tabs--border-card) {
  .el-tabs__header {
    .el-tabs__item {
      background-color: #F0F0F0;
      color: #A2B2C2;
      text-align: center;
      font-family: "Microsoft YaHei UI";
      font-size: 16px;
    }
  }
}

:deep(.el-tabs--border-card) {
  .el-tabs__header {
    .el-tabs__item.is-active {
      position: relative;
      background-color: #ffffff;
      color: #173E67;
      border-left-color: transparent;
      border-right-color: transparent;

      &:after {
        content: '';
        position: absolute;
        display: inline-block;
        width: 32px;
        height: 1px;
        bottom: 0;
        background-color: #006AFF;
      }
    }
  }
}

.overview-box {
  background-color: #ffffff;
  padding: 15px;
}
</style>
