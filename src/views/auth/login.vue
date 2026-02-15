<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <router-link to="/" class="auth-logo">
            <span class="logo-icon">🎨</span>
            <span class="logo-text">WallPaper</span>
          </router-link>
          <h2>欢迎回来</h2>
          <p>登录您的账号</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="input-group">
            <label>用户名</label>
            <input 
              type="text" 
              v-model="form.username" 
              placeholder="请输入用户名"
              required
            >
          </div>
          
          <div class="input-group">
            <label>密码</label>
            <input 
              type="password" 
              v-model="form.password" 
              placeholder="请输入密码"
              required
            >
          </div>
          
          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="remember">
              <span>记住我</span>
            </label>
            <a href="#" class="forgot-link">忘记密码？</a>
          </div>
          
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? '登录中...' : '立即登录' }}
          </button>
          
          <div class="error-message" v-if="error">
            {{ error }}
          </div>
        </form>
        
        <div class="auth-footer">
          <p>还没有账号？<router-link to="/register">立即注册</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const form = ref({
  username: '',
  password: ''
})
const remember = ref(false)
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  
  const result = await userStore.login(form.value.username, form.value.password)
  
  if (result.success) {
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } else {
    error.value = result.message
  }
  
  loading.value = false
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 20px;
  padding: 50px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.auth-header {
  text-align: center;
  margin-bottom: 40px;
  
  .auth-logo {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    margin-bottom: 25px;
    
    .logo-icon {
      font-size: 36px;
    }
    
    .logo-text {
      font-size: 28px;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
  
  h2 {
    font-size: 26px;
    font-weight: 700;
    color: #333;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 15px;
    color: #999;
  }
}

.auth-form {
  .input-group {
    margin-bottom: 24px;
    
    label {
      display: block;
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }
    
    input {
      width: 100%;
      padding: 14px 18px;
      border: 2px solid #eee;
      border-radius: 12px;
      font-size: 15px;
      transition: all 0.2s ease;
      
      &:focus {
        border-color: #667eea;
      }
      
      &::placeholder {
        color: #bbb;
      }
    }
  }
  
  .form-options {
    @include flex-between;
    margin-bottom: 25px;
    
    .remember-me {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 14px;
      color: #666;
      
      input {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
    }
    
    .forgot-link {
      font-size: 14px;
      color: #667eea;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  .submit-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
  }
  
  .error-message {
    margin-top: 15px;
    padding: 12px;
    background: #fff0f1;
    color: #ff4d4f;
    font-size: 14px;
    border-radius: 8px;
    text-align: center;
  }
}

.auth-footer {
  text-align: center;
  margin-top: 30px;
  padding-top: 25px;
  border-top: 1px solid #eee;
  
  p {
    font-size: 14px;
    color: #666;
    
    a {
      color: #667eea;
      font-weight: 600;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
