;(function (window, $) {
  /**
   * constructor TickProcess
   * @param {Object} opts init options
   */
  function TickProcess(opts) {
    this.$el = $(opts.el)
    this.$bar = null

    this.tickSpace = opts.tickSpace || 80
    // 首尾间距
    this.pad = 38
    // 时间间隔
    this.timeout = 1000
    this.duration = 0.27
    this.color = '#f00'
    // 循环
    this.loop = opts.loop || false

    this.playing = false
    this.end = false

    // hooks
    this.onEnd = opts.onEnd || function () {}
    this.onChange = opts.onChange || function () {}
    this.onTickClick = opts.onTickClick || function () {}

    this.current = opts.current || 0
    this._cursorWidth = this.pad

    // 组织数据
    this.data = opts.data || []
    this.renderData = this.generateData(opts.data)
    this.currentTick = opts.currentTick || this.renderData[this.current]
    this._max = this.renderData.length
  }

  var TickProcessPrototies = {
    init: function () {
      var self = this

      this.initDom()

      // 初始化容器样式
      this.initElStyle()

      this.addClickListener()
    },

    play: function () {
      this.end = false
      this.paused = false
      this.playing = true
      this.handlePlay()
    },

    pause: function () {
      this.playing = false
      this.paused = true
      this.clearTimeout()
    },

    addClickListener() {
      var self = this
      self.$el.on('click', '.tick-process-tick', function (e) {
        var dataset = $(this).data()
        if (!self.playing) {
          self.setCurrent(dataset.tickIndex)
        }
        self.onTickClick.call(self, dataset, $(this), self)
      })
    },

    handlePlay: function () {
      var self = this
      var timeout = this.timeout
      
      if (self.paused) return

      if (self._timer) {
        clearTimeout(self._timer)
        self._timer = null
      }

      self._timer = setTimeout(function () {
        self.current += 1
        self._cursorWidth += self.tickSpace

        if (self.current >= self._max) {
          self.current = 0
          self._cursorWidth = self.pad

          if (!self.loop) {
            self.clearTimeout()
            // 结束
            self.onEnd.call(self, self)
            self.playing = false
            self.end = true
          }
        }

        self.setCurrent(self.current)

        self.onChange.call(self, self.getCurrent(), self)

        !self.end && self.handlePlay()
      }, timeout)
    },

    setCurrent(index) {
      this.current = index
      this.currentTick = this.getCurrent(index)
      this._cursorWidth = this.current * this.tickSpace + this.pad

      this.updateProcess()
      this.updateBar()
    },

    getCurrent(index) {
      return this.renderData[index || this.current]
    },

    clearTimeout() {
      if (self._timer) {
        clearTimeout(self._timer)
        self._timer = null
      }
    },

    updateBar: function () {
      var self = this
      var elW = self.$el.width()
      var barW = self.$bar.width()

      var transX = elW - self._cursorWidth - self.tickSpace

      if (barW > elW + 2 * self.pad && elW - self._cursorWidth < 0) {
        return self.transform(self.$bar, transX)
      }
      self.transform(self.$bar, 0)
    },

    transform: function (ele, x) {
      var self = this
      var styles = {
        transform: 'translateX(' + self.getPix(x) + ')',
        'transition-property': `transform`,
        'transition-timing-function': `ease-in-out`,
        'transition-duration': `${self.duration}s`,
      }
      ele.css(styles)
    },

    updateProcess: function () {
      var self = this

      self.$cursor.css({
        width: self.getPix(self._cursorWidth),
        'transition-property': `width`,
        'transition-timing-function': `ease-in-out`,
        'transition-duration': `${self.duration}s`,
        backgroundColor: self.color,
      })
    },

    initDom: function () {
      var self = this
      self.$bar = $('<div class="tick-process-bar"></div>')

      var ticks = $.map(self.renderData, function (v, i) {
        var $tick = $(self.createTickTpl(v))
        $tick.css({
          left: self.pad + i * self.tickSpace + 'px',
        })
        $tick.attr('data-tick-index', i)
        return $tick
      })
      var cursorTpl = self.createCursorTpl()

      self.$ticks = ticks
      self.$cursor = $(cursorTpl)

      self.$bar.append(self.$ticks)
      self.$bar.append(self.$cursor)
      self.$el.append(self.$bar)
    },

    /**
     * 初始化刻度容器的样式
     */
    initElStyle: function () {
      var len = this.renderData.length
      var w = this.getPix(len * this.tickSpace)
      var cw = this.getPix(this._cursorWidth)

      this.$bar.css({
        width: w,
      })
      this.$cursor.css({
        width: cw,
      })
    },

    /**
     * get pix
     * @param {Number} num
     * @returns
     */
    getPix: function (num) {
      return num + 'px'
    },

    /**
     * 处理数据
     * @param {Array} data 源数据
     * @returns [{ label, value }]
     */
    generateData: function (data) {
      return $.map(data, function (itm) {
        return {
          label: itm,
          value: itm,
        }
      })
    },

    /**
     * 生成刻度模板
     * @param {Object} item
     * @returns
     */
    createTickTpl: function (item) {
      return (
        '<span class="tick-process-tick" data-tick-value="' +
        item.value +
        '">' +
        '<span class="tick-process-tick-label">' +
        item.label +
        '</span>' +
        '</span>'
      )
    },

    /**
     * 生成进度模板
     * @returns
     */
    createCursorTpl: function () {
      return '<span class="tick-process-cursor"></span>'
    },
  }

  for (var prop in TickProcessPrototies) {
    TickProcess.prototype[prop] = TickProcessPrototies[prop]
  }

  window.TickProcess = TickProcess
})(window, $)
