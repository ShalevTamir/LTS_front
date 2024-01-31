import { Injectable } from "@angular/core";
import { SocketHandlerService } from "../../../common/utils/socket-connection/socket-handler.service";
import { SensorState } from "../models/enums/sensor-state.enum";
import { SensorAlertsRos } from "../models/ros/sensor-alert.ros";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { LIVE_TELE_URL } from "../../../common/constants";

@Injectable({
    providedIn: 'root'
})
export class SensorAlertsSocketService{
    constructor(private _socketHandlerService: SocketHandlerService) { }
    private _connection: HubConnection | undefined;


    public async initWebSocket(alertCallback: (alert: SensorAlertsRos, sensorState: SensorState) => void){
        this._connection??= this._socketHandlerService.initWebSocket(LIVE_TELE_URL+"/sensor-alerts-socket",[
            {
                listenerName: 'receiveAlerts',
                callback: alertCallback
            }
        ]);
        if (this._connection.state === HubConnectionState.Disconnected){
            await this._connection.start();
        }
    }

    public async stopWebSocket(){
        this._connection?.stop();
    }

}