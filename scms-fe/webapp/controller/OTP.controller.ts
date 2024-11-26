import Input from "sap/m/Input";
import BaseController from "./BaseController";
import HBox from "sap/m/HBox";
import MessageToast from "sap/m/MessageToast";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import JSONModel from "sap/ui/model/json/JSONModel";

export default class OTP extends BaseController {
    public async onInit(): Promise<void> {
        const resetPasswordEmail = localStorage.getItem("resetPasswordEmail");
        // Retrieve the resource bundle for displaying localized messages
		const resourceBundle: ResourceBundle = await this.getResourceBundle();

        const codeSentText = resourceBundle.getText("codeSent", [resetPasswordEmail]);
        const otpModel = new JSONModel({
            codeSent: codeSentText
        });
        this.getView().setModel(otpModel, "otpModel");
    }
    public async onOtpSubmit(): Promise<void> {
        const oView = this.getView();
        const oModel = oView.getModel("viewAllUsers") as ODataModel;

        const otpContainer = this.byId("otpContainer") as HBox;
        // Get all input fields inside otpContainer
        const inputs = otpContainer.getItems();

        // Concatenate the values from each Input to form the OTP code
        let otpCode = inputs.reduce((code, input) => {
            return code + (input as Input).getValue();
        },"")

        const resetPasswordEmail = localStorage.getItem("resetPasswordEmail");
        const ForgotPasswordToken = localStorage.getItem("forgotPasswordToken");

        try {
            const oContextBinding = oModel.bindContext("/verifyOtp(...)");
            oContextBinding.setParameter("email", resetPasswordEmail);
            oContextBinding.setParameter("token", ForgotPasswordToken);
            oContextBinding.setParameter("otp", otpCode);
      
            BusyIndicator.show(0);
      
            // Execute the request
            await oContextBinding.invoke();
      
            // Retrieve the context to get the response data
            const oResponseContext = oContextBinding.getBoundContext().getObject();
            // get message from the response
            const sMessage = oResponseContext.value.message;

            // Success message and navigation
            MessageToast.show(sMessage);
            this.getRouter().navTo("resetPassword")
        } catch (error:any) {
            //get the error message from the response
        	const statusMessage = error.error?.message;
            // if there is an error message display it else navigate the user to the error page
			statusMessage? MessageToast.show(statusMessage): this.getRouter().navTo("errorPage");
        }
        finally{
			BusyIndicator.hide(); 
		}
    }

    public onOtpChange(oEvent: any): void {
        // Get the current input control that triggered the event
        const currentInput = oEvent.getSource();
        // Retrieve the value entered in the current input
        const value = currentInput.getValue();
    
        // Automatically move to the next input if a character is entered
        if (value.length === 1) {
            // Get the OTP container that holds all the input fields
            const otpContainer = this.byId("otpContainer") as HBox;
            // Retrieve all input items within the OTP container
            const inputs = otpContainer.getItems();
            // Find the index of the current input in the list of inputs
            const currentIndex = inputs.indexOf(currentInput);
            // Check if the current input is not the last one in the container
            if (currentIndex < inputs.length - 1) {
                // Move focus to the next input field
                inputs[currentIndex + 1].focus();
            }
        }
    }    

}