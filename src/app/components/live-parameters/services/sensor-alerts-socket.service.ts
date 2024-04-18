import { Injectable } from "@angular/core";
import { SocketHandlerService } from "../../../common/utils/socket-connection/socket-handler.service";
import { SensorState } from "../models/enums/sensor-state.enum";
import { SensorAlertsRos } from "../models/ros/sensor-alert.ros";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { LIVE_TELE_URL } from "../../../common/constants";
import { HubListener } from "../../../common/models/hub-listener";
import { isNullOrUndef } from "../../../common/utils/helper";

@Injectable({
    providedIn: 'root'
})
export class SensorAlertsSocketService{
    constructor(private _socketHandlerService: SocketHandlerService) { }


    public async initWebSocketAsync(alertCallback: (alert: SensorAlertsRos, sensorState: SensorState) => void): Promise<HubConnection>{
        let listener: HubListener = {
            listenerName: 'receiveAlerts',
            callback: alertCallback
        };
        return await this._socketHandlerService.initWebSocketAsync(LIVE_TELE_URL+"/sensor-alerts-socket",[listener]);        
    }

    public async stopWebSocketAsync(connection: HubConnection | undefined){
        if (!isNullOrUndef(connection))
            await (connection as HubConnection).stop();
    }

}