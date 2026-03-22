/* ============================================================
   TIDES — Tropical Escapes
   script.js — All page JavaScript
   Author: Tides Travel Co.

   Libraries used:
     1. AOS        — Animate On Scroll
     2. Glide.js   — Experience carousel
     3. Leaflet    — Interactive destination map
     4. Chart.js   — Bali climate chart
   ============================================================ */


/* ────────────────────────────────────────────────────────────
   BOOKING FORM — global function so onclick button can find it
──────────────────────────────────────────────────────────── */

function handleBooking() {
  var name  = document.getElementById('nameInput').value.trim();
  var email = document.getElementById('emailInput').value.trim();
  var dest  = document.getElementById('destSelect').value;
  var date  = document.getElementById('dateInput').value;
  var msg   = document.getElementById('formMsg');

  if (!name || !email || !dest || !date) {
    msg.className = 'err';
    msg.style.display = 'block';
    msg.textContent = 'Please fill in all fields before submitting.';
    return;
  }

  msg.className = 'ok';
  msg.style.display = 'block';
  msg.textContent = 'Thanks ' + name + '! Your ' + dest + ' itinerary is heading to ' + email + ' within 48 hours.';
}


/* ────────────────────────────────────────────────────────────
   Wait for ALL libraries to load before initialising them
──────────────────────────────────────────────────────────── */

window.addEventListener('load', function () {

  /* ── NAVIGATION ── */
  var navbar     = document.getElementById('navbar');
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 70) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  document.querySelectorAll('.mobile-link').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });


  /* ── STAT COUNTERS ── */
  var counters = document.querySelectorAll('[data-count]');
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = Number(el.dataset.count);
      var duration = 1600;
      var startTime = performance.now();
      function tick(now) {
        var elapsed  = now - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var ease     = 1 - Math.pow(1 - progress, 3);
        var suffix   = (el.dataset.count === '98') ? '%' : '';
        el.textContent = Math.floor(ease * target).toLocaleString() + suffix;
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(function (el) { counterObserver.observe(el); });


  /* ── LIBRARY 1: AOS — Animate On Scroll ── */
  AOS.init({
    duration: 750,
    easing: 'ease-out-cubic',
    once: true,
    offset: 50
  });


  /* ── LIBRARY 2: GLIDE.JS — Carousel ── */
  var glide = new Glide('#expGlide', {
    type: 'carousel',
    autoplay: 4200,
    animationDuration: 650,
    perView: 1,
    gap: 0
  });
  glide.mount();


  /* ── LIBRARY 3: LEAFLET — Interactive Map ── */
  var destinations = [
    { name: 'Bali',      emoji: '🇮🇩', lat: -8.3405,  lng: 115.0920,  info: 'Best Apr-Oct',  country: 'Indonesia' },
    { name: 'Maldives',  emoji: '🇲🇻', lat: 3.2028,   lng: 73.2207,   info: 'Best Nov-Apr',  country: 'Maldives'  },
    { name: 'Santorini', emoji: '🇬🇷', lat: 36.3932,  lng: 25.4615,   info: 'Best Mar-May',  country: 'Greece'    },
    { name: 'Kyoto',     emoji: '🇯🇵', lat: 35.0116,  lng: 135.7681,  info: 'Best Mar-May',  country: 'Japan'     },
    { name: 'Amalfi',    emoji: '🇮🇹', lat: 40.6340,  lng: 14.6027,   info: 'Best Jun-Sep',  country: 'Italy'     },
    { name: 'Patagonia', emoji: '🇦🇷', lat: -51.6230, lng: -69.2168,  info: 'Best Nov-Mar',  country: 'Argentina' }
  ];

  var map = L.map('travel-map', {
    center: [15, 60],
    zoom: 2,
    zoomControl: false,
    attributionControl: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  var mapItemsEl = document.getElementById('mapItems');

  destinations.forEach(function (dest) {
    var icon = L.divIcon({
      className: '',
      html: '<div style="font-size:1.4rem;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));cursor:pointer;">' + dest.emoji + '</div>',
      iconSize:   [24, 24],
      iconAnchor: [12, 12]
    });

    var marker = L.marker([dest.lat, dest.lng], { icon: icon })
      .addTo(map)
      .bindPopup('<b>' + dest.emoji + ' ' + dest.name + '</b><br><small>' + dest.country + ' - ' + dest.info + '</small>');

    var item = document.createElement('div');
    item.className = 'map-item';
    item.innerHTML =
      '<div class="map-flag">' + dest.emoji + '</div>' +
      '<div>' +
        '<div class="map-name">' + dest.name + '</div>' +
        '<div class="map-info-txt">' + dest.country + ' - ' + dest.info + '</div>' +
      '</div>';

    item.addEventListener('click', function () {
      document.querySelectorAll('.map-item').forEach(function (i) { i.classList.remove('active'); });
      item.classList.add('active');
      map.flyTo([dest.lat, dest.lng], 7, { duration: 1.3 });
      marker.openPopup();
    });

    mapItemsEl.appendChild(item);
  });


  /* ── LIBRARY 4: CHART.JS — Climate Chart ── */
  var ctx = document.getElementById('climateChart').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [
        {
          label: 'Avg Temp (C)',
          data: [27,27,28,29,29,28,27,27,27,28,28,27],
          backgroundColor: 'rgba(0,180,216,0.7)',
          borderRadius: 6,
          yAxisID: 'y'
        },
        {
          label: 'Sunshine (hrs/day)',
          type: 'line',
          data: [6.5,7,7.5,8,8.5,7,6,6,7,7.5,7,6.5],
          borderColor: '#ff9f1c',
          backgroundColor: 'rgba(255,159,28,0.12)',
          pointBackgroundColor: '#ff9f1c',
          pointRadius: 4,
          borderWidth: 2.5,
          fill: true,
          tension: 0.45,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          labels: { color: '#5a8a9f', font: { family: 'Poppins', size: 11 }, boxWidth: 12 }
        }
      },
      scales: {
        x:  { ticks: { color: '#8aacbd', font: { family: 'Poppins', size: 10 } }, grid: { color: '#e8f4f8' } },
        y:  { position: 'left',  ticks: { color: '#8aacbd', font: { size: 10 } }, grid: { color: '#e8f4f8' } },
        y1: { position: 'right', ticks: { color: '#ff9f1c', font: { size: 10 } }, grid: { drawOnChartArea: false } }
      }
    }
  });

}); /* end window load */