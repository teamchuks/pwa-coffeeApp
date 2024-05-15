const add = (value) => {
  let textPart = value.slice(0, -1);
  let digitPart = parseInt(value.charAt(value.length - 1));
  let incrementedDigit = digitPart + 1;
  return textPart + incrementedDigit;
};
let cacheNameinitial = `cache-version0`;
let cacheName = add(cacheNameinitial);
cacheNameinitial = cacheName;
// define the cache name
// const cacheName = 'v1';
const cacheAssets = [
  "/",
  "./index.html",
  "./fallback.html",
  "./checkout.html",
  "./css/style.css",
  "./css/checkout.css",
  "./js/script.js",
  "./js/app.js",
  "./js/indexedDB.js",
  "./js/checkout.js",
  "./img",
  "./img/icons",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css",
  "https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css",
];

// offline function

// Install the service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(`${cacheName}`)
      .then((cache) => cache.addAll(cacheAssets))
      .catch((error) => {
        console.error("Cache installation failed:", error);
      })
  );
});

// Activate the service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return (
                cacheName.startsWith("cache-version") && cacheName !== cacheName
              );
            })
            .map((cacheName) => {
              return caches.delete(cacheName);
            })
        );
      })
      .catch((error) => {
        console.error("Cache activation failed:", error);
      })
  );
});

// Fetch resources from cache or network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Clone the request to ensure it's safe to read when responding
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then((response) => {
            // Check if we received a valid response
            if (
              !response ||
              response.status !== 200 ||
              response.type !== "basic"
            ) {
              return caches.match("fallback.html");
            }
            // Clone the response to ensure it's safe to read when caching
            const responseToCache = response.clone();
            caches.open(`${cacheName}`).then((cache) => {
              cache.put(event.request, responseToCache);
            });

            return response;
          })
          .catch(() => {
            // Request failed, indicating the user is offline
            self.clients.matchAll().then((clients) => {
              clients.forEach((client) => {
                client.postMessage({
                  type: "offline",
                });
              });
            });
            return caches.match("fallback.html");
          });
      })
      .catch((error) => {
        console.error("Fetch request failed:", error);
      })
  );
});

//
// Background sync integration
self.addEventListener("sync", function (event) {
  console.log(event.tag, " Is the service sync tag");
  if (event.tag === "formSync") {
    event.waitUntil(syncFormData());
  }
});

// Sync function to synchronize form data with the server
function syncFormData() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("CoffeeAppDatabase", 1);
    request.onerror = (event) => {
      reject("Error opening database");
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("checkout", "readwrite");
      const objectStore = transaction.objectStore("checkout");
      const getDataRequest = objectStore.getAll();
      getDataRequest.onsuccess = () => {
        const formData = getDataRequest.result;
        // Send form data to server using fetch API
        // fetch('endpoint', {
        //     method: 'POST',
        //     body: JSON.stringify(formData),
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // })
        // .then((response) => {
        //     // Data successfully synchronized with server
        //     resolve('Data synchronized successfully');
        // })
        // .catch((error) => {
        //     // Error synchronizing data with server
        //     reject('Error synchronizing data with server');
        // });
        console.log(
          "You came online and the data has been synced to the server for process",
          formData
        );
      };

      getDataRequest.onerror = () => {
        reject("Error retrieving data from IndexedDB");
      };
    };
  });
}

// Push notification event listener
self.addEventListener("push", (event) => {
  const title = "Cool Coffee Shop";
  const options = {
    body: event.data.text(),
    icon: './img/icons/icon-72x72.png"',
    badge: "./img/icons/icon-72x72.png",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
