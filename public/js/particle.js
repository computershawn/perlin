// Based on code from Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/BjoM9oKOAKY

const particle = (pO) => {
  let pos;
  const {
    XSHAPE,
    SPOT,
    RANDO,
    BOTTOM,
  } = ORIG;

  switch(pO) {
    case RANDO:
      // Particle origin is in random location
      pos = createVector(random(width), random(height));
      break;
    case XSHAPE:
      // Particle origin is an X-shape
      const x0 = random(width / 2);
      const y0 = x0;
      pos = createVector(width / 2 - x0, height / 2 + y0);
      const chance = random();
      if(chance <= 0.25) {
        pos = createVector(width / 2 + x0, height / 2 - y0);
      } else if(chance > 0.25 && chance <= 0.5) {
        pos = createVector(width / 2 - x0, height / 2 - y0);
      } else if(chance > 0.25 && chance <= 0.75) {
        pos = createVector(width / 2 + x0, height / 2 + y0);
      }
      break;
    case SPOT:
      // Particle origin is a circle in center of frame
      const rMax = 0.25 * pg.width / 2;
      const a = random() * TWO_PI;
      const r = random() * rMax;
      const x1 = width / 2 + r * cos(a);
      const y1 = height / 2 + r * sin(a);
      pos = createVector(x1, y1);
      break;
    case BOTTOM:
      // Particle origin is a horizontal line near bottom of frame
      pos = createVector(random(width), height - 4);
      // let c = random();
      // if(c > 0.5) {
      //   pos = createVector(random(width), height - 4);
      // } else {
      //   pos = createVector(width / 2, random(height));
      // }
      break;
    default:
      // Particle origin is in random location
      pos = createVector(random(width), random(height));
  }

  const weight = 1 + random() * 1;
  let vel = createVector(0, 0);
  let acc = createVector(0, 0);
  const maxspeed = 6;
  let k = 0;

  const prevPos =  pos.copy();

  const update = () => {
    vel.add(acc);
    vel.limit(maxspeed);
    pos.add(vel);
    acc.mult(0);
  };

  const follow = (vectors) => {
    var x = floor(pos.x / scl);
    var y = floor(pos.y / scl);
    var index = x + y * cols;
    var force = vectors[index];
    applyForce(force);
  };

  const applyForce = (force) => {
    acc.add(force);
  };

  const show = () => {
    switch(mode) {
      case MODES.RAINBOW:
        pg.stroke(h, 255, 255, 0.2);
        k = k + 1;
        if (k > 255) {
          k = 0;
        }
        break;
      case MODES.MONO:
        // pg.stroke(0, 0, 0, 0.08);
        pg.stroke(0, 0, k, 0.08);
        // pg.stroke(100, 255, 255, 0.2);
        k += 1;
        if (k > 127) {
          k = 15;
        }
        break;
      case MODES.BLUE:
        pg.stroke(0, 0, 100, 0.08);
        break;
      case MODES.DARK:
        pg.stroke(0, 0, 100, 0.08);
        break;  
      default:
        pg.stroke(0, 0, 0, 25);
    }

    // Lines
    pg.strokeWeight(weight);
    pg.line(pos.x, pos.y, prevPos.x, prevPos.y);
    updatePrev();

    // Dots
    // const d = 4 + round(random() * 4);
    // const diam = random() > 0.99 ? d : 2;
    // pg.fill(0, 0, 100, 0.1);
    // pg.noStroke();
    // pg.ellipse(pos.x, pos.y, diam, diam);
    // updatePrev();
  };

  const updatePrev = () => {
    prevPos.x = pos.x;
    prevPos.y = pos.y;
  };

  const edges = () => {
    if (pos.x > width) {
      pos.x = 0;
      updatePrev();
    }
    if (pos.x < 0) {
      pos.x = width;
      updatePrev();
    }
    if (pos.y > height) {
      pos.y = 0;
      updatePrev();
    }
    if (pos.y < 0) {
      pos.y = height;
      updatePrev();
    }
  };

  return {
    edges,
    show,
    update,
    follow,
  }
}