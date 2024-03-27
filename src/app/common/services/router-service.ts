import { Injectable } from "@angular/core";
import { NavigationStart, RouteConfigLoadEnd, Router, RouterEvent, RoutesRecognized } from "@angular/router";
import { Observable, filter } from "rxjs";
import { routes } from "../../app.routes";

@Injectable({
    providedIn: 'root'
})
export class RouterService{
    constructor(private _router: Router){}

    public detectUrls(urls: string[]){
        return this._router.events.pipe(
            filter(
                event => 
                event instanceof RoutesRecognized && this.isCurrentUrl(event.url, ...urls)
                ));
    }

    public detectRouterEvents<T extends RouterEvent>(...routerEvents:{ new (...args: any[]) : T }[]): Observable<RouterEvent>{
        return this._router.events.pipe(
            filter(
                event =>{
                    for (let routerEvent of routerEvents){
                        if (event instanceof routerEvent){
                            return true;
                        }
                    }
                    return false;
                }
            )
        ) as Observable<RouterEvent>
    }

    public isCurrentUrl(currentUrl: string, ...urls: string[]){
        return urls.some(url => "/" + url === currentUrl);
    }

    public isRouteRecognized(currentUrl: string){
        return routes.some(route => '/' + route.path === currentUrl);
    }
}