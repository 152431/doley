const app = getApp()
const { deviceApi } = require('../../api/index')
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util')

Page({
  data: {
    searchText: '',
    currentTab: 'all',
    showModal: false,
    devices: [],
    filteredDevices: [],
    deviceStats: {
      total: 0,
      light: 0,
      sensor: 0,
      environment: 0,
      security: 0,
      servo: 0
    },
    deviceTypes: [
      { value: 'light', label: '智能灯光' },
      { value: 'sensor', label: '传感器' },
      { value: 'environment', label: '环境控制' },
      { value: 'security', label: '安防设备' },
      { value: 'servo', label: '机械手舵机' }
    ],
    rooms: [
      { id: 1, name: '客厅' },
      { id: 2, name: '卧室' },
      { id: 3, name: '厨房' },
      { id: 4, name: '卫生间' },
      { id: 5, name: '书房' },
      { id: 6, name: '阳台' }
    ],
    newDevice: {
      name: '',
      typeIndex: 0,
      roomIndex: 0,
      deviceId: ''
    }
  },

  onLoad() {
    this.loadDevices()
  },

  onShow() {
    this.loadDevices()
  },

  onPullDownRefresh() {
    this.loadDevices().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  async loadDevices() {
    try {
      const res = await deviceApi.getDeviceList()
      const devices = (res.data || []).map(d => ({
        ...d,
        statusText: this.getStatusText(d.status)
      }))
      this.setData({ devices })
      this.filterDevices()
      this.calculateStats()
    } catch (error) {
      const mockDevices = [
        { id: '1', name: '客厅主灯', type: 'light', status: 'online', statusText: '在线', room: '客厅', isOn: true },
        { id: '2', name: '卧室台灯', type: 'light', status: 'online', statusText: '在线', room: '卧室', isOn: false },
        { id: '3', name: '温度传感器', type: 'sensor', status: 'online', statusText: '在线', room: '客厅', isOn: true },
        { id: '4', name: '湿度传感器', type: 'sensor', status: 'online', statusText: '在线', room: '卧室', isOn: true },
        { id: '5', name: '空调', type: 'environment', status: 'online', statusText: '运行中', room: '客厅', isOn: true },
        { id: '6', name: '新风系统', type: 'environment', status: 'offline', statusText: '离线', room: '客厅', isOn: false },
        { id: '7', name: '智能门锁', type: 'security', status: 'online', statusText: '已锁定', room: '门口', isOn: false },
        { id: '8', name: '摄像头', type: 'security', status: 'online', statusText: '监控中', room: '客厅', isOn: true },
        { id: '9', name: '机械臂', type: 'servo', status: 'online', statusText: '待命', room: '书房', isOn: false },
        { id: '10', name: '云台舵机', type: 'servo', status: 'warning', statusText: '警告', room: '客厅', isOn: true }
      ]
      this.setData({ devices: mockDevices })
      this.filterDevices()
      this.calculateStats()
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

  filterDevices() {
    let filtered = this.data.devices

    if (this.data.searchText) {
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(this.data.searchText.toLowerCase())
      )
    }

    if (this.data.currentTab !== 'all') {
      filtered = filtered.filter(d => d.type === this.data.currentTab)
    }

    this.setData({ filteredDevices: filtered })
  },

  calculateStats() {
    const devices = this.data.devices
    const stats = {
      total: devices.length,
      light: devices.filter(d => d.type === 'light').length,
      sensor: devices.filter(d => d.type === 'sensor').length,
      environment: devices.filter(d => d.type === 'environment').length,
      security: devices.filter(d => d.type === 'security').length,
      servo: devices.filter(d => d.type === 'servo').length
    }
    this.setData({ deviceStats: stats })
  },

  onSearch(e) {
    this.setData({ searchText: e.detail.value })
    this.filterDevices()
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ currentTab: tab })
    this.filterDevices()
  },

  showAddDevice() {
    this.setData({ 
      showModal: true,
      newDevice: {
        name: '',
        typeIndex: 0,
        roomIndex: 0,
        deviceId: ''
      }
    })
  },

  hideAddDevice() {
    this.setData({ showModal: false })
  },

  onInputName(e) {
    this.setData({ 'newDevice.name': e.detail.value })
  },

  onSelectType(e) {
    this.setData({ 'newDevice.typeIndex': e.detail.value })
  },

  onSelectRoom(e) {
    this.setData({ 'newDevice.roomIndex': e.detail.value })
  },

  onInputDeviceId(e) {
    this.setData({ 'newDevice.deviceId': e.detail.value })
  },

  scanDeviceId() {
    wx.scanCode({
      success: (res) => {
        this.setData({ 'newDevice.deviceId': res.result })
        showToast('扫描成功')
      },
      fail: () => {
        showToast('扫描取消')
      }
    })
  },

  async addDevice() {
    const { newDevice, deviceTypes, rooms } = this.data
    
    if (!newDevice.name) {
      showToast('请输入设备名称')
      return
    }
    
    if (!newDevice.deviceId) {
      showToast('请输入设备ID')
      return
    }

    showLoading('添加中...')
    
    try {
      const deviceData = {
        name: newDevice.name,
        type: deviceTypes[newDevice.typeIndex].value,
        roomId: rooms[newDevice.roomIndex].id,
        deviceId: newDevice.deviceId
      }
      
      await deviceApi.addDevice(deviceData)
      hideLoading()
      showToast('添加成功')
      this.hideAddDevice()
      this.loadDevices()
    } catch (error) {
      hideLoading()
      const newId = Date.now().toString()
      const newDeviceItem = {
        id: newId,
        name: newDevice.name,
        type: deviceTypes[newDevice.typeIndex].value,
        status: 'online',
        statusText: '在线',
        room: rooms[newDevice.roomIndex].name,
        isOn: false
      }
      this.setData({ 
        devices: [...this.data.devices, newDeviceItem],
        showModal: false
      })
      this.filterDevices()
      this.calculateStats()
      showToast('添加成功')
    }
  },

  goToDeviceDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/control/control?deviceId=${id}`
    })
  },

  async toggleDevice(e) {
    const deviceId = e.currentTarget.dataset.id
    const value = e.detail.value
    
    try {
      await deviceApi.controlDevice(deviceId, { power: value })
      const devices = this.data.devices.map(d => {
        if (d.id === deviceId) {
          return { ...d, isOn: value }
        }
        return d
      })
      this.setData({ devices })
      this.filterDevices()
      showToast(value ? '设备已开启' : '设备已关闭')
    } catch (error) {
      const devices = this.data.devices.map(d => {
        if (d.id === deviceId) {
          return { ...d, isOn: value }
        }
        return d
      })
      this.setData({ devices })
      this.filterDevices()
      showToast(value ? '设备已开启' : '设备已关闭')
    }
  },

  async deleteDevice(e) {
    const deviceId = e.currentTarget.dataset.id
    const confirmed = await showConfirm('确定要删除此设备吗？')
    
    if (confirmed) {
      showLoading('删除中...')
      try {
        await deviceApi.deleteDevice(deviceId)
        hideLoading()
        showToast('删除成功')
        this.loadDevices()
      } catch (error) {
        hideLoading()
        const devices = this.data.devices.filter(d => d.id !== deviceId)
        this.setData({ devices })
        this.filterDevices()
        this.calculateStats()
        showToast('删除成功')
      }
    }
  }
})
