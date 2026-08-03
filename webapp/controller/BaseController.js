sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, UIComponent, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("novamart.inventory.controller.BaseController", {
		/**
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName) || this.getOwnerComponent().getModel(sName);
		},

		/**
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.core.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * @public
		 * @returns {sap.ui.model.resource.ResourceBundle|null} the resourceBundle of the component
		 */
		getResourceBundle: function () {
			var oComponent = this.getOwnerComponent();
			var oI18nModel = oComponent ? oComponent.getModel("i18n") : null;
			return oI18nModel && typeof oI18nModel.getResourceBundle === "function" ? oI18nModel.getResourceBundle() : null;
		},

		/**
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
		 * @param {string} sMessage 
		 */
		showMessageToast: function (sMessage) {
			MessageToast.show(sMessage, {
				duration: 3500,
				autoClose: true
			});
		},

		/**
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
		 * @param {string} sLayout e.g. "OneColumn", "TwoColumnsMidExpanded"
		 */
		setAppLayout: function (sLayout) {
			this.getModel("appView").setProperty("/layout", sLayout);
		},

		/**
		 * @param {string} sTheme 
		 */
		setAppTheme: function (sTheme) {
			sap.ui.getCore().applyTheme(sTheme);
		},

		/**
		 * @param {string} sLanguage e.g. "en", "de", "hi"
		 */
		setAppLanguage: function (sLanguage) {
			sap.ui.getCore().getConfiguration().setLanguage(sLanguage);
		},

		/**
		 * @returns {boolean} True if all fields are valid
		 */
		onValidateDialogInputs: function () {
			var oModel = this.getModel("dialogModel");
			if (!oModel) {
				return true;
			}
			var bValid = true;

			var sName = oModel.getProperty("/name");
			if (!sName || String(sName).trim() === "") {
				oModel.setProperty("/valStateName", "Error");
				bValid = false;
			} else {
				oModel.setProperty("/valStateName", "None");
			}
			var sSKU = oModel.getProperty("/sku");
			if (!sSKU || String(sSKU).trim() === "") {
				oModel.setProperty("/valStateSKU", "Error");
				bValid = false;
			} else {
				oModel.setProperty("/valStateSKU", "None");
			}

			var fPrice = parseFloat(oModel.getProperty("/price"));
			if (isNaN(fPrice) || fPrice <= 0) {
				oModel.setProperty("/valStatePrice", "Error");
				bValid = false;
			} else {
				oModel.setProperty("/valStatePrice", "None");
			}
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