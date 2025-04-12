// ------------------- SCROLL TO TOP -------------------
window.onscroll = function () {
  const btn = document.getElementById("scrollTopBtn");
  btn.style.display = (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) ? "block" : "none";
};

document.getElementById("scrollTopBtn").onclick = function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ------------------- FADE-IN EFFECT -------------------
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

// ✅ Fixed typo here (was getElementsById)
document.getElementById("SeeAll")?.addEventListener("click", () => {
  window.location.href = "product.html";
});

// ------------------- CART SYSTEM -------------------
const cartIcon = document.getElementById("cart-icon");
const cartSidebar = document.createElement("div");
cartSidebar.className = "cart-sidebar";
document.body.appendChild(cartSidebar);

let cart = JSON.parse(localStorage.getItem("cart")) || [];

cartSidebar.innerHTML = `
  <button class="close-btn">&times;</button>
  <h2>Your Cart</h2>
  <div class="cart-items"></div>
  <div class="cart-summary">Total: RM0</div>
  <button id="checkout-btn" disabled>Checkout</button>
`;

const closeBtn = cartSidebar.querySelector(".close-btn");
const cartItemsContainer = cartSidebar.querySelector(".cart-items");
const checkoutBtn = cartSidebar.querySelector("#checkout-btn");
const cartSummary = cartSidebar.querySelector(".cart-summary");

cartIcon?.addEventListener("click", () => cartSidebar.classList.add("open"));
closeBtn?.addEventListener("click", () => cartSidebar.classList.remove("open"));

function showToast(msg) {
  const toast = document.createElement("div");
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed; bottom: 1px; right: 30px; background: #7a9e7e; color: white;
    padding: 10px 20px; border-radius: 5px; z-index: 2000; font-weight: bold;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2); opacity: 0; transition: opacity 0.3s ease;
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.style.opacity = 1);
  setTimeout(() => {
    toast.style.opacity = 0;
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 2000);
}

function updateCartUI() {
  if (!cartItemsContainer || !cartSummary || !checkoutBtn) return;

  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <div class="cart-item-inner">
        <img src="${item.image}" />
        <div class="details">
          <p class="product-title">${item.name}</p>
          <p class="product-price">RM ${item.price}</p>
        </div>
        <div class="quantity-control">
          <button class="decrease">-</button>
          <input type="number" value="${item.quantity}" readonly>
          <button class="increase">+</button>
        </div>
        <button class="remove-item">&times;</button>
      </div>
    `;

    itemDiv.querySelector(".decrease").addEventListener("click", () => updateQuantity(index, -1));
    itemDiv.querySelector(".increase").addEventListener("click", () => updateQuantity(index, 1));
    itemDiv.querySelector(".remove-item").addEventListener("click", () => {
      cart.splice(index, 1);
      updateCartUI();
    });

    cartItemsContainer.appendChild(itemDiv);
    total += item.price * item.quantity;
  });

  cartSummary.innerText = `Total: RM ${total.toFixed(2)}`;
  checkoutBtn.disabled = cart.length === 0;
  localStorage.setItem("cart", JSON.stringify(cart));

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartIcon) {
    if (!cartIcon.querySelector(".cart-count")) {
      const badge = document.createElement("span");
      badge.className = "cart-count";
      badge.style.cssText = `
        position: absolute; top: 15px; right: 0; background: red; color: white;
        border-radius: 50%; font-size: 12px; padding: 2px 6px;
      `;
      cartIcon.appendChild(badge);
    }
    cartIcon.querySelector(".cart-count").textContent = cartCount;
  }
}

function updateQuantity(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  updateCartUI();
}

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartUI();
  showToast(`${product.name} added to cart!`);
}

// Make available globally so product.html can access it
window.addToCart = addToCart;

// Checkout button
checkoutBtn?.addEventListener("click", () => {
  if (cart.length === 0) return;
  localStorage.setItem("order", JSON.stringify(cart));
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  window.location.href = "checkout.html";
});
// Initial cart UI setup
updateCartUI();

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const closeMenu = document.getElementById("close-menu");

  hamburger.addEventListener("click", () => {
    mobileMenu.classList.add("open");
  });

  closeMenu.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
  });
});



