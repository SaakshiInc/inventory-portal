sap.ui.define([], function () {
	"use strict";

	var STORAGE_KEY = "novamart_inventory_products";

	return {
		/**
		 * Loads products array from LocalStorage if available
		 * @returns {Array|null} Array of products or null
		 */
		loadLocalProducts: function () {
			try {
				var sData = window.localStorage.getItem(STORAGE_KEY);
				if (sData) {
					var oParsed = JSON.parse(sData);
					if (Array.isArray(oParsed) && oParsed.length > 0 && oParsed[0].productId && oParsed[0].productId.indexOf("NM-IN-") === 0) {
						return oParsed;
					}
				}
			} catch (e) {
				console.warn("StorageManager: Unable to read from localStorage", e);
			}
			return null;
		},

		/**
		 * Persists products array into LocalStorage
		 * @param {Array} aProducts 
		 */
		saveLocalProducts: function (aProducts) {
			try {
				if (Array.isArray(aProducts)) {
					window.localStorage.setItem(STORAGE_KEY, JSON.stringify(aProducts));
				}
			} catch (e) {
				console.warn("StorageManager: Unable to write to localStorage", e);
			}
		},

		/**
		 * Clears LocalStorage and resets to initial products.json state
		 */
		resetLocalStorage: function () {
			try {
				window.localStorage.removeItem(STORAGE_KEY);
			} catch (e) {
				console.warn("StorageManager: Unable to clear localStorage", e);
			}
		}
	};
});