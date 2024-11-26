import JSONModel from "sap/ui/model/json/JSONModel";
import BindingMode from "sap/ui/model/BindingMode";
import {UserData,UserRole, SelectedItem} from "./types"
import Device from "sap/ui/Device";

export default {
	createDeviceModel: () => {
		const oModel = new JSONModel(Device);
		oModel.setDefaultBindingMode(BindingMode.OneWay);
		return oModel;
	},

	createSelectModel: () => {
		const allSelectedItems: SelectedItem[] = []
		const oModel = new JSONModel();
		oModel.setData(allSelectedItems);
		return oModel
	},
	
	createUserModel: () => {
		const oData: UserData ={
			ID: '',
			firstName: '',
			lastName:'',
			email: '',
			phoneNumber: "",
			role: '',
		}
		const oModel = new JSONModel();
		oModel.setData(oData)
		return oModel
	},

	createProfileModel:()=>{
	

		const oData: UserData ={
			ID: '',
			firstName: '',
			lastName:'',
			email: '',
			phoneNumber: "",
			role: '',
			address: '',
			dateOfBirth:'',
			gender: '',
		}
		const oModel = new JSONModel();
		oModel.setData(oData)
		return oModel
	},

	getUserRoleModel: () => {
		const oData: { roles: UserRole[] } = {
			roles: [] 
		};
		const oModel = new JSONModel(oData);
		return oModel;
	},

	createGridItemsModel: (component: any) => { 
		const i18nModel = component.getModel("i18n"); 
		// New method to create grid items model
        const gridItems = [
            { title: i18nModel.getResourceBundle().getText("userManagement"), imageSrc: "images/people-connected.svg" },
            { title: i18nModel.getResourceBundle().getText("goodsReceiptProcessing"), imageSrc: "images/people.svg" },
            { title: i18nModel.getResourceBundle().getText("deliveryManagement"), imageSrc: "images/shipping-status.svg" },
            { title: i18nModel.getResourceBundle().getText("invoiceManagement"), imageSrc: "images/convert-3d-cube.svg" },
            { title: i18nModel.getResourceBundle().getText("warehouseOperationsManagement"), imageSrc: "images/factory.svg" },
            { title: i18nModel.getResourceBundle().getText("reportingAndAnalytics"), imageSrc: "images/factory.svg" },
            { title: i18nModel.getResourceBundle().getText("purchaseOrderManagement"), imageSrc: "images/factory.svg" },
            { title: i18nModel.getResourceBundle().getText("inventoryManagement"), imageSrc: "images/add-product.svg" },
            { title: i18nModel.getResourceBundle().getText("paymentProcessing"), imageSrc: "images/people.svg" }
        ];
        const oModel = new JSONModel({ gridItems });
        return oModel;
    }
};
