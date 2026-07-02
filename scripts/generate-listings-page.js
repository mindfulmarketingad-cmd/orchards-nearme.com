#!/usr/bin/env node
'use strict';

/*
 * Pre-renders the full <tbody> of listings/index.html directly from
 * data/listings.json so every one of the 2,427 individual listing pages has
 * a real, crawlable <a href> in static HTML -- not just a client-side
 * JS-rendered link. Without this, /listings only "links" to listings after
 * JavaScript runs, which leaves listing pages with no static inbound link
 * from anywhere reachable from the homepage (i.e. orphaned for link-graph
 * purposes even though a browser sees them fine).
 *
 * The existing client-side JS still re-renders this table on search/filter/
 * sort changes; this script only seeds the initial, no-JS-required content
 * between the LISTINGS_TABLE_START/END markers.
 */

const fs = require('fs');
const path = require('path');

const KEYWORD_DEFS = [
  { slug: 'apple-picking', label: 'Apple Picking', icon: '🍎', test: (item, text) => item.category === 'Orchard' || (text.includes('apple') && (text.includes('pick') || text.includes('orchard') || text.includes('u-pick'))) },
  { slug: 'cherry-picking', label: 'Cherry Picking', icon: '🍒', test: (item, text) => text.includes('cherry') },
  { slug: 'berry-picking', label: 'Berry Picking', icon: '🍓', test: (item, text) => text.includes('berry') || text.includes('berries') || text.includes('strawberr') || text.includes('blueberr') || text.includes('raspberr') || text.includes('blackberr') },
  { slug: 'peach-picking', label: 'Peach Picking', icon: '🍑', test: (item, text) => text.includes('peach') },
  { slug: 'blueberry-picking', label: 'Blueberry Picking', icon: '🫐', test: (item, text) => text.includes('blueberr') },
  { slug: 'strawberry-picking', label: 'Strawberry Picking', icon: '🍓', test: (item, text) => text.includes('strawberr') },
  { slug: 'pumpkin-patch', label: 'Pumpkin Patch', icon: '🎃', test: (item, text) => text.includes('pumpkin') },
];

function getFitChips(listing) {
  const text = (listing.name + ' ' + (listing.review || '')).toLowerCase();
  return KEYWORD_DEFS.filter((k) => k.test(listing, text));
}

function fitChipsHtml(listing) {
  const chips = getFitChips(listing);
  if (!chips.length) return '-';
  return chips.map((c) => `<span class="fit-chip fit-chip--${c.slug.replace('-picking', '')}">${c.icon} ${c.label}</span>`).join('');
}

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function main() {
  const dataDir = path.join(__dirname, '..', 'data');
  const listingsPath = path.join(__dirname, '..', 'listings', 'index.html');

  const data = JSON.parse(fs.readFileSync(path.join(dataDir, 'listings.json'), 'utf8'));
  const listings = data.listings || [];

  const rows = listings
    .map((listing) => {
      return `            <tr>
                <td><a href="/find/${escapeHtml(listing.slug)}" class="listings-link">${escapeHtml(listing.name)}</a></td>
                <td>${escapeHtml(listing.city)}</td>
                <td>${escapeHtml(listing.state)}</td>
                <td><span class="listings-category">${escapeHtml(listing.category)}</span></td>
                <td>${fitChipsHtml(listing)}</td>
                <td class="listings-rating">${listing.rating ? listing.rating.toFixed(1) : 'N/A'}</td>
              </tr>`;
    })
    .join('\n');

  const html = fs.readFileSync(listingsPath, 'utf8');
  const startMarker = '<!-- LISTINGS_TABLE_START -->';
  const endMarker = '<!-- LISTINGS_TABLE_END -->';
  const startIdx = html.indexOf(startMarker);
  const endIdx = html.indexOf(endMarker);
  if (startIdx === -1 || endIdx === -1) {
    throw new Error('LISTINGS_TABLE markers not found in listings/index.html');
  }

  const before = html.slice(0, startIdx + startMarker.length);
  const after = html.slice(endIdx);
  const newHtml = `${before}\n${rows}\n          ${after}`;

  fs.writeFileSync(listingsPath, newHtml, 'utf8');
  console.log(`Pre-rendered ${listings.length} static listing rows into listings/index.html`);
}

main();
