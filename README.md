# @drecom/stats.js

[![npm](https://img.shields.io/npm/v/@drecom/stats.js.svg)](https://www.npmjs.com/package/@drecom/stats.js)
[![license](https://img.shields.io/github/license/drecom/stats.js.svg)](LICENSE)

@drecom/stats.js is a customized [mrdoob/stats.js](https://github.com/mrdoob/stats.js)

## What changed?

 - Combined all the stats.js monitors into one.
 - Added getters of various parameters.
 - Added text display area.
 - Reduced drawing load. (but, reduced drawing frequency. Optional changeable.) 

![customized.png](https://raw.githubusercontent.com/drecom/stats.js/master/files/customized.png)

* **FPS** Frames rendered in the last second. The higher the number the better.
* **MS** Maximum number of milliseconds between graph drawing. The lower the number the better.
* **MB** MBytes of allocated memory. (Run Chrome with `--enable-precise-memory-info`)

### Usage ###

```javascript
var stats = new Stats({maxFPS:60, maxMem:100}); // Set upper limit of graph
document.body.appendChild( stats.dom );

function animate() {

    stats.begin();

    // monitored code goes here

    stats.end();

    requestAnimationFrame( animate );
}

animate();
```
