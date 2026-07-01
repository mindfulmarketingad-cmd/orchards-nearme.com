#!/usr/bin/env node
'use strict';

/*
 * Fetches Place Details (hours, phone, up to 5 reviews) for every listing
 * in data/listings.json, for the individual business detail pages under
 * /find/[business-name]. NEVER requests photo fields.
 *
 * Resumable: writes data/listing-details.json incrementally and skips any
 * place ID it already has, so a killed/restarted run picks up where it
 * left off.
 *
 * Usage: GOOGLE_PLACES_API_KEY=xxx node scripts/fetch-listing-details.js
 */

const fs = require('fs');
const path = require('path');

const API_KEY =
  process.env.GOOGLE_PLACES_API_KEY ||
  'AIzaSyD1IVMZyzQic5lLyZR9bQuARP9n4kJtLbg';

const FIELD_MASK = [
  'id',
  'displayName',
  'formattedAddress',
  'addressComponents',
  'location',
  'rating',
  'userRatingCount',
  'primaryType',
  'types',
  'reviews',
  'websiteUri',
  'regularOpeningHours',
  'businessStatus',
  'internationalPhoneNumber',
  'nationalPhoneNumber',
].join(',');

const LISTINGS_PATH = path.join(__dirname, '..', 'data', 'listings.json');
const OUT_PATH = path.join(__dirname, '..', 'data', 'listing-details.json');
const SAVE_EVERY = 25;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadExisting() {
  if (!fs.existsSync(OUT_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'));
  } catch (e) {
    console.error('Could not parse existing output, starting fresh:', e.message);
    return {};
  }
}

function save(byId) {
  fs.writeFileSync(OUT_PATH, JSON.stringify(byId), 'utf8');
}

async function fetchDetails(id) {
  const url = `https://places.googleapis.com/v1/places/${id}`;
  const res = await fetch(url, {
    headers: {
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': FIELD_MASK,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

async function main() {
  const data = JSON.parse(fs.readFileSync(LISTINGS_PATH, 'utf8'));
  const listings = data.listings || [];
  const byId = loadExisting();

  let fetched = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < listings.length; i++) {
    const item = listings[i];
    if (byId[item.id]) {
      skipped++;
      continue;
    }
    try {
      const details = await fetchDetails(item.id);
      byId[item.id] = details;
      fetched++;
    } catch (err) {
      byId[item.id] = { error: true, message: err.message, name: item.name };
      failed++;
    }

    if ((fetched + failed) % SAVE_EVERY === 0) {
      save(byId);
      process.stdout.write(
        `  [${i + 1}/${listings.length}] fetched=${fetched} failed=${failed} skipped=${skipped}\n`
      );
    }

    await sleep(120);
  }

  save(byId);
  process.stdout.write(
    `\nDone. fetched=${fetched} failed=${failed} skipped=${skipped} total=${Object.keys(byId).length}\n`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
