import { HttpClient, HttpContext, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, firstValueFrom, throwError } from "rxjs";
import { SweetAlertsService } from "../sweet-alerts.service";
import { isNullOrUndef } from "../../utils/helper";

declare type HttpErrorCallback = (error: HttpErrorResponse) => void;

interface ResponseResult<T>{
    result?: T;
    success: boolean;
}

interface HttpClientOptions {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    context?: HttpContext;
    observe?: 'body';
    params?: HttpParams | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
    transferCache?: {
        includeHeaders?: string[];
    } | boolean;
}

@Injectable({
    providedIn: 'root'
})
export class RequestsService{
    constructor(private _httpClient: HttpClient, private _swalService: SweetAlertsService){
    }

    // True on success and False on exception
    private async catchHttpExceptionAsync<T>(request: Observable<T>, errorCallback?: HttpErrorCallback): Promise<ResponseResult<T>>{
        try{
            let res = await firstValueFrom(request);
            return {
                result: res,
                success: true
            };
        }
        catch (e){
            if(e instanceof HttpErrorResponse){
                if (!isNullOrUndef(errorCallback)){
                    (errorCallback as HttpErrorCallback)(e);
                }
            }
            return {
                success: false
            }
        }
    }

    async get<T>(
        url: string,
        options?: HttpClientOptions,
        errorCallback?: HttpErrorCallback): Promise<ResponseResult<T>>{
        return await this.catchHttpExceptionAsync(this._httpClient.get<T>(url, options), errorCallback);
    }

    async post<T = Object>(
        url: string,
        body: any | null,
        options?: HttpClientOptions,
        errorCallback?: HttpErrorCallback): Promise<ResponseResult<T>>{
        return await this.catchHttpExceptionAsync(this._httpClient.post<T>(url, body, options), errorCallback);
    }
}