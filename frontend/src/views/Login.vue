<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>个人导航站</h1>
        <p>登录以启用云端同步功能</p>
      </div>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="0">
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名/邮箱"
            :prefix-icon="User"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            size="large"
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            style="width: 100%"
            @click="handleLogin"
            :loading="loading"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <el-button text @click="$router.push('/register')">
          还没有账号？立即注册
        </el-button>
        <el-button text @click="$router.back()">
          返回首页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const form = ref({
  username: '',
  password: ''
})

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名或邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      
      try {
        await authStore.login({
          username: form.value.username,
          password: form.value.password
        })
        ElMessage.success('登录成功')
        router.push('/')
      } catch (error: any) {
        console.error('登录失败:', error)
        ElMessage.error(error.response?.data?.message || '登录失败，请检查用户名和密码')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped lang="scss">
.login-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
}

.login-container {
  width: 400px;
  padding: 48px;
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);

  .login-header {
    text-align: center;
    margin-bottom: 40px;

    h1 {
      font-size: 24px;
      color: #1a1a1a;
      margin-bottom: 8px;
      font-weight: 600;
      letter-spacing: -0.5px;
    }

    p {
      color: #666666;
      font-size: 14px;
    }
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  .login-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;

    .el-button {
      font-size: 13px;
      color: #666666;

      &:hover {
        color: #1a1a1a;
      }
    }
  }
}
</style>
