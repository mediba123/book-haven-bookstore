/* ============================================
   BOOK HAVEN BOOKSTORE — SHARED JS
   ============================================ */

// ---- Active Nav Link ----
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a, .mobile-nav a, .footer-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });
}

// ---- Hamburger Menu ----
function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-nav');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
    }
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
    }
  });
}

// ---- Subscribe Feature ----
function initSubscribe() {
  document.querySelectorAll('.subscribe-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input.value.trim();
      if (!email) {
        input.focus();
        return;
      }
      alert('Thank you for subscribing!');
      input.value = '';
    });
  });
}

// ---- Shopping Cart (sessionStorage) ----
function getCart() {
  try { return JSON.parse(sessionStorage.getItem('cartItems') || '[]'); }
  catch { return []; }
}
function saveCart(arr) {
  sessionStorage.setItem('cartItems', JSON.stringify(arr));
}
function clearCartData() {
  sessionStorage.removeItem('cartItems');
}

function initCart() {
  // Add to Cart buttons
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.item;
      const cart = getCart();
      cart.push(name);
      saveCart(cart);
      alert(`Item added to the cart: ${name}`);
    });
  });

  // View Cart button + modal
  const viewCartBtn   = document.getElementById('view-cart-btn');
  const cartModal     = document.getElementById('cart-modal');
  const cartCloseBtn  = document.getElementById('cart-close');
  const cartList      = document.getElementById('cart-items-list');
  const clearCartBtn  = document.getElementById('clear-cart-btn');
  const processBtn    = document.getElementById('process-order-btn');

  if (!viewCartBtn || !cartModal) return;

  function renderCart() {
    const cart = getCart();
    cartList.innerHTML = '';
    if (cart.length === 0) {
      cartList.innerHTML = '<p class="cart-empty-msg">Your cart is empty.</p>';
    } else {
      const ul = document.createElement('ul');
      ul.className = 'cart-items-list';
      cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });
      cartList.appendChild(ul);
    }
  }

  viewCartBtn.addEventListener('click', () => {
    renderCart();
    cartModal.classList.add('open');
    cartModal.querySelector('[data-first-focus]')?.focus();
  });

  cartCloseBtn.addEventListener('click', () => cartModal.classList.remove('open'));
  cartModal.addEventListener('click', e => { if (e.target === cartModal) cartModal.classList.remove('open'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') cartModal.classList.remove('open'); });

  clearCartBtn.addEventListener('click', () => {
    clearCartData();
    renderCart();
    alert('Cart is cleared!');
  });

  processBtn.addEventListener('click', () => {
    const cart = getCart();
    if (cart.length === 0) {
      alert('Your cart is empty. Add some books first!');
      return;
    }
    alert('Thank you for your order!');
    clearCartData();
    renderCart();
    cartModal.classList.remove('open');
  });
}

// ---- Contact / Custom Order Form (localStorage) ----
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name     = form.querySelector('#name').value.trim();
    const email    = form.querySelector('#email').value.trim();
    const phone    = form.querySelector('#phone').value.trim();
    const feedback = form.querySelector('#feedback').value.trim();
    const custom   = form.querySelector('#custom-order').checked;

    if (!name || !email || !feedback) {
      alert('Please enter your name, email and feedback!');
      return;
    }

    const data = { name, email, phone, feedback, customOrder: custom, submittedAt: new Date().toISOString() };
    localStorage.setItem(name, JSON.stringify(data));
    alert(`Thank you for your message, ${name}!`);
    form.reset();
  });

  const clearBtn = form.querySelector('#clear-form-btn');
  if (clearBtn) clearBtn.addEventListener('click', () => form.reset());
}

// ---- Init on DOM Ready ----
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initHamburger();
  initSubscribe();
  initCart();
  initContactForm();
});
