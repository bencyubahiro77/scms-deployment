/*global QUnit*/
import Controller from "scmsfe/controller/userManagementControllers/Login.controller"

QUnit.module("Login Controller");

QUnit.test("I should test the Login controller", function (assert: Assert) {
	const oAppController = new Controller("Login");
	oAppController.onInit();
	assert.ok(oAppController);
});