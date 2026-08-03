sap.ui.define([
	"novamart/inventory/controller/BaseController",
	"novamart/inventory/model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/ui/core/Fragment",
	"novamart/inventory/model/StorageManager"
], function (BaseController, formatter, JSONModel, Filter, FilterOperator, Sorter, Fragment, StorageManager) {
	"use strict";

	return BaseController.extend("novamart.inventory.controller.List", {
		formatter: formatter,

		onInit: function () {
			var oViewModel = new JSONModel({
				headerTitle: this.getText("masterCountLabel", [0]),
				isFilterActive: false,
				isLowStockFilterPressed: false,
				isBusy: false,
				kpiTotalCount: 0,
				kpiLowStockCount: 0,
				kpiOutOfStockCount: 0
			});
			this.setModel(oViewModel, "masterView");

			var oTable = this.byId("productsTable");
			if (oTable) {
				oTable.attachEvent("updateFinished", this._onTableUpdateFinished, this);
			}

			var oProductsModel = this.getOwnerComponent().getModel("products");
			if (oProductsModel) {
				if (oProductsModel.getData() && oProductsModel.getData().products) {
					this._updateKpiStatistics();
				} else {
					oProductsModel.attachRequestCompleted(this._updateKpiStatistics, this);
				}
			}
		},

		
		_updateKpiStatistics: function () {
			var oProductsModel = this.getModel("products");
			if (!oProductsModel) {
				return;
			}
			var aProducts = oProductsModel.getProperty("/products") || [];

			var iTotal = aProducts.length;
			var iLowStock = 0;
			var iOutOfStock = 0;

			aProducts.forEach(function (item) {
				var stock = parseInt(item.stock, 10) || 0;
				var threshold = parseInt(item.reorderThreshold, 10) || 10;

				if (stock === 0) {
					iOutOfStock++;
				} else if (stock <= threshold) {
					iLowStock++;
				}
			});

			var oViewModel = this.getModel("masterView");
			if (oViewModel) {
				oViewModel.setProperty("/kpiTotalCount", iTotal);
				oViewModel.setProperty("/kpiLowStockCount", iLowStock);
				oViewModel.setProperty("/kpiOutOfStockCount", iOutOfStock);
			}
		},

		_onTableUpdateFinished: function (oEvent) {
			var iTotalItems = oEvent.getParameter("total");
			var sTitle = this.getText("masterCountLabel", [iTotalItems]);
			this.getModel("masterView").setProperty("/headerTitle", sTitle);
			this._updateKpiStatistics();
		},

		
		onSearch: function (oEvent) {
			var sQuery = oEvent.getParameter("newValue");
			if (sQuery === undefined || sQuery === null) {
				sQuery = oEvent.getParameter("query") || "";
			}
			var aFilters = [];

			if (sQuery && sQuery.trim().length > 0) {
				var sTerm = sQuery.trim();
				var oFilterName = new Filter("name", FilterOperator.Contains, sTerm);
				var oFilterCategory = new Filter("category", FilterOperator.Contains, sTerm);
				var oFilterSKU = new Filter("sku", FilterOperator.Contains, sTerm);
				var oFilterSupplier = new Filter("supplier", FilterOperator.Contains, sTerm);

				aFilters.push(new Filter({
					filters: [oFilterName, oFilterCategory, oFilterSKU, oFilterSupplier],
					and: false
				}));
			}

			var oTable = this.byId("productsTable");
			if (oTable) {
				var oBinding = oTable.getBinding("items");
				if (oBinding) {
					oBinding.filter(aFilters);
				}
			}
		},

		
		onToggleLowStockFilter: function (oEvent) {
			var bPressed = oEvent.getParameter("pressed");
			var oTable = this.byId("productsTable");
			if (!oTable) {
				return;
			}
			var oBinding = oTable.getBinding("items");
			if (!oBinding) {
				return;
			}

			if (bPressed) {
				this.onFilterLowStockOnly();
			} else {
				oBinding.filter([]);
			}
		},

		
		onFilterLowStockOnly: function () {
			this.getModel("masterView").setProperty("/isLowStockFilterPressed", true);
			var oTable = this.byId("productsTable");
			if (!oTable) {
				return;
			}
			var oBinding = oTable.getBinding("items");
			if (!oBinding) {
				return;
			}

			var aProducts = this.getModel("products").getProperty("/products") || [];
			var aLowStockFilters = [];

			aProducts.forEach(function (item) {
				var stock = parseInt(item.stock, 10) || 0;
				var threshold = parseInt(item.reorderThreshold, 10) || 10;
				if (stock > 0 && stock <= threshold) {
					aLowStockFilters.push(new Filter("productId", FilterOperator.EQ, item.productId));
				}
			});

			if (aLowStockFilters.length > 0) {
				oBinding.filter([new Filter({
					filters: aLowStockFilters,
					and: false
				})]);
			} else {
				oBinding.filter([new Filter("productId", FilterOperator.EQ, "__NONE__")]);
			}

			this.showMessageToast(this.getText("btnLowStockFilter"));
		},

		onFilterOutOfStockOnly: function () {
			var oTable = this.byId("productsTable");
			if (oTable) {
				var oBinding = oTable.getBinding("items");
				if (oBinding) {
					oBinding.filter([new Filter("stock", FilterOperator.EQ, 0)]);
				}
			}
			this.showMessageToast(this.getText("statusOutOfStock"));
		},

		
		onProductSelect: function (oEvent) {
			this._navigateToProduct(oEvent);
		},

		onProductPress: function (oEvent) {
			this._navigateToProduct(oEvent);
		},

		_navigateToProduct: function (oEventOrItem) {
			if (!oEventOrItem) {
				return;
			}

			var oBindingContext = null;

			if (typeof oEventOrItem.getBindingContext === "function") {
				oBindingContext = oEventOrItem.getBindingContext("products");
			}

			if (!oBindingContext && typeof oEventOrItem.getParameter === "function") {
				var oListItem = oEventOrItem.getParameter("listItem");
				if (oListItem && typeof oListItem.getBindingContext === "function") {
					oBindingContext = oListItem.getBindingContext("products");
				}
			}

			if (!oBindingContext && typeof oEventOrItem.getSource === "function") {
				var oSource = oEventOrItem.getSource();
				if (oSource && typeof oSource.getBindingContext === "function") {
					oBindingContext = oSource.getBindingContext("products");
				}
			}

			if (!oBindingContext) {
				var oTable = this.byId("productsTable");
				if (oTable && typeof oTable.getSelectedItem === "function") {
					var oSel = oTable.getSelectedItem();
					if (oSel && typeof oSel.getBindingContext === "function") {
						oBindingContext = oSel.getBindingContext("products");
					}
				}
			}

			if (!oBindingContext) {
				return;
			}

			var sProductId = oBindingContext.getProperty("productId");
			if (!sProductId) {
				return;
			}
			
			this.setAppLayout("TwoColumnsMidExpanded");

			this.getRouter().navTo("detail", {
				productId: sProductId
			});
		},

		onQuickReorder: function (oEvent) {
			var oButton = oEvent.getSource();
			var oBindingContext = oButton.getBindingContext("products");
			if (!oBindingContext) {
				return;
			}

			var oProduct = oBindingContext.getObject();
			var iNewStock = (parseInt(oProduct.stock, 10) || 0) + 25;

			var oProductsModel = this.getModel("products");
			oProductsModel.setProperty(oBindingContext.getPath() + "/stock", iNewStock);
			oProductsModel.setProperty(oBindingContext.getPath() + "/lastUpdated", new Date().toISOString().split("T")[0]);

			StorageManager.saveLocalProducts(oProductsModel.getProperty("/products"));
			oProductsModel.refresh(true);
			this._updateKpiStatistics();

			this.showMessageToast(this.getText("msgReorderSuccess", [oProduct.name, iNewStock]));
		},

		onBulkReorder: function () {
			var oTable = this.byId("productsTable");
			if (!oTable) {
				return;
			}
			var aSelectedItems = oTable.getSelectedItems();
			if (!aSelectedItems || aSelectedItems.length === 0) {
				this.showMessageToast("Please select at least one product using the checkboxes.");
				return;
			}

			var oProductsModel = this.getModel("products");
			var iCount = 0;

			aSelectedItems.forEach(function (oItem) {
				var oContext = oItem.getBindingContext("products");
				if (oContext) {
					var oProduct = oContext.getObject();
					var iNewStock = (parseInt(oProduct.stock, 10) || 0) + 25;
					oProductsModel.setProperty(oContext.getPath() + "/stock", iNewStock);
					oProductsModel.setProperty(oContext.getPath() + "/lastUpdated", new Date().toISOString().split("T")[0]);
					iCount++;
				}
			});

			StorageManager.saveLocalProducts(oProductsModel.getProperty("/products"));
			oProductsModel.refresh(true);
			this._updateKpiStatistics();

			this.showMessageToast(this.getText("msgBulkReorderSuccess", [iCount]));
		},

		
		onExportCSV: function () {
			var oProductsModel = this.getModel("products");
			if (!oProductsModel) {
				return;
			}
			var aProducts = oProductsModel.getProperty("/products") || [];

			var aHeader = ["Product ID", "Name", "Category", "SKU", "Price (INR)", "Stock", "Reorder Threshold", "Supplier", "Warehouse", "Last Updated"];
			var aRows = [aHeader.join(",")];

			aProducts.forEach(function (p) {
				var row = [
					'"' + (p.productId || '') + '"',
					'"' + (p.name || '') + '"',
					'"' + (p.category || '') + '"',
					'"' + (p.sku || '') + '"',
					p.price || 0,
					p.stock || 0,
					p.reorderThreshold || 0,
					'"' + (p.supplier || '') + '"',
					'"' + (p.warehouse || '') + '"',
					'"' + (p.lastUpdated || '') + '"'
				];
				aRows.push(row.join(","));
			});

			var sCsvContent = "data:text/csv;charset=utf-8," + aRows.join("\n");
			var sEncodedUri = encodeURI(sCsvContent);
			var oLink = document.createElement("a");
			oLink.setAttribute("href", sEncodedUri);
			oLink.setAttribute("download", "NovaMart_Inventory_Report_" + new Date().toISOString().split("T")[0] + ".csv");
			document.body.appendChild(oLink);
			oLink.click();
			document.body.removeChild(oLink);

			this.showMessageToast(this.getText("msgExportSuccess"));
		},

		onResetDataset: function () {
			StorageManager.resetLocalStorage();
			var oProductsModel = this.getModel("products");
			if (oProductsModel) {
				oProductsModel.loadData("model/products.json");
				oProductsModel.attachRequestCompleted(function () {
					this._updateKpiStatistics();
					this.showMessageToast(this.getText("msgDatasetResetSuccess"));
				}.bind(this));
			}
		},

	
		onResetFilters: function () {
			this.byId("searchField").setValue("");
			this.getModel("masterView").setProperty("/isLowStockFilterPressed", false);
			var oTable = this.byId("productsTable");
			if (oTable) {
				var oBinding = oTable.getBinding("items");
				if (oBinding) {
					oBinding.filter([]);
					oBinding.sort([new Sorter("name", false)]);
				}
			}
			this.showMessageToast(this.getText("btnResetFilters"));
		},

		
		onOpenViewSettings: function () {
			var oView = this.getView();

			if (!this._pViewSettingsDialog) {
				this._pViewSettingsDialog = Fragment.load({
					id: oView.getId(),
					name: "novamart.inventory.fragment.ViewSettings",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}

			this._pViewSettingsDialog.then(function (oDialog) {
				oDialog.open();
			});
		},

		
		onConfirmViewSettings: function (oEvent) {
			var oTable = this.byId("productsTable");
			if (!oTable) {
				return;
			}
			var oBinding = oTable.getBinding("items");
			var mParams = oEvent.getParameters();

			var aSorters = [];
			if (mParams.groupItem) {
				var sGroupPath = mParams.groupItem.getKey();
				aSorters.push(new Sorter(sGroupPath, mParams.groupDescending, true));
			}
			if (mParams.sortItem) {
				var sSortPath = mParams.sortItem.getKey();
				aSorters.push(new Sorter(sSortPath, mParams.sortDescending));
			}
			oBinding.sort(aSorters);

			var aFilters = [];
			if (mParams.filterItems && mParams.filterItems.length > 0) {
				mParams.filterItems.forEach(function (oItem) {
					var sKey = oItem.getKey();
					if (sKey === "OUT_OF_STOCK") {
						aFilters.push(new Filter("stock", FilterOperator.EQ, 0));
					} else if (sKey === "LOW_STOCK") {
						aFilters.push(new Filter("stock", FilterOperator.GT, 0));
					} else if (sKey === "AVAILABLE") {
						aFilters.push(new Filter("stock", FilterOperator.GT, 15));
					}
				});
			}
			oBinding.filter(aFilters);
		},

		
		onAddProduct: function () {
			var sNextId = "NM-IN-" + (Math.floor(200 + Math.random() * 800));
			var oNewProductData = {
				isEdit: false,
				productId: sNextId,
				name: "",
				category: "Gourmet Spices & Oils",
				sku: "SKU-" + Math.floor(1000 + Math.random() * 9000),
				price: "2450.00",
				currency: "INR",
				stock: "25",
				reorderThreshold: "10",
				supplier: "NovaMart Agro India",
				warehouse: "WH-Mumbai-M1",
				description: "",
				imageUrl: "https://openui5.hana.ondemand.com/test-resources/sap/ui/documentation/sdk/images/HT-1000.jpg",
				lastUpdated: new Date().toISOString().split("T")[0],
				valStateId: "None",
				valStateName: "None",
				valStateSKU: "None",
				valStatePrice: "None",
				valStateStock: "None",
				valStateThreshold: "None"
			};

			this._openAddEditDialog(oNewProductData);
		},

		_openAddEditDialog: function (oData) {
			var oView = this.getView();
			var oDialogModel = new JSONModel(oData);
			this.setModel(oDialogModel, "dialogModel");

			if (!this._pAddEditDialog) {
				this._pAddEditDialog = Fragment.load({
					id: oView.getId(),
					name: "novamart.inventory.fragment.AddEditProduct",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}

			this._pAddEditDialog.then(function (oDialog) {
				oDialog.open();
			});
		},

	
		onSaveProductDialog: function () {
			if (!this.onValidateDialogInputs()) {
				this.showMessageToast(this.getText("msgSaveError"));
				return;
			}

			var oDialogModel = this.getModel("dialogModel");
			var oData = oDialogModel.getData();
			var oProductsModel = this.getModel("products");
			var aProducts = oProductsModel.getProperty("/products") || [];

			var oProductToSave = {
				productId: oData.productId,
				name: oData.name,
				category: oData.category,
				sku: oData.sku,
				price: parseFloat(oData.price),
				currency: oData.currency || "INR",
				stock: parseInt(oData.stock, 10),
				reorderThreshold: parseInt(oData.reorderThreshold, 10),
				supplier: oData.supplier || "NovaMart Agro India",
				warehouse: oData.warehouse || "WH-Main-01",
				description: oData.description || "",
				imageUrl: oData.imageUrl || "",
				lastUpdated: new Date().toISOString().split("T")[0]
			};

			if (oData.isEdit) {
				for (var i = 0; i < aProducts.length; i++) {
					if (aProducts[i].productId === oData.productId) {
						aProducts[i] = oProductToSave;
						break;
					}
				}
			} else {
				aProducts.unshift(oProductToSave);
			}

			oProductsModel.setProperty("/products", aProducts);
			StorageManager.saveLocalProducts(aProducts);
			oProductsModel.refresh(true);
			this._updateKpiStatistics();

			this.showMessageToast(this.getText("msgSaveSuccess", [oData.name]));
			this.onCloseProductDialog();

			// Auto navigate to the new or edited product
			this.getRouter().navTo("detail", {
				productId: oData.productId
			});
			this.setAppLayout("TwoColumnsMidExpanded");
		},

		onCloseProductDialog: function () {
			if (this._pAddEditDialog) {
				this._pAddEditDialog.then(function (oDialog) {
					oDialog.close();
				});
			}
		},

		onOpenValueHelpSupplier: function () {
			var oView = this.getView();
			if (!this._pValueHelpDialog) {
				this._pValueHelpDialog = Fragment.load({
					id: oView.getId(),
					name: "novamart.inventory.fragment.ValueHelpSupplier",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}

			this._pValueHelpDialog.then(function (oDialog) {
				oDialog.open();
			});
		},

		onConfirmSupplierValueHelp: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				var sSupplier = oSelectedItem.getTitle();
				this.getModel("dialogModel").setProperty("/supplier", sSupplier);
			}
		},

		onOpenQUnitTestDialog: function () {
			var oView = this.getView();
			if (this._oQUnitTestDialog) {
				this._oQUnitTestDialog.open();
				return;
			}

			var oDialog = new sap.m.Dialog({
				title: "NovaMart QUnit Automated Unit Tests",
				contentWidth: "850px",
				contentHeight: "520px",
				resizable: true,
				draggable: true,
				content: new sap.ui.core.HTML({
					content: '<div style="padding:15px; background:#ffffff; min-height:450px; overflow:auto;"><div id="qunit"></div><div id="qunit-fixture"></div></div>'
				}),
				endButton: new sap.m.Button({
					text: "Close",
					press: function () {
						oDialog.close();
					}
				})
			});

			oView.addDependent(oDialog);
			this._oQUnitTestDialog = oDialog;

			oDialog.attachAfterOpen(function () {
				var fnRunTests = function () {
					sap.ui.require(["novamart/inventory/test/unit/formatterTest"], function () {
						if (window.QUnit && typeof window.QUnit.start === "function") {
							try {
								window.QUnit.start();
							} catch (e) {
								console.log("QUnit started", e);
							}
						}
					});
				};

				if (!window.QUnit || typeof window.QUnit.start !== "function") {
					// Pre-configure QUnit object to disable autostart BEFORE script is appended
					window.QUnit = {
						config: {
							autostart: false
						}
					};

					var oCss = document.createElement("link");
					oCss.rel = "stylesheet";
					oCss.href = "https://code.jquery.com/qunit/qunit-2.19.4.css";
					document.head.appendChild(oCss);

					var oJs = document.createElement("script");
					oJs.src = "https://code.jquery.com/qunit/qunit-2.19.4.js";
					oJs.onload = function () {
						fnRunTests();
					};
					document.head.appendChild(oJs);
				} else {
					fnRunTests();
				}
			});

			oDialog.open();
		},

		onChangeThemeLight: function () {
			this.setAppTheme("sap_horizon");
		},
		onChangeThemeDark: function () {
			this.setAppTheme("sap_horizon_dark");
		},
		onChangeLangEN: function () {
			this.setAppLanguage("en");
		},
		onChangeLangDE: function () {
			this.setAppLanguage("de");
		},
		onChangeLangHI: function () {
			this.setAppLanguage("hi");
		}
	});
});