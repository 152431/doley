<template>
  <div class="rank-page">
    <div class="page-content">
      <div class="container">
        <div class="rank-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.value"
            class="tab-btn"
            :class="{ active: currentTab === tab.value }"
            @click="currentTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>
        
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
        </div>
        
        <div v-else class="rank-list">
          <div 
            class="rank-item" 
            v-for="(item, index) in rankList" 
            :key="item.id"
            @click="goToDetail(item.id)"
          >
            <div class="rank-num" :class="{ top: index < 3 }">{{ index + 1 }}</div>
            <div class="rank-cover">
              <img :src="getImageUrl(item.image_url || item.thumbnail)" :alt="item.title">
            </div>
            <div class="rank-info">
              <h3 class="rank-title">{{ item.title }}</h3>
              <p class="rank-author">分类：{{ item.category_name || item.category }}</p>
              <div class="rank-stats">
                <span class="stat">
                  <svg viewBox="0 0 24 24" width="14" height="14">
                    <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  {{ item.likes }}
                </span>
                <span class="stat">
                  <svg viewBox="0 0 24 24" width="14" height="14">
                    <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                  {{ item.downloads }}
                </span>
                <span class="stat">
                  <svg viewBox="0 0 24 24" width="14" height="14">
                    <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                  {{ item.views }}
                </span>
              </div>
            </div>
            <div class="rank-trend" :class="getTrendClass(item)">
              <span v-if="item.trend > 0">↑ {{ item.trend }}</span>
              <span v-else-if="item.trend < 0">↓ {{ Math.abs(item.trend) }}</span>
              <span v-else>—</span>
            </div>
          </div>
        </div>
        
        <div v-if="!loading && rankList.length === 0" class="empty-state">
          <div class="empty-icon">🏆</div>
          <p class="empty-text">暂无数据</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getRankList } from '@/api/wallpaper'
import { getImageUrl } from '@/utils/image'

const router = useRouter()

const currentTab = ref('download')
const rankList = ref([])
const loading = ref(true)

const tabs = [
  { value: 'download', label: '下载排行' },
  { value: 'like', label: '点赞排行' },
  { value: 'views', label: '浏览排行' },
  { value: 'hot', label: '热门排行' }
]

const fetchRank = async () => {
  loading.value = true
  try {
    rankList.value = await getRankList(currentTab.value) || []
  } catch (err) {
    console.error('获取排行榜失败:', err)
  } finally {
    loading.value = false
  }
}

const getTrendClass = (item) => {
  if (!item.trend) return 'same'
  return item.trend > 0 ? 'up' : 'down'
}

const goToDetail = (id) => {
  router.push(`/wallpaper/${id}`)
}

onMounted(() => {
  fetchRank()
})

watch(currentTab, () => {
  fetchRank()
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.rank-page {
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
  padding: 24px 0 60px;
}

.rank-tabs {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
  
  .tab-btn {
    padding: 12px 28px;
    background: #fff;
    border: 2px solid #eee;
    border-radius: 25px;
    font-size: 15px;
    font-weight: 500;
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;
    
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

.rank-list {
  max-width: 900px;
  margin: 0 auto;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 18px 25px;
  background: #fff;
  border-radius: 14px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(5px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  }
  
  .rank-num {
    width: 40px;
    height: 40px;
    @include flex-center;
    background: #f0f0f5;
    border-radius: 10px;
    font-size: 18px;
    font-weight: 700;
    color: #666;
    
    &.top {
      background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
      color: #fff;
    }
    
    &:nth-child(1) {
      background: linear-gradient(135deg, #ffd700 0%, #ff9500 100%);
    }
    
    &:nth-child(2) {
      background: linear-gradient(135deg, #c0c0c0 0%, #a0a0a0 100%);
    }
    
    &:nth-child(3) {
      background: linear-gradient(135deg, #cd7f32 0%, #b87333 100%);
    }
  }
  
  .rank-cover {
    width: 80px;
    height: 60px;
    border-radius: 8px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .rank-info {
    flex: 1;
    
    .rank-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 5px;
    }
    
    .rank-author {
      font-size: 13px;
      color: #999;
      margin-bottom: 8px;
    }
    
    .rank-stats {
      display: flex;
      gap: 15px;
      
      .stat {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 13px;
        color: #888;
      }
    }
  }
  
  .rank-trend {
    width: 60px;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    
    &.up {
      color: #52c41a;
    }
    
    &.down {
      color: #ff4d4f;
    }
    
    &.same {
      color: #999;
    }
  }
}
</style>
