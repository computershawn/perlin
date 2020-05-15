// Based on code from Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/BjoM9oKOAKY

const inc = 0.01;
const scl = 20;
const colorful = false;
const MODES = {
  RAINBOW: 1,
  MONO: 2,
  BLUE: 3,
  DARK: 4,
};
const ORIG = {
  RANDO: 0,
  XSHAPE: 1,
  SPOT: 2,
  BOTTOM: 3,
}
const LAYOUTS = {
  SINGLE: 0,
  TILED: 1,
}

let mode = MODES.MONO;
let origin = ORIG.BOTTOM;
let cols, rows;
let layout = LAYOUTS.SINGLE;

let fr;

let particles = [];

let flowfield = [];

let xoff, yoff
let zoff = 0;

const num = 2000;
const maxFrames = 400;

let pg;

function setup() {
  createCanvas(640, 640);
  pg = createGraphics(width, height);
  pg.colorMode(HSB, 255, 100, 100);
  colorMode(HSB, 255, 100, 100);
  cols = floor(width / scl);
  rows = floor(height / scl);
  fr = createP('');

  flowfield = new Array(cols * rows);

  for (var i = 0; i < num; i++) {
    particles.push(particle(origin));
  }

  let bgColor;
  switch(mode) {
    case MODES.RAINBOW:
      pg.background(0, 0, 15);
      break;
    case MODES.MONO:
      pg.background(0, 0, 100);
      break;
    case MODES.BLUE:
      pg.background(160, 90, 90);
      break;
    case MODES.DARK:
      pg.background(0, 0, 0);
      break;
    default:
      pg.bgColor = color(255);
      background(255, 100, 100);
  }
}

const updateFlowField = () => {
  var yoff = 0;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      var index = x + y * cols;
      // var angle = noise(xoff, yoff, zoff) * TWO_PI * 4;

      const noi = round(6 * noise(xoff, yoff, zoff)) / 6;
      const angle = noi * TWO_PI * 4;
      // var angle = noise(xoff, yoff, zoff) * TWO_PI * 4;

      // if(y === 0 && x === 0) {
      //   console.log('noi', noi);
      // }

      var v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowfield[index] = v;
      xoff += inc;
      // stroke(255, 25);
      // push();
      // translate(x * scl, y * scl);
      // rotate(v.heading());
      // strokeWeight(1);
      // line(0, 0, scl, 0);
      // pop();
    }
    yoff += inc;

    zoff += 0.0003;
  }
}

const updateParticles = () => {
  for (var i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].edges();
    particles[i].show(colorful);
  }
}

const renderSingle = () => {
  // SINGLE IMAGE
  image(pg, 0, 0);
}

const renderTiled = () => {
 // GRID OF 4 TILES
  image(pg, 0, 0, width / 2, height / 2);

  push();
  translate(width, 0);
  scale(-1, 1);
  image(pg, 0, 0, width / 2, height / 2);
  pop();

  push();
  translate(0, height);
  scale(1, -1);
  image(pg, 0, 0, width / 2, height / 2);
  pop();

  push();
  translate(width, height);
  scale(-1, -1);
  image(pg, 0, 0, width / 2, height / 2);
  pop();
}

function draw() {
  updateFlowField(true);
  updateParticles();
  
  // fr.html(floor(frameRate()));
  
  switch(layout) {
    case LAYOUTS.SINGLE:
      renderSingle();
      break;
    case LAYOUTS.TILED:
      renderTiled();
      break;
    default:
      renderSingle();
  }

  if(frameCount > maxFrames) noLoop();
}