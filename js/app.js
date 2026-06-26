/* Orchards Near Me - homepage map + listings
 * Reads pre-fetched data from /data/listings.json (fetched once at build time;
 * never calls the Google API at runtime). */

(function () {
  'use strict';

  var PAGE_SIZE = 24;

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
    stateFilter: 'all',
    origin: null, // {lat, lng} when searching by ZIP
    rendered: 0,
  };

  var map, clusterGroup, originMarker;
  var markersById = {};

  var el = {
    cards: document.getElementById('cards'),
    count: document.getElementById('resultsCount'),
    filters: document.getElementById('filters'),
    stateSelect: document.getElementById('stateSelect'),
    searchForm: document.getElementById('searchForm'),
    zipInput: document.getElementById('zipInput'),
    resetBtn: document.getElementById('resetBtn'),
    viewToggle: document.getElementById('viewToggle'),
    resultsCol: document.querySelector('.results-col'),
    mapCol: document.querySelector('.map-col'),
  };

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
  function initMap() {
    map = L.map('map', { scrollWheelZoom: true }).setView([39.5, -98.35], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    clusterGroup = L.markerClusterGroup({ chunkedLoading: true, maxClusterRadius: 55 });
    map.addLayer(clusterGroup);
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
    return (
      '<div class="map-popup">' +
      '<h4>' + escapeHtml(item.name) + '</h4>' +
      '<p class="pop-meta">' + escapeHtml(meta) + '</p>' +
      rating +
      '<p class="pop-meta">' + escapeHtml(item.address) + '</p>' +
      site +
      '</div>'
    );
  }

  function rebuildMarkers() {
    clusterGroup.clearLayers();
    markersById = {};
    var markers = [];
    state.filtered.forEach(function (item) {
      var m = L.marker([item.lat, item.lng], { icon: getMarkerIcon(item.category) });
      m.bindPopup(popupHtml(item));
      markersById[item.id] = m;
      markers.push(m);
    });
    clusterGroup.addLayers(markers);
  }

  function fitMap() {
    if (state.origin) {
      var pts = state.filtered.slice(0, 25).map(function (i) {
        return [i.lat, i.lng];
      });
      pts.push([state.origin.lat, state.origin.lng]);
      if (pts.length > 1) map.fitBounds(pts, { padding: [40, 40], maxZoom: 11 });
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
      if (state.category !== 'all' && item.category !== state.category) return false;
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
      'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent(item.name + ' ' + item.address);
    var website = item.website
      ? '<a href="' + escapeHtml(item.website) + '" target="_blank" rel="noopener nofollow">Website</a>'
      : '';

    return (
      '<article class="card" data-id="' + escapeHtml(item.id) + '">' +
      '<div class="card-top">' +
      '<div><h3>' + escapeHtml(item.name) + '</h3>' +
      '<p class="card-meta">' + ratingLine + '</p></div>' +
      '<span class="badge ' + catClass(item.category) + '">' + escapeHtml(item.category) + '</span>' +
      '</div>' +
      '<p class="card-address">' + escapeHtml(meta) + dist + '<br>' + escapeHtml(item.address) + '</p>' +
      review +
      '<div class="card-links">' +
      '<a href="' + directions + '" target="_blank" rel="noopener nofollow">Get directions</a>' +
      website +
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
      alert('Please enter a valid 5-digit US ZIP code.');
      return;
    }
    fetch('https://api.zippopotam.us/us/' + zip)
      .then(function (r) {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then(function (data) {
        var place = data.places && data.places[0];
        if (!place) throw new Error('not found');
        state.origin = {
          lat: parseFloat(place.latitude),
          lng: parseFloat(place.longitude),
        };
        if (originMarker) map.removeLayer(originMarker);
        originMarker = L.circleMarker([state.origin.lat, state.origin.lng], {
          radius: 9,
          color: '#e23b3b',
          fillColor: '#e23b3b',
          fillOpacity: 0.9,
          weight: 2,
        })
          .addTo(map)
          .bindPopup('Your ZIP: ' + zip);
        applyFilters();
      })
      .catch(function () {
        alert('We could not find that ZIP code. Please double-check and try again.');
      });
  }

  // ---------- events ----------
  function bindEvents() {
    el.filters.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-chip');
      if (!btn) return;
      Array.prototype.forEach.call(el.filters.children, function (c) {
        c.classList.remove('active');
      });
      btn.classList.add('active');
      state.category = btn.getAttribute('data-cat');
      applyFilters();
    });

    el.stateSelect.addEventListener('change', function () {
      state.stateFilter = el.stateSelect.value;
      state.origin = null;
      if (originMarker) {
        map.removeLayer(originMarker);
        originMarker = null;
      }
      applyFilters();
    });

    el.searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      searchZip(el.zipInput.value);
    });

    el.resetBtn.addEventListener('click', function () {
      el.zipInput.value = '';
      state.origin = null;
      state.stateFilter = 'all';
      el.stateSelect.value = 'all';
      if (originMarker) {
        map.removeLayer(originMarker);
        originMarker = null;
      }
      applyFilters();
    });

    // Infinite scroll — load next page as user nears bottom of card list
    el.cards.addEventListener('scroll', function () {
      if (state.rendered >= state.filtered.length) return;
      var threshold = 200;
      if (el.cards.scrollTop + el.cards.clientHeight >= el.cards.scrollHeight - threshold) {
        renderMore();
      }
    });

    el.cards.addEventListener('click', function (e) {
      var card = e.target.closest('.card');
      if (!card || e.target.tagName === 'A') return;
      var id = card.getAttribute('data-id');
      var marker = markersById[id];
      if (marker) {
        map.scrollWheelZoom.enable();
        clusterGroup.zoomToShowLayer(marker, function () {
          marker.openPopup();
        });
        if (window.innerWidth <= 768) {
          switchView('map');
        } else if (window.innerWidth <= 900) {
          document.getElementById('map').scrollIntoView({ behavior: 'smooth' });
        }
      }
    });

    // Mobile view toggle
    if (el.viewToggle) {
      el.viewToggle.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-view]');
        if (!btn) return;
        switchView(btn.getAttribute('data-view'));
      });
    }
  }

  function switchView(view) {
    var isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    var mapBtn = document.querySelector('[data-view="map"]');
    var listBtn = document.querySelector('[data-view="list"]');

    if (view === 'map') {
      el.mapCol.classList.remove('hidden');
      el.resultsCol.classList.add('hidden');
      if (mapBtn) mapBtn.classList.add('active');
      if (listBtn) listBtn.classList.remove('active');
      setTimeout(function () { map.invalidateSize(); }, 100);
    } else {
      el.mapCol.classList.add('hidden');
      el.resultsCol.classList.remove('hidden');
      if (mapBtn) mapBtn.classList.remove('active');
      if (listBtn) listBtn.classList.add('active');
    }
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
  function initViewToggle() {
    var isMobile = window.innerWidth <= 768;
    if (isMobile) {
      el.mapCol.classList.add('hidden');
      el.resultsCol.classList.remove('hidden');
      var mapBtn = document.querySelector('[data-view="map"]');
      var listBtn = document.querySelector('[data-view="list"]');
      if (mapBtn) mapBtn.classList.remove('active');
      if (listBtn) listBtn.classList.add('active');
    }
  }

  initMap();
  bindEvents();
  initViewToggle();
  window.addEventListener('resize', initViewToggle);

  fetch('/data/listings.json')
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      state.all = (data.listings || []).filter(function (i) {
        return i.lat && i.lng;
      });
      populateStates();
      applyFilters();
    })
    .catch(function () {
      el.count.textContent = 'Could not load listings.';
      el.cards.innerHTML =
        '<div class="no-results">Sorry, we could not load the listings right now. Please refresh the page.</div>';
    });
})();
