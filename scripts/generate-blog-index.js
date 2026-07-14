#!/usr/bin/env node
'use strict';

// Builds blog/index.html as a hub of simple hyperlinked text links across
// every fruit's state-post series, grouped by US region. Run this after
// any per-fruit generator (generate-blog-posts.js, generate-blueberry-blog-posts.js,
// etc.) so the hub reflects whatever series currently exist.

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'blog');

const src = fs.readFileSync(path.join(__dirname, 'generate-city-pages.js'), 'utf8');
const capitalsM = src.match(/const capitals = (\[[\s\S]*?\n\]);/);
const capitals = eval(capitalsM[1]);

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-');
}

// Every fruit series that has a generated set of state posts in /blog.
// Add a new entry here whenever a new per-fruit generator is introduced.
const FRUIT_SERIES = [
  { prefix: 'apple-picking-season', label: 'Apple Picking Season' },
  { prefix: 'blueberry-picking-season', label: 'Blueberry Picking Season' },
  { prefix: 'cherry-picking-season', label: 'Cherry Picking Season' },
  { prefix: 'raspberry-picking-season', label: 'Raspberry Picking Season' },
  { prefix: 'orange-picking-season', label: 'Orange Picking Season' },
  { prefix: 'pear-picking-season', label: 'Pear Picking Season' },
];

const REGION_LABELS = {
  'new-england': 'New England',
  'mid-atlantic': 'Mid-Atlantic',
  'southeast': 'Southeast',
  'midwest': 'Midwest',
  'south-central': 'South Central',
  'mountain': 'Mountain West',
  'pacific': 'Pacific',
  'southwest': 'Southwest',
};
const REGION_ORDER = ['new-england', 'mid-atlantic', 'southeast', 'midwest', 'south-central', 'mountain', 'pacific', 'southwest'];

const byRegion = {};
REGION_ORDER.forEach(r => { byRegion[r] = []; });

for (const cap of capitals) {
  const region = cap.region;
  if (!byRegion[region]) continue;
  for (const series of FRUIT_SERIES) {
    const postPath = path.join(OUT_DIR, `${series.prefix}-${slugify(cap.state)}.html`);
    if (!fs.existsSync(postPath)) continue; // skip series/state combos that haven't been generated
    byRegion[region].push({
      href: `/blog/${series.prefix}-${slugify(cap.state)}`,
      label: `${series.label} ${cap.state}`,
    });
  }
}
REGION_ORDER.forEach(r => { byRegion[r].sort((a, b) => a.label.localeCompare(b.label)); });

const nav = REGION_ORDER.filter(r => byRegion[r].length).map(r =>
  `        <a href="#region-${r}">${REGION_LABELS[r]}</a>`
).join('\n');

const sections = REGION_ORDER.filter(r => byRegion[r].length).map(r => {
  const items = byRegion[r].map(entry =>
    `            <li><a href="${entry.href}">${entry.label}</a></li>`
  ).join('\n');
  return `      <h2 id="region-${r}" class="blog-region-heading">${REGION_LABELS[r]}</h2>
      <ul class="blog-link-list">
${items}
      </ul>`;
}).join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Blog | Orchards Near Me</title>
  <meta name="description" content="All of our seasonal picking guides in one place. Find out when apple and blueberry picking season starts in every state, organized by region." />
  <link rel="canonical" href="https://orchards-nearme.com/blog" />
  <meta property="og:title" content="Blog | Orchards Near Me" />
  <meta property="og:description" content="All of our seasonal picking guides in one place, organized by region." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://orchards-nearme.com/blog" />

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
        <a href="/blog" class="active">Blog</a>
        <a href="/find" class="cta">Find</a>
      </nav>
    </div>
  </header>

  <main id="main" class="page">
    <div class="container">
      <h1>Blog</h1>
      <p class="lead">All of our seasonal picking guides in one place. Browse state-by-state picking season guides below, organized by region.</p>

      <nav class="blog-region-nav" aria-label="Jump to region">
${nav}
      </nav>

${sections}
    </div>
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
  <script>document.getElementById('year').textContent = new Date().getFullYear();</script>
  <script>(function(){var b=document.getElementById('backToTop');if(!b)return;window.addEventListener('scroll',function(){var s=window.scrollY>600;b.classList.toggle('visible',s);b.tabIndex=s?0:-1;});b.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});})();</script>
</body>
</html>`;

fs.writeFileSync(path.join(OUT_DIR, 'index.html'), html, 'utf8');
console.log('Generated blog/index.html');
