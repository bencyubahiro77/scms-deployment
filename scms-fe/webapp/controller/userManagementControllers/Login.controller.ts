import Input from "sap/m/Input";
import MessageToast from "sap/m/MessageToast";
import BaseController from "../BaseController";
import formatter from "../../model/formatter";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import { UserInfo } from "../../model/types";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import BusyIndicator from "sap/ui/core/BusyIndicator";

export default class Login extends BaseController {

	public async onLoginPress(): Promise<void> {
		const oView = this.getView();
		const oModel = oView.getModel("viewAllUsers") as ODataModel;
		const emailInputControl = this.getView().byId("emailInput") as Input;
		const passwordInputControl = this.getView().byId("passwordInput") as Input;
		const emailInput = emailInputControl.getValue();
		const passwordInput = passwordInputControl.getValue();
	
		// Retrieve the resource bundle for displaying localized messages
		const resourceBundle: ResourceBundle = await this.getResourceBundle();
	
		// Validate email input
		if (!emailInput || !formatter.validateEmail(emailInput)) {
			const errorMessage = !emailInput
				? resourceBundle.getText("emailRequired")
				: resourceBundle.getText("invalidEmail");
			MessageToast.show(errorMessage);
			return;
		}
	
		// Validate password input
		if (!passwordInput) {
			MessageToast.show(resourceBundle.getText("passwordRequired"));
			return;
		}
        // check for backend availability to progress
		const isBackendAvailable = await this.checkBackendAvailability();
		if (!isBackendAvailable) {
			return;
		}
		// Proceed with login if both email and password are valid
		try {
			// Bind the context and set parameters for the login request
			const oContextBinding = oModel.bindContext("/login(...)");
			oContextBinding.setParameter("email", emailInput);
			oContextBinding.setParameter("password", passwordInput);
	
			BusyIndicator.show(0); 
			
			// Execute the request
			await oContextBinding.invoke();
	
			// Retrieve the context to get the response data
			const oResponseContext = oContextBinding.getBoundContext().getObject();
			const sToken = oResponseContext.value.token;
	
			localStorage.setItem("Auth-token", sToken);
			const authToken = localStorage.getItem("Auth-token");
	
			// If token exists, store it and show success message
			if (authToken) {
				const decodedUserInfo = formatter.decodeToken(authToken) as UserInfo;
				// Use the function to set user info to localStorage
				this.setUserInfoToLocalStorage(decodedUserInfo);
			}
	
			// Success message and navigation
			MessageToast.show(resourceBundle.getText("loginSuccess"));
				
			this.getRouter().navTo("dashboard");
			// Clear email and password input fields after successful login
			emailInputControl.setValue("");
			passwordInputControl.setValue("");
	
		} catch (error) {
			// Show failure message
			MessageToast.show(resourceBundle.getText("loginFailed"));
		} finally{
			BusyIndicator.hide(); 
		}
	}	

	public setUserInfoToLocalStorage(userInfo: UserInfo): void {
		// set the user info to local storage
		localStorage.setItem("role", userInfo.role);
		localStorage.setItem("firstName", userInfo.firstName);
		localStorage.setItem("lastName", userInfo.lastName);
	}

	public getUserInfoFromLocalStorage(): UserInfo | null {
		// Get the user info from local storage
		const role = localStorage.getItem("role");
		const firstName = localStorage.getItem("firstName");
		const lastName = localStorage.getItem("lastName");
	
		// Check if all values exist before returning
		if (role && firstName && lastName) {
			return { role, firstName, lastName };
		}
		// Return null if any value is missing
		return null; 
	}

	public onForgotPasswordPress(): void {
		// navigate to the forgot password page
		this.getRouter().navTo("forgotPassword");
	}
}
