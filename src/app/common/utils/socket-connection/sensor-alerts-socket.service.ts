import { Injectable } from "@angular/core";
import { SocketHandlerService } from "./socket-handler.service";

@Injectable({
    providedIn: 'root'
})
export class SensorAlertsSocketService{
    constructor(private _socketHandlerService: SocketHandlerService) { }
    private readonly SERVER_URL: string = "https://localhost:5002";

    public async initWebSocket(){
        await this._socketHandlerService.initWebSocket(this.SERVER_URL+"/sensor-alerts-socket",[
            {
                listenerName: 'receiveAlerts',
                callback: (alert: string) => {console.log(alert);}
            }
        ]);
    }

}