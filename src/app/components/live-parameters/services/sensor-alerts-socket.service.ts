import { Injectable } from "@angular/core";
import { SocketHandlerService } from "../../../common/utils/socket-connection/socket-handler.service";
import { SensorState } from "../models/enums/sensor-state.enum";
import { SensorAlertsRos } from "../models/ros/sensor-alert.ros";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { LIVE_TELE_URL } from "../../../common/constants";
import { HubListener } from "../../../common/models/hub-listener";

@Injectable({
    providedIn: 'root'
})
export class SensorAlertsSocketService{
    constructor(private _socketHandlerService: SocketHandlerService) { }
    private _connection: HubConnection | undefined;


    public async initWebSocket(alertCallback: (alert: SensorAlertsRos, sensorState: SensorState) => void){
        let listener: HubListener = {
            listenerName: 'receiveAlerts',
            callback: alertCallback
        };
        this._connection = await this._socketHandlerService.initWebSocketAsync(LIVE_TELE_URL+"/sensor-alerts-socket",[listener]);        
    }

    public async stopWebSocket(){
        await this._connection?.stop();
    }

}