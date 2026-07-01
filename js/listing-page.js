/* Orchards Near Me - single listing detail page
 * Renders one Leaflet marker at the listing's coordinates. No listings.json
 * fetch, no clustering — this page shows exactly one business. */

(function () {
  'use strict';

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

  var mapEl = document.getElementById('map');
  if (mapEl && window.L) {
    var lat = parseFloat(mapEl.getAttribute('data-lat'));
    var lng = parseFloat(mapEl.getAttribute('data-lng'));
    var name = mapEl.getAttribute('data-name') || '';
    var address = mapEl.getAttribute('data-address') || '';
    var category = mapEl.getAttribute('data-category') || 'Farm';

    var map = L.map('map', { scrollWheelZoom: true }).setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([lat, lng], { icon: getMarkerIcon(category) })
      .addTo(map)
      .bindPopup('<strong>' + name + '</strong><br>' + address)
      .openPopup();
  }

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- ZIP distance check ----------
  var distanceForm = document.getElementById('listingDistanceForm');
  if (distanceForm && mapEl) {
    var destLat = parseFloat(mapEl.getAttribute('data-lat'));
    var destLng = parseFloat(mapEl.getAttribute('data-lng'));

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

    distanceForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = distanceForm.querySelector('.card-distance-input');
      var result = distanceForm.querySelector('.card-distance-result');
      var zip = (input.value || '').trim();

      if (!/^\d{5}$/.test(zip)) {
        result.textContent = 'Please enter a valid 5-digit US ZIP code.';
        result.classList.add('card-distance-error');
        return;
      }

      result.textContent = 'Checking…';
      result.classList.remove('card-distance-error');

      fetch('https://api.zippopotam.us/us/' + zip)
        .then(function (r) {
          if (!r.ok) throw new Error('not found');
          return r.json();
        })
        .then(function (data) {
          var place = data.places && data.places[0];
          if (!place) throw new Error('not found');
          var origin = { lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) };
          var miles = distanceMiles(origin, { lat: destLat, lng: destLng });
          result.classList.remove('card-distance-error');
          result.textContent = miles.toFixed(miles < 10 ? 1 : 0) + ' miles from ' + zip;
        })
        .catch(function () {
          result.classList.add('card-distance-error');
          result.textContent = 'We could not find that ZIP code. Please double-check and try again.';
        });
    });
  }

  // ---------- Mobile map/details toggle ----------
  var viewToggle = document.getElementById('viewToggle');
  var resultsCol = document.querySelector('.results-col');
  var mapCol = document.querySelector('.map-col');

  function switchView(view) {
    if (window.innerWidth > 768) return;
    var mapBtn = document.querySelector('[data-view="map"]');
    var listBtn = document.querySelector('[data-view="list"]');
    if (view === 'map') {
      mapCol.classList.remove('hidden');
      resultsCol.classList.add('hidden');
      if (mapBtn) mapBtn.classList.add('active');
      if (listBtn) listBtn.classList.remove('active');
      setTimeout(function () { if (map) map.invalidateSize(); }, 100);
    } else {
      mapCol.classList.add('hidden');
      resultsCol.classList.remove('hidden');
      if (mapBtn) mapBtn.classList.remove('active');
      if (listBtn) listBtn.classList.add('active');
    }
  }

  function initView() {
    if (!resultsCol || !mapCol) return;
    var mapBtn = document.querySelector('[data-view="map"]');
    var listBtn = document.querySelector('[data-view="list"]');
    if (window.innerWidth <= 768) {
      mapCol.classList.add('hidden');
      resultsCol.classList.remove('hidden');
      if (mapBtn) mapBtn.classList.remove('active');
      if (listBtn) listBtn.classList.add('active');
    } else {
      mapCol.classList.remove('hidden');
      resultsCol.classList.remove('hidden');
      if (mapBtn) mapBtn.classList.add('active');
      if (listBtn) listBtn.classList.remove('active');
    }
  }

  if (viewToggle) {
    viewToggle.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-view]');
      if (!btn) return;
      switchView(btn.getAttribute('data-view'));
    });
  }

  initView();
  window.addEventListener('resize', initView);

  // ---------- Highlight today's row in the hours table ----------
  var hoursTable = document.querySelector('.listing-hours-table');
  if (hoursTable) {
    var rows = hoursTable.querySelectorAll('tr');
    var todayIndex = (new Date().getDay() + 6) % 7; // Mon=0 ... Sun=6, matches row order
    if (rows[todayIndex]) rows[todayIndex].classList.add('is-today');
  }
})();
