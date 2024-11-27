import Opa5 from "sap/ui/test/Opa5";
import Press from "sap/ui/test/actions/Press";
import EnterText from "sap/ui/test/actions/EnterText";

const viewName = "scmsfe.view.Login";

export default class LoginPage extends Opa5 {
	iStartMyApp(): Promise<void> {
        return Promise.resolve(
			this.iStartMyUIComponent({
				componentConfig: {
					name: "scmsfe"
				}
			})
		) 
    }

	iTypeInLoginEmailInput () {
		return this.waitFor({
			id: "emailInput",
			viewName,
			actions: [new EnterText({text: "john.doe@example.com"})],
			errorMessage: "The text could not be entered in the Name field"
		});
	}

	iTypeInLoginPasswordInput () {
		return this.waitFor({
			id: "passwordInput",
			viewName,
			actions: [new EnterText({text: "Test@123"})],
			errorMessage: "The text could not be entered in the Name field"
		});
	}

	// target actions

	iPressOnTheLoginButton() {
		return this.waitFor({
			id: "loginBtn",
			viewName,
			actions: new Press(),
			errorMessage: "Did not find the Login button",
		});
	}

	// Assertions

	iShouldSeeTheAdminUserDashboardPage() {
        return this.waitFor({
            viewName: "scmsfe.view.Dashboard", 
            success: function() {
                Opa5.assert.ok(true, "Navigated to the Dashboard page");
            },
            errorMessage: "Did not navigate to the Dashboard page"
        });
    } 
}
