<template>
  <div class="upload-page">
    <div class="page-content">
      <div class="container">
        <div class="upload-form">
          <div class="upload-area" @click="selectFile" @drop.prevent="handleDrop" @dragover.prevent>
            <input 
              type="file" 
              ref="fileInput" 
              accept="image/*" 
              multiple
              @change="handleFileSelect"
              hidden
            >
            <div v-if="!previewUrl" class="upload-placeholder">
              <div class="upload-icon">📤</div>
              <h3>点击或拖拽图片到此处</h3>
              <p>支持 JPG、PNG、GIF 格式，单张不超过 10MB</p>
            </div>
            <div v-else class="preview-image">
              <img :src="previewUrl" alt="预览">
              <button class="remove-btn" @click.stop="removeFile">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="form-fields">
            <div class="input-group">
              <label>壁纸标题</label>
              <input type="text" v-model="form.title" placeholder="请输入壁纸标题" maxlength="50">
              <span class="char-count">{{ form.title.length }}/50</span>
            </div>
            
            <div class="input-group">
              <label>选择分类</label>
              <select v-model="form.category">
                <option value="">请选择分类</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.name">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            
            <div class="input-group">
              <label>壁纸描述</label>
              <textarea v-model="form.description" placeholder="描述一下你的壁纸..." rows="4" maxlength="200"></textarea>
              <span class="char-count">{{ form.description.length }}/200</span>
            </div>
            
            <div class="input-group">
              <label>添加标签</label>
              <div class="tags-input">
                <span class="tag" v-for="(tag, index) in form.tags" :key="index">
                  {{ tag }}
                  <button @click="removeTag(index)">×</button>
                </span>
                <input 
                  type="text" 
                  v-model="tagInput" 
                  placeholder="输入标签后按回车"
                  @keydown.enter.prevent="addTag"
                >
              </div>
            </div>
            
            <button class="submit-btn" @click="submitUpload" :disabled="!canSubmit || uploading">
              {{ uploading ? '上传中...' : '立即上传' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCategories } from '@/api/wallpaper'

const router = useRouter()

const fileInput = ref(null)
const previewUrl = ref('')
const uploading = ref(false)
const tagInput = ref('')
const categories = ref([])

const form = ref({
  title: '',
  category: '',
  description: '',
  tags: []
})

const canSubmit = computed(() => {
  return previewUrl.value && 
         form.value.title.trim() && 
         form.value.category &&
         !uploading.value
})

const selectFile = () => {
  fileInput.value.click()
}

const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (file) {
    processFile(file)
  }
}

const handleDrop = (e) => {
  const file = e.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    processFile(file)
  }
}

const processFile = (file) => {
  if (file.size > 10 * 1024 * 1024) {
    alert('图片大小不能超过10MB')
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target.result
    form.value.file = file
  }
  reader.readAsDataURL(file)
}

const removeFile = () => {
  previewUrl.value = ''
  form.value.file = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !form.value.tags.includes(tag) && form.value.tags.length < 5) {
    form.value.tags.push(tag)
    tagInput.value = ''
  }
}

const removeTag = (index) => {
  form.value.tags.splice(index, 1)
}

const submitUpload = async () => {
  if (!canSubmit.value) return
  
  uploading.value = true
  
  try {
    const imageUrl = previewUrl.value
    
    await request.post('/wallpapers', {
      title: form.value.title,
      category: form.value.category,
      description: form.value.description,
      tags: form.value.tags,
      image_url: imageUrl,
      thumbnail: imageUrl
    })
    
    alert('上传成功！')
    router.push('/user/uploads')
  } catch (err) {
    console.error('上传失败:', err)
    alert(err.response?.data?.message || '上传失败，请重试')
  } finally {
    uploading.value = false
  }
}

import request from '@/api/request'

onMounted(async () => {
  try {
    const res = await getCategories()
    categories.value = res || []
  } catch (err) {
    console.error('获取分类失败:', err)
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.upload-page {
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

.upload-form {
  max-width: 800px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.upload-area {
  background: #fff;
  border: 2px dashed #ddd;
  border-radius: 16px;
  min-height: 400px;
  @include flex-center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    background: #f8f9ff;
  }
  
  .upload-placeholder {
    text-align: center;
    padding: 40px;
    
    .upload-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }
    
    h3 {
      font-size: 18px;
      color: #333;
      margin-bottom: 10px;
    }
    
    p {
      font-size: 14px;
      color: #999;
    }
  }
  
  .preview-image {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 20px;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 12px;
    }
    
    .remove-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 36px;
      height: 36px;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 50%;
      @include flex-center;
      color: #fff;
      transition: background 0.2s ease;
      
      &:hover {
        background: rgba(255, 75, 75, 0.9);
      }
    }
  }
}

.form-fields {
  .input-group {
    margin-bottom: 20px;
    position: relative;
    
    label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }
    
    input,
    select,
    textarea {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #eee;
      border-radius: 12px;
      font-size: 15px;
      transition: border-color 0.2s ease;
      
      &:focus {
        border-color: #667eea;
      }
    }
    
    .char-count {
      position: absolute;
      right: 12px;
      bottom: 12px;
      font-size: 12px;
      color: #999;
    }
  }
  
  .tags-input {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 10px 14px;
    border: 2px solid #eee;
    border-radius: 12px;
    min-height: 54px;
    align-items: center;
    
    .tag {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      font-size: 13px;
      border-radius: 15px;
      
      button {
        background: none;
        border: none;
        color: #fff;
        cursor: pointer;
        font-size: 16px;
        padding: 0;
        line-height: 1;
      }
    }
    
    input {
      flex: 1;
      min-width: 120px;
      border: none;
      padding: 4px;
      outline: none;
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
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
  }
}

@media (max-width: 768px) {
  .upload-form {
    grid-template-columns: 1fr;
  }
  
  .upload-area {
    min-height: 300px;
  }
}
</style>
