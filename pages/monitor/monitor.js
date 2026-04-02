const app = getApp()
const { sensorApi, deviceApi } = require('../../api/index')
const { showToast, showLoading, hideLoading } = require('../../utils/util')

Page({
  data: {
    chartRange: 'day',
    realtimeData: {
      temperature: 26.5,
      tempTrend: 2.3,
      humidity: 65,
      humidityTrend: -1.5
    },
    sensorList: [
      { id: 1, name: '温度传感器', type: 'temperature', icon: 'temperature', status: 'online', statusText: '在线', value: 26.5, unit: '°C', min: 18, max: 30, percent: 60, warning: false },
      { id: 2, name: '湿度传感器', type: 'humidity', icon: 'humidity', status: 'online', statusText: '在线', value: 65, unit: '%', min: 30, max: 80, percent: 70, warning: false },
      { id: 3, name: 'PM2.5传感器', type: 'air', icon: 'air', status: 'online', statusText: '在线', value: 35, unit: 'μg/m³', min: 0, max: 150, percent: 23, warning: false },
      { id: 4, name: '光照传感器', type: 'light', icon: 'light', status: 'online', statusText: '在线', value: 450, unit: 'Lux', min: 0, max: 1000, percent: 45, warning: false },
      { id: 5, name: '气压传感器', type: 'pressure', icon: 'pressure', status: 'warning', statusText: '警告', value: 1013, unit: 'hPa', min: 980, max: 1050, percent: 47, warning: true },
      { id: 6, name: 'CO2传感器', type: 'air', icon: 'air', status: 'online', statusText: '在线', value: 450, unit: 'ppm', min: 400, max: 1000, percent: 8, warning: false }
    ],
    alertList: [
      { id: 1, title: '温度过高警告', description: '客厅温度超过设定阈值30°C', deviceName: '温度传感器', time: '10:30', level: 'warning' },
      { id: 2, title: '湿度异常', description: '卫生间湿度达到85%', deviceName: '湿度传感器', time: '09:15', level: 'danger' }
    ],
    dataSummary: {
      totalDevices: 12,
      activeSensors: 8,
      dataPoints: 15680,
      alerts: 3
    },
    quickMonitors: [
      { id: 1, name: '温度监控', type: 'temperature', icon: 'temperature', active: true },
      { id: 2, name: '湿度监控', type: 'humidity', icon: 'humidity', active: true },
      { id: 3, name: '空气质量', type: 'air', icon: 'air', active: true },
      { id: 4, name: '光照监控', type: 'light', icon: 'light', active: false }
    ]
  },

  onLoad() {
    this.loadRealtimeData()
    this.loadSensorList()
    this.loadAlerts()
    this.loadDataSummary()
  },

  onShow() {
    this.startDataRefresh()
  },

  onHide() {
    this.stopDataRefresh()
  },

  onUnload() {
    this.stopDataRefresh()
  },

  onPullDownRefresh() {
    this.refreshAllData().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  startDataRefresh() {
    this.refreshTimer = setInterval(() => {
      this.loadRealtimeData()
    }, 30000)
  },

  stopDataRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
      this.refreshTimer = null
    }
  },

  async refreshAllData() {
    await Promise.all([
      this.loadRealtimeData(),
      this.loadSensorList(),
      this.loadAlerts(),
      this.loadDataSummary()
    ])
  },

  async loadRealtimeData() {
    try {
      const res = await sensorApi.getSensorData('all')
      if (res.data) {
        this.setData({ realtimeData: res.data })
      }
    } catch (error) {
      const mockData = {
        temperature: (25 + Math.random() * 3).toFixed(1),
        tempTrend: (Math.random() * 4 - 2).toFixed(1),
        humidity: Math.floor(60 + Math.random() * 10),
        humidityTrend: (Math.random() * 4 - 2).toFixed(1)
      }
      this.setData({ realtimeData: mockData })
    }
  },

  async loadSensorList() {
    try {
      const res = await deviceApi.getDeviceList()
      const sensors = (res.data || []).filter(d => d.type === 'sensor')
      this.setData({ sensorList: sensors })
    } catch (error) {
      console.log('使用模拟传感器数据')
    }
  },

  async loadAlerts() {
    try {
      const res = await sensorApi.getSensorAlerts('all')
      if (res.data) {
        this.setData({ alertList: res.data })
      }
    } catch (error) {
      console.log('使用模拟告警数据')
    }
  },

  async loadDataSummary() {
    try {
      const res = await deviceApi.getDeviceList()
      const devices = res.data || []
      this.setData({
        dataSummary: {
          totalDevices: devices.length,
          activeSensors: devices.filter(d => d.type === 'sensor' && d.status === 'online').length,
          dataPoints: Math.floor(Math.random() * 10000 + 10000),
          alerts: Math.floor(Math.random() * 5)
        }
      })
    } catch (error) {
      console.log('使用模拟统计数据')
    }
  },

  setChartRange(e) {
    const range = e.currentTarget.dataset.range
    this.setData({ chartRange: range })
    this.loadChartData(range)
  },

  loadChartData(range) {
    console.log('加载图表数据:', range)
    showToast('数据已更新')
  },

  goToSensorDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/control/control?deviceId=${id}&type=sensor`
    })
  },

  goToAlerts() {
    wx.navigateTo({
      url: '/pages/alerts/alerts'
    })
  },

  handleAlert(e) {
    const id = e.currentTarget.dataset.id
    showLoading('处理中...')
    
    setTimeout(() => {
      hideLoading()
      const alertList = this.data.alertList.filter(a => a.id !== id)
      this.setData({ alertList })
      showToast('已处理')
    }, 1000)
  },

  toggleMonitor(e) {
    const id = e.currentTarget.dataset.id
    const monitors = this.data.quickMonitors.map(m => {
      if (m.id === id) {
        return { ...m, active: !m.active }
      }
      return m
    })
    this.setData({ quickMonitors: monitors })
    showToast('设置已更新')
  }
})
