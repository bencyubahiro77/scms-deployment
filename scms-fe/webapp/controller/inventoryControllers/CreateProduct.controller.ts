import BaseController from "../BaseController";

/**
 * @namespace scms.frontend.controller
 */

export default class CreateProduct extends BaseController {
    //
    public onCreateProductPrice(): void {
        this.getRouter().navTo("createProductPrice")
    }

    public onNavBackProductTable(): void {
        this.getRouter().navTo("inventory")
    }

    public onNavigateCreateProduct(): void {
        this.getRouter().navTo("createProductInfo")
    }
}