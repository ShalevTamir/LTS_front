import { Inject, Injectable } from "@angular/core";
import { AUTH_URL } from "../../constants";
import { UserModel } from "../../models/dtos/userModel";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { firstValueFrom, interval } from "rxjs";
import { SweetAlertsService } from "../sweet-alerts.service";
import { TOKEN_STORAGE_KEY } from "../../models/constants";
import { LOGIN_ROUTE } from "../../../app.routes";
import { Router } from "@angular/router";
import { RouterService } from "../router-service";
import { Tokens } from "../../models/dtos/tokens";
import { RequestsService } from "../network/requests.service";
import { TokensHandlerService } from "./tokens-handler.service";
import { ITOKEN_HANDLER_TOKEN, ITokensHandler } from "../../interfaces/ITokenHandler.interface";
import { isNullOrUndef } from "../../utils/helper";
import { ToastrService } from "ngx-toastr";

@Injectable({
    'providedIn': 'root'
})
export class AuthService{
    readonly REFRESH_DURATION_IN_MILLIS = 60_000;
    readonly MARGIN_TIME_IN_MILLIS = 10_000;
    readonly REFRESH_INTERVAL_TIME = this.REFRESH_DURATION_IN_MILLIS - this.MARGIN_TIME_IN_MILLIS;
    readonly LOGOUT_TIME = 90_000;
    private _logoutTimeout: NodeJS.Timeout | undefined;
    private _refreshTimeout: NodeJS.Timeout | undefined;
    constructor(
        private _requestsService: RequestsService,
        private _router: Router,
        private _routerService: RouterService,
        private _toastrService: ToastrService,
        @Inject(ITOKEN_HANDLER_TOKEN) private _tokensHandler: ITokensHandler){
    }

    public movementDetected(){
        if (this.isLoggedIn){
            this.startLogoutInterval();
        }
    }

    public async refreshTokenAsync(){
        const originalTokens = this._tokensHandler.getTokens();
        let responseResult = await this._requestsService.post<string>(AUTH_URL+"/tokens/refresh", originalTokens, {}, (error) => {throw error;});
        this._tokensHandler.saveTokens({
            accessToken: (responseResult.result as string),
            refreshToken: originalTokens.refreshToken
        });
    }

    public async loginAsync(username: string, password: string): Promise<boolean>{
        const userDto: UserModel = {
            Username: username,
            Password: password
        }
        let responseResult = await this._requestsService.post<Tokens>(
            AUTH_URL+"/authorization/login",
            userDto);

        if (responseResult.success){
            this._tokensHandler.saveTokens(responseResult.result as Tokens);
            this.startTokenIntervals();
            this._toastrService.clear();
        }
        return responseResult.success;
    }
    
    public logoutAsync = async () => {
        this.cancelTimeout(this._refreshTimeout);
        await this._requestsService.post(AUTH_URL+"/tokens/revoke", {});
        this.handleInvalidToken("You have been disconnected due to inactivity");
    }

    public async signUpAsync(username: string, password: string): Promise<boolean>{
        const userDto: UserModel = {
            Username: username,
            Password: password
        }
        let responseResult = await this._requestsService.post<string>(AUTH_URL+"/authorization/signup", userDto);
        if (responseResult.success){
            await this.loginAsync(username, password);
        }
        return responseResult.success;
    }

    
    public handleInvalidToken(errorMessage: string){
        if (!this._routerService.isCurrentUrl(this._router.url, LOGIN_ROUTE)){
            // this._swalService.errorAlert(errorMessage);
            this._toastrService.error(errorMessage, undefined, {disableTimeOut: true, positionClass: 'toast-bottom-right'});
            this._router.navigateByUrl(LOGIN_ROUTE);
        }
    }
    
    public async restrartTokenIntervalsAsync(){
        if (this.isLoggedIn){
            await this.refreshTokenAsync();
            this.startRefreshTokenInterval();
            this.startLogoutInterval();
        }
    }

    public get isLoggedIn(): boolean{
        return this._tokensHandler.hasTokens();
    }
    
    private startTokenIntervals(){
        this.startRefreshTokenInterval();
        this.startLogoutInterval();
    }
    
    private startLogoutInterval(){
        this.cancelTimeout(this._logoutTimeout);
        this._logoutTimeout = setTimeout(() => this.logoutAsync(), this.LOGOUT_TIME);
    }

    private cancelTimeout(timeout: NodeJS.Timeout | undefined){
        if(!isNullOrUndef(timeout)){
            clearTimeout(timeout);
        }
    }

    private startRefreshTokenInterval(){
        this._refreshTimeout = setTimeout(async () => {
            await this.refreshTokenAsync();
            this.startRefreshTokenInterval();
        }, this.REFRESH_INTERVAL_TIME);
    }
}