#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'blog');
const SITE_URL = 'https://orchards-nearme.com';
const PUB_DATE = '2025-07-01';

const FEATURED_IMAGES = [
  { file: 'blueberry-hands-picking-bush.jpg', alt: 'Hands picking ripe blueberries from a bush' },
  { file: 'blueberry-basket-harvest.jpg', alt: 'A handful of blueberries over a basket of freshly picked berries' },
  { file: 'blueberry-farm-bucket-field.jpg', alt: 'A bucket full of freshly picked blueberries at a u-pick farm' },
];

const NO_SEASON_STATES = new Set(['Arizona', 'Hawaii', 'Montana', 'New Mexico', 'North Dakota', 'South Dakota', 'Wyoming']);

const VARIETIES_BY_REGION = {
  'new-england': 'wild lowbush blueberries alongside cultivated highbush varieties like Bluecrop and Patriot',
  'mid-atlantic': 'northern highbush varieties such as Duke, Bluecrop, and Blueray',
  'southeast': 'rabbiteye varieties like Tifblue and Climax, along with southern highbush cultivars bred for warm winters',
  'midwest': 'northern highbush varieties such as Bluecrop, Jersey, and Patriot',
  'mountain': 'a small number of cold-hardy highbush varieties grown in heavily amended, acidic soil',
  'south-central': 'rabbiteye and southern highbush varieties suited to hot summers',
  'pacific': 'highbush varieties such as Duke, Bluecrop, Elliott, and Legacy',
  'southwest': 'none commercially, since the desert climate rules out reliable production',
};

// ---------- Load source data ----------

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
    blueberryIntros: extractObj('blueberryIntros'),
    blueberryTips: extractObj('blueberryTips'),
    blueberrySeason: extractObj('blueberrySeason'),
  };
}

const { capitals, blueberryIntros, blueberryTips, blueberrySeason } = loadCityGenData();

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-');
}

function lowerFirst(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

const STATES = capitals.map(cap => {
  const name = cap.state;
  const seasonText = blueberrySeason[name];
  const noSeason = NO_SEASON_STATES.has(name);
  const varieties = VARIETIES_BY_REGION[cap.region] || 'highbush varieties suited to the local climate';
  const noSeasonReason = noSeason
    ? seasonText.replace(/^No (meaningful )?(commercial )?blueberry season\s*/i, '').replace(/^[;,]\s*/, '').trim().replace(/^given\b/i, 'due to')
    : '';
  const intro = noSeason
    ? `Blueberry picking isn't commercially available in ${name} — ${noSeasonReason}`
    : `Blueberry picking season in ${name} is ${lowerFirst(seasonText)}`;
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
    whereText: blueberryIntros[cap.city],
    tip: blueberryTips[cap.city],
  };
});

// ---------- Season chart ----------

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const CHART_MONTHS = ['April', 'May', 'June', 'July', 'August', 'September'];

function parsePeakRange(peakText) {
  const indices = [];
  MONTH_NAMES.forEach((m, i) => {
    if (new RegExp('\\b' + m + '\\b', 'i').test(peakText)) indices.push(i);
  });
  if (!indices.length) return { start: null, end: null };
  return { start: Math.min(...indices), end: Math.max(...indices) };
}

function renderSeasonChart(state) {
  if (state.noSeason) {
    return `<div class="season-chart-note">
            <p>${state.name} has <strong>no meaningful commercial blueberry season</strong> — the local climate and soil don't support reliable production, so pick-your-own blueberry farms aren't part of the landscape here.</p>
          </div>`;
  }
  const range = parsePeakRange(state.peak);
  const headerCells = CHART_MONTHS.map(m => `<th scope="col">${m.slice(0, 3)}</th>`).join('');
  const bodyCells = CHART_MONTHS.map(label => {
    const monthIndex = MONTH_NAMES.indexOf(label);
    const isPeak = range.start !== null && monthIndex >= range.start && monthIndex <= range.end;
    return `<td class="season-chart-cell${isPeak ? ' is-peak' : ''}">${isPeak ? 'Peak' : '—'}</td>`;
  }).join('');
  return `<div class="season-chart-wrap">
            <table class="season-chart">
              <caption class="sr-only">Blueberry picking season chart for ${state.name}</caption>
              <thead>
                <tr><th scope="col" class="season-chart-label">Month</th>${headerCells}</tr>
              </thead>
              <tbody>
                <tr><th scope="row" class="season-chart-label">${state.name}</th>${bodyCells}</tr>
              </tbody>
            </table>
          </div>
          <p class="season-chart-caption">Typical season: <strong>${state.peak}</strong> Exact timing shifts a week or two earlier or later depending on the year's weather.</p>`;
}

function getRelatedStates(index, list, count = 6) {
  const related = [];
  for (let i = 1; i <= count; i++) {
    related.push(list[(index + i) % list.length]);
  }
  return related;
}

function buildFaqs(state) {
  const { name, capital, whereText, varieties, peak, noSeason } = state;
  if (noSeason) {
    return [
      {
        q: `Is there blueberry picking season in ${name}?`,
        a: `No — ${name} has no meaningful commercial blueberry season, since the local climate and soil don't support reliable production.`,
      },
      {
        q: `Where's the closest place to go blueberry picking to ${name}?`,
        a: `Check neighboring states with established blueberry industries, or browse our full <a href="/find/blueberry-picking-orchards-near-me">Blueberry Picking Near Me</a> directory to find the nearest active farm.`,
      },
      {
        q: `Can I grow blueberries at home in ${name}?`,
        a: `It's possible with heavily amended, acidic soil and careful irrigation, but it takes real effort given the region's natural growing conditions.`,
      },
      {
        q: `What fruit can I pick near ${capital}, ${name} instead?`,
        a: `Check our <a href="/find">full directory</a> for apple, cherry, berry, and peach picking options that may be better suited to the local climate.`,
      },
    ];
  }
  return [
    {
      q: `When is blueberry picking season in ${name}?`,
      a: `Blueberry picking season in ${name} runs ${lowerFirst(peak)}`,
    },
    {
      q: `Where can I go blueberry picking near ${capital}, ${name}?`,
      a: whereText,
    },
    {
      q: `What blueberry varieties can I pick in ${name}?`,
      a: `${name} orchards and farms commonly grow ${varieties}.`,
    },
    {
      q: `How much does blueberry picking cost in ${name}?`,
      a: `Most farms charge by the pound for what you pick, typically $3 to $6 per pound depending on the region, with some adding a small admission fee for other activities. Exact pricing varies by farm, so check the listing or call ahead.`,
    },
  ];
}

// ---------- Page template ----------

function generatePage(state, index, allStates) {
  const { slug, name, capital, capitalSlug, peak, whereText, varieties, tip, intro, noSeason, noSeasonReason } = state;
  const title = `Blueberry Picking Season ${name}`;
  const desc = `${intro} Find pick-your-own blueberry farms near ${capital}, ${name} on an interactive map.`;
  const canonical = `${SITE_URL}/blog/blueberry-picking-season-${slug}`;
  const findLink = `/find/blueberry-picking-orchards-near-${capitalSlug}-${slug.replace(/-/g, '-')}`;
  const image = FEATURED_IMAGES[index % FEATURED_IMAGES.length];
  const imageUrl = `${SITE_URL}/images/blog/${image.file}`;
  const faqs = buildFaqs(state);
  const relatedStates = getRelatedStates(index, allStates);

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": desc,
    "url": canonical,
    "datePublished": PUB_DATE,
    "dateModified": PUB_DATE,
    "author": { "@type": "Organization", "name": "Orchards Near Me", "url": SITE_URL },
    "publisher": { "@type": "Organization", "name": "Orchards Near Me", "url": SITE_URL },
    "mainEntityOfPage": { "@type": "WebPage", "@id": canonical },
    "keywords": `blueberry picking season ${name}, blueberry picking ${name}, pick your own blueberries ${name}, blueberry farms ${name}, best time to pick blueberries ${name}`,
  }, null, 2);

  const faqJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a.replace(/<[^>]+>/g, '') }
    })),
  }, null, 2);

  const faqHtml = faqs.map(f => `          <details class="faq-item">
            <summary>${f.q}</summary>
            <div class="faq-answer">
              <p>${f.a}</p>
            </div>
          </details>`).join('\n');

  const relatedStatesHtml = relatedStates.map(s =>
    `          <li><a href="/blog/blueberry-picking-season-${s.slug}">Blueberry Picking Season ${s.name}</a></li>`
  ).join('\n');

  const wherePara = noSeason
    ? `<p>${whereText}</p>`
    : `<p>${whereText}</p>
          <p>Use the map on our <a href="${findLink}">blueberry picking near ${capital}, ${name}</a> page to find specific farms by ZIP code and read visitor reviews before you go.</p>`;

  const findPara = noSeason
    ? `<p>Since ${name} doesn't have a meaningful blueberry season, browse the full <a href="/find/blueberry-picking-orchards-near-me">Blueberry Picking Near Me</a> directory to find the closest active farm in a neighboring state, or explore <a href="/find">other pick-your-own categories</a> better suited to the local climate.</p>`
    : `<p>Our interactive map pulls from farms across the state. <a href="${findLink}">Search blueberry picking near ${capital}</a> to see what is closest to you, or browse the full <a href="/find/blueberry-picking-orchards-near-me">Blueberry Picking Near Me</a> directory for the whole country.</p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${desc.replace(/"/g, '&quot;')}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
  <meta property="og:description" content="${desc.replace(/"/g, '&quot;')}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${canonical}" />
  <meta property="article:published_time" content="${PUB_DATE}" />

  <link rel="icon" href="/logo.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/css/style.css" />
  <script type="application/ld+json">
${jsonLd}
  </script>
  <script type="application/ld+json">
${faqJsonLd}
  </script>
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
        <a href="/partners">Partners</a>
        <a href="/find" class="cta">Find</a>
      </nav>
    </div>
  </header>

  <main id="main" class="page">
    <div class="container">

      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true"> &rsaquo; </span>
        <a href="/blog">Blog</a>
        <span aria-hidden="true"> &rsaquo; </span>
        <span aria-current="page">Blueberry Picking Season ${name}</span>
      </nav>

      <article class="blog-post">
        <header class="blog-post-header">
          <h1>Blueberry Picking Season ${name}</h1>
          <p class="blog-post-meta"><time datetime="${PUB_DATE}">July 1, 2025</time> &middot; Orchards Near Me</p>
        </header>

        <div class="blog-post-body">
          <p class="lead">${intro}</p>

          <h2>When Is Blueberry Picking Season in ${name}?</h2>
          ${renderSeasonChart(state)}

          <h2>Where to Pick Blueberries in ${name}</h2>
          ${wherePara}

          <h2>Best Blueberry Varieties in ${name}</h2>
          <p>${noSeason
            ? `${name} doesn't support commercial blueberry growing — ${noSeasonReason}`
            : `${name} orchards and farms commonly grow ${varieties}. Availability varies by farm and time of season, so ask the farm staff which rows are currently at peak — that guidance is worth more than any printed list.`
          }</p>

          <h2>Tips for Blueberry Picking in ${name}</h2>
          <p>${tip}</p>
          <p>General tips that apply everywhere: bring your own containers or use the farm's, wear clothes you don't mind staining, dress in layers since summer mornings can start cool, and bring cash — many smaller farms are not set up for card payments at the stand.</p>

          <h2>Find Blueberry Farms Near You in ${name}</h2>
          ${findPara}

          <h2>Frequently Asked Questions About Blueberry Picking in ${name}</h2>
          <div class="faq-list">
${faqHtml}
          </div>
        </div>
      </article>

      <section class="related-links seo-content" style="padding-top: 0;">
        <h2>Blueberry Picking Season in Other States</h2>
        <ul class="related-links-list">
${relatedStatesHtml}
        </ul>
      </section>

      <section class="related-links seo-content" style="padding-top: 0;">
        <h2>More Picking Guides</h2>
        <ul class="related-links-list">
          <li><a href="/find/blueberry-picking-orchards-near-me">Blueberry Picking Orchards Near Me</a></li>
          <li><a href="/find/apple-picking-orchards-near-me">Apple Picking Orchards Near Me</a></li>
          <li><a href="/find/berry-picking-orchards-near-me">Berry Picking Orchards Near Me</a></li>
          <li><a href="/find/peach-picking-orchards-near-me">Peach Picking Orchards Near Me</a></li>
          <li><a href="/blog">All Picking Season Guides</a></li>
        </ul>
        <p class="related-links-all"><a href="/find">Browse all orchards and farms by state</a></p>
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
}

// ---------- Generate all files ----------

let count = 0;
STATES.forEach((state, index) => {
  const html = generatePage(state, index, STATES);
  const outPath = path.join(OUT_DIR, `blueberry-picking-season-${state.slug}.html`);
  fs.writeFileSync(outPath, html, 'utf8');
  count++;
});
console.log(`Generated ${count} blueberry state blog pages.`);

module.exports = { STATES };
