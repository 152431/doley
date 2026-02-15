<template>
  <div class="wallpaper-card" @click="handleClick">
    <div class="card-image">
      <img :src="getImageUrl(wallpaper.image_url || wallpaper.thumbnail)" :alt="wallpaper.title" loading="lazy">
      <div class="card-overlay">
        <button class="overlay-btn preview-btn" @click.stop="handlePreview">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
          <span>预览</span>
        </button>
        <button class="overlay-btn download-btn" @click.stop="handleDownload">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
          <span>下载</span>
        </button>
      </div>
      <div class="card-badges">
        <span v-if="wallpaper.is_hot == 1 || wallpaper.is_hot === '1'" class="badge hot-badge">
          <svg viewBox="0 0 24 24" width="12" height="12">
            <path fill="currentColor" d="M12 23c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2zm1-15c-3.31 0-6 2.69-6 6 0 2.52 1.56 4.71 3.77 5.52C9.4 20.22 8.52 21 7.48 21c-.69 0-1.33-.27-1.81-.75-.77-.78-1.96-1.22-3.21-.92.36-.77.56-1.63.56-2.51 0-3.86-3.14-7-7-7V4l5 5 5-5v2.07c3.39.1 6.13 2.93 6.13 6.35 0 .46-.05.91-.13 1.35-.17-.02-.34-.04-.52-.04z"/>
          </svg>
          热门
        </span>
        <span v-if="wallpaper.is_recommended == 1 || wallpaper.is_recommended === '1'" class="badge recommend-badge">
          <svg viewBox="0 0 24 24" width="12" height="12">
            <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          推荐
        </span>
      </div>
    </div>
    <div class="card-info">
      <h3 class="card-title">{{ wallpaper.title }}</h3>
      <div class="card-meta">
        <span class="category">
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path fill="currentColor" d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
          </svg>
          {{ wallpaper.category_name || wallpaper.category }}
        </span>
        <div class="card-stats">
          <span class="stat likes">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            {{ formatNumber(wallpaper.likes) }}
          </span>
          <span class="stat views">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
            </svg>
            {{ formatNumber(wallpaper.views) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getImageUrl } from '@/utils/image'

const props = defineProps({
  wallpaper: {
    type: [Object, String],
    required: true
  }
})

const emit = defineEmits(['click', 'preview', 'download'])

const isValidWallpaper = computed(() => {
  return props.wallpaper && typeof props.wallpaper === 'object'
})

const formatNumber = (num) => {
  if (!num) return '0'
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const defaultImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop'

const handleImageError = (e) => {
  e.target.src = defaultImage
}

const handleClick = () => {
  if (isValidWallpaper.value) {
    emit('click', props.wallpaper)
  }
}

const handlePreview = () => {
  if (isValidWallpaper.value) {
    emit('preview', props.wallpaper)
  }
}

const handleDownload = () => {
  if (isValidWallpaper.value) {
    emit('download', props.wallpaper)
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.wallpaper-card {
  @include card-base;
  @include card-hover;
  background: $bg-primary;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.card-image {
  position: relative;
  padding-top: 133.33%;
  overflow: hidden;
  background: $bg-tertiary;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.08);
  }
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.6) 100%);
  @include flex-center;
  gap: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;

  .overlay-btn {
    @include flex-center;
    gap: 8px;
    padding: 12px 24px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: $radius-full;
    font-size: 14px;
    font-weight: 600;
    color: $text-primary;
    transition: all 0.3s ease;
    transform: translateY(10px);

    svg {
      flex-shrink: 0;
    }

    &:hover {
      background: #fff;
      transform: translateY(0) scale(1.05);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
  }
}

.wallpaper-card:hover .card-overlay {
  opacity: 1;

  .overlay-btn {
    transform: translateY(0);
  }
}

.card-badges {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  gap: 8px;
  z-index: 2;

  .badge {
    @include flex-center;
    gap: 4px;
    padding: 6px 12px;
    border-radius: $radius-full;
    font-size: 11px;
    font-weight: 600;
    color: #fff;
    backdrop-filter: blur(10px);

    svg {
      flex-shrink: 0;
    }
  }

  .hot-badge {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    box-shadow: 0 2px 10px rgba(255, 107, 107, 0.4);
  }

  .recommend-badge {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 2px 10px rgba(102, 126, 234, 0.4);
  }
}

.card-info {
  padding: 16px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 10px;
  @include text-ellipsis;
  transition: color 0.3s ease;

  .wallpaper-card:hover & {
    color: $primary-color;
  }
}

.card-meta {
  @include flex-between;
}

.category {
  @include flex-center;
  gap: 4px;
  font-size: 12px;
  color: $text-tertiary;

  svg {
    color: $text-tertiary;
  }
}

.card-stats {
  display: flex;
  gap: 16px;

  .stat {
    @include flex-center;
    gap: 4px;
    font-size: 12px;
    color: $text-tertiary;
    transition: color 0.3s ease;

    svg {
      transition: transform 0.3s ease;
    }

    &.likes:hover {
      color: #f43f5e;

      svg {
        transform: scale(1.1);
      }
    }

    &.views:hover {
      color: $primary-color;
    }
  }
}
</style>
