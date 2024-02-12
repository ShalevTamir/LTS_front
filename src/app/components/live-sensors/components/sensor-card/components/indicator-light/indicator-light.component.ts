import { Component, Input } from '@angular/core';
import { SensorState } from '../../../../../live-parameters/models/enums/sensor-state.enum';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-indicator-light',
  standalone: true,
  imports: [NgClass],
  templateUrl: './indicator-light.component.html',
  styleUrl: './indicator-light.component.scss'
})
export class IndicatorLightComponent {
  @Input({required: true}) sensorState!: SensorState;
  sensorStateEnum: typeof SensorState = SensorState;
  
}
