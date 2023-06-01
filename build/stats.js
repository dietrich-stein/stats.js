function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

/**
 * @author mrdoob / http://mrdoob.com/
 * @author Drecom Co.,Ltd. / http://www.drecom.co.jp/
 * @author Dietrich Stein / https://github.com/dietrich-stein/stats.js
 */
var Stats = /*#__PURE__*/function () {
  function Stats(config) {
    _classCallCheck(this, Stats);
    var defaultConfig = {
      maxFps: 60,
      maxMb: 100,
      drawInterval: 1000,
      containerStyle: 'position:fixed;top:0;left:0;opacity:0.9;z-index:10000',
      canvasStyle: 'width:160px;height:96px',
      showFps: true,
      showMs: true,
      showMb: true,
      frameColor: '#000022',
      graphColor: '#112244',
      fpsColor: '#ffffff',
      fpsTextColor: '#ffffff',
      msColor: '#00ffff',
      msTextColor: '#00ffff',
      mbColor: '#ff00ff',
      mbTextColor: '#ff00ff'
    };
    this.config = _objectSpread2(_objectSpread2({}, defaultConfig), config);
    this.MAX_MS = 1000 / this.config.maxFps;
    this.PR = Math.round(window.devicePixelRatio || 1) * 2;
    this.WIDTH = 80 * this.PR, this.HEIGHT = 48 * this.PR, this.TEXT_X = 3 * this.PR, this.TEXT_Y = 2 * this.PR, this.GRAPH_X = 3 * this.PR, this.GRAPH_Y = 25 * this.PR, this.GRAPH_WIDTH = 74 * this.PR, this.GRAPH_HEIGHT = 20 * this.PR, this.TEXT_Y_2 = this.GRAPH_Y / 2;
    this.lastFps = 0;
    this.lastMs = 0;
    this.lastMsY = this.GRAPH_HEIGHT;
    this.lastMb = 0;
    this.lastMbY = this.GRAPH_HEIGHT;

    // Determine whether JavaScript heap can be obtained.
    this.isReadMemTest = false;
    this.isReadMemTestMem = 0;
    this.isReadMemTestTime = (performance || Date).now() + 5000;
    this.canReadMem = false;
    if (self.performance && self.performance.memory && self.performance.memory.usedJSHeapSize) {
      this.isReadMemTest = true;
      this.isReadMemTestMem = self.performance.memory.usedJSHeapSize;
    }

    // Container, canvas, and context
    this.dom = document.createElement('div');
    this.dom.style.cssText = config.containerStyle;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.WIDTH;
    this.canvas.height = this.HEIGHT;
    this.canvas.style.cssText = this.config.canvasStyle;
    this.dom.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');
    this.context.font = 'bold ' + 9 * this.PR + 'px Helvetica,Arial,sans-serif';
    this.context.textBaseline = 'top';
    this.context.fillStyle = this.config.frameColor;
    this.context.fillRect(0, 0, this.WIDTH, this.HEIGHT);
    this.context.fillStyle = this.config.graphColor;
    this.context.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT);

    // Initialize metrics
    this.beginTime = (performance || Date).now();
    this.prevTime = this.beginTime;
    this.frames = 0;
    this.maxTime = 0;
  }
  _createClass(Stats, [{
    key: "getFps",
    value: function getFps() {
      return this.lastFps;
    }
  }, {
    key: "getMs",
    value: function getMs() {
      return this.lastMs;
    }
  }, {
    key: "getMb",
    value: function getMb() {
      return this.lastMb;
    }
  }, {
    key: "begin",
    value: function begin() {
      this.beginTime = (performance || Date).now();
    }
  }, {
    key: "end",
    value: function end() {
      this.frames++;
      var time = (performance || Date).now();
      var nowTime = time - this.beginTime;
      if (this.maxTime < nowTime) {
        this.maxTime = nowTime;
      }
      if (time >= this.prevTime + this.config.drawInterval) {
        var mb = 0;
        if (this.config.showMb) {
          if (this.isReadMemTest) {
            // Enable if there are heap fluctuations
            if (this.isReadMemTestMem !== performance.memory.usedJSHeapSize) {
              this.isReadMemTest = false;
              this.canReadMem = true;
            } else {
              if (this.isReadMemTestTime < time) {
                this.isReadMemTest = false;
              }
            }
          }
          if (this.canReadMem) {
            mb = window.performance.memory.usedJSHeapSize / 1048576;
          }
        }
        this.context.fillStyle = this.config.frameColor;
        this.context.fillRect(0, 0, this.WIDTH, this.GRAPH_Y);
        var lineText = '';
        if (this.config.showFps) {
          this.lastFps = this.frames * 1000 / (time - this.prevTime);
          lineText = Math.round(this.lastFps) + ' FPS';
          this.context.fillStyle = this.config.fpsTextColor;
          this.context.fillText(lineText, this.TEXT_X, this.TEXT_Y);
        }
        if (this.config.showMs) {
          this.lastMs = this.maxTime;
          lineText = Math.round(this.lastMs) + ' MS';
          this.context.fillStyle = this.config.msTextColor;
          this.context.fillText(lineText, this.GRAPH_WIDTH / 2 + 3 * this.PR, this.TEXT_Y);
        }
        if (this.config.showMb) {
          this.lastMb = mb;
          lineText = Math.round(this.lastMb) + ' MB';
          this.context.fillStyle = this.config.mbTextColor;
          this.context.fillText(lineText, this.TEXT_X, this.TEXT_Y_2);
        }
        this.context.drawImage(this.canvas, this.GRAPH_X + this.PR, this.GRAPH_Y, this.GRAPH_WIDTH - this.PR, this.GRAPH_HEIGHT, this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH - this.PR, this.GRAPH_HEIGHT);
        this.context.fillStyle = this.config.graphColor;
        this.context.fillRect(this.GRAPH_X + this.GRAPH_WIDTH - this.PR, this.GRAPH_Y, this.PR, this.GRAPH_HEIGHT);
        if (this.config.showFps) {
          this.context.fillStyle = this.config.fpsColor;
          var nowFpsY = Math.round((1 - this.lastFps / this.config.maxFps) * this.GRAPH_HEIGHT);
          if (nowFpsY < 0) nowFpsY = 0;
          this.context.fillRect(this.GRAPH_X + this.GRAPH_WIDTH - this.PR, this.GRAPH_Y + nowFpsY, this.PR, this.PR);
        }
        if (this.config.showMs) {
          this.lastMsY = this.drawLineGraph(this.config.msColor, this.MAX_MS, this.lastMs, this.lastMsY);
        }
        if (this.config.showMb) {
          this.lastMbY = this.drawLineGraph(this.config.mbColor, this.config.maxMb, this.lastMb, this.lastMbY);
        }
        this.prevTime = time;
        this.frames = 0;
        this.maxTime = 0;
      }
      return time;
    }
  }, {
    key: "update",
    value: function update() {
      this.beginTime = this.end();
    }
  }, {
    key: "drawLineGraph",
    value: function drawLineGraph(color, maxValue, newValue, lastY) {
      this.context.fillStyle = color;
      var newY = Math.round((1 - newValue / maxValue) * this.GRAPH_HEIGHT);
      if (this.GRAPH_HEIGHT - this.PR < newY) {
        newY = this.GRAPH_HEIGHT - this.PR;
      } else if (newY < 0) {
        newY = 0;
      }
      var head = Math.min(newY, lastY);
      var bottom = Math.max(newY, lastY);
      var height = bottom - head;
      if (height < this.PR) height = this.PR;
      this.context.fillRect(this.GRAPH_X + this.GRAPH_WIDTH - this.PR, this.GRAPH_Y + head, this.PR, height);
      return newY;
    }
  }]);
  return Stats;
}();

export { Stats as default };
