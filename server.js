require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
const apiRoutes = require('./routes/api');

const { sendAlerts } = require('./services/alertService');
const { createKMI30Predictions, checkKMI30Predictions } = require('./services/kmi30PredictService');

const app = express();
const PORT = process.env.PORT || 5001;

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(express.json());

// ========== STATIC FILES (Frontend) ==========
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

// ========== API ROUTES ==========
app.use('/api', apiRoutes);

// ========== HEALTH CHECK ==========
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), market: isMarketOpen() });
});

// ========== MOBILE ALERTS PAGE ==========
app.get('/alerts/mobile', async (req, res) => {
  try {
    const alertLogger = require('./services/alertLoggerService');
    const kmi30Service = require('./services/kmi30PredictService');
    
    const latest = await alertLogger.getLatest();
    const logs = await alertLogger.getLogs(20);
    const kmi30 = await kmi30Service.scanKMI30().catch(() => []);
    const timePKT = new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>PSX Alerts</title>
  <meta http-equiv="refresh" content="30">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; padding: 16px; padding-bottom: 100px; }
    .header { text-align: center; margin-bottom: 12px; position: relative; }
    .header h1 { font-size: 18px; color: #fbbf24; }
    .time { font-size: 12px; color: #64748b; margin-top: 4px; }
    .top-bar { display: flex; gap: 10px; margin-bottom: 14px; }
    .btn { flex: 1; border: none; border-radius: 10px; padding: 12px; font-size: 13px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }
    .btn-refresh { background: #3b82f6; color: white; }
    .btn-refresh:active { background: #2563eb; }
    .btn-sound { background: #22c55e; color: white; }
    .btn-sound.off { background: #ef4444; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .status { text-align: center; font-size: 12px; color: #94a3b8; margin-bottom: 10px; min-height: 18px; }
    .status.ok { color: #22c55e; }
    .status.err { color: #ef4444; }
    .alert-box { background: #1e293b; border-radius: 12px; padding: 14px; margin-bottom: 14px; border-left: 4px solid #22c55e; }
    .alert-box.no-alert { border-left-color: #f59e0b; }
    .alert-box pre { white-space: pre-wrap; word-wrap: break-word; font-size: 13px; line-height: 1.5; color: #e2e8f0; font-family: inherit; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; margin-bottom: 8px; }
    .badge.ok { background: #22c55e20; color: #22c55e; }
    .badge.no { background: #f59e0b20; color: #f59e0b; }
    .kmi30-box { background: #1e293b; border-radius: 12px; padding: 14px; margin-bottom: 14px; border-left: 4px solid #a855f7; }
    .kmi30-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .kmi30-title { font-size: 13px; font-weight: 700; color: #a855f7; }
    .kmi30-count { font-size: 11px; background: #a855f720; color: #a855f7; padding: 2px 8px; border-radius: 10px; }
    .kmi30-item { border-top: 1px solid #334155; padding: 10px 0; }
    .kmi30-item:first-of-type { border-top: none; }
    .kmi30-symbol { font-size: 14px; font-weight: 700; color: #e2e8f0; }
    .kmi30-levels { font-size: 12px; color: #94a3b8; margin-top: 4px; display: flex; gap: 12px; flex-wrap: wrap; }
    .kmi30-levels span { white-space: nowrap; }
    .kmi30-entry { color: #22c55e; font-weight: 600; }
    .kmi30-target { color: #3b82f6; font-weight: 600; }
    .kmi30-sl { color: #ef4444; font-weight: 600; }
    .kmi30-rr { color: #f59e0b; font-weight: 600; }
    .kmi30-rationale { font-size: 11px; color: #64748b; margin-top: 4px; line-height: 1.4; }
    .kmi30-score { font-size: 10px; color: #94a3b8; margin-top: 2px; }
    .history { margin-top: 10px; }
    .history h2 { font-size: 14px; color: #94a3b8; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
    .hist-item { background: #1e293b; border-radius: 10px; margin-bottom: 8px; overflow: hidden; cursor: pointer; transition: background 0.15s; }
    .hist-item:active { background: #334155; }
    .hist-header { padding: 12px; display: flex; justify-content: space-between; align-items: center; }
    .hist-left { display: flex; flex-direction: column; gap: 2px; }
    .hist-time { color: #94a3b8; font-size: 11px; }
    .hist-symbols { font-size: 13px; font-weight: 600; color: #e2e8f0; }
    .hist-count { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 10px; }
    .hist-count.ok { background: #22c55e20; color: #22c55e; }
    .hist-count.none { background: #47556920; color: #94a3b8; }
    .hist-arrow { font-size: 12px; color: #64748b; transition: transform 0.2s; }
    .hist-item.open .hist-arrow { transform: rotate(180deg); }
    .hist-body { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; }
    .hist-item.open .hist-body { max-height: 8000px; }
    .hist-body-inner { padding: 0 12px 14px; border-top: 1px solid #334155; }
    .hist-body-inner pre { white-space: pre-wrap; word-wrap: break-word; font-size: 12px; line-height: 1.55; color: #cbd5e1; font-family: inherit; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>PSX Live Alerts</h1>
    <div class="time">Auto-refresh every 30s &bull; ${timePKT} PKT</div>
  </div>
  <div class="top-bar">
    <button class="btn btn-refresh" id="refreshBtn" onclick="manualRefresh()">Refresh</button>
    <button class="btn btn-sound" id="soundBtn" onclick="toggleSound()">Sound ON</button>
  </div>
  <div class="status" id="status"></div>
  <div class="alert-box ${latest && latest.count > 0 ? '' : 'no-alert'}" id="alertBox">
    <div class="badge ${latest && latest.count > 0 ? 'ok' : 'no'}" id="badge">
      ${latest && latest.count > 0 ? `${latest.count} PICKS` : 'NO PICKS'}
    </div>
    <pre id="alertText">${latest ? latest.message : 'Waiting for first alert...'}</pre>
  </div>
  ${kmi30.length > 0 ? `
  <div class="kmi30-box">
    <div class="kmi30-header">
      <div class="kmi30-title">KMI-30 Intraday (15min)</div>
      <div class="kmi30-count">${kmi30.length} setups</div>
    </div>
    ${kmi30.map(p => `
      <div class="kmi30-item">
        <div class="kmi30-symbol">${p.symbol} <span style="font-size:11px;color:#94a3b8;font-weight:400">${p.name}</span></div>
        <div class="kmi30-levels">
          <span class="kmi30-entry">E: Rs${p.entry.toFixed(2)}</span>
          <span class="kmi30-target">T: Rs${p.target.toFixed(2)}</span>
          <span class="kmi30-sl">SL: Rs${p.stopLoss.toFixed(2)}</span>
          <span class="kmi30-rr">RR: ${p.riskReward}x</span>
        </div>
        <div class="kmi30-rationale">${p.rationale}</div>
        <div class="kmi30-score">Score: ${p.score}/15 | RSI: ${Math.round(p.rsi)} | Vol: ${(p.volume/1000).toFixed(0)}K</div>
      </div>
    `).join('')}
  </div>
  ` : ''}
  <div class="history" id="history">
    <h2>Recent Cycles <span style="font-weight:400;color:#64748b;font-size:12px">(tap to expand)</span></h2>
    ${logs.map((l, i) => `
      <div class="hist-item" onclick="this.classList.toggle('open')">
        <div class="hist-header">
          <div class="hist-left">
            <div class="hist-time">${l.timePKT}</div>
            <div class="hist-symbols">${l.symbols.join(', ') || 'No setups'}</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <div class="hist-count ${l.count > 0 ? 'ok' : 'none'}">${l.count} setup${l.count !== 1 ? 's' : ''}</div>
            <div class="hist-arrow">&#9660;</div>
          </div>
        </div>
        <div class="hist-body">
          <div class="hist-body-inner">
            <pre>${l.message}</pre>
          </div>
        </div>
      </div>
    `).join('')}
  </div>
  <script>
    let soundEnabled = true;
    let lastId = ${latest?.id || 0};
    function toggleSound() {
      soundEnabled = !soundEnabled;
      const btn = document.getElementById('soundBtn');
      btn.textContent = soundEnabled ? 'Sound ON' : 'Sound OFF';
      btn.classList.toggle('off', !soundEnabled);
    }
    function playBeep() {
      if (!soundEnabled) return;
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800;
        gain.gain.value = 0.3;
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
        setTimeout(() => {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.frequency.value = 1000;
          gain2.gain.value = 0.3;
          osc2.start();
          osc2.stop(ctx.currentTime + 0.15);
        }, 200);
      } catch(e) {}
    }
    async function manualRefresh() {
      const btn = document.getElementById('refreshBtn');
      const status = document.getElementById('status');
      btn.disabled = true;
      status.textContent = 'Generating alert...';
      status.className = 'status';
      try {
        const res = await fetch('/api/alerts/test');
        const json = await res.json();
        if (json.success) {
          status.textContent = 'Alert sent! Reloading...';
          status.className = 'status ok';
          if (json.data?.alerts?.length > 0) playBeep();
          setTimeout(() => window.location.reload(), 1000);
        } else {
          status.textContent = 'Failed: ' + (json.error || 'Unknown');
          status.className = 'status err';
          btn.disabled = false;
        }
      } catch (e) {
        status.textContent = 'Network error';
        status.className = 'status err';
        btn.disabled = false;
      }
    }
    setInterval(() => {
      fetch('/api/alerts/latest')
        .then(r => r.json())
        .then(data => {
          const newId = data?.latest?.id;
          if (newId && newId !== lastId) {
            lastId = newId;
            if (data.latest.count > 0) playBeep();
            document.getElementById('badge').textContent = data.latest.count > 0 
              ? data.latest.count + ' PICKS' 
              : 'NO PICKS';
            document.getElementById('badge').className = 'badge ' + (data.latest.count > 0 ? 'ok' : 'no');
            document.getElementById('alertText').textContent = data.latest.message;
            document.getElementById('alertBox').className = 'alert-box ' + (data.latest.count > 0 ? '' : 'no-alert');
          }
        })
        .catch(() => {});
    }, 15000);
  </script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (e) {
    res.status(500).send('Error loading alerts');
  }
});

// ========== FALLBACK TO FRONTEND ==========
app.get('*', (req, res) => {
  if (req.path.includes('.')) {
    return res.status(404).send('Not found');
  }
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// ========== MARKET HOURS HELPER ==========
function isMarketOpen() {
  const pkt = new Date(Date.now() + 5 * 60 * 60 * 1000);
  const day = pkt.getUTCDay();
  const hour = pkt.getUTCHours();
  const min = pkt.getUTCMinutes();
  const time = hour + min / 60;
  if (day === 0 || day === 6) return false;
  if (day >= 1 && day <= 4) return time >= 9.5 && time <= 15.5;
  if (day === 5) return (time >= 9.25 && time <= 12.0) || (time >= 14.5 && time <= 16.5);
  return false;
}

// ========== CRON JOBS ==========
// Every 15 minutes - Alert cycle
cron.schedule('*/15 * * * *', async () => {
  console.log('Alert cycle triggered:', new Date().toISOString());
  try { await sendAlerts(); } catch (e) { console.error('Alert cycle failed:', e.message); }
});

// Every 15 minutes - KMI-30 scan
cron.schedule('*/15 * * * *', async () => {
  if (!isMarketOpen()) return;
  console.log('KMI-30 scan triggered:', new Date().toISOString());
  try {
    await createKMI30Predictions();
    await checkKMI30Predictions();
  } catch (e) { console.error('KMI-30 cycle failed:', e.message); }
});

// ========== START SERVER ==========
app.listen(PORT, () => {
  console.log(`PSX Trader API running on http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`Mobile Alerts: http://localhost:${PORT}/alerts/mobile`);
});

module.exports = { isMarketOpen };