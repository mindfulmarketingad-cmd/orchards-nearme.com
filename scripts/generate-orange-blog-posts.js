#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { slugify, generateFruitBlog } = require('./fruit-blog-shared');

const FEATURED_IMAGES = [
  { file: 'orange-tree-closeup.jpg', alt: 'Ripe oranges hanging on a tree in an orchard' },
  { file: 'orange-picking-woman-basket.jpg', alt: 'A woman picking oranges into a basket at a citrus grove' },
  { file: 'orange-hand-holding-fruit.jpg', alt: 'A hand holding a freshly picked orange still on the tree' },
];

function loadCapitals() {
  const src = fs.readFileSync(path.join(__dirname, 'generate-city-pages.js'), 'utf8');
  const capitalsM = src.match(/const capitals = (\[[\s\S]*?\n\]);/);
  return eval(capitalsM[1]);
}

const capitals = loadCapitals();
const byState = {};
capitals.forEach(c => { byState[c.state] = c; });

// Only states with genuine commercial or well-established u-pick orange
// production — avoids ~40+ thin "not available here" pages for a crop
// that's this geographically concentrated.
const ORANGE_STATES = {
  Florida: {
    peak: 'October through June, with the earliest varieties ready in fall and Valencia oranges holding on the tree into early summer',
    where: 'Florida is the heart of American orange country, and the citrus groves of Central Florida — around Indian River, Polk, and Highlands counties — are still home to working u-pick operations despite decades of disease and development pressure on the state\'s citrus industry.',
    varieties: 'Navel and Hamlin oranges early in the season, followed by Valencia oranges — the classic juice orange — which hold on the tree the longest',
    tip: 'Ask the grove about citrus greening precautions before you visit, since many Florida growers have had to adapt their operations; call ahead to confirm picking is currently open.',
  },
  California: {
    peak: 'November through April, with Central Valley and Southern California groves overlapping for a long statewide season',
    where: 'California\'s orange country runs from the Central Valley through Southern California\'s inland valleys, where the state\'s dry climate and irrigation produce exceptionally sweet, thin-skinned fruit.',
    varieties: 'Navel oranges as the dominant fresh-eating variety, along with Valencia oranges grown for juicing later in the season',
    tip: 'Visit on a clear winter morning — California navel oranges are at their sweetest right after a cold snap, which concentrates the sugars in the fruit.',
  },
  Arizona: {
    peak: 'November through April, with the desert\'s intense sun and irrigation producing a long, reliable harvest window',
    where: 'the irrigated citrus groves around Phoenix, Mesa, and Yuma take advantage of Arizona\'s desert sun and controlled irrigation to grow excellent oranges despite the state\'s otherwise dry climate.',
    varieties: 'Navel oranges as the primary fresh-eating variety, with some Valencia plantings for a later harvest',
    tip: 'Go in the cooler months of the season — even in winter, Arizona\'s desert sun can make midday picking uncomfortable, so an early morning visit is best.',
  },
  Texas: {
    peak: 'October through March, with the Rio Grande Valley\'s subtropical climate producing one of the earliest harvests in the country',
    where: 'the Rio Grande Valley in the southernmost tip of Texas is the state\'s citrus belt, with groves around McAllen and Mission producing oranges and grapefruit in a climate that rarely sees a hard freeze.',
    varieties: 'Navel and Valencia oranges, often grown alongside the region\'s famous Ruby Red grapefruit',
    tip: 'The Rio Grande Valley citrus season can be affected by occasional winter cold snaps, so calling ahead to confirm availability is worthwhile before making the drive south.',
  },
  Louisiana: {
    peak: 'October through January, a shorter and earlier window than the major citrus states',
    where: 'Louisiana\'s citrus is concentrated in Plaquemines Parish south of New Orleans, where the Mississippi River\'s moderating effect on temperature has supported a small but genuine satsuma and orange growing tradition for generations.',
    varieties: 'cold-hardy satsuma mandarins and a smaller planting of sweet oranges suited to the state\'s occasional winter freezes',
    tip: 'Plaquemines Parish citrus farms are a proud local tradition, and many combine picking with roadside stands selling the parish\'s famous citrus products — worth budgeting extra time for.',
  },
  Alabama: {
    peak: 'October through December, a brief window shaped by the state\'s occasional winter freezes',
    where: 'Alabama\'s small citrus industry is concentrated along the Gulf Coast in Baldwin County, where the water\'s moderating effect on temperature allows cold-hardy satsuma oranges to be grown commercially this far north.',
    varieties: 'cold-hardy satsuma mandarins, the backbone of the small Gulf Coast citrus industry, along with a limited number of sweet orange plantings',
    tip: 'Gulf Coast satsuma season is short and weather-dependent, so calling ahead before the drive to Baldwin County is essential.',
  },
  Georgia: {
    peak: 'October through December, an emerging season as the state\'s citrus industry has grown in recent years',
    where: 'South Georgia\'s citrus industry is relatively new but genuine, with growers near the Florida border planting cold-hardy satsuma varieties as a response to both market demand and a warming climate that has made citrus more viable this far north.',
    varieties: 'cold-hardy satsuma mandarins almost exclusively, since traditional sweet oranges remain too freeze-sensitive for reliable production this far north',
    tip: 'Georgia\'s citrus industry is still young, so u-pick availability can vary year to year — check with individual farms before planning a trip.',
  },
};

const STATES = Object.keys(ORANGE_STATES).map(name => {
  const cap = byState[name];
  const data = ORANGE_STATES[name];
  return {
    slug: slugify(name),
    name,
    capital: cap.city,
    capitalSlug: slugify(cap.city),
    region: cap.region,
    peak: data.peak,
    noSeason: false,
    noSeasonReason: '',
    varieties: data.varieties,
    intro: `Orange picking season in ${name} runs ${data.peak}.`,
    whereText: `Near ${cap.city}, ${data.where}`,
    tip: data.tip,
  };
});

generateFruitBlog({
  fruitLabel: 'Orange',
  fruitSlug: 'orange',
  findSlug: null,
  hasFindCategory: false,
  chartMonths: ['October', 'November', 'December', 'January', 'February', 'March', 'April'],
  images: FEATURED_IMAGES,
  states: STATES,
  moreGuides: [
    { href: '/find/peach-picking-orchards-near-me', label: 'Peach Picking Orchards Near Me' },
    { href: '/find/apple-picking-orchards-near-me', label: 'Apple Picking Orchards Near Me' },
    { href: '/find/berry-picking-orchards-near-me', label: 'Berry Picking Orchards Near Me' },
    { href: '/find/blueberry-picking-orchards-near-me', label: 'Blueberry Picking Orchards Near Me' },
  ],
});

module.exports = { STATES };
