/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["ns/inventoryportal/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
