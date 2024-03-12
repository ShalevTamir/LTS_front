import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SensorState } from '../../../live-parameters/models/enums/sensor-state.enum';
import { IndicatorLightComponent } from "./components/indicator-light/indicator-light.component";
import { NgClass, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { normalizeString as normalizeStringInstance} from '../../../../common/utils/string-utils';
import { SensorHandlerService } from '../../../../common/services/sensor-handler.service';
import { SensorRequirementRos } from '../../../header/models/ros/sensor-requirement-ros';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DeleteSensorsService } from '../../../../common/services/delete-sensors.service';


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
  @ViewChild('cardFront') cardFront!: ElementRef<HTMLElement>;
  @ViewChild('cardBack') cardBack!: ElementRef<HTMLElement>;
  sensorStateEnum: typeof SensorState = SensorState;
  fetchingRequirements = true;
  deleteSensorsState = false;

  constructor(private _sensorHandlerService: SensorHandlerService, private _deleteSensorsService: DeleteSensorsService){}

  ngOnInit(): void {
    this._sensorHandlerService.fetchSensorRequirements(this.sensorName).then(() => {
      this.fetchingRequirements = false;
    });
    this._deleteSensorsService.addStateChangeListener(() => this.deleteSensorsState = !this.deleteSensorsState);
  }

  normalizeString = normalizeStringInstance

  readableSensorState(sensorStateValue: SensorState){
    let strSensorState = SensorState[sensorStateValue]
    return strSensorState.charAt(0) + strSensorState.slice(1).toLocaleLowerCase();
  }

  updateSensorStatus(updatedSensorStatus: SensorState){
    this.currentSensorState = updatedSensorStatus;
  }

  handleSensorDelete(){
    if(this.deleteSensorsState){
      this.deleteSensorEvent.emit(this.sensorName);
    }
  }

  displaySensorRequirements(){
    if(!this.fetchingRequirements){
      this._sensorHandlerService.displaySensorRequirements(this.sensorName);
    }
  }

  handleMouseEnter(){
    if(this.deleteSensorsState){
      this.cardFront.nativeElement.classList.add('delete-sensor');
    }
    else{
      this.cardFront.nativeElement.classList.add('rotate-front');
      this.cardBack.nativeElement.classList.add('rotate-back');
    }
  }

  handleMouseLeave(){
    if(this.deleteSensorsState){
      this.cardFront.nativeElement.classList.remove('delete-sensor');
    }
    else{
      this.cardFront.nativeElement.classList.remove('rotate-front');
      this.cardBack.nativeElement.classList.remove('rotate-back');
    }
  }
}
