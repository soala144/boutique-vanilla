const search = document.getElementById("search");
  const searchButton = document.getElementById("search-button");
  const productGrid = document.getElementById("product-grid");

  // API URL for fetching product data
  const apiUrl = "https://fakestoreapi.com/products";
  let allProducts = []; // Cache for storing fetched products

  // Fetch and display products
  async function fetchStore() {
    try {
      const response = await fetch(apiUrl);
      allProducts = await response.json(); // Cache products
      displayProducts(allProducts); // Display all products

      //   filter products
     
    } catch (error) {
      console.error("Error fetching products:", error);
      productGrid.innerHTML = "<p>Failed to load products. Please try again later.</p>";
    }
  }

  // Function to display products on the screen
  function displayProducts(products) {
    productGrid.innerHTML = ""; // Clear existing products
    products.forEach(product => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");

      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="product-image" />
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p>$${product.price}</p>
      `;
      productGrid.appendChild(productCard);
    });
  }

  // Function to filter products based on search query
  function filterProducts(query) {
    const filteredProducts = allProducts.filter(product => {
      return (
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
    });

    if (filteredProducts.length === 0) {
      productGrid.innerHTML = "<p>No products found matching your search.</p>";
    } else {
      displayProducts(filteredProducts); // Display filtered products
    }
  }

  // Debounce function to reduce the number of API calls
//   function debounce(func, delay) {
//     let timeoutId;
//     return (...args) => {
//       clearTimeout(timeoutId);
//       timeoutId = setTimeout(() => func(...args), delay);
//     };
//   }

  // Handle search input with debouncing
  const handleSearch = (event) => {
    const query = event.target.value.trim(); // Get the search query and trim spaces
    if (query) {
      filterProducts(query); // Filter products if there's a search query
    } else {
      displayProducts(allProducts); // If search is empty, display all products
    }
  };

  // Initialize the debounced search handler
//   const debouncedSearch = debounce(handleSearch, 300); // 300ms delay

  // Search event listener
  search.addEventListener("input", handleSearch);

   
  // Initial data fetch when the page loads
  document.addEventListener("DOMContentLoaded", fetchStore);