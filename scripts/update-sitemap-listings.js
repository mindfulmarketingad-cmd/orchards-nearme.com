#!/usr/bin/env node
'use strict';

/*
 * Rewrites the individual-listing entries in sitemap.xml:
 *  - removes any old single-listing <url> entries (the original 10-page batch)
 *  - appends one entry per slug in data/all-listing-slugs.json
 */

const fs = require('fs');
const path = require('path');

const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
const oldSlugsPath = path.join(__dirname, '..', 'data', 'featured-listing-slugs.json');
const allSlugsPath = path.join(__dirname, '..', 'data', 'all-listing-slugs.json');

let sitemap = fs.readFileSync(sitemapPath, 'utf8');

if (fs.existsSync(oldSlugsPath)) {
  const oldSlugs = JSON.parse(fs.readFileSync(oldSlugsPath, 'utf8'));
  oldSlugs.forEach((slug) => {
    const re = new RegExp(
      `  <url><loc>https://orchards-nearme\\.com/find/${slug}</loc>.*?</url>\\n`,
      'g'
    );
    sitemap = sitemap.replace(re, '');
  });
}

const finalSlugs = JSON.parse(fs.readFileSync(allSlugsPath, 'utf8'));
const slugList = Array.from(new Set(Object.values(finalSlugs))).sort();

const lines = slugList.map(
  (slug) =>
    `  <url><loc>https://orchards-nearme.com/find/${slug}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`
);

// Add /listings hub page if not already present
const listingsUrlLine = `  <url><loc>https://orchards-nearme.com/listings</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
if (!sitemap.includes('orchards-nearme.com/listings')) {
  lines.push(listingsUrlLine);
}

const addition = lines.join('\n') + '\n';

if (!sitemap.trim().endsWith('</urlset>')) {
  throw new Error('sitemap.xml does not end with </urlset> as expected');
}
sitemap = sitemap.replace('</urlset>', addition + '</urlset>');

fs.writeFileSync(sitemapPath, sitemap, 'utf8');
console.log(`Added ${slugList.length} listing URLs to sitemap.xml.`);
