sap.ui.define([
	"sap/ui/core/format/NumberFormat",
	"sap/ui/core/format/DateFormat"
], function (NumberFormat, DateFormat) {
	"use strict";

	return {
		/**
		 * Computes Stock Status State (Error, Warning, Success)
		 */
		stockStatusState: function (iStock, iThreshold) {
			var stock = parseInt(iStock, 10);
			var threshold = parseInt(iThreshold, 10);

			if (isNaN(stock) || stock <= 0) {
				return "Error"; // Out of Stock
			}
			if (stock <= (isNaN(threshold) ? 10 : threshold)) {
				return "Warning"; // Low Stock
			}
			return "Success"; // Available
		},

		/**
		 * Computes Stock Status Icon
		 */
		stockStatusIcon: function (iStock, iThreshold) {
			var stock = parseInt(iStock, 10);
			var threshold = parseInt(iThreshold, 10);

			if (isNaN(stock) || stock <= 0) {
				return "sap-icon://error";
			}
			if (stock <= (isNaN(threshold) ? 10 : threshold)) {
				return "sap-icon://alert";
			}
			return "sap-icon://accept";
		},

		/**
		 * Computes Stock Status Text from i18n
		 */
		stockStatusText: function (iStock, iThreshold) {
			var stock = parseInt(iStock, 10);
			var threshold = parseInt(iThreshold, 10);

			if (isNaN(stock) || stock <= 0) {
				return "Out of Stock";
			}
			if (stock <= (isNaN(threshold) ? 10 : threshold)) {
				return "Low Stock";
			}
			return "Available";
		},

		/**
		 * Formats currency values
		 */
		currencyValue: function (fValue, sCurrency) {
			if (fValue === null || fValue === undefined || fValue === "") {
				return "";
			}
			var oCurrencyFormat = NumberFormat.getCurrencyInstance({
				currencyCode: false,
				customCurrencies: {
					"INR": { symbol: "₹" }
				}
			});
			return oCurrencyFormat.format(fValue, sCurrency || "INR");
		},

		/**
		 * Formats ISO date string into medium date format
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
		},

		/**
		 * Category Avatar Icon Mapper
		 */
		categoryIcon: function (sCategory) {
			switch (sCategory) {
				case "Gourmet Spices & Oils":
					return "sap-icon://nutrition-activity";
				case "Dairy & Packaged Commodities":
					return "sap-icon://meal";
				case "Kitchenware & Appliances":
					return "sap-icon://lab";
				case "Hygiene & Sanitation":
					return "sap-icon://soap";
				case "Eco Packaging":
					return "sap-icon://shipping-status";
				default:
					return "sap-icon://product";
			}
		},

		/**
		 * Computes Stock Progress Percentage
		 */
		stockPercent: function (iStock, iThreshold) {
			var stock = parseInt(iStock, 10) || 0;
			var threshold = (parseInt(iThreshold, 10) || 10) * 3;
			if (stock <= 0) {
				return 0;
			}
			var percent = Math.round((stock / threshold) * 100);
			return percent > 100 ? 100 : percent;
		},

		/**
		 * Dynamically translates product names via active i18n bundle
		 */
		productName: function (sProductId, sDefaultName) {
			if (!sProductId) {
				return sDefaultName || "";
			}
			try {
				var oResourceBundle = null;
				if (this && typeof this.getOwnerComponent === "function" && this.getOwnerComponent()) {
					oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				} else if (this && typeof this.getModel === "function" && this.getModel("i18n")) {
					oResourceBundle = this.getModel("i18n").getResourceBundle();
				}
				if (oResourceBundle) {
					var sKey = "prod_" + sProductId.replace(/-/g, "_") + "_name";
					if (typeof oResourceBundle.hasText === "function" && oResourceBundle.hasText(sKey)) {
						return oResourceBundle.getText(sKey);
					}
				}
			} catch (e) {
				// Fallback
			}
			return sDefaultName || "";
		},

		/**
		 * Dynamically translates product descriptions via active i18n bundle
		 */
		productDescription: function (sProductId, sDefaultDesc) {
			if (!sProductId) {
				return sDefaultDesc || "";
			}
			try {
				var oResourceBundle = null;
				if (this && typeof this.getOwnerComponent === "function" && this.getOwnerComponent()) {
					oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				} else if (this && typeof this.getModel === "function" && this.getModel("i18n")) {
					oResourceBundle = this.getModel("i18n").getResourceBundle();
				}
				if (oResourceBundle) {
					var sKey = "prod_" + sProductId.replace(/-/g, "_") + "_desc";
					if (typeof oResourceBundle.hasText === "function" && oResourceBundle.hasText(sKey)) {
						return oResourceBundle.getText(sKey);
					}
				}
			} catch (e) {
				// Fallback
			}
			return sDefaultDesc || "";
		}
	};
});