// Scroll to top button
window.onscroll = function () {
  const btn = document.getElementById("scrollTopBtn");
  btn.style.display = (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) ? "block" : "none";
};

document.getElementById("scrollTopBtn").onclick = function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Fade-in observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
});
const fadeElements = document.querySelectorAll('.fade-in');
fadeElements.forEach(el => observer.observe(el));
function checkVisibility() {
  fadeElements.forEach(element => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      element.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', checkVisibility);
window.addEventListener('load', checkVisibility);

// Cart functionality
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.getElementById('close-cart-btn');

cartIcon.addEventListener('click', () => cartSidebar.classList.add('open'));
closeCartBtn.addEventListener('click', () => cartSidebar.classList.remove('open'));

let cart = [];

// Example product list
const products = [
  { id: '1', name: 'Magnus Ceiling Light', price: 350, image: 'Earrings-1.webp' },
  { id: '2', name: 'Fierro Lamp', price: 400, image: 'Necklace-1.webp' },
  { id: '3', name: 'Gaia Mini Desk Lamp', price: 200, image: 'ring-1.webp' }
];

// Add to cart button functionality
document.querySelectorAll('.add-to-cart').forEach((button, index) => {
  button.addEventListener('click', () => {
    addToCart(products[index]);
  });
});

// Add product to cart
function addToCart(product) {
  const existingProduct = cart.find(item => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCart();
}

// Update quantity of a product in the cart
function updateQuantity(productId, delta) {
  const productIndex = cart.findIndex(item => item.id === productId);
  if (productIndex !== -1) {
    cart[productIndex].quantity += delta;
    if (cart[productIndex].quantity <= 0) {
      cart.splice(productIndex, 1); // remove if 0 or less
    }
    updateCart();
  }
}

// Remove item manually from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
}

// Update cart UI
function updateCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  cartItemsContainer.innerHTML = '';
  let totalPrice = 0;

  cart.forEach(item => {
    const cartItemElement = document.createElement('div');
    cartItemElement.classList.add('cart-item');
    cartItemElement.innerHTML = `
  <div class="cart-item-inner">
    <img src="${item.image}" alt="${item.name}">
    <div class="details">
      <p class="product-title">${item.name}</p>
      <p class="product-price">$${item.price}</p>
    </div>
    <button class="remove-item" onclick="removeFromCart('${item.id}')">✕</button>
    <div class="quantity-control">
      <button class="decrease" onclick="updateQuantity('${item.id}', -1)">-</button>
      <input type="number" value="${item.quantity}" min="1" readonly>
      <button class="increase" onclick="updateQuantity('${item.id}', 1)">+</button>
    </div>
  </div>
`;

    cartItemsContainer.appendChild(cartItemElement);
    totalPrice += item.price * item.quantity;
  });

  document.getElementById('total-price').textContent = `Total: $${totalPrice.toFixed(2)}`;
  document.getElementById('checkout-btn').disabled = cart.length === 0;
}

// Checkout button
document.getElementById('checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) return;
  alert("Proceeding to checkout...");
});

// Checkout function (redirect to checkout page)
document.getElementById('checkout-btn').addEventListener('click', () => {
  // Optionally, you can store cart items in localStorage to use them in checkout
  localStorage.setItem('order', JSON.stringify(cart));
  window.location.href = 'checkout.html';  // Redirect to checkout page
});
