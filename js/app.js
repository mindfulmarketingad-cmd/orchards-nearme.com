/* Orchards Near Me - homepage map + listings
 * Reads pre-fetched data from /data/listings.json (fetched once at build time;
 * never calls the Google API at runtime). */

(function () {
  'use strict';

  var PAGE_SIZE = 24;
  var CLAIM_LISTING_URL = '/claim.html';

  // Fruit icons (tiny SVGs for markers)
  var iconSvgs = {
    Orchard: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32"%3E%3Ccircle cx="12" cy="10" r="8" fill="%23e23b3b"/%3E%3Cpath d="M12 18 L12 28" stroke="%238b6f47" stroke-width="2"/%3E%3C/svg%3E',
    Farm: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32"%3E%3Ccircle cx="12" cy="10" r="8" fill="%232e8b3d"/%3E%3Cpath d="M12 18 L12 28" stroke="%238b6f47" stroke-width="2"/%3E%3C/svg%3E',
    'Garden Center': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32"%3E%3Ccircle cx="12" cy="10" r="8" fill="%236b4f2a"/%3E%3Cpath d="M12 18 L12 28" stroke="%238b6f47" stroke-width="2"/%3E%3C/svg%3E'
  };

  function getMarkerIcon(category) {
    var svg = iconSvgs[category] || iconSvgs.Farm;
    return L.icon({
      iconUrl: svg,
      iconSize: [24, 32],
      iconAnchor: [12, 32],
      popupAnchor: [0, -32]
    });
  }

  var state = {
    all: [],
    filtered: [],
    category: 'all',
    keyword: null,   // 'apple-picking', 'cherry-picking', 'berry-picking', 'peach-picking', 'blueberry-picking', 'strawberry-patch', 'pumpkin-patch', 'u-pick-farms', 'hayrides', or null
    stateFilter: 'all',
    origin: null,
    rendered: 0,
  };

  // Single source of truth for keyword filters, reused by the filter logic
  // (matchesKeyword) and by the "fit chips" shown on cards/popups.
  var KEYWORD_DEFS = [
    {
      slug: 'apple-picking',
      label: 'Apple Picking',
      icon: '🍎',
      test: function (item, text) {
        if (item.category === 'Orchard') return true;
        return text.includes('apple') && (text.includes('pick') || text.includes('orchard') || text.includes('u-pick') || text.includes('u pick'));
      }
    },
    {
      slug: 'cherry-picking',
      label: 'Cherry Picking',
      icon: '🍒',
      test: function (item, text) { return text.includes('cherry'); }
    },
    {
      slug: 'berry-picking',
      label: 'Berry Picking',
      icon: '🍓',
      test: function (item, text) {
        return text.includes('berry') || text.includes('berries') || text.includes('strawberr') || text.includes('blueberr') || text.includes('raspberr') || text.includes('blackberr');
      }
    },
    {
      slug: 'peach-picking',
      label: 'Peach Picking',
      icon: '🍑',
      test: function (item, text) { return text.includes('peach'); }
    },
    {
      slug: 'blueberry-picking',
      label: 'Blueberry Picking',
      icon: '🫐',
      test: function (item, text) { return text.includes('blueberr'); }
    },
    {
      slug: 'strawberry-patch',
      label: 'Strawberry Patch',
      icon: '🍓',
      test: function (item, text) { return text.includes('strawberr'); }
    },
    {
      slug: 'pumpkin-patch',
      label: 'Pumpkin Patch',
      icon: '🎃',
      test: function (item, text) { return text.includes('pumpkin'); }
    },
    {
      slug: 'u-pick-farms',
      label: 'U-Pick Farms',
      icon: '🧺',
      test: function (item, text) { return item.category === 'Farm' || item.category === 'Orchard'; }
    },
    {
      slug: 'hayrides',
      label: 'Hayrides',
      icon: '🚜',
      test: function (item, text) { return text.includes('hayride') || text.includes('hay ride'); }
    }
  ];

  function findKeywordDef(slug) {
    for (var i = 0; i < KEYWORD_DEFS.length; i++) {
      if (KEYWORD_DEFS[i].slug === slug) return KEYWORD_DEFS[i];
    }
    return null;
  }

  function matchesKeyword(item) {
    var def = findKeywordDef(state.keyword);
    if (!def) return true;
    var text = (item.name + ' ' + (item.review || '')).toLowerCase();
    return def.test(item, text);
  }

  function getFitChips(item) {
    var text = (item.name + ' ' + (item.review || '')).toLowerCase();
    var matches = [];
    for (var i = 0; i < KEYWORD_DEFS.length; i++) {
      if (KEYWORD_DEFS[i].test(item, text)) matches.push(KEYWORD_DEFS[i]);
    }
    return matches;
  }

  function fitChipsHtml(item) {
    var chips = getFitChips(item);
    if (!chips.length) return '';
    var html = '<div class="fit-chips">';
    for (var i = 0; i < chips.length; i++) {
      var c = chips[i];
      html += '<span class="fit-chip fit-chip--' + c.slug.replace('-picking', '') + '">' + c.icon + ' ' + escapeHtml(c.label) + '</span>';
    }
    html += '</div>';
    return html;
  }

  var map, markersLayer, originMarker, zipAreaCircle;
  var markersById = {};

  var el = {
    cards: document.getElementById('cards'),
    count: document.getElementById('resultsCount'),
    filters: document.getElementById('filters'),
    filtersToggle: document.getElementById('filtersToggle'),
    stateSelect: document.getElementById('stateSelect'),
    searchForm: document.getElementById('searchForm'),
    zipInput: document.getElementById('zipInput'),
    zipError: document.getElementById('zipError'),
    layersToggle: document.getElementById('layersToggle'),
  };

  function setZipError(msg) {
    if (!el.zipError) return;
    el.zipError.textContent = msg;
    el.zipError.hidden = !msg;
    if (msg) el.zipInput.setAttribute('aria-invalid', 'true');
    else el.zipInput.removeAttribute('aria-invalid');
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  // ---------- helpers ----------
  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function catClass(cat) {
    return cat === 'Garden Center' ? 'GardenCenter' : cat;
  }

  function stars(rating) {
    if (!rating) return '';
    var full = Math.round(rating);
    var s = '';
    for (var i = 0; i < 5; i++) s += i < full ? '★' : '☆';
    return s;
  }

  function distanceMiles(a, b) {
    var R = 3958.8;
    var dLat = ((b.lat - a.lat) * Math.PI) / 180;
    var dLng = ((b.lng - a.lng) * Math.PI) / 180;
    var lat1 = (a.lat * Math.PI) / 180;
    var lat2 = (b.lat * Math.PI) / 180;
    var h =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  }

  // ---------- map ----------
  var streetLayer, satelliteLayer;

  function initMap() {
    map = L.map('map', { scrollWheelZoom: false, zoomControl: false }).setView([39.5, -98.35], 4);
    L.control.zoom({ position: 'bottomleft' }).addTo(map);
    streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri',
    });
    markersLayer = L.layerGroup();
    map.addLayer(markersLayer);

    if (window.ResizeObserver) {
      new ResizeObserver(function () { map.invalidateSize(); }).observe(document.getElementById('map'));
    }
    setTimeout(function () { map.invalidateSize(); }, 200);
  }

  function initLayersToggle() {
    if (!el.layersToggle) return;
    var isSatellite = false;
    el.layersToggle.addEventListener('click', function () {
      isSatellite = !isSatellite;
      if (isSatellite) {
        map.removeLayer(streetLayer);
        map.addLayer(satelliteLayer);
        el.layersToggle.classList.add('active');
        el.layersToggle.setAttribute('aria-pressed', 'true');
        el.layersToggle.innerHTML = '<span aria-hidden="true">🗺️</span> Map';
      } else {
        map.removeLayer(satelliteLayer);
        map.addLayer(streetLayer);
        el.layersToggle.classList.remove('active');
        el.layersToggle.setAttribute('aria-pressed', 'false');
        el.layersToggle.innerHTML = '<span aria-hidden="true">🛰️</span> Satellite';
      }
    });
  }

  function popupHtml(item) {
    var meta = [item.category, [item.city, item.stateCode].filter(Boolean).join(', ')]
      .filter(Boolean)
      .join(' · ');
    var rating = item.rating
      ? '<p class="pop-meta">' + stars(item.rating) + ' ' + item.rating + ' (' + item.reviewCount + ' reviews)</p>'
      : '';
    var site = item.website
      ? '<a href="' + escapeHtml(item.website) + '" target="_blank" rel="noopener nofollow">Visit website</a>'
      : '';
    var claim = '<a class="card-claim" href="' + CLAIM_LISTING_URL + '">Own This Business?</a>';
    return (
      '<div class="map-popup">' +
      '<h4>' + escapeHtml(item.name) + '</h4>' +
      '<p class="pop-meta">' + escapeHtml(meta) + '</p>' +
      fitChipsHtml(item) +
      rating +
      '<p class="pop-meta">' + escapeHtml(item.address) + '</p>' +
      '<div class="pop-links">' + site + claim + '</div>' +
      '</div>'
    );
  }

  function rebuildMarkers() {
    markersLayer.clearLayers();
    markersById = {};
    state.filtered.forEach(function (item) {
      var m = L.marker([item.lat, item.lng], { icon: getMarkerIcon(item.category) });
      m.bindPopup(popupHtml(item));
      markersById[item.id] = m;
      markersLayer.addLayer(m);
    });
  }

  function fitMap() {
    if (state.origin) {
      var nearby = state.filtered.filter(function (i) {
        return i._dist != null && i._dist <= 50;
      }).slice(0, 25);
      if (nearby.length) {
        var pts = nearby.map(function (i) {
          return [i.lat, i.lng];
        });
        pts.push([state.origin.lat, state.origin.lng]);
        map.fitBounds(pts, { padding: [40, 40], maxZoom: 12 });
      } else {
        map.setView([state.origin.lat, state.origin.lng], 11);
      }
    } else if (state.stateFilter !== 'all' && state.filtered.length) {
      var b = state.filtered.map(function (i) {
        return [i.lat, i.lng];
      });
      map.fitBounds(b, { padding: [30, 30] });
    } else {
      map.setView([39.5, -98.35], 4);
    }
  }

  // ---------- listings ----------
  function applyFilters() {
    var list = state.all.filter(function (item) {
      if (state.keyword) {
        if (!matchesKeyword(item)) return false;
      } else if (state.category !== 'all') {
        if (item.category !== state.category) return false;
      }
      if (state.stateFilter !== 'all' && item.state !== state.stateFilter) return false;
      return true;
    });

    if (state.origin) {
      list.forEach(function (i) {
        i._dist = distanceMiles(state.origin, i);
      });
      list.sort(function (a, b) {
        return a._dist - b._dist;
      });
    } else {
      list.sort(function (a, b) {
        return (b.rating || 0) - (a.rating || 0) || (b.reviewCount || 0) - (a.reviewCount || 0);
      });
    }

    state.filtered = list;
    state.rendered = 0;
    el.cards.innerHTML = '';
    renderMore();
    rebuildMarkers();
    fitMap();
    updateCount();
  }

  function updateCount() {
    var n = state.filtered.length;
    var label = n === 1 ? '1 location' : n.toLocaleString() + ' locations';
    if (state.origin) label += ' · nearest first';
    el.count.textContent = label;
  }

  function cardHtml(item) {
    var meta = [item.city, item.stateCode].filter(Boolean).join(', ');
    var dist =
      item._dist != null ? ' · ' + item._dist.toFixed(item._dist < 10 ? 1 : 0) + ' mi away' : '';
    var ratingLine = item.rating
      ? '<span class="stars">' + stars(item.rating) + '</span> ' + item.rating + ' (' + item.reviewCount.toLocaleString() + ' reviews)'
      : 'No rating yet';
    var review = item.review
      ? '<blockquote class="card-review">“' + escapeHtml(item.review) + '”' +
        (item.reviewAuthor ? '<cite>' + escapeHtml(item.reviewAuthor) + '</cite>' : '') +
        '</blockquote>'
      : '';
    var directions =
      'https://www.google.com/maps/dir/?api=1&destination=' +
      encodeURIComponent(item.name + ' ' + item.address) +
      '&destination_place_id=' + encodeURIComponent(item.id) +
      '&travelmode=driving';
    var website = item.website
      ? '<a href="' + escapeHtml(item.website) + '" target="_blank" rel="noopener nofollow">Website</a>'
      : '';
    var claimListing =
      '<a class="card-claim" href="' + CLAIM_LISTING_URL + '">Own This Business?</a>';

    return (
      '<article class="card" data-id="' + escapeHtml(item.id) + '">' +
      '<div class="card-top">' +
      '<div><h3>' + escapeHtml(item.name) + '</h3>' +
      '<p class="card-meta">' + ratingLine + '</p></div>' +
      '<span class="badge ' + catClass(item.category) + '">' + escapeHtml(item.category) + '</span>' +
      '</div>' +
      fitChipsHtml(item) +
      '<p class="card-address">' + escapeHtml(meta) + dist + '<br>' + escapeHtml(item.address) + '</p>' +
      review +
      '<div class="card-links">' +
      '<a href="' + directions + '" target="_blank" rel="noopener nofollow">Get directions</a>' +
      website +
      claimListing +
      '</div>' +
      '</article>'
    );
  }

  function renderMore() {
    var slice = state.filtered.slice(state.rendered, state.rendered + PAGE_SIZE);
    if (state.rendered === 0 && slice.length === 0) {
      el.cards.innerHTML =
        '<div class="no-results">No locations match your search. Try a different ZIP code or filter.</div>';
    } else {
      el.cards.insertAdjacentHTML('beforeend', slice.map(cardHtml).join(''));
    }
    state.rendered += slice.length;
  }

  // ---------- ZIP search ----------
  function searchZip(zip) {
    zip = (zip || '').trim();
    if (!/^\d{5}$/.test(zip)) {
      setZipError('Please enter a valid 5-digit US ZIP code.');
      return;
    }
    setZipError('');
    fetch('https://api.zippopotam.us/us/' + zip)
      .then(function (r) {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then(function (data) {
        var place = data.places && data.places[0];
        if (!place) throw new Error('not found');
        setZipError('');
        state.origin = {
          lat: parseFloat(place.latitude),
          lng: parseFloat(place.longitude),
        };
        if (originMarker) map.removeLayer(originMarker);
        if (zipAreaCircle) map.removeLayer(zipAreaCircle);
        zipAreaCircle = L.circle([state.origin.lat, state.origin.lng], {
          radius: 8047, // ~5 miles, approximates a ZIP code's local area
          color: '#1a73e8',
          weight: 3,
          fillColor: '#1a73e8',
          fillOpacity: 0.08,
        }).addTo(map);
        originMarker = L.circleMarker([state.origin.lat, state.origin.lng], {
          radius: 9,
          color: '#e23b3b',
          fillColor: '#e23b3b',
          fillOpacity: 0.9,
          weight: 2,
        })
          .addTo(map)
          .bindPopup('Your ZIP: ' + zip);
        map.setView([state.origin.lat, state.origin.lng], 11);
        applyFilters();
      })
      .catch(function () {
        setZipError('We could not find that ZIP code. Please double-check and try again.');
      });
  }

  // ---------- filters dropdown ----------
  function closeFiltersDropdown() {
    if (!el.filtersToggle) return;
    el.filters.classList.remove('open');
    el.filters.classList.remove('filters--align-right');
    el.filtersToggle.setAttribute('aria-expanded', 'false');
  }

  function positionFiltersDropdown() {
    // Default left-aligned; flip to right-aligned if it would overflow the viewport.
    el.filters.classList.remove('filters--align-right');
    var rect = el.filters.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      el.filters.classList.add('filters--align-right');
    }
  }

  function toggleFiltersDropdown() {
    if (!el.filtersToggle) return;
    var willOpen = !el.filters.classList.contains('open');
    el.filters.classList.toggle('open', willOpen);
    el.filtersToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    if (willOpen) positionFiltersDropdown();
  }

  // ---------- events ----------
  function bindEvents() {
    if (el.filtersToggle) {
      el.filtersToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleFiltersDropdown();
      });
      document.addEventListener('click', function (e) {
        if (!el.filters.classList.contains('open')) return;
        if (e.target.closest('.filters-wrap')) return;
        closeFiltersDropdown();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeFiltersDropdown();
      });
    }

    el.filters.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-chip');
      if (!btn) return;
      Array.prototype.forEach.call(el.filters.children, function (c) {
        c.classList.remove('active');
      });
      btn.classList.add('active');
      var cat = btn.getAttribute('data-cat');
      if (findKeywordDef(cat)) {
        state.keyword = cat;
        state.category = 'all';
      } else {
        state.keyword = null;
        state.category = cat;
      }
      applyFilters();
      closeFiltersDropdown();
    });

    el.stateSelect.addEventListener('change', function () {
      state.stateFilter = el.stateSelect.value;
      state.origin = null;
      if (originMarker) {
        map.removeLayer(originMarker);
        originMarker = null;
      }
      if (zipAreaCircle) {
        map.removeLayer(zipAreaCircle);
        zipAreaCircle = null;
      }
      applyFilters();
    });

    el.searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      searchZip(el.zipInput.value);
    });

    // Infinite scroll — load next page as user nears the end of the horizontally scrolling card strip
    el.cards.addEventListener('scroll', function () {
      if (state.rendered >= state.filtered.length) return;
      var threshold = 300;
      if (el.cards.scrollLeft + el.cards.clientWidth >= el.cards.scrollWidth - threshold) {
        renderMore();
      }
    });

    el.cards.addEventListener('click', function (e) {
      var card = e.target.closest('.card');
      if (!card || e.target.tagName === 'A') return;
      var id = card.getAttribute('data-id');
      var marker = markersById[id];
      if (marker) {
        map.setView(marker.getLatLng(), Math.max(map.getZoom(), 13), { animate: true });
        marker.openPopup();
      }
    });
  }

  function populateStates() {
    var states = Array.from(
      new Set(
        state.all
          .map(function (i) {
            return i.state;
          })
          .filter(Boolean)
      )
    ).sort();
    states.forEach(function (s) {
      var opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      el.stateSelect.appendChild(opt);
    });
  }

  // ---------- init ----------

  var KEYWORD_LABELS = {
    'apple-picking': 'Apple Picking',
    'cherry-picking': 'Cherry Picking',
    'berry-picking': 'Berry Picking',
    'peach-picking': 'Peach Picking',
    'blueberry-picking': 'Blueberry Picking',
    'strawberry-patch': 'Strawberry Patch',
    'pumpkin-patch': 'Pumpkin Patch',
    'u-pick-farms': 'U-Pick Farms',
    'hayrides': 'Hayrides',
    'Orchard': 'Orchards',
    'Farm': 'Farms',
    'Garden Center': 'Garden Centers',
  };

  var KEYWORD_HREFS = {
    'apple-picking': '/find/apple-picking-orchards-near-me',
    'cherry-picking': '/find/cherry-picking-orchards-near-me',
    'berry-picking': '/find/berry-picking-orchards-near-me',
    'peach-picking': '/find/peach-picking-orchards-near-me',
    'blueberry-picking': '/find/blueberry-picking-orchards-near-me',
    'strawberry-patch': '/find/strawberry-patch-near-me',
    'pumpkin-patch': '/find/pumpkin-patch-near-me',
    'u-pick-farms': '/find/u-pick-farms-near-me',
    'hayrides': '/find/hayrides-near-me',
    'Orchard': '/find',
    'Farm': '/find',
    'Garden Center': '/find/garden-centers-near-me',
  };

  function injectBreadcrumb() {
    if (!el.filters) return;
    var defaultFilter = el.filters.getAttribute('data-default-filter');
    var defaultState = el.filters.getAttribute('data-default-state');
    if (!defaultFilter) return;

    var label = KEYWORD_LABELS[defaultFilter] || defaultFilter;
    var href = KEYWORD_HREFS[defaultFilter] || '/find';

    var h2 = document.querySelector('.find-strip-head h2') || document.querySelector('.results-head h2');
    var crumbText = h2 ? h2.textContent : null;

    var nav = document.createElement('nav');
    nav.className = 'breadcrumb breadcrumb--hero';
    nav.setAttribute('aria-label', 'Breadcrumb');

    var inner = '<a href="/">Home</a>' +
      '<span aria-hidden="true"> &rsaquo; </span>' +
      '<a href="/find">Find</a>' +
      '<span aria-hidden="true"> &rsaquo; </span>';

    if (defaultState) {
      inner += '<a href="' + escapeHtml(href) + '">' + escapeHtml(label) + '</a>' +
        '<span aria-hidden="true"> &rsaquo; </span>' +
        '<span aria-current="page">' + escapeHtml(crumbText || defaultState) + '</span>';
    } else {
      inner += '<span aria-current="page">' + escapeHtml(label) + '</span>';
    }

    nav.innerHTML = inner;

    var titlebar = document.querySelector('.find-titlebar .container');
    var hero = document.querySelector('.hero .container');
    if (titlebar) titlebar.appendChild(nav);
    else if (hero) hero.insertAdjacentElement('afterend', nav);
    else {
      var controls = document.getElementById('find');
      if (controls) controls.insertAdjacentElement('beforebegin', nav);
    }
  }

  function applyPageDefaultFilter() {
    var defaultFilter = el.filters.getAttribute('data-default-filter');
    if (defaultFilter) {
      var chip = el.filters.querySelector('[data-cat="' + defaultFilter + '"]');
      if (chip) {
        Array.prototype.forEach.call(el.filters.children, function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
      }
      if (findKeywordDef(defaultFilter)) {
        state.keyword = defaultFilter;
        state.category = 'all';
      } else {
        state.keyword = null;
        state.category = defaultFilter;
      }
    }
    var defaultState = el.filters.getAttribute('data-default-state');
    if (defaultState) {
      state.stateFilter = defaultState;
    }
  }

  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      var show = window.scrollY > 600;
      btn.classList.toggle('visible', show);
      btn.tabIndex = show ? 0 : -1;
    });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  injectBreadcrumb();
  initMap();
  initLayersToggle();
  bindEvents();
  applyPageDefaultFilter();
  initBackToTop();

  fetch('/data/listings.json')
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      state.all = (data.listings || []).filter(function (i) {
        return i.lat && i.lng;
      });
      populateStates();
      if (state.stateFilter !== 'all') {
        el.stateSelect.value = state.stateFilter;
      }
      applyFilters();
    })
    .catch(function () {
      el.count.textContent = 'Could not load listings.';
      el.cards.innerHTML =
        '<div class="no-results">Sorry, we could not load the listings right now. Please refresh the page.</div>';
    });
})();
