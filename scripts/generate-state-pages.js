#!/usr/bin/env node
'use strict';

/*
 * Generates category + state search-map pages at /find/[category]-[state],
 * e.g. /find/apple-picking-georgia, /find/orchards-georgia,
 * /find/garden-centers-georgia -- one page per category per state (10 x 50
 * = 500 pages), scoped to the whole state rather than a single city.
 *
 * Reuses the region/season content and filter-chip builder already defined
 * in generate-city-pages.js (loaded via require, guarded there behind
 * `require.main === module` so loading it here does not also regenerate
 * the city pages).
 */

const fs = require('fs');
const path = require('path');
const shared = require('./generate-city-pages.js');

const {
  slugify,
  capitals,
  buildFilterChips,
  appleRegion,
  appleSeason,
  cherryRegion,
  cherrySeason,
  berryRegion,
  berrySeason,
  peachRegion,
  peachSeason,
  blueberryRegion,
  blueberrySeason,
  strawberryRegion,
  strawberrySeason,
  orchardRegion,
  orchardSeason,
  pumpkinRegion,
  pumpkinSeason,
  gardenCenterRegion,
  gardenCenterSeason,
  youPickRegion,
  youPickSeason,
} = shared;

const SITE_URL = 'https://orchards-nearme.com';

// One entry per category. `cat` is the data-cat value used by the filter
// chips / js/app.js (fruit slugs like 'apple-picking', or raw categories
// like 'Orchard' / 'Farm' / 'Garden Center'). `urlSlug` is the URL-friendly
// prefix used in the page filename, which differs from `cat` for the three
// raw categories and pumpkin patches.
const CATEGORIES = [
  { cat: 'apple-picking', urlSlug: 'apple-picking', label: 'Apple Picking', verb: 'apple picking', regionKeyField: 'region', region: appleRegion, season: appleSeason, nearMeUrl: '/find/apple-picking-orchards-near-me', nearMeLabel: 'Apple Picking Orchards Near Me' },
  { cat: 'cherry-picking', urlSlug: 'cherry-picking', label: 'Cherry Picking', verb: 'cherry picking', regionKeyField: 'cherryRegion', region: cherryRegion, season: cherrySeason, nearMeUrl: '/find/cherry-picking-orchards-near-me', nearMeLabel: 'Cherry Picking Orchards Near Me' },
  { cat: 'berry-picking', urlSlug: 'berry-picking', label: 'Berry Picking', verb: 'berry picking', regionKeyField: 'region', region: berryRegion, season: berrySeason, nearMeUrl: '/find/berry-picking-orchards-near-me', nearMeLabel: 'Berry Picking Orchards Near Me' },
  { cat: 'peach-picking', urlSlug: 'peach-picking', label: 'Peach Picking', verb: 'peach picking', regionKeyField: 'region', region: peachRegion, season: peachSeason, nearMeUrl: '/find/peach-picking-orchards-near-me', nearMeLabel: 'Peach Picking Orchards Near Me' },
  { cat: 'blueberry-picking', urlSlug: 'blueberry-picking', label: 'Blueberry Picking', verb: 'blueberry picking', regionKeyField: 'region', region: blueberryRegion, season: blueberrySeason, nearMeUrl: '/find/blueberry-picking-orchards-near-me', nearMeLabel: 'Blueberry Picking Orchards Near Me' },
  { cat: 'strawberry-picking', urlSlug: 'strawberry-picking', label: 'Strawberry Picking', verb: 'strawberry picking', regionKeyField: 'region', region: strawberryRegion, season: strawberrySeason, nearMeUrl: '/find/strawberry-picking-orchards-near-me', nearMeLabel: 'Strawberry Picking Orchards Near Me' },
  { cat: 'pumpkin-patch', urlSlug: 'pumpkin-patches', label: 'Pumpkin Patches', verb: 'visiting pumpkin patches', regionKeyField: 'region', region: pumpkinRegion, season: pumpkinSeason, nearMeUrl: '/find/pumpkin-patches-near-me', nearMeLabel: 'Pumpkin Patches Near Me' },
  { cat: 'Orchard', urlSlug: 'orchards', label: 'Orchards', verb: 'visiting orchards', regionKeyField: 'region', region: orchardRegion, season: orchardSeason, nearMeUrl: '/find/orchards-near-me', nearMeLabel: 'Orchards Near Me' },
  { cat: 'Farm', urlSlug: 'farms', label: 'Farms', verb: 'visiting u-pick farms', regionKeyField: 'region', region: youPickRegion, season: youPickSeason, nearMeUrl: '/find/you-pick-farms-near-me', nearMeLabel: 'You Pick Farms Near Me' },
  { cat: 'Garden Center', urlSlug: 'garden-centers', label: 'Garden Centers', verb: 'visiting garden centers', regionKeyField: 'region', region: gardenCenterRegion, season: gardenCenterSeason, nearMeUrl: '/find/garden-centers-near-me', nearMeLabel: 'Garden Centers Near Me' },
];

const INTRO_VARIANTS = [
  (state, label, verb) => `${state} is home to a range of spots for ${verb}, spread across the state's different growing regions. This page rounds up every ${label.toLowerCase()} location listed in ${state} so you can compare distance, ratings, and reviews before deciding where to go.`,
  (state, label, verb) => `Looking for ${verb} in ${state}? Below is every location mapped across the state, filterable by city or ZIP code so you can find the one closest to you.`,
  (state, label, verb) => `${state} offers plenty of options for ${verb}, from well-known destinations to smaller family-run spots. Browse every listing below, or search your ZIP code to find the nearest one.`,
];

const TIPS_VARIANTS = [
  (state, label, verb) => `Call ahead or check a location's website before visiting, since hours and availability for ${verb} can change with the weather and time of year. Weekday visits are usually less crowded than weekends.`,
  (state, label, verb) => `Conditions for ${verb} in ${state} can shift quickly with the weather, so it's worth checking a location's current status before making the drive. Bring cash, since smaller family-run spots aren't always set up to take cards.`,
  (state, label, verb) => `Before heading out for ${verb} anywhere in ${state}, a quick call or website check can save a wasted trip if conditions have changed. Early in the day tends to mean better selection and shorter lines.`,
];

function relatedStateLinksHtml(currentCat, stateSlug, state) {
  const items = CATEGORIES.filter((c) => c.cat !== currentCat)
    .map((c) => `          <li><a href="/find/${c.urlSlug}-${stateSlug}">${c.label} in ${state}</a></li>`)
    .join('\n');
  return `<section class="seo-content related-links">
      <div class="container">
        <h2>More to Explore in ${state}</h2>
        <ul class="related-links-list">
${items}
        </ul>
        <p class="related-links-all"><a href="/find">Browse all pick-your-own categories and states</a></p>
      </div>
    </section>`;
}

function catClassForLegendAria(cat) {
  return cat;
}

function generateStatePage(category, cap, variantIndex) {
  const state = cap.state;
  const stateSlug = slugify(state);
  const urlSlug = `${category.urlSlug}-${stateSlug}`;
  const canonicalUrl = `${SITE_URL}/find/${urlSlug}`;
  const titleTag = `${category.label} in ${state} | All Locations`;
  const h1 = `${category.label} in ${state}`;
  const desc = `Find ${category.label.toLowerCase()} locations across ${state}. Browse every listing on an interactive map, filter by city or ZIP code, and read real visitor reviews before you go.`;
  const resultsHeading = `${category.label} in ${state}`;

  const regionKey = cap[category.regionKeyField];
  const regionData = category.region[regionKey];
  const seasonText = category.season[state];

  const intro = INTRO_VARIANTS[variantIndex % INTRO_VARIANTS.length](state, category.label, category.verb);
  const tips = TIPS_VARIANTS[variantIndex % TIPS_VARIANTS.length](state, category.label, category.verb);

  const mainH2 = `${category.label} in ${state}: What You Need to Know`;
  const seasonH2 = `Best Time for ${category.label} in ${state}`;
  const tipsH2 = `Tips for ${category.label} in ${state}`;

  const filterChips = buildFilterChips(category.cat);
  const relatedLinks = relatedStateLinksHtml(category.cat, stateSlug, state);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-3CMJFS74HE"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-3CMJFS74HE');
  </script>

  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${titleTag}</title>
  <meta name="description" content="${desc}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${titleTag}" />
  <meta property="og:description" content="Find ${category.label.toLowerCase()} locations across ${state} on an interactive map." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonicalUrl}" />

  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32" />
  <link rel="icon" href="/favicon-192.png" type="image/png" sizes="192x192" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="/vendor/leaflet/leaflet.css" />
  <link rel="stylesheet" href="/vendor/leaflet/MarkerCluster.css" />
  <link rel="stylesheet" href="/vendor/leaflet/MarkerCluster.Default.css" />
  <link rel="stylesheet" href="/css/style.css" />
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2173008413459742" crossorigin="anonymous"></script>
</head>
<body>
  <a class="skip-link" href="#find">Skip to map</a>
  <header class="site-header">
    <div class="container">
      <a class="brand" href="/" aria-label="Orchards Near Me home">
        <img src="/logo.png" alt="" class="logo-icon" />
        Orchards Near Me
      </a>
      <nav class="main-nav" aria-label="Primary">
        <a href="/">Home</a>
        <a href="/about.html">About</a>
        <a href="/blog">Blog</a>
        <a href="/listings">Listings</a>
        <a href="/find" class="cta">Find</a>
      </nav>
      <button type="button" class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="mobileNav" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
    </div>
    <nav class="mobile-nav" id="mobileNav" aria-label="Primary mobile">
      <a href="/">Home</a>
      <a href="/about.html">About</a>
      <a href="/blog">Blog</a>
      <a href="/listings">Listings</a>
      <a href="/find" class="cta">Find</a>
    </nav>
  </header>
  <script>
    (function () {
      var toggle = document.getElementById('navToggle');
      var menu = document.getElementById('mobileNav');
      if (!toggle || !menu) return;
      toggle.addEventListener('click', function () {
        var isOpen = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
      menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          menu.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    })();
  </script>

  <main>
    <section class="hero">
      <div class="container">
        <h1>${h1}</h1>
        <p>Discover ${category.label.toLowerCase()} across ${state}. Search by ZIP code to find the closest location, check ratings, and read real visitor reviews before you go.</p>
      </div>
    </section>

    <section class="controls" id="find">
      <div class="container">
        <form class="search-form" id="searchForm">
          <input type="text" id="zipInput" inputmode="numeric" placeholder="Enter your ZIP code (e.g. 05346)" aria-label="Search by ZIP code" />
          <button type="submit" class="btn">Search</button>
        </form>
        <p id="zipError" hidden class="zip-error-msg" role="alert"></p>
        <select class="sort-select" id="sortSelect" aria-label="Sort listings">
          <option value="featured">Sort: Featured</option>
          <option value="az">Name: A-Z</option>
          <option value="za">Name: Z-A</option>
          <option value="reviews">Most Reviews</option>
          <option value="trending">Trending</option>
          <option value="closest">Closest to Me</option>
        </select>
        <div class="filters-wrap">
          <button type="button" class="filters-toggle" id="filtersToggle" aria-haspopup="true" aria-expanded="false" aria-controls="filters">
            <span class="filters-toggle-icon" aria-hidden="true">&#9776;</span> Filters
          </button>
          <div class="filters" id="filters" role="group" aria-label="Filter by type" data-default-filter="${category.cat}" data-default-state="${state}">
            ${filterChips}
          </div>
        </div>
        <select class="state-select" id="stateSelect" aria-label="Filter by state">
          <option value="all">All states</option>
        </select>
      </div>
    </section>

    <div class="container">
      <div class="view-toggle" id="viewToggle">
        <button class="active" data-view="map">Map</button>
        <button data-view="list">List</button>
      </div>
      <div class="find-layout">
        <div class="results-col">
          <div class="results-head">
            <h2>${resultsHeading}</h2>
            <span class="results-count" id="resultsCount">Loading...</span>
          </div>
          <div class="cards" id="cards"></div>
        </div>
        <div class="map-col">
          <div id="map" role="application" aria-label="Map of ${category.label.toLowerCase()} in ${state}"></div>
          <div class="map-legend" aria-label="Map key">
            <span class="map-legend-item"><span class="map-legend-dot orchard"></span>Orchard</span>
            <span class="map-legend-item"><span class="map-legend-dot farm"></span>Farm</span>
            <span class="map-legend-item"><span class="map-legend-dot garden"></span>Garden Center</span>
          </div>
        </div>
      </div>
    </div>

    <section class="seo-content">
      <div class="container">
        <article class="seo-article">

          <h2>${mainH2}</h2>
          <p>${intro}</p>

          <h2>${regionData.h2}</h2>
          <p>${regionData.body}</p>

          <h2>${seasonH2}</h2>
          <p>${seasonText}</p>

          <h2>${tipsH2}</h2>
          <p>${tips}</p>

        </article>
      </div>
    </section>

    ${relatedLinks}
  </main>

  <footer class="site-footer">
    <div class="container">
      <ul class="footer-nav">
        <li><a href="/">Home</a></li>
        <li><a href="/about.html">About</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/contact.html">Contact</a></li>
        <li><a href="/disclaimer.html">Disclaimer</a></li>
        <li><a href="/privacy.html">Privacy</a></li>
        <li><a href="/terms.html">Terms</a></li>
        <li><a href="/sitemap.html">Sitemap</a></li>
      </ul>
      <div class="footer-bottom">
        <p>Orchards Near Me &mdash; your friendly guide to orchards, farms, and garden centers across the USA. &copy; <span id="year"></span> orchards-nearme.com</p>
      </div>
    </div>
  </footer>

  <script src="/vendor/leaflet/leaflet.js"></script>
  <script src="/vendor/leaflet/leaflet.markercluster.js"></script>
  <script src="/js/app.js"></script>
</body>
</html>
`;
}

function main() {
  const findDir = path.join(__dirname, '..', 'find');
  if (!fs.existsSync(findDir)) fs.mkdirSync(findDir, { recursive: true });

  let generated = 0;
  const allUrls = [];

  CATEGORIES.forEach((category) => {
    capitals.forEach((cap, i) => {
      const stateSlug = slugify(cap.state);
      const filename = `${category.urlSlug}-${stateSlug}.html`;
      const filePath = path.join(findDir, filename);
      fs.writeFileSync(filePath, generateStatePage(category, cap, i), 'utf8');
      allUrls.push(`${SITE_URL}/find/${category.urlSlug}-${stateSlug}`);
      generated++;
    });
    console.log(`Generated ${capitals.length} pages for category: ${category.label}`);
  });

  console.log(`\nDone. Generated ${generated} category+state pages.`);

  fs.writeFileSync(
    path.join(__dirname, '..', 'data', 'category-state-urls.json'),
    JSON.stringify(allUrls, null, 2),
    'utf8'
  );
}

if (require.main === module) {
  main();
}

module.exports = { CATEGORIES, generateStatePage };
