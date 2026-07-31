sap.ui.define([
	"novamart/inventory/model/formatter"
], function (formatter) {
	"use strict";

	QUnit.module("NovaMart Formatter Unit Tests");

	QUnit.test("Should compute correct Stock Status state", function (assert) {
		// Out of stock -> Error
		assert.strictEqual(formatter.stockStatusState(0, 10), "Error", "Stock 0 returns Error");
		assert.strictEqual(formatter.stockStatusState("0", 10), "Error", "String '0' stock returns Error");

		// Low stock -> Warning
		assert.strictEqual(formatter.stockStatusState(5, 10), "Warning", "Stock 5 with threshold 10 returns Warning");
		assert.strictEqual(formatter.stockStatusState(10, 10), "Warning", "Stock equal to threshold returns Warning");

		// Available -> Success
		assert.strictEqual(formatter.stockStatusState(25, 10), "Success", "Stock 25 with threshold 10 returns Success");
	});

	QUnit.test("Should return appropriate stock status icons", function (assert) {
		assert.strictEqual(formatter.stockStatusIcon(0, 10), "sap-icon://error", "Out of stock returns error icon");
		assert.strictEqual(formatter.stockStatusIcon(5, 10), "sap-icon://alert", "Low stock returns alert icon");
		assert.strictEqual(formatter.stockStatusIcon(30, 10), "sap-icon://accept", "Available stock returns accept icon");
	});

	QUnit.test("Should return valid category avatar icons", function (assert) {
		assert.strictEqual(formatter.categoryIcon("Gourmet Spices & Oils"), "sap-icon://nutrition-activity", "Spices category icon");
		assert.strictEqual(formatter.categoryIcon("Hygiene & Sanitation"), "sap-icon://soap", "Hygiene category icon");
		assert.strictEqual(formatter.categoryIcon("Eco Packaging"), "sap-icon://shipping-status", "Packaging category icon");
		assert.strictEqual(formatter.categoryIcon("Unknown"), "sap-icon://product", "Fallback category icon");
	});

	QUnit.test("Should compute correct stock percentage for ProgressIndicator", function (assert) {
		assert.strictEqual(formatter.stockPercent(15, 10), 50, "15 units with 10 threshold returns 50%");
		assert.strictEqual(formatter.stockPercent(0, 10), 0, "0 units returns 0%");
	});

	QUnit.test("Should format currency values correctly", function (assert) {
		assert.ok(formatter.currencyValue(28500.00, "INR").length > 0, "Formatted INR price contains output");
		assert.strictEqual(formatter.currencyValue("", "INR"), "", "Empty string returns empty string");
		assert.strictEqual(formatter.currencyValue(null, "INR"), "", "Null value returns empty string");
	});

	QUnit.test("Should format ISO dates into medium date strings", function (assert) {
		assert.ok(formatter.formatDate("2026-07-20").length > 0, "Valid date returns formatted string");
		assert.strictEqual(formatter.formatDate(""), "", "Empty string returns empty string");
	});
});