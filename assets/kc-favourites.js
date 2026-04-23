/**
 * KuchCoffee favourites — client-side wishlist.
 *
 * Storage: localStorage key "kc:favourites" holds a JSON array of product handles.
 * Any element with `data-kc-fav="{handle}"` becomes a toggle; aria-pressed reflects state.
 * On the Favourites page the element with `data-favourites-grid` is populated by
 * fetching each product via Shopify's `/products/{handle}.js` endpoint.
 */
(function () {
  var KEY = 'kc:favourites';

  function read() {
    try {
      var raw = window.localStorage.getItem(KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function write(list) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(list));
    } catch (e) {
      /* quota / private mode — no-op */
    }
    document.dispatchEvent(new CustomEvent('kc:favourites:change', { detail: { handles: list.slice() } }));
  }

  function toggle(handle) {
    if (!handle) return false;
    var list = read();
    var idx = list.indexOf(handle);
    if (idx >= 0) list.splice(idx, 1);
    else list.push(handle);
    write(list);
    return list.indexOf(handle) >= 0;
  }

  function isFav(handle) {
    return read().indexOf(handle) >= 0;
  }

  function syncButtons(root) {
    var scope = root || document;
    scope.querySelectorAll('[data-kc-fav]').forEach(function (btn) {
      var handle = btn.getAttribute('data-kc-fav');
      if (!handle) return;
      btn.setAttribute('aria-pressed', isFav(handle) ? 'true' : 'false');
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-kc-fav]');
    if (!btn) return;
    // Allow nested click inside <a> or <form> without triggering nav/submit.
    e.preventDefault();
    e.stopPropagation();
    toggle(btn.getAttribute('data-kc-fav'));
  });

  document.addEventListener('kc:favourites:change', function () {
    syncButtons();
  });

  // Cross-tab sync.
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) syncButtons();
  });

  function formatMoney(cents) {
    if (typeof cents !== 'number') return '';
    var dollars = (cents / 100).toFixed(2).replace(/\.00$/, '');
    return '$' + dollars;
  }

  function bootFavouritesPage() {
    var grid = document.querySelector('[data-favourites-grid]');
    if (!grid) return;
    var emptyEl = document.querySelector('[data-favourites-empty]');
    var countEl = document.querySelector('[data-favourites-count]');
    var tmpl = document.getElementById('kc-fav-card-template');
    if (!tmpl || !('content' in tmpl)) return;

    function setCount(n) {
      if (!countEl) return;
      var label = countEl.getAttribute('data-kc-count-label') || '{count}';
      countEl.textContent = label.replace('{count}', String(n));
    }

    function render() {
      var handles = read();
      grid.innerHTML = '';
      setCount(handles.length);

      if (handles.length === 0) {
        if (emptyEl) emptyEl.hidden = false;
        grid.hidden = true;
        return;
      }
      if (emptyEl) emptyEl.hidden = true;
      grid.hidden = false;

      var fragments = handles.map(function (handle) {
        return fetch('/products/' + encodeURIComponent(handle) + '.js', { headers: { Accept: 'application/json' } })
          .then(function (r) { return r.ok ? r.json() : null; })
          .catch(function () { return null; });
      });

      Promise.all(fragments).then(function (products) {
        products.forEach(function (p) {
          if (!p) return;
          var node = tmpl.content.firstElementChild.cloneNode(true);

          node.querySelectorAll('[data-fav-link]').forEach(function (a) {
            a.setAttribute('href', p.url || ('/products/' + p.handle));
          });

          var media = node.querySelector('[data-fav-media]');
          if (media) {
            if (p.featured_image) {
              var img = document.createElement('img');
              img.className = 'kc-collection__image';
              img.loading = 'lazy';
              img.src = p.featured_image;
              img.alt = p.title || '';
              media.innerHTML = '';
              media.appendChild(img);
            } else {
              media.textContent = p.title || '';
            }
          }

          var name = node.querySelector('[data-fav-name]');
          if (name) name.textContent = p.title || '';

          var price = node.querySelector('[data-fav-price]');
          if (price) {
            var min = typeof p.price_min === 'number' ? p.price_min : p.price;
            var varies = typeof p.price_varies === 'boolean' ? p.price_varies : (p.price_min !== p.price_max);
            price.textContent = varies ? ('From ' + formatMoney(min)) : formatMoney(p.price);
          }

          var btn = node.querySelector('[data-kc-fav]');
          if (btn) btn.setAttribute('data-kc-fav', p.handle);

          grid.appendChild(node);
        });
        syncButtons(grid);
      });
    }

    render();
    document.addEventListener('kc:favourites:change', render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { syncButtons(); bootFavouritesPage(); });
  } else {
    syncButtons();
    bootFavouritesPage();
  }
})();
