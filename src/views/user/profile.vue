<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="container">
        <div class="profile-card">
          <img :src="avatarUrl" class="profile-avatar">
          <div class="profile-info">
            <h1 class="profile-name">{{ userInfo.nickname || userInfo.username }}</h1>
            <p class="profile-username">@{{ userInfo.username }}</p>
            <p class="profile-bio" v-if="userInfo.bio">{{ userInfo.bio }}</p>
          </div>
          <div class="profile-actions">
            <router-link to="/user/collections" class="action-btn">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
              我的收藏
            </router-link>
            <router-link to="/user/uploads" class="action-btn">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z"/>
              </svg>
              我的上传
            </router-link>
            <button class="action-btn logout-btn" @click="handleLogout">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              退出登录
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="profile-content">
      <div class="container">
        <div class="recent-section">
          <h2>最近上传</h2>
          <div class="wallpaper-grid" v-if="recentWallpapers.length">
            <WallpaperCard 
              v-for="wallpaper in recentWallpapers" 
              :key="wallpaper.id"
              :wallpaper="wallpaper"
              @click="goToDetail(wallpaper.id)"
            />
          </div>
          <div class="empty-state" v-else>
            <div class="empty-icon">📭</div>
            <p class="empty-text">还没有上传过壁纸</p>
            <router-link to="/upload" class="upload-link">去上传</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import WallpaperCard from '@/components/common/WallpaperCard.vue'
import defaultAvatar from '@/assets/images/default-avatar.svg'
import { getUserUploads } from '@/api/wallpaper'
import { getImageUrl } from '@/utils/image'

const router = useRouter()
const userStore = useUserStore()

const recentWallpapers = ref([])

const userInfo = computed(() => userStore.userInfo || {})

const avatarUrl = computed(() => {
  return getImageUrl(userInfo.value.avatar) || defaultAvatar
})

const goToDetail = (id) => {
  router.push(`/wallpaper/${id}`)
}

const handleLogout = () => {
  userStore.logout()
  router.push('/')
}

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  console.log('登录状态:', userStore.isLoggedIn)
  console.log('当前用户信息:', userInfo.value)
  
  await userStore.fetchUserInfo()
  
  console.log('获取后用户信息:', userInfo.value)
  
  try {
    const res = await getUserUploads({ limit: 4 })
    recentWallpapers.value = (res && res.wallpapers) ? res.wallpapers : (res || [])
  } catch (err) {
    console.error('获取上传列表失败:', err)
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.profile-page {
  min-height: 100vh;
  background: #f8f9ff;
}

.profile-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 0;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 40px;
  
  .profile-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 4px solid #fff;
    object-fit: cover;
  }
  
  .profile-info {
    flex: 1;
    color: #fff;
    
    .profile-name {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 5px;
    }
    
    .profile-username {
      font-size: 15px;
      opacity: 0.9;
      margin-bottom: 10px;
    }
    
    .profile-bio {
      font-size: 14px;
      opacity: 0.85;
      margin-bottom: 15px;
    }
    
    .profile-stats {
      display: flex;
      gap: 40px;
      
      .stat-item {
        text-align: center;
        
        .stat-num {
          display: block;
          font-size: 24px;
          font-weight: 700;
        }
        
        .stat-label {
          font-size: 13px;
          opacity: 0.85;
        }
      }
    }
  }
  
  .profile-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .action-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 24px;
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
      border-radius: 25px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateX(5px);
      }
      
      &.logout-btn {
        background: rgba(255, 75, 75, 0.2);
        
        &:hover {
          background: rgba(255, 75, 75, 0.3);
        }
      }
    }
  }
}

.profile-content {
  padding: 50px 0;
  
  h2 {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin-bottom: 30px;
  }
}

.wallpaper-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
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

@media (max-width: 992px) {
  .profile-card {
    flex-direction: column;
    text-align: center;
    
    .profile-stats {
      justify-content: center;
    }
    
    .profile-actions {
      flex-direction: row;
      justify-content: center;
      flex-wrap: wrap;
    }
  }
}
</style>
