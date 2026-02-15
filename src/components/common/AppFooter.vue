<template>
  <footer class="app-footer">
    <div class="footer-wave">
      <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
      </svg>
    </div>
    <div class="footer-container">
      <div class="footer-main">
        <div class="footer-brand">
          <div class="brand-logo">
            <span class="logo-text">WallZ</span>
          </div>
          <p class="brand-desc">发现精美壁纸，分享美好生活</p>
        </div>

        <div class="footer-links">
          <div class="link-group">
            <h4>快速导航</h4>
            <router-link to="/">首页</router-link>
            <router-link to="/wallpapers">壁纸</router-link>
            <router-link to="/rank">排行榜</router-link>
            <router-link to="/upload">投稿</router-link>
          </div>

          <div class="link-group">
            <h4>帮助中心</h4>
            <a href="#">使用条款</a>
            <a href="#">隐私政策</a>
            <a href="#">版权声明</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">© 2024 WallZ 图库. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.app-footer {
  background: $bg-dark;
  color: #fff;
  margin-top: auto;
  position: relative;
}

.footer-wave {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  transform: translateY(-99%);

  svg {
    display: block;
    width: 100%;
    height: auto;
  }
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 40px 30px;
}

.footer-main {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  gap: 60px;
}

.footer-brand {
  max-width: 320px;

  .brand-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .logo-text {
    font-size: 28px;
    font-weight: 700;
    @include gradient-text;
  }

  .brand-desc {
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
    line-height: 1.8;
  }
}

.footer-links {
  display: flex;
  gap: 80px;
  flex: 1;
  justify-content: flex-end;
}

.link-group {
  h4 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 24px;
    color: #fff;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 24px;
      height: 3px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      border-radius: 2px;
    }
  }

  a {
    display: block;
    color: rgba(255, 255, 255, 0.5);
    text-decoration: none;
    font-size: 14px;
    margin-bottom: 14px;
    transition: all 0.3s ease;

    &:hover {
      color: #fff;
      padding-left: 8px;
    }
  }
}

.footer-bottom {
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  .copyright {
    color: rgba(255, 255, 255, 0.4);
    font-size: 14px;
    text-align: center;
  }
}

@media (max-width: 1024px) {
  .footer-main {
    flex-direction: column;
    gap: 40px;
  }

  .footer-links {
    justify-content: flex-start;
    gap: 60px;
  }
}

@media (max-width: 768px) {
  .footer-container {
    padding: 50px 20px 24px;
  }

  .footer-links {
    flex-wrap: wrap;
    gap: 40px;
  }
}

@media (max-width: 480px) {
  .footer-links {
    flex-direction: column;
    gap: 32px;
  }
}
</style>
