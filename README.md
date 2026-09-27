# EquiSplit — Group Expense Tracker & Smart Settlement App

<div align="center">

**A modern, offline-first React Native mobile app that makes splitting expenses, tracking group balances, and settling debts effortless.**

[![React Native](https://img.shields.io/badge/React_Native-0.87.1-61DAFB?logo=react&logoColor=black)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![SQLite](https://img.shields.io/badge/SQLite-OP--SQLite_JSI-003B57?logo=sqlite&logoColor=white)](https://github.com/OP-Engineering/op-sqlite)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 📱 What is EquiSplit?

Splitting bills with friends, roommates, or travel buddies shouldn't require messy spreadsheets or mental gymnastics. **EquiSplit** is built to keep group finances crystal clear and stress-free:

- **Record expenses in seconds** with multiple split options (equal, exact, shares, or itemized).
- **See who owes what at a glance** with real-time balance calculations.
- **Smart Debt Simplification**: Instead of everyone paying everyone back in circles, the app automatically finds the simplest, minimum number of payments to settle up.
- **Works 100% offline** with ultra-fast local SQLite database storage.

---

## ✨ Features

### 💰 Flexible Expense Splitting
- **Split Equally**: Quickly divide any bill evenly among everyone.
- **Exact Amounts**: Specify exactly how much each person owes down to the cent.
- **By Shares**: Split proportionally using shares (ideal when one person consumes more or couples share costs).
- **Itemized Receipts**: Assign individual items (like starters, drinks, and mains) to specific people.
- **Multiple Payers**: Handle bills paid by more than one person at once without breaking a sweat.

### 🤝 Smart Settlements
- **Who Pays Whom**: View a clean list of settlement recommendations that minimize transactions.
- **Pairwise Balance Cards**: Tap any member to see your exact direct standing with them.
- **Instant Net Balances**: Green badges for when you're owed money, orange/red for when you owe.

### 📊 Spending Insights & Analytics
- **Category Donut Chart**: Beautiful visual breakdown of where the group's money went.
- **Member Filter**: Toggle between total group spending or view an individual member's personal share.
- **Top Categories**: Clean progress bars showing spending by category with percentages.

### 🎨 Custom Categories
- Built-in essentials: Food & Dining, Travel, Housing, Entertainment, Utilities, and Shopping.
- Add your own categories with custom icons and color tags.
- Safe deletion that automatically moves associated expenses to General.

---

## 🏗️ Architecture for Developers

EquiSplit is built with a clean, decoupled architecture designed for performance and maintainability:

```text
┌────────────────────────────────────────────────────────┐
│                   React Native UI                      │
│       Screens, Design Tokens, Navigation, Modals       │
└───────────────────────────┬────────────────────────────┘
                            │ React-Redux
┌───────────────────────────▼────────────────────────────┐
│                 Redux Toolkit Store                    │
│      expensesSlice  •  membersSlice  •  categoriesSlice │
└───────────────────────────┬────────────────────────────┘
                            │ Async Service layer
┌───────────────────────────▼────────────────────────────┐
│              Local SQLite Database (OP-SQLite)         │
│          Direct C++ JSI bindings for high-speed        │
│          queries, auto-migrations, and seeds           │
└────────────────────────────────────────────────────────┘
```

- **Local-First & Fast**: Local SQLite via `@op-engineering/op-sqlite` executes synchronously over C++ JSI without React Native bridge lag.
- **Predictable State**: Redux Toolkit acts as an in-memory read-cache, keeping UI interactions snappy at 60 FPS.
- **Type-Safe**: Written in strict TypeScript with path aliases (`@/*` mapping to `src/*`).

---

## 📁 Project Structure

```text
src/
├── assets/             # Icons, fonts (Manrope & IBM Plex Sans), and logos
├── components/
│   ├── common/         # Modals, category pickers, confirmation dialogs
│   └── ui/             # Reusable UI primitives (AppButton, AppInput, AppText, AppBadge)
├── config/             # Category presets, color palettes, and default constants
├── navigation/         # Root stack and bottom tab navigation
├── screens/
│   ├── Home/           # Main dashboard with expense feed and balance overview
│   ├── AddEditExpense/ # Form supporting all split modes and multi-payers
│   ├── SplitDetails/   # Full expense audit breakdown and participant view
│   ├── Members/        # Member management and pairwise debt settlements
│   └── Analytics/      # Spending donut chart and category breakdowns
├── services/
│   ├── database/       # SQLite repositories (connection, members, expenses, categories)
│   └── toast/          # Centralized toast alert dispatcher
├── store/              # Redux slices and store configuration
├── theme/              # Color palette, spacing, typography, and border tokens
├── types/              # Domain models and navigation type definitions
└── utils/              # Debt simplification, balance calculations, currency helpers
```

---

## 🛠️ Tech Stack

| Tool / Library | Role |
| :--- | :--- |
| **React Native 0.87** | Cross-platform mobile framework (Android & iOS) |
| **TypeScript** | Strict type safety and maintainable codebase |
| **Redux Toolkit** | Centralized application state management |
| **OP-SQLite** | High-performance C++ JSI SQLite storage engine |
| **React Navigation 7** | Native Stack and Bottom Tabs navigation |
| **Gifted Charts** | Donut and bar charts for analytics |
| **Linear Gradient** | Rich visual gradients and styled components |

---

## 🚀 Getting Started

### Prerequisites

Make sure your machine is set up for React Native development:
- **Node.js**: `>= 22.11.0`
- **Android**: Android Studio with Android SDK 34+ and NDK
- **iOS** *(macOS only)*: Xcode 15+ and CocoaPods (`gem install cocoapods`)
- **Java**: JDK 17

### 1. Installation

Clone the project and install dependencies:

```bash
git clone https://github.com/tarangpatel03/equisplit.git
cd equisplit
npm install
```

For iOS, install the CocoaPods dependencies:
```bash
cd ios && pod install && cd ..
```

### 2. Run the App

Start the Metro bundler:
```bash
npm start
```

Run on your connected device or emulator:

```bash
# For Android
npm run android

# For iOS
npm run ios
```

---

## 🧪 Running Tests

EquiSplit includes unit tests covering debt simplification and balance calculation logic:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch
```

---

## 🤝 Contributing & Code Style

- Use **path aliases** (`@/*`) instead of long relative paths.
- Co-locate styles in `styles.ts` files alongside their respective components.
- Follow [Conventional Commits](https://www.conventionalcommits.org/) for clean git history.

---

<div align="center">
Made with ❤️ for simple, stress-free group expense sharing.
</div>
