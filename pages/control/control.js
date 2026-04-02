const app = getApp()
const { deviceApi, lightApi, environmentApi, servoApi, securityApi, sensorApi } = require('../../api/index')
const { showToast, showLoading, hideLoading } = require('../../utils/util')

Page({
  data: {
    deviceId: '',
    deviceInfo: {
      id: '',
      name: '',
      type: 'light',
      status: 'online',
      statusText: '在线',
      room: '',
      isOn: false
    },
    lightSettings: {
      brightness: 80,
      colorTemp: 4000,
      color: '#ffffff',
      scene: ''
    },
    colorOptions: [
      { value: '#ffffff', name: '白色' },
      { value: '#ffd93d', name: '暖黄' },
      { value: '#ff9a3c', name: '橙色' },
      { value: '#ff6b6b', name: '红色' },
      { value: '#a55eea', name: '紫色' },
      { value: '#4a90d9', name: '蓝色' },
      { value: '#43e97b', name: '绿色' },
      { value: '#ff6b9d', name: '粉色' }
    ],
    lightScenes: [
      { id: 'reading', name: '阅读', icon: 'book', color: '#ffd93d' },
      { id: 'movie', name: '影院', icon: 'movie', color: '#667eea' },
      { id: 'sleep', name: '睡眠', icon: 'moon', color: '#2193b0' },
      { id: 'party', name: '派对', icon: 'music', color: '#f5576c' }
    ],
    environmentSettings: {
      temperature: 24,
      mode: 'cool',
      fanSpeed: 3
    },
    environmentModes: [
      { value: 'cool', name: '制冷', icon: 'snow' },
      { value: 'heat', name: '制热', icon: 'fire' },
      { value: 'auto', name: '自动', icon: 'auto' },
      { value: 'fan', name: '送风', icon: 'fan' }
    ],
    fanSpeeds: [
      { value: 1, name: '低速', bars: 1 },
      { value: 2, name: '中速', bars: 2 },
      { value: 3, name: '高速', bars: 3 }
    ],
    servoChannels: [
      { id: 1, name: '舵机 1', angle: 90 },
      { id: 2, name: '舵机 2', angle: 90 },
      { id: 3, name: '舵机 3', angle: 90 },
      { id: 4, name: '舵机 4', angle: 90 }
    ],
    servoSettings: {
      speed: 5
    },
    servoActions: [
      { id: 'home', name: '归位', icon: 'home' },
      { id: 'wave', name: '挥手', icon: 'hand' },
      { id: 'grab', name: '抓取', icon: 'grab' },
      { id: 'release', name: '释放', icon: 'release' }
    ],
    securitySettings: {
      streamUrl: '',
      isRecording: false,
      locked: true,
      alarmMode: 'home'
    },
    securityModes: [
      { value: 'home', name: '在家', icon: 'home', color: '#52c41a' },
      { value: 'away', name: '离家', icon: 'leave', color: '#4a90d9' },
      { value: 'sleep', name: '睡眠', icon: 'moon', color: '#667eea' },
      { value: 'emergency', name: '紧急', icon: 'alarm', color: '#ff4d4f' }
    ],
    securityAlerts: [
      { id: 1, title: '检测到异常移动', time: '10:30', level: 'warning', handled: false },
      { id: 2, title: '门锁被打开', time: '09:15', level: 'info', handled: true },
      { id: 3, title: '烟雾报警', time: '昨天 18:20', level: 'danger', handled: true }
    ],
    sensorData: {
      value: 26.5,
      unit: '°C',
      trend: 2.3
    },
    sensorThresholds: {
      min: 18,
      max: 30
    },
    chartRange: 'day'
  },

  onLoad(options) {
    if (options.deviceId) {
      this.setData({ deviceId: options.deviceId })
      this.loadDeviceInfo(options.deviceId)
    } else if (options.type) {
      this.setData({ 'deviceInfo.type': options.type })
      this.loadDefaultDevice(options.type)
    }
  },

  async loadDeviceInfo(deviceId) {
    showLoading('加载中...')
    try {
      const res = await deviceApi.getDeviceDetail(deviceId)
      hideLoading()
      this.setData({ 
        deviceInfo: {
          ...res.data,
          statusText: this.getStatusText(res.data.status)
        }
      })
      this.loadDeviceSettings(res.data.type)
    } catch (error) {
      hideLoading()
      this.loadDefaultDevice('light')
    }
  },

  loadDefaultDevice(type) {
    const mockDevice = {
      id: 'demo',
      name: this.getDeviceTypeName(type),
      type: type,
      status: 'online',
      statusText: '在线',
      room: '客厅',
      isOn: true
    }
    this.setData({ deviceInfo: mockDevice })
    this.loadDeviceSettings(type)
  },

  loadDeviceSettings(type) {
    switch (type) {
      case 'light':
        break
      case 'environment':
        break
      case 'servo':
        break
      case 'security':
        break
      case 'sensor':
        break
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

  getDeviceTypeName(type) {
    const typeMap = {
      light: '智能灯光',
      environment: '环境控制',
      servo: '机械手舵机',
      security: '安防设备',
      sensor: '传感器'
    }
    return typeMap[type] || '设备'
  },

  async toggleDevice(e) {
    const value = e.detail.value
    try {
      await deviceApi.controlDevice(this.data.deviceId, { power: value })
      this.setData({ 'deviceInfo.isOn': value })
      showToast(value ? '设备已开启' : '设备已关闭')
    } catch (error) {
      this.setData({ 'deviceInfo.isOn': value })
      showToast(value ? '设备已开启' : '设备已关闭')
    }
  },

  async setBrightness(e) {
    const brightness = e.detail.value
    this.setData({ 'lightSettings.brightness': brightness })
    try {
      await lightApi.setBrightness(this.data.deviceId, brightness)
    } catch (error) {
      console.log('设置亮度:', brightness)
    }
  },

  async setColorTemp(e) {
    const temp = e.detail.value
    this.setData({ 'lightSettings.colorTemp': temp })
    try {
      await lightApi.setColorTemp(this.data.deviceId, temp)
    } catch (error) {
      console.log('设置色温:', temp)
    }
  },

  selectColor(e) {
    const color = e.currentTarget.dataset.color
    this.setData({ 'lightSettings.color': color })
    lightApi.setColor(this.data.deviceId, color).catch(() => {
      console.log('设置颜色:', color)
    })
  },

  selectLightScene(e) {
    const sceneId = e.currentTarget.dataset.id
    this.setData({ 'lightSettings.scene': sceneId })
    lightApi.setScene(this.data.deviceId, sceneId).catch(() => {
      showToast('场景已应用')
    })
  },

  decreaseTemp() {
    if (this.data.environmentSettings.temperature > 16) {
      const temp = this.data.environmentSettings.temperature - 1
      this.setData({ 'environmentSettings.temperature': temp })
      environmentApi.setTemperature(this.data.deviceId, temp).catch(() => {})
    }
  },

  increaseTemp() {
    if (this.data.environmentSettings.temperature < 30) {
      const temp = this.data.environmentSettings.temperature + 1
      this.setData({ 'environmentSettings.temperature': temp })
      environmentApi.setTemperature(this.data.deviceId, temp).catch(() => {})
    }
  },

  selectMode(e) {
    const mode = e.currentTarget.dataset.mode
    this.setData({ 'environmentSettings.mode': mode })
    environmentApi.setMode(this.data.deviceId, mode).catch(() => {
      showToast('模式已切换')
    })
  },

  setFanSpeed(e) {
    const speed = e.currentTarget.dataset.speed
    this.setData({ 'environmentSettings.fanSpeed': speed })
    environmentApi.setFanSpeed(this.data.deviceId, speed).catch(() => {})
  },

  setServoAngle(e) {
    const angle = e.detail.value
    const index = e.currentTarget.dataset.index
    const servoId = e.currentTarget.dataset.id
    const channels = this.data.servoChannels
    channels[index].angle = angle
    this.setData({ servoChannels: channels })
    servoApi.setAngle(this.data.deviceId, servoId, angle).catch(() => {})
  },

  setServoSpeed(e) {
    const speed = e.detail.value
    this.setData({ 'servoSettings.speed': speed })
  },

  executeServoAction(e) {
    const actionId = e.currentTarget.dataset.id
    showLoading('执行中...')
    servoApi.runAction(this.data.deviceId, actionId).then(() => {
      hideLoading()
      showToast('动作执行完成')
    }).catch(() => {
      hideLoading()
      showToast('动作执行完成')
    })
  },

  servoMove(e) {
    const direction = e.currentTarget.dataset.direction
    console.log('舵机移动:', direction)
    showToast('移动: ' + direction)
  },

  servoStop() {
    servoApi.stopServo(this.data.deviceId, 'all').catch(() => {
      showToast('已停止')
    })
  },

  takeSnapshot() {
    showToast('正在截图...')
  },

  toggleRecord() {
    const isRecording = !this.data.securitySettings.isRecording
    this.setData({ 'securitySettings.isRecording': isRecording })
    showToast(isRecording ? '开始录制' : '停止录制')
  },

  fullScreen() {
    showToast('全屏模式')
  },

  toggleLock() {
    const locked = !this.data.securitySettings.locked
    this.setData({ 'securitySettings.locked': locked })
    if (!locked) {
      securityApi.unlockDoor(this.data.deviceId).then(() => {
        showToast('门锁已解锁')
        setTimeout(() => {
          this.setData({ 'securitySettings.locked': true })
        }, 5000)
      }).catch(() => {
        showToast('门锁已解锁')
        setTimeout(() => {
          this.setData({ 'securitySettings.locked': true })
        }, 5000)
      })
    } else {
      showToast('门锁已锁定')
    }
  },

  setSecurityMode(e) {
    const mode = e.currentTarget.dataset.mode
    this.setData({ 'securitySettings.alarmMode': mode })
    securityApi.setAlarmMode(this.data.deviceId, mode).then(() => {
      showToast('模式已切换')
    }).catch(() => {
      showToast('模式已切换')
    })
  },

  setChartRange(e) {
    const range = e.currentTarget.dataset.range
    this.setData({ chartRange: range })
    this.loadSensorHistory(range)
  },

  loadSensorHistory(range) {
    console.log('加载历史数据:', range)
  },

  setMinThreshold(e) {
    const value = e.detail.value
    this.setData({ 'sensorThresholds.min': Number(value) })
  },

  setMaxThreshold(e) {
    const value = e.detail.value
    this.setData({ 'sensorThresholds.max': Number(value) })
  }
})
