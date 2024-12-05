import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import BaseController from "../BaseController";
import Input from "sap/m/Input";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import formatter from "../../model/formatter";
import MessageToast from "sap/m/MessageToast";
import BusyIndicator from "sap/ui/core/BusyIndicator";

export default class ForgotPassword extends BaseController {
  public async onForgotPasswordPress(): Promise<void> {
    const oView = this.getView();
    const oModel = oView.getModel("viewAllUsers") as ODataModel;
    const emailInputControl = this.getView().byId("forgotEmailInput") as Input;
    const emailInput = emailInputControl.getValue();

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

    try {
      const oContextBinding = oModel.bindContext("/requestPasswordReset(...)");
      oContextBinding.setParameter("email", emailInput);

      BusyIndicator.show(0);

      // Execute the request
      await oContextBinding.invoke();

      // Retrieve the context to get the response data
      const oResponseContext = oContextBinding.getBoundContext().getObject();
      // get message from the response
      const sMessage = oResponseContext.value.message;
      //get token from the response
      const forgotPasswordToken = oResponseContext.value.token

      // save forgot token into local storage
      localStorage.setItem("forgotPasswordToken", forgotPasswordToken);
      localStorage.setItem("resetPasswordEmail", emailInput)
      
      // Success message and navigation
      MessageToast.show(sMessage);
      // navigate to otp page to enter the code
      this.getRouter().navTo("otp");
	    // Clear email input field
      emailInputControl.setValue("");

    } catch (error:any) {
      // Access the status code from the error response
      const statusMessage = error.error?.message;
			statusMessage? MessageToast.show(statusMessage): this.getRouter().navTo("errorPage");
    }finally{
			BusyIndicator.hide(); 
		}
  }
}
