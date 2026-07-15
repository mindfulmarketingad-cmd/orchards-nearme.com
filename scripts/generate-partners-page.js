#!/usr/bin/env node
'use strict';

// Builds /partners/ - a single directory hub linking to every individual
// business listing page. All partners are baked into the static HTML (so the
// links are crawlable and the pages get discovered), with a client-side
// search + category + state filter bar layered on top for usability.
// Requires scripts/add-listing-slugs.js to have run first (needs `slug`).

const fs = require('fs');
const path = require('path');

const listingsPath = path.join(__dirname, '..', 'data', 'listings.json');
const outDir = path.join(__dirname, '..', 'partners');

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function toTitleCase(name) {
  if (/[A-Z]/.test(name)) return name;
  return name.replace(/\b\w/g, (c) => c.toUpperCase());
}

function main() {
  const data = JSON.parse(fs.readFileSync(listingsPath, 'utf8'));
  const listings = data.listings.slice();

  // Sort alphabetically by display name (case-insensitive).
  listings.sort((a, b) =>
    toTitleCase(a.name).toLowerCase().localeCompare(toTitleCase(b.name).toLowerCase())
  );

  const total = listings.length;

  // State dropdown options.
  const states = Array.from(new Set(listings.map((l) => l.state).filter(Boolean))).sort();
  const stateOptions = ['<option value="all">All states</option>']
    .concat(states.map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`))
    .join('\n            ');

  const rows = listings
    .map((item) => {
      const displayName = toTitleCase(item.name);
      const cityState = [item.city, item.stateCode].filter(Boolean).join(', ');
      const reviews = item.rating
        ? `★ ${item.rating} · ${item.reviewCount.toLocaleString()} review${item.reviewCount === 1 ? '' : 's'}`
        : 'No reviews yet';
      const search = escapeHtml(
        (item.name + ' ' + (item.city || '') + ' ' + (item.state || '')).toLowerCase()
      );
      return `        <li class="partner-row" data-cat="${escapeHtml(item.category)}" data-state="${escapeHtml(item.state)}" data-search="${search}">
          <a class="partner-name" href="/find/${item.slug}">${escapeHtml(displayName)}</a>
          <span class="partner-reviews">${reviews}</span>
          <span class="partner-loc">${escapeHtml(cityState)} &middot; ${escapeHtml(item.address)}</span>
        </li>`;
    })
    .join('\n');

  const html = `<!DOCTYPE html>
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
  <title>Our Partners - ${total.toLocaleString()} Orchards, Farms &amp; Garden Centers | Orchards Near Me</title>
  <meta name="description" content="Browse all ${total.toLocaleString()} orchards, farms, and garden centers listed on Orchards Near Me. Search and filter by name, type, and state to find pick-your-own spots near you." />
  <link rel="canonical" href="https://orchards-nearme.com/partners" />
  <meta property="og:title" content="Our Partners | Orchards Near Me" />
  <meta property="og:description" content="Browse all ${total.toLocaleString()} orchards, farms, and garden centers listed on Orchards Near Me." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://orchards-nearme.com/partners" />

  <link rel="icon" href="/logo.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="/css/style.css" />
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9332749804326149" crossorigin="anonymous"></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
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
        <a href="/partners" class="active">Partners</a>
        <a href="/find" class="cta">Find</a>
      </nav>
    </div>
  </header>

  <main id="main" class="page">
    <div class="container">
      <h1>Our Partners</h1>
      <p class="lead">Every orchard, farm, and garden center listed on Orchards Near Me &mdash; ${total.toLocaleString()} in all. Search by name or city, or filter by type and state, then click through for hours info, directions, and reviews.</p>

      <div class="partners-toolbar">
        <input type="search" id="partnerSearch" class="partners-search" placeholder="Search by name or city&hellip;" aria-label="Search partners by name or city" />
        <select id="partnerCategory" class="state-select" aria-label="Filter by type">
          <option value="all">All types</option>
          <option value="Orchard">Orchards</option>
          <option value="Farm">Farms</option>
          <option value="Garden Center">Garden Centers</option>
        </select>
        <select id="partnerState" class="state-select" aria-label="Filter by state">
            ${stateOptions}
        </select>
      </div>

      <p class="partners-count" id="partnersCount" role="status">Showing ${total.toLocaleString()} partners</p>

      <ul class="partners-list" id="partnersList">
${rows}
      </ul>
      <p class="partners-empty no-results" id="partnersEmpty" hidden>No partners match your search. Try a different name, type, or state.</p>
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

  <script>
    document.getElementById('year').textContent = new Date().getFullYear();
    (function () {
      var search = document.getElementById('partnerSearch');
      var catSel = document.getElementById('partnerCategory');
      var stateSel = document.getElementById('partnerState');
      var list = document.getElementById('partnersList');
      var items = list.getElementsByClassName('partner-row');
      var countEl = document.getElementById('partnersCount');
      var emptyEl = document.getElementById('partnersEmpty');
      var total = items.length;

      function apply() {
        var q = search.value.trim().toLowerCase();
        var cat = catSel.value;
        var st = stateSel.value;
        var shown = 0;
        for (var i = 0; i < items.length; i++) {
          var it = items[i];
          var okQ = !q || it.getAttribute('data-search').indexOf(q) !== -1;
          var okCat = cat === 'all' || it.getAttribute('data-cat') === cat;
          var okSt = st === 'all' || it.getAttribute('data-state') === st;
          var show = okQ && okCat && okSt;
          it.style.display = show ? '' : 'none';
          if (show) shown++;
        }
        countEl.textContent = 'Showing ' + shown.toLocaleString() + ' of ' + total.toLocaleString() + ' partners';
        emptyEl.hidden = shown !== 0;
      }

      search.addEventListener('input', apply);
      catSel.addEventListener('change', apply);
      stateSel.addEventListener('change', apply);
    })();
  </script>
</body>
</html>
`;

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
  console.log(`Generated partners hub with ${total} partners.`);
}

main();
