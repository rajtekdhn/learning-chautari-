/* site.js — loads data.json and fills in dynamic content on every page.
   Works because this file lives in the same folder as data.json on GitHub Pages. */
(function () {
  var DATA_URL = 'data.json';

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  function isYouTube(url) {
    return /youtu\.?be/i.test(url || '');
  }

  function renderItem(item) {
    var metaLine = item.meta ? '<div style="font-size:12px;color:#888;margin-top:2px">' + esc(item.meta) + '</div>' : '';
    var descLine = item.description ? '<div style="font-size:13.5px;color:#555;margin-top:3px">' + esc(item.description) + '</div>' : '';
    var actions = '';
    if (item.file) {
      actions += '<a class="dl-btn" href="' + esc(item.file) + '" download target="_blank" rel="noopener">⬇ Download</a> ';
    }
    if (item.link) {
      var label = isYouTube(item.link) ? '▶ Watch Video' : '🔗 Open Link';
      actions += '<a class="dl-btn" href="' + esc(item.link) + '" target="_blank" rel="noopener">' + label + '</a>';
    }
    if (!actions) actions = '<span class="dl-note">Coming soon</span>';
    return '<li style="align-items:flex-start">' +
      '<div>' + '<b>' + esc(item.title) + '</b>' + metaLine + descLine + '</div>' +
      '<span style="white-space:nowrap;margin-left:10px">' + actions + '</span>' +
      '</li>';
  }

  function renderSection(container, items) {
    if (!items || !items.length) return;
    var ul = document.createElement('ul');
    ul.className = 'dl-list';
    ul.innerHTML = items.slice().reverse().map(renderItem).join('');
    container.appendChild(ul);
  }

  function applySocial(data) {
    var social = data.social || {};
    var links = document.querySelectorAll('.social a[data-social]');
    links.forEach(function (a) {
      var key = a.getAttribute('data-social');
      var url = social[key];
      if (url) {
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.style.opacity = '1';
      } else {
        a.href = '#';
        a.style.opacity = '.45';
        a.title = a.title + ' (soon)';
      }
    });
  }

  function applyNotice(data) {
    document.querySelectorAll('[data-dyn="notice-text"]').forEach(function (el) {
      if (data.notice) el.textContent = data.notice;
    });
  }

  function renderGalleryPhotos(data) {
    var el = document.querySelector('[data-dyn="gallery-photos"]');
    if (!el) return;
    var photos = data.gallery || [];
    if (!photos.length) return;
    el.innerHTML = photos.slice().reverse().map(function (src) {
      return '<div class="g-item" style="padding:0;overflow:hidden">' +
        '<a href="' + esc(src) + '" target="_blank" rel="noopener">' +
        '<img src="' + esc(src) + '" alt="" style="width:100%;height:130px;object-fit:cover;display:block;border-radius:8px">' +
        '</a></div>';
    }).join('');
  }

  fetch(DATA_URL)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      applySocial(data);
      applyNotice(data);
      renderGalleryPhotos(data);
      document.querySelectorAll('[data-dyn-section]').forEach(function (container) {
        var key = container.getAttribute('data-dyn-section');
        var items = (data.sections && data.sections[key]) || [];
        renderSection(container, items);
      });
    })
    .catch(function (e) { console.warn('site.js: could not load data.json', e); });
})();
