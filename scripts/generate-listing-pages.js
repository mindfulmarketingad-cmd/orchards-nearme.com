#!/usr/bin/env node
'use strict';

// Generates a standalone profile page at /find/<slug> for every listing in
// data/listings.json (requires scripts/add-listing-slugs.js to have been run
// first so each listing has a unique `slug`). Unlike the city/category
// browsing pages, these are static (no app.js dependency) - the business
// data is baked directly into the HTML at build time.

const fs = require('fs');
const path = require('path');

const listingsPath = path.join(__dirname, '..', 'data', 'listings.json');
const outDir = path.join(__dirname, '..', 'find');

const CATEGORY_CONFIG = {
  Orchard: { color: '#e23b3b', slugPrefix: 'all-orchards-in-', label: 'Orchards' },
  Farm: { color: '#2e8b3d', slugPrefix: 'all-farms-in-', label: 'Farms' },
  'Garden Center': { color: '#6b4f2a', slugPrefix: 'all-garden-centers-in-', label: 'Garden Centers' },
};

// Mirrors KEYWORD_DEFS in js/app.js so the "fit chips" on a listing page match
// exactly what the map cards/popups show for the same business.
const KEYWORD_DEFS = [
  { slug: 'apple-picking', label: 'Apple Picking', icon: '🍎', noun: 'apple picking',
    test: (item, text) => item.category === 'Orchard' || (text.includes('apple') && (text.includes('pick') || text.includes('orchard') || text.includes('u-pick') || text.includes('u pick'))) },
  { slug: 'cherry-picking', label: 'Cherry Picking', icon: '🍒', noun: 'cherry picking',
    test: (item, text) => text.includes('cherry') },
  { slug: 'berry-picking', label: 'Berry Picking', icon: '🍓', noun: 'berry picking',
    test: (item, text) => text.includes('berry') || text.includes('berries') || text.includes('strawberr') || text.includes('blueberr') || text.includes('raspberr') || text.includes('blackberr') },
  { slug: 'peach-picking', label: 'Peach Picking', icon: '🍑', noun: 'peach picking',
    test: (item, text) => text.includes('peach') },
  { slug: 'pear-picking', label: 'Pear Picking', icon: '🍐', noun: 'pear picking',
    test: (item, text) => /\bpears?\b/.test(text) },
  { slug: 'blueberry-picking', label: 'Blueberry Picking', icon: '🫐', noun: 'blueberry picking',
    test: (item, text) => text.includes('blueberr') },
  { slug: 'strawberry-patch', label: 'Strawberry Patch', icon: '🍓', noun: 'strawberry picking',
    test: (item, text) => text.includes('strawberr') },
  { slug: 'pumpkin-patch', label: 'Pumpkin Patch', icon: '🎃', noun: 'pumpkin picking',
    test: (item, text) => text.includes('pumpkin') },
  { slug: 'u-pick-farms', label: 'U-Pick Farms', icon: '🧺', noun: null,
    test: (item) => item.category === 'Farm' || item.category === 'Orchard' },
  { slug: 'hayrides', label: 'Hayrides', icon: '🚜', noun: 'hayrides',
    test: (item, text) => text.includes('hayride') || text.includes('hay ride') },
];

function getFitChips(item) {
  const text = (item.name + ' ' + (item.review || '')).toLowerCase();
  return KEYWORD_DEFS.filter((def) => def.test(item, text));
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stars(rating) {
  if (!rating) return '';
  const full = Math.round(rating);
  let s = '';
  for (let i = 0; i < 5; i++) s += i < full ? '★' : '☆';
  return s;
}

function toTitleCase(name) {
  // Several source names are all-lowercase (raw Places API casing); title-case
  // words that look lowercase-only so headings read naturally.
  if (/[A-Z]/.test(name)) return name;
  return name.replace(/\b\w/g, (c) => c.toUpperCase());
}

function joinNaturally(arr) {
  if (arr.length === 0) return '';
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return arr[0] + ' and ' + arr[1];
  return arr.slice(0, -1).join(', ') + ', and ' + arr[arr.length - 1];
}

function buildAbout(item, displayName, chips) {
  const cat = item.category.toLowerCase();
  const loc = `${item.city}, ${item.state}`;
  const sentences = [];

  if (item.category === 'Garden Center') {
    sentences.push(`${displayName} is a garden center in ${loc}, offering plants, seedlings, soil, tools, and local growing advice for home gardeners.`);
  } else if (item.category === 'Orchard') {
    sentences.push(`${displayName} is an orchard in ${loc}. Orchards like this one typically welcome visitors for seasonal pick-your-own fruit and farm-fresh produce.`);
  } else {
    sentences.push(`${displayName} is a farm in ${loc}. Working farms like this often open seasonally for pick-your-own visits and fresh local produce.`);
  }

  const nouns = chips.map((c) => c.noun).filter(Boolean);
  if (nouns.length) {
    sentences.push(`Visitors come here for ${joinNaturally(nouns)}.`);
  }

  if (item.rating) {
    sentences.push(`It holds a ${item.rating}-star rating from ${item.reviewCount.toLocaleString()} Google reviews.`);
  }

  sentences.push('Because seasons and hours vary from farm to farm, it\'s always worth calling ahead or checking the website before you go.');

  return sentences.map((s) => escapeHtml(s)).join(' ');
}

function fitChipsHtml(chips) {
  if (!chips.length) return '';
  const inner = chips
    .map((c) => `<span class="fit-chip fit-chip--${c.slug.replace('-picking', '')}">${c.icon} ${escapeHtml(c.label)}</span>`)
    .join('');
  return `<div class="fit-chips">${inner}</div>`;
}

function generateListingPage(item) {
  const displayName = toTitleCase(item.name);
  const config = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.Farm;
  const cityState = [item.city, item.stateCode].filter(Boolean).join(', ');
  const stateSlug = slugify(item.state);
  const canonicalUrl = `https://orchards-nearme.com/find/${item.slug}`;
  const categoryPageUrl = `/find/${config.slugPrefix}${stateSlug}`;
  const chips = getFitChips(item);

  const titleTag = `${displayName} - ${item.category} in ${cityState} | Orchards Near Me`;
  const ratingSummary = item.rating
    ? `rated ${item.rating} out of 5 from ${item.reviewCount.toLocaleString()} reviews`
    : 'a pick-your-own destination';
  const desc = `${displayName} is a ${item.category.toLowerCase()} in ${cityState}, ${ratingSummary}. Get directions, hours info, reviews, and contact details.`;
  const ogDesc = `${item.category} in ${cityState}${item.rating ? ' · ' + item.rating + ' stars' : ''}. View address, directions, and reviews.`;

  const aboutText = buildAbout(item, displayName, chips);

  const ratingRow = item.rating
    ? `<div class="listing-rating-row"><span class="stars">${stars(item.rating)}</span> <strong>${item.rating}</strong> <span class="muted">(${item.reviewCount.toLocaleString()} reviews)</span></div>`
    : '<div class="listing-rating-row"><span class="muted">No rating yet</span></div>';

  const reviewSection = item.rating
    ? `<section class="listing-section">
          <h2>Reviews</h2>
          <div class="review-summary">
            <span class="review-score-num">${item.rating}</span>
            <div class="review-summary-meta">
              <span class="stars">${stars(item.rating)}</span>
              <span class="muted">${item.reviewCount.toLocaleString()} Google reviews</span>
            </div>
          </div>
          ${item.review
            ? `<blockquote class="card-review">“${escapeHtml(item.review)}”${item.reviewAuthor ? '<cite>' + escapeHtml(item.reviewAuthor) + '</cite>' : ''}</blockquote>`
            : ''}
        </section>`
    : '';

  const websiteRow = item.website
    ? `<div class="info-row">
            <span class="info-label">Website</span>
            <span class="info-value"><a href="${escapeHtml(item.website)}" target="_blank" rel="noopener nofollow">${escapeHtml(item.website.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</a></span>
          </div>`
    : '';

  const websiteBtn = item.website
    ? `<a class="btn btn-ghost" href="${escapeHtml(item.website)}" target="_blank" rel="noopener nofollow">Visit Website</a>`
    : '';

  const directionsUrl =
    'https://www.google.com/maps/dir/?api=1&destination=' +
    encodeURIComponent(item.name + ' ' + item.address) +
    '&destination_place_id=' + encodeURIComponent(item.id) +
    '&travelmode=driving';

  const streetAddress = item.address.split(',')[0].trim();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: item.name,
    additionalType: item.category,
    url: canonicalUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: streetAddress,
      addressLocality: item.city,
      addressRegion: item.stateCode,
      postalCode: item.zip,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: item.lat,
      longitude: item.lng,
    },
  };
  if (item.rating) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: item.rating,
      reviewCount: item.reviewCount,
    };
  }
  const jsonLdString = JSON.stringify(jsonLd, null, 2).replace(/</g, '\\u003c');

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
  <meta name="description" content="${escapeHtml(desc)}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${escapeHtml(titleTag)}" />
  <meta property="og:description" content="${escapeHtml(ogDesc)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonicalUrl}" />

  <link rel="icon" href="/logo.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="/vendor/leaflet/leaflet.css" />
  <link rel="stylesheet" href="/css/style.css" />
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9332749804326149" crossorigin="anonymous"></script>
  <script type="application/ld+json">
${jsonLdString}
  </script>
</head>
<body>
  <button id="backToTop" class="back-to-top" type="button" tabindex="-1" aria-label="Back to top">&#8593;</button>
  <header class="site-header">
    <div class="container">
      <a class="brand" href="/" aria-label="Orchards Near Me home">
        <img src="/logo.svg" alt="" class="logo-icon" />
        Orchards Near Me
      </a>
      <nav class="main-nav" aria-label="Primary">
        <a href="/">Home</a>
        <a href="/about.html">About</a>
        <a href="/blog">Blog</a>
        <a href="/fruits">Fruits</a>
        <a href="/partners">Partners</a>
        <a href="/find" class="cta">Find</a>
      </nav>
    </div>
  </header>

  <main class="listing-page">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a> &rsaquo; <a href="/find">Find</a> &rsaquo;
        <a href="${categoryPageUrl}">${config.label} in ${item.state}</a> &rsaquo;
        <span aria-current="page">${escapeHtml(displayName)}</span>
      </nav>

      <div class="listing-hero">
        <span class="badge ${item.category === 'Garden Center' ? 'GardenCenter' : item.category}">${escapeHtml(item.category)}</span>
        <h1>${escapeHtml(displayName)}</h1>
        <p class="listing-location">${escapeHtml(cityState)}</p>
        ${ratingRow}
        ${fitChipsHtml(chips)}
      </div>

      <div id="listingMap" class="listing-map" role="application" aria-label="Map showing the location of ${escapeHtml(displayName)}"></div>

      <div class="listing-layout">
        <div class="listing-main">
          <section class="listing-section">
            <h2>About ${escapeHtml(displayName)}</h2>
            <p>${aboutText}</p>
          </section>

          ${reviewSection}
        </div>

        <aside class="listing-sidebar">
          <div class="info-card">
            <h2 class="info-card-title">Visit</h2>
            <div class="info-row">
              <span class="info-label">Address</span>
              <span class="info-value">${escapeHtml(item.address)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Hours</span>
              <span class="info-value">Hours aren't listed here &mdash; call ahead or check the website before visiting, as farm hours change with the season.</span>
            </div>
            ${websiteRow}
            <div class="info-actions">
              <a class="btn" href="${directionsUrl}" target="_blank" rel="noopener nofollow">Get Directions</a>
              ${websiteBtn}
              <a class="btn btn-ghost card-claim" href="/claim.html">Own This Business?</a>
            </div>
          </div>
        </aside>
      </div>

      <section class="seo-content related-links">
        <h2>Explore More</h2>
        <ul class="related-links-list">
          <li><a href="${categoryPageUrl}">All ${config.label} in ${item.state}</a></li>
          <li><a href="/find">Browse all categories and states</a></li>
        </ul>
      </section>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <ul class="footer-nav">
        <li><a href="/">Home</a></li>
        <li><a href="/about.html">About</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/contact.html">Contact</a></li>
        <li><a href="/claim.html">Claim Your Listing</a></li>
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
  <script>
    document.getElementById('year').textContent = new Date().getFullYear();
    (function () {
      var map = L.map('listingMap', { scrollWheelZoom: false }).setView([${item.lat}, ${item.lng}], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);
      var icon = L.icon({
        iconUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32"%3E%3Ccircle cx="12" cy="10" r="8" fill="%23${config.color.slice(1)}"/%3E%3Cpath d="M12 18 L12 28" stroke="%238b6f47" stroke-width="2"/%3E%3C/svg%3E',
        iconSize: [24, 32],
        iconAnchor: [12, 32],
      });
      L.marker([${item.lat}, ${item.lng}], { icon: icon }).addTo(map);
      setTimeout(function () { map.invalidateSize(); }, 200);
    })();
  </script>
</body>
</html>
`;
}

function main() {
  const data = JSON.parse(fs.readFileSync(listingsPath, 'utf8'));
  let count = 0;
  data.listings.forEach((item) => {
    const html = generateListingPage(item);
    fs.writeFileSync(path.join(outDir, `${item.slug}.html`), html, 'utf8');
    count++;
  });
  console.log(`Generated ${count} individual listing pages.`);
}

main();
