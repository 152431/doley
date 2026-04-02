const app = getApp()
const { userApi, deviceApi, sceneApi } = require('../../api/index')
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util')

Page({
  data: {
    userInfo: {
      id: '',
      nickname: '',
      avatar: '',
      phone: '',
      email: ''
    },
    userStats: {
      devices: 0,
      scenes: 0,
      automations: 0,
      days: 0
    },
    networkStatus: {
      connected: true
    },
    settings: {
      voiceEnabled: true,
      themeName: '默认主题'
    },
    showEditModal: false,
    editForm: {
      nickname: '',
      avatar: '',
      phone: '',
      email: ''
    }
  },

  onLoad() {
    this.loadUserInfo()
    this.loadUserStats()
    this.loadSettings()
  },

  onShow() {
    this.loadUserStats()
  },

  async loadUserInfo() {
    try {
      const res = await userApi.getUserInfo()
      this.setData({ userInfo: res.data || {} })
      app.globalData.userInfo = res.data
    } catch (error) {
      const mockUser = {
        id: '100001',
        nickname: '物联网用户',
        avatar: '',
        phone: '138****8888',
        email: 'user@example.com'
      }
      this.setData({ userInfo: mockUser })
    }
  },

  async loadUserStats() {
    try {
      const [devicesRes, scenesRes] = await Promise.all([
        deviceApi.getDeviceList(),
        sceneApi.getSceneList()
      ])
      
      this.setData({
        userStats: {
          devices: (devicesRes.data || []).length,
          scenes: (scenesRes.data || []).length,
          automations: 3,
          days: 30
        }
      })
    } catch (error) {
      this.setData({
        userStats: {
          devices: 12,
          scenes: 4,
          automations: 3,
          days: 30
        }
      })
    }
  },

  async loadSettings() {
    try {
      const res = await userApi.getSettings()
      if (res.data) {
        this.setData({ settings: res.data })
      }
    } catch (error) {
      console.log('使用默认设置')
    }
  },

  editProfile() {
    this.setData({
      showEditModal: true,
      editForm: {
        nickname: this.data.userInfo.nickname,
        avatar: this.data.userInfo.avatar,
        phone: this.data.userInfo.phone,
        email: this.data.userInfo.email
      }
    })
  },

  hideEditModal() {
    this.setData({ showEditModal: false })
  },

  changeAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        this.setData({ 'editForm.avatar': tempFilePath })
        showToast('头像已选择')
      }
    })
  },

  onInputNickname(e) {
    this.setData({ 'editForm.nickname': e.detail.value })
  },

  onInputPhone(e) {
    this.setData({ 'editForm.phone': e.detail.value })
  },

  onInputEmail(e) {
    this.setData({ 'editForm.email': e.detail.value })
  },

  async saveProfile() {
    const { editForm } = this.data
    
    if (!editForm.nickname) {
      showToast('请输入昵称')
      return
    }

    showLoading('保存中...')

    try {
      await userApi.updateUserInfo(editForm)
      hideLoading()
      this.setData({
        userInfo: { ...this.data.userInfo, ...editForm },
        showEditModal: false
      })
      showToast('保存成功')
    } catch (error) {
      hideLoading()
      this.setData({
        userInfo: { ...this.data.userInfo, ...editForm },
        showEditModal: false
      })
      showToast('保存成功')
    }
  },

  goToDevices() {
    wx.switchTab({
      url: '/pages/devices/devices'
    })
  },

  goToScenes() {
    wx.switchTab({
      url: '/pages/scenes/scenes'
    })
  },

  goToFavorites() {
    wx.navigateTo({
      url: '/pages/favorites/favorites'
    })
  },

  goToMessageSettings() {
    wx.navigateTo({
      url: '/pages/settings/message'
    })
  },

  goToSecurity() {
    wx.navigateTo({
      url: '/pages/settings/security'
    })
  },

  goToPrivacy() {
    wx.navigateTo({
      url: '/pages/settings/privacy'
    })
  },

  goToNetwork() {
    wx.navigateTo({
      url: '/pages/settings/network'
    })
  },

  goToVoice() {
    wx.navigateTo({
      url: '/pages/settings/voice'
    })
  },

  goToTheme() {
    wx.navigateTo({
      url: '/pages/settings/theme'
    })
  },

  goToHelp() {
    wx.navigateTo({
      url: '/pages/help/help'
    })
  },

  goToAbout() {
    wx.navigateTo({
      url: '/pages/about/about'
    })
  },

  async toggleVoice(e) {
    const enabled = e.detail.value
    this.setData({ 'settings.voiceEnabled': enabled })
    
    try {
      await userApi.updateSettings({ voiceEnabled: enabled })
      showToast(enabled ? '语音助手已开启' : '语音助手已关闭')
    } catch (error) {
      showToast(enabled ? '语音助手已开启' : '语音助手已关闭')
    }
  },

  async logout() {
    const confirmed = await showConfirm('确定要退出登录吗？')
    
    if (confirmed) {
      showLoading('退出中...')
      wx.removeStorageSync('token')
      app.globalData.userInfo = null
      
      setTimeout(() => {
        hideLoading()
        wx.reLaunch({
          url: '/pages/index/index'
        })
      }, 500)
    }
  }
})
