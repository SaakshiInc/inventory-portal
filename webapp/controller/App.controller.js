sap.ui.define([
	"novamart/inventory/controller/BaseController"
], function (BaseController) {
	"use strict";
	return BaseController.extend("novamart.inventory.controller.App", {
		onInit: function () {
			// Attach content density class to app view body
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass ? this.getOwnerComponent().getContentDensityClass() : "sapUiSizeCompact");
		},
		/**
		 * Fired when layout of FlexibleColumnLayout changes
		 * @param {sap.ui.base.Event} oEvent 
		 */
		onStateChange: function (oEvent) {
			var sLayout = oEvent.getParameter("layout");
			var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow");
			// Store previous layout for back action references if needed
			if (bIsNavigationArrow) {
				this.getModel("appView").setProperty("/previousLayout", sLayout);
			}
		}
	});
});
