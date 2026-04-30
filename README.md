# Nexist - Advanced E-commerce Cart & State Management

Nexist is a premium e-commerce interface built with Next.js and Redux Toolkit, featuring a robust state management system, real-time stock tracking, and a highly polished, responsive UI.

## 🚀 Features

- **Advanced Product Discovery**: Live search, category filtering, and dynamic sorting (Price, Rating, Featured).
- **Persistent Shopping Cart**: Full cart functionality with persistence across page refreshes using `localStorage`.
- **Real-time Stock Management**: Dynamic stock tracking that prevents over-ordering and updates the UI instantly.
- **Premium UI/UX**:
  - Grid/List view toggles.
  - Interactive product cards with hover effects and quick-add actions.
  - Polished slide-out cart drawer with quantity controls and total calculations.
  - Staggered entrance animations and micro-interactions for a high-end feel.
- **Responsive Design**: Mobile-first approach with optimized touch interactions.
- **Dark Mode Support**: Full compatibility with dark mode color palettes.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🏗️ Technical Architecture

### State Management
The application uses a centralized Redux store to manage:
- **Cart State**: Items, quantities, and total pricing.
- **Product State**: Master product list with real-time stock levels.
- **UI State**: View modes, filtering, and sorting preferences.

### Stock Management
Stock is managed through a dedicated `useStockManager` hook and Redux reducers. The system ensures that:
- Adding to cart decreases available stock.
- Removing or decreasing quantity in the cart restores stock.
- The UI (buttons, badges) automatically disables or changes state when products are "Out of Stock".

---

## 🧠 Technical Challenges & Solutions

### 1. Global Store Data Leak Prevention (SSR Isolation)
**Challenge**: In Next.js, components are rendered on the server. If a Redux store is defined as a global singleton, it remains in memory across different requests. This creates a high risk of "data leakage," where one user's cart or sensitive state could be served to another user.

**My Approach**: I implemented a `makeStore()` factory pattern. Instead of a singleton, a new store instance is generated for every request. Inside the `StoreProvider`, I utilize the `useRef` hook to ensure that the store is only created once per client session and remains isolated from other users.

### 2. LocalStorage & Redux Store Synchronization
**Challenge**: While I persist the cart to `localStorage`, the product list is initialized from a static constant on page refresh. This leads to a stock mismatch: the cart might contain 5 items, but the product's stock level resets to its initial maximum value, allowing users to exceed the actual physical stock.

**My Approach**: I implemented a specialized "Hydration Synchronization" logic. During the store's initialization phase in `makeStore()`, the system reads the persisted cart items and immediately dispatches a `syncStockWithCart` action. This reconciles the initial product stock levels by subtracting items already held in the cart before the user even sees the page.

### 3. Out-of-Stock Order Prevention
**Challenge**: Ensuring a seamless and foolproof experience where users cannot add more items than available, especially when interacting with multiple UI components (e.g., adding from the product card vs. increasing quantity in the drawer).

**My Approach**: I centralized the validation logic within the Redux reducers and the `useStockManager` hook. Every state-mutating action (addItem, updateQuantity) is guarded by a stock check. Furthermore, I implemented responsive UI states—disabling "Add to Cart" buttons and showing "Only X left" badges—that adapt in real-time as the stock fluctuates.

---

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone [repository-url]
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 📄 License
This project was developed as a technical assignment. All rights reserved.
