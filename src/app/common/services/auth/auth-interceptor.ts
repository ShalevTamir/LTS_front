import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from "@angular/common/http";
import { Observable, catchError, map } from "rxjs";
import { TOKEN_STORAGE_KEY } from "../../models/constants";
import { SweetAlertsService } from "../sweet-alerts.service";
import { Router } from "@angular/router";
import { LOGIN_ROUTE } from "../../../app.routes";
import { AuthService } from "./auth.service";
import { Tokens } from "../../models/dtos/tokens";
import { Inject } from "@angular/core";
import { TokensHandlerService } from "./tokens-handler.service";
import { ITOKEN_HANDLER_TOKEN, ITokensHandler } from "../../interfaces/ITokenHandler.interface";

export class AuthInterceptor implements HttpInterceptor{
    constructor(
        private _authService: AuthService,
        @Inject(ITOKEN_HANDLER_TOKEN) private _tokensHandler: ITokensHandler
    ){}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this._tokensHandler.hasTokens()){
            const tokens: Tokens = this._tokensHandler.getTokens();
            req = req.clone({
                headers: req.headers.set("Authorization", "Bearer " + tokens.accessToken)
            });
        }
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === HttpStatusCode.Forbidden || error.status === HttpStatusCode.Unauthorized){
                    this._authService.handleInvalidToken(this._authService.LOGOUT_MESSAGE);
                }
                throw error;
            })
        );
    }
}