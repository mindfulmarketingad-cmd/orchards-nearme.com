#!/usr/bin/env node
/*
 * One-time data fetcher for Orchards Near Me.
 *
 * Pulls basic listing data (no photos) for "orchards", "farms" and
 * "garden centers" across all 50 US states from the Google Places API
 * and writes the result to data/listings.json.
 *
 * This is intentionally a BUILD-TIME script. The website itself reads the
 * generated JSON file and never calls the Google API at runtime, so the
 * data is fetched once and not on every page load.
 *
 * Usage:  GOOGLE_PLACES_API_KEY=xxx node scripts/fetch-data.js
 */

const fs = require('fs');
const path = require('path');

const API_KEY =
  process.env.GOOGLE_PLACES_API_KEY ||
  'AIzaSyD1IVMZyzQic5lLyZR9bQuARP9n4kJtLbg';

const ENDPOINT = 'https://places.googleapis.com/v1/places:searchText';

// category label -> search term used against the Places API
const CATEGORIES = {
  Orchard: 'apple and cherry orchards in',
  Farm: 'pick your own farms in',
  'Garden Center': 'garden centers in',
};

const STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
];

const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.addressComponents',
  'places.location',
  'places.rating',
  'places.userRatingCount',
  'places.primaryType',
  'places.types',
  'places.reviews',
  'places.websiteUri',
].join(',');

// Remove emojis and other pictographic symbols (requirement: no emojis).
function stripEmoji(str) {
  if (!str) return '';
  return str
    .replace(
      /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{1F1E6}-\u{1F1FF}\u{200D}\u{2300}-\u{23FF}]/gu,
      ''
    )
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\s+\n/g, '\n')
    .trim();
}

function getComponent(components, type) {
  if (!components) return null;
  return components.find((c) => (c.types || []).includes(type)) || null;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function searchText(query) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify({ textQuery: query, maxResultCount: 20 }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Places API ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

function normalize(place, category) {
  const comps = place.addressComponents || [];
  const city =
    getComponent(comps, 'locality') ||
    getComponent(comps, 'postal_town') ||
    getComponent(comps, 'administrative_area_level_3') ||
    getComponent(comps, 'administrative_area_level_2');
  const state = getComponent(comps, 'administrative_area_level_1');
  const postal = getComponent(comps, 'postal_code');

  // pick the highest-rated short-ish review, fall back to first
  let quotedReview = '';
  let reviewAuthor = '';
  if (Array.isArray(place.reviews) && place.reviews.length) {
    const sorted = [...place.reviews].sort(
      (a, b) => (b.rating || 0) - (a.rating || 0)
    );
    for (const r of sorted) {
      const text = stripEmoji(r.text && r.text.text ? r.text.text : '');
      if (text && text.length > 30) {
        quotedReview = text.length > 280 ? text.slice(0, 277).trim() + '...' : text;
        reviewAuthor = stripEmoji(
          (r.authorAttribution && r.authorAttribution.displayName) || ''
        );
        break;
      }
    }
  }

  return {
    id: place.id,
    name: stripEmoji(place.displayName ? place.displayName.text : ''),
    category,
    address: place.formattedAddress || '',
    city: city ? city.longText : '',
    state: state ? state.longText : '',
    stateCode: state ? state.shortText : '',
    zip: postal ? postal.longText : '',
    lat: place.location ? place.location.latitude : null,
    lng: place.location ? place.location.longitude : null,
    rating: place.rating || null,
    reviewCount: place.userRatingCount || 0,
    website: place.websiteUri || '',
    review: quotedReview,
    reviewAuthor,
  };
}

async function main() {
  const byId = new Map();
  let requests = 0;

  for (const state of STATES) {
    for (const [category, term] of Object.entries(CATEGORIES)) {
      const query = `${term} ${state}`;
      try {
        const data = await searchText(query);
        requests++;
        const places = data.places || [];
        for (const place of places) {
          if (!place.id || place.lat === null) {
            // keep going; normalize handles missing fields
          }
          const item = normalize(place, category);
          if (!item.lat || !item.lng || !item.name) continue;
          // Prefer the first category we saw a place under, but keep the
          // record with the most data (reviews/rating).
          const existing = byId.get(item.id);
          if (!existing) {
            byId.set(item.id, item);
          } else if (!existing.review && item.review) {
            byId.set(item.id, { ...item, category: existing.category });
          }
        }
        process.stdout.write(
          `  ${state} / ${category}: ${places.length} results (total ${byId.size})\n`
        );
      } catch (err) {
        process.stdout.write(`  ! ${state} / ${category}: ${err.message}\n`);
      }
      await sleep(120);
    }
  }

  const listings = Array.from(byId.values()).sort((a, b) => {
    if (a.state === b.state) return a.name.localeCompare(b.name);
    return a.state.localeCompare(b.state);
  });

  const output = {
    generatedAt: new Date().toISOString(),
    count: listings.length,
    requests,
    listings,
  };

  const outPath = path.join(__dirname, '..', 'data', 'listings.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  process.stdout.write(
    `\nWrote ${listings.length} listings to ${outPath} (${requests} API requests)\n`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
