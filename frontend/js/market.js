'use strict';
(function() {
    const track = document.getElementById('tickerTrack');
    if (!track) return;

    let tickerData = [
        { symbol: 'USD/TRY', price: '45.50', change: '+0.42' },
        { symbol: 'EUR/TRY', price: '48.20', change: '-0.15' },
        { symbol: 'GBP/TRY', price: '57.80', change: '+0.32' },
        { symbol: 'JPY/TRY', price: '0.2940', change: '+0.02' },
        { symbol: 'XAU/USD', price: '3,255', change: '+14.20' },
        { symbol: 'BRENT', price: '83.15', change: '-1.10' },
        { symbol: 'BTC/USD', price: '105,420', change: '+2.8%' },
        { symbol: 'ETH/USD', price: '3,920', change: '-0.8%' },
    ];

    function renderTicker(data) {
        // Repeat items multiple times for a seamless loop on wide screens
        const repeatedData = [...data, ...data, ...data, ...data];
        const items = repeatedData.map(d => {
            const ch = parseFloat(d.change);
            const dir = ch >= 0 ? 'up' : 'down';
            const arrow = ch >= 0 ? '▲' : '▼';
            return `<div class="ticker-item">
                <span class="symbol">${d.symbol}</span>
                <span class="price">${d.price}</span>
                <span class="change ${dir}">${arrow} ${d.change}</span>
            </div>`;
        }).join('');
        track.innerHTML = items;
    }

    renderTicker(tickerData);

    // Fetch live data
    async function fetchTicker() {
        try {
            const API_URL = window.location.origin.includes('localhost') ? 'http://localhost:3000/api' : '/api';
            const res = await fetch(`${API_URL}/market/ticker`);
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                tickerData = data.map(d => ({
                    symbol: d.symbol,
                    price: d.price,
                    change: (parseFloat(d.change) >= 0 ? '+' : '') + d.change
                }));
                renderTicker(tickerData);
            }
        } catch (e) { /* Use fallback data */ }
    }

    fetchTicker();
    setInterval(fetchTicker, 15000); // Refresh every 15s
})();
