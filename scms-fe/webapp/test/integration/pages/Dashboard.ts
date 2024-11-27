import Press from "sap/ui/test/actions/Press";
import PropertyStrictEquals from "sap/ui/test/matchers/PropertyStrictEquals";
import Opa5 from "sap/ui/test/Opa5";

const viewName = "scmsfe.view.Dashboard";

export default class Dashboard extends Opa5 {

    iPressOnTheUserManagementCard() {
        return this.waitFor({
            controlType: "sap.f.GridListItem",
            matchers: new PropertyStrictEquals({ name: "id", value: "__item1-__component0---dashboard--gridList-0" }), // Adjust the ID as necessary
            actions: new Press(),
            errorMessage: "The first GridListItem was not found"
        });
	}

    // Assertions
    iShouldSeeTheAllUsersPage() {
        return this.waitFor({
            viewName: "scms.frontend.view.AllUsers", 
            success: function() {
                Opa5.assert.ok(true, "Navigated to the All Users page");
            },
            errorMessage: "Did not navigate to the All Users page"
        });
    } 
   
}