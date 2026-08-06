(() => {
  "use strict";

  const app = document.getElementById("app");
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  const menuToggle = document.getElementById("menu-toggle");
  const breadcrumbRoot = document.getElementById("breadcrumb-root");
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
  const dashboardReturning = document.getElementById("dashboard-returning");
  const dashboardNew = document.getElementById("dashboard-new");
  const viewTeam = document.getElementById("view-team");
  const viewingAs = document.getElementById("viewing-as");
  const teamPageTitle = document.getElementById("team-page-title");
  const teamPageSub = document.getElementById("team-page-sub");
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
    },
    goals: {
      title: "Goals & targets",
      sub: "Quarter attainment for the agency and each member.",
    },
    org: {
      title: "Team structure",
      sub: "Who reports to whom across International and Domestic.",
    },
    roles: {
      title: "Roles & access",
      sub: "Permissions by role and who holds each role.",
    },
    invitations: {
      title: "Invitations",
      sub: "Pending invites and member onboarding until ready for work.",
    },
    audit: {
      title: "Workspace Audit Log",
      sub: "Workspace activity across operations, finance, access, and security.",
    },
    myview: {
      title: "My view",
      sub: "Your live queries, rank, and targets.",
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
  const auditFilterRisk = document.getElementById("audit-filter-risk");
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

  function auditRiskLabel(risk) {
    if (risk === "high") return "High";
    if (risk === "medium") return "Medium";
    return "Low";
  }

  function auditRiskClass(risk) {
    if (risk === "high") return "is-high";
    if (risk === "medium") return "is-medium";
    return "is-low";
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
    const risk = auditFilterRisk?.value || "all";
    const days = Number(auditFilterDate?.value || 7);
    const showDeleted = auditFilterDeleted?.checked;

    if (event.module === "security" && module !== "security") return false;
    if (!showDeleted && event.deleted) return false;
    if (member !== "all" && event.actor.name !== member) return false;
    if (module !== "all" && event.module !== module) return false;
    if (action !== "all" && event.actionType !== action) return false;
    if (risk !== "all" && (!event.sensitive || event.risk !== risk)) return false;
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
        groupRow.innerHTML = `<td colspan="5">${event.groupLabel}</td>`;
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
      row.dataset.auditRisk = event.sensitive ? event.risk : "";
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
      const riskBadge = event.sensitive
        ? `<span class="audit-risk-badge ${auditRiskClass(event.risk)}">${auditRiskLabel(event.risk)}</span>`
        : "";
      row.innerHTML = `<td>${event.time}</td>
        <td><div class="member-cell"><span class="avatar avatar-sm ${event.actor.avatarClass || ""}">${event.actor.initials}</span>${event.actor.name}</div></td>
        <td class="audit-event-cell">${formatAuditEventCell(event)}</td>
        <td><span class="audit-module-badge ${auditModuleClass(event.module)}">${AUDIT_MODULE_LABELS[event.module]}</span></td>
        <td>${riskBadge}</td>`;
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
    const riskRow = event.sensitive
      ? `<div class="audit-detail-row"><dt>Risk</dt><dd><span class="audit-risk-badge ${auditRiskClass(event.risk)}">${auditRiskLabel(event.risk)}</span></dd></div>`
      : "";

    auditDetailGrid.innerHTML = `
      <div class="audit-detail-row"><dt>Actor</dt><dd>${event.actor.name}</dd></div>
      <div class="audit-detail-row"><dt>Actor type</dt><dd>${event.actor.type}</dd></div>
      <div class="audit-detail-row"><dt>Timestamp</dt><dd>${event.groupLabel} · ${event.time} · ${event.timezone}</dd></div>
      <div class="audit-detail-row"><dt>Module</dt><dd><span class="audit-module-badge ${auditModuleClass(event.module)}">${AUDIT_MODULE_LABELS[event.module]}</span></dd></div>
      ${riskRow}
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
    auditFilterRisk,
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

  document.getElementById("audit-export-btn")?.addEventListener("click", () => {
    showToast("Exporting CSV…");
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

  function resolveView() {
    const param = getViewFromSearchParams();
    if (param === "new") return "new";
    if (param === "returning") return "returning";
    return hasDemoActivity() ? "returning" : "new";
  }

  function applyView(view) {
    currentView = view;
    const isNew = view === "new";
    if (currentShell === "home") {
      dashboardReturning.hidden = isNew;
      dashboardNew.hidden = !isNew;
      if (viewTeam) viewTeam.hidden = true;
    }
    document.title = isNew ? "Paryatech — Welcome" : "Paryatech — Home";
    document.body.classList.toggle("is-new-user", isNew);
    if (currentShell === "home") {
      setActiveNav("Home");
      if (breadcrumbRoot) breadcrumbRoot.textContent = "Workspace";
    }
    if (isNew) {
      notifDot.classList.add("is-hidden");
      notifBadge.classList.add("is-hidden");
      notifBtn.setAttribute("aria-label", "Notifications, no unread");
    } else {
      updateUnreadUI();
      updateGreeting();
    }
  }

  function getTeamTabFromHash() {
    const hash = (window.location.hash || "").replace(/^#/, "");
    if (!hash.startsWith("team")) return "overview";
    const parts = hash.split("/");
    const tab = parts[1] || "overview";
    return TEAM_TABS[tab] ? tab : "overview";
  }

  function setTeamTab(tab, { updateHash = true } = {}) {
    let key = TEAM_TABS[tab] ? tab : "overview";
    if (viewTeam?.dataset.viewingAs === "Member" && key === "audit") {
      key = "overview";
    }
    const meta = TEAM_TABS[key];
    document.querySelectorAll(".team-tab").forEach((btn) => {
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
    if (updateHash) {
      const next = `#team/${key}`;
      if (window.location.hash !== next) {
        history.replaceState(null, "", next);
      }
    }
  }

  function setViewingAs(role) {
    if (!viewTeam) return;
    const next = role === "Admin" || role === "Member" ? role : "Owner";
    viewTeam.dataset.viewingAs = next;
    document.querySelectorAll(".viewing-as-btn").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.viewingAs === next);
    });
    if (next === "Member") {
      const activeTab = document.querySelector(".team-tab.is-active")?.dataset.teamTab;
      if (activeTab === "audit") setTeamTab("overview");
    }
  }

  function showView(shell, options = {}) {
    const next = shell === "team" ? "team" : "home";
    currentShell = next;
    if (next === "team") {
      dashboardReturning.hidden = true;
      dashboardNew.hidden = true;
      if (viewTeam) viewTeam.hidden = false;
      if (viewingAs) viewingAs.hidden = false;
      setActiveNav("Team");
      if (breadcrumbRoot) breadcrumbRoot.textContent = "Operations";
      document.title = "Paryatech — Team";
      const tab = options.tab || getTeamTabFromHash();
      setTeamTab(tab, { updateHash: options.updateHash !== false });
      window.scrollTo({ top: 0, behavior: options.smooth === false ? "auto" : "smooth" });
      return;
    }

    if (viewTeam) viewTeam.hidden = true;
    if (viewingAs) viewingAs.hidden = true;
    if (breadcrumbRoot) breadcrumbRoot.textContent = "Workspace";
    applyView(options.dashboardView || resolveView());
    if (window.location.hash.startsWith("#team")) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
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
    document
      .querySelectorAll(
        "#dashboard-returning .attention-item, #dashboard-returning .followup-item, #dashboard-returning .ops-item, #dashboard-returning .activity-item, #dashboard-returning .kpi-card, #dashboard-returning .workload-item"
      )
      .forEach((el) => {
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
    if (currentView !== "returning") return;
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
  initNewUserDashboard();
  if ((window.location.hash || "").startsWith("#team")) {
    showView("team", { smooth: false });
  } else {
    showView("home", { smooth: false, scrollTop: false });
  }

  window.addEventListener("popstate", () => {
    if ((window.location.hash || "").startsWith("#team")) {
      showView("team", { smooth: false, updateHash: false });
    } else {
      showView("home", { smooth: false, scrollTop: false });
    }
  });

  window.addEventListener("hashchange", () => {
    if ((window.location.hash || "").startsWith("#team") && currentShell === "team") {
      setTeamTab(getTeamTabFromHash(), { updateHash: false });
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

      if (name === "Home") {
        showView("home");
        applyDashboardFilter("");
        searchInput.value = "";
        return;
      }

      setActiveNav(name);
      showToast(`Opened ${name}`);
      if (name === "Inbox") {
        if (currentShell === "team") showView("home", { scrollTop: false });
        applyDashboardFilter("");
        searchInput.value = "";
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });

  /* ---------- Team module ---------- */

  document.querySelectorAll(".team-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      setTeamTab(btn.dataset.teamTab);
    });
  });

  document.querySelectorAll(".viewing-as-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      setViewingAs(btn.dataset.viewingAs);
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

  document.querySelectorAll(".roster-filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.rosterFilter || "all";
      document.querySelectorAll(".roster-filter").forEach((f) => f.classList.remove("is-active"));
      btn.classList.add("is-active");
      document.querySelectorAll(".roster-row").forEach((row) => {
        const owned = Number(row.dataset.ownedQueries) || 0;
        const openTasks = Number(row.dataset.openTasks) || 0;
        const winRate = Number(row.dataset.winRate) || 0;
        let match = true;
        if (filter === "high-workload") match = owned >= 10;
        else if (filter === "open-tasks") match = openTasks >= 3;
        else if (filter === "top-win-rate") match = winRate >= 34;
        row.hidden = !match;
      });
    });
  });

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

  document.getElementById("btn-set-targets")?.addEventListener("click", () => {
    if (goalsState.locked) {
      showToast("Completed periods are locked", "error");
      return;
    }
    resetWizard();
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

  const rolesPermTbody = document.getElementById("roles-perm-tbody");
  const rolesSaveBar = document.getElementById("roles-save-bar");
  const rolesSaveStatus = document.getElementById("roles-save-status");
  const rolesSaveBtn = document.getElementById("roles-save-btn");
  const roleChangeModal = document.getElementById("modal-role-change");
  const roleChangeCopy = document.getElementById("role-change-copy");
  const roleChangeCancel = document.getElementById("role-change-cancel");
  const roleChangeConfirm = document.getElementById("role-change-confirm");

  const rolesState = {
    permissions: {},
    savedPermissions: {},
    memberRoles: {},
    savedMemberRoles: {},
    pendingRoleChange: null,
  };

  function snapshotRolePermissions() {
    const map = { Admin: {}, Member: {} };
    document.querySelectorAll(".role-perm-select").forEach((select) => {
      const role = select.dataset.role;
      const moduleId = select.dataset.module;
      if (!map[role] || !moduleId) return;
      map[role][moduleId] = select.value;
    });
    return map;
  }

  rolesState.permissions = snapshotRolePermissions();
  rolesState.savedPermissions = {
    Admin: { ...rolesState.permissions.Admin },
    Member: { ...rolesState.permissions.Member },
  };

  document.querySelectorAll(".role-assign-select").forEach((select) => {
    const id = select.dataset.member;
    if (!id) return;
    rolesState.memberRoles[id] = select.value;
    rolesState.savedMemberRoles[id] = select.value;
    select.dataset.committed = select.value;
  });

  function rolesAreDirty() {
    const current = snapshotRolePermissions();
    const permDirty = ["Admin", "Member"].some((role) =>
      Object.keys(current[role] || {}).some(
        (key) => current[role][key] !== rolesState.savedPermissions[role]?.[key]
      )
    );
    const memberDirty = Object.keys(rolesState.memberRoles).some(
      (id) => rolesState.memberRoles[id] !== rolesState.savedMemberRoles[id]
    );
    return permDirty || memberDirty;
  }

  function updateRolesDirtyUI() {
    const dirty = rolesAreDirty();
    if (rolesSaveBar) rolesSaveBar.classList.toggle("is-dirty", dirty);
    if (rolesSaveStatus) {
      rolesSaveStatus.textContent = dirty ? "Unsaved changes" : "No unsaved changes";
    }
    if (rolesSaveBtn) rolesSaveBtn.disabled = !dirty;
  }

  function describeRolesChanges(currentPermissions) {
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

    ["Admin", "Member"].forEach((role) => {
      Object.keys(currentPermissions[role] || {}).forEach((module) => {
        const previousAccess = rolesState.savedPermissions[role]?.[module];
        const nextAccess = currentPermissions[role][module];
        if (previousAccess === nextAccess) return;
        const moduleLabel =
          document.querySelector(`#roles-perm-tbody tr[data-module="${module}"] td`)?.textContent.trim() ||
          module;
        before.push(`${role} · ${moduleLabel}: ${previousAccess}`);
        after.push(`${role} · ${moduleLabel}: ${nextAccess}`);
      });
    });

    return {
      count: before.length,
      before: before.join("; "),
      after: after.join("; "),
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
      relatedRecord: "Roles & access · Workspace permissions",
      reason: "Role or permission change saved",
    });
  }

  rolesPermTbody?.addEventListener("change", (e) => {
    const select = e.target.closest(".role-perm-select");
    if (!select) return;
    rolesState.permissions = snapshotRolePermissions();
    updateRolesDirtyUI();
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
    rolesState.pendingRoleChange = null;
    closeModal(roleChangeModal);
    updateRolesDirtyUI();
  });

  rolesSaveBtn?.addEventListener("click", () => {
    if (!rolesAreDirty()) return;
    rolesState.permissions = snapshotRolePermissions();
    const auditChanges = describeRolesChanges(rolesState.permissions);
    rolesState.savedPermissions = {
      Admin: { ...rolesState.permissions.Admin },
      Member: { ...rolesState.permissions.Member },
    };
    rolesState.savedMemberRoles = { ...rolesState.memberRoles };
    appendAuditRolesSave(auditChanges);
    updateRolesDirtyUI();
    showToast("Roles & access saved");
  });

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

    document.querySelectorAll("#roles-perm-tbody tr[data-module]").forEach((row) => {
      const moduleId = row.dataset.module || "";
      const moduleLabel = row.querySelector("td")?.textContent?.trim() || "";
      const hay = `${moduleLabel} ${moduleId}`.toLowerCase();
      const match = !query || hay.includes(query);
      row.hidden = !match;
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

  document.querySelectorAll("[data-myview-sub]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sub = btn.dataset.myviewSub;
      document.querySelectorAll("[data-myview-sub]").forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
        b.setAttribute("tabindex", active ? "0" : "-1");
      });
      const isOverview = sub === "overview";
      const split = document.querySelector(".myview-split");
      const kpis = document.querySelector("#team-panel-myview .team-kpi-grid");
      const period = document.querySelector(".myview-period");
      const placeholder = document.getElementById("myview-placeholder");
      if (split) split.hidden = !isOverview;
      if (kpis) kpis.hidden = !isOverview;
      if (period) period.hidden = !isOverview;
      if (placeholder) {
        placeholder.hidden = isOverview;
        if (!isOverview) {
          placeholder.textContent = `${btn.textContent.trim()} charts will appear here in a later pass.`;
        }
      }
    });
  });

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
          <button type="button" class="btn btn-outline btn-xs" data-invite-action="resend">Resend</button>
          <button type="button" class="btn btn-outline btn-xs" data-invite-action="revoke">Revoke</button>
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
