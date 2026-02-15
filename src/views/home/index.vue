<template>
  <div class="home-page">
    <section class="hero-section" @mouseenter="pauseSlider" @mouseleave="resumeSlider">
      <div class="hero-slider">
        <div 
          v-for="(banner, index) in banners" 
          :key="index"
          class="slide"
          :class="{ active: currentSlide === index }"
          @click="goToWallpaper(banner.wallpaper_id)"
        >
          <div class="slide-image-wrapper">
            <img :src="getProcessedBannerImage(banner.image, index)" :alt="banner.title" @error="handleBannerImageError">
          </div>
          <div class="slide-overlay"></div>
          <div class="slide-content">
            <span class="slide-tag">每日分享</span>
            <h2>{{ banner.title }}</h2>
            <p>{{ banner.description }}</p>
            <button class="slide-btn" @click.stop="goToWallpaper(banner.wallpaper_id)">
              <span>查看详情</span>
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 左右箭头 -->
      <button class="slider-arrow arrow-prev" @click.stop="prevSlide">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>
      <button class="slider-arrow arrow-next" @click.stop="nextSlide">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </button>
      
      <div class="slider-nav">
        <button 
          v-for="(banner, index) in banners" 
          :key="index"
          class="nav-dot"
          :class="{ active: currentSlide === index }"
          @click.stop="currentSlide = index"
        ></button>
      </div>
      
      <!-- 进度条 -->
      <div class="slider-progress">
        <div 
          v-for="(banner, index) in banners" 
          :key="index"
          class="progress-bar"
          :class="{ active: currentSlide === index }"
        >
          <div class="progress-fill"></div>
        </div>
      </div>
    </section>
    
    <section class="hot-section">
      <div class="container">
        <div class="section-header">
          <div class="header-left">
            <h2>热门壁纸</h2>
            <span class="section-badge hot">
              <svg viewBox="0 0 24 24" width="14" height="14">
                <path fill="currentColor" d="M12 23c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2zm1-15c-3.31 0-6 2.69-6 6 0 2.52 1.56 4.71 3.77 5.52C9.4 20.22 8.52 21 7.48 21c-.69 0-1.33-.27-1.81-.75-.77-.78-1.96-1.22-3.21-.92.36-.77.56-1.63.56-2.51 0-3.86-3.14-7-7-7V4l5 5 5-5v2.07c3.39.1 6.13 2.93 6.13 6.35 0 .46-.05.91-.13 1.35-.17-.02-.34-.04-.52-.04z"/>
              </svg>
              HOT
            </span>
          </div>
          <router-link to="/wallpapers?sort=hot" class="more-link">
            <span>查看更多</span>
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </router-link>
        </div>
        <div class="wallpaper-grid">
          <WallpaperCard 
            v-for="wallpaper in hotWallpapers" 
            :key="wallpaper.id"
            :wallpaper="wallpaper"
            @click="goToDetail(wallpaper.id)"
          />
        </div>
      </div>
    </section>
    
    <section class="new-section">
      <div class="container">
        <div class="section-header">
          <div class="header-left">
            <h2>最新上传</h2>
            <span class="section-badge new">
              <svg viewBox="0 0 24 24" width="14" height="14">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              NEW
            </span>
          </div>
          <router-link to="/wallpapers?sort=new" class="more-link">
            <span>查看更多</span>
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </router-link>
        </div>
        <div class="wallpaper-grid">
          <WallpaperCard 
            v-for="wallpaper in newWallpapers" 
            :key="wallpaper.id"
            :wallpaper="wallpaper"
            @click="goToDetail(wallpaper.id)"
          />
        </div>
      </div>
    </section>
    
    <section class="upload-section">
      <div class="container">
        <div class="upload-banner">
          <div class="banner-content">
            <h2>分享你的精美壁纸</h2>
            <p>上传你的作品，让更多人看到</p>
            <router-link to="/upload" class="upload-btn">立即上传</router-link>
          </div>
          <div class="banner-decoration">
            <div class="deco-circle"></div>
            <div class="deco-circle"></div>
            <div class="deco-circle"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import WallpaperCard from '@/components/common/WallpaperCard.vue'
import { getHotWallpapers, getNewWallpapers, getBanners } from '@/api/wallpaper'
import { getImageUrl } from '@/utils/image'

const router = useRouter()

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
]

const defaultBanners = [
  { image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=600&fit=crop', title: '发现精美壁纸', description: '探索海量高清壁纸', wallpaper_id: null },
  { image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1920&h=600&fit=crop', title: '热门推荐', description: '精选热门壁纸合集', wallpaper_id: null },
  { image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&h=600&fit=crop', title: '每日更新', description: '每天都有新壁纸', wallpaper_id: null }
]

const currentSlide = ref(0)
const banners = ref(defaultBanners)
const hotWallpapers = ref([])
const newWallpapers = ref([])

const createPlaceholderWallpapers = (count) => {
  const placeholderImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=400&h=600&fit=crop'
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `精美壁纸 ${i + 1}`,
    image_url: placeholderImages[i % placeholderImages.length],
    thumbnail: placeholderImages[i % placeholderImages.length],
    category: '风景',
    category_name: '风景',
    likes: Math.floor(Math.random() * 1000),
    views: Math.floor(Math.random() * 5000),
    downloads: Math.floor(Math.random() * 500),
    is_hot: i < 3,
    is_recommended: i < 2
  }))
}

let sliderTimer = null

const initSlider = () => {
  if (sliderTimer) clearInterval(sliderTimer)
  sliderTimer = setInterval(() => {
    nextSlide()
  }, 6000)
}

const pauseSlider = () => {
  if (sliderTimer) {
    clearInterval(sliderTimer)
    sliderTimer = null
  }
}

const resumeSlider = () => {
  if (!sliderTimer && banners.value.length > 1) {
    initSlider()
  }
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + banners.value.length) % banners.value.length
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % banners.value.length
}

const goToDetail = (id) => {
  router.push(`/wallpaper/${id}`)
}

const goToWallpaper = (id) => {
  if (id) {
    goToDetail(id)
  }
}

onMounted(async () => {
  initSlider()
  
  try {
    const [bannerRes, hotRes, newRes] = await Promise.all([
      getBanners(),
      getHotWallpapers(),
      getNewWallpapers()
    ])
    
    console.log('轮播图响应:', bannerRes)
    console.log('热门壁纸响应:', hotRes)
    console.log('最新壁纸响应:', newRes)
    
    if (bannerRes && bannerRes.length > 0) {
      banners.value = bannerRes
    } else if (banners.value.length === 0) {
      banners.value = defaultBanners
    }
    
    hotWallpapers.value = (hotRes && hotRes.length > 0) ? hotRes : createPlaceholderWallpapers(4)
    newWallpapers.value = (newRes && newRes.length > 0) ? newRes : createPlaceholderWallpapers(4)
    
    console.log('最终轮播图数据:', banners.value)
    console.log('最终热门壁纸:', hotWallpapers.value)
  } catch (err) {
    console.error('获取数据失败:', err)
    banners.value = defaultBanners
    hotWallpapers.value = createPlaceholderWallpapers(4)
    newWallpapers.value = createPlaceholderWallpapers(4)
  }
})

onUnmounted(() => {
  pauseSlider()
})

const getBannerImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('cloud://')) {
    return `/api/img?url=${encodeURIComponent(url)}`
  }
  return url
}

const defaultBannerImages = [
  'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=600&fit=crop',
  'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1920&h=600&fit=crop',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&h=600&fit=crop'
]

const handleBannerImageError = (e) => {
  e.target.src = defaultBannerImages[0]
}

const getProcessedBannerImage = (url, index) => {
  if (!url) return defaultBannerImages[index % defaultBannerImages.length]
  if (url.startsWith('cloud://')) {
    return convertCloudUrl(url)
  }
  return url
}

function convertCloudUrl(url) {
  if (!url) return ''
  if (!url.startsWith('cloud://')) return url
  const match = url.match(/cloud:\/\/[^/]+\/(.+)/)
  if (match) {
    return `https://636c-cloud1-0gijmolxd270849e-1306863978.tcb.qcloud.la/${match[1]}`
  }
  return url
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.hero-section {
  position: relative;
  height: 70vh;
  min-height: 500px;
  max-height: 800px;
  overflow: hidden;
  margin-bottom: 40px;
  border-radius: 0 0 24px 24px;
}

.hero-slider {
  height: 100%;
  position: relative;

  .slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 1s ease-in-out;
    cursor: pointer;
    pointer-events: none; // 非 active 时不接收点击

    &.active {
      opacity: 1;
      pointer-events: auto; // active 时才接收点击
      z-index: 2;
      
      .slide-image-wrapper img {
        transform: scale(1.05);
      }
      
      .slide-content {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .slide-image-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 6s ease-out;
        transform: scale(1);
      }
    }

    .slide-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.1) 0%,
        rgba(0, 0, 0, 0) 30%,
        rgba(0, 0, 0, 0) 60%,
        rgba(0, 0, 0, 0.5) 100%
      );
      z-index: 1;
    }

    .slide-content {
      position: absolute;
      bottom: 100px;
      left: 60px;
      max-width: 500px;
      color: #fff;
      z-index: 2;
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.8s ease-out 0.3s;

      .slide-tag {
        display: inline-block;
        padding: 6px 16px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 1px;
        text-transform: uppercase;
        margin-bottom: 16px;
      }

      h2 {
        font-size: 42px;
        font-weight: 700;
        margin-bottom: 12px;
        text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
        line-height: 1.2;
      }

      p {
        font-size: 18px;
        opacity: 0.9;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        margin-bottom: 24px;
      }
      
      .slide-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 28px;
        background: #fff;
        color: #333;
        border: none;
        border-radius: 30px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
        }

        svg {
          transition: transform 0.3s ease;
        }

        &:hover svg {
          transform: translateX(4px);
        }
      }
    }
  }
}

// 左右箭头
.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  opacity: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-50%) scale(1.1);
  }

  &.arrow-prev {
    left: 30px;
  }

  &.arrow-next {
    right: 30px;
  }
}

.hero-section:hover .slider-arrow {
  opacity: 1;
}

.slider-nav {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 3;

  .nav-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;

    &.active {
      background: #fff;
      transform: scale(1.3);
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
    }

    &:hover:not(.active) {
      background: rgba(255, 255, 255, 0.7);
    }
  }
}

// 进度条
.slider-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  height: 3px;
  z-index: 3;

  .progress-bar {
    flex: 1;
    background: rgba(255, 255, 255, 0.2);
    margin: 0 2px;
    border-radius: 2px;
    overflow: hidden;

    .progress-fill {
      height: 100%;
      width: 0;
      background: linear-gradient(90deg, #667eea, #764ba2);
      border-radius: 2px;
    }

    &.active .progress-fill {
      animation: progressFill 6s linear;
    }
  }
}

@keyframes progressFill {
  from { width: 0; }
  to { width: 100%; }
}

.slider-arrows {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 3;
  pointer-events: none;

  .arrow-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    @include flex-center;
    cursor: pointer;
    pointer-events: auto;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.3);

    svg {
      width: 24px;
      height: 24px;
      color: #fff;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }
  }
}

.section-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, $border-color, transparent);
  margin: 60px 0;
}

.hot-section,
.new-section {
  padding: 40px 0;
  position: relative;
}

.section-header {
  @include flex-between;
  align-items: center;
  margin-bottom: 36px;
  padding-bottom: 20px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, $primary-color, $primary-dark);
    border-radius: 2px;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 68px;
    width: 6px;
    height: 6px;
    background: $primary-color;
    border-radius: 50%;
    animation: pulse-dot 2s ease-in-out infinite;
  }

  .header-left {
    @include flex-center;
    gap: 16px;

    h2 {
      font-size: 32px;
      font-weight: 800;
      color: $text-primary;
      position: relative;
      display: inline-flex;
      align-items: center;

      &::before {
        content: '';
        position: absolute;
        left: -16px;
        width: 4px;
        height: 28px;
        background: linear-gradient(180deg, $primary-color, $primary-dark);
        border-radius: 2px;
      }
    }
  }

  .section-badge {
    @include flex-center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: $radius-full;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
    transform: skewX(-10deg);

    svg {
      transform: skewX(10deg);
    }

    &.hot {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
      color: #fff;
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
    }

    &.new {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      color: #fff;
      box-shadow: 0 4px 15px rgba(67, 233, 123, 0.4);
    }
  }

  .section-subtitle {
    font-size: 14px;
    color: $text-tertiary;
    margin-left: 16px;
    font-weight: 400;
  }

  .section-actions {
    @include flex-center;
    gap: 12px;

    .filter-btn {
      padding: 10px 24px;
      border-radius: $radius-full;
      font-size: 13px;
      font-weight: 500;
      color: $text-secondary;
      background: $bg-secondary;
      transition: all 0.3s ease;
      border: 1px solid transparent;

      &:hover,
      &.active {
        @include gradient-primary;
        color: #fff;
        box-shadow: 0 4px 15px rgba($primary-color, 0.3);
        transform: translateY(-2px);
      }
    }
  }

  .more-link {
    @include flex-center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    color: $primary-color;
    padding: 10px 24px;
    border-radius: $radius-full;
    background: rgba($primary-color, 0.08);
    transition: all 0.3s ease;

    svg {
      width: 16px;
      height: 16px;
      transition: transform 0.3s ease;
    }

    &:hover {
      @include gradient-primary;
      color: #fff;
      box-shadow: 0 4px 20px rgba($primary-color, 0.4);
      transform: translateY(-2px);

      svg {
        transform: translateX(4px);
      }
    }
  }
}

@keyframes pulse-dot {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

.wallpaper-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.upload-section {
  padding: 80px 0;
  margin-top: 40px;
}

.upload-banner {
  position: relative;
  @include gradient-primary;
  border-radius: $radius-xl;
  padding: 60px 80px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
    border-radius: 50%;
  }

  .banner-content {
    position: relative;
    z-index: 1;
    max-width: 500px;

    h2 {
      font-size: 36px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 12px;
    }

    p {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 32px;
      line-height: 1.7;
    }

    .upload-btn {
      @include button-base;
      background: #fff;
      color: $primary-color;
      font-size: 16px;
      padding: 16px 40px;
      border-radius: $radius-full;
      font-weight: 600;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
      }
    }
  }

  .banner-decoration {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;

    .deco-circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);

      &:nth-child(1) {
        width: 280px;
        height: 280px;
        top: -80px;
        right: 60px;
      }

      &:nth-child(2) {
        width: 180px;
        height: 180px;
        bottom: -40px;
        right: 200px;
      }

      &:nth-child(3) {
        width: 120px;
        height: 120px;
        top: 50%;
        right: 80px;
        background: rgba(255, 255, 255, 0.05);
      }
    }
  }

  .banner-illustration {
    position: absolute;
    right: 80px;
    top: 50%;
    transform: translateY(-50%);
    width: 300px;
    height: 300px;
    opacity: 0.15;

    svg {
      width: 100%;
      height: 100%;
      fill: #fff;
    }
  }
}

@media (max-width: 1024px) {
  .hero-section {
    height: 60vh;
    min-height: 450px;
  }
  
  .hero-slider .slide .slide-content {
    left: 40px;
    bottom: 80px;
    
    h2 {
      font-size: 36px;
    }
  }
  
  .slider-arrow {
    width: 44px;
    height: 44px;
    
    &.arrow-prev {
      left: 20px;
    }
    
    &.arrow-next {
      right: 20px;
    }
  }

  .upload-banner {
    padding: 50px 60px;

    .banner-content {
      max-width: 400px;
    }

    .banner-illustration {
      width: 200px;
      height: 200px;
      right: 40px;
    }
  }
}

@media (max-width: 768px) {
  .hero-section {
    height: 50vh;
    min-height: 380px;
    margin-bottom: 30px;
    border-radius: 0 0 16px 16px;
  }

  .hero-slider .slide .slide-content {
    left: 50%;
    transform: translateX(-50%);
    bottom: 70px;
    text-align: center;
    width: 90%;
    max-width: 100%;
    
    h2 {
      font-size: 28px;
    }

    p {
      font-size: 15px;
    }
    
    .slide-btn {
      padding: 10px 24px;
      font-size: 14px;
    }
  }
  
  .slider-arrow {
    display: none;
  }
  
  .slider-nav {
    bottom: 30px;
  }

  .slider-arrows {
    display: none;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;

    h2 {
      font-size: 24px;
    }

    .section-actions {
      width: 100%;
      overflow-x: auto;
      padding-bottom: 8px;
    }
  }

  .wallpaper-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .upload-banner {
    padding: 40px 30px;
    text-align: center;

    .banner-content {
      h2 {
        font-size: 26px;
      }

      p {
        font-size: 14px;
      }

      .upload-btn {
        width: 100%;
      }
    }

    .banner-illustration {
      display: none;
    }
  }
}

@media (max-width: 480px) {
  .hero-section {
    height: 45vh;
    min-height: 320px;
    border-radius: 0 0 12px 12px;
  }

  .hero-slider .slide .slide-content {
    bottom: 60px;
    
    .slide-tag {
      padding: 4px 12px;
      font-size: 10px;
      margin-bottom: 12px;
    }
    
    h2 {
      font-size: 22px;
      margin-bottom: 8px;
    }

    p {
      font-size: 13px;
      margin-bottom: 16px;
    }
    
    .slide-btn {
      padding: 8px 20px;
      font-size: 13px;
    }
  }
  
  .slider-nav .nav-dot {
    width: 8px;
    height: 8px;
  }

  .wallpaper-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
</style>
