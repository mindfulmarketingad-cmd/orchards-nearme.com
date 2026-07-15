'use strict';

// Shared template for single-article fruit guides (not state-based), used by
// generate-storage-guides.js and generate-spoilage-guides.js.

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'blog');
const SITE_URL = 'https://orchards-nearme.com';
const PUB_DATE = '2025-07-01';

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-');
}

function chartHtml(fruitLabel, rows) {
  const body = rows.map(r => `                <tr><th scope="row">${r.method}</th><td>${r.life}</td><td>${r.how}</td></tr>`).join('\n');
  return `<div class="storage-chart-wrap">
            <table class="storage-chart">
              <caption class="sr-only">${fruitLabel} storage chart</caption>
              <thead>
                <tr><th scope="col">Storage Method</th><th scope="col">Shelf Life</th><th scope="col">How To</th></tr>
              </thead>
              <tbody>
${body}
              </tbody>
            </table>
          </div>`;
}

function spoilageChartHtml(fruitLabel, rows) {
  const body = rows.map(r => `                <tr><th scope="row">${r.sign}</th><td>${r.stillGood}</td><td>${r.toss}</td></tr>`).join('\n');
  return `<div class="storage-chart-wrap">
            <table class="storage-chart">
              <caption class="sr-only">Signs ${fruitLabel} has gone bad</caption>
              <thead>
                <tr><th scope="col">Sign</th><th scope="col">Still Fine</th><th scope="col">Time to Toss</th></tr>
              </thead>
              <tbody>
${body}
              </tbody>
            </table>
          </div>`;
}

function proTipHtml(text) {
  return `<div class="pro-tip"><p><span class="pro-tip-label">PRO TIP:</span>${text}</p></div>`;
}

function mythFactHtml(myth, fact) {
  return `<div class="myth-fact"><p class="myth">Myth: ${myth}</p><p class="fact">Fact: ${fact}</p></div>`;
}

function faqBlock(faqs) {
  return faqs.map(f => `          <details class="faq-item">
            <summary>${f.q}</summary>
            <div class="faq-answer">
              <p>${f.a}</p>
            </div>
          </details>`).join('\n');
}

function buildSchema({ title, desc, canonical, imageUrl, faqs }) {
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": desc,
    "image": imageUrl,
    "url": canonical,
    "datePublished": PUB_DATE,
    "dateModified": PUB_DATE,
    "author": { "@type": "Organization", "name": "Orchards Near Me", "url": SITE_URL },
    "publisher": { "@type": "Organization", "name": "Orchards Near Me", "url": SITE_URL },
    "mainEntityOfPage": { "@type": "WebPage", "@id": canonical },
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

  return { jsonLd, faqJsonLd };
}

function generateGuidePage(config) {
  const { title, slug, desc, image, sections, faqs, relatedGuides, moreGuides } = config;
  const canonical = `${SITE_URL}/blog/${slug}`;
  const imageUrl = `${SITE_URL}/images/blog/${image.file}`;
  const { jsonLd, faqJsonLd } = buildSchema({ title, desc, canonical, imageUrl, faqs });

  const sectionsHtml = sections.map(s => `          <h2>${s.h2}</h2>\n${s.html}`).join('\n\n');
  const faqHtml = faqBlock(faqs);
  const relatedHtml = relatedGuides.map(g => `          <li><a href="${g.href}">${g.label}</a></li>`).join('\n');
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
        <span aria-current="page">${title}</span>
      </nav>

      <article class="blog-post">
        <header class="blog-post-header">
          <h1>${title}</h1>
          <p class="blog-post-meta"><time datetime="${PUB_DATE}">July 1, 2025</time> &middot; Orchards Near Me</p>
          <img class="blog-post-featured-image" src="/images/blog/${image.file}" alt="${image.alt}" loading="lazy" width="1200" height="675" />
        </header>

        <div class="blog-post-body">
${sectionsHtml}

          <h2>Frequently Asked Questions</h2>
          <div class="faq-list">
${faqHtml}
          </div>
        </div>
      </article>

      <section class="related-links seo-content" style="padding-top: 0;">
        <h2>Related Guides</h2>
        <ul class="related-links-list">
${relatedHtml}
        </ul>
      </section>

      <section class="related-links seo-content" style="padding-top: 0;">
        <h2>More From Orchards Near Me</h2>
        <ul class="related-links-list">
${moreGuidesHtml}
          <li><a href="/blog">All Guides</a></li>
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

function generateGuideSeries(configs) {
  let count = 0;
  for (const config of configs) {
    const html = generateGuidePage(config);
    const outPath = path.join(OUT_DIR, `${config.slug}.html`);
    fs.writeFileSync(outPath, html, 'utf8');
    count++;
  }
  console.log(`Generated ${count} guide pages.`);
}

module.exports = {
  slugify,
  chartHtml,
  spoilageChartHtml,
  proTipHtml,
  mythFactHtml,
  generateGuidePage,
  generateGuideSeries,
};
