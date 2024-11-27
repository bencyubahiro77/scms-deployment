import opaTest from "sap/ui/test/opaQunit";
import LoginPage from "./pages/Login";
import AllUsersPage from "./pages/AllUsers";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";

const onTheLoginPage = new LoginPage();
const onTheAllUsersPage = new AllUsersPage();
const onDashboardPage = new Dashboard();
const onUserProfilePage = new UserProfile();
// --------------------------------------- Login Page --------------------------------------------//

QUnit.module("Login Navigation Journey");

opaTest("Should login into the application", function (Then: any) {
	//Arrangements
	onTheLoginPage.iStartMyApp();

	onTheLoginPage.iTypeInLoginEmailInput();

	onTheLoginPage.iTypeInLoginPasswordInput();

	// Actions
	onTheLoginPage.iPressOnTheLoginButton();

	//Assertions
	onTheLoginPage.iShouldSeeTheAdminUserDashboardPage();

	// // Cleanup
	// Then.iTeardownMyApp();
});

QUnit.module("Navigate to User Microservice Journey");
opaTest("Should create new user", function () {
	//Action
	onDashboardPage.iPressOnTheUserManagementCard();
	//Assertion
	onDashboardPage.iShouldSeeTheAllUsersPage();
});


//user profile tests
QUnit.module("User Profile journey")
opaTest("Should open user profile", function () {
	onUserProfilePage.iPressOnTheAvatar()
	onUserProfilePage.iPressOnTheProfileLink()
	//assertion
	onUserProfilePage.iShouldSeeTheUserProfilePage()

})

opaTest("Should update details user profile", function () {
	//action
	onUserProfilePage.iPressOnTheEditProfile()
	//assertion
	onUserProfilePage.iShouldSeeTheUpdateProfileOpen()

	//action
	onUserProfilePage.iEnterTextIntoInputField("editFirstNameInput", "Bob")
	onUserProfilePage.iEnterTextIntoInputField("editLastNameInput", "Dylan")
	onUserProfilePage.iEnterTextIntoInputField("editPhoneInput", "0546677889")
	onUserProfilePage.iEnterTextIntoInputField("editAddressInput", "P.O.Box 6677")
	onUserProfilePage.iEnterTextIntoInputField("editDateInput", "11/11/96")
	onUserProfilePage.iSelectTheUserGender("Female")
	//assertions
	onUserProfilePage.iShouldSeeTheCorrectTextInInputField("editFirstNameInput", "Bob")
	onUserProfilePage.iShouldSeeTheCorrectTextInInputField("editLastNameInput", "Dylan")
	onUserProfilePage.iShouldSeeTheCorrectTextInInputField("editPhoneInput", "0546677889")
	onUserProfilePage.iShouldSeeTheCorrectTextInInputField("editAddressInput", "P.O.Box 6677")
	onUserProfilePage.iShouldSeeTheCorrectTextInInputField("editDateInput", "11/11/96")
	onUserProfilePage.iShouldSeeTheCorrectGenderSelected("Female")
})

opaTest("Should submit updated details of user", function () {
	//action
	onUserProfilePage.iPressOnTheUpdateButton()
	//assertion
	onUserProfilePage.iShouldSeeTheCorrectTextInView("firstName", "Bob");

})




QUnit.module("Create User Journey");
opaTest("Should create new user", function () {
	//open dialog
	//Action
	onTheAllUsersPage.iPressOnTheCreateUserButton();
	//Assertion
	onTheAllUsersPage.iShouldSeeTheCreateDialogOpen();

	//input data
	//Action
	onTheAllUsersPage.iEnterTextIntoFirstNameField("Michael");
	//Assertion
	onTheAllUsersPage.iShouldSeeTheCorrectFirstNameInInput("Michael");

	//Action
	onTheAllUsersPage.iEnterTextIntoLastNameField("Akata");
	//Assertion
	onTheAllUsersPage.iShouldSeeTheCorrectLastNameInInput("Akata");

	//Action
	onTheAllUsersPage.iEnterTextIntoEmailField("akata123@gmail.com");
	//Assertion
	onTheAllUsersPage.iShouldSeeTheCorrectEmailInInput("akata123@gmail.com");

	//Action
	onTheAllUsersPage.iEnterTextIntoPhoneNumberField("0419419419");
	//Assertion
	onTheAllUsersPage.iShouldSeeTheCorrectPhoneNumberInInput("0419419419");

	//action
	onTheAllUsersPage.iSelectTheUserRole("Warehouse Manager");
	//assertion
	onTheAllUsersPage.iShouldSeeTheCorrectRoleSelected("Warehouse Manager");

	//confirm create
	//Action
	onTheAllUsersPage.iStoreInitialTableLength();
	onTheAllUsersPage.iPressOnTheCreateButton();
	//Assertion
	onTheAllUsersPage.theTableHasNewItem();
});

QUnit.module("Search and Filter user journey");
opaTest("Search", function () {
	//action
	onTheAllUsersPage.iEnterTextForSearch("Michael");
	//assertion
	onTheAllUsersPage.iSeeExpectedSearchResults();
	onTheAllUsersPage.iClearSearchField();
});

QUnit.module("Edit user journey");
opaTest("Should edit user", function () {
	//action
	onTheAllUsersPage.iPressOnTheEditButton(1);
	//assertion
	onTheAllUsersPage.iShouldSeeTheEditDialogOpen();
	onTheAllUsersPage.iShouldSeePrefilledInputFields({
		firstName: "Michael",
		lastName: "Akata",
		email: "akata123@gmail.com",
		phoneNumber: "0419419419",
		role: "Warehouse Manager",
	});

	//action
	onTheAllUsersPage.iEnterTextIntoFirstNameField("Jane");
	onTheAllUsersPage.iEnterTextIntoLastNameField("Smith");
	onTheAllUsersPage.iEnterTextIntoEmailField("jane.smith@example.com");
	onTheAllUsersPage.iEnterTextIntoPhoneNumberField("9876543210");
	onTheAllUsersPage.iSelectTheUserRole("Finance Manager");
	onTheAllUsersPage.iPressOnTheSaveButton();
	//assertion
	onTheAllUsersPage.iShouldSeeUpdatedUserInTable(1, {
		firstName: "Jane",
		lastName: "Smith",
		email: "jane.smith@example.com",
		phoneNumber: "9876543210",
	});
});

QUnit.module("Delete User Journey");
opaTest("Should delete single user", function () {
	//action
	onTheAllUsersPage.iStoreInitialTableLength();
	onTheAllUsersPage.iPressOnTheDeleteButton(1);
	//assertion
	onTheAllUsersPage.iShouldSeeTheDeleteDialog();

	//action
	onTheAllUsersPage.iConfirmDeletion();
	//assertion
	onTheAllUsersPage.theTableHasOneFewerItem();
});