import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import AppComponent from "../Component";
import Model from "sap/ui/model/Model";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Router from "sap/ui/core/routing/Router";
import History from "sap/ui/core/routing/History";
import Input from "sap/m/Input";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";

/**
 * @namespace scms.frontend.controller
 */
export default abstract class BaseController extends Controller {

	public onInit(): void {
		// Attach the 'onRouteMatched' handler to be triggered whenever a route is matched
		this.getRouter().attachRouteMatched(this.onRouteMatched);
	}
	/**
	 * Convenience method for accessing the component of the controller's view.
	 * @returns The component of the controller's view
	 */
	public getOwnerComponent(): AppComponent {
		return super.getOwnerComponent() as AppComponent;
	}

	/**
	 * Convenience method to get the components' router instance.
	 * @returns The router instance
	 */
	public getRouter(): Router {
		return UIComponent.getRouterFor(this);
	}

	/**
	 * Convenience method for getting the i18n resource bundle of the component.
	 * @returns The i18n resource bundle of the component
	 */
	public getResourceBundle(): ResourceBundle | Promise<ResourceBundle> {
		const oModel = this.getOwnerComponent().getModel("i18n") as ResourceModel;
		return oModel.getResourceBundle();
	}

	/**
	 * Convenience method for getting the view model by name in every controller of the application.
	 * @param [sName] The model name
	 * @returns The model instance
	 */
	public getModel(sName?: string): Model {
		return this.getView().getModel(sName);
	}

	/**
	 * Convenience method for setting the view model in every controller of the application.
	 * @param oModel The model instance
	 * @param [sName] The model name
	 * @returns The current base controller instance
	 */
	public setModel(oModel: Model, sName?: string): BaseController {
		this.getView().setModel(oModel, sName);
		return this;
	}

	/**
	 * Convenience method for triggering the navigation to a specific target.
	 * @public
	 * @param sName Target name
	 * @param [oParameters] Navigation parameters
	 * @param [bReplace] Defines if the hash should be replaced (no browser history entry) or set (browser history entry)
	 */
	public navTo(sName: string, oParameters?: object, bReplace?: boolean): void {
		this.getRouter().navTo(sName, oParameters, undefined, bReplace);
	}

	/**
	 * Convenience event handler for navigating back.
	 * It there is a history entry we go one step back in the browser history
	 * If not, it will replace the current entry of the browser history with the main route.
	 */
	public onNavBack(): void {
		const sPreviousHash = History.getInstance().getPreviousHash();
		if (sPreviousHash !== undefined) {
			window.history.go(-1);
		} else {
			this.getRouter().navTo("login", {}, undefined, true);
		}
	}

	public moveToLogin(): void {
		// navigate to login page
		this.getRouter().navTo("login")
	}

	public onRouteMatched = (): void => {
		// Get the router and hash changer to determine the current route
		const oRouter = this.getRouter();
		const oHashChanger = oRouter.getHashChanger();
		const sHash = oHashChanger.getHash();

		// Retrieve route information based on the current hash
		const oRouteInfo = oRouter.getRouteInfoByHash(sHash);
		// Get the route name, defaulting to 'unknown' if no route info is found
		const sRouteName = oRouteInfo ? oRouteInfo.name : "unknown";

		// List of protected routes that require authentication
		const protectedRoutes = ["allUsers"];
		// Get the authentication token from localStorage
		const token = localStorage.getItem("Auth-token");

		// If the current route is protected and no token is found, redirect to login
		if (protectedRoutes.includes(sRouteName) && !token) {
			this.moveToLogin();  // Redirect to login if not authenticated
			return;
		}
	}

	public onTogglePasswordVisibility(): void {
		// Get all Input controls in the view
		const allInputs = this.getView().findAggregatedObjects(true);

		// Toggle the type for each Input found
		allInputs.forEach((control) => {
			// Check if the control is an Input 
			if (control instanceof Input && control.hasStyleClass("passwordInput")) {
				// Toggle between Password and Text type
				if (control.getType() === "Password") {
					// password change to text type
					control.setType("Text");
					// Change to 'hide' icon
					control.setValueHelpIconSrc("sap-icon://hide"); 
				} else {
					// password change to password type
					control.setType("Password");
					// Change to 'show' icon
					control.setValueHelpIconSrc("sap-icon://show"); 
				}
			}
		});
	}

	public validatePassword = async (password: string): Promise <{ isValid: boolean; message: string }> => {
		// Minimum length
		const minLength = 6; 
		// Check for uppercase letters
		const hasUpperCase = /[A-Z]/.test(password); 
		// Check for lowercase letters
		const hasLowerCase = /[a-z]/.test(password); 
		// Check for numbers
		const hasNumbers = /\d/.test(password); 
		// Check for special characters
		const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password); 

		const resourceBundle: ResourceBundle = await this.getResourceBundle();

           // Check if the password length is 0 (empty)
		if (password.length === 0) {
		   // Return validation result indicating the password is required
			return { isValid: false, message: resourceBundle.getText("passwordRequired") };
		   // Check if the password length is less than the minimum required length	
		} else if (password.length < minLength) {
			// Return validation result indicating the password does not meet the minimum length requirement
			return { isValid: false, message: resourceBundle.getText("passwordLengthError", [minLength]) };
		}
		   // Check if the password contains at least one uppercase letter
		if (!hasUpperCase) {
			// Return validation result indicating the password must include an uppercase letter
			return { isValid: false, message: resourceBundle.getText("passwordUppercaseError") };
		}
		    // Check if the password contains at least one lowercase letter
		if (!hasLowerCase) {
			// Return validation result indicating the password must include a lowercase letter
			return { isValid: false, message: resourceBundle.getText("passwordLowercaseError") };
		}
		   // Check if the password contains at least one number
		if (!hasNumbers) {
			// Return validation result indicating the password must include a number
			return { isValid: false, message: resourceBundle.getText("passwordNumberError") };
		}
		   // Check if the password contains at least one special character
		if (!hasSpecialChars) {
		   // Return validation result indicating the password must include a special character
			return { isValid: false, message: resourceBundle.getText("passwordSpecialCharError") };
		}
	      // No message needed if valid
		return { isValid: true, message: "" }; 
	}

	public onLogoutPress(): void {
		// clear the localStorage
		localStorage.clear();
		// navigate to login page
		this.moveToLogin()
	  }
	  
	public async checkBackendAvailability(): Promise<boolean> {
		const oModel = this.getModel("viewAllUsers") as ODataModel;
		const oMetaModel = oModel.getMetaModel();
	
		try {
			await oMetaModel.requestObject("/");
		} catch (error) {
			this.getRouter().navTo("errorPage");
			return false;
		}
	
		return true;
	}	
}
