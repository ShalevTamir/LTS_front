import { Component, EventEmitter, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ParameterCardComponent } from './components/parameter-card/parameter-card.component';
import { NgFor } from '@angular/common';
import { FilteredFrame } from '../../common/models/ros/filtered-frame.ros';
import { LiveParametersSocketService } from './services/live-parameters-socket.service';
import { TelemetryParameter } from '../../common/models/ros/telemetry-parameter.ros';
import { SensorAlertsService } from './services/sensor-alerts.service';
import { Router, RoutesRecognized } from '@angular/router';
import { ParametersConfigService } from './services/parameters-ranges.service';
import { ParameterRange } from './models/ros/parameter-range.ros';
import { GaugesDataPersistenceService } from './components/parameter-card/services/gauges-data-persistence.service';

@Component({
  selector: 'app-live-parameters',
  standalone: true,
  imports: [ParameterCardComponent, NgFor],
  templateUrl: './live-parameters.component.html',
  styleUrl: './live-parameters.component.scss',
})
export class LiveParametersComponent implements OnInit, OnDestroy{
  parameters: string[];  
  @ViewChildren(ParameterCardComponent) cards!: QueryList<ParameterCardComponent>;
  public title: string ="Live Telemetry Parameters";
  parametersNamesOptions: string[] = []
  constructor(
    private _liveParametersSocket: LiveParametersSocketService,
    private _sensorAlerts: SensorAlertsService,
    private _parametersConfigService: ParametersConfigService,
    private _gaugesDataService: GaugesDataPersistenceService) {
      this.parameters = ["Altitude","Longitude","Wind_Speed"];
    }
    ngOnDestroy(): void {
      this._liveParametersSocket.stopWebSocket();
      this._sensorAlerts.stopWebSocket();
    }
    
    ngOnInit(): void {
    this._parametersConfigService.getParameterNames().then((parameterNames: string[]) => this.parametersNamesOptions = parameterNames);
      this._liveParametersSocket.initWebSocket(this.parameters, this.updateAllCharts);
      this._sensorAlerts.init();
      this.configGauges(this.parameters);
  }
  
  handleAddParameter(parameterName: string){
    this.configGauges([parameterName]);
    this.parameters.push(parameterName);
  }

  configGauges(parametersNames: string[]){
    this._parametersConfigService.getRanges(parametersNames).then((parametersRanges: ParameterRange[]) =>{
      parametersRanges.forEach((parameterRange: ParameterRange) => {
        let card = this.cards.find((card) => card.parameterName == parameterRange.ParameterName);
        if (card !== undefined){
          this._gaugesDataService.saveGaugeData(
            card.parameterName,
            {minValue: +parameterRange.MinValue,
            maxValue: +parameterRange.MaxValue});
        }
        else{
          console.error("Couldn't find card for parameter range "+parameterRange.ParameterName);
        }
      });
    });
  }

  updateAllCharts = (filteredTeleFrame: FilteredFrame) => {
    console.log(filteredTeleFrame.Parameters);
    this.cards.forEach(card => {
      let cardTeleParameter: TelemetryParameter | undefined = 
        filteredTeleFrame.Parameters.find(parameter => parameter.Name == card.parameterName);
      if (cardTeleParameter !== undefined){
        let date = new Date(0);
        date.setMilliseconds(filteredTeleFrame.TimeStamp);
        card.updateChartValues(date.toLocaleTimeString(), cardTeleParameter.Value);
      }
    });
  
  }

   removeParameter(parameterName: string){
    this.parameters = this.parameters.filter((parameterNameOption) => parameterNameOption != parameterName)
   } 
}
