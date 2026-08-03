sap.ui.define([
	"novamart/inventory/controller/BaseController",
	"novamart/inventory/model/formatter",
	"novamart/inventory/model/StorageManager",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment"
], function (BaseController, formatter, StorageManager, JSONModel, Fragment) {
	"use strict";
	return BaseController.extend("novamart.inventory.controller.Detail", {
		formatter: formatter,
		onInit: function () {
			this.getRouter().getRoute("detail").attachPatternMatched(this._onProductMatched, this);
		},

		_onProductMatched: function (oEvent) {
			var sProductId = oEvent.getParameter("arguments").productId;
			this._sCurrentProductId = sProductId;
			this.setAppLayout("TwoColumnsMidExpanded");
			var oProductsModel = this.getModel("products");
			if (!oProductsModel) {
				return;
			}
			var fnBind = function () {
				var aProducts = oProductsModel.getProperty("/products") || [];
				var iIndex = -1;
				for (var i = 0; i < aProducts.length; i++) {
					if (String(aProducts[i].productId) === String(sProductId)) {
						iIndex = i;
						break;
					}
				}
				if (iIndex !== -1) {
					this.getView().bindElement("products>/products/" + iIndex);
				} else if (aProducts.length > 0) {
					this.getRouter().getTargets().display("notFound");
				}
			}.bind(this);
			var aCurrentProducts = oProductsModel.getProperty("/products");
			if (aCurrentProducts && aCurrentProducts.length > 0) {
				fnBind();
			} else {
				oProductsModel.attachEventOnce("requestCompleted", fnBind, this);
				setTimeout(fnBind, 200);
			}
		},
		/**
		 */
		onReorderStock: function () {
			this._modifyStock(25);
		},
		onAdjustStock1: function () {
			this._modifyStock(1);
		},
		onAdjustStock10: function () {
			this._modifyStock(10);
		},
		onAdjustStockMinus1: function () {
			this._modifyStock(-1);
		},
		_modifyStock: function (iDelta) {
			var oBindingContext = this.getView().getBindingContext("products");
			if (!oBindingContext) {
				return;
			}
			var oProduct = oBindingContext.getObject();
			var iCurrent = parseInt(oProduct.stock, 10) || 0;
			var iNewStock = Math.max(iCurrent + iDelta, 0);
			var oProductsModel = this.getModel("products");
			oProductsModel.setProperty(oBindingContext.getPath() + "/stock", iNewStock);
			oProductsModel.setProperty(oBindingContext.getPath() + "/lastUpdated", new Date().toISOString().split("T")[0]);
			StorageManager.saveLocalProducts(oProductsModel.getProperty("/products"));
			oProductsModel.refresh(true);
			this.showMessageToast(this.getText("msgReorderSuccess", [oProduct.name, iNewStock]));
		},
		/**
		 */
		onEditProduct: function () {
			var oBindingContext = this.getView().getBindingContext("products");
			if (!oBindingContext) {
				return;
			}
			var oProduct = oBindingContext.getObject();
			var oEditData = {
				isEdit: true,
				productId: oProduct.productId,
				name: oProduct.name,
				category: oProduct.category,
				sku: oProduct.sku,
				price: oProduct.price,
				currency: oProduct.currency || "INR",
				stock: oProduct.stock,
				reorderThreshold: oProduct.reorderThreshold,
				supplier: oProduct.supplier,
				warehouse: oProduct.warehouse,
				description: oProduct.description,
				imageUrl: oProduct.imageUrl,
				valStateId: "None",
				valStateName: "None",
				valStateSKU: "None",
				valStatePrice: "None",
				valStateStock: "None",
				valStateThreshold: "None"
			};
			var oView = this.getView();
			var oDialogModel = new JSONModel(oEditData);
			this.setModel(oDialogModel, "dialogModel");
			if (!this._pEditDialog) {
				this._pEditDialog = Fragment.load({
					id: oView.getId(),
					name: "novamart.inventory.fragment.AddEditProduct",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._pEditDialog.then(function (oDialog) {
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
			for (var i = 0; i < aProducts.length; i++) {
				if (aProducts[i].productId === oData.productId) {
					aProducts[i].name = oData.name;
					aProducts[i].category = oData.category;
					aProducts[i].sku = oData.sku;
					aProducts[i].price = parseFloat(oData.price);
					aProducts[i].stock = parseInt(oData.stock, 10);
					aProducts[i].reorderThreshold = parseInt(oData.reorderThreshold, 10);
					aProducts[i].supplier = oData.supplier;
					aProducts[i].warehouse = oData.warehouse;
					aProducts[i].description = oData.description;
					aProducts[i].lastUpdated = new Date().toISOString().split("T")[0];
					break;
				}
			}
			oProductsModel.setProperty("/products", aProducts);
			StorageManager.saveLocalProducts(aProducts);
			oProductsModel.refresh(true);
			this.showMessageToast(this.getText("msgSaveSuccess", [oData.name]));
			this.onCloseProductDialog();
		},
		onCloseProductDialog: function () {
			if (this._pEditDialog) {
				this._pEditDialog.then(function (oDialog) {
					oDialog.close();
				});
			}
		},
		/**
		 */
		onDeleteProduct: function () {
			var oBindingContext = this.getView().getBindingContext("products");
			if (!oBindingContext) {
				return;
			}
			var oProduct = oBindingContext.getObject();
			var sMessage = this.getText("msgDeleteConfirmText", [oProduct.name, oProduct.sku]);
			this.showMessageBoxConfirm(sMessage, this.getText("msgDeleteConfirmTitle"), function () {
				var oProductsModel = this.getModel("products");
				var aProducts = oProductsModel.getProperty("/products") || [];
				var aUpdatedProducts = aProducts.filter(function (item) {
					return item.productId !== oProduct.productId;
				});
				oProductsModel.setProperty("/products", aUpdatedProducts);
				StorageManager.saveLocalProducts(aUpdatedProducts);
				oProductsModel.refresh(true);
				this.showMessageToast(this.getText("msgDeleteSuccess", [oProduct.name]));
				// Close detail pane and return to 1-column layout
				this.onCloseDetail();
			}.bind(this));
		},
		/**
		 */
		onToggleFullScreen: function () {
			var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
			if (bFullScreen) {
				this.setAppLayout("TwoColumnsMidExpanded");
			} else {
				this.setAppLayout("MidColumnFullWidth");
			}
		},
		/**
		 */
		onCloseDetail: function () {
			this.setAppLayout("OneColumn");
			this.getRouter().navTo("master");
		}
	});
});
