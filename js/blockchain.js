// Pekosoft Blockchain
// pekosoft.net/js/blockchain.js

'use strict';

// Pekosoft Blockchain — live Bitcoin blockchain viewer via mempool.space

document.addEventListener('DOMContentLoaded', () => {
  const API    = 'https://mempool.space/api';
  const WS_URL = 'wss://mempool.space/api/v1/ws';
  const MAX_BLOCKS = 50;

  // ── State ──────────────────────────────────────────────────────────────────
  let blocks      = [];
  let selectedId  = null;
  let ws          = null;
  let wsEnabled   = true;
  let retryTimer  = null;
  let pollTimer   = null;
  let tickTimer   = null;
  let lastActivityAt = Date.now();

  const META_POLL_MS = 15000;

  // ── DOM refs ───────────────────────────────────────────────────────────────
  const chain          = document.getElementById('blockchain-chain');
  const blockCountFld  = document.getElementById('block-count-field');
  const blockHeightFld = document.getElementById('block-height-field');
  const mempoolTxFld   = document.getElementById('mempool-tx-field');
  const feeEconomyFld  = document.getElementById('fee-economy-field');
  const feeHourFld     = document.getElementById('fee-hour-field');
  const feeHalfHrFld   = document.getElementById('fee-halfhour-field');
  const feeFastestFld  = document.getElementById('fee-fastest-field');
  const refreshBtn     = document.getElementById('refresh-button');
  const liveBtn        = document.getElementById('live-button');
  const statusDot      = document.getElementById('status-dot');
  const statusLabel    = document.getElementById('status-label');
  const canvas         = document.getElementById('blockchain-timeline');
  const panel          = document.getElementById('blockchain-panel');
  const copyBtn        = document.getElementById('copy-button');

  // ── Status indicator ───────────────────────────────────────────────────────
  function setStatus(state) {
    statusDot.dataset.status = state;
    if (state === 'live') {
      updateLiveStatusLabel();
      return;
    }
    statusLabel.textContent = state.toUpperCase();
  }

  function markActivity() {
    lastActivityAt = Date.now();
    updateLiveStatusLabel();
  }

  function updateLiveStatusLabel() {
    if (statusDot.dataset.status !== 'live') return;
    const elapsedSec = Math.max(0, Math.floor((Date.now() - lastActivityAt) / 1000));
    statusLabel.textContent = 'LIVE ' + elapsedSec + 's';
  }

  function updateAgeLabels() {
    const count = Math.min(parseInt(blockCountFld.value, 10) || 10, blocks.length);
    const visible = blocks.slice(0, count);
    const ageEls = chain.querySelectorAll('.block-card-age');
    const nowSec = Math.floor(Date.now() / 1000);

    visible.forEach((block, i) => {
      if (ageEls[i]) ageEls[i].textContent = formatAge(nowSec - block.timestamp);
    });
  }

  // ── WebSocket ──────────────────────────────────────────────────────────────
  function connectWS() {
    if (!wsEnabled) return;
    clearTimeout(retryTimer);
    setStatus('connecting');

    ws = new WebSocket(WS_URL);

    ws.addEventListener('open', () => {
      setStatus('live');
      markActivity();
      ws.send(JSON.stringify({ action: 'want', data: ['blocks'] }));
    });

    ws.addEventListener('message', (evt) => {
      let data;
      try { data = JSON.parse(evt.data); } catch { return; }

      if (data.block) {
        const newBlock = data.block;
        // Async-enrich with extras, then push
        fetchJSON('/v1/block/' + newBlock.id)
          .then(full => {
            blocks.unshift(full);
            blocks = blocks.slice(0, MAX_BLOCKS);
            markActivity();
            // If this new block becomes the auto-selected one, show full panels
            if (!selectedId || selectedId === full.id) selectedId = full.id;
            renderChain();
            drawTimeline();
            blockHeightFld.value = full.height;
          })
          .catch(() => {
            // Fall back to summary-only block data
            blocks.unshift(newBlock);
            blocks = blocks.slice(0, MAX_BLOCKS);
            markActivity();
            renderChain();
            drawTimeline();
            blockHeightFld.value = newBlock.height;
          });
      }
    });

    ws.addEventListener('close', () => {
      setStatus('offline');
      if (wsEnabled) retryTimer = setTimeout(connectWS, 8000);
    });

    ws.addEventListener('error', () => {
      // close event fires after error; reconnect is handled there
    });
  }

  function disconnectWS() {
    clearTimeout(retryTimer);
    if (ws) { ws.close(); ws = null; }
    setStatus('offline');
  }

  // ── REST helpers ───────────────────────────────────────────────────────────
  async function fetchJSON(path) {
    const resp = await fetch(API + path);
    if (!resp.ok) throw new Error(path + ' ' + resp.status);
    return resp.json();
  }

  // ── Full refresh (REST) ────────────────────────────────────────────────────
  async function refreshAll() {
    try {
      const [newBlocks, fees, mempool] = await Promise.all([
        fetchJSON('/blocks'),
        fetchJSON('/v1/fees/recommended'),
        fetchJSON('/mempool'),
      ]);

      const count = Math.min(parseInt(blockCountFld.value, 10) || 10, MAX_BLOCKS);
      blocks = newBlocks.slice(0, count);

      if (blocks.length > 0) {
        blockHeightFld.value = blocks[0].height;
        if (!selectedId) selectedId = blocks[0].id;
      }

      feeEconomyFld.value  = fees.economyFee  ?? '';
      feeHourFld.value     = fees.hourFee      ?? '';
      feeHalfHrFld.value   = fees.halfHourFee  ?? '';
      feeFastestFld.value  = fees.fastestFee   ?? '';
      mempoolTxFld.value   = mempool.count     ?? '';
      markActivity();

      renderChain();
      drawTimeline();

    } catch (err) {
      console.error('Blockchain refresh failed:', err);
    }
  }

  async function refreshMeta() {
    try {
      const [fees, mempool] = await Promise.all([
        fetchJSON('/v1/fees/recommended'),
        fetchJSON('/mempool'),
      ]);

      feeEconomyFld.value = fees.economyFee ?? '';
      feeHourFld.value = fees.hourFee ?? '';
      feeHalfHrFld.value = fees.halfHourFee ?? '';
      feeFastestFld.value = fees.fastestFee ?? '';
      mempoolTxFld.value = mempool.count ?? '';
      markActivity();
    } catch (err) {
      console.error('Blockchain meta refresh failed:', err);
    }
  }

  function startLiveTimers() {
    clearInterval(pollTimer);
    clearInterval(tickTimer);

    pollTimer = setInterval(() => {
      if (!wsEnabled) return;
      refreshMeta();
    }, META_POLL_MS);

    tickTimer = setInterval(() => {
      updateLiveStatusLabel();
      updateAgeLabels();
    }, 1000);
  }

  function stopLiveTimers() {
    clearInterval(pollTimer);
    clearInterval(tickTimer);
    pollTimer = null;
    tickTimer = null;
  }

  // ── Chain rendering ────────────────────────────────────────────────────────
  function renderChain() {
    chain.innerHTML = '';

    const count   = Math.min(parseInt(blockCountFld.value, 10) || 10, blocks.length);
    const visible = blocks.slice(0, count);

    visible.forEach((block, i) => {
      // Arrow connector between cards (pointing newest → oldest, left → right)
      if (i > 0) {
        const conn = document.createElement('div');
        conn.className = 'block-connector';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 20 10');
        svg.setAttribute('aria-hidden', 'true');
        const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        poly.setAttribute('points', '0,3 14,3 14,0 20,5 14,10 14,7 0,7');
        svg.appendChild(poly);
        conn.appendChild(svg);
        chain.appendChild(conn);
      }

      const card = document.createElement('div');
      card.className = 'block-card' + (block.id === selectedId ? ' block-selected' : '');
      card.dataset.hash = block.id;

      const age    = formatAge(Math.floor(Date.now() / 1000) - block.timestamp);
      const sizeMB = (block.size / 1048576).toFixed(2);

      const mkEl = (tag, cls, text) => {
        const el = document.createElement(tag);
        if (cls)  el.className   = cls;
        if (text != null) el.textContent = text;
        return el;
      };

      card.appendChild(mkEl('div', 'block-card-height', block.height.toLocaleString()));

      const rows = [
        ['Txs',  block.tx_count.toLocaleString()],
        ['Size', sizeMB + ' MB'],
      ];
      rows.forEach(([label, val]) => {
        const row  = mkEl('div', 'block-card-row');
        row.appendChild(mkEl('span', null, label));
        row.appendChild(mkEl('span', null, val));
        card.appendChild(row);
      });

      card.appendChild(mkEl('div', 'block-card-age', age));

      card.addEventListener('click', () => {
        selectedId = block.id;
        renderChain();
        showPanel(block);        // Fetch full block details including pool, fees, reward
        fetchJSON('/v1/block/' + block.id).then(full => showPanel(full)).catch(() => {});
      });

      chain.appendChild(card);
    });

    // Keep panel in sync with current selection
    if (selectedId) {
      const sel = visible.find(b => b.id === selectedId);
      if (sel) {
        showPanel(sel);
        if (!sel.extras && !sel.pool && sel.medianFee == null && sel.reward == null) {
          fetchJSON('/v1/block/' + sel.id).then(full => showPanel(full)).catch(() => {});
        }
      }
    }
  }

  function formatAge(sec) {
    if (sec < 60)    return sec + 's ago';
    if (sec < 3600)  return Math.floor(sec / 60)   + 'm ago';
    if (sec < 86400) return Math.floor(sec / 3600)  + 'h ago';
    return               Math.floor(sec / 86400) + 'd ago';
  }

  // ── Timeline: block-interval bar chart ────────────────────────────────────
  function drawTimeline() {
    if (!canvas || blocks.length < 2) return;

    const dpr = window.devicePixelRatio || 1;
    const W   = canvas.offsetWidth || 600;
    const H   = 120;
    canvas.width        = W * dpr;
    canvas.height       = H * dpr;
    canvas.style.height = H + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Intervals in seconds.  blocks[0] is newest, so blocks[i].timestamp > blocks[i+1].timestamp
    const intervals = [];
    for (let i = 0; i < blocks.length - 1; i++) {
      intervals.push(Math.max(0, blocks[i].timestamp - blocks[i + 1].timestamp));
    }

    const TARGET = 600;   // 10-minute target
    const maxVal = Math.max(TARGET * 2, ...intervals);

    const pad = { top: 20, bottom: 18, left: 6, right: 6 };
    const bx  = pad.left;
    const by  = pad.top;
    const bw  = W - pad.left - pad.right;
    const bh  = H - pad.top  - pad.bottom;

    const cs     = getComputedStyle(document.documentElement);
    const color1 = cs.getPropertyValue('--color1').trim() || '#0080ff';
    const color2 = cs.getPropertyValue('--color2').trim() || '#ff00ff';
    const grey3  = cs.getPropertyValue('--grey3').trim()  || '#888';

    ctx.clearRect(0, 0, W, H);

    // 10-minute dashed reference line
    const targetY = by + bh * (1 - TARGET / maxVal);
    ctx.strokeStyle = color2;
    ctx.lineWidth   = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(bx,      targetY);
    ctx.lineTo(bx + bw, targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle    = color2;
    ctx.font         = '10px monospace';
    ctx.textAlign    = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('10m', bx + bw, targetY - 2);

    // Bars (newest block first = left side)
    const spacing = bw / intervals.length;
    const barW    = Math.max(2, spacing - 2);

    intervals.forEach((iv, i) => {
      const barH = Math.max(1, (iv / maxVal) * bh);
      const x    = bx + i * spacing + (spacing - barW) / 2;
      const y    = by + bh - barH;
      ctx.fillStyle = Math.abs(iv - TARGET) / TARGET < 0.4 ? color1 : color2;
      ctx.fillRect(x, y, barW, barH);
    });

    ctx.fillStyle    = grey3;
    ctx.font         = '9px monospace';
    ctx.textAlign    = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Block time (newest ← oldest)', bx + 2, H - 2);
  }

  // ── Panel ──────────────────────────────────────────────────────────────────
  function showPanel(block) {
    const extras = block.extras ?? {};
    const pool   = extras.pool?.name ?? block.pool?.name ?? null;
    const medFee = extras.medianFee  ?? block.medianFee  ?? null;
    const reward = extras.reward     ?? block.reward     ?? null;

    const lines = [
      'Height:     ' + block.height.toLocaleString(),
    ];
    if (pool != null) lines.push('Pool:       ' + pool);
    lines.push(
      'Hash:       ' + block.id,
      'Previous:   ' + (block.previousblockhash ?? '–'),
      'Merkle:     ' + (block.merkle_root ?? '–'),
      'Time:       ' + new Date(block.timestamp * 1000).toUTCString(),
      'Txs:        ' + block.tx_count.toLocaleString(),
      'Size:       ' + (block.size / 1048576).toFixed(3) + ' MB',
      'Weight:     ' + (block.weight != null ? (block.weight / 1e6).toFixed(3) + ' MWU' : '–'),
    );
    if (medFee != null) lines.push('Median fee: ' + (+medFee).toFixed(2) + ' sat/vB');
    if (reward  != null) lines.push('Reward:     ' + (reward / 1e8).toFixed(8) + ' BTC');
    lines.push(
      'Difficulty: ' + (block.difficulty  != null ? block.difficulty.toExponential(4)     : '–'),
      'Nonce:      ' + (block.nonce       != null ? block.nonce                            : '–'),
      'Bits:       ' + (block.bits        != null ? block.bits                             : '–'),
      'Version:    ' + (block.version     != null ? '0x' + block.version.toString(16)     : '–'),
    );
    panel.value = lines.join('\n');
  }

  // ── COPY button ────────────────────────────────────────────────────────────
  copyBtn.addEventListener('click', () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(panel.value).catch(() => {});
    }
  });

  // ── REFRESH button ─────────────────────────────────────────────────────────
  refreshBtn.addEventListener('click', refreshAll);

  // ── LIVE toggle ────────────────────────────────────────────────────────────
  liveBtn.addEventListener('click', () => {
    wsEnabled = !wsEnabled;
    liveBtn.classList.toggle('button-on', wsEnabled);
    if (wsEnabled) {
      connectWS();
      refreshMeta();
      startLiveTimers();
    } else {
      disconnectWS();
      stopLiveTimers();
    }
  });

  // ── Block count change ─────────────────────────────────────────────────────
  blockCountFld.addEventListener('change', () => {
    let n = parseInt(blockCountFld.value, 10);
    if (isNaN(n) || n < 5)        n = 5;
    if (n > MAX_BLOCKS)           n = MAX_BLOCKS;
    blockCountFld.value = n;
    renderChain();
    drawTimeline();
  });

  // ── Resize ─────────────────────────────────────────────────────────────────
  window.addEventListener('resize', drawTimeline);

  // ── Cleanup on page unload ─────────────────────────────────────────────────
  window.addEventListener('beforeunload', () => {
    disconnectWS();
    stopLiveTimers();
  });

  // ── Init ───────────────────────────────────────────────────────────────────
  refreshAll();
  connectWS();
  startLiveTimers();
});

// END OF FILE
