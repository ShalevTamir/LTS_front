import { Injectable } from "@angular/core";
import { AUTH_URL } from "../../constants";
import { UserModel } from "../../models/dtos/userModel";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { SweetAlertsService } from "../sweet-alerts.service";

@Injectable({
    'providedIn': 'root'
})
export class AuthService{
    constructor(private _httpClient: HttpClient, private _swalService: SweetAlertsService){

    }

    public async authenticateUserAsync(username: string, password: string){
        const userDto: UserModel = {
            Username : username,
            Password : password
        }
        let reqRes = firstValueFrom(this._httpClient.post<string>(AUTH_URL+"/authorization/login", userDto));
        let jwtToken: string = "";
        try{
            jwtToken = await reqRes;
        }
        catch(e){
            if (e instanceof HttpErrorResponse){
                this._swalService.errorAlert(e.error);
                return;
            }
        }
        localStorage.setItem('token', jwtToken);
    }
    
    
}