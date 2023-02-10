/* serviceWorker.js */
// (参考) https://developer.mozilla.org/ja/docs/Web/Progressive_web_apps/Offline_Service_workers
'use strict';

const cacheName = 'bgscore-v20230210';
const ORIGIN = (location.hostname == 'localhost') ? '' : location.protocol + '//' + location.hostname;

const contentToCache = [
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
  ORIGIN + '/bgscoreapp/js/swipetracker_class.js',
  ORIGIN + '/bgscoreapp/js/bgscoreapp_class.js',
  ORIGIN + '/js/jquery-3.6.1.min.js',
  ORIGIN + '/js/start-serviceWorker.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(contentToCache);
    })
  );
});
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => {
      return r || fetch(e.request).then((response) => {
        return caches.open(cacheName).then((cache) => {
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        const [kyappname, kyversion] = key.split('-');
        const [cnappname, cnversion] = cacheName.split('-');
        if (kyappname === cnappname && kyversion !== cnversion) {
          return caches.delete(key);
        }
      }));
    })
  );
});
