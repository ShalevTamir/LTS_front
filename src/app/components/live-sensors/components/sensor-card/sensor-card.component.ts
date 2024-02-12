import { Component, Input, OnInit } from '@angular/core';
import { SensorState } from '../../../live-parameters/models/enums/sensor-state.enum';
import { IndicatorLightComponent } from "./components/indicator-light/indicator-light.component";
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-sensor-card',
    standalone: true,
    templateUrl: './sensor-card.component.html',
    styleUrl: './sensor-card.component.scss',
    imports: [IndicatorLightComponent, NgClass]
})
export class SensorCardComponent{
  @Input({required: true}) sensorName!: string
  @Input({required: true}) currentSensorState!: SensorState
  sensorStateEnum: typeof SensorState = SensorState;

  readableSensorState(sensorStateValue: SensorState){
    let strSensorState = SensorState[sensorStateValue]
    return strSensorState.charAt(0) + strSensorState.slice(1).toLocaleLowerCase();
  }

  updateSensorStatus(updatedSensorStatus: SensorState){
    this.currentSensorState = updatedSensorStatus;
  }
}
