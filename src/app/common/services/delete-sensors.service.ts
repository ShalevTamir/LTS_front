import { EventEmitter, Injectable } from "@angular/core";

@Injectable({
    'providedIn': 'root'
})
export class DeleteSensorsService{
    toggleStateEmitter = new EventEmitter<void>();
    public notifyChange(){
        this.toggleStateEmitter.emit();
    }
    public addStateChangeListener(callback: () => void){
        this.toggleStateEmitter.subscribe(callback);
    }
}