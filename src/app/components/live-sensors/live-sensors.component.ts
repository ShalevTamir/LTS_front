import { Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SensorCardComponent } from "./components/sensor-card/sensor-card.component";
import { SensorHandlerService } from '../../common/services/sensor-handler.service';
import { SensorAlertsRos } from '../live-parameters/models/ros/sensor-alert.ros';
import { NgFor, NgIf } from '@angular/common';
import { SensorAlertsSocketService } from '../live-parameters/services/sensor-alerts-socket.service';
import { RangeRequirementRos } from '../header/models/ros/range-requirement-ros';
import { AdditionalSensorRequirementRos } from '../../common/models/ros/additional-sensor-requirement-ros';
import { DurationType } from '../header/models/enums/duration-type';
import { DeleteSensorsService } from '../../common/services/delete-sensors.service';
import { HubConnection } from '@microsoft/signalr';
import detectElementOverflow from 'detect-element-overflow';

@Component({
    selector: 'app-live-sensors',
    standalone: true,
    templateUrl: './live-sensors.component.html',
    styleUrl: './live-sensors.component.scss',
    imports: [SensorCardComponent, NgFor, NgIf]
})
export class LiveSensorsComponent implements OnInit, OnDestroy{
    @ViewChildren(SensorCardComponent) sensors!: QueryList<SensorCardComponent>;
    sensorStates: SensorAlertsRos[] = [];
    hasSensors: boolean = true;
    private _socketConnection: HubConnection | undefined;

    constructor(private _sensorHandlerService: SensorHandlerService, private _sensorAlertsSocketService: SensorAlertsSocketService, private _elementRef: ElementRef){}
    
    ngOnInit(): void {
        this._sensorHandlerService.getSensorsStateAsync().then((sensorStates: SensorAlertsRos[]) => {
            this.sensorStates = sensorStates;
            this.updateHasSesnors();
        })
        this._sensorAlertsSocketService.initWebSocketAsync(this.processSensorUpdate).then(res => this._socketConnection = res);
    }
    
    ngOnDestroy(): void {
        this._sensorAlertsSocketService.stopWebSocketAsync(this._socketConnection);
    }

    processSensorUpdate = (alert: SensorAlertsRos) => {
        this.sensors.find((sensor) => sensor.sensorName == alert.SensorName)?.updateSensorStatus(alert.CurrentStatus);
    }

    async deleteSensorAsync(sensorName: string){
        await this._sensorHandlerService.removeDynamicSensorAsync(sensorName);
        this.sensorStates = this.sensorStates.filter((sensorState) => sensorState.SensorName != sensorName)
        this.updateHasSesnors();
    }

    updateHasSesnors(){
        this.hasSensors = this.sensorStates.length !== 0;
    }

}
