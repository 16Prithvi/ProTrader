export const STOCKS_DATA = {
    GOOG: {
        name: 'Alphabet Inc.',
        sector: 'Technology',
        basePrice: 309.00,
        dayLow: 305.50,
        dayHigh: 312.20,
        open: 308.00,
        volume: '15.2M',
        marketCap: '1.95T',
        peRatio: 26.5
    },
    TSLA: {
        name: 'Tesla Inc.',
        sector: 'Automotive',
        basePrice: 459.00,
        dayLow: 448.00,
        dayHigh: 465.50,
        open: 450.00,
        volume: '98.5M',
        marketCap: '850B',
        peRatio: 72.4
    },
    AMZN: {
        name: 'Amazon.com Inc.',
        sector: 'E-commerce',
        basePrice: 226.00,
        dayLow: 222.00,
        dayHigh: 229.50,
        open: 224.00,
        volume: '42.1M',
        marketCap: '1.82T',
        peRatio: 55.2
    },
    META: {
        name: 'Meta Platforms',
        sector: 'Technology',
        basePrice: 644.00,
        dayLow: 638.00,
        dayHigh: 652.00,
        open: 650.00,
        volume: '14M',
        marketCap: '1.84T',
        peRatio: 31.52
    },
    NVDA: {
        name: 'NVIDIA Corp',
        sector: 'Semiconductors',
        basePrice: 175.00,
        dayLow: 172.00,
        dayHigh: 178.50,
        open: 174.00,
        volume: '55.8M',
        marketCap: '2.2T',
        peRatio: 65.8
    },
};

export const AVAILABLE_TICKERS = Object.keys(STOCKS_DATA);
