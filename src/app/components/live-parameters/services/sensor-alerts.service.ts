import { Injectable } from '@angular/core';
import { SensorAlertsSocketService } from './sensor-alerts-socket.service';
import { SensorState } from '../models/enums/sensor-state.enum';
import { SensorAlertsRos } from '../models/ros/sensor-alert.ros';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { seperateString } from '../../../common/utils/string-utils';


@Injectable({
    providedIn: 'root'
})
export class SensorAlertsService{
    private readonly statusMessage: string = "Status:"
    
    constructor(
        private _sensorAlertsSocket: SensorAlertsSocketService,
        private _notificationsService: ToastrService
        ){}

    public async init(){
        await this._sensorAlertsSocket.initWebSocket(this.processAlert);
    }
    public async stopWebSocket(){
        await this._sensorAlertsSocket.stopWebSocket();
    }

    private processAlert = ({SensorName, CurrentStatus}: SensorAlertsRos) => {
        let parsedStatus = SensorState[CurrentStatus].charAt(0) + SensorState[CurrentStatus].substring(1).toLowerCase();
        let notificationArgs: [string, string, Partial<IndividualConfig<any>>] = [this.statusMessage+ " "+ parsedStatus, seperateString(SensorName, '_'), {positionClass: 'toast-bottom-right'}];
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