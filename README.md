# stats.js

<!--
[![npm](https://img.shields.io/npm/v/@drecom/stats.js.svg)](https://www.npmjs.com/package/@drecom/stats.js)
[![license](https://img.shields.io/github/license/drecom/stats.js.svg)](LICENSE)
-->

This repo is a customized fork of [drecom/stats.js](https://github.com/drecom/stats.js).

The parent of this repo is a customized fork of [mrdoob/stats.js](https://github.com/mrdoob/stats.js).

## What changed in this fork?

- Updated Babel and rollup
- Converted module to ESM syntax
- Using an object for configuration
- Added color options
- Changed to line style for FPS graph
- Modified the default graph colors
- Removed alert coloring
- Removed custom graphs

## What changed in the parent fork?

 - Combined all the stats.js monitors into one.
 - Added getters of various parameters.
 - Added text display area.
 - Reduced drawing load. (but, reduced drawing frequency. Optional changeable.) 

![customized.png](https://raw.githubusercontent.com/drecom/stats.js/master/files/customized.png)

* **FPS** Frames rendered in the last second. The higher the number the better.
* **MS** Maximum number of milliseconds between graph drawing. The lower the number the better.
* **MB** MBytes of allocated js memory. (Enabled by default in Chrome for desktop 69 and later)

## Usage

All settings are optional. The defaults are shown below.

```javascript
var stats = new Stats({
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
});

document.body.appendChild(stats.dom);

function animate() {
    stats.begin();
    // monitored code goes here
    stats.end();
    requestAnimationFrame(animate);
}

animate();
```
