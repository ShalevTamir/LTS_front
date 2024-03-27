import { AuthMode } from "./enums/auth-mode";

export abstract class AuthData{
    public abstract getButtonText(): string;
    public abstract redirectTo(): AuthMode;
    public abstract getUrl(): string;
    public abstract getRedirectText(): string;
    public abstract getRedirectButtonText(): string;
    public abstract getAuthMode(): AuthMode;
}