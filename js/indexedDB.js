
// Open (or create) the IndexedDB database
const request = indexedDB.open("CoffeeAppDatabase", 1);

//   database upgrade --
request.onupgradeneeded = function (e) {
  const db = e.target.result;
  const objectStore = db.createObjectStore("products", {
    keyPath: "id",
    autoIncrement: true,
  });
  const secondObjectStore = db.createObjectStore("cart", {
    keyPath: "id",
    autoIncrement: true,
  });
  const thirdObjectStore = db.createObjectStore("checkout", {
    keyPath: "id",
    autoIncrement: true,
  });

  // objectStore.createIndex("nameIndex", "name", { unique: false });
  // objectStore.createIndex("imageIndex", "image", { unique: false });
  // objectStore.createIndex("priceIndex", "price", { unique: false });
  console.log("Object store: 'product and cart' created");
};

request.onsuccess = function (e) {
  db = e.target.result;

  const transaction = db.transaction(["products"], "readwrite");
  const productObjectStore = transaction.objectStore("products");

  allProducts.forEach((items) => {
    productObjectStore.add(items);
  });
  console.log("products: items are added");
};

request.onerror = function (e) {
  console.error("Database error:", e.target.error);
};

// Function to add items to the cart
function addToCart(item) {
  const request = indexedDB.open("CoffeeAppDatabase", 1);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(["cart"], "readwrite");
    const cartObjectStore = transaction.objectStore("cart");
    const addCartItem = cartObjectStore.add(item);

    addCartItem.onsuccess = function (e) {
      console.log("Item added to cart:", item);
      renderCart();
    };

    addCartItem.onerror = function (e) {
      console.error("Failed to add item to cart:", e.target.error);
    };
  };

  request.onerror = function (event) {
    console.error("IndexedDB error:", event.target.errorCode);
  };
}

// Function to store form data in IndexedDB
function checkout(item) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("CoffeeAppDatabase", 1);
    request.onerror = (event) => {
      reject("Error opening database");
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("checkout", "readwrite");
      const objectStore = transaction.objectStore("checkout");
      const addRequest = objectStore.add(item);

      addRequest.onsuccess = () => {
        if ("serviceWorker" in navigator && "SyncManager" in window) {
          navigator.serviceWorker.ready
            .then(function (registration) {
              console.log("Synced data here", registration);
              registration.sync.register("formSync").then(() => {
                console.log("Sync registration successful");
              });
            })
            .catch(function (err) {
              console.error("Service Worker registration failed:", err);
            });
        }
        resolve("Form data stored successfully");
      };

      addRequest.onerror = () => {
        reject("Error storing form data");
      };
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore("checkout", { autoIncrement: true });
    };
  });
}

//Function to clear the cart
function clearCart() {
  const request = indexedDB.open("CoffeeAppDatabase", 1);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(["cart"], "readwrite");
    const cartObjectStore = transaction.objectStore("cart");
    const clearRequest = cartObjectStore.clear();

    clearRequest.onsuccess = function () {
      console.log("Cart cleared");
      renderCart();
    };

    clearRequest.onerror = function () {
      console.error("Error clearing cart:", clearRequest.error);
    };
  };

  request.onerror = function (event) {
    console.error("IndexedDB error:", event.target.errorCode);
  };
}

// Function to render the cart items
function renderCart() {
  const request = indexedDB.open("CoffeeAppDatabase", 1);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(["cart"], "readonly");
    const cartObjectStore = transaction.objectStore("cart");
    const getAllCartItem = cartObjectStore.getAll();

    getAllCartItem.onsuccess = function () {
      const cartItems = getAllCartItem.result;
      // const cartElement = document.querySelector('.cart-item')
      // cartElement.innerHTML = ''; // Clear previous content

      if (cartItems.length === 0) {
        console.log("cart is working...");
        // cartElement.innerHTML = "<p>Cart is empty</p>";
      } else {
        console.log("cart is working 2222...");
        cartItems.forEach((item) => {
          addToCart(item); // Call your existing function to display cart item
        });
      }
    };

    getAllCartItem.onerror = function () {
      console.error("Error getting cart items:", getAllCartItem.error);
    };
  };

  request.onerror = function (event) {
    console.error("IndexedDB error:", event.target.errorCode);
  };
}

// Render cart on page load
window.onload = renderCart;
