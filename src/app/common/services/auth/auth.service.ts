import { Injectable } from "@angular/core";
import { AUTH_URL } from "../../constants";
import { UserModel } from "../../models/dtos/userModel";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { SweetAlertsService } from "../sweet-alerts.service";
import { TOKEN_STORAGE_KEY } from "../../models/constants";

@Injectable({
    'providedIn': 'root'
})
export class AuthService{
    constructor(private _httpClient: HttpClient, private _swalService: SweetAlertsService){

    }

    public async loginAsync(username: string, password: string): Promise<boolean>{
        const userDto: UserModel = {
            Username: username,
            Password: password
        }
        let reqRes = firstValueFrom(this._httpClient.post<string>(AUTH_URL+"/authorization/login", userDto));
        let jwtToken: string = "";
        try{
            jwtToken = await reqRes;
        }
        catch(e){
            if (e instanceof HttpErrorResponse){
                this._swalService.errorAlert(e.error);
                return false;
            }
        }
        localStorage.setItem(TOKEN_STORAGE_KEY, jwtToken);
        return true;
    }

    public async signUpAsync(username: string, password: string): Promise<boolean>{
        const userDto: UserModel = {
            Username: username,
            Password: password
        }
        let reqRes = firstValueFrom(this._httpClient.post<string>(AUTH_URL+"/authorization/signup", userDto));
        try{
            await reqRes;
        }
        catch(e){
            if (e instanceof HttpErrorResponse){
                this._swalService.errorAlert(e.error);
                return false;
            }
        }
        await this.loginAsync(username, password);
        return true;
    }
    
    
}