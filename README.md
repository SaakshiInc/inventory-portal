# NovaMart Distributors - Product Inventory & Order Management Portal
> **Industry-Standard SAPUI5 Capstone Project**  
> Built with Freestyle SAPUI5, `sap.f.FlexibleColumnLayout` (Master-Detail), Client-Side JSON Model, LocalStorage Persistence, Multi-language i18n, Reusable Fragments, Custom Formatters, and QUnit Testing.
---
## 🔗 Project Links & Submission Metadata
- 📦 **Git Repository**: [https://github.com/SaakshiInc/inventory-portal](https://github.com/SaakshiInc/inventory-portal)
- 🌐 **Live Application URL**: [https://port3000-workspaces-ws-4ac9c.us10.trial.applicationstudio.cloud.sap](https://port3000-workspaces-ws-4ac9c.us10.trial.applicationstudio.cloud.sap)
- 🧪 **QUnit Unit Tests**: Integrated in-app via green `[🧪 Run QUnit Tests]` button on header toolbar
- 🇮🇳 **Domain & Currency**: Custom authored Indian distribution dataset (20 products) in Indian Rupees (`₹`)
---
## 🚀 How to Run in SAP Business Application Studio (BAS)
### Step 1: Open Terminal in BAS
Open your SAP Business Application Studio workspace terminal and navigate to the project root:
```bash
cd /home/user/projects/inventory-portal
```
### Step 2: Start the Application Dev Server
Run the following command to serve the application:
Run either of these simple commands to serve the application:
```bash
npx serve webapp
```
or
```bash
npm start
```
### Step 3: Open in Browser
Click on the generated workspace preview link in BAS or open:
`https://port38695-workspaces-ws-4ac9c.us10.trial.applicationstudio.cloud.sap`
---
## 📁 Project Structure
```
inventory-portal/
├── package.json                    # Project metadata & start scripts
├── README.md                       # Documentation, BAS guide, links & Rubric matrix
└── webapp/
    ├── index.html                  # App entry point bootstrapping OpenUI5
    ├── Component.js                # Root UIComponent with router & storage sync
    ├── manifest.json               # App descriptor (metadata, routing, models)
    ├── css/
    │   └── style.css               # Custom Fiori Horizon styling enhancements
    ├── i18n/
    │   ├── i18n.properties         # English (Default) resource bundle
    │   ├── i18n_en.properties      # English (US) bundle
    │   ├── i18n_en_IN.properties   # English (India) bundle
    │   ├── i18n_de.properties      # German (DE) bundle
    │   └── i18n_hi.properties      # Hindi (HI) bundle
    ├── model/
    │   ├── products.json           # Authored Indian distribution dataset (20 products)
    │   ├── formatter.js            # Custom formatters (status, currency, date, icons)
    │   └── StorageManager.js       # Browser LocalStorage synchronization helper
    ├── controller/
    │   ├── BaseController.js       # Abstract base controller with shared utilities
    │   ├── App.controller.js        # FlexibleColumnLayout shell controller
    │   ├── List.controller.js       # Master view controller (Search, Sort, Filter, CRUD)
    │   ├── Detail.controller.js     # Detail view controller (Element binding, Stock adjustment)
    │   └── NotFound.controller.js   # Fallback controller for invalid product IDs / routes
    ├── view/
    │   ├── App.view.xml            # Shell view with FlexibleColumnLayout
    │   ├── List.view.xml           # Master list view with Table & KPI Header Tiles
    │   ├── Detail.view.xml         # Detail page view with form panels & quick adjustment
    │   └── NotFound.view.xml       # IllustratedMessage fallback view
    ├── fragment/
    │   ├── AddEditProduct.fragment.xml    # Reusable Create/Edit dialog with validation
    │   ├── ViewSettings.fragment.xml      # ViewSettingsDialog for sort, filter, group
    │   └── ValueHelpSupplier.fragment.xml # Supplier selection value help dialog
    └── test/
        └── unit/
            ├── unitTests.qunit.html       # Standalone QUnit runner page
            ├── unitTests.qunit.js         # QUnit entrypoint script
            └── formatterTest.js           # Unit tests for formatter.js
```
---
## 🌟 Implemented Features
1. **Executive KPI Dashboard Tiles**:
   - 3 real-time interactive tiles: *Total Products* (20), *Low Stock Alerts* (6), and *Out of Stock Items* (1). Click any tile for instant filtering.
2. **Master-Detail Navigation & Routing**:
   - `sap.f.FlexibleColumnLayout` with `#` (master), `#/product/{productId}` (detail), and `:all*:` (notFound) routing. Preserves context on page refresh.
3. **Authored Indian FMCG Dataset**:
   - 20 unique authored products across Gourmet Spices, Dairy, Kitchenware, Hygiene, and Packaging with **Indian Rupee (`₹`)** currency formatting.
4. **Multi-Select Bulk & Inline Stock Operations**:
   - Select multiple table items to perform **Bulk Reorder (+25)**, or click inline row buttons, or use on-the-fly stock controls (`+1`, `+10`, `+25`, `-1`) in the detail pane.
5. **Export to CSV Report Download**:
   - One-click **Export to CSV** button on the master list header toolbar to download an inventory spreadsheet.
6. **Reusable Fragments & Validation**:
   - `AddEditProduct.fragment.xml` used for both Create and Edit operations with real-time `ValueState="Error"` validation for required and numeric fields.
7. **Multi-Language i18n & Theme Switchers**:
   - 100% externalized text supporting English, German, and Hindi bundles alongside Horizon Light and Horizon Dark themes.
8. **In-App QUnit Automated Unit Testing**:
   - Integrated green **`[🧪 Run QUnit Tests]`** button on top toolbar opening a native test window with 6 test suites / 19 passing assertions.
---