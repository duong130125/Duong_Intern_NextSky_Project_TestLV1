document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================
     1. GLOBAL HELPERS & INITIALIZATION
     ========================================== */
  const cartBadgeHeader = document.getElementById("cart-badge-header");
  const cartBadgeMobile = document.getElementById("cart-badge-mobile");

  const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];
  const saveCart = (cart) => localStorage.setItem("cart", JSON.stringify(cart));

  const updateCartBadge = () => {
    const cart = getCart();
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBadgeHeader) cartBadgeHeader.textContent = totalQty;
    if (cartBadgeMobile) cartBadgeMobile.textContent = totalQty;
  };

  updateCartBadge();

  /* ==========================================
     2. TOP ANNOUNCEMENT BAR & COUNTDOWN
     ========================================== */
  const topBar = document.querySelector(".top-announcement-bar");
  const topBarClose = document.querySelector(".close-announcement");
  const timerDisplay = document.getElementById("countdown-timer");

  if (topBarClose && topBar) {
    topBarClose.addEventListener(
      "click",
      () => (topBar.style.display = "none"),
    );
  }

  const startCountdown = () => {
    if (!timerDisplay) return;
    // Set a target date far in the future or a specific event date
    const targetDate = new Date("December 31, 2026 23:59:59").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        timerDisplay.textContent = "EXPIRED";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      timerDisplay.textContent = `${days} days : ${hours.toString().padStart(2, "0")} hours : ${minutes.toString().padStart(2, "0")} mins : ${seconds.toString().padStart(2, "0")} secs`;
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  };

  startCountdown();

  /* ==========================================
     3. HERO SLIDER
     ========================================== */
  const heroSlider = () => {
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".hero-dots .dot");
    const nextBtn = document.querySelector(".hero-next");
    const prevBtn = document.querySelector(".hero-prev");
    let currentSlide = 0;
    let slideInterval;

    if (slides.length === 0) return;

    const goToSlide = (n) => {
      slides[currentSlide].classList.remove("active");
      dots[currentSlide].classList.remove("active");
      currentSlide = (n + slides.length) % slides.length;
      slides[currentSlide].classList.add("active");
      dots[currentSlide].classList.add("active");
    };

    const nextSlide = () => goToSlide(currentSlide + 1);
    const prevSlide = () => goToSlide(currentSlide - 1);

    if (nextBtn)
      nextBtn.addEventListener("click", () => {
        nextSlide();
        resetInterval();
      });
    if (prevBtn)
      prevBtn.addEventListener("click", () => {
        prevSlide();
        resetInterval();
      });

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        goToSlide(index);
        resetInterval();
      });
    });

    const resetInterval = () => {
      clearInterval(slideInterval);
      // slideInterval = setInterval(nextSlide, 5000); // Disabled auto-sliding
    };

    // slideInterval = setInterval(nextSlide, 5000); // Disabled auto-sliding
  };

  heroSlider();

  /* ==========================================
     3b. TRENDING WEEK MOBILE SLIDER
     ========================================== */
  const trendingSlider = () => {
    const grid = document.querySelector(".trending-week .products-grid");
    const prevBtn = document.querySelector(".trending-prev");
    const nextBtn = document.querySelector(".trending-next");
    if (!grid || !prevBtn || !nextBtn) return;

    let currentPage = 0;

    const getCardsPerPage = () => {
      // On mobile (<= 768px) show 2 cards at a time
      return window.innerWidth <= 768 ? 2 : 0;
    };

    const getTotalPages = () => {
      const cards = grid.querySelectorAll(".product-card");
      const perPage = getCardsPerPage();
      if (perPage === 0) return 0;
      return Math.ceil(cards.length / perPage);
    };

    const updateSlider = () => {
      const perPage = getCardsPerPage();
      if (perPage === 0) {
        // Desktop: reset transform
        grid.style.transform = "translateX(0)";
        return;
      }

      const cards = grid.querySelectorAll(".product-card");
      if (cards.length === 0) return;

      const totalPages = getTotalPages();
      // Clamp currentPage
      if (currentPage < 0) currentPage = 0;
      if (currentPage >= totalPages) currentPage = totalPages - 1;

      // Calculate offset based on card width + gap
      const card = cards[0];
      const gap = 15;
      const cardWidth = card.offsetWidth + gap;
      const offset = currentPage * perPage * cardWidth;

      grid.style.transform = `translateX(-${offset}px)`;
    };

    nextBtn.addEventListener("click", () => {
      const totalPages = getTotalPages();
      if (currentPage < totalPages - 1) {
        currentPage++;
        updateSlider();
      }
    });

    prevBtn.addEventListener("click", () => {
      if (currentPage > 0) {
        currentPage--;
        updateSlider();
      }
    });

    // Reset on window resize (switching between mobile/desktop)
    window.addEventListener("resize", () => {
      currentPage = 0;
      updateSlider();
    });
  };

  trendingSlider();

  /* ==========================================
     4. TRENDING WEEK FILTERING
     ========================================== */
  const trendingTabs = document.querySelectorAll(".trending-tabs .tab-btn");
  const trendingGrid = document.getElementById("trending-grid");

  if (trendingGrid && trendingTabs.length > 0) {
    const products = trendingGrid.querySelectorAll(".product-card");

    trendingTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const category = tab.textContent.trim().toUpperCase();

        trendingTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        trendingGrid.style.opacity = "0";

        setTimeout(() => {
          products.forEach((product) => {
            if (
              category === "ALL" ||
              product.getAttribute("data-category") === category
            ) {
              product.style.display = "block";
            } else {
              product.style.display = "none";
            }
          });
          trendingGrid.style.opacity = "1";
        }, 300);
      });
    });
  }

  /* ==========================================
     5. NEW ARRIVALS SLIDER
     ========================================== */
  const newArrivalsSlider = () => {
    const grid = document.getElementById("new-arrivals-slider");
    const prev = document.getElementById("new-arrivals-prev");
    const next = document.getElementById("new-arrivals-next");
    if (!grid || !prev || !next) return;

    let currentPage = 0;
    const gap = 15;

    const getCardsPerPage = () => {
      if (window.innerWidth <= 768) return 2;
      return 0; // Desktop: no slider
    };

    const getTotalPages = () => {
      const cards = grid.querySelectorAll(".product-card");
      const perPage = getCardsPerPage();
      if (perPage === 0) return 0;
      return Math.ceil(cards.length / perPage);
    };

    const updateSlider = () => {
      const perPage = getCardsPerPage();
      if (perPage === 0) {
        grid.style.transform = "translateX(0)";
        return;
      }
      const cards = grid.querySelectorAll(".product-card");
      if (cards.length === 0) return;
      const totalPages = getTotalPages();
      if (currentPage < 0) currentPage = 0;
      if (currentPage >= totalPages) currentPage = totalPages - 1;
      const card = cards[0];
      const cardWidth = card.offsetWidth + gap;
      const offset = currentPage * perPage * cardWidth;
      grid.style.transform = `translateX(-${offset}px)`;
    };

    next.addEventListener("click", () => {
      if (currentPage < getTotalPages() - 1) {
        currentPage++;
        updateSlider();
      }
    });

    prev.addEventListener("click", () => {
      if (currentPage > 0) {
        currentPage--;
        updateSlider();
      }
    });

    window.addEventListener("resize", () => {
      currentPage = 0;
      updateSlider();
    });
  };

  newArrivalsSlider();

  /* ==========================================
     5b. CUSTOMER SAY SLIDER
     ========================================== */
  const customerSaySlider = () => {
    const grid = document.querySelector(".testimonials-grid");
    const prevBtn = document.querySelector(".cs-prev");
    const nextBtn = document.querySelector(".cs-next");
    if (!grid || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    const cards = grid.querySelectorAll(".testi-card");
    if (cards.length === 0) return;

    const updateSlider = () => {
      // One card at a time (100% width)
      const offset = currentIndex * 100;
      grid.style.transform = `translateX(-${offset}%)`;
    };

    nextBtn.addEventListener("click", () => {
      if (currentIndex < cards.length - 1) {
        currentIndex++;
        updateSlider();
      }
    });

    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    });

    window.addEventListener("resize", () => {
      currentIndex = 0;
      grid.style.transform = "translateX(0)";
    });
  };

  customerSaySlider();

  /* ==========================================
     6. CART SYSTEM & MINI CART
     ========================================== */
  const miniCartOverlay = document.getElementById("miniCartOverlay");
  const miniCartDrawer = document.getElementById("miniCartDrawer");
  const miniCartClose = document.getElementById("miniCartClose");
  const miniCartItemsCont = document.getElementById("miniCartItems");
  const miniCartSubtotalTxt = document.getElementById("miniCartSubtotal");
  const headerCartIcon = document.getElementById("header-cart-icon");
  const shippingProgressBar = document.getElementById("shippingProgressBar");
  const shippingRemainingTxt = document.getElementById("shippingRemaining");
  const checkoutTimerTxt = document.getElementById("checkoutTimer");

  const toggleMiniCart = (open = null) => {
    if (!miniCartDrawer || !miniCartOverlay) return;
    const shouldOpen =
      open !== null ? open : !miniCartDrawer.classList.contains("active");
    if (shouldOpen) {
      miniCartDrawer.classList.add("active");
      miniCartOverlay.classList.add("active");
      renderMiniCart();
    } else {
      miniCartDrawer.classList.remove("active");
      miniCartOverlay.classList.remove("active");
    }
  };

  if (headerCartIcon)
    headerCartIcon.addEventListener("click", (e) => {
      e.preventDefault();
      toggleMiniCart(true);
    });
  if (miniCartClose)
    miniCartClose.addEventListener("click", () => toggleMiniCart(false));
  if (miniCartOverlay)
    miniCartOverlay.addEventListener("click", () => toggleMiniCart(false));

  const renderMiniCart = () => {
    if (!miniCartItemsCont) return;
    const cart = getCart();
    if (cart.length === 0) {
      miniCartItemsCont.innerHTML =
        '<div class="empty-cart-msg">Your cart is empty.</div>';
      if (miniCartSubtotalTxt) miniCartSubtotalTxt.textContent = "$0.00";
      return;
    }

    let html = "";
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.quantity;
      html += `
        <div class="mini-cart-item">
          <div class="mci-img">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="mci-info">
            <div class="mci-name">${item.name}</div>
            <div class="mci-details">Black / M</div>
            <div class="mci-price">$${item.price.toFixed(2)}</div>
            
            <div class="mci-controls-row">
              <div class="qty-control">
                <button class="qty-btn dec" data-id="${item.id}">-</button>
                <div class="qty-val">${item.quantity}</div>
                <button class="qty-btn inc" data-id="${item.id}">+</button>
              </div>
            </div>
          </div>
          
          <div class="mci-actions">
            <button class="mci-action-btn remove" data-id="${item.id}" title="Remove">
              <img src="assets/icons/delete.svg" alt="delete" style="width: 16px;">
            </button>
            <button class="mci-action-btn edit" data-id="${item.id}" title="Edit">
              <img src="assets/icons/edit.svg" alt="edit" style="width: 16px;">
            </button>
          </div>
        </div>
      `;
    });
    miniCartItemsCont.innerHTML = html;
    if (miniCartSubtotalTxt)
      miniCartSubtotalTxt.textContent = `$${total.toFixed(2)}`;

    updateShippingProgress(total);
    startCheckoutTimer();

    // Add listeners to new buttons (inc/dec)
    miniCartItemsCont.querySelectorAll(".qty-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        let cart = getCart();
        const item = cart.find((i) => i.id === id);
        if (btn.classList.contains("inc")) item.quantity++;
        else if (item.quantity > 1) item.quantity--;
        saveCart(cart);
        renderMiniCart();
        updateCartBadge();
      });
    });

    // Add listeners for removal
    miniCartItemsCont
      .querySelectorAll(".mci-action-btn.remove")
      .forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-id");
          let cart = getCart().filter((i) => i.id !== id);
          saveCart(cart);
          renderMiniCart();
          updateCartBadge();
        });
      });
  };

  const updateShippingProgress = (total) => {
    if (!shippingProgressBar || !shippingRemainingTxt) return;
    const target = 1000;
    const percent = Math.min((total / target) * 100, 100);
    const remaining = Math.max(target - total, 0);

    shippingProgressBar.style.width = `${percent}%`;
    shippingRemainingTxt.textContent = `$${remaining.toFixed(2)}`;
  };

  let checkoutInterval;
  const startCheckoutTimer = () => {
    if (!checkoutTimerTxt || checkoutInterval) return;

    let time = 103; // 1m43s = 103 seconds
    const updateDisplay = () => {
      const m = Math.floor(time / 60);
      const s = time % 60;
      checkoutTimerTxt.textContent = `${m}m${s.toString().padStart(2, "0")}s`;
    };

    updateDisplay();
    checkoutInterval = setInterval(() => {
      time--;
      if (time <= 0) {
        clearInterval(checkoutInterval);
        checkoutInterval = null;
        checkoutTimerTxt.textContent = "EXPIRED";
        return;
      }
      updateDisplay();
    }, 1000);
  };

  // Global "Add to Cart" listener
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-to-cart-btn");
    if (btn) {
      e.preventDefault();
      const id = btn.getAttribute("data-id");
      const name = btn.getAttribute("data-name");
      const price = parseFloat(btn.getAttribute("data-price"));
      const image = btn.getAttribute("data-image");

      let cart = getCart();
      const existing = cart.find((i) => i.id === id);
      if (existing) existing.quantity++;
      else cart.push({ id, name, price, image, quantity: 1 });

      saveCart(cart);
      updateCartBadge();
      toggleMiniCart(true);
    }
  });

  /* ==========================================
     7. MISC UI (MOBILE MENU, ACCORDIONS)
     ========================================== */
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const mobileMenuWrapper = document.getElementById("mobileMenuWrapper");
  const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
  const mmCloseBtns = document.querySelectorAll(".mm-close-btn");

  const toggleMobileMenu = (open = null) => {
    if (!mobileMenuWrapper || !mobileMenuOverlay) return;
    const shouldOpen =
      open !== null ? open : !mobileMenuWrapper.classList.contains("active");
    if (shouldOpen) {
      mobileMenuWrapper.classList.add("active");
      mobileMenuOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    } else {
      mobileMenuWrapper.classList.remove("active");
      mobileMenuOverlay.classList.remove("active");
      document.body.style.overflow = "";
      // Reset submenu state when closing
      setTimeout(resetSubmenus, 300);
    }
  };

  if (mobileMenuBtn)
    mobileMenuBtn.addEventListener("click", () => toggleMobileMenu(true));
  mmCloseBtns.forEach((btn) =>
    btn.addEventListener("click", () => toggleMobileMenu(false)),
  );
  if (mobileMenuOverlay)
    mobileMenuOverlay.addEventListener("click", () => toggleMobileMenu(false));

  /* --- Mobile Menu Interactions --- */
  const mmTabs = document.querySelectorAll(".mm-tab");
  const mmMainContainer = document.querySelector(".mm-main-container");
  const mmPanels = document.querySelectorAll(".mm-panel");
  const hasSubmenuItems = document.querySelectorAll(".has-submenu");
  const mmBackBtns = document.querySelectorAll(".mm-back");

  mmTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      mmTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      // Handle tab content switching if needed (currently only Menu is implemented)
    });
  });

  hasSubmenuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      const submenuId = item.getAttribute("data-submenu");
      if (submenuId) {
        e.preventDefault();
        const submenuPanel = document.getElementById(submenuId);
        if (submenuPanel) {
          submenuPanel.classList.add("active");
        }
      }
    });
  });

  mmBackBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = btn.closest(".mm-panel");
      if (panel && panel.classList.contains("mm-submenu")) {
        panel.classList.remove("active");
      }
    });
  });

  const resetSubmenus = () => {
    document.querySelectorAll(".mm-submenu.active").forEach((panel) => {
      panel.classList.remove("active");
    });
  };

  // Language/Currency toggles
  const mmOptions = document.querySelectorAll(".mm-option");
  mmOptions.forEach((opt) => {
    opt.addEventListener("click", () => {
      const parent = opt.parentElement;
      parent
        .querySelectorAll(".mm-option")
        .forEach((o) => o.classList.remove("active"));
      opt.classList.add("active");
    });
  });

  const accordions = document.querySelectorAll(".footer-col.accordion");
  accordions.forEach((acc) => {
    const title = acc.querySelector(".footer-title");
    if (title) {
      title.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          acc.classList.toggle("active");
        }
      });
    }
  });
});
