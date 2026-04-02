const app = getApp()
const { request, showToast } = require('../utils/util')

const deviceApi = {
  getDeviceList: () => {
    return request({
      url: '/devices',
      method: 'GET'
    })
  },

  getDeviceDetail: (deviceId) => {
    return request({
      url: `/devices/${deviceId}`,
      method: 'GET'
    })
  },

  addDevice: (data) => {
    return request({
      url: '/devices',
      method: 'POST',
      data
    })
  },

  updateDevice: (deviceId, data) => {
    return request({
      url: `/devices/${deviceId}`,
      method: 'PUT',
      data
    })
  },

  deleteDevice: (deviceId) => {
    return request({
      url: `/devices/${deviceId}`,
      method: 'DELETE'
    })
  },

  controlDevice: (deviceId, command) => {
    return request({
      url: `/devices/${deviceId}/control`,
      method: 'POST',
      data: command
    })
  },

  getDeviceData: (deviceId, params) => {
    return request({
      url: `/devices/${deviceId}/data`,
      method: 'GET',
      data: params
    })
  },

  getDeviceHistory: (deviceId, params) => {
    return request({
      url: `/devices/${deviceId}/history`,
      method: 'GET',
      data: params
    })
  },

  setDeviceGroup: (deviceId, groupId) => {
    return request({
      url: `/devices/${deviceId}/group`,
      method: 'PUT',
      data: { groupId }
    })
  }
}

const sensorApi = {
  getSensorData: (deviceId) => {
    return request({
      url: `/sensors/${deviceId}/data`,
      method: 'GET'
    })
  },

  getSensorHistory: (deviceId, params) => {
    return request({
      url: `/sensors/${deviceId}/history`,
      method: 'GET',
      data: params
    })
  },

  getSensorAlerts: (deviceId) => {
    return request({
      url: `/sensors/${deviceId}/alerts`,
      method: 'GET'
    })
  }
}

const lightApi = {
  setBrightness: (deviceId, brightness) => {
    return request({
      url: `/lights/${deviceId}/brightness`,
      method: 'POST',
      data: { brightness }
    })
  },

  setColor: (deviceId, color) => {
    return request({
      url: `/lights/${deviceId}/color`,
      method: 'POST',
      data: color
    })
  },

  setColorTemp: (deviceId, temp) => {
    return request({
      url: `/lights/${deviceId}/colortemp`,
      method: 'POST',
      data: { temp }
    })
  },

  setScene: (deviceId, sceneId) => {
    return request({
      url: `/lights/${deviceId}/scene`,
      method: 'POST',
      data: { sceneId }
    })
  }
}

const environmentApi = {
  setTemperature: (deviceId, temperature) => {
    return request({
      url: `/environment/${deviceId}/temperature`,
      method: 'POST',
      data: { temperature }
    })
  },

  setMode: (deviceId, mode) => {
    return request({
      url: `/environment/${deviceId}/mode`,
      method: 'POST',
      data: { mode }
    })
  },

  setFanSpeed: (deviceId, speed) => {
    return request({
      url: `/environment/${deviceId}/fan`,
      method: 'POST',
      data: { speed }
    })
  }
}

const securityApi = {
  getCameraStream: (deviceId) => {
    return request({
      url: `/security/${deviceId}/stream`,
      method: 'GET'
    })
  },

  getAlerts: (deviceId) => {
    return request({
      url: `/security/${deviceId}/alerts`,
      method: 'GET'
    })
  },

  setAlarmMode: (deviceId, mode) => {
    return request({
      url: `/security/${deviceId}/alarm`,
      method: 'POST',
      data: { mode }
    })
  },

  unlockDoor: (deviceId) => {
    return request({
      url: `/security/${deviceId}/unlock`,
      method: 'POST'
    })
  }
}

const servoApi = {
  setAngle: (deviceId, servoId, angle) => {
    return request({
      url: `/servo/${deviceId}/angle`,
      method: 'POST',
      data: { servoId, angle }
    })
  },

  setSpeed: (deviceId, servoId, speed) => {
    return request({
      url: `/servo/${deviceId}/speed`,
      method: 'POST',
      data: { servoId, speed }
    })
  },

  runAction: (deviceId, actionId) => {
    return request({
      url: `/servo/${deviceId}/action`,
      method: 'POST',
      data: { actionId }
    })
  },

  stopServo: (deviceId, servoId) => {
    return request({
      url: `/servo/${deviceId}/stop`,
      method: 'POST',
      data: { servoId }
    })
  },

  getServoStatus: (deviceId) => {
    return request({
      url: `/servo/${deviceId}/status`,
      method: 'GET'
    })
  }
}

const sceneApi = {
  getSceneList: () => {
    return request({
      url: '/scenes',
      method: 'GET'
    })
  },

  getSceneDetail: (sceneId) => {
    return request({
      url: `/scenes/${sceneId}`,
      method: 'GET'
    })
  },

  createScene: (data) => {
    return request({
      url: '/scenes',
      method: 'POST',
      data
    })
  },

  updateScene: (sceneId, data) => {
    return request({
      url: `/scenes/${sceneId}`,
      method: 'PUT',
      data
    })
  },

  deleteScene: (sceneId) => {
    return request({
      url: `/scenes/${sceneId}`,
      method: 'DELETE'
    })
  },

  executeScene: (sceneId) => {
    return request({
      url: `/scenes/${sceneId}/execute`,
      method: 'POST'
    })
  },

  getSceneHistory: (sceneId) => {
    return request({
      url: `/scenes/${sceneId}/history`,
      method: 'GET'
    })
  }
}

const userApi = {
  login: (code) => {
    return request({
      url: '/user/login',
      method: 'POST',
      data: { code }
    })
  },

  getUserInfo: () => {
    return request({
      url: '/user/info',
      method: 'GET'
    })
  },

  updateUserInfo: (data) => {
    return request({
      url: '/user/info',
      method: 'PUT',
      data
    })
  },

  getSettings: () => {
    return request({
      url: '/user/settings',
      method: 'GET'
    })
  },

  updateSettings: (data) => {
    return request({
      url: '/user/settings',
      method: 'PUT',
      data
    })
  }
}

module.exports = {
  deviceApi,
  sensorApi,
  lightApi,
  environmentApi,
  securityApi,
  servoApi,
  sceneApi,
  userApi
}
