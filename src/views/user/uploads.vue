<template>
  <div class="uploads-page">
    <div class="page-header">
      <div class="container">
        <h1>我的上传</h1>
        <p>查看和管理已上传的壁纸</p>
      </div>
    </div>
    
    <div class="page-content">
      <div class="container">
        <div class="uploads-header">
          <div class="tabs">
            <button 
              class="tab-btn"
              :class="{ active: currentTab === 'all' }"
              @click="currentTab = 'all'"
            >
              全部
            </button>
            <button 
              class="tab-btn"
              :class="{ active: currentTab === 'pending' }"
              @click="currentTab = 'pending'"
            >
              待审核
            </button>
            <button 
              class="tab-btn"
              :class="{ active: currentTab === 'approved' }"
              @click="currentTab = 'approved'"
            >
              已通过
            </button>
            <button 
              class="tab-btn"
              :class="{ active: currentTab === 'rejected' }"
              @click="currentTab = 'rejected'"
            >
              已拒绝
            </button>
          </div>
        </div>
        
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
        </div>
        
        <div v-else class="wallpaper-grid">
          <div class="wallpaper-item" v-for="wallpaper in uploads" :key="wallpaper.id">
            <div class="item-cover">
              <img :src="getImageUrl(wallpaper.image_url || wallpaper.thumbnail)" :alt="wallpaper.title">
              <div class="status-badge" :class="wallpaper.status">
                {{ getStatusText(wallpaper.status) }}
              </div>
            </div>
            <div class="item-info">
              <h3 class="item-title">{{ wallpaper.title }}</h3>
              <p class="item-date">{{ wallpaper.created_at }}</p>
              <div class="item-stats">
                <span class="stat">
                  <svg viewBox="0 0 24 24" width="14" height="14">
                    <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  {{ wallpaper.likes }}
                </span>
                <span class="stat">
                  <svg viewBox="0 0 24 24" width="14" height="14">
                    <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                  {{ wallpaper.downloads }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="!loading && uploads.length === 0" class="empty-state">
          <div class="empty-icon">📤</div>
          <p class="empty-text">还没有上传过壁纸</p>
          <router-link to="/upload" class="upload-link">去上传</router-link>
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
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getUserUploads } from '@/api/wallpaper'
import { getImageUrl } from '@/utils/image'

const router = useRouter()
const userStore = useUserStore()

const uploads = ref([])
const loading = ref(true)
const loadingMore = ref(false)
const hasMore = ref(true)
const page = ref(1)
const currentTab = ref('all')

const getStatusText = (status) => {
  const statusMap = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝'
  }
  return statusMap[status] || status
}

const fetchUploads = async (reset = false) => {
  if (reset) {
    page.value = 1
    uploads.value = []
  }
  
  loading.value = reset
  loadingMore.value = !reset
  
  try {
    const params = { page: page.value, limit: 20 }
    if (currentTab.value !== 'all') {
      params.status = currentTab.value
    }
    
    const res = await getUserUploads(params)
    const list = res?.list || res || []
    uploads.value = reset ? list : [...uploads.value, ...list]
    hasMore.value = list.length === 20
  } catch (err) {
    console.error('获取上传列表失败:', err)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const loadMore = () => {
  if (!loadingMore.value && hasMore.value) {
    page.value++
    fetchUploads(false)
  }
}

watch(currentTab, () => {
  fetchUploads(true)
})

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  await fetchUploads(true)
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.uploads-page {
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

.uploads-header {
  margin-bottom: 30px;
  
  .tabs {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    
    .tab-btn {
      padding: 10px 24px;
      background: #fff;
      border: 2px solid #eee;
      border-radius: 20px;
      font-size: 14px;
      color: #666;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        border-color: #667eea;
        color: #667eea;
      }
      
      &.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-color: transparent;
        color: #fff;
      }
    }
  }
}

.wallpaper-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.wallpaper-item {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  .item-cover {
    position: relative;
    padding-top: 133%;
    
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .status-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      color: #fff;
      
      &.pending {
        background: #faad14;
      }
      
      &.approved {
        background: #52c41a;
      }
      
      &.rejected {
        background: #ff4d4f;
      }
    }
  }
  
  .item-info {
    padding: 15px;
    
    .item-title {
      font-size: 15px;
      font-weight: 600;
      color: #333;
      margin-bottom: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .item-date {
      font-size: 12px;
      color: #999;
      margin-bottom: 10px;
    }
    
    .item-stats {
      display: flex;
      gap: 15px;
      
      .stat {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: #888;
      }
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
  
  .upload-link {
    color: #667eea;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
