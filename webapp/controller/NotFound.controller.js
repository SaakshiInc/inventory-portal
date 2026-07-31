sap.ui.define([
	"novamart/inventory/controller/BaseController"
], function (BaseController) {
	"use strict";
	return BaseController.extend("novamart.inventory.controller.NotFound", {
		onNavBack: function () {
			this.setAppLayout("OneColumn");
			this.getRouter().navTo("master", {}, true);
		}
	});
});
