# ProTrader - Stock Broker Client Dashboard

ProTrader is a visually immersive, real-time stock trading dashboard designed to provide a premium user experience. Built with modern web technologies, it features a sleek dark-themed interface, simulated live market data, and comprehensive analytical tools for stock monitoring and comparison.

## 🚀 Features

### **1. Interactive Dashboard**
- **Live Multi-Chart**: Real-time visualization of stock prices with dynamic updates.
- **My Stocks Grid**: Personalized grid view of subscribed stocks with instant status indicators.
- **Activity Panel**: Live feed of market activities and user actions.
- **Simulated Real-Time Data**: Generates realistic stock price movements and market events.

### **2. Advanced Analytics**
- **Portfolio Value Chart**: Track portfolio performance over time.
- **Sector Allocation**: Visual breakdown of portfolio distribution across sectors.
- **Top & Bottom Performers**: Instant insights into market leaders and laggards.
- **Market Sentiment Gauge**: Visual indicator of overall market health.

### **3. Stock Comparison Tool**
- **Visual Comparison**: Side-by-side comparison of multiple stocks.
- **Correlation Heatmap**: Analyze how different stocks move in relation to each other.
- **Growth Metrics**: Quarterly growth and performance analysis.

### **4. Smart Insights**
- **AI-Driven Summaries**: Auto-generated summaries and trend predictions.
- **Weekly Heatmaps**: Visual representation of weekly stock performance.
- **Trend Analysis**: Detailed breakdown of bullish and bearish trends.

### **5. Market News**
- **Curated News Feed**: Latest market news and updates.
- **Category Filtering**: Filter news by sector or relevance.
- **Trending Topics**: Highlighted market-moving stories.

### **6. Authentication & Security**
- **Secure Login/Signup**: Full authentication flow with `AuthLayout`.
- **Protected Routes**: `AuthGuard` ensures secure access to dashboard features.
- **User Context**: Persistent user session management.

## 🛠 Technology Stack

- **Frontend Framework**: [React](https://reactjs.org/) (with [Vite](https://vitejs.dev/))
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context API (`AuthContext`, `StockContext`)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **Charts & Visualization**: [Recharts](https://recharts.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Utilities**: `clsx`, `tailwind-merge`

## 📂 Project Structure

```bash
src/
├── components/       # Reusable UI components
│   ├── compare/      # Stock comparison specific components
│   ├── dashboard/    # Dashboard widgets and panels
│   ├── insights/     # Analytical insight components
│   └── ...           # Shared components (Navbar, Sidebar, etc.)
├── context/          # React Context providers (Auth, Stock data)
├── data/             # Static and simulated data sources
├── layouts/          # Page layouts (DashboardLayout)
├── pages/            # Main application views (Dashboard, Analytics, etc.)
├── App.jsx           # Main application entry and routing
└── main.jsx          # React DOM rendering
```

## 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/16Prithvi/ProTrader.git
    cd escrow
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## 🎨 Design System

ProTrader utilizes a custom dark mode design system defined in `tailwind.config.js` and `index.css`.
- **Colors**: Uses a sophisticated palette of `gray-900` for backgrounds and vibrant accents for data visualization.
- **Typography**: Optimized for readability with a focus on numeric data presentation.
- **Components**: Glassmorphism effects and smooth transitions enhance the modern feel.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Note**: This is a frontend simulation project. Stock data is generated locally for demonstration purposes.
