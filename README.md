# @drecom/stats.js

@drecom/stats.js is a customized [mrdoob/stats.js](https://github.com/mrdoob/stats.js)

Combined all the stats.js monitors into one.

![customized.png](https://raw.githubusercontent.com/drecom/stats.js/master/files/customized.png)

* **FPS** Frames rendered in the last second. The higher the number the better.
* **MS** Milliseconds needed to render a frame. The lower the number the better.
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
