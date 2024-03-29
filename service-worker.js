

'use strict';


const CACHE_NAME = 'pamiec-statyczna-v2';


const FILES_TO_CACHE = [
  '/index.html',
  '/imgs/background.jpg',
  '/AddPointHelper.js',
  '/Editor.js',
  '/Files.js',
  '/menu.js',
  '/PointHelper.js',
  '/Polygon.js',
  '/PolygonMenu.js',
  '/ZoomBox.js',
  '/css/main.css',
  '/css/main.css.map',
  '/'
];

self.addEventListener('install', (evt) => {
  //console.log('[ServiceWorker] Install');

  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      //console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  // console.log('[ServiceWorker] Activate');
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          //console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );

  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  //console.log('[ServiceWorker] Fetch', evt.request.url);
  if (evt.request.mode !== 'navigate') {
    // Not a page navigation, bail.
    return;
  }
  evt.respondWith(
    fetch(evt.request)
      .catch(() => {
        return caches.open(CACHE_NAME)
          .then((cache) => {
            return cache.match('index.html');
          });
      })
  );

});