<template>
  <div class="collections-page">
    <div class="page-header">
      <div class="container">
        <h1>我的收藏</h1>
        <p>收藏的壁纸都在这里</p>
      </div>
    </div>
    
    <div class="page-content">
      <div class="container">
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
        </div>
        
        <div v-else class="wallpaper-grid">
          <WallpaperCard 
            v-for="wallpaper in collections" 
            :key="wallpaper.id"
            :wallpaper="wallpaper"
            @click="goToDetail(wallpaper.id)"
          />
        </div>
        
        <div v-if="!loading && collections.length === 0" class="empty-state">
          <div class="empty-icon">⭐</div>
          <p class="empty-text">还没有收藏任何壁纸</p>
          <router-link to="/wallpapers" class="browse-link">去逛逛</router-link>
        </div>
        
        <div v-if="hasMore" class="load-more">
          <button class="load-btn" @click="loadMore" :disabled="loadingMore">
            {{ loadingMore ? '加载中...' : '加载更多' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import WallpaperCard from '@/components/common/WallpaperCard.vue'
import { getUserCollections } from '@/api/wallpaper'

const router = useRouter()
const userStore = useUserStore()

const collections = ref([])
const loading = ref(true)
const loadingMore = ref(false)
const hasMore = ref(true)
const page = ref(1)

const goToDetail = (id) => {
  router.push(`/wallpaper/${id}`)
}

const fetchCollections = async (reset = false) => {
  if (reset) {
    page.value = 1
    collections.value = []
  }
  
  loading.value = reset
  loadingMore.value = !reset
  
  try {
    const res = await getUserCollections({ page: page.value, limit: 20 })
    const list = res?.list || res || []
    collections.value = reset ? list : [...collections.value, ...list]
    hasMore.value = list.length === 20
  } catch (err) {
    console.error('获取收藏列表失败:', err)
    collections.value = []
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const loadMore = () => {
  if (!loadingMore.value && hasMore.value) {
    page.value++
    fetchCollections(false)
  }
}

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  await fetchCollections(true)
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.collections-page {
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
  padding: 40px 0 80px;
}

.wallpaper-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
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

.empty-state {
  @include flex-center;
  flex-direction: column;
  padding: 80px 20px;
  
  .empty-icon {
    font-size: 64px;
    margin-bottom: 20px;
  }
  
  .empty-text {
    font-size: 16px;
    color: #999;
    margin-bottom: 20px;
  }
  
  .browse-link {
    color: #667eea;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
