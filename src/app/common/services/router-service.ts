import { Injectable } from "@angular/core";
import { NavigationStart, Route, RouteConfigLoadEnd, Router, RouterEvent, RoutesRecognized } from "@angular/router";
import { BehaviorSubject, Observable, filter } from "rxjs";
import { DYNAMIC_SENSORS_ROUTE, TELE_PARAMS_ROUTE, routes } from "../../app.routes";
import { isNullOrUndef } from "../utils/helper";

@Injectable({
    providedIn: 'root'
})
export class RouterService{
    private readonly _pageRoutesToTrack = [TELE_PARAMS_ROUTE, DYNAMIC_SENSORS_ROUTE];
    private _pagesToTrack = new Map<string, BehaviorSubject<boolean>>();

    constructor(private _router: Router){
        this._pageRoutesToTrack.forEach(route => this.registerPageToTrack(route));

        this.detectRouterEvents(RoutesRecognized).subscribe((event: RouterEvent) => {
            this._pageRoutesToTrack.forEach(route => {
                this.updatePageState(route, this.isCurrentUrl(event.url, route));
            })
        })
    }
    
    public isPageLoaded(route: string): Observable<boolean>{
        if (!this._pagesToTrack.has(route)){
            throw new Error("Trying to track route " + route + "but it isn't registered in the routes to track");
        }
        return (this._pagesToTrack.get(route) as BehaviorSubject<boolean>).asObservable();
    }

    private registerPageToTrack(route: string){
        this._pagesToTrack.set(route, new BehaviorSubject(false));
    }

    private updatePageState(route: string, value: boolean){
        if (this._pagesToTrack.has(route)){
            if (this._pagesToTrack.get(route)?.value != value){
                this._pagesToTrack.get(route)?.next(value);
            }
        }
    }

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

    public get currentUrl(){
        return this._router.url;
    }
}