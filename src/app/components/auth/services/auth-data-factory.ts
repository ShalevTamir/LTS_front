import { Injectable } from "@angular/core";
import { AuthData } from "../models/auth-data";
import { AuthMode } from "../models/enums/auth-mode";
import { LoginAuthData } from "../models/login-auth-data";
import { SignUpAuthData } from "../models/signup-auth-data";

@Injectable({
    providedIn: 'root'
})
export class AuthDataFactory{
    public createAuthData(mode: AuthMode): AuthData{
        switch (mode){
            case AuthMode.LOGIN:
                return new LoginAuthData();
            case AuthMode.SIGNUP:
                return new SignUpAuthData();
        }
    }
}