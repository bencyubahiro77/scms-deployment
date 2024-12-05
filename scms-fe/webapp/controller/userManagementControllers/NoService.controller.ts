import BaseController from "../BaseController";

export default class NoService extends BaseController {

    public onRetryPress(): void {
        window.history.back();
        // setTimeout(()=>{
        //     location.reload();
        // },500)
    }
}