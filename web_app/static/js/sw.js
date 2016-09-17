importScripts('cache-polyfill.js');
// Required files to make this work offline
var REQUIRED_FILES = [
    '/',
    '/?homescreen=1',
    '/static/css/style.css',
    '/static/css/responsive.css',
    '/static/css/bootstrap.min.css'
];
var offlineRequest = new Request('../../offline.html');

self.addEventListener('install', function(e) {
    e.waitUntil(
        fetch(offlineRequest).then(function(response) {
            return caches.open('belfast-cares')
            .addAll(REQUIRED_FILES)
            .then(function(cache) {
                console.log('[oninstall] Cached offline page', response.url);
                return cache.put(offlineRequest, response);
            });
        })
    );
});
self.addEventListener('fetch', function(event) {
    console.log(event.request.url);
    var request = event.request;
    //if(request.method === 'GET') {
        event.respondWith(
            caches.match(event.request).then(function(response) {
                return response || fetch(event.request);
            })
            .catch(function(error) {
                console.error(
                    '[onfetch] Failed. Serving cached offline fallback ' +
                    error
                );
                return caches.open('offline').then(function(cache) {
                    return cache.match('offline.html');
                });
            })
        );
    //}
/*    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );*/
});