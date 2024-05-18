import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MenuStateHandler{
    private _isMenuOpen: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public updateMenuState(menuState: boolean){
        this._isMenuOpen.next(menuState);
    }

    public getMenuStates(): Observable<boolean>{
        return this._isMenuOpen.asObservable();
    }
}