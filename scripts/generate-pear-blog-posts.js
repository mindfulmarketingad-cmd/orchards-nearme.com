#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { slugify, generateFruitBlog } = require('./fruit-blog-shared');

const FEATURED_IMAGES = [
  { file: 'pear-hand-picking-tree.jpg', alt: 'Hands picking a ripe pear from a tree' },
  { file: 'pear-crate-harvest.jpg', alt: 'A crate full of freshly harvested pears' },
  { file: 'pear-hand-holding-fruit.jpg', alt: 'A hand holding a single ripe pear on the tree' },
];

function loadCapitals() {
  const src = fs.readFileSync(path.join(__dirname, 'generate-city-pages.js'), 'utf8');
  const capitalsM = src.match(/const capitals = (\[[\s\S]*?\n\]);/);
  return eval(capitalsM[1]);
}

const capitals = loadCapitals();
const byState = {};
capitals.forEach(c => { byState[c.state] = c; });

// Only states with genuine commercial or well-established u-pick pear
// production — pears grow best in temperate climates with real winter chill,
// so most of the South, the desert Southwest, and the Great Plains don't
// have a real pear-growing tradition worth a page for.
const PEAR_STATES = [
  'Washington', 'Oregon', 'California',
  'Michigan', 'Ohio', 'Wisconsin', 'Illinois',
  'New York', 'New Jersey', 'Pennsylvania', 'Maryland', 'Virginia',
  'Connecticut', 'Massachusetts', 'New Hampshire', 'Vermont', 'Maine', 'Rhode Island',
  'Colorado', 'Utah', 'Idaho',
];

const REGION_CONTENT = {
  'pacific': {
    peak: 'August through October, with the Pacific Northwest producing the majority of the nation\'s commercial pear crop',
    where: 'the Pacific Northwest is the heart of American pear country, with Washington\'s Yakima and Wenatchee valleys and Oregon\'s Hood River and Rogue valleys producing the bulk of the nation\'s Bartlett, Anjou, and Bosc pears. California\'s Sacramento River Delta contributes its own smaller but well-established pear industry.',
    varieties: 'Bartlett pears early in the season, followed by Anjou, Bosc, and Comice varieties that hold in storage well into winter',
    tip: 'Pears are one of the few fruits that ripen better off the tree than on it — pick them firm and let them finish ripening on the counter for the best texture and flavor.',
  },
  'midwest': {
    peak: 'late August through October, running alongside the region\'s apple harvest',
    where: 'the Midwest\'s fruit belts along the Great Lakes shorelines and river valleys support a genuine pear-growing tradition, with orchards typically growing pears alongside apples rather than as a dedicated crop.',
    varieties: 'Bartlett and Bosc pears, along with cold-hardy varieties like Kieffer that tolerate the region\'s harsher winters',
    tip: 'Since most Midwest orchards grow pears as a secondary crop alongside apples, ask the farm which rows are pears before you start picking — they\'re easy to miss among the more numerous apple trees.',
  },
  'mid-atlantic': {
    peak: 'late August through October, overlapping with the region\'s well-known apple and peach seasons',
    where: 'mid-Atlantic orchards have grown pears alongside apples and peaches for generations, with the same Appalachian foothill and piedmont farms that produce the region\'s famous apple crop also growing a smaller but genuine pear harvest.',
    varieties: 'Bartlett and Bosc pears, along with some heirloom varieties preserved by smaller family orchards',
    tip: 'Mid-Atlantic pear season is brief compared to apples, so ask the orchard directly which weeks their pears are ready rather than assuming it matches the fall apple rush.',
  },
  'new-england': {
    peak: 'September through October, a shorter window than the region\'s famous apple season',
    where: 'New England\'s orchards have grown pears since the colonial era, and many of the same farms famous for fall apple picking maintain smaller pear plantings as a quieter, less-crowded alternative.',
    varieties: 'Bartlett pears as the most common variety, along with Bosc and some heirloom varieties at older family orchards',
    tip: 'New England pear picking tends to be far less crowded than the region\'s apple season, making it a good option if you want the orchard experience without the fall crowds.',
  },
  'mountain': {
    peak: 'late August through October, with high-elevation orchards often running later than lower valleys',
    where: 'the mountain west\'s high-elevation valleys — Colorado\'s Western Slope in particular — grow excellent pears using the same intense sunshine and cool nights that produce the region\'s well-regarded apples and peaches.',
    varieties: 'Bartlett and Anjou pears, grown at elevation alongside the region\'s better-known stone fruit and apple crops',
    tip: 'Mountain orchards often combine pear picking with their more famous peach or apple programs, so ask what else is in season during your visit.',
  },
};

const STATES = PEAR_STATES.map(name => {
  const cap = byState[name];
  const region = REGION_CONTENT[cap.region] || REGION_CONTENT['midwest'];
  return {
    slug: slugify(name),
    name,
    capital: cap.city,
    capitalSlug: slugify(cap.city),
    region: cap.region,
    peak: region.peak,
    noSeason: false,
    noSeasonReason: '',
    varieties: region.varieties,
    intro: `Pear picking season in ${name} runs ${region.peak}.`,
    whereText: `Near ${cap.city}, ${region.where}`,
    tip: region.tip,
  };
});

generateFruitBlog({
  fruitLabel: 'Pear',
  fruitSlug: 'pear',
  findSlug: null,
  hasFindCategory: false,
  chartMonths: ['July', 'August', 'September', 'October', 'November'],
  images: FEATURED_IMAGES,
  states: STATES,
  moreGuides: [
    { href: '/find/apple-picking-orchards-near-me', label: 'Apple Picking Orchards Near Me' },
    { href: '/find/peach-picking-orchards-near-me', label: 'Peach Picking Orchards Near Me' },
    { href: '/find/cherry-picking-orchards-near-me', label: 'Cherry Picking Orchards Near Me' },
    { href: '/find/berry-picking-orchards-near-me', label: 'Berry Picking Orchards Near Me' },
  ],
});

module.exports = { STATES };
