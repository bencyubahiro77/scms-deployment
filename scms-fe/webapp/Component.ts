import BaseComponent from "sap/ui/core/UIComponent";
import models from "./model/models";
import Device from "sap/ui/Device";

/**
 * @namespace scmsfe
 */
export default class Component extends BaseComponent {

	public static metadata = {
		manifest: "json",
        interfaces: [
            "sap.ui.core.IAsyncContentCreation"
        ]
	};

    private contentDensityClass: string;

	public init() : void {
		// call the base component's init function
		super.init();

        // set the device model
        this.setModel(models.createDeviceModel(), "device");
        this.setModel(models.createSelectModel(), "selectModel");
		this.setModel(models.createUserModel(), "userModel");
		this.setModel(models.createProfileModel(), "profileModel");
		this.setModel(models.getUserRoleModel(), "userRoleModel");
		this.setModel(models.createGridItemsModel(this), "gridItemsModel");

        // enable routing
        this.getRouter().initialize();
	}

    public getContentDensityClass(): string {
		if (this.contentDensityClass === undefined) {
			// check whether FLP has already set the content density class; do nothing in this case
			if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
				this.contentDensityClass = "";
			} else if (!Device.support.touch) {
				// apply "compact" mode if touch is not supported
				this.contentDensityClass = "sapUiSizeCompact";
			} else {
				// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
				this.contentDensityClass = "sapUiSizeCozy";
			}
		}
		return this.contentDensityClass;
	}
}