'use strict';

// Shared template + helpers for generating a "[Fruit] Picking Season [State]"
// blog series. Each per-fruit generator script builds a `states` array and a
// small config object, then calls generateFruitBlog(config) to write every
// post. Keeps the ~400-line HTML template in one place instead of duplicated
// per fruit.

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'blog');
const SITE_URL = 'https://orchards-nearme.com';
const PUB_DATE = '2025-07-01';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-');
}

function lowerFirst(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function pluralize(word) {
  if (/[^aeiou]y$/i.test(word)) {
    return word.slice(0, -1) + 'ies';
  }
  return word + 's';
}

function parsePeakRange(peakText) {
  const matches = [];
  MONTH_NAMES.forEach((m, i) => {
    const re = new RegExp('\\b' + m + '\\b', 'i');
    const m2 = re.exec(peakText);
    if (m2) matches.push({ index: i, pos: m2.index });
  });
  if (!matches.length) return { start: null, end: null, wraps: false };
  matches.sort((a, b) => a.pos - b.pos);
  const start = matches[0].index;
  const end = matches[matches.length - 1].index;
  return { start, end, wraps: end < start };
}

function renderSeasonChart(fruitLabel, chartMonths, state) {
  if (state.noSeason) {
    return `<div class="season-chart-note">
            <p>${state.name} has <strong>no meaningful commercial ${fruitLabel.toLowerCase()} season</strong> — ${state.noSeasonReason}</p>
          </div>`;
  }
  const range = parsePeakRange(state.peak);
  const headerCells = chartMonths.map(m => `<th scope="col">${m.slice(0, 3)}</th>`).join('');
  const bodyCells = chartMonths.map(label => {
    const monthIndex = MONTH_NAMES.indexOf(label);
    const isPeak = range.start !== null && (range.wraps
      ? (monthIndex >= range.start || monthIndex <= range.end)
      : (monthIndex >= range.start && monthIndex <= range.end));
    return `<td class="season-chart-cell${isPeak ? ' is-peak' : ''}">${isPeak ? 'Peak' : '—'}</td>`;
  }).join('');
  return `<div class="season-chart-wrap">
            <table class="season-chart">
              <caption class="sr-only">${fruitLabel} picking season chart for ${state.name}</caption>
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
  const n = Math.min(count, list.length - 1);
  for (let i = 1; i <= n; i++) {
    related.push(list[(index + i) % list.length]);
  }
  return related;
}

function buildDefaultFaqs(fruitLabel, findSlug, state) {
  const { name, capital, whereText, varieties, peak, noSeason, noSeasonReason } = state;
  const fruitLower = fruitLabel.toLowerCase();
  if (noSeason) {
    return [
      {
        q: `Is there ${fruitLower} picking season in ${name}?`,
        a: `No — ${name} has no meaningful commercial ${fruitLower} season, since ${noSeasonReason}`,
      },
      {
        q: `Where's the closest place to go ${fruitLower} picking to ${name}?`,
        a: `Check neighboring states with established ${fruitLower} industries, or browse our full <a href="/find/${findSlug}-orchards-near-me">${fruitLabel} Picking Near Me</a> directory to find the nearest active farm.`,
      },
      {
        q: `Can I grow ${pluralize(fruitLower)} at home in ${name}?`,
        a: `It's possible in some spots with the right site selection and extra care, but it takes real effort given the region's natural growing conditions.`,
      },
      {
        q: `What fruit can I pick near ${capital}, ${name} instead?`,
        a: `Check our <a href="/find">full directory</a> for apple, cherry, berry, and peach picking options that may be better suited to the local climate.`,
      },
    ];
  }
  return [
    {
      q: `When is ${fruitLower} picking season in ${name}?`,
      a: `${fruitLabel} picking season in ${name} runs ${lowerFirst(peak)}`,
    },
    {
      q: `Where can I go ${fruitLower} picking near ${capital}, ${name}?`,
      a: whereText,
    },
    {
      q: `What ${fruitLower} varieties can I pick in ${name}?`,
      a: `${name} orchards and farms commonly grow ${varieties}.`,
    },
    {
      q: `How much does ${fruitLower} picking cost in ${name}?`,
      a: `Most farms charge by the pound for what you pick, with some adding a small admission fee for other activities. Exact pricing varies by farm, so check the listing or call ahead.`,
    },
  ];
}

function generatePage(config, state, index, allStates) {
  const { fruitLabel, fruitSlug, findSlug, chartMonths, images, moreGuides } = config;
  const fruitLower = fruitLabel.toLowerCase();
  const { slug, name, capital, capitalSlug, whereText, varieties, tip, intro, noSeason, noSeasonReason } = state;
  const title = `${fruitLabel} Picking Season ${name}`;
  const desc = `${intro} Find pick-your-own ${fruitLower} farms near ${capital}, ${name} on an interactive map.`;
  const canonical = `${SITE_URL}/blog/${fruitSlug}-picking-season-${slug}`;
  const findUrlPrefix = config.findUrlPrefix || `${findSlug}-orchards-near-`;
  const findNearMeUrl = config.findNearMeUrl || `/find/${findSlug}-orchards-near-me`;
  const findLink = `/find/${findUrlPrefix}${capitalSlug}-${slug}`;
  const image = images[index % images.length];
  const imageUrl = `${SITE_URL}/images/blog/${image.file}`;
  const buildFaqs = config.buildFaqs || buildDefaultFaqs;
  const faqs = buildFaqs(fruitLabel, findSlug, state);
  const relatedStates = getRelatedStates(index, allStates);

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": desc,
    "image": imageUrl,
    "url": canonical,
    "datePublished": PUB_DATE,
    "dateModified": PUB_DATE,
    "author": { "@type": "Organization", "name": "Orchards Near Me", "url": SITE_URL },
    "publisher": { "@type": "Organization", "name": "Orchards Near Me", "url": SITE_URL },
    "mainEntityOfPage": { "@type": "WebPage", "@id": canonical },
    "keywords": `${fruitLower} picking season ${name}, ${fruitLower} picking ${name}, pick your own ${pluralize(fruitLower)} ${name}, ${fruitLower} farms ${name}, best time to pick ${pluralize(fruitLower)} ${name}`,
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
    `          <li><a href="/blog/${fruitSlug}-picking-season-${s.slug}">${fruitLabel} Picking Season ${s.name}</a></li>`
  ).join('\n');

  const hasFindCategory = config.hasFindCategory !== false;

  const wherePara = !hasFindCategory
    ? `<p>${whereText}</p>`
    : noSeason
    ? `<p>${whereText}</p>`
    : `<p>${whereText}</p>
          <p>Use the map on our <a href="${findLink}">${fruitLower} picking near ${capital}, ${name}</a> page to find specific farms by ZIP code and read visitor reviews before you go.</p>`;

  const findPara = !hasFindCategory
    ? `<p>${fruitLabel} orchards aren't yet their own category on our map, but you can browse <a href="/find">our full directory</a> of orchards, farms, and garden centers near ${capital} to find related pick-your-own destinations, or check the grower's own website for picking hours and directions.</p>`
    : noSeason
    ? `<p>Since ${name} doesn't have a meaningful ${fruitLower} season, browse the full <a href="/find/${findSlug}-orchards-near-me">${fruitLabel} Picking Near Me</a> directory to find the closest active farm in a neighboring state, or explore <a href="/find">other pick-your-own categories</a> better suited to the local climate.</p>`
    : `<p>Our interactive map pulls from farms across the state. <a href="${findLink}">Search ${fruitLower} picking near ${capital}</a> to see what is closest to you, or browse the full <a href="${findNearMeUrl}">${fruitLabel} Picking Near Me</a> directory for the whole country.</p>`;

  const varietiesPara = noSeason
    ? `<p>${name} doesn't support commercial ${fruitLower} growing — ${noSeasonReason}</p>`
    : `<p>${name} orchards and farms commonly grow ${varieties}. Availability varies by farm and time of season, so ask the farm staff which rows are currently at peak — that guidance is worth more than any printed list.</p>`;

  const moreGuidesHtml = moreGuides.map(g => `          <li><a href="${g.href}">${g.label}</a></li>`).join('\n');

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
  <title>${title}</title>
  <meta name="description" content="${desc.replace(/"/g, '&quot;')}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
  <meta property="og:description" content="${desc.replace(/"/g, '&quot;')}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${imageUrl}" />
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
        <span aria-current="page">${fruitLabel} Picking Season ${name}</span>
      </nav>

      <article class="blog-post">
        <header class="blog-post-header">
          <h1>${fruitLabel} Picking Season ${name}</h1>
          <p class="blog-post-meta"><time datetime="${PUB_DATE}">July 1, 2025</time> &middot; Orchards Near Me</p>
          <img class="blog-post-featured-image" src="/images/blog/${image.file}" alt="${image.alt}" loading="lazy" width="1200" height="675" />
        </header>

        <div class="blog-post-body">
          <p class="lead">${intro}</p>

          <h2>When Is ${fruitLabel} Picking Season in ${name}?</h2>
          ${renderSeasonChart(fruitLabel, chartMonths, state)}

          <h2>Where to Pick ${pluralize(fruitLabel)} in ${name}</h2>
          ${wherePara}

          <h2>Best ${fruitLabel} Varieties in ${name}</h2>
          ${varietiesPara}

          <h2>Tips for ${fruitLabel} Picking in ${name}</h2>
          <p>${tip}</p>
          <p>General tips that apply everywhere: bring your own containers or use the farm's, wear clothes you don't mind staining, dress in layers since mornings can start cool, and bring cash — many smaller farms are not set up for card payments at the stand.</p>

          <h2>Find ${fruitLabel} Farms Near You in ${name}</h2>
          ${findPara}

          <h2>Frequently Asked Questions About ${fruitLabel} Picking in ${name}</h2>
          <div class="faq-list">
${faqHtml}
          </div>
        </div>
      </article>

      <section class="related-links seo-content" style="padding-top: 0;">
        <h2>${fruitLabel} Picking Season in Other States</h2>
        <ul class="related-links-list">
${relatedStatesHtml}
        </ul>
      </section>

      <section class="related-links seo-content" style="padding-top: 0;">
        <h2>More Picking Guides</h2>
        <ul class="related-links-list">
${moreGuidesHtml}
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
}

function generateFruitBlog(config) {
  const { fruitSlug, states } = config;
  let count = 0;
  states.forEach((state, index) => {
    const html = generatePage(config, state, index, states);
    const outPath = path.join(OUT_DIR, `${fruitSlug}-picking-season-${state.slug}.html`);
    fs.writeFileSync(outPath, html, 'utf8');
    count++;
  });
  console.log(`Generated ${count} ${fruitSlug} state blog pages.`);
  return states;
}

module.exports = {
  slugify,
  lowerFirst,
  pluralize,
  parsePeakRange,
  renderSeasonChart,
  getRelatedStates,
  buildDefaultFaqs,
  generateFruitBlog,
  MONTH_NAMES,
};
