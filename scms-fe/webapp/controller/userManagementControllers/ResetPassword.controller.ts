import Input from "sap/m/Input";
import BaseController from "../BaseController";
import MessageToast from "sap/m/MessageToast";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import BusyIndicator from "sap/ui/core/BusyIndicator";

export default class ResetPassword extends BaseController {
    public async onResetPasswordPress(): Promise<void> {
        const oView = this.getView();
        const oModel = oView.getModel("viewAllUsers") as ODataModel;

        const newPasswordInput = this.byId("newPasswordInput") as Input; 
        const newPassword = newPasswordInput.getValue();
        const confirmNewPasswordInput = this.byId("confirmNewPasswordInput") as Input; 
        const confirmPassword = confirmNewPasswordInput.getValue();
        // validate the new password
        const newPasswordValidation = await this.validatePassword(newPassword);
        // validate the confirm password
        const confirmNewPasswordValidation =await this.validatePassword(confirmPassword);

        if (!newPasswordValidation.isValid) {
            MessageToast.show(newPasswordValidation.message);
            return; // Exit if validation fails
        }
    
        // Check if the confirmation password is valid
        if (!confirmNewPasswordValidation.isValid) {
            MessageToast.show(confirmNewPasswordValidation.message);
            // Exit if validation fails
            return; 
        }
    
        // Check if both passwords match
        if (newPassword !== confirmPassword) {
            MessageToast.show("PasswordsDontmatch."); 
            // Exit if they do not match
            return; 
        }

        const resetPasswordEmail = localStorage.getItem("resetPasswordEmail");

        try {
            const oContextBinding = oModel.bindContext("/resetPassword(...)");
            oContextBinding.setParameter("email", resetPasswordEmail);
            oContextBinding.setParameter("password", newPassword);
      
            BusyIndicator.show(0);
      
            // Execute the request
            await oContextBinding.invoke();
      
            // Retrieve the context to get the response data
            const oResponseContext = oContextBinding.getBoundContext().getObject();
            // get message from the response
            const sMessage = oResponseContext.value.message;

            // Success message and navigation
            MessageToast.show(sMessage);
            // clear the local storage
            localStorage.clear();

            this.getRouter().navTo("login")
        } catch (error:any) {
            //get the error message from the response
        	const statusMessage = error.error?.message;
            // if there is an error message display it else navigate the user to the error page
			statusMessage? MessageToast.show(statusMessage): this.getRouter().navTo("errorPage");
        } finally{
            BusyIndicator.hide(); 
        }
    }
}