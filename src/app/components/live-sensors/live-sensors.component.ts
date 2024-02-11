import { Component, OnInit } from '@angular/core';
import { SensorCardComponent } from "./components/sensor-card/sensor-card.component";
import { SensorHandlerService } from '../../common/services/sensor-handler.service';
import { SensorAlertsRos } from '../live-parameters/models/ros/sensor-alert.ros';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-live-sensors',
    standalone: true,
    templateUrl: './live-sensors.component.html',
    styleUrl: './live-sensors.component.scss',
    imports: [SensorCardComponent, NgFor]
})
export class LiveSensorsComponent implements OnInit{
    sensorStates: SensorAlertsRos[] = []

    constructor(private _sensorHandlerService: SensorHandlerService){}
  
    ngOnInit(): void {
        this._sensorHandlerService.getSensorsState().then((sensorStates: SensorAlertsRos[]) => {
            this.sensorStates = sensorStates;
        })
    }

}
