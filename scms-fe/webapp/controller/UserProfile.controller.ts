import Dialog from "sap/m/Dialog";
import BaseController from "./BaseController";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageToast from "sap/m/MessageToast";
import Input from "sap/m/Input";
import DatePicker from "sap/m/DatePicker";
import Select from "sap/m/Select";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import BusyIndicator from "sap/ui/core/BusyIndicator";


/**
 * @namespace scms.frontend.controller
 */
export default class UserProfile extends BaseController {

    public onInit(): void {

		const oModel = this.getOwnerComponent().getModel(
			"viewAllUsers"
		) as ODataModel;

		const token = localStorage.getItem("Auth-token");

		if (token) {
			// set the Authorization header for all requests made by this model
			oModel.changeHttpHeaders({
				Authorization: `Bearer ${token}`,
			});

		} else {
			console.error("Authorization token is missing in local storage.");
		}
		this.fetchUserProfile()
		
	}

    public onUpdateProfileDialog(): void {
		const oDialog = this.byId("updateUserDialog") as Dialog;
		

		const oProfileModel = this.getOwnerComponent().getModel(
			"profileModel"
		) as JSONModel;
		const sFirstName = oProfileModel.getProperty("/firstName")
        const sLastName = oProfileModel.getProperty("/lastName");
        const sPhoneNumber = oProfileModel.getProperty("/phoneNumber");
        const sDateOfBirth = oProfileModel.getProperty("/dateOfBirth");
        const sGender = oProfileModel.getProperty("/gender");
        const oAddress = oProfileModel.getProperty("/address");

		const oView = this.getView();
		oView.addDependent(oDialog);
		oDialog.open();
		
		(oView.byId("editFirstNameInput") as Input).setValue(sFirstName);
		(oView.byId("editLastNameInput") as Input).setValue(sLastName);
		(oView.byId("editPhoneInput") as Input).setValue(sPhoneNumber);
		(oView.byId("editAddressInput") as Input).setValue(oAddress);
		(oView.byId("editDateInput") as DatePicker).setValue(sDateOfBirth);
		(oView.byId("genderSelect") as Select).setSelectedKey(sGender);

	this.limitDates()
	}

    public onCloseUpdateProfileDialog(): void {
		const oDialog = this.byId("updateUserDialog") as Dialog;
		oDialog.close();

	}

	private limitDates (): void {
		const oDatepicker = this.byId("editDateInput") as DatePicker;
		const today = new Date();
		oDatepicker.setMaxDate(today);
	}


	public async onSaveEditedProfile(): Promise<void> {
		const oView = this.getView();
		const oModel = oView.getModel("viewAllUsers") as ODataModel;
		const oProfileModel = this.getOwnerComponent().getModel(
			"profileModel"
		) as JSONModel;
		const capitalizeFirstLetter = (input: string) => input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();

		const sId = oProfileModel.getProperty("/ID")
		const sFirstName = capitalizeFirstLetter((oView.byId("editFirstNameInput") as Input).getValue());
        const sLastName = capitalizeFirstLetter((oView.byId("editLastNameInput") as Input).getValue());
        const sPhoneNumber = (oView.byId("editPhoneInput") as Input).getValue();
        const sDateOfBirth = (oView.byId("editDateInput") as DatePicker).getValue();
        const sGender = (oView.byId("genderSelect") as Select).getSelectedKey();
        const sAddress = capitalizeFirstLetter((oView.byId("editAddressInput") as Input).getValue());

		const resourceBundle: ResourceBundle = await this.getResourceBundle();

		let formattedDateOfBirth;
		if (sDateOfBirth) {
			const date = new Date(sDateOfBirth);
			formattedDateOfBirth = new Date(
				Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
			).toISOString().split('T')[0];
		}

		try {
			// busy indicator will be shown when a user is being updated
			BusyIndicator.show(0);
			const updateContext = oModel.bindContext("/updateProfile(...)")
				.setParameter("ID", sId)
				.setParameter("address", sAddress)
				.setParameter("gender", sGender)
				.setParameter("firstName", sFirstName)
				.setParameter("lastName", sLastName)
				.setParameter("phoneNumber", sPhoneNumber)
				// Only add the dateOfBirth parameter if it exists
				if (formattedDateOfBirth) {
					updateContext.setParameter("dateOfBirth", formattedDateOfBirth);
				}
				await updateContext.invoke();

			// Show a success message
			MessageToast.show(resourceBundle.getText("userEdited"));
			// update the user table
			this.fetchUserProfile();
			// Close the create user dialog
			this.onCloseUpdateProfileDialog();
		} catch (error:any) {
			// Access the status message from the error response
			const statusMessage = error.error?.message;
			statusMessage? MessageToast.show(statusMessage): this.getRouter().navTo("errorPage");
		} finally {
			// hide the busy indicator if user updating is successful or not
			BusyIndicator.hide();
		}
	}

	private fetchUserProfile(): void {
		const oDataModel = this.getOwnerComponent().getModel(
			"viewAllUsers"
		) as ODataModel;
		const oProfileModel = this.getOwnerComponent().getModel(
			"profileModel"
		) as JSONModel;
		oProfileModel.setProperty("/busy", true);

		const oContextBinding = oDataModel.bindContext("/viewProfile(...)");

		// execute the function import
		oContextBinding
			.invoke()
			.then(() => {
				const oContext = oContextBinding.getBoundContext().getObject();
				if (oContext) {
					const aUsers = oContext.value;
					if (Array.isArray(aUsers)) {
						// Add data to model
						oProfileModel.setData(aUsers[0]);
					} else {
						console.error("Unexpected response format");
					}
				}
				oProfileModel.setProperty("/busy", false);
			})
			.catch((error) => {
				// Handle error
				const statusMessage = error.error?.message;
				statusMessage? MessageToast.show(statusMessage): this.getRouter().navTo("errorPage");
				oProfileModel.setProperty("/busy", false);
			});
	}
	public onNavBackUserDashboard (): void{
		window.history.back();
	}
}