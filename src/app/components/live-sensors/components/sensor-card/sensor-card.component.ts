import { Component, Input, OnInit } from '@angular/core';
import { SensorState } from '../../../live-parameters/models/enums/sensor-state.enum';

@Component({
  selector: 'app-sensor-card',
  standalone: true,
  imports: [],
  templateUrl: './sensor-card.component.html',
  styleUrl: './sensor-card.component.scss'
})
export class SensorCardComponent{
  @Input({required: true}) sensorName!: string
  @Input({required: true}) currentSensorState!: SensorState

  readableSensorState(sensorStateValue: SensorState){
    let strSensorState = SensorState[sensorStateValue]
    return strSensorState.charAt(0) + strSensorState.slice(1).toLocaleLowerCase();
  }
}
