# Orchards Near Me

A friendly, family-focused directory website that helps people **find orchards near me** —
apple and cherry picking locations, pick-your-own farms, and garden centers — across all
50 US states, shown on an interactive Leaflet map.

- **Domain:** orchards-nearme.com
- **Main keyword:** Orchards Near Me
- **Theme:** gardening, bubbly, fun, family (green / red / white)

## How it works

This is a plain **static site** (HTML + CSS + vanilla JS) with no build step required to run.

Listing data is fetched **once** at build time from the Google Places API and saved to
`data/listings.json`. The website reads that static JSON file — it never calls the Google
API at runtime, so there is no continuous loop of API pulls when visitors load the page.
Per requirements, **no photos** are pulled — only basic data (business name, address,
city, state, business type, rating, review count, and a single quoted review).

## Project structure

```
index.html        Homepage: hero + Leaflet map, ZIP search, filters, listing cards
about.html        About page
contact.html      Contact page
disclaimer.html   Disclaimer
privacy.html      Privacy Policy
terms.html        Terms of Use
sitemap.html      Human-readable sitemap
sitemap.xml       XML sitemap (/sitemap.xml)
robots.txt        Robots file pointing at the sitemap
css/style.css     Bubbly gardening theme
js/app.js         Map + listings logic (reads data/listings.json)
data/listings.json    Pre-fetched listing data (generated, no photos)
scripts/fetch-data.js  One-time Google Places fetch script
vercel.json       Static hosting config
```

## Refreshing the data (run only when you want to update listings)

```bash
GOOGLE_PLACES_API_KEY=your_key node scripts/fetch-data.js
```

This regenerates `data/listings.json`. It is intentionally a manual, one-time job — it is
not run on every page load.

## Local preview

```bash
npx serve .      # or: python3 -m http.server 8000
```

Then open http://localhost:8000

## Deployment

The site is static and can be deployed to any static host (e.g. Vercel). No server-side
runtime is needed.
