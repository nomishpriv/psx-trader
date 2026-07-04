const fs = require('fs');
const path = require('path');

const PREDICT_FILE = path.join(__dirname, '..', '.predictions.json');
const STATE_FILE = path.join(__dirname, '..', '.predict-state.json');

const TEST_MODE = false;
const TEST_MIN_RR = 0.5;
const PROD_MIN_RR = 1;
const TEST_MIN_COMPLETED = 1;
const PROD_MIN_COMPLETED = 3;

const MIN_RR = TEST_MODE ? TEST_MIN_RR : PROD_MIN_RR;
const MIN_COMPLETED = TEST_MODE ? TEST_MIN_COMPLETED : PROD_MIN_COMPLETED;

let predictLoadPromise = null;
let stateLoadPromise = null;
let predictSaveQueue = Promise.resolve();
let stateSaveQueue = Promise.resolve();

async function loadPredictions() {
  if (predictLoadPromise) return predictLoadPromise;
  predictLoadPromise = (async () => {
    try {
      const raw = await fs.promises.readFile(PREDICT_FILE, 'utf8');
      return JSON.parse(raw);
    } catch {
      return {};
    } finally {
      predictLoadPromise = null;
    }
  })();
  return predictLoadPromise;
}

async function savePredictions(data) {
  predictSaveQueue = predictSaveQueue.then(async () => {
    try {
      const dir = path.dirname(PREDICT_FILE);
      await fs.promises.mkdir(dir, { recursive: true });
      await fs.promises.writeFile(PREDICT_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('Failed to save predictions:', e.message);
    }
  }).catch(() => {});
  return predictSaveQueue;
}

async function loadState() {
  if (stateLoadPromise) return stateLoadPromise;
  stateLoadPromise = (async () => {
    try {
      const raw = await fs.promises.readFile(STATE_FILE, 'utf8');
      return JSON.parse(raw);
    } catch {
      return { lastAutoPredict: 0 };
    } finally {
      stateLoadPromise = null;
    }
  })();
  return stateLoadPromise;
}

async function saveState(state) {
  stateSaveQueue = stateSaveQueue.then(async () => {
    try {
      const dir = path.dirname(STATE_FILE);
      await fs.promises.mkdir(dir, { recursive: true });
      await fs.promises.writeFile(STATE_FILE, JSON.stringify(state, null, 2));
    } catch (e) {
      console.error('Failed to save state:', e.message);
    }
  }).catch(() => {});
  return stateSaveQueue;
}

function isMarketOpen() {
  if (TEST_MODE) return true;
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

function computeATR(stock) {
  const h = stock.high || stock.price;
  const l = stock.low || stock.price;
  const pc = stock.prevClose || stock.price;
  const tr = Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc));
  return Math.max(tr, stock.price * 0.005);
}

function isEntryValid(entry, ldcp, tolerancePct = 0.03) {
  if (!ldcp || ldcp <= 0) return true;
  return (ldcp - entry) / ldcp < tolerancePct;
}

function f2(n) { return +Number(n).toFixed(2); }

const TOP_SYMBOLS = [
  'FFC', 'LUCK', 'OGDC', 'MEBL', 'PPL', 'EFERT',
  'HUBC', 'ENGRO', 'POL', 'MARI', 'SEARL', 'DGKC', 'MLCF'
];

async function autoPredict(stocks) {
  if (!isMarketOpen()) return [];

  const state = await loadState();
  if (Date.now() - state.lastAutoPredict < 900000) return [];

  state.lastAutoPredict = Date.now();
  await saveState(state);

  const results = [];
  for (const stock of stocks) {
    if (!TOP_SYMBOLS.includes(stock.symbol)) continue;
    const result = await createPrediction(stock);
    if (!result.skipped) results.push(stock.symbol);
  }

  if (results.length > 0) console.log('Auto-predicted:', results.join(', '));
  return results;
}

async function createPrediction(stock) {
  if (!isMarketOpen())
    return { skipped: true, reason: 'Market is closed' };

  const price = stock.price || 0;
  if (price <= 0)
    return { skipped: true, reason: 'Invalid price' };

  const atr = computeATR(stock);

  if (stock.volume <= 10000)
    return { skipped: true, reason: 'Volume too low' };

  if (atr < price * 0.003)
    return { skipped: true, reason: 'ATR too small' };

  if (!isEntryValid(price, stock.prevClose))
    return { skipped: true, reason: `Entry ${price} is stale vs LDCP ${stock.prevClose}` };

  const r1 = stock.r1 || 0;
  const r2 = stock.r2 || 0;
  const s1 = stock.s1 || 0;
  const s2 = stock.s2 || 0;

  const all = await loadPredictions();
  const existing = all[stock.symbol] || [];

  const samePrice = existing.find(p =>
    !p.checked && Math.abs(p.pivot.entry - price) / price < 0.01
  );
  if (samePrice)
    return { skipped: true, reason: 'Active prediction at similar price already exists' };

  const recent = existing.find(p =>
    Date.now() - new Date(p.pivot.createdAt).getTime() < 300000
  );
  if (recent)
    return { skipped: true, reason: 'Already predicted in the last 5 minutes' };

  let pivotTarget = r1 > price ? f2(r1) : r2 > price ? f2(r2) : f2(price + atr * 1.5);
  let pivotStop = s1 > 0 && s1 < price ? f2(s1) : s2 > 0 && s2 < price ? f2(s2) : f2(price - atr * 1.5);

  const targetPct = ((pivotTarget - price) / price) * 100;
  if (targetPct < 0.15)
    return { skipped: true, reason: `Target too close (${targetPct.toFixed(2)}%)` };
  if (targetPct > 5)
    return { skipped: true, reason: `Target too far (${targetPct.toFixed(1)}%)` };

  const reward = pivotTarget - price;
  const risk = price - pivotStop;
  if (risk <= 0 || reward / risk < MIN_RR)
    return { skipped: true, reason: `Poor R:R (${risk > 0 ? (reward / risk).toFixed(2) : 'n/a'})` };

  const pivotConfidence = r1 > price ? 70 : 50;
  const now = new Date().toISOString();

  const entry = {
    pivot: { method: 'PIVOT', entry: price, target: pivotTarget, stopLoss: pivotStop, confidence: pivotConfidence, createdAt: now, checked: false },
    atr: { method: 'ATR', entry: price, target: f2(price + atr * 2), stopLoss: f2(price - atr * 1.5), confidence: 65, createdAt: now, checked: false },
    checked: false, result: null, hitAt: null
  };

  if (!all[stock.symbol]) all[stock.symbol] = [];
  all[stock.symbol].push(entry);
  if (all[stock.symbol].length > 50)
    all[stock.symbol] = all[stock.symbol].slice(-50);

  await savePredictions(all);
  return entry;
}

async function checkPrediction(symbol, currentPrice, currentHigh, currentLow) {
  const all = await loadPredictions();
  const stockPreds = all[symbol] || [];
  let updated = false;

  const hasValidHL = TEST_MODE ? true : (currentHigh > 0 && currentLow > 0 && currentHigh >= currentLow);

  for (const pred of stockPreds) {
    if (pred.checked) continue;

    if (!TEST_MODE) {
      const age = Date.now() - new Date(pred.pivot.createdAt).getTime();
      if (age < 60000) continue;
    }

    if (!pred.pivot.checked && hasValidHL) {
      if (currentHigh >= pred.pivot.target) {
        pred.pivot.result = 'WIN'; pred.pivot.checked = true; pred.pivot.hitAt = new Date().toISOString();
        pred.checked = true; pred.result = 'WIN'; pred.hitAt = pred.pivot.hitAt;
        updated = true;
      } else if (currentLow <= pred.pivot.stopLoss) {
        pred.pivot.result = 'LOSS'; pred.pivot.checked = true; pred.pivot.hitAt = new Date().toISOString();
        pred.checked = true; pred.result = 'LOSS'; pred.hitAt = pred.pivot.hitAt;
        updated = true;
      }
    }

    if (!pred.atr.checked && hasValidHL) {
      if (currentHigh >= pred.atr.target) {
        pred.atr.result = 'WIN'; pred.atr.checked = true; pred.atr.hitAt = new Date().toISOString();
        if (!pred.checked) { pred.checked = true; pred.result = 'WIN'; pred.hitAt = pred.atr.hitAt; }
        updated = true;
      } else if (currentLow <= pred.atr.stopLoss) {
        pred.atr.result = 'LOSS'; pred.atr.checked = true; pred.atr.hitAt = new Date().toISOString();
        if (!pred.checked) { pred.checked = true; pred.result = 'LOSS'; pred.hitAt = pred.atr.hitAt; }
        updated = true;
      }
    }
  }

  if (updated) await savePredictions(all);

  const active = stockPreds.filter(p => !p.checked);
  const completed = stockPreds.filter(p => p.checked);

  const pivotWins = completed.filter(p => p.pivot?.result === 'WIN').length;
  const pivotTotal = completed.filter(p => p.pivot?.checked).length;
  const atrWins = completed.filter(p => p.atr?.result === 'WIN').length;
  const atrTotal = completed.filter(p => p.atr?.checked).length;

  return {
    symbol, active: active.length, completed: completed.length,
    pivot: { wins: pivotWins, total: pivotTotal, accuracy: pivotTotal > 0 ? +((pivotWins / pivotTotal) * 100).toFixed(0) : 0 },
    atr: { wins: atrWins, total: atrTotal, accuracy: atrTotal > 0 ? +((atrWins / atrTotal) * 100).toFixed(0) : 0 },
    bestMethod: (pivotTotal > 0 && atrTotal > 0)
      ? (pivotWins / pivotTotal >= atrWins / atrTotal ? 'PIVOT' : 'ATR')
      : null
  };
}

async function getAccuracySummary(symbol) {
  const all = await loadPredictions();
  const stockPreds = all[symbol] || [];
  const completed = stockPreds.filter(p => p.checked);

  const pivotWins = completed.filter(p => p.pivot?.result === 'WIN').length;
  const pivotTotal = completed.filter(p => p.pivot?.checked).length;
  const atrWins = completed.filter(p => p.atr?.result === 'WIN').length;
  const atrTotal = completed.filter(p => p.atr?.checked).length;

  const pivotAccuracy = pivotTotal > 0 ? +((pivotWins / pivotTotal) * 100).toFixed(0) : null;
  const atrAccuracy = atrTotal > 0 ? +((atrWins / atrTotal) * 100).toFixed(0) : null;

  const bestMethod = (pivotTotal >= 3 && atrTotal >= 3)
    ? (pivotWins / pivotTotal >= atrWins / atrTotal ? 'PIVOT' : 'ATR')
    : null;

  let recommendation = null;
  if (bestMethod) {
    const acc = bestMethod === 'PIVOT' ? pivotAccuracy : atrAccuracy;
    if (acc >= 60)
      recommendation = `Use ${bestMethod} - strong accuracy (${acc}%)`;
    else if (acc >= 40)
      recommendation = `${bestMethod} shows moderate accuracy (${acc}%) - trade with caution`;
    else
      recommendation = `Both methods underperforming - avoid auto-trading ${symbol}`;
  }

  return { symbol, totalPredictions: stockPreds.length, totalCompleted: completed.length, pivotAccuracy, atrAccuracy, bestMethod, recommendation };
}

async function getAllAccuracies() {
  const all = await loadPredictions();
  const summaries = [];
  for (const symbol of Object.keys(all)) {
    summaries.push(await getAccuracySummary(symbol));
  }
  return summaries
    .filter(r => r.totalCompleted >= MIN_COMPLETED)
    .sort((a, b) => (b.pivotAccuracy || 0) - (a.pivotAccuracy || 0));
}

module.exports = { createPrediction, checkPrediction, getAccuracySummary, getAllAccuracies, autoPredict };
