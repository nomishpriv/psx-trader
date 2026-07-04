# PSX Trader - Intraday Trading Dashboard

A complete intraday trading system for Pakistan Stock Exchange (PSX) with automated signals, entry/exit levels, stop loss, and AI-powered news analysis.

## Features

- **Real-time Stock Signals** - BUY/SELL/WAIT signals with confidence scores
- **Trading Levels** - Entry, Target (Exit), and Stop Loss for every signal
- **SMC Analysis** - Smart Money Concepts (Fair Value Gaps, Order Blocks, Liquidity Sweeps, BOS/CHOCH)
- **Order Flow** - Bid/Ask ratio analysis
- **KMI-30 Intraday Scanner** - 15-minute timeframe setups
- **AI News Analysis** - Groq-powered sentiment analysis
- **Shariah-compliant Trading** - Islamic finance compliant stock screening
- **Alert System** - Telegram & WhatsApp alerts every 15 minutes
- **Accuracy Tracking** - Prediction accuracy stats

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: Vanilla JavaScript SPA (no build step needed)
- **APIs**: StockIntel.com for market data, Groq for AI analysis
- **Alerts**: Telegram Bot API, CallMeBot WhatsApp API

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd psx-trader
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
# StockIntel API (required)
STOCKINTEL_PHONE=your_phone
STOCKINTEL_PASSWORD=your_password
STOCKINTEL_TOKEN=your_token
DEVICE_ID=your_device_id

# Groq AI (required for news analysis)
GROQ_API_KEY=your_groq_key

# Telegram Alerts (optional)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# WhatsApp Alerts (optional)
CALLMEBOT_APIKEY=your_apikey
CALLMEBOT_PHONE=your_phone

# Server
PORT=5001
```

### 3. Run Locally

```bash
npm start
```

Open http://localhost:5001

- **Main App**: http://localhost:5001
- **API Health**: http://localhost:5001/health
- **Mobile Alerts**: http://localhost:5001/alerts/mobile

### 4. Frontend Development

The frontend is a static SPA. No build step needed! Files are served from `frontend/`.

## API Endpoints

### Stocks
- `GET /api/stocks` - All stocks
- `GET /api/stocks/:symbol` - Single stock
- `GET /api/search?q=HBL` - Search stocks
- `GET /api/opportunities?limit=10` - Top movers
- `GET /api/market/summary` - Market summary

### Signals
- `GET /api/unified-signal/:symbol` - Full trading signal with entry/exit/SL
- `POST /api/unified-signals` - Bulk signals (body: `{symbols: ['HBL', 'LUCK']}`)

### Predictions
- `GET /api/predict/:symbol` - Create prediction
- `GET /api/predict/check/:symbol` - Check prediction result
- `GET /api/predict/accuracy/:symbol` - Accuracy for symbol
- `GET /api/predict/accuracy` - All accuracies

### SMC (Smart Money Concepts)
- `GET /api/smc/:symbol` - FVG, Order Blocks, Liquidity Sweeps, BOS, CHOCH

### Order Flow
- `GET /api/orderflow/:symbol` - Bid/Ask ratio analysis

### News
- `GET /api/news/impact` - AI-analyzed news impact
- `GET /api/news/signal` - Quick trading signal from news

### KMI-30
- `GET /api/kmi30/picks` - Top intraday setups
- `GET /api/kmi30/scan` - Force scan
- `GET /api/kmi30/accuracy` - Accuracy stats

### Alerts
- `GET /api/alerts/preview` - Preview alert
- `GET /api/alerts/test` - Send test alert
- `GET /api/alerts/latest` - Latest alert log

## Deploy to Hostinger

### Option 1: VPS/Cloud Plan (Recommended)

1. Upload files via FTP/SFTP
2. Install Node.js on your VPS
3. Run `npm install && npm start`
4. Use PM2 for process management:

```bash
npm install -g pm2
pm2 start server.js --name psx-trader
pm2 startup
pm2 save
```

### Option 2: Node.js Hosting

1. Zip the project (excluding node_modules)
2. Upload via Hostinger control panel
3. Set environment variables in the panel
4. Set start command: `node server.js`

## Project Structure

```
psx-trader/
  server.js              # Express server
  package.json           # Dependencies
  .env.example           # Env template
  routes/
    api.js               # All API routes
  services/
    stockIntelService.js      # Market data
    smcService.js             # Smart Money Concepts
    predictService.js         # Predictions
    newsService.js            # AI news analysis
    orderFlowService.js       # Order flow
    shariahTradeService.js    # Shariah screening
    institutionalActivityService.js
    resultAnnouncementService.js
    unifiedSignalService.js   # Signal aggregation
    alertService.js           # Alert sending
    alertLoggerService.js     # Alert history
    kmi30PredictService.js    # KMI-30 scanner
  frontend/
    index.html             # Main HTML
    app.js                 # SPA logic
    public/
      manifest.json        # PWA manifest
```

## License

MIT
