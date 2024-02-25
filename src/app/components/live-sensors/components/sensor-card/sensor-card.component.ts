import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SensorState } from '../../../live-parameters/models/enums/sensor-state.enum';
import { IndicatorLightComponent } from "./components/indicator-light/indicator-light.component";
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { normalizeString as normalizeStringInstance} from '../../../../common/utils/string-utils';

@Component({
    selector: 'app-sensor-card',
    standalone: true,
    templateUrl: './sensor-card.component.html',
    styleUrl: './sensor-card.component.scss',
    imports: [IndicatorLightComponent, NgClass, MatIcon, MatIconButton]
})
export class SensorCardComponent{
  @Input({required: true}) sensorName!: string
  @Input({required: true}) currentSensorState!: SensorState
  // Emits the name of the sensor to delete
  @Output() deleteSensorEvent = new EventEmitter<string>();
  sensorStateEnum: typeof SensorState = SensorState;
  
  normalizeString = normalizeStringInstance

  readableSensorState(sensorStateValue: SensorState){
    let strSensorState = SensorState[sensorStateValue]
    return strSensorState.charAt(0) + strSensorState.slice(1).toLocaleLowerCase();
  }

  updateSensorStatus(updatedSensorStatus: SensorState){
    this.currentSensorState = updatedSensorStatus;
  }

  deleteSensor(){
    this.deleteSensorEvent.emit(this.sensorName);
  }
}
