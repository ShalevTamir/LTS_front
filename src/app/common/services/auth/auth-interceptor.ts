import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { TOKEN_STORAGE_KEY } from "../../models/constants";

export class AuthInterceptor implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (token){
            req = req.clone({
                headers: req.headers.set("Authorization", "Bearer " + token)
            });
        }
        return next.handle(req);
    }
}