#!/usr/bin/env node
'use strict';

// One-off (idempotent) migration: assigns a unique URL slug to every listing
// in data/listings.json so each business can have its own /find/<slug> page.
// Re-running it is safe - existing slugs are recomputed the same way and
// collisions are resolved deterministically by listing order.

const fs = require('fs');
const path = require('path');

const listingsPath = path.join(__dirname, '..', 'data', 'listings.json');

function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function main() {
  const data = JSON.parse(fs.readFileSync(listingsPath, 'utf8'));
  const used = new Set();
  let collisions = 0;

  data.listings.forEach((item) => {
    const base = slugify(item.name) || 'listing';
    let slug = base;

    if (used.has(slug)) {
      collisions++;
      slug = slugify(base + '-' + item.city);
    }
    if (used.has(slug)) {
      slug = slugify(base + '-' + item.city + '-' + item.stateCode);
    }
    if (used.has(slug)) {
      slug = slugify(base + '-' + item.id).slice(0, 80);
    }

    used.add(slug);
    item.slug = slug;
  });

  fs.writeFileSync(listingsPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Assigned slugs to ${data.listings.length} listings (${collisions} name collisions resolved).`);
}

main();
