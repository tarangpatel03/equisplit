# Settings Screen Status & Roadmap

This document outlines the current implementation status and remaining roadmap for the **Settings** screen in EquiSplit.

---

## 1. Overview & Architecture

The **Settings** screen is accessible via the bottom tab navigation bar (`BottomTabRoutes.Settings`). It consolidates application preferences, profile management, data backups, and theme customization while decluttering the Dashboard.

- **Screen Location**: `src/screens/Settings/`
  - `index.tsx`: Main screen container & layout
  - `styles.ts`: Theme-tokenized styles
  - `hooks/useSettingsScreen.ts`: State management and business logic
  - `components/`: Modular UI blocks (`ProfileCard`, `SettingSection`, `SettingItem`, `SwitchPrimaryModal`)

---

## 2. Completed Features

### Profile & Identity Management
- [x] **Primary Member Card (`ProfileCard`)**:
  - Displays the active "You" user avatar, name, email, and "Primary" badge.
  - Includes a "Switch" action button to quickly change the active persona.
- [x] **Switch Primary Persona Modal (`SwitchPrimaryModal`)**:
  - Displays all group members with avatar initials and indicator of current primary user.
  - Persists primary user selection in SQLite database and updates Redux `memberSlice`.
  - Reflects immediately across Home, Members, Analytics, and Add Expense screens.

### Preferences Section
- [x] **Category Management**:
  - Directly accessible via the "Categories" setting item (moved here from the Dashboard header).
  - Opens `CategoryManagerModal` for complete category CRUD (custom names, icons from `lucide-react-native`, colors from curated palette).
  - Protected fallback category (`Other Expenses`) prevents accidental deletion.
  - Category creation and editing fully themed for dark and light modes (`CategoryFormModal`).
- [x] **Theme Switching (Dark / Light)**:
  - Toggle switch in Settings allowing immediate switching between Dark and Light palettes.
  - Hardware-accelerated phased cross-fade transition (`ThemeTransitionOverlay`) that masks instant color snaps with a 450ms smooth dissolve.
  - Coordinated with `LayoutAnimation` for responsive switch thumb and card transitions.
  - Theme preference persisted in `AsyncStorage`.
- [x] **Currency Display**:
  - Displays fixed `₹ INR` currency badge.

### App Branding & Footer
- [x] App icon (`ic_app_logo`), app name (`EquiSplit`), version information (`1.0.0 (Build 1)`), and tagline.

---

## 3. Pending Features & Next Steps

### 1. Multi-Format Data Export (`Export Data`)
- [ ] **Export Options Modal (`ExportDataModal`)**:
  - Present format options: **JSON** and **CSV** (ZIP format dropped as agreed).
  - Provide distinct export scopes:
    - **Personal Expenses** (Date, Category, Title, Type: Inflow/Outflow, Amount, Note)
    - **Group Expenses** (Date, Title, Category, Total Amount, Paid By, Split Method, Individual Shares)
    - **Complete Backup** (All entities including Members, Categories, and Transactions)
- [ ] **File Serialization & Sharing Utilities**:
  - JSON serializer producing structured importable/exportable backup payload.
  - CSV string generator producing standard spreadsheet-compatible tables.
  - Integration with React Native `Share` API to allow saving or sending exported files via WhatsApp, Drive, Email, etc.

### 2. Share Balance Summary (`Share Balances`)
- [ ] **Balance Calculation & Message Generator**:
  - Calculate simplified group debts (who owes whom how much).
  - Format a human-readable text summary (e.g., breakdown of outstanding balances and settlements).
  - Open native share sheet via `Share.share({ message: ... })`.
  - *Note*: Specific copy/formatting template to be aligned with the user prior to final implementation.

### 3. Clear Data Action (`Clear Data`)
- [ ] **Dangerous Action Confirmation**:
  - Connect `AppConfirmDialog` to warn the user that transaction history will be purged.
  - Option to clear transaction records (personal & group expenses) while preserving group members and categories.
  - Reload Redux slices and SQLite database state after confirmation.

### 4. Reserved Preference Slot
- [ ] **Upcoming Toggle Switch**:
  - Slot reserved in the `Preferences` section for the planned upcoming setting toggle (specification pending user input).

---

## 4. File Checklist

| File | Status | Notes |
| :--- | :---: | :--- |
| `src/screens/Settings/index.tsx` | Complete | Houses sections, items, and modals |
| `src/screens/Settings/styles.ts` | Complete | Theme-aware stylesheet |
| `src/screens/Settings/hooks/useSettingsScreen.ts` | In Progress | Theme toggle & profile switch done; Export/Share handlers pending |
| `src/screens/Settings/components/ProfileCard.tsx` | Complete | Primary member preview |
| `src/screens/Settings/components/SettingSection.tsx` | Complete | Card wrapper with header |
| `src/screens/Settings/components/SettingItem.tsx` | Complete | Generic row supporting chevrons, badges, switches |
| `src/screens/Settings/components/SwitchPrimaryModal.tsx` | Complete | Fast profile switching |
| `src/screens/Settings/components/ExportDataModal.tsx` | **Pending** | Needs creation for JSON/CSV exports |
| `src/utils/exportData.ts` | **Pending** | Serialization logic for CSV/JSON |
| `src/components/common/ThemeTransitionOverlay.tsx` | Complete | Smooth dark/light cross-fade overlay |
