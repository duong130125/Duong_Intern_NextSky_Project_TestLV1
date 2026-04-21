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

    let currentIndex = 0;
    const cards = grid.querySelectorAll(".product-card");

    const getVisibleCount = () => {
      if (window.innerWidth >= 1024) return 4;
      if (window.innerWidth >= 768) return 2;
      return 1;
    };

    const updateSlider = () => {
      const visibleCount = getVisibleCount();
      const cardWidth = grid.offsetWidth / visibleCount;
      grid.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    };

    next.addEventListener("click", () => {
      const visibleCount = getVisibleCount();
      if (currentIndex < cards.length - visibleCount) {
        currentIndex++;
        updateSlider();
      }
    });

    prev.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    });

    window.addEventListener("resize", () => {
      currentIndex = 0;
      updateSlider();
    });
  };

  newArrivalsSlider();

  /* ==========================================
     6. CART SYSTEM & MINI CART
     ========================================== */
  const miniCartOverlay = document.getElementById("miniCartOverlay");
  const miniCartDrawer = document.getElementById("miniCartDrawer");
  const miniCartClose = document.getElementById("miniCartClose");
  const miniCartItemsCont = document.getElementById("miniCartItems");
  const miniCartSubtotalTxt = document.getElementById("miniCartSubtotal");
  const headerCartIcon = document.getElementById("header-cart-icon");

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
          <div class="mci-img"><img src="${item.image}" alt="${item.name}"></div>
          <div class="mci-info">
            <div class="mci-name">${item.name}</div>
            <div class="mci-price">$${item.price.toFixed(2)}</div>
            <div class="mci-controls">
              <div class="qty-control">
                <button class="qty-btn dec" data-id="${item.id}">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn inc" data-id="${item.id}">+</button>
              </div>
              <button class="mci-remove" data-id="${item.id}"><i class="fa-solid fa-trash-can"></i></button>
            </div>
          </div>
        </div>
      `;
    });
    miniCartItemsCont.innerHTML = html;
    if (miniCartSubtotalTxt)
      miniCartSubtotalTxt.textContent = `$${total.toFixed(2)}`;

    // Add listeners to new buttons
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

    miniCartItemsCont.querySelectorAll(".mci-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        let cart = getCart().filter((i) => i.id !== id);
        saveCart(cart);
        renderMiniCart();
        updateCartBadge();
      });
    });
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
  const mobileMenuClose = document.getElementById("mobileMenuClose");

  const toggleMobileMenu = () => {
    if (!mobileMenuWrapper || !mobileMenuOverlay) return;
    mobileMenuWrapper.classList.toggle("active");
    mobileMenuOverlay.classList.toggle("active");
  };

  if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", toggleMobileMenu);
  if (mobileMenuClose)
    mobileMenuClose.addEventListener("click", toggleMobileMenu);
  if (mobileMenuOverlay)
    mobileMenuOverlay.addEventListener("click", toggleMobileMenu);

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
