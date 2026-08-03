sap.ui.define([
	"novamart/inventory/controller/BaseController"
], function (BaseController) {
	"use strict";
	return BaseController.extend("novamart.inventory.controller.App", {
		onInit: function () {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass ? this.getOwnerComponent().getContentDensityClass() : "sapUiSizeCompact");
		},
		/**
		 * @param {sap.ui.base.Event} oEvent 
		 */
		onStateChange: function (oEvent) {
			var sLayout = oEvent.getParameter("layout");
			var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow");
			if (bIsNavigationArrow) {
				this.getModel("appView").setProperty("/previousLayout", sLayout);
			}
		}
	});
});
