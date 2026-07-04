const fs = require('fs');
const path = require('path');

const RESET_INTERVAL = 15 * 60 * 1000;
const MAX_SNAPSHOTS = 15;
const ORDER_FLOW_FILE = path.join(__dirname, '..', '.orderflow.json');

let loadPromise = null;
let saveQueue = Promise.resolve();

async function loadOrderFlow() {
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    try {
      const raw = await fs.promises.readFile(ORDER_FLOW_FILE, 'utf8');
      return JSON.parse(raw);
    } catch {
      return {};
    } finally {
      loadPromise = null;
    }
  })();
  return loadPromise;
}

async function saveOrderFlow(data) {
  saveQueue = saveQueue.then(async () => {
    try {
      const dir = path.dirname(ORDER_FLOW_FILE);
      await fs.promises.mkdir(dir, { recursive: true });
      await fs.promises.writeFile(ORDER_FLOW_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('Failed to save order flow:', e.message);
    }
  }).catch(() => {});
  return saveQueue;
}

async function recordSnapshot(symbol, bidVolume, askVolume, bidPrice, askPrice, price) {
  if (!symbol || typeof symbol !== 'string') return;
  if (price <= 0) return;

  const all = await loadOrderFlow();
  if (!all[symbol]) all[symbol] = { snapshots: [], lastReset: Date.now() };

  const stock = all[symbol];
  const now = Date.now();

  if (now - stock.lastReset > RESET_INTERVAL) {
    stock.lastReset = now;
    stock.snapshots = [];
  }

  stock.snapshots.push({
    time: new Date().toISOString(),
    bidVolume, askVolume, bidPrice, askPrice, price,
    ratio: askVolume > 0 ? +(bidVolume / askVolume).toFixed(2) : 0,
    spread: bidPrice > 0 ? +(((askPrice - bidPrice) / bidPrice) * 100).toFixed(2) : 0
  });

  if (stock.snapshots.length > MAX_SNAPSHOTS) {
    stock.snapshots = stock.snapshots.slice(-MAX_SNAPSHOTS);
  }

  await saveOrderFlow(all);
}

async function analyzeRatio(symbol) {
  if (!symbol || typeof symbol !== 'string') {
    return { symbol: symbol || 'N/A', message: 'Invalid symbol', ready: false };
  }

  const all = await loadOrderFlow();
  const stock = all[symbol];

  if (!stock || stock.snapshots.length < 3) {
    return { symbol, message: 'Collecting data...', ready: false };
  }

  const snaps = stock.snapshots;
  const totalBid = snaps.reduce((s, n) => s + n.bidVolume, 0);
  const totalAsk = snaps.reduce((s, n) => s + n.askVolume, 0);
  const overallRatio = totalAsk > 0 ? +(totalBid / totalAsk).toFixed(2) : 1;

  const half = Math.floor(snaps.length / 2);
  const firstHalf = snaps.slice(0, half);
  const secondHalf = snaps.slice(-half);

  const firstRatio = firstHalf.length > 0 ? firstHalf.reduce((s, n) => s + n.ratio, 0) / firstHalf.length : 0;
  const secondRatio = secondHalf.length > 0 ? secondHalf.reduce((s, n) => s + n.ratio, 0) / secondHalf.length : 0;

  let trend, color;
  if (secondRatio > firstRatio * 1.3) { trend = 'BUYING_INCREASING'; color = '#22c55e'; }
  else if (secondRatio < firstRatio * 0.7) { trend = 'SELLING_INCREASING'; color = '#ef4444'; }
  else if (overallRatio > 1.5) { trend = 'BUYERS_DOMINANT'; color = '#22c55e'; }
  else if (overallRatio < 0.5) { trend = 'SELLERS_DOMINANT'; color = '#ef4444'; }
  else { trend = 'BALANCED'; color = '#f59e0b'; }

  const latestSpread = snaps[snaps.length - 1]?.spread || 0;

  return {
    symbol, ready: true, snapshots: snaps.length,
    windowMinutes: Math.round((Date.now() - stock.lastReset) / 60000),
    totalBidVolume: totalBid, totalAskVolume: totalAsk, overallRatio,
    firstHalfRatio: +firstRatio.toFixed(2), secondHalfRatio: +secondRatio.toFixed(2),
    trend, color, latestSpread,
    signal: trend === 'BUYING_INCREASING' ? 'Buy pressure building' :
            trend === 'SELLING_INCREASING' ? 'Sell pressure building' :
            trend === 'BUYERS_DOMINANT' ? 'Buyers in control' :
            trend === 'SELLERS_DOMINANT' ? 'Sellers in control' :
            'Balanced - wait for direction'
  };
}

async function recordFromStocks(stocks) {
  if (!Array.isArray(stocks) || stocks.length === 0) return;

  const all = await loadOrderFlow();
  const now = Date.now();

  for (const stock of stocks) {
    if (stock.bidVolume <= 0 && stock.askVolume <= 0) continue;
    if (stock.price <= 0) continue;

    const symbol = stock.symbol;
    if (!all[symbol]) all[symbol] = { snapshots: [], lastReset: now };

    const entry = all[symbol];
    if (now - entry.lastReset > RESET_INTERVAL) {
      entry.lastReset = now;
      entry.snapshots = [];
    }

    entry.snapshots.push({
      time: new Date().toISOString(),
      bidVolume: stock.bidVolume, askVolume: stock.askVolume,
      bidPrice: stock.bidPrice, askPrice: stock.askPrice, price: stock.price,
      ratio: stock.askVolume > 0 ? +(stock.bidVolume / stock.askVolume).toFixed(2) : 0,
      spread: stock.bidPrice > 0 ? +(((stock.askPrice - stock.bidPrice) / stock.bidPrice) * 100).toFixed(2) : 0
    });

    if (entry.snapshots.length > MAX_SNAPSHOTS) {
      entry.snapshots = entry.snapshots.slice(-MAX_SNAPSHOTS);
    }
  }

  await saveOrderFlow(all);
}

function analyzeTickTrades(symbol, trades) {
  if (!Array.isArray(trades) || trades.length === 0) {
    return { symbol, ready: false, message: 'No tick data' };
  }

  let buyVolume = 0, sellVolume = 0, totalVolume = 0;
  let lastPrice = trades[0].x || 0;
  let lastBidQueue = trades[0].tsqb || 0;
  let lastAskQueue = trades[0].tsqs || 0;

  for (let i = 0; i < trades.length; i++) {
    const trade = trades[i];
    const price = trade.x || 0;
    const vol = trade.v || 0;
    const bidQueue = trade.tsqb || 0;
    const askQueue = trade.tsqs || 0;
    totalVolume += vol;

    let isBuy = false;
    if (i === 0) {
      isBuy = (bidQueue < lastBidQueue) || (askQueue === 0 && bidQueue > 0);
    } else {
      isBuy = price >= lastPrice;
    }

    if (bidQueue === 0 && askQueue > 0) isBuy = false;
    else if (askQueue === 0 && bidQueue > 0) isBuy = true;

    if (isBuy) buyVolume += vol;
    else sellVolume += vol;

    lastPrice = price;
    lastBidQueue = bidQueue;
    lastAskQueue = askQueue;
  }

  const ratio = sellVolume > 0 ? +(buyVolume / sellVolume).toFixed(2) : (buyVolume > 0 ? 99 : 1);
  const buyPct = totalVolume > 0 ? +((buyVolume / totalVolume) * 100).toFixed(1) : 0;
  const sellPct = totalVolume > 0 ? +((sellVolume / totalVolume) * 100).toFixed(1) : 0;

  let trend, color, signal;
  if (ratio > 2.0 && buyPct > 65) { trend = 'STRONG_BUYING'; color = '#22c55e'; signal = 'Strong buying'; }
  else if (ratio > 1.3 && buyPct > 55) { trend = 'BUYING'; color = '#84cc16'; signal = 'Buying'; }
  else if (ratio < 0.5 && sellPct > 65) { trend = 'STRONG_SELLING'; color = '#ef4444'; signal = 'Strong selling'; }
  else if (ratio < 0.8 && sellPct > 55) { trend = 'SELLING'; color = '#f97316'; signal = 'Selling'; }
  else { trend = 'NEUTRAL'; color = '#f59e0b'; signal = 'Neutral'; }

  return { symbol, ready: true, totalTrades: trades.length, totalVolume, buyVolume, sellVolume, buyPct, sellPct, ratio, trend, color, signal, lastPrice: lastPrice.toFixed(2) };
}

module.exports = { recordFromStocks, analyzeRatio, recordSnapshot, analyzeTickTrades };
