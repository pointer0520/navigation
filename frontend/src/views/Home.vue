<template>
  <div class="home-container">
    <!-- 顶部搜索栏 -->
    <header class="header">
      <div class="logo">
        <el-icon :size="24"><Link /></el-icon>
        <span>个人导航站</span>
      </div>
      <div class="search-container">
        <div class="search-bar">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索站点、分类或标签..."
            :prefix-icon="Search"
            size="large"
            clearable
            @keyup.enter="handleSearch"
            @input="onSearchInput"
            @focus="showSearchPanel = true"
            @blur="onSearchBlur"
          >
            <template #suffix>
              <el-button
                :icon="Search"
                type="primary"
                text
                @click="handleSearch"
                style="margin-right: -8px;"
              >
                搜索
              </el-button>
            </template>
          </el-input>
        </div>
        
        <!-- 搜索建议面板 -->
        <transition name="search-panel">
          <div v-show="showSearchPanel && (searchKeyword || searchHistory.length > 0)" class="search-panel">
            <!-- 实时搜索结果 -->
            <div v-if="searchKeyword && searchResults.length > 0" class="search-section">
              <div class="section-title">搜索结果</div>
              <div
                v-for="site in searchResults"
                :key="site.id"
                class="search-item"
                @mousedown="visitSiteFromSearch(site)"
              >
                <div class="item-icon">
                  <img v-if="site.iconUrl" :src="site.iconUrl" :alt="site.name" />
                  <el-icon v-else><Link /></el-icon>
                </div>
                <div class="item-info">
                  <div class="item-name" v-html="highlightKeyword(site.name)"></div>
                  <div class="item-url">{{ site.url }}</div>
                </div>
              </div>
            </div>
            
            <!-- 搜索历史 -->
            <div v-if="!searchKeyword && searchHistory.length > 0" class="search-section">
              <div class="section-title">
                <span>搜索历史</span>
                <el-button text size="small" @click="clearSearchHistory">
                  清空
                </el-button>
              </div>
              <div class="history-tags">
                <el-tag
                  v-for="(keyword, index) in searchHistory"
                  :key="index"
                  @click="searchKeyword = keyword; handleSearch()"
                  @close="removeHistoryItem(index)"
                  closable
                  style="cursor: pointer; margin: 4px;"
                >
                  {{ keyword }}
                </el-tag>
              </div>
            </div>
            
            <!-- 热门分类快捷入口 -->
            <div v-if="!searchKeyword && topCategories.length > 0" class="search-section">
              <div class="section-title">热门分类</div>
              <div class="quick-categories">
                <div
                  v-for="category in topCategories"
                  :key="category.id"
                  class="quick-category"
                  @mousedown="selectCategoryAndClose(category.id)"
                >
                  <el-icon :color="category.color">
                    <component :is="category.icon" />
                  </el-icon>
                  <span>{{ category.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div class="header-actions">
        <el-button :icon="Plus" type="primary" @click="showAddSiteDialog = true">
          添加站点
        </el-button>
        <el-button :icon="Setting" circle @click="$router.push('/settings')" />
        <el-dropdown v-if="authStore.isAuthenticated()">
          <el-button circle>
            <el-icon><User /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item disabled>
                {{ authStore.user?.username }}
              </el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button v-else type="primary" @click="$router.push('/login')">
          登录
        </el-button>
      </div>
    </header>

    <div class="main-content">
      <!-- 左侧分类导航 -->
      <aside class="category-nav" :class="{ collapsed: navCollapsed }">
        <div class="nav-header">
          <span v-if="!navCollapsed">分类导航</span>
          <el-button
            :icon="navCollapsed ? Expand : Fold"
            circle
            size="small"
            @click="navCollapsed = !navCollapsed"
          />
        </div>
        
        <div class="category-list">
          <div
            v-for="category in categories"
            :key="category.id"
            class="category-item"
            :class="{ active: selectedCategoryId === category.id }"
            @click="selectCategory(category.id)"
          >
            <el-icon :color="category.color">
              <component :is="category.icon" />
            </el-icon>
            <span v-if="!navCollapsed" class="category-name">{{ category.name }}</span>
          </div>
        </div>

        <div class="nav-footer">
          <el-button
            v-if="!navCollapsed"
            :icon="Plus"
            text
            @click="showCategoryDialog = true"
          >
            新建分类
          </el-button>
        </div>
      </aside>

      <!-- 主体内容区 -->
      <main class="content-area">
        <!-- 快速访问区 -->
        <section v-if="quickAccessSites.length > 0" class="quick-access">
          <h2>快速访问</h2>
          <div class="site-grid">
            <div
              v-for="site in quickAccessSites"
              :key="site.id"
              class="site-card quick"
              @click="visitSite(site)"
            >
              <div class="site-icon">
                <img v-if="site.iconUrl" :src="site.iconUrl" :alt="site.name" />
                <el-icon v-else><Link /></el-icon>
              </div>
              <div class="site-name">{{ site.name }}</div>
            </div>
          </div>
        </section>

        <!-- 站点列表区 -->
        <section class="site-list">
          <div class="section-header">
            <h2>{{ selectedCategoryName || '全部站点' }}</h2>
            <el-radio-group v-model="viewMode" size="small">
              <el-radio-button label="grid">
                <el-icon><Grid /></el-icon>
              </el-radio-button>
              <el-radio-button label="list">
                <el-icon><List /></el-icon>
              </el-radio-button>
            </el-radio-group>
          </div>

          <div class="site-grid" :class="viewMode">
            <div
              v-for="site in displaySites"
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
                <div class="site-meta">
                  <span>访问 {{ site.visitCount }} 次</span>
                </div>
              </div>
              <div class="site-actions">
                <el-button :icon="Edit" circle size="small" @click.stop="editSite(site)" />
                <el-button :icon="Delete" circle size="small" @click.stop="deleteSiteConfirm(site)" />
              </div>
            </div>
          </div>

          <el-empty v-if="displaySites.length === 0" description="暂无站点数据" />
        </section>
      </main>
    </div>

    <!-- 添加/编辑站点对话框 -->
    <SiteDialog
      v-model="showAddSiteDialog"
      :site="editingSite"
      @confirm="handleAddSite"
      @update:modelValue="(val) => { if (!val) handleDialogClose() }"
    />

    <!-- 分类管理对话框 -->
    <CategoryDialog
      v-model="showCategoryDialog"
      @confirm="handleAddCategory"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search, Plus, Setting, Expand, Fold, Link, Edit, Delete, Grid, List, User
} from '@element-plus/icons-vue'
import { useSiteStore } from '@/stores/site'
import { useCategoryStore } from '@/stores/category'
import { useTagStore } from '@/stores/tag'
import { useAuthStore } from '@/stores/auth'
import SiteDialog from '@/components/SiteDialog.vue'
import CategoryDialog from '@/components/CategoryDialog.vue'
import type { Site } from '@/types'

const router = useRouter()
const siteStore = useSiteStore()
const categoryStore = useCategoryStore()
const tagStore = useTagStore()
const authStore = useAuthStore()

// 状态
const searchKeyword = ref('')
const showSearchPanel = ref(false)
const searchResults = ref<Site[]>([])
const searchHistory = ref<string[]>([])
const navCollapsed = ref(false)
const selectedCategoryId = ref<number>()
const viewMode = ref<'grid' | 'list'>('grid')
const showAddSiteDialog = ref(false)
const showCategoryDialog = ref(false)
const editingSite = ref<Site | undefined>()
let searchTimeout: number | null = null

// 计算属性
const categories = computed(() => categoryStore.categories)
const quickAccessSites = computed(() => siteStore.quickAccessSites)
const topCategories = computed(() => {
  // 返回前5个分类
  return categories.value.slice(0, 5)
})
const selectedCategoryName = computed(() => {
  const category = categories.value.find(c => c.id === selectedCategoryId.value)
  return category?.name
})

const displaySites = computed(() => {
  if (selectedCategoryId.value) {
    // 注意：现在返回的是 Promise，需要在组件层处理
    return siteStore.sites.filter(site => {
      if (site.categoryIds) {
        const categoryIdArray = site.categoryIds.split(',').filter(Boolean).map(Number)
        return categoryIdArray.includes(selectedCategoryId.value!)
      }
      return false
    })
  }
  return siteStore.sites
})

// 方法
const selectCategory = (id: number) => {
  selectedCategoryId.value = selectedCategoryId.value === id ? undefined : id
}

const selectCategoryAndClose = (id: number) => {
  selectedCategoryId.value = id
  showSearchPanel.value = false
  searchKeyword.value = ''
}

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    // 添加到搜索历史
    addToSearchHistory(searchKeyword.value.trim())
    router.push({ path: '/search', query: { q: searchKeyword.value } })
    showSearchPanel.value = false
  }
}

const onSearchInput = () => {
  // 防抖搜索
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  if (!searchKeyword.value.trim()) {
    searchResults.value = []
    return
  }
  
  searchTimeout = window.setTimeout(() => {
    performSearch()
  }, 300)
}

const performSearch = () => {
  const keyword = searchKeyword.value.toLowerCase().trim()
  if (!keyword) {
    searchResults.value = []
    return
  }
  
  // 实时搜索，最多显示8个结果
  searchResults.value = siteStore.sites
    .filter(site => 
      site.name.toLowerCase().includes(keyword) || 
      site.url.toLowerCase().includes(keyword)
    )
    .slice(0, 8)
}

const onSearchBlur = () => {
  // 延迟关闭，给点击事件时间
  setTimeout(() => {
    showSearchPanel.value = false
  }, 200)
}

const highlightKeyword = (text: string) => {
  if (!searchKeyword.value) return text
  const keyword = searchKeyword.value.trim()
  const regex = new RegExp(`(${keyword})`, 'gi')
  return text.replace(regex, '<span style="color: #409eff; font-weight: 600;">$1</span>')
}

const visitSiteFromSearch = (site: Site) => {
  visitSite(site)
  showSearchPanel.value = false
  searchKeyword.value = ''
}

const addToSearchHistory = (keyword: string) => {
  // 移除重复项
  const index = searchHistory.value.indexOf(keyword)
  if (index > -1) {
    searchHistory.value.splice(index, 1)
  }
  // 添加到开头
  searchHistory.value.unshift(keyword)
  // 最多保存10条
  if (searchHistory.value.length > 10) {
    searchHistory.value.pop()
  }
  // 保存到 localStorage
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

const clearSearchHistory = () => {
  searchHistory.value = []
  localStorage.removeItem('searchHistory')
}

const removeHistoryItem = (index: number) => {
  searchHistory.value.splice(index, 1)
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

const visitSite = async (site: Site) => {
  try {
    await siteStore.incrementVisit(site.id)
    window.open(site.url, '_blank')
  } catch (error) {
    console.error('访问站点失败:', error)
  }
}

const editSite = (site: Site) => {
  console.log('编辑站点:', site)
  editingSite.value = site
  showAddSiteDialog.value = true
}

const deleteSiteConfirm = async (site: Site) => {
  console.log('删除站点:', site)
  try {
    await ElMessageBox.confirm(
      '确定要删除这个站点吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    await siteStore.deleteSite(site.id)
    ElMessage.success('删除成功')
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const handleAddSite = async (siteData: any) => {
  try {
    if (editingSite.value) {
      // 编辑模式：更新站点
      await siteStore.updateSite(editingSite.value.id, siteData)
      ElMessage.success('更新成功')
    } else {
      // 新增模式：添加站点
      await siteStore.addSite(siteData)
      ElMessage.success('添加成功')
    }
    editingSite.value = undefined
  } catch (error) {
    ElMessage.error(editingSite.value ? '更新失败' : '添加失败')
  }
}

const handleDialogClose = () => {
  editingSite.value = undefined
}

const handleAddCategory = async (category: any) => {
  try {
    await categoryStore.addCategory(category)
    ElMessage.success('分类创建成功')
  } catch (error) {
    ElMessage.error('分类创建失败')
  }
}

const handleLogout = () => {
  authStore.logout()
  ElMessage.success('退出成功')
  router.push('/login')
}

onMounted(async () => {
  // 加载认证信息
  authStore.loadFromStorage()
  
  // 加载搜索历史
  const savedHistory = localStorage.getItem('searchHistory')
  if (savedHistory) {
    try {
      searchHistory.value = JSON.parse(savedHistory)
    } catch (e) {
      console.error('加载搜索历史失败:', e)
    }
  }
  
  // 检查是否已登录
  if (!authStore.isAuthenticated()) {
    ElMessage.warning('请先登录后使用')
    router.push('/login')
    return
  }
  
  try {
    // 并行加载所有数据
    await Promise.all([
      categoryStore.loadFromServer(),
      siteStore.loadFromServer(),
      tagStore.loadFromServer()
    ])
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败，请检查后端服务是否启动')
  }
})
</script>

<style scoped lang="scss">
.home-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%);
}

.header {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px 40px;
  background: linear-gradient(to right, #ffffff 0%, #f8f9fa 100%);
  border-bottom: 1px solid rgba(240, 240, 240, 0.8);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);

  .logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 700;
    color: #1a1a1a;
    white-space: nowrap;
    letter-spacing: -0.5px;
    
    .el-icon {
      color: #409eff;
    }
  }

  .search-container {
    flex: 1;
    max-width: 600px;
    position: relative;
  }

  .search-bar {
    width: 100%;
    
    :deep(.el-input) {
      .el-input__wrapper {
        border-radius: 24px;
        padding: 0 16px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
        
        &:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        }
        
        &.is-focus {
          box-shadow: 0 4px 20px rgba(64, 158, 255, 0.2);
        }
      }
      
      .el-input__inner {
        font-size: 14px;
      }
    }
  }
  
  .search-panel {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    max-height: 480px;
    overflow-y: auto;
    z-index: 1000;
    
    .search-section {
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .section-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 13px;
        font-weight: 600;
        color: #999999;
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }
    
    .search-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background: #f5f7fa;
      }
      
      .item-icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f7fa;
        flex-shrink: 0;
        
        img {
          width: 24px;
          height: 24px;
        }
        
        .el-icon {
          font-size: 20px;
          color: #999999;
        }
      }
      
      .item-info {
        flex: 1;
        min-width: 0;
        
        .item-name {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .item-url {
          font-size: 12px;
          color: #999999;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    
    .history-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .quick-categories {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 8px;
      
      .quick-category {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px;
        border-radius: 8px;
        border: 1px solid #f0f0f0;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 14px;
        
        &:hover {
          border-color: #409eff;
          background: #f5f7fa;
        }
        
        .el-icon {
          font-size: 18px;
        }
      }
    }
  }

  .header-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }
}

// 搜索面板动画
.search-panel-enter-active,
.search-panel-leave-active {
  transition: all 0.3s ease;
}

.search-panel-enter-from,
.search-panel-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.category-nav {
  width: 240px;
  background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
  border-right: 1px solid rgba(240, 240, 240, 0.8);
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.03);

  &.collapsed {
    width: 64px;

    .category-name {
      display: none;
    }
  }

  .nav-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
    font-weight: 600;
    font-size: 14px;
    color: #1a1a1a;
  }

  .category-list {
    flex: 1;
    overflow-y: auto;
    padding: 12px 0;
  }

  .category-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 20px;
    margin: 2px 8px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 8px;
    font-size: 14px;
    color: #666666;
    position: relative;
    overflow: hidden;
    
    // 滑过背景效果
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(64, 158, 255, 0.1), transparent);
      transition: left 0.5s ease;
    }

    &:hover {
      background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
      color: #1a1a1a;
      transform: translateX(4px);
      
      &::before {
        left: 100%;
      }
    }

    &.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      transform: translateX(4px);
      
      &::before {
        display: none;
      }
    }

    .category-name {
      flex: 1;
      font-weight: 500;
    }

    .el-icon {
      font-size: 16px;
    }
  }

  .nav-footer {
    padding: 16px;
    border-top: 1px solid #f0f0f0;
  }
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 40px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  position: relative;
  
  // 背景装饰元素
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(64, 158, 255, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(103, 58, 183, 0.03) 0%, transparent 50%);
    pointer-events: none;
  }
}

.quick-access, .site-list {
  margin-bottom: 48px;

  h2 {
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
    letter-spacing: -0.3px;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
}

.site-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;

  &.list {
    grid-template-columns: 1fr;
    
    .site-card {
      padding: 24px;
      
      .site-icon {
        width: 72px;
        height: 72px;
        
        img {
          width: 48px;
          height: 48px;
        }
        
        .el-icon {
          font-size: 36px;
        }
      }
      
      .site-info {
        .site-name {
          font-size: 18px;
        }
        
        .site-url {
          font-size: 14px;
        }
        
        .site-meta {
          font-size: 13px;
        }
      }
    }
  }

  &.quick .site-card {
    background: linear-gradient(145deg, #ffffff 0%, #f0f7ff 100%);
    border: 1px solid rgba(64, 158, 255, 0.15);

    &:hover {
      border-color: rgba(64, 158, 255, 0.4);
      transform: translateY(-4px) scale(1.03);
      box-shadow: 
        0 12px 32px rgba(64, 158, 255, 0.2),
        0 4px 16px rgba(0, 0, 0, 0.08);
    }
  }
}

.site-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid rgba(240, 240, 240, 0.8);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  min-height: 100px;
  overflow: hidden;
  
  // 光泽效果
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 30%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 70%
    );
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
    transition: transform 0.6s ease;
  }
  
  // 边框高光
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    padding: 1px;
    background: linear-gradient(135deg, rgba(64, 158, 255, 0.1), rgba(103, 58, 183, 0.1));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: rgba(64, 158, 255, 0.3);
    transform: translateY(-6px) scale(1.02);
    box-shadow: 
      0 12px 32px rgba(64, 158, 255, 0.15),
      0 4px 16px rgba(0, 0, 0, 0.08);
    background: linear-gradient(145deg, #ffffff 0%, #f0f4ff 100%);
    
    &::before {
      transform: translateX(100%) translateY(100%) rotate(45deg);
    }
    
    &::after {
      opacity: 1;
    }

    .site-actions {
      opacity: 1;
      pointer-events: auto;
    }
    
    .site-icon {
      transform: scale(1.05);
    }
  }

  .site-icon {
    width: 64px;
    height: 64px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    flex-shrink: 0;
    transition: all 0.3s ease;
    position: relative;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
    
    // 图标内阴影
    &::before {
      content: '';
      position: absolute;
      inset: 3px;
      border-radius: 11px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%);
      pointer-events: none;
    }

    img {
      width: 40px;
      height: 40px;
      position: relative;
      z-index: 1;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }

    .el-icon {
      font-size: 32px;
      color: #ffffff;
      position: relative;
      z-index: 1;
    }
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
      color: #1a1a1a;
      line-height: 1.4;
    }

    .site-url {
      font-size: 13px;
      color: #999999;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 4px;
    }

    .site-meta {
      font-size: 12px;
      color: #c0c0c0;
      margin-top: 6px;
    }
  }

  .site-actions {
    display: flex;
    gap: 8px;
    // 临时显示按钮用于测试
    opacity: 1;  // 改为 1 使按钮始终可见
    transition: opacity 0.3s ease;
    position: relative;
    z-index: 10;
    
    .el-button {
      background: rgba(255, 255, 255, 0.95);
      border-color: #e0e0e0;
      
      &:hover {
        background: #ffffff;
        border-color: #409eff;
        color: #409eff;
        transform: scale(1.1);
      }
    }
  }

  &.quick {
    flex-direction: column;
    text-align: center;
    padding: 28px;
    min-height: 160px;
    background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%);
    
    &:hover {
      background: linear-gradient(135deg, #ffffff 0%, #e3f2ff 100%);
      box-shadow: 
        0 12px 32px rgba(64, 158, 255, 0.18),
        0 4px 16px rgba(0, 0, 0, 0.08);
    }

    .site-icon {
      width: 80px;
      height: 80px;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      box-shadow: 0 6px 20px rgba(79, 172, 254, 0.35);

      img {
        width: 48px;
        height: 48px;
      }

      .el-icon {
        font-size: 40px;
      }
    }

    .site-name {
      font-size: 14px;
      font-weight: 600;
    }

    .site-actions {
      display: none;
    }
  }
}

@media (max-width: 768px) {
  .category-nav {
    width: 64px;

    .category-name {
      display: none;
    }
  }

  .header {
    .logo {
      font-size: 16px;
    }
  }
}
</style>
