// ===== PSX TRADER - VANILLA JS SPA =====

const API = '';
const svg = {
  home: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
  bell: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>`,
  flame: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"/></svg>`,
  search: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>`,
  refresh: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>`,
  arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>`,
  trendingUp: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>`,
  trendingDown: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/></svg>`,
  minus: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4"/></svg>`,
  crosshair: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4m15.364-4.636l-1.414 1.414M6.05 6.05l1.414 1.414m0 9.192l-1.414 1.414m12.728 0l1.414-1.414"/></svg>`,
  target: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  shield: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`,
  activity: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
  layers: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>`,
  zap: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
  clock: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  chart: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`,
};

// ===== API CLIENT =====
async function apiFetch(url) {
  const r = await fetch(`${API}${url}`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

const api = {
  getStocks: () => apiFetch('/api/stocks'),
  getStock: (s) => apiFetch(`/api/stocks/${s}`),
  searchStocks: (q) => apiFetch(`/api/search?q=${encodeURIComponent(q)}`),
  getOpportunities: (n=10) => apiFetch(`/api/opportunities?limit=${n}`),
  getMarketSummary: () => apiFetch('/api/market/summary'),
  getUnifiedSignal: (s) => apiFetch(`/api/unified-signal/${s}`),
  getUnifiedSignals: (symbols) => fetch(`${API}/api/unified-signals`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({symbols})}).then(r=>r.json()),
  getSMC: (s) => apiFetch(`/api/smc/${s}`),
  getOrderFlow: (s) => apiFetch(`/api/orderflow/${s}`),
  getNewsSignal: () => apiFetch('/api/news/signal'),
  getKSE100Volume: () => apiFetch('/api/kse100/volume'),
  getKMI30Picks: () => apiFetch('/api/kmi30/picks'),
  getKMI30Accuracy: () => apiFetch('/api/kmi30/accuracy'),
  getKMI30Predictions: () => apiFetch('/api/kmi30/predictions'),
  scanKMI30: () => apiFetch('/api/kmi30/scan'),
  getAlertPreview: () => apiFetch('/api/alerts/preview'),
  getLatestAlert: () => apiFetch('/api/alerts/latest'),
  testAlerts: () => apiFetch('/api/alerts/test'),
  getShariahTrades: () => apiFetch('/api/shariah/trades'),
  getInstitutional: () => apiFetch('/api/institutional'),
  getSectors: () => apiFetch('/api/sectors'),
};

// ===== STATE =====
let state = {
  page: 'dashboard',
  symbol: null,
  stocks: [],
  signals: [],
  summary: null,
  loading: true,
  search: '',
  activeTab: 'all',
  refreshing: false,
};

// ===== ROUTER =====
function navigate(page, symbol) {
  state.page = page;
  state.symbol = symbol || null;
  window.scrollTo(0, 0);
  render();
}

// ===== HELPERS =====
function pkTime() {
  return new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit', hour12: true });
}

const sigCfg = {
  STRONG_BUY:  { c: '#22c55e', bg: '#22c55e15', icon: 'trendingUp', l: 'Strong Buy' },
  BUY:         { c: '#84cc16', bg: '#84cc1615', icon: 'trendingUp', l: 'Buy' },
  WAIT:        { c: '#f59e0b', bg: '#f59e0b15', icon: 'minus', l: 'Wait' },
  NEUTRAL:     { c: '#94a3b8', bg: '#94a3b815', icon: 'minus', l: 'Neutral' },
  SELL:        { c: '#f97316', bg: '#f9731615', icon: 'trendingDown', l: 'Sell' },
  STRONG_SELL: { c: '#ef4444', bg: '#ef444415', icon: 'trendingDown', l: 'Strong Sell' },
};

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// ===== COMPONENTS =====

function BottomNav() {
  const items = [
    { p: 'dashboard', i: 'home', l: 'Signals' },
    { p: 'alerts', i: 'bell', l: 'Alerts' },
    { p: 'kmi30', i: 'flame', l: 'KMI-30' },
  ];
  return `<nav class="bottom-nav">${items.map(it =>
    `<button class="nav-btn ${state.page === it.p ? 'active' : ''}" onclick="navigate('${it.p}')">${svg[it.i]}${it.l}</button>`
  ).join('')}</nav>`;
}

function Loading(msg) {
  return `<div class="loading"><div class="spinner spin"></div><p class="loading-text">${esc(msg)}</p></div>`;
}

// ===== DASHBOARD =====
async function loadDashboard(force) {
  if (!force && state.stocks.length > 0) return;
  state.loading = true; state.refreshing = !!force; render();
  try {
    const [sr, mr] = await Promise.all([api.getStocks(), api.getMarketSummary()]);
    if (sr.success) state.stocks = sr.data;
    if (mr.success) state.summary = mr.data;
    if (state.stocks.length > 0) {
      const top = state.stocks.filter(s => s.volume > 50000 && s.price > 0)
        .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
        .slice(0, 15).map(s => s.symbol);
      if (top.length > 0) {
        const ur = await api.getUnifiedSignals(top);
        if (ur.success) state.signals = ur.data;
      }
    }
  } catch (e) { console.error(e); }
  state.loading = false; state.refreshing = false; render();
}

function DashboardPage() {
  if (state.loading) return Loading('Loading PSX data...');
  const q = state.search.toLowerCase();
  const filtered = q ? state.stocks.filter(s => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)) : [];
  const buys = state.signals.filter(s => s.signal === 'BUY' || s.signal === 'STRONG_BUY');
  const sells = state.signals.filter(s => s.signal === 'SELL' || s.signal === 'STRONG_SELL');
  const waits = state.signals.filter(s => s.signal === 'WAIT' || s.signal === 'NEUTRAL');
  const disp = state.activeTab === 'buy' ? buys : state.activeTab === 'sell' ? sells : state.activeTab === 'wait' ? waits : state.signals;

  let html = `<div class="fade-in">`;

  // Header
  html += `<div class="header"><div><div class="header-title">${svg.chart}<h1>PSX Trader</h1></div><div class="header-time">${pkTime()} PKT</div></div><button class="btn-refresh ${state.refreshing ? 'spin' : ''}" onclick="loadDashboard(true)">${svg.refresh}</button></div>`;

  // Summary
  if (state.summary) {
    const sm = state.summary;
    html += `<div class="page"><div class="summary-bar"><div class="summary-item"><div class="summary-label">Stocks</div><div class="summary-value">${sm.active}</div></div><div class="summary-div"></div><div class="summary-item"><div class="summary-label">Gainers</div><div class="summary-value summary-green">${sm.gainers}</div></div><div class="summary-div"></div><div class="summary-item"><div class="summary-label">Losers</div><div class="summary-value summary-red">${sm.losers}</div></div><div class="summary-div"></div><div class="summary-item"><div class="summary-label">Avg Chg</div><div class="summary-value ${sm.avgChange >= 0 ? 'summary-green' : 'summary-red'}">${sm.avgChange >= 0 ? '+' : ''}${sm.avgChange.toFixed(2)}%</div></div></div></div>`;
  }

  // Search
  html += `<div class="page"><div class="search-wrap">${svg.search}<input class="search-input" placeholder="Search stock symbol or name..." value="${esc(state.search)}" oninput="state.search=this.value;render()"></div>`;

  // Tabs
  if (!q) {
    const tabs = [
      { k: 'all', l: `All (${state.signals.length})` },
      { k: 'buy', l: `Buy (${buys.length})`, cl: 'tab-green' },
      { k: 'sell', l: `Sell (${sells.length})`, cl: 'tab-red' },
      { k: 'wait', l: `Wait (${waits.length})`, cl: 'tab-amber' },
    ];
    html += `<div class="tabs">${tabs.map(t => `<button class="tab ${t.cl || ''} ${state.activeTab === t.k ? 'active' : ''}" onclick="state.activeTab='${t.k}';render()">${esc(t.l)}</button>`).join('')}</div>`;
  }

  // Signals / Search Results
  if (q && filtered.length > 0) {
    filtered.slice(0, 20).forEach(s => {
      html += `<div class="signal-card" onclick="navigate('detail','${s.symbol}')"><div class="signal-header"><div class="signal-stock"><div><div class="signal-symbol">${esc(s.symbol)}</div><div class="signal-name">${esc(s.name)}</div></div></div><div class="signal-price"><div class="signal-price-val">Rs${s.price.toFixed(2)}</div><div class="signal-change ${s.changePercent >= 0 ? 'summary-green' : 'summary-red'}">${s.changePercent >= 0 ? '+' : ''}${s.changePercent.toFixed(2)}%</div></div></div></div>`;
    });
  } else if (!q && disp.length > 0) {
    disp.forEach(sig => { html += SignalCard(sig); });
  } else {
    html += `<div class="empty">${svg.activity}<p>No ${q ? 'results' : 'signals'} found</p>${!q ? '<p style="font-size:12px;margin-top:4px">Try refreshing or check during market hours</p>' : ''}</div>`;
  }

  html += `</div></div>`;
  return html;
}

function SignalCard(sig) {
  const c = sigCfg[sig.signal] || sigCfg.NEUTRAL;
  const buy = sig.signal === 'BUY' || sig.signal === 'STRONG_BUY';
  const e = sig.levels?.entry;
  const t = sig.levels?.target;
  const sl = sig.levels?.stopLoss;
  let h = `<div class="signal-card fade-in" onclick="navigate('detail','${sig.symbol}')">`;
  h += `<div class="signal-header"><div class="signal-stock"><div class="signal-icon-box" style="background:${c.bg}">${svg[c.icon]}</div><div><div class="signal-symbol">${esc(sig.symbol)}</div><div class="signal-name">${esc(sig.name || '')}</div></div></div><div class="signal-price"><div class="signal-price-val">Rs${sig.price?.toFixed(2)}</div><div class="signal-change ${sig.changePercent >= 0 ? 'summary-green' : 'summary-red'}">${sig.changePercent >= 0 ? '+' : ''}${sig.changePercent?.toFixed(2)}%</div></div></div>`;
  h += `<div class="signal-badge" style="background:${c.bg};color:${c.c}">${c.label} <span style="opacity:.7">|</span> ${sig.confidence}% conf</div>`;
  if (e || t || sl) {
    h += `<div class="levels">`;
    if (e) h += `<div class="level level-entry"><div class="level-label">${svg.crosshair} ENTRY</div><div class="level-value">Rs${typeof e === 'number' ? e.toFixed(2) : e}</div></div>`;
    if (t) h += `<div class="level level-target"><div class="level-label">${svg.target} TARGET</div><div class="level-value">Rs${typeof t === 'number' ? t.toFixed(2) : t}</div></div>`;
    if (sl) h += `<div class="level level-sl"><div class="level-label">${svg.shield} SL</div><div class="level-value">Rs${typeof sl === 'number' ? sl.toFixed(2) : sl}</div></div>`;
    h += `</div>`;
  }
  if (sig.description) h += `<p class="signal-desc">${esc(sig.description)}</p>`;
  h += `<div class="signal-footer"><span>RSI: ${sig.rsi?.toFixed(0) || 'N/A'}</span><span>Vol: ${(sig.volume / 1000).toFixed(0)}K</span><span>Risk: ${sig.risk}</span></div>`;
  if (sig.sources?.length) h += `<div class="signal-sources">${sig.sources.map(s => `<span class="source-tag">${esc(s)}</span>`).join('')}</div>`;
  h += `</div>`;
  return h;
}

// ===== STOCK DETAIL =====
async function loadDetail(symbol) {
  state.loading = true; render();
  try {
    const [sr, kr] = await Promise.all([api.getUnifiedSignal(symbol), api.getStock(symbol)]);
    state.detailSignal = sr.success ? sr.data : null;
    state.detailStock = kr.success ? kr.data : null;
    state.detailSMC = null;
    state.detailFlow = null;
    state.detailSection = 'overview';
  } catch (e) { console.error(e); }
  state.loading = false; render();
}

async function loadDetailSection(section) {
  state.detailSection = section;
  render();
  if (section === 'smc' && !state.detailSMC && state.symbol) {
    try { state.detailSMC = await api.getSMC(state.symbol); } catch (e) {}
    render();
  }
  if (section === 'flow' && !state.detailFlow && state.symbol) {
    try { state.detailFlow = await api.getOrderFlow(state.symbol); } catch (e) {}
    render();
  }
}

function DetailPage() {
  if (state.loading) return Loading(`Loading ${state.symbol}...`);
  const sig = state.detailSignal;
  if (!sig) return `<div class="page" style="padding-top:24px"><button class="btn-back" onclick="navigate('dashboard')">${svg.arrowLeft} Back</button><div class="empty"><p>No signal data for ${esc(state.symbol)}</p></div></div>`;

  const c = sigCfg[sig.signal] || sigCfg.NEUTRAL;
  const e = sig.levels?.entry, t = sig.levels?.target, sl = sig.levels?.stopLoss;
  let rr = null;
  if (e && t && sl && typeof e === 'number' && typeof t === 'number' && typeof sl === 'number') {
    const risk = Math.abs(e - sl), reward = Math.abs(t - e);
    if (risk > 0) rr = (reward / risk).toFixed(1);
  }

  let h = `<div class="fade-in">`;
  // Header
  h += `<div class="detail-header"><button class="btn-back" onclick="navigate('dashboard')">${svg.arrowLeft}</button><div><h1 style="font-size:22px;font-weight:800;color:#f1f5f9">${esc(sig.symbol)}</h1><p style="font-size:12px;color:#64748b">${esc(sig.name || '')}</p></div></div>`;

  // Hero
  h += `<div class="page"><div class="detail-hero"><div class="detail-price-row"><div><div class="detail-price">Rs${sig.price?.toFixed(2)}</div><div class="detail-change ${sig.changePercent >= 0 ? 'summary-green' : 'summary-red'}">${sig.changePercent >= 0 ? '+' : ''}${sig.changePercent?.toFixed(2)}% ${svg[sig.changePercent >= 0 ? 'trendingUp' : 'trendingDown']}</div></div><div class="detail-signal-badge" style="background:${c.bg}">${svg[c.icon]}<span style="color:${c.c};font-weight:700;font-size:14px">${c.label}</span></div></div>`;

  // Description
  if (sig.description) h += `<div class="detail-desc"><p>${esc(sig.description)}</p></div>`;

  // Metrics
  h += `<div class="detail-metrics"><div class="metric"><div class="metric-label">Confidence</div><div class="metric-value" style="color:#3b82f6">${sig.confidence}%</div></div><div class="metric"><div class="metric-label">Risk</div><div class="metric-value" style="color:${sig.risk === 'LOW' ? '#22c55e' : sig.risk === 'MEDIUM' ? '#f59e0b' : '#ef4444'}">${sig.risk}</div></div>${rr ? `<div class="metric"><div class="metric-label">R:R Ratio</div><div class="metric-value" style="color:#a855f7">1:${rr}</div></div>` : ''}</div></div>`;

  // Trading Levels
  h += `<div class="page" style="margin-bottom:16px"><h2 style="font-size:14px;font-weight:700;color:#94a3b8;margin-bottom:10px;display:flex;align-items:center;gap:6px">${svg.crosshair} Trading Levels</h2><div class="levels">`;
  if (e) h += `<div class="level level-entry" style="flex:1"><div class="level-label">${svg.crosshair} ENTRY</div><div class="level-value" style="font-size:22px">Rs${typeof e === 'number' ? e.toFixed(2) : e}</div>${state.detailStock ? `<div style="font-size:11px;color:#64748b;margin-top:4px">${((e / sig.price - 1) * 100).toFixed(1)}% vs current</div>` : ''}</div>`;
  if (t) h += `<div class="level level-target" style="flex:1"><div class="level-label">${svg.target} TARGET</div><div class="level-value" style="font-size:22px">Rs${typeof t === 'number' ? t.toFixed(2) : t}</div>${typeof e === 'number' && typeof t === 'number' ? `<div style="font-size:11px;color:#64748b;margin-top:4px">+${((t / e - 1) * 100).toFixed(1)}% gain</div>` : ''}</div>`;
  if (sl) h += `<div class="level level-sl" style="flex:1"><div class="level-label">${svg.shield} STOP LOSS</div><div class="level-value" style="font-size:22px">Rs${typeof sl === 'number' ? sl.toFixed(2) : sl}</div>${typeof e === 'number' && typeof sl === 'number' ? `<div style="font-size:11px;color:#64748b;margin-top:4px">-${((1 - sl / e) * 100).toFixed(1)}% risk</div>` : ''}</div>`;
  h += `</div></div>`;

  // Pivot levels
  if (sig.levels?.pivot > 0) {
    h += `<div class="page" style="margin-bottom:16px"><h2 style="font-size:14px;font-weight:700;color:#94a3b8;margin-bottom:10px;display:flex;align-items:center;gap:6px">${svg.layers} Pivot Levels</h2><div style="display:flex;gap:6">`;
    ['r2','r1','pivot','s1','s2'].forEach(key => {
      const v = sig.levels[key];
      if (!v || typeof v !== 'number' || v <= 0) return;
      const cur = Math.abs(sig.price - v) / sig.price < 0.005;
      h += `<div style="flex:1;background:${cur ? '#3b82f630' : '#1e293b'};border:1px solid ${cur ? '#3b82f6' : '#334155'};border-radius:10px;padding:8px 4px;text-align:center"><div style="font-size:9px;color:#64748b;text-transform:uppercase;font-weight:700;margin-bottom:2px">${key}</div><div style="font-size:13px;font-weight:700;color:${cur ? '#3b82f6' : '#f1f5f9'}">${v.toFixed(1)}</div></div>`;
    });
    h += `</div></div>`;
  }

  // Section tabs
  h += `<div class="page"><div class="detail-sections">`;
  const secs = [
    { k: 'overview', l: 'Overview', i: 'activity' },
    { k: 'smc', l: 'SMC', i: 'chart' },
    { k: 'flow', l: 'Flow', i: 'zap' },
  ];
  secs.forEach(s => { h += `<button class="section-btn ${state.detailSection === s.k ? 'active' : ''}" onclick="loadDetailSection('${s.k}')">${svg[s.i]} ${s.l}</button>`; });
  h += `</div></div>`;

  // Section content
  h += `<div class="page" style="margin-bottom:24px">`;
  if (state.detailSection === 'overview') {
    h += `<div class="detail-content">`;
    if (state.detailStock) {
      const st = state.detailStock;
      const stats = [
        ['Open', `Rs${st.open?.toFixed(2)}`], ['High', `Rs${st.high?.toFixed(2)}`],
        ['Low', `Rs${st.low?.toFixed(2)}`], ['Prev Close', `Rs${st.prevClose?.toFixed(2)}`],
        ['Volume', `${(st.volume / 1000).toFixed(0)}K`], ['10d Avg Vol', `${(st.volAvg10d / 1000).toFixed(0)}K`],
        ['RSI', st.rsi?.toFixed(1) || 'N/A', st.rsi > 70 ? '#ef4444' : st.rsi < 30 ? '#22c55e' : '#94a3b8'],
        ['Spread', `${st.spreadPct?.toFixed(2)}%`],
      ];
      stats.forEach(([l, v, col]) => { h += `<div class="stat-row"><span class="stat-label">${esc(l)}</span><span class="stat-value" style="color:${col || '#f1f5f9'}">${esc(v)}</span></div>`; });
    }
    h += `</div>`;
    // Score bar
    h += `<div class="detail-content" style="margin-top:10px"><div style="font-size:13px;font-weight:700;color:#94a3b8;margin-bottom:10px">Signal Score: ${sig.score}</div><div style="width:100%;height:8px;background:#0f172a;border-radius:4px;overflow:hidden"><div style="width:${Math.min(100, Math.max(0, 50 + sig.score))}%;height:100%;background:${sig.score > 0 ? '#22c55e' : sig.score < 0 ? '#ef4444' : '#94a3b8'};border-radius:4px;transition:width .5s"></div></div><div style="display:flex;justify-content:space-between;margin-top:4px"><span style="font-size:10px;color:#ef4444">Sell</span><span style="font-size:10px;color:#94a3b8">Neutral</span><span style="font-size:10px;color:#22c55e">Buy</span></div></div>`;
  }
  if (state.detailSection === 'smc') {
    h += `<div class="detail-content">`;
    const smc = state.detailSMC;
    if (!smc) h += `<div class="loading" style="height:100px"><div class="spinner spin"></div></div>`;
    else if (!smc.fvg?.length && !smc.orderBlocks?.length && !smc.liquiditySweeps?.length && !smc.bos?.length && !smc.choch?.length) {
      h += `<div class="empty">No SMC signals detected</div>`;
    } else {
      const sections = [
        { t: 'Fair Value Gaps', k: 'fvg', col: '#a855f7' },
        { t: 'Order Blocks', k: 'orderBlocks', col: '#3b82f6' },
        { t: 'Liquidity Sweeps', k: 'liquiditySweeps', col: '#f59e0b' },
        { t: 'Break of Structure', k: 'bos', col: '#22c55e' },
        { t: 'Change of Character', k: 'choch', col: '#06b6d4' },
      ];
      sections.forEach(sec => {
        const items = smc[sec.k];
        if (items?.length) {
          h += `<div style="margin-bottom:12px"><div style="font-size:13px;font-weight:700;color:${sec.col};margin-bottom:6px">${esc(sec.t)}</div>`;
          items.forEach((it, i) => { h += `<div class="smc-item" style="${i > 0 ? 'border-top:1px solid #334155' : ''}"><div class="smc-text">${esc(it.message)}</div></div>`; });
          h += `</div>`;
        }
      });
    }
    h += `</div>`;
  }
  if (state.detailSection === 'flow') {
    h += `<div class="detail-content">`;
    const flow = state.detailFlow;
    if (!flow) h += `<div class="loading" style="height:100px"><div class="spinner spin"></div></div>`;
    else if (!flow.ready) h += `<div class="empty">${esc(flow.message || 'Collecting order flow data...')}</div>`;
    else {
      h += `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><span style="font-size:13px;color:#94a3b8">Overall Ratio</span><span style="font-size:20px;font-weight:800;color:${flow.color}">${flow.overallRatio}</span></div>`;
      h += `<div style="font-size:13px;color:${flow.color};font-weight:600;margin-bottom:8px">${esc(flow.signal)}</div>`;
      h += `<div style="font-size:12px;color:#64748b;margin-bottom:12px">${flow.snapshots} snapshots over ${flow.windowMinutes}min</div>`;
      h += `<div style="display:flex;gap:8;margin-bottom:12px"><div style="flex:1;background:#22c55e15;border-radius:12px;padding:12px;text-align:center"><div style="font-size:11px;color:#22c55e;font-weight:600">BID VOL</div><div style="font-size:16px;font-weight:700;color:#22c55e">${(flow.totalBidVolume / 1000).toFixed(0)}K</div></div><div style="flex:1;background:#ef444415;border-radius:12px;padding:12px;text-align:center"><div style="font-size:11px;color:#ef4444;font-weight:600">ASK VOL</div><div style="font-size:16px;font-weight:700;color:#ef4444">${(flow.totalAskVolume / 1000).toFixed(0)}K</div></div></div>`;
      h += `<div><div style="font-size:13px;color:#94a3b8;margin-bottom:8px">Trend</div><div style="font-size:16px;font-weight:700;color:${flow.color}">${esc(flow.trend)}</div><div style="font-size:12px;color:#64748b;margin-top:4px">1st half: ${flow.firstHalfRatio} -> 2nd half: ${flow.secondHalfRatio}</div></div>`;
    }
    h += `</div>`;
  }
  h += `</div></div>`;
  return h;
}

// ===== ALERTS =====
async function loadAlerts() {
  state.loading = true; render();
  try {
    const [pr, lr] = await Promise.all([api.getAlertPreview(), api.getLatestAlert()]);
    state.alertData = pr.success ? pr.data : null;
    state.latestAlert = lr.success ? lr.latest : null;
  } catch (e) { console.error(e); }
  state.loading = false; render();
}

async function sendTestAlert() {
  state.refreshing = true; render();
  try { await api.testAlerts(); await loadAlerts(); } catch (e) { console.error(e); }
  state.refreshing = false; render();
}

function AlertsPage() {
  if (state.loading) return Loading('Loading alerts...');
  let h = `<div class="fade-in">`;
  h += `<div class="header"><div><div class="header-title">${svg.bell}<h1>Alerts</h1></div></div><button class="btn-refresh ${state.refreshing ? 'spin' : ''}" onclick="loadAlerts(true)">${svg.refresh}</button></div>`;
  h += `<div class="page"><button class="scan-btn" onclick="sendTestAlert()">${svg.refresh} Send Test Alert Now</button>`;

  if (state.latestAlert) {
    const la = state.latestAlert;
    h += `<div class="alert-box" style="background:${la.count > 0 ? '#22c55e15' : '#f59e0b15'};border:2px solid ${la.count > 0 ? '#22c55e' : '#f59e0b'}"><div class="alert-header">${la.count > 0 ? svg.trendingUp : svg.bell}<span class="alert-title" style="color:${la.count > 0 ? '#22c55e' : '#f59e0b'}">${la.count > 0 ? `${la.count} Picks Found` : 'No Picks'}</span></div><div class="alert-time">${svg.clock} ${esc(la.timePKT)}</div>`;
    if (la.symbols?.length) h += `<div class="alert-symbols">${la.symbols.map(s => `<span class="alert-symbol">${esc(s)}</span>`).join('')}</div>`;
    if (la.message) h += `<div class="alert-message">${esc(la.message)}</div>`;
    h += `</div>`;
  }

  // Market Context
  if (state.alertData?.marketContext) {
    const mc = state.alertData.marketContext;
    h += `<h2 style="font-size:14px;font-weight:700;color:#94a3b8;margin-bottom:10px">Market Context</h2><div class="detail-content"><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">`;
    h += `<div><div style="font-size:11px;color:#64748b">News Sentiment</div><div style="font-size:14px;font-weight:700;color:#f1f5f9">${esc(mc.newsSentiment)}</div></div>`;
    h += `<div><div style="font-size:11px;color:#64748b">News Signal</div><div style="font-size:14px;font-weight:700;color:#f1f5f9">${esc(mc.newsSignal)}</div></div>`;
    h += `<div><div style="font-size:11px;color:#64748b">Shariah Picks</div><div style="font-size:14px;font-weight:700;color:#f1f5f9">${mc.shariahCount}</div></div>`;
    h += `<div><div style="font-size:11px;color:#64748b">Total Picks</div><div style="font-size:14px;font-weight:700;color:#f1f5f9">${mc.totalPicks}</div></div>`;
    h += `</div></div>`;
  }

  // Alert stocks
  if (state.alertData?.alerts?.length) {
    h += `<h2 style="font-size:14px;font-weight:700;color:#94a3b8;margin:16px 0 10px">Pick Details</h2>`;
    state.alertData.alerts.forEach((a, i) => {
      const buy = a.signal === 'BUY' || a.signal === 'STRONG_BUY';
      const sell = a.signal === 'SELL' || a.signal === 'STRONG_SELL';
      const ac = buy ? '#22c55e' : sell ? '#ef4444' : '#f59e0b';
      h += `<div style="background:#1e293b;border-radius:12px;padding:14px;border:1px solid #334155;margin-bottom:10px;border-left:4px solid ${ac}"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><div style="display:flex;align-items:center;gap:8px"><span style="font-size:16px;font-weight:700;color:#f1f5f9">${esc(a.symbol)}</span><span style="font-size:11px;color:#64748b">${esc(a.name || '')}</span></div><span style="font-size:12px;font-weight:700;padding:3px 10px;border-radius:10px;background:${ac}20;color:${ac}">${esc(a.signalMeta?.action || a.signal)}</span></div>`;
      h += `<div style="display:flex;gap:12px;margin-bottom:8px;font-size:12px;color:#94a3b8"><span>Rs${a.price?.toFixed(2)}</span><span style="color:${a.changePercent >= 0 ? '#22c55e' : '#ef4444'}">${a.changePercent >= 0 ? '+' : ''}${a.changePercent?.toFixed(2)}%</span><span>Conf: ${a.confidence}%</span><span>Risk: ${a.risk}</span></div>`;
      if (a.levels) {
        h += `<div style="display:flex;gap:6;margin-bottom:8px">`;
        if (a.levels.entry) h += `<span style="font-size:11px;padding:3px 8px;border-radius:8px;background:#22c55e20;color:#22c55e;font-weight:600">E: Rs${typeof a.levels.entry === 'number' ? a.levels.entry.toFixed(2) : a.levels.entry}</span>`;
        if (a.levels.target) h += `<span style="font-size:11px;padding:3px 8px;border-radius:8px;background:#3b82f620;color:#3b82f6;font-weight:600">T: Rs${typeof a.levels.target === 'number' ? a.levels.target.toFixed(2) : a.levels.target}</span>`;
        if (a.levels.stopLoss) h += `<span style="font-size:11px;padding:3px 8px;border-radius:8px;background:#ef444420;color:#ef4444;font-weight:600">SL: Rs${typeof a.levels.stopLoss === 'number' ? a.levels.stopLoss.toFixed(2) : a.levels.stopLoss}</span>`;
        h += `</div>`;
      }
      if (a.description) h += `<p style="font-size:12px;color:#94a3b8;line-height:1.5">${esc(a.description)}</p>`;
      h += `</div>`;
    });
  }

  if (!state.alertData?.alerts?.length) {
    h += `<div class="empty">${svg.bell}<p>No alerts available</p><p style="font-size:12px;margin-top:4px">Try sending a test alert</p></div>`;
  }
  h += `</div></div>`;
  return h;
}

// ===== KMI30 =====
async function loadKMI30() {
  state.loading = true; render();
  try {
    const [pr, ar, prr] = await Promise.all([api.getKMI30Picks(), api.getKMI30Accuracy(), api.getKMI30Predictions()]);
    if (pr.success) state.kmiPicks = pr.data;
    if (ar.success) state.kmiAccuracy = ar.data;
    if (prr.success) state.kmiPredictions = prr.data;
  } catch (e) { console.error(e); }
  state.loading = false; render();
}

async function scanKMI30() {
  state.refreshing = true; render();
  try { await api.scanKMI30(); await loadKMI30(); } catch (e) { console.error(e); }
  state.refreshing = false; render();
}

function KMI30Page() {
  if (state.loading) return Loading('Loading KMI-30 picks...');
  let h = `<div class="fade-in">`;
  h += `<div class="header"><div><div class="header-title">${svg.flame}<h1>KMI-30</h1></div><div class="header-time">Intraday 15min Setups</div></div><button class="btn-refresh ${state.refreshing ? 'spin' : ''}" onclick="loadKMI30(true)">${svg.refresh}</button></div>`;
  h += `<div class="page"><button class="scan-btn" onclick="scanKMI30()">${svg.refresh} Scan Now</button>`;

  if (state.kmiAccuracy) {
    const a = state.kmiAccuracy;
    h += `<div class="acc-bar"><div class="summary-item"><div class="summary-label">Accuracy</div><div class="summary-value summary-green">${a.accuracy}%</div></div><div class="summary-div"></div><div class="summary-item"><div class="summary-label">Wins</div><div class="summary-value summary-green">${a.wins}</div></div><div class="summary-div"></div><div class="summary-item"><div class="summary-label">Losses</div><div class="summary-value summary-red">${a.losses}</div></div><div class="summary-div"></div><div class="summary-item"><div class="summary-label">Expired</div><div class="summary-value" style="color:#f59e0b">${a.expired}</div></div></div>`;
  }

  if (state.kmiPredictions) {
    const p = state.kmiPredictions;
    h += `<div style="display:flex;gap:8;margin-bottom:16px"><div style="flex:1;background:#3b82f615;border-radius:12px;padding:12px;text-align:center;border:1px solid #3b82f620"><div style="font-size:11px;color:#3b82f6;font-weight:600">Active</div><div style="font-size:18px;font-weight:800;color:#3b82f6">${p.active}</div></div><div style="flex:1;background:#22c55e15;border-radius:12px;padding:12px;text-align:center;border:1px solid #22c55e20"><div style="font-size:11px;color:#22c55e;font-weight:600">Completed</div><div style="font-size:18px;font-weight:800;color:#22c55e">${p.completed}</div></div></div>`;
  }

  h += `<h2 style="font-size:14px;font-weight:700;color:#94a3b8;margin-bottom:12px;display:flex;align-items:center;gap:6px">${svg.flame} Top Setups (${state.kmiPicks?.length || 0})</h2>`;

  if (state.kmiPicks?.length) {
    state.kmiPicks.forEach((pick, i) => {
      h += `<div style="background:#1e293b;border-radius:16px;padding:16px;border:1px solid #334155;margin-bottom:12px;border-left:4px solid #a855f7"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><div style="display:flex;align-items:center;gap:10px"><div class="kmi-score" style="background:#a855f720;color:#a855f7">${pick.score}</div><div><div style="font-size:16px;font-weight:700;color:#f1f5f9">${esc(pick.symbol)}</div><div style="font-size:11px;color:#64748b">${esc(pick.name)} - ${esc(pick.sector)}</div></div></div><div style="text-align:right"><div style="font-size:15px;font-weight:700;color:#f1f5f9">Rs${pick.price?.toFixed(2)}</div><div style="font-size:12px;color:${pick.changePercent >= 0 ? '#22c55e' : '#ef4444'};font-weight:600">${pick.changePercent >= 0 ? '+' : ''}${pick.changePercent?.toFixed(2)}%</div></div></div>`;

      if (pick.reasons?.length) {
        h += `<div style="display:flex;flex-wrap:wrap;gap:4;margin-bottom:10px">${pick.reasons.map(r => `<span style="font-size:10px;padding:3px 8px;border-radius:8px;background:#a855f720;color:#a855f7;font-weight:600">${esc(r)}</span>`).join('')}</div>`;
      }

      h += `<div class="levels"><div class="level level-entry" style="flex:1"><div class="level-label">${svg.crosshair} ENTRY</div><div class="level-value" style="font-size:16px">Rs${pick.entry?.toFixed(2)}</div></div><div class="level level-target" style="flex:1"><div class="level-label">${svg.target} TARGET</div><div class="level-value" style="font-size:16px">Rs${pick.target?.toFixed(2)}</div></div><div class="level level-sl" style="flex:1"><div class="level-label">${svg.shield} SL</div><div class="level-value" style="font-size:16px">Rs${pick.stopLoss?.toFixed(2)}</div></div></div>`;

      h += `<div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;font-size:11px;color:#64748b"><span>RR: ${pick.riskReward}x</span><span>RSI: ${pick.rsi?.toFixed(0)}</span><span>Vol: ${(pick.volume / 1000).toFixed(0)}K</span><span>~${pick.expectedHoldMinutes}min</span></div>`;
      if (pick.rationale) h += `<p style="font-size:11px;color:#64748b;margin-top:8px;line-height:1.5;font-style:italic">${esc(pick.rationale)}</p>`;
      h += `</div>`;
    });
  } else {
    h += `<div class="empty">${svg.flame}<p>No KMI-30 setups found</p><p style="font-size:12px;margin-top:4px">Try scanning now or check during market hours</p></div>`;
  }

  // Best symbols
  if (state.kmiAccuracy?.bestSymbols?.length) {
    h += `<h2 style="font-size:14px;font-weight:700;color:#94a3b8;margin:16px 0 10px">Best Performing Symbols</h2>`;
    state.kmiAccuracy.bestSymbols.forEach((s, i) => {
      h += `<div style="background:#1e293b;border-radius:10px;padding:12px;border:1px solid #334155;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center"><div style="display:flex;align-items:center;gap:10px"><div style="font-size:14px;font-weight:800;color:#a855f7">#${i + 1}</div><span style="font-size:14px;font-weight:600;color:#f1f5f9">${esc(s.symbol)}</span></div><div style="display:flex;gap:12px;align-items:center"><span style="font-size:12px;color:#64748b">${s.total} trades</span><span style="font-size:14px;font-weight:700;color:#22c55e">${s.accuracy}%</span></div></div>`;
    });
  }

  h += `</div></div>`;
  return h;
}

// ===== RENDER =====
function render() {
  const app = document.getElementById('app');
  let content = '';
  switch (state.page) {
    case 'dashboard': content = DashboardPage(); break;
    case 'detail': content = DetailPage(); break;
    case 'alerts': content = AlertsPage(); break;
    case 'kmi30': content = KMI30Page(); break;
    default: content = DashboardPage();
  }
  app.innerHTML = content + BottomNav();
}

// ===== INIT =====
window.navigate = navigate;
window.loadDashboard = loadDashboard;
window.loadDetail = loadDetail;
window.loadDetailSection = loadDetailSection;
window.loadAlerts = loadAlerts;
window.sendTestAlert = sendTestAlert;
window.loadKMI30 = loadKMI30;
window.scanKMI30 = scanKMI30;
window.state = state;
window.render = render;

document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
});
