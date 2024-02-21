import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SensorCardComponent } from "./components/sensor-card/sensor-card.component";
import { SensorHandlerService } from '../../common/services/sensor-handler.service';
import { SensorAlertsRos } from '../live-parameters/models/ros/sensor-alert.ros';
import { NgFor } from '@angular/common';
import { SensorAlertsSocketService } from '../live-parameters/services/sensor-alerts-socket.service';
import { RangeRequirementRos } from '../header/models/ros/range-requirement-ros';
import { SensorRequirementRos } from '../header/models/ros/sensor-requirement-ros';
import { DurationType } from '../header/models/enums/duration-type';

@Component({
    selector: 'app-live-sensors',
    standalone: true,
    templateUrl: './live-sensors.component.html',
    styleUrl: './live-sensors.component.scss',
    imports: [SensorCardComponent, NgFor]
})
export class LiveSensorsComponent implements OnInit, OnDestroy{
    @ViewChildren(SensorCardComponent) sensors!: QueryList<SensorCardComponent>;
    sensorStates: SensorAlertsRos[] = [];

    constructor(private _sensorHandlerService: SensorHandlerService, private _sensorAlertsSocketService: SensorAlertsSocketService){}
    
    ngOnInit(): void {
        this._sensorHandlerService.getSensorsState().then((sensorStates: SensorAlertsRos[]) => {
            this.sensorStates = sensorStates;
        })
        this._sensorAlertsSocketService.initWebSocket(this.processSensorUpdate)
    }
    
    ngOnDestroy(): void {
        this._sensorAlertsSocketService.stopWebSocket();
    }

    processSensorUpdate = (alert: SensorAlertsRos) => {
        this.sensors.find((sensor) => sensor.sensorName == alert.SensorName)?.updateSensorStatus(alert.CurrentStatus);
    }

}
