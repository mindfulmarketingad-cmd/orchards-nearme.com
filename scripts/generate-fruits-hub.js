#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'fruits');

const { FRUITS: APPLES } = require('./generate-fruit-variety-pages');
const { FRUITS: BLUEBERRIES } = require('./generate-blueberry-variety-pages');

const GROUPS = [
  { label: 'Apples', suffix: 'Apples', fruits: APPLES },
  { label: 'Blueberries', suffix: 'Blueberries', fruits: BLUEBERRIES },
];

const sections = GROUPS.map(group => {
  const sorted = group.fruits.slice().sort((a, b) => a.label.localeCompare(b.label));
  const items = sorted.map(f =>
    `            <li><a href="/fruits/${f.slug}">${f.label} ${group.suffix}</a></li>`
  ).join('\n');
  return `      <h2 id="type-${group.label.toLowerCase()}" class="blog-region-heading">${group.label}</h2>
      <ul class="blog-link-list">
${items}
      </ul>`;
}).join('\n\n');

const nav = GROUPS.map(group =>
  `        <a href="#type-${group.label.toLowerCase()}">${group.label}</a>`
).join('\n');

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
  <title>Fruit Varieties | Orchards Near Me</title>
  <meta name="description" content="Explore fruit varieties in depth — taste profiles, history, season and availability, nutrition, and best uses for popular apple and blueberry varieties, organized by fruit type." />
  <link rel="canonical" href="https://orchards-nearme.com/fruits" />
  <meta property="og:title" content="Fruit Varieties | Orchards Near Me" />
  <meta property="og:description" content="Explore fruit varieties in depth — taste, history, season, nutrition, and best uses, organized by fruit type." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://orchards-nearme.com/fruits" />

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
        <a href="/fruits" class="active">Fruits</a>
        <a href="/find" class="cta">Find</a>
      </nav>
    </div>
  </header>

  <main id="main" class="page">
    <div class="container">
      <h1>Fruit Varieties</h1>
      <p class="lead">Deep dives into specific fruit varieties — taste profiles, history, season and availability, nutrition, and the best uses for each one. Browse by fruit type below.</p>

      <nav class="blog-region-nav" aria-label="Jump to fruit type">
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
  <script>document.getElementById('year').textContent = new Date().getFullYear();</script>
  <script>(function(){var b=document.getElementById('backToTop');if(!b)return;window.addEventListener('scroll',function(){var s=window.scrollY>600;b.classList.toggle('visible',s);b.tabIndex=s?0:-1;});b.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});})();</script>
</body>
</html>`;

fs.writeFileSync(path.join(OUT_DIR, 'index.html'), html, 'utf8');
console.log('Generated: fruits/index.html');
