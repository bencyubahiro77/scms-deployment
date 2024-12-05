import BaseController from "../BaseController";

export default class ViewAllInventory extends BaseController {

    public onRetryPress(): void {
        window.history.back();
        setTimeout(()=>{
            location.reload();
        },500)
    }

    public onNavigateCreateProduct(): void {
        this.getRouter().navTo("createProductInfo")
    }
}