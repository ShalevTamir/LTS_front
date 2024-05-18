import { Injectable } from '@angular/core';
import { SensorAlertsSocketService } from './sensor-alerts-socket.service';
import { SensorState } from '../models/enums/sensor-state.enum';
import { SensorAlertsRos } from '../models/ros/sensor-alert.ros';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { seperateString } from '../../../common/utils/string-utils';
import { HubConnection } from '@microsoft/signalr';
import { MenuStateHandler } from '../../../common/services/menu-state-handler.service';


@Injectable({
    providedIn: 'root'
})
export class SensorAlertsService{
    private readonly statusMessage: string = "Status:"
    private _connection!: HubConnection;
    private _isMenuOpen: boolean = false;

    constructor(
        private _sensorAlertsSocket: SensorAlertsSocketService,
        private _notificationsService: ToastrService,
        menuStateHandler: MenuStateHandler
        ){
            menuStateHandler.getMenuStates().subscribe(menuState => {
                if (menuState){
                    _notificationsService.toasts.forEach(activeToast => activeToast.toastRef.close());
                }
                this._isMenuOpen = menuState;
            });
        }

    public async init(){
        this._connection = await this._sensorAlertsSocket.initWebSocketAsync(this.processAlert);
    }
    public async stopWebSocket(){
        await this._sensorAlertsSocket.stopWebSocketAsync(this._connection);
    }

    private processAlert = ({SensorName, CurrentStatus}: SensorAlertsRos) => {
        let parsedStatus = SensorState[CurrentStatus].charAt(0) + SensorState[CurrentStatus].substring(1).toLowerCase();
        let notificationArgs: [string, string, Partial<IndividualConfig<any>>] = [this.statusMessage+ " "+ parsedStatus, seperateString(SensorName, '_'), {positionClass: this.getToastrPosition()}];
        switch( CurrentStatus ){
            case SensorState.VALID:
                this._notificationsService.success(...notificationArgs);
                break;
            case SensorState.WARNING:
                this._notificationsService.warning(...notificationArgs);
                break;
            case SensorState.INVALID:
                this._notificationsService.error(...notificationArgs);
                break;
            case SensorState.NORMAL:
                this._notificationsService.info(...notificationArgs);
                break;
           
        }
    }

    private getToastrPosition(){
        return this._isMenuOpen ? 'toast-bottom-left' : 'toast-bottom-right';
    }


    
}