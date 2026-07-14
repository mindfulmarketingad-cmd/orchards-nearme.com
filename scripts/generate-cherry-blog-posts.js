#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { slugify, lowerFirst, generateFruitBlog } = require('./fruit-blog-shared');

const FEATURED_IMAGES = [
  { file: 'cherry-girl-holding-pair.jpg', alt: 'A girl holding a pair of freshly picked cherries in an orchard' },
  { file: 'cherry-hands-cupped-harvest.jpg', alt: 'Hands cupped full of freshly picked red cherries' },
  { file: 'cherry-workers-sorting-crate.jpg', alt: 'Farm workers sorting freshly picked cherries into a crate' },
  { file: 'cherry-bucket-orchard-row.jpg', alt: 'A bucket full of cherries held up in an orchard row' },
];

const NO_SEASON_STATES = new Set(['Florida', 'Hawaii', 'Louisiana', 'Mississippi', 'Wyoming']);

const NO_SEASON_REASONS = {
  Florida: "the state's hot, humid climate doesn't provide the winter chill sweet cherry trees need to fruit reliably.",
  Hawaii: "the tropical climate doesn't provide the winter chill sweet cherry trees need.",
  Louisiana: "the subtropical climate is too warm and humid for reliable sweet cherry production.",
  Mississippi: "the warm, humid climate falls outside the range sweet cherry trees need to fruit reliably.",
  Wyoming: "the state's harsh winters, high elevation, and limited orchard infrastructure make commercial cherry growing impractical.",
};

const VARIETIES_BY_REGION = {
  'new-england': 'sweet and sour cherry varieties such as Bing, Rainier, and Montmorency, grown on a smaller scale than the major cherry states',
  'mid-atlantic': 'sweet cherries like Bing and Rainier alongside sour pie cherries such as Montmorency',
  'southeast': 'a limited selection of tart cherry varieties suited to the region\'s mild winters, where reliable sweet cherry production is uncommon',
  'midwest': 'tart cherry varieties such as Montmorency, especially in the Great Lakes region, alongside a smaller sweet cherry crop',
  'mountain': 'sweet cherries such as Bing, Rainier, and Lapins, grown in high-elevation valleys with the intense sun and cool nights the fruit prefers',
  'south-central': 'a limited selection of low-chill cherry varieties suited to the region\'s warm winters',
  'pacific': 'sweet cherries such as Bing, Rainier, Chelan, and Lapins, grown at commercial scale in some of the best cherry country in the world',
  'southwest': 'a small number of high-elevation sweet cherry orchards, where reliable production is otherwise difficult',
};

function loadCityGenData() {
  const src = fs.readFileSync(path.join(__dirname, 'generate-city-pages.js'), 'utf8');
  function extractObj(name) {
    const re = new RegExp('const ' + name + ' = (\\{[\\s\\S]*?\\n\\});');
    const m = src.match(re);
    if (!m) throw new Error('not found: ' + name);
    return eval('(' + m[1] + ')');
  }
  const capitalsM = src.match(/const capitals = (\[[\s\S]*?\n\]);/);
  const capitals = eval(capitalsM[1]);
  return {
    capitals,
    cherryIntros: extractObj('cherryIntros'),
    cherryTips: extractObj('cherryTips'),
    cherrySeason: extractObj('cherrySeason'),
  };
}

const { capitals, cherryIntros, cherryTips, cherrySeason } = loadCityGenData();

const STATES = capitals.map(cap => {
  const name = cap.state;
  const seasonText = cherrySeason[name];
  const noSeason = NO_SEASON_STATES.has(name);
  const varieties = VARIETIES_BY_REGION[cap.region] || 'sweet and sour cherry varieties suited to the local climate';
  const noSeasonReason = noSeason ? NO_SEASON_REASONS[name] : '';
  const intro = noSeason ? seasonText : `Cherry picking season in ${name} is ${lowerFirst(seasonText)}`;
  return {
    slug: slugify(name),
    name,
    capital: cap.city,
    capitalSlug: slugify(cap.city),
    region: cap.region,
    peak: seasonText,
    noSeason,
    noSeasonReason,
    varieties,
    intro,
    whereText: cherryIntros[cap.city],
    tip: cherryTips[cap.city],
  };
});

generateFruitBlog({
  fruitLabel: 'Cherry',
  fruitSlug: 'cherry',
  findSlug: 'cherry-picking',
  chartMonths: ['April', 'May', 'June', 'July', 'August'],
  images: FEATURED_IMAGES,
  states: STATES,
  moreGuides: [
    { href: '/find/cherry-picking-orchards-near-me', label: 'Cherry Picking Orchards Near Me' },
    { href: '/find/apple-picking-orchards-near-me', label: 'Apple Picking Orchards Near Me' },
    { href: '/find/berry-picking-orchards-near-me', label: 'Berry Picking Orchards Near Me' },
    { href: '/find/peach-picking-orchards-near-me', label: 'Peach Picking Orchards Near Me' },
  ],
});

module.exports = { STATES };
