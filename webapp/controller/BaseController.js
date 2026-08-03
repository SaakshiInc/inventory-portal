sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, UIComponent, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("novamart.inventory.controller.BaseController", {
		/**
		 * Convenient method for accessing the router in every controller.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * Convenient method for getting the view model by name in every controller.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName) || this.getOwnerComponent().getModel(sName);
		},

		/**
		 * Convenient method for setting the view model in every controller.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.core.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenient method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceBundle|null} the resourceBundle of the component
		 */
		getResourceBundle: function () {
			var oComponent = this.getOwnerComponent();
			var oI18nModel = oComponent ? oComponent.getModel("i18n") : null;
			return oI18nModel && typeof oI18nModel.getResourceBundle === "function" ? oI18nModel.getResourceBundle() : null;
		},

		/**
		 * Helper to get translated string from i18n bundle
		 * @param {string} sKey 
		 * @param {Array} [aArgs] 
		 * @returns {string} Translated text
		 */
		getText: function (sKey, aArgs) {
			var oBundle = this.getResourceBundle();
			if (oBundle && typeof oBundle.getText === "function") {
				return oBundle.getText(sKey, aArgs);
			}
			return sKey;
		},

		/**
		 * Helper to show MessageToast
		 * @param {string} sMessage 
		 */
		showMessageToast: function (sMessage) {
			MessageToast.show(sMessage, {
				duration: 3500,
				autoClose: true
			});
		},

		/**
		 * Helper to show confirmation MessageBox
		 * @param {string} sMessage 
		 * @param {string} sTitle 
		 * @param {function} fnCallback 
		 */
		showMessageBoxConfirm: function (sMessage, sTitle, fnCallback) {
			MessageBox.confirm(sMessage, {
				title: sTitle || this.getText("msgDeleteConfirmTitle"),
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.OK) {
						fnCallback();
					}
				}
			});
		},

		/**
		 * Updates FlexibleColumnLayout layout state
		 * @param {string} sLayout e.g. "OneColumn", "TwoColumnsMidExpanded"
		 */
		setAppLayout: function (sLayout) {
			this.getModel("appView").setProperty("/layout", sLayout);
		},

		/**
		 * Switches theme between Horizon Light and Horizon Dark
		 * @param {string} sTheme 
		 */
		setAppTheme: function (sTheme) {
			sap.ui.getCore().applyTheme(sTheme);
		},

		/**
		 * Changes runtime language/locale and immediately refreshes all models & view bindings
		 * @param {string} sLanguage e.g. "en", "de", "hi"
		 */
		setAppLanguage: function (sLanguage) {
			sap.ui.getCore().getConfiguration().setLanguage(sLanguage);

			// 1. Force reload of component i18n ResourceModel for new language locale
			var oComponent = this.getOwnerComponent();
			if (oComponent) {
				var oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleName: "novamart.inventory.i18n.i18n",
					supportedLocales: ["", "en", "de", "hi"],
					fallbackLocale: ""
				});
				oComponent.setModel(oI18nModel, "i18n");
				this.getView().setModel(oI18nModel, "i18n");
			}

			// 2. Refresh products model & table view data bindings
			var oProductsModel = this.getModel("products");
			if (oProductsModel) {
				oProductsModel.refresh(true);
			}

			var oTable = this.byId("productsTable");
			if (oTable && oTable.getBinding("items")) {
				oTable.getBinding("items").refresh(true);
			}

			// 3. Feedback toast
			this.showMessageToast("Language updated: " + sLanguage.toUpperCase());
		},

		/**
		 * Validates dialog input fields for Add/Edit Product
		 * @returns {boolean} True if all fields are valid
		 */
		onValidateDialogInputs: function () {
			var oModel = this.getModel("dialogModel");
			if (!oModel) {
				return true;
			}
			var bValid = true;

			// Name validation
			var sName = oModel.getProperty("/name");
			if (!sName || String(sName).trim() === "") {
				oModel.setProperty("/valStateName", "Error");
				bValid = false;
			} else {
				oModel.setProperty("/valStateName", "None");
			}

			// SKU validation
			var sSKU = oModel.getProperty("/sku");
			if (!sSKU || String(sSKU).trim() === "") {
				oModel.setProperty("/valStateSKU", "Error");
				bValid = false;
			} else {
				oModel.setProperty("/valStateSKU", "None");
			}

			// Price validation
			var fPrice = parseFloat(oModel.getProperty("/price"));
			if (isNaN(fPrice) || fPrice <= 0) {
				oModel.setProperty("/valStatePrice", "Error");
				bValid = false;
			} else {
				oModel.setProperty("/valStatePrice", "None");
			}

			// Stock validation
			var iStock = parseInt(oModel.getProperty("/stock"), 10);
			if (isNaN(iStock) || iStock < 0) {
				oModel.setProperty("/valStateStock", "Error");
				bValid = false;
			} else {
				oModel.setProperty("/valStateStock", "None");
			}

			return bValid;
		}
	});
});