const searchButton = document.getElementById("search-button");
const search = document.getElementById("search");
const productGrid = document.getElementById("product-grid");
const cartItemsContainer = document.getElementById("cart-items"); // Add a container for cart items
const cartTotalElement = document.getElementById("cart-total"); // Element to display the cart total

// API URL for fetching product data
const apiUrl = "https://fakestoreapi.com/products";
let allProducts = []; // Cache for storing fetched products
let cartItems = JSON.parse(localStorage.getItem("cart")) || []; // Load cart from localStorage

// Fetch and display products
async function fetchStore() {
  try {
    const response = await fetch(apiUrl);
    allProducts = await response.json(); // Cache products
    displayProducts(allProducts); // Display all products
    renderCart(); // Render the cart on page load
  } catch (error) {
    console.error("Error fetching products:", error);
    productGrid.innerHTML =
      "<p>Failed to load products. Please try again later.</p>";
  }
}

// Function to display products on the screen
function displayProducts(products) {
  productGrid.innerHTML = ""; // Clear existing products
  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.title}" class="product-image" />
      <h3>${product.title}</h3>
      <p>$${product.price}</p>
      <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
    `;

    productGrid.appendChild(productCard);
  });

  // Add event listeners to "Add to Cart" buttons
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("data-id");
      addToCart(productId);
    });
  });
}


// Function to add products to the cart
function addToCart(productId) {
  const product = allProducts.find((item) => item.id === parseInt(productId));

  const existingCartItem = cartItems.find((item) => item.id === product.id);
  if (existingCartItem) {
    // If product is already in the cart, increase its quantity
    existingCartItem.quantity += 1;
  } else {
    // Add new product to the cart
    cartItems.push({ ...product, quantity: 1 });
  }

  saveCart(); // Save the cart to localStorage
  renderCart(); // Update the cart display
}

// Function to remove products from the cart
function removeFromCart(productId) {
  cartItems = cartItems.filter((item) => item.id !== parseInt(productId));
  saveCart(); // Save the updated cart to localStorage
  renderCart(); // Update the cart display
}
// Function to render the cart in the UI
function renderCart() {
  cartItemsContainer.innerHTML = ""; // Clear existing cart items
  let total = 0;

  cartItems.forEach((item) => {
    total += item.price * item.quantity;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="cart-item-image" />
      <div>
        <h4>${item.title}</h4>
        <p>$${item.price} × ${item.quantity}</p>
        <button class="remove-from-cart-btn" data-id="${item.id}">Remove</button>
      </div>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  cartTotalElement.textContent = `Total: $${total.toFixed(2)}`; // Update total

  // Add event listeners to "Remove" buttons
  document.querySelectorAll(".remove-from-cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("data-id");
      removeFromCart(productId);
    });
  });
}

// Function to save the cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cartItems));
}

// Function to filter products based on search query
function filterProducts(query) {
  const filteredProducts = allProducts.filter((product) =>
    product.title.toLowerCase().includes(query.toLowerCase())
  );

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = "<p>No products found matching your search.</p>";
  } else {
    displayProducts(filteredProducts);
  }
}

function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId); // Clear previous timer
    timeoutId = setTimeout(() => func(...args), delay); // Set new timer
  };
}

const handleSearch = debounce(() => {
  const query = search.value.trim();
  if (query) {
    filterProducts(query);
  } else {
    displayProducts(allProducts);
  }
}, 300);

searchButton.addEventListener("click", handleSearch);
search.addEventListener("input", handleSearch);

// Initial data fetch when the page loads
document.addEventListener("DOMContentLoaded", fetchStore);
