import MessageBox from "sap/m/MessageBox";
import BaseController from "../BaseController";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import Input from "sap/m/Input";
import JSONModel from "sap/ui/model/json/JSONModel";
import Table from "sap/m/Table";
import CheckBox from "sap/m/CheckBox";
import FilterBar from "sap/ui/comp/filterbar/FilterBar";
import ListBinding from "sap/ui/model/ListBinding";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Dialog from "sap/m/Dialog";
import Sorter from "sap/ui/model/Sorter";
import MessageToast from "sap/m/MessageToast";
import formatter from "../../model/formatter";
import { UserData, SelectedItem } from "../../model/types";
import Button from "sap/m/Button";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import Select from "sap/m/Select";
import MultiComboBox from "sap/m/MultiComboBox";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import FilterGroupItem from "sap/ui/comp/filterbar/FilterGroupItem";
import ColumnListItem from "sap/m/ColumnListItem";
import ListItemBase from "sap/m/ListItemBase";
import Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
import ViewSettingsDialog from "sap/m/ViewSettingsDialog";


export default class AllUsers extends BaseController {
	public currentAction: string = "";
	public userId: string = "";
	private oViewModel: JSONModel;

	public onInit(): void {
		//create model to store all user data
		this.oViewModel = new JSONModel({
			users: [],
			busy: false,
		});
		this.getView().setModel(this.oViewModel, "viewModel");

		//get model
		const oModel = this.getOwnerComponent().getModel(
			"viewAllUsers"
		) as ODataModel;

		const token = localStorage.getItem("Auth-token");

		if (token) {
			// set the Authorization header for all requests made by this model
			oModel.changeHttpHeaders({
				Authorization: `Bearer ${token}`,
			});

			this.fetchUsers();
		} else {
			console.error("Authorization token is missing in local storage.");
		}
		this.fetchUserRole();
	}

	private fetchUsers(): void {
		const oDataModel = this.getOwnerComponent().getModel(
			"viewAllUsers"
		) as ODataModel;

		this.oViewModel.setProperty("/busy", true);

		const oContextBinding = oDataModel.bindContext("/viewUsers(...)");

		// execute the function import
		oContextBinding
			.invoke()
			.then(() => {
				const oContext = oContextBinding.getBoundContext().getObject();
				if (oContext) {
					const aUsers = oContext.value;
					if (Array.isArray(aUsers)) {
						// Add data to model
						this.oViewModel.setProperty("/users", aUsers);
					} else {
						console.log("Unexpected response format");
					}
				}
				this.oViewModel.setProperty("/busy", false);
			})
			.catch((error) => {
				// Handle error
				const statusMessage = error.error?.message;
				statusMessage? MessageToast.show(statusMessage): this.getRouter().navTo("errorPage");
				this.oViewModel.setProperty("/busy", false);
			});
	}

	public onSearch(): void {
		let sQuery = (this.getView().byId("search") as Input).getValue();

		const oBinding = this.getView()
			.byId("allUsersTable")
			.getBinding("items") as ODataListBinding;

		if (sQuery) {
			const ofirstNameFilter = new Filter({
				path: "firstName",
				operator: FilterOperator.Contains,
				value1: sQuery.toLowerCase(),
				caseSensitive: false,
			});
			const olastNameFilter = new Filter({
				path: "lastName",
				operator: FilterOperator.Contains,
				value1: sQuery.toLowerCase(),
				caseSensitive: false,
			});
			const oEmailFilter = new Filter({
				path: "email",
				operator: FilterOperator.Contains,
				value1: sQuery.toLowerCase(),
				caseSensitive: false,
			});
			const oNumberFilter = new Filter({
				path: "phoneNumber",
				operator: FilterOperator.Contains,
				value1: sQuery,
				caseSensitive: false,
			});
			const oCombinedFilter = new Filter({
				filters: [
					ofirstNameFilter,
					olastNameFilter,
					oEmailFilter,
					oNumberFilter,
				],
				and: false,
			});
			oBinding.filter([oCombinedFilter]);
		} else {
			oBinding.filter([]);
		}
	}

	public onFilter(): void {
		const oView = this.getView();
		const oFilterBar = oView.byId("filterbar") as FilterBar;
		const oTable = oView.byId("allUsersTable") as Table;

		const aTableFilters = oFilterBar
			.getFilterGroupItems()
			.reduce(function (aResult: Filter[], oFilterGroupItem: FilterGroupItem) {
				const oControl = oFilterGroupItem.getControl() as MultiComboBox,
					aSelectedKeys = oControl.getSelectedKeys
						? oControl.getSelectedKeys()
						: [],
					aFilters = aSelectedKeys.map(function (sSelectedKey: string) {
						if (oFilterGroupItem.getName() === "roles") {
							return new Filter({
								path: "role/roleName",
								operator: FilterOperator.EQ,
								value1: sSelectedKey,
							});
						} else if (oFilterGroupItem.getName() === "accountStatus") {
							return new Filter({
								path: "account_status",
								operator: FilterOperator.EQ,
								value1: sSelectedKey,
							});
						}
					});

				if (aFilters.length > 0) {
					aResult.push(
						new Filter({
							filters: aFilters,
							and: false,
						})
					);
				}
				return aResult;
			}, []);

		(oTable.getBinding("items") as ListBinding).filter(aTableFilters);
	}

	public onClearFilter(): void {
		const oView = this.getView();
		const oFilterBar = oView.byId("filterbar") as FilterBar;
		const oTable = oView.byId("allUsersTable") as Table;

		// Clear the filter inputs in the filter bar
		oFilterBar.getFilterGroupItems().forEach((oFilterGroupItem) => {
			const oControl = oFilterGroupItem.getControl() as MultiComboBox;
			if (oControl.setSelectedKeys) {
				oControl.setSelectedKeys([]);
			} else if (oControl.setValue) {
				oControl.setValue("");
			}
		});

		const oBinding = oTable.getBinding("items") as ListBinding;
		oBinding.filter([]);
	}

	public onSelectAll(
		oEvent: Event & { getParameter(name: string): any }
	): void {
		const oTable = this.getView().byId("allUsersTable") as Table;
		const bCheckboxState = oEvent.getParameter("selected");
		const oSelectModel = this.getModel("selectModel") as JSONModel;
		let allSelectedItems = oSelectModel.getProperty("/allSelectedItems") || [];

		oTable.getItems().forEach((item: ListItemBase) => {
			const oColumnListItem = item as ColumnListItem;
			const oCheckBoxCell = oColumnListItem.getCells()[0] as CheckBox;
			const oSelectedData = item
				.getBindingContext("viewModel")
				.getObject() as UserData;

			if (oCheckBoxCell) {
				oCheckBoxCell.setSelected(bCheckboxState);

				if (bCheckboxState) {
					allSelectedItems.push({ ID: oSelectedData.ID });
				} else {
					allSelectedItems = allSelectedItems.filter(function (
						item: SelectedItem
					) {
						return item.ID !== oSelectedData.ID;
					});
				}
			}
		});

		oSelectModel.setProperty("/allSelectedItems", allSelectedItems);
		oSelectModel.refresh(true);
	}

	public onSelectChange(oEvent: Event): void {
		const oCheckBox = oEvent.getSource() as CheckBox;
		const oSelectedData = oCheckBox
			.getBindingContext("viewModel")
			.getObject() as UserData;
		const oSelectModel = this.getModel("selectModel") as JSONModel;
		let allSelectedItems = oSelectModel.getProperty("/allSelectedItems") || [];

		if (oCheckBox.getSelected()) {
			allSelectedItems.push({ ID: oSelectedData.ID });
		} else {
			allSelectedItems = allSelectedItems.filter(function (item: SelectedItem) {
				return item.ID !== oSelectedData.ID;
			});
		}

		oSelectModel.setProperty("/allSelectedItems", allSelectedItems);
		oSelectModel.refresh(true);
	}

	public resetCheckBoxes(): void {
		const oTable = this.getView().byId("allUsersTable") as Table;
		const oUpdateModel = this.getModel("selectModel") as JSONModel;

		oTable.getItems().forEach((item: ListItemBase) => {
			const oColumnListItem = item as ColumnListItem;
			const oCheckBoxCell = oColumnListItem.getCells()[0] as CheckBox;
			oCheckBoxCell.setSelected(false);
		});
		oUpdateModel.setProperty("/allSelectedItems", []);
		oUpdateModel.refresh(true);
	}

	public async onBatchDelete(): Promise<void> {
		const resourceBundle: ResourceBundle = await this.getResourceBundle();
		const oSelectModel = this.getModel("selectModel") as JSONModel;
		const allSelectedItems =
			oSelectModel.getProperty("/allSelectedItems") || [];

		const oDataModel = this.getView().getModel("viewAllUsers") as ODataModel;

		// Loop over each selected item to delete them from the Users array
		if (allSelectedItems.length !== 0) {
			MessageBox.confirm(resourceBundle.getText("confirmDeleteUser"), {
				actions: [MessageBox.Action.DELETE, MessageBox.Action.CANCEL],
				onClose: async (sAction: string) => {
					if (sAction === MessageBox.Action.DELETE) {
						// show the loader
						BusyIndicator.show(0);
						try {
							//set ids into an array
							const idsToDelete = allSelectedItems.map(
								(item: SelectedItem) => item.ID
							);

							const oContextBinding =
								oDataModel.bindContext("/deleteUser(...)");
							oContextBinding.setParameter("ID", idsToDelete);
							await oContextBinding.invoke();

							// Clear all selected items
							oSelectModel.setProperty("/allSelectedItems", []);

							// refresh list
							this.fetchUsers();
							this.resetCheckBoxes();

							MessageToast.show(resourceBundle.getText("deletedUser"));
						} catch (error:any) {
							const statusMessage = error.error?.message;
							statusMessage? MessageToast.show(statusMessage): this.getRouter().navTo("errorPage");
						}
						finally {
							// hide the busy indicator if user creation is successful or not
							BusyIndicator.hide();
						}
					}
				},
			});
		} else {
			MessageBox.error(resourceBundle.getText("noItemsSelected"));
		}
	}

	public async onDelete(oEvent: Event): Promise<void> {
		const oSource = oEvent.getSource() as Button;
		const resourceBundle: ResourceBundle = await this.getResourceBundle();
		const oModel = this.getView().getModel("viewAllUsers") as ODataModel;

		const oSelectedItem = oSource
			.getBindingContext("viewModel")
			.getObject() as UserData;
		const sUserId = oSelectedItem.ID;

		if (sUserId) {
			MessageBox.confirm(resourceBundle.getText("confirmDeleteUser"), {
				actions: [MessageBox.Action.DELETE, MessageBox.Action.CANCEL],
				onClose: async (sAction: string) => {
					if (sAction === MessageBox.Action.DELETE) {
						// show the loader
						BusyIndicator.show(0);
						try {
							await oModel
								.bindContext("/deleteUser(...)")
								//sets ids to be deleted as an array
								.setParameter("ID", [sUserId])
								.invoke(); //can use invoke instead
							MessageToast.show(resourceBundle.getText("deletedUser"));
							//fetch users again to refresh table
							this.fetchUsers();
						} catch (error:any) {
							const statusMessage = error.error?.message;
							statusMessage? MessageToast.show(statusMessage): this.getRouter().navTo("errorPage");
						}
						finally {
							BusyIndicator.hide(); // Hide BusyIndicator regardless of success or error
						}
					}
				},
			});
		}
	}

	public onOpenSortDialog(): void {
		const oDialog = this.byId("userSorter") as Dialog;
		oDialog.open();
	}
	//sort all users table
	public async onSortUsers(oEvent: Event): Promise<void> {
		const oSource = oEvent.getSource() as ViewSettingsDialog;
		const sSelectedKey: string = oSource
			.getSelectedSortItem()
			.split("--")
			.pop();

		const resourceBundle: ResourceBundle = await this.getResourceBundle();
		const order: boolean = oSource.getSortDescending();

		if (!sSelectedKey) {
			MessageBox.information(resourceBundle.getText("selectOption"));
			return;
		}

		let sSortProperty: string;
		let sortToastKey: string;
		switch (sSelectedKey) {
			case "sortfirstName":
				sSortProperty = resourceBundle.getText("firstNameSortKey");
				sortToastKey = "sortByfirstNameToast";
				break;
			case "sortlastName":
				sSortProperty = resourceBundle.getText("lastNameSortKey");
				sortToastKey = "sortBylastNameToast";
				break;
			case "sortRole":
				sSortProperty = resourceBundle.getText("roleSortKey");
				sortToastKey = "sortByRoleToast";
				break;
			case "sortStatus":
				sSortProperty = resourceBundle.getText("statusSortKey");
				sortToastKey = "sortByStatusToast";
				break;
			default:
				return;
		}
		const oTable = this.getView().byId("allUsersTable") as Table;
		const oTableData = oTable.getBinding("items") as ODataListBinding;
		const oSorter = new Sorter(sSortProperty, order);
		oTableData.sort(oSorter);
		MessageToast.show(resourceBundle.getText(sortToastKey));
	}

	public onOpenCreateUserDialog(bEdit: boolean = false): void {
		const oDialog = this.byId("createUserDialog") as Dialog;
		oDialog.open();
		this.currentAction = "save";
		this.changeUserDialogTitle(bEdit);
	}

	public onCloseCreateUserDialog(): void {
		const oDialog = this.byId("createUserDialog") as Dialog;
		const oUserModel = this.getModel("userModel") as JSONModel;
		oUserModel.setData({});
		oDialog.close();
		this.changeUserDialogTitle(false);
	}

	public async changeUserDialogTitle(bEdit: boolean): Promise<void> {
		const oDialog = this.byId("createUserDialog") as Dialog;
		const oButton = this.byId("userBtn") as Button;
		const resourceBundle: ResourceBundle = await this.getResourceBundle();
		const title1 = resourceBundle.getText("createUser");
		const title2 = resourceBundle.getText("editUser");
		const btnText1 = resourceBundle.getText("create");
		const btnText2 = resourceBundle.getText("editbtn");

		if (bEdit === false) {
			oDialog.setTitle(title1);
			oButton.setText(btnText1);
		} else if (bEdit === true) {
			oDialog.setTitle(title2);
			oButton.setText(btnText2);
		}
	}

	private async validateUserForm(
		firstNameInput: string,
		lastNameInput: string,
		emailInput: string,
		phoneInput: string
	): Promise<boolean> {
		// Retrieve the resource bundle for localized messages
		const resourceBundle: ResourceBundle = await this.getResourceBundle();

		// Check if name input is provided; show an error if missing
		if (!firstNameInput) {
			MessageBox.error(resourceBundle.getText("firstNameRequired"));
			return false;
		}

		if (!lastNameInput) {
			MessageBox.error(resourceBundle.getText("lastNameRequired"));
			return false;
		}
		// Check if email input is provided and valid; show appropriate error if missing or invalid
		if (!emailInput || !formatter.validateEmail(emailInput)) {
			const errorMessage = !emailInput
				? resourceBundle.getText("emailRequired")
				: resourceBundle.getText("invalidEmail");
			MessageBox.error(errorMessage);
			return false;
		}
		// Check if phone number is provided; show an error if missing
		if (!phoneInput) {
			MessageBox.error(resourceBundle.getText("phoneRequired"));
			return false;
		}
		// Return true if all validations pass
		return true;
	}

	private async fetchUserRole(): Promise<void> {
		const oModel = this.getOwnerComponent().getModel(
			"viewAllUsers"
		) as ODataModel;
		const oRoleModel = this.getOwnerComponent().getModel(
			"userRoleModel"
		) as JSONModel;

		// Use bindList to bind to the /Roles collection
		const oListBinding = oModel.bindList("/Roles");

		oListBinding
			.requestContexts()
			.then((aContexts) => {
				const aRoles = aContexts.map((oContext) => oContext.getObject());

				// Set the fetched roles to the userRoleModel
				oRoleModel.setProperty("/roles", aRoles);
			})
			.catch((error) => {
				const statusMessage = error.error?.message;
				statusMessage? MessageToast.show(statusMessage): this.getRouter().navTo("errorPage");
			});
	}

	public async onCreateUser(): Promise<void> {
		const oView = this.getView();
		const oModel = oView.getModel("viewAllUsers") as ODataModel;
		const sNewEmail = (
			this.getView().byId("createEmailInput") as Input
		).getValue();
		const sFirstNewName = (
			this.getView().byId("createFirstNameInput") as Input
		).getValue();
		const sLastNewName = (
			this.getView().byId("createLastNameInput") as Input
		).getValue();
		const nNewNumber = (
			this.getView().byId("createPhoneInput") as Input
		).getValue();
		const oRoleSelect = this.getView().byId("createRoleSelect") as Select;
		const sNewRole = oRoleSelect.getSelectedKey();

		// Get the resource bundle for localized messages
		const resourceBundle: ResourceBundle = await this.getResourceBundle();

		//get id from model
		const oUserModel = this.getModel("userModel") as JSONModel;
		const oUpdatedData = oUserModel.getData();
		const sId = oUpdatedData.ID;

		// Validate the user form inputs (name, email, phone number)
		const isValid = await this.validateUserForm(
			sFirstNewName,
			sLastNewName,
			sNewEmail,
			nNewNumber
		);

		// If validation fails, stop further execution
		if (!isValid) {
			return;
		}
		if (!sId) {
			//if no id create
			try {
				// busy indicator will be shown when a new user is created
				BusyIndicator.show(0);

				await oModel
					.bindContext("/createUser(...)")
					.setParameter("email", sNewEmail)
					.setParameter("firstName", sFirstNewName)
					.setParameter("lastName", sLastNewName)
					.setParameter("phoneNumber", nNewNumber)
					.setParameter("role", sNewRole)
					.invoke();

				// Show a success message
				MessageToast.show(resourceBundle.getText("userCreated"));
				// update users table
				this.fetchUsers();
				// Close the create user dialog
				this.onCloseCreateUserDialog();
			} catch (error:any) {
				// Access the status message from the error response
				const statusMessage = error.error?.message;
				statusMessage? MessageToast.show(statusMessage): this.getRouter().navTo("errorPage");
			} finally {
				// hide the busy indicator if user creation is successful or not
				BusyIndicator.hide();
			}
		} else if (sId) {
			//if id exsists
			try {
				// busy indicator will be shown when a user is being updated
				BusyIndicator.show(0);
				await oModel
					.bindContext("/updateUser(...)")
					.setParameter("ID", sId)
					.setParameter("email", sNewEmail)
					.setParameter("firstName", sFirstNewName)
					.setParameter("lastName", sLastNewName)
					.setParameter("phoneNumber", nNewNumber)
					.setParameter("role_ID", sNewRole)
					.invoke();

				// Show a success message
				MessageToast.show(resourceBundle.getText("userEdited"));
				// update the user table
                this.fetchUsers();
				// Close the create user dialog
				this.onCloseCreateUserDialog();
			} catch (error:any) {
				// Access the status message from the error response
				const statusMessage = error.error?.message;
				statusMessage? MessageToast.show(statusMessage): this.getRouter().navTo("errorPage");
			} finally {
				// hide the busy indicator if user updating is successful or not
				BusyIndicator.hide();
			}
		}
	}

	public onEditPress(oEvent: Event): void {
		this.currentAction = "edit";
		//gets specific user data and set that in a model.
		const oSource = oEvent.getSource() as Control;
		const oUserModel = this.getModel("userModel") as JSONModel;
		const oSelectedItem = oSource.getBindingContext("viewModel");
		const oUserData = oSelectedItem.getObject();
		//push user data into local model
		oUserModel.setData(oUserData);
		this.onOpenCreateUserDialog(true);
	}
}
