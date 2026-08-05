(() => {
  "use strict";

  const app = document.getElementById("app");
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  const menuToggle = document.getElementById("menu-toggle");
  const breadcrumbCurrent = document.getElementById("breadcrumb-current");
  const searchTrigger = document.getElementById("search-trigger");
  const searchModal = document.getElementById("search-modal");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  const searchEmpty = document.getElementById("search-empty");
  const notifBtn = document.getElementById("notif-btn");
  const notifPanel = document.getElementById("notif-panel");
  const notifBackdrop = document.getElementById("notif-backdrop");
  const notifClose = document.getElementById("notif-close");
  const notifDot = document.getElementById("notif-dot");
  const notifBadge = document.getElementById("notif-badge");
  const markReadBtn = document.getElementById("mark-read-btn");
  const toastRegion = document.getElementById("toast-region");
  const heroDate = document.getElementById("hero-date");
  const greeting = document.getElementById("greeting");

  const filterable = document.querySelectorAll("[data-search]");
  let liveFilter = "";
  let lastFocus = null;

  /* ---------- Helpers ---------- */

  function showToast(message, variant = "success") {
    if (!message) return;
    const toast = document.createElement("div");
    toast.className = `toast is-${variant}`;
    toast.textContent = message;
    toastRegion.appendChild(toast);
    window.setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(6px)";
      toast.style.transition = "opacity 160ms ease, transform 160ms ease";
      window.setTimeout(() => toast.remove(), 180);
    }, 2600);
  }

  function openModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    lastFocus = document.activeElement;
    el.hidden = false;
    const focusable =
      el.querySelector("input, textarea, select") ||
      el.querySelector("button, [href], [tabindex]:not([tabindex='-1'])");
    if (focusable) focusable.focus();
    document.body.style.overflow = "hidden";
  }

  function closeModal(el) {
    if (!el || el.hidden) return;
    el.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function closeAllModals() {
    document.querySelectorAll(".modal-backdrop").forEach((el) => {
      el.hidden = true;
    });
    document.body.style.overflow = "";
  }

  function setSidebarOpen(open) {
    app.classList.toggle("is-sidebar-open", open);
    backdrop.hidden = !open;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  }

  function setActiveNav(name) {
    document.querySelectorAll(".nav-item[data-nav]").forEach((item) => {
      const active = item.dataset.nav === name;
      item.classList.toggle("is-active", active);
      if (active) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
    breadcrumbCurrent.textContent = name;
  }

  function applyDashboardFilter(query) {
    liveFilter = query.trim().toLowerCase();
    let visible = 0;
    filterable.forEach((el) => {
      if (el.closest(".notif-drawer") || el.closest(".modal-backdrop")) return;
      const hay = (el.dataset.search || el.textContent || "").toLowerCase();
      const match = !liveFilter || hay.includes(liveFilter);
      el.classList.toggle("is-filtered-out", !match);
      if (match) visible += 1;
    });
    searchEmpty.hidden = !liveFilter || visible > 0;
  }

  function buildSearchIndex() {
    const items = [];
    document.querySelectorAll(".attention-item, .followup-item, .ops-item, .activity-item, .kpi-card, .workload-item").forEach((el) => {
      const title =
        el.querySelector(".attention-title, .followup-title, .ops-title, .activity-title, .kpi-label, .workload-name")
          ?.textContent?.trim() || "Result";
      const meta =
        el.querySelector(".attention-meta, .followup-meta, .ops-status, .activity-meta, .kpi-meta, .workload-meta")
          ?.textContent?.trim() || "";
      items.push({
        title,
        meta,
        search: `${el.dataset.search || ""} ${title} ${meta}`.toLowerCase(),
        el,
      });
    });
    return items;
  }

  const searchIndex = buildSearchIndex();

  function renderSearchResults(query) {
    const q = query.trim().toLowerCase();
    searchResults.innerHTML = "";
    if (!q) {
      searchResults.innerHTML = `<li class="search-hint" style="border:0;list-style:none;padding:12px 16px">Type to search the dashboard.</li>`;
      return;
    }
    const matches = searchIndex.filter((item) => item.search.includes(q)).slice(0, 8);
    if (!matches.length) {
      searchResults.innerHTML = `<li class="search-hint" style="border:0;list-style:none;padding:12px 16px">No matches for “${query.replace(/[<>&]/g, "")}”.</li>`;
      return;
    }
    matches.forEach((item, i) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `search-result${i === 0 ? " is-active" : ""}`;
      btn.setAttribute("role", "option");
      btn.innerHTML = `<span class="search-result-title"></span><span class="search-result-meta"></span>`;
      btn.querySelector(".search-result-title").textContent = item.title;
      btn.querySelector(".search-result-meta").textContent = item.meta;
      btn.addEventListener("click", () => {
        closeModal(searchModal);
        applyDashboardFilter(q);
        item.el.scrollIntoView({ behavior: "smooth", block: "center" });
        item.el.classList.add("is-interactive");
        showToast(`Showing “${item.title}”`);
      });
      li.appendChild(btn);
      searchResults.appendChild(li);
    });
  }

  /* ---------- Greeting / date ---------- */

  function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const part = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
    greeting.textContent = `Good ${part}, Vrushabh`;

    const weekday = now.toLocaleDateString("en-GB", { weekday: "long" });
    const day = now.getDate();
    const month = now.toLocaleDateString("en-GB", { month: "long" });
    heroDate.textContent = `${weekday} · ${day} ${month}`;
  }

  updateGreeting();

  /* ---------- Navigation ---------- */

  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const name = el.dataset.nav;
      if (!name) return;
      if (el.tagName === "A") e.preventDefault();
      setActiveNav(name);
      setSidebarOpen(false);
      showToast(`Opened ${name}`);
      if (name === "Home" || name === "Inbox") {
        applyDashboardFilter("");
        searchInput.value = "";
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });

  menuToggle.addEventListener("click", () => {
    setSidebarOpen(!app.classList.contains("is-sidebar-open"));
  });

  backdrop.addEventListener("click", () => setSidebarOpen(false));

  /* ---------- Notifications ---------- */

  function openNotif() {
    lastFocus = document.activeElement;
    notifPanel.hidden = false;
    notifBackdrop.hidden = false;
    notifBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    const focusTarget = notifClose || markReadBtn;
    if (focusTarget) focusTarget.focus();
  }

  function closeNotif() {
    if (notifPanel.hidden) return;
    notifPanel.hidden = true;
    notifBackdrop.hidden = true;
    notifBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function updateUnreadUI() {
    const count = document.querySelectorAll(".notif-item.is-unread").length;
    if (count === 0) {
      notifDot.classList.add("is-hidden");
      notifBadge.classList.add("is-hidden");
      notifBtn.setAttribute("aria-label", "Notifications, no unread");
    } else {
      notifDot.classList.remove("is-hidden");
      notifBadge.classList.remove("is-hidden");
      notifBadge.textContent = `${count} new`;
      notifBtn.setAttribute("aria-label", `Notifications, ${count} unread`);
    }
  }

  notifBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (notifPanel.hidden) openNotif();
    else closeNotif();
  });

  notifClose.addEventListener("click", closeNotif);
  notifBackdrop.addEventListener("click", closeNotif);

  markReadBtn.addEventListener("click", () => {
    document.querySelectorAll(".notif-item.is-unread").forEach((item) => item.classList.remove("is-unread"));
    updateUnreadUI();
    showToast("All notifications marked as read");
  });

  /* ---------- Search ---------- */

  function openSearch() {
    closeNotif();
    openModal("search-modal");
    searchInput.value = liveFilter;
    renderSearchResults(liveFilter);
    searchInput.focus();
    searchInput.select();
  }

  searchTrigger.addEventListener("click", openSearch);

  searchInput.addEventListener("input", () => {
    renderSearchResults(searchInput.value);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const q = searchInput.value.trim();
      closeModal(searchModal);
      applyDashboardFilter(q);
      if (q) showToast(`Filtered dashboard for “${q}”`);
      else showToast("Cleared search filter");
    }
  });

  /* ---------- Modals ---------- */

  document.querySelectorAll("[data-open-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = `modal-${btn.dataset.openModal}`;
      openModal(id);
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      closeModal(btn.closest(".modal-backdrop"));
    });
  });

  document.querySelectorAll(".modal-backdrop").forEach((backdropEl) => {
    backdropEl.addEventListener("click", (e) => {
      if (e.target === backdropEl) closeModal(backdropEl);
    });
  });

  document.getElementById("sign-out-btn").addEventListener("click", () => {
    openModal("modal-sign-out");
  });

  document.getElementById("confirm-sign-out").addEventListener("click", () => {
    closeAllModals();
    showToast("Signed out of Paryatech");
  });

  /* ---------- New customer modal ---------- */

  const customerForm = document.getElementById("customer-form");
  const customerNameInput = document.getElementById("customer-name");
  const customerFormError = document.getElementById("customer-form-error");
  const customerFormErrorText = document.getElementById("customer-form-error-text");
  const tierRow = document.getElementById("tier-row");
  const tierAddBtn = document.getElementById("tier-add");
  const customerModal = document.getElementById("modal-new-customer");

  const TIER_COLORS = ["tier-platinum", "tier-gold", "tier-repeat", "tier-corporate", "tier-vip"];

  function setSelectCard(group, value) {
    const root = customerForm.querySelector(`[data-select-group="${group}"]`);
    if (!root) return;
    root.querySelectorAll(".select-card").forEach((card) => {
      const selected = card.dataset.value === value;
      card.classList.toggle("is-selected", selected);
      card.setAttribute("aria-checked", String(selected));
    });
    const hidden = document.getElementById(
      group === "category" ? "customer-category" : "customer-source"
    );
    if (hidden) hidden.value = value;
  }

  function showCustomerError(message) {
    customerFormErrorText.textContent = message;
    customerFormError.hidden = false;
    customerNameInput.closest(".input")?.classList.add("is-invalid");
  }

  function clearCustomerError() {
    customerFormError.hidden = true;
    customerNameInput.closest(".input")?.classList.remove("is-invalid");
  }

  function resetCustomerForm() {
    customerForm.reset();
    setSelectCard("category", "b2c");
    setSelectCard("source", "person");
    document.getElementById("customer-code").value = "CUST-0017";
    customerForm.querySelectorAll(".pref-chip.is-selected").forEach((chip) => {
      chip.classList.remove("is-selected");
      chip.setAttribute("aria-pressed", "false");
    });
    clearCustomerError();
  }

  customerForm.querySelectorAll("[data-select-group]").forEach((group) => {
    group.addEventListener("click", (e) => {
      const card = e.target.closest(".select-card");
      if (!card || !group.contains(card)) return;
      setSelectCard(group.dataset.selectGroup, card.dataset.value);
    });
  });

  customerForm.querySelectorAll("[data-chip-group]").forEach((row) => {
    row.addEventListener("click", (e) => {
      const chip = e.target.closest(".pref-chip");
      if (!chip || !row.contains(chip)) return;
      const multi = row.dataset.multi === "true";
      if (multi) {
        const on = !chip.classList.contains("is-selected");
        chip.classList.toggle("is-selected", on);
        chip.setAttribute("aria-pressed", String(on));
      } else {
        row.querySelectorAll(".pref-chip").forEach((c) => {
          const on = c === chip && !c.classList.contains("is-selected");
          c.classList.toggle("is-selected", on);
          c.setAttribute("aria-pressed", String(on));
        });
      }
    });
  });

  customerForm.querySelectorAll(".pref-chip").forEach((chip) => {
    chip.setAttribute("aria-pressed", "false");
  });

  tierRow.addEventListener("click", (e) => {
    const remove = e.target.closest(".tier-remove");
    if (!remove) return;
    remove.closest(".tier-chip")?.remove();
  });

  tierAddBtn.addEventListener("click", () => {
    const label = window.prompt("New tier name");
    if (!label || !label.trim()) return;
    const name = label.trim();
    const color = TIER_COLORS[tierRow.querySelectorAll(".tier-chip").length % TIER_COLORS.length];
    const chip = document.createElement("span");
    chip.className = "tier-chip";
    chip.dataset.tier = name;
    chip.innerHTML = `<span class="tier-dot ${color}"></span>${name}<button type="button" class="tier-remove" aria-label="Remove ${name}">&times;</button>`;
    tierRow.insertBefore(chip, tierAddBtn);
  });

  customerNameInput.addEventListener("input", () => {
    if (customerNameInput.value.trim()) clearCustomerError();
  });

  customerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = customerNameInput.value.trim();
    if (!name) {
      showCustomerError("Customer name is required.");
      customerNameInput.focus();
      return;
    }
    closeModal(customerModal);
    resetCustomerForm();
    showToast(`Customer “${name}” created`);
  });

  customerModal.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.setTimeout(() => {
        if (customerModal.hidden) clearCustomerError();
      }, 0);
    });
  });

  document.getElementById("query-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const dest = data.get("destination");
    closeModal(document.getElementById("modal-new-query"));
    e.target.reset();
    showToast(`Query for “${dest}” created`);
  });

  /* ---------- Inline actions ---------- */

  document.querySelectorAll("[data-toast]").forEach((el) => {
    const fire = () => showToast(el.dataset.toast);
    el.addEventListener("click", fire);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fire();
      }
    });
  });

  /* ---------- Global keyboard ---------- */

  document.addEventListener("keydown", (e) => {
    const metaK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
    if (metaK) {
      e.preventDefault();
      openSearch();
      return;
    }

    if (e.key === "Escape") {
      if (!searchModal.hidden) {
        closeModal(searchModal);
        return;
      }
      const openModalEl = [...document.querySelectorAll(".modal-backdrop")].find((m) => !m.hidden);
      if (openModalEl) {
        closeModal(openModalEl);
        return;
      }
      if (!notifPanel.hidden) {
        closeNotif();
        return;
      }
      if (app.classList.contains("is-sidebar-open")) {
        setSidebarOpen(false);
        return;
      }
      if (liveFilter) {
        applyDashboardFilter("");
        showToast("Cleared search filter");
      }
    }
  });

  /* ---------- Resize ---------- */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) setSidebarOpen(false);
  });
})();
