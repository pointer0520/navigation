<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
</script>

<template>
  <router-view />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
    'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #ffffff;
  color: #1a1a1a;
}

#app {
  width: 100%;
  min-height: 100vh;
  background: #fafafa;
}

/* 简约滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 3px;
  transition: background 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0;
}

/* Element Plus 简约样式 */
.el-button--primary {
  background: #1a1a1a;
  border: 1px solid #1a1a1a;
  color: #ffffff;
  font-weight: 500;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.el-button--primary:hover {
  background: #333333;
  border-color: #333333;
  transform: translateY(-1px);
}

.el-input__wrapper {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  transition: all 0.2s ease;
  box-shadow: none;
}

.el-input__wrapper:hover {
  border-color: #1a1a1a;
}

.el-input__wrapper.is-focus {
  border-color: #1a1a1a;
  box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.1);
}

.el-input__inner {
  color: #1a1a1a;
}

.el-card {
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  box-shadow: none;
}

.el-dialog {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
}

.el-dialog__title {
  color: #1a1a1a;
  font-weight: 600;
}

.el-message-box {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
}

/* 简约动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
