<template>
  <div class="wallpapers-page">
    <div class="page-content">
      <aside class="filter-sidebar">
        <div class="filter-section">
          <h3>分类筛选</h3>
          <div class="filter-options">
            <button 
              class="filter-btn"
              :class="{ active: !currentCategory }"
              @click="filterByCategory(null)"
            >
              全部
            </button>
            <button 
              v-for="category in categories" 
              :key="category.id"
              class="filter-btn"
              :class="{ active: currentCategory == category.id }"
              @click="filterByCategory(category.id)"
            >
              {{ category.name }}
            </button>
          </div>
        </div>
        
        <div class="filter-section">
          <h3>排序方式</h3>
          <div class="filter-options">
            <button 
              v-for="sort in sortOptions" 
              :key="sort.value"
              class="filter-btn"
              :class="{ active: currentSort === sort.value }"
              @click="filterBySort(sort.value)"
            >
              {{ sort.label }}
            </button>
          </div>
        </div>
      </aside>
      
      <main class="wallpaper-list">
        <div class="list-header">
          <div class="result-info">
            共找到 <span class="count">{{ total }}</span> 张壁纸
          </div>
          <div class="view-toggle">
            <button 
              class="toggle-btn"
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
            >
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="currentColor" d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z"/>
              </svg>
            </button>
            <button 
              class="toggle-btn"
              :class="{ active: viewMode === 'waterfall' }"
              @click="viewMode = 'waterfall'"
            >
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="currentColor" d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
        </div>
        
        <template v-else>
          <div 
            class="wallpaper-grid"
            :class="viewMode"
          >
            <WallpaperCard 
              v-for="wallpaper in wallpapers" 
              :key="wallpaper.id"
              :wallpaper="wallpaper"
              @click="goToDetail(wallpaper.id)"
            />
          </div>
          
          <div v-if="wallpapers.length === 0" class="empty-state">
            <div class="empty-icon">📭</div>
            <p class="empty-text">暂无相关壁纸</p>
          </div>
          
          <div v-if="hasMore" class="load-more">
            <button class="load-btn" @click="loadMore" :disabled="loadingMore">
              {{ loadingMore ? '加载中...' : '加载更多' }}
            </button>
          </div>
        </template>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WallpaperCard from '@/components/common/WallpaperCard.vue'
import { getWallpaperList, getCategories } from '@/api/wallpaper'

const route = useRoute()
const router = useRouter()

const wallpapers = ref([])
const categories = ref([])
const loading = ref(true)
const loadingMore = ref(false)
const hasMore = ref(true)
const total = ref(0)
const viewMode = ref('grid')
const currentCategory = ref(null)
const currentSort = ref('new')
const page = ref(1)

const sortOptions = [
  { value: 'new', label: '最新' },
  { value: 'hot', label: '热门' },
  { value: 'download', label: '下载量' },
  { value: 'like', label: '点赞数' }
]

const fetchWallpapers = async (reset = false) => {
  if (reset) {
    page.value = 1
    wallpapers.value = []
  }
  
  loading.value = reset
  loadingMore.value = !reset
  
  try {
    const params = {
      page: page.value,
      limit: 20,
      sort: currentSort.value
    }
    
    if (currentCategory.value) {
      params.category = categories.value.find(c => c.id === currentCategory.value)?.name || currentCategory.value
    }
    
    const keyword = route.query.keyword
    if (keyword) {
      params.keyword = keyword
    }
    
    const res = await getWallpaperList(params)
    
    const list = Array.isArray(res) ? res : (res?.list || [])
    wallpapers.value = reset ? list : [...wallpapers.value, ...list]
    total.value = res?.pagination?.total || list.length
    hasMore.value = list.length === 20
  } catch (err) {
    console.error('获取壁纸列表失败:', err)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const loadMore = () => {
  if (!loadingMore.value && hasMore.value) {
    page.value++
    fetchWallpapers(false)
  }
}

const filterByCategory = (categoryId) => {
  currentCategory.value = categoryId
  router.push({ query: { ...route.query, category: categoryId } })
  fetchWallpapers(true)
}

const filterBySort = (sort) => {
  currentSort.value = sort
  fetchWallpapers(true)
}

const goToDetail = (id) => {
  router.push(`/wallpaper/${id}`)
}

onMounted(async () => {
  currentCategory.value = route.query.category ? parseInt(route.query.category) : null
  currentSort.value = route.query.sort || 'new'
  viewMode.value = route.query.view || 'grid'
  
  try {
    categories.value = await getCategories() || []
  } catch (err) {
    console.error('获取分类失败:', err)
  }
  
  await fetchWallpapers(true)
})

watch(() => route.query.keyword, () => {
  fetchWallpapers(true)
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.wallpapers-page {
  min-height: 100vh;
  background: #f8f9ff;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 0;
  text-align: center;
  color: #fff;
  
  h1 {
    font-size: 42px;
    font-weight: 700;
    margin-bottom: 10px;
  }
  
  p {
    font-size: 18px;
    opacity: 0.9;
  }
}

.page-content {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 40px;
  gap: 30px;
}

.filter-sidebar {
  width: 220px;
  flex-shrink: 0;
  
  .filter-section {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    
    h3 {
      font-size: 15px;
      font-weight: 600;
      color: #333;
      margin-bottom: 15px;
    }
    
    .filter-options {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .filter-btn {
        padding: 8px 14px;
        border-radius: 16px;
        font-size: 13px;
        background: #f5f5f7;
        color: #666;
        border: none;
        transition: all 0.2s ease;
        
        &:hover {
          background: #e8e8eb;
        }
        
        &.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
        }
      }
    }
  }
}

.wallpaper-list {
  flex: 1;
  min-width: 0;
}

.list-header {
  @include flex-between;
  margin-bottom: 25px;
  
  .result-info {
    font-size: 15px;
    color: #666;
    
    .count {
      color: #667eea;
      font-weight: 600;
    }
  }
  
  .view-toggle {
    display: flex;
    gap: 8px;
    
    .toggle-btn {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: #fff;
      border: none;
      color: #999;
      @include flex-center;
      transition: all 0.2s ease;
      
      &:hover {
        color: #667eea;
      }
      
      &.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
      }
    }
  }
}

.wallpaper-grid {
  &.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
  }
  
  &.waterfall {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    
    :deep(.wallpaper-card) {
      width: calc(20% - 12px);
    }
  }
}

.load-more {
  @include flex-center;
  margin-top: 40px;
  
  .load-btn {
    padding: 12px 40px;
    background: #fff;
    border: 2px solid #667eea;
    color: #667eea;
    font-size: 15px;
    font-weight: 600;
    border-radius: 25px;
    transition: all 0.3s ease;
    
    &:hover:not(:disabled) {
      background: #667eea;
      color: #fff;
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

@media (max-width: 992px) {
  .page-content {
    flex-direction: column;
    padding: 20px;
  }
  
  .filter-sidebar {
    width: 100%;
    
    .filter-section .filter-options {
      justify-content: flex-start;
    }
  }
  
  .wallpaper-grid.grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
  
  .wallpaper-grid.waterfall :deep(.wallpaper-card) {
    width: calc(33.33% - 10px);
  }
}

@media (max-width: 576px) {
  .wallpaper-grid.grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
  
  .wallpaper-grid.waterfall :deep(.wallpaper-card) {
    width: calc(50% - 8px);
  }
}
</style>
