import EnterText from "sap/ui/test/actions/EnterText";
import Press from "sap/ui/test/actions/Press";
import Opa5 from "sap/ui/test/Opa5";

const viewName = "scmsfe.view.userManagementViews/UserProfile";

export default class UserProfile extends Opa5 {
	//profile actions
	iPressOnTheAvatar() {
		return this.waitFor({
			controlType: "sap.m.Avatar",
			actions: new Press(),
			errorMessage: "The Avatar was not found",
		});
	}

	iPressOnTheProfileLink() {
		return this.waitFor({
			controlType: "sap.m.Link",
			id: "profile-link",
			actions: new Press(),
			errorMessage: "The profile link was not found",
		});
	}

	iPressOnTheEditProfile() {
		return this.waitFor({
			controlType: "sap.m.Link",
			id: "editUserProfile",
			viewName,
			actions: new Press(),
			errorMessage: "The profile link was not found",
		});
	}

    iEnterTextIntoInputField(sId: string, sText: string) {
		return this.waitFor({
			id: sId,
			viewName,
			actions: [new EnterText({ text: sText })],
			errorMessage: "The text could not be entered in the Input field",
		});
	}

    iSelectTheUserGender(sGender: string) {
        return this.waitFor({
            id: "genderSelect",
            viewName,
            actions: new Press(),
            success: () => {
                return this.waitFor({
                    controlType: "sap.ui.core.Item",
                    matchers: {
                        properties: {
                            text: sGender // Use the text of the item to match
                        }
                    },
                    actions: new Press(),
                    errorMessage: `Could not select the role "${sGender}" from the dropdown`
                });
            },
            errorMessage: "Could not find the role selection dropdown"
        });
    }

    iPressOnTheUpdateButton() {
		return this.waitFor({
			controlType: "sap.m.Button",
			id: "editUserBtn",
			viewName,
			actions: new Press(),
			errorMessage: "The update button was not found",
		});
	}

	//assertion
    iShouldSeeTheUserProfilePage() {
        return this.waitFor({
            viewName: "scmsfe.view.userManagementViews/UserProfile", 
            success: function() {
                Opa5.assert.ok(true, "Navigated to the All Users page");
            },
            errorMessage: "Did not navigate to the All Users page"
        });
    }

	iShouldSeeTheUpdateProfileOpen() {
		return this.waitFor({
			controlType: "sap.m.Dialog",
			id: "updateUserDialog",
			viewName,
			success: function () {
				Opa5.assert.ok(true, "dialog is open");
			},
			errorMessage: "Dialog did not open",
		});
	}

    iShouldSeeTheCorrectTextInInputField(sId: string, sExpectedText: string) {
		return this.waitFor({
			id: sId,
			viewName,
			success: (oInput: any) => {
				Opa5.assert.strictEqual(
					oInput.getValue(),
					sExpectedText,
					`The input field with ID ${sId} contains the correct text: ${sExpectedText}`
				);
			},
			errorMessage: "Input field did not contain the expected text",
		});
	}

    iShouldSeeTheCorrectGenderSelected(sExpectedRoleText: string) {
        return this.waitFor({
            id: "genderSelect",
            viewName,
            success: (oSelect: any) => {
                const selectedItem = oSelect.getSelectedItem();
                Opa5.assert.ok(
                    selectedItem,
                    "A role is selected"
                );
                Opa5.assert.strictEqual(
                    selectedItem.getText(),
                    sExpectedRoleText,
                    `The selected role is "${sExpectedRoleText}"`
                );
            },
            errorMessage: "Could not verify the selected role"
        });
    }
    iShouldSeeTheCorrectTextInView(sId: string, sExpectedText: string) {
		return this.waitFor({
			id: sId,
			viewName, // Replace with the actual view name
			success: (oText: any) => {
				Opa5.assert.strictEqual(
					oText.getText(),
					sExpectedText,
					`The text element with ID ${sId} contains the correct text: ${sExpectedText}`
				);
			},
			errorMessage: "Text element did not contain the expected text",
		});
	}
}
