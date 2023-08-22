var canvas;
var stage;
var imgSeq = new Image();       // The image for the sparkle animation
var sprite;                     // The animated sparkle template to clone
var fpsLabel;
var fader;                      // Semi fades the Background to give a tracing effect
var spkls;
var windowWidth = window.innerWidth;
var windowHeight =  window.innerHeight;       
var saluteStarded = false;
var bgColor = "rgba(0,25,25, 0.3)";



// Container for all the sparkles
function init() {
  // create a new stage and point it at our canvas:
  canvas = document.getElementById("testCanvas");
  canvas.width = windowWidth;
  canvas.height = windowHeight;
  stage = new createjs.StageGL(canvas, {preserveBuffer:true, antialias:true});
  stage.autoClear = false;
  stage.setClearColor(0x000000);
  
  // attach mouse handlers directly to the source canvas.
  // better than calling from canvas tag for cross browser compatibility:
  stage.addEventListener("stagemousemove", moveCanvas);
  stage.addEventListener("stagemousedown", clickCanvas);
  // document.addEventListener("touchmove", (e) => touchMoveCanvas(e));
  
  var img = new Image();
  img.crossOrigin="Anonymous";
  img.onload = imageLoaded;
  img.src = "./images/spritesheet_sparkle.png";
}

function handleResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  fader.graphics.clear().beginFill("rgba(0,25,25, 0.3)").drawRect(0,0, canvas.width, canvas.height).endFill();
  fader.cache(0,0, canvas.width,canvas.height, 1/32);
  stage.updateViewport(canvas.width, canvas.height);
  stage.update();
}

function imageLoaded() {
  
  // define simple sprite sheet data specifying the image(s) to use, the size of the frames,
  // and the registration point of the frame
  // it will auto-calculate the number of frames from the image dimensions and loop them
  var data = {
    images: [this], //'this' is a reference to the loaded image. Image loaded crossOrigin will throw security errors. For more information on Cross Origin Issues: https://www.createjs.com/docs/easeljs/classes/SpriteSheet.html 
    frames: {
      width: 21,
      height: 23,
      regX: 10,
      regY: 11
    }
  };
  // set up an animation instance, which we will clone
  sprite = new createjs.Sprite(new createjs.SpriteSheet(data));
  // setup slow fadeout
  fader = new createjs.Shape();
  stage.addChild(fader);
  var gfx = fader.graphics;
  gfx.beginFill(bgColor).drawRect(0,0, 1024, 704).endFill();
  fader.cache(0,0, 1024,1024, 1/32); // Power of two textures smooth better, but we don't need full resolution either
  spkls = new createjs.Container();
  stage.addChild(spkls);
  // add a text object to output the current FPS:
  /*fpsLabel = new createjs.Text("------ @ -- fps", "bold 14px Arial", "#FFF");
  stage.addChild(fpsLabel);
  fpsLabel.x = 10;
  fpsLabel.y = 20;
  fpsLabel.cache(0, 0, 128, 16);*/
  // start the tick and point it at the window so we can do some work before updating the stage:
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.addEventListener("tick", tick);
   
  handleResize();
  window.addEventListener("resize", handleResize);
}
function tick(event) {
  // loop through all of the active sparkles on stage:
  var l = spkls.numChildren;
  var m = event.delta / 16;
  for (var i = 0; i < l; i++) {
    var sparkle = spkls.getChildAt(i);
    if(--sparkle.life <= 0) {
      spkls.removeChild(sparkle);
      i--; l--;
      continue;
    }
    // apply gravity and friction
    sparkle.vY += 0.1 * m;
    // update position, scale, and alpha:
    sparkle.x += sparkle.vX * m;
    sparkle.y += sparkle.vY * m;
    sparkle.alpha = sparkle.alphaStart * (sparkle.life / sparkle.lifeMax);
    // remove sparkles that are off screen or not invisible
    if (sparkle.y > canvas.height) {
      sparkle.vY *= -(Math.random() * 0.1 + 0.8);
      sparkle.vX += Math.cos( Math.random() * Math.PI * 2) * 3;
    } else if (sparkle.y < 0) {
      sparkle.vY *= 0.9;
    }
    if (sparkle.x > canvas.width || sparkle.x < 0) {
      sparkle.vX *= -1;
    }
  }
  /*fpsLabel.text = l + " @ " + Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";
  fpsLabel.updateCache();*/
  // draw the updates to stage
  stage.update(event);
}

// sparkle explosion
function clickCanvas(evt) {
  addSparkles(Math.random() * 1500 + 200 | 0, stage.mouseX, stage.mouseY, 1);
  if (!saluteStarded) {
    startSalute();
    saluteStarded = true;
    bgColor = "rgba(0,25,25, 0.3)";
  }
}
function startSalute() {
  setTimeout(() => loop(), 2000)
}
function explodeSalute() {
  var saluteWidth = Math.random() * windowWidth;
  var saluteHeight = Math.random() * windowHeight;
  var saluteSpeed = (Math.random() * .3) + 0.1;
  addSparkles(Math.random() * 1500 + 200 | 0, saluteWidth, saluteHeight, saluteSpeed);
}

function loop() {
  var rand = Math.random() * 500;
  console.log(rand, 'rand')
  setTimeout(function() {
    explodeSalute();
    loop();  
  }, rand);
};

// sparkle trail
function moveCanvas(evt) {
  // addSparkles(Math.random() * 500 + 200 | 0, stage.mouseX, stage.mouseY, 1);
  addSparkles((Math.random() * 6 + 3) | 0, stage.mouseX, stage.mouseY, 0.1);
}
// function touchMoveCanvas(evt) {
//   console.log(evt, 'touchMoveCanvas');
//   // addSparkles(Math.random() * 500 + 200 | 0, stage.mouseX, stage.mouseY, 1);
//   addSparkles((Math.random() * 6 + 3) | 0, evt.targetTouches
//   .mouseX, evt.mouseY, 0.1);
// }
function addSparkles(count, x, y, speed) {
  // create the specified number of sparkles
  for (var i = 0; i < count; i++) {
    // clone the original sparkle, so we don't need to set shared properties:
    var sparkle = sprite.clone();
    // set display properties:
    sparkle.x = x;
    sparkle.y = y;
    sparkle.rotation = Math.random()*360;
    sparkle.alpha = sparkle.alphaStart = Math.random() * 0.7 + 0.6;
    sparkle.scale = Math.random() + 0.3;
    sparkle.life = sparkle.lifeMax = Math.random() * 100 + 50;
    // set up velocities:
    var a = Math.PI * 2 * Math.random();
    var v = (Math.random() - 0.5) * 30 * speed;
    sparkle.vX = Math.cos(a) * v;
    sparkle.vY = Math.sin(a) * v;
    // start the animation on a random frame:
    sparkle.gotoAndPlay(Math.random() * sparkle.spriteSheet.getNumFrames() | 0);
    // add to the display list:
    spkls.addChild(sparkle);
  }

}

init();
