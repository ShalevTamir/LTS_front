import { Injectable } from "@angular/core";
import { SocketHandlerService } from "../../../common/utils/socket-connection/socket-handler.service";
import { SensorState } from "../models/enums/sensor-state.enum";
import { SensorAlertsRos } from "../models/ros/sensor-alert.ros";

@Injectable({
    providedIn: 'root'
})
export class SensorAlertsSocketService{
    constructor(private _socketHandlerService: SocketHandlerService) { }
    private readonly SERVER_URL: string = "https://localhost:5002";

    public async initWebSocket(alertCallback: (alert: SensorAlertsRos, sensorState: SensorState) => void){
        await this._socketHandlerService.initWebSocket(this.SERVER_URL+"/sensor-alerts-socket",[
            {
                listenerName: 'receiveAlerts',
                callback: alertCallback
            }
        ]);
    }

}