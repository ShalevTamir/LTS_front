import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SensorState } from '../../../live-parameters/models/enums/sensor-state.enum';
import { IndicatorLightComponent } from "./components/indicator-light/indicator-light.component";
import { NgClass, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { normalizeString as normalizeStringInstance} from '../../../../common/utils/string-utils';
import { SensorHandlerService } from '../../../../common/services/sensor-handler.service';
import { SensorRequirementRos } from '../../../header/models/ros/sensor-requirement-ros';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
    selector: 'app-sensor-card',
    standalone: true,
    templateUrl: './sensor-card.component.html',
    styleUrl: './sensor-card.component.scss',
    imports: [IndicatorLightComponent, NgClass, MatIcon, MatIconButton, NgIf, MatProgressSpinnerModule]
})
export class SensorCardComponent implements OnInit{
  @Input({required: true}) sensorName!: string
  @Input({required: true}) currentSensorState!: SensorState
  // Emits the name of the sensor to delete
  @Output() deleteSensorEvent = new EventEmitter<string>();
  sensorStateEnum: typeof SensorState = SensorState;
  fetchingRequirements = true;

  constructor(private _sensorHandlerService: SensorHandlerService){}

  ngOnInit(): void {
    this._sensorHandlerService.fetchSensorRequirements(this.sensorName).then(() => {
      this.fetchingRequirements = false;
    });
  }

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

  displaySensorRequirements(){
    this._sensorHandlerService.displaySensorRequirements(this.sensorName);
  }
}
