import { NgIf } from '@angular/common';
import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgxGaugeModule } from 'ngx-gauge';
import { NgxGaugeType } from 'ngx-gauge/gauge/gauge';
import { GaugesDataPersistenceService } from '../../services/gauges-data-persistence.service';
import { GaugeData } from '../../models/gauge-data';

@Component({
  selector: 'app-gauge-chart',
  standalone: true,
  imports: [NgxGaugeModule, NgIf],
  templateUrl: './gauge-chart.component.html',
  styleUrl: './gauge-chart.component.scss'
})
export class GaugeChartComponent implements AfterViewInit{
  @Input({required: true}) parameterName!: string
  @Input({alias: "value"}) gaugeValue: number | undefined;
  gaugeMinValue: number | undefined;
  gaugeMaxValue: number | undefined;
  units: string | undefined

  gaugeType: NgxGaugeType = "arch" as NgxGaugeType;  
  showContent: boolean = false;
  
  constructor(private _gaugesDataService: GaugesDataPersistenceService){}
  
  ngAfterViewInit(): void {
    this._gaugesDataService.getGaugeDataAsync(this.parameterName).then((gaugeData: GaugeData) => {
      this.gaugeMinValue = gaugeData.minValue;
      this.gaugeMaxValue = gaugeData.maxValue; 
      this.units = gaugeData.units;
    });
  }
  
  updateGaugeValue(updatedGaugeValue: number){
    this.gaugeValue = updatedGaugeValue;
    this.showContent = [this.gaugeMinValue, this.gaugeMaxValue, this.gaugeValue].every((value) => {
      return value !== undefined;
    });
  }

  
  // @Input() warnValue: number = 50;
  // @Input() invalidValue: number = 70;
  

  public defineMarkerConfig(){
    if(this.gaugeMinValue !== undefined && this.gaugeMaxValue !== undefined){
      return {
        [this.gaugeMinValue.toString()]: { color: '#706f6f', size: 8, label: this.gaugeMinValue.toString(), type: 'triangle'},
        // [this.warnValue.toString()]: { color: '#706f6f', size: 8, label: this.warnValue.toString(), type: 'triangle'},
        // [this.invalidValue.toString()]: { color: '#706f6f', size: 8, label: this.invalidValue.toString(), type: 'triangle'},
        [this.gaugeMaxValue.toString()]: { color: '#706f6f', size: 8, label: this.gaugeMaxValue.toString(), type: 'triangle'}
      }
    }
    return {};
  }

  // thresholdConfig = {
  //   [this.guageMinValue.toString()]: {color: '#448c32', bgOpacity: 0.5},
  //   [this.warnValue.toString()]: {color: '#f5be44', bgOpacity: 0.5},
  //   [this.invalidValue.toString()]: {color: '#be342c', bgOpacity: 0.5}
  // }
  


}
