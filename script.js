(() => {
  "use strict";

  const app = document.getElementById("app");
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  const menuToggle = document.getElementById("menu-toggle");
  const breadcrumbRoot = document.getElementById("breadcrumb-root");
  const breadcrumbCurrent = document.getElementById("breadcrumb-current");
  const breadcrumbMid = document.getElementById("breadcrumb-mid");
  const breadcrumbSepMid = document.getElementById("breadcrumb-sep-mid");
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
  const newGreeting = document.getElementById("new-greeting");
  const newHeroDate = document.getElementById("new-hero-date");
  const dashboardReturning = document.getElementById("dashboard-returning");
  const dashboardNew = document.getElementById("dashboard-new");
  const viewTeam = document.getElementById("view-team");
  const viewBookings = document.getElementById("view-bookings");
  const viewQueries = document.getElementById("view-queries");
  const bookingsListEl = document.getElementById("bookings-list");
  const bookingsDetailEl = document.getElementById("bookings-detail");
  const viewingAs = document.getElementById("viewing-as");
  const homeAs = document.getElementById("home-as");
  const teamPageTitle = document.getElementById("team-page-title");
  const teamPageSub = document.getElementById("team-page-sub");
  const teamPageExport = document.getElementById("team-page-export");
  const teamPagePrimaryCta = document.getElementById("team-page-primary-cta");
  const checklistList = document.getElementById("checklist-list");
  const setupProgressMeta = document.getElementById("setup-progress-meta");
  const setupProgressPct = document.getElementById("setup-progress-pct");
  const setupProgressFill = document.getElementById("setup-progress-fill");
  const setupProgressBar = document.getElementById("setup-progress-bar");
  const setupChecklistCard = document.getElementById("setup-checklist");
  const continueSetupBtn = document.getElementById("continue-setup-btn");
  const viewChecklistBtn = document.getElementById("view-checklist-btn");

  const STORAGE = {
    customers: "paryatech_demo_customers",
    queries: "paryatech_demo_queries",
    bookings: "paryatech_demo_bookings",
    checklist: "paryatech_setup_checklist",
    homeDensity: "paryatech_home_density",
  };

  const CHECKLIST_ITEMS = [
    { id: "business", label: "Add business and tax details", defaultDone: true },
    { id: "customers", label: "Add or import customers" },
    { id: "query", label: "Create the first query" },
    { id: "vendors", label: "Add vendors" },
    { id: "team", label: "Invite team members" },
    { id: "branding", label: "Configure proposal branding" },
    { id: "channels", label: "Connect WhatsApp or Email" },
  ];

  let currentView = "returning";
  let currentShell = "home";

  const filterable = document.querySelectorAll("#dashboard-returning [data-search]");
  let liveFilter = "";
  let lastFocus = null;

  const TEAM_TABS = {
    overview: {
      title: "Team",
      sub: "8 people · Paryatech — performance, live queries and access in one place.",
      export: true,
      primary: { action: "assign", label: "Assign enquiries", ownerAdmin: true },
    },
    goals: {
      title: "Goals & targets",
      sub: "Quarter attainment for the agency and each member.",
      export: true,
      primary: { action: "set-targets", label: "Set targets", ownerAdmin: true },
    },
    org: {
      title: "Org chart",
      sub: "Who reports to whom across International and Domestic.",
      export: true,
      primary: null,
    },
    roles: {
      title: "Roles & access",
      sub: "Permissions by role and who holds each role.",
      export: true,
      primary: null,
    },
    invitations: {
      title: "Invitations",
      sub: "Pending invites and member onboarding until ready for work.",
      export: false,
      primary: { action: "invite", label: "+ Invite" },
    },
    audit: {
      title: "Audit log",
      sub: "Workspace activity across operations, finance, access, and security.",
      export: false,
      primary: { action: "export-csv", label: "Export CSV", ownerAdmin: true },
    },
    myview: {
      title: "My view",
      sub: "Your current workload, role-relevant performance, goals, and activity.",
      export: true,
      primary: null,
    },
  };

  const TEAM_CTA_ICONS = {
    assign: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/><path d="M3 3v3h3"/></svg>`,
    "set-targets": `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>`,
    invite: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>`,
    "export-csv": `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  };

  const BOOKING_DETAIL_TABS = {
    overview: true,
    services: true,
    travellers: true,
    documents: true,
    finance: true,
    vouchers: true,
    communication: true,
    activity: true,
  };

  const DEMO_OWNER = { initials: "VJ", name: "Vrushabh Jain", id: "vrushabh" };

  const BOOKING_ISSUE_LABELS = {
    supplier: "Supplier",
    documents: "Documents",
    vouchers: "Vouchers",
    customer_payment: "Customer payment",
    supplier_payment: "Supplier payment",
  };

  const BOOKING_ISSUE_CHIP_LIMIT = 2;

  const BOOKING_MONEY_ISSUE_KEYS = new Set(["customer_payment", "supplier_payment"]);

  const BOOKING_CONFIRM_META = {
    supplier: { label: "Supplier", tab: "services", openToast: "Attach vouchers, then confirm each vendor…" },
    voucher: { label: "Voucher", tab: "vouchers", openToast: "Opening traveller vouchers…" },
    documents: { label: "Documents", tab: "documents", openToast: "Opening documents…" },
  };

  const SERVICE_TYPES = {
    trip: "Trip",
    flight: "Flight",
    hotel: "Hotel",
    visa: "Visa",
    cruise: "Cruise",
    transport: "Transport",
  };

  const SERVICE_TYPE_KEYS = Object.keys(SERVICE_TYPES);

  const SERVICE_CATALOG = [
    {
      id: "cat-airport-transfer",
      type: "transport",
      name: "Airport transfer",
      vendor: "City Transfer Desk",
      vendorContact: "+91 98xxx 70001",
      vendorEmail: "desk@citytransfer.in",
      serviceDetail: "Private airport transfer · sedan",
      cost: 4500,
      paymentTerms: { kind: "schedule", schedule: [{ id: "cat-tr-full", label: "Full", percent: 100, trigger: "on_confirm" }] },
      vouchers: [{ name: "Transfer voucher", attached: false, fileName: "" }],
    },
    {
      id: "cat-day-excursion",
      type: "trip",
      name: "Day excursion",
      vendor: "Local Excursions Co",
      vendorContact: "+91 98xxx 70002",
      vendorEmail: "ops@localexcursions.in",
      serviceDetail: "Half-day guided excursion · entrance excluded",
      cost: 9000,
      paymentTerms: { kind: "unknown" },
      vouchers: [{ name: "Excursion voucher", attached: false, fileName: "" }],
    },
    {
      id: "cat-visa-assist",
      type: "visa",
      name: "Visa assistance",
      vendor: "Visa Assist Desk",
      vendorContact: "+91 98xxx 70003",
      vendorEmail: "visa@paryatech.in",
      serviceDetail: "Tourist visa filing assistance · docs checklist",
      cost: 3500,
      paymentTerms: { kind: "schedule", schedule: [{ id: "cat-visa-full", label: "Full", percent: 100, trigger: "on_confirm" }] },
      vouchers: [{ name: "Visa filing receipt", attached: false, fileName: "" }],
    },
  ];

  /** Alternate vendors by service type — used when deal is not yet confirmed. */
  const VENDOR_ALTERNATES = {
    hotel: [
      { vendor: "Skyline Stays", vendorContact: "+971 4 555 2200", vendorEmail: "book@skylinestays.ae", serviceDetail: "City hotel · twin rooms · breakfast", cost: 31000, paymentTerms: { kind: "schedule", schedule: [{ id: "alt-h1", label: "On confirmation", percent: 50, trigger: "on_confirm" }, { id: "alt-h2", label: "Balance", percent: 50, trigger: "before_checkin", daysBefore: 7 }] } },
      { vendor: "Harbour Inn", vendorContact: "+971 4 555 3300", vendorEmail: "ops@harbourinn.ae", serviceDetail: "Harbour-view rooms · breakfast", cost: 29500, paymentTerms: { kind: "unknown" } },
      { vendor: "Palm Court Hotel", vendorContact: "+971 4 555 4400", vendorEmail: "reservations@palmcourt.ae", serviceDetail: "Family rooms · breakfast", cost: 34000, paymentTerms: { kind: "schedule", schedule: [{ id: "alt-h3", label: "Full", percent: 100, trigger: "on_confirm" }] } },
    ],
    transport: [
      { vendor: "Desert Wheels", vendorContact: "+971 50 555 2211", vendorEmail: "desk@desertwheels.ae", serviceDetail: "Airport arrival + departure · private van", cost: 6500, paymentTerms: { kind: "unknown" } },
      { vendor: "Gulf Ride Co", vendorContact: "+971 50 555 8890", vendorEmail: "ops@gulfride.ae", serviceDetail: "Private airport transfers · SUV", cost: 7200, paymentTerms: { kind: "schedule", schedule: [{ id: "alt-t1", label: "Full", percent: 100, trigger: "on_confirm" }] } },
      { vendor: "City Transfer Desk", vendorContact: "+91 98xxx 70001", vendorEmail: "desk@citytransfer.in", serviceDetail: "Private airport transfer · sedan", cost: 4500, paymentTerms: { kind: "schedule", schedule: [{ id: "alt-t2", label: "Full", percent: 100, trigger: "on_confirm" }] } },
    ],
    flight: [
      { vendor: "SkyBridge Air", vendorContact: "+91 22xxx 11001", vendorEmail: "groups@skybridge.air", serviceDetail: "Group air seats · economy", cost: 42000, paymentTerms: { kind: "schedule", schedule: [{ id: "alt-f1", label: "On confirmation", percent: 100, trigger: "on_confirm" }] } },
      { vendor: "AeroDesk Partners", vendorContact: "+91 22xxx 11002", vendorEmail: "desk@aerodesk.in", serviceDetail: "Scheduled flight block · economy", cost: 40500, paymentTerms: { kind: "unknown" } },
    ],
    visa: [
      { vendor: "Visa Assist Desk", vendorContact: "+91 98xxx 70003", vendorEmail: "visa@paryatech.in", serviceDetail: "Tourist visa filing assistance", cost: 3500, paymentTerms: { kind: "schedule", schedule: [{ id: "alt-v1", label: "Full", percent: 100, trigger: "on_confirm" }] } },
      { vendor: "Border Paperworks", vendorContact: "+91 98xxx 70044", vendorEmail: "ops@borderpaper.in", serviceDetail: "Visa filing + appointment support", cost: 4200, paymentTerms: { kind: "unknown" } },
    ],
    cruise: [
      { vendor: "Backwater Co", vendorContact: "+91 47xxx 88002", vendorEmail: "book@backwaterco.in", serviceDetail: "Houseboat · all meals", cost: 72000, paymentTerms: { kind: "schedule", schedule: [{ id: "alt-c1", label: "Full", percent: 100, trigger: "on_confirm" }] } },
      { vendor: "Lagoon Cruise Desk", vendorContact: "+91 47xxx 88055", vendorEmail: "desk@lagooncruise.in", serviceDetail: "Overnight cruise · meals included", cost: 68000, paymentTerms: { kind: "unknown" } },
    ],
    trip: [
      { vendor: "Local Excursions Co", vendorContact: "+91 98xxx 70002", vendorEmail: "ops@localexcursions.in", serviceDetail: "Half-day guided excursion", cost: 9000, paymentTerms: { kind: "unknown" } },
      { vendor: "Ground Ops Partner", vendorContact: "+91 98xxx 70066", vendorEmail: "ground@ops-partner.in", serviceDetail: "Ground package · guide + transfers", cost: 12000, paymentTerms: { kind: "schedule", schedule: [{ id: "alt-tr1", label: "Full", percent: 100, trigger: "on_confirm" }] } },
    ],
  };

  const BOOKING_PHASE_RANK = {
    upcoming: 0,
    travelling: 1,
    completed: 2,
    cancelled: 3,
  };

  /** Destination cover images for Overview banner (Proposal-style). */
  const BOOKING_DESTINATION_COVERS = {
    Dubai:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
    Ladakh:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80",
    Kerala:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80",
    Goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80",
    Manali:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80",
    Tripura:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80",
    Jaipur:
      "https://images.unsplash.com/photo-1477587458883-7a23e8f7eef9?auto=format&fit=crop&w=1600&q=80",
  };

  function bookingCoverImage(booking) {
    if (booking?.coverImage) return booking.coverImage;
    const dest = String(booking?.destination || "").trim();
    return BOOKING_DESTINATION_COVERS[dest] || "";
  }

  const DEMO_STAFF = {
    vrushabh: DEMO_OWNER,
    neha: { initials: "NK", name: "Neha Kapoor", id: "neha", avatarClass: "avatar-mint" },
    meera: { initials: "MI", name: "Meera Iyer", id: "meera", avatarClass: "avatar-mint" },
  };

  const QUERY_STAGES = [
    { id: "new_inquiry", label: "New Inquiry", dot: "#94a3b8" },
    { id: "in_progress", label: "In Progress", dot: "#94a3b8" },
    { id: "proposal_sent", label: "Proposal Sent", dot: "#94a3b8" },
    { id: "follow_up", label: "Follow Up", dot: "#94a3b8" },
    { id: "confirmed", label: "Confirmed", dot: "#94a3b8" },
    { id: "completed", label: "Completed", dot: "#94a3b8", showTotal: true },
    { id: "lost", label: "Lost", dot: "#94a3b8" },
  ];

  const QUERY_STAGE_LABELS = Object.fromEntries(QUERY_STAGES.map((s) => [s.id, s.label]));

  let QUERIES = [
    {
      id: "Q-1040",
      title: "Tripura Trip",
      customer: "Jain Family",
      stage: "confirmed",
      value: 0,
      status: "Pending Us",
      attention: "amber",
      ownerId: "vrushabh",
      updatedAt: Date.now() - 16 * 24 * 60 * 60 * 1000,
    },
    {
      id: "Q-1041",
      title: "Ladakh Trip",
      customer: "Jain Family",
      stage: "completed",
      value: 1000000,
      status: "Pending Us",
      attention: "green",
      ownerId: "vrushabh",
      updatedAt: Date.now() - 23 * 24 * 60 * 60 * 1000,
    },
    {
      id: "Q-1042",
      title: "Dubai Trip",
      customer: "XYZ Family",
      stage: "completed",
      value: 100000,
      status: "Pending Us",
      attention: "amber",
      ownerId: "vrushabh",
      updatedAt: Date.now() - 23 * 24 * 60 * 60 * 1000,
    },
  ];

  const queriesState = {
    scope: "mine",
    view: "kanban",
    search: "",
    createOpen: false,
  };

  function getQueriesViewerOwnerId() {
    const role = viewQueries?.dataset.viewingAs || viewTeam?.dataset.viewingAs || "Owner";
    if (role === "Member") return "meera";
    if (role === "Admin") return "neha";
    return "vrushabh";
  }

  function queryOwner(query) {
    return DEMO_STAFF[query.ownerId] || DEMO_OWNER;
  }

  function formatQueryRelativeTime(ts) {
    const diff = Math.max(0, Date.now() - Number(ts || Date.now()));
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    if (days <= 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  }

  function formatQueryPipelineValue(amount) {
    const n = Math.round(Number(amount) || 0);
    return `₹${n.toLocaleString("en-IN")}`;
  }

  function syncQueriesCreateMode() {
    const pipeline = document.getElementById("queries-pipeline");
    const create = document.getElementById("queries-create");
    if (pipeline) pipeline.hidden = !!queriesState.createOpen;
    if (create) create.hidden = !queriesState.createOpen;
    if (viewQueries) {
      viewQueries.dataset.createMode = queriesState.createOpen ? "true" : "false";
    }
  }

  function syncQueriesCreateRoundTripLabel(on) {
    const state = document.getElementById("qc-round-trip-state");
    if (state) state.textContent = on ? "On" : "Off";
  }

  function clearQueriesCreateFieldError(field) {
    if (!field) return;
    field.classList.remove("is-error");
    const err = field.querySelector(".queries-create-field-error");
    if (err) err.hidden = true;
  }

  function setQueriesCreateFieldError(field, show) {
    if (!field) return;
    field.classList.toggle("is-error", show);
    const err = field.querySelector(".queries-create-field-error");
    if (err) err.hidden = !show;
  }

  function validateQueriesCreateRequired({ report = false } = {}) {
    const ids = ["qc-customer", "qc-from", "qc-to"];
    let firstInvalid = null;
    let allValid = true;
    ids.forEach((id) => {
      const input = document.getElementById(id);
      const field = input?.closest("[data-qc-required]");
      const valid = Boolean(input?.value);
      if (!valid) {
        allValid = false;
        if (!firstInvalid) firstInvalid = input;
      }
      if (report) setQueriesCreateFieldError(field, !valid);
      else if (valid) clearQueriesCreateFieldError(field);
    });
    return { allValid, firstInvalid };
  }

  function resetQueriesCreateForm() {
    const form = document.getElementById("queries-create-form");
    if (!form) return;
    form.reset();
    const roundTrip = document.getElementById("qc-round-trip");
    const roundTripValue = document.getElementById("qc-round-trip-value");
    if (roundTrip) roundTrip.setAttribute("aria-checked", "false");
    if (roundTripValue) roundTripValue.value = "false";
    syncQueriesCreateRoundTripLabel(false);
    form.querySelectorAll("[data-time-chip]").forEach((chip) => {
      chip.setAttribute("aria-pressed", "false");
    });
    const times = document.getElementById("qc-preferred-times");
    if (times) times.value = "";
    const customer = document.getElementById("qc-customer");
    const from = document.getElementById("qc-from");
    const to = document.getElementById("qc-to");
    if (customer) customer.value = "";
    if (from) from.value = "";
    if (to) to.value = "";
    form.querySelectorAll("[data-qc-required]").forEach((field) => clearQueriesCreateFieldError(field));
    updateQueriesCreateSubmitState();
  }

  function updateQueriesCreateSubmitState() {
    const { allValid } = validateQueriesCreateRequired({ report: false });
    document.querySelectorAll(".queries-create-submit").forEach((btn) => {
      btn.disabled = !allValid;
    });
  }

  function openQueriesCreate() {
    if (currentShell !== "queries") {
      showView("queries", { smooth: false, create: true });
    } else {
      queriesState.createOpen = true;
      syncQueriesCreateMode();
      resetQueriesCreateForm();
      if (window.location.hash !== "#queries/new") {
        history.replaceState(null, "", "#queries/new");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    document.getElementById("qc-customer")?.focus();
  }

  function closeQueriesCreate() {
    queriesState.createOpen = false;
    syncQueriesCreateMode();
    resetQueriesCreateForm();
    if ((window.location.hash || "").startsWith("#queries")) {
      history.replaceState(null, "", "#queries");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function filteredQueries() {
    const q = (queriesState.search || "").trim().toLowerCase();
    const mineId = getQueriesViewerOwnerId();
    return QUERIES.filter((item) => {
      if (queriesState.scope === "mine" && item.ownerId !== mineId) return false;
      if (!q) return true;
      const hay = `${item.title} ${item.customer} ${item.id} ${item.status} ${QUERY_STAGE_LABELS[item.stage] || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }

  function queryCardHtml(query) {
    const owner = queryOwner(query);
    const valueHtml =
      query.value > 0
        ? `<span class="queries-card-value">${escapeHtml(formatQueryPipelineValue(query.value))}</span>`
        : "";
    return `
      <article class="queries-card" data-query-id="${escapeHtml(query.id)}" tabindex="0">
        <div class="queries-card-top">
          <span class="queries-card-dot is-${escapeHtml(query.attention)}" aria-hidden="true"></span>
          <div class="queries-card-copy">
            <h3 class="queries-card-title">${escapeHtml(query.title)}</h3>
            <p class="queries-card-customer">${escapeHtml(query.customer)}</p>
          </div>
        </div>
        <div class="queries-card-meta">
          <span class="queries-card-kicker">Trip</span>
          ${valueHtml}
        </div>
        <div class="queries-card-foot">
          <span class="queries-card-status">${escapeHtml(query.status)}</span>
          <div class="queries-card-updated">
            <span class="avatar ${escapeHtml(owner.avatarClass || "avatar-mint")} queries-card-avatar" title="${escapeHtml(
              owner.name
            )}" aria-hidden="true">${escapeHtml(owner.initials)}</span>
            <span class="queries-card-time">
              <img src="assets/queries-clock.svg" alt="" width="12" height="12" />
              ${escapeHtml(formatQueryRelativeTime(query.updatedAt))}
            </span>
          </div>
        </div>
      </article>`;
  }

  function renderQueriesKanban(list) {
    const board = document.getElementById("queries-kanban");
    if (!board) return;
    board.innerHTML = QUERY_STAGES.map((stage) => {
      const items = list.filter((q) => q.stage === stage.id);
      const total = items.reduce((sum, q) => sum + (Number(q.value) || 0), 0);
      const body = items.length
        ? `<div class="queries-column-cards">${items.map(queryCardHtml).join("")}</div>`
        : `<p class="queries-column-empty">No queries</p>`;
      const totalHtml =
        stage.showTotal && items.length
          ? `<p class="queries-column-total">${escapeHtml(formatQueryPipelineValue(total))}</p>`
          : "";
      return `
        <section class="queries-column" data-stage="${escapeHtml(stage.id)}">
          <header class="queries-column-head">
            <div class="queries-column-title-row">
              <span class="queries-column-dot" style="background:${escapeHtml(stage.dot)}" aria-hidden="true"></span>
              <h2 class="queries-column-title">${escapeHtml(stage.label)}</h2>
              <span class="queries-column-count">${items.length}</span>
              <button type="button" class="queries-column-add" data-stage-add="${escapeHtml(
                stage.id
              )}" aria-label="Add query to ${escapeHtml(stage.label)}">
                <img src="assets/queries-col-plus.svg" alt="" width="16" height="16" />
              </button>
            </div>
            ${totalHtml}
          </header>
          <div class="queries-column-body">${body}</div>
        </section>`;
    }).join("");

    board.querySelectorAll("[data-stage-add]").forEach((btn) => {
      btn.addEventListener("click", () => {
        openQueriesCreate();
        showToast(`New query → ${QUERY_STAGE_LABELS[btn.dataset.stageAdd] || "pipeline"}`);
      });
    });
  }

  function renderQueriesList(list) {
    const tbody = document.getElementById("queries-list-body");
    if (!tbody) return;
    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state is-visible"><p class="empty-state-title">No queries match</p><p class="empty-state-desc">Try another search or switch to All.</p></div></td></tr>`;
      return;
    }
    tbody.innerHTML = list
      .map((query) => {
        const owner = queryOwner(query);
        return `<tr data-query-id="${escapeHtml(query.id)}">
          <td>
            <div class="queries-list-trip">
              <span class="queries-card-dot is-${escapeHtml(query.attention)}" aria-hidden="true"></span>
              <div>
                <p class="queries-list-title">${escapeHtml(query.title)}</p>
                <p class="queries-list-customer">${escapeHtml(query.customer)} · ${escapeHtml(query.id)}</p>
              </div>
            </div>
          </td>
          <td>${escapeHtml(QUERY_STAGE_LABELS[query.stage] || query.stage)}</td>
          <td>
            <div class="member-cell">
              <span class="avatar ${escapeHtml(owner.avatarClass || "avatar-mint")}" aria-hidden="true">${escapeHtml(
                owner.initials
              )}</span>
              <span>${escapeHtml(owner.name)}</span>
            </div>
          </td>
          <td>${query.value > 0 ? escapeHtml(formatQueryPipelineValue(query.value)) : "—"}</td>
          <td><span class="queries-card-status">${escapeHtml(query.status)}</span></td>
          <td>${escapeHtml(formatQueryRelativeTime(query.updatedAt))}</td>
        </tr>`;
      })
      .join("");
  }

  function renderQueriesPipeline() {
    if (!viewQueries) return;
    const list = filteredQueries();
    const totalValue = list.reduce((sum, q) => sum + (Number(q.value) || 0), 0);
    const sub = document.getElementById("queries-page-sub");
    if (sub) {
      sub.textContent = `${list.length} quer${list.length === 1 ? "y" : "ies"} · ${formatQueryPipelineValue(
        totalValue
      )} pipeline value`;
    }

    const kanban = document.getElementById("queries-kanban");
    const listEl = document.getElementById("queries-list");
    const isKanban = queriesState.view === "kanban";
    if (kanban) kanban.hidden = !isKanban;
    if (listEl) listEl.hidden = isKanban;
    if (isKanban) renderQueriesKanban(list);
    else renderQueriesList(list);

    document.querySelectorAll("[data-queries-scope]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.queriesScope === queriesState.scope);
    });
    document.querySelectorAll("[data-queries-view]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.queriesView === queriesState.view);
    });
  }

  function initQueriesModule() {
    if (!viewQueries) return;
    syncQueriesCreateMode();

    document.querySelectorAll("[data-queries-scope]").forEach((btn) => {
      btn.addEventListener("click", () => {
        queriesState.scope = btn.dataset.queriesScope === "mine" ? "mine" : "all";
        renderQueriesPipeline();
      });
    });
    document.querySelectorAll("[data-queries-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        queriesState.view = btn.dataset.queriesView === "list" ? "list" : "kanban";
        renderQueriesPipeline();
      });
    });
    document.getElementById("queries-search")?.addEventListener("input", (e) => {
      queriesState.search = e.target.value || "";
      renderQueriesPipeline();
    });
    document.getElementById("queries-refresh")?.addEventListener("click", () => {
      renderQueriesPipeline();
    });
    document.querySelectorAll("[data-open-query-create], [data-open-query-modal]").forEach((btn) => {
      btn.addEventListener("click", () => openQueriesCreate());
    });
    document.getElementById("queries-create-back")?.addEventListener("click", () => {
      closeQueriesCreate();
    });

    const createForm = document.getElementById("queries-create-form");
    const roundTripBtn = document.getElementById("qc-round-trip");
    roundTripBtn?.addEventListener("click", () => {
      const next = roundTripBtn.getAttribute("aria-checked") !== "true";
      roundTripBtn.setAttribute("aria-checked", next ? "true" : "false");
      const hidden = document.getElementById("qc-round-trip-value");
      if (hidden) hidden.value = next ? "true" : "false";
      syncQueriesCreateRoundTripLabel(next);
    });

    createForm?.querySelectorAll(".queries-create-control--date").forEach((control) => {
      control.addEventListener("click", (e) => {
        const input = control.querySelector('input[type="date"]');
        if (!input || e.target === input) return;
        e.preventDefault();
        if (typeof input.showPicker === "function") {
          try {
            input.showPicker();
            return;
          } catch (_) {
            /* fall through */
          }
        }
        input.focus();
        input.click();
      });
    });

    createForm?.querySelectorAll("[data-time-chip]").forEach((chip) => {
      chip.addEventListener("click", () => {
        const pressed = chip.getAttribute("aria-pressed") === "true";
        if (!pressed) {
          const selected = createForm.querySelectorAll('[data-time-chip][aria-pressed="true"]').length;
          if (selected >= 4) {
            showToast("Select up to 4 time windows");
            return;
          }
        }
        chip.setAttribute("aria-pressed", pressed ? "false" : "true");
        const times = [...createForm.querySelectorAll('[data-time-chip][aria-pressed="true"]')].map(
          (el) => el.dataset.timeChip
        );
        const hidden = document.getElementById("qc-preferred-times");
        if (hidden) hidden.value = times.join(",");
      });
    });

    ["qc-customer", "qc-from", "qc-to"].forEach((id) => {
      const el = document.getElementById(id);
      el?.addEventListener("change", () => {
        const field = el.closest("[data-qc-required]");
        if (el.value) clearQueriesCreateFieldError(field);
        updateQueriesCreateSubmitState();
      });
      el?.addEventListener("blur", () => {
        const field = el.closest("[data-qc-required]");
        if (field?.classList.contains("is-error") || !el.value) {
          setQueriesCreateFieldError(field, !el.value);
        }
      });
    });

    createForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const { allValid, firstInvalid } = validateQueriesCreateRequired({ report: true });
      updateQueriesCreateSubmitState();
      if (!allValid) {
        firstInvalid?.focus();
        showToast("Customer, From, and To are required");
        return;
      }
      const data = new FormData(createForm);
      const from = String(data.get("from") || "").trim();
      const to = String(data.get("to") || "").trim();
      const tripLabel = from && to ? `${from} → ${to}` : to || from || "Flight";
      data.set("destination", tripLabel);
      createQueryFromForm(data);
      incrementDemoCount("queries");
      completeChecklistItem("query");
      closeQueriesCreate();
      showToast(`Query for “${tripLabel}” created`);
    });

    renderQueriesPipeline();
  }

  function createQueryFromForm(data) {
    const customer = String(data.get("customer") || "").trim() || "New customer";
    const destination = String(data.get("destination") || "").trim() || "New trip";
    const from = String(data.get("from") || "").trim();
    const to = String(data.get("to") || "").trim();
    const notes = String(data.get("notes") || "").trim();
    const priority = String(data.get("priority") || "Medium").trim();
    const adults = Math.max(1, Number(data.get("adults")) || 1);
    const infants = Math.max(0, Number(data.get("infants")) || 0);
    const budgetRaw = String(data.get("budget") || "").replace(/[₹,\s]/g, "");
    let value = 0;
    if (/l$/i.test(budgetRaw)) value = Math.round(parseFloat(budgetRaw) * 100000) || 0;
    else value = Math.round(parseFloat(budgetRaw)) || 0;
    const routeTitle = from && to ? `${from} → ${to}` : destination;
    const id = `Q-${1000 + QUERIES.length + 1}`;
    QUERIES.unshift({
      id,
      title: `${routeTitle} Trip`.replace(/\s+Trip Trip$/i, " Trip"),
      customer,
      stage: "new_inquiry",
      value,
      status: "Pending Us",
      attention: priority === "High" ? "amber" : "green",
      ownerId: getQueriesViewerOwnerId(),
      updatedAt: Date.now(),
      adults,
      infants,
      notes,
      priority,
      from,
      to,
    });
    queriesState.scope = "all";
    queriesState.view = "kanban";
    renderQueriesPipeline();
  }

  const BOOKINGS = [
    {
      id: "BK-2026-000003",
      slug: "xyz-dubai",
      title: "XYZ Family · Dubai",
      customer: "XYZ Family",
      destination: "Dubai",
      queryId: "Q-1042",
      proposalVersion: "v3",
      phase: "upcoming",
      confirmed: true,
      confirmations: { supplier: "pending", voucher: "blocked", documents: "missing" },
      paymentOverdue: false,
      paymentsOpen: true,
      priority: 1,
      travelStart: "2026-08-18",
      travelEnd: "2026-08-22",
      pax: 3,
      createdAt: "6 Aug · 18:10",
      owner: DEMO_OWNER,
      team: [DEMO_STAFF.vrushabh, DEMO_STAFF.neha],
      toCollect: 0,
      toPaySuppliers: 0,
      actionHint: "Close supplier, voucher and documents",
      linkedProposal: "XYZ Family Dubai Proposal",
      tripLabel: "Dubai",
      notesList: [
        { author: "Vrushabh Jain", time: "7 Aug · 11:20", body: "Customer prefers late airport pickup on arrival." },
        { author: "Neha Kapoor", time: "7 Aug · 14:05", body: "Do not mention supplier rate to the customer." },
      ],
      itinerarySub: "Itinerary locked from confirmed query.",
      itineraryNote: "Mumbai → Dubai · 3 adults · hotel + transfers.",
      services: [
        {
          id: "svc-dubai-hotel",
          type: "hotel",
          name: "Hotel",
          vendor: "ABC DMC Dubai",
          vendorContact: "+971 4 555 0180",
          vendorEmail: "ops@abcdmc.ae",
          serviceDetail: "Tamara Hotel · 2 Deluxe twin · breakfast · 18–22 Aug",
          cost: 33000,
          confirmation: "pending",
          deadline: "Today 4 PM",
          status: "Awaiting vouchers",
          paymentTerms: {
            kind: "schedule",
            schedule: [
              { id: "pt-dubai-h1", label: "On confirmation", percent: 50, trigger: "on_confirm" },
              { id: "pt-dubai-h2", label: "Balance", percent: 50, trigger: "before_checkin", daysBefore: 7 },
            ],
          },
          payables: [],
          vouchers: [
            { id: "vh-hotel-conf", name: "Hotel confirmation voucher", attached: false, fileName: "" },
            { id: "vh-hotel-room", name: "Rooming / meal plan sheet", attached: false, fileName: "" },
          ],
        },
        {
          id: "svc-dubai-transfers",
          type: "transport",
          name: "Transfers",
          vendor: "Desert Wheels",
          vendorContact: "+971 50 555 2211",
          vendorEmail: "desk@desertwheels.ae",
          serviceDetail: "Airport arrival + departure · private van · 3 pax",
          cost: 6500,
          confirmation: "pending",
          deadline: "Today 6 PM",
          status: "Vouchers not attached",
          paymentTerms: { kind: "unknown" },
          payables: [],
          vouchers: [{ id: "vh-transfer", name: "Transfer voucher", attached: false, fileName: "" }],
        },
      ],
      tasks: [
        { id: "T-201", title: "Confirm hotel with ABC DMC", priority: "high", assignee: DEMO_STAFF.neha, due: "Today 4 PM", dependency: "None", status: "open" },
        { id: "T-202", title: "Unblock hotel voucher", priority: "high", assignee: DEMO_STAFF.vrushabh, due: "Today", dependency: "Hotel confirmation", status: "blocked" },
        { id: "T-203", title: "Collect passports", priority: "medium", assignee: DEMO_STAFF.meera, due: "Tomorrow", dependency: "None", status: "open" },
      ],
      travellers: [
        {
          id: "trv-dubai-amit",
          legalName: "Amit XYZ",
          name: "Amit XYZ",
          type: "Adult",
          dob: "1984-03-12",
          gender: "Male",
          nationality: "Indian",
          contact: "+91 98xxx 10001",
          email: "amit.xyz@email.com",
          lead: true,
          role: "Lead traveller",
          passport: "Missing",
          visaStatus: "Documents pending",
          specialFlags: [{ kind: "pickup", note: "Late airport pickup on arrival" }],
          linkedServices: [
            { serviceId: "svc-dubai-hotel", label: "Hotel · Tamara" },
            { serviceId: "svc-dubai-transfers", label: "Airport transfers" },
          ],
          source: "query",
          queryTravellerId: "QT-1042-1",
        },
        {
          id: "trv-dubai-priya",
          legalName: "Priya XYZ",
          name: "Priya XYZ",
          type: "Adult",
          dob: "1988-07-21",
          gender: "Female",
          nationality: "Indian",
          contact: "+91 98xxx 10002",
          email: "priya.xyz@email.com",
          lead: false,
          role: "Spouse",
          passport: "Uploaded",
          visaStatus: "Documents pending",
          specialFlags: [],
          linkedServices: [
            { serviceId: "svc-dubai-hotel", label: "Hotel · Tamara" },
            { serviceId: "svc-dubai-transfers", label: "Airport transfers" },
          ],
          source: "query",
          queryTravellerId: "QT-1042-2",
        },
        {
          id: "trv-dubai-arjun",
          legalName: "Arjun XYZ",
          name: "Arjun XYZ",
          type: "Child",
          dob: "2014-01-09",
          gender: "Male",
          nationality: "Indian",
          contact: "",
          email: "",
          lead: false,
          role: "Child",
          guardianId: "trv-dubai-amit",
          guardianName: "Amit XYZ",
          passport: "Requested",
          visaStatus: "Documents pending",
          specialFlags: [],
          linkedServices: [
            { serviceId: "svc-dubai-hotel", label: "Hotel · Tamara" },
            { serviceId: "svc-dubai-transfers", label: "Airport transfers" },
          ],
          source: "query",
          queryTravellerId: "QT-1042-3",
        },
      ],
      documents: [
        {
          id: "doc-dubai-pass-amit",
          type: "Passport",
          traveller: "Amit XYZ",
          status: "Missing",
          required: true,
          requiredBy: "12 Aug",
          blocks: "Visa processing",
        },
        {
          id: "doc-dubai-pass-priya",
          type: "Passport",
          traveller: "Priya XYZ",
          status: "Uploaded",
          required: true,
          requiredBy: "12 Aug",
          blocks: "Visa processing",
          fileName: "priya-xyz-passport.pdf",
          fileSize: "1.1 MB",
          fileKind: "pdf",
          receivedAt: "8 Aug · 11:20",
          receivedVia: "WhatsApp",
          uploadedBy: "Priya XYZ",
          reviewHints: ["Name matches traveller", "Expiry 19 Jan 2032 — after trip", "Photo page readable"],
          extracted: { passportNo: "Z•••••8821", expiry: "19 Jan 2032", nationality: "Indian" },
        },
        {
          id: "doc-dubai-pass-arjun",
          type: "Passport",
          traveller: "Arjun XYZ",
          status: "Requested",
          required: true,
          requiredBy: "12 Aug",
          blocks: "Visa processing",
          requestedAt: "7 Aug · 16:40",
          requestedVia: "WhatsApp",
        },
        { id: "doc-dubai-visa-amit", type: "Visa copy", traveller: "Amit XYZ", status: "Missing", required: true, requiredBy: "14 Aug", blocks: "Visa processing" },
        { id: "doc-dubai-visa-priya", type: "Visa copy", traveller: "Priya XYZ", status: "Missing", required: true, requiredBy: "14 Aug", blocks: "Visa processing" },
        { id: "doc-dubai-visa-arjun", type: "Visa copy", traveller: "Arjun XYZ", status: "Missing", required: true, requiredBy: "14 Aug", blocks: "Visa processing" },
        {
          id: "doc-dubai-arrival",
          type: "Arrival flight details",
          traveller: "",
          status: "Requested",
          required: true,
          requiredBy: "15 Aug",
          note: "Customer upload for arrival logistics — not an agency-issued ticket",
          requestedAt: "7 Aug · 10:15",
          requestedVia: "WhatsApp",
        },
      ],
      vouchers: [
        {
          id: "tv-dubai-hotel",
          serviceId: "svc-dubai-hotel",
          name: "Hotel voucher",
          source: "vendor",
          status: "blocked",
          blockReason: "Hotel confirmation pending",
          fileName: "",
          sentAt: "",
        },
        {
          id: "tv-dubai-transfer",
          serviceId: "svc-dubai-transfers",
          name: "Transfer voucher",
          source: "agency",
          status: "blocked",
          blockReason: "Transfer vendor not confirmed",
          fileName: "",
          sentAt: "",
        },
      ],
      threads: [
        { party: "Vendor", channel: "Email", with: "ABC DMC Dubai", preview: "Please confirm Tamara hold by 4 PM.", related: "Hotel", assignee: "Neha Kapoor", when: "Today · 09:40" },
        { party: "Customer", channel: "WhatsApp", with: "Amit XYZ", preview: "Shared passport checklist.", related: "Documents", assignee: "Meera Iyer", when: "Today · 10:15" },
      ],
      activity: [
        { time: "6 Aug · 18:10", body: "Booking created from Q-1042 · accepted Proposal v3." },
        { time: "6 Aug · 18:11", body: "Traveller snapshot copied from Query Q-1042 · Amit (lead), Priya, Arjun." },
        { time: "6 Aug · 18:12", body: "Neha Kapoor assigned to fulfilment tasks." },
        { time: "7 Aug · 09:40", body: "Supplier confirmation requested for hotel." },
        { time: "7 Aug · 11:42", body: "₹20,500 customer receipt recorded." },
      ],
      ledger: {
        receivable: 20500,
        sellingPrice: 20500,
        totalCost: 39500,
        margin: -19000,
        deposits: 20500,
        customerPaid: 20500,
        customerBalance: 0,
        vendorPayable: 39500,
        vendorSettled: 0,
        cashIn: 20500,
        cashOut: 0,
        entryCount: 2,
      },
      nextAction: {
        kind: "task",
        title: "Confirm hotel with ABC DMC",
        body: "Booking is confirmed — ops still need supplier vouchers and traveller documents.",
        cta: "Open services",
        ctaTarget: "services",
      },
      lifecycle: { mode: "reopen" },
    },
    {
      id: "BK-2026-000002",
      slug: "ladakh",
      title: "Jain Family · Ladakh",
      customer: "Jain Family",
      destination: "Ladakh",
      queryId: "Q-1038",
      proposalVersion: "v2",
      phase: "completed",
      confirmed: true,
      confirmations: { supplier: "confirmed", voucher: "issued", documents: "received" },
      paymentOverdue: true,
      paymentsOpen: true,
      priority: 2,
      travelStart: "2026-07-15",
      travelEnd: "2026-07-21",
      pax: 1,
      owner: DEMO_OWNER,
      team: [DEMO_STAFF.vrushabh],
      toCollect: 223456,
      collectDue: "2026-08-11",
      toPaySuppliers: 0,
      actionHint: "Collect overdue balance",
      linkedProposal: "Ladakh Trip Proposal",
      tripLabel: "Ladakh",
      notesList: [{ author: "Vrushabh Jain", time: "22 Jul · 10:00", body: "Customer promised bank transfer this week — chase if not landed." }],
      itinerarySub: "Itinerary fulfilled.",
      itineraryNote: "Leh circuit completed · post-trip balance still open.",
      services: [
        {
          id: "svc-ladakh",
          type: "trip",
          name: "Stay + ground",
          vendor: "Ladakh Trails",
          vendorContact: "+91 19xxx 44100",
          vendorEmail: "ops@ladakhtrails.in",
          serviceDetail: "Leh hotel + local transport pack · delivered",
          cost: 0,
          confirmation: "confirmed",
          deadline: "—",
          status: "Delivered",
          paymentTerms: { kind: "schedule", schedule: [{ id: "pt-ladakh-1", label: "Full", percent: 100, trigger: "on_confirm" }] },
          payables: [{ id: "pay-ladakh-1", label: "Full", amount: 0, dueLabel: "—", dueDate: "", status: "paid" }],
          vouchers: [{ id: "vh-ladakh", name: "Trip voucher pack", attached: true, fileName: "ladakh-pack.pdf" }],
        },
      ],
      tasks: [
        { id: "T-110", title: "Collect overdue balance", priority: "high", assignee: DEMO_STAFF.vrushabh, due: "Overdue", dependency: "None", status: "overdue" },
      ],
      travellers: [{ name: "Vrushabh Jain", age: 34, type: "Adult", contact: "+91 98xxx 20001", passport: "Verified", visa: "Not required", special: "—" }],
      documents: [
        {
          id: "doc-ladakh-pass",
          type: "Passport",
          traveller: "Vrushabh Jain",
          status: "Verified",
          required: true,
          requiredBy: "—",
          fileName: "vrushabh-jain-passport.pdf",
          fileSize: "980 KB",
          fileKind: "pdf",
          receivedAt: "12 Jul · 14:10",
          receivedVia: "Email",
          uploadedBy: "Vrushabh Jain",
          verifiedAt: "12 Jul · 15:02",
          verifiedBy: "Meera Iyer",
          extracted: { passportNo: "A•••••4410", expiry: "4 May 2030", nationality: "Indian" },
        },
        {
          id: "doc-ladakh-arrival",
          type: "Arrival flight details",
          traveller: "",
          status: "Verified",
          required: false,
          requiredBy: "—",
          note: "Customer-uploaded reference for arrival",
          fileName: "ladakh-arrival-itinerary.pdf",
          fileSize: "180 KB",
          fileKind: "pdf",
          receivedAt: "13 Jul · 09:00",
          receivedVia: "Email",
          uploadedBy: "Vrushabh Jain",
          verifiedAt: "13 Jul · 09:40",
          verifiedBy: "Meera Iyer",
          reviewHints: ["Leh arrival · matches travel start"],
        },
      ],
      vouchers: [
        {
          id: "tv-ladakh",
          serviceId: "svc-ladakh",
          name: "Trip voucher pack",
          source: "agency",
          status: "sent",
          blockReason: "",
          fileName: "ladakh-pack.pdf",
          sentAt: "14 Jul, 4:00 PM",
        },
      ],
      threads: [
        { party: "Customer", channel: "WhatsApp", with: "Jain Family", preview: "Reminder for ₹2,23,456 balance.", related: "Finance", assignee: "Vrushabh Jain", when: "Today · 10:15" },
      ],
      activity: [
        { time: "10 Jul · 12:00", body: "Booking created from Q-1038 · accepted Proposal v2." },
        { time: "21 Jul · 20:00", body: "Trip marked completed." },
        { time: "22 Jul · 09:00", body: "Balance due reminder raised for ₹2,23,456." },
      ],
      ledger: {
        receivable: 1123456,
        sellingPrice: 1123456,
        totalCost: 0,
        margin: 1123456,
        deposits: 900000,
        customerPaid: 900000,
        customerBalance: 223456,
        vendorPayable: 0,
        vendorSettled: 0,
        cashIn: 900000,
        cashOut: 0,
        entryCount: 3,
      },
      nextAction: {
        kind: "task",
        title: "Collect overdue balance",
        body: "₹2,23,456 still to collect from the customer.",
        cta: "Open finance",
        ctaTarget: "finance",
      },
      lifecycle: { mode: "reopen", readiness: 80 },
    },
    {
      id: "BK-2026-000005",
      slug: "mehta-kerala",
      title: "Mehta Family · Kerala",
      customer: "Mehta Family",
      destination: "Kerala",
      queryId: "Q-1040",
      proposalVersion: "v1",
      phase: "travelling",
      confirmed: true,
      confirmations: { supplier: "confirmed", voucher: "issued", documents: "received" },
      paymentOverdue: false,
      paymentsOpen: false,
      priority: 3,
      travelStart: "2026-08-05",
      travelEnd: "2026-08-12",
      pax: 4,
      owner: DEMO_OWNER,
      team: [DEMO_STAFF.vrushabh, DEMO_STAFF.meera],
      toCollect: 0,
      toPaySuppliers: 0,
      moneySettled: true,
      actionHint: "",
      linkedProposal: "Kerala Family Escape",
      tripLabel: "Kerala",
      notesList: [{ author: "Meera Iyer", time: "5 Aug · 08:30", body: "Ops on-call for day-of houseboat changes." }],
      itinerarySub: "Live trip · Munnar → Alleppey.",
      itineraryNote: "Travellers currently on ground.",
      services: [
        {
          id: "svc-kerala-hotel",
          type: "hotel",
          name: "Hotel Munnar",
          vendor: "Hill Mist",
          vendorContact: "+91 48xxx 21001",
          vendorEmail: "stay@hillmist.in",
          serviceDetail: "Deluxe rooms · 3 nights · breakfast",
          cost: 48000,
          confirmation: "confirmed",
          deadline: "—",
          status: "In use",
          paymentTerms: {
            kind: "schedule",
            schedule: [
              { id: "pt-kerala-h1", label: "On confirmation", percent: 50, trigger: "on_confirm" },
              { id: "pt-kerala-h2", label: "Balance", percent: 50, trigger: "before_checkin", daysBefore: 7 },
            ],
          },
          payables: [
            { id: "pay-kerala-h1", label: "On confirmation", amount: 24000, dueLabel: "paid", dueDate: "2026-07-20", status: "paid" },
            { id: "pay-kerala-h2", label: "Balance", amount: 24000, dueLabel: "paid", dueDate: "2026-07-29", status: "paid" },
          ],
          vouchers: [{ id: "vh-kerala-hotel", name: "Hotel voucher", attached: true, fileName: "hill-mist.pdf" }],
        },
        {
          id: "svc-kerala-boat",
          type: "cruise",
          name: "Houseboat",
          vendor: "Backwater Co",
          vendorContact: "+91 47xxx 88002",
          vendorEmail: "book@backwaterco.in",
          serviceDetail: "Premium houseboat · 2 nights · all meals",
          cost: 72000,
          confirmation: "confirmed",
          deadline: "—",
          status: "In use",
          paymentTerms: { kind: "schedule", schedule: [{ id: "pt-kerala-b1", label: "Full", percent: 100, trigger: "on_confirm" }] },
          payables: [{ id: "pay-kerala-b1", label: "Full", amount: 72000, dueLabel: "paid", dueDate: "2026-07-22", status: "paid" }],
          vouchers: [{ id: "vh-kerala-boat", name: "Houseboat voucher", attached: true, fileName: "backwater.pdf" }],
        },
      ],
      tasks: [
        { id: "T-301", title: "Monitor live trip", priority: "low", assignee: DEMO_STAFF.meera, due: "Daily", dependency: "None", status: "open" },
      ],
      travellers: [
        { name: "Raj Mehta", age: 45, type: "Adult", contact: "+91 98xxx 30001", passport: "Verified", visa: "Not required", special: "—" },
        { name: "Sneha Mehta", age: 42, type: "Adult", contact: "+91 98xxx 30002", passport: "Verified", visa: "Not required", special: "Veg meals" },
        { name: "Ishaan Mehta", age: 14, type: "Child", contact: "—", passport: "Verified", visa: "Not required", special: "—" },
        { name: "Anaya Mehta", age: 10, type: "Child", contact: "—", passport: "Verified", visa: "Not required", special: "—" },
      ],
      documents: [
        {
          id: "doc-kerala-pass-raj",
          type: "Passport",
          traveller: "Raj Mehta",
          status: "Verified",
          required: true,
          requiredBy: "—",
          fileName: "raj-mehta-passport.pdf",
          fileSize: "1.0 MB",
          fileKind: "pdf",
          receivedAt: "22 Jul · 11:00",
          receivedVia: "WhatsApp",
          uploadedBy: "Raj Mehta",
          verifiedAt: "22 Jul · 12:15",
          verifiedBy: "Meera Iyer",
          extracted: { passportNo: "B•••••2201", expiry: "8 Aug 2029", nationality: "Indian" },
        },
        {
          id: "doc-kerala-pass-sneha",
          type: "Passport",
          traveller: "Sneha Mehta",
          status: "Verified",
          required: true,
          requiredBy: "—",
          fileName: "sneha-mehta-passport.pdf",
          fileSize: "1.0 MB",
          fileKind: "pdf",
          receivedAt: "22 Jul · 11:02",
          receivedVia: "WhatsApp",
          uploadedBy: "Raj Mehta",
          verifiedAt: "22 Jul · 12:16",
          verifiedBy: "Meera Iyer",
          extracted: { passportNo: "B•••••2202", expiry: "8 Aug 2029", nationality: "Indian" },
        },
        {
          id: "doc-kerala-pass-ishaan",
          type: "Passport",
          traveller: "Ishaan Mehta",
          status: "Verified",
          required: true,
          requiredBy: "—",
          fileName: "ishaan-mehta-passport.pdf",
          fileSize: "900 KB",
          fileKind: "pdf",
          receivedAt: "22 Jul · 11:05",
          receivedVia: "WhatsApp",
          uploadedBy: "Raj Mehta",
          verifiedAt: "22 Jul · 12:18",
          verifiedBy: "Meera Iyer",
          extracted: { passportNo: "B•••••2203", expiry: "11 Nov 2031", nationality: "Indian" },
        },
        {
          id: "doc-kerala-pass-anaya",
          type: "Passport",
          traveller: "Anaya Mehta",
          status: "Verified",
          required: true,
          requiredBy: "—",
          fileName: "anaya-mehta-passport.pdf",
          fileSize: "880 KB",
          fileKind: "pdf",
          receivedAt: "22 Jul · 11:06",
          receivedVia: "WhatsApp",
          uploadedBy: "Raj Mehta",
          verifiedAt: "22 Jul · 12:19",
          verifiedBy: "Meera Iyer",
          extracted: { passportNo: "B•••••2204", expiry: "11 Nov 2031", nationality: "Indian" },
        },
        {
          id: "doc-kerala-arrival",
          type: "Arrival flight details",
          traveller: "",
          status: "Verified",
          required: false,
          requiredBy: "—",
          note: "Customer-uploaded reference for arrival",
          fileName: "mehta-kochi-arrival.pdf",
          fileSize: "210 KB",
          fileKind: "pdf",
          receivedAt: "23 Jul · 08:40",
          receivedVia: "Email",
          uploadedBy: "Raj Mehta",
          verifiedAt: "23 Jul · 09:10",
          verifiedBy: "Meera Iyer",
        },
      ],
      vouchers: [
        {
          id: "tv-kerala-hotel",
          serviceId: "svc-kerala-hotel",
          name: "Hotel voucher",
          source: "vendor",
          status: "sent",
          blockReason: "",
          fileName: "hill-mist-voucher.pdf",
          sentAt: "5 Aug, 7:10 AM",
        },
        {
          id: "tv-kerala-boat",
          serviceId: "svc-kerala-boat",
          name: "Houseboat voucher",
          source: "agency",
          status: "sent",
          blockReason: "",
          fileName: "backwater-voucher.pdf",
          sentAt: "5 Aug, 7:12 AM",
        },
      ],
      threads: [
        { party: "Customer", channel: "WhatsApp", with: "Raj Mehta", preview: "All good in Munnar — thanks.", related: "Trip", assignee: "Meera Iyer", when: "Yesterday · 19:10" },
      ],
      activity: [
        { time: "20 Jul · 11:00", body: "Booking created from Q-1040 · accepted Proposal v1." },
        { time: "5 Aug · 06:00", body: "Phase moved to Travelling." },
      ],
      ledger: {
        receivable: 180000,
        sellingPrice: 180000,
        totalCost: 120000,
        margin: 60000,
        deposits: 180000,
        customerPaid: 180000,
        customerBalance: 0,
        vendorPayable: 120000,
        vendorSettled: 120000,
        cashIn: 180000,
        cashOut: 120000,
        entryCount: 5,
      },
      nextAction: {
        kind: "clear",
        title: "Trip in progress",
        body: "No open blockers while travellers are on ground.",
      },
      lifecycle: { mode: "reopen", readiness: 90 },
    },
    {
      id: "BK-2026-000004",
      slug: "sharma-goa",
      title: "Sharma Family · Goa",
      customer: "Sharma Family",
      destination: "Goa",
      queryId: "Q-1045",
      proposalVersion: "v3",
      phase: "upcoming",
      confirmed: true,
      confirmations: { supplier: "pending", voucher: "pending", documents: "missing" },
      paymentOverdue: false,
      paymentsOpen: false,
      priority: 4,
      travelStart: "2026-08-18",
      travelEnd: "2026-08-22",
      pax: 2,
      owner: DEMO_OWNER,
      team: [],
      toCollect: 0,
      toPaySuppliers: 0,
      moneySettled: true,
      actionHint: "Confirm water sports add-on · verify arrival flight details · issue vouchers",
      linkedProposal: "Goa Weekend",
      tripLabel: "Goa",
      notesList: [{ author: "Neha Kapoor", time: "1 Aug · 16:20", body: "Hotel agreed complimentary room upgrade — do not promise to customer until voucher issued." }],
      itinerarySub: "Confirmed hotel + airport transfers.",
      itineraryNote: "Departure in 10 days · voucher still pending.",
      services: [
        {
          id: "svc-goa-hotel",
          type: "hotel",
          name: "Hotel",
          vendor: "Coast Stay Goa",
          vendorContact: "+91 83xxx 45001",
          vendorEmail: "reservations@coaststay.in",
          serviceDetail: "Sea-view twin · 4 nights · breakfast · room upgrade held",
          cost: 36000,
          confirmation: "confirmed",
          deadline: "—",
          status: "Confirmed",
          paymentTerms: {
            kind: "schedule",
            schedule: [
              { id: "pt-goa-h1", label: "On confirmation", percent: 50, trigger: "on_confirm" },
              { id: "pt-goa-h2", label: "Balance", percent: 50, trigger: "before_checkin", daysBefore: 7 },
            ],
          },
          payables: [
            { id: "pay-goa-h1", label: "On confirmation", amount: 18000, dueLabel: "paid", dueDate: "2026-07-30", status: "paid" },
            { id: "pay-goa-h2", label: "Balance", amount: 18000, dueLabel: "paid", dueDate: "2026-08-11", status: "paid" },
          ],
          vouchers: [{ id: "vh-goa-hotel", name: "Hotel voucher", attached: true, fileName: "coast-stay.pdf" }],
        },
        {
          id: "svc-goa-transfers",
          type: "transport",
          name: "Transfers",
          vendor: "Goa Cabs",
          vendorContact: "+91 98xxx 66020",
          vendorEmail: "desk@goacabs.in",
          serviceDetail: "Airport transfers · sedan · 2 pax",
          cost: 12000,
          confirmation: "confirmed",
          deadline: "—",
          status: "Confirmed",
          paymentTerms: { kind: "schedule", schedule: [{ id: "pt-goa-t1", label: "Full", percent: 100, trigger: "on_confirm" }] },
          payables: [{ id: "pay-goa-t1", label: "Full", amount: 12000, dueLabel: "paid", dueDate: "2026-07-30", status: "paid" }],
          vouchers: [{ id: "vh-goa-transfer", name: "Transfer voucher", attached: true, fileName: "goa-cabs.pdf" }],
        },
        {
          id: "svc-goa-watersports",
          type: "trip",
          name: "Water sports",
          vendor: "Baga Adventures",
          vendorContact: "+91 83xxx 44110",
          vendorEmail: "book@bagaadventures.in",
          serviceDetail: "Parasail + jet ski combo · 2 pax · added after confirm",
          cost: 8000,
          confirmation: "pending",
          deadline: "12 Aug",
          status: "Awaiting vouchers",
          addedAfterConfirmation: true,
          source: "post_confirmation",
          paymentTerms: { kind: "unknown" },
          payables: [],
          vouchers: [{ id: "vh-goa-water", name: "Activity voucher", attached: false, fileName: "" }],
        },
      ],
      tasks: [
        { id: "T-401", title: "Confirm water sports add-on", priority: "high", assignee: DEMO_STAFF.neha, due: "12 Aug", dependency: "None", status: "open" },
        { id: "T-402", title: "Issue travel vouchers", priority: "medium", assignee: DEMO_STAFF.neha, due: "13 Aug", dependency: "Water sports confirm", status: "blocked" },
      ],
      travellers: [
        {
          id: "trv-goa-rohit",
          legalName: "Rohit Sharma",
          name: "Rohit Sharma",
          type: "Adult",
          dob: "1990-04-18",
          nationality: "Indian",
          contact: "+91 98xxx 40001",
          email: "rohit.sharma@email.com",
          lead: true,
          role: "Lead traveller",
          passport: "Verified",
          visaStatus: "Not required",
          specialFlags: [],
          linkedServices: [
            { serviceId: "svc-goa-hotel", label: "Hotel" },
            { serviceId: "svc-goa-transfers", label: "Transfers" },
            { serviceId: "svc-goa-watersports", label: "Water sports" },
          ],
          source: "query",
          queryTravellerId: "QT-1045-1",
        },
        {
          id: "trv-goa-kavita",
          legalName: "Kavita Sharma",
          name: "Kavita Sharma",
          type: "Adult",
          dob: "1992-11-02",
          nationality: "Indian",
          contact: "+91 98xxx 40002",
          email: "",
          lead: false,
          role: "Spouse",
          passport: "Verified",
          visaStatus: "Not required",
          specialFlags: [{ kind: "dietary", note: "Vegetarian meals" }],
          linkedServices: [
            { serviceId: "svc-goa-hotel", label: "Hotel" },
            { serviceId: "svc-goa-transfers", label: "Transfers" },
            { serviceId: "svc-goa-watersports", label: "Water sports" },
          ],
          source: "query",
          queryTravellerId: "QT-1045-2",
        },
      ],
      documents: [
        {
          id: "doc-goa-pass-rohit",
          type: "Passport",
          traveller: "Rohit Sharma",
          status: "Verified",
          required: true,
          requiredBy: "—",
          fileName: "rohit-sharma-passport.pdf",
          fileSize: "1.0 MB",
          fileKind: "pdf",
          receivedAt: "28 Jul · 10:00",
          receivedVia: "Email",
          uploadedBy: "Rohit Sharma",
          verifiedAt: "28 Jul · 10:45",
          verifiedBy: "Neha Kapoor",
          extracted: { passportNo: "C•••••7710", expiry: "2 Feb 2030", nationality: "Indian" },
        },
        {
          id: "doc-goa-pass-kavita",
          type: "Passport",
          traveller: "Kavita Sharma",
          status: "Verified",
          required: true,
          requiredBy: "—",
          fileName: "kavita-sharma-passport.pdf",
          fileSize: "1.0 MB",
          fileKind: "pdf",
          receivedAt: "28 Jul · 10:02",
          receivedVia: "Email",
          uploadedBy: "Rohit Sharma",
          verifiedAt: "28 Jul · 10:46",
          verifiedBy: "Neha Kapoor",
          extracted: { passportNo: "C•••••7711", expiry: "2 Feb 2030", nationality: "Indian" },
        },
        {
          id: "doc-goa-arrival",
          type: "Arrival flight details",
          traveller: "",
          status: "Uploaded",
          required: true,
          requiredBy: "11 Aug",
          note: "Customer upload for arrival logistics — verify before travel",
          fileName: "sharma-goa-arrival.pdf",
          fileSize: "240 KB",
          fileKind: "pdf",
          receivedAt: "8 Aug · 09:12",
          receivedVia: "WhatsApp",
          uploadedBy: "Rohit Sharma",
          reviewHints: ["AI 984 · 18 Aug 06:40 BOM→GOI", "Matches travel start", "Return leg attached"],
        },
      ],
      vouchers: [
        {
          id: "tv-goa-hotel",
          serviceId: "svc-goa-hotel",
          name: "Hotel voucher",
          source: "vendor",
          status: "ready",
          blockReason: "",
          fileName: "",
          sentAt: "",
        },
        {
          id: "tv-goa-transfer",
          serviceId: "svc-goa-transfers",
          name: "Transfer voucher",
          source: "agency",
          status: "issued",
          blockReason: "",
          fileName: "goa-transfer-voucher.pdf",
          sentAt: "",
        },
        {
          id: "tv-goa-water",
          serviceId: "svc-goa-water",
          name: "Activity voucher",
          source: "upload",
          status: "blocked",
          blockReason: "Water sports vendor not confirmed",
          fileName: "",
          sentAt: "",
        },
      ],
      threads: [
        { party: "Vendor", channel: "Email", with: "Coast Stay Goa", preview: "Confirmation on file — ready for voucher.", related: "Hotel", assignee: "Neha Kapoor", when: "2 Aug · 11:00" },
      ],
      activity: [
        { time: "28 Jul · 15:40", body: "Booking created from Q-1045 · accepted Proposal v3." },
        { time: "30 Jul · 10:00", body: "Supplier confirmed hotel and transfers." },
        { time: "1 Aug · 09:00", body: "Voucher pack marked ready to issue." },
        { time: "6 Aug · 16:20", body: "Water sports line added after confirmation · customer selling price unchanged." },
      ],
      ledger: {
        receivable: 72000,
        sellingPrice: 72000,
        totalCost: 48000,
        margin: 24000,
        deposits: 72000,
        customerPaid: 72000,
        customerBalance: 0,
        vendorPayable: 48000,
        vendorSettled: 48000,
        cashIn: 72000,
        cashOut: 48000,
        entryCount: 3,
      },
      nextAction: {
        kind: "task",
        title: "Confirm water sports add-on",
        body: "Line was added after confirmation — attach vouchers, confirm vendor. Selling price stays locked unless amended.",
        cta: "Open services",
        ctaTarget: "services",
      },
      lifecycle: { mode: "reopen", readiness: 85 },
    },
    {
      id: "BK-2026-000006",
      slug: "patel-manali",
      title: "Patel Family · Manali",
      customer: "Patel Family",
      destination: "Manali",
      queryId: "Q-1048",
      proposalVersion: "v2",
      phase: "upcoming",
      confirmed: true,
      confirmations: { supplier: "confirmed", voucher: "issued", documents: "missing" },
      paymentOverdue: false,
      paymentsOpen: true,
      priority: 4,
      travelStart: "2026-08-24",
      travelEnd: "2026-08-28",
      pax: 5,
      owner: DEMO_OWNER,
      team: [DEMO_STAFF.vrushabh, DEMO_STAFF.meera],
      toCollect: 15000,
      collectDue: "2026-08-20",
      toPaySuppliers: 0,
      actionHint: "Collect passports and trip docs",
      linkedProposal: "Manali Family Escape",
      tripLabel: "Manali",
      notesList: [{ author: "Meera Iyer", time: "3 Aug · 12:40", body: "Passports needed before voucher pack is sent to travellers." }],
      itinerarySub: "Hotel + Volvo confirmed.",
      itineraryNote: "Documents outstanding · departure approaching.",
      services: [
        {
          id: "svc-manali-hotel",
          type: "hotel",
          name: "Hotel",
          vendor: "Snow Peak Manali",
          vendorContact: "+91 19xxx 33010",
          vendorEmail: "stay@snowpeak.in",
          serviceDetail: "Family rooms · 4 nights · breakfast",
          cost: 42000,
          confirmation: "confirmed",
          deadline: "—",
          status: "Confirmed",
          paymentTerms: {
            kind: "schedule",
            schedule: [
              { id: "pt-manali-h1", label: "On confirmation", percent: 50, trigger: "on_confirm" },
              { id: "pt-manali-h2", label: "Balance", percent: 50, trigger: "before_checkin", daysBefore: 7 },
            ],
          },
          payables: [
            { id: "pay-manali-h1", label: "On confirmation", amount: 21000, dueLabel: "paid", dueDate: "2026-08-03", status: "paid" },
            { id: "pay-manali-h2", label: "Balance", amount: 21000, dueLabel: "paid", dueDate: "2026-08-17", status: "paid" },
          ],
          vouchers: [{ id: "vh-manali-hotel", name: "Hotel voucher", attached: true, fileName: "snow-peak.pdf" }],
        },
        {
          id: "svc-manali-volvo",
          type: "transport",
          name: "Volvo",
          vendor: "HRTC Desk",
          vendorContact: "+91 17xxx 22000",
          vendorEmail: "desk@hrtc.gov.in",
          serviceDetail: "Delhi–Manali Volvo · 5 seats",
          cost: 20000,
          confirmation: "confirmed",
          deadline: "—",
          status: "Confirmed",
          paymentTerms: { kind: "schedule", schedule: [{ id: "pt-manali-v1", label: "Full", percent: 100, trigger: "on_confirm" }] },
          payables: [{ id: "pay-manali-v1", label: "Full", amount: 20000, dueLabel: "paid", dueDate: "2026-08-03", status: "paid" }],
          vouchers: [{ id: "vh-manali-volvo", name: "Volvo voucher", attached: true, fileName: "hrtc.pdf" }],
        },
      ],
      tasks: [
        { id: "T-501", title: "Collect missing passports", priority: "high", assignee: DEMO_STAFF.meera, due: "10 Aug", dependency: "None", status: "open" },
        { id: "T-502", title: "Collect remaining ₹15,000", priority: "medium", assignee: DEMO_STAFF.vrushabh, due: "15 Aug", dependency: "None", status: "open" },
      ],
      travellers: [
        {
          id: "trv-manali-karan",
          legalName: "Karan Patel",
          name: "Karan Patel",
          type: "Adult",
          dob: "1986-05-14",
          nationality: "Indian",
          contact: "+91 98xxx 50001",
          lead: true,
          role: "Lead traveller",
          passport: "Missing",
          visaStatus: "Not required",
          specialFlags: [],
          linkedServices: [
            { serviceId: "svc-manali-hotel", label: "Hotel" },
            { serviceId: "svc-manali-volvo", label: "Volvo" },
          ],
          source: "query",
        },
        {
          id: "trv-manali-nisha",
          legalName: "Nisha Patel",
          name: "Nisha Patel",
          type: "Adult",
          dob: "1988-09-30",
          nationality: "Indian",
          contact: "+91 98xxx 50002",
          lead: false,
          role: "Spouse",
          passport: "Missing",
          visaStatus: "Not required",
          specialFlags: [],
          linkedServices: [
            { serviceId: "svc-manali-hotel", label: "Hotel" },
            { serviceId: "svc-manali-volvo", label: "Volvo" },
          ],
          source: "query",
        },
        {
          id: "trv-manali-dev",
          legalName: "Dev Patel",
          name: "Dev Patel",
          type: "Child",
          dob: "2015-02-11",
          nationality: "Indian",
          contact: "",
          lead: false,
          role: "Child",
          guardianId: "trv-manali-karan",
          guardianName: "Karan Patel",
          passport: "Missing",
          visaStatus: "Not required",
          specialFlags: [],
          linkedServices: [
            { serviceId: "svc-manali-hotel", label: "Hotel" },
            { serviceId: "svc-manali-volvo", label: "Volvo" },
          ],
          source: "query",
        },
        {
          id: "trv-manali-riya",
          legalName: "Riya Patel",
          name: "Riya Patel",
          type: "Child",
          dob: "2018-06-03",
          nationality: "Indian",
          contact: "",
          lead: false,
          role: "Child",
          guardianId: "trv-manali-karan",
          guardianName: "Karan Patel",
          passport: "Missing",
          visaStatus: "Not required",
          specialFlags: [],
          linkedServices: [
            { serviceId: "svc-manali-hotel", label: "Hotel" },
            { serviceId: "svc-manali-volvo", label: "Volvo" },
          ],
          source: "query",
        },
        {
          id: "trv-manali-aarav",
          legalName: "Aarav Patel",
          name: "Aarav Patel",
          type: "Child",
          dob: "2021-08-19",
          nationality: "Indian",
          contact: "",
          lead: false,
          role: "Child",
          guardianId: "trv-manali-karan",
          guardianName: "Karan Patel",
          passport: "Missing",
          visaStatus: "Not required",
          specialFlags: [{ kind: "pickup", note: "Car seat required" }],
          linkedServices: [
            { serviceId: "svc-manali-hotel", label: "Hotel" },
            { serviceId: "svc-manali-volvo", label: "Volvo" },
          ],
          source: "query",
        },
      ],
      documents: [
        { id: "doc-manali-pass-karan", type: "Passport", traveller: "Karan Patel", status: "Missing", required: true, requiredBy: "10 Aug", blocks: "Voucher send-out" },
        { id: "doc-manali-pass-nisha", type: "Passport", traveller: "Nisha Patel", status: "Missing", required: true, requiredBy: "10 Aug", blocks: "Voucher send-out" },
        { id: "doc-manali-pass-dev", type: "Passport", traveller: "Dev Patel", status: "Missing", required: true, requiredBy: "10 Aug", blocks: "Voucher send-out" },
        { id: "doc-manali-pass-riya", type: "Passport", traveller: "Riya Patel", status: "Missing", required: true, requiredBy: "10 Aug", blocks: "Voucher send-out" },
        { id: "doc-manali-pass-aarav", type: "Passport", traveller: "Aarav Patel", status: "Missing", required: true, requiredBy: "10 Aug", blocks: "Voucher send-out" },
        {
          id: "doc-manali-id",
          type: "ID / KYC",
          traveller: "Karan Patel",
          status: "Expiring",
          required: true,
          requiredBy: "10 Aug",
          note: "Aadhaar on file expires before travel — request updated copy",
          fileName: "karan-patel-aadhaar.pdf",
          fileSize: "420 KB",
          fileKind: "pdf",
          receivedAt: "3 Aug · 18:20",
          receivedVia: "WhatsApp",
          uploadedBy: "Karan Patel",
          reviewHints: ["ID expiry 9 Aug 2026 — before trip end", "Name matches lead traveller"],
          extracted: { idNo: "XXXX-XXXX-4412", expiry: "9 Aug 2026" },
        },
        {
          id: "doc-manali-arrival",
          type: "Arrival flight details",
          traveller: "",
          status: "Uploaded",
          required: true,
          requiredBy: "12 Aug",
          note: "Customer upload for arrival logistics — verify before travel",
          fileName: "patel-manali-arrival.pdf",
          fileSize: "190 KB",
          fileKind: "pdf",
          receivedAt: "7 Aug · 21:05",
          receivedVia: "Email",
          uploadedBy: "Karan Patel",
          reviewHints: ["Volvo + flight combo · check arrival time vs hotel check-in"],
        },
      ],
      vouchers: [
        {
          id: "tv-manali-hotel",
          serviceId: "svc-manali-hotel",
          name: "Hotel voucher",
          source: "vendor",
          status: "issued",
          blockReason: "",
          fileName: "snow-peak-voucher.pdf",
          sentAt: "",
        },
        {
          id: "tv-manali-volvo",
          serviceId: "svc-manali-volvo",
          name: "Volvo voucher",
          source: "integration",
          status: "issued",
          blockReason: "",
          fileName: "hrtc-voucher.pdf",
          sentAt: "",
        },
      ],
      threads: [
        { party: "Customer", channel: "WhatsApp", with: "Karan Patel", preview: "Please upload all five passports.", related: "Documents", assignee: "Meera Iyer", when: "Today · 08:50" },
      ],
      activity: [
        { time: "2 Aug · 17:00", body: "Booking created from Q-1048 · accepted Proposal v2." },
        { time: "3 Aug · 11:00", body: "Supplier confirmed hotel and Volvo." },
        { time: "4 Aug · 09:30", body: "Document request sent to customer." },
      ],
      ledger: {
        receivable: 95000,
        sellingPrice: 95000,
        totalCost: 62000,
        margin: 33000,
        deposits: 80000,
        customerPaid: 80000,
        customerBalance: 15000,
        vendorPayable: 62000,
        vendorSettled: 62000,
        cashIn: 80000,
        cashOut: 62000,
        entryCount: 4,
      },
      nextAction: {
        kind: "task",
        title: "Request missing documents",
        body: "Booking is confirmed — passports and trip docs are still missing.",
        cta: "Open documents",
        ctaTarget: "documents",
      },
      lifecycle: { mode: "reopen", readiness: 70 },
    },
    {
      id: "BK-2026-000001",
      slug: "tripura",
      title: "Jain Family · Tripura",
      customer: "Jain Family",
      destination: "Tripura",
      queryId: "Q-1021",
      proposalVersion: "v1",
      phase: "completed",
      confirmed: true,
      confirmations: { supplier: "confirmed", voucher: "issued", documents: "received" },
      paymentOverdue: false,
      paymentsOpen: false,
      priority: 5,
      travelStart: "2026-08-01",
      travelEnd: "2026-08-04",
      pax: 2,
      owner: DEMO_OWNER,
      team: [DEMO_STAFF.vrushabh],
      toCollect: 0,
      toPaySuppliers: 0,
      moneySettled: true,
      actionHint: "",
      linkedProposal: "Tripura Trip Proposal",
      tripLabel: "Tripura",
      notesList: [{ author: "Vrushabh Jain", time: "4 Aug · 18:00", body: "Customer happy with Guwahati transit handling." }],
      itinerarySub: "Trip completed.",
      itineraryNote: "Domestic short-haul · Guwahati transit.",
      services: [
        {
          id: "svc-tripura",
          type: "trip",
          name: "Package",
          vendor: "NE Holidays",
          vendorContact: "+91 38xxx 11001",
          vendorEmail: "ops@neholidays.in",
          serviceDetail: "Guwahati transit + Tripura ground package",
          cost: 28000,
          confirmation: "confirmed",
          deadline: "—",
          status: "Delivered",
          paymentTerms: { kind: "schedule", schedule: [{ id: "pt-tripura-1", label: "Full", percent: 100, trigger: "on_confirm" }] },
          payables: [{ id: "pay-tripura-1", label: "Full", amount: 28000, dueLabel: "paid", dueDate: "2026-07-22", status: "paid" }],
          vouchers: [{ id: "vh-tripura", name: "Trip voucher pack", attached: true, fileName: "ne-holidays.pdf" }],
        },
      ],
      tasks: [{ id: "T-601", title: "No open fulfilment work", priority: "low", assignee: DEMO_STAFF.vrushabh, due: "—", dependency: "None", status: "done" }],
      travellers: [
        { name: "Vrushabh Jain", age: 34, type: "Adult", contact: "+91 98xxx 20001", passport: "Verified", visa: "Not required", special: "—" },
        { name: "Guest Jain", age: 32, type: "Adult", contact: "+91 98xxx 20002", passport: "Verified", visa: "Not required", special: "—" },
      ],
      documents: [
        {
          id: "doc-tripura-pass-vj",
          type: "Passport",
          traveller: "Vrushabh Jain",
          status: "Verified",
          required: true,
          requiredBy: "—",
          fileName: "vrushabh-jain-passport.pdf",
          fileSize: "980 KB",
          fileKind: "pdf",
          receivedAt: "21 Jul · 09:00",
          receivedVia: "Email",
          uploadedBy: "Vrushabh Jain",
          verifiedAt: "21 Jul · 09:30",
          verifiedBy: "Meera Iyer",
          extracted: { passportNo: "A•••••4410", expiry: "4 May 2030", nationality: "Indian" },
        },
        {
          id: "doc-tripura-pass-guest",
          type: "Passport",
          traveller: "Guest Jain",
          status: "Verified",
          required: true,
          requiredBy: "—",
          fileName: "guest-jain-passport.pdf",
          fileSize: "960 KB",
          fileKind: "pdf",
          receivedAt: "21 Jul · 09:05",
          receivedVia: "Email",
          uploadedBy: "Vrushabh Jain",
          verifiedAt: "21 Jul · 09:32",
          verifiedBy: "Meera Iyer",
          extracted: { passportNo: "A•••••4418", expiry: "14 Sep 2029", nationality: "Indian" },
        },
        {
          id: "doc-tripura-arrival",
          type: "Arrival flight details",
          traveller: "",
          status: "Verified",
          required: false,
          requiredBy: "—",
          note: "Customer-uploaded reference for arrival",
          fileName: "jain-guwahati-arrival.pdf",
          fileSize: "160 KB",
          fileKind: "pdf",
          receivedAt: "22 Jul · 11:00",
          receivedVia: "Email",
          uploadedBy: "Vrushabh Jain",
          verifiedAt: "22 Jul · 11:20",
          verifiedBy: "Meera Iyer",
        },
      ],
      vouchers: [
        {
          id: "tv-tripura",
          serviceId: "svc-tripura",
          name: "Trip voucher pack",
          source: "agency",
          status: "sent",
          blockReason: "",
          fileName: "ne-holidays-voucher.pdf",
          sentAt: "1 Aug, 11:00 AM",
        },
      ],
      threads: [
        { party: "Customer", channel: "Email", with: "Jain Family", preview: "Thank you note received.", related: "Trip", assignee: "Vrushabh Jain", when: "5 Aug · 09:00" },
      ],
      activity: [
        { time: "20 Jul · 10:00", body: "Booking created from Q-1021 · accepted Proposal v1." },
        { time: "4 Aug · 21:00", body: "Trip marked completed · no open blockers." },
      ],
      ledger: {
        receivable: 45000,
        sellingPrice: 45000,
        totalCost: 28000,
        margin: 17000,
        deposits: 45000,
        customerPaid: 45000,
        customerBalance: 0,
        vendorPayable: 28000,
        vendorSettled: 28000,
        cashIn: 45000,
        cashOut: 28000,
        entryCount: 4,
      },
      nextAction: {
        kind: "clear",
        title: "Nothing is blocking this booking",
        body: "Trip closed — no open blockers.",
      },
      lifecycle: { mode: "reopen", readiness: 100 },
    },
    {
      id: "BK-2026-000007",
      slug: "rao-jaipur",
      title: "Rao Family · Jaipur",
      customer: "Rao Family",
      destination: "Jaipur",
      queryId: "",
      proposalVersion: "v1",
      phase: "cancelled",
      confirmed: false,
      confirmations: { supplier: "pending", voucher: "pending", documents: "missing" },
      paymentOverdue: false,
      paymentsOpen: false,
      priority: 9,
      travelStart: "2026-09-01",
      travelEnd: "2026-09-04",
      pax: 2,
      owner: DEMO_OWNER,
      team: [DEMO_STAFF.vrushabh],
      toCollect: 0,
      toPaySuppliers: 0,
      actionHint: "",
      linkedProposal: "Jaipur Weekend",
      tripLabel: "Jaipur",
      notesList: [{ author: "Vrushabh Jain", time: "28 Jul · 13:00", body: "Customer cancelled due to visa delay — keep warm for next quarter." }],
      itinerarySub: "Cancelled before supplier lock.",
      itineraryNote: "No live services.",
      services: [],
      tasks: [],
      travellers: [
        { name: "Anil Rao", age: 41, type: "Adult", contact: "+91 98xxx 70001", passport: "Missing", visa: "Pending", special: "—" },
        { name: "Sita Rao", age: 39, type: "Adult", contact: "+91 98xxx 70002", passport: "Missing", visa: "Pending", special: "—" },
      ],
      documents: [
        { id: "doc-rao-pass-anil", type: "Passport", traveller: "Anil Rao", status: "Missing", required: true, requiredBy: "—" },
        { id: "doc-rao-pass-sita", type: "Passport", traveller: "Sita Rao", status: "Missing", required: true, requiredBy: "—" },
        { id: "doc-rao-visa-anil", type: "Visa copy", traveller: "Anil Rao", status: "Missing", required: true, requiredBy: "—" },
        { id: "doc-rao-visa-sita", type: "Visa copy", traveller: "Sita Rao", status: "Missing", required: true, requiredBy: "—" },
      ],
      vouchers: [],
      threads: [
        { party: "Customer", channel: "Email", with: "Rao Family", preview: "Cancellation acknowledged.", related: "Lifecycle", assignee: "Vrushabh Jain", when: "28 Jul · 13:10" },
      ],
      activity: [
        { time: "25 Jul · 16:00", body: "Booking created from Q-1030." },
        { time: "28 Jul · 13:05", body: "Booking cancelled — visa delay." },
      ],
      ledger: {
        receivable: 0,
        sellingPrice: 0,
        totalCost: 0,
        margin: 0,
        deposits: 0,
        customerPaid: 0,
        customerBalance: 0,
        vendorPayable: 0,
        vendorSettled: 0,
        cashIn: 0,
        cashOut: 0,
        entryCount: 0,
      },
      nextAction: {
        kind: "clear",
        title: "Booking cancelled",
        body: "No operational work remains on this booking.",
      },
      lifecycle: { mode: "reopen", readiness: 0 },
    },
  ];

  const bookingsState = {
    tab: "upcoming",
    scope: "all",
    scopeMember: "all",
    search: "",
    sort: "priority",
    attentionFilter: "all",
    issueFilter: "all",
    ownerFilter: "all",
    departWindow: "all",
    destinationFilter: "all",
    sourceFilter: "all",
    archiveWindow: "all",
    page: 0,
    pageSize: 50,
    detailSlug: null,
    detailTab: "overview",
    filtersActive: false,
    commThreadId: null,
    commCompose: false,
    docId: null,
    docFocusTraveller: null,
    docFocusType: null,
    travellerFocusId: null,
    travellerMenuId: null,
    travellerIssuesOpen: null,
    travellerFilter: "all",
  };

  /**
   * Master Inbox layer — Booking → Communication is a filtered view of the same threads.
   * Channels (WhatsApp / Email) are how messages are delivered; Paryatech is the interface.
   */
  const INBOX_THREADS = [];

  function partyRoleLabel(party) {
    if (party === "Vendor") return "Vendor";
    if (party === "Traveller") return "Traveller";
    return "Traveller"; // Customer conversations surface as traveller-facing
  }

  function seedInboxThreadFromBooking(raw, booking, index) {
    const id = raw.id || `IN-${booking.slug}-${index + 1}`;
    const channel = raw.channel === "Email" ? "Email" : "WhatsApp";
    const contactName = raw.with || booking.customer;
    const related = raw.related || "Booking";
    const messages =
      Array.isArray(raw.messages) && raw.messages.length
        ? raw.messages
        : [
            {
              id: `${id}-m1`,
              from: "contact",
              body: raw.preview || "Conversation started.",
              at: raw.when || "Earlier",
              channel,
            },
            {
              id: `${id}-m2`,
              from: "staff",
              body:
                channel === "WhatsApp"
                  ? `Noted — we'll update you on ${booking.id}.`
                  : `Thanks — following up on ${booking.id} / ${related}.`,
              at: "Just now",
              channel,
            },
          ];
    return {
      id,
      bookingSlug: booking.slug,
      bookingId: booking.id,
      party: raw.party === "Vendor" ? "Vendor" : "Customer",
      roleLabel: partyRoleLabel(raw.party),
      channel,
      contactName,
      related,
      serviceId: raw.serviceId || "",
      assignee: raw.assignee || booking.owner?.name || "",
      when: raw.when || "Today",
      preview: raw.preview || messages[messages.length - 1]?.body || "",
      unread: !!raw.unread,
      linkSource: raw.linkSource || "booking",
      messages,
    };
  }

  function buildInboxThreads() {
    INBOX_THREADS.length = 0;
    BOOKINGS.forEach((booking) => {
      (booking.threads || []).forEach((thread, index) => {
        INBOX_THREADS.push(seedInboxThreadFromBooking(thread, booking, index));
      });
    });
    // Unlinked Inbox noise — visible in master Inbox later; not shown on a Booking until linked.
    INBOX_THREADS.push({
      id: "IN-unlinked-01",
      bookingSlug: "",
      bookingId: "",
      party: "Customer",
      roleLabel: "Traveller",
      channel: "WhatsApp",
      contactName: "Amit XYZ",
      related: "",
      serviceId: "",
      assignee: "",
      when: "Today · 12:05",
      preview: "Can you call me?",
      unread: true,
      linkSource: "unlinked",
      messages: [
        { id: "IN-unlinked-01-m1", from: "contact", body: "Can you call me?", at: "Today · 12:05", channel: "WhatsApp" },
      ],
    });
  }

  buildInboxThreads();

  const paymentsState = {
    search: "",
    stage: "all",
    type: "all",
    date: "30",
    method: "all",
  };

  const BOOKING_PAYMENTS = [
    {
      id: "PAY-2026-0018",
      bookingSlug: "xyz-dubai",
      bookingId: "BK-2026-000003",
      bookingTitle: "XYZ Family · Dubai",
      customer: "XYZ Family",
      customerInitials: "XF",
      avatarClass: "avatar-pink",
      amount: 20500,
      type: "customer",
      stage: "completed",
      previousStage: "Pending",
      method: "UPI",
      time: "11:42",
      dayOffset: 0,
      groupKey: "today",
      groupLabel: "Today · 7 Aug 2026",
      eventLabel: "Customer receipt recorded",
    },
    {
      id: "PAY-2026-0017",
      bookingSlug: "ladakh",
      bookingId: "BK-2026-000002",
      bookingTitle: "Jain Family · Ladakh",
      customer: "Jain Family",
      customerInitials: "JF",
      avatarClass: "avatar-mint",
      amount: 223456,
      type: "customer",
      stage: "overdue",
      previousStage: "Partial",
      method: "Bank transfer",
      time: "10:15",
      dayOffset: 0,
      groupKey: "today",
      groupLabel: "Today · 7 Aug 2026",
      eventLabel: "Balance due reminder raised",
    },
    {
      id: "PAY-2026-0016",
      bookingSlug: "ladakh",
      bookingId: "BK-2026-000002",
      bookingTitle: "Jain Family · Ladakh",
      customer: "Jain Family",
      customerInitials: "JF",
      avatarClass: "avatar-mint",
      amount: 900000,
      type: "customer",
      stage: "partial",
      previousStage: "Pending",
      method: "Bank transfer",
      time: "16:08",
      dayOffset: 1,
      groupKey: "yesterday",
      groupLabel: "Yesterday · 6 Aug 2026",
      eventLabel: "Advance received against booking",
    },
    {
      id: "PAY-2026-0015",
      bookingSlug: "tripura",
      bookingId: "BK-2026-000001",
      bookingTitle: "Jain Family · Tripura",
      customer: "Jain Family",
      customerInitials: "JF",
      avatarClass: "avatar-mint",
      amount: 28000,
      type: "vendor",
      stage: "completed",
      previousStage: "Pending",
      method: "UPI",
      time: "14:22",
      dayOffset: 1,
      groupKey: "yesterday",
      groupLabel: "Yesterday · 6 Aug 2026",
      eventLabel: "Vendor payout settled",
    },
    {
      id: "PAY-2026-0014",
      bookingSlug: "xyz-dubai",
      bookingId: "BK-2026-000003",
      bookingTitle: "XYZ Family · Dubai",
      customer: "XYZ Family",
      customerInitials: "XF",
      avatarClass: "avatar-pink",
      amount: 12000,
      type: "customer",
      stage: "pending",
      previousStage: "—",
      method: "Card",
      time: "09:40",
      dayOffset: 3,
      groupKey: "earlier",
      groupLabel: "Earlier · Aug 2026",
      eventLabel: "Token payment requested",
    },
    {
      id: "PAY-2026-0013",
      bookingSlug: "tripura",
      bookingId: "BK-2026-000001",
      bookingTitle: "Jain Family · Tripura",
      customer: "Jain Family",
      customerInitials: "JF",
      avatarClass: "avatar-mint",
      amount: 45000,
      type: "customer",
      stage: "completed",
      previousStage: "Pending",
      method: "UPI",
      time: "18:05",
      dayOffset: 5,
      groupKey: "earlier",
      groupLabel: "Earlier · Aug 2026",
      eventLabel: "Full customer payment collected",
    },
    {
      id: "PAY-2026-0012",
      bookingSlug: "ladakh",
      bookingId: "BK-2026-000002",
      bookingTitle: "Jain Family · Ladakh",
      customer: "Jain Family",
      customerInitials: "JF",
      avatarClass: "avatar-mint",
      amount: 15000,
      type: "refund",
      stage: "refunded",
      previousStage: "Completed",
      method: "Bank transfer",
      time: "12:30",
      dayOffset: 8,
      groupKey: "earlier",
      groupLabel: "Earlier · Aug 2026",
      eventLabel: "Partial refund issued to customer",
    },
    {
      id: "PAY-2026-0011",
      bookingSlug: "xyz-dubai",
      bookingId: "BK-2026-000003",
      bookingTitle: "XYZ Family · Dubai",
      customer: "XYZ Family",
      customerInitials: "XF",
      avatarClass: "avatar-pink",
      amount: 8500,
      type: "vendor",
      stage: "failed",
      previousStage: "Pending",
      method: "Card",
      time: "11:05",
      dayOffset: 10,
      groupKey: "earlier",
      groupLabel: "Earlier · Jul 2026",
      eventLabel: "Supplier transfer failed — retry needed",
    },
  ];


  function formatINR(amount, { signed = true } = {}) {
    const abs = Math.abs(Math.round(amount));
    const formatted = abs.toLocaleString("en-IN");
    if (!signed) return `₹${formatted}`;
    if (amount < 0) return `-₹${formatted}`;
    if (amount > 0) return `₹${formatted}`;
    return `₹${formatted}`;
  }

  /** Compact lakhs for summary lines — e.g. 243956 → ₹2.44L */
  function formatINRCompact(amount) {
    const abs = Math.abs(Math.round(amount));
    if (abs >= 100000) {
      const lakhs = abs / 100000;
      const text = lakhs >= 10 ? lakhs.toFixed(1) : lakhs.toFixed(2);
      return `₹${text.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1")}L`;
    }
    if (abs >= 1000) {
      const thousands = abs / 1000;
      const text = Number.isInteger(thousands) ? String(thousands) : thousands.toFixed(1).replace(/\.0$/, "");
      return `₹${text}K`;
    }
    return formatINR(abs, { signed: false });
  }

  function bookingMoneyDue(b) {
    return (Number(b.toCollect) || 0) + (Number(b.toPaySuppliers) || 0);
  }

  function bookingNextOpenPayable(b) {
    const openPayables = collectBookingPayables(b).filter((p) => p.status !== "paid" && (Number(p.amount) || 0) > 0);
    if (!openPayables.length) return null;
    return [...openPayables].sort((a, c) => String(a.dueDate || "9999").localeCompare(String(c.dueDate || "9999")))[0];
  }

  /** Explicit money copy — never mixes signed amounts with “settled”. */
  function getBookingMoneyCopy(b) {
    syncBookingSupplierTotals(b);
    const toCollect = Math.max(0, Number(b.toCollect) || 0);
    const lines = [];

    if (toCollect > 0) {
      lines.push({
        amount: formatINR(toCollect, { signed: false }),
        label: "to collect",
        tone: "is-collect",
      });
    }
    const supplier = getBookingSupplierMoneyCopy(b);
    const nextPayable = bookingNextOpenPayable(b);
    if (nextPayable) {
      lines.push({
        amount: formatINR(nextPayable.amount, { signed: false }),
        label: "to pay supplier",
        tone: "is-pay",
      });
    } else if ((Number(b.toPaySuppliers) || 0) > 0) {
      lines.push({
        amount: formatINR(b.toPaySuppliers, { signed: false }),
        label: "to pay supplier",
        tone: "is-pay",
      });
    } else if (supplier.title && /paid$/i.test(supplier.title)) {
      lines.push({
        amount: supplier.title.replace(/\s*paid$/i, ""),
        label: "paid",
        tone: "is-settled",
      });
    }
    if (lines.length) {
      return {
        lines,
        title: lines.map((l) => `${l.amount}${l.label ? ` ${l.label}` : ""}`).join(" · "),
      };
    }
    if (b.moneySettled) {
      return {
        lines: [{ amount: "Settled", label: "", tone: "is-settled" }],
        title: "Settled — no open money",
      };
    }
    return {
      lines: [{ amount: "Settled", label: "", tone: "is-settled" }],
      title: "Settled",
    };
  }

  function formatCustomerBalanceCopy(amount) {
    const n = Math.round(Number(amount) || 0);
    if (n > 0) return `${formatINR(n, { signed: false })} to collect`;
    if (n < 0) return `${formatINR(Math.abs(n), { signed: false })} credit`;
    return "No balance";
  }

  function formatVendorPayCopy(payable, settled) {
    const open = Math.max(0, Math.round(Number(payable) || 0) - Math.round(Number(settled) || 0));
    if (open > 0) return `${formatINR(open, { signed: false })} to pay supplier`;
    if ((Number(payable) || 0) > 0) return "Settled";
    return "No balance";
  }

  function formatBookingDates(start, end, { short = false } = {}) {
    const s = new Date(`${start}T12:00:00`);
    const e = new Date(`${end}T12:00:00`);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (short) {
      if (start === end) return `${s.getDate()} ${months[s.getMonth()]} – ${e.getDate()} ${months[e.getMonth()]} ${e.getFullYear()}`;
      return `${s.getDate()} ${months[s.getMonth()]} – ${e.getDate()} ${months[e.getMonth()]} ${e.getFullYear()}`;
    }
    if (start === end) {
      return `${months[s.getMonth()]} ${s.getDate()}, ${s.getFullYear()}`;
    }
    return `${months[s.getMonth()]} ${s.getDate()}, ${s.getFullYear()} – ${months[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`;
  }

  function formatListDates(start, end) {
    const s = new Date(`${start}T12:00:00`);
    const e = new Date(`${end}T12:00:00`);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${s.getDate()} ${months[s.getMonth()]} – ${e.getDate()} ${months[e.getMonth()]} ${e.getFullYear()}`;
  }

  function formatListDatesShort(start, end) {
    if (!start || !end) return "";
    const s = new Date(`${start}T12:00:00`);
    const e = new Date(`${end}T12:00:00`);
    if (!Number.isFinite(s.getTime()) || !Number.isFinite(e.getTime())) return "";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (start === end) return `${s.getDate()} ${months[s.getMonth()]}`;
    if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
      return `${s.getDate()}–${e.getDate()} ${months[s.getMonth()]}`;
    }
    return `${s.getDate()} ${months[s.getMonth()]} – ${e.getDate()} ${months[e.getMonth()]}`;
  }

  function bookingDepartsLabel(b) {
    if (!b) return "";
    if (b.phase === "travelling") return "Travelling";
    if (b.phase === "completed") return "Ended";
    if (b.phase === "cancelled") return "Cancelled";
    const days = daysUntilTravel(b);
    if (!Number.isFinite(days)) return "";
    if (days < 0) return "Departed";
    if (days === 0) return "Departs today";
    if (days === 1) return "Departs in 1 day";
    return `Departs in ${days} days`;
  }

  function bookingTripContextLine(b) {
    const parts = [
      formatListDatesShort(b.travelStart, b.travelEnd),
      b.pax != null ? `${b.pax} traveller${Number(b.pax) === 1 ? "" : "s"}` : "",
      bookingDepartsLabel(b),
    ].filter(Boolean);
    return parts.join(" · ");
  }

  function bookingTraceLine(b) {
    const parts = [];
    if (b?.id) parts.push(b.id);
    if (b?.queryId) parts.push(b.queryId);
    if (b?.proposalVersion) parts.push(`Proposal ${b.proposalVersion}`);
    return parts.join(" · ");
  }

  function bookingProblemLabels(b, issues = getBookingOpenIssues(b)) {
    const c = b?.confirmations || {};
    const docs = bookingDocuments(b);
    const missingDocs = docs.filter((d) => d.required !== false && !docStatusIsComplete(d.status)).length;
    const vouchers = bookingVouchers(b);
    const blockedVouchers = vouchers.filter((v) => v.status === "blocked").length;
    const plural = (n, one, many) => (n === 1 ? one : many);

    return issues.map((issue) => {
      if (issue === "supplier") return "Supplier pending";
      if (issue === "vouchers") {
        const blocked =
          blockedVouchers > 0 ? blockedVouchers : bookingHasVoucherBlocked(b) || c.voucher === "blocked" ? 1 : 0;
        if (blocked > 0) {
          return `${blocked} ${plural(blocked, "voucher", "vouchers")} blocked`;
        }
        return "Voucher pending";
      }
      if (issue === "documents") {
        if (missingDocs > 0) return `${missingDocs} ${plural(missingDocs, "doc", "docs")} missing`;
        if (bookingHasDocumentsExpiring(b)) return "Documents expiring";
        return "Docs missing";
      }
      if (issue === "customer_payment") return b?.paymentOverdue ? "Payment overdue" : "Payment due";
      if (issue === "supplier_payment") return "Supplier payment due";
      return bookingIssueLabel(issue);
    });
  }

  function bookingIssuePriorityRank(b, issue) {
    if (issue === "customer_payment" && b?.paymentOverdue) return 0;
    if (issue === "vouchers" && bookingHasVoucherBlocked(b)) return 1;
    if (issue === "supplier") return 2;
    if (issue === "documents") return 3;
    if (issue === "customer_payment") return 4;
    if (issue === "supplier_payment") return 5;
    if (issue === "vouchers") return 6;
    return 9;
  }

  function sortBookingIssuesByPriority(b, issues = getBookingOpenIssues(b)) {
    return [...(issues || [])].sort((a, bIssue) => bookingIssuePriorityRank(b, a) - bookingIssuePriorityRank(b, bIssue));
  }

  function bookingActionItemPriorityRank(booking, item) {
    if (item?.id === "payment" && booking?.paymentOverdue) return 0;
    if (item?.id === "vouchers" && bookingHasVoucherBlocked(booking)) return 1;
    if (item?.id === "vendor") return 2;
    if (item?.id === "documents") return 3;
    if (item?.id === "travellers") return 4;
    if (item?.id === "payment") return 5;
    if (item?.id === "vouchers") return 6;
    return 9;
  }

  function sortBookingActionItemsByPriority(booking, items) {
    return [...(items || [])].sort(
      (a, b) => bookingActionItemPriorityRank(booking, a) - bookingActionItemPriorityRank(booking, b)
    );
  }

  function bookingProblemsLine(b, issues = getBookingOpenIssues(b)) {
    const sorted = sortBookingIssuesByPriority(b, issues);
    const labels = bookingProblemLabels(b, sorted);
    if (!labels.length) return "";
    const shown = labels.slice(0, BOOKING_ISSUE_CHIP_LIMIT);
    const extra = labels.length - shown.length;
    return extra > 0 ? `${shown.join(" · ")} · +${extra} issues` : shown.join(" · ");
  }

  function bookingIssueChipsHtml(b, issues = getBookingOpenIssues(b), {
    limit = BOOKING_ISSUE_CHIP_LIMIT,
    wrapClass = "bookings-row-problems bookings-issue-row",
    interactiveMore = true,
  } = {}) {
    if (!issues?.length) return "";
    const sorted = sortBookingIssuesByPriority(b, issues);
    const labels = bookingProblemLabels(b, sorted);
    const shown = sorted.slice(0, limit);
    const extra = sorted.length - shown.length;
    const chips = shown
      .map((issue, idx) => {
        const label = labels[idx] || bookingIssueLabel(issue);
        return `<span class="booking-issue-pill is-${escapeHtml(issue)}">${escapeHtml(label)}</span>`;
      })
      .join("");
    let more = "";
    if (extra > 0) {
      const moreLabel = `+${extra} ${extra === 1 ? "issue" : "issues"}`;
      if (interactiveMore && b?.slug) {
        more = `<span role="button" tabindex="0" class="booking-issue-more is-action" data-booking-issues-more="${escapeHtml(
          b.slug
        )}" title="Open booking readiness">${escapeHtml(moreLabel)}</span>`;
      } else {
        more = `<span class="booking-issue-more">${escapeHtml(moreLabel)}</span>`;
      }
    }
    return `<span class="${wrapClass}">${chips}${more}</span>`;
  }

  function openBookingFromList(slug, tab = "overview", { focusReadiness = false } = {}) {
    const booking = getBookingBySlug(slug);
    if (!booking) return;
    let key = focusReadiness ? "overview" : BOOKING_DETAIL_TABS[tab] ? tab : "overview";
    if (!canAccessBookingTab(key, booking)) {
      if (tab === "finance") showToast("Finance needs Finance permission…");
      else showToast("You don’t have access to that tab…");
      key = firstAllowedBookingTab(booking, "overview");
    }
    openBookingDetail(slug, { tab: key, push: true, focusReadiness });
  }

  function bookingNextActionDueFragment(b) {
    const action = b?.nextAction;
    if (action?.due) return String(action.due);
    if (action?.dueLabel) return String(action.dueLabel);
    const services = typeof bookingServices === "function" ? bookingServices(b) : b?.services || [];
    const withDeadline = (services || []).find((s) => s?.deadline && s.deadline !== "—" && s.confirmation !== "confirmed");
    if (withDeadline?.deadline) {
      const d = String(withDeadline.deadline);
      return /^due\b/i.test(d) ? d : `due ${d}`;
    }
    const overdueTask = (b?.tasks || []).find((t) => t.status === "overdue" && t.due);
    if (overdueTask?.due) return String(overdueTask.due);
    const openTask = (b?.tasks || []).find((t) => (t.status === "open" || t.status === "blocked") && t.due && t.due !== "—");
    if (openTask?.due) return /^due\b/i.test(String(openTask.due)) ? String(openTask.due) : `due ${openTask.due}`;
    return "";
  }

  function bookingNextActionLine(b) {
    if (!b) return "";
    const title = (b.nextAction?.title || "").trim();
    if (!title || /nothing is blocking|no open|clear/i.test(title)) return "";
    const due = bookingNextActionDueFragment(b);
    return due ? `${title} · ${due}` : title;
  }

  function formatShortDueDate(isoOrLabel) {
    if (!isoOrLabel) return "";
    const raw = String(isoOrLabel).trim();
    if (!raw || raw === "—") return "";
    if (/^due\b/i.test(raw) || /overdue|today/i.test(raw)) return raw.replace(/^due\s+/i, "Due ");
    const parsed = Date.parse(raw.length <= 10 ? `${raw}T12:00:00` : raw);
    if (!Number.isFinite(parsed)) return raw.startsWith("Due") ? raw : `Due ${raw}`;
    const d = new Date(parsed);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `Due ${d.getDate()} ${months[d.getMonth()]}`;
  }

  function bookingRowMoneyLines(b) {
    if (!canViewBookingFinance()) {
      return {
        lines: [{ text: "Finance restricted", tone: "is-clear" }],
        title: "Finance restricted",
      };
    }
    syncBookingSupplierTotals(b);
    const toCollect = Math.max(0, Number(b.toCollect) || 0);
    const nextPayable = bookingNextOpenPayable(b);
    const toPay = nextPayable
      ? Math.max(0, Number(nextPayable.amount) || 0)
      : Math.max(0, Number(b.toPaySuppliers) || 0);
    const lines = [];
    let kind = "settled";

    if (toCollect > 0) {
      kind = "collect";
      lines.push({
        text: `${formatINR(toCollect, { signed: false })} to collect`,
        tone: "is-collect",
      });
    } else if (toPay > 0) {
      kind = "pay";
      lines.push({
        text: `${formatINR(toPay, { signed: false })} to pay supplier`,
        tone: "is-pay",
      });
    } else {
      lines.push({ text: "Settled", tone: "is-settled" });
    }

    if (kind === "collect") {
      if (b.paymentOverdue) {
        lines.push({ text: "Overdue", tone: "is-collect" });
      } else if (b.collectDue) {
        const due = formatShortDueDate(b.collectDue);
        if (due) lines.push({ text: due, tone: "is-collect" });
      } else {
        const paid = Math.max(0, Number(b.ledger?.customerPaid ?? b.ledger?.cashIn) || 0);
        if (paid > 0) {
          lines.push({
            text: `${formatINR(paid, { signed: false })} received`,
            tone: "is-collect",
          });
        }
      }
    } else if (kind === "pay") {
      if (b.paymentOverdue) {
        lines.push({ text: "Overdue", tone: "is-pay" });
      } else {
        const due = formatShortDueDate(nextPayable?.dueDate || nextPayable?.dueLabel);
        if (due) lines.push({ text: due, tone: "is-pay" });
      }
    }

    return {
      lines,
      title: lines.map((l) => l.text).join(" · "),
      launchFinance: kind === "collect" || kind === "pay",
    };
  }

  function bookingOwnerSideLabel(booking) {
    const owner = booking?.owner;
    const initials = owner?.initials || "—";
    const extras = bookingOwnerExtrasCount(booking);
    return extras > 0 ? `${initials} +${extras}` : initials;
  }

  function bookingInitial(title) {
    return (title || "B").trim().charAt(0).toUpperCase();
  }

  function phaseLabel(phase) {
    if (phase === "upcoming") return "Upcoming";
    if (phase === "travelling") return "Travelling";
    if (phase === "completed") return "Completed";
    if (phase === "cancelled") return "Cancelled";
    return phase;
  }

  function attentionLabel(attention) {
    if (attention === "at_risk") return "At risk";
    if (attention === "needs_action") return "Needs action";
    return "Healthy";
  }

  function daysUntilTravel(booking) {
    const start = new Date(`${booking.travelStart}T12:00:00`);
    const today = new Date("2026-08-10T12:00:00");
    return Math.ceil((start - today) / 86400000);
  }

  function bookingIssueLabel(issue) {
    return BOOKING_ISSUE_LABELS[issue] || issue;
  }

  function getBookingOpenIssues(b) {
    const issues = [];
    const c = b.confirmations || {};
    const services = bookingServices(b);
    if (c.supplier === "pending" || services.some((s) => s.confirmation !== "confirmed")) {
      issues.push("supplier");
    }
    const docs = bookingDocuments(b);
    const requiredOpen = docs.filter((d) => d.required !== false && !docStatusIsComplete(d.status));
    const docsExpiring = docs.some((d) => d.status === "Expiring");
    if (requiredOpen.length || c.documents === "missing" || docsExpiring) {
      issues.push("documents");
    }
    if (c.voucher === "blocked" || c.voucher === "pending") {
      issues.push("vouchers");
    } else if (bookingVouchers(b).some((v) => v.status === "blocked" || v.status === "ready")) {
      issues.push("vouchers");
    }
    const toCollect = Math.max(0, Number(b.toCollect) || 0);
    if (toCollect > 0 || b.paymentOverdue) issues.push("customer_payment");
    const toPay = Math.max(0, Number(b.toPaySuppliers) || 0);
    if (toPay > 0) issues.push("supplier_payment");
    return issues;
  }

  function getBookingOpsOpenIssues(booking) {
    return getBookingOpenIssues(booking).filter((issue) => !BOOKING_MONEY_ISSUE_KEYS.has(issue));
  }

  function bookingHasVoucherBlocked(b) {
    const c = b.confirmations || {};
    if (c.voucher === "blocked") return true;
    return bookingVouchers(b).some((v) => v.status === "blocked");
  }

  function bookingHasDocumentsExpiring(b) {
    return bookingDocuments(b).some((d) => d.status === "Expiring");
  }

  function getBookingAttention(b) {
    if (b.phase === "cancelled") return "healthy";
    const issues = getBookingOpenIssues(b);
    const days = daysUntilTravel(b);
    const docs = bookingDocuments(b);
    const tasks = b.tasks || [];
    const missingRequired = docs.some((d) => d.required !== false && d.status === "Missing");
    const atRisk =
      bookingHasVoucherBlocked(b) ||
      !!b.paymentOverdue ||
      bookingHasDocumentsExpiring(b) ||
      (issues.length > 0 && Number.isFinite(days) && days >= 0 && days <= 7) ||
      (missingRequired && Number.isFinite(days) && days >= 0 && days <= 14);
    if (atRisk) return "at_risk";
    const needs =
      !b.confirmed ||
      issues.length > 0 ||
      tasks.some((t) => t.status === "open" || t.status === "overdue" || t.status === "blocked");
    if (needs) return "needs_action";
    return "healthy";
  }

  function confirmationStatusLabel(key, value) {
    if (key === "supplier") return value === "confirmed" ? "Done" : "Pending";
    if (key === "voucher") {
      if (value === "issued") return "Done";
      if (value === "blocked") return "Blocked";
      return "Pending";
    }
    if (key === "documents") return value === "received" ? "Done" : "Missing";
    return value;
  }

  function confirmationIsOpen(key, value) {
    if (key === "supplier") return value !== "confirmed";
    if (key === "voucher") return value !== "issued" && value !== "sent";
    if (key === "documents") return value !== "received";
    return true;
  }

  function markConfirmationDone(booking, key) {
    if (!booking.confirmations) booking.confirmations = {};
    if (key === "supplier") {
      const services = bookingServices(booking);
      const blocked = services.find((s) => s.confirmation !== "confirmed");
      if (blocked) {
        showToast("Attach vouchers and confirm each vendor first…");
        setBookingDetailTab("services", { updateHash: true });
        return false;
      }
      booking.confirmations.supplier = "confirmed";
    }
    if (key === "voucher") {
      const vouchers = bookingVouchers(booking);
      const blocked = vouchers.find((v) => v.status === "blocked");
      if (blocked) {
        showToast("Confirm linked vendors before issuing traveller vouchers…");
        setBookingDetailTab("services", { updateHash: true });
        return false;
      }
      vouchers.forEach((v) => {
        if (v.status === "ready") {
          v.status = "issued";
          v.fileName = v.fileName || `${(v.name || "voucher").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`;
        }
      });
      syncVoucherConfirmationState(booking);
    }
    if (key === "documents") {
      // Completion is system-driven when every required document is Verified.
      showToast("Documents complete when every required file is verified…");
      setBookingDetailTab("documents", { updateHash: true });
      return false;
    }
    const open = getBookingOpsOpenIssues(booking);
    if (!open.length) {
      booking.actionHint = booking.paymentOverdue
        ? "Collect overdue balance"
        : Number(booking.toCollect) || 0
          ? "Collect balance"
          : Number(booking.toPaySuppliers) || 0
            ? "Pay suppliers"
            : "";
      if (!booking.paymentOverdue && !(Number(booking.toCollect) || 0) && !(Number(booking.toPaySuppliers) || 0)) {
        booking.nextAction = {
          kind: "clear",
          title: "Confirmations complete",
          body: "Supplier, voucher and documents are done.",
        };
      } else if (booking.paymentOverdue || Number(booking.toCollect) || 0) {
        booking.nextAction = {
          kind: "task",
          title: "Collect customer balance",
          body: "Confirmations are done — money still needs collection.",
          cta: "Open finance",
          ctaTarget: "finance",
        };
      } else if (Number(booking.toPaySuppliers) || 0) {
        booking.nextAction = {
          kind: "task",
          title: "Pay suppliers",
          body: "Confirmations are done — supplier payout still open.",
          cta: "Open finance",
          ctaTarget: "finance",
        };
      }
    } else if (open.length === 1 && open[0] === "vouchers") {
      booking.actionHint = "Issue travel vouchers";
      booking.nextAction = {
        kind: "task",
        title: "Issue travel vouchers",
        body: "Supplier and documents are done — voucher is still pending.",
        cta: "Open vouchers",
        ctaTarget: "vouchers",
      };
    }
    return true;
  }

  function runBookingCtaTarget(target) {
    if (!target) return;
    if (target === "confirmations") {
      setBookingDetailTab("overview", { updateHash: true, scrollTop: false });
      scrollBookingOverviewReadiness();
      showToast("Review open issues on Overview…");
      return;
    }
    if (BOOKING_DETAIL_TABS[target]) {
      const booking = bookingsState.detailSlug ? getBookingBySlug(bookingsState.detailSlug) : null;
      if (booking && !canAccessBookingTab(target, booking)) {
        showToast(target === "finance" ? "Finance needs Finance permission…" : "You don’t have access to that tab…");
        return;
      }
      setBookingDetailTab(target, { updateHash: true });
      const meta = Object.values(BOOKING_CONFIRM_META).find((item) => item.tab === target);
      showToast(meta?.openToast || `Opening ${target}…`);
    }
  }

  function getBookingsViewingAs() {
    return viewBookings?.dataset.viewingAs || viewTeam?.dataset.viewingAs || "Owner";
  }

  function isBookingsOwnerAdmin() {
    const role = getBookingsViewingAs();
    return role === "Owner" || role === "Admin";
  }

  function isBookingsOwner() {
    return getBookingsViewingAs() === "Owner";
  }

  function getBookingsViewerStaff() {
    const role = getBookingsViewingAs();
    if (role === "Member") return DEMO_STAFF.meera;
    if (role === "Admin") return DEMO_STAFF.neha;
    return DEMO_OWNER;
  }

  /** Demo persona permissions — Owner/Admin have Finance; Member is ops-only. */
  function canViewBookingFinance() {
    return isBookingsOwnerAdmin();
  }

  function canViewSupplierMoney() {
    return canViewBookingFinance();
  }

  function canAccessBookingTab(tab, booking = null) {
    if (!BOOKING_DETAIL_TABS[tab]) return false;
    if (booking && !memberCanAccessBooking(booking)) return false;
    if (tab === "finance") return canViewBookingFinance();
    // Ops tabs: vouchers/communication/activity require booking access (already checked).
    return true;
  }

  function firstAllowedBookingTab(booking, preferred = "overview") {
    if (canAccessBookingTab(preferred, booking)) return preferred;
    return "overview";
  }

  function applyBookingPersonaAccessFlags() {
    if (viewBookings) {
      viewBookings.dataset.financeAccess = canViewBookingFinance() ? "1" : "0";
      viewBookings.dataset.supplierMoney = canViewSupplierMoney() ? "1" : "0";
    }
  }

  function applyBookingsScopeForRole(role = getBookingsViewingAs()) {
    const next = role === "Admin" || role === "Member" ? role : "Owner";
    bookingsState.scope = next === "Member" ? "mine" : "all";
    bookingsState.scopeMember = "all";
    bookingsState.page = 0;
    syncBookingsScopeControls();
  }

  function syncBookingsScopeControls() {
    const role = getBookingsViewingAs();
    const scope = role === "Member" && bookingsState.scope === "all" ? "mine" : bookingsState.scope;
    if (scope !== bookingsState.scope) bookingsState.scope = scope;

    document.querySelectorAll("[data-bookings-scope]").forEach((btn) => {
      const active = btn.dataset.bookingsScope === scope;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    const showMemberFilter = role === "Owner";
    ["bookings-scope-member", "bookings-archive-scope-member"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.hidden = !showMemberFilter;
      if (el.value !== bookingsState.scopeMember) el.value = bookingsState.scopeMember || "all";
    });
  }

  function applyBookingDetailTabAccess(booking) {
    applyBookingPersonaAccessFlags();
    document.querySelectorAll("[data-booking-tab]").forEach((btn) => {
      const tab = btn.dataset.bookingTab;
      const allowed = canAccessBookingTab(tab, booking);
      btn.hidden = !allowed;
      btn.disabled = !allowed;
      btn.setAttribute("aria-hidden", String(!allowed));
      if (!allowed) {
        btn.classList.remove("is-active");
        btn.setAttribute("aria-selected", "false");
      }
    });
  }

  function bookingAssigneeIds(booking) {
    const ids = new Set();
    if (booking?.owner?.id) ids.add(booking.owner.id);
    bookingOpsAssigneeIds(booking).forEach((id) => ids.add(id));
    return ids;
  }

  function bookingOpsAssigneeIds(booking) {
    const ids = new Set();
    (booking?.team || []).forEach((member) => {
      if (member?.id) ids.add(member.id);
    });
    (booking?.tasks || []).forEach((task) => {
      const assignee = task?.assignee;
      if (assignee?.id) ids.add(assignee.id);
      else if (typeof assignee === "string") {
        const match = Object.values(DEMO_STAFF).find((person) => person.name === assignee);
        if (match?.id) ids.add(match.id);
      }
    });
    (booking?.threads || []).forEach((thread) => {
      const match = Object.values(DEMO_STAFF).find((person) => person.name === thread?.assignee);
      if (match?.id) ids.add(match.id);
    });
    return ids;
  }

  function bookingIsUnassigned(booking) {
    return !(booking?.team && booking.team.length);
  }

  function bookingMatchesScope(booking, scope = bookingsState.scope, viewer = getBookingsViewerStaff(), scopeMember = bookingsState.scopeMember) {
    const role = getBookingsViewingAs();
    let effective = scope === "mine" || scope === "unassigned" || scope === "all" ? scope : "all";
    if (role === "Member" && effective === "all") effective = "mine";

    let matches = true;
    if (effective === "mine") {
      matches = bookingOpsAssigneeIds(booking).has(viewer?.id);
    } else if (effective === "unassigned") {
      matches = bookingIsUnassigned(booking);
    }

    if (matches && role === "Owner" && scopeMember && scopeMember !== "all") {
      matches = bookingOpsAssigneeIds(booking).has(scopeMember);
    }
    return matches;
  }

  function memberCanAccessBooking(booking, staff = getBookingsViewerStaff()) {
    if (!booking) return false;
    if (isBookingsOwnerAdmin()) return true;
    return bookingOpsAssigneeIds(booking).has(staff.id) || bookingIsUnassigned(booking);
  }

  function getBookingConfirmationOpens(booking) {
    return getBookingOpsOpenIssues(booking);
  }

  function serviceTypeLabel(type) {
    return SERVICE_TYPES[type] || SERVICE_TYPES.trip;
  }

  function inferServiceType(line) {
    const raw = String(line?.type || line?.name || "").toLowerCase();
    if (SERVICE_TYPE_KEYS.includes(raw)) return raw;
    if (/flight|air/.test(raw)) return "flight";
    if (/hotel|stay|room/.test(raw)) return "hotel";
    if (/visa/.test(raw)) return "visa";
    if (/cruise|houseboat|boat/.test(raw)) return "cruise";
    if (/transport|transfer|cab|volvo|car/.test(raw)) return "transport";
    if (/trip|package|ground/.test(raw)) return "trip";
    return "trip";
  }

  function formatShortDueDate(iso) {
    if (!iso) return "—";
    const d = new Date(`${iso}T12:00:00`);
    if (Number.isNaN(d.getTime())) return iso;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${d.getDate()} ${months[d.getMonth()]}`;
  }

  function todayIsoDate() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function addDaysIso(iso, days) {
    const d = new Date(`${iso}T12:00:00`);
    d.setDate(d.getDate() + days);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function dueLabelForDate(iso, status) {
    if (status === "paid") return "paid";
    if (!iso) return "—";
    const today = todayIsoDate();
    if (iso === today) return "today";
    if (iso < today) return `overdue ${formatShortDueDate(iso)}`;
    return formatShortDueDate(iso);
  }

  function formatPayableCopy(payable) {
    const amount = formatINR(payable?.amount || 0, { signed: false });
    if (payable?.status === "paid") return `${amount} paid`;
    const due = payable?.dueLabel || dueLabelForDate(payable?.dueDate, payable?.status);
    if (due === "today") return `${amount} due today`;
    if (String(due).startsWith("overdue")) return `${amount} ${due}`;
    if (due && due !== "—") return `${amount} due ${due}`;
    return `${amount} due`;
  }

  function servicePayablesCopy(service) {
    if (service?.confirmation !== "confirmed") {
      if (service?.paymentTerms?.kind === "unknown") return "Payment terms unknown — set on confirm";
      if (service?.paymentTerms?.kind === "schedule") {
        const schedule = service.paymentTerms.schedule || [];
        if (schedule.length) {
          const cost = formatINR(service.cost || 0, { signed: false });
          const parts = schedule.map((row) => {
            if (row.trigger === "on_confirm") return `${row.percent || 0}% on confirmation`;
            if (row.trigger === "before_checkin") return `${row.percent || 0}% ${row.daysBefore || 7} days before check-in`;
            return row.label || "Scheduled";
          });
          return `${cost} · ${parts.join(", ")}`;
        }
      }
      return service?.cost ? `${formatINR(service.cost, { signed: false })} vendor cost` : "No payable yet";
    }
    const payables = service?.payables || [];
    if (!payables.length) return "No payable yet";
    return payables.map(formatPayableCopy).join(" · ");
  }

  function resolveScheduleDueDate(row, booking, activated) {
    if (row.trigger === "on_confirm") return activated ? todayIsoDate() : "";
    if (row.trigger === "before_checkin") {
      const start = booking.travelStart || todayIsoDate();
      return addDaysIso(start, -(Number(row.daysBefore) || 7));
    }
    return row.dueDate || "";
  }

  function buildPayablesFromTerms(service, booking, { activateOnConfirm = false } = {}) {
    const cost = Math.round(Number(service.cost) || 0);
    const terms = service.paymentTerms || { kind: "unknown" };
    if (terms.kind !== "schedule" || !Array.isArray(terms.schedule) || !terms.schedule.length) {
      return Array.isArray(service.payables) ? service.payables : [];
    }
    const existing = Array.isArray(service.payables) ? service.payables : [];
    let allocated = 0;
    return terms.schedule.map((row, index) => {
      const prev = existing.find((p) => p.id === `pay-${service.id}-${row.id}` || p.id === row.payableId || p.label === row.label);
      let amount = Math.round((cost * (Number(row.percent) || 0)) / 100);
      if (index === terms.schedule.length - 1) amount = Math.max(0, cost - allocated);
      else allocated += amount;
      const dueDate = resolveScheduleDueDate(row, booking, activateOnConfirm || service.confirmation === "confirmed");
      let status = prev?.status || "scheduled";
      if (activateOnConfirm || service.confirmation === "confirmed") {
        if (row.trigger === "on_confirm") status = prev?.status === "paid" ? "paid" : "due";
        else if (dueDate && dueDate <= todayIsoDate()) status = prev?.status === "paid" ? "paid" : "due";
        else status = prev?.status === "paid" ? "paid" : "scheduled";
      }
      return {
        id: prev?.id || `pay-${service.id}-${row.id || index}`,
        label: row.label || `Installment ${index + 1}`,
        amount,
        dueDate,
        dueLabel: dueLabelForDate(dueDate, status),
        status,
      };
    });
  }

  function ensureServicePayables(service, booking, { activateOnConfirm = false } = {}) {
    if (service.paymentTerms?.kind === "schedule") {
      service.payables = buildPayablesFromTerms(service, booking, { activateOnConfirm });
    } else if (!Array.isArray(service.payables)) {
      service.payables = [];
    }
    return service.payables;
  }

  function collectBookingPayables(booking) {
    return bookingServices(booking).flatMap((service) =>
      (service.payables || []).map((payable) => ({
        ...payable,
        serviceId: service.id,
        serviceType: service.type,
        serviceName: service.name,
        vendor: service.vendor,
      }))
    );
  }

  function syncBookingSupplierTotals(booking) {
    const payables = collectBookingPayables(booking);
    const vendorPayable = payables.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const vendorSettled = payables.filter((p) => p.status === "paid").reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const openDue = payables
      .filter((p) => p.status === "due" || (p.status === "scheduled" && p.dueDate && p.dueDate <= todayIsoDate()))
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    booking.toPaySuppliers = openDue;
    if (!booking.ledger) booking.ledger = {};
    booking.ledger.vendorPayable = vendorPayable;
    booking.ledger.vendorSettled = vendorSettled;
    booking.ledger.totalCost = Math.max(Number(booking.ledger.totalCost) || 0, vendorPayable);
    if (openDue > 0 && payables.some((p) => (p.status === "due" || p.status === "scheduled") && p.dueDate && p.dueDate < todayIsoDate())) {
      booking.paymentOverdue = true;
    }
    return { vendorPayable, vendorSettled, openDue };
  }

  function getBookingSupplierMoneyCopy(booking) {
    const payables = collectBookingPayables(booking).filter((p) => (Number(p.amount) || 0) > 0);
    if (!payables.length) {
      const toPay = Math.max(0, Number(booking.toPaySuppliers) || 0);
      if (toPay > 0) return { title: `${formatINR(toPay, { signed: false })} to pay supplier`, tone: "is-open" };
      return { title: "No supplier payables", tone: "is-done" };
    }
    const open = payables.filter((p) => p.status !== "paid");
    if (!open.length) {
      const paidTotal = payables.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      return { title: `${formatINR(paidTotal, { signed: false })} paid`, tone: "is-done" };
    }
    const sorted = [...open].sort((a, b) => String(a.dueDate || "9999").localeCompare(String(b.dueDate || "9999")));
    const next = sorted[0];
    return { title: formatPayableCopy(next), tone: "is-open" };
  }

  function getBookingPaymentReadinessCopy(booking) {
    const toCollect = Math.max(0, Number(booking.toCollect) || 0);
    const supplier = getBookingSupplierMoneyCopy(booking);
    const parts = [];
    if (toCollect > 0) parts.push(`${formatINR(toCollect, { signed: false })} to collect`);
    if (supplier.title && supplier.title !== "No supplier payables") parts.push(supplier.title);
    if (!parts.length) {
      if (booking.moneySettled) return { className: "is-done", value: "Settled — no open money" };
      return { className: "is-done", value: "No balance" };
    }
    return {
      className: toCollect > 0 || supplier.tone === "is-open" ? "is-open" : "is-done",
      value: parts.join(" · "),
    };
  }

  function normalizeBookingService(line, index, booking) {
    const confirmed = line?.confirmation === "confirmed";
    const type = inferServiceType(line);
    const vouchers =
      Array.isArray(line?.vouchers) && line.vouchers.length
        ? line.vouchers.map((v, vi) => ({
            id: v.id || `vh-${index}-${vi}`,
            name: v.name || `${line.name || "Service"} voucher`,
            attached: !!v.attached || confirmed,
            fileName: v.fileName || (v.attached || confirmed ? `${(line.vendor || "vendor").toLowerCase().replace(/\s+/g, "-")}.pdf` : ""),
          }))
        : [
            {
              id: `vh-${index}-0`,
              name: `${line?.name || "Service"} voucher`,
              attached: confirmed,
              fileName: confirmed ? `${(line?.vendor || "vendor").toLowerCase().replace(/\s+/g, "-")}.pdf` : "",
            },
          ];
    const paymentTerms =
      line?.paymentTerms?.kind === "schedule" || line?.paymentTerms?.kind === "unknown"
        ? line.paymentTerms
        : confirmed
          ? { kind: "schedule", schedule: [{ id: `pt-${index}-full`, label: "Full", percent: 100, trigger: "on_confirm" }] }
          : { kind: "unknown" };
    const normalized = {
      id: line?.id || `svc-${booking.id}-${index}`,
      type,
      name: line?.name || serviceTypeLabel(type),
      vendor: line?.vendor || `${booking.destination || "Trip"} partner`,
      vendorContact: line?.vendorContact || "—",
      vendorEmail: line?.vendorEmail || "—",
      serviceDetail: line?.serviceDetail || `${line?.name || serviceTypeLabel(type)} for ${booking.customer || "this booking"}`,
      cost: line?.cost || 0,
      confirmation: confirmed ? "confirmed" : "pending",
      deadline: line?.deadline || "—",
      status: line?.status || (confirmed ? "Confirmed" : "Awaiting vouchers"),
      addedAfterConfirmation: !!line?.addedAfterConfirmation,
      source: line?.source || (line?.addedAfterConfirmation ? "post_confirmation" : "proposal"),
      paymentTerms,
      payables: Array.isArray(line?.payables) ? line.payables : [],
      vouchers,
    };
    ensureServicePayables(normalized, booking, { activateOnConfirm: confirmed });
    return normalized;
  }

  function bookingServices(booking) {
    if (booking.services && booking.services.length) {
      return booking.services.map((line, index) => {
        const normalized = normalizeBookingService(line, index, booking);
        booking.services[index] = { ...line, ...normalized };
        return booking.services[index];
      });
    }
    const pending = (booking.confirmations || {}).supplier !== "confirmed";
    const fallback = [
      normalizeBookingService(
        {
          type: "hotel",
          name: "Stay",
          vendor: `${booking.destination} hotel partner`,
          cost: booking.ledger?.vendorPayable || 0,
          confirmation: pending ? "pending" : "confirmed",
          deadline: pending ? "Today" : "—",
          status: pending ? "Awaiting vouchers" : "Confirmed",
          paymentTerms: pending ? { kind: "unknown" } : { kind: "schedule", schedule: [{ id: "pt-fallback", label: "Full", percent: 100, trigger: "on_confirm" }] },
        },
        0,
        booking
      ),
    ];
    booking.services = fallback;
    return fallback;
  }

  function serviceVouchersReady(service) {
    const vouchers = service?.vouchers || [];
    return vouchers.length > 0 && vouchers.every((v) => v.attached);
  }

  function syncSupplierConfirmationFromServices(booking) {
    if (!booking.confirmations) booking.confirmations = {};
    const services = bookingServices(booking);
    if (!services.length) return;
    const allConfirmed = services.every((s) => s.confirmation === "confirmed");
    booking.confirmations.supplier = allConfirmed ? "confirmed" : "pending";
  }

  function attachServiceVoucher(booking, serviceId, voucherId) {
    const service = bookingServices(booking).find((s) => s.id === serviceId);
    if (!service || service.confirmation === "confirmed") return false;
    const voucher = (service.vouchers || []).find((v) => v.id === voucherId);
    if (!voucher || voucher.attached) return false;
    voucher.attached = true;
    voucher.fileName = voucher.fileName || `${voucher.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`;
    service.status = serviceVouchersReady(service) ? "Vouchers attached — confirm vendor" : "Vouchers partially attached";
    if (!booking.vouchers) booking.vouchers = [];
    const global = booking.vouchers.find((v) => v.name === voucher.name);
    if (global) {
      global.status = "ready";
      global.blockReason = "";
    } else {
      booking.vouchers.push({ name: voucher.name, status: "ready", blockReason: "" });
    }
    pushBookingActivity(booking, `${voucher.name} attached for ${service.vendor} · ${service.name}.`);
    return true;
  }

  function confirmServiceVendor(booking, serviceId, manualPayable = null) {
    const service = bookingServices(booking).find((s) => s.id === serviceId);
    if (!service || service.confirmation === "confirmed") return false;
    if (!serviceVouchersReady(service)) {
      showToast("Attach all vouchers for this vendor first…");
      return false;
    }
    if (service.paymentTerms?.kind === "unknown") {
      if (canViewSupplierMoney()) {
        const amount = Math.round(Number(manualPayable?.amount));
        const dueDate = String(manualPayable?.dueDate || "").trim();
        if (!amount || amount <= 0 || !dueDate) {
          showToast("Set payable amount and due date for this vendor…");
          return false;
        }
        service.cost = amount;
        service.payables = [
          {
            id: `pay-${service.id}-manual`,
            label: "Supplier payable",
            amount,
            dueDate,
            dueLabel: dueLabelForDate(dueDate, "due"),
            status: "due",
          },
        ];
        pushBookingActivity(booking, `Payable ${formatPayableCopy(service.payables[0])} set for ${service.vendor}.`);
      } else {
        // Ops confirm without exposing supplier money — Finance sets payable later.
        service.payables = service.payables || [];
        pushBookingActivity(booking, `${service.vendor} confirmed · payable pending Finance.`);
      }
    } else {
      ensureServicePayables(service, booking, { activateOnConfirm: true });
      const created = (service.payables || []).filter((p) => p.status === "due");
      if (created.length && canViewSupplierMoney()) {
        pushBookingActivity(booking, `Payable ${formatPayableCopy(created[0])} created for ${service.vendor}.`);
      } else if (created.length) {
        pushBookingActivity(booking, `Supplier payable created for ${service.vendor}.`);
      }
    }
    service.confirmation = "confirmed";
    service.status = "Confirmed";
    service.deadline = "—";
    syncSupplierConfirmationFromServices(booking);
    syncBookingSupplierTotals(booking);
    syncTravellerVouchers(booking);
    pushBookingActivity(booking, `${service.vendor} confirmed for ${serviceTypeLabel(service.type)} after vouchers attached.`);
    if (booking.confirmations.supplier === "confirmed") {
      const open = getBookingOpsOpenIssues(booking);
      if (open.length === 1 && open[0] === "vouchers") {
        booking.actionHint = "Issue travel vouchers";
        booking.nextAction = {
          kind: "task",
          title: "Issue travel vouchers",
          body: "All vendors confirmed — issue customer-facing vouchers when ready.",
          cta: "Open vouchers",
          ctaTarget: "vouchers",
        };
      } else if (!open.length && !booking.confirmed) {
        booking.nextAction = {
          kind: "info",
          title: "Ops ready",
          body: "Suppliers, vouchers and documents are clear for this booking.",
          cta: "",
          ctaTarget: "",
        };
      }
    }
    return true;
  }

  function markServicePayablePaid(booking, serviceId, payableId) {
    const service = bookingServices(booking).find((s) => s.id === serviceId);
    if (!service) return false;
    const payable = (service.payables || []).find((p) => p.id === payableId);
    if (!payable || payable.status === "paid") return false;
    payable.status = "paid";
    payable.dueLabel = "paid";
    syncBookingSupplierTotals(booking);
    pushBookingActivity(booking, `${formatPayableCopy(payable)} to ${service.vendor}.`);
    return true;
  }

  function nextCatalogItemForBooking(booking) {
    const existing = new Set(bookingServices(booking).map((s) => `${s.type}|${s.name}|${s.vendor}`));
    return (
      SERVICE_CATALOG.find((item) => !existing.has(`${item.type}|${item.name}|${item.vendor}`)) ||
      SERVICE_CATALOG[bookingServices(booking).length % SERVICE_CATALOG.length]
    );
  }

  function createBookingServiceLine(booking, seed = {}, { fromCatalog = false } = {}) {
    bookingServices(booking);
    const afterConfirm = !!booking.confirmed;
    const index = booking.services.length;
    const draft = {
      id: seed.id || `svc-${booking.slug || "bk"}-${Date.now().toString(36)}`,
      type: seed.type || "trip",
      name: seed.name || "Custom service",
      vendor: seed.vendor || "Vendor to assign",
      vendorContact: seed.vendorContact || "—",
      vendorEmail: seed.vendorEmail || "—",
      serviceDetail: seed.serviceDetail || `${seed.name || "Custom service"} · ${booking.destination || "trip"}`,
      cost: Math.round(Number(seed.cost) || 0),
      confirmation: "pending",
      deadline: afterConfirm ? "Tomorrow" : "Today",
      status: "Awaiting vouchers",
      addedAfterConfirmation: afterConfirm,
      source: afterConfirm ? "post_confirmation" : fromCatalog ? "catalog" : "ops",
      paymentTerms: seed.paymentTerms || { kind: "unknown" },
      payables: [],
      vouchers: (seed.vouchers || [{ name: `${seed.name || "Service"} voucher`, attached: false, fileName: "" }]).map((v, vi) => ({
        id: v.id || `vh-new-${index}-${vi}`,
        name: v.name,
        attached: false,
        fileName: "",
      })),
    };
    booking.services.push(normalizeBookingService(draft, index, booking));
    syncSupplierConfirmationFromServices(booking);
    syncBookingSupplierTotals(booking);
    const mark = afterConfirm ? " · marked Added after confirmation · customer selling price unchanged" : "";
    pushBookingActivity(
      booking,
      `${fromCatalog ? "Catalog" : "Service"} line added: ${draft.name} · ${draft.vendor}${mark}.`
    );
    return booking.services[booking.services.length - 1];
  }

  function addBookingServiceFromCatalog(booking) {
    const item = nextCatalogItemForBooking(booking);
    return createBookingServiceLine(booking, { ...item, id: undefined }, { fromCatalog: true });
  }

  function nextVendorAlternate(service) {
    const type = inferServiceType(service);
    const options = VENDOR_ALTERNATES[type] || VENDOR_ALTERNATES.trip;
    if (!options.length) return null;
    const current = String(service.vendor || "").toLowerCase();
    const idx = options.findIndex((opt) => String(opt.vendor || "").toLowerCase() === current);
    return options[(idx + 1) % options.length];
  }

  function changeBookingServiceVendor(booking, serviceId) {
    const service = bookingServices(booking).find((s) => s.id === serviceId);
    if (!service) return null;
    if (service.confirmation === "confirmed") {
      showToast("Vendor already confirmed — can’t change…");
      return null;
    }
    const next = nextVendorAlternate(service);
    if (!next) {
      showToast("No alternate vendors for this service…");
      return null;
    }
    const previous = service.vendor;
    service.vendor = next.vendor;
    service.vendorContact = next.vendorContact || "—";
    service.vendorEmail = next.vendorEmail || "—";
    service.serviceDetail = next.serviceDetail || service.serviceDetail;
    if (typeof next.cost === "number") service.cost = next.cost;
    service.paymentTerms = next.paymentTerms || { kind: "unknown" };
    service.payables = [];
    service.confirmation = "pending";
    service.status = "Awaiting vouchers";
    service.deadline = service.deadline && service.deadline !== "—" ? service.deadline : "Today";
    // Reset vouchers so the new vendor starts clean.
    service.vouchers = (service.vouchers || [{ name: `${service.name} voucher` }]).map((v, vi) => ({
      id: v.id || `vh-${service.id}-${vi}`,
      name: v.name || `${service.name} voucher`,
      attached: false,
      fileName: "",
    }));
    ensureServicePayables(service, booking, { activateOnConfirm: false });
    syncSupplierConfirmationFromServices(booking);
    syncBookingSupplierTotals(booking);
    pushBookingActivity(booking, `Vendor changed for ${serviceTypeLabel(service.type)}: ${previous} → ${service.vendor}.`);
    return service;
  }

  function addBookingServiceLine(booking) {
    return createBookingServiceLine(
      booking,
      {
        type: "trip",
        name: "Custom service line",
        vendor: "Vendor to assign",
        serviceDetail: `Manual line for ${booking.destination || "this trip"}`,
        cost: 0,
        paymentTerms: { kind: "unknown" },
        vouchers: [{ name: "Service voucher", attached: false, fileName: "" }],
      },
      { fromCatalog: false }
    );
  }

  function acceptedSellingPrice(booking) {
    const L = booking.ledger || {};
    return Math.round(Number(L.sellingPrice ?? L.receivable) || 0);
  }

  function startSellingPriceAmendment(booking, proposedPrice, reason) {
    if (!isBookingsOwnerAdmin()) {
      showToast("Only Owner or Admin can open a price amendment…");
      return false;
    }
    const current = acceptedSellingPrice(booking);
    const proposed = Math.round(Number(proposedPrice));
    if (!proposed || proposed <= 0) {
      showToast("Enter a valid proposed selling price…");
      return false;
    }
    if (proposed === current) {
      showToast("Proposed price matches the accepted selling price…");
      return false;
    }
    booking.amendment = {
      status: "draft",
      field: "sellingPrice",
      currentPrice: current,
      proposedPrice: proposed,
      reason: reason || "Customer-facing commercial change",
      openedAt: "Just now",
    };
    pushBookingActivity(
      booking,
      `Selling-price amendment drafted: ${formatINR(current, { signed: false })} → ${formatINR(proposed, { signed: false })} (accepted proposal unchanged until accepted).`
    );
    return true;
  }

  function discardSellingPriceAmendment(booking) {
    if (!booking.amendment || booking.amendment.status !== "draft") return false;
    pushBookingActivity(booking, "Selling-price amendment discarded · accepted commercial terms unchanged.");
    booking.amendment = null;
    return true;
  }

  function acceptSellingPriceAmendment(booking) {
    if (!isBookingsOwnerAdmin()) {
      showToast("Only Owner or Admin can accept a price amendment…");
      return false;
    }
    const draft = booking.amendment;
    if (!draft || draft.status !== "draft" || draft.field !== "sellingPrice") return false;
    if (!booking.ledger) booking.ledger = {};
    const paid = Math.round(Number(booking.ledger.customerPaid) || 0);
    const nextPrice = Math.round(Number(draft.proposedPrice) || 0);
    const prev = acceptedSellingPrice(booking);
    booking.ledger.sellingPrice = nextPrice;
    booking.ledger.receivable = nextPrice;
    booking.ledger.customerBalance = Math.max(0, nextPrice - paid);
    booking.ledger.margin = nextPrice - Math.round(Number(booking.ledger.totalCost) || 0);
    booking.toCollect = booking.ledger.customerBalance;
    if (booking.ledger.customerBalance > 0) {
      booking.paymentOverdue = booking.paymentOverdue || false;
      booking.paymentsOpen = true;
      booking.moneySettled = false;
    }
    booking.amendment = {
      status: "accepted",
      field: "sellingPrice",
      currentPrice: nextPrice,
      previousPrice: prev,
      reason: draft.reason,
      acceptedAt: "Just now",
    };
    pushBookingActivity(
      booking,
      `Amendment accepted · selling price ${formatINR(prev, { signed: false })} → ${formatINR(nextPrice, { signed: false })}.`
    );
    return true;
  }

  function bookingTasks(booking) {
    if (booking.tasks && booking.tasks.length) return booking.tasks;
    return [
      {
        id: "T-1",
        title: booking.nextAction?.title || "Review booking",
        priority: "medium",
        assignee: booking.owner,
        due: "—",
        dependency: "None",
        status: booking.nextAction?.kind === "task" ? "open" : "done",
      },
    ];
  }

  function destinationNeedsVisa(destination) {
    const d = String(destination || "").toLowerCase();
    return !/(goa|manali|ladakh|kerala|munnar|tripura|jaipur|rajasthan|delhi|mumbai|india|shimla|andaman)/.test(d);
  }

  function formatTravellerDob(iso) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
    const [y, m, day] = iso.split("-").map(Number);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${day} ${months[m - 1]} ${y}`;
  }

  function ageFromDob(iso, onDate = "2026-08-08") {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
    const dob = new Date(`${iso}T12:00:00`);
    const on = new Date(`${onDate}T12:00:00`);
    let age = on.getFullYear() - dob.getFullYear();
    const md = on.getMonth() - dob.getMonth();
    if (md < 0 || (md === 0 && on.getDate() < dob.getDate())) age -= 1;
    return age;
  }

  function specialFlagLabel(kind) {
    const map = {
      dietary: "Dietary",
      accessibility: "Accessibility",
      medical: "Medical assistance",
      room: "Room preference",
      pickup: "Pickup requirement",
      other: "Other",
    };
    return map[kind] || kind || "Other";
  }

  function normalizeSpecialFlags(raw, legacySpecial) {
    if (Array.isArray(raw) && raw.length) {
      return raw
        .map((item) => {
          if (typeof item === "string") return { kind: "other", note: item };
          return { kind: item.kind || "other", note: item.note || "" };
        })
        .filter((item) => item.note || item.kind);
    }
    const text = String(legacySpecial || "").trim();
    if (!text || text === "—") return [];
    const kind = /pickup|airport/i.test(text) ? "pickup" : /car seat|medical|diet|veg|access/i.test(text) ? "other" : "other";
    if (/car seat/i.test(text)) return [{ kind: "pickup", note: text }];
    if (/veg/i.test(text)) return [{ kind: "dietary", note: text }];
    return [{ kind, note: text }];
  }

  function inferVisaStatusForTraveller(traveller, booking) {
    const explicit = traveller.visaStatus || "";
    if (
      explicit === "Not required" ||
      explicit === "Required" ||
      explicit === "Documents pending" ||
      explicit === "Applied" ||
      explicit === "Approved" ||
      explicit === "Rejected"
    ) {
      return explicit;
    }
    const legacy = String(traveller.visa || "").toLowerCase();
    if (legacy.includes("not required")) return "Not required";
    if (legacy.includes("approved")) return "Approved";
    if (legacy.includes("applied")) return "Applied";
    if (legacy.includes("reject")) return "Rejected";
    if (legacy.includes("pending") || legacy.includes("document")) return "Documents pending";
    const needsVisa = destinationNeedsVisa(booking.destination);
    const indian = /india|indian/i.test(traveller.nationality || "");
    if (!needsVisa) return "Not required";
    if (indian || traveller.nationality) return legacy.includes("required") ? "Documents pending" : "Required";
    return "Required";
  }

  function visaStatusTone(status) {
    if (status === "Not required" || status === "Approved") return "is-ok";
    if (status === "Rejected") return "is-severe";
    if (status === "Applied") return "is-warn";
    return "is-warn";
  }

  function passportReadinessTone(status) {
    if (status === "Verified") return "is-ok";
    if (status === "Expiring") return "is-severe";
    if (status === "Uploaded") return "is-warn";
    return "is-warn";
  }

  function normalizeBookingTraveller(raw, booking, index) {
    const name = raw?.legalName || raw?.name || booking.customer || `Traveller ${index + 1}`;
    const type = raw?.type || (Number(raw?.age) < 12 ? "Child" : Number(raw?.age) < 2 ? "Infant" : "Adult");
    const dob = raw?.dob || "";
    const age = dob ? ageFromDob(dob) : raw?.age != null && raw?.age !== "—" ? Number(raw.age) : null;
    const specialFlags = normalizeSpecialFlags(raw?.specialFlags, raw?.special);
    const visaStatus = inferVisaStatusForTraveller({ ...raw, nationality: raw?.nationality || "Indian" }, booking);
    const needsGender = destinationNeedsVisa(booking.destination);
    return {
      id: raw?.id || `trv-${booking.slug || "bk"}-${index + 1}`,
      legalName: name,
      name,
      type,
      dob,
      age,
      gender: needsGender ? raw?.gender || "" : raw?.gender || "",
      showGender: needsGender && !!raw?.gender,
      nationality: raw?.nationality || "Indian",
      contact: raw?.contact && raw.contact !== "—" ? raw.contact : "",
      email: raw?.email || "",
      lead: !!raw?.lead || index === 0,
      role: raw?.role || (raw?.lead || index === 0 ? "Lead traveller" : type === "Child" || type === "Infant" ? "Child" : "Traveller"),
      guardianId: raw?.guardianId || "",
      guardianName: raw?.guardianName || "",
      passport: raw?.passport || "Missing",
      visaStatus,
      specialFlags,
      linkedServices: Array.isArray(raw?.linkedServices) ? raw.linkedServices : [],
      source: raw?.source || "query",
      queryTravellerId: raw?.queryTravellerId || "",
    };
  }

  function bookingTravellers(booking) {
    const list =
      booking.travellers && booking.travellers.length
        ? booking.travellers
        : [
            {
              legalName: booking.customer,
              name: booking.customer,
              type: "Adult",
              nationality: "Indian",
              lead: true,
              passport: "Missing",
              source: "query",
            },
          ];
    booking.travellers = list.map((row, index) => normalizeBookingTraveller(row, booking, index));
    if (!booking.travellers.some((t) => t.lead) && booking.travellers.length) booking.travellers[0].lead = true;
    return booking.travellers;
  }

  function travellerIssueList(traveller, booking) {
    const issues = [];
    if (!traveller.legalName) issues.push({ key: "name", severity: "severe", label: "Legal name missing" });
    if (!traveller.dob) issues.push({ key: "dob", severity: "warn", label: "Date of birth missing" });
    if (!traveller.nationality) issues.push({ key: "nationality", severity: "warn", label: "Nationality missing" });
    if (traveller.type === "Adult" && !traveller.contact) {
      issues.push({ key: "contact", severity: "warn", label: "Contact missing" });
    }
    if (traveller.passport === "Missing") {
      issues.push({ key: "passport", severity: "severe", label: "Passport missing", docType: "Passport" });
    } else if (traveller.passport === "Requested") {
      issues.push({ key: "passport", severity: "warn", label: "Passport requested", docType: "Passport" });
    } else if (traveller.passport === "Uploaded") {
      issues.push({ key: "passport", severity: "warn", label: "Passport uploaded — needs verify", docType: "Passport" });
    } else if (traveller.passport === "Expiring") {
      issues.push({ key: "passport", severity: "severe", label: "Passport expiring", docType: "Passport" });
    }
    if (traveller.visaStatus === "Required" || traveller.visaStatus === "Documents pending") {
      issues.push({
        key: "visa",
        severity: traveller.visaStatus === "Required" ? "severe" : "warn",
        label: `Visa: ${traveller.visaStatus}`,
        docType: "Visa copy",
      });
    } else if (traveller.visaStatus === "Rejected") {
      issues.push({ key: "visa", severity: "severe", label: "Visa rejected", docType: "Visa copy" });
    } else if (traveller.visaStatus === "Applied") {
      issues.push({ key: "visa", severity: "warn", label: "Visa applied — awaiting approval", docType: "Visa copy" });
    }
    if ((traveller.type === "Child" || traveller.type === "Infant") && !traveller.guardianName) {
      issues.push({ key: "guardian", severity: "warn", label: "Guardian not linked" });
    }
    return issues;
  }

  function travellerIsReady(traveller, booking) {
    return travellerIssueList(traveller, booking).length === 0;
  }

  function bookingTravellerReadiness(booking) {
    const travellers = bookingTravellers(booking);
    bookingDocuments(booking);
    const ready = travellers.filter((t) => travellerIsReady(t, booking)).length;
    return { ready, total: travellers.length, travellers };
  }

  function bookingHasConfirmedLinkedServices(booking, traveller) {
    const services = bookingServices(booking);
    const linkedIds = new Set((traveller.linkedServices || []).map((s) => s.serviceId));
    if (!linkedIds.size) return services.some((s) => s.confirmation === "confirmed");
    return services.some((s) => linkedIds.has(s.id) && s.confirmation === "confirmed");
  }

  function openTravellerDocuments(booking, travellerName, docType = "Passport") {
    bookingsState.docFocusTraveller = travellerName;
    bookingsState.docFocusType = docType || "Passport";
    const docs = bookingDocuments(booking);
    const match =
      docs.find((d) => d.traveller === travellerName && d.type === bookingsState.docFocusType) ||
      docs.find((d) => d.traveller === travellerName && !docStatusIsComplete(d.status)) ||
      docs.find((d) => d.traveller === travellerName);
    if (match) bookingsState.docId = match.id;
    else ensureBookingDocSelection(booking);
    const person = bookingTravellers(booking).find((t) => t.name === travellerName || t.legalName === travellerName);
    if (person) bookingsState.travellerFocusId = person.id;
    setBookingDetailTab("documents", { updateHash: true });
    renderBookingOpsTabs(booking);
    showToast(`Opening ${travellerName} documents…`);
  }

  function travellerDocsNeedAction(traveller, booking) {
    return travellerIssueList(traveller, booking).some((issue) => !!issue.docType);
  }

  function handleTravellerAction(booking, travellerId, action) {
    const travellers = bookingTravellers(booking);
    const traveller = travellers.find((t) => t.id === travellerId);
    if (!traveller) return;
    bookingsState.travellerMenuId = null;
    const linked = bookingHasConfirmedLinkedServices(booking, traveller);
    if (action === "edit") {
      if (linked) {
        showToast("This traveller is linked to confirmed services. Updating may require supplier changes…");
      } else {
        showToast(`Editing booking details for ${traveller.legalName}…`);
      }
      pushBookingActivity(booking, `${getBookingsViewingAs()} opened edit for traveller ${traveller.legalName}.`);
      return;
    }
    if (action === "request-docs") {
      if (!travellerDocsNeedAction(traveller, booking)) {
        showToast("No missing documents for this traveller…");
        return;
      }
      const firstDocIssue = travellerIssueList(traveller, booking).find((issue) => issue.docType);
      openTravellerDocuments(booking, traveller.name, firstDocIssue?.docType || "Passport");
      pushBookingActivity(booking, `Document request opened for ${traveller.legalName}.`);
      return;
    }
    if (action === "replace") {
      if (linked) {
        showToast("Replace blocked until you confirm supplier impact — traveller is linked to flight/hotel/service records…");
      } else {
        showToast(`Replace traveller ${traveller.legalName}…`);
      }
      pushBookingActivity(booking, `Replace traveller started for ${traveller.legalName}.`);
      return;
    }
    if (action === "remove") {
      if (linked) {
        const labels = (traveller.linkedServices || []).map((s) => s.label).join(", ") || "linked services";
        showToast(`Cannot remove quietly — affects ${labels}. Confirm supplier changes first…`);
        pushBookingActivity(booking, `Remove attempted for ${traveller.legalName} · linked services: ${labels}.`);
        return;
      }
      booking.travellers = travellers.filter((t) => t.id !== travellerId);
      pushBookingActivity(booking, `${traveller.legalName} removed from booking snapshot.`);
      showToast(`${traveller.legalName} removed from booking…`);
      renderBookingDetail(booking);
      renderBookingsList();
    }
  }

  function docStatusIsComplete(status) {
    return status === "Verified";
  }

  function docStatusTone(status) {
    if (status === "Verified") return "is-done";
    if (status === "Uploaded") return "is-ready";
    if (status === "Expiring") return "is-blocked";
    if (status === "Requested") return "is-open";
    return "is-open";
  }

  function docStatusLabel(status) {
    if (status === "Missing") return "Missing";
    if (status === "Requested") return "Requested";
    if (status === "Uploaded") return "Uploaded";
    if (status === "Verified") return "Verified";
    if (status === "Expiring") return "Expiring";
    return status || "Missing";
  }

  function documentRowTitle(doc) {
    const type = doc.type || doc.name || "Document";
    return doc.traveller ? `${type} — ${doc.traveller}` : type;
  }

  function demoDocumentFileName(doc) {
    const who = String(doc.traveller || "booking")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const type = String(doc.type || "document")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return `${who}-${type}.pdf`;
  }

  function documentHasFile(doc) {
    return !!(doc && doc.fileName);
  }

  function clearDocumentFile(doc) {
    if (!doc) return;
    doc.fileName = "";
    doc.fileSize = "";
    doc.fileKind = "";
    doc.receivedAt = "";
    doc.receivedVia = "";
    doc.uploadedBy = "";
    doc.reviewHints = [];
    doc.extracted = null;
    doc.verifiedAt = "";
    doc.verifiedBy = "";
  }

  function attachDemoDocumentFile(doc, { via = "WhatsApp", by = "Traveller" } = {}) {
    if (!doc) return;
    doc.fileName = demoDocumentFileName(doc);
    doc.fileSize = doc.type === "Passport" ? "1.0 MB" : "240 KB";
    doc.fileKind = "pdf";
    doc.receivedAt = "Just now";
    doc.receivedVia = via;
    doc.uploadedBy = by || doc.traveller || "Traveller";
    if (doc.type === "Passport") {
      doc.extracted = doc.extracted || {
        passportNo: "X•••••0000",
        expiry: "1 Jan 2032",
        nationality: "Indian",
      };
      doc.reviewHints = doc.reviewHints?.length
        ? doc.reviewHints
        : ["Name matches traveller", "Expiry after trip end", "Photo page readable"];
    } else if (!doc.reviewHints?.length) {
      doc.reviewHints = ["File readable", "Details match this booking"];
    }
  }

  function normalizeDocumentRow(raw, booking, index) {
    if (!raw) return null;
    if (raw.type) {
      const status = raw.status || "Missing";
      const hasFile = !!(raw.fileName || status === "Uploaded" || status === "Verified" || status === "Expiring");
      const fileName = raw.fileName || (hasFile && (status === "Uploaded" || status === "Verified" || status === "Expiring") ? demoDocumentFileName(raw) : "");
      return {
        id: raw.id || `doc-${booking.slug}-${index + 1}`,
        type: raw.type,
        traveller: raw.traveller || "",
        status,
        required: raw.required !== false,
        requiredBy: raw.requiredBy || "—",
        blocks: raw.blocks || "",
        note: raw.note || "",
        fileName,
        fileSize: raw.fileSize || (fileName ? "240 KB" : ""),
        fileKind: raw.fileKind || (fileName ? "pdf" : ""),
        receivedAt: raw.receivedAt || "",
        receivedVia: raw.receivedVia || "",
        uploadedBy: raw.uploadedBy || "",
        requestedAt: raw.requestedAt || "",
        requestedVia: raw.requestedVia || "",
        verifiedAt: raw.verifiedAt || "",
        verifiedBy: raw.verifiedBy || "",
        rejectReason: raw.rejectReason || "",
        reviewHints: Array.isArray(raw.reviewHints) ? raw.reviewHints : [],
        extracted: raw.extracted || null,
      };
    }
    // Legacy aggregate rows → structured inputs from the traveller.
    const name = String(raw.name || "Document");
    const status = raw.status || "Missing";
    const lower = name.toLowerCase();
    if (lower.includes("passport")) {
      const travellers = bookingTravellers(booking);
      return travellers.map((t, ti) => ({
        id: `doc-${booking.slug}-pass-${ti + 1}`,
        type: "Passport",
        traveller: t.name,
        status: t.passport === "Verified" ? "Verified" : status,
        required: true,
        requiredBy: raw.requiredBy || "—",
        blocks: raw.blocks || "",
        note: "",
      }));
    }
    if (lower.includes("visa")) {
      const travellers = bookingTravellers(booking);
      return travellers.map((t, ti) => ({
        id: `doc-${booking.slug}-visa-${ti + 1}`,
        type: "Visa copy",
        traveller: t.name,
        status,
        required: true,
        requiredBy: raw.requiredBy || "—",
        blocks: "",
        note: "",
      }));
    }
    if (lower.includes("flight") || lower === "tickets" || lower.includes("ticket")) {
      return {
        id: raw.id || `doc-${booking.slug}-arrival`,
        type: "Arrival flight details",
        traveller: "",
        status,
        required: status !== "Verified",
        requiredBy: raw.requiredBy || "—",
        blocks: "",
        note: "Customer upload for arrival logistics — not an agency-issued ticket",
      };
    }
    return {
      id: raw.id || `doc-${booking.slug}-${index + 1}`,
      type: name,
      traveller: raw.traveller || "",
      status,
      required: raw.required !== false,
      requiredBy: raw.requiredBy || "—",
      blocks: raw.blocks || "",
      note: raw.note || "",
    };
  }

  function syncTravellerPassportFromDocuments(booking) {
    const docs = (booking.documents || []).filter((d) => d.type === "Passport");
    if (!docs.length || !booking.travellers) return;
    const rank = { Missing: 0, Requested: 1, Uploaded: 2, Expiring: 3, Verified: 4 };
    booking.travellers.forEach((traveller) => {
      const mine = docs.filter((d) => d.traveller === traveller.name || d.traveller === traveller.legalName);
      if (!mine.length) return;
      let worst = mine[0].status;
      mine.forEach((d) => {
        if ((rank[d.status] ?? 0) < (rank[worst] ?? 0)) worst = d.status;
      });
      traveller.passport =
        worst === "Verified"
          ? "Verified"
          : worst === "Expiring"
            ? "Expiring"
            : worst === "Uploaded"
              ? "Uploaded"
              : worst === "Requested"
                ? "Requested"
                : "Missing";
    });
  }

  function syncDocumentsConfirmationState(booking) {
    if (!booking.confirmations) booking.confirmations = {};
    const docs = booking.documents || [];
    const required = docs.filter((d) => d.required !== false);
    const complete = required.every((d) => docStatusIsComplete(d.status));
    booking.confirmations.documents = complete ? "received" : "missing";
    return booking.confirmations.documents;
  }

  function bookingDocuments(booking) {
    const travellers = bookingTravellers(booking);
    let rows = [];
    if (booking.documents && booking.documents.length) {
      booking.documents.forEach((raw, index) => {
        const normalized = normalizeDocumentRow(raw, booking, index);
        if (Array.isArray(normalized)) rows.push(...normalized);
        else if (normalized) rows.push(normalized);
      });
    } else {
      const missing = (booking.confirmations || {}).documents !== "received";
      rows = travellers.map((t, ti) => ({
        id: `doc-${booking.slug}-pass-${ti + 1}`,
        type: "Passport",
        traveller: t.name,
        status: missing ? t.passport || "Missing" : "Verified",
        required: true,
        requiredBy: "—",
        blocks: "",
        note: "",
      }));
    }
    // Dedupe by id after legacy expansion.
    const seen = new Set();
    rows = rows.filter((row) => {
      if (seen.has(row.id)) return false;
      seen.add(row.id);
      return true;
    });
    booking.documents = rows;
    syncTravellerPassportFromDocuments(booking);
    syncDocumentsConfirmationState(booking);
    return booking.documents;
  }

  function ensureBookingDocSelection(booking) {
    const docs = bookingDocuments(booking);
    if (bookingsState.docFocusTraveller) {
      const focusType = bookingsState.docFocusType || "Passport";
      const focused =
        docs.find((d) => d.traveller === bookingsState.docFocusTraveller && d.type === focusType) ||
        docs.find((d) => d.traveller === bookingsState.docFocusTraveller && !docStatusIsComplete(d.status)) ||
        docs.find((d) => d.traveller === bookingsState.docFocusTraveller);
      if (focused) {
        bookingsState.docId = focused.id;
        return;
      }
    }
    if (bookingsState.docId && docs.some((d) => d.id === bookingsState.docId)) return;
    const prefer =
      docs.find((d) => d.status === "Uploaded") ||
      docs.find((d) => d.status === "Expiring") ||
      docs.find((d) => d.status === "Requested") ||
      docs.find((d) => d.status === "Missing") ||
      docs[0];
    bookingsState.docId = prefer?.id || null;
  }

  function advanceBookingDocument(booking, docId, action, { skipComm = false, skipActivity = false } = {}) {
    const docs = bookingDocuments(booking);
    const doc = docs.find((d) => d.id === docId);
    if (!doc) return false;
    const staff = getBookingsViewerStaff()?.name || DEMO_OWNER.name;

    if (action === "request" || action === "remind") {
      if (action === "request" && doc.status !== "Missing" && doc.status !== "Expiring" && doc.status !== "Requested") {
        showToast("Document already further along — open the file to verify…");
        return false;
      }
      if (action === "remind" && doc.status !== "Requested") {
        showToast("Remind only applies while waiting on the traveller…");
        return false;
      }
      const wasExpiring = doc.status === "Expiring";
      if (wasExpiring) clearDocumentFile(doc);
      doc.status = "Requested";
      doc.requestedAt = "Just now";
      doc.requestedVia = "WhatsApp";
      doc.rejectReason = "";
      if (!skipActivity) {
        pushBookingActivity(
          booking,
          action === "remind"
            ? `${staff} sent reminder for ${documentRowTitle(doc)} via WhatsApp.`
            : `${staff} requested ${documentRowTitle(doc)} via WhatsApp.`
        );
      }
      if (!skipComm) postDocumentRequestToComm(booking, doc, { remind: action === "remind" });
    } else if (action === "receive" || action === "staff-upload") {
      if (doc.status === "Verified") {
        showToast("Already verified — reject first if you need a new file…");
        return false;
      }
      attachDemoDocumentFile(doc, {
        via: action === "staff-upload" ? "Staff upload" : "WhatsApp",
        by: action === "staff-upload" ? staff : doc.traveller || booking.customer || "Traveller",
      });
      doc.status = "Uploaded";
      doc.rejectReason = "";
      if (!skipActivity) {
        pushBookingActivity(
          booking,
          action === "staff-upload"
            ? `${staff} uploaded ${documentRowTitle(doc)} · ${doc.fileName}.`
            : `${staff} recorded ${documentRowTitle(doc)} · ${doc.fileName}.`
        );
      }
    } else if (action === "verify") {
      if (!documentHasFile(doc)) {
        showToast("No file on this document yet — receive or upload first…");
        return false;
      }
      if (doc.status !== "Uploaded" && doc.status !== "Expiring") {
        showToast(doc.status === "Verified" ? "Already verified…" : "Open the uploaded file, then verify…");
        return false;
      }
      doc.status = "Verified";
      doc.verifiedAt = "Just now";
      doc.verifiedBy = staff;
      doc.rejectReason = "";
      if (!skipActivity) {
        pushBookingActivity(booking, `${staff} verified ${documentRowTitle(doc)} · ${doc.fileName}.`);
      }
    } else if (action === "reject") {
      if (!documentHasFile(doc) && doc.status !== "Uploaded" && doc.status !== "Expiring" && doc.status !== "Verified") {
        showToast("Nothing to reject yet…");
        return false;
      }
      const reason = "Unreadable or details don’t match — please re-upload.";
      clearDocumentFile(doc);
      doc.status = "Requested";
      doc.rejectReason = reason;
      doc.requestedAt = "Just now";
      doc.requestedVia = "WhatsApp";
      if (!skipActivity) {
        pushBookingActivity(booking, `${staff} rejected ${documentRowTitle(doc)} · re-request sent via WhatsApp.`);
      }
      if (!skipComm) postDocumentRequestToComm(booking, doc, { remind: true });
    } else {
      return false;
    }

    bookingsState.docId = doc.id;
    syncTravellerPassportFromDocuments(booking);
    syncDocumentsConfirmationState(booking);
    if (booking.confirmations.documents === "received") {
      booking.actionHint = booking.actionHint?.includes("document") ? "" : booking.actionHint;
    }
    return true;
  }

  function voucherSourceLabel(source) {
    if (source === "vendor") return "From vendor";
    if (source === "agency") return "Generated by agency";
    if (source === "integration") return "From integration";
    if (source === "upload") return "Uploaded by staff";
    return "Voucher";
  }

  function travellerVoucherNameForService(service) {
    const type = inferServiceType(service);
    if (type === "hotel") return "Hotel voucher";
    if (type === "transport") return "Transfer voucher";
    if (type === "flight") return "Flight ticket / e-ticket";
    if (type === "cruise") return "Cruise voucher";
    if (type === "visa") return "Visa voucher";
    if (type === "trip") return "Activity / trip voucher";
    return `${serviceTypeLabel(type)} voucher`;
  }

  function syncTravellerVouchers(booking) {
    const services = bookingServices(booking);
    if (!booking.vouchers) booking.vouchers = [];

    services.forEach((service) => {
      let voucher = booking.vouchers.find((v) => v.serviceId === service.id);
      if (!voucher) {
        // Migrate legacy rows without serviceId by name/index once.
        voucher = booking.vouchers.find((v) => !v.serviceId && (v.name || "").toLowerCase().includes((service.name || "").toLowerCase()));
      }
      if (!voucher) {
        voucher = {
          id: `tv-${service.id}`,
          serviceId: service.id,
          name: travellerVoucherNameForService(service),
          source: service.type === "hotel" ? "vendor" : "agency",
          status: "blocked",
          blockReason: "",
          fileName: "",
          sentAt: "",
        };
        booking.vouchers.push(voucher);
      }
      voucher.serviceId = service.id;
      voucher.name = voucher.name || travellerVoucherNameForService(service);
      voucher.source = voucher.source || "agency";

      const serviceConfirmed = service.confirmation === "confirmed";
      if (!serviceConfirmed) {
        if (voucher.status !== "sent" && voucher.status !== "issued") {
          voucher.status = "blocked";
          voucher.blockReason = `${serviceTypeLabel(service.type)} confirmation pending`;
          voucher.fileName = "";
          voucher.sentAt = "";
        }
      } else if (voucher.status === "blocked") {
        voucher.status = "ready";
        voucher.blockReason = "";
      }
    });

    // Drop orphaned empty blocked vouchers for removed services (keep sent history).
    const serviceIds = new Set(services.map((s) => s.id));
    booking.vouchers = booking.vouchers.filter((v) => !v.serviceId || serviceIds.has(v.serviceId) || v.status === "sent");

    syncVoucherConfirmationState(booking);
    return booking.vouchers;
  }

  function syncVoucherConfirmationState(booking) {
    if (!booking.confirmations) booking.confirmations = {};
    const vouchers = booking.vouchers || [];
    if (!vouchers.length) {
      booking.confirmations.voucher = "pending";
      return;
    }
    if (vouchers.some((v) => v.status === "blocked")) booking.confirmations.voucher = "blocked";
    else if (vouchers.every((v) => v.status === "sent")) booking.confirmations.voucher = "issued";
    else booking.confirmations.voucher = "pending";
  }

  function bookingVouchers(booking) {
    return syncTravellerVouchers(booking);
  }

  function advanceTravellerVoucher(booking, voucherId, action) {
    const voucher = bookingVouchers(booking).find((v) => v.id === voucherId);
    if (!voucher) return false;
    const service = bookingServices(booking).find((s) => s.id === voucher.serviceId);

    if (action === "attach" || action === "generate") {
      if (voucher.status !== "ready") {
        showToast(voucher.status === "blocked" ? "Confirm the linked vendor first…" : "Voucher already prepared…");
        return false;
      }
      voucher.status = "issued";
      voucher.blockReason = "";
      voucher.source = action === "generate" ? "agency" : voucher.source === "agency" ? "upload" : voucher.source || "upload";
      voucher.fileName =
        voucher.fileName ||
        `${(voucher.name || "voucher").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`;
      pushBookingActivity(
        booking,
        `${voucher.name} ${action === "generate" ? "generated" : "attached"} for ${service?.vendor || "service"} · ready to send.`
      );
      syncVoucherConfirmationState(booking);
      return true;
    }

    if (action === "send") {
      if (voucher.status !== "issued") {
        showToast("Issue the voucher before sending…");
        return false;
      }
      const now = new Date();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      const hour12 = h % 12 || 12;
      voucher.status = "sent";
      voucher.sentAt = `${now.getDate()} ${months[now.getMonth()]}, ${hour12}:${m} ${ampm}`;
      pushBookingActivity(booking, `${voucher.name} sent to traveller · ${voucher.sentAt}.`);
      syncVoucherConfirmationState(booking);
      if (booking.confirmations.voucher === "issued") {
        booking.actionHint = booking.actionHint === "Issue travel vouchers" ? "" : booking.actionHint;
      }
      return true;
    }

    return false;
  }

  function inboxThreadsForBooking(booking) {
    if (!booking) return [];
    return INBOX_THREADS.filter((thread) => thread.bookingSlug === booking.slug);
  }

  function getInboxThreadById(id) {
    return INBOX_THREADS.find((thread) => thread.id === id) || null;
  }

  function unlinkedInboxCandidatesForBooking(booking) {
    if (!booking) return [];
    const known = new Set(
      inboxThreadsForBooking(booking).map((thread) => String(thread.contactName || "").toLowerCase())
    );
    known.add(String(booking.customer || "").toLowerCase());
    return INBOX_THREADS.filter(
      (thread) => !thread.bookingSlug && known.has(String(thread.contactName || "").toLowerCase())
    );
  }

  function threadContextMeta(thread) {
    const parts = [
      thread.bookingId || null,
      thread.related && thread.related !== "Booking" ? thread.related : null,
    ].filter(Boolean);
    return parts.join(" · ");
  }

  function ensureBookingCommSelection(booking) {
    const threads = inboxThreadsForBooking(booking);
    if (bookingsState.commCompose) return;
    if (bookingsState.commThreadId && threads.some((thread) => thread.id === bookingsState.commThreadId)) return;
    const prefer =
      threads.find((thread) => thread.related === "Documents") ||
      threads.find((thread) => thread.party !== "Vendor") ||
      threads[0];
    bookingsState.commThreadId = prefer?.id || null;
  }

  function linkInboxThreadToBooking(threadId, booking) {
    const thread = getInboxThreadById(threadId);
    if (!thread || !booking) return false;
    thread.bookingSlug = booking.slug;
    thread.bookingId = booking.id;
    thread.linkSource = "manual";
    if (!thread.related) thread.related = "Booking";
    if (!thread.assignee) thread.assignee = booking.owner?.name || "";
    return true;
  }

  function contactMatchesTraveller(contactName, travellerName) {
    const contact = String(contactName || "").toLowerCase().trim();
    const traveller = String(travellerName || "").toLowerCase().trim();
    if (!contact || !traveller) return false;
    if (contact === traveller) return true;
    const first = traveller.split(/\s+/)[0];
    return first.length > 2 && contact.includes(first);
  }

  function findTravellerCommThread(booking, travellerName) {
    const threads = inboxThreadsForBooking(booking).filter((thread) => thread.party !== "Vendor");
    return (
      threads.find((thread) => contactMatchesTraveller(thread.contactName, travellerName)) ||
      threads.find((thread) => contactMatchesTraveller(thread.contactName, booking.customer)) ||
      threads[0] ||
      null
    );
  }

  function shareableCommAttachments(booking, thread) {
    if (!booking) return [];
    const items = [];
    const docs = bookingDocuments(booking);
    const isVendor = thread?.party === "Vendor";

    if (!isVendor) {
      docs
        .filter((doc) => !docStatusIsComplete(doc.status))
        .forEach((doc) => {
          const forContact =
            !doc.traveller ||
            contactMatchesTraveller(thread?.contactName, doc.traveller) ||
            contactMatchesTraveller(thread?.contactName, booking.customer);
          if (!forContact && doc.traveller) return;
          items.push({
            id: `req:${doc.id}`,
            kind: "request",
            label: `Request · ${documentRowTitle(doc)}`,
            docId: doc.id,
            fileName: "",
          });
        });
    }

    docs
      .filter((doc) => documentHasFile(doc))
      .forEach((doc) => {
        items.push({
          id: `doc:${doc.id}`,
          kind: "document",
          label: `Share · ${documentRowTitle(doc)}`,
          docId: doc.id,
          fileName: doc.fileName,
        });
      });

    if (!isVendor) {
      bookingVouchers(booking)
        .filter((voucher) => voucher.status === "issued" || voucher.status === "sent")
        .forEach((voucher) => {
          items.push({
            id: `voucher:${voucher.id}`,
            kind: "voucher",
            label: `Share · ${voucher.name}`,
            voucherId: voucher.id,
            fileName: voucher.fileName || `${voucher.name}.pdf`,
          });
        });
    }

    return items;
  }

  function resolveCommAttachment(booking, thread, attachmentId) {
    if (!attachmentId || !booking) return null;
    return shareableCommAttachments(booking, thread || { party: "Customer" }).find((item) => item.id === attachmentId) || null;
  }

  function postDocumentRequestToComm(booking, doc, { remind = false } = {}) {
    if (!booking || !doc) return null;
    let thread = findTravellerCommThread(booking, doc.traveller || booking.customer);
    const body = remind
      ? `Friendly reminder — please share ${documentRowTitle(doc)} for ${booking.id}.`
      : `Please share ${documentRowTitle(doc)} for ${booking.id}. Upload here or reply on this chat.`;
    if (!thread) {
      thread = createBookingInboxThread(booking, {
        channel: "WhatsApp",
        party: "Customer",
        contactName: doc.traveller || booking.customer,
        related: "Documents",
        body,
        attachment: {
          kind: "request",
          label: documentRowTitle(doc),
          docId: doc.id,
          fileName: "",
        },
        skipActivity: true,
      });
      return thread;
    }
    thread.related = "Documents";
    thread.messages.push({
      id: `${thread.id}-m${thread.messages.length + 1}`,
      from: "staff",
      body,
      at: "Just now",
      channel: thread.channel,
      attachments: [{ kind: "request", label: documentRowTitle(doc), docId: doc.id, fileName: "" }],
    });
    thread.preview = body;
    thread.when = "Just now";
    thread.unread = false;
    bookingsState.commThreadId = thread.id;
    return thread;
  }

  function appendStaffReply(thread, body, { booking = null, attachment = null } = {}) {
    const text = String(body || "").trim();
    if (!thread) return false;
    const staff = getBookingsViewerStaff()?.name || DEMO_OWNER.name;
    const attachments = [];
    let finalBody = text;

    if (attachment?.kind === "request" && booking) {
      const docs = bookingDocuments(booking);
      const doc = docs.find((row) => row.id === attachment.docId);
      if (!doc) {
        showToast("Document not found on this booking…");
        return false;
      }
      const requestAction = doc.status === "Requested" ? "remind" : "request";
      const ok = advanceBookingDocument(booking, doc.id, requestAction, {
        skipComm: true,
        skipActivity: true,
      });
      if (!ok) return false;
      attachments.push({ kind: "request", label: documentRowTitle(doc), docId: doc.id, fileName: "" });
      if (!finalBody) {
        finalBody = `Please share ${documentRowTitle(doc)} for ${booking.id}.`;
      }
      thread.related = "Documents";
      pushBookingActivity(
        booking,
        `${staff} ${requestAction === "remind" ? "reminded" : "requested"} ${documentRowTitle(doc)} via ${thread.channel} · ${booking.id}.`
      );
    } else if (attachment?.kind === "document" && booking) {
      const doc = bookingDocuments(booking).find((row) => row.id === attachment.docId);
      if (!doc || !documentHasFile(doc)) {
        showToast("That document has no file to share yet…");
        return false;
      }
      attachments.push({
        kind: "file",
        label: documentRowTitle(doc),
        docId: doc.id,
        fileName: doc.fileName,
      });
      if (!finalBody) finalBody = `Sharing ${doc.fileName} for ${booking.id}.`;
      pushBookingActivity(booking, `${staff} shared ${doc.fileName} via ${thread.channel} · ${booking.id}.`);
    } else if (attachment?.kind === "voucher" && booking) {
      const voucher = bookingVouchers(booking).find((row) => row.id === attachment.voucherId);
      if (!voucher || (voucher.status !== "issued" && voucher.status !== "sent")) {
        showToast("Issue the voucher before sharing…");
        return false;
      }
      const fileName = voucher.fileName || `${voucher.name}.pdf`;
      attachments.push({
        kind: "file",
        label: voucher.name,
        voucherId: voucher.id,
        fileName,
      });
      if (!finalBody) finalBody = `Sharing ${voucher.name} for ${booking.id}.`;
      if (voucher.status === "issued") {
        voucher.status = "sent";
        voucher.sentAt = "Just now";
        syncVoucherConfirmationState(booking);
      }
      pushBookingActivity(booking, `${staff} shared ${fileName} via ${thread.channel} · ${booking.id}.`);
    }

    if (!finalBody && !attachments.length) return false;

    thread.messages.push({
      id: `${thread.id}-m${thread.messages.length + 1}`,
      from: "staff",
      body: finalBody || (attachments[0]?.fileName ? `Shared ${attachments[0].fileName}` : "Attachment sent"),
      at: "Just now",
      channel: thread.channel,
      attachments,
    });
    thread.preview = attachments[0]?.fileName
      ? `${finalBody || "Shared"} · ${attachments[0].fileName}`
      : finalBody;
    thread.when = "Just now";
    thread.unread = false;
    if (booking && !attachment) {
      pushBookingActivity(booking, `${staff} replied on ${thread.channel} · ${booking.id}.`);
    }
    return true;
  }

  function saveCommIncomingToDocuments(booking, thread, messageId) {
    if (!booking || !thread) return false;
    const message = (thread.messages || []).find((row) => row.id === messageId);
    const attachment = (message?.attachments || []).find((row) => row.kind === "incoming" && row.docId);
    if (!attachment || attachment.saved) {
      showToast(attachment?.saved ? "Already saved to Documents…" : "No incoming file to save…");
      return false;
    }
    const ok = advanceBookingDocument(booking, attachment.docId, "receive", { skipComm: true, skipActivity: true });
    if (!ok) return false;
    const doc = bookingDocuments(booking).find((row) => row.id === attachment.docId);
    if (doc) {
      doc.receivedVia = thread.channel;
      doc.uploadedBy = thread.contactName || doc.uploadedBy;
      if (attachment.fileName) doc.fileName = attachment.fileName;
    }
    attachment.saved = true;
    attachment.fileName = doc?.fileName || attachment.fileName;
    const staff = getBookingsViewerStaff()?.name || DEMO_OWNER.name;
    pushBookingActivity(
      booking,
      `${staff} saved ${attachment.fileName || "file"} from ${thread.channel} into Documents · ${documentRowTitle(doc)}.`
    );
    bookingsState.docId = attachment.docId;
    return true;
  }

  function createBookingInboxThread(booking, { channel, party, contactName, related, body, attachment = null, skipActivity = false } = {}) {
    if (!booking) return null;
    const id = `IN-${booking.slug}-${Date.now()}`;
    const channelSafe = channel === "Email" ? "Email" : "WhatsApp";
    const partySafe = party === "Vendor" ? "Vendor" : "Customer";
    const attachments = attachment
      ? [
          {
            kind: attachment.kind,
            label: attachment.label || "",
            docId: attachment.docId || "",
            voucherId: attachment.voucherId || "",
            fileName: attachment.fileName || "",
          },
        ]
      : [];
    const thread = {
      id,
      bookingSlug: booking.slug,
      bookingId: booking.id,
      party: partySafe,
      roleLabel: partyRoleLabel(partySafe),
      channel: channelSafe,
      contactName: contactName || booking.customer,
      related: related || (attachment?.kind === "request" ? "Documents" : "Booking"),
      serviceId: "",
      assignee: getBookingsViewerStaff()?.name || booking.owner?.name || "",
      when: "Just now",
      preview: body,
      unread: false,
      linkSource: "booking",
      messages: [
        {
          id: `${id}-m1`,
          from: "staff",
          body,
          at: "Just now",
          channel: channelSafe,
          attachments,
        },
      ],
    };
    INBOX_THREADS.unshift(thread);
    if (!skipActivity) {
      const staff = getBookingsViewerStaff()?.name || DEMO_OWNER.name;
      pushBookingActivity(booking, `${staff} started ${channelSafe} thread with ${thread.contactName} · ${booking.id}.`);
    }
    return thread;
  }

  function enrichDemoInboxDocumentFlows() {
    const dubai = INBOX_THREADS.find((thread) => thread.bookingSlug === "xyz-dubai" && thread.contactName === "Amit XYZ");
    if (!dubai) return;
    dubai.related = "Documents";
    dubai.messages = [
      {
        id: `${dubai.id}-m1`,
        from: "staff",
        body: "Please share passports for all travellers on BK-2026-000003.",
        at: "Today · 10:15",
        channel: "WhatsApp",
        attachments: [{ kind: "request", label: "Passport — Amit XYZ", docId: "doc-dubai-pass-amit", fileName: "" }],
      },
      {
        id: `${dubai.id}-m2`,
        from: "contact",
        body: "Sending Priya’s passport now.",
        at: "Today · 11:18",
        channel: "WhatsApp",
        attachments: [
          {
            kind: "incoming",
            label: "Passport — Priya XYZ",
            docId: "doc-dubai-pass-priya",
            fileName: "priya-xyz-passport.pdf",
            saved: true,
          },
        ],
      },
      {
        id: `${dubai.id}-m3`,
        from: "contact",
        body: "Amit passport scan attached.",
        at: "Today · 11:42",
        channel: "WhatsApp",
        attachments: [
          {
            kind: "incoming",
            label: "Passport — Amit XYZ",
            docId: "doc-dubai-pass-amit",
            fileName: "amit-xyz-passport.pdf",
            saved: false,
          },
        ],
      },
    ];
    dubai.preview = "Amit passport scan attached.";
    dubai.when = "Today · 11:42";
  }

  enrichDemoInboxDocumentFlows();

  function bookingActivityActor(person, type = "Member", avatarClass = "avatar-mint") {
    return {
      id: person?.id || "",
      name: person?.name || "Team",
      initials: person?.initials || "TM",
      avatarClass: person?.avatarClass || avatarClass,
      type,
    };
  }

  function linkifyBookingActivityText(text, booking) {
    const allowed = new Set(
      [booking?.id, booking?.queryId, ...(booking?.tasks || []).map((task) => task.id)].filter(Boolean)
    );
    const safe = escapeHtml(text || "");
    return safe.replace(/\b((?:Q|BK|T)-\d[\w-]*)\b/g, (id) => {
      if (!allowed.has(id)) return id;
      return `<button type="button" class="audit-record-link" data-toast="Opening ${id}…">${id}</button>`;
    });
  }

  function inferBookingActivityActor(body, booking) {
    const text = String(body || "");
    if (/Neha Kapoor/i.test(text)) return bookingActivityActor(DEMO_STAFF.neha, "Member", "avatar-pink");
    if (/Meera Iyer/i.test(text)) return bookingActivityActor(DEMO_STAFF.meera, "Member", "avatar-mint");
    if (/Vrushabh Jain/i.test(text)) return bookingActivityActor(DEMO_STAFF.vrushabh || DEMO_OWNER, "Owner", "avatar-mint");
    if (/Phase moved|Trip marked completed|System history/i.test(text)) {
      return { name: "System", initials: "SY", avatarClass: "", type: "System", id: "system" };
    }
    if (/₹|receipt|balance due|payment|payout/i.test(text)) {
      return { name: "Finance desk", initials: "FD", avatarClass: "avatar-pink", type: "Member", id: "finance" };
    }
    const viewer = getBookingsViewerStaff();
    if (viewer?.name && text.includes(viewer.name)) {
      return bookingActivityActor(viewer, getBookingsViewingAs() === "Member" ? "Member" : getBookingsViewingAs(), viewer.avatarClass);
    }
    return bookingActivityActor(booking.owner, "Owner", "avatar-mint");
  }

  function inferBookingActivityModule(body) {
    const text = String(body || "");
    if (/₹|receipt|balance|payment|payout|Finance/i.test(text)) {
      return { module: "finance", moduleLabel: "Finance" };
    }
    if (/document|passport|visa copy|WhatsApp|Email thread|shared .*via|saved .*from/i.test(text)) {
      return { module: "bookings", moduleLabel: "Bookings" };
    }
    return { module: "bookings", moduleLabel: "Bookings" };
  }

  function normalizeBookingActivityItem(item, booking, index) {
    if (item && item.actor && item.eventHtml && item.module) {
      return {
        ...item,
        bookingId: booking.id,
        searchText:
          item.searchText ||
          `${item.time || ""} ${item.actor?.name || ""} ${item.moduleLabel || ""} ${booking.id}`.toLowerCase(),
      };
    }

    const rawTime = String(item?.time || "—");
    const parts = rawTime.split("·").map((part) => part.trim()).filter(Boolean);
    const clock = parts.length > 1 ? parts[parts.length - 1] : parts[0] || "—";
    const dayLabel = parts.length > 1 ? parts.slice(0, -1).join(" · ") : "Activity";
    const groupKey = dayLabel.toLowerCase().replace(/\s+/g, "-") || `row-${index}`;
    const { module, moduleLabel } = inferBookingActivityModule(item?.body);
    const actor = inferBookingActivityActor(item?.body, booking);
    const recordMatch = String(item?.body || "").match(/\b((?:Q|BK|T)-\d[\w-]*)\b/);
    const recordId = [booking.id, booking.queryId, ...(booking.tasks || []).map((task) => task.id)].includes(
      recordMatch?.[1]
    )
      ? recordMatch[1]
      : booking.id;

    return {
      groupKey,
      groupLabel: dayLabel,
      time: clock,
      actor,
      module,
      moduleLabel,
      bookingId: booking.id,
      recordId,
      body: item?.body || "",
      eventHtml: linkifyBookingActivityText(item?.body || "", booking),
      searchText: `${clock} ${actor.name} ${item?.body || ""} ${moduleLabel} ${booking.id}`.toLowerCase(),
    };
  }

  function bookingActivity(booking) {
    const source =
      booking.activity && booking.activity.length
        ? booking.activity
        : [
            {
              time: "Created · —",
              body: `Booking ${booking.id} created${booking.queryId ? ` from ${booking.queryId}` : ""}.`,
            },
            { time: "Lifecycle · —", body: `Phase is ${phaseLabel(booking.phase)}.` },
          ];

    const viewer = getBookingsViewerStaff();
    if (!memberCanAccessBooking(booking, viewer)) return [];

    return source
      .map((item, index) => normalizeBookingActivityItem(item, booking, index))
      .filter((item) => item.bookingId === booking.id)
      .filter((item) => {
        // Keep only this booking’s ops/finance trail — never cross-booking audit noise.
        return item.module === "bookings" || item.module === "finance";
      });
  }

  function bookingReadiness(booking) {
    const checks = [
      (booking.confirmations || {}).supplier === "confirmed",
      (booking.confirmations || {}).voucher === "issued" || (booking.confirmations || {}).voucher === "sent",
      (booking.confirmations || {}).documents === "received",
      !(booking.paymentOverdue || (Number(booking.toCollect) || 0) > 0),
      !(Number(booking.toPaySuppliers) || 0),
    ];
    const done = checks.filter(Boolean).length;
    return { done, total: checks.length, pct: Math.round((done / checks.length) * 100) };
  }

  function voucherStatusLabel(status) {
    if (status === "blocked") return "Blocked";
    if (status === "ready") return "Ready";
    if (status === "issued") return "Issued";
    if (status === "sent") return "Sent";
    return status;
  }

  function voucherServiceShortLabel(service) {
    if (!service) return "";
    const detail = String(service.serviceDetail || service.name || "").trim();
    return detail.split("·")[0].trim() || service.name || "";
  }

  function bookingOpenAreasBannerHtml(booking, currentTab) {
    // Shortcut strip: other open work areas (not “confirmation” status for everything).
    let open = getBookingActionItems(booking).filter(
      (item) =>
        item.open &&
        !item.restricted &&
        item.id !== "booking" &&
        item.tab !== currentTab &&
        canAccessBookingTab(item.tab, booking)
    );
    if (!open.length) return "";
    open = sortBookingActionItemsByPriority(booking, open);
    const shown = open.slice(0, BOOKING_ISSUE_CHIP_LIMIT);
    const extra = open.length - shown.length;
    const hintTitles = shown.map((item) => item.chipLabel || item.label);
    const hint =
      extra > 0 ? `${hintTitles.join(" · ")} · +${extra} ${extra === 1 ? "issue" : "issues"}` : hintTitles.join(" · ");
    const moreChip =
      extra > 0
        ? `<button type="button" class="bookings-open-area-chip is-quiet" data-cta-target="confirmations" title="Open booking readiness">+${extra} ${
            extra === 1 ? "issue" : "issues"
          }</button>`
        : `<button type="button" class="bookings-open-area-chip is-quiet" data-cta-target="confirmations" title="See all open work on Overview">All open work</button>`;
    return `
      <div class="bookings-open-areas team-assign-banner" role="navigation" aria-label="Other open work on this booking">
        <div class="bookings-open-areas-copy">
          <p class="bookings-open-areas-label team-assign-title">${open.length} other area${open.length === 1 ? "" : "s"} still open</p>
          <p class="bookings-open-areas-hint team-assign-meta">${escapeHtml(hint)}</p>
        </div>
        <div class="bookings-open-areas-chips">
          ${shown
            .map(
              (item) =>
                `<button type="button" class="bookings-open-area-chip" data-cta-target="${escapeHtml(item.tab)}" title="${escapeHtml(item.detail)}">${escapeHtml(item.chipLabel || item.label)}</button>`
            )
            .join("")}
          ${moreChip}
        </div>
      </div>`;
  }

  function bindBookingOpenAreaChips(root) {
    root?.querySelectorAll("[data-cta-target]").forEach((btn) => {
      btn.addEventListener("click", () => runBookingCtaTarget(btn.dataset.ctaTarget));
    });
  }

  function docUiStatusTone(status) {
    if (status === "Verified") return "is-done";
    if (status === "Uploaded") return "is-ready";
    if (status === "Expiring") return "is-blocked";
    return "is-open";
  }

  function bookingDocumentDetailHtml(booking, active) {
    if (!active) {
      return `<div class="bookings-doc-detail bookings-doc-detail--empty empty-state">
        <p class="empty-state-title">Select a document</p>
        <p class="empty-state-desc">Pick a file from the list to open, verify, or request it.</p>
      </div>`;
    }
    const due =
      active.requiredBy && active.requiredBy !== "—"
        ? `Required by ${active.requiredBy}`
        : active.required === false
          ? "Optional"
          : "Required";
    const hasFile = documentHasFile(active);
    const statusTone = docUiStatusTone(active.status);
    const kind = String(active.fileKind || (active.fileName || "").split(".").pop() || "file").toUpperCase();
    const person = active.traveller || "Booking-wide";

    let actions = "";
    if (active.status === "Missing") {
      actions = `
        <button type="button" class="btn btn-primary btn-sm" data-doc-action="request" data-doc-id="${escapeHtml(active.id)}">Request from traveller</button>
        <button type="button" class="btn btn-outline btn-sm" data-doc-action="staff-upload" data-doc-id="${escapeHtml(active.id)}">Upload file</button>`;
    } else if (active.status === "Requested") {
      actions = `
        <button type="button" class="btn btn-outline btn-sm" data-doc-action="remind" data-doc-id="${escapeHtml(active.id)}">Remind</button>
        <button type="button" class="btn btn-primary btn-sm" data-doc-action="staff-upload" data-doc-id="${escapeHtml(active.id)}">Upload file</button>`;
    } else if (active.status === "Uploaded") {
      actions = `
        <button type="button" class="btn btn-primary btn-sm" data-doc-action="verify" data-doc-id="${escapeHtml(active.id)}">Mark verified</button>
        <button type="button" class="btn btn-outline btn-sm" data-doc-action="reject" data-doc-id="${escapeHtml(active.id)}">Reject &amp; re-request</button>`;
    } else if (active.status === "Expiring") {
      actions = `
        <button type="button" class="btn btn-primary btn-sm" data-doc-action="request" data-doc-id="${escapeHtml(active.id)}">Request updated file</button>
        <button type="button" class="btn btn-outline btn-sm" data-doc-action="verify" data-doc-id="${escapeHtml(active.id)}">Accept file</button>`;
    } else if (active.status === "Verified") {
      actions = `
        <button type="button" class="btn btn-outline btn-sm" data-doc-open-file="${escapeHtml(active.id)}">Open file</button>
        <button type="button" class="btn btn-outline btn-sm" data-doc-action="reject" data-doc-id="${escapeHtml(active.id)}">Re-request</button>`;
    }

    const filePanel = hasFile
      ? `<div class="bookings-doc-file-panel">
          <div class="bookings-doc-file-icon" aria-hidden="true">${escapeHtml(kind === "PDF" ? "PDF" : kind.slice(0, 3))}</div>
          <div class="bookings-doc-file-copy">
            <p class="bookings-doc-file-name">${escapeHtml(active.fileName)}</p>
            <p class="bookings-doc-file-meta">${escapeHtml(active.fileSize || "File")} · received ${escapeHtml(
              active.receivedAt || "—"
            )} via ${escapeHtml(active.receivedVia || "upload")}${
              active.uploadedBy ? ` · ${escapeHtml(active.uploadedBy)}` : ""
            }</p>
            <p class="bookings-doc-file-hint">Open the file to review it — we don’t show document text here.</p>
          </div>
          <button type="button" class="btn btn-primary btn-sm" data-doc-open-file="${escapeHtml(active.id)}">Open file</button>
        </div>`
      : `<div class="bookings-doc-file-empty empty-state">
          <p class="empty-state-title">No file yet</p>
          <p class="empty-state-desc">Request it from the traveller, or upload the copy they already shared.</p>
        </div>`;

    return `
      <div class="bookings-doc-detail">
        <header class="bookings-doc-detail-head">
          <div class="bookings-doc-detail-identity">
            <p class="team-kicker">${escapeHtml(person)}</p>
            <h3 class="bookings-doc-detail-title">${escapeHtml(active.type || documentRowTitle(active))}</h3>
            <div class="bookings-doc-chip-row">
              <span class="bookings-confirmation-status ${statusTone}">${escapeHtml(docStatusLabel(active.status))}</span>
              <span class="tag-chip">${escapeHtml(due)}</span>
              ${active.blocks ? `<span class="tag-chip tag-finance">For ${escapeHtml(active.blocks)}</span>` : ""}
            </div>
            ${active.note ? `<p class="bookings-ops-meta">${escapeHtml(active.note)}</p>` : ""}
            ${
              active.rejectReason
                ? `<p class="bookings-doc-reject" role="status">Rejected: ${escapeHtml(active.rejectReason)}</p>`
                : ""
            }
            ${
              active.status === "Verified" && active.verifiedBy
                ? `<p class="bookings-ops-meta">Verified by ${escapeHtml(active.verifiedBy)} · ${escapeHtml(active.verifiedAt || "—")}</p>`
                : ""
            }
            ${
              active.status === "Requested" && active.requestedAt
                ? `<p class="bookings-ops-meta">Requested ${escapeHtml(active.requestedAt)} via ${escapeHtml(active.requestedVia || "WhatsApp")}</p>`
                : ""
            }
          </div>
        </header>
        ${filePanel}
        <div class="bookings-doc-actions">${actions}</div>
      </div>`;
  }

  function bindBookingDocumentsPanel(el, booking) {
    el.querySelectorAll("[data-doc-open]").forEach((btn) => {
      btn.addEventListener("click", () => {
        bookingsState.docId = btn.dataset.docOpen;
        const doc = bookingDocuments(booking).find((d) => d.id === btn.dataset.docOpen);
        bookingsState.docFocusTraveller = doc?.traveller || null;
        bookingsState.docFocusType = doc?.type || null;
        renderBookingOpsTabs(booking);
      });
    });
    el.querySelectorAll("[data-doc-open-file]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const doc = bookingDocuments(booking).find((d) => d.id === btn.dataset.docOpenFile);
        if (!doc?.fileName) {
          showToast("No file attached yet…");
          return;
        }
        showToast(`Opening ${doc.fileName}…`);
      });
    });
    el.querySelectorAll("[data-doc-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.docAction;
        if (advanceBookingDocument(booking, btn.dataset.docId, action)) {
          const toasts = {
            request: "Request sent via WhatsApp…",
            remind: "Reminder sent…",
            receive: "File recorded…",
            "staff-upload": "File uploaded…",
            verify: "Document verified…",
            reject: "Rejected — re-request sent…",
          };
          showToast(toasts[action] || "Document updated…");
          renderBookingDetail(booking);
          renderBookingsList();
        }
      });
    });
  }

  function renderBookingTravellersPanel(booking, el) {
    if (!el) return;
    bookingDocuments(booking);
    const readiness = bookingTravellerReadiness(booking);
    const travellers = readiness.travellers;
    const filter = bookingsState.travellerFilter || "all";
    const withIssues = travellers.filter((t) => travellerIssueList(t, booking).length > 0);
    const severeCount = travellers.filter((t) => travellerIssueList(t, booking).some((i) => i.severity === "severe")).length;
    const filtered = travellers.filter((row) => {
      const issues = travellerIssueList(row, booking);
      if (filter === "ready") return issues.length === 0;
      if (filter === "issues") return issues.length > 0;
      if (filter === "severe") return issues.some((i) => i.severity === "severe");
      return true;
    });

    el.innerHTML = `
      ${bookingOpenAreasBannerHtml(booking, "travellers")}
      <div class="team-section-bar bookings-ops-section-bar">
        <p class="team-kicker">Travellers · Readiness</p>
        <div class="period-pills" role="tablist" aria-label="Filter travellers">
          <button type="button" class="period-pill${filter === "all" ? " is-active" : ""}" data-traveller-filter="all">All · ${readiness.total}</button>
          <button type="button" class="period-pill${filter === "ready" ? " is-active" : ""}" data-traveller-filter="ready">Ready · ${readiness.ready}</button>
          <button type="button" class="period-pill${filter === "issues" ? " is-active" : ""}" data-traveller-filter="issues">Issues · ${withIssues.length}</button>
          ${severeCount ? `<button type="button" class="period-pill${filter === "severe" ? " is-active" : ""}" data-traveller-filter="severe">Severe · ${severeCount}</button>` : ""}
        </div>
      </div>
      <article class="bookings-card">
        <header class="bookings-card-head bookings-card-head--split">
          <div>
            <div class="card-title-row">
              <h2 class="bookings-card-title">Travellers</h2>
              <span class="team-count-pill">${readiness.ready}/${readiness.total} ready</span>
            </div>
            <p class="bookings-card-sub">Who is travelling and whether they are ready. Files live in Documents.</p>
          </div>
          <button type="button" class="btn btn-outline btn-sm" data-cta-target="documents">Open documents</button>
        </header>
        ${
          withIssues.length
            ? `<div class="bookings-traveller-readiness">
                <div class="bookings-traveller-readiness-copy">
                  <p class="bookings-traveller-readiness-score">
                    <span class="roster-metric">${withIssues.length}</span>
                    <span class="roster-metric-unit"> traveller${withIssues.length === 1 ? "" : "s"} need attention</span>
                  </p>
                  <p class="bookings-ops-meta">Jump to blockers, or open Documents for the file.</p>
                </div>
                <ul class="bookings-traveller-issue-summary">${withIssues
                  .map((t) => {
                    const n = travellerIssueList(t, booking).length;
                    return `<li><button type="button" class="bookings-traveller-issue-jump" data-traveller-focus="${escapeHtml(t.id)}">${escapeHtml(
                      t.legalName.split(" ")[0]
                    )} · ${n}</button></li>`;
                  })
                  .join("")}</ul>
              </div>`
            : `<div class="bookings-traveller-readiness is-clear">
                <p class="bookings-traveller-readiness-score">
                  <span class="roster-metric">${readiness.ready}/${readiness.total}</span>
                  <span class="roster-metric-unit"> travellers ready</span>
                </p>
              </div>`
        }
        <ul class="bookings-traveller-list">
          ${
            filtered.length
              ? filtered
                  .map((row) => {
                    const issues = travellerIssueList(row, booking);
                    const ready = issues.length === 0;
                    const severe = issues.some((i) => i.severity === "severe");
                    const docsMissing = travellerDocsNeedAction(row, booking);
                    const dobLabel = formatTravellerDob(row.dob);
                    const ageLabel = row.age != null && !Number.isNaN(row.age) ? `${row.age} yrs` : "";
                    const metaBits = [row.type, row.nationality, row.contact || (row.type === "Adult" ? "Contact missing" : "")].filter(Boolean);
                    const specialBits = (row.specialFlags || [])
                      .map((flag) => `${specialFlagLabel(flag.kind)}${flag.note ? `: ${flag.note}` : ""}`)
                      .join(" · ");
                    const linked = (row.linkedServices || []).map((s) => s.label).join(" · ");
                    const menuOpen = bookingsState.travellerMenuId === row.id;
                    const issuesOpen = bookingsState.travellerIssuesOpen === row.id;
                    const profileRows = [
                      ["Legal name", row.legalName],
                      ["Role", row.lead ? "Lead traveller" : row.role || "Traveller"],
                      ["Type", row.type],
                      ["Date of birth", dobLabel || "—"],
                      ["Age", ageLabel || "—"],
                      row.showGender || row.gender ? ["Gender", row.gender || "—"] : null,
                      ["Nationality", row.nationality || "—"],
                      row.type === "Child" || row.type === "Infant"
                        ? ["Guardian", row.guardianName || "Not linked"]
                        : ["Phone", row.contact || "—"],
                      row.type === "Adult" ? ["Email", row.email || "—"] : null,
                      ["Passport", row.passport === "Verified" ? "Verified" : row.passport],
                      ["Visa", row.visaStatus],
                      specialBits ? ["Special needs", specialBits] : null,
                      linked ? ["Linked services", linked] : null,
                      ["Source", row.source === "query" ? "Query snapshot" : "Booking edit"],
                    ].filter(Boolean);
                    return `
            <li class="bookings-traveller-card${ready ? " is-ready" : severe ? " has-severe" : " has-issues"}" id="traveller-${escapeHtml(row.id)}" data-traveller-id="${escapeHtml(row.id)}">
              <div class="bookings-traveller-card-top">
                <div class="bookings-traveller-main member-cell">
                  <span class="bookings-traveller-avatar avatar-mint" aria-hidden="true">${escapeHtml(bookingInitial(row.legalName))}</span>
                  <div class="bookings-traveller-copy">
                    <p class="member-name-row">
                      <span class="member-name">${escapeHtml(row.legalName)}</span>
                      ${row.lead ? `<span class="tag-chip">Lead</span>` : ""}
                      ${!row.lead && row.role ? `<span class="tag-chip tag-support">${escapeHtml(row.role)}</span>` : ""}
                    </p>
                    <p class="member-role">${escapeHtml(metaBits.join(" · "))}</p>
                    ${specialBits ? `<p class="bookings-traveller-extra">${escapeHtml(specialBits)}</p>` : ""}
                  </div>
                </div>
                <div class="bookings-traveller-card-actions">
                  <span class="bookings-traveller-ready-pill ${ready ? "is-ok" : severe ? "is-severe" : "is-warn"}">${
                    ready ? "Ready" : `${issues.length} issue${issues.length === 1 ? "" : "s"}`
                  }</span>
                  <button type="button" class="btn btn-outline btn-xs bookings-traveller-edit-btn" data-traveller-action="edit" data-traveller-id="${escapeHtml(row.id)}" aria-label="Edit ${escapeHtml(row.legalName)}">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                  </button>
                  <div class="bookings-traveller-menu">
                    <button type="button" class="btn btn-outline btn-xs bookings-traveller-menu-btn" data-traveller-menu="${escapeHtml(row.id)}" aria-expanded="${menuOpen}" aria-label="Traveller actions">•••</button>
                    ${
                      menuOpen
                        ? `<div class="bookings-traveller-menu-panel" role="menu">
                            ${
                              docsMissing
                                ? `<button type="button" data-traveller-action="request-docs" data-traveller-id="${escapeHtml(row.id)}">Request documents</button>`
                                : ""
                            }
                            <button type="button" data-traveller-action="replace" data-traveller-id="${escapeHtml(row.id)}">Replace traveller</button>
                            <button type="button" class="is-danger" data-traveller-action="remove" data-traveller-id="${escapeHtml(row.id)}">Remove from booking</button>
                          </div>`
                        : ""
                    }
                  </div>
                </div>
              </div>
              <dl class="bookings-traveller-profile">
                ${profileRows
                  .map(
                    ([label, value]) => `
                  <div class="bookings-traveller-profile-item">
                    <dt>${escapeHtml(label)}</dt>
                    <dd>${escapeHtml(value)}</dd>
                  </div>`
                  )
                  .join("")}
              </dl>
              <div class="bookings-traveller-signals">
                <button type="button" class="bookings-traveller-signal ${passportReadinessTone(row.passport)}" data-open-traveller-doc="${escapeHtml(row.name)}" data-doc-type="Passport">
                  Passport · ${escapeHtml(row.passport === "Verified" ? "Verified" : row.passport)}
                </button>
                <button type="button" class="bookings-traveller-signal ${visaStatusTone(row.visaStatus)}" data-open-traveller-doc="${escapeHtml(row.name)}" data-doc-type="Visa copy">
                  Visa · ${escapeHtml(row.visaStatus)}
                </button>
                ${
                  issues.length
                    ? `<button type="button" class="bookings-traveller-signal-toggle" data-traveller-issues="${escapeHtml(row.id)}" aria-expanded="${issuesOpen}">
                        ${issuesOpen ? "Hide blockers" : "See blockers"}
                      </button>`
                    : ""
                }
              </div>
              ${
                issuesOpen && issues.length
                  ? `<ul class="bookings-traveller-blockers">${issues
                      .map(
                        (issue) => `
                    <li class="bookings-traveller-blocker is-${escapeHtml(issue.severity)}">
                      <span>${escapeHtml(issue.label)}</span>
                      ${
                        issue.docType
                          ? `<button type="button" class="text-link text-link-btn" data-open-traveller-doc="${escapeHtml(row.name)}" data-doc-type="${escapeHtml(issue.docType)}">Open documents</button>`
                          : ""
                      }
                    </li>`
                      )
                      .join("")}</ul>`
                  : ""
              }
            </li>`;
                  })
                  .join("")
              : `<li class="bookings-ops-empty-wrap empty-state">
                  <p class="empty-state-title">No travellers in this filter</p>
                  <p class="empty-state-desc">Switch to All to see everyone on this booking.</p>
                </li>`
          }
        </ul>
      </article>`;

    el.querySelectorAll("[data-cta-target]").forEach((btn) => {
      btn.addEventListener("click", () => runBookingCtaTarget(btn.dataset.ctaTarget));
    });
    el.querySelectorAll("[data-traveller-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        bookingsState.travellerFilter = btn.dataset.travellerFilter || "all";
        bookingsState.travellerMenuId = null;
        renderBookingOpsTabs(booking);
      });
    });
    el.querySelectorAll("[data-traveller-focus]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.travellerFocus;
        bookingsState.travellerFilter = "issues";
        bookingsState.travellerIssuesOpen = id;
        bookingsState.travellerMenuId = null;
        renderBookingOpsTabs(booking);
        window.requestAnimationFrame(() => {
          document.getElementById(`traveller-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      });
    });
    el.querySelectorAll("[data-traveller-menu]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.travellerMenu;
        bookingsState.travellerMenuId = bookingsState.travellerMenuId === id ? null : id;
        renderBookingOpsTabs(booking);
      });
    });
    el.querySelectorAll("[data-traveller-action]").forEach((btn) => {
      btn.addEventListener("click", () => handleTravellerAction(booking, btn.dataset.travellerId, btn.dataset.travellerAction));
    });
    el.querySelectorAll("[data-traveller-issues]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.travellerIssues;
        bookingsState.travellerIssuesOpen = bookingsState.travellerIssuesOpen === id ? null : id;
        renderBookingOpsTabs(booking);
      });
    });
    el.querySelectorAll("[data-open-traveller-doc]").forEach((btn) => {
      btn.addEventListener("click", () => {
        openTravellerDocuments(booking, btn.dataset.openTravellerDoc, btn.dataset.docType || "Passport");
      });
    });
  }

  function renderBookingDocumentsPanel(booking, el) {
    if (!el) return;
    ensureBookingDocSelection(booking);
    const docs = bookingDocuments(booking);
    const required = docs.filter((d) => d.required !== false);
    const openCount = required.filter((d) => !docStatusIsComplete(d.status)).length;
    const verifiedCount = required.filter((d) => docStatusIsComplete(d.status)).length;
    const active = docs.find((d) => d.id === bookingsState.docId) || docs[0] || null;

    const groups = [];
    const groupMap = new Map();
    docs.forEach((doc) => {
      const key = doc.traveller || "__booking__";
      if (!groupMap.has(key)) {
        const group = { key, label: doc.traveller || "Booking-wide", items: [] };
        groupMap.set(key, group);
        groups.push(group);
      }
      groupMap.get(key).items.push(doc);
    });

    const listHtml = docs.length
      ? groups
          .map((group) => {
            const items = group.items
              .map((doc) => {
                const selected = active && active.id === doc.id;
                const fileBit = documentHasFile(doc) ? doc.fileName : "No file yet";
                return `
              <li>
                <button type="button" class="bookings-doc-nav${selected ? " is-selected" : ""}" data-doc-open="${escapeHtml(doc.id)}">
                  <span class="bookings-doc-nav-top">
                    <span class="bookings-doc-nav-title">${escapeHtml(doc.type)}</span>
                    <span class="bookings-confirmation-status ${docUiStatusTone(doc.status)}">${escapeHtml(docStatusLabel(doc.status))}</span>
                  </span>
                  <span class="bookings-doc-nav-meta">${escapeHtml(
                    doc.requiredBy && doc.requiredBy !== "—" ? `Due ${doc.requiredBy}` : doc.required === false ? "Optional" : "Required"
                  )} · ${escapeHtml(fileBit)}</span>
                </button>
              </li>`;
              })
              .join("");
            return `<div class="bookings-doc-group">
              <p class="team-kicker bookings-doc-group-label">${escapeHtml(group.label)}</p>
              <ul class="bookings-doc-nav-list">${items}</ul>
            </div>`;
          })
          .join("")
      : `<div class="empty-state bookings-ops-empty-wrap">
          <p class="empty-state-title">No documents required</p>
          <p class="empty-state-desc">This booking has no traveller files to collect yet.</p>
        </div>`;

    el.innerHTML = `
      ${bookingOpenAreasBannerHtml(booking, "documents")}
      <div class="team-section-bar bookings-ops-section-bar">
        <p class="team-kicker">Documents · Files</p>
        <span class="team-count-pill">${verifiedCount}/${required.length || docs.length} verified</span>
      </div>
      <article class="bookings-card bookings-doc-card">
        <header class="bookings-card-head">
          <div>
            <div class="card-title-row">
              <h2 class="bookings-card-title">Documents</h2>
              ${
                openCount
                  ? `<span class="bookings-confirmation-status is-open">${openCount} open</span>`
                  : `<span class="bookings-confirmation-status is-done">All verified</span>`
              }
            </div>
            <p class="bookings-card-sub">Collect the file, open it, then mark verified.</p>
          </div>
        </header>
        <div class="bookings-doc-layout">
          <div class="bookings-doc-list-pane">${listHtml}</div>
          <div class="bookings-doc-detail-pane">${bookingDocumentDetailHtml(booking, active)}</div>
        </div>
      </article>`;

    bindBookingOpenAreaChips(el);
    bindBookingDocumentsPanel(el, booking);
  }

  function renderBookingOpsTabs(booking) {
    const c = booking.confirmations || {};
    const ownerAdmin = isBookingsOwnerAdmin();
    const showSupplierMoney = canViewSupplierMoney();
    const L = booking.ledger || {};

    const servicesEl = document.getElementById("booking-panel-services");
    if (servicesEl) {
      const lines = bookingServices(booking);
      syncBookingSupplierTotals(booking);
      const pendingCount = lines.filter((line) => line.confirmation !== "confirmed").length;
      const postConfirmCount = lines.filter((line) => line.addedAfterConfirmation).length;
      const confirmedCount = Math.max(0, lines.length - pendingCount);
      servicesEl.innerHTML = `
        ${bookingOpenAreasBannerHtml(booking, "services")}
        <div class="team-section-bar bookings-ops-section-bar">
          <p class="team-kicker">Services · Vendors</p>
          <div class="period-pills" role="group" aria-label="Vendor readiness">
            <span class="period-pill is-active">All · ${lines.length}</span>
            <span class="period-pill">Pending · ${pendingCount}</span>
            <span class="period-pill">Confirmed · ${confirmedCount}</span>
            ${postConfirmCount ? `<span class="period-pill">After confirm · ${postConfirmCount}</span>` : ""}
          </div>
        </div>
        <article class="bookings-card">
          <header class="bookings-card-head bookings-card-head--split">
            <div>
              <div class="card-title-row">
                <h2 class="bookings-card-title">Services &amp; vendors</h2>
                <span class="team-count-pill">${confirmedCount}/${lines.length || 0} confirmed</span>
              </div>
              <p class="bookings-card-sub">Attach vouchers, then confirm each vendor. Post-confirm adds stay ops-only until a price amendment.${
                showSupplierMoney ? "" : " Supplier cost & payment hidden."
              }</p>
            </div>
            <div class="bookings-ops-actions">
              <button type="button" class="btn btn-outline btn-sm" data-add-service="catalog">Add from catalog</button>
              <button type="button" class="btn btn-outline btn-sm" data-add-service="line">Add service line</button>
            </div>
          </header>
          <ul class="bookings-ops-list bookings-vendor-list">
            ${
              lines.length
                ? lines
                    .map((line) => {
                      const ready = serviceVouchersReady(line);
                      const confirmed = line.confirmation === "confirmed";
                      const unknownTerms = line.paymentTerms?.kind === "unknown";
                      const attachedCount = (line.vouchers || []).filter((v) => v.attached).length;
                      const totalVouchers = (line.vouchers || []).length;
                      return `
              <li class="bookings-vendor-row ${confirmed ? "is-confirmed" : "is-pending"}${line.addedAfterConfirmation ? " is-post-confirm" : ""}" data-service-id="${escapeHtml(line.id)}">
                <div class="bookings-vendor-main">
                  <div class="bookings-vendor-top">
                    <div class="bookings-vendor-identity">
                      <span class="tag-chip">${escapeHtml(serviceTypeLabel(line.type))}</span>
                      <div>
                        <p class="bookings-ops-title">${escapeHtml(line.vendor)}</p>
                        <p class="bookings-ops-sub">${escapeHtml(line.serviceDetail)}</p>
                        ${
                          line.addedAfterConfirmation
                            ? `<span class="tag-chip tag-finance">Added after confirmation</span>`
                            : line.source === "proposal"
                              ? `<p class="bookings-ops-meta">From accepted proposal</p>`
                              : ""
                        }
                      </div>
                    </div>
                    <div class="bookings-vendor-side">
                      <span class="bookings-confirmation-status ${confirmed ? "is-done" : "is-open"}">${confirmed ? "Confirmed" : "Needs vouchers"}</span>
                      ${
                        confirmed
                          ? ""
                          : `<button type="button" class="btn btn-outline btn-sm" data-change-vendor="${escapeHtml(line.id)}" title="Look for another vendor before this deal is confirmed">Change vendor</button>`
                      }
                    </div>
                  </div>
                  ${
                    showSupplierMoney
                      ? `<p class="bookings-payable-line">${escapeHtml(servicePayablesCopy(line))}</p>
                         <p class="bookings-ops-meta">${escapeHtml(line.vendorContact)} · ${escapeHtml(line.vendorEmail)} · Cost ${escapeHtml(formatINR(line.cost || 0, { signed: false }))}</p>`
                      : `<p class="bookings-ops-meta">${escapeHtml(line.vendorContact)} · ${escapeHtml(line.vendorEmail)}</p>`
                  }
                  ${
                    confirmed
                      ? ""
                      : `<p class="bookings-ops-meta">Deal not confirmed — change vendor if you find a better option.</p>`
                  }
                  <div class="bookings-vendor-vouchers">
                    <p class="team-kicker bookings-vendor-vouchers-label">Vouchers · ${attachedCount}/${totalVouchers}</p>
                    <ul class="bookings-vendor-voucher-list">
                      ${(line.vouchers || [])
                        .map(
                          (voucher) => `
                        <li class="bookings-vendor-voucher ${voucher.attached ? "is-attached" : ""}">
                          <div>
                            <p class="bookings-ops-title">${escapeHtml(voucher.name)}</p>
                            <p class="bookings-ops-meta">${voucher.attached ? `Attached · ${escapeHtml(voucher.fileName || "file.pdf")}` : "Not attached"}</p>
                          </div>
                          ${
                            voucher.attached
                              ? `<span class="bookings-ops-meta">Done</span>`
                              : `<button type="button" class="btn btn-outline btn-sm" data-attach-voucher="${escapeHtml(voucher.id)}" data-service-id="${escapeHtml(line.id)}">Attach</button>`
                          }
                        </li>`
                        )
                        .join("")}
                    </ul>
                  </div>
                  ${
                    confirmed
                      ? showSupplierMoney
                        ? `<ul class="bookings-vendor-payable-list">${(line.payables || [])
                            .map(
                              (payable) => `
                        <li class="bookings-vendor-payable-row">
                          <span>${escapeHtml(formatPayableCopy(payable))}${payable.label ? ` · ${escapeHtml(payable.label)}` : ""}</span>
                          ${
                            payable.status !== "paid" && ownerAdmin
                              ? `<button type="button" class="btn btn-outline btn-sm" data-mark-payable-paid="${escapeHtml(payable.id)}" data-service-id="${escapeHtml(line.id)}">Mark paid</button>`
                              : ""
                          }
                        </li>`
                            )
                            .join("")}</ul>`
                        : `<p class="bookings-ops-meta">Vendor confirmed · supplier payment managed in Finance.</p>`
                      : `<div class="bookings-vendor-actions">
                          ${
                            showSupplierMoney && unknownTerms && ready
                              ? `<div class="bookings-vendor-manual">
                                   <label>Amount <input type="number" min="1" step="1" data-manual-amount data-service-id="${escapeHtml(line.id)}" placeholder="${escapeHtml(String(line.cost || ""))}" /></label>
                                   <label>Due <input type="date" data-manual-due data-service-id="${escapeHtml(line.id)}" value="${escapeHtml(todayIsoDate())}" /></label>
                                 </div>`
                              : ""
                          }
                          <button type="button" class="btn btn-outline btn-sm" data-change-vendor="${escapeHtml(line.id)}">Change vendor</button>
                          <button type="button" class="btn btn-primary btn-sm${ready ? "" : " is-gated"}" data-confirm-vendor="${escapeHtml(line.id)}" ${ready ? "" : "disabled aria-disabled=\"true\""} title="${
                            ready ? "Confirm this vendor" : "Attach all vouchers first"
                          }">Confirm vendor</button>
                          <span class="bookings-ops-meta">${
                            ready
                              ? unknownTerms
                                ? showSupplierMoney
                                  ? "Set amount and due date, then confirm"
                                  : "Confirm ops — Finance sets payable later"
                                : showSupplierMoney
                                  ? "Ready to confirm — payables create from terms"
                                  : "Ready to confirm vendor"
                              : "Attach vouchers to confirm · or change vendor"
                          }</span>
                        </div>`
                  }
                </div>
              </li>`;
                    })
                    .join("")
                : `<li class="bookings-ops-empty-wrap empty-state">
                    <p class="empty-state-title">No services on this booking</p>
                    <p class="empty-state-desc">Add from catalog or create a service line to start vendor work.</p>
                  </li>`
            }
          </ul>
        </article>`;

      bindBookingOpenAreaChips(servicesEl);
      servicesEl.querySelectorAll("[data-add-service]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const mode = btn.dataset.addService;
          const added = mode === "catalog" ? addBookingServiceFromCatalog(booking) : addBookingServiceLine(booking);
          showToast(
            booking.confirmed
              ? `${added.name} added · Added after confirmation · selling price unchanged`
              : `${added.name} added…`
          );
          renderBookingDetail(booking);
          renderBookingsList();
        });
      });
      servicesEl.querySelectorAll("[data-attach-voucher]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (attachServiceVoucher(booking, btn.dataset.serviceId, btn.dataset.attachVoucher)) {
            showToast("Voucher attached…");
            renderBookingDetail(booking);
            renderBookingsList();
          }
        });
      });
      servicesEl.querySelectorAll("[data-change-vendor]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const updated = changeBookingServiceVendor(booking, btn.dataset.changeVendor);
          if (updated) {
            showToast(`Vendor changed to ${updated.vendor}…`);
            renderBookingDetail(booking);
            renderBookingsList();
          }
        });
      });
      servicesEl.querySelectorAll("[data-confirm-vendor]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (btn.disabled || btn.getAttribute("aria-disabled") === "true") {
            showToast("Attach all vouchers before confirming…");
            return;
          }
          const serviceId = btn.dataset.confirmVendor;
          const service = bookingServices(booking).find((s) => s.id === serviceId);
          if (!service || !serviceVouchersReady(service)) {
            showToast("Attach all vouchers before confirming…");
            return;
          }
          const amountInput = servicesEl.querySelector(`[data-manual-amount][data-service-id="${serviceId}"]`);
          const dueInput = servicesEl.querySelector(`[data-manual-due][data-service-id="${serviceId}"]`);
          const manual =
            amountInput || dueInput
              ? { amount: amountInput?.value, dueDate: dueInput?.value }
              : null;
          if (confirmServiceVendor(booking, serviceId, manual)) {
            showToast("Vendor confirmed…");
            renderBookingDetail(booking);
            renderBookingsList();
          }
        });
      });
      servicesEl.querySelectorAll("[data-mark-payable-paid]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (markServicePayablePaid(booking, btn.dataset.serviceId, btn.dataset.markPayablePaid)) {
            showToast("Supplier payable marked paid…");
            renderBookingDetail(booking);
            renderBookingsList();
          }
        });
      });
    }

    const travellersEl = document.getElementById("booking-panel-travellers");
    if (travellersEl) {
      renderBookingTravellersPanel(booking, travellersEl);
    }

    const documentsEl = document.getElementById("booking-panel-documents");
    if (documentsEl) {
      renderBookingDocumentsPanel(booking, documentsEl);
    }

    const vouchersEl = document.getElementById("booking-panel-vouchers");
    if (vouchersEl) {
      const lines = bookingVouchers(booking);
      const services = bookingServices(booking);
      const blockedCount = lines.filter((v) => v.status === "blocked").length;
      const readyCount = lines.filter((v) => v.status === "ready").length;
      const issuedCount = lines.filter((v) => v.status === "issued").length;
      const sentCount = lines.filter((v) => v.status === "sent").length;
      vouchersEl.innerHTML = `
        ${bookingOpenAreasBannerHtml(booking, "vouchers")}
        <div class="team-section-bar bookings-ops-section-bar">
          <p class="team-kicker">Vouchers · Traveller outputs</p>
          <div class="period-pills" role="group" aria-label="Voucher lifecycle">
            <span class="period-pill">Blocked · ${blockedCount}</span>
            <span class="period-pill">Ready · ${readyCount}</span>
            <span class="period-pill">Issued · ${issuedCount}</span>
            <span class="period-pill is-active">Sent · ${sentCount}</span>
          </div>
        </div>
        <article class="bookings-card">
          <header class="bookings-card-head">
            <div>
              <div class="card-title-row">
                <h2 class="bookings-card-title">Vouchers</h2>
                <span class="team-count-pill">${sentCount}/${lines.length || 0} sent</span>
              </div>
              <p class="bookings-card-sub">Hotel, transfer, activity vouchers and agency tickets — not passports or customer uploads.</p>
            </div>
          </header>
          <ul class="bookings-traveller-voucher-list">
            ${
              lines.length
                ? lines
                    .map((line) => {
                      const service = services.find((s) => s.id === line.serviceId);
                      const tone =
                        line.status === "blocked"
                          ? "is-blocked"
                          : line.status === "ready"
                            ? "is-ready"
                            : line.status === "issued"
                              ? "is-issued"
                              : "is-sent";
                      const shortService = voucherServiceShortLabel(service);
                      const title = shortService ? `${line.name} — ${shortService}` : line.name;
                      const vendorLabel = service ? service.vendor : "—";
                      const statusSub =
                        line.status === "blocked"
                          ? `${voucherStatusLabel(line.status)} · ${line.blockReason || "Linked service not confirmed"}`
                          : line.status === "ready"
                            ? `${voucherStatusLabel(line.status)} · Service confirmed — attach or generate`
                            : line.status === "issued"
                              ? `${voucherStatusLabel(line.status)} · ${line.fileName || "voucher.pdf"}`
                              : `${voucherStatusLabel(line.status)} · ${line.sentAt || "—"}`;
                      return `
              <li class="bookings-traveller-voucher ${tone}" data-voucher-id="${escapeHtml(line.id)}">
                <div class="bookings-traveller-voucher-top">
                  <div>
                    <p class="team-kicker">${escapeHtml(voucherSourceLabel(line.source))}</p>
                    <p class="bookings-ops-title">${escapeHtml(title)}</p>
                    <p class="bookings-ops-sub">${escapeHtml(statusSub)}</p>
                    <p class="bookings-ops-meta">Vendor: ${escapeHtml(vendorLabel)}</p>
                  </div>
                  <span class="bookings-confirmation-status ${
                    line.status === "blocked" ? "is-blocked" : line.status === "ready" ? "is-open" : "is-done"
                  }">${escapeHtml(voucherStatusLabel(line.status))}</span>
                </div>
                ${
                  line.status === "blocked"
                    ? `<div class="bookings-vendor-actions">
                         <button type="button" class="btn btn-outline btn-sm" data-cta-target="services">Resolve in Services &amp; vendors</button>
                       </div>`
                    : ""
                }
                ${
                  line.status === "ready"
                    ? `<p class="bookings-voucher-step">Service confirmed — attach or generate the traveller voucher.</p>
                       <div class="bookings-vendor-actions">
                         <button type="button" class="btn btn-outline btn-sm" data-voucher-action="attach" data-voucher-id="${escapeHtml(line.id)}">Attach voucher</button>
                         <button type="button" class="btn btn-primary btn-sm" data-voucher-action="generate" data-voucher-id="${escapeHtml(line.id)}">Generate voucher</button>
                       </div>`
                    : ""
                }
                ${
                  line.status === "issued"
                    ? `<p class="bookings-voucher-step">Issued · ${escapeHtml(line.fileName || "voucher.pdf")} — preview, then send to traveller.</p>
                       <div class="bookings-vendor-actions">
                         <button type="button" class="btn btn-outline btn-sm" data-voucher-preview="${escapeHtml(line.id)}">Preview</button>
                         <button type="button" class="btn btn-primary btn-sm" data-voucher-action="send" data-voucher-id="${escapeHtml(line.id)}">Send to traveller</button>
                       </div>`
                    : ""
                }
                ${
                  line.status === "sent"
                    ? `<p class="bookings-voucher-step">Sent to traveller · ${escapeHtml(line.sentAt || "—")}${
                        line.fileName ? ` · ${escapeHtml(line.fileName)}` : ""
                      }</p>`
                    : ""
                }
              </li>`;
                    })
                    .join("")
                : `<li class="bookings-ops-empty-wrap empty-state">
                    <p class="empty-state-title">No traveller vouchers yet</p>
                    <p class="empty-state-desc">They appear when services are on the booking and vendors are ready.</p>
                  </li>`
            }
          </ul>
        </article>`;
      bindBookingOpenAreaChips(vouchersEl);
      vouchersEl.querySelectorAll("[data-cta-target]").forEach((btn) => {
        btn.addEventListener("click", () => runBookingCtaTarget(btn.dataset.ctaTarget));
      });
      vouchersEl.querySelectorAll("[data-voucher-action]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const action = btn.dataset.voucherAction;
          if (advanceTravellerVoucher(booking, btn.dataset.voucherId, action)) {
            showToast(
              action === "send" ? "Voucher sent to traveller…" : action === "generate" ? "Voucher generated…" : "Voucher attached…"
            );
            renderBookingDetail(booking);
            renderBookingsList();
          }
        });
      });
      vouchersEl.querySelectorAll("[data-voucher-preview]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const voucher = bookingVouchers(booking).find((v) => v.id === btn.dataset.voucherPreview);
          showToast(`Previewing ${voucher?.fileName || "voucher"}…`);
        });
      });
    }

    const financeEl = document.getElementById("booking-panel-finance");
    if (financeEl) {
      if (!canAccessBookingTab("finance", booking)) {
        financeEl.innerHTML = `
          ${bookingOpenAreasBannerHtml(booking, "finance")}
          <article class="bookings-card">
            <header class="bookings-card-head">
              <div>
                <h2 class="bookings-card-title">Finance</h2>
                <p class="bookings-card-sub">This tab needs Finance permission (Owner or Admin in this demo).</p>
              </div>
            </header>
            <div class="empty-state bookings-ops-empty-wrap">
              <p class="empty-state-title">Finance restricted</p>
              <p class="empty-state-desc">Ask an Owner or Admin if you need payment details for this booking.</p>
            </div>
          </article>`;
        bindBookingOpenAreaChips(financeEl);
      } else {
      syncBookingSupplierTotals(booking);
      const payments = BOOKING_PAYMENTS.filter((p) => p.bookingSlug === booking.slug);
      const supplierPayables = collectBookingPayables(booking);
      const payoutLabel = ownerAdmin ? "Record supplier payout" : "Request supplier payout";
      const collectLabel = ownerAdmin ? "Record customer receipt" : "Send payment reminder";
      const acceptedPrice = acceptedSellingPrice(booking);
      const draftAmend = booking.amendment?.status === "draft" ? booking.amendment : null;
      const defaultPropose = acceptedPrice > 0 ? acceptedPrice + 5000 : 5000;
      const collectOpen = Math.max(0, Number(L.customerBalance) || Number(booking.toCollect) || 0);
      const payOpen = Math.max(0, Number(booking.toPaySuppliers) || 0);
      financeEl.innerHTML = `
        ${bookingOpenAreasBannerHtml(booking, "finance")}
        <div class="team-section-bar bookings-ops-section-bar">
          <p class="team-kicker">Finance · Ledger</p>
          <span class="team-count-pill">${
            collectOpen > 0 || payOpen > 0
              ? [collectOpen > 0 ? "Collect open" : null, payOpen > 0 ? "Payables open" : null].filter(Boolean).join(" · ")
              : "Settled"
          }</span>
        </div>
        <article class="bookings-card">
          <header class="bookings-card-head bookings-card-head--split">
            <div>
              <div class="card-title-row">
                <h2 class="bookings-card-title">Finance</h2>
                <span class="team-count-pill">Accepted price locked</span>
              </div>
              <p class="bookings-card-sub">Change selling price only through an amendment — not by editing the accepted agreement.</p>
            </div>
            <div class="bookings-ops-actions">
              ${
                (Number(booking.toCollect) || 0) > 0 || booking.paymentOverdue
                  ? `<button type="button" class="btn btn-outline btn-sm" data-finance-action="collect">${escapeHtml(collectLabel)}</button>`
                  : ""
              }
              ${
                (Number(booking.toPaySuppliers) || 0) > 0
                  ? `<button type="button" class="btn btn-outline btn-sm" data-finance-action="payout">${escapeHtml(payoutLabel)}</button>`
                  : ""
              }
            </div>
          </header>
          ${
            draftAmend
              ? `<div class="bookings-amendment-banner team-assign-banner" role="status">
                   <div>
                     <p class="team-kicker">Amendment draft · selling price</p>
                     <p class="team-assign-title">${escapeHtml(formatINR(draftAmend.currentPrice, { signed: false }))} → ${escapeHtml(formatINR(draftAmend.proposedPrice, { signed: false }))}</p>
                     <p class="team-assign-meta">${escapeHtml(draftAmend.reason)} · accepted proposal stays ${escapeHtml(formatINR(draftAmend.currentPrice, { signed: false }))} until accepted</p>
                   </div>
                   <div class="bookings-ops-actions">
                     ${
                       ownerAdmin
                         ? `<button type="button" class="btn btn-primary btn-sm" data-amendment-action="accept">Accept amendment</button>
                            <button type="button" class="btn btn-outline btn-sm" data-amendment-action="discard">Discard</button>`
                         : `<span class="bookings-ops-meta">Owner/Admin must accept</span>`
                     }
                   </div>
                 </div>`
              : ""
          }
          <div class="bookings-ledger-grid bookings-finance-echo">
            <article class="bookings-ledger-cell"><p class="bookings-ledger-label">To collect</p><p class="bookings-ledger-value ${(L.customerBalance || 0) > 0 ? "is-collect" : ""}">${escapeHtml(formatCustomerBalanceCopy(L.customerBalance || 0))}</p></article>
            <article class="bookings-ledger-cell"><p class="bookings-ledger-label">Received</p><p class="bookings-ledger-value is-positive">${escapeHtml(formatINR(L.customerPaid || 0, { signed: false }))}</p></article>
            <article class="bookings-ledger-cell"><p class="bookings-ledger-label">Supplier due</p><p class="bookings-ledger-value ${Math.max(0, Number(booking.toPaySuppliers) || 0) > 0 ? "is-pay" : ""}">${escapeHtml(getBookingSupplierMoneyCopy(booking).title)}</p></article>
            <article class="bookings-ledger-cell"><p class="bookings-ledger-label">Paid to suppliers</p><p class="bookings-ledger-value">${escapeHtml(formatINR(L.vendorSettled || 0, { signed: false }))}</p></article>
            <article class="bookings-ledger-cell"><p class="bookings-ledger-label">Deposits</p><p class="bookings-ledger-value">${escapeHtml(formatINR(L.deposits || 0, { signed: false }))}</p></article>
            <article class="bookings-ledger-cell bookings-ledger-cell--locked">
              <p class="bookings-ledger-label">Selling price · accepted</p>
              <p class="bookings-ledger-value">${escapeHtml(formatINR(acceptedPrice, { signed: false }))}</p>
              <p class="bookings-ledger-sub">Locked to accepted proposal${booking.proposalVersion ? ` ${escapeHtml(booking.proposalVersion)}` : ""}</p>
            </article>
            <article class="bookings-ledger-cell"><p class="bookings-ledger-label">Cost</p><p class="bookings-ledger-value">${escapeHtml(formatINR(L.totalCost || 0, { signed: false }))}</p></article>
            ${
              isBookingsOwner()
                ? `<article class="bookings-ledger-cell owner-only"><p class="bookings-ledger-label">Margin</p><p class="bookings-ledger-value is-positive">${escapeHtml(formatINR(L.margin || 0, { signed: false }))}</p></article>`
                : ""
            }
          </div>
          ${
            !draftAmend
              ? `<div class="bookings-amendment-form">
                   <div>
                     <h3 class="bookings-ops-section-title">Amend selling price</h3>
                     <p class="bookings-ops-sub">Customer-facing price changes need an amendment — they do not edit the accepted agreement in place.</p>
                   </div>
                   <div class="bookings-amendment-controls">
                     <label class="bookings-amendment-field">Proposed price
                       <input type="number" min="1" step="1" id="booking-amend-price" value="${escapeHtml(String(defaultPropose))}" ${ownerAdmin ? "" : "disabled"} />
                     </label>
                     <label class="bookings-amendment-field">Reason
                       <input type="text" id="booking-amend-reason" value="Customer requested paid upgrade" ${ownerAdmin ? "" : "disabled"} />
                     </label>
                     <button type="button" class="btn btn-outline btn-sm" data-amendment-action="draft" ${ownerAdmin ? "" : "disabled"}>Start amendment</button>
                   </div>
                 </div>`
              : ""
          }
          <div class="team-section-bar bookings-ops-mini-bar">
            <p class="team-kicker">Supplier payables</p>
            <span class="team-count-pill">${supplierPayables.length}</span>
          </div>
          ${
            supplierPayables.length
              ? `<ul class="bookings-ops-list">${supplierPayables
                  .map(
                    (p) => `
                <li class="bookings-ops-row">
                  <div>
                    <p class="bookings-ops-title">${escapeHtml(formatPayableCopy(p))}</p>
                    <p class="bookings-ops-sub">${escapeHtml(serviceTypeLabel(p.serviceType))} · ${escapeHtml(p.vendor)}${p.label ? ` · ${escapeHtml(p.label)}` : ""}</p>
                  </div>
                  <span class="bookings-confirmation-status ${p.status === "paid" ? "is-done" : "is-open"}">${escapeHtml(p.status === "paid" ? "Paid" : p.status === "due" ? "Due" : "Scheduled")}</span>
                </li>`
                  )
                  .join("")}</ul>`
              : `<div class="empty-state bookings-ops-empty-wrap">
                  <p class="empty-state-title">No supplier payables yet</p>
                  <p class="empty-state-desc">They appear when a vendor is confirmed.</p>
                </div>`
          }
          <div class="team-section-bar bookings-ops-mini-bar">
            <p class="team-kicker">Payment activity</p>
            <span class="team-count-pill">${payments.length}</span>
          </div>
          ${
            payments.length
              ? `<ul class="bookings-ops-list">${payments
                  .map(
                    (p) => `
                <li class="bookings-ops-row">
                  <div>
                    <p class="bookings-ops-title">${escapeHtml(p.eventLabel)}</p>
                    <p class="bookings-ops-sub">${escapeHtml(p.id)} · ${escapeHtml(p.method)} · ${escapeHtml(p.stage)}</p>
                  </div>
                  <span class="bookings-ops-amount">${escapeHtml(
                    p.type === "vendor" || p.type === "refund"
                      ? `${formatINR(p.amount, { signed: false })} out`
                      : formatINR(p.amount, { signed: false })
                  )}</span>
                </li>`
                  )
                  .join("")}</ul>`
              : `<div class="empty-state bookings-ops-empty-wrap">
                  <p class="empty-state-title">No payment activity yet</p>
                  <p class="empty-state-desc">Customer receipts and supplier payouts will show here.</p>
                </div>`
          }
        </article>`;
        bindBookingOpenAreaChips(financeEl);
      }
    }

    const communicationEl = document.getElementById("booking-panel-communication");
    if (communicationEl) {
      ensureBookingCommSelection(booking);
      const threads = inboxThreadsForBooking(booking);
      const unlinked = unlinkedInboxCandidatesForBooking(booking);
      const active = bookingsState.commCompose
        ? null
        : getInboxThreadById(bookingsState.commThreadId) || threads[0] || null;

      const threadListHtml = threads.length
        ? threads
            .map((thread) => {
              const selected = active && active.id === thread.id && !bookingsState.commCompose;
              return `
              <li>
                <button type="button" class="bookings-comm-thread${selected ? " is-selected" : ""}" data-comm-open="${escapeHtml(thread.id)}">
                  <span class="bookings-comm-thread-top">
                    <span class="member-name">${escapeHtml(thread.contactName)}</span>
                    <span class="bookings-comm-thread-when">${escapeHtml(thread.when)}</span>
                  </span>
                  <span class="bookings-comm-thread-meta">
                    <span class="tag-chip">${escapeHtml(thread.channel)}</span>
                    <span class="tag-chip ${String(thread.party || "").toLowerCase() === "vendor" ? "tag-finance" : "tag-support"}">${escapeHtml(thread.roleLabel)}</span>
                  </span>
                  <span class="member-role bookings-comm-thread-preview">${escapeHtml(thread.preview)}</span>
                </button>
              </li>`;
            })
            .join("")
        : `<li class="bookings-ops-empty-wrap empty-state">
            <p class="empty-state-title">No conversations yet</p>
            <p class="empty-state-desc">Start a message on ${escapeHtml(booking.id)}, or link an Inbox thread.</p>
          </li>`;

      const unlinkedHtml = unlinked.length
        ? `<div class="bookings-comm-unlinked team-assign-banner">
            <p class="team-kicker">Unlinked in Inbox</p>
            <p class="team-assign-title">Same contact — link to this booking</p>
            <ul class="bookings-comm-unlinked-list">
              ${unlinked
                .map(
                  (thread) => `
                <li>
                  <div>
                    <p class="bookings-ops-title">${escapeHtml(thread.contactName)} · ${escapeHtml(thread.roleLabel)}</p>
                    <p class="bookings-ops-sub">${escapeHtml(thread.channel)} · ${escapeHtml(thread.preview)}</p>
                  </div>
                  <button type="button" class="btn btn-outline btn-sm" data-comm-link="${escapeHtml(thread.id)}">Link to ${escapeHtml(booking.id)}</button>
                </li>`
                )
                .join("")}
            </ul>
          </div>`
        : "";

      let detailHtml = "";
      if (bookingsState.commCompose) {
        const vendors = (booking.services || [])
          .map((service) => service.vendor)
          .filter(Boolean)
          .filter((name, index, arr) => arr.indexOf(name) === index);
        detailHtml = `
          <div class="bookings-comm-detail">
            <header class="bookings-comm-detail-head">
              <div>
                <h3 class="bookings-comm-detail-title">New message · ${escapeHtml(booking.id)}</h3>
                <p class="bookings-comm-detail-meta">Starts a thread on this booking. Reply channel stays WhatsApp or Email for the whole conversation.</p>
              </div>
              <button type="button" class="btn btn-outline btn-sm" data-comm-cancel-compose>Cancel</button>
            </header>
            <form class="bookings-comm-compose" id="booking-comm-compose-form">
              <div class="bookings-comm-compose-grid">
                <label class="bookings-comm-field">
                  <span class="bookings-comm-field-label">Channel</span>
                  <select class="team-select bookings-comm-select" name="channel" required>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email">Email</option>
                  </select>
                </label>
                <label class="bookings-comm-field">
                  <span class="bookings-comm-field-label">To</span>
                  <select class="team-select bookings-comm-select" name="party" required>
                    <option value="Customer">Traveller / customer</option>
                    <option value="Vendor">Vendor</option>
                  </select>
                </label>
                <label class="bookings-comm-field bookings-comm-compose-span">
                  <span class="bookings-comm-field-label">Contact</span>
                  <input class="bookings-comm-input" name="contact" type="text" required value="${escapeHtml(booking.customer)}" list="booking-comm-contacts" />
                  <datalist id="booking-comm-contacts">
                    <option value="${escapeHtml(booking.customer)}"></option>
                    ${vendors.map((name) => `<option value="${escapeHtml(name)}"></option>`).join("")}
                  </datalist>
                </label>
                <label class="bookings-comm-field">
                  <span class="bookings-comm-field-label">Related</span>
                  <select class="team-select bookings-comm-select" name="related">
                    <option value="Booking">Booking</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Documents">Documents</option>
                    <option value="Finance">Finance</option>
                    <option value="Trip">Trip</option>
                  </select>
                </label>
                <label class="bookings-comm-field bookings-comm-compose-span">
                  <span class="bookings-comm-field-label">Document</span>
                  <select class="team-select bookings-comm-select" name="attachment">
                    <option value="">No attachment</option>
                    ${shareableCommAttachments(booking, { party: "Customer", contactName: booking.customer })
                      .map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.label)}</option>`)
                      .join("")}
                  </select>
                </label>
              </div>
              <label class="bookings-comm-field bookings-comm-compose-body">
                <span class="bookings-comm-field-label">Message</span>
                <textarea class="bookings-comm-textarea" name="body" rows="5" placeholder="Write the outgoing message (optional if attaching)…"></textarea>
              </label>
              <div class="bookings-comm-compose-actions">
                <p class="bookings-comm-channel-note">Sent through the agency’s connected WhatsApp or email account. Members can attach document requests or share files.</p>
                <button type="submit" class="btn btn-primary btn-sm">Send</button>
              </div>
            </form>
          </div>`;
      } else if (active) {
        const shareOptions = shareableCommAttachments(booking, active);
        const messagesHtml = (active.messages || [])
          .map((msg) => {
            const atts = (msg.attachments || [])
              .map((att) => {
                if (att.kind === "incoming") {
                  return `<div class="bookings-comm-attach is-incoming">
                    <div>
                      <p class="bookings-comm-attach-title">${escapeHtml(att.label || "Incoming file")}</p>
                      <p class="bookings-comm-attach-meta">${escapeHtml(att.fileName || "file")} · ${
                        att.saved ? "Saved to Documents" : "Not saved to Documents yet"
                      }</p>
                    </div>
                    ${
                      att.saved
                        ? `<button type="button" class="btn btn-outline btn-sm" data-comm-open-doc="${escapeHtml(att.docId || "")}">Open in Documents</button>`
                        : `<button type="button" class="btn btn-primary btn-sm" data-comm-save-doc="${escapeHtml(msg.id)}">Save to Documents</button>`
                    }
                  </div>`;
                }
                if (att.kind === "request") {
                  return `<div class="bookings-comm-attach is-request">
                    <p class="bookings-comm-attach-title">Requested · ${escapeHtml(att.label || "Document")}</p>
                    <p class="bookings-comm-attach-meta">Tracks in Documents until verified</p>
                  </div>`;
                }
                return `<div class="bookings-comm-attach is-file">
                  <div>
                    <p class="bookings-comm-attach-title">${escapeHtml(att.label || "Shared file")}</p>
                    <p class="bookings-comm-attach-meta">${escapeHtml(att.fileName || "file")}</p>
                  </div>
                  ${
                    att.docId
                      ? `<button type="button" class="btn btn-outline btn-sm" data-comm-open-doc="${escapeHtml(att.docId)}">Open in Documents</button>`
                      : att.voucherId
                        ? `<button type="button" class="btn btn-outline btn-sm" data-cta-target="vouchers">Open Vouchers</button>`
                        : ""
                  }
                </div>`;
              })
              .join("");
            return `
            <div class="bookings-comm-msg is-${escapeHtml(msg.from)}">
              ${msg.body ? `<p class="bookings-comm-msg-body">${escapeHtml(msg.body)}</p>` : ""}
              ${atts}
              <p class="bookings-comm-msg-meta">${escapeHtml(msg.from === "staff" ? "You" : active.contactName)} · ${escapeHtml(msg.channel)} · ${escapeHtml(msg.at)}</p>
            </div>`;
          })
          .join("");
        detailHtml = `
          <div class="bookings-comm-detail">
            <header class="bookings-comm-detail-head">
              <div>
                <p class="team-kicker">${escapeHtml(active.roleLabel)}</p>
                <h3 class="bookings-comm-detail-title">${escapeHtml(active.contactName)}</h3>
                <div class="bookings-doc-chip-row">
                  <span class="tag-chip">${escapeHtml(active.channel)}</span>
                  ${threadContextMeta(active) ? `<span class="tag-chip tag-support">${escapeHtml(threadContextMeta(active))}</span>` : ""}
                </div>
                <p class="bookings-ops-meta">Assigned: ${escapeHtml(active.assignee || "—")} · Members can request, share, and save documents here</p>
              </div>
            </header>
            <div class="bookings-comm-messages" role="log" aria-live="polite">${messagesHtml}</div>
            <form class="bookings-comm-reply" id="booking-comm-reply-form">
              <div class="bookings-comm-reply-head">
                <p class="team-kicker">Compose</p>
                <span class="bookings-comm-channel ${active.channel === "Email" ? "is-email" : "is-whatsapp"}">${escapeHtml(active.channel)}</span>
              </div>
              <label class="bookings-comm-field" for="booking-comm-attach">
                <span class="bookings-comm-field-label">Attach / request document</span>
                <select class="team-select bookings-comm-select" id="booking-comm-attach" name="attachment">
                  <option value="">No attachment</option>
                  ${shareOptions
                    .map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.label)}${item.fileName ? ` · ${escapeHtml(item.fileName)}` : ""}</option>`)
                    .join("")}
                </select>
              </label>
              <label class="bookings-comm-field" for="booking-comm-reply-body">
                <span class="bookings-comm-field-label">Reply on ${escapeHtml(active.channel)}</span>
                <textarea class="bookings-comm-textarea" id="booking-comm-reply-body" name="body" rows="3" placeholder="Message optional if you attach a request or file…"></textarea>
              </label>
              <div class="bookings-comm-reply-actions">
                <p class="bookings-comm-channel-note">Share or request files on this thread. Incoming files can be saved into Documents for verification.</p>
                <button type="submit" class="btn btn-primary btn-sm">Send via ${escapeHtml(active.channel)}</button>
              </div>
            </form>
          </div>`;
      } else {
        detailHtml = `
          <div class="bookings-comm-detail bookings-comm-detail--empty">
            <div class="empty-state">
              <p class="empty-state-title">No thread selected</p>
              <p class="empty-state-desc">Start a message on ${escapeHtml(booking.id)}, or link an Inbox conversation.</p>
            </div>
          </div>`;
      }

      communicationEl.innerHTML = `
        <div class="team-section-bar bookings-ops-section-bar">
          <p class="team-kicker">Communication · Inbox</p>
          <span class="team-count-pill">${threads.length} thread${threads.length === 1 ? "" : "s"}${unlinked.length ? ` · ${unlinked.length} unlinked` : ""}</span>
        </div>
        <article class="bookings-card bookings-comm-card">
          <header class="bookings-card-head bookings-card-head--split">
            <div>
              <div class="card-title-row">
                <h2 class="bookings-card-title">Communication</h2>
                <span class="team-count-pill">${escapeHtml(booking.id)}</span>
              </div>
              <p class="bookings-card-sub">Reply, request docs, share files — same channel the conversation started on.</p>
            </div>
            <button type="button" class="btn btn-outline btn-sm" data-comm-new>New message</button>
          </header>
          ${unlinkedHtml}
          <div class="bookings-comm-layout">
            <div class="bookings-comm-list-pane">
              <ul class="bookings-comm-thread-list">${threadListHtml}</ul>
            </div>
            <div class="bookings-comm-detail-pane">${detailHtml}</div>
          </div>
        </article>`;

      communicationEl.querySelectorAll("[data-comm-open]").forEach((btn) => {
        btn.addEventListener("click", () => {
          bookingsState.commCompose = false;
          bookingsState.commThreadId = btn.dataset.commOpen;
          renderBookingOpsTabs(booking);
        });
      });
      communicationEl.querySelector("[data-comm-new]")?.addEventListener("click", () => {
        bookingsState.commCompose = true;
        renderBookingOpsTabs(booking);
      });
      communicationEl.querySelector("[data-comm-cancel-compose]")?.addEventListener("click", () => {
        bookingsState.commCompose = false;
        ensureBookingCommSelection(booking);
        renderBookingOpsTabs(booking);
      });
      communicationEl.querySelectorAll("[data-comm-link]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (!linkInboxThreadToBooking(btn.dataset.commLink, booking)) return;
          bookingsState.commCompose = false;
          bookingsState.commThreadId = btn.dataset.commLink;
          showToast(`Linked conversation to ${booking.id}…`);
          renderBookingOpsTabs(booking);
        });
      });
      communicationEl.querySelectorAll("[data-comm-save-doc]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (!active) return;
          if (saveCommIncomingToDocuments(booking, active, btn.dataset.commSaveDoc)) {
            showToast("Saved to Documents — open to verify…");
            renderBookingDetail(booking);
            renderBookingsList();
          }
        });
      });
      communicationEl.querySelectorAll("[data-comm-open-doc]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (!btn.dataset.commOpenDoc) return;
          bookingsState.docId = btn.dataset.commOpenDoc;
          setBookingDetailTab("documents", { updateHash: true });
          showToast("Opening documents…");
          renderBookingOpsTabs(booking);
        });
      });
      communicationEl.querySelectorAll("[data-cta-target]").forEach((btn) => {
        btn.addEventListener("click", () => runBookingCtaTarget(btn.dataset.ctaTarget));
      });
      communicationEl.querySelector("#booking-comm-reply-form")?.addEventListener("submit", (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const body = String(data.get("body") || "");
        const attachment = resolveCommAttachment(booking, active, String(data.get("attachment") || ""));
        if (!active || !appendStaffReply(active, body, { booking, attachment })) {
          if (!String(body).trim() && !attachment) showToast("Add a message or attach a document…");
          return;
        }
        showToast(
          attachment?.kind === "request"
            ? `Document requested via ${active.channel}…`
            : attachment
              ? `File sent via ${active.channel}…`
              : `Sent via ${active.channel}…`
        );
        form.reset();
        renderBookingDetail(booking);
        renderBookingsList();
      });
      communicationEl.querySelector("#booking-comm-compose-form")?.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const body = String(data.get("body") || "").trim();
        const party = String(data.get("party") || "Customer");
        const contactName = String(data.get("contact") || booking.customer).trim();
        const draftThread = { party, contactName };
        const attachment = resolveCommAttachment(booking, draftThread, String(data.get("attachment") || ""));
        if (!body && !attachment) {
          showToast("Add a message or attach a document…");
          return;
        }
        const related =
          attachment?.kind === "request" || attachment?.kind === "document"
            ? "Documents"
            : String(data.get("related") || "Booking");
        const channel = String(data.get("channel") || "WhatsApp");
        const thread = {
          id: `IN-${booking.slug}-${Date.now()}`,
          bookingSlug: booking.slug,
          bookingId: booking.id,
          party,
          roleLabel: partyRoleLabel(party),
          channel: channel === "Email" ? "Email" : "WhatsApp",
          contactName,
          related,
          serviceId: "",
          assignee: getBookingsViewerStaff()?.name || booking.owner?.name || "",
          when: "Just now",
          preview: "",
          unread: false,
          linkSource: "booking",
          messages: [],
        };
        INBOX_THREADS.unshift(thread);
        if (!appendStaffReply(thread, body, { booking, attachment })) {
          INBOX_THREADS.splice(INBOX_THREADS.indexOf(thread), 1);
          return;
        }
        bookingsState.commCompose = false;
        bookingsState.commThreadId = thread.id;
        showToast(`Sent via ${thread.channel} · linked to ${booking.id}…`);
        renderBookingDetail(booking);
        renderBookingsList();
      });
    }

    const activityEl = document.getElementById("booking-panel-activity");
    if (activityEl) {
      const viewer = getBookingsViewerStaff();
      const memberView = getBookingsViewingAs() === "Member";
      const events = bookingActivity(booking);
      let lastGroup = null;
      const rowsHtml = events
        .map((row) => {
          const group =
            row.groupKey !== lastGroup
              ? `<tr class="audit-group"><td colspan="4">${escapeHtml(row.groupLabel)}</td></tr>`
              : "";
          lastGroup = row.groupKey;
          return `${group}<tr class="audit-row" tabindex="0" data-search="${escapeHtml(row.searchText || "")}" data-module="${escapeHtml(row.module)}" data-group="${escapeHtml(row.groupKey)}">
            <td><span class="roster-metric">${escapeHtml(row.time)}</span></td>
            <td>
              <div class="member-cell">
                <span class="avatar ${escapeHtml(row.actor.avatarClass || "")}" aria-hidden="true">${escapeHtml(row.actor.initials)}</span>
                <div>
                  <p class="member-name">${escapeHtml(row.actor.name)}</p>
                  <p class="member-role">${escapeHtml(row.actor.type || "Member")}</p>
                </div>
              </div>
            </td>
            <td class="audit-event-cell"><span class="audit-event-text">${row.eventHtml}</span></td>
            <td><span class="audit-module-badge audit-module-${escapeHtml(String(row.module || "").toLowerCase())}">${escapeHtml(row.moduleLabel)}</span></td>
          </tr>`;
        })
        .join("");

      const accessCopy = memberView
        ? `Activity for this booking only · visible because it’s assigned to ${escapeHtml(viewer.name)} · not editable.`
        : `Activity for this booking only · not editable.`;

      activityEl.innerHTML = `
        <div class="team-section-bar bookings-ops-section-bar">
          <p class="team-kicker">Activity · Audit</p>
          <span class="team-count-pill">${events.length} event${events.length === 1 ? "" : "s"}</span>
        </div>
        <article class="bookings-card bookings-activity-card">
          <header class="bookings-card-head">
            <div>
              <div class="card-title-row">
                <h2 class="bookings-card-title">Activity</h2>
                <span class="team-count-pill">Read only</span>
              </div>
              <p class="bookings-card-sub">${accessCopy}</p>
            </div>
          </header>
          <div class="audit-toolbar bookings-activity-toolbar">
            <label class="audit-search">
              <img src="assets/search.svg" alt="" width="14" height="14" />
              <input type="search" id="booking-activity-search" placeholder="Search action or record ID on this booking" autocomplete="off" />
            </label>
            <div class="bookings-activity-filters">
              <select class="team-select audit-filter" id="booking-activity-module" aria-label="Module filter">
                <option value="all">All on this booking</option>
                <option value="bookings">Bookings</option>
                <option value="finance">Finance</option>
              </select>
            </div>
          </div>
          <div class="card table-scroll bookings-activity-table-wrap">
            <table class="team-table audit-table bookings-activity-table">
              <thead>
                <tr>
                  <th scope="col">Time</th>
                  <th scope="col">Member</th>
                  <th scope="col">Event</th>
                  <th scope="col">Module</th>
                </tr>
              </thead>
              <tbody id="booking-activity-tbody">
                ${rowsHtml || `<tr class="bookings-payments-empty-row"><td colspan="4">
                  <div class="empty-state bookings-ops-empty-wrap">
                    <p class="empty-state-title">No activity yet</p>
                    <p class="empty-state-desc">Ops actions on this booking will appear here.</p>
                  </div>
                </td></tr>`}
              </tbody>
            </table>
          </div>
        </article>`;

      const tbody = activityEl.querySelector("#booking-activity-tbody");
      const searchInput = activityEl.querySelector("#booking-activity-search");
      const moduleFilter = activityEl.querySelector("#booking-activity-module");

      const applyBookingActivityFilters = () => {
        if (!tbody) return;
        const q = (searchInput?.value || "").trim().toLowerCase();
        const module = moduleFilter?.value || "all";
        let visibleInGroup = 0;
        let lastGroupRow = null;

        tbody.querySelectorAll("tr").forEach((tr) => {
          if (tr.classList.contains("audit-group")) {
            if (lastGroupRow) lastGroupRow.hidden = visibleInGroup === 0;
            lastGroupRow = tr;
            visibleInGroup = 0;
            tr.hidden = false;
            return;
          }
          const hay = `${tr.dataset.search || ""} ${tr.textContent || ""}`.toLowerCase();
          const rowModule = tr.dataset.module || "";
          const show = (!q || hay.includes(q)) && (module === "all" || rowModule === module);
          tr.hidden = !show;
          if (show) visibleInGroup += 1;
        });
        if (lastGroupRow) lastGroupRow.hidden = visibleInGroup === 0;
      };

      searchInput?.addEventListener("input", applyBookingActivityFilters);
      moduleFilter?.addEventListener("change", applyBookingActivityFilters);
    }

    document.querySelectorAll("#booking-panel-finance [data-finance-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!canViewBookingFinance()) {
          showToast("Finance needs Finance permission…");
          return;
        }
        const action = btn.dataset.financeAction;
        if (!ownerAdmin) {
          showToast(action === "payout" ? "Payout request sent to admin…" : "Reminder queued…");
          return;
        }
        showToast(action === "payout" ? "Recording supplier payout…" : "Recording customer receipt…");
      });
    });
    document.querySelectorAll("#booking-panel-finance [data-amendment-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!canViewBookingFinance()) {
          showToast("Finance needs Finance permission…");
          return;
        }
        const action = btn.dataset.amendmentAction;
        if (action === "draft") {
          const priceEl = document.getElementById("booking-amend-price");
          const reasonEl = document.getElementById("booking-amend-reason");
          if (
            startSellingPriceAmendment(booking, priceEl?.value, reasonEl?.value || "Customer-facing commercial change")
          ) {
            showToast("Amendment drafted — accepted selling price unchanged…");
            renderBookingDetail(booking);
            renderBookingsList();
          }
          return;
        }
        if (action === "accept") {
          if (acceptSellingPriceAmendment(booking)) {
            showToast("Amendment accepted — selling price updated…");
            renderBookingDetail(booking);
            renderBookingsList();
          }
          return;
        }
        if (action === "discard") {
          if (discardSellingPriceAmendment(booking)) {
            showToast("Amendment discarded…");
            renderBookingDetail(booking);
            renderBookingsList();
          }
        }
      });
    });
  }


  function bookingRefLine(b) {
    const parts = [b.id];
    if (b.queryId) parts.push(`from ${b.queryId}`);
    if (b.proposalVersion) parts.push(`accepted Proposal ${b.proposalVersion}`);
    return parts.join(" · ");
  }

  function bookingCreatedLabel(b) {
    if (b.createdAt) return b.createdAt;
    const created = (b.activity || []).find((row) => /booking created|created from/i.test(String(row.body || "")));
    return created?.time || "";
  }

  function bookingPersonKey(person) {
    if (!person) return "";
    return String(person.id || person.name || "").trim().toLowerCase();
  }

  function bookingWorkingPeople(booking) {
    const byKey = new Map();
    const add = (person) => {
      const key = bookingPersonKey(person);
      if (!key || byKey.has(key)) return;
      byKey.set(key, person);
    };
    (booking?.team || []).forEach(add);
    (booking?.tasks || []).forEach((task) => add(task?.assignee));
    return Array.from(byKey.values());
  }

  function bookingOwnerExtrasCount(booking) {
    const ownerKey = bookingPersonKey(booking?.owner);
    return bookingWorkingPeople(booking).filter((person) => bookingPersonKey(person) !== ownerKey).length;
  }

  function bookingOwnerCompactLabel(booking) {
    const owner = booking?.owner;
    const extras = bookingOwnerExtrasCount(booking);
    const initials = owner?.initials || "—";
    return extras > 0 ? `${initials} +${extras}` : "";
  }

  function bookingOwnerPrimaryLabel(booking) {
    const owner = booking?.owner;
    const compact = bookingOwnerCompactLabel(booking);
    if (compact) return compact;
    return owner?.name || "—";
  }

  function bookingOwnerMetaFact(booking) {
    const ownerName = booking?.owner?.name;
    if (!ownerName) return null;
    const compact = bookingOwnerCompactLabel(booking);
    return compact ? `Owner · ${ownerName} · ${compact}` : `Owner · ${ownerName}`;
  }

  function getBookingBySlug(slug) {
    return BOOKINGS.find((b) => b.slug === slug) || null;
  }

  function paymentStageLabel(stage) {
    if (stage === "pending") return "Pending";
    if (stage === "partial") return "Partial";
    if (stage === "completed") return "Completed";
    if (stage === "overdue") return "Overdue";
    if (stage === "refunded") return "Refunded";
    if (stage === "failed") return "Failed";
    return stage;
  }

  function paymentIsOpen(p) {
    return p.stage === "pending" || p.stage === "partial" || p.stage === "overdue" || p.stage === "failed";
  }

  function bookingTabCounts() {
    return {
      upcoming: BOOKINGS.filter((b) => b.phase === "upcoming").length,
      travelling: BOOKINGS.filter((b) => b.phase === "travelling").length,
      completed: BOOKINGS.filter((b) => b.phase === "completed").length,
      cancelled: BOOKINGS.filter((b) => b.phase === "cancelled").length,
    };
  }

  function bookingMatchesTab(b, tab) {
    if (tab === "upcoming" || tab === "travelling" || tab === "completed" || tab === "cancelled") {
      return b.phase === tab;
    }
    return true;
  }

  function normalizeIssueFilter(value) {
    const legacy = {
      supplier_pending: "supplier",
      voucher_pending: "vouchers",
      voucher_blocked: "vouchers",
      documents_missing: "documents",
      documents_expiring: "documents",
      payment_overdue: "customer_payment",
    };
    if (!value || value === "all") return "all";
    if (value === "tasks") return "tasks";
    if (BOOKING_ISSUE_LABELS[value]) return value;
    return legacy[value] || "all";
  }

  function bookingHasOpenTasks(booking) {
    return (booking?.tasks || []).some((t) => t.status === "open" || t.status === "overdue" || t.status === "blocked");
  }

  function bookingMatchesDepartWindow(booking, windowKey = bookingsState.departWindow) {
    if (!windowKey || windowKey === "all") return true;
    const days = daysUntilTravel(booking);
    if (!Number.isFinite(days)) return false;
    if (windowKey === "overdue") return days < 0 && (booking.phase === "upcoming" || booking.phase === "travelling");
    const limit = Number(windowKey);
    if (!Number.isFinite(limit)) return true;
    return days >= 0 && days <= limit;
  }

  function bookingSourceKind(booking) {
    return booking?.queryId ? "query" : "direct";
  }

  function bookingDestinationOptions() {
    const set = new Set();
    BOOKINGS.forEach((b) => {
      const dest = String(b.destination || "").trim();
      if (dest) set.add(dest);
    });
    return [...set].sort((a, b) => a.localeCompare(b));
  }

  function populateBookingsDestinationFilters() {
    const destinations = bookingDestinationOptions();
    ["bookings-destination", "bookings-archive-destination"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const current = el.value || bookingsState.destinationFilter || "all";
      el.innerHTML = `<option value="all">All</option>${destinations
        .map((dest) => `<option value="${escapeHtml(dest)}">${escapeHtml(dest)}</option>`)
        .join("")}`;
      el.value = destinations.includes(current) || current === "all" ? current : "all";
    });
  }

  function bookingsHaveActiveFilters() {
    const archiveMode = bookingsListIsArchiveTab();
    const archiveDefaultWindow = bookingsState.tab === "travelling" ? "all" : "30";
    return (
      !!bookingsState.search.trim() ||
      bookingsState.attentionFilter !== "all" ||
      normalizeIssueFilter(bookingsState.issueFilter) !== "all" ||
      bookingsState.ownerFilter !== "all" ||
      bookingsState.departWindow !== "all" ||
      bookingsState.destinationFilter !== "all" ||
      bookingsState.sourceFilter !== "all" ||
      (archiveMode && bookingsState.archiveWindow !== archiveDefaultWindow)
    );
  }

  function syncBookingsFacetControls() {
    const pairs = [
      ["bookings-owner", "bookings-archive-owner", "ownerFilter"],
      ["bookings-depart", "bookings-archive-depart", "departWindow"],
      ["bookings-destination", "bookings-archive-destination", "destinationFilter"],
      ["bookings-source", "bookings-archive-source", "sourceFilter"],
    ];
    pairs.forEach(([opsId, archiveId, key]) => {
      const value = bookingsState[key] || "all";
      const ops = document.getElementById(opsId);
      const archive = document.getElementById(archiveId);
      if (ops) ops.value = value;
      if (archive) archive.value = value;
    });
  }

  function normalizeBookingsListTab(tab) {
    if (tab === "payments") {
      return { tab: "upcoming", issueFilter: "customer_payment" };
    }
    if (tab === "upcoming" || tab === "travelling" || tab === "completed" || tab === "cancelled") {
      return { tab, issueFilter: null };
    }
    return { tab: "upcoming", issueFilter: null };
  }

  function bookingsListIsArchiveTab(tab = bookingsState.tab) {
    return tab === "travelling" || tab === "completed" || tab === "cancelled";
  }

  function bookingsQueueTitle(tab = bookingsState.tab) {
    if (tab === "travelling") return "Travelling";
    if (tab === "completed") return "Completed";
    if (tab === "cancelled") return "Cancelled";
    return "Ops queue";
  }

  function bookingWithinArchiveWindow(booking, windowDays) {
    if (!windowDays || windowDays === "all") return true;
    const days = Number(windowDays);
    if (!Number.isFinite(days) || days <= 0) return true;
    const end = booking.travelEnd || booking.travelStart;
    if (!end) return true;
    const endMs = Date.parse(end);
    if (!Number.isFinite(endMs)) return true;
    const now = Date.now();
    const pastLimit = now - days * 86400000;
    const futureLimit = now + days * 86400000;
    // Keep trips that ended recently or are currently / soon travelling.
    return endMs >= pastLimit && (booking.travelStart ? Date.parse(booking.travelStart) <= futureLimit : true);
  }

  function bookingSearchHaystack(b) {
    const travellers = bookingTravellers(b)
      .map((t) => `${t.legalName || ""} ${t.name || ""}`)
      .join(" ");
    const vendors = bookingServices(b)
      .map((s) => `${s.vendor || ""} ${s.name || ""}`)
      .join(" ");
    const version = b.proposalVersion ? String(b.proposalVersion) : "";
    const proposal = [
      b.linkedProposal || "",
      version,
      version ? `Proposal ${version.replace(/^v/i, "v")}` : "",
      version ? `Proposal ${version}` : "",
    ].join(" ");
    return [
      b.title,
      b.id,
      b.queryId,
      b.customer,
      b.destination,
      b.tripLabel,
      travellers,
      vendors,
      proposal,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  }

  function bookingSearchMatches(b, q) {
    if (!q) return true;
    const hay = bookingSearchHaystack(b);
    if (hay.includes(q)) return true;
    const compactQ = q.replace(/[\s\-_/]+/g, "");
    if (!compactQ || compactQ === q) return false;
    const compactHay = hay.replace(/[\s\-_/]+/g, "");
    return compactHay.includes(compactQ);
  }

  function getFilteredBookings() {
    const q = bookingsState.search.trim().toLowerCase();
    const viewer = getBookingsViewerStaff();
    let list = BOOKINGS.filter((b) => bookingMatchesTab(b, bookingsState.tab));
    list = list.filter((b) => bookingMatchesScope(b, bookingsState.scope, viewer, bookingsState.scopeMember));
    if (bookingsState.attentionFilter && bookingsState.attentionFilter !== "all") {
      list = list.filter((b) => getBookingAttention(b) === bookingsState.attentionFilter);
    }
    bookingsState.issueFilter = normalizeIssueFilter(bookingsState.issueFilter);
    if (bookingsState.issueFilter && bookingsState.issueFilter !== "all") {
      if (bookingsState.issueFilter === "tasks") {
        list = list.filter((b) => bookingHasOpenTasks(b));
      } else {
        list = list.filter((b) => getBookingOpenIssues(b).includes(bookingsState.issueFilter));
      }
    }
    if (bookingsState.ownerFilter && bookingsState.ownerFilter !== "all") {
      list = list.filter((b) => b.owner?.id === bookingsState.ownerFilter);
    }
    if (bookingsState.departWindow && bookingsState.departWindow !== "all") {
      list = list.filter((b) => bookingMatchesDepartWindow(b, bookingsState.departWindow));
    }
    if (bookingsState.destinationFilter && bookingsState.destinationFilter !== "all") {
      list = list.filter((b) => String(b.destination || "") === bookingsState.destinationFilter);
    }
    if (bookingsState.sourceFilter && bookingsState.sourceFilter !== "all") {
      list = list.filter((b) => bookingSourceKind(b) === bookingsState.sourceFilter);
    }
    if (bookingsListIsArchiveTab() && bookingsState.archiveWindow && bookingsState.archiveWindow !== "all") {
      list = list.filter((b) => bookingWithinArchiveWindow(b, bookingsState.archiveWindow));
    }
    if (q) {
      list = list.filter((b) => bookingSearchMatches(b, q));
    }
    const sort = bookingsState.sort;
    list = [...list].sort((a, b) => {
      if (sort === "travel") return a.travelStart.localeCompare(b.travelStart) || a.priority - b.priority;
      if (sort === "balance") return bookingMoneyDue(b) - bookingMoneyDue(a) || a.priority - b.priority;
      const attnRank = { at_risk: 0, needs_action: 1, healthy: 2 };
      const attnDelta = (attnRank[getBookingAttention(a)] ?? 9) - (attnRank[getBookingAttention(b)] ?? 9);
      const issueDelta = getBookingOpenIssues(b).length - getBookingOpenIssues(a).length;
      return attnDelta || issueDelta || a.priority - b.priority;
    });
    return list;
  }

  function syncBookingsArchiveControls() {
    const archiveSearch = document.getElementById("bookings-archive-search");
    const archiveAttention = document.getElementById("bookings-archive-attention");
    const archiveSort = document.getElementById("bookings-archive-sort");
    const archiveWindow = document.getElementById("bookings-archive-window");
    const archiveIssue = document.getElementById("bookings-archive-issue");
    if (archiveSearch && archiveSearch.value !== bookingsState.search) archiveSearch.value = bookingsState.search;
    if (archiveAttention) archiveAttention.value = bookingsState.attentionFilter || "all";
    if (archiveSort) archiveSort.value = bookingsState.sort || "travel";
    if (archiveWindow) archiveWindow.value = bookingsState.archiveWindow || "30";
    if (archiveIssue) archiveIssue.value = bookingsState.issueFilter || "all";
    syncBookingsFacetControls();
  }

  function bookingArchiveMoneyCell(booking) {
    if (!canViewBookingFinance()) {
      return `<span class="bookings-row-settle">Restricted</span>`;
    }
    const money = bookingRowMoneyLines(booking);
    const [primary, secondary] = money.lines;
    if (!primary) return `<span class="roster-metric">—</span>`;
    const body = `<span class="roster-metric">${escapeHtml(primary.text)}</span>${
      secondary ? `<span class="member-role">${escapeHtml(secondary.text)}</span>` : ""
    }`;
    if (!money.launchFinance) return body;
    return `<button type="button" class="bookings-archive-money-launch" data-booking-open-tab="finance" title="Open finance">${body}</button>`;
  }

  function renderBookingsArchiveTable(pageItems) {
    if (!pageItems.length) {
      return `
        <div class="bookings-empty" role="status">
          <div class="bookings-empty-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8M8 11h5"/></svg>
          </div>
          <p class="empty-state-title">No bookings match</p>
          <p class="empty-state-desc">Try a different filter, date range, or search.</p>
          <button type="button" class="btn btn-outline btn-sm" id="bookings-empty-clear">Clear filters</button>
        </div>`;
    }
    const rows = pageItems
      .map((b) => {
        const attention = getBookingAttention(b);
        const openIssues = getBookingOpenIssues(b);
        return `
        <tr class="bookings-archive-row" tabindex="0" data-booking-slug="${escapeHtml(b.slug)}">
          <td>
            <div class="member-cell">
              <span class="avatar avatar-mint" aria-hidden="true">${escapeHtml(bookingInitial(b.destination || b.title))}</span>
              <div>
                <p class="member-name">${escapeHtml(b.title)}</p>
                <p class="member-role">${escapeHtml(bookingRefLine(b))}</p>
              </div>
            </div>
          </td>
          <td>
            <span class="roster-metric">${escapeHtml(formatListDates(b.travelStart, b.travelEnd))}</span>
            <span class="member-role">${escapeHtml(String(b.pax))} pax</span>
          </td>
          <td>
            <div class="booking-status-pills">
              <span class="booking-attention-pill is-${escapeHtml(attention)}">${escapeHtml(attentionLabel(attention))}</span>
              ${
                openIssues.length
                  ? bookingIssueChipsHtml(b, openIssues, {
                      limit: BOOKING_ISSUE_CHIP_LIMIT,
                      wrapClass: "bookings-issue-row is-inline",
                      interactiveMore: false,
                    })
                  : `<span class="member-role">No open blockers</span>`
              }
            </div>
          </td>
          <td class="bookings-archive-money">${bookingArchiveMoneyCell(b)}</td>
          <td>
            <div class="member-cell">
              <span class="avatar avatar-pink" aria-hidden="true">${escapeHtml(b.owner.initials)}</span>
              <div>
                <p class="bookings-row-owner-label">Owner</p>
                <p class="member-name">${escapeHtml(bookingOwnerPrimaryLabel(b))}</p>
              </div>
            </div>
          </td>
        </tr>`;
      })
      .join("");
    return `
      <div class="table-scroll bookings-archive-table-wrap">
        <table class="team-table bookings-archive-table">
          <thead>
            <tr>
              <th scope="col">Booking</th>
              <th scope="col">Travel</th>
              <th scope="col">Status</th>
              <th scope="col">Money</th>
              <th scope="col">Owner</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getFilteredPayments() {
    const q = paymentsState.search.trim().toLowerCase();
    const maxDays = Number(paymentsState.date) || 30;
    return BOOKING_PAYMENTS.filter((p) => {
      if (p.dayOffset > maxDays) return false;
      if (paymentsState.stage !== "all" && p.stage !== paymentsState.stage) return false;
      if (paymentsState.type !== "all" && p.type !== paymentsState.type) return false;
      if (paymentsState.method !== "all" && p.method !== paymentsState.method) return false;
      if (!q) return true;
      const hay = `${p.id} ${p.bookingId} ${p.bookingTitle} ${p.customer} ${p.eventLabel} ${p.method}`.toLowerCase();
      return hay.includes(q);
    });
  }

  function renderBookingsPaymentsTable() {
    const tbody = document.getElementById("payments-tbody");
    const openPill = document.getElementById("payments-open-pill");
    if (!tbody) return;

    const openCount = BOOKING_PAYMENTS.filter(paymentIsOpen).length;
    if (openPill) openPill.textContent = openCount === 1 ? "1 open" : `${openCount} open`;

    const rows = getFilteredPayments();
    if (!rows.length) {
      tbody.innerHTML = `<tr class="bookings-payments-empty-row"><td colspan="5">
        <div class="bookings-empty" role="status">
          <p class="empty-state-title">No payments match</p>
          <p class="empty-state-desc">Try a different stage, type, or search.</p>
        </div>
      </td></tr>`;
      return;
    }

    let lastGroup = null;
    const html = [];
    rows.forEach((p) => {
      if (p.groupKey !== lastGroup) {
        html.push(`<tr class="audit-group"><td colspan="5">${escapeHtml(p.groupLabel)}</td></tr>`);
        lastGroup = p.groupKey;
      }
      const amountPrefix = "";
      const amountClass = p.type === "customer" && p.stage === "completed" ? "is-in" : p.type === "vendor" || p.type === "refund" ? "is-out" : "";
      const amountLabel =
        p.type === "vendor" || p.type === "refund"
          ? `${formatINR(p.amount, { signed: false })} out`
          : formatINR(p.amount, { signed: false });
      const stageChange =
        p.previousStage && p.previousStage !== "—"
          ? `Status changed: ${escapeHtml(p.previousStage)} → ${escapeHtml(paymentStageLabel(p.stage))}`
          : escapeHtml(p.eventLabel);
      html.push(`
        <tr class="audit-row bookings-payment-row" tabindex="0" data-booking-slug="${escapeHtml(p.bookingSlug)}" data-payment-id="${escapeHtml(p.id)}">
          <td><span class="roster-metric">${escapeHtml(p.time)}</span></td>
          <td>
            <div class="member-cell">
              <span class="avatar ${escapeHtml(p.avatarClass)}" aria-hidden="true">${escapeHtml(p.customerInitials)}</span>
              <div>
                <p class="member-name">${escapeHtml(p.customer)}</p>
                <p class="member-role">${escapeHtml(p.bookingId)}</p>
              </div>
            </div>
          </td>
          <td class="audit-event-cell">
            <button type="button" class="audit-record-link" data-payment-open="${escapeHtml(p.bookingSlug)}">${escapeHtml(p.id)}</button>
            <span class="audit-event-text">${stageChange}</span>
            <span class="audit-event-reference">${escapeHtml(p.bookingTitle)} · ${escapeHtml(p.method)} · ${escapeHtml(p.type === "customer" ? "Customer in" : p.type === "vendor" ? "Vendor out" : "Refund")}</span>
          </td>
          <td><span class="bookings-payment-amount ${amountClass}">${escapeHtml(amountLabel)}</span></td>
          <td><span class="payment-stage-pill is-${escapeHtml(p.stage)}">${escapeHtml(paymentStageLabel(p.stage))}</span></td>
        </tr>`);
    });
    tbody.innerHTML = html.join("");

    tbody.querySelectorAll("[data-booking-slug]").forEach((row) => {
      const open = () => openBookingDetail(row.dataset.bookingSlug, { push: true, tab: "finance" });
      row.addEventListener("click", (e) => {
        if (e.target.closest(".audit-record-link")) return;
        open();
      });
      row.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
    });
    tbody.querySelectorAll("[data-payment-open]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openBookingDetail(btn.dataset.paymentOpen, { push: true, tab: "finance" });
      });
    });
  }

  function setBookingsPaymentsMode(active) {
    const listCard = document.getElementById("bookings-list-card");
    const paymentsView = document.getElementById("bookings-payments-view");
    if (listCard) listCard.hidden = active;
    if (paymentsView) paymentsView.hidden = !active;
    if (active) renderBookingsPaymentsTable();
  }

  function renderBookingsList() {
    const body = document.getElementById("bookings-list-body");
    const clearBtn = document.getElementById("bookings-clear");
    const meta = document.getElementById("bookings-pagination-meta");
    const prevBtn = document.getElementById("bookings-prev");
    const nextBtn = document.getElementById("bookings-next");
    if (!body) return;
    applyBookingPersonaAccessFlags();
    syncBookingsScopeControls();

    const counts = bookingTabCounts();
    document.querySelectorAll("[data-count]").forEach((el) => {
      const key = el.dataset.count;
      if (counts[key] != null) el.textContent = String(counts[key]);
    });

    document.querySelectorAll("[data-bookings-tab]").forEach((btn) => {
      const active = btn.dataset.bookingsTab === bookingsState.tab;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
    });

    if (bookingsState.tab === "payments") {
      const routed = normalizeBookingsListTab("payments");
      bookingsState.tab = routed.tab;
      if (routed.issueFilter) bookingsState.issueFilter = routed.issueFilter;
    }

    setBookingsPaymentsMode(false);

    const listCard = document.getElementById("bookings-list-card");
    const archiveToolbar = document.getElementById("bookings-archive-toolbar");
    const opsFilters = document.getElementById("bookings-ops-filters");
    const queueTitle = document.getElementById("bookings-queue-title");
    const queueCount = document.getElementById("bookings-queue-count");
    const archiveMode = bookingsListIsArchiveTab();

    if (listCard) listCard.dataset.listMode = archiveMode ? "archive" : "ops";
    if (archiveToolbar) archiveToolbar.hidden = !archiveMode;
    if (opsFilters) opsFilters.hidden = archiveMode;
    if (queueTitle) queueTitle.textContent = bookingsQueueTitle();

    // Archive tabs default to travel sort; ops queue defaults to priority.
    if (archiveMode && !["travel", "priority", "balance"].includes(bookingsState.sort)) {
      bookingsState.sort = "travel";
    }
    if (!archiveMode && bookingsState.sort === "travel" && !bookingsState.filtersActive) {
      /* keep user choice */
    }
    syncBookingsArchiveControls();
    syncBookingsFacetControls();
    const opsSearch = document.getElementById("bookings-search");
    if (opsSearch && !archiveMode && opsSearch.value !== bookingsState.search) opsSearch.value = bookingsState.search;
    const opsSort = document.getElementById("bookings-sort");
    if (opsSort && !archiveMode) opsSort.value = bookingsState.sort || "priority";
    const opsAttention = document.getElementById("bookings-attention");
    if (opsAttention && !archiveMode) opsAttention.value = bookingsState.attentionFilter || "all";
    const opsIssue = document.getElementById("bookings-issue");
    if (opsIssue && !archiveMode) opsIssue.value = bookingsState.issueFilter || "all";

    const filtered = getFilteredBookings();
    const total = filtered.length;
    const start = bookingsState.page * bookingsState.pageSize;
    const pageItems = filtered.slice(start, start + bookingsState.pageSize);
    const end = start + pageItems.length;
    if (queueCount) {
      queueCount.hidden = !archiveMode;
      queueCount.textContent = total === 1 ? "1 booking" : `${total} bookings`;
    }
    const hasFilters = bookingsHaveActiveFilters();
    if (clearBtn) clearBtn.hidden = !hasFilters || archiveMode;
    const archiveClear = document.getElementById("bookings-archive-clear");
    if (archiveClear) archiveClear.hidden = !hasFilters || !archiveMode;

    const bindBookingRowOpen = (root) => {
      root.querySelectorAll("[data-booking-slug]").forEach((el) => {
        const openOverview = () => openBookingFromList(el.dataset.bookingSlug, "overview");
        el.addEventListener("click", (e) => {
          if (e.target.closest("[data-booking-open-tab], [data-booking-issues-more]")) return;
          openOverview();
        });
        el.addEventListener("keydown", (e) => {
          if (e.target.closest("[data-booking-open-tab], [data-booking-issues-more]")) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openOverview();
          }
        });
      });
      root.querySelectorAll("[data-booking-open-tab]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const row = btn.closest("[data-booking-slug]");
          const slug = row?.dataset.bookingSlug;
          if (!slug) return;
          openBookingFromList(slug, btn.dataset.bookingOpenTab || "overview");
        });
      });
      const openIssuesMore = (slug) => {
        if (!slug) return;
        openBookingFromList(slug, "overview", { focusReadiness: true });
      };
      root.querySelectorAll("[data-booking-issues-more]").forEach((ctrl) => {
        ctrl.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          openIssuesMore(ctrl.dataset.bookingIssuesMore);
        });
        ctrl.addEventListener("keydown", (e) => {
          if (e.key !== "Enter" && e.key !== " ") return;
          e.preventDefault();
          e.stopPropagation();
          openIssuesMore(ctrl.dataset.bookingIssuesMore);
        });
      });
      root.querySelector("#bookings-empty-clear")?.addEventListener("click", clearBookingsFilters);
    };

    if (archiveMode) {
      body.innerHTML = renderBookingsArchiveTable(pageItems);
      bindBookingRowOpen(body);
    } else if (!pageItems.length) {
      body.innerHTML = `
        <div class="bookings-empty" role="status">
          <div class="bookings-empty-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8M8 11h5"/></svg>
          </div>
          <p class="empty-state-title">No bookings match</p>
          <p class="empty-state-desc">Try a different lifecycle view, attention filter or search.</p>
          <button type="button" class="btn btn-outline btn-sm" id="bookings-empty-clear">Clear filters</button>
        </div>`;
      bindBookingRowOpen(body);
    } else {
      body.innerHTML = `<ul class="bookings-rows" aria-label="Bookings">${pageItems
        .map((b) => {
          const openIssues = getBookingOpenIssues(b);
          const attention = getBookingAttention(b);
          const showPhasePill = bookingsState.tab === "all" || b.phase !== bookingsState.tab;
          const tripLine = bookingTripContextLine(b);
          const traceLine = bookingTraceLine(b);
          const problemsHtml = bookingIssueChipsHtml(b, openIssues);
          const nextLine = bookingNextActionLine(b);
          const money = bookingRowMoneyLines(b);
          const ownerLabel = bookingOwnerSideLabel(b);
          const [moneyPrimary, moneySecondary] = money.lines;
          const moneyInner = `
                  <span class="bookings-row-money ${escapeHtml(moneyPrimary?.tone || "is-clear")}">
                    <span class="bookings-row-amount">${escapeHtml(moneyPrimary?.text || "Settled")}</span>
                    ${moneySecondary ? `<span class="bookings-row-settle">${escapeHtml(moneySecondary.text)}</span>` : ""}
                  </span>`;
          const moneyBlock = money.launchFinance
            ? `<button type="button" class="bookings-row-finance is-launch" data-booking-open-tab="finance" title="${escapeHtml(money.title || "Open finance")}">${moneyInner}</button>`
            : `<span class="bookings-row-finance" title="${escapeHtml(money.title)}">${moneyInner}</span>`;
          return `
          <li>
            <div class="bookings-row" role="link" tabindex="0" data-booking-slug="${escapeHtml(b.slug)}" data-attention="${escapeHtml(attention)}" aria-label="${escapeHtml(`Open ${b.title}`)}">
              <span class="bookings-row-main">
                <span class="bookings-row-title-line">
                  <span class="bookings-row-title">${escapeHtml(b.title)}</span>
                  ${
                    showPhasePill
                      ? `<span class="bookings-row-phase">${escapeHtml(phaseLabel(b.phase))}</span>`
                      : ""
                  }
                  <span class="bookings-row-attention is-${escapeHtml(attention)}">${escapeHtml(attentionLabel(attention))}</span>
                </span>
                ${tripLine ? `<span class="bookings-row-trip">${escapeHtml(tripLine)}</span>` : ""}
                ${traceLine ? `<span class="bookings-row-trace">${escapeHtml(traceLine)}</span>` : ""}
                ${problemsHtml || ""}
                ${nextLine ? `<span class="bookings-row-next"><span class="bookings-row-next-mark" aria-hidden="true">→</span><span class="bookings-row-next-text">${escapeHtml(nextLine)}</span></span>` : ""}
              </span>
              <span class="bookings-row-side">
                ${moneyBlock}
                <span class="bookings-row-owner" title="${escapeHtml(b.owner?.name || "Owner")}" aria-label="${escapeHtml(`Owner ${b.owner?.name || ownerLabel}`)}">${escapeHtml(ownerLabel)}</span>
              </span>
            </div>
          </li>`;
        })
        .join("")}</ul>`;
      bindBookingRowOpen(body);
    }

    if (meta) {
      if (!total) meta.textContent = `Showing 0 of 0 · ${bookingsState.pageSize} per page`;
      else meta.textContent = `Showing ${start + 1}–${end} of ${total} · ${bookingsState.pageSize} per page`;
    }
    const maxPage = Math.max(0, Math.ceil(total / bookingsState.pageSize) - 1);
    if (prevBtn) prevBtn.disabled = bookingsState.page <= 0;
    if (nextBtn) nextBtn.disabled = bookingsState.page >= maxPage || total === 0;
  }

  function clearBookingsFilters() {
    const stayOnArchive = bookingsListIsArchiveTab();
    if (!stayOnArchive) bookingsState.tab = "upcoming";
    bookingsState.search = "";
    bookingsState.sort = stayOnArchive ? "travel" : "priority";
    bookingsState.attentionFilter = "all";
    bookingsState.issueFilter = "all";
    bookingsState.ownerFilter = "all";
    bookingsState.departWindow = "all";
    bookingsState.destinationFilter = "all";
    bookingsState.sourceFilter = "all";
    bookingsState.archiveWindow = stayOnArchive && bookingsState.tab === "travelling" ? "all" : stayOnArchive ? "30" : "all";
    bookingsState.page = 0;
    bookingsState.filtersActive = false;
    const search = document.getElementById("bookings-search");
    const sort = document.getElementById("bookings-sort");
    const attention = document.getElementById("bookings-attention");
    const issue = document.getElementById("bookings-issue");
    const archiveSearch = document.getElementById("bookings-archive-search");
    if (search) search.value = "";
    if (archiveSearch) archiveSearch.value = "";
    if (sort) sort.value = bookingsState.sort;
    if (attention) attention.value = "all";
    if (issue) issue.value = "all";
    syncBookingsFacetControls();
    syncBookingsArchiveControls();
    const more = document.getElementById("bookings-archive-more");
    if (more) more.open = false;
    const opsMore = document.getElementById("bookings-ops-more");
    if (opsMore) opsMore.open = false;
    renderBookingsList();
  }

  function isBookingRecordConfirmed(booking) {
    if (!booking) return false;
    if (booking.phase === "cancelled") return false;
    if (booking.confirmed) return true;
    return !!(booking.id && booking.proposalVersion);
  }

  function bookingStatusLabel(booking) {
    if (booking.phase === "cancelled") return "Cancelled";
    return isBookingRecordConfirmed(booking) ? "Confirmed" : "Draft";
  }

  function bookingReadinessRows(booking) {
    const services = bookingServices(booking);
    const confirmedVendors = services.filter((s) => s.confirmation === "confirmed").length;
    const travellers = bookingTravellerReadiness(booking);
    const docs = bookingDocuments(booking);
    const requiredDocs = docs.filter((d) => d.required !== false);
    const verifiedDocs = requiredDocs.filter((d) => docStatusIsComplete(d.status)).length;
    const vouchers = bookingVouchers(booking);
    const voucherBlocked = vouchers.filter((v) => v.status === "blocked").length;
    const voucherSent = vouchers.filter((v) => v.status === "sent").length;
    const voucherReady = vouchers.filter((v) => v.status === "ready" || v.status === "issued").length;

    const supplierOpen = confirmedVendors < services.length;
    const travellersOpen = travellers.ready < travellers.total;
    const docsOpen = verifiedDocs < requiredDocs.length;
    const vouchersOpen = voucherBlocked > 0 || voucherReady > 0 || voucherSent < vouchers.length;

    return [
      {
        id: "suppliers",
        label: "Suppliers",
        value: services.length ? `${confirmedVendors}/${services.length} confirmed` : "No services",
        tab: "services",
        tone: !services.length ? "is-done" : supplierOpen ? "is-open" : "is-done",
      },
      {
        id: "travellers",
        label: "Travellers",
        value: travellers.total ? `${travellers.ready}/${travellers.total} ready` : "No travellers",
        tab: "travellers",
        tone: !travellers.total ? "is-done" : travellersOpen ? "is-open" : "is-done",
      },
      {
        id: "documents",
        label: "Documents",
        value: requiredDocs.length ? `${verifiedDocs}/${requiredDocs.length} verified` : "No documents",
        tab: "documents",
        tone: !requiredDocs.length ? "is-done" : docsOpen ? "is-open" : "is-done",
      },
      {
        id: "vouchers",
        label: "Vouchers",
        value: !vouchers.length
          ? "None yet"
          : voucherBlocked
            ? `${voucherBlocked} blocked`
            : `${voucherSent}/${vouchers.length} sent`,
        tab: "vouchers",
        tone: !vouchers.length ? "is-done" : voucherBlocked ? "is-blocked" : vouchersOpen ? "is-open" : "is-done",
      },
    ];
  }

  function bindBookingLifecycleActions(root, booking) {
    if (!root) return;
    root.querySelector("[data-lifecycle='cancel']")?.addEventListener("click", () => {
      if (!isBookingsOwnerAdmin()) return;
      booking.phase = "cancelled";
      booking.lifecycle = { mode: "reopen", readiness: 0 };
      booking.actionHint = "Cancelled — reopen to resume ops";
      booking.nextAction = {
        kind: "info",
        title: "Booking cancelled",
        body: "Reopen if the customer wants to continue.",
        cta: "",
        ctaTarget: "",
      };
      pushBookingActivity(booking, "Booking cancelled.");
      showToast("Booking cancelled…");
      renderBookingDetail(booking);
      renderBookingsList();
    });
    root.querySelector("[data-lifecycle='reopen']")?.addEventListener("click", () => {
      if (!isBookingsOwnerAdmin()) return;
      booking.phase = "upcoming";
      booking.confirmed = true;
      booking.actionHint = "Resume supplier, voucher and document work";
      booking.lifecycle = { mode: "reopen" };
      booking.nextAction = {
        kind: "task",
        title: "Resume operational readiness",
        body: "Booking reopened — suppliers, travellers, documents and vouchers still drive ops.",
        cta: "Open services",
        ctaTarget: "services",
      };
      pushBookingActivity(booking, "Booking reopened · commercial status remains Confirmed.");
      showToast("Booking reopened…");
      renderBookingDetail(booking);
      renderBookingsList();
    });
  }

  function bookingLifecyclePanelHtml(booking) {
    const ownerAdmin = isBookingsOwnerAdmin();
    const cancelled = booking.phase === "cancelled";
    const rows = bookingReadinessRows(booking);
    const openCount = rows.filter((row) => row.tone !== "is-done").length;
    const title = cancelled
      ? "Booking cancelled"
      : openCount
        ? `${openCount} area${openCount === 1 ? "" : "s"} still open`
        : "Ready for departure";

    const footAction = ownerAdmin
      ? cancelled
        ? `<button type="button" class="btn btn-outline btn-sm owner-admin-only" data-lifecycle="reopen">Reopen booking</button>`
        : `<button type="button" class="btn btn-destructive-soft btn-sm owner-admin-only" data-lifecycle="cancel">Cancel booking</button>`
      : `<p class="bookings-lifecycle-member">Cancel / reopen needs Admin or Owner.</p>`;

    return `
      <div class="bookings-lifecycle bookings-overview-lifecycle">
        <header class="bookings-card-head">
          <div>
            <p class="team-kicker">Booking readiness</p>
            <div class="card-title-row">
              <h2 class="bookings-card-title">${escapeHtml(title)}</h2>
              <span class="team-count-pill">${openCount ? `${openCount} open` : "Clear"}</span>
            </div>
            <p class="bookings-card-sub">Suppliers, travellers, documents and vouchers.</p>
          </div>
        </header>
        <ul class="bookings-overview-readiness">
          ${rows
            .map((row) => {
              const chip =
                row.tone === "is-done" ? "Clear" : row.tone === "is-blocked" ? "Blocked" : "Open";
              return `
            <li>
              <button type="button" class="bookings-overview-ready-row ${escapeHtml(row.tone)}" data-cta-target="${escapeHtml(
                row.tab
              )}" aria-label="${escapeHtml(row.label)} ${escapeHtml(row.value)} — open ${escapeHtml(row.tab)}">
                <span class="bookings-overview-ready-copy">
                  <span class="bookings-overview-ready-kicker">${escapeHtml(row.label)}</span>
                  <span class="bookings-overview-ready-label">${escapeHtml(row.value)}</span>
                </span>
                <span class="bookings-overview-ready-aside">
                  <span class="bookings-confirmation-status ${escapeHtml(row.tone)}">${escapeHtml(chip)}</span>
                  <span class="bookings-overview-ready-go" aria-hidden="true">→</span>
                </span>
              </button>
            </li>`;
            })
            .join("")}
        </ul>
        <div class="bookings-overview-card-foot">
          <div class="bookings-lifecycle-actions">${footAction}</div>
        </div>
      </div>`;
  }

  function renderBookingOverview(booking) {
    const el = document.getElementById("booking-panel-overview-body");
    if (!el) return;
    bookingDocuments(booking);
    bookingVouchers(booking);
    syncBookingSupplierTotals(booking);

    const notes = booking.notesList || [];
    const services = bookingServices(booking);
    const travellers = bookingTravellers(booking);
    const readiness = bookingTravellerReadiness(booking);
    const lead = travellers.find((t) => t.lead) || travellers[0];
    const days = daysUntilTravel(booking);
    const canFinance = canViewBookingFinance();
    const ownerOnly = isBookingsOwner();
    const L = booking.ledger || {};
    const selling = acceptedSellingPrice(booking) || Number(L.sellingPrice) || 0;
    const toCollect = Math.max(0, Number(booking.toCollect) || 0);
    const toPay = Math.max(0, Number(booking.toPaySuppliers) || 0);
    const margin = Number(L.margin);
    const na = booking.nextAction || {};

    const servicesHtml = services.length
      ? `<ul class="bookings-overview-services">${services
          .map((service) => {
            const type = serviceTypeLabel(service.type);
            const dates =
              booking.travelStart && booking.travelEnd
                ? formatListDates(booking.travelStart, booking.travelEnd)
                : "—";
            return `<li class="bookings-overview-service">
              <span class="tag-chip">${escapeHtml(type)}</span>
              <div class="bookings-overview-service-copy">
                <p class="bookings-overview-service-title">${escapeHtml(service.name || type)}</p>
                <p class="bookings-overview-service-meta">${escapeHtml(service.vendor || "—")} · ${escapeHtml(
                  service.serviceDetail || dates
                )}</p>
              </div>
              <span class="bookings-confirmation-status ${
                service.confirmation === "confirmed" ? "is-done" : "is-open"
              }">${escapeHtml(service.confirmation === "confirmed" ? "Confirmed" : "Pending")}</span>
            </li>`;
          })
          .join("")}</ul>`
      : `<div class="empty-state bookings-ops-empty-wrap">
          <p class="empty-state-title">No services yet</p>
          <p class="empty-state-desc">Add services on the Services &amp; vendors tab.</p>
        </div>`;

    let moneyHtml = "";
    if (canFinance) {
      moneyHtml = `
        <div class="bookings-overview-money-grid">
          <article class="bookings-overview-stat">
            <p class="team-kicker">Booking value</p>
            <p class="bookings-overview-stat-value">${escapeHtml(formatINR(selling, { signed: false }))}</p>
          </article>
          <article class="bookings-overview-stat">
            <p class="team-kicker">To collect</p>
            <p class="bookings-overview-stat-value">${escapeHtml(formatINR(toCollect, { signed: false }))}</p>
          </article>
          <article class="bookings-overview-stat">
            <p class="team-kicker">To pay suppliers</p>
            <p class="bookings-overview-stat-value">${escapeHtml(formatINR(toPay, { signed: false }))}</p>
          </article>
          ${
            ownerOnly
              ? `<article class="bookings-overview-stat owner-only">
                   <p class="team-kicker">Margin</p>
                   <p class="bookings-overview-stat-value">${escapeHtml(formatINR(margin, { signed: true }))}</p>
                 </article>`
              : ""
          }
        </div>`;
    } else {
      moneyHtml = `<p class="bookings-ops-empty">Finance details need Finance permission (Owner or Admin).</p>`;
    }

    const departCopy =
      Number.isFinite(days) && days >= 0
        ? days === 0
          ? "Departs today"
          : `Departs in ${days} day${days === 1 ? "" : "s"}`
        : "";
    const travellerChips = travellers.length
      ? travellers
          .slice(0, 5)
          .map((t) => {
            const issues = travellerIssueList(t, booking).length;
            return `<span class="tag-chip ${issues ? "tag-finance" : "tag-support"}">${escapeHtml(
              t.name || t.legalName || "Traveller"
            )}${t.lead ? " · Lead" : ""}${issues ? ` · ${issues}` : ""}</span>`;
          })
          .join("")
      : "";

    el.innerHTML = `
      <div class="bookings-overview-hero-row">
        <article class="bookings-card bookings-overview-card bookings-overview-next">
          <header class="bookings-card-head">
            <div>
              <p class="team-kicker">Next action</p>
              <h2 class="bookings-card-title">${escapeHtml(na.title || "No urgent action")}</h2>
              <p class="bookings-card-sub">${escapeHtml(
                [na.body, departCopy].filter(Boolean).join(" · ") || "Nothing blocking right now."
              )}</p>
            </div>
          </header>
          ${
            na.kind === "task" && na.cta
              ? `<div class="bookings-overview-card-foot"><button type="button" class="btn btn-primary btn-sm" data-cta-target="${escapeHtml(
                  na.ctaTarget || "overview"
                )}">${escapeHtml(na.cta)}</button></div>`
              : ""
          }
        </article>
        <article class="bookings-card bookings-overview-card" id="booking-overview-readiness">
          ${bookingLifecyclePanelHtml(booking)}
        </article>
      </div>

      <div class="bookings-overview-split">
        <article class="bookings-card bookings-overview-card">
          <header class="bookings-card-head bookings-card-head--split">
            <div>
              <div class="card-title-row">
                <h2 class="bookings-card-title">Services</h2>
                <span class="team-count-pill">${services.filter((s) => s.confirmation === "confirmed").length}/${
                  services.length
                }</span>
              </div>
              <p class="bookings-card-sub">Supplier confirmations for this itinerary.</p>
            </div>
            <button type="button" class="btn btn-outline btn-sm" data-cta-target="services">Open</button>
          </header>
          ${servicesHtml}
        </article>

        <article class="bookings-card bookings-overview-card">
          <header class="bookings-card-head bookings-card-head--split">
            <div>
              <h2 class="bookings-card-title">Money</h2>
              <p class="bookings-card-sub">Commercial snapshot for this booking.</p>
            </div>
            ${
              canFinance
                ? `<button type="button" class="btn btn-outline btn-sm" data-cta-target="finance">Open</button>`
                : ""
            }
          </header>
          ${moneyHtml}
        </article>
      </div>

      <article class="bookings-card bookings-overview-card bookings-overview-travellers">
        <header class="bookings-card-head bookings-card-head--split">
          <div>
            <div class="card-title-row">
              <h2 class="bookings-card-title">Travellers</h2>
              <span class="team-count-pill">${escapeHtml(String(readiness.ready))}/${escapeHtml(
                String(readiness.total)
              )} ready</span>
            </div>
            <p class="bookings-card-sub">Lead · ${escapeHtml(lead?.legalName || lead?.name || "—")}</p>
          </div>
          <button type="button" class="btn btn-outline btn-sm" data-cta-target="travellers">Open</button>
        </header>
        ${
          travellerChips
            ? `<div class="bookings-overview-traveller-chips">${travellerChips}</div>`
            : `<p class="bookings-ops-empty">No travellers on this booking yet.</p>`
        }
      </article>

      <article class="bookings-card bookings-overview-card">
        <header class="bookings-card-head bookings-card-head--split">
          <div>
            <h2 class="bookings-card-title">Ops notes</h2>
            <p class="bookings-card-sub">Human notes only · system events stay in Activity.</p>
          </div>
          <button type="button" class="btn btn-outline btn-sm" data-add-note>Add note</button>
        </header>
        ${
          notes.length
            ? `<ul class="bookings-note-list">${notes
                .map(
                  (note) => `
              <li class="bookings-note-item">
                <p class="bookings-note-meta">${escapeHtml(note.author)} · ${escapeHtml(note.time)}</p>
                <p class="bookings-note-body">${escapeHtml(note.body)}</p>
              </li>`
                )
                .join("")}</ul>`
            : `<div class="empty-state bookings-ops-empty-wrap">
                <p class="empty-state-title">No ops notes yet</p>
                <p class="empty-state-desc">Add a short human note when something should stick with the booking.</p>
              </div>`
        }
      </article>`;

    el.querySelectorAll("[data-cta-target]").forEach((btn) => {
      btn.addEventListener("click", () => runBookingCtaTarget(btn.dataset.ctaTarget));
    });
    bindBookingLifecycleActions(el, booking);
    el.querySelector("[data-add-note]")?.addEventListener("click", () => {
      if (!booking.notesList) booking.notesList = [];
      booking.notesList.unshift({
        author: getBookingsViewingAs() === "Member" ? "Meera Iyer" : DEMO_OWNER.name,
        time: "Just now",
        body: "Followed up with customer on outstanding items.",
      });
      showToast("Note added");
      renderBookingOverview(booking);
    });
  }

  function renderBookingDetail(booking) {
    if (booking.phase !== "cancelled" && booking.id && booking.proposalVersion) {
      booking.confirmed = true;
    }
    const destinationEl = document.getElementById("booking-detail-destination");
    const title = document.getElementById("booking-detail-title");
    const meta = document.getElementById("booking-detail-meta");
    const status = document.getElementById("booking-detail-status");
    const attention = getBookingAttention(booking);
    const days = daysUntilTravel(booking);
    const departCopy =
      Number.isFinite(days) && days >= 0
        ? days === 0
          ? "Departs today"
          : `Departs in ${days} days`
        : "";

    if (destinationEl) {
      destinationEl.textContent = booking.destination || booking.tripLabel || "Trip";
    }
    if (title) title.textContent = booking.title;

    const facts = [
      booking.id,
      booking.queryId || null,
      booking.proposalVersion ? `Proposal v${String(booking.proposalVersion).replace(/^v/i, "")}` : null,
      formatListDates(booking.travelStart, booking.travelEnd),
      `${booking.pax || 0} pax`,
      bookingOwnerMetaFact(booking),
    ].filter(Boolean);
    if (meta) meta.textContent = facts.join(" · ");

    if (status) {
      const commercial = bookingStatusLabel(booking);
      const commercialTone =
        commercial === "Cancelled" ? "is-cancelled" : commercial === "Confirmed" ? "is-confirmed" : "is-draft";
      status.innerHTML = `
        <span class="booking-status-pill ${commercialTone}">${escapeHtml(commercial)}</span>
        <span class="booking-status-pill is-${escapeHtml(booking.phase)}">${escapeHtml(phaseLabel(booking.phase))}</span>
        <span class="booking-attention-pill is-${escapeHtml(attention)}">${escapeHtml(attentionLabel(attention))}</span>
        ${departCopy ? `<span class="bookings-detail-depart">${escapeHtml(departCopy)}</span>` : ""}`;
    }

    applyBookingDetailTabAccess(booking);
    renderBookingOverview(booking);
    renderBookingOpsTabs(booking);
    if (bookingsState.detailTab && !canAccessBookingTab(bookingsState.detailTab, booking)) {
      setBookingDetailTab(firstAllowedBookingTab(booking), { updateHash: true });
    }
  }

  function setBreadcrumb({ root, mid = null, current }) {
    if (breadcrumbRoot) breadcrumbRoot.textContent = root;
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = current;
    const showMid = !!mid;
    if (breadcrumbMid) {
      breadcrumbMid.hidden = !showMid;
      if (showMid) breadcrumbMid.textContent = mid;
    }
    if (breadcrumbSepMid) breadcrumbSepMid.hidden = !showMid;
  }

  function setBookingsListMode({ updateHash = true, push = false } = {}) {
    bookingsState.detailSlug = null;
    bookingsState.detailTab = "overview";
    bookingsState.commThreadId = null;
    bookingsState.commCompose = false;
    bookingsState.docId = null;
    if (bookingsListEl) bookingsListEl.hidden = false;
    if (bookingsDetailEl) bookingsDetailEl.hidden = true;
    setActiveNav("Bookings");
    setBreadcrumb({ root: "Operations", current: "Bookings" });
    document.title = "Paryatech — Bookings";
    renderBookingsList();
    if (updateHash) {
      const next = "#bookings";
      if (window.location.hash !== next) {
        if (push) history.pushState(null, "", next);
        else history.replaceState(null, "", next);
      }
    }
  }

  function scrollBookingDetailBodyToTop() {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  function setBookingDetailTab(tab, { updateHash = true, scrollTop = true } = {}) {
    const booking = bookingsState.detailSlug ? getBookingBySlug(bookingsState.detailSlug) : null;
    // Fulfilment tab removed — route old links to overview needs-action.
    if (tab === "fulfilment") tab = "overview";
    let key = BOOKING_DETAIL_TABS[tab] ? tab : "overview";
    if (booking) {
      applyBookingDetailTabAccess(booking);
      if (!canAccessBookingTab(key, booking)) {
        if (tab === "finance") showToast("Finance needs Finance permission…");
        key = firstAllowedBookingTab(booking, "overview");
      }
    }
    const tabChanged = bookingsState.detailTab !== key;
    bookingsState.detailTab = key;
    document.querySelectorAll("[data-booking-tab]").forEach((btn) => {
      const allowed = !booking || canAccessBookingTab(btn.dataset.bookingTab, booking);
      const active = allowed && btn.dataset.bookingTab === key;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
    });
    document.querySelectorAll("[data-booking-panel]").forEach((panel) => {
      const active = panel.dataset.bookingPanel === key;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    if (updateHash && bookingsState.detailSlug) {
      const next = key === "overview" ? `#bookings/${bookingsState.detailSlug}` : `#bookings/${bookingsState.detailSlug}/${key}`;
      if (window.location.hash !== next) history.replaceState(null, "", next);
    }
    if (scrollTop && tabChanged) scrollBookingDetailBodyToTop();
  }

  function bookingLifecycleMode(booking) {
    if (booking.phase === "cancelled" || booking.phase === "completed") return "reopen";
    if (!booking.confirmed) return "confirm-cancel";
    return booking.lifecycle?.mode || "reopen";
  }

  function pushBookingActivity(booking, body) {
    if (!booking.activity) booking.activity = [];
    booking.activity.unshift({ time: "Just now", body });
  }

  function getBookingActionItems(booking) {
    const c = booking.confirmations || {};
    const services = bookingServices(booking);
    const pendingVendors = services.filter((s) => s.confirmation !== "confirmed");
    const travellers = bookingTravellers(booking);
    const docs = bookingDocuments(booking);
    const requiredDocsOpen = docs.filter((d) => d.required !== false && !docStatusIsComplete(d.status));
    const docsMissing = requiredDocsOpen.length;
    const travellerNotReady = travellers.filter((t) => !travellerIsReady(t, booking)).length;
    const docsOpen = confirmationIsOpen("documents", c.documents || "missing") || docsMissing > 0;
    const voucherOpen = confirmationIsOpen("voucher", c.voucher || "pending");
    const canFinance = canViewBookingFinance();
    const supplierCopy = getBookingSupplierMoneyCopy(booking);
    const toCollect = Math.max(0, Number(booking.toCollect) || 0);
    const paymentOpen = canFinance && (toCollect > 0 || supplierCopy.tone === "is-open" || booking.paymentOverdue);

    const tvs = bookingVouchers(booking);
    const voucherBlocked = tvs.filter((v) => v.status === "blocked").length;
    const voucherReady = tvs.filter((v) => v.status === "ready").length;
    const voucherIssued = tvs.filter((v) => v.status === "issued").length;

    const items = [
      {
        id: "vendor",
        label: "Vendors",
        tab: "services",
        open: pendingVendors.length > 0 || confirmationIsOpen("supplier", c.supplier || "pending"),
        detail:
          pendingVendors.length > 0
            ? `${pendingVendors.length} vendor${pendingVendors.length === 1 ? "" : "s"} not confirmed · ${pendingVendors.map((s) => s.vendor).slice(0, 2).join(", ")}${pendingVendors.length > 2 ? "…" : ""}`
            : "All vendors confirmed",
        statusLabel: pendingVendors.length ? "Not confirmed" : "Done",
        chipLabel: pendingVendors.length ? `Vendors · ${pendingVendors.length}` : "Vendors",
        cta: "Open vendors",
      },
      {
        id: "travellers",
        label: "Travellers",
        tab: "travellers",
        open: travellerNotReady > 0,
        detail:
          travellerNotReady > 0
            ? `${travellerNotReady}/${travellers.length} travellers not ready`
            : "All travellers ready",
        statusLabel: travellerNotReady > 0 ? "Incomplete" : "Done",
        chipLabel: travellerNotReady ? `Travellers · ${travellerNotReady}` : "Travellers",
        cta: "Open travellers",
      },
      {
        id: "documents",
        label: "Documents",
        tab: "documents",
        open: docsOpen,
        detail: docsOpen
          ? docsMissing
            ? `${docsMissing} required document${docsMissing === 1 ? "" : "s"} still open`
            : "Documents still open"
          : "All required documents verified",
        statusLabel: docsOpen ? "Incomplete" : "Done",
        chipLabel: docsMissing ? `Documents · ${docsMissing}` : "Documents",
        cta: "Open documents",
      },
      {
        id: "vouchers",
        label: "Vouchers",
        tab: "vouchers",
        open: voucherOpen,
        detail: !voucherOpen
          ? "All traveller vouchers sent"
          : voucherBlocked
            ? `${voucherBlocked} blocked until vendor confirmed`
            : voucherReady
              ? `${voucherReady} ready to attach/generate`
              : voucherIssued
                ? `${voucherIssued} issued — send to traveller`
                : "Traveller vouchers still open",
        statusLabel: !voucherOpen ? "Done" : voucherBlocked ? "Blocked" : voucherReady ? "Ready" : voucherIssued ? "Issued" : "Open",
        chipLabel: voucherBlocked ? `Vouchers · ${voucherBlocked} blocked` : voucherIssued ? `Vouchers · ${voucherIssued}` : "Vouchers",
        cta: "Open vouchers",
      },
      {
        id: "payment",
        label: "Payment",
        tab: canFinance ? "finance" : "services",
        open: paymentOpen,
        detail: canFinance
          ? paymentOpen
            ? [toCollect > 0 ? `${formatINR(toCollect, { signed: false })} to collect` : null, supplierCopy.tone === "is-open" ? supplierCopy.title : null].filter(Boolean).join(" · ") || "Payment open"
            : "No open payment"
          : "Finance restricted — ask Owner/Admin",
        statusLabel: !canFinance ? "Restricted" : paymentOpen ? "Due" : "Done",
        chipLabel: "Payment",
        cta: canFinance ? "Open finance" : "View vendors",
        restricted: !canFinance,
      },
    ];

    return items;
  }

  function scrollBookingOverviewReadiness() {
    requestAnimationFrame(() => {
      document.getElementById("booking-overview-readiness")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function openBookingDetail(slug, { tab = "overview", updateHash = true, push = false, focusReadiness = false } = {}) {
    const booking = getBookingBySlug(slug);
    if (!booking) {
      setBookingsListMode({ updateHash: true });
      return;
    }
    if (!memberCanAccessBooking(booking)) {
      showToast("This booking isn’t assigned to you…");
      setBookingsListMode({ updateHash: true });
      return;
    }
    if (bookingsState.detailSlug !== slug) {
      bookingsState.commThreadId = null;
      bookingsState.commCompose = false;
      bookingsState.docId = null;
    }
    bookingsState.detailSlug = slug;
    if (bookingsListEl) bookingsListEl.hidden = true;
    if (bookingsDetailEl) {
      bookingsDetailEl.hidden = false;
      bookingsDetailEl.classList.remove("is-entering");
      void bookingsDetailEl.offsetWidth;
      bookingsDetailEl.classList.add("is-entering");
    }
    setActiveNav("Bookings");
    setBreadcrumb({ root: "Operations", mid: "Bookings", current: booking.title });
    document.title = `Paryatech — ${booking.title}`;
    const requestedTab = focusReadiness ? "overview" : tab;
    const allowedTab = firstAllowedBookingTab(booking, requestedTab);
    if (tab !== allowedTab && tab === "finance" && !focusReadiness) {
      showToast("Finance needs Finance permission…");
    }
    renderBookingDetail(booking);
    setBookingDetailTab(allowedTab, { updateHash: false, scrollTop: !focusReadiness });
    if (focusReadiness && allowedTab === "overview") {
      window.scrollTo({ top: 0, behavior: "auto" });
      scrollBookingOverviewReadiness();
    } else {
      scrollBookingDetailBodyToTop();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (updateHash) {
      const next = allowedTab === "overview" ? `#bookings/${slug}` : `#bookings/${slug}/${allowedTab}`;
      if (window.location.hash !== next) {
        if (push) history.pushState(null, "", next);
        else history.replaceState(null, "", next);
      }
    }
  }

  function parseBookingsHash() {
    const hash = (window.location.hash || "").replace(/^#/, "");
    if (!hash.startsWith("bookings")) return { mode: "list" };
    const parts = hash.split("/").filter(Boolean);
    // bookings | bookings/list | bookings/{slug} | bookings/{slug}/{tab}
    if (parts.length <= 1 || parts[1] === "list") return { mode: "list" };
    const slug = parts[1];
    if (!getBookingBySlug(slug)) return { mode: "list" };
    let rawTab = parts[2] === "fulfilment" ? "overview" : parts[2];
    const tab = rawTab && BOOKING_DETAIL_TABS[rawTab] ? rawTab : "overview";
    return { mode: "detail", slug, tab };
  }

  function applyBookingsRoute({ updateHash = false } = {}) {
    const route = parseBookingsHash();
    if (route.mode === "detail") {
      openBookingDetail(route.slug, { tab: route.tab, updateHash });
    } else {
      setBookingsListMode({ updateHash });
    }
  }

  function initBookingsModule() {
    breadcrumbMid?.addEventListener("click", () => {
      if (currentShell !== "bookings" || !bookingsState.detailSlug) return;
      setBookingsListMode({ updateHash: true, push: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    const bookingListTabs = {
      upcoming: true,
      travelling: true,
      completed: true,
      cancelled: true,
    };
    document.querySelectorAll("[data-bookings-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const routed = normalizeBookingsListTab(btn.dataset.bookingsTab);
        const next = routed.tab;
        const switchingArchive = bookingsListIsArchiveTab(next) !== bookingsListIsArchiveTab(bookingsState.tab);
        bookingsState.tab = next;
        bookingsState.page = 0;
        if (routed.issueFilter) bookingsState.issueFilter = routed.issueFilter;
        if (switchingArchive) {
          bookingsState.sort = bookingsListIsArchiveTab(next) ? "travel" : "priority";
          bookingsState.attentionFilter = "all";
          if (!routed.issueFilter) bookingsState.issueFilter = "all";
          bookingsState.ownerFilter = "all";
          bookingsState.departWindow = "all";
          bookingsState.destinationFilter = "all";
          bookingsState.sourceFilter = "all";
          bookingsState.archiveWindow = next === "travelling" ? "all" : "30";
        }
        renderBookingsList();
      });
    });

    document.getElementById("bookings-attention")?.addEventListener("change", (e) => {
      bookingsState.attentionFilter = e.target.value || "all";
      bookingsState.page = 0;
      renderBookingsList();
    });

    document.querySelectorAll("[data-bookings-scope]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.dataset.bookingsScope;
        if (next !== "mine" && next !== "unassigned" && next !== "all") return;
        if (getBookingsViewingAs() === "Member" && next === "all") return;
        bookingsState.scope = next;
        bookingsState.page = 0;
        syncBookingsScopeControls();
        renderBookingsList();
      });
    });

    const onScopeMemberChange = (e) => {
      bookingsState.scopeMember = e.target.value || "all";
      bookingsState.page = 0;
      syncBookingsScopeControls();
      renderBookingsList();
    };
    document.getElementById("bookings-scope-member")?.addEventListener("change", onScopeMemberChange);
    document.getElementById("bookings-archive-scope-member")?.addEventListener("change", onScopeMemberChange);

    document.getElementById("bookings-issue")?.addEventListener("change", (e) => {
      bookingsState.issueFilter = e.target.value || "all";
      bookingsState.page = 0;
      renderBookingsList();
    });

    const paymentsSearch = document.getElementById("payments-search");
    paymentsSearch?.addEventListener("input", () => {
      paymentsState.search = paymentsSearch.value;
      renderBookingsPaymentsTable();
    });
    document.getElementById("payments-filter-stage")?.addEventListener("change", (e) => {
      paymentsState.stage = e.target.value;
      renderBookingsPaymentsTable();
    });
    document.getElementById("payments-filter-type")?.addEventListener("change", (e) => {
      paymentsState.type = e.target.value;
      renderBookingsPaymentsTable();
    });
    document.getElementById("payments-filter-date")?.addEventListener("change", (e) => {
      paymentsState.date = e.target.value;
      renderBookingsPaymentsTable();
    });
    document.getElementById("payments-filter-method")?.addEventListener("change", (e) => {
      paymentsState.method = e.target.value;
      renderBookingsPaymentsTable();
    });
    document.getElementById("payments-clear-filters")?.addEventListener("click", () => {
      paymentsState.search = "";
      paymentsState.stage = "all";
      paymentsState.type = "all";
      paymentsState.date = "30";
      paymentsState.method = "all";
      if (paymentsSearch) paymentsSearch.value = "";
      const stage = document.getElementById("payments-filter-stage");
      const type = document.getElementById("payments-filter-type");
      const date = document.getElementById("payments-filter-date");
      const method = document.getElementById("payments-filter-method");
      if (stage) stage.value = "all";
      if (type) type.value = "all";
      if (date) date.value = "30";
      if (method) method.value = "all";
      const more = document.getElementById("payments-more-filters");
      if (more) more.open = false;
      renderBookingsPaymentsTable();
    });

    const search = document.getElementById("bookings-search");
    search?.addEventListener("input", () => {
      bookingsState.search = search.value;
      const archiveSearch = document.getElementById("bookings-archive-search");
      if (archiveSearch) archiveSearch.value = search.value;
      bookingsState.page = 0;
      renderBookingsList();
    });

    document.getElementById("bookings-clear")?.addEventListener("click", clearBookingsFilters);

    const sort = document.getElementById("bookings-sort");
    sort?.addEventListener("change", () => {
      bookingsState.sort = sort.value;
      bookingsState.page = 0;
      renderBookingsList();
    });

    const archiveSearch = document.getElementById("bookings-archive-search");
    archiveSearch?.addEventListener("input", () => {
      bookingsState.search = archiveSearch.value;
      if (search) search.value = archiveSearch.value;
      bookingsState.page = 0;
      renderBookingsList();
    });
    document.getElementById("bookings-archive-attention")?.addEventListener("change", (e) => {
      bookingsState.attentionFilter = e.target.value || "all";
      bookingsState.page = 0;
      renderBookingsList();
    });
    document.getElementById("bookings-archive-sort")?.addEventListener("change", (e) => {
      bookingsState.sort = e.target.value || "travel";
      bookingsState.page = 0;
      renderBookingsList();
    });
    document.getElementById("bookings-archive-window")?.addEventListener("change", (e) => {
      bookingsState.archiveWindow = e.target.value || "30";
      bookingsState.page = 0;
      renderBookingsList();
    });
    document.getElementById("bookings-archive-issue")?.addEventListener("change", (e) => {
      bookingsState.issueFilter = e.target.value || "all";
      bookingsState.page = 0;
      renderBookingsList();
    });

    const bindFacetChange = (opsId, archiveId, key) => {
      const apply = (e) => {
        bookingsState[key] = e.target.value || "all";
        bookingsState.page = 0;
        syncBookingsFacetControls();
        renderBookingsList();
      };
      document.getElementById(opsId)?.addEventListener("change", apply);
      document.getElementById(archiveId)?.addEventListener("change", apply);
    };
    bindFacetChange("bookings-owner", "bookings-archive-owner", "ownerFilter");
    bindFacetChange("bookings-depart", "bookings-archive-depart", "departWindow");
    bindFacetChange("bookings-destination", "bookings-archive-destination", "destinationFilter");
    bindFacetChange("bookings-source", "bookings-archive-source", "sourceFilter");

    document.getElementById("bookings-archive-clear")?.addEventListener("click", clearBookingsFilters);

    populateBookingsDestinationFilters();
    syncBookingsFacetControls();

    document.getElementById("bookings-prev")?.addEventListener("click", () => {
      if (bookingsState.page > 0) {
        bookingsState.page -= 1;
        renderBookingsList();
      }
    });
    document.getElementById("bookings-next")?.addEventListener("click", () => {
      bookingsState.page += 1;
      renderBookingsList();
    });

    document.querySelectorAll("[data-booking-tab]").forEach((btn) => {
      btn.addEventListener("click", () => setBookingDetailTab(btn.dataset.bookingTab));
    });

    applyBookingsScopeForRole(getBookingsViewingAs());
  }

  const MY_WORK_PERIOD_LABELS = {
    month: "This month",
    quarter: "This quarter",
    half: "Last 6 months",
    year: "This year",
  };

  const MY_WORK_ROLES = {
    sales: {
      identity: {
        name: "Neha Kapoor",
        initials: "NK",
        avatarClass: "avatar-pink",
        teamTag: "International",
        email: "neha@paryatech.in",
        desk: "Leisure · International",
        joined: "Joined 8 months ago",
        rank: "#3",
        rankDelta: "1",
        rankDeltaDir: "up",
      },
      summary: [
        { label: "Live Queries", value: "14", meta: "Current", icon: "assets/queries.svg" },
        { label: "Revenue", value: "₹6L", meta: "This month", icon: "assets/currency-rupee.svg" },
        { label: "CSAT", value: "4.7", meta: "Customer rating", icon: "assets/users.svg" },
        { label: "Bookings", value: "8", meta: "This month", icon: "assets/bookings.svg" },
      ],
      context: "6 owned Queries · Contributing to 4 other records · 7 open tasks",
      queues: [
        {
          type: "live-queries",
          title: "Live Queries",
          count: "14 active",
          items: [
            { id: "Q-1042", title: "Sharma Family · Bali", meta: "12 days · 4 pax", status: "Negotiation", statusClass: "is-nego", amount: "₹2.4L", action: "Opening Query Q-1042" },
            { id: "Q-1098", title: "Iyer Honeymoon · Maldives", meta: "8 days · 2 pax", status: "Proposal sent", statusClass: "is-proposal", amount: "₹3.1L", action: "Opening Query Q-1098" },
            { id: "Q-1077", title: "Desai Group · Europe", meta: "18 days · 10 pax", status: "New", statusClass: "is-new", amount: "₹8.6L", action: "Opening Query Q-1077" },
            { id: "Q-1102", title: "Khan Family · Dubai", meta: "6 days · 5 pax", status: "Quoted", statusClass: "is-quoted", amount: "₹1.9L", action: "Opening Query Q-1102" },
          ],
        },
        {
          type: "targets",
          title: "This quarter vs target",
          count: "This quarter",
          bars: [
            { label: "Revenue", value: "₹6.4L / ₹7.2L", pct: 89 },
            { label: "Bookings", value: "8 / 10", pct: 80 },
            { label: "Win rate", value: "29% / 35%", pct: 83 },
          ],
        },
      ],
      performance: [
        {
          label: "Confirmed Booking Value",
          icon: "assets/currency-rupee.svg",
          values: {
            month: ["₹6L", "8 confirmed bookings"],
            quarter: ["₹17.8L", "23 confirmed bookings"],
            half: ["₹34.2L", "47 confirmed bookings"],
            year: ["₹61.4L", "82 confirmed bookings"],
          },
        },
        {
          label: "Query Conversion",
          icon: "assets/nav-reports.svg",
          values: {
            month: ["29%", "8 won from 28 decided Queries"],
            quarter: ["31%", "23 won from 74 decided Queries"],
            half: ["30%", "47 won from 158 decided Queries"],
            year: ["32%", "82 won from 258 decided Queries"],
          },
        },
        {
          label: "First Response Time",
          icon: "assets/zap.svg",
          values: {
            month: ["12m", "Median for owned Queries"],
            quarter: ["13m", "Median for owned Queries"],
            half: ["14m", "Median for owned Queries"],
            year: ["15m", "Median for owned Queries"],
          },
        },
        {
          label: "Bookings Converted",
          icon: "assets/bookings.svg",
          values: {
            month: ["8", "From owned Queries"],
            quarter: ["23", "From owned Queries"],
            half: ["47", "From owned Queries"],
            year: ["82", "From owned Queries"],
          },
        },
      ],
      history: {
        totals: [
          { value: "₹51L", label: "Confirmed value" },
          { value: "40", label: "Bookings" },
          { value: "64", label: "Customers" },
        ],
        bests: [
          { label: "Best booking value month", value: "₹7.6L", period: "May", icon: "assets/currency-rupee.svg" },
          { label: "Highest Query conversion", value: "36%", period: "May", icon: "assets/nav-reports.svg" },
          { label: "Fastest first response", value: "21m", period: "Jun", icon: "assets/zap.svg" },
        ],
        attainment: [
          { period: "Q3 ’25", value: 100 },
          { period: "Q4 ’25", value: 103 },
          { period: "Q1 ’26", value: 102 },
          { period: "Q2 ’26", value: 102 },
        ],
      },
      goals: [
        { label: "Confirmed Booking Value", current: "₹17.8L", target: "₹21.6L", pct: 82, icon: "assets/currency-rupee.svg" },
        { label: "Bookings Converted", current: "23", target: "30", pct: 77, icon: "assets/bookings.svg" },
        { label: "Query Conversion", current: "31%", target: "35%", pct: 89, icon: "assets/nav-reports.svg" },
      ],
      targetHistory: {
        secondaryLabel: "Bookings",
        rows: [
          { period: "Q2 ’26", note: "Current quarter", current: "₹17.8L", target: "₹21.6L", pct: 82, secondary: "23 / 30", status: "In progress" },
          { period: "Q1 ’26", note: "Jan–Mar 2026", current: "₹22L", target: "₹21.6L", pct: 102, secondary: "31 / 30", status: "Exceeded" },
          { period: "Q4 ’25", note: "Oct–Dec 2025", current: "₹22.3L", target: "₹21.6L", pct: 103, secondary: "32 / 30", status: "Exceeded" },
          { period: "Q3 ’25", note: "Jul–Sep 2025", current: "₹21.6L", target: "₹21.6L", pct: 100, secondary: "30 / 30", status: "Met" },
        ],
      },
      activity: [
        { day: "Today · 6 Aug 2026", time: "11:42", entity: "Query", recordId: "Q-1042", summary: "Stage changed: Quoting → Negotiation", module: "Queries", action: "status_change", risk: "", daysAgo: 0 },
        { day: "Today · 6 Aug 2026", time: "10:18", entity: "Proposal", recordId: "PR-331", summary: "Revision sent", module: "Proposals", action: "message", risk: "", daysAgo: 0 },
        { day: "Today · 6 Aug 2026", time: "09:34", entity: "Task", recordId: "T-198", summary: "Completed", module: "Tasks", action: "complete", risk: "", daysAgo: 0 },
        { day: "Yesterday · 5 Aug 2026", time: "16:20", entity: "Booking", recordId: "BK-2207", summary: "Sales handover added", module: "Bookings", action: "status_change", risk: "", daysAgo: 1 },
      ],
    },
    operations: {
      identity: {
        name: "Sara Pinto",
        initials: "SP",
        avatarClass: "avatar-pink",
        teamTag: "Domestic",
        email: "sara@paryatech.in",
        desk: "Operations · Domestic",
        joined: "Joined 1 year ago",
        rank: "#5",
        rankDelta: "1",
        rankDeltaDir: "up",
      },
      summary: [
        { label: "Active Bookings", value: "8", meta: "Current", icon: "assets/bookings.svg" },
        { label: "Bookings at Risk", value: "2", meta: "Current", icon: "assets/warning.svg" },
        { label: "Tasks Due Today", value: "5", meta: "Current", icon: "assets/calendar.svg" },
        { label: "Supplier Confirmations Pending", value: "3", meta: "Current", icon: "assets/nav-vendors.svg" },
      ],
      context: "8 active Bookings · Contributing to 3 other records · 9 open tasks",
      queues: [
        {
          title: "Bookings at risk",
          count: "2 bookings",
          items: [
            { id: "BK-2214", title: "Mishra Family · Kerala", meta: "Hotel confirmation pending · Check-in in 3 days", due: "Escalate today", tone: "danger", action: "Opening Booking BK-2214" },
            { id: "BK-2198", title: "Jain Group · Goa", meta: "Airport transfer not confirmed", due: "Vendor reply overdue", tone: "danger", action: "Opening Booking BK-2198" },
          ],
        },
        {
          title: "Due today",
          count: "5 tasks",
          items: [
            { id: "T-311", title: "Issue final vouchers", meta: "Booking BK-2209 · 6 travellers", due: "Due by 14:00", tone: "warning", action: "Opening Task T-311" },
            { id: "T-314", title: "Confirm supplier balance", meta: "Booking BK-2212 · Kumar Family", due: "Due today", tone: "warning", action: "Opening Task T-314" },
            { id: "T-316", title: "Review travel documents", meta: "Booking BK-2205 · Assigned to you", due: "Due today", tone: "neutral", action: "Opening Task T-316" },
          ],
        },
        {
          title: "Supplier confirmations",
          count: "3 pending",
          items: [
            { id: "VND-08", title: "Coastal Cabs", meta: "Transfer confirmation · Booking BK-2198", due: "Waiting 5h", tone: "warning", action: "Opening Vendor VND-08" },
            { id: "VND-14", title: "Wayanad Retreat", meta: "Rooming list accepted · Final rates pending", due: "Follow up tomorrow", tone: "neutral", action: "Opening Vendor VND-14" },
          ],
        },
      ],
      performance: [
        {
          label: "Bookings Completed",
          icon: "assets/bookings.svg",
          values: { month: ["18", "17 completed on time"], quarter: ["51", "48 completed on time"], half: ["106", "99 completed on time"], year: ["198", "185 completed on time"] },
        },
        {
          label: "On-time Handovers",
          icon: "assets/zap.svg",
          values: { month: ["94%", "17 of 18 handovers"], quarter: ["92%", "47 of 51 handovers"], half: ["93%", "99 of 106 handovers"], year: ["93%", "185 of 198 handovers"] },
        },
        {
          label: "Supplier Confirmations",
          icon: "assets/nav-vendors.svg",
          values: { month: ["42", "Median 3h 18m"], quarter: ["119", "Median 3h 32m"], half: ["246", "Median 3h 45m"], year: ["464", "Median 3h 51m"] },
        },
        {
          label: "Task Resolution Time",
          icon: "assets/nav-tasks.svg",
          values: { month: ["6.2h", "Median assigned task"], quarter: ["6.6h", "Median assigned task"], half: ["6.8h", "Median assigned task"], year: ["7.1h", "Median assigned task"] },
        },
      ],
      history: {
        totals: [
          { value: "198", label: "Bookings completed" },
          { value: "185", label: "On-time handovers" },
          { value: "464", label: "Confirmations" },
        ],
        bests: [
          { label: "Most bookings completed", value: "24", period: "Jul", icon: "assets/bookings.svg" },
          { label: "Best on-time handover rate", value: "98%", period: "May", icon: "assets/nav-reports.svg" },
          { label: "Fastest supplier confirmation", value: "2.8h", period: "Jun", icon: "assets/zap.svg" },
        ],
        attainment: [
          { period: "Q3 ’25", value: 96 },
          { period: "Q4 ’25", value: 101 },
          { period: "Q1 ’26", value: 99 },
          { period: "Q2 ’26", value: 103 },
        ],
      },
      goals: [
        { label: "On-time Handovers", current: "92%", target: "95%", pct: 97, icon: "assets/nav-reports.svg" },
        { label: "Supplier Confirmation SLA", current: "89%", target: "93%", pct: 96, icon: "assets/nav-vendors.svg" },
        { label: "Bookings Completed", current: "51", target: "56", pct: 91, icon: "assets/bookings.svg" },
      ],
      targetHistory: {
        secondaryLabel: "On-time handovers",
        rows: [
          { period: "Q2 ’26", note: "Current quarter", current: "51", target: "56", pct: 91, secondary: "92% / 95%", status: "In progress" },
          { period: "Q1 ’26", note: "Jan–Mar 2026", current: "58", target: "56", pct: 104, secondary: "96% / 95%", status: "Exceeded" },
          { period: "Q4 ’25", note: "Oct–Dec 2025", current: "55", target: "56", pct: 98, secondary: "94% / 95%", status: "Below target" },
          { period: "Q3 ’25", note: "Jul–Sep 2025", current: "57", target: "56", pct: 102, secondary: "95% / 95%", status: "Met" },
        ],
      },
      activity: [
        { day: "Today · 6 Aug 2026", time: "12:08", entity: "Booking", recordId: "BK-2209", summary: "Vouchers issued", module: "Bookings", action: "complete", risk: "", daysAgo: 0 },
        { day: "Today · 6 Aug 2026", time: "11:26", entity: "Task", recordId: "T-309", summary: "Completed", module: "Tasks", action: "complete", risk: "", daysAgo: 0 },
        { day: "Today · 6 Aug 2026", time: "10:12", entity: "Vendor", recordId: "VND-14", summary: "Confirmation received", module: "Vendors", action: "status_change", risk: "", daysAgo: 0 },
        { day: "Yesterday · 5 Aug 2026", time: "17:05", entity: "Booking", recordId: "BK-2214", summary: "Risk flag added", module: "Bookings", action: "status_change", risk: "medium", daysAgo: 1 },
      ],
    },
    finance: {
      identity: {
        name: "Anita Verma",
        initials: "AV",
        avatarClass: "avatar-mint",
        teamTag: "Finance",
        email: "anita@paryatech.in",
        desk: "Finance · Agency-wide",
        joined: "Joined 10 months ago",
        rank: "#2",
        rankDelta: "1",
        rankDeltaDir: "up",
      },
      summary: [
        { label: "Collections Due", value: "₹4.8L", meta: "Current", icon: "assets/currency-rupee.svg" },
        { label: "Overdue Payments", value: "4", meta: "Current", icon: "assets/warning.svg" },
        { label: "Payables Awaiting Review", value: "7", meta: "Current", icon: "assets/nav-finance.svg" },
        { label: "Approvals Pending", value: "3", meta: "Current", icon: "assets/shield.svg" },
      ],
      context: "11 open finance tasks · 4 overdue collections · 3 approvals waiting",
      queues: [
        {
          title: "Overdue collections",
          count: "4 payments",
          items: [
            { id: "PAY-44", title: "Kapoor Family · Europe", meta: "Balance collection · ₹1.45L", due: "Overdue by 3 days", tone: "danger", action: "Opening Payment PAY-44" },
            { id: "PAY-51", title: "Shah Group · Dubai", meta: "Second instalment · ₹82,000", due: "Overdue by 1 day", tone: "danger", action: "Opening Payment PAY-51" },
          ],
        },
        {
          title: "Approvals pending",
          count: "3 approvals",
          items: [
            { id: "APR-18", title: "Supplier advance · Coastal Cabs", meta: "₹48,000 · Booking BK-2198", due: "Review today", tone: "warning", action: "Opening Approval APR-18" },
            { id: "APR-21", title: "Refund request · Query Q-1088", meta: "₹12,500 · Customer cancellation", due: "Due today", tone: "warning", action: "Opening Approval APR-21" },
          ],
        },
        {
          title: "Payables to review",
          count: "7 payables",
          items: [
            { id: "BILL-72", title: "Wayanad Retreat", meta: "Supplier invoice · ₹1.08L", due: "Match against booking", tone: "neutral", action: "Opening Payable BILL-72" },
            { id: "BILL-76", title: "Skyline Transfers", meta: "Supplier invoice · ₹36,400", due: "Tax details missing", tone: "warning", action: "Opening Payable BILL-76" },
          ],
        },
      ],
      performance: [
        {
          label: "Collections Recorded",
          icon: "assets/currency-rupee.svg",
          values: { month: ["₹28.4L", "64 customer payments"], quarter: ["₹79.2L", "181 customer payments"], half: ["₹1.54Cr", "356 customer payments"], year: ["₹2.98Cr", "691 customer payments"] },
        },
        {
          label: "Overdue Recovery",
          icon: "assets/nav-reports.svg",
          values: { month: ["91%", "Within 7 days"], quarter: ["89%", "Within 7 days"], half: ["90%", "Within 7 days"], year: ["88%", "Within 7 days"] },
        },
        {
          label: "Approval Time",
          icon: "assets/shield.svg",
          values: { month: ["3.1h", "Median review time"], quarter: ["3.4h", "Median review time"], half: ["3.6h", "Median review time"], year: ["3.8h", "Median review time"] },
        },
        {
          label: "Payables Cleared",
          icon: "assets/nav-finance.svg",
          values: { month: ["47", "96% before due date"], quarter: ["136", "95% before due date"], half: ["268", "94% before due date"], year: ["512", "94% before due date"] },
        },
      ],
      history: {
        totals: [
          { value: "₹2.98Cr", label: "Collections" },
          { value: "512", label: "Payables cleared" },
          { value: "691", label: "Payments recorded" },
        ],
        bests: [
          { label: "Best collections month", value: "₹38.4L", period: "Mar", icon: "assets/currency-rupee.svg" },
          { label: "Best on-time payable rate", value: "98%", period: "May", icon: "assets/nav-reports.svg" },
          { label: "Fastest approval time", value: "2.4h", period: "Jun", icon: "assets/zap.svg" },
        ],
        attainment: [
          { period: "Q3 ’25", value: 99 },
          { period: "Q4 ’25", value: 101 },
          { period: "Q1 ’26", value: 97 },
          { period: "Q2 ’26", value: 102 },
        ],
      },
      goals: [
        { label: "Overdue Recovery", current: "89%", target: "92%", pct: 97, icon: "assets/nav-reports.svg" },
        { label: "Approvals within 4h", current: "86%", target: "90%", pct: 96, icon: "assets/shield.svg" },
        { label: "Payables before Due Date", current: "95%", target: "96%", pct: 99, icon: "assets/nav-finance.svg" },
      ],
      targetHistory: {
        secondaryLabel: "Payables on time",
        rows: [
          { period: "Q2 ’26", note: "Current quarter", current: "89%", target: "92%", pct: 97, secondary: "95% / 96%", status: "In progress" },
          { period: "Q1 ’26", note: "Jan–Mar 2026", current: "94%", target: "92%", pct: 102, secondary: "97% / 96%", status: "Exceeded" },
          { period: "Q4 ’25", note: "Oct–Dec 2025", current: "90%", target: "92%", pct: 98, secondary: "94% / 96%", status: "Below target" },
          { period: "Q3 ’25", note: "Jul–Sep 2025", current: "93%", target: "92%", pct: 101, secondary: "96% / 96%", status: "Met" },
        ],
      },
      activity: [
        { day: "Today · 6 Aug 2026", time: "12:16", entity: "Payment", recordId: "PAY-44", summary: "Amount changed: ₹50,000 → ₹45,000", module: "Finance", action: "status_change", risk: "high", daysAgo: 0 },
        { day: "Today · 6 Aug 2026", time: "11:31", entity: "Approval", recordId: "APR-17", summary: "Approved", module: "Finance", action: "complete", risk: "", daysAgo: 0 },
        { day: "Today · 6 Aug 2026", time: "10:04", entity: "Payable", recordId: "BILL-69", summary: "Marked paid", module: "Finance", action: "complete", risk: "", daysAgo: 0 },
        { day: "Yesterday · 5 Aug 2026", time: "15:40", entity: "Payment", recordId: "PAY-48", summary: "Reminder sent", module: "Finance", action: "message", risk: "", daysAgo: 1 },
      ],
    },
    support: {
      identity: {
        name: "Priya Nair",
        initials: "PN",
        avatarClass: "avatar-mint",
        teamTag: "Support",
        email: "priya@paryatech.in",
        desk: "Support · Customer care",
        joined: "Joined 11 months ago",
        rank: "#4",
        rankDelta: "2",
        rankDeltaDir: "down",
      },
      summary: [
        { label: "Assigned Conversations", value: "12", meta: "Current", icon: "assets/nav-inbox.svg" },
        { label: "Overdue Cases", value: "3", meta: "Current", icon: "assets/warning.svg" },
        { label: "First Response Time", value: "6m", meta: "Current median", icon: "assets/zap.svg" },
        { label: "Unresolved Cases", value: "7", meta: "Current", icon: "assets/nav-support.svg" },
      ],
      context: "12 assigned conversations · 3 overdue cases · 4 follow-ups due today",
      queues: [
        {
          title: "Overdue cases",
          count: "3 cases",
          items: [
            { id: "CASE-88", title: "Traveller unable to download voucher", meta: "Booking BK-2201 · WhatsApp", due: "SLA overdue by 42 min", tone: "danger", action: "Opening Case CASE-88" },
            { id: "CASE-91", title: "Refund status requested", meta: "Query Q-1088 · Email", due: "Waiting 3h", tone: "danger", action: "Opening Case CASE-91" },
          ],
        },
        {
          title: "Assigned conversations",
          count: "12 open",
          items: [
            { id: "IN-502", title: "Mehta Family", meta: "WhatsApp · Hotel check-in question", due: "Unread · 4 min", tone: "info", action: "Opening conversation IN-502" },
            { id: "IN-498", title: "Rao Group", meta: "Email · Invoice copy requested", due: "Follow-up due today", tone: "warning", action: "Opening conversation IN-498" },
            { id: "IN-491", title: "Patel Group", meta: "WhatsApp · Driver contact requested", due: "Assigned to you", tone: "neutral", action: "Opening conversation IN-491" },
          ],
        },
        {
          title: "Contributing records",
          count: "5 records",
          items: [
            { id: "BK-2201", title: "Verma Family · Kerala", meta: "Support task · Voucher access", due: "Customer waiting", tone: "warning", action: "Opening Booking BK-2201" },
            { id: "Q-1088", title: "Nair Honeymoon · Bali", meta: "Support task · Refund status", due: "Finance response pending", tone: "neutral", action: "Opening Query Q-1088" },
          ],
        },
      ],
      performance: [
        {
          label: "Conversations Resolved",
          icon: "assets/nav-inbox.svg",
          values: { month: ["146", "91% without reassignment"], quarter: ["421", "90% without reassignment"], half: ["846", "90% without reassignment"], year: ["1,604", "89% without reassignment"] },
        },
        {
          label: "First Response Time",
          icon: "assets/zap.svg",
          values: { month: ["6m", "Median assigned conversation"], quarter: ["7m", "Median assigned conversation"], half: ["7m", "Median assigned conversation"], year: ["8m", "Median assigned conversation"] },
        },
        {
          label: "Resolution Time",
          icon: "assets/nav-support.svg",
          values: { month: ["2.8h", "Median resolved case"], quarter: ["3.0h", "Median resolved case"], half: ["3.1h", "Median resolved case"], year: ["3.2h", "Median resolved case"] },
        },
        {
          label: "Reopened Cases",
          icon: "assets/nav-reports.svg",
          values: { month: ["4.1%", "6 of 146 cases"], quarter: ["4.5%", "19 of 421 cases"], half: ["4.6%", "39 of 846 cases"], year: ["4.8%", "77 of 1,604 cases"] },
        },
      ],
      history: {
        totals: [
          { value: "1,604", label: "Conversations" },
          { value: "1,499", label: "Cases resolved" },
          { value: "77", label: "Reopened cases" },
        ],
        bests: [
          { label: "Fastest first response", value: "5m", period: "May", icon: "assets/zap.svg" },
          { label: "Fastest resolution time", value: "2.2h", period: "Jun", icon: "assets/nav-support.svg" },
          { label: "Lowest reopen rate", value: "3.2%", period: "Apr", icon: "assets/nav-reports.svg" },
        ],
        attainment: [
          { period: "Q3 ’25", value: 98 },
          { period: "Q4 ’25", value: 100 },
          { period: "Q1 ’26", value: 102 },
          { period: "Q2 ’26", value: 101 },
        ],
      },
      goals: [
        { label: "First Response under 10m", current: "93%", target: "95%", pct: 98, icon: "assets/zap.svg" },
        { label: "Resolution within SLA", current: "89%", target: "92%", pct: 97, icon: "assets/nav-support.svg" },
        { label: "Cases Resolved", current: "421", target: "450", pct: 94, icon: "assets/nav-inbox.svg" },
      ],
      targetHistory: {
        secondaryLabel: "Response within 10m",
        rows: [
          { period: "Q2 ’26", note: "Current quarter", current: "421", target: "450", pct: 94, secondary: "93% / 95%", status: "In progress" },
          { period: "Q1 ’26", note: "Jan–Mar 2026", current: "459", target: "450", pct: 102, secondary: "96% / 95%", status: "Exceeded" },
          { period: "Q4 ’25", note: "Oct–Dec 2025", current: "450", target: "450", pct: 100, secondary: "95% / 95%", status: "Met" },
          { period: "Q3 ’25", note: "Jul–Sep 2025", current: "441", target: "450", pct: 98, secondary: "94% / 95%", status: "Below target" },
        ],
      },
      activity: [
        { day: "Today · 6 Aug 2026", time: "12:03", entity: "Case", recordId: "CASE-84", summary: "Resolved", module: "Support", action: "complete", risk: "", daysAgo: 0 },
        { day: "Today · 6 Aug 2026", time: "11:18", entity: "Conversation", recordId: "IN-498", summary: "Replied", module: "Inbox", action: "message", risk: "", daysAgo: 0 },
        { day: "Today · 6 Aug 2026", time: "10:42", entity: "Case", recordId: "CASE-91", summary: "Reassigned: Support → Finance", module: "Support", action: "assignment", risk: "medium", daysAgo: 0 },
        { day: "Yesterday · 5 Aug 2026", time: "18:12", entity: "Task", recordId: "T-402", summary: "Completed", module: "Tasks", action: "complete", risk: "", daysAgo: 1 },
      ],
    },
  };

  /* ---------- Helpers ---------- */

  function getDemoCount(key) {
    const raw = localStorage.getItem(STORAGE[key]);
    const value = raw === null ? 0 : Number.parseInt(raw, 10);
    return Number.isFinite(value) ? value : 0;
  }

  function setDemoCount(key, value) {
    localStorage.setItem(STORAGE[key], String(Math.max(0, value)));
  }

  function incrementDemoCount(key) {
    setDemoCount(key, getDemoCount(key) + 1);
  }

  function hasDemoActivity() {
    return getDemoCount("customers") > 0 || getDemoCount("queries") > 0 || getDemoCount("bookings") > 0;
  }

  /* ---------- Workspace audit log ---------- */

  const AUDIT_MODULE_LABELS = {
    queries: "Queries",
    bookings: "Bookings",
    proposals: "Proposals",
    team: "Team",
    goals: "Goals",
    finance: "Finance",
    vendors: "Vendors",
    security: "Security",
  };

  const AUDIT_CURRENT_ACTOR = {
    name: "Aditi Rao",
    initials: "AR",
    avatarClass: "",
    type: "Member",
  };

  const AUDIT_DEFAULT_SOURCE = {
    channel: "Web",
    device: "Chrome 128 on Windows 11",
    ip: "103.22.18.44",
    location: "Mumbai, India (approximate)",
  };

  let auditEventSeq = 200;
  const auditRecordSequences = { INV: 9 };
  let auditEvents = [];
  let activeAuditId = null;
  let auditLastFocus = null;

  const auditDrawer = document.getElementById("audit-drawer");
  const auditBackdrop = document.getElementById("audit-backdrop");
  const auditCloseBtn = document.getElementById("audit-drawer-close");
  const auditDetailGrid = document.getElementById("audit-detail-grid");
  const auditRestoreBlock = document.getElementById("audit-restore-block");
  const auditRestoreCopy = document.getElementById("audit-restore-copy");
  const auditRestoreBtn = document.getElementById("audit-restore-btn");
  const auditTbody = document.getElementById("audit-tbody");
  const auditSearchInput = document.getElementById("audit-search");
  const auditFilterMember = document.getElementById("audit-filter-member");
  const auditFilterModule = document.getElementById("audit-filter-module");
  const auditFilterAction = document.getElementById("audit-filter-action");
  const auditFilterDate = document.getElementById("audit-filter-date");
  const auditFilterDeleted = document.getElementById("audit-filter-deleted");
  const auditSecurityPreset = document.getElementById("audit-security-preset");

  const INITIAL_AUDIT_EVENTS = [
    {
      id: "AE-1042",
      groupLabel: "Today · 6 Aug 2026",
      groupKey: "today",
      dayOffset: 0,
      time: "11:42",
      actor: { name: "Neha Kapoor", initials: "NK", avatarClass: "avatar-pink", type: "Member" },
      dotClass: "is-info",
      actionType: "status_change",
      module: "queries",
      risk: "medium",
      sensitive: false,
      entity: "Query",
      recordId: "Q-1042",
      security: false,
      deleted: false,
      restoreAvailable: false,
      eventTemplate: "field_change",
      fieldLabel: "Stage",
      previousValue: "Quoting",
      newValue: "Negotiation",
      relatedRecord: "Query Q-1042 · Sharma Family · Bali",
      reason: "",
      source: { channel: "Web", device: "Chrome 128 on macOS", ip: "49.36.12.88", location: "Mumbai, India (approximate)" },
    },
    {
      id: "AE-2207",
      groupLabel: "Today · 6 Aug 2026",
      groupKey: "today",
      dayOffset: 0,
      time: "10:18",
      actor: { name: "Vikram Singh", initials: "VS", avatarClass: "avatar-mint", type: "Member" },
      dotClass: "is-success",
      actionType: "status_change",
      module: "bookings",
      risk: "medium",
      sensitive: false,
      entity: "Booking",
      recordId: "BK-2207",
      security: false,
      deleted: false,
      restoreAvailable: false,
      eventTemplate: "field_change",
      fieldLabel: "Status",
      previousValue: "Draft",
      newValue: "Confirmed",
      relatedRecord: "Booking BK-2207 · Patel Group · Rajasthan",
      reason: "Customer deposit received",
      source: { channel: "Mobile", device: "Paryatech iOS app · iPhone 15", ip: "103.44.9.12", location: "Pune, India (approximate)" },
    },
    {
      id: "AE-INV-09",
      groupLabel: "Today · 6 Aug 2026",
      groupKey: "today",
      dayOffset: 0,
      time: "09:05",
      actor: AUDIT_CURRENT_ACTOR,
      dotClass: "is-success",
      actionType: "invite",
      module: "team",
      risk: "low",
      sensitive: false,
      entity: "Invitation",
      recordId: "INV-09",
      security: false,
      deleted: false,
      restoreAvailable: false,
      eventTemplate: "created",
      supporting: "for meera@paryatech.in · Role: Member",
      previousValue: "—",
      newValue: "Pending invitation · Member · Domestic",
      relatedRecord: "Invitation INV-09 · meera@paryatech.in",
      reason: "",
      source: AUDIT_DEFAULT_SOURCE,
    },
    {
      id: "AE-318",
      groupLabel: "Yesterday · 5 Aug 2026",
      groupKey: "yesterday",
      dayOffset: 1,
      time: "17:20",
      actor: { name: "Rohan Mehta", initials: "RM", avatarClass: "avatar-pink", type: "Member" },
      dotClass: "is-danger",
      actionType: "delete",
      module: "proposals",
      risk: "high",
      sensitive: true,
      entity: "Proposal",
      recordId: "PR-318",
      security: false,
      deleted: true,
      restoreAvailable: true,
      trashDaysRemaining: 30,
      eventTemplate: "field_change",
      fieldLabel: "Status",
      supporting: "Restore available for 30 days",
      previousValue: "Draft",
      newValue: "Trash",
      relatedRecord: "Proposal PR-318 · Kapoor Family · Europe",
      reason: "Superseded by revised itinerary",
      source: { channel: "Web", device: "Safari 17 on macOS", ip: "122.160.44.2", location: "Delhi, India (approximate)" },
    },
    {
      id: "AE-LOGIN-14",
      groupLabel: "Yesterday · 5 Aug 2026",
      groupKey: "yesterday",
      dayOffset: 1,
      time: "14:02",
      actor: { name: "Priya Nair", initials: "PN", avatarClass: "avatar-mint", type: "Member" },
      dotClass: "is-muted",
      actionType: "login",
      module: "security",
      risk: "low",
      sensitive: false,
      entity: "Member",
      recordId: "MB-18",
      security: true,
      deleted: false,
      restoreAvailable: false,
      eventTemplate: "action",
      actionLabel: "Signed in",
      previousValue: "—",
      newValue: "Active session",
      relatedRecord: "Member MB-18 · Priya Nair",
      reason: "",
      source: { channel: "Web", device: "Chrome 128 on Windows 11", ip: "103.88.4.19", location: "Kochi, India (approximate)" },
    },
  ];

  function nextAuditId() {
    auditEventSeq += 1;
    return `AE-${auditEventSeq}`;
  }

  function nextAuditRecordId(prefix) {
    auditRecordSequences[prefix] = (auditRecordSequences[prefix] || 0) + 1;
    return `${prefix}-${String(auditRecordSequences[prefix]).padStart(2, "0")}`;
  }

  function auditModuleClass(module) {
    return `audit-module-${module}`;
  }

  function formatAuditEventText(event) {
    const entityRef = `${event.entity} ${event.recordId}`;
    let text;

    if (event.eventTemplate === "field_change") {
      text = `${entityRef} · ${event.fieldLabel} changed: ${event.previousValue} → ${event.newValue}`;
    } else if (event.eventTemplate === "created") {
      return `${entityRef} · Created${event.supporting ? ` ${event.supporting}` : ""}`;
    } else {
      text = `${entityRef} · ${event.actionLabel}`;
    }

    return event.supporting ? `${text} · ${event.supporting}` : text;
  }

  function formatAuditEventCell(event) {
    const text = formatAuditEventText(event);
    const link = `<button type="button" class="audit-record-link" data-audit-open="${event.id}">${event.recordId}</button>`;
    return `<span class="audit-event-text">${text.replace(event.recordId, link)}</span>`;
  }

  function createAuditEvent(partial) {
    const now = new Date();
    const entity = partial.entity || "Record";
    const recordId = partial.recordId || "UNASSIGNED";
    const eventTemplate = partial.eventTemplate || "action";
    return {
      id: partial.id || nextAuditId(),
      groupLabel: partial.groupLabel || "Today · 6 Aug 2026",
      groupKey: partial.groupKey || "today",
      dayOffset: partial.dayOffset ?? 0,
      time: partial.time || now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }),
      actor: { type: "Member", ...(partial.actor || AUDIT_CURRENT_ACTOR) },
      dotClass: partial.dotClass || "is-info",
      actionType: partial.actionType || "status_change",
      module: partial.module || "team",
      risk: partial.risk || "low",
      sensitive: Boolean(partial.sensitive),
      entity,
      recordId,
      eventTemplate,
      fieldLabel: partial.fieldLabel || "Value",
      actionLabel: partial.actionLabel || "Updated",
      supporting: partial.supporting || "",
      security: Boolean(partial.security),
      deleted: Boolean(partial.deleted),
      restoreAvailable: Boolean(partial.restoreAvailable),
      trashDaysRemaining: partial.trashDaysRemaining ?? 0,
      previousValue: partial.previousValue ?? "—",
      newValue: partial.newValue ?? "—",
      relatedRecord: partial.relatedRecord || `${entity} ${recordId}`,
      reason: partial.reason || "",
      source: { ...AUDIT_DEFAULT_SOURCE, ...(partial.source || {}) },
      timezone: partial.timezone || "IST (UTC+05:30)",
      restoredFrom: partial.restoredFrom || null,
    };
  }

  function auditMatchesFilters(event) {
    const q = (auditSearchInput?.value || "").trim().toLowerCase();
    const member = auditFilterMember?.value || "all";
    const module = auditFilterModule?.value || "all";
    const action = auditFilterAction?.value || "all";
    const days = Number(auditFilterDate?.value || 7);
    const showDeleted = auditFilterDeleted?.checked;

    if (event.module === "security" && module !== "security") return false;
    if (!showDeleted && event.deleted) return false;
    if (member !== "all" && event.actor.name !== member) return false;
    if (module !== "all" && event.module !== module) return false;
    if (action !== "all" && event.actionType !== action) return false;
    if (event.dayOffset > days) return false;

    if (!q) return true;
    const haystack = [
      event.id,
      event.actor.name,
      formatAuditEventText(event),
      event.recordId,
      event.relatedRecord,
      event.previousValue,
      event.newValue,
      AUDIT_MODULE_LABELS[event.module],
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  }

  function renderAuditTable() {
    if (!auditTbody) return;
    auditTbody.innerHTML = "";
    let lastGroup = null;
    auditEvents.forEach((event) => {
      if (!auditMatchesFilters(event)) return;
      if (event.groupKey !== lastGroup) {
        const groupRow = document.createElement("tr");
        groupRow.className = "audit-group";
        groupRow.dataset.auditGroup = event.groupKey;
        groupRow.innerHTML = `<td colspan="4">${event.groupLabel}</td>`;
        auditTbody.appendChild(groupRow);
        lastGroup = event.groupKey;
      }
      const row = document.createElement("tr");
      row.className = "audit-row";
      row.tabIndex = 0;
      row.dataset.auditId = event.id;
      row.dataset.auditMember = event.actor.name;
      row.dataset.auditModule = event.module;
      row.dataset.auditAction = event.actionType;
      row.dataset.auditRecordId = event.recordId;
      row.dataset.auditSensitive = String(event.sensitive);
      row.dataset.auditSecurity = String(event.security);
      row.dataset.auditDeleted = String(event.deleted);
      row.dataset.auditDate = String(event.dayOffset);
      row.dataset.auditSearch = [
        event.id,
        event.actor.name,
        formatAuditEventText(event),
        event.recordId,
        event.relatedRecord,
      ]
        .join(" ")
        .toLowerCase();
      row.innerHTML = `<td><span class="roster-metric">${event.time}</span></td>
        <td>
          <div class="member-cell">
            <span class="avatar ${event.actor.avatarClass || ""}" aria-hidden="true">${event.actor.initials}</span>
            <div>
              <p class="member-name">${event.actor.name}</p>
              <p class="member-role">${event.actor.type || "Member"}</p>
            </div>
          </div>
        </td>
        <td class="audit-event-cell">${formatAuditEventCell(event)}</td>
        <td><span class="audit-module-badge ${auditModuleClass(event.module)}">${AUDIT_MODULE_LABELS[event.module]}</span></td>`;
      auditTbody.appendChild(row);
    });
  }

  function appendAuditEvent(partial) {
    const event = createAuditEvent(partial);
    auditEvents.unshift(event);
    renderAuditTable();
    return event;
  }

  function getAuditEvent(id) {
    return auditEvents.find((event) => event.id === id);
  }

  function renderAuditDrawer(event) {
    if (!auditDetailGrid || !event) return;
    const title = document.getElementById("audit-drawer-title");
    const kicker = document.getElementById("audit-drawer-kicker");
    if (title) title.textContent = event.id;
    if (kicker) kicker.textContent = AUDIT_MODULE_LABELS[event.module] || "Audit record";

    const reasonRow = event.reason
      ? `<div class="audit-detail-row"><dt>Reason</dt><dd>${event.reason}</dd></div>`
      : "";
    const restoreNote = event.restoredFrom
      ? `<div class="audit-detail-row"><dt>Restore context</dt><dd>Compensating event for ${event.restoredFrom}</dd></div>`
      : "";

    auditDetailGrid.innerHTML = `
      <div class="audit-detail-row"><dt>Actor</dt><dd>${event.actor.name}</dd></div>
      <div class="audit-detail-row"><dt>Actor type</dt><dd>${event.actor.type}</dd></div>
      <div class="audit-detail-row"><dt>Timestamp</dt><dd>${event.groupLabel} · ${event.time} · ${event.timezone}</dd></div>
      <div class="audit-detail-row"><dt>Module</dt><dd><span class="audit-module-badge ${auditModuleClass(event.module)}">${AUDIT_MODULE_LABELS[event.module]}</span></dd></div>
      <div class="audit-detail-row"><dt>Related record</dt><dd>${event.relatedRecord}</dd></div>
      <div class="audit-detail-row"><dt>Previous value</dt><dd>${event.previousValue}</dd></div>
      <div class="audit-detail-row"><dt>New value</dt><dd>${event.newValue}</dd></div>
      ${reasonRow}
      ${restoreNote}
      <div class="audit-detail-row"><dt>Browser / device</dt><dd>${event.source.channel} · ${event.source.device}</dd></div>
      <div class="audit-detail-row"><dt>IP address</dt><dd>${event.source.ip}</dd></div>
      <div class="audit-detail-row"><dt>Approximate IP location</dt><dd>${event.source.location}</dd></div>`;

    if (auditRestoreBlock && auditRestoreCopy && auditRestoreBtn) {
      const alreadyRestored = auditEvents.some((candidate) => candidate.restoredFrom === event.id);
      const canRestore = event.restoreAvailable && event.deleted && !alreadyRestored;
      auditRestoreBlock.hidden = !canRestore;
      if (canRestore) {
        auditRestoreCopy.textContent = `Proposal ${event.recordId} is in Trash and can be restored for ${event.trashDaysRemaining || 30} days.`;
        auditRestoreBtn.dataset.restoreAuditId = event.id;
      } else {
        delete auditRestoreBtn.dataset.restoreAuditId;
      }
    }
  }

  function openAuditDrawer(id) {
    const event = getAuditEvent(id);
    if (!event || !auditDrawer || !auditBackdrop) return;
    closeAssignDrawer();
    closeOnboardingDrawer();
    closeNotif();
    activeAuditId = id;
    auditLastFocus = document.activeElement;
    renderAuditDrawer(event);
    auditDrawer.hidden = false;
    auditBackdrop.hidden = false;
    document.body.style.overflow = "hidden";
    auditCloseBtn?.focus();
  }

  function closeAuditDrawer() {
    if (!auditDrawer || auditDrawer.hidden) return;
    auditDrawer.hidden = true;
    if (auditBackdrop) auditBackdrop.hidden = true;
    document.body.style.overflow = "";
    activeAuditId = null;
    if (auditLastFocus && typeof auditLastFocus.focus === "function") auditLastFocus.focus();
  }

  function restoreDeletedAuditRecord(id) {
    const event = getAuditEvent(id);
    const alreadyRestored = auditEvents.some((candidate) => candidate.restoredFrom === id);
    if (!event || !event.restoreAvailable || alreadyRestored) return;
    appendAuditEvent({
      dotClass: "is-success",
      actionType: "restore",
      module: "proposals",
      risk: "medium",
      sensitive: true,
      entity: event.entity,
      recordId: event.recordId,
      deleted: false,
      eventTemplate: "field_change",
      fieldLabel: "Status",
      previousValue: "Trash",
      newValue: "Draft",
      relatedRecord: event.relatedRecord,
      reason: "Restored from Workspace Audit Log",
      restoredFrom: event.id,
    });
    closeAuditDrawer();
    showToast(`Restored ${event.recordId} from Trash`);
  }

  auditEvents = INITIAL_AUDIT_EVENTS.map((event) => createAuditEvent(event));
  renderAuditTable();

  auditTbody?.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-audit-open]");
    if (opener) {
      e.preventDefault();
      e.stopPropagation();
      openAuditDrawer(opener.dataset.auditOpen);
      return;
    }
    const row = e.target.closest(".audit-row");
    if (row) openAuditDrawer(row.dataset.auditId);
  });

  auditTbody?.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const row = e.target.closest(".audit-row");
    if (!row) return;
    e.preventDefault();
    openAuditDrawer(row.dataset.auditId);
  });

  auditCloseBtn?.addEventListener("click", closeAuditDrawer);
  auditBackdrop?.addEventListener("click", closeAuditDrawer);
  auditRestoreBtn?.addEventListener("click", () => {
    const id = auditRestoreBtn.dataset.restoreAuditId;
    if (id) restoreDeletedAuditRecord(id);
  });

  [
    auditSearchInput,
    auditFilterMember,
    auditFilterModule,
    auditFilterAction,
    auditFilterDate,
  ].forEach((el) => {
    el?.addEventListener("input", renderAuditTable);
    el?.addEventListener("change", renderAuditTable);
  });
  auditFilterDeleted?.addEventListener("change", renderAuditTable);
  auditSecurityPreset?.addEventListener("click", () => {
    if (auditFilterModule) auditFilterModule.value = "security";
    renderAuditTable();
    document.getElementById("audit-more-filters")?.removeAttribute("open");
  });

  function getChecklistDone() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE.checklist) || "[]");
      if (!Array.isArray(saved)) return ["business"];
      return saved.length ? saved : ["business"];
    } catch {
      return ["business"];
    }
  }

  function saveChecklistDone(doneIds) {
    localStorage.setItem(STORAGE.checklist, JSON.stringify(doneIds));
  }

  function isChecklistDone(id) {
    return getChecklistDone().includes(id);
  }

  function completeChecklistItem(id) {
    const done = getChecklistDone();
    if (!done.includes(id)) {
      done.push(id);
      saveChecklistDone(done);
      renderChecklist();
      updateSetupProgress();
    }
  }

  function toggleChecklistItem(id) {
    const done = getChecklistDone();
    const index = done.indexOf(id);
    if (index >= 0) done.splice(index, 1);
    else done.push(id);
    saveChecklistDone(done);
    renderChecklist();
    updateSetupProgress();
  }

  function getViewFromSearchParams() {
    return new URLSearchParams(window.location.search).get("view");
  }

  function normalizeHomeView(param) {
    if (param === "new" || param === "new-user") return "new";
    if (param === "returning" || param === "returning-user") return "returning";
    return null;
  }

  function homeViewToParam(view) {
    return view === "new" ? "new-user" : "returning-user";
  }

  function resolveView() {
    return normalizeHomeView(getViewFromSearchParams()) || "returning";
  }

  function syncHomeModeUrl(view, { replace = true } = {}) {
    const url = new URL(window.location.href);
    url.searchParams.set("view", homeViewToParam(view));
    const hash = url.hash || "";
    if (hash.startsWith("#team") || hash.startsWith("#bookings") || hash.startsWith("#queries")) {
      url.hash = "";
    }
    const next = `${url.pathname}${url.search}${url.hash}`;
    if (replace) history.replaceState(null, "", next);
    else history.pushState(null, "", next);
  }

  function updateHomeModeUI(view) {
    const isNew = view === "new";
    document.querySelectorAll("[data-home-mode]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.homeMode === view);
    });
    if (currentShell === "home") {
      if (breadcrumbCurrent) {
        breadcrumbCurrent.textContent = isNew ? "Home · New user" : "Home · Returning";
      }
      document.title = isNew ? "Paryatech — New user" : "Paryatech — Returning user";
    }
  }

  function setHomeUserMode(mode, { syncUrl = true, replace = true } = {}) {
    const view = mode === "new" ? "new" : "returning";
    if (currentShell !== "home") {
      showView("home", { dashboardView: view, smooth: false, scrollTop: false, syncHomeUrl: syncUrl });
      return;
    }
    applyView(view);
    if (syncUrl) syncHomeModeUrl(view, { replace });
    updateHomeModeUI(view);
  }

  function applyView(view) {
    currentView = view === "new" ? "new" : "returning";
    const isNew = currentView === "new";
    if (currentShell === "home") {
      dashboardReturning.hidden = isNew;
      dashboardNew.hidden = !isNew;
      if (viewTeam) viewTeam.hidden = true;
      if (viewBookings) viewBookings.hidden = true;
      if (viewQueries) viewQueries.hidden = true;
      if (homeAs) homeAs.hidden = false;
      if (viewingAs) viewingAs.hidden = false;
      setActiveNav("Home");
      if (breadcrumbRoot) breadcrumbRoot.textContent = "Workspace";
      updateHomeModeUI(currentView);
      updateGreeting();
    }
    document.body.classList.toggle("is-new-user", isNew);
    if (isNew) {
      notifDot.classList.add("is-hidden");
      notifBadge.classList.add("is-hidden");
      notifBtn.setAttribute("aria-label", "Notifications, no unread");
    } else {
      updateUnreadUI();
    }
  }

  function getTeamTabFromHash() {
    const hash = (window.location.hash || "").replace(/^#/, "");
    if (!hash.startsWith("team")) return "overview";
    const parts = hash.split("/");
    const tab = parts[1] || "overview";
    return TEAM_TABS[tab] ? tab : "overview";
  }

  function updateTeamPageActions(tabKey) {
    const meta = TEAM_TABS[tabKey] || TEAM_TABS.overview;
    const role = viewTeam?.dataset.viewingAs || "Owner";
    const isMember = role === "Member";

    if (teamPageExport) {
      teamPageExport.hidden = !meta.export;
    }

    if (!teamPagePrimaryCta) return;

    const primary = meta.primary;
    const hidePrimary = !primary || (primary.ownerAdmin && isMember);
    teamPagePrimaryCta.hidden = hidePrimary;

    if (hidePrimary || !primary) {
      teamPagePrimaryCta.removeAttribute("data-team-cta");
      return;
    }

    teamPagePrimaryCta.dataset.teamCta = primary.action;
    const labelEl = teamPagePrimaryCta.querySelector("[data-cta-label]");
    if (labelEl) labelEl.textContent = primary.label;

    // Text labels that already include "+" skip the leading icon
    const skipIcon = primary.label.trim().startsWith("+");
    const existingIcon = teamPagePrimaryCta.querySelector("svg");
    if (skipIcon) {
      existingIcon?.remove();
    } else {
      const iconHtml = TEAM_CTA_ICONS[primary.action] || TEAM_CTA_ICONS.assign;
      if (existingIcon) {
        existingIcon.outerHTML = iconHtml;
      } else {
        teamPagePrimaryCta.insertAdjacentHTML("afterbegin", iconHtml);
      }
    }
  }

  function runTeamPrimaryCta(action) {
    if (action === "assign") {
      openAssignDrawer();
      return;
    }
    if (action === "set-targets") {
      if (typeof goalsState !== "undefined" && goalsState.locked) {
        showToast("Completed periods are locked", "error");
        return;
      }
      resetWizard();
      openModal("modal-set-targets");
      return;
    }
    if (action === "invite") {
      openModal("modal-invite-team");
      return;
    }
    if (action === "export-csv") {
      showToast("Exporting CSV…");
    }
  }

  function setTeamTab(tab, { updateHash = true } = {}) {
    let key = TEAM_TABS[tab] ? tab : "overview";
    if (viewTeam?.dataset.viewingAs === "Member" && key === "audit") {
      key = "overview";
    }
    const meta = TEAM_TABS[key];
    document.querySelectorAll("[data-team-tab]").forEach((btn) => {
      const active = btn.dataset.teamTab === key;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
      btn.setAttribute("tabindex", active ? "0" : "-1");
    });
    document.querySelectorAll("[data-team-panel]").forEach((panel) => {
      const active = panel.dataset.teamPanel === key;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    if (teamPageTitle) teamPageTitle.textContent = meta.title;
    if (teamPageSub) teamPageSub.textContent = meta.sub;
    updateTeamPageActions(key);
    if (updateHash) {
      const next = `#team/${key}`;
      if (window.location.hash !== next) {
        history.replaceState(null, "", next);
      }
    }
  }

  function setViewingAs(role) {
    const next = role === "Admin" || role === "Member" ? role : "Owner";
    if (viewTeam) viewTeam.dataset.viewingAs = next;
    if (viewBookings) viewBookings.dataset.viewingAs = next;
    if (viewQueries) viewQueries.dataset.viewingAs = next;
    if (dashboardReturning) dashboardReturning.dataset.viewingAs = next;
    if (dashboardNew) dashboardNew.dataset.viewingAs = next;
    applyBookingPersonaAccessFlags();
    applyBookingsScopeForRole(next);
    document.querySelectorAll(".viewing-as-btn[data-viewing-as]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.viewingAs === next);
    });
    if (currentShell === "team") {
      if (next === "Member") {
        const activeTab = document.querySelector("[data-team-tab].is-active")?.dataset.teamTab;
        if (activeTab === "audit") setTeamTab("overview");
        else updateTeamPageActions(activeTab || "overview");
      } else {
        const activeTab = document.querySelector("[data-team-tab].is-active")?.dataset.teamTab;
        updateTeamPageActions(activeTab || "overview");
      }
    }
    if (currentShell === "bookings") {
      if (bookingsState.detailSlug) {
        const booking = getBookingBySlug(bookingsState.detailSlug);
        if (booking && memberCanAccessBooking(booking)) renderBookingDetail(booking);
        else {
          showToast("This booking isn’t assigned to you…");
          setBookingsListMode({ updateHash: true });
        }
      } else {
        renderBookingsList();
      }
    }
    if (currentShell === "queries") {
      renderQueriesPipeline();
    }
  }

  function showView(shell, options = {}) {
    const next =
      shell === "team" ? "team" : shell === "bookings" ? "bookings" : shell === "queries" ? "queries" : "home";
    currentShell = next;

    if (next === "team") {
      dashboardReturning.hidden = true;
      dashboardNew.hidden = true;
      if (viewTeam) viewTeam.hidden = false;
      if (viewBookings) viewBookings.hidden = true;
      if (viewQueries) viewQueries.hidden = true;
      if (homeAs) homeAs.hidden = true;
      if (viewingAs) viewingAs.hidden = false;
      setActiveNav("Team");
      if (breadcrumbRoot) breadcrumbRoot.textContent = "Operations";
      document.title = "Paryatech — Team";
      const tab = options.tab || getTeamTabFromHash();
      setTeamTab(tab, { updateHash: options.updateHash !== false });
      window.scrollTo({ top: 0, behavior: options.smooth === false ? "auto" : "smooth" });
      return;
    }

    if (next === "bookings") {
      dashboardReturning.hidden = true;
      dashboardNew.hidden = true;
      if (viewTeam) viewTeam.hidden = true;
      if (viewBookings) viewBookings.hidden = false;
      if (viewQueries) viewQueries.hidden = true;
      if (homeAs) homeAs.hidden = true;
      if (viewingAs) viewingAs.hidden = false;
      setActiveNav("Bookings");
      if (breadcrumbRoot) breadcrumbRoot.textContent = "Operations";
      if (options.updateHash === false) {
        applyBookingsRoute({ updateHash: false });
      } else if (options.slug) {
        openBookingDetail(options.slug, { tab: options.tab || "overview", updateHash: true });
      } else if ((window.location.hash || "").startsWith("#bookings")) {
        applyBookingsRoute({ updateHash: options.updateHash !== false });
      } else {
        setBookingsListMode({ updateHash: options.updateHash !== false });
      }
      window.scrollTo({ top: 0, behavior: options.smooth === false ? "auto" : "smooth" });
      return;
    }

    if (next === "queries") {
      dashboardReturning.hidden = true;
      dashboardNew.hidden = true;
      if (viewTeam) viewTeam.hidden = true;
      if (viewBookings) viewBookings.hidden = true;
      if (viewQueries) viewQueries.hidden = false;
      if (homeAs) homeAs.hidden = true;
      if (viewingAs) viewingAs.hidden = false;
      setActiveNav("Queries");
      if (breadcrumbRoot) breadcrumbRoot.textContent = "Sales";
      document.title = "Paryatech — Queries";
      if (options.create) {
        queriesState.createOpen = true;
        syncQueriesCreateMode();
        resetQueriesCreateForm();
      } else {
        queriesState.createOpen = false;
        syncQueriesCreateMode();
      }
      renderQueriesPipeline();
      if (options.updateHash !== false) {
        const nextHash = options.create ? "#queries/new" : "#queries";
        if (window.location.hash !== nextHash) {
          history.replaceState(null, "", nextHash);
        }
      }
      window.scrollTo({ top: 0, behavior: options.smooth === false ? "auto" : "smooth" });
      return;
    }

    if (viewTeam) viewTeam.hidden = true;
    if (viewBookings) viewBookings.hidden = true;
    if (viewQueries) viewQueries.hidden = true;
    if (breadcrumbRoot) breadcrumbRoot.textContent = "Workspace";
    const homeView = options.dashboardView || resolveView();
    applyView(homeView);
    if (options.syncHomeUrl !== false) {
      syncHomeModeUrl(homeView, { replace: true });
    }
    const hash = window.location.hash || "";
    if (hash.startsWith("#team") || hash.startsWith("#bookings") || hash.startsWith("#queries")) {
      const url = new URL(window.location.href);
      url.hash = "";
      history.replaceState(null, "", `${url.pathname}${url.search}`);
    }
    if (options.scrollTop !== false) {
      window.scrollTo({ top: 0, behavior: options.smooth === false ? "auto" : "smooth" });
    }
  }

  function renderChecklist() {
    if (!checklistList) return;
    const done = getChecklistDone();
    checklistList.innerHTML = "";
    CHECKLIST_ITEMS.forEach((item) => {
      const li = document.createElement("li");
      const isDone = done.includes(item.id);
      li.className = `checklist-item${isDone ? " is-done" : ""}`;
      li.innerHTML = `
        <button type="button" class="checklist-btn" data-checklist-id="${item.id}" aria-pressed="${isDone}">
          <span class="checklist-check" aria-hidden="true">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>
          </span>
          <span class="checklist-label">${item.label}</span>
        </button>
      `;
      checklistList.appendChild(li);
    });
  }

  function updateSetupProgress() {
    const total = CHECKLIST_ITEMS.length;
    const doneCount = getChecklistDone().length;
    const remaining = Math.max(total - doneCount, 0);
    const pct = Math.round((doneCount / total) * 100);
    if (setupProgressMeta) {
      setupProgressMeta.textContent = `${doneCount} of ${total} done · ${remaining} remaining`;
    }
    if (setupProgressPct) setupProgressPct.textContent = `${pct}%`;
    if (setupProgressFill) setupProgressFill.style.width = `${pct}%`;
    if (setupProgressBar) setupProgressBar.setAttribute("aria-valuenow", String(pct));
  }

  function scrollToChecklist() {
    if (!setupChecklistCard) return;
    setupChecklistCard.scrollIntoView({ behavior: "smooth", block: "center" });
    setupChecklistCard.classList.add("is-highlighted");
    window.setTimeout(() => setupChecklistCard.classList.remove("is-highlighted"), 1600);
  }

  function initNewUserDashboard() {
    const done = getChecklistDone();
    if (!done.length) {
      saveChecklistDone(["business"]);
    }
    renderChecklist();
    updateSetupProgress();
  }

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
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = name;
    if (breadcrumbMid) breadcrumbMid.hidden = true;
    if (breadcrumbSepMid) breadcrumbSepMid.hidden = true;
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
    document
      .querySelectorAll("#dashboard-returning .home-panel, #dashboard-new .home-panel")
      .forEach((el) => {
      const title = el.querySelector(".home-panel-label")?.textContent?.replace(/\s+/g, " ").trim() || "Result";
      const meta =
        el.querySelector(".kpi-meta, .empty-state-desc")?.textContent?.trim() || "";
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
    const text = `Good ${part}, Vrushabh`;
    const weekday = now.toLocaleDateString("en-GB", { weekday: "long" }).toUpperCase();
    const day = now.getDate();
    const month = now.toLocaleDateString("en-GB", { month: "long" }).toUpperCase();
    const time = now
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase();
    const dateText = `${weekday} · ${day} ${month} · ${time}`;
    if (greeting) greeting.textContent = text;
    if (heroDate) heroDate.textContent = dateText;
    if (newGreeting) newGreeting.textContent = text;
    if (newHeroDate) newHeroDate.textContent = dateText;
  }

  updateGreeting();
  window.setInterval(() => {
    if (currentShell === "home") updateGreeting();
  }, 60000);
  initNewUserDashboard();
  initBookingsModule();
  initQueriesModule();
  const bootHash = window.location.hash || "";
  if (bootHash.startsWith("#team")) {
    showView("team", { smooth: false });
  } else if (bootHash.startsWith("#bookings")) {
    showView("bookings", { smooth: false });
  } else if (bootHash.startsWith("#queries")) {
    showView("queries", { smooth: false, create: bootHash.startsWith("#queries/new") });
  } else {
    showView("home", { smooth: false, scrollTop: false });
  }

  document.querySelectorAll("[data-home-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setHomeUserMode(btn.dataset.homeMode, { syncUrl: true, replace: false });
    });
  });

  window.addEventListener("popstate", () => {
    const hash = window.location.hash || "";
    if (hash.startsWith("#team")) {
      showView("team", { smooth: false, updateHash: false });
    } else if (hash.startsWith("#bookings")) {
      showView("bookings", { smooth: false, updateHash: false });
    } else if (hash.startsWith("#queries")) {
      showView("queries", {
        smooth: false,
        updateHash: false,
        create: hash.startsWith("#queries/new"),
      });
    } else {
      showView("home", { smooth: false, scrollTop: false, syncHomeUrl: false });
      updateHomeModeUI(resolveView());
    }
  });

  window.addEventListener("hashchange", () => {
    const hash = window.location.hash || "";
    if (hash.startsWith("#team") && currentShell === "team") {
      setTeamTab(getTeamTabFromHash(), { updateHash: false });
    } else if (hash.startsWith("#bookings") && currentShell === "bookings") {
      applyBookingsRoute({ updateHash: false });
    } else if (hash.startsWith("#bookings")) {
      showView("bookings", { smooth: false, updateHash: false });
    } else if (hash.startsWith("#team")) {
      showView("team", { smooth: false, updateHash: false });
    } else if (hash.startsWith("#queries")) {
      showView("queries", {
        smooth: false,
        updateHash: false,
        create: hash.startsWith("#queries/new"),
      });
    }
  });

  /* ---------- Demo navigation ---------- */

  document.querySelectorAll("[data-demo-nav]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const target = el.dataset.demoNav;
      if (el.tagName === "A") e.preventDefault();
      if (target === "customers") {
        setActiveNav("Customers");
        openModal("modal-new-customer");
        return;
      }
      if (target === "queries") {
        openQueriesCreate();
        return;
      }
      if (target === "vendors") {
        setActiveNav("Vendors");
        completeChecklistItem("vendors");
        showToast("Opened Vendors — add your first supplier");
      }
    });
  });

  checklistList?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-checklist-id]");
    if (!btn) return;
    toggleChecklistItem(btn.dataset.checklistId);
  });

  continueSetupBtn?.addEventListener("click", scrollToChecklist);
  viewChecklistBtn?.addEventListener("click", scrollToChecklist);

  /* ---------- Navigation ---------- */

  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const name = el.dataset.nav;
      if (!name) return;
      if (el.tagName === "A") e.preventDefault();
      setSidebarOpen(false);

      if (name === "Team") {
        showView("team");
        return;
      }

      if (name === "Bookings") {
        showView("bookings");
        return;
      }

      if (name === "Queries") {
        showView("queries");
        return;
      }

      if (name === "Home") {
        showView("home");
        applyDashboardFilter("");
        searchInput.value = "";
        return;
      }

      setActiveNav(name);
      showToast(`Opened ${name}`);
      if (name === "Inbox") {
        if (currentShell === "team" || currentShell === "bookings" || currentShell === "queries")
          showView("home", { scrollTop: false });
        applyDashboardFilter("");
        searchInput.value = "";
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });

  /* ---------- Team module ---------- */

  document.querySelectorAll("[data-team-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setTeamTab(btn.dataset.teamTab);
    });
  });

  teamPagePrimaryCta?.addEventListener("click", () => {
    runTeamPrimaryCta(teamPagePrimaryCta.dataset.teamCta || "assign");
  });

  document.querySelectorAll(".viewing-as-btn[data-viewing-as]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setViewingAs(btn.dataset.viewingAs);
    });
  });

  function normalizeHomeDensity(value) {
    return value === "advance" ? "advance" : "normal";
  }

  function setHomeDensity(density, { persist = true } = {}) {
    const next = normalizeHomeDensity(density);
    const isAdvance = next === "advance";
    if (dashboardReturning) dashboardReturning.dataset.homeDensity = next;
    if (dashboardNew) dashboardNew.dataset.homeDensity = next;
    document.querySelectorAll(".home-density-opt").forEach((btn) => {
      const active = btn.dataset.densityLabel === next;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    document.querySelectorAll(".home-advance").forEach((el) => {
      el.setAttribute("aria-hidden", isAdvance ? "false" : "true");
    });
    document.querySelectorAll(".home-panel-grid").forEach((el) => {
      el.setAttribute("aria-hidden", isAdvance ? "true" : "false");
    });
    if (persist) {
      try {
        localStorage.setItem(STORAGE.homeDensity, next);
      } catch (_) {
        /* ignore quota / private mode */
      }
    }
  }

  function initHomeDensity() {
    let saved = "normal";
    try {
      saved = localStorage.getItem(STORAGE.homeDensity) || "normal";
    } catch (_) {
      saved = "normal";
    }
    setHomeDensity(saved, { persist: false });
    document.querySelectorAll(".home-density-opt").forEach((btn) => {
      btn.addEventListener("click", () => setHomeDensity(btn.dataset.densityLabel));
    });
  }

  initHomeDensity();

  document.querySelectorAll(".home-notes-compose").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector(".home-notes-input");
      const text = input?.value?.trim();
      if (!text) return;
      showToast(form.dataset.toast || "Note saved");
      if (input) input.value = "";
    });
  });

  document.querySelectorAll(".period-pills").forEach((group) => {
    group.addEventListener("click", (e) => {
      const pill = e.target.closest(".period-pill");
      if (!pill || !group.contains(pill)) return;
      group.querySelectorAll(".period-pill").forEach((p) => p.classList.remove("is-active"));
      pill.classList.add("is-active");
    });
  });

  const ROSTER_PAGE_SIZE = 5;
  let rosterPage = 1;
  let rosterFilter = "all";

  function rosterRows() {
    return [...document.querySelectorAll("#roster-tbody .roster-row")];
  }

  function matchingRosterRows() {
    return rosterRows().filter((row) => {
      const owned = Number(row.dataset.ownedQueries) || 0;
      const openTasks = Number(row.dataset.openTasks) || 0;
      const winRate = Number(row.dataset.winRate) || 0;
      if (rosterFilter === "high-workload") return owned >= 10;
      if (rosterFilter === "open-tasks") return openTasks >= 3;
      if (rosterFilter === "top-win-rate") return winRate >= 34;
      return true;
    });
  }

  function renderRosterPagination() {
    const rows = matchingRosterRows();
    const total = rows.length;
    const totalPages = Math.max(1, Math.ceil(total / ROSTER_PAGE_SIZE));
    if (rosterPage > totalPages) rosterPage = totalPages;

    const start = total === 0 ? 0 : (rosterPage - 1) * ROSTER_PAGE_SIZE + 1;
    const end = Math.min(rosterPage * ROSTER_PAGE_SIZE, total);

    rosterRows().forEach((row) => {
      row.hidden = true;
    });
    rows.forEach((row, index) => {
      const pageIndex = Math.floor(index / ROSTER_PAGE_SIZE) + 1;
      row.hidden = pageIndex !== rosterPage;
    });

    const meta = document.getElementById("roster-pagination-meta");
    if (meta) {
      meta.textContent = total === 0 ? "No members" : `Showing ${start}–${end} of ${total}`;
    }

    const prev = document.getElementById("roster-page-prev");
    const next = document.getElementById("roster-page-next");
    if (prev) prev.disabled = rosterPage <= 1 || total === 0;
    if (next) next.disabled = rosterPage >= totalPages || total === 0;

    const pages = document.getElementById("roster-pagination-pages");
    if (pages) {
      pages.innerHTML = "";
      for (let page = 1; page <= totalPages; page += 1) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `table-page-btn${page === rosterPage ? " is-active" : ""}`;
        btn.textContent = String(page);
        btn.setAttribute("aria-label", `Page ${page}`);
        btn.setAttribute("aria-current", page === rosterPage ? "page" : "false");
        btn.addEventListener("click", () => {
          rosterPage = page;
          renderRosterPagination();
        });
        pages.appendChild(btn);
      }
    }
  }

  document.querySelectorAll(".roster-filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      rosterFilter = btn.dataset.rosterFilter || "all";
      document.querySelectorAll(".roster-filter").forEach((f) => f.classList.remove("is-active"));
      btn.classList.add("is-active");
      rosterPage = 1;
      renderRosterPagination();
    });
  });

  document.getElementById("roster-page-prev")?.addEventListener("click", () => {
    if (rosterPage <= 1) return;
    rosterPage -= 1;
    renderRosterPagination();
  });

  document.getElementById("roster-page-next")?.addEventListener("click", () => {
    const totalPages = Math.max(1, Math.ceil(matchingRosterRows().length / ROSTER_PAGE_SIZE));
    if (rosterPage >= totalPages) return;
    rosterPage += 1;
    renderRosterPagination();
  });

  renderRosterPagination();

  document.getElementById("roster-period")?.addEventListener("change", () => {
    showToast("Performance period updated");
  });

  /* ---------- Goals / Set targets ---------- */

  const SALES_MEMBERS = {
    aditi: { name: "Aditi Rao", weight: 6, current: 9.1, bookingsCurrent: 12 },
    vikram: { name: "Vikram Singh", weight: 11, current: 7.4, bookingsCurrent: 11 },
    neha: { name: "Neha Kapoor", weight: 14, current: 6.4, bookingsCurrent: 8 },
    rohan: { name: "Rohan Mehta", weight: 12, current: 6.8, bookingsCurrent: 9 },
    imran: { name: "Imran Sheikh", weight: 9, current: 5.0, bookingsCurrent: 7 },
  };

  let goalsState = {
    period: "quarter",
    locked: false,
    teamRevenue: 46,
    teamBookings: 70,
    teamWinrate: 35,
    achievedRevenue: 44,
    achievedBookings: 64,
    achievedWinrate: 33,
    allocations: {
      aditi: 9.5,
      vikram: 8.0,
      neha: 7.2,
      rohan: 7.6,
      imran: 5.5,
    },
    bookingTargets: {
      aditi: 14,
      vikram: 12,
      neha: 10,
      rohan: 11,
      imran: 8,
    },
  };

  let wizard = {
    step: 1,
    period: "quarter",
    distribute: "equal",
    selected: ["aditi", "vikram", "neha", "rohan", "imran"],
    allocations: {},
  };

  function formatL(n) {
    const v = Math.round(n * 10) / 10;
    return Number.isInteger(v) ? `₹${v}L` : `₹${v.toFixed(1)}L`;
  }

  function pct(current, target) {
    if (!target) return 0;
    return Math.min(100, Math.round((current / target) * 100));
  }

  function sumAllocations(map, ids) {
    return ids.reduce((sum, id) => sum + (Number(map[id]) || 0), 0);
  }

  function renderGoalsUI() {
    const revPct = pct(goalsState.achievedRevenue, goalsState.teamRevenue);
    const bookPct = pct(goalsState.achievedBookings, goalsState.teamBookings);
    const winPct = pct(goalsState.achievedWinrate, goalsState.teamWinrate);

    const revLabel = document.getElementById("goal-revenue-label");
    const bookLabel = document.getElementById("goal-bookings-label");
    const winLabel = document.getElementById("goal-winrate-label");
    if (revLabel) revLabel.textContent = formatL(goalsState.achievedRevenue);
    if (bookLabel) bookLabel.textContent = String(goalsState.achievedBookings);
    if (winLabel) winLabel.textContent = `${goalsState.achievedWinrate}%`;

    const revMeta = document.getElementById("goal-revenue-meta");
    const bookMeta = document.getElementById("goal-bookings-meta");
    const winMeta = document.getElementById("goal-winrate-meta");
    const revPctEl = document.getElementById("goal-revenue-pct");
    const bookPctEl = document.getElementById("goal-bookings-pct");
    const winPctEl = document.getElementById("goal-winrate-pct");
    if (revMeta) {
      revMeta.innerHTML = `of ${formatL(goalsState.teamRevenue)} target · <span id="goal-revenue-pct">${revPct}%</span> attained`;
    } else if (revPctEl) {
      revPctEl.textContent = `${revPct}%`;
    }
    if (bookMeta) {
      bookMeta.innerHTML = `of ${goalsState.teamBookings} target · <span id="goal-bookings-pct">${bookPct}%</span> attained`;
    } else if (bookPctEl) {
      bookPctEl.textContent = `${bookPct}%`;
    }
    if (winMeta) {
      winMeta.innerHTML = `of ${goalsState.teamWinrate}% target · Team benchmark · <span id="goal-winrate-pct">${winPct}%</span> attained`;
    } else if (winPctEl) {
      winPctEl.textContent = `${winPct}%`;
    }

    const revBar = document.getElementById("goal-revenue-bar");
    const bookBar = document.getElementById("goal-bookings-bar");
    const winBar = document.getElementById("goal-winrate-bar");
    const revTrack = document.getElementById("goal-revenue-track");
    const bookTrack = document.getElementById("goal-bookings-track");
    const winTrack = document.getElementById("goal-winrate-track");
    if (revBar) revBar.style.width = `${revPct}%`;
    if (bookBar) bookBar.style.width = `${bookPct}%`;
    if (winBar) winBar.style.width = `${winPct}%`;
    if (revTrack) revTrack.setAttribute("aria-valuenow", String(revPct));
    if (bookTrack) bookTrack.setAttribute("aria-valuenow", String(bookPct));
    if (winTrack) winTrack.setAttribute("aria-valuenow", String(winPct));

    document.querySelectorAll(".goals-member-row").forEach((row) => {
      const id = row.dataset.goalsMember;
      const member = SALES_MEMBERS[id];
      const target = goalsState.allocations[id];
      const bookTarget = goalsState.bookingTargets[id];
      if (!member || target == null) return;
      const progress = pct(member.current, target);
      const currentEl = row.querySelector(".goals-current");
      const targetEl = row.querySelector(".goals-target");
      const pctEl = row.querySelector(".goals-pct");
      const bar = row.querySelector(".attain-bar span");
      const bookingsEl = row.querySelector(".goals-bookings");
      if (currentEl) currentEl.textContent = formatL(member.current);
      if (targetEl) targetEl.textContent = formatL(target);
      if (pctEl) pctEl.textContent = `${progress}%`;
      if (bar) bar.style.width = `${progress}%`;
      if (bookingsEl) bookingsEl.textContent = `${member.bookingsCurrent} / ${bookTarget}`;
    });
  }

  function setGoalsPeriod(period) {
    goalsState.period = period;
    goalsState.locked = period === "last-quarter";
    viewTeam?.classList.toggle("is-goals-locked", goalsState.locked);
    document.querySelectorAll("[data-goals-period]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.goalsPeriod === period);
    });
    const title = document.getElementById("goals-table-title");
    if (title) {
      title.textContent =
        period === "month"
          ? "Individual targets · this month"
          : period === "last-quarter"
            ? "Individual targets · last quarter"
            : "Individual targets · this quarter";
    }
    if (goalsState.locked) showToast("Completed periods are locked");
  }

  document.querySelectorAll("[data-goals-period]").forEach((btn) => {
    btn.addEventListener("click", () => setGoalsPeriod(btn.dataset.goalsPeriod));
  });

  function getSelectedMemberIds() {
    return [...document.querySelectorAll("#targets-member-checks input:checked")].map(
      (input) => input.dataset.memberId
    );
  }

  function distributeEqual(total, ids) {
    if (!ids.length) return {};
    const base = Math.floor((total / ids.length) * 10) / 10;
    const map = {};
    let assigned = 0;
    ids.forEach((id, i) => {
      if (i === ids.length - 1) {
        map[id] = Math.round((total - assigned) * 10) / 10;
      } else {
        map[id] = base;
        assigned += base;
      }
    });
    return map;
  }

  function distributeHistory(total, ids) {
    const weightSum = ids.reduce((sum, id) => sum + (SALES_MEMBERS[id]?.weight || 1), 0);
    const map = {};
    let assigned = 0;
    ids.forEach((id, i) => {
      if (i === ids.length - 1) {
        map[id] = Math.round((total - assigned) * 10) / 10;
      } else {
        const share = Math.round(((SALES_MEMBERS[id].weight / weightSum) * total) * 10) / 10;
        map[id] = share;
        assigned += share;
      }
    });
    return map;
  }

  function applyDistribution() {
    const total = Number(document.getElementById("target-revenue")?.value) || 0;
    const ids = getSelectedMemberIds();
    wizard.selected = ids;
    if (wizard.distribute === "history") {
      wizard.allocations = distributeHistory(total, ids);
    } else if (wizard.distribute === "equal") {
      wizard.allocations = distributeEqual(total, ids);
    } else if (!Object.keys(wizard.allocations).length) {
      wizard.allocations = distributeEqual(total, ids);
    }
    ids.forEach((id) => {
      if (wizard.allocations[id] == null) wizard.allocations[id] = 0;
    });
    Object.keys(wizard.allocations).forEach((id) => {
      if (!ids.includes(id)) delete wizard.allocations[id];
    });
    renderAllocInputs();
  }

  function renderAllocInputs() {
    const list = document.getElementById("targets-alloc-list");
    const status = document.getElementById("targets-alloc-status");
    if (!list) return;
    const total = Number(document.getElementById("target-revenue")?.value) || 0;
    const ids = wizard.selected;
    list.innerHTML = ids
      .map((id) => {
        const value = wizard.allocations[id] ?? 0;
        const disabled = wizard.distribute !== "manual" ? "readonly" : "";
        return `<div class="targets-alloc-row">
          <span>${SALES_MEMBERS[id].name}</span>
          <input type="number" min="0" step="0.1" data-alloc-id="${id}" value="${value}" ${disabled} />
        </div>`;
      })
      .join("");

    list.querySelectorAll("input[data-alloc-id]").forEach((input) => {
      input.addEventListener("input", () => {
        wizard.allocations[input.dataset.allocId] = Number(input.value) || 0;
        updateAllocStatus();
      });
    });
    updateAllocStatus();

    function updateAllocStatus() {
      if (!status) return;
      const assigned = sumAllocations(wizard.allocations, ids);
      const delta = Math.round((total - assigned) * 10) / 10;
      if (Math.abs(delta) < 0.05) {
        status.textContent = `Allocated ${formatL(assigned)} of ${formatL(total)} · balanced`;
        status.className = "targets-alloc-status is-ok";
      } else if (delta > 0) {
        status.textContent = `${formatL(delta)} of the team target is still unassigned.`;
        status.className = "targets-alloc-status is-warn";
      } else {
        status.textContent = `Over-allocated by ${formatL(Math.abs(delta))}.`;
        status.className = "targets-alloc-status is-warn";
      }
    }
  }

  function renderReview() {
    const review = document.getElementById("targets-review");
    const status = document.getElementById("targets-review-status");
    const saveBtn = document.getElementById("targets-save");
    if (!review) return;
    const revenue = Number(document.getElementById("target-revenue")?.value) || 0;
    const bookings = Number(document.getElementById("target-bookings")?.value) || 0;
    const winrate = Number(document.getElementById("target-winrate")?.value) || 0;
    const assigned = sumAllocations(wizard.allocations, wizard.selected);
    const delta = Math.round((revenue - assigned) * 10) / 10;
    const periodLabel = wizard.period === "month" ? "August 2026" : "Q3 2026";

    review.innerHTML = `
      <div><dt>Period</dt><dd>${periodLabel}</dd></div>
      <div><dt>Team booking value</dt><dd>${formatL(revenue)}</dd></div>
      <div><dt>Team bookings</dt><dd>${bookings}</dd></div>
      <div><dt>Win-rate benchmark</dt><dd>${winrate}%</dd></div>
      ${wizard.selected
        .map(
          (id) =>
            `<div><dt>${SALES_MEMBERS[id].name}</dt><dd>${formatL(wizard.allocations[id] || 0)}</dd></div>`
        )
        .join("")}
      <div><dt>Sum of individual targets</dt><dd>${formatL(assigned)}</dd></div>
    `;

    const balanced = Math.abs(delta) < 0.05 && wizard.selected.length > 0;
    if (status) {
      if (balanced) {
        status.textContent = "Ready to save — individual targets match the team target.";
        status.className = "targets-alloc-status is-ok";
      } else if (delta > 0) {
        status.textContent = `${formatL(delta)} of the team target is still unassigned.`;
        status.className = "targets-alloc-status is-warn";
      } else {
        status.textContent = `Over-allocated by ${formatL(Math.abs(delta))}.`;
        status.className = "targets-alloc-status is-warn";
      }
    }
    if (saveBtn) saveBtn.disabled = !balanced;
  }

  function showWizardStep(step) {
    wizard.step = step;
    document.querySelectorAll("[data-step-indicator]").forEach((el) => {
      const n = Number(el.dataset.stepIndicator);
      el.classList.toggle("is-active", n === step);
      el.classList.toggle("is-done", n < step);
    });
    document.querySelectorAll("[data-targets-step]").forEach((panel) => {
      const n = Number(panel.dataset.targetsStep);
      panel.hidden = n !== step;
      panel.classList.toggle("is-active", n === step);
    });
    const back = document.getElementById("targets-back");
    const next = document.getElementById("targets-next");
    const save = document.getElementById("targets-save");
    if (back) back.hidden = step === 1;
    if (next) next.hidden = step === 5;
    if (save) save.hidden = step !== 5;
    if (step === 4) applyDistribution();
    if (step === 5) renderReview();
  }

  function resetWizard() {
    wizard = {
      step: 1,
      period: "quarter",
      distribute: "equal",
      selected: ["aditi", "vikram", "neha", "rohan", "imran"],
      allocations: {},
    };
    document.querySelectorAll("[data-target-period]").forEach((btn) => {
      const active = btn.dataset.targetPeriod === "quarter";
      btn.classList.toggle("is-selected", active);
      btn.setAttribute("aria-checked", String(active));
    });
    document.querySelectorAll("[data-distribute]").forEach((btn) => {
      const active = btn.dataset.distribute === "equal";
      btn.classList.toggle("is-selected", active);
      btn.setAttribute("aria-checked", String(active));
    });
    document.querySelectorAll("#targets-member-checks input").forEach((input) => {
      input.checked = true;
    });
    const revenue = document.getElementById("target-revenue");
    const bookings = document.getElementById("target-bookings");
    const winrate = document.getElementById("target-winrate");
    if (revenue) revenue.value = String(goalsState.teamRevenue);
    if (bookings) bookings.value = String(goalsState.teamBookings);
    if (winrate) winrate.value = String(goalsState.teamWinrate);
    showWizardStep(1);
  }

  document.querySelectorAll("[data-target-period]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-target-period]").forEach((b) => {
        b.classList.toggle("is-selected", b === btn);
        b.setAttribute("aria-checked", String(b === btn));
      });
      wizard.period = btn.dataset.targetPeriod;
    });
  });

  document.querySelectorAll("[data-distribute]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-distribute]").forEach((b) => {
        b.classList.toggle("is-selected", b === btn);
        b.setAttribute("aria-checked", String(b === btn));
      });
      wizard.distribute = btn.dataset.distribute;
      applyDistribution();
    });
  });

  document.getElementById("targets-next")?.addEventListener("click", () => {
    if (wizard.step === 3) {
      wizard.selected = getSelectedMemberIds();
      if (!wizard.selected.length) {
        showToast("Select at least one sales member", "error");
        return;
      }
    }
    if (wizard.step < 5) showWizardStep(wizard.step + 1);
  });

  document.getElementById("targets-back")?.addEventListener("click", () => {
    if (wizard.step > 1) showWizardStep(wizard.step - 1);
  });

  document.getElementById("modal-set-targets")?.addEventListener("click", (e) => {
    if (e.target?.id === "modal-set-targets") resetWizard();
  });

  function appendAuditTargetSave(previousTargets, revenue, bookings, winrate) {
    const periodLabel = wizard.period === "month" ? "Aug 2026" : "Q3 2026";
    appendAuditEvent({
      dotClass: "is-success",
      actionType: "target",
      module: "goals",
      risk: "medium",
      entity: "Goal",
      recordId: wizard.period === "month" ? "GT-2026-08" : "GT-2026-Q3",
      eventTemplate: "field_change",
      fieldLabel: "Targets",
      previousValue: `Booking value ${formatL(previousTargets.revenue)} · ${previousTargets.bookings} bookings · ${previousTargets.winrate}% win rate`,
      newValue: `Booking value ${formatL(revenue)} · ${bookings} bookings · ${winrate}% win rate`,
      relatedRecord: `Goals & targets · ${periodLabel}`,
      reason: "Quarterly target allocation saved",
    });
  }

  document.getElementById("targets-save")?.addEventListener("click", () => {
    const revenue = Number(document.getElementById("target-revenue")?.value) || 0;
    const bookings = Number(document.getElementById("target-bookings")?.value) || 0;
    const winrate = Number(document.getElementById("target-winrate")?.value) || 0;
    const assigned = sumAllocations(wizard.allocations, wizard.selected);
    if (Math.abs(revenue - assigned) >= 0.05) {
      showToast("Balance individual targets before saving", "error");
      return;
    }

    const previousTargets = {
      revenue: goalsState.teamRevenue,
      bookings: goalsState.teamBookings,
      winrate: goalsState.teamWinrate,
    };
    goalsState.teamRevenue = revenue;
    goalsState.teamBookings = bookings;
    goalsState.teamWinrate = winrate;
    goalsState.allocations = { ...wizard.allocations };
    const perBookings = Math.floor(bookings / wizard.selected.length);
    let bookAssigned = 0;
    wizard.selected.forEach((id, i) => {
      if (i === wizard.selected.length - 1) {
        goalsState.bookingTargets[id] = bookings - bookAssigned;
      } else {
        goalsState.bookingTargets[id] = perBookings;
        bookAssigned += perBookings;
      }
    });

    if (wizard.period === "month") setGoalsPeriod("month");
    else setGoalsPeriod("quarter");

    renderGoalsUI();
    appendAuditTargetSave(previousTargets, revenue, bookings, winrate);
    closeModal(document.getElementById("modal-set-targets"));
    showToast("Targets saved");
  });

  renderGoalsUI();

  /* ---------- Invitations & onboarding ---------- */

  const ONBOARDING_TRACKS = {
    sales: [
      { id: "profile", label: "Account and profile completed", auto: true },
      { id: "training", label: "Product training completed", manual: true },
      { id: "query", label: "First Query assigned", auto: true },
      { id: "proposal", label: "First proposal sent", auto: true },
      { id: "review", label: "Manager review completed", manual: true },
    ],
    operations: [
      { id: "profile", label: "Account and profile completed", auto: true },
      { id: "workflow", label: "Booking workflow training", manual: true },
      { id: "handover", label: "First booking handover received", auto: true },
      { id: "supplier", label: "First supplier confirmation completed", auto: true },
      { id: "voucher", label: "Voucher reviewed with manager", manual: true },
    ],
    finance: [
      { id: "profile", label: "Account and profile completed", auto: true },
      { id: "permissions", label: "Finance permissions reviewed", manual: true },
      { id: "payment", label: "First customer payment recorded", auto: true },
      { id: "payable", label: "First supplier payable reviewed", auto: true },
      { id: "approval", label: "Manager approval completed", manual: true },
    ],
  };

  const ONBOARDING_MEMBERS = {
    karan: {
      name: "Karan Shah",
      auditRecordId: "MB-21",
      initials: "KS",
      avatarClass: "avatar-pink",
      roleTeam: "Member · Domestic · Sales",
      joined: "3 weeks ago",
      manager: "Rohan Mehta",
      track: "sales",
      initialDone: 3,
    },
    sara: {
      name: "Sara Pinto",
      auditRecordId: "MB-22",
      initials: "SP",
      avatarClass: "avatar-pink",
      roleTeam: "Member · Domestic · Operations",
      joined: "2 weeks ago",
      manager: "Rohan Mehta",
      track: "operations",
      initialDone: 2,
    },
    anita: {
      name: "Anita Verma",
      auditRecordId: "MB-23",
      initials: "AV",
      avatarClass: "avatar-mint",
      roleTeam: "Member · Finance · Finance",
      joined: "10 days ago",
      manager: "Aditi Rao",
      track: "finance",
      initialDone: 1,
    },
  };

  const onboardingState = {};
  Object.entries(ONBOARDING_MEMBERS).forEach(([id, member]) => {
    onboardingState[id] = ONBOARDING_TRACKS[member.track].map((step, index) => ({
      ...step,
      done: index < member.initialDone,
    }));
  });

  const onboardingDrawer = document.getElementById("onboarding-drawer");
  const onboardingBackdrop = document.getElementById("onboarding-backdrop");
  const onboardingCloseBtn = document.getElementById("onboarding-drawer-close");
  let onboardingLastFocus = null;
  let activeOnboardingId = null;

  function computeOnboardingProgress(steps) {
    const total = steps.length;
    const done = steps.filter((step) => step.done).length;
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  function currentOnboardingStep(steps) {
    const pending = steps.find((step) => !step.done);
    return pending ? pending.label : "Ready for work";
  }

  function setInvitesTab(tab) {
    const key = tab === "onboarding" ? "onboarding" : "pending";
    document.querySelectorAll("[data-invites-tab]").forEach((btn) => {
      const active = btn.dataset.invitesTab === key;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
      btn.setAttribute("tabindex", active ? "0" : "-1");
    });
    document.querySelectorAll("[data-invites-panel]").forEach((panel) => {
      const active = panel.dataset.invitesPanel === key;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
  }

  function syncOnboardingRow(id) {
    const steps = onboardingState[id];
    if (!steps) return;
    const { pct } = computeOnboardingProgress(steps);
    const stepLabel = currentOnboardingStep(steps);
    const row = document.querySelector(`.onboarding-row[data-onboarding-id="${id}"]`);
    if (!row) return;
    const pctEl = row.querySelector(`[data-onboarding-pct="${id}"]`);
    const fill = row.querySelector(".onboarding-progress-fill");
    const stepEl = row.querySelector(`[data-onboarding-step="${id}"]`);
    if (pctEl) pctEl.textContent = `${pct}%`;
    if (fill) fill.style.width = `${pct}%`;
    if (stepEl) stepEl.textContent = stepLabel;
  }

  function renderOnboardingChecklist(id) {
    const checklist = document.getElementById("onboarding-checklist");
    const member = ONBOARDING_MEMBERS[id];
    const steps = onboardingState[id];
    if (!checklist || !member || !steps) return;

    checklist.innerHTML = steps
      .map((step, index) => {
        const source = step.auto ? "Platform activity" : "Manual completion";
        let action = `<span class="onboarding-check-source">Pending</span>`;
        if (step.done) {
          action = `<span class="invite-status-pill is-sent">Done</span>`;
        } else if (step.manual) {
          action = `<button type="button" class="btn btn-outline btn-xs" data-onboarding-complete="${id}" data-step-index="${index}">Mark complete</button>`;
        }
        return `<li class="onboarding-check-item${step.done ? " is-done" : ""}">
          <div class="onboarding-check-label">
            <span class="onboarding-check-title">${step.label}</span>
            <span class="onboarding-check-source">${source}</span>
          </div>
          <div class="onboarding-check-action">${action}</div>
        </li>`;
      })
      .join("");

    const { pct } = computeOnboardingProgress(steps);
    const stepLabel = currentOnboardingStep(steps);
    const title = document.getElementById("onboarding-drawer-title");
    const role = document.getElementById("onboarding-drawer-role");
    const meta = document.getElementById("onboarding-drawer-meta");
    const pctEl = document.getElementById("onboarding-drawer-pct");
    const stepEl = document.getElementById("onboarding-drawer-step");
    const avatar = document.getElementById("onboarding-drawer-avatar");
    if (title) title.textContent = member.name;
    if (role) role.textContent = member.roleTeam;
    if (meta) meta.textContent = `Joined ${member.joined} · Manager: ${member.manager}`;
    if (pctEl) pctEl.textContent = `${pct}%`;
    if (stepEl) stepEl.textContent = stepLabel;
    if (avatar) {
      avatar.textContent = member.initials;
      avatar.className = `avatar avatar-lg ${member.avatarClass}`;
    }
  }

  function openOnboardingDrawer(id) {
    if (!onboardingDrawer || !onboardingBackdrop || !ONBOARDING_MEMBERS[id]) return;
    closeAssignDrawer();
    closeAuditDrawer();
    closeNotif();
    activeOnboardingId = id;
    onboardingLastFocus = document.activeElement;
    renderOnboardingChecklist(id);
    onboardingDrawer.hidden = false;
    onboardingBackdrop.hidden = false;
    document.body.style.overflow = "hidden";
    onboardingCloseBtn?.focus();
  }

  function closeOnboardingDrawer() {
    if (!onboardingDrawer || onboardingDrawer.hidden) return;
    onboardingDrawer.hidden = true;
    if (onboardingBackdrop) onboardingBackdrop.hidden = true;
    document.body.style.overflow = "";
    activeOnboardingId = null;
    if (onboardingLastFocus && typeof onboardingLastFocus.focus === "function") onboardingLastFocus.focus();
  }

  document.querySelectorAll("[data-invites-tab]").forEach((btn) => {
    btn.addEventListener("click", () => setInvitesTab(btn.dataset.invitesTab || "pending"));
  });

  document.getElementById("onboarding-tbody")?.addEventListener("click", (e) => {
    const row = e.target.closest(".onboarding-row");
    if (!row) return;
    openOnboardingDrawer(row.dataset.onboardingId);
  });

  document.getElementById("onboarding-tbody")?.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const row = e.target.closest(".onboarding-row");
    if (!row) return;
    e.preventDefault();
    openOnboardingDrawer(row.dataset.onboardingId);
  });

  onboardingCloseBtn?.addEventListener("click", closeOnboardingDrawer);
  onboardingBackdrop?.addEventListener("click", closeOnboardingDrawer);

  document.getElementById("onboarding-checklist")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-onboarding-complete]");
    if (!btn) return;
    const id = btn.dataset.onboardingComplete;
    const index = Number(btn.dataset.stepIndex);
    const steps = onboardingState[id];
    const member = ONBOARDING_MEMBERS[id];
    if (!steps || !member || !steps[index] || steps[index].done) return;
    steps[index].done = true;
    syncOnboardingRow(id);
    if (activeOnboardingId === id) renderOnboardingChecklist(id);
    appendAuditEvent({
      dotClass: "is-success",
      actionType: "onboarding",
      module: "team",
      risk: "low",
      entity: "Member",
      recordId: member.auditRecordId,
      eventTemplate: "field_change",
      fieldLabel: "Onboarding step",
      previousValue: "In progress",
      newValue: steps[index].label,
      relatedRecord: `Member ${member.auditRecordId} · ${member.name}`,
      reason: "Manual completion",
    });
    showToast(`Marked “${steps[index].label}” complete`);

    const { pct } = computeOnboardingProgress(steps);
    if (pct === 100) {
      document.querySelector(`.onboarding-row[data-onboarding-id="${id}"]`)?.remove();
      closeOnboardingDrawer();
      appendAuditEvent({
        dotClass: "is-success",
        actionType: "onboarding",
        module: "team",
        risk: "low",
        entity: "Member",
        recordId: member.auditRecordId,
        eventTemplate: "field_change",
        fieldLabel: "Status",
        previousValue: "Onboarding",
        newValue: "Active",
        relatedRecord: `Member ${member.auditRecordId} · ${member.name}`,
      });
      showToast(`${member.name} is ready — moved to active team roster`);
    }
  });

  document.getElementById("invites-tbody")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-invite-action]");
    if (!btn) return;
    const row = btn.closest(".invite-row");
    if (!row) return;
    const email = row.dataset.inviteEmail || row.cells[0]?.textContent?.trim();
    const invitationId = row.dataset.inviteId || nextAuditRecordId("INV");
    row.dataset.inviteId = invitationId;
    const action = btn.dataset.inviteAction;
    if (action === "resend") {
      if (row.cells[3]) row.cells[3].textContent = "Just now";
      if (row.cells[4]) row.cells[4].innerHTML = `<span class="invite-status-pill is-sent">Sent</span>`;
      const actionsCell = row.querySelector(".invites-actions-cell");
      if (actionsCell && !actionsCell.querySelector('[data-invite-action="revoke"]')) {
        actionsCell.innerHTML = `
          <button type="button" class="btn btn-outline btn-xs" data-invite-action="resend">Resend</button>
          <button type="button" class="btn btn-outline btn-xs" data-invite-action="revoke">Revoke</button>`;
      }
      appendAuditEvent({
        dotClass: "is-info",
        actionType: "invite",
        module: "team",
        risk: "low",
        entity: "Invitation",
        recordId: invitationId,
        eventTemplate: "field_change",
        fieldLabel: "Status",
        previousValue: "Sent",
        newValue: "Resent",
        relatedRecord: `Invitation ${invitationId} · ${email}`,
      });
      showToast(`Invite resent to ${email}`);
      return;
    }
    if (action === "revoke") {
      if (row.cells[4]) row.cells[4].innerHTML = `<span class="invite-status-pill is-revoked">Revoked</span>`;
      const actionsCell = row.querySelector(".invites-actions-cell");
      if (actionsCell) {
        actionsCell.innerHTML = `<button type="button" class="btn btn-outline btn-xs" data-invite-action="resend">Resend</button>`;
      }
      appendAuditEvent({
        dotClass: "is-danger",
        actionType: "invite",
        module: "team",
        risk: "medium",
        sensitive: true,
        entity: "Invitation",
        recordId: invitationId,
        eventTemplate: "field_change",
        fieldLabel: "Status",
        previousValue: "Pending",
        newValue: "Revoked",
        relatedRecord: `Invitation ${invitationId} · ${email}`,
      });
      showToast(`Invite revoked for ${email}`);
    }
  });

  Object.keys(ONBOARDING_MEMBERS).forEach(syncOnboardingRow);

  /* ---------- Assign enquiries drawer ---------- */

  const assignDrawer = document.getElementById("assign-drawer");
  const assignBackdrop = document.getElementById("assign-backdrop");
  const assignOpenBtn = document.getElementById("btn-open-assign-drawer");
  const assignCloseBtn = document.getElementById("assign-drawer-close");
  const assignBackBtn = document.getElementById("assign-back");
  const assignNextBtn = document.getElementById("assign-next");
  const assignConfirmBtn = document.getElementById("assign-confirm");
  const assignWorkloadList = document.getElementById("assign-workload-list");
  const assignReview = document.getElementById("assign-review");
  let assignStep = 1;
  let assignLastFocus = null;

  function getAssignEnquiryChecks() {
    return [...document.querySelectorAll("#assign-enquiry-list input[data-enquiry]")];
  }

  function getAssignMemberChecks() {
    return [...document.querySelectorAll("#assign-member-list input[data-assign-member]")];
  }

  function selectedAssignEnquiries() {
    return getAssignEnquiryChecks()
      .filter((input) => input.checked)
      .map((input) => ({
        id: input.dataset.enquiry,
        label: input.closest("label")?.textContent.trim() || input.dataset.enquiry,
      }));
  }

  function selectedAssignMembers() {
    return getAssignMemberChecks()
      .filter((input) => input.checked)
      .map((input) => {
        const label = input.closest("label")?.textContent.trim() || "";
        const name = label.split("·")[0].trim();
        return {
          id: input.dataset.assignMember,
          name,
          live: Number(input.dataset.live) || 0,
          overdue: Number(input.dataset.overdue) || 0,
        };
      });
  }

  function renderAssignWorkload() {
    if (!assignWorkloadList) return;
    const members = selectedAssignMembers();
    if (!members.length) {
      assignWorkloadList.innerHTML = `<li>Select at least one team member.</li>`;
      return;
    }
    assignWorkloadList.innerHTML = members
      .map(
        (m) => `<li>
        <span>${m.name}</span>
        <span class="assign-workload-meta">${m.live} live · ${m.overdue} overdue</span>
      </li>`
      )
      .join("");
  }

  function renderAssignReview() {
    if (!assignReview) return;
    const enquiries = selectedAssignEnquiries();
    const members = selectedAssignMembers();
    assignReview.innerHTML = `
      <div>
        <dt>Enquiries</dt>
        <dd>${enquiries.map((e) => e.label).join(" · ") || "None"}</dd>
      </div>
      <div>
        <dt>Assignees</dt>
        <dd>${members.map((m) => m.name).join(" · ") || "None"}</dd>
      </div>
      <div>
        <dt>Workload snapshot</dt>
        <dd>${members.map((m) => `${m.name}: ${m.live} live / ${m.overdue} overdue`).join("; ") || "—"}</dd>
      </div>
    `;
  }

  function setAssignStep(step) {
    assignStep = Math.min(4, Math.max(1, step));
    document.querySelectorAll("[data-assign-step]").forEach((panel) => {
      const n = Number(panel.dataset.assignStep);
      const active = n === assignStep;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    document.querySelectorAll("[data-assign-step-indicator]").forEach((el) => {
      const n = Number(el.dataset.assignStepIndicator);
      el.classList.toggle("is-active", n === assignStep);
      el.classList.toggle("is-done", n < assignStep);
    });
    if (assignBackBtn) assignBackBtn.hidden = assignStep === 1;
    if (assignNextBtn) assignNextBtn.hidden = assignStep === 4;
    if (assignConfirmBtn) assignConfirmBtn.hidden = assignStep !== 4;
    if (assignStep === 3) renderAssignWorkload();
    if (assignStep === 4) renderAssignReview();
  }

  function openAssignDrawer() {
    if (!assignDrawer || !assignBackdrop) return;
    closeNotif();
    closeOnboardingDrawer();
    closeAuditDrawer();
    assignLastFocus = document.activeElement;
    getAssignEnquiryChecks().forEach((input) => {
      input.checked = true;
    });
    getAssignMemberChecks().forEach((input) => {
      input.checked = false;
    });
    setAssignStep(1);
    assignDrawer.hidden = false;
    assignBackdrop.hidden = false;
    document.body.style.overflow = "hidden";
    (assignCloseBtn || assignNextBtn)?.focus();
  }

  function closeAssignDrawer() {
    if (!assignDrawer || assignDrawer.hidden) return;
    assignDrawer.hidden = true;
    if (assignBackdrop) assignBackdrop.hidden = true;
    document.body.style.overflow = "";
    if (assignLastFocus && typeof assignLastFocus.focus === "function") assignLastFocus.focus();
  }

  function canAdvanceAssignStep() {
    if (assignStep === 1 && !selectedAssignEnquiries().length) {
      showToast("Select at least one enquiry", "error");
      return false;
    }
    if (assignStep === 2 && !selectedAssignMembers().length) {
      showToast("Select at least one team member", "error");
      return false;
    }
    return true;
  }

  assignOpenBtn?.addEventListener("click", openAssignDrawer);
  assignCloseBtn?.addEventListener("click", closeAssignDrawer);
  assignBackdrop?.addEventListener("click", closeAssignDrawer);
  assignBackBtn?.addEventListener("click", () => setAssignStep(assignStep - 1));
  assignNextBtn?.addEventListener("click", () => {
    if (!canAdvanceAssignStep()) return;
    setAssignStep(assignStep + 1);
  });
  assignConfirmBtn?.addEventListener("click", () => {
    if (!selectedAssignEnquiries().length || !selectedAssignMembers().length) {
      showToast("Select at least one enquiry and one member", "error");
      return;
    }
    const count = selectedAssignEnquiries().length;
    const people = selectedAssignMembers().length;
    const title = document.getElementById("team-assign-title");
    const meta = document.getElementById("team-assign-meta");
    if (title) title.textContent = "All enquiries assigned";
    if (meta) meta.textContent = "Nothing waiting right now.";
    closeAssignDrawer();
    showToast(`Assigned ${count} enquir${count === 1 ? "y" : "ies"} to ${people} member${people === 1 ? "" : "s"}`);
  });

  /* ---------- Roles & access ---------- */

  const rolesSaveBar = document.getElementById("roles-save-bar");
  const rolesSaveStatus = document.getElementById("roles-save-status");
  const rolesSaveBtn = document.getElementById("roles-save-btn");
  const roleChangeModal = document.getElementById("modal-role-change");
  const roleChangeCopy = document.getElementById("role-change-copy");
  const roleChangeCancel = document.getElementById("role-change-cancel");
  const roleChangeConfirm = document.getElementById("role-change-confirm");

  const ACCESS_MODULES = [
    { id: "queries", label: "Queries" },
    { id: "packages", label: "Packages" },
    { id: "marketing", label: "Marketing" },
    { id: "bookings", label: "Bookings" },
    { id: "customers", label: "Customers" },
    { id: "vendors", label: "Vendors" },
    { id: "finance", label: "Finance" },
    { id: "reports", label: "Reports" },
    { id: "automation", label: "Automation" },
    { id: "team", label: "Team" },
  ];

  function allModulesOn() {
    return Object.fromEntries(ACCESS_MODULES.map((m) => [m.id, true]));
  }

  function cloneAccessMap(map) {
    const next = {};
    Object.keys(map || {}).forEach((memberId) => {
      next[memberId] = { ...map[memberId] };
    });
    return next;
  }

  const DEFAULT_MEMBER_ACCESS = {
    aditi: allModulesOn(),
    vikram: {
      queries: true,
      packages: true,
      marketing: true,
      bookings: true,
      customers: true,
      vendors: true,
      finance: true,
      reports: true,
      automation: true,
      team: false,
    },
    neha: {
      queries: true,
      packages: true,
      marketing: false,
      bookings: true,
      customers: true,
      vendors: false,
      finance: false,
      reports: true,
      automation: false,
      team: false,
    },
    imran: {
      queries: true,
      packages: false,
      marketing: false,
      bookings: true,
      customers: true,
      vendors: false,
      finance: false,
      reports: true,
      automation: false,
      team: false,
    },
    rohan: {
      queries: true,
      packages: true,
      marketing: true,
      bookings: true,
      customers: true,
      vendors: true,
      finance: false,
      reports: true,
      automation: true,
      team: false,
    },
    sara: {
      queries: true,
      packages: false,
      marketing: false,
      bookings: true,
      customers: true,
      vendors: true,
      finance: false,
      reports: true,
      automation: false,
      team: false,
    },
    priya: {
      queries: true,
      packages: true,
      marketing: false,
      bookings: true,
      customers: true,
      vendors: true,
      finance: false,
      reports: true,
      automation: false,
      team: false,
    },
    karan: {
      queries: true,
      packages: false,
      marketing: false,
      bookings: true,
      customers: true,
      vendors: false,
      finance: false,
      reports: false,
      automation: false,
      team: false,
    },
  };

  const rolesState = {
    memberAccess: cloneAccessMap(DEFAULT_MEMBER_ACCESS),
    savedMemberAccess: cloneAccessMap(DEFAULT_MEMBER_ACCESS),
    memberRoles: {},
    savedMemberRoles: {},
    pendingRoleChange: null,
    openModulesFor: null,
  };

  document.querySelectorAll(".role-assign-select").forEach((select) => {
    const id = select.dataset.member;
    if (!id) return;
    rolesState.memberRoles[id] = select.value;
    rolesState.savedMemberRoles[id] = select.value;
    select.dataset.committed = select.value;
  });

  function countMemberAccess(memberId) {
    const access = rolesState.memberAccess[memberId] || {};
    const on = ACCESS_MODULES.filter((m) => access[m.id]).length;
    return { on, total: ACCESS_MODULES.length };
  }

  function updateAccessCount(memberId) {
    const el = document.querySelector(`[data-access-count="${memberId}"]`);
    const { on, total } = countMemberAccess(memberId);
    if (el) el.textContent = `${on}/${total}`;
    if (rolesState.openModulesFor === memberId) {
      const modalCount = document.querySelector("[data-modules-modal-count]");
      if (modalCount) modalCount.textContent = `${on}/${total}`;
    }
  }

  function isOwnerMember(memberId) {
    const row = document.querySelector(`.roles-member-row[data-member-id="${memberId}"]`);
    return (row?.dataset.memberRole || "").toLowerCase() === "owner";
  }

  function canEditMemberAccess() {
    const viewing = viewTeam?.dataset.viewingAs || "Owner";
    return viewing === "Owner" || viewing === "Admin";
  }

  const modulesModal = document.getElementById("modal-member-modules");
  const modulesModalTitle = document.getElementById("modules-modal-title");
  const modulesGrid = document.getElementById("roles-modules-grid");

  function renderModulesGrid(memberId) {
    if (!modulesGrid) return;
    const access = rolesState.memberAccess[memberId] || {};
    const locked = isOwnerMember(memberId) || !canEditMemberAccess();
    modulesGrid.innerHTML = ACCESS_MODULES.map((module) => {
      const checked = !!access[module.id];
      return `<li class="roles-modules-item${checked ? " is-on" : ""}">
        <span class="roles-modules-label">${module.label}</span>
        <label class="roles-switch">
          <input type="checkbox" data-access-member="${memberId}" data-access-module="${module.id}" ${checked ? "checked" : ""} ${locked ? "disabled" : ""} aria-label="${module.label} access for ${memberId}" />
          <span class="roles-switch-ui" aria-hidden="true"></span>
        </label>
      </li>`;
    }).join("");
  }

  function refreshAllAccessCounts() {
    Object.keys(rolesState.memberAccess).forEach((memberId) => updateAccessCount(memberId));
  }

  function closeModulesModalState() {
    rolesState.openModulesFor = null;
    document.querySelectorAll(".roles-modules-btn").forEach((btn) => {
      btn.setAttribute("aria-expanded", "false");
      btn.classList.remove("is-open");
    });
  }

  function openModulesModal(memberId) {
    const select = document.querySelector(`.role-assign-select[data-member="${memberId}"]`);
    const name = select?.dataset.memberName || memberId;
    rolesState.openModulesFor = memberId;
    if (modulesModalTitle) modulesModalTitle.textContent = `Module access · ${name}`;
    renderModulesGrid(memberId);
    updateAccessCount(memberId);
    document.querySelectorAll(".roles-modules-btn").forEach((btn) => {
      const active = btn.dataset.modulesFor === memberId;
      btn.setAttribute("aria-expanded", String(active));
      btn.classList.toggle("is-open", active);
    });
    openModal("modal-member-modules");
  }

  function rolesAreDirty() {
    const memberDirty = Object.keys(rolesState.memberRoles).some(
      (id) => rolesState.memberRoles[id] !== rolesState.savedMemberRoles[id]
    );
    const accessDirty = Object.keys(rolesState.memberAccess).some((memberId) =>
      ACCESS_MODULES.some(
        (module) =>
          !!rolesState.memberAccess[memberId]?.[module.id] !==
          !!rolesState.savedMemberAccess[memberId]?.[module.id]
      )
    );
    return memberDirty || accessDirty;
  }

  function updateRolesDirtyUI() {
    const dirty = rolesAreDirty();
    if (rolesSaveBar) rolesSaveBar.classList.toggle("is-dirty", dirty);
    if (rolesSaveStatus) {
      rolesSaveStatus.textContent = dirty ? "Unsaved changes" : "No unsaved changes";
    }
    if (rolesSaveBtn) rolesSaveBtn.disabled = !dirty;
  }

  function describeRolesChanges() {
    const before = [];
    const after = [];

    Object.keys(rolesState.memberRoles).forEach((id) => {
      const previousRole = rolesState.savedMemberRoles[id];
      const nextRole = rolesState.memberRoles[id];
      if (previousRole === nextRole) return;
      const select = document.querySelector(`.role-assign-select[data-member="${id}"]`);
      const name = select?.dataset.memberName || id;
      before.push(`${name}: ${previousRole}`);
      after.push(`${name}: ${nextRole}`);
    });

    Object.keys(rolesState.memberAccess).forEach((memberId) => {
      const select = document.querySelector(`.role-assign-select[data-member="${memberId}"]`);
      const name = select?.dataset.memberName || memberId;
      ACCESS_MODULES.forEach((module) => {
        const prev = !!rolesState.savedMemberAccess[memberId]?.[module.id];
        const next = !!rolesState.memberAccess[memberId]?.[module.id];
        if (prev === next) return;
        before.push(`${name} · ${module.label}: ${prev ? "On" : "Off"}`);
        after.push(`${name} · ${module.label}: ${next ? "On" : "Off"}`);
      });
    });

    return {
      count: before.length,
      before: before.join("; ") || "—",
      after: after.join("; ") || "—",
    };
  }

  function appendAuditRolesSave(changes) {
    appendAuditEvent({
      dotClass: "is-info",
      actionType: "permission",
      module: "team",
      risk: "high",
      sensitive: true,
      entity: "Access",
      recordId: "RBAC",
      eventTemplate: "field_change",
      fieldLabel: "Permissions",
      supporting: `${changes.count} ${changes.count === 1 ? "change" : "changes"}`,
      previousValue: changes.before,
      newValue: changes.after,
      relatedRecord: "Roles & access · Member module access",
      reason: "Role or module access change saved",
    });
  }

  document.getElementById("roles-assign-tbody")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".roles-modules-btn");
    if (!btn) return;
    e.stopPropagation();
    const memberId = btn.dataset.modulesFor;
    if (!memberId) return;
    openModulesModal(memberId);
  });

  modulesModal?.addEventListener("change", (e) => {
    const input = e.target.closest("input[data-access-module]");
    if (!input) return;
    const memberId = input.dataset.accessMember;
    const moduleId = input.dataset.accessModule;
    if (!memberId || !moduleId) return;
    if (isOwnerMember(memberId) || !canEditMemberAccess()) {
      input.checked = true;
      return;
    }
    if (!rolesState.memberAccess[memberId]) rolesState.memberAccess[memberId] = {};
    rolesState.memberAccess[memberId][moduleId] = input.checked;
    input.closest(".roles-modules-item")?.classList.toggle("is-on", input.checked);
    updateAccessCount(memberId);
    updateRolesDirtyUI();
  });

  modulesModal?.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => closeModulesModalState());
  });
  modulesModal?.addEventListener("click", (e) => {
    if (e.target === modulesModal) closeModulesModalState();
  });

  document.querySelectorAll(".role-assign-select").forEach((select) => {
    select.addEventListener("focus", () => {
      select.dataset.committed = select.value;
    });
    select.addEventListener("change", () => {
      if (viewTeam?.dataset.viewingAs === "Member") {
        select.value = select.dataset.committed || select.value;
        return;
      }
      const next = select.value;
      const prev = select.dataset.committed || rolesState.memberRoles[select.dataset.member] || select.value;
      if (next === prev) return;
      select.value = prev;
      rolesState.pendingRoleChange = {
        select,
        memberId: select.dataset.member,
        name: select.dataset.memberName || "Member",
        from: prev,
        to: next,
      };
      if (roleChangeCopy) {
        const name = rolesState.pendingRoleChange.name;
        const first = name.split(/\s+/)[0] || name;
        const pronoun = /neha/i.test(name) ? "her" : "their";
        roleChangeCopy.textContent = `Change ${first} from ${prev} to ${next}? This will update ${pronoun} access across the workspace.`;
      }
      openModal("modal-role-change");
    });
  });

  function cancelPendingRoleChange() {
    rolesState.pendingRoleChange = null;
    closeModal(roleChangeModal);
  }

  roleChangeCancel?.addEventListener("click", cancelPendingRoleChange);
  roleChangeModal?.querySelector("[data-close-modal]")?.addEventListener("click", cancelPendingRoleChange);
  roleChangeModal?.addEventListener("click", (e) => {
    if (e.target === roleChangeModal) rolesState.pendingRoleChange = null;
  });

  roleChangeConfirm?.addEventListener("click", () => {
    const pending = rolesState.pendingRoleChange;
    if (!pending) {
      closeModal(roleChangeModal);
      return;
    }
    pending.select.value = pending.to;
    pending.select.dataset.committed = pending.to;
    rolesState.memberRoles[pending.memberId] = pending.to;
    const row = document.querySelector(`.roles-member-row[data-member-id="${pending.memberId}"]`);
    if (row) row.dataset.memberRole = pending.to.toLowerCase();
    rolesState.pendingRoleChange = null;
    closeModal(roleChangeModal);
    if (rolesState.openModulesFor === pending.memberId) {
      renderModulesGrid(pending.memberId);
    }
    updateRolesDirtyUI();
  });

  rolesSaveBtn?.addEventListener("click", () => {
    if (!rolesAreDirty()) return;
    const auditChanges = describeRolesChanges();
    rolesState.savedMemberAccess = cloneAccessMap(rolesState.memberAccess);
    rolesState.savedMemberRoles = { ...rolesState.memberRoles };
    appendAuditRolesSave(auditChanges);
    updateRolesDirtyUI();
    showToast("Roles & access saved");
  });

  refreshAllAccessCounts();
  updateRolesDirtyUI();

  const rolesMemberSearch = document.getElementById("roles-member-search");
  const rolesMemberCount = document.getElementById("roles-member-count");
  let activeRolesFilter = "all";

  function filterRolesTables() {
    const query = (rolesMemberSearch?.value || "").trim().toLowerCase();
    let visible = 0;
    document.querySelectorAll(".roles-member-row").forEach((row) => {
      const hay = row.dataset.memberSearch || row.textContent || "";
      const searchMatch = !query || hay.toLowerCase().includes(query);
      const memberRole = (row.dataset.memberRole || "").toLowerCase();
      const roleMatch = activeRolesFilter === "all" || memberRole === activeRolesFilter;
      const match = searchMatch && roleMatch;
      row.hidden = !match;
      if (match) visible += 1;
    });

    if (rolesMemberCount) {
      const filtered = query || activeRolesFilter !== "all";
      rolesMemberCount.textContent = filtered ? `${visible} shown` : "8 members";
    }
  }

  rolesMemberSearch?.addEventListener("input", filterRolesTables);

  document.querySelectorAll("[data-roles-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeRolesFilter = btn.dataset.rolesFilter || "all";
      document.querySelectorAll("[data-roles-filter]").forEach((f) => f.classList.remove("is-active"));
      btn.classList.add("is-active");
      filterRolesTables();
    });
  });

  /* ---------- My Work ---------- */

  const myWorkSummary = document.getElementById("mywork-summary");
  const myWorkQueues = document.getElementById("mywork-queues");
  const myWorkPerformanceMetrics = document.getElementById("mywork-performance-metrics");
  const myWorkPerformanceHistory = document.getElementById("mywork-performance-history");
  const myWorkGoals = document.getElementById("mywork-goals");
  const myWorkTargetHistory = document.getElementById("mywork-target-history");
  const myWorkActivity = document.getElementById("mywork-activity");
  const myWorkActivitySearch = document.getElementById("mywork-activity-search");
  const myWorkActivityModule = document.getElementById("mywork-activity-module");
  const myWorkActivityDate = document.getElementById("mywork-activity-date");
  const myWorkActivityAction = document.getElementById("mywork-activity-action");
  const activeMyWorkRole = "sales";
  let activeMyWorkTab = "work";
  let activeMyWorkPeriod = "month";

  function renderMyWorkIdentity(roleData) {
    const identity = roleData.identity;
    const avatar = document.getElementById("mywork-avatar");
    const name = document.getElementById("mywork-member-name");
    const teamTag = document.getElementById("mywork-team-tag");
    const email = document.getElementById("mywork-email");
    const desk = document.getElementById("mywork-desk");
    const joined = document.getElementById("mywork-joined");
    const rank = document.getElementById("mywork-rank");
    const rankDelta = document.getElementById("mywork-rank-delta");
    if (avatar) {
      avatar.textContent = identity.initials;
      avatar.className = `avatar avatar-lg ${identity.avatarClass}`;
    }
    if (name) name.textContent = identity.name;
    if (teamTag) teamTag.textContent = identity.teamTag;
    if (email) email.textContent = identity.email;
    if (desk) desk.textContent = identity.desk;
    if (joined) joined.textContent = identity.joined;
    if (rank) rank.textContent = identity.rank;
    if (rankDelta) {
      const up = identity.rankDeltaDir !== "down";
      rankDelta.className = `myview-rank-delta ${up ? "is-up" : "is-down"}`;
      rankDelta.textContent = `${up ? "▲" : "▼"} ${identity.rankDelta}`;
      rankDelta.setAttribute("aria-label", `${up ? "Up" : "Down"} ${identity.rankDelta}`);
    }
  }

  function renderMyWorkSummary(roleData) {
    if (!myWorkSummary) return;
    myWorkSummary.innerHTML = roleData.summary
      .map(
        (metric) => `<article class="kpi-card kpi-card-static mywork-kpi-card">
          <div class="kpi-card-head">
            <p class="kpi-label">${metric.label}</p>
            <span class="kpi-icon" aria-hidden="true"><img src="${metric.icon}" alt="" width="14" height="14" /></span>
          </div>
          <p class="kpi-value">${metric.value}</p>
          <p class="kpi-meta">${metric.meta}</p>
        </article>`
      )
      .join("");
  }

  function renderMyWorkQueues(roleData) {
    if (!myWorkQueues) return;
    myWorkQueues.innerHTML = roleData.queues
      .map((queue) => {
        if (queue.type === "targets") {
          return `<section class="card mywork-queue-card mywork-targets-card">
            <header class="card-head">
              <div class="card-title-row"><h2>${queue.title}</h2></div>
              <span class="team-count-pill">${queue.count}</span>
            </header>
            <div class="mywork-target-bars">
              ${queue.bars
                .map(
                  (bar) => `<div>
                    <div class="mywork-target-bar-label"><span>${bar.label}</span><span class="roster-metric">${bar.value}</span></div>
                    <div class="goal-progress-track" aria-label="${bar.pct}% attained"><span style="width:${bar.pct}%"></span></div>
                  </div>`
                )
                .join("")}
            </div>
          </section>`;
        }

        if (queue.type === "live-queries") {
          return `<section class="card mywork-queue-card">
            <header class="card-head">
              <div class="card-title-row"><h2>${queue.title}</h2></div>
              <span class="team-count-pill">${queue.count}</span>
            </header>
            <ul class="mywork-live-query-list">
              ${queue.items
                .map(
                  (item) => `<li>
                    <button type="button" class="mywork-live-query" data-mywork-open="${item.action}">
                      <span class="mywork-item-copy">
                        <strong class="member-name">${item.title}</strong>
                        <span class="member-role">${item.meta}</span>
                      </span>
                      <span class="mywork-query-status ${item.statusClass}">${item.status}</span>
                      <span class="roster-revenue">${item.amount}</span>
                    </button>
                  </li>`
                )
                .join("")}
            </ul>
          </section>`;
        }

        return `<section class="card mywork-queue-card">
          <header class="card-head">
            <div class="card-title-row"><h2>${queue.title}</h2></div>
            <span class="team-count-pill">${queue.count}</span>
          </header>
          <ul class="mywork-item-list">
            ${queue.items
              .map(
                (item) => `<li>
                  <button type="button" class="mywork-item" data-mywork-open="${item.action}">
                    <span class="mywork-record-id">${item.id}</span>
                    <span class="mywork-item-copy">
                      <strong class="member-name">${item.title}</strong>
                      <span class="member-role">${item.meta}</span>
                    </span>
                    <span class="mywork-due is-${item.tone}">${item.due}</span>
                  </button>
                </li>`
              )
              .join("")}
          </ul>
        </section>`;
      })
      .join("");
  }

  function renderMyWorkPerformance(roleData) {
    if (!myWorkPerformanceMetrics || !myWorkPerformanceHistory) return;
    myWorkPerformanceMetrics.innerHTML = roleData.performance
      .map((metric) => {
        const [value, meta] = metric.values[activeMyWorkPeriod];
        return `<article class="kpi-card kpi-card-static mywork-kpi-card">
          <div class="kpi-card-head">
            <p class="kpi-label">${metric.label}</p>
            <span class="kpi-icon" aria-hidden="true"><img src="${metric.icon}" alt="" width="14" height="14" /></span>
          </div>
          <p class="kpi-value">${value}</p>
          <p class="kpi-meta">${meta}</p>
        </article>`;
      })
      .join("");
    myWorkPerformanceHistory.innerHTML = `
      <section class="card mywork-lifetime-card">
        <p class="mywork-history-title">Lifetime totals</p>
        <div class="mywork-lifetime-totals">
          ${roleData.history.totals
            .map(
              (total) => `<div class="mywork-lifetime-total">
                <strong>${total.value}</strong>
                <span>${total.label}</span>
              </div>`
            )
            .join("")}
        </div>
        <p class="mywork-history-title mywork-bests-title">Personal bests</p>
        <ul class="mywork-bests-list">
          ${roleData.history.bests
            .map(
              (best) => `<li>
                <img src="${best.icon}" alt="" width="14" height="14" aria-hidden="true" />
                <span>${best.label}</span>
                <strong>${best.value}</strong>
                <small>${best.period}</small>
              </li>`
            )
            .join("")}
        </ul>
      </section>
      <section class="card mywork-attainment-card">
        <p class="mywork-history-title">Goal attainment history</p>
        <div class="mywork-attainment-chart" aria-label="Quarterly goal attainment">
          ${roleData.history.attainment
            .map((item) => {
              const barHeight = Math.max(20, Math.min(item.value, 105) / 105 * 100);
              const status = item.value >= 100 ? "is-target" : "is-below";
              return `<div class="mywork-attainment-column">
                <strong>${item.value}%</strong>
                <div class="mywork-attainment-track"><span class="${status}" style="height:${barHeight}%"></span></div>
                <small>${item.period}</small>
              </div>`;
            })
            .join("")}
        </div>
        <div class="mywork-attainment-legend" aria-hidden="true">
          <span><i class="is-target"></i>Target met</span>
          <span><i class="is-below"></i>Below target</span>
        </div>
      </section>`;
  }

  function renderMyWorkGoals(roleData) {
    if (!myWorkGoals || !myWorkTargetHistory) return;
    myWorkGoals.innerHTML = roleData.goals
      .map(
        (goal) => `<article class="card mywork-goal-card">
          <div class="kpi-card-head">
            <p class="team-kpi-label">${goal.label}</p>
            <span class="kpi-icon" aria-hidden="true"><img src="${goal.icon}" alt="" width="14" height="14" /></span>
          </div>
          <p class="mywork-goal-value">${goal.current}</p>
          <p class="mywork-goal-caption">of ${goal.target} target · ${goal.pct}% attained</p>
          <div class="goal-progress-track" aria-label="${goal.pct}% attained"><span style="width:${Math.min(goal.pct, 100)}%"></span></div>
        </article>`
      )
      .join("");
    myWorkTargetHistory.innerHTML = `
      <header class="card-head">
        <div class="card-title-row">
          <h2>Target history · quarterly</h2>
          <span class="team-count-pill">Last 4 quarters</span>
        </div>
      </header>
      <div class="table-scroll">
        <table class="team-table goals-member-table mywork-target-table">
          <thead>
            <tr>
              <th scope="col">Period</th>
              <th scope="col">Current</th>
              <th scope="col">Target</th>
              <th scope="col">Progress</th>
              <th scope="col">${roleData.targetHistory.secondaryLabel}</th>
            </tr>
          </thead>
          <tbody>
            ${roleData.targetHistory.rows
              .map((row) => {
                const statusClass = row.status.toLowerCase().replace(/\s+/g, "-");
                const currentClass = String(row.current).includes("₹") ? "goals-current" : "roster-metric";
                return `<tr class="roster-row">
                  <td>
                    <div class="member-cell">
                      <div>
                        <p class="member-name">${row.period}</p>
                        <p class="member-role">${row.note}</p>
                        <span class="invite-status-pill is-${statusClass}">${row.status}</span>
                      </div>
                    </div>
                  </td>
                  <td class="${currentClass}">${row.current}</td>
                  <td class="goals-target">${row.target}</td>
                  <td><div class="attain-bar"><span style="width:${Math.min(row.pct, 100)}%"></span></div> <span class="goals-pct">${row.pct}%</span></td>
                  <td class="goals-bookings">${row.secondary}</td>
                </tr>`;
              })
              .join("")}
          </tbody>
        </table>
      </div>`;
  }

  function myWorkActivityMatches(item) {
    const search = (myWorkActivitySearch?.value || "").trim().toLowerCase();
    const module = myWorkActivityModule?.value || "all";
    const dateWindow = Number(myWorkActivityDate?.value || 7);
    const action = myWorkActivityAction?.value || "all";
    if (item.daysAgo > dateWindow) return false;
    if (module !== "all" && item.module !== module) return false;
    if (action !== "all" && item.action !== action) return false;
    if (!search) return true;
    const haystack = `${item.entity} ${item.recordId} ${item.summary} ${item.module}`.toLowerCase();
    return haystack.includes(search);
  }

  function renderMyWorkActivity(roleData) {
    if (!myWorkActivity) return;
    const rows = roleData.activity.filter(myWorkActivityMatches);
    if (!rows.length) {
      myWorkActivity.innerHTML = `<tr class="audit-group"><td colspan="4">No activity matches these filters</td></tr>`;
      return;
    }

    let lastDay = null;
    myWorkActivity.innerHTML = rows
      .map((item) => {
        const group =
          item.day !== lastDay
            ? `<tr class="audit-group"><td colspan="4">${item.day}</td></tr>`
            : "";
        lastDay = item.day;
        return `${group}<tr class="audit-row roster-row" tabindex="0">
          <td><span class="roster-metric">${item.time}</span></td>
          <td>
            <div class="member-cell">
              <span class="avatar ${roleData.identity.avatarClass}" aria-hidden="true">${roleData.identity.initials}</span>
              <div>
                <p class="member-name">${roleData.identity.name}</p>
                <p class="member-role">Member · ${roleData.identity.teamTag}</p>
              </div>
            </div>
          </td>
          <td class="audit-event-cell"><span class="audit-event-text">${item.entity} <button type="button" class="audit-record-link" data-mywork-open="Opening ${item.entity} ${item.recordId}">${item.recordId}</button> · ${item.summary}</span></td>
          <td><span class="audit-module-badge audit-module-${String(item.module || "").toLowerCase()}">${item.module}</span></td>
        </tr>`;
      })
      .join("");
  }

  function renderMyWork() {
    const roleData = MY_WORK_ROLES[activeMyWorkRole] || MY_WORK_ROLES.sales;
    renderMyWorkIdentity(roleData);
    renderMyWorkSummary(roleData);
    renderMyWorkQueues(roleData);
    renderMyWorkPerformance(roleData);
    renderMyWorkGoals(roleData);
    renderMyWorkActivity(roleData);
  }

  function setMyWorkTab(tab, { focus = false } = {}) {
    const key = ["work", "performance", "goals", "activity"].includes(tab) ? tab : "work";
    activeMyWorkTab = key;
    document.querySelectorAll("[data-mywork-tab]").forEach((btn) => {
      const active = btn.dataset.myworkTab === key;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
      btn.setAttribute("tabindex", active ? "0" : "-1");
      if (active && focus) btn.focus();
    });
    document.querySelectorAll("[data-mywork-panel]").forEach((panel) => {
      const active = panel.dataset.myworkPanel === key;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
  }

  document.querySelectorAll("[data-mywork-tab]").forEach((btn) => {
    btn.addEventListener("click", () => setMyWorkTab(btn.dataset.myworkTab));
    btn.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const tabs = [...document.querySelectorAll("[data-mywork-tab]")];
      const index = tabs.indexOf(btn);
      const offset = e.key === "ArrowRight" ? 1 : -1;
      const next = tabs[(index + offset + tabs.length) % tabs.length];
      setMyWorkTab(next.dataset.myworkTab, { focus: true });
    });
  });

  document.querySelectorAll("[data-mywork-period]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeMyWorkPeriod = MY_WORK_PERIOD_LABELS[btn.dataset.myworkPeriod] ? btn.dataset.myworkPeriod : "month";
      document.querySelectorAll("[data-mywork-period]").forEach((periodBtn) => {
        periodBtn.classList.toggle("is-active", periodBtn === btn);
      });
      renderMyWorkPerformance(MY_WORK_ROLES[activeMyWorkRole]);
    });
  });

  [
    myWorkActivitySearch,
    myWorkActivityModule,
    myWorkActivityDate,
    myWorkActivityAction,
  ].forEach((el) => {
    el?.addEventListener("input", () => renderMyWorkActivity(MY_WORK_ROLES[activeMyWorkRole]));
    el?.addEventListener("change", () => renderMyWorkActivity(MY_WORK_ROLES[activeMyWorkRole]));
  });

  document.getElementById("team-panel-myview")?.addEventListener("click", (e) => {
    const row = e.target.closest("[data-mywork-open]");
    if (row) showToast(row.dataset.myworkOpen);
  });

  renderMyWork();
  setMyWorkTab("work");

  menuToggle.addEventListener("click", () => {
    setSidebarOpen(!app.classList.contains("is-sidebar-open"));
  });

  backdrop.addEventListener("click", () => setSidebarOpen(false));

  /* ---------- Notifications ---------- */

  function openNotif() {
    closeAssignDrawer();
    closeOnboardingDrawer();
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
    closeAssignDrawer();
    closeOnboardingDrawer();
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
      if (btn.dataset.openModal === "new-query") {
        openQueriesCreate();
        return;
      }
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
    incrementDemoCount("customers");
    completeChecklistItem("customers");
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
    createQueryFromForm(data);
    e.target.reset();
    incrementDemoCount("queries");
    completeChecklistItem("query");
    if (currentShell !== "queries") showView("queries");
    else renderQueriesPipeline();
    showToast(`Query for “${dest}” created`);
  });

  document.getElementById("invite-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const email = String(data.get("email") || "").trim();
    const role = String(data.get("role") || "Member");
    const team = String(data.get("team") || "Domestic");
    const invitationId = nextAuditRecordId("INV");
    const tbody = document.getElementById("invites-tbody");
    if (tbody && email) {
      const row = document.createElement("tr");
      row.className = "invite-row";
      row.dataset.inviteEmail = email;
      row.dataset.inviteId = invitationId;
      row.innerHTML = `
        <td>${email}</td>
        <td>${role}</td>
        <td>${team}</td>
        <td>Just now</td>
        <td><span class="invite-status-pill is-sent">Sent</span></td>
        <td class="invites-actions-cell">
          <div class="invites-actions-group">
            <button type="button" class="btn btn-outline btn-xs" data-invite-action="resend">Resend</button>
            <button type="button" class="btn btn-outline btn-xs" data-invite-action="revoke">Revoke</button>
          </div>
        </td>`;
      tbody.prepend(row);
      setInvitesTab("pending");
    }
    closeModal(document.getElementById("modal-invite-team"));
    e.target.reset();
    completeChecklistItem("team");
    appendAuditEvent({
      dotClass: "is-success",
      actionType: "invite",
      module: "team",
      risk: "low",
      entity: "Invitation",
      recordId: invitationId,
      eventTemplate: "created",
      supporting: `for ${email} · Role: ${role}`,
      previousValue: "—",
      newValue: `Pending invitation · ${role} · ${team}`,
      relatedRecord: `Invitation ${invitationId} · ${email}`,
    });
    showToast(`Invite sent to ${email}`);
  });

  /* ---------- Inline actions ---------- */

  function activateKpiOrToast(el) {
    const targetId = el.dataset.kpiTarget;
    const nav = el.dataset.kpiNav;
    if (nav === "Team") {
      showView("team");
    } else if (nav === "Bookings") {
      showView("bookings");
    } else if (nav === "Queries") {
      showView("queries");
    } else if (nav) {
      setActiveNav(nav);
    }
    if (targetId) {
      const node = document.getElementById(targetId);
      const section = node?.closest(".card") || node;
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        section.classList.add("is-section-highlight");
        window.setTimeout(() => section.classList.remove("is-section-highlight"), 1600);
      }
    }
    if (el.dataset.toast) showToast(el.dataset.toast);
  }

  document.querySelectorAll("[data-toast], [data-kpi-nav], [data-kpi-target]").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (el.tagName === "A") e.preventDefault();
      activateKpiOrToast(el);
    });
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activateKpiOrToast(el);
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
        if (openModalEl.id === "modal-role-change") rolesState.pendingRoleChange = null;
        if (openModalEl.id === "modal-member-modules") closeModulesModalState();
        closeModal(openModalEl);
        return;
      }
      if (assignDrawer && !assignDrawer.hidden) {
        closeAssignDrawer();
        return;
      }
      if (onboardingDrawer && !onboardingDrawer.hidden) {
        closeOnboardingDrawer();
        return;
      }
      if (auditDrawer && !auditDrawer.hidden) {
        closeAuditDrawer();
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
