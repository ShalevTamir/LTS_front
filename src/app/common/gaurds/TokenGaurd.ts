import { CanActivateFn, Router } from "@angular/router";
import { TOKEN_STORAGE_KEY } from "../models/constants";
import { isNullOrUndef } from "../utils/helper";
import { SweetAlertsService } from "../services/sweet-alerts.service";
import { inject } from "@angular/core";
import { LOGIN_ROUTE } from "../../app.routes";

export const tokenGaurd: CanActivateFn = () => {
    const swalService = inject(SweetAlertsService);
    const router = inject(Router);
    if (isNullOrUndef(localStorage.getItem(TOKEN_STORAGE_KEY))){
        swalService.errorAlert("You must login before accessing this page");
        router.navigateByUrl(LOGIN_ROUTE);
        return false;
    }
    return true;
}