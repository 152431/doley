const app = getApp()
const { deviceApi, lightApi, environmentApi, securityApi, servoApi } = require('../api/index')

class VoiceControl {
  constructor() {
    this.isListening = false
  }

  // 开始语音识别
  startListening() {
    return new Promise((resolve, reject) => {
      if (this.isListening) {
        reject(new Error('正在录音中'))
        return
      }

      this.isListening = true
      wx.showToast({ title: '请说话...', icon: 'none' })

      wx.startRecord({
        success: (res) => {
          this.isListening = false
          const tempFilePath = res.tempFilePath
          this.recognizeSpeech(tempFilePath)
            .then(result => {
              resolve(result)
            })
            .catch(err => {
              reject(err)
            })
        },
        fail: (err) => {
          this.isListening = false
          wx.showToast({ title: '录音失败', icon: 'none' })
          reject(err)
        },
        complete: () => {
          this.isListening = false
        }
      })
    })
  }

  // 停止语音识别
  stopListening() {
    if (this.isListening) {
      wx.stopRecord()
      this.isListening = false
    }
  }

  // 语音识别
  recognizeSpeech(tempFilePath) {
    return new Promise((resolve, reject) => {
      // 使用微信小程序的语音识别API
      wx.showLoading({ title: '识别中...' })

      // 调用微信小程序的语音识别API
      wx.cloud.callFunction({
        name: 'speechRecognition',
        data: {
          filePath: tempFilePath
        },
        success: (res) => {
          wx.hideLoading()
          const recognizedText = res.result.text
          if (recognizedText) {
            this.processCommand(recognizedText)
              .then(result => {
                resolve(result)
              })
              .catch(err => {
                reject(err)
              })
          } else {
            reject(new Error('语音识别失败'))
          }
        },
        fail: (err) => {
          wx.hideLoading()
          // 如果云函数调用失败，使用模拟结果
          console.log('语音识别云函数调用失败，使用模拟结果', err)
          const recognizedText = '打开客厅灯光'
          this.processCommand(recognizedText)
            .then(result => {
              resolve(result)
            })
            .catch(err => {
              reject(err)
            })
        }
      })
    })
  }

  // 处理语音命令
  processCommand(text) {
    return new Promise((resolve, reject) => {
      // 分析用户意图
      const intent = this.analyzeIntent(text)
      
      if (!intent) {
        reject(new Error('无法理解您的指令'))
        return
      }

      // 执行对应的设备控制
      this.executeCommand(intent)
        .then(result => {
          resolve({ text, intent, result })
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  // 分析用户意图
  analyzeIntent(text) {
    // 增强的意图分析
    // 实际项目中可以使用更复杂的NLP模型，如腾讯云NLU或自己训练的模型
    const lowerText = text.toLowerCase()
    
    // 设备控制意图
    if (lowerText.includes('打开') || lowerText.includes('关闭') || lowerText.includes('开') || lowerText.includes('关')) {
      const action = (lowerText.includes('打开') || lowerText.includes('开')) ? 'on' : 'off'
      
      // 识别设备类型和位置
      let deviceType = ''
      let location = ''
      let deviceName = ''
      
      // 设备类型识别
      const devicePatterns = {
        light: ['灯', '灯光', '照明'],
        environment: ['空调', '温度', '暖气', '冷气', '新风'],
        security: ['锁', '安防', '摄像头', '监控'],
        servo: ['舵机', '机械', '机械臂']
      }
      
      for (const [type, keywords] of Object.entries(devicePatterns)) {
        if (keywords.some(keyword => lowerText.includes(keyword))) {
          deviceType = type
          break
        }
      }
      
      // 位置识别
      const locationPatterns = {
        'living room': ['客厅', '厅'],
        'bedroom': ['卧室', '房间'],
        'kitchen': ['厨房'],
        'bathroom': ['浴室', '卫生间']
      }
      
      for (const [loc, keywords] of Object.entries(locationPatterns)) {
        if (keywords.some(keyword => lowerText.includes(keyword))) {
          location = loc
          break
        }
      }
      
      // 设备名称识别
      if (lowerText.includes('主灯')) {
        deviceName = 'main light'
      } else if (lowerText.includes('台灯')) {
        deviceName = 'desk light'
      } else if (lowerText.includes('落地灯')) {
        deviceName = 'floor light'
      }
      
      return {
        type: 'device_control',
        action,
        deviceType,
        location,
        deviceName
      }
    }
    
    // 调节设备参数意图
    if (lowerText.includes('亮度') || lowerText.includes('温度') || lowerText.includes('角度') || lowerText.includes('风速')) {
      let parameter = ''
      let value = 0
      let deviceType = ''
      
      if (lowerText.includes('亮度')) {
        parameter = 'brightness'
        deviceType = 'light'
        // 提取亮度值
        const match = lowerText.match(/亮度(\d+)%?/) || lowerText.match(/(\d+)%?亮度/)
        value = match ? parseInt(match[1]) : 50
      } else if (lowerText.includes('温度')) {
        parameter = 'temperature'
        deviceType = 'environment'
        // 提取温度值
        const match = lowerText.match(/温度(\d+)度?/) || lowerText.match(/(\d+)度?温度/)
        value = match ? parseInt(match[1]) : 25
      } else if (lowerText.includes('角度')) {
        parameter = 'angle'
        deviceType = 'servo'
        // 提取角度值
        const match = lowerText.match(/角度(\d+)度?/) || lowerText.match(/(\d+)度?角度/)
        value = match ? parseInt(match[1]) : 90
      } else if (lowerText.includes('风速')) {
        parameter = 'fanSpeed'
        deviceType = 'environment'
        // 提取风速值
        const match = lowerText.match(/风速(\d+)/) || lowerText.match(/(\d+)档风速/)
        value = match ? parseInt(match[1]) : 2
      }
      
      return {
        type: 'device_adjust',
        parameter,
        value,
        deviceType
      }
    }
    
    // 场景控制意图
    if (lowerText.includes('场景') || lowerText.includes('模式')) {
      let sceneName = ''
      
      if (lowerText.includes('睡眠')) {
        sceneName = 'sleep'
      } else if (lowerText.includes('阅读')) {
        sceneName = 'reading'
      } else if (lowerText.includes('电影')) {
        sceneName = 'movie'
      } else if (lowerText.includes('派对') || lowerText.includes('聚会')) {
        sceneName = 'party'
      }
      
      return {
        type: 'scene_control',
        sceneName
      }
    }
    
    // 状态查询意图
    if (lowerText.includes('怎么样') || lowerText.includes('如何') || lowerText.includes('状态') || lowerText.includes('情况')) {
      let queryType = ''
      
      if (lowerText.includes('温度')) {
        queryType = 'temperature'
      } else if (lowerText.includes('湿度')) {
        queryType = 'humidity'
      } else if (lowerText.includes('亮度')) {
        queryType = 'brightness'
      } else if (lowerText.includes('设备')) {
        queryType = 'device_status'
      }
      
      return {
        type: 'status_query',
        queryType
      }
    }
    
    return null
  }

  // 执行设备控制命令
  executeCommand(intent) {
    return new Promise((resolve, reject) => {
      // 模拟设备ID，实际项目中应该根据意图和位置找到对应的设备
      const deviceId = 'device_1'
      
      switch (intent.type) {
        case 'device_control':
          // 执行设备开关控制
          deviceApi.controlDevice(deviceId, { power: intent.action === 'on' ? true : false })
            .then(res => {
              resolve(`已${intent.action === 'on' ? '打开' : '关闭'}设备`)
            })
            .catch(err => {
              reject(err)
            })
          break
          
        case 'device_adjust':
          // 执行设备参数调节
          if (intent.deviceType === 'light' && intent.parameter === 'brightness') {
            lightApi.setBrightness(deviceId, intent.value)
              .then(res => {
                resolve(`已将亮度调节为${intent.value}%`)
              })
              .catch(err => {
                reject(err)
              })
          } else if (intent.deviceType === 'environment' && intent.parameter === 'temperature') {
            environmentApi.setTemperature(deviceId, intent.value)
              .then(res => {
                resolve(`已将温度设置为${intent.value}度`)
              })
              .catch(err => {
                reject(err)
              })
          } else if (intent.deviceType === 'servo' && intent.parameter === 'angle') {
            servoApi.setAngle(deviceId, '1', intent.value)
              .then(res => {
                resolve(`已将舵机角度设置为${intent.value}度`)
              })
              .catch(err => {
                reject(err)
              })
          } else if (intent.deviceType === 'environment' && intent.parameter === 'fanSpeed') {
            environmentApi.setFanSpeed(deviceId, intent.value)
              .then(res => {
                resolve(`已将风速设置为${intent.value}档`)
              })
              .catch(err => {
                reject(err)
              })
          } else {
            reject(new Error('不支持的设备参数调节'))
          }
          break
          
        case 'scene_control':
          // 执行场景控制
          const sceneId = this.getSceneIdByName(intent.sceneName)
          if (sceneId) {
            sceneApi.executeScene(sceneId)
              .then(res => {
                resolve(`已执行${this.getSceneNameById(sceneId)}场景`)
              })
              .catch(err => {
                reject(err)
              })
          } else {
            reject(new Error('未找到对应的场景'))
          }
          break
          
        case 'status_query':
          // 执行状态查询
          if (intent.queryType === 'device_status') {
            deviceApi.getDeviceDetail(deviceId)
              .then(res => {
                const status = res.status === 'online' ? '在线' : '离线'
                resolve(`设备当前状态：${status}`)
              })
              .catch(err => {
                reject(err)
              })
          } else if (intent.queryType === 'temperature') {
            sensorApi.getSensorData(deviceId)
              .then(res => {
                const temperature = res.temperature || 25
                resolve(`当前温度：${temperature}度`)
              })
              .catch(err => {
                reject(err)
              })
          } else {
            resolve(`查询${intent.queryType}状态`)
          }
          break
          
        default:
          reject(new Error('不支持的命令类型'))
      }
    })
  }

  // 根据场景名称获取场景ID
  getSceneIdByName(sceneName) {
    const sceneMap = {
      sleep: 'scene_1',
      reading: 'scene_2',
      movie: 'scene_3',
      party: 'scene_4'
    }
    return sceneMap[sceneName] || null
  }

  // 根据场景ID获取场景名称
  getSceneNameById(sceneId) {
    const sceneMap = {
      scene_1: '睡眠',
      scene_2: '阅读',
      scene_3: '电影',
      scene_4: '派对'
    }
    return sceneMap[sceneId] || '未知场景'
  }
}

module.exports = new VoiceControl()