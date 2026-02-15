<template>
  <header class="app-header" :class="{ 'header-scroll': isScroll }">
    <div class="header-container">
      <router-link to="/" class="logo">
        <span class="logo-icon">
          <svg viewBox="0 0 24 24" width="32" height="32">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea"/>
                <stop offset="100%" style="stop-color:#764ba2"/>
              </linearGradient>
            </defs>
            <path fill="url(#logoGradient)" d="M4 4h7v7H4V4zm9 0h7v7h-7V4zm-9 9h7v7H4v-7zm9 0h7v7h-7v-7zM4 4h7v7H4V4zm9 0h7v7h-7V4zm-9 9h7v7H4v-7zm9 0h7v7h-7v-7z"/>
          </svg>
        </span>
        <span class="logo-text">WallZ</span>
      </router-link>

      <nav class="nav-menu">
        <router-link to="/" class="nav-item">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span>首页</span>
        </router-link>
        <router-link to="/wallpapers" class="nav-item">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
          <span>壁纸</span>
        </router-link>
        <router-link to="/rank" class="nav-item">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M7.5 21H2V9h5.5V21zm6-18v18h5.5V3H13.5zm6 18h5.5V9H19v12zM6 3v18h5.5V3H6z"/>
          </svg>
          <span>排行榜</span>
        </router-link>
        <router-link to="/upload" class="nav-item">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/>
          </svg>
          <span>投稿</span>
        </router-link>
      </nav>

      <div class="header-right">
        <div class="search-box">
          <input
            type="text"
            v-model="searchKeyword"
            placeholder="搜索壁纸..."
            @keyup.enter="handleSearch"
          >
          <button class="search-btn" @click="handleSearch">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
        </div>

        <template v-if="userStore.isLoggedIn">
          <div class="user-menu" @click="showUserMenu = !showUserMenu">
            <img :src="userStore.avatar ? getImageUrl(userStore.avatar) : defaultAvatar" class="user-avatar" alt="用户头像">
            <span class="user-name">{{ userStore.nickname }}</span>
            <svg class="dropdown-arrow" :class="{ 'arrow-open': showUserMenu }" viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M7 10l5 5 5-5z"/>
            </svg>
            <div class="dropdown-menu" v-show="showUserMenu">
              <router-link to="/user/profile" class="dropdown-item" @click="showUserMenu = false">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                个人中心
              </router-link>
              <router-link to="/user/collections" class="dropdown-item" @click="showUserMenu = false">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                我的收藏
              </router-link>
              <router-link to="/user/uploads" class="dropdown-item" @click="showUserMenu = false">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/>
                </svg>
                我的上传
              </router-link>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item logout" @click="handleLogout">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
                退出登录
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="btn-auth btn-login">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span>登录</span>
          </router-link>
          <router-link to="/register" class="btn-auth btn-register">
            <span>免费注册</span>
          </router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getImageUrl } from '@/utils/image'
import defaultAvatar from '@/assets/images/default-avatar.svg'

const router = useRouter()
const userStore = useUserStore()

const searchKeyword = ref('')
const isScroll = ref(false)
const showUserMenu = ref(false)

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({ path: '/wallpapers', query: { keyword: searchKeyword.value } })
  }
}

const handleLogout = () => {
  userStore.logout()
  showUserMenu.value = false
  router.push('/')
}

const handleScroll = () => {
  isScroll.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  @include glass-effect;
  z-index: 1000;
  transition: all 0.3s ease;

  &.header-scroll {
    height: 64px;
    box-shadow: $shadow-lg;

    .logo-icon svg {
      width: 28px;
      height: 28px;
    }

    .logo-text {
      font-size: 20px;
    }
  }
}

.header-container {
  max-width: 1400px;
  height: 100%;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;

  .logo-icon {
    svg {
      width: 36px;
      height: 36px;
      transition: all 0.3s ease;
    }
  }

  .logo-text {
    font-size: 24px;
    font-weight: 700;
    @include gradient-text;
    transition: all 0.3s ease;
  }
}

.nav-menu {
  display: flex;
  gap: 8px;

  .nav-item {
    @include flex-center;
    gap: 8px;
    font-size: 15px;
    font-weight: 500;
    color: $text-secondary;
    text-decoration: none;
    padding: 10px 20px;
    border-radius: $radius-full;
    position: relative;
    transition: all 0.3s ease;

    svg {
      opacity: 0.7;
      transition: opacity 0.3s ease;
    }

    &::before {
      content: '';
      position: absolute;
      bottom: 6px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 3px;
      @include gradient-primary;
      border-radius: $radius-full;
      transition: width 0.3s ease;
    }

    &:hover,
    &.router-link-active {
      color: $primary-color;
      background: rgba($primary-color, 0.08);

      svg {
        opacity: 1;
      }

      &::before {
        width: 24px;
      }
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  @include flex-center;
  gap: 8px;
  background: $bg-secondary;
  border: 2px solid transparent;
  border-radius: $radius-full;
  padding: 8px 8px 8px 20px;
  transition: all 0.3s ease;

  &:focus-within {
    background: $bg-primary;
    border-color: $primary-color;
    box-shadow: 0 0 0 4px rgba($primary-color, 0.1);
  }

  input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 14px;
    width: 160px;
    color: $text-primary;

    &::placeholder {
      color: $text-tertiary;
    }
  }

  .search-btn {
    @include flex-center;
    width: 36px;
    height: 36px;
    @include gradient-primary;
    border-radius: 50%;
    color: #fff;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 15px rgba($primary-color, 0.4);
    }
  }
}

.btn-auth {
  @include flex-center;
  gap: 6px;
  padding: 10px 24px;
  border-radius: $radius-full;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;

  span {
    position: relative;
  }
}

.btn-login {
  color: $primary-color;
  background: transparent;

  &:hover {
    background: rgba($primary-color, 0.1);
  }
}

.btn-register {
  color: #fff;
  @include gradient-primary;
  box-shadow: 0 4px 15px rgba($primary-color, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba($primary-color, 0.4);
  }
}

.user-menu {
  @include flex-center;
  gap: 10px;
  cursor: pointer;
  position: relative;
  padding: 6px 12px 6px 6px;
  border-radius: $radius-full;
  transition: all 0.3s ease;

  &:hover {
    background: $bg-secondary;
  }

  .user-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid $border-color;
    transition: border-color 0.3s ease;
  }

  &:hover .user-avatar {
    border-color: $primary-color;
  }

  .user-name {
    font-size: 14px;
    font-weight: 500;
    color: $text-primary;
  }

  .dropdown-arrow {
    color: $text-tertiary;
    transition: transform 0.3s ease;

    &.arrow-open {
      transform: rotate(180deg);
    }
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    background: $bg-primary;
    border-radius: $radius-lg;
    box-shadow: $shadow-xl;
    min-width: 200px;
    padding: 8px;
    animation: dropdownFade 0.2s ease;
    border: 1px solid $border-light;

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      color: $text-secondary;
      text-decoration: none;
      font-size: 14px;
      border-radius: $radius-md;
      transition: all 0.2s ease;

      svg {
        color: $text-tertiary;
        transition: color 0.2s ease;
      }

      &:hover {
        background: $bg-secondary;
        color: $primary-color;

        svg {
          color: $primary-color;
        }
      }

      &.logout {
        color: $error-color;

        svg {
          color: $error-color;
        }

        &:hover {
          background: rgba($error-color, 0.1);
        }
      }
    }

    .dropdown-divider {
      height: 1px;
      background: $border-color;
      margin: 8px 0;
    }
  }
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .nav-menu .nav-item span {
    display: none;
  }

  .search-box input {
    width: 120px;
  }

  .user-name {
    display: none;
  }
}

@media (max-width: 768px) {
  .app-header {
    height: 64px;
  }

  .header-container {
    padding: 0 16px;
  }

  .logo-text {
    display: none;
  }

  .nav-menu {
    gap: 4px;

    .nav-item {
      padding: 10px 14px;
    }
  }

  .search-box {
    display: none;
  }

  .btn-auth span {
    display: none;
  }

  .btn-login {
    padding: 10px;
  }

  .btn-register {
    padding: 10px 20px;
  }
}
</style>
