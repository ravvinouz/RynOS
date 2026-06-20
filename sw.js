var CACHE = 'ryanOS-v11';
var FILES = ['/Ryan-OS/', '/Ryan-OS/index.html', '/Ryan-OS/icon.png'];

self.addEventListener('install', function(e){
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(FILES); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  e.respondWith(
    fetch(e.request).then(function(res){
      return caches.open(CACHE).then(function(c){
        c.put(e.request, res.clone()); return res;
      });
    }).catch(function(){
      return caches.match(e.request).then(function(r){
        return r || caches.match('/Ryan-OS/index.html');
      });
    })
  );
});
