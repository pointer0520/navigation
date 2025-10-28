<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑站点' : '添加站点'"
    width="500px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="站点名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入站点名称" />
      </el-form-item>

      <el-form-item label="网址" prop="url">
        <el-input v-model="form.url" placeholder="https://example.com" @blur="fetchIcon" />
      </el-form-item>

      <el-form-item label="图标">
        <el-input v-model="form.iconUrl" placeholder="自动获取或手动输入">
          <template #prepend>
            <div v-if="form.iconUrl" class="icon-preview">
              <img :src="form.iconUrl" alt="icon" />
            </div>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="分类">
        <el-select
          v-model="form.categoryIds"
          multiple
          placeholder="选择分类"
          style="width: 100%"
        >
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          >
            <el-icon :color="category.color">
              <component :is="category.icon" />
            </el-icon>
            <span style="margin-left: 8px">{{ category.name }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="标签">
        <el-select
          v-model="form.tagIds"
          multiple
          filterable
          allow-create
          placeholder="选择或创建标签"
          style="width: 100%"
        >
          <el-option
            v-for="tag in tags"
            :key="tag.id"
            :label="tag.name"
            :value="tag.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="快速访问">
        <el-switch v-model="form.quickAccess" />
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
import { useTagStore } from '@/stores/tag'

interface Props {
  modelValue: boolean
  site?: any
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', site: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const categoryStore = useCategoryStore()
const tagStore = useTagStore()

const formRef = ref<FormInstance>()
const form = ref({
  name: '',
  url: '',
  iconUrl: '',
  categoryIds: [] as number[],
  tagIds: [] as number[],
  quickAccess: false
})

const rules: FormRules = {
  name: [
    { required: true, message: '请输入站点名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  url: [
    { required: true, message: '请输入网址', trigger: 'blur' },
    {
      pattern: /^https?:\/\/.+/,
      message: 'URL格式错误，请输入以 http/https 开头的地址',
      trigger: 'blur'
    }
  ]
}

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEdit = computed(() => !!props.site)
const categories = computed(() => categoryStore.categories)
const tags = computed(() => tagStore.tags)

// 获取网站图标
const fetchIcon = async () => {
  if (form.value.url && !form.value.iconUrl) {
    try {
      const url = new URL(form.value.url)
      form.value.iconUrl = `${url.origin}/favicon.ico`
    } catch (e) {
      console.error('Invalid URL')
    }
  }
}

const handleClose = () => {
  visible.value = false
  formRef.value?.resetFields()
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      // 将数组转换为逗号分隔的字符串
      const submitData = {
        ...form.value,
        categoryIds: form.value.categoryIds.join(','),
        tagIds: form.value.tagIds.join(',')
      }
      emit('confirm', submitData)
      handleClose()
    }
  })
}

watch(() => props.site, (site) => {
  if (site) {
    // 将逗号分隔的字符串转换为数组
    const categoryIds = site.categoryIds ? 
      site.categoryIds.split(',').filter(Boolean).map(Number) : []
    const tagIds = site.tagIds ? 
      site.tagIds.split(',').filter(Boolean).map(Number) : []
    
    form.value = {
      ...site,
      categoryIds,
      tagIds
    }
  }
}, { immediate: true })
</script>

<style scoped lang="scss">
.icon-preview {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
