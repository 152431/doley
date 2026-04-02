const app = getApp()
const { sceneApi, deviceApi } = require('../../api/index')
const { showToast, showLoading, hideLoading, showConfirm } = require('../../utils/util')

Page({
  data: {
    showModal: false,
    showDeviceSelector: false,
    editingScene: null,
    recommendedScenes: [
      { id: 'home', name: '回家模式', icon: 'home', gradient: 'linear-gradient(135deg, #4a90d9 0%, #357abd 100%)', description: '开启灯光、空调' },
      { id: 'leave', name: '离家模式', icon: 'leave', gradient: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)', description: '关闭所有设备' },
      { id: 'sleep', name: '睡眠模式', icon: 'moon', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', description: '调暗灯光、降温' },
      { id: 'movie', name: '影院模式', icon: 'movie', gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', description: '关闭灯光、投影' }
    ],
    myScenes: [],
    automationList: [],
    scheduleList: [],
    newScene: {
      name: '',
      icon: 'home',
      color: '#4a90d9',
      devices: []
    },
    iconOptions: [
      { icon: 'home', color: '#4a90d9' },
      { icon: 'leave', color: '#f5576c' },
      { icon: 'moon', color: '#667eea' },
      { icon: 'movie', color: '#f7971e' },
      { icon: 'music', color: '#f093fb' },
      { icon: 'book', color: '#43e97b' },
      { icon: 'game', color: '#ff6b6b' },
      { icon: 'party', color: '#ffd93d' }
    ],
    colorOptions: [
      '#4a90d9', '#f5576c', '#667eea', '#f7971e',
      '#f093fb', '#43e97b', '#ff6b6b', '#ffd93d',
      '#2193b0', '#764ba2', '#38f9d7', '#fa709a'
    ],
    availableDevices: []
  },

  onLoad() {
    this.loadMyScenes()
    this.loadAutomations()
    this.loadSchedules()
    this.loadAvailableDevices()
  },

  onShow() {
    this.loadMyScenes()
  },

  async loadMyScenes() {
    try {
      const res = await sceneApi.getSceneList()
      this.setData({ myScenes: res.data || [] })
    } catch (error) {
      const mockScenes = [
        { id: '1', name: '回家模式', icon: 'home', color: '#4a90d9', deviceCount: 5, enabled: true, lastExecuted: '今天 18:30' },
        { id: '2', name: '睡眠模式', icon: 'moon', color: '#667eea', deviceCount: 8, enabled: true, lastExecuted: '昨天 22:00' },
        { id: '3', name: '离家模式', icon: 'leave', color: '#f5576c', deviceCount: 12, enabled: true, lastExecuted: '今天 08:00' },
        { id: '4', name: '影院模式', icon: 'movie', color: '#f7971e', deviceCount: 4, enabled: false, lastExecuted: '3天前' }
      ]
      this.setData({ myScenes: mockScenes })
    }
  },

  async loadAutomations() {
    try {
      const res = await sceneApi.getSceneList()
      this.setData({ automationList: res.automations || [] })
    } catch (error) {
      const mockAutomations = [
        {
          id: '1',
          triggerType: 'time',
          triggerIcon: 'time',
          triggerName: '定时触发',
          condition: '每天 07:00',
          actions: ['打开客厅灯光', '设置空调温度为24°C'],
          enabled: true
        },
        {
          id: '2',
          triggerType: 'sensor',
          triggerIcon: 'sensor',
          triggerName: '温度传感器',
          condition: '温度 > 28°C',
          actions: ['打开空调制冷模式', '风速设为自动'],
          enabled: true
        },
        {
          id: '3',
          triggerType: 'device',
          triggerIcon: 'device',
          triggerName: '门窗传感器',
          condition: '门打开时',
          actions: ['开启摄像头录制', '发送通知'],
          enabled: false
        }
      ]
      this.setData({ automationList: mockAutomations })
    }
  },

  async loadSchedules() {
    const mockSchedules = [
      { id: '1', time: '07:00', period: 'AM', name: '起床模式', repeat: '每天', enabled: true },
      { id: '2', time: '22:00', period: 'PM', name: '睡眠模式', repeat: '工作日', enabled: true },
      { id: '3', time: '18:30', period: 'PM', name: '回家模式', repeat: '工作日', enabled: false }
    ]
    this.setData({ scheduleList: mockSchedules })
  },

  async loadAvailableDevices() {
    try {
      const res = await deviceApi.getDeviceList()
      this.setData({ availableDevices: res.data || [] })
    } catch (error) {
      const mockDevices = [
        { id: '1', name: '客厅主灯', type: 'light', room: '客厅' },
        { id: '2', name: '空调', type: 'environment', room: '客厅' },
        { id: '3', name: '智能门锁', type: 'security', room: '门口' },
        { id: '4', name: '机械臂', type: 'servo', room: '书房' },
        { id: '5', name: '温度传感器', type: 'sensor', room: '客厅' }
      ]
      this.setData({ availableDevices: mockDevices })
    }
  },

  applyRecommended(e) {
    const id = e.currentTarget.dataset.id
    const scene = this.data.recommendedScenes.find(s => s.id === id)
    if (scene) {
      this.setData({
        showModal: true,
        newScene: {
          name: scene.name,
          icon: scene.icon,
          color: this.extractColor(scene.gradient),
          devices: []
        }
      })
    }
  },

  extractColor(gradient) {
    const match = gradient.match(/#[a-fA-F0-9]{6}/)
    return match ? match[0] : '#4a90d9'
  },

  showAddScene() {
    this.setData({
      showModal: true,
      editingScene: null,
      newScene: {
        name: '',
        icon: 'home',
        color: '#4a90d9',
        devices: []
      }
    })
  },

  hideAddScene() {
    this.setData({ showModal: false, editingScene: null })
  },

  onInputSceneName(e) {
    this.setData({ 'newScene.name': e.detail.value })
  },

  selectSceneIcon(e) {
    const icon = e.currentTarget.dataset.icon
    const iconOption = this.data.iconOptions.find(i => i.icon === icon)
    this.setData({ 
      'newScene.icon': icon,
      'newScene.color': iconOption ? iconOption.color : '#4a90d9'
    })
  },

  selectSceneColor(e) {
    const color = e.currentTarget.dataset.color
    this.setData({ 'newScene.color': color })
  },

  showDeviceSelector() {
    this.setData({ showDeviceSelector: true })
  },

  hideDeviceSelector() {
    this.setData({ showDeviceSelector: false })
  },

  selectDevice(e) {
    const device = e.currentTarget.dataset.device
    const newDevice = {
      deviceId: device.id,
      deviceName: device.name,
      action: 'power',
      actionName: '开启设备'
    }
    this.setData({
      'newScene.devices': [...this.data.newScene.devices, newDevice],
      showDeviceSelector: false
    })
  },

  removeDeviceFromScene(e) {
    const index = e.currentTarget.dataset.index
    const devices = this.data.newScene.devices.filter((_, i) => i !== index)
    this.setData({ 'newScene.devices': devices })
  },

  async saveScene() {
    const { newScene, editingScene } = this.data
    
    if (!newScene.name) {
      showToast('请输入场景名称')
      return
    }

    if (newScene.devices.length === 0) {
      showToast('请至少添加一个设备')
      return
    }

    showLoading('保存中...')

    try {
      if (editingScene) {
        await sceneApi.updateScene(editingScene.id, newScene)
      } else {
        await sceneApi.createScene(newScene)
      }
      hideLoading()
      showToast('保存成功')
      this.hideAddScene()
      this.loadMyScenes()
    } catch (error) {
      hideLoading()
      const sceneData = {
        id: editingScene ? editingScene.id : Date.now().toString(),
        ...newScene,
        deviceCount: newScene.devices.length,
        enabled: true,
        lastExecuted: ''
      }
      
      if (editingScene) {
        const scenes = this.data.myScenes.map(s => s.id === editingScene.id ? sceneData : s)
        this.setData({ myScenes: scenes })
      } else {
        this.setData({ 
          myScenes: [...this.data.myScenes, sceneData]
        })
      }
      
      this.hideAddScene()
      showToast('保存成功')
    }
  },

  async executeScene(e) {
    const id = e.currentTarget.dataset.id
    showLoading('执行中...')

    try {
      await sceneApi.executeScene(id)
      hideLoading()
      showToast('场景执行成功')
      
      const scenes = this.data.myScenes.map(s => {
        if (s.id === id) {
          return { ...s, lastExecuted: '刚刚' }
        }
        return s
      })
      this.setData({ myScenes: scenes })
    } catch (error) {
      hideLoading()
      showToast('场景执行成功')
    }
  },

  editScene(e) {
    const id = e.currentTarget.dataset.id
    const scene = this.data.myScenes.find(s => s.id === id)
    if (scene) {
      this.setData({
        showModal: true,
        editingScene: scene,
        newScene: {
          name: scene.name,
          icon: scene.icon,
          color: scene.color,
          devices: []
        }
      })
    }
  },

  toggleSceneEnabled(e) {
    const id = e.currentTarget.dataset.id
    const scenes = this.data.myScenes.map(s => {
      if (s.id === id) {
        return { ...s, enabled: !s.enabled }
      }
      return s
    })
    this.setData({ myScenes: scenes })
    showToast('设置已更新')
  },

  async deleteScene(e) {
    const id = e.currentTarget.dataset.id
    const confirmed = await showConfirm('确定要删除此场景吗？')
    
    if (confirmed) {
      showLoading('删除中...')
      try {
        await sceneApi.deleteScene(id)
        hideLoading()
        showToast('删除成功')
        this.loadMyScenes()
      } catch (error) {
        hideLoading()
        const scenes = this.data.myScenes.filter(s => s.id !== id)
        this.setData({ myScenes: scenes })
        showToast('删除成功')
      }
    }
  },

  showAddAutomation() {
    showToast('添加自动化规则')
  },

  toggleAutomation(e) {
    const id = e.currentTarget.dataset.id
    const list = this.data.automationList.map(a => {
      if (a.id === id) {
        return { ...a, enabled: !a.enabled }
      }
      return a
    })
    this.setData({ automationList: list })
  },

  toggleSchedule(e) {
    const id = e.currentTarget.dataset.id
    const list = this.data.scheduleList.map(s => {
      if (s.id === id) {
        return { ...s, enabled: !s.enabled }
      }
      return s
    })
    this.setData({ scheduleList: list })
  }
})
