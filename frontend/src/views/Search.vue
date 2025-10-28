<template>
  <div class="search-page">
    <div class="search-header">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索站点、分类或标签..."
        :prefix-icon="Search"
        size="large"
        clearable
        @keyup.enter="handleSearch"
      >
        <template #append>
          <el-button :icon="Search" @click="handleSearch" />
        </template>
      </el-input>

      <div class="search-filters">
        <el-select v-model="filterCategory" placeholder="全部分类" clearable @change="handleSearch">
          <el-option label="全部分类" value="" />
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>

        <el-select v-model="filterTag" placeholder="全部标签" clearable @change="handleSearch">
          <el-option label="全部标签" value="" />
          <el-option
            v-for="tag in tags"
            :key="tag.id"
            :label="tag.name"
            :value="tag.id"
          />
        </el-select>

        <el-select v-model="sortBy" @change="handleSearch">
          <el-option label="按相关性" value="relevance" />
          <el-option label="按时间" value="time" />
          <el-option label="按访问次数" value="visits" />
        </el-select>
      </div>
    </div>

    <div class="search-history" v-if="searchHistory.length > 0 && !searchResults">
      <div class="history-header">
        <span>搜索历史</span>
        <el-button text @click="clearHistory">清空</el-button>
      </div>
      <div class="history-tags">
        <el-tag
          v-for="(item, index) in searchHistory"
          :key="index"
          @click="searchKeyword = item; handleSearch()"
          closable
          @close="removeHistory(index)"
        >
          {{ item }}
        </el-tag>
      </div>
    </div>

    <div class="search-results" v-if="searchResults">
      <div class="result-header">
        <span>找到 {{ searchResults.length }} 个结果</span>
      </div>

      <div class="result-list">
        <div
          v-for="site in searchResults"
          :key="site.id"
          class="result-item"
          @click="visitSite(site)"
        >
          <div class="site-icon">
            <img v-if="site.iconUrl" :src="site.iconUrl" :alt="site.name" />
            <el-icon v-else><Link /></el-icon>
          </div>
          <div class="site-info">
            <div class="site-name" v-html="highlightKeyword(site.name)"></div>
            <div class="site-url">{{ site.url }}</div>
            <div class="site-tags">
              <el-tag
                v-for="catId in site.categoryIds"
                :key="catId"
                size="small"
                type="info"
              >
                {{ getCategoryName(catId) }}
              </el-tag>
              <el-tag
                v-for="tagId in site.tagIds"
                :key="tagId"
                size="small"
              >
                {{ getTagName(tagId) }}
              </el-tag>
            </div>
          </div>
          <div class="site-meta">
            访问 {{ site.visitCount }} 次
          </div>
        </div>
      </div>

      <el-empty v-if="searchResults.length === 0" description="未找到相关站点" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, Link } from '@element-plus/icons-vue'
import { useSiteStore } from '@/stores/site'
import { useCategoryStore } from '@/stores/category'
import { useTagStore } from '@/stores/tag'
import type { Site } from '@/types'

const route = useRoute()
const router = useRouter()
const siteStore = useSiteStore()
const categoryStore = useCategoryStore()
const tagStore = useTagStore()

const searchKeyword = ref('')
const filterCategory = ref('')
const filterTag = ref('')
const sortBy = ref('relevance')
const searchResults = ref<Site[] | null>(null)
const searchHistory = ref<string[]>([])

const categories = computed(() => categoryStore.categories)
const tags = computed(() => tagStore.tags)

const loadHistory = () => {
  const stored = localStorage.getItem('searchHistory')
  if (stored) {
    searchHistory.value = JSON.parse(stored)
  }
}

const saveHistory = (keyword: string) => {
  if (!keyword.trim()) return
  
  const history = searchHistory.value.filter(h => h !== keyword)
  history.unshift(keyword)
  searchHistory.value = history.slice(0, 10)
  
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

const clearHistory = () => {
  searchHistory.value = []
  localStorage.removeItem('searchHistory')
}

const removeHistory = (index: number) => {
  searchHistory.value.splice(index, 1)
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

const handleSearch = () => {
  const results = siteStore.searchSites(
    searchKeyword.value,
    filterCategory.value || undefined,
    filterTag.value || undefined
  )

  // 排序
  if (sortBy.value === 'time') {
    results.sort((a, b) => b.addTime - a.addTime)
  } else if (sortBy.value === 'visits') {
    results.sort((a, b) => b.visitCount - a.visitCount)
  }

  searchResults.value = results
  
  if (searchKeyword.value.trim()) {
    saveHistory(searchKeyword.value)
  }
}

const visitSite = (site: Site) => {
  siteStore.incrementVisit(site.id)
  window.open(site.url, '_blank')
}

const getCategoryName = (id: string) => {
  return categories.value.find(c => c.id === id)?.name || ''
}

const getTagName = (id: string) => {
  return tags.value.find(t => t.id === id)?.name || ''
}

const highlightKeyword = (text: string) => {
  if (!searchKeyword.value) return text
  const regex = new RegExp(`(${searchKeyword.value})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

onMounted(() => {
  loadHistory()
  siteStore.loadFromStorage()
  categoryStore.loadFromStorage()
  tagStore.loadFromServer()

  // 从URL获取搜索关键词
  const query = route.query.q as string
  if (query) {
    searchKeyword.value = query
    handleSearch()
  }
})
</script>

<style scoped lang="scss">
.search-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 32px;
  min-height: 100vh;
  background: #fafafa;
}

.search-header {
  margin-bottom: 32px;

  .search-filters {
    display: flex;
    gap: 12px;
    margin-top: 16px;

    .el-select {
      flex: 1;
    }
  }
}

.search-history {
  background: #ffffff;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;

  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-weight: 600;
    font-size: 14px;
    color: #1a1a1a;
  }

  .history-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .el-tag {
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        transform: translateY(-1px);
      }
    }
  }
}

.search-results {
  .result-header {
    margin-bottom: 16px;
    font-size: 13px;
    font-weight: 600;
    color: #666666;
  }

  .result-list {
    background: #ffffff;
    overflow: hidden;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
  }

  .result-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border-bottom: 1px solid #f5f5f5;
    cursor: pointer;
    transition: all 0.2s ease;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: #fafafa;
    }

    .site-icon {
      width: 48px;
      height: 48px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      flex-shrink: 0;

      img {
        width: 32px;
        height: 32px;
      }

      .el-icon {
        font-size: 24px;
        color: #666666;
      }
    }

    .site-info {
      flex: 1;
      min-width: 0;

      .site-name {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 4px;
        color: #1a1a1a;

        :deep(mark) {
          background: #fff3cd;
          color: #856404;
          padding: 2px 4px;
        }
      }

      .site-url {
        font-size: 12px;
        color: #999999;
        margin-bottom: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .site-tags {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;

        .el-tag {
          font-size: 11px;
        }
      }
    }

    .site-meta {
      font-size: 12px;
      color: #c0c0c0;
      white-space: nowrap;
    }
  }
}
</style>
