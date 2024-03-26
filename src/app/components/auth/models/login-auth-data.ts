import { LOGIN_ROUTE, SIGNUP_ROUTE } from "../../../app.routes";
import { AuthData } from "./auth-data";
import { AuthMode } from "./enums/auth-mode";
import { SignUpAuthData } from "./signup-auth-data";

export class LoginAuthData extends AuthData{
    public override getButtonText(): string {
        return "Login"
    }

    public override redirectTo(): AuthMode {
        return AuthMode.SIGNUP;
    }

    public override getUrl(): string {
        return LOGIN_ROUTE;
    }

    public override getRedirectText(): string {
        return "Doesn't have a user?";
    }

    public override getRedirectButtonText(): string {
        return "Sign up";
    }

    public override getAuthMode(): AuthMode {
        return AuthMode.LOGIN;
    }
}