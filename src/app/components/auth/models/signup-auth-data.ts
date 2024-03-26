import { LOGIN_ROUTE, SIGNUP_ROUTE } from "../../../app.routes";
import { AuthData } from "./auth-data";
import { AuthMode } from "./enums/auth-mode";
import { LoginAuthData } from "./login-auth-data";

export class SignUpAuthData extends AuthData{
    public override getButtonText(): string {
        return "Sign Up"
    }

    public override redirectTo(): AuthMode {
        return AuthMode.LOGIN;
    }

    public override getUrl(): string {
        return SIGNUP_ROUTE;
    }

    public override getRedirectText(): string {
        return "Doesn't have a user";    
    }

    public override getRedirectButtonText(): string {
        return "Login";
    }

    public override getAuthMode(): AuthMode {
        return AuthMode.SIGNUP;
    }
}