import { CanActivateFn, Router } from "@angular/router";
import { TOKEN_STORAGE_KEY } from "../models/constants";
import { isNullOrUndef } from "../utils/helper";
import { SweetAlertsService } from "../services/sweet-alerts.service";
import { inject } from "@angular/core";
import { LOGIN_ROUTE } from "../../app.routes";
import { AuthService } from "../services/auth/auth.service";
import { TokensHandlerService } from "../services/auth/tokens-handler.service";
import { ITOKEN_HANDLER_TOKEN } from "../interfaces/ITokenHandler.interface";

export const tokenGaurd: CanActivateFn = () => {
    const authService = inject(AuthService);
    const tokensHandler = inject(ITOKEN_HANDLER_TOKEN);
    if (!tokensHandler.hasTokens()){
        authService.handleInvalidToken("You must login before accessing this page");
        return false;
    }
    return true;
}