sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"novamart/inventory/model/StorageManager"
], function (UIComponent, JSONModel, StorageManager) {
	"use strict";
	return UIComponent.extend("novamart.inventory.Component", {
		metadata: {
			manifest: "json"
		},
		/**
		 * The component is initialized by UI5 automatically during application startup
		 */
		init: function () {
			// Call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			// App Layout model for FlexibleColumnLayout (OneColumn / TwoColumnsMidExpanded)
			var oAppModel = new JSONModel({
				layout: "OneColumn",
				previousLayout: "",
				actionButtonsInfo: {
					midColumn: {
						fullScreen: false
					}
				}
			});
			this.setModel(oAppModel, "appView");
			// Setup LocalStorage persistence sync for products model
			this._initStoragePersistence();
			// Initialize the router
			this.getRouter().initialize();
		},
		/**
		 * Hydrates products model from localStorage if custom data exists.
		 */
		_initStoragePersistence: function () {
			var oProductsModel = this.getModel("products");
			if (!oProductsModel) {
				return;
			}
			var fnSyncData = function () {
				try {
					var aLocalProducts = StorageManager.loadLocalProducts();
					if (aLocalProducts && aLocalProducts.length > 0) {
						oProductsModel.setProperty("/products", aLocalProducts);
					}
				} catch (e) {
					console.warn("StorageManager hydration error", e);
				}
			};
			// Handle both already loaded and pending async load
			if (oProductsModel.getData() && oProductsModel.getData().products) {
				fnSyncData();
			} else {
				oProductsModel.attachRequestCompleted(function () {
					fnSyncData();
				});
			}
		}
	});
});
