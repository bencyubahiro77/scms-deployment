import Opa5 from "sap/ui/test/Opa5";
import Press from "sap/ui/test/actions/Press";
import EnterText from "sap/ui/test/actions/EnterText";
import AggregationLengthEquals from "sap/ui/test/matchers/AggregationLengthEquals";

const viewName = "scmsfe.view.userManagementViews/AllUsers";

export default class AllUsersPage extends Opa5 {
	iStartMyApp(): Promise<void> {
		return Promise.resolve(
			this.iStartMyUIComponent({
				componentConfig: {
					name: "scmsfe",
				},
			})
		);
	}

	// target actions

	iPressOnTheCreateUserButton() {
		return this.waitFor({
			id: "createUserButton",
			viewName,
			actions: new Press(),
			errorMessage: "Did not find the Create button",
		});
	}

	iEnterTextIntoFirstNameField(sName: string) {
		return this.waitFor({
			id: "createFirstNameInput",
			viewName,
			actions: [new EnterText({ text: sName })],
			errorMessage: "The text could not be entered in the Input field",
		});
	}

	iEnterTextIntoLastNameField(sName: string) {
		return this.waitFor({
			id: "createLastNameInput",
			viewName,
			actions: [new EnterText({ text: sName })],
			errorMessage: "The text could not be entered in the Input field",
		});
	}

	iEnterTextIntoEmailField(sEmail: string) {
		return this.waitFor({
			id: "createEmailInput",
			viewName,
			actions: [new EnterText({ text: sEmail })],
			errorMessage: "The text could not be entered in the Input field",
		});
	}

	iEnterTextIntoPhoneNumberField(sNumber: string) {
		return this.waitFor({
			id: "createPhoneInput",
			viewName,
			actions: [new EnterText({ text: sNumber })],
			errorMessage: "The text could not be entered in the Input field",
		});
	}
    //select role
    iSelectTheUserRole(sRoleText: string) {
        return this.waitFor({
            id: "createRoleSelect",
            viewName,
            actions: new Press(),
            success: () => {
                return this.waitFor({
                    controlType: "sap.ui.core.Item",
                    matchers: {
                        properties: {
                            text: sRoleText // Use the text of the item to match
                        }
                    },
                    actions: new Press(),
                    errorMessage: `Could not select the role "${sRoleText}" from the dropdown`

                });
            },
            errorMessage: "Could not find the role selection dropdown"
        });
    }
    

	// to store the initial count
	private initialTableLength: number = 0;

	// this method stores the initial count so we can compare after create or delete
	iStoreInitialTableLength() {
		return this.waitFor({
			id: "allUsersTable",
			viewName,
			success: (oTable: any) => {
				this.initialTableLength = oTable.getItems().length;
			},
			errorMessage: "Could not get initial table length",
		});
	}

	iPressOnTheCreateButton() {
		return this.waitFor({
			id: "userBtn",
			viewName,
			actions: new Press(),
			errorMessage: "Did not find the Create button",
		});
	}

    //search
	iEnterTextForSearch(sSearch: string) {
		return this.waitFor({
			id: "search",
			viewName,
			actions: [new EnterText({ text: sSearch })],
			errorMessage: "The text could not be entered in the search",
		});
	}
    iClearSearchField() {
        return this.waitFor({
            id: "search",
            viewName,
            actions: [new EnterText({ text: "" })],
            errorMessage: "Could not clear the search field",
        });
    }

    //edit
    iPressOnTheEditButton(sUserIndex: number) {
        return this.waitFor({
            id: "allUsersTable",
            viewName,
            success: (oTable: any) => {
                const oRow = oTable.getItems()[sUserIndex];
                if (!oRow) {
                    throw new Error(`Row at index ${sUserIndex} not found`);
                }
                
                return this.waitFor({
                    controlType: "sap.m.Button",
                    matchers: {
                        properties: {
                            icon: "sap-icon://edit"
                        },
                        ancestor: oRow//makes sure only that row is deleted
                    },
                    searchOpenDialogs: false,
                    actions: new Press(),
                    errorMessage: "Could not find or press the edit button in the specified row"
                });
            },
            errorMessage: "Could not find the table or the specified row"
        });
    }
    iPressOnTheSaveButton() {
        return this.waitFor({
            id: "userBtn",
            viewName,
            actions: new Press(),
            errorMessage: "Could not find or press the Save button"
        });
    }


    //delete
    iPressOnTheDeleteButton(sUserIndex: number) {
        return this.waitFor({
            id: "allUsersTable",
            viewName,
            success: (oTable: any) => {
                const oRow = oTable.getItems()[sUserIndex];
                if (!oRow) {
                    throw new Error(`Row at index ${sUserIndex} not found`);
                }
                
                return this.waitFor({
                    controlType: "sap.m.Button",
                    matchers: {
                        properties: {
                            icon: "sap-icon://delete"
                        },
                        ancestor: oRow//makes sure only that row is deleted
                    },
                    searchOpenDialogs: false,
                    actions: new Press(),
                    errorMessage: "Could not find or press the delete button in the specified row"
                });
            },
            errorMessage: "Could not find the table or the specified row"
        });
    }

    iConfirmDeletion() {
        return this.waitFor({
            controlType: "sap.m.Button",
            searchOpenDialogs: true,
            matchers: {
                properties: {
                    text: "Delete" 
                }
            },
            actions: new Press(),
            errorMessage: "Could not find the confirmation button in the dialog"
        });
    }





    //Assertions
	// Assertions

	iShouldSeeTheCreateDialogOpen() {
		return this.waitFor({
			controlType: "sap.m.Dialog",
			id: "createUserDialog",
			viewName,
			success: function () {
				Opa5.assert.ok(true, "dialog is open");
			},
			errorMessage: "Dialog did not open",
		});
	}

	//text assertions
	iShouldSeeTheCorrectFirstNameInInput(sName: string) {
		return this.waitFor({
			id: "createFirstNameInput",
			viewName,
			success: (oInput: any) => {
				Opa5.assert.strictEqual(
					oInput.getValue(),
					sName,
					`The input field contains the correct name: ${sName}`
				);
			},
			errorMessage: "Input didnt contain the right text",
		});
	}
	iShouldSeeTheCorrectLastNameInInput(sName: string) {
		return this.waitFor({
			id: "createLastNameInput",
			viewName,
			success: (oInput: any) => {
				Opa5.assert.strictEqual(
					oInput.getValue(),
					sName,
					`The input field contains the correct name: ${sName}`
				);
			},
			errorMessage: "Input didnt contain the right text",
		});
	}
	iShouldSeeTheCorrectEmailInInput(sEmail: string) {
		return this.waitFor({
			id: "createEmailInput",
			viewName,
			success: (oInput: any) => {
				Opa5.assert.strictEqual(
					oInput.getValue(),
					sEmail,
					`The input field contains the correct email: ${sEmail}`
				);
			},
			errorMessage: "Input didnt contain the right text",
		});
	}
	iShouldSeeTheCorrectPhoneNumberInInput(sNumber: string) {
		return this.waitFor({
			id: "createPhoneInput",
			viewName,
			success: (oInput: any) => {
				Opa5.assert.strictEqual(
					oInput.getValue(),
					sNumber,
					`The input field contains the correct number: ${sNumber}`
				);
			},
			errorMessage: "Input didnt contain the right text",
		});
	}
    iShouldSeeTheCorrectRoleSelected(sExpectedRoleText: string) {
        return this.waitFor({
            id: "createRoleSelect",
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
    

	//table assertions
	theTableHasNewItem() {
		return this.waitFor({
			id: "allUsersTable",
			viewName,
			success: (oTable: any) => {
				const newLength = oTable.getItems().length;
				Opa5.assert.strictEqual(
					newLength,
					this.initialTableLength + 1,
					`Table length should increase from ${this.initialTableLength} to ${
						this.initialTableLength + 1
					}`
				);
			},
			errorMessage: "The table does not contain the new item.",
		});
	}

	iSeeExpectedSearchResults(): object {
		return this.waitFor({
			controlType: "sap.m.Table",
			id: "allUsersTable",
			viewName,
			matchers: new AggregationLengthEquals({
				name: "items",
				length: 1,
			}),
			success: function () {
				Opa5.assert.ok(
					true,
					"The expected search result is displayed in the table"
				);
			},
			errorMessage: "The expected search result was not found in the table",
		});
	}
    //Edit
    iShouldSeeTheEditDialogOpen() {
        return this.waitFor({
            controlType: "sap.m.Dialog",
            id: "createUserDialog", 
            viewName,
            success: function () {
                Opa5.assert.ok(true, "Edit dialog is open");
            },
            errorMessage: "Edit dialog did not open",
        });
    }
    
    iShouldSeePrefilledInputFields(userData: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        role: string;
    }) {
        return this.waitFor({
            success: () => {
                return Promise.all([
                    // Reuse existing assertion methods
                    this.iShouldSeeTheCorrectFirstNameInInput(userData.firstName),
                    this.iShouldSeeTheCorrectLastNameInInput(userData.lastName),
                    this.iShouldSeeTheCorrectEmailInInput(userData.email),
                    this.iShouldSeeTheCorrectPhoneNumberInInput(userData.phoneNumber),
                    this.iShouldSeeTheCorrectRoleSelected(userData.role)
                ]);
            },
            errorMessage: "Could not verify prefilled input fields"
        });
    }

    iShouldSeeUpdatedUserInTable(sUserIndex: number, userData: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
    }) {
        return this.waitFor({
            id: "allUsersTable",
            viewName,
            success: (oTable: any) => {
                const oRow = oTable.getItems()[sUserIndex];
                if (!oRow) {
                    throw new Error(`Row at index ${sUserIndex} not found`);
                }
                
                const cells = oRow.getCells();
                Opa5.assert.strictEqual(
                    cells[1].getText(),
                    `${userData.firstName} ${userData.lastName}`,
                    "Full name was updated correctly"
                );
                Opa5.assert.strictEqual(
                    cells[2].getText(),
                    userData.email,
                    "Email was updated correctly"
                );
                Opa5.assert.ok(
                    cells[3].getText().includes(userData.phoneNumber),
                    "Phone number was updated correctly"
                );
            },
            errorMessage: "Could not verify updated user data in table"
        });
    }

    //delete
    theTableHasOneFewerItem() {
        return this.waitFor({
            id: "allUsersTable",
            viewName,
            success: (oTable: any) => {
                const newLength = oTable.getItems().length;
                Opa5.assert.strictEqual(
                    newLength, 
                    this.initialTableLength - 1, 
                    `Table length should decrease from ${this.initialTableLength} to ${this.initialTableLength - 1}`
                );
            },
            errorMessage: "The table item was not deleted"
        });
    }
    
    iShouldSeeTheDeleteDialog() {
        return this.waitFor({
            controlType: "sap.m.Dialog",
            searchOpenDialogs: true,
            success: function() {
                Opa5.assert.ok(true, "Delete confirmation dialog is displayed");
            },
            errorMessage: "Delete confirmation dialog did not appear"
        });
    }
}
