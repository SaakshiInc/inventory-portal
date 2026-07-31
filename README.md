# NovaMart Distributors - Product Inventory & Order Management Portal
> **Industry-Standard SAPUI5 Capstone Project**  
> Built with Freestyle SAPUI5, `sap.f.FlexibleColumnLayout` (Master-Detail), Client-Side JSON Model, LocalStorage Persistence, Multi-language i18n, Reusable Fragments, Custom Formatters, and QUnit Testing.
---
## 🔗 Project Links & Submission Metadata
- 📦 **Git Repository**: [https://github.com/SaakshiInc/inventory-portal](https://github.com/SaakshiInc/inventory-portal)
- 🌐 **Live Application URL**: [https://port38695-workspaces-ws-4ac9c.us10.trial.applicationstudio.cloud.sap](https://port38695-workspaces-ws-4ac9c.us10.trial.applicationstudio.cloud.sap)
- 🧪 **QUnit Unit Tests**: Integrated in-app via green `[🧪 Run QUnit Tests]` button on header toolbar
- 🇮🇳 **Domain & Currency**: Custom authored Indian distribution dataset (20 products) in Indian Rupees (`₹`)
---
## 🚀 How to Run in SAP Business Application Studio (BAS)
### Step 1: Open Terminal in BAS
```
inventory-portal/
├── package.json                    # Project metadata & start scripts
├── README.md                       # Documentation, BAS guide & Rubric matrix
├── README.md                       # Documentation, BAS guide, links & Rubric matrix
└── webapp/
    ├── index.html                  # App entry point bootstrapping OpenUI5
    ├── Component.js                # Root UIComponent with router & storage sync
|
 11 
|
**
Custom Formatter Module
**
|
`webapp/model/formatter.js`
 with 
`stockStatusState`
, 
`stockStatusText`
, 
`stockStatusIcon`
, 
`currencyValue`
, 
`formatDate`
, 
`categoryIcon`
, 
`stockPercent`
|
 ✅ Complete 
|
|
 12 
|
**
Reusable Dialog Fragments
**
|
 Reusable fragments: 
`AddEditProduct.fragment.xml`
, 
`ViewSettings.fragment.xml`
, 
`ValueHelpSupplier.fragment.xml`
|
 ✅ Complete 
|
