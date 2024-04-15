import { Injectable } from "@angular/core";
import { Tokens } from "../../models/dtos/tokens";
import { isNullOrUndef } from "../../utils/helper";
import { TOKEN_STORAGE_KEY } from "../../models/constants";

@Injectable({
    providedIn: 'root'
})
export class TokensHandlerService{
    public getTokens(): Tokens{
        let tokens: Tokens;
        if (!this.hasTokens()){
            tokens = {
                accessToken: "",
                refreshToken: ""
            };
        }
        else{
            const jTokens: string | null = localStorage.getItem(TOKEN_STORAGE_KEY);
            tokens = JSON.parse(jTokens as string);
        }
        return tokens;
    }
    public hasTokens(): boolean{
        return !isNullOrUndef(localStorage.getItem(TOKEN_STORAGE_KEY));
    }
    public saveTokens(tokens: Tokens): void{
        localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens))
    }
    public removeTokens(): boolean{
        if (!this.hasTokens()){
            return false;
        }
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        return true;
    }
    
}