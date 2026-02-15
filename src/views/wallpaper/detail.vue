<template>
  <div class="wallpaper-detail" v-if="wallpaper">
    <div class="detail-header">
      <div class="container">
        <button class="back-btn" @click="goBack">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          返回
        </button>
      </div>
    </div>
    
    <div class="detail-content">
      <div class="wallpaper-preview">
        <img :src="mainImageUrl" :alt="wallpaper.title" @click="showFullscreen = true" @error="handleMainImageError">
      </div>
      
      <div class="wallpaper-info">
        <h1 class="wallpaper-title">{{ wallpaper.title }}</h1>
        
        <div class="wallpaper-meta">
          <span class="category-tag">{{ wallpaper.category_name }}</span>
          <span class="meta-item">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            {{ wallpaper.likes }}
          </span>
          <span class="meta-item">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            {{ wallpaper.views }}
          </span>
          <span class="meta-item">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            {{ wallpaper.downloads }}
          </span>
        </div>
        
        <div class="action-buttons">
          <button class="action-btn like-btn" :class="{ active: isLiked }" @click="handleLike">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            {{ isLiked ? '已点赞' : '点赞' }}
          </button>
          <button class="action-btn collect-btn" :class="{ active: isCollected }" @click="handleCollect">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            {{ isCollected ? '已收藏' : '收藏' }}
          </button>
          <button class="action-btn download-btn" @click="handleDownload">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            下载壁纸
          </button>
        </div>
        
        <div class="wallpaper-desc" v-if="wallpaper.description">
          <h3>壁纸说明</h3>
          <p>{{ wallpaper.description }}</p>
        </div>
        
        <div class="wallpaper-tags" v-if="wallpaper.tags?.length">
          <h3>标签</h3>
          <div class="tags-list">
            <span 
              v-for="tag in wallpaper.tags" 
              :key="tag"
              class="tag"
              @click="searchByTag(tag)"
            >
              {{ tag }}
            </span>
          </div>
        </div>
        
        <div class="author-info" v-if="wallpaper.user && wallpaper.user.avatar">
          <h3>上传者</h3>
          <div class="author-card">
            <img :src="getImageUrl(wallpaper.user.avatar) || defaultAvatar" class="author-avatar">
            <div class="author-info-text">
              <span class="author-name">{{ wallpaper.user.nickname || wallpaper.user.username }}</span>
              <span class="upload-time">{{ wallpaper.created_at }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="related-section" v-if="relatedWallpapers.length">
      <div class="container">
        <h2>相关壁纸</h2>
        <div class="related-grid">
          <WallpaperCard 
            v-for="item in relatedWallpapers" 
            :key="item.id"
            :wallpaper="item"
            @click="goToDetail(item.id)"
          />
        </div>
      </div>
    </div>
    
    <div class="comments-section">
      <div class="container">
        <h2>评论 ({{ comments?.length || 0 }})</h2>
        
        <div class="comment-form" v-if="userStore.isLoggedIn">
          <textarea 
            v-model="commentContent"
            placeholder="写下你的评论..."
            rows="3"
          ></textarea>
          <button class="submit-btn" @click="submitComment" :disabled="!commentContent.trim()">
            发布评论
          </button>
        </div>
        <div class="comment-login-tip" v-else>
          <p>登录后可以发表评论哦~</p>
          <router-link to="/login" class="login-link">立即登录</router-link>
        </div>
        
        <div class="comments-list" v-if="comments?.length">
          <div class="comment-item" v-for="comment in comments" :key="comment.id">
            <img :src="comment.user?.avatar ? getImageUrl(comment.user.avatar) : defaultAvatar" class="comment-avatar">
            <div class="comment-content">
              <div class="comment-header">
                <div class="comment-meta">
                  <span class="comment-author">{{ comment.user?.nickname || comment.user?.username }}</span>
                  <span class="comment-time">{{ comment.created_at }}</span>
                </div>
                <button 
                  v-if="comment.user?.id === userStore.userInfo?.id" 
                  class="delete-btn"
                  @click="handleDeleteComment(comment.id)"
                >
                  删除
                </button>
              </div>
              <p class="comment-text">{{ comment.content }}</p>
            </div>
          </div>
        </div>
        <div class="no-comments" v-else-if="!comments?.length">
          暂无评论，快来抢沙发~
        </div>
      </div>
    </div>
    
    <div class="fullscreen-preview" v-if="showFullscreen" @click="showFullscreen = false">
      <img :src="mainImageUrl" :alt="wallpaper.title" @error="handleMainImageError">
    </div>
  </div>
  <div class="loading" v-else>
    <div class="spinner"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import WallpaperCard from '@/components/common/WallpaperCard.vue'
import defaultAvatar from '@/assets/images/default-avatar.svg'
import { getWallpaperDetail, toggleLike, toggleCollect, getWallpaperComments, addComment, deleteComment } from '@/api/wallpaper'
import { getImageUrl } from '@/utils/image'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const wallpaper = ref(null)
const relatedWallpapers = ref([])
const comments = ref([])
const isLiked = ref(false)
const isCollected = ref(false)
const commentContent = ref('')
const showFullscreen = ref(false)

const mainImageUrl = computed(() => {
  if (!wallpaper.value) return ''
  return getImageUrl(wallpaper.value.image_url || wallpaper.value.url)
})

const defaultMainImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop'

const handleMainImageError = (e) => {
  e.target.src = defaultMainImage
}

const goBack = () => {
  router.back()
}

const handleLike = async () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  try {
    await toggleLike(wallpaper.value.id)
    isLiked.value = !isLiked.value
    wallpaper.value.likes += isLiked.value ? 1 : -1
  } catch (err) {
    console.error('点赞失败:', err)
  }
}

const handleCollect = async () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  try {
    await toggleCollect(wallpaper.value.id)
    isCollected.value = !isCollected.value
  } catch (err) {
    console.error('收藏失败:', err)
  }
}

const handleDownload = () => {
  const link = document.createElement('a')
  link.href = mainImageUrl.value
  link.download = `${wallpaper.value.title}.jpg`
  link.click()
}

const submitComment = async () => {
  if (!commentContent.value.trim()) return
  
  try {
    const newComment = await addComment(wallpaper.value.id, commentContent.value)
    comments.value.unshift(newComment)
    commentContent.value = ''
  } catch (err) {
    console.error('评论失败:', err)
    alert(err.response?.data?.message || '评论失败，请重试')
  }
}

const handleDeleteComment = async (commentId) => {
  if (!confirm('确定要删除这条评论吗？')) return
  
  try {
    await deleteComment(wallpaper.value.id, commentId)
    comments.value = comments.value.filter(c => c.id !== commentId)
  } catch (err) {
    console.error('删除评论失败:', err)
    alert(err.response?.data?.message || '删除失败，请重试')
  }
}

const searchByTag = (tag) => {
  router.push({ path: '/wallpapers', query: { keyword: tag } })
}

const goToDetail = (id) => {
  router.push(`/wallpaper/${id}`)
}

onMounted(async () => {
  const id = route.params.id
  
  try {
    const [detailRes, commentsRes] = await Promise.all([
      getWallpaperDetail(id),
      getWallpaperComments(id)
    ])
    
    wallpaper.value = detailRes
    comments.value = commentsRes?.list || []
    
    if (wallpaper.value.user_liked) isLiked.value = true
    if (wallpaper.value.user_collected) isCollected.value = true
  } catch (err) {
    console.error('获取壁纸详情失败:', err)
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.wallpaper-detail {
  min-height: 100vh;
  background: #f8f9ff;
}

.detail-header {
  background: #fff;
  padding: 15px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 70px;
  z-index: 100;
  
  .back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: transparent;
    border: none;
    font-size: 15px;
    color: #666;
    cursor: pointer;
    transition: color 0.2s ease;
    
    &:hover {
      color: #667eea;
    }
  }
}

.detail-content {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px;
  gap: 40px;
}

.wallpaper-preview {
  flex: 1;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  
  img {
    width: 100%;
    height: auto;
    cursor: zoom-in;
  }
}

.wallpaper-info {
  width: 380px;
  flex-shrink: 0;
  
  .wallpaper-title {
    font-size: 26px;
    font-weight: 700;
    color: #333;
    margin-bottom: 20px;
  }
  
  .wallpaper-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 25px;
    
    .category-tag {
      padding: 6px 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      border-radius: 15px;
    }
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: #888;
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 12px;
    margin-bottom: 30px;
    
    .action-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .like-btn,
    .collect-btn {
      background: #f5f5f7;
      border: none;
      color: #666;
      
      &.active {
        color: #ff4757;
        background: #fff0f1;
      }
      
      &:hover:not(.active) {
        background: #eee;
      }
    }
    
    .download-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: #fff;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }
    }
  }
  
  .wallpaper-desc,
  .wallpaper-tags,
  .author-info {
    margin-bottom: 25px;
    
    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
    }
    
    p {
      font-size: 14px;
      color: #666;
      line-height: 1.8;
    }
  }
  
  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    
    .tag {
      padding: 6px 14px;
      background: #f0f0f5;
      color: #666;
      font-size: 13px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background: #667eea;
        color: #fff;
      }
    }
  }
  
  .author-card {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: #f8f9ff;
    border-radius: 12px;
    
    .author-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .author-info-text {
      display: flex;
      flex-direction: column;
      gap: 4px;
      
      .author-name {
        font-size: 15px;
        font-weight: 600;
        color: #333;
      }
      
      .upload-time {
        font-size: 13px;
        color: #999;
      }
    }
  }
}

.related-section,
.comments-section {
  padding: 50px 0;
  background: #fff;
  
  h2 {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin-bottom: 30px;
  }
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.comment-form {
  margin-bottom: 30px;
  
  textarea {
    width: 100%;
    padding: 15px;
    border: 2px solid #eee;
    border-radius: 12px;
    font-size: 15px;
    resize: vertical;
    transition: border-color 0.2s ease;
    
    &:focus {
      border-color: #667eea;
    }
  }
  
  .submit-btn {
    margin-top: 15px;
    padding: 10px 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    border-radius: 20px;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s ease;
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.comment-login-tip {
  text-align: center;
  padding: 30px;
  background: #f8f9ff;
  border-radius: 12px;
  margin-bottom: 30px;
  
  p {
    color: #666;
    margin-bottom: 15px;
  }
  
  .login-link {
    color: #667eea;
    font-weight: 600;
  }
}

.comments-list {
  .comment-item {
    display: flex;
    gap: 15px;
    padding: 20px 0;
    border-bottom: 1px solid #eee;
    
    .comment-avatar {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .comment-content {
      flex: 1;
      
      .comment-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
        
        .comment-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .comment-author {
          font-size: 15px;
          font-weight: 600;
          color: #333;
        }
        
        .comment-time {
          font-size: 13px;
          color: #999;
        }
        
        .delete-btn {
          padding: 4px 12px;
          background: transparent;
          border: 1px solid #ff4757;
          color: #ff4757;
          font-size: 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          
          &:hover {
            background: #ff4757;
            color: #fff;
          }
        }
      }
      
      .comment-text {
        font-size: 14px;
        color: #666;
        line-height: 1.7;
      }
    }
  }
}

.no-comments {
  text-align: center;
  padding: 40px;
  color: #999;
}

.fullscreen-preview {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  @include flex-center;
  z-index: 2000;
  cursor: zoom-out;
  
  img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
  }
}

@media (max-width: 992px) {
  .detail-content {
    flex-direction: column;
    padding: 20px;
  }
  
  .wallpaper-info {
    width: 100%;
  }
}
</style>
