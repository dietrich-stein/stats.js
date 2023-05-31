/**
 * @author mrdoob / http://mrdoob.com/
 * @author Drecom Co.,Ltd. / http://www.drecom.co.jp/
 * @author Dietrich Stein / https://github.com/dietrich-stein/stats.js
 */

var Stats = function (config) {
	const defaultConfig = {
	  maxFps: 60,
	  maxMb: 100,
	  drawInterval: 1000,
	  containerStyle: 'position:fixed;top:0;left:0;opacity:0.9;z-index:10000',
	  canvasStyle: 'width:160px;height:96px',
	  showFps: true,
	  showMs: false,
	  showMb: false,
	  frameColor: '#000022',
	  graphColor: '#112244',
	  fpsColor: '#ffffff',
	  fpsTextColor: '#ffffff',
	  msColor: '#00ffff',
	  msTextColor: '#00ffff',
	  mbColor: '#ff00ff',
	  mbTextColor: '#ff00ff',
	};
	config = {
	  ...defaultConfig,
	  ...config,
	};
  
	// Determine whether JavaScript heap can be obtained.
	var isReadMemTest = false;
	var isReadMemTestMem = 0;
	var isReadMemTestTime = (performance || Date).now() + 5000;
	var canReadMem = false;
	if (
	  self.performance &&
	  self.performance.memory &&
	  self.performance.memory.usedJSHeapSize
	) {
	  isReadMemTest = true;
	  isReadMemTestMem = self.performance.memory.usedJSHeapSize;
	}
  
	var panel = new StatsPanel(config);
  
	var beginTime = (performance || Date).now(),
	  prevTime = beginTime,
	  frames = 0,
	  mem = 0,
	  maxTime = 0;
 
	return {
	  dom: panel.dom,
	  getFps: function () {
		return panel.getFps();
	  },
	  getMs: function () {
		return panel.getMs();
	  },
	  getMb: function () {
		return mem;
	  },
	  begin: function () {
		beginTime = (performance || Date).now();
	  },
	  end: function () {
		frames++;
		var time = (performance || Date).now();
		var nowTime = time - beginTime;
		if (maxTime < nowTime) {
		  maxTime = nowTime;
		}
		if (time >= prevTime + config.drawInterval) {
		  var mb = 0;
		  if (config.showMb) {
			if (isReadMemTest) {
			  // Enable if there are heap fluctuations
			  if (isReadMemTestMem !== performance.memory.usedJSHeapSize) {
				isReadMemTest = false;
				canReadMem = true;
			  } else {
				if (isReadMemTestTime < time) {
				  isReadMemTest = false;
				}
			  }
			}
			if (canReadMem) {
			  mb = window.performance.memory.usedJSHeapSize / 1048576;
			}
		  }
  
		  panel.update((frames * 1000) / (time - prevTime), maxTime, mb, config);
  
		  prevTime = time;
		  frames = 0;
		  maxTime = 0;
		}
		return time;
	  },
  
	  update: function () {
		beginTime = this.end();
	  },
	};
  };
  
  // A class that displays passed data in a graph.
  var StatsPanel = function (config) {
	var MAX_FPS = config.maxFps,
	  MAX_MS = 1000 / MAX_FPS;
	var PR = Math.round(window.devicePixelRatio || 1) * 2;
	var WIDTH = 80 * PR,
	  HEIGHT = 48 * PR,
	  TEXT_X = 3 * PR,
	  TEXT_Y = 2 * PR,
	  GRAPH_X = 3 * PR,
	  GRAPH_Y = 25 * PR,
	  GRAPH_WIDTH = 74 * PR,
	  GRAPH_HEIGHT = 20 * PR,
	  TEXT_Y_2 = GRAPH_Y / 2;
	var lastFps = 0;
	var lastMs = 0;
	var lastMsY = GRAPH_HEIGHT;
	var lastMb = 0;
	var lastMbY = GRAPH_HEIGHT;
 
	// Container, canvas, and context
	var container = document.createElement('div');
	container.style.cssText = config.containerStyle;
	var canvas = document.createElement('canvas');
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	container.appendChild(canvas);
	canvas.style.cssText = config.canvasStyle;
	var context = canvas.getContext('2d');
	context.font = 'bold ' + 9 * PR + 'px Helvetica,Arial,sans-serif';
	context.textBaseline = 'top';
	context.fillStyle = config.frameColor;
	context.fillRect(0, 0, WIDTH, HEIGHT);
	context.fillStyle = config.graphColor;
	context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);
  
	var drawLineGraph = function (color, maxValue, newValue, lastY) {
	  context.fillStyle = color;
	  var newY = Math.round((1 - newValue / maxValue) * GRAPH_HEIGHT);
	  if (GRAPH_HEIGHT - PR < newY) {
		newY = GRAPH_HEIGHT - PR;
	  } else if (newY < 0) {
		newY = 0;
	  }
	  var head = Math.min(newY, lastY);
	  var bottom = Math.max(newY, lastY);
	  var height = bottom - head;
	  if (height < PR) height = PR;
	  context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y + head, PR, height);
	  return newY;
	};
  
	return {
	  dom: container,
	  getFps: function () {
		return lastFps;
	  },
	  getMs: function () {
		return lastMs;
	  },
	  getMb: function () {
		return lastMb;
	  },
	  update: function (
		fps,
		ms,
		mb,
		config
	  ) {
		context.fillStyle = config.frameColor;
		context.fillRect(0, 0, WIDTH, GRAPH_Y);
  
		var lineText = '';
		if (config.showFps) {
		  lastFps = fps;        
		  lineText = Math.round(lastFps) + ' FPS';
		  context.fillStyle = config.fpsTextColor;        
		  context.fillText(lineText, TEXT_X, TEXT_Y);
		}
		if (config.showMs) {
		  lastMs = ms;
		  lineText = Math.round(lastMs) + ' MS';
		  context.fillStyle = config.msTextColor;        
		  context.fillText(lineText, (GRAPH_WIDTH / 2) + (3 * PR), TEXT_Y);        
		}
		if (config.showMb) {
		  lastMb = mb;
		  lineText = Math.round(lastMb) + ' MB';
		  context.fillStyle = config.mbTextColor;
		  context.fillText(lineText, TEXT_X, TEXT_Y_2);
		}
  
		context.drawImage(
		  canvas,
		  GRAPH_X + PR,
		  GRAPH_Y,
		  GRAPH_WIDTH - PR,
		  GRAPH_HEIGHT,
		  GRAPH_X,
		  GRAPH_Y,
		  GRAPH_WIDTH - PR,
		  GRAPH_HEIGHT,
		);
  
		context.fillStyle = config.graphColor;
		context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);
  
		if (config.showFps) {
		  context.fillStyle = config.fpsColor;
		  var nowFpsY = Math.round((1 - lastFps / MAX_FPS) * GRAPH_HEIGHT);
		  if (nowFpsY < 0) nowFpsY = 0;
		  context.fillRect(
			GRAPH_X + GRAPH_WIDTH - PR,
			GRAPH_Y + nowFpsY,
			PR,
			PR,
		  );
		}
  
		if (config.showMs) {
		  lastMsY = drawLineGraph(config.msColor, MAX_MS, lastMs, lastMsY);
		}
  
		if (config.showMb) {
		  lastMbY = drawLineGraph(config.mbColor, config.maxMb, lastMb, lastMbY);
		}      
	  }
	};
  };
  
  export default Stats;
  