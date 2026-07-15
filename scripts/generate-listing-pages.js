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

function generateListingPage(item) {
  const displayName = toTitleCase(item.name);
  const config = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.Farm;
  const cityState = [item.city, item.stateCode].filter(Boolean).join(', ');
  const stateSlug = slugify(item.state);
  const canonicalUrl = `https://orchards-nearme.com/find/${item.slug}`;
  const categoryPageUrl = `/find/${config.slugPrefix}${stateSlug}`;

  const titleTag = `${displayName} - ${item.category} in ${cityState} | Orchards Near Me`;
  const ratingSummary = item.rating
    ? `rated ${item.rating} out of 5 from ${item.reviewCount.toLocaleString()} reviews`
    : 'a pick-your-own destination';
  const desc = `${displayName} is a ${item.category.toLowerCase()} in ${cityState}, ${ratingSummary}. Get directions, contact info, and visitor reviews.`;
  const ogDesc = `${item.category} in ${cityState}${item.rating ? ' · ' + item.rating + ' stars' : ''}. View address, directions, and reviews.`;

  const ratingBlock = item.rating
    ? `<p class="listing-rating"><span class="stars">${stars(item.rating)}</span> ${item.rating} (${item.reviewCount.toLocaleString()} reviews)</p>`
    : '<p class="listing-rating">No rating yet</p>';

  const reviewBlock = item.review
    ? `<blockquote class="card-review">“${escapeHtml(item.review)}”${item.reviewAuthor ? '<cite>' + escapeHtml(item.reviewAuthor) + '</cite>' : ''}</blockquote>`
    : '';

  const websiteBlock = item.website
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

      <div class="listing-header">
        <div>
          <span class="badge ${item.category === 'Garden Center' ? 'GardenCenter' : item.category}">${escapeHtml(item.category)}</span>
          <h1>${escapeHtml(displayName)}</h1>
          <p class="listing-location">${escapeHtml(cityState)}</p>
          ${ratingBlock}
        </div>
      </div>

      <div class="listing-body">
        <div class="listing-main">
          <div id="listingMap" class="listing-map" role="application" aria-label="Map showing the location of ${escapeHtml(displayName)}"></div>

          <div class="listing-actions">
            <a class="btn" href="${directionsUrl}" target="_blank" rel="noopener nofollow">Get Directions</a>
            ${websiteBlock}
            <a class="btn btn-ghost card-claim" href="/claim.html">Own This Business?</a>
          </div>

          <p class="listing-address">${escapeHtml(item.address)}</p>

          ${reviewBlock}
        </div>
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
