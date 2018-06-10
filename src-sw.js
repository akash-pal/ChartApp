importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js');

console.log('this is my custom service worker');

workbox.skipWaiting();
workbox.clientsClaim();

// self.addEventListener('push', (event) => {
//     const title = 'Chartjs Demo';
//     const options = {
//       body: event.data.text()
//     };
//     event.waitUntil(self.registration.showNotification(title, options));
// });

workbox.precaching.precacheAndRoute([]);