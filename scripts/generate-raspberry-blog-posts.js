#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { slugify, generateFruitBlog } = require('./fruit-blog-shared');

const FEATURED_IMAGES = [
  { file: 'raspberry-hand-on-cane.jpg', alt: 'A hand holding ripe raspberries on the cane' },
  { file: 'raspberry-bush-closeup.jpg', alt: 'Close-up of ripe and unripe raspberries on a bush' },
  { file: 'raspberry-market-crates.jpg', alt: 'Crates of freshly picked raspberries at a farm market' },
];

function loadCapitals() {
  const src = fs.readFileSync(path.join(__dirname, 'generate-city-pages.js'), 'utf8');
  const capitalsM = src.match(/const capitals = (\[[\s\S]*?\n\]);/);
  return eval(capitalsM[1]);
}

const capitals = loadCapitals();

const NO_SEASON_STATES = new Set(['Florida', 'Hawaii', 'Arizona', 'Nevada', 'Louisiana', 'Mississippi', 'Texas']);

const NO_SEASON_REASONS = {
  Florida: "the hot, humid climate doesn't provide the winter chill raspberry canes need and encourages fungal disease.",
  Hawaii: "the tropical climate doesn't provide the winter chill raspberry canes need to fruit reliably.",
  Arizona: "the desert heat and low humidity are poorly suited to raspberry canes, which prefer cooler, more humid summers.",
  Nevada: "the arid climate and intense summer heat make raspberry canes difficult to grow reliably outside of small irrigated gardens.",
  Louisiana: "the hot, humid subtropical climate encourages fungal disease and doesn't suit raspberry canes well.",
  Mississippi: "the hot, humid climate encourages fungal disease and falls outside the range raspberry canes prefer.",
  Texas: "most of the state's summer heat is too intense for raspberry canes, which struggle outside a few cooler high-elevation pockets.",
};

const REGION_CONTENT = {
  'pacific': {
    peak: 'July through September, with earlier harvests in warmer coastal valleys and later ones farther north and at higher elevations',
    where: 'the Pacific Northwest, particularly Washington\'s Whatcom County, produces the majority of the nation\'s commercial raspberry crop, thanks to the region\'s mild, humid summers and rich river-valley soil. Oregon\'s Willamette Valley and pockets of California\'s coastal valleys round out the West Coast\'s raspberry country.',
    varieties: 'everbearing varieties like Heritage and Caroline alongside summer-bearing types such as Willamette and Meeker, the backbone of Pacific Northwest raspberry production',
    tip: 'Visit in the cool of the morning, since raspberries soften quickly in the heat of the day and are easiest to pick — and taste best — before the sun is high.',
  },
  'mountain': {
    peak: 'July through September, with high-elevation farms often running later into fall than lower valleys',
    where: 'the mountain west\'s cooler, high-elevation valleys suit raspberry canes well, with the intense sunshine and cool nights concentrating flavor. Small u-pick farms are scattered through irrigated valleys in Colorado, Idaho, and Utah in particular.',
    varieties: 'cold-hardy varieties such as Boyne and Killarney, along with everbearing Heritage and Caroline types suited to short high-elevation growing seasons',
    tip: 'Mountain-grown raspberries ripen unevenly through the season, so calling ahead to check which rows are currently producing saves a wasted trip.',
  },
  'midwest': {
    peak: 'July through September, with a first flush in midsummer and a second everbearing crop into early fall',
    where: 'the Midwest\'s river valleys and glacially-formed soils support a strong tradition of small, family-run raspberry farms, with Michigan and the Great Lakes states particularly well suited to the crop.',
    varieties: 'summer-bearing varieties like Latham and Nova alongside everbearing Heritage and Caroline types',
    tip: 'Many Midwest raspberry farms combine picking with other summer produce, so ask what else is ready — sweet corn and tomatoes often overlap with peak raspberry season.',
  },
  'new-england': {
    peak: 'July through September, with summer-bearing varieties peaking in midsummer and everbearing types continuing into fall',
    where: 'New England\'s acidic, well-drained soils and cool summers are genuinely well suited to raspberry canes, and small family farms throughout the region have grown them for generations alongside the area\'s better-known apple orchards.',
    varieties: 'a mix of summer-bearing varieties such as Nova and Killarney and everbearing types like Heritage and Caroline',
    tip: 'Raspberries bruise easily, so bring shallow containers rather than deep buckets to avoid crushing the berries at the bottom.',
  },
  'mid-atlantic': {
    peak: 'June through September, with an early summer flush followed by a longer everbearing season into fall',
    where: 'the mid-Atlantic\'s productive farmland supports raspberry canes well, with small u-pick operations scattered through the same river valleys and piedmont counties that grow the region\'s peaches and berries.',
    varieties: 'summer-bearing and everbearing varieties such as Nova, Heritage, and Caroline',
    tip: 'The everbearing fall crop is often less crowded than the midsummer harvest, so a September visit can mean more berries and fewer other pickers.',
  },
  'southeast': {
    peak: 'late May through July at lower elevations, and again in fall at higher elevations where primocane varieties get a second flush',
    where: 'reliable raspberry growing in the Southeast is mostly limited to higher-elevation areas — the mountains of western North Carolina, north Georgia, and east Tennessee — where cooler summers and better air circulation keep the fungal diseases that trouble lowland plantings in check.',
    varieties: 'primocane (everbearing) varieties bred for heat tolerance, such as Caroline and Autumn Bliss, grown mostly at higher elevations',
    tip: 'Go early in the day during Southern raspberry season, since lowland heat and humidity can make afternoon picking uncomfortable and softens the berries fast.',
  },
  'south-central': {
    peak: 'a brief window in late spring before summer heat arrives, where any commercial production exists at all',
    where: 'raspberry growing in this region is limited to a small number of specialty farms using heat-tolerant primocane varieties and high tunnels to extend an otherwise short season.',
    varieties: 'a small number of heat-tolerant primocane varieties, where reliable production is otherwise difficult',
    tip: 'Call ahead before visiting, since raspberry plantings in this region are small-scale and picking windows can be brief and weather-dependent.',
  },
  'southwest': {
    peak: 'no meaningful season outside of small home gardens',
    where: 'the desert climate rules out reliable commercial raspberry production, though a handful of gardeners grow canes in shaded, irrigated microclimates.',
    varieties: 'none commercially, since the desert climate rules out reliable production',
    tip: 'Not applicable given the lack of commercial production in the region.',
  },
};

const STATES = capitals.map(cap => {
  const name = cap.state;
  const noSeason = NO_SEASON_STATES.has(name);
  const region = REGION_CONTENT[cap.region] || REGION_CONTENT['midwest'];
  const noSeasonReason = noSeason ? NO_SEASON_REASONS[name] : '';
  const peak = noSeason ? `No meaningful commercial season — ${noSeasonReason}` : region.peak;
  const intro = noSeason
    ? `Raspberry picking isn't commercially available in ${name} — ${noSeasonReason}`
    : `Raspberry picking season in ${name} runs ${region.peak}.`;
  return {
    slug: slugify(name),
    name,
    capital: cap.city,
    capitalSlug: slugify(cap.city),
    region: cap.region,
    peak,
    noSeason,
    noSeasonReason,
    varieties: region.varieties,
    intro,
    whereText: `Near ${cap.city}, ${region.where}`,
    tip: region.tip,
  };
});

generateFruitBlog({
  fruitLabel: 'Raspberry',
  fruitSlug: 'raspberry',
  findSlug: 'berry-picking',
  chartMonths: ['May', 'June', 'July', 'August', 'September'],
  images: FEATURED_IMAGES,
  states: STATES,
  moreGuides: [
    { href: '/find/berry-picking-orchards-near-me', label: 'Berry Picking Orchards Near Me' },
    { href: '/find/blueberry-picking-orchards-near-me', label: 'Blueberry Picking Orchards Near Me' },
    { href: '/find/apple-picking-orchards-near-me', label: 'Apple Picking Orchards Near Me' },
    { href: '/find/cherry-picking-orchards-near-me', label: 'Cherry Picking Orchards Near Me' },
  ],
});

module.exports = { STATES };
