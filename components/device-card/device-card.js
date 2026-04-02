Component({
  properties: {
    device: {
      type: Object,
      value: {}
    },
    size: {
      type: String,
      value: 'normal'
    },
    showSwitch: {
      type: Boolean,
      value: true
    }
  },

  data: {
    statusText: ''
  },

  observers: {
    'device.status': function(status) {
      const statusMap = {
        online: '在线',
        offline: '离线',
        warning: '警告',
        error: '故障'
      }
      this.setData({ statusText: statusMap[status] || '未知' })
    }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', { device: this.properties.device })
    },

    onSwitchChange(e) {
      const value = e.detail.value
      this.triggerEvent('switch', { 
        device: this.properties.device, 
        value 
      })
    }
  }
})
