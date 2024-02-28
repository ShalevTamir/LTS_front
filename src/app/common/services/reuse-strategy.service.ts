import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from "@angular/router";
import { TELE_PARAMS_ROUTE } from "../../app.routes";

@Injectable({
    providedIn: 'root'
})
export class ReuseStrategy extends RouteReuseStrategy{
    private readonly _routesToReuse: string[] = [TELE_PARAMS_ROUTE];
    private _storedRoutes = new Map<string, DetachedRouteHandle>();

    override shouldDetach(route: ActivatedRouteSnapshot): boolean {
        const path: string | undefined = route.routeConfig?.path;
        return path !== undefined && this._routesToReuse.includes(path)
    }
    override store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
        this._storedRoutes.set(route.routeConfig?.path as string, handle as DetachedRouteHandle);
    }
    override shouldAttach(route: ActivatedRouteSnapshot): boolean {
        const path: string | undefined = route.routeConfig?.path;
        return path !== undefined && this._storedRoutes.has(path);
    }
    override retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        const path: string | undefined = route.routeConfig?.path;
        return this._storedRoutes.get(path as string) as DetachedRouteHandle;
    }
    override shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }

}