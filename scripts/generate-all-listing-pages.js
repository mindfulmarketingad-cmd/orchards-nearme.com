#!/usr/bin/env node
'use strict';

/*
 * Generates an individual business detail page under /find/[business-name]
 * for every listing in data/listings.json, using the hours/phone/reviews
 * pulled into data/listing-details.json by fetch-listing-details.js.
 *
 * NEVER requests or renders photo fields from the Places API.
 *
 * Also:
 *  - writes each listing's page slug back into data/listings.json so the
 *    live site (js/app.js) can link cards/popups straight to their page.
 *  - writes data/all-listing-slugs.json (id -> slug) for the sitemap step.
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://orchards-nearme.com';
const CLAIM_LISTING_URL = 'https://buy.stripe.com/3cIfZi96i6cM7My9pIfrW09';
const UPDATED_LABEL = 'July 2026';

const CATEGORY_HUB = {
  Orchard: { url: '/find/apple-picking-orchards-near-me', label: 'Apple Picking Orchards Near Me' },
  Farm: { url: '/find/you-pick-farms-near-me', label: 'You Pick Farms Near Me' },
  'Garden Center': { url: '/find/garden-centers-near-me', label: 'Garden Centers Near Me' },
};

// Same keyword defs as js/app.js's fit chips, ported for build-time use.
const KEYWORD_DEFS = [
  {
    slug: 'apple-picking',
    label: 'Apple Picking',
    icon: '🍎',
    test: function (item, text) {
      if (item.category === 'Orchard') return true;
      return text.includes('apple') && (text.includes('pick') || text.includes('orchard') || text.includes('u-pick') || text.includes('u pick'));
    },
  },
  {
    slug: 'cherry-picking',
    label: 'Cherry Picking',
    icon: '🍒',
    test: function (item, text) { return text.includes('cherry'); },
  },
  {
    slug: 'berry-picking',
    label: 'Berry Picking',
    icon: '🍓',
    test: function (item, text) {
      return text.includes('berry') || text.includes('berries') || text.includes('strawberr') || text.includes('blueberr') || text.includes('raspberr') || text.includes('blackberr');
    },
  },
  {
    slug: 'peach-picking',
    label: 'Peach Picking',
    icon: '🍑',
    test: function (item, text) { return text.includes('peach'); },
  },
  {
    slug: 'blueberry-picking',
    label: 'Blueberry Picking',
    icon: '🫐',
    test: function (item, text) { return text.includes('blueberr'); },
  },
  {
    slug: 'strawberry-picking',
    label: 'Strawberry Picking',
    icon: '🍓',
    test: function (item, text) { return text.includes('strawberr'); },
  },
];

function getFitChips(item) {
  var text = (item.name + ' ' + (item.review || '')).toLowerCase();
  return KEYWORD_DEFS.filter(function (k) { return k.test(item, text); });
}

function fitChipsHtml(item) {
  var chips = getFitChips(item);
  if (!chips.length) return '';
  var html = '<div class="fit-chips">';
  chips.forEach(function (c) {
    html += '<span class="fit-chip fit-chip--' + c.slug.replace('-picking', '') + '">' + c.icon + ' ' + escapeHtml(c.label) + '</span>';
  });
  html += '</div>';
  return html;
}

function slugifyBase(str) {
  return str
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'listing';
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
  var full = Math.round(rating);
  var s = '';
  for (var i = 0; i < 5; i++) s += i < full ? '★' : '☆';
  return s;
}

function catClass(cat) {
  return cat === 'Garden Center' ? 'GardenCenter' : cat;
}

function telHref(phone) {
  if (!phone) return '';
  return 'tel:' + phone.replace(/[^\d+]/g, '');
}

function hoursTableHtml(hours) {
  if (!hours || !hours.weekdayDescriptions || !hours.weekdayDescriptions.length) {
    return '<p class="listing-hours-note">Hours are not listed. Call ahead to confirm before you visit.</p>';
  }
  var rows = hours.weekdayDescriptions
    .map((line) => {
      var idx = line.indexOf(':');
      var day = line.slice(0, idx);
      var time = line.slice(idx + 1).trim();
      return '<tr><td>' + escapeHtml(day) + '</td><td>' + escapeHtml(time) + '</td></tr>';
    })
    .join('\n');
  return (
    '<table class="listing-hours-table">\n<tbody>\n' +
    rows +
    '\n</tbody>\n</table>\n' +
    '<p class="listing-hours-note">Hours can change seasonally &mdash; call ahead before visiting, especially during u-pick season.</p>'
  );
}

function reviewsHtml(reviews) {
  if (!reviews || !reviews.length) {
    return '<p class="listing-hours-note">No reviews yet.</p>';
  }
  return reviews
    .map((r) => {
      var text = r.text && r.text.text ? r.text.text : '';
      var author = (r.authorAttribution && r.authorAttribution.displayName) || 'Google user';
      var time = r.relativePublishTimeDescription || '';
      return (
        '<div class="listing-review-item">' +
        '<div class="listing-review-head">' +
        '<span class="stars">' + stars(r.rating) + '</span>' +
        '<span class="listing-review-author">' + escapeHtml(author) + '</span>' +
        (time ? '<span class="listing-review-time">' + escapeHtml(time) + '</span>' : '') +
        '</div>' +
        '<p class="listing-review-text">' + escapeHtml(text) + '</p>' +
        '</div>'
      );
    })
    .join('\n');
}

function generatePage(item, details, slug) {
  const name = item.name;
  const city = item.city || '';
  const state = item.state || '';
  const stateCode = item.stateCode || '';
  const address = item.address || (details && details.formattedAddress) || '';
  const category = item.category;
  const lat = item.lat;
  const lng = item.lng;
  const rating = (details && details.rating) || item.rating || null;
  const reviewCount = (details && details.userRatingCount) || item.reviewCount || 0;
  const website = (details && details.websiteUri) || item.website || '';
  const phone = (details && (details.nationalPhoneNumber || details.internationalPhoneNumber)) || '';
  const hours = details && details.regularOpeningHours;
  const reviews = (details && details.reviews) || [];

  const h1 = `${name} - ${city} ${stateCode}`;
  const titleTag = `${name} - ${city} ${stateCode}`;
  const desc = `${name} in ${city}, ${state}: hours, contact info, reviews, and directions. ${rating ? `Rated ${rating} stars from ${reviewCount} reviews. ` : ''}See it on the map and plan your visit.`;
  const canonicalUrl = `${SITE_URL}/find/${slug}`;
  const directionsUrl =
    'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(name + ' ' + address);
  const hub = CATEGORY_HUB[category] || CATEGORY_HUB.Orchard;
  const ratingLine = rating
    ? `<span class="stars">${stars(rating)}</span> ${rating} (${reviewCount.toLocaleString()} reviews)`
    : 'No rating yet';
  const websiteLink = website
    ? `<a href="${escapeHtml(website)}" target="_blank" rel="noopener nofollow">Visit website</a>`
    : '';
  const phoneLink = phone ? `<a href="${telHref(phone)}">Call ${escapeHtml(phone)}</a>` : '';
  const chips = fitChipsHtml(item);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: city,
      addressRegion: stateCode,
    },
    geo: lat && lng ? { '@type': 'GeoCoordinates', latitude: lat, longitude: lng } : undefined,
    telephone: phone || undefined,
    url: website || canonicalUrl,
    aggregateRating: rating
      ? { '@type': 'AggregateRating', ratingValue: rating, reviewCount: reviewCount }
      : undefined,
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(titleTag)}</title>
  <meta name="description" content="${escapeHtml(desc)}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${escapeHtml(titleTag)}" />
  <meta property="og:description" content="${escapeHtml(desc)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonicalUrl}" />

  <link rel="icon" href="/logo.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="/vendor/leaflet/leaflet.css" />
  <link rel="stylesheet" href="/css/style.css" />
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2173008413459742" crossorigin="anonymous"></script>
</head>
<body>
  <a class="skip-link" href="#find">Skip to map</a>
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
        <a href="/find" class="cta">Find</a>
      </nav>
    </div>
  </header>

  <main>
    <section class="hero">
      <div class="container">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span aria-hidden="true"> &rsaquo; </span>
          <a href="/find">Find</a>
          <span aria-hidden="true"> &rsaquo; </span>
          <a href="${hub.url}">${escapeHtml(hub.label)}</a>
          <span aria-hidden="true"> &rsaquo; </span>
          <span aria-current="page">${escapeHtml(name)}</span>
        </nav>
        <h1>${escapeHtml(h1)}</h1>
        <p>${escapeHtml(category)} in ${escapeHtml(city)}, ${escapeHtml(stateCode)} &middot; ${ratingLine}</p>
      </div>
    </section>

    <div class="container">
      <div class="view-toggle" id="viewToggle">
        <button class="active" data-view="map">Map</button>
        <button data-view="list">Details</button>
      </div>
      <div class="find-layout find-layout--single">
        <div class="results-col">
          <div class="cards">
            <article class="card listing-detail-card">
              <div class="card-top">
                <div><h2>${escapeHtml(name)}</h2>
                <p class="card-meta">${ratingLine}</p></div>
                <span class="badge ${catClass(category)}">${escapeHtml(category)}</span>
              </div>
              ${chips}
              <p class="card-address">${escapeHtml(address)}</p>

              <div class="listing-detail-actions">
                <a href="${directionsUrl}" target="_blank" rel="noopener nofollow">Get directions</a>
                ${phoneLink}
                ${websiteLink}
                <a class="card-claim" href="${CLAIM_LISTING_URL}" target="_blank" rel="noopener">Own This Business?</a>
              </div>

              <form class="card-distance-form" id="listingDistanceForm">
                <label class="card-distance-label" for="listingDistanceInput">Distance from your address</label>
                <div class="card-distance-row">
                  <input type="text" inputmode="numeric" maxlength="5" id="listingDistanceInput" class="card-distance-input" placeholder="Enter your ZIP code" aria-label="Your ZIP code">
                  <button type="submit" class="card-distance-btn">Check</button>
                </div>
                <p class="card-distance-result" aria-live="polite"></p>
              </form>

              <section class="listing-section">
                <h2>Hours</h2>
                ${hoursTableHtml(hours)}
              </section>

              <section class="listing-section">
                <h2>Reviews</h2>
                ${reviewsHtml(reviews)}
              </section>

              <p class="listing-hours-note">Last verified: ${UPDATED_LABEL}. Listing details are pulled from public business information and can change &mdash; please confirm directly with the business before visiting.</p>
            </article>
          </div>
        </div>
        <div class="map-col">
          <div id="map" role="application" aria-label="Map showing ${escapeHtml(name)}" data-lat="${lat}" data-lng="${lng}" data-name="${escapeHtml(name)}" data-address="${escapeHtml(address)}" data-category="${escapeHtml(category)}"></div>
        </div>
      </div>
    </div>

    <section class="seo-content related-links">
      <div class="container">
        <h2>Explore More Near ${escapeHtml(city)}, ${escapeHtml(stateCode)}</h2>
        <ul class="related-links-list">
          <li><a href="${hub.url}">${escapeHtml(hub.label)}</a></li>
          ${hub.url !== '/find/apple-picking-orchards-near-me' ? '<li><a href="/find/apple-picking-orchards-near-me">Apple Picking Orchards Near Me</a></li>' : ''}
          <li><a href="/find/strawberry-picking-orchards-near-me">Strawberry Picking Orchards Near Me</a></li>
          ${hub.url !== '/find/garden-centers-near-me' ? '<li><a href="/find/garden-centers-near-me">Garden Centers Near Me</a></li>' : ''}
        </ul>
        <p class="related-links-all"><a href="/find">Browse all orchards and farms by state</a></p>
      </div>
    </section>
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
  <script src="/js/listing-page.js"></script>
</body>
</html>
`;
}

function main() {
  const dataDir = path.join(__dirname, '..', 'data');
  const findDir = path.join(__dirname, '..', 'find');
  const listingsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'listings.json'), 'utf8'));
  const detailsById = JSON.parse(fs.readFileSync(path.join(dataDir, 'listing-details.json'), 'utf8'));
  const listings = listingsData.listings || [];

  // Pass 1: compute base slugs, count collisions.
  const baseSlugCount = {};
  const baseSlugs = {};
  listings.forEach((item) => {
    const base = slugifyBase(item.name);
    baseSlugs[item.id] = base;
    baseSlugCount[base] = (baseSlugCount[base] || 0) + 1;
  });

  // Pass 2: assign final unique slugs.
  const finalSlugs = {};
  const usedSlugs = new Set();
  listings.forEach((item) => {
    const base = baseSlugs[item.id];
    let slug = base;
    if (baseSlugCount[base] > 1) {
      slug = slugifyBase(item.name + '-' + (item.city || '') + '-' + (item.stateCode || ''));
    }
    if (usedSlugs.has(slug)) {
      slug = slug + '-' + item.id.slice(-6).toLowerCase();
    }
    usedSlugs.add(slug);
    finalSlugs[item.id] = slug;
  });

  let generated = 0;
  let missingDetails = 0;
  listings.forEach((item) => {
    const slug = finalSlugs[item.id];
    let details = detailsById[item.id];
    if (!details || details.error) {
      missingDetails++;
      details = null;
    }
    const html = generatePage(item, details, slug);
    fs.writeFileSync(path.join(findDir, `${slug}.html`), html, 'utf8');
    item.slug = slug;
    generated++;
  });

  fs.writeFileSync(path.join(dataDir, 'listings.json'), JSON.stringify(listingsData, null, 2), 'utf8');
  fs.writeFileSync(path.join(dataDir, 'all-listing-slugs.json'), JSON.stringify(finalSlugs, null, 2), 'utf8');

  console.log(`Generated ${generated} listing pages (${missingDetails} without fetched details, using base listing data only).`);
}

main();
