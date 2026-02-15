<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <router-link to="/" class="auth-logo">
            <span class="logo-icon">🎨</span>
            <span class="logo-text">WallPaper</span>
          </router-link>
          <h2>创建账号</h2>
          <p>加入我们，开始探索</p>
        </div>
        
        <form @submit.prevent="handleRegister" class="auth-form">
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
            <label>昵称</label>
            <input 
              type="text" 
              v-model="form.nickname" 
              placeholder="请输入昵称"
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
          
          <div class="input-group">
            <label>确认密码</label>
            <input 
              type="password" 
              v-model="form.confirmPassword" 
              placeholder="请再次输入密码"
              required
            >
          </div>
          
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? '注册中...' : '立即注册' }}
          </button>
          
          <div class="error-message" v-if="error">
            {{ error }}
          </div>
          
          <div class="success-message" v-if="success">
            {{ success }}
          </div>
        </form>
        
        <div class="auth-footer">
          <p>已有账号？<router-link to="/login">立即登录</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  username: '',
  nickname: '',
  password: '',
  confirmPassword: ''
})
const loading = ref(false)
const error = ref('')
const success = ref('')

const handleRegister = async () => {
  error.value = ''
  success.value = ''
  
  if (form.value.password !== form.value.confirmPassword) {
    error.value = '两次输入的密码不一致'
    return
  }
  
  if (form.value.password.length < 6) {
    error.value = '密码长度不能少于6位'
    return
  }
  
  loading.value = true
  
  const result = await userStore.register({
    username: form.value.username,
    nickname: form.value.nickname,
    password: form.value.password
  })
  
  if (result.success) {
    success.value = '注册成功！正在跳转登录...'
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } else {
    error.value = result.message
  }
  
  loading.value = false
}
</script>

<style lang="scss" scoped>
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
    margin-bottom: 20px;
    
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
  
  .success-message {
    margin-top: 15px;
    padding: 12px;
    background: #f6ffed;
    color: #52c41a;
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
