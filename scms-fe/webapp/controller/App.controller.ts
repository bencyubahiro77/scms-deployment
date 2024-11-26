import MessageToast from "sap/m/MessageToast";
import BaseController from "./BaseController";
import Popover from "sap/m/Popover";
import Control from "sap/ui/core/Control";
import Fragment from "sap/ui/core/Fragment";
import ResourceBundle from "sap/base/i18n/ResourceBundle";

/**
 * @namespace scms.frontend.controller
 */
export default class App extends BaseController {
	public onInit(): void {
		// apply content density mode to root view
		this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
        // on every route navigation call the onNavBarHidden method
        this.getRouter().attachRouteMatched(this.onNavBarHidden)
	}

	private _oPopover: Popover | null = null;

    public onAvatarPress(oEvent: any): void {
        // Check if the popover is already created
        if (!this._oPopover) {
            // Load the popover fragment
            Fragment.load({
                name: "scmsfe.view.fragments.Popover", 
                controller: this 
            }).then((oPopover: any) => {
                this._oPopover = oPopover;
				// Add the popover to the current view
                this.getView().addDependent(this._oPopover); 
                this._oPopover.openBy(oEvent.getSource());
            }).catch((oError: Error) => {
                throw Error("Error loading popover: ", oError);
            });
        } else {
            // Open the popover if it already exists
            this._oPopover.openBy(oEvent.getSource());
        }
    }

    public onProfilePress(): void {
     //nav to user page
     this.getRouter().navTo("userProfile");
    }

    public onCartPress(): void {
        this.getRouter().navTo("dashboard");
    }

    public  onNavBarHidden = async (): Promise<void> =>{
        // Get the router and hash changer to determine the current route
        const oRouter = this.getRouter();
        const oHashChanger = oRouter.getHashChanger();
        const sHash = oHashChanger.getHash();
        const resourceBundle: ResourceBundle = await this.getResourceBundle();
    
        // Retrieve route information based on the current hash
        const oRouteInfo = oRouter.getRouteInfoByHash(sHash);
        // Get the route name, defaulting to 'unknown' if no route info is found
        const sRouteName = oRouteInfo ? oRouteInfo.name : "unknown";
        // Define routes where the fragment should be hidden
        const aHiddenRoutes = ["login", "forgotPassword", "default","otp","resetPassword","errorPage"];
        // Get the fragment instance using the assigned ID
        const oNavBarFragmentContainer = this.byId("vboxContainer") as Control;
    
        // Check if the fragment instance is defined
        if (oNavBarFragmentContainer) {
            // Check if the current route is in the list of hidden routes
            if (aHiddenRoutes.includes(sRouteName)) {
                // Hide the fragment
                oNavBarFragmentContainer.setVisible(false);
            } else {
                // Show the fragment
                oNavBarFragmentContainer.setVisible(true);
            }
        } else {
            MessageToast.show(resourceBundle.getText("navNotFound"));
        }
    }    
    public onDashboard (): void{
        this.getRouter().navTo("dashboard")
    }
}
