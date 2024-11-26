import ResourceBundle from "sap/base/i18n/ResourceBundle";
import BaseController from "./BaseController";

export default class Dashboard extends BaseController {

public onInit(): void {
    
}

// public onTilePress(oEvent: any): void {
//     this.getRouter().navTo("allUsers");
// }

public async onTilePress(oEvent: any): Promise<void> {
    const title = oEvent.getSource().getBindingContext("gridItemsModel").getProperty("title");
	const resourceBundle: ResourceBundle = await this.getResourceBundle();

    if (title === resourceBundle.getText("userManagement")) {
        this.getRouter().navTo("allUsers");
    } else {
        this.getRouter().navTo("underConstruction");
    }
}
}
