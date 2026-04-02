Component({
  properties: {
    label: {
      type: String,
      value: ''
    },
    icon: {
      type: String,
      value: 'setting'
    },
    iconBg: {
      type: String,
      value: '#4a90d9'
    },
    value: {
      type: Number,
      value: 0
    },
    min: {
      type: Number,
      value: 0
    },
    max: {
      type: Number,
      value: 100
    },
    step: {
      type: Number,
      value: 1
    },
    unit: {
      type: String,
      value: ''
    },
    activeColor: {
      type: String,
      value: '#4a90d9'
    },
    backgroundColor: {
      type: String,
      value: '#e8e8e8'
    },
    blockSize: {
      type: Number,
      value: 24
    },
    showMarks: {
      type: Boolean,
      value: false
    },
    marks: {
      type: Array,
      value: []
    }
  },

  data: {
    currentValue: 0
  },

  observers: {
    'value': function(val) {
      this.setData({ currentValue: val })
    }
  },

  methods: {
    onChange(e) {
      const value = e.detail.value
      this.setData({ currentValue: value })
      this.triggerEvent('change', { value })
    },

    onChanging(e) {
      const value = e.detail.value
      this.setData({ currentValue: value })
      this.triggerEvent('changing', { value })
    }
  }
})
