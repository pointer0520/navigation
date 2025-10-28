<template>
  <div class="settings-page">
    <el-page-header @back="$router.back()" title="返回">
      <template #content>
        <span class="page-title">设置</span>
      </template>
    </el-page-header>

    <div class="settings-content">
      <el-tabs v-model="activeTab">
        <!-- 分类管理 -->
        <el-tab-pane label="分类管理" name="category">
          <div class="tab-content">
            <div class="content-header">
              <h3>分类管理</h3>
              <el-button type="primary" :icon="Plus" @click="showCategoryDialog = true">
                新建分类
              </el-button>
            </div>

            <draggable
              v-model="categories"
              item-key="id"
              handle=".drag-handle"
              @end="handleCategorySort"
            >
              <template #item="{ element }">
                <div class="category-item">
                  <el-icon class="drag-handle"><DCaret /></el-icon>
                  <el-icon :color="element.color">
                    <component :is="element.icon" />
                  </el-icon>
                  <span class="category-name">{{ element.name }}</span>
                  <div class="category-actions">
                    <el-button size="small" :icon="Edit" @click="editCategory(element)" />
                    <el-button size="small" :icon="Delete" @click="deleteCategory(element)" />
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </el-tab-pane>

        <!-- 标签管理 -->
        <el-tab-pane label="标签管理" name="tag">
          <div class="tab-content">
            <div class="content-header">
              <h3>标签管理</h3>
              <el-button type="primary" :icon="Plus" @click="showTagDialog = true">
                新建标签
              </el-button>
            </div>

            <div class="tag-list">
              <el-tag
                v-for="tag in tags"
                :key="tag.id"
                :color="tag.color"
                closable
                @close="deleteTag(tag)"
                @click="editTag(tag)"
                size="large"
              >
                {{ tag.name }}
              </el-tag>
            </div>
          </div>
        </el-tab-pane>

        <!-- 数据管理 -->
        <el-tab-pane label="数据备份" name="backup">
          <div class="tab-content">
            <h3>数据备份</h3>
            
            <el-card class="backup-card">
              <template #header>
                <span>本地备份</span>
              </template>
              <p>导出所有数据为JSON文件，保存到本地</p>
              <el-button type="primary" :icon="Download" @click="exportData">
                导出数据
              </el-button>
            </el-card>

            <el-card class="backup-card">
              <template #header>
                <span>导入数据</span>
              </template>
              <p>从JSON文件导入数据（将覆盖现有数据）</p>
              <el-upload
                :auto-upload="false"
                :on-change="handleImport"
                :show-file-list="false"
                accept=".json"
              >
                <el-button type="warning" :icon="Upload">
                  导入数据
                </el-button>
              </el-upload>
            </el-card>

            <el-card class="backup-card">
              <template #header>
                <span>清空数据</span>
              </template>
              <p class="warning-text">此操作将删除所有站点、分类和标签数据，请谨慎操作</p>
              <el-button type="danger" :icon="Delete" @click="clearAllData">
                清空所有数据
              </el-button>
            </el-card>
          </div>
        </el-tab-pane>

        <!-- 账号设置 -->
        <el-tab-pane label="账号设置" name="account">
          <div class="tab-content">
            <h3>账号设置</h3>
            <el-card>
              <p>云端同步功能需要登录账号</p>
              <el-button type="primary" @click="$router.push('/login')">
                登录/注册
              </el-button>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 分类编辑对话框 -->
    <CategoryDialog
      v-model="showCategoryDialog"
      :category="currentCategory"
      @confirm="handleCategoryConfirm"
    />

    <!-- 标签编辑对话框 -->
    <el-dialog
      v-model="showTagDialog"
      :title="currentTag ? '编辑标签' : '新建标签'"
      width="400px"
    >
      <el-form :model="tagForm" label-width="80px">
        <el-form-item label="标签名称">
          <el-input v-model="tagForm.name" />
        </el-form-item>
        <el-form-item label="颜色">
          <el-color-picker v-model="tagForm.color" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showTagDialog = false">取消</el-button>
        <el-button type="primary" @click="handleTagConfirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus, Edit, Delete, Download, Upload, DCaret
} from '@element-plus/icons-vue'
import draggable from 'vuedraggable'
import { useSiteStore } from '@/stores/site'
import { useCategoryStore } from '@/stores/category'
import { useTagStore } from '@/stores/tag'
import CategoryDialog from '@/components/CategoryDialog.vue'
import type { BackupData, Category, Tag } from '@/types'

const siteStore = useSiteStore()
const categoryStore = useCategoryStore()
const tagStore = useTagStore()

const activeTab = ref('category')
const showCategoryDialog = ref(false)
const showTagDialog = ref(false)
const currentCategory = ref<Category | undefined>()
const currentTag = ref<Tag | undefined>()
const tagForm = ref({ name: '', color: '#409EFF' })

const categories = computed({
  get: () => categoryStore.categories,
  set: (val) => categoryStore.categories = val
})

const tags = computed(() => tagStore.tags)

const handleCategorySort = () => {
  categoryStore.updateOrder(categories.value)
  ElMessage.success('排序已保存')
}

const editCategory = (category: Category) => {
  currentCategory.value = category
  showCategoryDialog.value = true
}

const deleteCategory = (category: Category) => {
  ElMessageBox.confirm(
    '删除后分类下的网站将移至未分类，是否确认？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    categoryStore.deleteCategory(category.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleCategoryConfirm = (category: any) => {
  if (currentCategory.value) {
    categoryStore.updateCategory(currentCategory.value.id, category)
    ElMessage.success('更新成功')
  } else {
    categoryStore.addCategory(category)
    ElMessage.success('创建成功')
  }
  currentCategory.value = undefined
}

const editTag = (tag: Tag) => {
  currentTag.value = tag
  tagForm.value = { name: tag.name, color: tag.color }
  showTagDialog.value = true
}

const deleteTag = (tag: Tag) => {
  tagStore.deleteTag(tag.id)
  ElMessage.success('删除成功')
}

const handleTagConfirm = () => {
  if (currentTag.value) {
    tagStore.updateTag(currentTag.value.id, tagForm.value)
    ElMessage.success('更新成功')
  } else {
    tagStore.addTag(tagForm.value)
    ElMessage.success('创建成功')
  }
  showTagDialog.value = false
  currentTag.value = undefined
  tagForm.value = { name: '', color: '#409EFF' }
}

const exportData = () => {
  const backupData: BackupData = {
    version: '1.0.0',
    timestamp: Date.now(),
    sites: siteStore.sites,
    categories: categoryStore.categories,
    tags: tagStore.tags,
    settings: {}
  }

  const dataStr = JSON.stringify(backupData, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `daohang-backup-${Date.now()}.json`
  link.click()
  URL.revokeObjectURL(url)

  ElMessage.success('导出成功')
}

const handleImport = (file: any) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data: BackupData = JSON.parse(e.target?.result as string)
      
      // 恢复数据
      siteStore.sites = data.sites
      categoryStore.categories = data.categories
      tagStore.tags = data.tags
      
      // 保存到localStorage
      localStorage.setItem('sites', JSON.stringify(data.sites))
      localStorage.setItem('categories', JSON.stringify(data.categories))
      localStorage.setItem('tags', JSON.stringify(data.tags))
      
      ElMessage.success('导入成功')
    } catch (error) {
      ElMessage.error('文件格式错误')
    }
  }
  reader.readAsText(file.raw)
}

const clearAllData = () => {
  ElMessageBox.confirm(
    '此操作将删除所有数据，是否确认？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }
  ).then(() => {
    localStorage.clear()
    siteStore.sites = []
    categoryStore.categories = []
    tagStore.tags = []
    ElMessage.success('已清空所有数据')
  }).catch(() => {})
}

onMounted(() => {
  siteStore.loadFromStorage()
  categoryStore.loadFromStorage()
  tagStore.loadFromServer()
})
</script>

<style scoped lang="scss">
.settings-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 32px;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f0f4f8 0%, #e8eef5 100%);

  .page-title {
    font-size: 24px;
    font-weight: 700;
    color: #303133;
  }

  .settings-content {
    margin-top: 32px;
    background: white;
    padding: 32px;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .tab-content {
    padding: 24px 0;

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;

      h3 {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        color: #303133;
        position: relative;
        padding-left: 16px;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 2px;
        }
      }
    }
  }

  .category-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    background: linear-gradient(135deg, #f5f7fa 0%, #eef1f5 100%);
    border-radius: 12px;
    margin-bottom: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

    &:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .drag-handle {
      cursor: move;
      color: #909399;
      font-size: 18px;
      transition: color 0.3s ease;

      &:hover {
        color: #667eea;
      }
    }

    .category-name {
      flex: 1;
      font-weight: 600;
      font-size: 15px;
      color: #303133;
    }

    .category-actions {
      display: flex;
      gap: 10px;
    }
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;

    .el-tag {
      cursor: pointer;
      font-size: 14px;
      padding: 10px 18px;
      border-radius: 10px;
      transition: all 0.3s ease;
      font-weight: 500;

      &:hover {
        transform: translateY(-3px) scale(1.05);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
      }
    }
  }

  .backup-card {
    margin-bottom: 20px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);

    :deep(.el-card__header) {
      background: linear-gradient(135deg, #f5f7fa 0%, #eef1f5 100%);
      font-weight: 600;
      font-size: 16px;
      color: #303133;
    }

    p {
      margin-bottom: 20px;
      color: #606266;
      line-height: 1.6;
    }

    .warning-text {
      color: #f56c6c;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;

      &::before {
        content: '⚠️';
        font-size: 16px;
      }
    }
  }
}
</style>
