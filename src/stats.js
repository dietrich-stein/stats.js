/**
 * @author mrdoob / http://mrdoob.com/
 * @author Drecom Co.,Ltd. / http://www.drecom.co.jp/
 * @author Dietrich Stein / https://github.com/dietrich-stein/stats.js
 */

class Stats {
  constructor(config) {
    const defaultConfig = {
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
      mbTextColor: '#ff00ff',
    };
    this.config = {
      ...defaultConfig,
      ...config,
    };

    this.MAX_MS = 1000 / this.config.maxFps;
    this.PR = Math.round(window.devicePixelRatio || 1) * 2;
    this.WIDTH = 80 * this.PR,
    this.HEIGHT = 48 * this.PR,
    this.TEXT_X = 3 * this.PR,
    this.TEXT_Y = 2 * this.PR,
    this.GRAPH_X = 3 * this.PR,
    this.GRAPH_Y = 25 * this.PR,
    this.GRAPH_WIDTH = 74 * this.PR,
    this.GRAPH_HEIGHT = 20 * this.PR,
    this.TEXT_Y_2 = this.GRAPH_Y / 2;
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
    if (
      self.performance &&
      self.performance.memory &&
      self.performance.memory.usedJSHeapSize
    ) {
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

  getFps() {
    return this.lastFps;
  }

  getMs() {
    return this.lastMs;
  }

  getMb() {
    return this.lastMb;
  }

  begin() {
    this.beginTime = (performance || Date).now();
  }

  end() {
    this.frames++;
    let time = (performance || Date).now();
    let nowTime = time - this.beginTime;
    if (this.maxTime < nowTime) {
      this.maxTime = nowTime;
    }
    if (time >= this.prevTime + this.config.drawInterval) {
      let mb = 0;
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
  
      let lineText = '';
      if (this.config.showFps) {
        this.lastFps = (this.frames * 1000) / (time - this.prevTime);        
        lineText = Math.round(this.lastFps) + ' FPS';
        this.context.fillStyle = this.config.fpsTextColor;        
        this.context.fillText(lineText, this.TEXT_X, this.TEXT_Y);
      }
      if (this.config.showMs) {
        this.lastMs = this.maxTime;
        lineText = Math.round(this.lastMs) + ' MS';
        this.context.fillStyle = this.config.msTextColor;        
        this.context.fillText(lineText, (this.GRAPH_WIDTH / 2) + (3 * this.PR), this.TEXT_Y);        
      }
      if (this.config.showMb) {
        this.lastMb = mb;
        lineText = Math.round(this.lastMb) + ' MB';
        this.context.fillStyle = this.config.mbTextColor;
        this.context.fillText(lineText, this.TEXT_X, this.TEXT_Y_2);
      }
  
      this.context.drawImage(
        this.canvas,
        this.GRAPH_X + this.PR,
        this.GRAPH_Y,
        this.GRAPH_WIDTH - this.PR,
        this.GRAPH_HEIGHT,
        this.GRAPH_X,
        this.GRAPH_Y,
        this.GRAPH_WIDTH - this.PR,
        this.GRAPH_HEIGHT,
      );
  
      this.context.fillStyle = this.config.graphColor;
      this.context.fillRect(this.GRAPH_X + this.GRAPH_WIDTH - this.PR, this.GRAPH_Y, this.PR, this.GRAPH_HEIGHT);
  
      if (this.config.showFps) {
        this.context.fillStyle = this.config.fpsColor;
        let nowFpsY = Math.round((1 - this.lastFps / this.config.maxFps) * this.GRAPH_HEIGHT);
        if (nowFpsY < 0) nowFpsY = 0;
        this.context.fillRect(
          this.GRAPH_X + this.GRAPH_WIDTH - this.PR,
          this.GRAPH_Y + nowFpsY,
          this.PR,
          this.PR,
        );
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

  update() {
    this.beginTime = this.end();
  }

  drawLineGraph(color, maxValue, newValue, lastY) {
    this.context.fillStyle = color;
    let newY = Math.round((1 - newValue / maxValue) * this.GRAPH_HEIGHT);
    if (this.GRAPH_HEIGHT - this.PR < newY) {
      newY = this.GRAPH_HEIGHT - this.PR;
    } else if (newY < 0) {
      newY = 0;
    }
    let head = Math.min(newY, lastY);
    let bottom = Math.max(newY, lastY);
    let height = bottom - head;
    if (height < this.PR) height = this.PR;
    this.context.fillRect(this.GRAPH_X + this.GRAPH_WIDTH - this.PR, this.GRAPH_Y + head, this.PR, height);
    return newY;
  }
}

export default Stats;
