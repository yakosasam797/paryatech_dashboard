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
    fulfilment: true,
    travellers: true,
    documents: true,
    finance: true,
    vouchers: true,
    communication: true,
    activity: true,
  };

  const DEMO_OWNER = { initials: "VJ", name: "Vrushabh Jain", id: "vrushabh" };

  const BOOKING_ISSUE_LABELS = {
    payment_overdue: "Payment overdue",
    supplier_pending: "Supplier pending",
    documents_missing: "Documents missing",
  };

  const BOOKING_PHASE_RANK = {
    needs_action: 0,
    travelling: 1,
    upcoming: 2,
    completed: 3,
  };

  const BOOKINGS = [
    {
      id: "BK-2026-000003",
      slug: "xyz-dubai",
      title: "XYZ Family · Dubai",
      customer: "XYZ Family",
      destination: "Dubai",
      queryId: "Q-1042",
      phase: "needs_action",
      issues: ["supplier_pending", "documents_missing"],
      paymentsOpen: true,
      priority: 1,
      travelStart: "2026-08-06",
      travelEnd: "2026-08-06",
      pax: 3,
      owner: DEMO_OWNER,
      toCollect: 0,
      toPaySuppliers: 20500,
      actionHint: "Complete post-trip closure",
      linkedProposal: "XYZ Family Dubai Proposal",
      tripLabel: "Dubai",
      notes:
        "Converted from Q-1042 · XYZ Family · Dubai\nRoute: Mumbai → Dubai\n3 adults\nSupplier confirms and documents still open after travel.",
      itinerarySub: "Itinerary locked from confirmed query.",
      itineraryNote: "Service lines on the Services & vendors tab remain the operational source of truth.",
      ledger: {
        receivable: 20500,
        totalCost: 20500,
        margin: 0,
        customerPaid: 20500,
        customerBalance: 0,
        vendorPayable: 20500,
        vendorSettled: 0,
        cashIn: 20500,
        cashOut: 0,
        entryCount: 2,
      },
      nextAction: {
        kind: "task",
        title: "Complete post-trip closure",
        body: "Trip dates have ended — close supplier confirms and missing documents.",
        cta: "Complete post-trip closure",
      },
      lifecycle: { mode: "confirm-cancel" },
    },
    {
      id: "BK-2026-000002",
      slug: "ladakh",
      title: "Jain Family · Ladakh",
      customer: "Jain Family",
      destination: "Ladakh",
      queryId: "Q-1038",
      phase: "needs_action",
      issues: ["payment_overdue"],
      paymentsOpen: true,
      priority: 2,
      travelStart: "2026-07-15",
      travelEnd: "2026-07-21",
      pax: 1,
      owner: DEMO_OWNER,
      toCollect: 223456,
      toPaySuppliers: 0,
      actionHint: "Collect overdue balance",
      linkedProposal: "Ladakh Trip Proposal",
      tripLabel: "Ladakh",
      notes: "Converted from Q-1038 · balance still open after travel.",
      itinerarySub: "Itinerary fulfilled.",
      itineraryNote: "Service lines on the Services & vendors tab remain the operational source of truth.",
      ledger: {
        receivable: 1123456,
        totalCost: 0,
        margin: 1123456,
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
        cta: "Send payment reminder",
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
      phase: "travelling",
      issues: [],
      paymentsOpen: false,
      priority: 3,
      travelStart: "2026-08-05",
      travelEnd: "2026-08-12",
      pax: 4,
      owner: DEMO_OWNER,
      toCollect: 0,
      toPaySuppliers: 0,
      moneySettled: true,
      actionHint: "",
      linkedProposal: "Kerala Family Escape",
      tripLabel: "Kerala",
      notes: "Converted from Q-1040 · travellers currently on ground.",
      itinerarySub: "Live trip · Munnar → Alleppey.",
      itineraryNote: "Ops on-call for day-of changes.",
      ledger: {
        receivable: 180000,
        totalCost: 120000,
        margin: 60000,
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
      phase: "upcoming",
      issues: [],
      paymentsOpen: false,
      priority: 4,
      travelStart: "2026-08-18",
      travelEnd: "2026-08-22",
      pax: 2,
      owner: DEMO_OWNER,
      toCollect: 0,
      toPaySuppliers: 0,
      moneySettled: true,
      actionHint: "",
      linkedProposal: "Goa Weekend",
      tripLabel: "Goa",
      notes: "Converted from Q-1045 · departure in 10 days.",
      itinerarySub: "Confirmed hotel + airport transfers.",
      itineraryNote: "Vouchers ready to issue closer to travel.",
      ledger: {
        receivable: 72000,
        totalCost: 48000,
        margin: 24000,
        customerPaid: 72000,
        customerBalance: 0,
        vendorPayable: 48000,
        vendorSettled: 48000,
        cashIn: 72000,
        cashOut: 48000,
        entryCount: 3,
      },
      nextAction: {
        kind: "clear",
        title: "Ready for travel",
        body: "No open blockers before departure.",
      },
      lifecycle: { mode: "reopen", readiness: 85 },
    },
    {
      id: "BK-2026-000001",
      slug: "tripura",
      title: "Jain Family · Tripura",
      customer: "Jain Family",
      destination: "Tripura",
      queryId: "Q-1021",
      phase: "completed",
      issues: [],
      paymentsOpen: false,
      priority: 5,
      travelStart: "2026-08-01",
      travelEnd: "2026-08-04",
      pax: 2,
      owner: DEMO_OWNER,
      toCollect: 0,
      toPaySuppliers: 0,
      moneySettled: true,
      actionHint: "",
      linkedProposal: "Tripura Trip Proposal",
      tripLabel: "Tripura",
      notes: "Converted from Q-1021 · Domestic short-haul · Guwahati transit.",
      itinerarySub: "Trip completed.",
      itineraryNote: "Service lines on the Services & vendors tab remain the operational source of truth.",
      ledger: {
        receivable: 45000,
        totalCost: 28000,
        margin: 17000,
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
  ];

  const bookingsState = {
    tab: "needs_action",
    search: "",
    sort: "priority",
    page: 0,
    pageSize: 50,
    detailSlug: null,
    detailTab: "overview",
    filtersActive: false,
  };

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

  let bookingNotesTimer = null;

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

  /** Explicit money copy — never mixes signed amounts with “settled”. */
  function getBookingMoneyCopy(b) {
    const toCollect = Math.max(0, Number(b.toCollect) || 0);
    const toPay = Math.max(0, Number(b.toPaySuppliers) || 0);
    const lines = [];

    if (toCollect > 0) {
      lines.push({
        amount: formatINR(toCollect, { signed: false }),
        label: "to collect",
        tone: "is-collect",
      });
    }
    if (toPay > 0) {
      lines.push({
        amount: formatINR(toPay, { signed: false }),
        label: "to pay suppliers",
        tone: "is-pay",
      });
    }
    if (lines.length) {
      return {
        lines,
        title: lines.map((l) => `${l.amount} ${l.label}`).join(" · "),
      };
    }
    if (b.moneySettled) {
      return {
        lines: [{ amount: "Settled", label: "", tone: "is-settled" }],
        title: "Settled — no open money",
      };
    }
    return {
      lines: [{ amount: "No balance", label: "", tone: "is-clear" }],
      title: "No balance",
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
    if (open > 0) return `${formatINR(open, { signed: false })} to pay suppliers`;
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

  function bookingInitial(title) {
    return (title || "B").trim().charAt(0).toUpperCase();
  }

  function phaseLabel(phase) {
    if (phase === "needs_action") return "Needs action";
    if (phase === "upcoming") return "Upcoming";
    if (phase === "travelling") return "Travelling";
    if (phase === "completed") return "Completed";
    return phase;
  }

  function bookingIssueLabel(issue) {
    return BOOKING_ISSUE_LABELS[issue] || issue;
  }

  function bookingIssueChipsHtml(issues) {
    if (!issues || !issues.length) return "";
    return `<span class="bookings-issue-row">${issues
      .map((issue) => `<span class="booking-issue-pill is-${escapeHtml(issue)}">${escapeHtml(bookingIssueLabel(issue))}</span>`)
      .join("")}</span>`;
  }

  function bookingRefLine(b) {
    const query = b.queryId ? ` · from ${b.queryId}` : "";
    return `${b.id}${query}`;
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
      needs_action: BOOKINGS.filter((b) => b.phase === "needs_action").length,
      upcoming: BOOKINGS.filter((b) => b.phase === "upcoming").length,
      travelling: BOOKINGS.filter((b) => b.phase === "travelling").length,
      completed: BOOKINGS.filter((b) => b.phase === "completed").length,
      payments: BOOKING_PAYMENTS.filter(paymentIsOpen).length,
    };
  }

  function bookingMatchesTab(b, tab) {
    if (tab === "payments") return !!b.paymentsOpen;
    if (tab === "needs_action" || tab === "upcoming" || tab === "travelling" || tab === "completed") {
      return b.phase === tab;
    }
    return true;
  }

  function getFilteredBookings() {
    const q = bookingsState.search.trim().toLowerCase();
    let list = BOOKINGS.filter((b) => bookingMatchesTab(b, bookingsState.tab));
    if (q) {
      list = list.filter((b) => {
        const hay = `${b.title} ${b.id} ${b.queryId || ""} ${b.customer} ${b.destination || ""} ${b.tripLabel}`.toLowerCase();
        return hay.includes(q);
      });
    }
    const sort = bookingsState.sort;
    list = [...list].sort((a, b) => {
      if (sort === "travel") return a.travelStart.localeCompare(b.travelStart) || a.priority - b.priority;
      if (sort === "balance") return bookingMoneyDue(b) - bookingMoneyDue(a) || a.priority - b.priority;
      const phaseDelta = (BOOKING_PHASE_RANK[a.phase] ?? 9) - (BOOKING_PHASE_RANK[b.phase] ?? 9);
      return phaseDelta || a.priority - b.priority;
    });
    return list;
  }

  function bookingsSummaryLine() {
    const needs = BOOKINGS.filter((b) => b.phase === "needs_action").length;
    const travelling = BOOKINGS.filter((b) => b.phase === "travelling").length;
    const toCollect = BOOKINGS.reduce((sum, b) => sum + (Number(b.toCollect) || 0), 0);
    const toPay = BOOKINGS.reduce((sum, b) => sum + (Number(b.toPaySuppliers) || 0), 0);
    const needsLabel = needs === 1 ? "1 booking needs action" : `${needs} bookings need action`;
    const travelLabel = travelling === 1 ? "1 travelling now" : `${travelling} travelling now`;
    const moneyParts = [];
    if (toCollect > 0) moneyParts.push(`${formatINRCompact(toCollect)} to collect`);
    if (toPay > 0) moneyParts.push(`${formatINR(toPay, { signed: false })} to pay suppliers`);
    if (!moneyParts.length) moneyParts.push("No balance");
    return `${needsLabel} · ${travelLabel} · ${moneyParts.join(" · ")}`;
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
      const amountPrefix = p.type === "vendor" || p.type === "refund" ? "−" : "";
      const amountClass = p.type === "customer" && p.stage === "completed" ? "is-in" : p.type === "vendor" || p.type === "refund" ? "is-out" : "";
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
          <td><span class="bookings-payment-amount ${amountClass}">${amountPrefix}${escapeHtml(formatINR(p.amount, { signed: false }))}</span></td>
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
    const sub = document.getElementById("bookings-page-sub");
    const clearBtn = document.getElementById("bookings-clear");
    const meta = document.getElementById("bookings-pagination-meta");
    const prevBtn = document.getElementById("bookings-prev");
    const nextBtn = document.getElementById("bookings-next");
    if (!body) return;

    if (sub) sub.textContent = bookingsSummaryLine();

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
      setBookingsPaymentsMode(true);
      return;
    }

    setBookingsPaymentsMode(false);

    const filtered = getFilteredBookings();
    const total = filtered.length;
    const start = bookingsState.page * bookingsState.pageSize;
    const pageItems = filtered.slice(start, start + bookingsState.pageSize);
    const end = start + pageItems.length;
      const hasFilters =
      bookingsState.tab !== "needs_action" ||
      !!bookingsState.search.trim() ||
      bookingsState.sort !== "priority" ||
      bookingsState.filtersActive;
    if (clearBtn) clearBtn.hidden = !hasFilters;

    if (!pageItems.length) {
      const emptyCopy =
        bookingsState.tab === "needs_action"
          ? {
              title: "Nothing needs action",
              desc: "Upcoming trips and completed history live in their own views.",
            }
          : {
              title: "No bookings match",
              desc: "Try a different view, search or filter.",
            };
      body.innerHTML = `
        <div class="bookings-empty" role="status">
          <div class="bookings-empty-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8M8 11h5"/></svg>
          </div>
          <p class="empty-state-title">${emptyCopy.title}</p>
          <p class="empty-state-desc">${emptyCopy.desc}</p>
          <button type="button" class="btn btn-outline btn-sm" id="bookings-empty-clear">Clear filters</button>
        </div>`;
      body.querySelector("#bookings-empty-clear")?.addEventListener("click", clearBookingsFilters);
    } else {
      body.innerHTML = `<ul class="bookings-rows" aria-label="Bookings">${pageItems
        .map((b) => {
          const hint = b.actionHint
            ? `<p class="bookings-row-hint"><svg class="bookings-row-hint-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>${escapeHtml(b.actionHint)}</p>`
            : "";
          return `
          <li>
            <button type="button" class="bookings-row is-phase-${escapeHtml(b.phase)}" data-booking-slug="${escapeHtml(b.slug)}">
              <span class="bookings-initial" aria-hidden="true">${escapeHtml(bookingInitial(b.destination || b.title))}</span>
              <span class="bookings-row-main">
                <span class="bookings-row-title-line">
                  <span class="bookings-row-title">${escapeHtml(b.title)}</span>
                  <span class="booking-status-pill is-${escapeHtml(b.phase)}">${escapeHtml(phaseLabel(b.phase))}</span>
                </span>
                <span class="bookings-row-meta">${escapeHtml(bookingRefLine(b))} · ${escapeHtml(formatListDates(b.travelStart, b.travelEnd))} · ${b.pax} pax</span>
                ${bookingIssueChipsHtml(b.issues)}
                ${hint}
              </span>
              <span class="bookings-row-side">
                <span class="bookings-row-finance" title="${escapeHtml(getBookingMoneyCopy(b).title)}">
                  ${getBookingMoneyCopy(b)
                    .lines.map(
                      (line) => `
                    <span class="bookings-row-money ${escapeHtml(line.tone)}">
                      <span class="bookings-row-amount">${escapeHtml(line.amount)}</span>
                      ${line.label ? `<span class="bookings-row-settle">${escapeHtml(line.label)}</span>` : ""}
                    </span>`
                    )
                    .join("")}
                </span>
                <span class="bookings-row-owner member-cell">
                  <span class="avatar avatar-pink" aria-hidden="true">${escapeHtml(b.owner.initials)}</span>
                  <span class="member-name">${escapeHtml(b.owner.name)}</span>
                </span>
                <svg class="bookings-row-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
              </span>
            </button>
          </li>`;
        })
        .join("")}</ul>`;
      body.querySelectorAll("[data-booking-slug]").forEach((btn) => {
        btn.addEventListener("click", () => openBookingDetail(btn.dataset.bookingSlug, { push: true }));
      });
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
    bookingsState.tab = "needs_action";
    bookingsState.search = "";
    bookingsState.sort = "priority";
    bookingsState.page = 0;
    bookingsState.filtersActive = false;
    const search = document.getElementById("bookings-search");
    const sort = document.getElementById("bookings-sort");
    if (search) search.value = "";
    if (sort) sort.value = "priority";
    renderBookingsList();
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

  function setBookingDetailTab(tab, { updateHash = true } = {}) {
    const key = BOOKING_DETAIL_TABS[tab] ? tab : "overview";
    bookingsState.detailTab = key;
    document.querySelectorAll("[data-booking-tab]").forEach((btn) => {
      const active = btn.dataset.bookingTab === key;
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
  }

  function renderBookingDetail(booking) {
    const initial = document.getElementById("booking-detail-initial");
    const title = document.getElementById("booking-detail-title");
    const meta = document.getElementById("booking-detail-meta");
    const status = document.getElementById("booking-detail-status");
    const summary = document.getElementById("booking-summary-grid");
    const actionBar = document.getElementById("booking-action-bar");
    const notes = document.getElementById("booking-notes");
    const notesStatus = document.getElementById("booking-notes-status");
    const itinerarySub = document.getElementById("booking-itinerary-sub");
    const itineraryNote = document.getElementById("booking-itinerary-note");
    const ledgerGrid = document.getElementById("booking-ledger-grid");

    if (initial) initial.textContent = bookingInitial(booking.destination || booking.title);
    if (title) title.textContent = booking.title;
    if (meta) {
      const queryBit = booking.queryId
        ? `<span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>from ${escapeHtml(booking.queryId)}</span>`
        : "";
      meta.innerHTML = `
        <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>${escapeHtml(booking.id)}</span>
        ${queryBit}
        <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>${escapeHtml(formatBookingDates(booking.travelStart, booking.travelEnd))}</span>
        <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>${escapeHtml(booking.customer)}</span>`;
    }
    if (status) {
      status.textContent = phaseLabel(booking.phase);
      status.className = `booking-status-pill is-${booking.phase}`;
    }

    if (summary) {
      const paxLabel = booking.pax === 1 ? "1" : String(booking.pax);
      const paxSub = booking.pax === 1 ? "traveller" : "travellers";
      const issuesCopy = booking.issues?.length
        ? booking.issues.map(bookingIssueLabel).join(" · ")
        : "None";
      summary.innerHTML = `
        <article class="bookings-summary-card"><p class="bookings-summary-label">Customer</p><p class="bookings-summary-value">${escapeHtml(booking.customer)}</p></article>
        <article class="bookings-summary-card"><p class="bookings-summary-label">Travel dates</p><p class="bookings-summary-value">${escapeHtml(formatBookingDates(booking.travelStart, booking.travelEnd))}</p></article>
        <article class="bookings-summary-card"><p class="bookings-summary-label">Pax</p><p class="bookings-summary-value">${escapeHtml(paxLabel)}</p><p class="bookings-summary-sub">${escapeHtml(paxSub)}</p></article>
        <article class="bookings-summary-card"><p class="bookings-summary-label">Owner</p><p class="bookings-summary-value">${escapeHtml(booking.owner.name)}</p></article>
        <article class="bookings-summary-card"><p class="bookings-summary-label">Open issues</p><p class="bookings-summary-value">${escapeHtml(issuesCopy)}</p>${booking.queryId ? `<p class="bookings-summary-sub">from ${escapeHtml(booking.queryId)}</p>` : ""}</article>`;
    }

    if (actionBar) {
      const na = booking.nextAction;
      const lc = booking.lifecycle;
      const icon =
        na.kind === "task"
          ? `<span class="bookings-next-icon is-alert" aria-hidden="true">!</span>`
          : `<span class="bookings-next-icon is-ready" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg></span>`;
      const cta =
        na.kind === "task" && na.cta
          ? `<button type="button" class="btn btn-outline btn-sm" data-toast="Opening task…">${escapeHtml(na.cta)}</button>`
          : "";
      const lifecycleBtns =
        lc.mode === "confirm-cancel"
          ? `<button type="button" class="btn btn-primary btn-sm" data-lifecycle="confirm"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>Confirm booking</button>
             <button type="button" class="btn btn-destructive-soft btn-sm" data-lifecycle="cancel"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>Cancel booking</button>`
          : `<button type="button" class="btn btn-outline btn-sm" data-lifecycle="reopen"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12a9 9 0 1 1-2.6-6.3"/><polyline points="21 3 21 9 15 9"/></svg>Reopen</button>`;
      actionBar.innerHTML = `
        <div class="bookings-next-action">
          ${icon}
          <div class="bookings-next-copy">
            <p class="bookings-next-kicker">${na.kind === "task" ? "NEXT ACTION · OPENS TASK" : "NEXT ACTION"}</p>
            <p class="bookings-next-title">${escapeHtml(na.title)}</p>
            <p class="bookings-next-body">${escapeHtml(na.body)}</p>
            ${cta}
          </div>
        </div>
        <div class="bookings-lifecycle">
          <p class="bookings-lifecycle-label">Guarded lifecycle</p>
          <div class="bookings-lifecycle-actions">${lifecycleBtns}</div>
        </div>`;
      actionBar.querySelectorAll("[data-toast]").forEach((btn) => {
        btn.addEventListener("click", () => showToast(btn.dataset.toast));
      });
      actionBar.querySelector("[data-lifecycle='confirm']")?.addEventListener("click", () => {
        booking.phase = "upcoming";
        booking.issues = [];
        booking.actionHint = "";
        booking.lifecycle = { mode: "reopen", readiness: 60 };
        booking.nextAction = {
          kind: "clear",
          title: "Ready for travel",
          body: "Confirmed — no open blockers before departure.",
        };
        showToast("Booking confirmed…");
        renderBookingDetail(booking);
        renderBookingsList();
      });
      actionBar.querySelector("[data-lifecycle='cancel']")?.addEventListener("click", () => {
        showToast("Booking cancelled…");
      });
      actionBar.querySelector("[data-lifecycle='reopen']")?.addEventListener("click", () => {
        booking.phase = "needs_action";
        booking.issues = ["supplier_pending"];
        booking.actionHint = "Confirm supplier services";
        booking.lifecycle = { mode: "confirm-cancel" };
        booking.nextAction = {
          kind: "task",
          title: "Confirm supplier services",
          body: "Reopened — confirm services before travel.",
          cta: "Confirm supplier services",
        };
        showToast("Booking reopened…");
        renderBookingDetail(booking);
        renderBookingsList();
      });
    }

    if (notes && notes.dataset.slug !== booking.slug) {
      notes.value = booking.notes || "";
      notes.dataset.slug = booking.slug;
    }
    if (notesStatus) notesStatus.textContent = "All changes saved";
    if (itinerarySub) itinerarySub.textContent = booking.itinerarySub;
    if (itineraryNote) itineraryNote.textContent = booking.itineraryNote;

    if (ledgerGrid) {
      const L = booking.ledger;
      const customerBalanceCopy = formatCustomerBalanceCopy(L.customerBalance);
      const vendorPayCopy = formatVendorPayCopy(L.vendorPayable, L.vendorSettled);
      const cells = [
        { label: "Booking receivable", value: formatINR(L.receivable, { signed: false }), tone: "" },
        { label: "Total cost", value: formatINR(L.totalCost, { signed: false }), tone: "" },
        { label: "Margin", value: formatINR(L.margin, { signed: false }), tone: "is-positive" },
        { label: "Customer paid", value: formatINR(L.customerPaid, { signed: false }), tone: "is-positive" },
        {
          label: "Customer balance",
          value: customerBalanceCopy,
          tone: L.customerBalance > 0 ? "is-collect" : L.customerBalance < 0 ? "is-credit" : "",
        },
        { label: "Vendor payable", value: formatINR(L.vendorPayable, { signed: false }), tone: "" },
        {
          label: "Supplier payouts",
          value: vendorPayCopy,
          tone: Math.max(0, L.vendorPayable - L.vendorSettled) > 0 ? "is-pay" : "",
        },
        {
          label: "Cash movement summary",
          value: `${formatINR(L.cashIn, { signed: false })} in / ${formatINR(L.cashOut, { signed: false })} out`,
          tone: "",
          sub: `${L.entryCount} ledger entries`,
        },
      ];
      ledgerGrid.innerHTML = cells
        .map(
          (c) => `
        <article class="bookings-ledger-cell">
          <p class="bookings-ledger-label">${escapeHtml(c.label)}</p>
          <p class="bookings-ledger-value ${c.tone}">${escapeHtml(c.value)}</p>
          ${c.sub ? `<p class="bookings-ledger-sub">${escapeHtml(c.sub)}</p>` : ""}
        </article>`
        )
        .join("");
    }
  }

  function openBookingDetail(slug, { tab = "overview", updateHash = true, push = false } = {}) {
    const booking = getBookingBySlug(slug);
    if (!booking) {
      setBookingsListMode({ updateHash: true });
      return;
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
    renderBookingDetail(booking);
    setBookingDetailTab(tab, { updateHash: false });
    if (updateHash) {
      const next = tab === "overview" ? `#bookings/${slug}` : `#bookings/${slug}/${tab}`;
      if (window.location.hash !== next) {
        if (push) history.pushState(null, "", next);
        else history.replaceState(null, "", next);
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function parseBookingsHash() {
    const hash = (window.location.hash || "").replace(/^#/, "");
    if (!hash.startsWith("bookings")) return { mode: "list" };
    const parts = hash.split("/").filter(Boolean);
    // bookings | bookings/list | bookings/{slug} | bookings/{slug}/{tab}
    if (parts.length <= 1 || parts[1] === "list") return { mode: "list" };
    const slug = parts[1];
    if (!getBookingBySlug(slug)) return { mode: "list" };
    const tab = parts[2] && BOOKING_DETAIL_TABS[parts[2]] ? parts[2] : "overview";
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
      needs_action: true,
      upcoming: true,
      travelling: true,
      completed: true,
      payments: true,
    };
    document.querySelectorAll("[data-bookings-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        bookingsState.tab = bookingListTabs[btn.dataset.bookingsTab] ? btn.dataset.bookingsTab : "needs_action";
        bookingsState.page = 0;
        renderBookingsList();
      });
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

    const notes = document.getElementById("booking-notes");
    notes?.addEventListener("input", () => {
      const booking = getBookingBySlug(bookingsState.detailSlug);
      if (!booking) return;
      const status = document.getElementById("booking-notes-status");
      if (status) status.textContent = "Saving…";
      window.clearTimeout(bookingNotesTimer);
      bookingNotesTimer = window.setTimeout(() => {
        booking.notes = notes.value;
        if (status) status.textContent = "All changes saved";
      }, 450);
    });
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
    if (hash.startsWith("#team") || hash.startsWith("#bookings")) {
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
    if (dashboardReturning) dashboardReturning.dataset.viewingAs = next;
    if (dashboardNew) dashboardNew.dataset.viewingAs = next;
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
  }

  function showView(shell, options = {}) {
    const next = shell === "team" ? "team" : shell === "bookings" ? "bookings" : "home";
    currentShell = next;

    if (next === "team") {
      dashboardReturning.hidden = true;
      dashboardNew.hidden = true;
      if (viewTeam) viewTeam.hidden = false;
      if (viewBookings) viewBookings.hidden = true;
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

    if (viewTeam) viewTeam.hidden = true;
    if (viewBookings) viewBookings.hidden = true;
    if (breadcrumbRoot) breadcrumbRoot.textContent = "Workspace";
    const homeView = options.dashboardView || resolveView();
    applyView(homeView);
    if (options.syncHomeUrl !== false) {
      syncHomeModeUrl(homeView, { replace: true });
    }
    const hash = window.location.hash || "";
    if (hash.startsWith("#team") || hash.startsWith("#bookings")) {
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
  const bootHash = window.location.hash || "";
  if (bootHash.startsWith("#team")) {
    showView("team", { smooth: false });
  } else if (bootHash.startsWith("#bookings")) {
    showView("bookings", { smooth: false });
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
        setActiveNav("Queries");
        openModal("modal-new-query");
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

      if (name === "Home") {
        showView("home");
        applyDashboardFilter("");
        searchInput.value = "";
        return;
      }

      setActiveNav(name);
      showToast(`Opened ${name}`);
      if (name === "Inbox") {
        if (currentShell === "team" || currentShell === "bookings") showView("home", { scrollTop: false });
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
    e.target.reset();
    incrementDemoCount("queries");
    completeChecklistItem("query");
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
