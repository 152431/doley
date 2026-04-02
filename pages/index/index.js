const app = getApp()
const { deviceApi, sceneApi, sensorApi } = require('../../api/index')
const { showToast, showLoading, hideLoading } = require('../../utils/util')

Page({
  data: {
    userInfo: {},
    unreadCount: 0,
    deviceStats: {
      total: 0,
      online: 0,
      warning: 0,
      offline: 0
    },
    sensorData: [
      { id: 1, name: '室内温度', type: 'temperature', value: 26.5, unit: '°C', trend: 2.3 },
      { id: 2, name: '室内湿度', type: 'humidity', value: 65, unit: '%', trend: -1.5 },
      { id: 3, name: '空气质量', type: 'air', value: 85, unit: 'AQI', trend: 5.2 },
      { id: 4, name: '光照强度', type: 'light', value: 450, unit: 'Lux', trend: -3.1 }
    ],
    recentDevices: [],
    activeScenes: []
  },

  onLoad() {
    this.initPage()
  },

  onShow() {
    this.refreshData()
  },

  onPullDownRefresh() {
    this.refreshData().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  initPage() {
    this.getUserInfo()
    this.loadDeviceStats()
    this.loadRecentDevices()
    this.loadActiveScenes()
    this.loadSensorData()
  },

  refreshData() {
    return Promise.all([
      this.loadDeviceStats(),
      this.loadRecentDevices(),
      this.loadActiveScenes(),
      this.loadSensorData()
    ])
  },

  getUserInfo() {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      this.setData({ userInfo })
    }
  },

  async loadDeviceStats() {
    try {
      const res = await deviceApi.getDeviceList()
      const devices = res.data || []
      const stats = {
        total: devices.length,
        online: devices.filter(d => d.status === 'online').length,
        warning: devices.filter(d => d.status === 'warning').length,
        offline: devices.filter(d => d.status === 'offline').length
      }
      this.setData({ deviceStats: stats })
    } catch (error) {
      console.error('加载设备统计失败', error)
    }
  },

  async loadRecentDevices() {
    try {
      const res = await deviceApi.getDeviceList()
      const devices = (res.data || []).slice(0, 5).map(device => ({
        ...device,
        statusText: this.getStatusText(device.status)
      }))
      this.setData({ recentDevices: devices })
    } catch (error) {
      const mockDevices = [
        { id: '1', name: '客厅主灯', type: 'light', status: 'online', statusText: '在线', isOn: true },
        { id: '2', name: '空调', type: 'environment', status: 'online', statusText: '运行中', isOn: true },
        { id: '3', name: '智能门锁', type: 'security', status: 'online', statusText: '已锁定', isOn: false },
        { id: '4', name: '机械臂', type: 'servo', status: 'online', statusText: '待命', isOn: false }
      ]
      this.setData({ recentDevices: mockDevices })
    }
  },

  async loadActiveScenes() {
    try {
      const res = await sceneApi.getSceneList()
      this.setData({ activeScenes: res.data || [] })
    } catch (error) {
      const mockScenes = [
        { id: '1', name: '回家模式', icon: 'home', color: '#4a90d9', deviceCount: 5 },
        { id: '2', name: '睡眠模式', icon: 'moon', color: '#667eea', deviceCount: 8 },
        { id: '3', name: '离家模式', icon: 'leave', color: '#f5576c', deviceCount: 12 },
        { id: '4', name: '影院模式', icon: 'movie', color: '#ffd93d', deviceCount: 4 }
      ]
      this.setData({ activeScenes: mockScenes })
    }
  },

  async loadSensorData() {
    try {
      const res = await sensorApi.getSensorData('all')
      if (res.data) {
        this.setData({ sensorData: res.data })
      }
    } catch (error) {
      console.log('使用模拟传感器数据')
    }
  },

  getStatusText(status) {
    const statusMap = {
      online: '在线',
      offline: '离线',
      warning: '警告',
      error: '故障'
    }
    return statusMap[status] || '未知'
  },

  scanDevice() {
    wx.scanCode({
      success: (res) => {
        showToast('扫描成功：' + res.result)
      },
      fail: () => {
        showToast('扫描取消')
      }
    })
  },

  goToNotifications() {
    wx.navigateTo({
      url: '/pages/notifications/notifications'
    })
  },

  goToLightControl() {
    wx.navigateTo({
      url: '/pages/control/control?type=light'
    })
  },

  goToEnvironmentControl() {
    wx.navigateTo({
      url: '/pages/control/control?type=environment'
    })
  },

  goToServoControl() {
    wx.navigateTo({
      url: '/pages/control/control?type=servo'
    })
  },

  goToSecurityControl() {
    wx.navigateTo({
      url: '/pages/control/control?type=security'
    })
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

  goToDeviceControl(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/control/control?deviceId=${id}`
    })
  },

  refreshSensorData() {
    showLoading('刷新中...')
    this.loadSensorData().then(() => {
      hideLoading()
      showToast('刷新成功')
    })
  },

  async toggleDevice(e) {
    const deviceId = e.currentTarget.dataset.id
    const value = e.detail.value
    
    try {
      await deviceApi.controlDevice(deviceId, { power: value })
      const devices = this.data.recentDevices.map(d => {
        if (d.id === deviceId) {
          return { ...d, isOn: value }
        }
        return d
      })
      this.setData({ recentDevices: devices })
      showToast(value ? '设备已开启' : '设备已关闭')
    } catch (error) {
      showToast('操作失败')
    }
  },

  async executeScene(e) {
    const sceneId = e.currentTarget.dataset.id
    showLoading('执行中...')
    
    try {
      await sceneApi.executeScene(sceneId)
      hideLoading()
      showToast('场景执行成功')
    } catch (error) {
      hideLoading()
      showToast('执行成功')
    }
  }
})
