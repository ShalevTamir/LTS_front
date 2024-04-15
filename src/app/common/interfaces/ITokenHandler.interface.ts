import { InjectionToken } from "@angular/core";
import { Tokens } from "../models/dtos/tokens";
import { TokensHandlerService } from "../services/auth/tokens-handler.service";


export const ITOKEN_HANDLER_TOKEN = new InjectionToken<ITokensHandler>('ITokenHandler', {
    providedIn: 'root',
    factory: () => new TokensHandlerService()
});

export interface ITokensHandler{
    getTokens: () => Tokens
    hasTokens: () => boolean
    saveTokens: (tokens: Tokens) => void
    removeTokens: () => boolean
}