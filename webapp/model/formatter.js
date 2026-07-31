sap.ui.define([
	"sap/ui/core/format/NumberFormat",
	"sap/ui/core/format/DateFormat"
], function (NumberFormat, DateFormat) {
	"use strict";

	return {
		/**
		 * Computes ObjectStatus ValueState based on stock vs threshold
		 */
		stockStatusState: function (iStock, iThreshold) {
			var stock = parseInt(iStock, 10);
			var threshold = parseInt(iThreshold, 10);

			if (isNaN(stock) || stock === 0) {
				return "Error";
			} else if (stock <= threshold) {
				return "Warning";
			}
			return "Success";
		},

		/**
		 * Computes localized stock status text
		 */
		stockStatusText: function (iStock, iThreshold) {
			var stock = parseInt(iStock, 10);
			var threshold = parseInt(iThreshold, 10);

			var oResourceBundle = null;
			try {
				if (this && typeof this.getOwnerComponent === "function") {
					var oComponent = this.getOwnerComponent();
					var oI18nModel = oComponent ? oComponent.getModel("i18n") : null;
					if (oI18nModel && typeof oI18nModel.getResourceBundle === "function") {
						oResourceBundle = oI18nModel.getResourceBundle();
					}
				}
			} catch (e) {
				oResourceBundle = null;
			}

			if (isNaN(stock) || stock === 0) {
				return (oResourceBundle && typeof oResourceBundle.getText === "function") ? oResourceBundle.getText("statusOutOfStock") : "Out of Stock";
			} else if (stock <= threshold) {
				return (oResourceBundle && typeof oResourceBundle.getText === "function") ? oResourceBundle.getText("statusLowStock") : "Low Stock";
			}
			return (oResourceBundle && typeof oResourceBundle.getText === "function") ? oResourceBundle.getText("statusAvailable") : "Available";
		},

		/**
		 * Returns sap-icon path based on stock status
		 */
		stockStatusIcon: function (iStock, iThreshold) {
			var stock = parseInt(iStock, 10);
			var threshold = parseInt(iThreshold, 10);

			if (isNaN(stock) || stock === 0) {
				return "sap-icon://error";
			} else if (stock <= threshold) {
				return "sap-icon://alert";
			}
			return "sap-icon://accept";
		},

		/**
		 * Computes category avatar icon
		 */
		categoryIcon: function (sCategory) {
			if (!sCategory) {
				return "sap-icon://product";
			}
			if (sCategory.indexOf("Spices") !== -1) {
				return "sap-icon://nutrition-activity";
			} else if (sCategory.indexOf("Dairy") !== -1) {
				return "sap-icon://official-service";
			} else if (sCategory.indexOf("Kitchenware") !== -1) {
				return "sap-icon://dishwasher";
			} else if (sCategory.indexOf("Hygiene") !== -1) {
				return "sap-icon://soap";
			} else if (sCategory.indexOf("Packaging") !== -1) {
				return "sap-icon://shipping-status";
			}
			return "sap-icon://product";
		},

		/**
		 * Computes percentage for stock progress indicator
		 */
		stockPercent: function (iStock, iThreshold) {
			var stock = parseInt(iStock, 10) || 0;
			var threshold = parseInt(iThreshold, 10) || 10;
			var max = threshold * 3;
			var pct = Math.round((stock / max) * 100);
			return Math.min(Math.max(pct, 0), 100);
		},

		/**
		 * Formats currency number into localized string
		 */
		currencyValue: function (fValue, sCurrency) {
			if (fValue === null || fValue === undefined || fValue === "") {
				return "";
			}
			var num = parseFloat(fValue);
			if (isNaN(num)) {
				return "";
			}
			var oCurrencyFormat = NumberFormat.getCurrencyInstance({
				currencyCode: true
			});
			return oCurrencyFormat.format(num, sCurrency || "INR");
		},

		/**
		 * Formats YYYY-MM-DD string into localized medium date
		 */
		formatDate: function (sDateString) {
			if (!sDateString) {
				return "";
			}
			var oDate = new Date(sDateString);
			if (isNaN(oDate.getTime())) {
				return sDateString;
			}
			var oDateFormat = DateFormat.getDateInstance({
				style: "medium"
			});
			return oDateFormat.format(oDate);
		}
	};
});