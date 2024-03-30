import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from "@angular/common/http";
import { Observable, catchError, map } from "rxjs";
import { TOKEN_STORAGE_KEY } from "../../models/constants";
import { SweetAlertsService } from "../sweet-alerts.service";
import { Router } from "@angular/router";
import { LOGIN_ROUTE } from "../../../app.routes";

export class AuthInterceptor implements HttpInterceptor{
    constructor(private _swalService: SweetAlertsService, private _router: Router){}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (token){
            req = req.clone({
                headers: req.headers.set("Authorization", "Bearer " + token)
            });
        }
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === HttpStatusCode.Forbidden || error.status === HttpStatusCode.Unauthorized){
                    this._swalService.errorAlert(error.error);
                    this._router.navigateByUrl(LOGIN_ROUTE);
                }
                throw error;
            })
        );
    }
}