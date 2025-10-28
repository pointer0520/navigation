<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑分类' : '新建分类'"
    width="400px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入分类名称" />
      </el-form-item>

      <el-form-item label="图标" prop="icon">
        <el-select v-model="form.icon" placeholder="选择图标">
          <el-option
            v-for="icon in iconList"
            :key="icon"
            :label="icon"
            :value="icon"
          >
            <el-icon><component :is="icon" /></el-icon>
            <span style="margin-left: 8px">{{ icon }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="颜色" prop="color">
        <el-color-picker v-model="form.color" />
      </el-form-item>

      <el-form-item label="父分类">
        <el-select v-model="form.parentId" placeholder="选择父分类（可选）" clearable>
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
            :disabled="category.id === form.id"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useCategoryStore } from '@/stores/category'

interface Props {
  modelValue: boolean
  category?: any
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', category: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const categoryStore = useCategoryStore()

const formRef = ref<FormInstance>()
const form = ref({
  name: '',
  icon: 'Folder',
  color: '#409EFF',
  parentId: undefined as number | undefined,
  sortOrder: 0
})

const iconList = [
  'Folder', 'Briefcase', 'VideoPlay', 'Reading', 'Tools', 'Game',
  'Shopping', 'Picture', 'Document', 'Star', 'Collection', 'Ticket'
]

const rules: FormRules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  icon: [
    { required: true, message: '请选择图标', trigger: 'change' }
  ],
  color: [
    { required: true, message: '请选择颜色', trigger: 'change' }
  ]
}

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEdit = computed(() => !!props.category)
const categories = computed(() => categoryStore.getRootCategories)

const handleClose = () => {
  visible.value = false
  formRef.value?.resetFields()
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      const maxOrder = Math.max(...categoryStore.categories.map(c => c.sortOrder), 0)
      emit('confirm', {
        ...form.value,
        sortOrder: maxOrder + 1
      })
      handleClose()
    }
  })
}

watch(() => props.category, (category) => {
  if (category) {
    form.value = { ...category }
  }
}, { immediate: true })
</script>
