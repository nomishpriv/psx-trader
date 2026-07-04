const axios = require('axios');
const newsService = require('./newsService');
const shariahService = require('./shariahTradeService');
const unifiedService = require('./unifiedSignalService');
const logger = require('./alertLoggerService');
const kmi30Service = require('./kmi30PredictService');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const CALLMEBOT_APIKEY = process.env.CALLMEBOT_APIKEY;
const CALLMEBOT_PHONE = process.env.CALLMEBOT_PHONE;

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

async function getAlertStocks() {
  const [news, shariah] = await Promise.all([
    newsService.getQuickSignal().catch(() => null),
    shariahService.getShariahTradeRecommendations().catch(() => null)
  ]);

  const symbols = new Set();
  const meta = new Map();

  if (news?.topTrades?.length > 0) {
    for (const t of news.topTrades) {
      const sym = t.ticker?.toUpperCase();
      if (!sym) continue;
      symbols.add(sym);
      if (!meta.has(sym)) meta.set(sym, { sources: [], aiAction: null, aiReason: null });
      meta.get(sym).sources.push('AI News');
      meta.get(sym).aiAction = t.action;
      meta.get(sym).aiReason = t.reason;
    }
  }

  if (shariah?.recommendations?.length > 0) {
    for (const r of shariah.recommendations) {
      const sym = r.symbol?.toUpperCase();
      if (!sym) continue;
      symbols.add(sym);
      if (!meta.has(sym)) meta.set(sym, { sources: [], aiAction: null, aiReason: null });
      meta.get(sym).sources.push('Shariah');
      meta.get(sym).shariahRec = r.recommendation;
      meta.get(sym).shariahScore = r.score;
    }
  }

  const kmi30 = await kmi30Service.scanKMI30().catch(() => []);
  if (kmi30.length > 0) {
    for (const pick of kmi30) {
      const sym = pick.symbol;
      if (!symbols.has(sym)) {
        symbols.add(sym);
        meta.set(sym, { sources: [], aiAction: null, aiReason: null, shariahRec: null, shariahScore: null, kmi30: true });
      }
      meta.get(sym).sources.push('KMI30');
      meta.get(sym).kmi30Score = pick.score;
      meta.get(sym).kmi30Rationale = pick.rationale;
    }
  }

  if (symbols.size === 0) return null;

  const unified = await unifiedService.getUnifiedSignalsForStocks(Array.from(symbols));

  const allPicks = unified.map(u => {
    const m = meta.get(u.symbol) || { sources: [] };
    const isBoth = m.sources.length > 1;
    return { ...u, sources: [...new Set(m.sources)], aiAction: m.aiAction, aiReason: m.aiReason, shariahRec: m.shariahRec, shariahScore: m.shariahScore, isBoth, kmi30Score: m.kmi30Score, kmi30Rationale: m.kmi30Rationale };
  });

  const sortOrder = { STRONG_BUY: 0, BUY: 1, WAIT: 2, NEUTRAL: 3, SELL: 4, STRONG_SELL: 5 };
  allPicks.sort((a, b) => (sortOrder[a.signal] || 99) - (sortOrder[b.signal] || 99));

  return {
    marketContext: { newsSentiment: news?.sentiment || 'NEUTRAL', newsSignal: news?.signal || 'HOLD', newsSummary: news?.summary || '', shariahCount: shariah?.recommendations?.length || 0, totalPicks: allPicks.length },
    alerts: allPicks,
    timestamp: new Date().toISOString()
  };
}

function formatMessage(data) {
  const timePKT = new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });
  if (!data || data.alerts.length === 0) {
    return `PSX Alert | ${timePKT} PKT\n\nNo picks from AI News or Shariah right now.`;
  }

  let msg = `PSX Auto Alert\n${timePKT} PKT\n`;
  msg += `News: ${data.marketContext.newsSentiment} (${data.marketContext.newsSignal})\n`;
  msg += `Shariah picks: ${data.marketContext.shariahCount}\n`;
  msg += `Total scanned: ${data.marketContext.totalPicks}\n`;
  msg += `--------------------\n`;

  for (const a of data.alerts) {
    const srcTags = a.sources.map(s => s === 'AI News' ? 'N' : s === 'KMI30' ? 'K' : 'S').join('');
    const both = a.isBoth ? ' BOTH' : '';
    const sigLabel = a.signalMeta?.action || a.signal;
    msg += `\n${srcTags} ${a.symbol}${both} - ${sigLabel}\n`;
    msg += `Price: Rs${a.price?.toFixed(2)} | ${a.changePercent > 0 ? '+' : ''}${a.changePercent?.toFixed(2)}%\n`;
    const volK = (a.volume / 1000).toFixed(0);
    if (a.volAvg10d > 0) {
      const volRatio = (a.volume / a.volAvg10d).toFixed(1);
      msg += `Vol: ${volK}K (${volRatio}x vs 10d avg)\n`;
    } else {
      msg += `Vol: ${volK}K\n`;
    }
    if (a.rsi) msg += `RSI: ${a.rsi.toFixed(0)} | `;
    msg += `Conf: ${a.confidence}% | Risk: ${a.risk}\n`;
    if (a.levels?.entry) msg += `Entry:  Rs${a.levels.entry.toFixed(2)}\n`;
    if (a.levels?.target) msg += `Target: Rs${a.levels.target.toFixed(2)}\n`;
    if (a.levels?.stopLoss) msg += `SL:     Rs${a.levels.stopLoss.toFixed(2)}\n`;
    if (a.description) msg += `${a.description}\n`;
    if (a.kmi30Score) msg += `KMI-30 Score: ${a.kmi30Score}/15 | ${a.kmi30Rationale}\n`;
    if (a.aiReason) msg += `AI News: ${a.aiReason}\n`;
    if (a.shariahScore) msg += `Shariah Score: ${a.shariahScore}/100\n`;
  }

  msg += `\n--------------------\nAuto 15-min alert. Trade at your own risk.`;
  return msg;
}

async function sendTelegram(text) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return false;
  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'HTML'
    }, { timeout: 8000 });
    return true;
  } catch (e) { return false; }
}

async function sendWhatsApp(text) {
  if (!CALLMEBOT_APIKEY || !CALLMEBOT_PHONE) return false;
  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${CALLMEBOT_PHONE}&text=${encodeURIComponent(text)}&apikey=${CALLMEBOT_APIKEY}`;
    await axios.get(url, { timeout: 8000 });
    return true;
  } catch (e) { return false; }
}

async function sendAlerts() {
  if (!isMarketOpen()) { console.log('Market closed - skipping alert cycle'); return; }
  const data = await getAlertStocks();
  const message = formatMessage(data);
  const tgOk = await sendTelegram(message);
  const waOk = await sendWhatsApp(message);
  await logger.logAlert(message, data);
  if (!tgOk && !waOk) console.log('Alert saved to local file (.alerts.json)');
}

async function forceSendAlerts() {
  const data = await getAlertStocks();
  const message = formatMessage(data);
  const tgOk = await sendTelegram(message);
  const waOk = await sendWhatsApp(message);
  await logger.logAlert(message, data);
  return { telegram: tgOk, whatsapp: waOk, logged: true, data };
}

module.exports = { getAlertStocks, formatMessage, sendAlerts, forceSendAlerts, sendTelegram, sendWhatsApp };
