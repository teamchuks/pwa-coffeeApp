// In your web application JavaScript code (not the service worker)
document.addEventListener("DOMContentLoaded", () => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted");
      } else {
        console.log("Notification permission denied");
      }
    });
  }
});

// Service worker registration
if ("serviceWorker" in navigator && !navigator.serviceWorker.controller) {
  console.log(navigator.serviceWorker.controller, " Is controller");
  window.addEventListener("load", async () => {
    try {
      const version = Math.random().toString(36).substring(7);
      const registration = await navigator.serviceWorker.register(
        `sw.js?v=${version}`
      );
      console.log("Service Worker registered", registration.scope);
    } catch (error) {
      console.error("Service Worker registration failed", error);
    }
  });
}

window.addEventListener("offline", () => {
  console.log("You are offline! Trying to reconnect......");
  Toastify({
    text: "You are offline",
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to left, #ff5f6d, blue)",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
  // No need to use self.clients.matchAll() here
});
window.addEventListener("online", () => {
  Toastify({
    text: "You're back online***",
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to left, #ff5f6d, blue)",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
  // No need to use self.clients.matchAll() here
});

navigator.serviceWorker.addEventListener("message", function (event) {
  if (event.data.type === "offline") {
    console.log("You are offline");
    // Show a toast or any other UI update to notify the user
    Toastify({
      text: "Invalid Page Accsess",
      duration: 5000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "left", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #ff5f6d, #ffc371)",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  }
});

// register serviceWorker
/*
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
    .then((res) => console.log('service worker registered'))
    .catch((error) => console.log('service worker not registered'));
}
*/

// register service worker
// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register("./service-worker.js")
//       .then((res) => console.log("service worker: Registered"))
//       .catch((error) => console.log(`service worker: Error: ${error}`));
//   });
// }

/*
// Define cache names
const staticCache = "site-cache-v1";
let dynamicCache = "site-cache-v2"; // Initial dynamic cache name
let cacheVersion = 2; // Initial cache version number
const cacheData = [
  "/",
  "/index.html",
  "/js/app.js",
  "/css/style.css",
  "/img",
  "/img/icons",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css",
  "fallback.html",
  "./js/indexedDB.js",
  "./js/checkout.js",
  "./js/itemsData.js",
  "./checkout.html"
];

// Install service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(staticCache).then((cache) => {
      // Pre-cache static data
      return cache.addAll(cacheData);
    })
  );
});

// Activate service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      // Delete outdated caches
      return Promise.all(
        keys
          .filter((key) => key !== staticCache && key !== dynamicCache)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// Fetch service worker
self.addEventListener("fetch", (event) => {
  event.respondWith(
    // Try to match request in static cache
    caches.match(event.request).then((staticCacheResponse) => {
      if (staticCacheResponse) {
        // Serve from static cache
        return staticCacheResponse;
      } else {
        // If not found in static cache, fetch from network
        return fetch(event.request)
          .then((fetchResponse) => {
            // Clone response for both cache and client consumption
            const clone = fetchResponse.clone();
            // Open dynamic cache
            return caches.open(dynamicCache).then((cache) => {
              // Cache the fetched response
              cache.put(event.request.url, clone);
              return fetchResponse;
            });
          })
          .catch(() => {
            // If fetch fails, serve fallback page
            return caches.match("/fallback.html");
          });
      }
    })
  );
});

// Update cache version when service worker is updated
self.addEventListener("activate", (event) => {
  event.waitUntil(
    // Increment cache version and update dynamic cache name
    caches.keys().then((keys) => {
      keys.forEach((key) => {
        if (key.startsWith("site-cache-v") && key !== staticCache) {
          const versionStr = key.split("-")[2];
          const versionNum = parseInt(versionStr);
          if (!isNaN(versionNum) && versionNum >= cacheVersion) {
            cacheVersion = versionNum + 1;
          }
        }
      });
      // Update dynamic cache name
      dynamicCache = `site-cache-v${cacheVersion}`;
    })
  );
});

*/
