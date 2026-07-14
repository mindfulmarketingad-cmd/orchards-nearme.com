#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { slugify, generateFruitBlog } = require('./fruit-blog-shared');

const FEATURED_IMAGES = [
  { file: 'strawberry-picking-mother-child-field.jpg', alt: 'A mother and young son walking through rows of strawberry plants with a picking basket' },
  { file: 'strawberry-picking-kids-baskets.jpg', alt: 'Two kids holding freshly picked strawberries up to their eyes with baskets full of berries' },
  { file: 'strawberry-field-rows-texas.jpg', alt: 'Rows of ripening strawberry plants in a sunny field' },
];

function loadCapitals() {
  const src = fs.readFileSync(path.join(__dirname, 'generate-city-pages.js'), 'utf8');
  const capitalsM = src.match(/const capitals = (\[[\s\S]*?\n\]);/);
  return eval(capitalsM[1]);
}

const capitals = loadCapitals();

const REGION_CONTENT = {
  'new-england': {
    peak: 'early June through early July, a short and intense window before the season wraps up',
    where: 'New England\'s small, family-run strawberry farms cluster in river valleys and coastal plains throughout Connecticut, Maine, Massachusetts, New Hampshire, Rhode Island, and Vermont, and many have grown the crop for generations alongside other summer produce.',
    varieties: 'early- and mid-season June-bearing varieties such as Earliglow and Jewel, prized locally for their flavor over shelf life',
    tip: 'Call ahead or check a farm\'s social media before visiting — New England\'s strawberry season is short and popular farms can pick out fast on a nice weekend.',
  },
  'mid-atlantic': {
    peak: 'mid-May through June, in the region\'s sandy coastal-plain soils',
    where: 'New Jersey\'s long commercial strawberry tradition anchors mid-Atlantic production, complemented by farms throughout Pennsylvania, Delaware, Maryland, Virginia, and West Virginia that take advantage of the region\'s moderate spring climate.',
    varieties: 'June-bearing varieties like Earliglow and Allstar alongside some day-neutral types that extend picking into summer',
    tip: 'Weekday mornings tend to be quieter than weekend afternoons at popular mid-Atlantic patches, and the reddest berries are often hidden low, beneath the leaves.',
  },
  southeast: {
    peak: 'March through May, one of the earliest seasons in the country',
    where: 'Florida\'s central growing region produces winter and early-spring strawberries unmatched anywhere else in the country, while farms throughout Georgia, Alabama, Mississippi, Tennessee, North Carolina, South Carolina, Arkansas, and Kentucky follow a few weeks behind as the season moves north.',
    varieties: 'early-producing varieties such as Camarosa and Chandler, chosen for their tolerance of the region\'s mild winters',
    tip: 'Since Southern strawberry season starts earlier than almost anywhere else, check with individual farms in late winter to confirm their opening date, and visit in the morning to beat both crowds and heat.',
  },
  midwest: {
    peak: 'a compact June window, squeezed between the last spring frost and the region\'s hot midsummer stretch',
    where: 'small, family-run u-pick farms are scattered throughout Illinois, Indiana, Iowa, Kansas, Michigan, Minnesota, Missouri, Nebraska, Ohio, North Dakota, South Dakota, and Wisconsin, many combining strawberries with other early-summer produce.',
    varieties: 'June-bearing varieties such as Honeoye and Jewel bred for reliable production in a short, intense season',
    tip: 'Midwest strawberry season moves fast, so don\'t wait too long to plan a visit once picking opens, and bring a wide, shallow container rather than a deep bucket.',
  },
  mountain: {
    peak: 'late June into July, later than most of the country thanks to high elevation and cool nights',
    where: 'strawberry growing in the Mountain West is concentrated in irrigated valleys across Colorado, Idaho, Montana, Nevada, New Mexico, Utah, and Wyoming, where intense daytime sun and cold nights actually concentrate sugars in the fruit.',
    varieties: 'cold-hardy June-bearing varieties suited to short, high-altitude growing seasons',
    tip: 'Mountain patches often open later than you\'d expect given the altitude, so call ahead to confirm timing rather than assuming an early-June start.',
  },
  'south-central': {
    peak: 'March through May in Texas and Louisiana, with Oklahoma running a few weeks behind',
    where: 'Louisiana\'s southeastern parishes have a long-standing strawberry tradition with festivals built around the spring harvest, while farms throughout Texas and Oklahoma take advantage of an early season before summer heat arrives.',
    varieties: 'early-season varieties like Camarosa and Chandler, chosen for heat tolerance and early production',
    tip: 'Louisiana and Texas patches move through their season quickly given the early heat, so plan a visit as soon as you hear picking has started.',
  },
  pacific: {
    peak: 'an extended season from spring well into fall in California, and a shorter June-into-July window in Oregon and Washington',
    where: 'California grows more strawberries than any other state in the country by a wide margin, thanks to its mild coastal climate, while Oregon\'s Willamette Valley and Washington\'s river valleys support a shorter, more traditional early-summer season, and Alaska\'s limited patches take advantage of long summer daylight hours.',
    varieties: 'day-neutral varieties like Albion and Seascape that fruit over an extended season in California, and June-bearing types farther north',
    tip: 'California\'s long season means less urgency about timing than elsewhere, but coastal farms can still get busy on weekends — a quick call ahead in Oregon or Washington helps confirm a rainy spring hasn\'t shifted the opening date.',
  },
  southwest: {
    peak: 'winter into early spring in Arizona, before summer heat arrives; nearly year-round in Hawaii\'s tropical climate',
    where: 'Arizona\'s desert strawberry patches favor the cooler months, a very different rhythm from most of the country, while Hawaii\'s tropical climate supports smaller-scale growing nearly year-round.',
    varieties: 'varieties selected for tolerance of desert heat in Arizona, and everbearing tropical-adapted types in Hawaii',
    tip: 'Dress warmer than you might expect for a desert visit during Arizona\'s cooler-season picking, and call ahead in Hawaii since patches are less common than on the mainland.',
  },
};

const STATES = capitals.map(cap => {
  const name = cap.state;
  const region = REGION_CONTENT[cap.region] || REGION_CONTENT['midwest'];
  return {
    slug: slugify(name),
    name,
    capital: cap.city,
    capitalSlug: slugify(cap.city),
    region: cap.region,
    peak: region.peak,
    noSeason: false,
    varieties: region.varieties,
    intro: `Strawberry picking season in ${name} runs ${region.peak}.`,
    whereText: `Near ${cap.city}, ${region.where}`,
    tip: region.tip,
  };
});

generateFruitBlog({
  fruitLabel: 'Strawberry',
  fruitSlug: 'strawberry',
  findSlug: 'strawberry-patch',
  findUrlPrefix: 'strawberry-patch-near-',
  findNearMeUrl: '/find/strawberry-patch-near-me',
  chartMonths: ['February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
  images: FEATURED_IMAGES,
  states: STATES,
  moreGuides: [
    { href: '/find/strawberry-patch-near-me', label: 'Strawberry Patches Near Me' },
    { href: '/find/berry-picking-orchards-near-me', label: 'Berry Picking Orchards Near Me' },
    { href: '/find/blueberry-picking-orchards-near-me', label: 'Blueberry Picking Orchards Near Me' },
    { href: '/find/apple-picking-orchards-near-me', label: 'Apple Picking Orchards Near Me' },
  ],
});

module.exports = { STATES };
