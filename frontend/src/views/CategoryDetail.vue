<template>
  <div class="category-detail">
    <el-page-header @back="$router.back()" :title="category?.name || '分类详情'">
      <template #content>
        <div class="category-header">
          <el-icon :color="category?.color">
            <component :is="category?.icon" />
          </el-icon>
          <span>{{ category?.name }}</span>
        </div>
      </template>
    </el-page-header>

    <div class="sites-container">
      <div
        v-for="site in sites"
        :key="site.id"
        class="site-card"
        @click="visitSite(site)"
      >
        <div class="site-icon">
          <img v-if="site.iconUrl" :src="site.iconUrl" :alt="site.name" />
          <el-icon v-else><Link /></el-icon>
        </div>
        <div class="site-info">
          <div class="site-name">{{ site.name }}</div>
          <div class="site-url">{{ site.url }}</div>
        </div>
      </div>

      <el-empty v-if="sites.length === 0" description="该分类下暂无站点" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Link } from '@element-plus/icons-vue'
import { useSiteStore } from '@/stores/site'
import { useCategoryStore } from '@/stores/category'
import type { Site } from '@/types'

const route = useRoute()
const siteStore = useSiteStore()
const categoryStore = useCategoryStore()

const categoryId = computed(() => route.params.id as string)
const category = computed(() => 
  categoryStore.categories.find(c => c.id === categoryId.value)
)
const sites = computed(() => 
  siteStore.getSitesByCategory(categoryId.value)
)

const visitSite = (site: Site) => {
  siteStore.incrementVisit(site.id)
  window.open(site.url, '_blank')
}

onMounted(() => {
  siteStore.loadFromStorage()
  categoryStore.loadFromStorage()
})
</script>

<style scoped lang="scss">
.category-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 32px;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f0f4f8 0%, #e8eef5 100%);

  .category-header {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 24px;
    font-weight: 700;
    color: #303133;

    .el-icon {
      font-size: 28px;
    }
  }

  .sites-container {
    margin-top: 32px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
  }

  .site-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.05);

    &:hover {
      transform: translateY(-6px) scale(1.02);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
      border-color: #667eea;
    }

    .site-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f5f7fa 0%, #eef1f5 100%);
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;

      img {
        width: 36px;
        height: 36px;
        border-radius: 6px;
      }

      .el-icon {
        font-size: 28px;
        color: #667eea;
      }
    }

    &:hover .site-icon {
      transform: scale(1.1);
    }

    .site-info {
      flex: 1;
      min-width: 0;

      .site-name {
        font-weight: 600;
        font-size: 16px;
        margin-bottom: 6px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #303133;
      }

      .site-url {
        font-size: 13px;
        color: #909399;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
