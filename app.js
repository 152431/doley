App({
  globalData: {
    userInfo: null,
    deviceId: '',
    mqttConnected: false,
    baseUrl: 'https://your-iot-server.com/api',
    wsUrl: 'wss://your-iot-server.com/ws'
  },

  onLaunch() {
    this.checkLoginStatus()
    this.initMqttConnection()
  },

  checkLoginStatus() {
    const token = wx.getStorageSync('token')
    if (token) {
      this.getUserInfo()
    }
  },

  getUserInfo() {
    wx.request({
      url: `${this.globalData.baseUrl}/user/info`,
      header: {
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          this.globalData.userInfo = res.data
        }
      }
    })
  },

  initMqttConnection() {
    const deviceId = wx.getStorageSync('deviceId')
    if (deviceId) {
      this.globalData.deviceId = deviceId
    }
  },

  setGlobalData(key, value) {
    this.globalData[key] = value
  },

  getGlobalData(key) {
    return this.globalData[key]
  }
})
