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
		
		init: function () {
			UIComponent.prototype.init.apply(this, arguments);
	
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
			this._initStoragePersistence();
			this.getRouter().initialize();
		},
	
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
