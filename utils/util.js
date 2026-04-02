const app = getApp()

const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')
    wx.request({
      url: `${app.globalData.baseUrl}${options.url}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          wx.removeStorageSync('token')
          wx.navigateTo({
            url: '/pages/login/login'
          })
          reject(new Error('登录已过期'))
        } else {
          reject(new Error(res.data.message || '请求失败'))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

const formatTime = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = (n) => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const showToast = (title, icon = 'none', duration = 2000) => {
  wx.showToast({
    title,
    icon,
    duration
  })
}

const showLoading = (title = '加载中...') => {
  wx.showLoading({
    title,
    mask: true
  })
}

const hideLoading = () => {
  wx.hideLoading()
}

const showConfirm = (content, title = '提示') => {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      success: (res) => {
        resolve(res.confirm)
      }
    })
  })
}

const debounce = (fn, delay = 300) => {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

const throttle = (fn, delay = 300) => {
  let lastTime = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

const getDeviceStatusText = (status) => {
  const statusMap = {
    online: '在线',
    offline: '离线',
    warning: '警告',
    error: '故障'
  }
  return statusMap[status] || '未知'
}

const getDeviceStatusClass = (status) => {
  const classMap = {
    online: 'status-online',
    offline: 'status-offline',
    warning: 'status-warning',
    error: 'status-danger'
  }
  return classMap[status] || ''
}

const getDeviceTypeText = (type) => {
  const typeMap = {
    light: '智能灯光',
    sensor: '传感器',
    environment: '环境控制',
    security: '安防设备',
    servo: '机械手舵机'
  }
  return typeMap[type] || '未知设备'
}

const getDeviceIcon = (type) => {
  const iconMap = {
    light: '/assets/icons/device-light.png',
    sensor: '/assets/icons/device-sensor.png',
    environment: '/assets/icons/device-ac.png',
    security: '/assets/icons/device-camera.png',
    servo: '/assets/icons/device-servo.png'
  }
  return iconMap[type] || '/assets/icons/device-default.png'
}

module.exports = {
  request,
  formatTime,
  formatNumber,
  showToast,
  showLoading,
  hideLoading,
  showConfirm,
  debounce,
  throttle,
  getDeviceStatusText,
  getDeviceStatusClass,
  getDeviceTypeText,
  getDeviceIcon
}
