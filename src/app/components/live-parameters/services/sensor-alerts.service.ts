import { Injectable } from '@angular/core';
import { SensorAlertsSocketService } from './sensor-alerts-socket.service';
import { SensorState } from '../models/enums/sensor-state.enum';
import { SensorAlertsRos } from '../models/ros/sensor-alert.ros';
import { ToastrService } from 'ngx-toastr';


@Injectable({
    providedIn: 'root'
})
export class SensorAlertsService{
    private readonly statusMessage: string = "Status:"
    
    constructor(
        private _sensorAlertsSocket: SensorAlertsSocketService,
        private _notificationsService: ToastrService
        ){ }

    public init(){
        this._sensorAlertsSocket.initWebSocket(this.processAlert);
    }

    private processAlert = ({SensorName, CurrentStatus}: SensorAlertsRos) => {
        console.log(SensorName, CurrentStatus);
        let parsedStatus = SensorState[CurrentStatus].charAt(0) + SensorState[CurrentStatus].substring(1).toLowerCase();
        let notificationArgs = [SensorName, "Status: "+ parsedStatus];
        switch( CurrentStatus ){
            case SensorState.VALID:
                this._notificationsService.success(...notificationArgs);
                break;
            case SensorState.NORMAL:
                this._notificationsService.warning(...notificationArgs);
                break;
            case SensorState.INVALID:
                this._notificationsService.error(...notificationArgs);
                break;
            case SensorState.NEUTRAL:
                this._notificationsService.info(...notificationArgs);
                break;
           
        }
    }

    
}