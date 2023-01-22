/* serviceWorker.js */
// (参考) https://qiita.com/kaihar4/items/c09a6d73e190ab0b9b01
'use strict';

const CACHE_NAME = "bgscore-v20230122";
const ORIGIN = (location.hostname == 'localhost') ? '' : location.protocol + '//' + location.hostname;

const STATIC_FILES = [
  ORIGIN + '/bgscoreapp/',
  ORIGIN + '/bgscoreapp/index.html',
  ORIGIN + '/bgscoreapp/manifest.json',
  ORIGIN + '/bgscoreapp/icon/favicon.ico',
  ORIGIN + '/bgscoreapp/icon/apple-touch-icon.png',
  ORIGIN + '/bgscoreapp/icon/android-chrome-96x96.png',
  ORIGIN + '/bgscoreapp/icon/android-chrome-192x192.png',
  ORIGIN + '/bgscoreapp/icon/android-chrome-512x512.png',
  ORIGIN + '/bgscoreapp/css/bgscore.css',
  ORIGIN + '/bgscoreapp/js/bgflipcard_class.js',
  ORIGIN + '/bgscoreapp/js/bgscoreapp_class.js',
  ORIGIN + '/js/jquery-3.6.1.min.js',
  ORIGIN + '/js/start-serviceWorker.js',
];

const CACHE_KEYS = [
  CACHE_NAME
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        STATIC_FILES.map(url => {
          return fetch(new Request(url, { cache: 'no-cache', mode: 'no-cors' })).then(response => {
            return cache.put(url, response);
          });
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => {
          return !CACHE_KEYS.includes(key);
        }).map(key => {
          return caches.delete(key);
        })
      );
    })
  );
});

