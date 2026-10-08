import { traceView } from './trace.js';
import { robotView, turtleView } from './code.js';
import { floatView, magnetView, shadowView, waterView, seesawView, slideView, mixView } from './science.js';
import { solarView, rocketView, dayNightView, moonView, starsView, orbitView } from './space.js';
import { bodyView, storiesView, wonderView, drawView } from './misc.js';

export const VIEWS = {
  trace: traceView,
  robot: robotView,
  turtle: turtleView,
  float: floatView,
  magnet: magnetView,
  shadow: shadowView,
  water: waterView,
  seesaw: seesawView,
  slide: slideView,
  mix: mixView,
  solar: solarView,
  rocket: rocketView,
  daynight: dayNightView,
  moon: moonView,
  stars: starsView,
  orbit: orbitView,
  body: bodyView,
  stories: storiesView,
  wonder: wonderView,
  draw: drawView,
};
