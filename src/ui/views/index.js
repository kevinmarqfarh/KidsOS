import { courseView } from './course.js';
import { aiLabView } from './ai.js';
import { traceView } from './trace.js';
import { robotView, turtleView } from './code.js';
import { floatView, magnetView, shadowView, waterView, seesawView, slideView, mixView } from './science.js';
import { solarView, rocketView, dayNightView, moonView, starsView, orbitView } from './space.js';
import { bodyView, storiesView, wonderView, drawView } from './misc.js';
import { continentsView, swedenView, galleryView } from './world.js';
import { playView } from './play.js';
import { SPACE_PHOTOS } from '../../apps/space.js';

const spaceGalleryView = (el, ctx) => galleryView(el, { ...ctx, items: SPACE_PHOTOS, title: 'Riktiga bilder från rymden' });

export const VIEWS = {
  course: courseView,
  aiLab: aiLabView,
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
  continents: continentsView,
  sweden: swedenView,
  gallery: spaceGalleryView,
  play: playView,
};
