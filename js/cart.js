document.addEventListener("DOMContentLoaded", () => {
  const cartTableBody = document.getElementById("cartTableBody");
  const emptyCartMessage = document.getElementById("emptyCartMessage");
  const cartTable = document.getElementById("cartTable");
  const cartSubtotal = document.getElementById("cartSubtotal");
  const cartTotal = document.getElementById("cartTotal");
  const renderCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      if (cartTable) cartTable.style.display = "none";
      if (emptyCartMessage) emptyCartMessage.style.display = "block";
      if (cartSubtotal) cartSubtotal.textContent = "$ 0.00";
      if (cartTotal) cartTotal.textContent = "$ 0.00";
      return;
    }
    if (cartTable) cartTable.style.display = "table";
    if (emptyCartMessage) emptyCartMessage.style.display = "none";
    let html = "";
    let total = 0;
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      html += `
        <tr data-id="${item.id}">
          <td class="col-item">
            <div class="cart-item-info">
              <img src="${item.image}" alt="${item.name}">
              <span>${item.name}</span>
            </div>
          </td>
          <td class="col-price">$ ${item.price.toFixed(2)}</td>
          <td class="col-qty">
            <div class="qty-control">
              <button class="btn-qty btn-dec" data-id="${item.id}">-</button>
              <input type="number" value="${item.quantity}" min="1" class="qty-input" data-id="${item.id}" />
              <button class="btn-qty btn-inc" data-id="${item.id}">+</button>
            </div>
          </td>
          <td class="col-total">$ ${itemTotal.toFixed(2)}</td>
          <td class="col-action">
            <button class="btn-remove" data-id="${item.id}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });
    if (cartTableBody) cartTableBody.innerHTML = html;
    if (cartSubtotal) cartSubtotal.textContent = "$ " + total.toFixed(2);
    if (cartTotal) cartTotal.textContent = "$ " + total.toFixed(2);
  };
  if (cartTableBody) {
    cartTableBody.addEventListener("click", (e) => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (e.target.closest(".btn-remove")) {
        const id = e.target.closest(".btn-remove").getAttribute("data-id");
        cart = cart.filter((item) => item.id !== id);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        updateCartBadge(); // from main.js if accessible, or re-run
      }
      if (e.target.classList.contains("btn-inc")) {
        const id = e.target.getAttribute("data-id");
        const item = cart.find((i) => i.id === id);
        if (item) {
          item.quantity++;
          localStorage.setItem("cart", JSON.stringify(cart));
          renderCart();
          updateCartBadge();
        }
      }
      if (e.target.classList.contains("btn-dec")) {
        const id = e.target.getAttribute("data-id");
        const item = cart.find((i) => i.id === id);
        if (item && item.quantity > 1) {
          item.quantity--;
          localStorage.setItem("cart", JSON.stringify(cart));
          renderCart();
          updateCartBadge();
        }
      }
    });
    cartTableBody.addEventListener("change", (e) => {
      if (e.target.classList.contains("qty-input")) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const id = e.target.getAttribute("data-id");
        const newQty = parseInt(e.target.value);
        if (newQty > 0) {
          const item = cart.find((i) => i.id === id);
          if (item) {
            item.quantity = newQty;
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
            updateCartBadge();
          }
        } else {
          e.target.value = 1; // reset to 1 if user tries to enter 0 or less
        }
      }
    });
    const updateCartBadge = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
      const badgeHeader = document.getElementById("cart-badge-header");
      const badgeMobile = document.getElementById("cart-badge-mobile");
      if (badgeHeader) badgeHeader.textContent = totalQty;
      if (badgeMobile) badgeMobile.textContent = totalQty;
    };
    renderCart();
  }
});

