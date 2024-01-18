import { Component, Input, OnInit } from '@angular/core';
import { NgxGaugeModule } from 'ngx-gauge';
import { NgxGaugeType } from 'ngx-gauge/gauge/gauge';


@Component({
  selector: 'app-gauge-chart',
  standalone: true,
  imports: [NgxGaugeModule],
  templateUrl: './gauge-chart.component.html',
  styleUrl: './gauge-chart.component.scss'
})
export class GaugeChartComponent {
  @Input("value") gaugeValue: number = 20;
  @Input("minValue") guageMinValue: number = 0;
  @Input("maxValue") guageMaxValue: number = 100;
  @Input() warnValue: number = 50;
  @Input() invalidValue: number = 70;
  
  gaugeType: NgxGaugeType = "arch" as NgxGaugeType;
  markerConfig =  {
    [this.guageMinValue.toString()]: { color: '#706f6f', size: 8, label: this.guageMinValue.toString(), type: 'triangle'},
    [this.warnValue.toString()]: { color: '#706f6f', size: 8, label: this.warnValue.toString(), type: 'triangle'},
    [this.invalidValue.toString()]: { color: '#706f6f', size: 8, label: this.invalidValue.toString(), type: 'triangle'},
    [this.guageMaxValue.toString()]: { color: '#706f6f', size: 8, label: this.guageMaxValue.toString(), type: 'triangle'}
  };

  thresholdConfig = {
    [this.guageMinValue.toString()]: {color: '#448c32', bgOpacity: 0.5},
    [this.warnValue.toString()]: {color: '#f5be44', bgOpacity: 0.5},
    [this.invalidValue.toString()]: {color: '#be342c', bgOpacity: 0.5}
  }
  


}
